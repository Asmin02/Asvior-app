import { createFileRoute, Link } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { BadgeCheck, FileText, Landmark, ListChecks, Globe2, Wallet } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AsviorMark } from "@/components/AsviorMark";
import { resolveApiUrl } from "@/lib/api-base";
import { buildScopedStorageKey, GUEST_STORAGE_SCOPE } from "@/lib/app-session";
import {
  BudgetCard,
  DocChecklistCard,
  ErrorRetry,
  PremiumSkeleton,
  RatingBar,
  SuggestedQuestions,
  VisaSummaryCard,
  loadBookmarks,
  parseSegments,
  removeBookmark,
  saveBookmark,
  type BookmarkedConversation,
} from "@/components/ai-cards";

export const Route = createFileRoute("/assistant")({
  validateSearch: (search: Record<string, unknown>): { q?: string } => ({
    q: typeof search.q === "string" && search.q ? search.q : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Concierge Assistant — ASVIOR" },
      {
        name: "description",
        content:
          "Chat with the ASVIOR concierge assistant for instant visa, document, budget, weather, and travel guidance.",
      },
    ],
  }),
  component: AssistantPage,
});

const STORAGE_KEY = "vp_ai_chat_v1";

const QUICK_ACTIONS = [
  {
    label: "Check Visa",
    icon: BadgeCheck,
    prompt: "Help me check if I need a visa. Ask me my passport country and destination.",
  },
  {
    label: "Required Documents",
    icon: FileText,
    prompt:
      "What documents do I typically need for an international trip? Walk me through a checklist.",
  },
  {
    label: "Travel Checklist",
    icon: ListChecks,
    prompt: "Build me a smart pre-departure travel checklist.",
  },
  {
    label: "Budget Planner",
    icon: Wallet,
    prompt:
      "Help me estimate a realistic travel budget. Ask me destination, duration, and travel style.",
  },
  {
    label: "Embassy Finder",
    icon: Landmark,
    prompt: "How do I find the nearest embassy or consulate for a country I'm visiting?",
  },
  {
    label: "Travel Tips",
    icon: Globe2,
    prompt: "Give me your top 10 smart travel tips for international travelers.",
  },
];

const SUGGESTIONS = [
  "Do I need a visa for Japan with a US passport?",
  "What's the passport validity rule for Schengen countries?",
  "Best season to visit Bali and what to pack?",
  "Estimate a 7-day budget for Lisbon, mid-range.",
  "What currency and tipping etiquette in Thailand?",
  "Safety tips for solo travel in South America.",
];

