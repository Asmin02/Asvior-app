import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Bookmark, Copy, Send, Share2, Sparkles, Square, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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
import { consumePendingAiPrompt, peekPendingAiPrompt, stashPendingAiPrompt } from "@/lib/ai-prompt";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/assistant")({
  validateSearch: (search: Record<string, unknown>): { q?: string } => ({
    q: typeof search.q === "string" && search.q ? search.q : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Asvior AI — ASVIOR" },
      {
        name: "description",
        content:
          "Chat with Asvior AI for instant visa, document, budget, weather, and travel guidance.",
      },
    ],
  }),
  component: AssistantPage,
});

const STORAGE_KEY = "vp_ai_chat_v1";

const CATEGORY_CHIPS = [
  { label: "Itinerary", prompt: "Plan a 7-day Kyoto trip under €2,000" },
  { label: "Visa check", prompt: "Do I need a visa for Morocco on a UK passport?" },
  { label: "Budget", prompt: "Estimate a 7-day budget for Lisbon, mid-range." },
  { label: "Documents", prompt: "What documents do I typically need for an international trip?" },
] as const;

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
  const suggestedSendTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoadingRef = useRef(false);
  const scrollSnapshotRef = useRef<MessageScrollSnapshot>({
    firstId: null,
    lastId: null,
    lastText: "",
    count: 0,
    status: "ready",
  });
  const isLoading = status === "submitted" || status === "streaming";
  isLoadingRef.current = isLoading;
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
      scrollToBottom(
        initialRestore || clearedConversation
          ? "auto"
          : isLoading && streamedContentChanged
            ? "auto"
            : "smooth",
      );
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
    if (!isLoading) {
      scrollToBottom("smooth");
    }
  }, [isLoading, scrollToBottom]);

  useEffect(() => {
    return () => {
      if (suggestedSendTimerRef.current) {
        clearTimeout(suggestedSendTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (showBookmarks) setBookmarks(loadBookmarks(authScope));
  }, [showBookmarks, authScope]);

  const cancelSuggestedSend = useCallback(() => {
    if (suggestedSendTimerRef.current) {
      clearTimeout(suggestedSendTimerRef.current);
      suggestedSendTimerRef.current = null;
    }
  }, []);

  const handleSend = useCallback(
    async (text: string, options?: { focusAfter?: boolean }) => {
      const value = text.trim();
      if (!value || isLoadingRef.current) return;
      cancelSuggestedSend();
      stickToBottomRef.current = true;
      setInput("");
      await sendMessage({ text: value });
      requestAnimationFrame(() => {
        scrollToBottom(isLoadingRef.current ? "auto" : "smooth");
        if (options?.focusAfter !== false) {
          inputRef.current?.focus();
        }
      });
    },
    [cancelSuggestedSend, scrollToBottom, sendMessage],
  );

  const handleSuggestedPick = useCallback(
    (text: string) => {
      const value = text.trim();
      if (!value || isLoadingRef.current) return;
      cancelSuggestedSend();
      inputRef.current?.blur();
      setInput(value);
      stickToBottomRef.current = true;
      suggestedSendTimerRef.current = setTimeout(() => {
        suggestedSendTimerRef.current = null;
        void handleSend(value, { focusAfter: false });
      }, 250);
    },
    [cancelSuggestedSend, handleSend],
  );

  const { q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const autoSendRef = useRef<{ token: string | null; sent: boolean }>({ token: null, sent: false });

  useEffect(() => {
    if (!authResolved) return;

    const pending = q?.trim() || peekPendingAiPrompt();
    if (!pending) return;

    const token = q?.trim() ? `q:${pending}` : `stash:${pending}`;
    if (autoSendRef.current.token === token && autoSendRef.current.sent) return;

    autoSendRef.current.token = token;

    if (q?.trim()) {
      stashPendingAiPrompt(pending);
      navigate({ search: {}, replace: true });
    }

    setInput(pending);
    stickToBottomRef.current = true;

    const timer = window.setTimeout(() => {
      autoSendRef.current.sent = true;
      consumePendingAiPrompt();
      void handleSend(pending, { focusAfter: false });
    }, 220);

    return () => window.clearTimeout(timer);
  }, [authResolved, q, navigate, handleSend]);

  useEffect(() => {
    return () => {
      autoSendRef.current = { token: null, sent: false };
    };
  }, []);

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

  const shareText = async (text: string) => {
    try {
      const shareNavigator = navigator as Navigator & {
        share?: (data: { title: string; text: string }) => Promise<void>;
      };
      if (shareNavigator.share) {
        await shareNavigator.share({ title: "Asvior AI", text });
        return;
      }
      await navigator.clipboard.writeText(text);
      toast.success("Response copied for sharing");
    } catch {
      toast.error("Couldn't share this response");
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

  const t = useT();
  const isEmpty = messages.length === 0;
  const lastIsUserOrSubmitted = status === "submitted";

  return (
    <div className="asv-app relative flex h-[calc(100dvh-var(--asv-tab-height)-env(safe-area-inset-bottom,0px))] max-h-[calc(100dvh-var(--asv-tab-height)-env(safe-area-inset-bottom,0px))] flex-col overflow-hidden">
      <header className="ai-chat-header relative shrink-0">
        <div className="relative flex items-center gap-3 px-[var(--asv-space-page)] pb-3 pt-[calc(var(--asv-safe-top)+10px)]">
          <div className="ai-chat-avatar !h-11 !w-11 shrink-0">
            <img src="/asvior-mark.png" alt="" className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="asv-title">{t("ai.title")}</h1>
            <p className="mt-0.5 flex items-center gap-1.5 text-[11px] font-semibold text-[var(--asv-success)]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--asv-success)] shadow-[0_0_0_3px_var(--asv-success-soft)]" />
              Online · travel intelligence
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              onClick={() => setShowBookmarks(true)}
              className="asv-btn asv-btn-icon !min-h-9 !min-w-9"
              aria-label="Bookmarks"
            >
              <Bookmark className="h-4 w-4" />
            </button>
            {messages.length > 0 && (
              <>
                <button
                  onClick={bookmarkConversation}
                  className="asv-btn asv-btn-ghost !min-h-9 px-2.5 text-xs"
                >
                  Save
                </button>
                <button onClick={clearChat} className="asv-btn asv-btn-ghost !min-h-9 px-2.5 text-xs">
                  New
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 scroll-smooth overflow-y-auto px-[var(--asv-space-page)] pb-[calc(9.5rem+env(safe-area-inset-bottom,0px))] pt-4"
      >
        {isEmpty ? (
          <EmptyState onPick={handleSuggestedPick} />
        ) : (
          <div className="space-y-5" data-chat-scroll-content>
            {messages.map((m) => (
              <MessageBubble
                key={m.id}
                message={m}
                onCopy={copyText}
                onShare={shareText}
                onSuggestionPick={handleSuggestedPick}
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

      <div className="pointer-events-none fixed bottom-[calc(var(--asv-tab-height)+env(safe-area-inset-bottom,0px)+8px)] left-1/2 z-30 w-full max-w-md -translate-x-1/2 px-[var(--asv-space-page)]">
        <div className="pointer-events-auto">
          {isEmpty && (
            <div className="scrollbar-hide mb-2.5 flex gap-2 overflow-x-auto pb-1">
              {CATEGORY_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => handleSuggestedPick(chip.prompt)}
                  className="asv-chip shrink-0 !cursor-pointer whitespace-nowrap transition-transform active:scale-95"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          )}

          <div className="ai-chat-input-shell flex items-center gap-2 px-3 py-2">
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
              placeholder={t("ai.placeholder")}
              className="max-h-32 min-h-[2.5rem] flex-1 resize-none bg-transparent px-1 py-2 text-sm text-[var(--asv-ink)] placeholder:text-[var(--asv-ink-tertiary)] focus:outline-none"
            />
            {isLoading ? (
              <button
                onClick={() => stop()}
                className="ai-chat-send-btn flex !h-10 !w-10 shrink-0 items-center justify-center !min-h-10 !min-w-10 !p-0 !bg-[var(--asv-danger)]"
                aria-label="Stop"
              >
                <Square className="h-3.5 w-3.5 fill-current" />
              </button>
            ) : (
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim()}
                className="ai-chat-send-btn flex !h-10 !w-10 shrink-0 items-center justify-center !min-h-10 !min-w-10 !p-0 disabled:opacity-40"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="mt-1.5 text-center text-[10px] text-[var(--asv-ink-tertiary)]">
            Always verify with official embassy or government sources.
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (prompt: string) => void }) {
  const t = useT();
  return (
    <div className="asv-animate-in pb-4">
      <div className="ai-empty-hero mb-6 mt-1 p-5">
        <div className="flex gap-3">
          <div className="ai-chat-avatar !h-10 !w-10 shrink-0">
            <img src="/asvior-mark.png" alt="" className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h2 className="asv-title">{t("ai.hello")}</h2>
            <p className="asv-subtitle mt-2 leading-relaxed">
              I&apos;m Asvior. Tell me where you&apos;re headed and I&apos;ll handle the visa rules,
              the daily budget and the day-by-day plan.
            </p>
            <p className="asv-subtitle mt-2 italic">
              You can also just say something like &ldquo;five days in Kyoto in November,
              mid-range&rdquo;.
            </p>
          </div>
        </div>
      </div>

      <p className="ai-suggestion-kicker mb-3">Try one of these</p>
      <div className="space-y-2">
        {SUGGESTIONS.slice(0, 4).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onPick(s)}
            className="ai-suggestion-card"
          >
            <Sparkles className="ai-suggestion-icon h-4 w-4" aria-hidden />
            <span className="min-w-0 flex-1">{s}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  onCopy,
  onShare,
  onSuggestionPick,
  isStreaming,
}: {
  message: UIMessage;
  onCopy: (text: string) => void;
  onShare: (text: string) => void;
  onSuggestionPick: (q: string) => void;
  isStreaming: boolean;
}) {
  const isUser = message.role === "user";
  const text = getText(message);
  const segments = useMemo(() => (isUser ? [] : parseSegments(text)), [isUser, text]);

  if (isUser) {
    return (
      <div className="animate-bubble-in flex justify-end">
        <div className="max-w-[85%] rounded-[var(--asv-radius-xl)] rounded-br-[var(--asv-radius-xs)] bg-gradient-to-br from-[#00a3ff] to-[#14b8a6] px-4 py-3 text-sm leading-relaxed text-white shadow-[var(--asv-shadow-md),0_4px_16px_var(--asv-primary-glow)]">
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
    <div className="animate-bubble-in flex gap-2.5">
      <div className="asv-tool-icon !h-9 !w-9 shrink-0">
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        {segments.length === 0 ||
        (segments.length === 1 && segments[0].kind === "text" && !segments[0].content.trim()) ? (
          <div className="asv-card asv-card-glass asv-card-pad rounded-[var(--asv-radius-xl)] rounded-tl-[var(--asv-radius-xs)] text-sm">
            <span className="text-[var(--asv-ink-tertiary)]">…</span>
          </div>
        ) : (
          segments.map((seg, i) => {
            if (seg.kind === "text") {
              const content = seg.content.trim();
              if (!content) return null;
              return (
                <div
                  key={i}
                  className="asv-card asv-card-glass asv-card-pad prose prose-sm max-w-none rounded-[var(--asv-radius-xl)] rounded-tl-[var(--asv-radius-xs)] text-sm text-[var(--asv-ink)] prose-headings:mt-2 prose-headings:mb-1 prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0 prose-a:text-[var(--asv-primary)] dark:prose-invert"
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
              className="asv-btn asv-btn-ghost !min-h-7 px-1.5 py-0.5 text-[10px] text-[var(--asv-ink-tertiary)]"
            >
              <Copy className="h-3 w-3" />
              Copy
            </button>
            <button
              onClick={() => onShare(textOnlyForCopy)}
              className="asv-btn asv-btn-ghost !min-h-7 px-1.5 py-0.5 text-[10px] text-[var(--asv-ink-tertiary)]"
            >
              <Share2 className="h-3 w-3" />
              Share
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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="asv-card relative max-h-[80vh] w-full overflow-y-auto rounded-t-[var(--asv-radius-xl)] p-5 sm:max-w-md sm:rounded-[var(--asv-radius-xl)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="asv-title">Saved conversations</h2>
          <button
            onClick={onClose}
            className="asv-btn asv-btn-icon !min-h-9 !min-w-9"
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
          <p className="py-10 text-center text-sm text-[var(--asv-ink-tertiary)]">
            No saved conversations yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {bookmarks.map((b) => (
              <li key={b.id} className="asv-card asv-card-pad">
                <div className="flex items-start gap-2">
                  <button onClick={() => onRestore(b)} className="flex-1 text-left">
                    <div className="line-clamp-1 text-sm font-semibold text-[var(--asv-ink)]">
                      {b.title}
                    </div>
                    <div className="mt-0.5 line-clamp-2 text-[11px] text-[var(--asv-ink-tertiary)]">
                      {b.preview}
                    </div>
                    <div className="mt-1 text-[10px] text-[var(--asv-ink-tertiary)]">
                      {new Date(b.createdAt).toLocaleString()}
                    </div>
                  </button>
                  <button
                    onClick={() => onDelete(b.id)}
                    className="asv-btn asv-btn-icon !min-h-9 !min-w-9 text-[var(--asv-ink-tertiary)] hover:!text-[var(--asv-danger)]"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
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