function loadMessagesForScope(scope: string, persist: boolean): UIMessage[] {
  if (typeof window === "undefined") return [];
  if (!persist) return [];
  try {
    const raw = localStorage.getItem(buildScopedStorageKey(STORAGE_KEY, scope));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getText(message: UIMessage): string {
  if (!message.parts) return "";
  return message.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
}

type MessageScrollSnapshot = {
  firstId: string | null;
  lastId: string | null;
  lastText: string;
  count: number;
  status: string;
};

function AssistantPage() {
  const [authScope, setAuthScope] = useState<string>(GUEST_STORAGE_SCOPE);
  const [authResolved, setAuthResolved] = useState(false);
  const transport = useMemo(
    () => new DefaultChatTransport({ api: resolveApiUrl("/api/chat") }),
    [],
  );
  const isSignedIn = authScope !== GUEST_STORAGE_SCOPE;
  const storageKey = useMemo(() => buildScopedStorageKey(STORAGE_KEY, authScope), [authScope]);

  const { messages, sendMessage, status, setMessages, stop, error, regenerate } = useChat({
    id: `asvior-assistant-${authScope}`,
    messages: [],
    transport,
    onError: (e) => toast.error(e.message || "AI request failed"),
  });

  const [input, setInput] = useState("");
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkedConversation[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const stickToBottomRef = useRef(true);
  const scrollSnapshotRef = useRef<MessageScrollSnapshot>({
    firstId: null,
    lastId: null,
    lastText: "",
    count: 0,
    status: "ready",
  });
  const isLoading = status === "submitted" || status === "streaming";
  const lastMessage = messages[messages.length - 1];
  const lastMessageText = lastMessage ? getText(lastMessage) : "";

  useEffect(() => {
    let cancelled = false;

    const resolveScope = async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      setAuthScope(data.session?.user?.id || GUEST_STORAGE_SCOPE);
      setAuthResolved(true);
    };

    void resolveScope();

    const { data: authSub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      setAuthScope(session?.user?.id || GUEST_STORAGE_SCOPE);
      setAuthResolved(true);
    });

    return () => {
      cancelled = true;
      authSub.subscription.unsubscribe();
    };
  }, []);

  const SCROLL_PIN_THRESHOLD = 64;

  const isNearBottom = useCallback((node: HTMLDivElement) => {
    return node.scrollHeight - node.scrollTop - node.clientHeight <= SCROLL_PIN_THRESHOLD;
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
    const node = scrollRef.current;
    if (!node || !stickToBottomRef.current) return;

    node.scrollTo({ top: node.scrollHeight, behavior });
  }, []);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    const handleScroll = () => {
      stickToBottomRef.current = isNearBottom(node);
    };

    node.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      node.removeEventListener("scroll", handleScroll);
    };
  }, [isNearBottom]);

  useEffect(() => {
    if (!authResolved) return;
    setMessages(loadMessagesForScope(authScope, isSignedIn));
  }, [authResolved, authScope, isSignedIn, setMessages]);

  useEffect(() => {
    if (!authResolved || !isSignedIn) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (error) {
      void error;
    }
  }, [authResolved, isSignedIn, messages, storageKey]);

  useLayoutEffect(() => {
    const previous = scrollSnapshotRef.current;
    const next: MessageScrollSnapshot = {
      firstId: messages[0]?.id ?? null,
      lastId: lastMessage?.id ?? null,
      lastText: lastMessageText,
      count: messages.length,
      status,
    };

    const initialRestore = previous.count === 0 && next.count > 0;
    const clearedConversation = previous.count > 0 && next.count === 0;
    const prependedHistory =
      previous.count > 0 &&
      next.count > previous.count &&
      previous.lastId === next.lastId &&
      previous.firstId !== next.firstId;
    const appendedMessage = previous.lastId !== next.lastId || next.count < previous.count;
    const streamedContentChanged = previous.lastText !== next.lastText;
    const loadingStateChanged =
      previous.status !== next.status &&
      (next.status === "submitted" ||
        next.status === "streaming" ||
        previous.status === "streaming");

    if (
      !prependedHistory &&
      stickToBottomRef.current &&
      (initialRestore ||
        clearedConversation ||
        appendedMessage ||
        streamedContentChanged ||
        loadingStateChanged)
    ) {
      if (initialRestore || clearedConversation) {
        stickToBottomRef.current = true;
      }
      scrollToBottom(initialRestore || !isLoading ? "auto" : "auto");
    }

    scrollSnapshotRef.current = next;
  }, [isLoading, lastMessage?.id, lastMessageText, messages, scrollToBottom, status]);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node || !isLoading) return;

    const content = node.querySelector<HTMLElement>("[data-chat-scroll-content]");
    if (!content) return;

    const followStream = () => {
      if (stickToBottomRef.current) {
        node.scrollTop = node.scrollHeight;
      }
    };

    const ro = new ResizeObserver(followStream);
    ro.observe(content);
    followStream();

    return () => {
      ro.disconnect();
    };
  }, [isLoading, messages.length]);

  useEffect(() => {
    if (!isLoading) return;

    const settleId = window.setTimeout(() => {
      scrollToBottom("auto");
    }, 120);

    return () => {
      window.clearTimeout(settleId);
    };
  }, [isLoading, scrollToBottom, lastMessageText]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (showBookmarks) setBookmarks(loadBookmarks(authScope));
  }, [showBookmarks, authScope]);

  const handleSend = async (text: string) => {
    const value = text.trim();
    if (!value || isLoading) return;
    stickToBottomRef.current = true;
    setInput("");
    await sendMessage({ text: value });
    requestAnimationFrame(() => {
      scrollToBottom("auto");
      inputRef.current?.focus();
    });
  };

  const { q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const autoAskedRef = useRef(false);
  useEffect(() => {
    if (q && !autoAskedRef.current) {
      autoAskedRef.current = true;
      navigate({ search: {}, replace: true });
      handleSend(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const handleVoice = () => {
    toast.info("Voice input coming soon — type your question for now.");
  };

  const clearChat = () => {
    setMessages([]);
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      void error;
    }
    toast.success("Chat cleared");
  };

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Couldn't copy");
    }
  };

  const bookmarkConversation = () => {
    if (messages.length === 0) {
      toast.info("Send a message first to bookmark it.");
      return;
    }
    const firstUser = messages.find((m) => m.role === "user");
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
    const title = firstUser ? getText(firstUser).slice(0, 60) : "Travel chat";
    const preview = lastAssistant
      ? getText(lastAssistant)
          .replace(/```[\s\S]*?```/g, "")
          .slice(0, 120)
      : "";
    saveBookmark(
      {
        id: `bm_${Date.now()}`,
        title,
        preview,
        createdAt: Date.now(),
        messages,
      },
      authScope,
    );
    toast.success("Conversation bookmarked");
  };

  const restoreBookmark = (b: BookmarkedConversation) => {
    setMessages(b.messages as UIMessage[]);
    setShowBookmarks(false);
    toast.success("Conversation restored");
  };

  const deleteBookmark = (id: string) => {
    removeBookmark(id, authScope);
    setBookmarks(loadBookmarks(authScope));
  };

  const isEmpty = messages.length === 0;
  const lastIsUserOrSubmitted = status === "submitted";

  return (
    <div className="relative flex h-[calc(100dvh-6rem-env(safe-area-inset-bottom,0px))] flex-col overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-72 bg-[radial-gradient(70%_100%_at_50%_0%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent)]"
      />
      <header className="sticky top-0 z-20 border-b border-border/50 bg-card/80 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            aria-label="Back to home"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-background/70 backdrop-blur-md transition-transform active:scale-95"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl grad-ink elev-2">
              <AsviorMark className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold tracking-[-0.01em] text-foreground">
                Asvior AI
              </h1>
              <p className="truncate text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                Premium travel concierge
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowBookmarks(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-background/70 backdrop-blur-md transition-transform active:scale-95"
            aria-label="Bookmarks"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
              />
            </svg>
          </button>
          {messages.length > 0 && (
            <>
              <button
                onClick={bookmarkConversation}
                className="rounded-full border border-border/60 bg-background/70 px-3 py-1.5 text-xs font-semibold text-foreground transition-transform active:scale-95"
              >
                Save
              </button>
              <button
                onClick={clearChat}
                className="rounded-full border border-border/60 bg-background/70 px-3 py-1.5 text-xs font-semibold text-foreground transition-transform active:scale-95"
              >
                New
              </button>
            </>
          )}
        </div>
      </header>

      <div ref={scrollRef} className="scroll-fluid min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-5">
        {isEmpty ? (
          <EmptyState onPick={(p) => handleSend(p)} />
        ) : (
          <div className="space-y-4" data-chat-scroll-content>
            {messages.map((m) => (
              <MessageBubble
                key={m.id}
                message={m}
                onCopy={copyText}
                onSuggestionPick={(q) => handleSend(q)}
                isStreaming={
                  isLoading && m.id === messages[messages.length - 1]?.id && m.role === "assistant"
                }
              />
            ))}
            {lastIsUserOrSubmitted && <PremiumSkeleton />}
            {error && !isLoading && (
              <ErrorRetry message={error.message} onRetry={() => regenerate()} />
            )}
            <div ref={bottomRef} aria-hidden className="h-px" />
          </div>
        )}
      </div>

      {showBookmarks && (
        <BookmarksSheet
          bookmarks={bookmarks}
          onClose={() => setShowBookmarks(false)}
          onRestore={restoreBookmark}
          onDelete={deleteBookmark}
        />
      )}

      <div className="relative z-30 shrink-0 px-3 pb-2">
        <div className="rounded-3xl border border-border/50 bg-card/80 p-2 elev-4 backdrop-blur-xl">
          <div className="flex items-end gap-2">
            <button
              onClick={handleVoice}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-navy transition-transform active:scale-95"
              aria-label="Voice input"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                />
              </svg>
            </button>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(input);
                }
              }}
              rows={1}
              placeholder="Ask anything about your trip..."
              className="max-h-32 min-h-[2.75rem] flex-1 resize-none bg-transparent px-2 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            {isLoading ? (
              <button
                onClick={() => stop()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-destructive text-destructive-foreground transition-transform active:scale-95"
                aria-label="Stop"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl grad-ink text-primary-foreground transition-transform active:scale-95 disabled:opacity-40"
                aria-label="Send"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
        <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
          Always verify with official embassy or government sources.
        </p>
      </div>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <div className="animate-fade-in">
      <div className="relative mb-7 mt-2 overflow-hidden rounded-3xl grad-ink px-6 py-8 text-center elev-3">
        <span className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-aurora/25 blur-2xl" />
        <span className="pointer-events-none absolute -bottom-12 -left-6 h-32 w-32 rounded-full bg-gold/20 blur-2xl" />
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md">
          <AsviorMark className="h-10 w-10" />
        </div>
        <p className="relative mt-4 text-eyebrow text-white/60">Asvior AI</p>
        <h2 className="relative mt-1.5 text-[1.6rem] font-semibold tracking-[-0.03em] text-primary-foreground">
          Hi, I&apos;m your travel concierge
        </h2>
        <p className="relative mx-auto mt-2 max-w-xs text-sm leading-relaxed text-primary-foreground/70">
          Tell me your nationality and destination — I&apos;ll guide you through visas, documents,
          and trip planning.
        </p>
      </div>

      <p className="mb-2 text-eyebrow text-muted-foreground">Quick actions</p>
      <div className="grid grid-cols-2 gap-2.5">
        {QUICK_ACTIONS.map((a, i) => {
          const Icon = a.icon;
          return (
            <button
              key={a.label}
              onClick={() => onPick(a.prompt)}
              style={{ animationDelay: `${i * 40}ms` }}
              className="premium-card flex animate-fade-in items-center gap-2.5 rounded-2xl p-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-4 w-4" strokeWidth={1.9} />
              </span>
              <span className="text-xs font-semibold leading-tight text-foreground">{a.label}</span>
            </button>
          );
        })}
      </div>

      <p className="mb-2 mt-6 text-eyebrow text-muted-foreground">Try asking</p>
      <div className="space-y-2">
        {SUGGESTIONS.map((s, i) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            style={{ animationDelay: `${i * 40}ms` }}
            className="premium-card flex w-full animate-fade-in items-center justify-between gap-2 rounded-2xl p-3.5 text-left text-sm text-foreground transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
          >
            <span className="line-clamp-2">{s}</span>
            <svg
              className="h-4 w-4 shrink-0 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  onCopy,
  onSuggestionPick,
  isStreaming,
}: {
  message: UIMessage;
  onCopy: (text: string) => void;
  onSuggestionPick: (q: string) => void;
  isStreaming: boolean;
}) {
  const isUser = message.role === "user";
  const text = getText(message);
  const segments = useMemo(() => (isUser ? [] : parseSegments(text)), [isUser, text]);

  if (isUser) {
    return (
      <div className="animate-msg-in flex justify-end">
        <div className="max-w-[85%] rounded-3xl rounded-tr-md bg-primary px-4 py-3 text-sm leading-relaxed text-primary-foreground elev-2">
          {text}
        </div>
      </div>
    );
  }

  const textOnlyForCopy = segments
    .filter((s) => s.kind === "text")
    .map((s) => (s.kind === "text" ? s.content : ""))
    .join("\n")
    .trim();

  return (
    <div className="animate-msg-in flex gap-2.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl grad-ink elev-1">
        <AsviorMark className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        {segments.length === 0 ||
        (segments.length === 1 && segments[0].kind === "text" && !segments[0].content.trim()) ? (
          <div className="px-1 py-2 text-sm">
            <span className="text-muted-foreground">…</span>
          </div>
        ) : (
          segments.map((seg, i) => {
            if (seg.kind === "text") {
              const content = seg.content.trim();
              if (!content) return null;
              return (
                <div
                  key={i}
                  className="prose prose-sm max-w-none px-1 py-1 text-sm leading-relaxed text-foreground prose-headings:mt-2 prose-headings:mb-1 prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0 prose-a:text-primary dark:prose-invert"
                >
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              );
            }
            if (seg.kind === "visa") return <VisaSummaryCard key={i} data={seg.data} />;
            if (seg.kind === "checklist") return <DocChecklistCard key={i} data={seg.data} />;
            if (seg.kind === "budget") return <BudgetCard key={i} data={seg.data} />;
            if (seg.kind === "suggestions")
              return <SuggestedQuestions key={i} data={seg.data} onPick={onSuggestionPick} />;
            return null;
          })
        )}

        {!isStreaming && textOnlyForCopy && (
          <div className="ml-1 flex items-center gap-2">
            <button
              onClick={() => onCopy(textOnlyForCopy)}
              className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <svg
                className="h-3 w-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Copy
            </button>
            <RatingBar messageId={message.id} />
          </div>
        )}
      </div>
    </div>
  );
}

function BookmarksSheet({
  bookmarks,
  onClose,
  onRestore,
  onDelete,
}: {
  bookmarks: BookmarkedConversation[];
  onClose: () => void;
  onRestore: (b: BookmarkedConversation) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-background/50" />
      <div
        className="premium-card scroll-fluid relative max-h-[80vh] w-full overflow-y-auto rounded-t-3xl p-4 sm:max-w-md sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold">Saved conversations</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-accent"
            aria-label="Close"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {bookmarks.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No saved conversations yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {bookmarks.map((b) => (
              <li key={b.id} className="premium-card rounded-2xl p-3">
                <div className="flex items-start gap-2">
                  <button onClick={() => onRestore(b)} className="flex-1 text-left">
                    <div className="line-clamp-1 text-sm font-semibold">{b.title}</div>
                    <div className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">
                      {b.preview}
                    </div>
                    <div className="mt-1 text-[10px] text-muted-foreground">
                      {new Date(b.createdAt).toLocaleString()}
                    </div>
                  </button>
                  <button
                    onClick={() => onDelete(b.id)}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Delete"
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
