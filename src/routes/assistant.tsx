import { createFileRoute, Link } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
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
      { title: "AI Travel Assistant — Asvior" },
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

const QUICK_ACTIONS = [
  {
    label: "Check Visa",
    icon: "🛂",
    prompt: "Help me check if I need a visa. Ask me my passport country and destination.",
  },
  {
    label: "Required Documents",
    icon: "📄",
    prompt:
      "What documents do I typically need for an international trip? Walk me through a checklist.",
  },
  {
    label: "Travel Checklist",
    icon: "✅",
    prompt: "Build me a smart pre-departure travel checklist.",
  },
  {
    label: "Budget Planner",
    icon: "💰",
    prompt:
      "Help me estimate a realistic travel budget. Ask me destination, duration, and travel style.",
  },
  {
    label: "Embassy Finder",
    icon: "🏛️",
    prompt: "How do I find the nearest embassy or consulate for a country I'm visiting?",
  },
  {
    label: "Travel Tips",
    icon: "🌍",
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

function loadInitialMessages(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
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
  const [initialMessages] = useState<UIMessage[]>(() => loadInitialMessages());
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);

  const { messages, sendMessage, status, setMessages, stop, error, regenerate } = useChat({
    id: "asvior-assistant",
    messages: initialMessages,
    transport,
    onError: (e) => toast.error(e.message || "AI request failed"),
  });

  const [input, setInput] = useState("");
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkedConversation[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
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

  const scrollToBottom = useCallback((behavior: ScrollBehavior) => {
    if (typeof window === "undefined") return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ block: "end", behavior });
        const node = scrollRef.current;
        if (node) {
          node.scrollTop = node.scrollHeight;
        }
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior,
        });
      });
    });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      void error;
    }
  }, [messages]);

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
      (initialRestore || clearedConversation || appendedMessage || streamedContentChanged || loadingStateChanged)
    ) {
      scrollToBottom(initialRestore || !isLoading ? "auto" : "smooth");
    }

    scrollSnapshotRef.current = next;
  }, [isLoading, lastMessage?.id, lastMessageText, messages, scrollToBottom, status]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isLoading) {
      const intervalId = window.setInterval(() => {
        scrollToBottom("auto");
      }, 120);

      return () => {
        window.clearInterval(intervalId);
      };
    }

    const settleId = window.setTimeout(() => {
      scrollToBottom("auto");
    }, 120);

    return () => {
      window.clearTimeout(settleId);
    };
  }, [isLoading, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (showBookmarks) setBookmarks(loadBookmarks());
  }, [showBookmarks]);

  const handleSend = async (text: string) => {
    const value = text.trim();
    if (!value || isLoading) return;
    setInput("");
    await sendMessage({ text: value });
    requestAnimationFrame(() => inputRef.current?.focus());
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
      localStorage.removeItem(STORAGE_KEY);
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
    saveBookmark({
      id: `bm_${Date.now()}`,
      title,
      preview,
      createdAt: Date.now(),
      messages,
    });
    toast.success("Conversation bookmarked");
  };

  const restoreBookmark = (b: BookmarkedConversation) => {
    setMessages(b.messages as UIMessage[]);
    setShowBookmarks(false);
    toast.success("Conversation restored");
  };

  const deleteBookmark = (id: string) => {
    removeBookmark(id);
    setBookmarks(loadBookmarks());
  };

  const isEmpty = messages.length === 0;
  const lastIsUserOrSubmitted = status === "submitted";

  return (
    <div className="relative flex h-dvh max-h-dvh flex-col overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-travel-sky/40 via-background to-background dark:from-travel-blue/10" />
      <div className="pointer-events-none fixed -top-32 -right-20 -z-10 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
      <div className="pointer-events-none fixed top-40 -left-20 -z-10 h-72 w-72 rounded-full bg-travel-blue-light/40 blur-3xl" />

      <header className="sticky top-0 z-20 border-b border-white/20 bg-background/60 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            aria-label="Back to home"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-card/70 ring-1 ring-border"
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
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <h1 className="text-base font-semibold tracking-tight">Asvior AI</h1>
            </div>
            <p className="text-[11px] text-muted-foreground">Your premium travel concierge</p>
          </div>
          <button
            onClick={() => setShowBookmarks(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-card/70 ring-1 ring-border hover:bg-accent"
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
                className="rounded-full bg-card/70 px-2.5 py-1.5 text-[11px] font-medium ring-1 ring-border hover:bg-accent"
              >
                Save
              </button>
              <button
                onClick={clearChat}
                className="rounded-full bg-card/70 px-2.5 py-1.5 text-[11px] font-medium ring-1 ring-border hover:bg-accent"
              >
                New
              </button>
            </>
          )}
        </div>
      </header>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 pb-40 pt-4">
        {isEmpty ? (
          <EmptyState onPick={(p) => handleSend(p)} />
        ) : (
          <div className="space-y-4">
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

      <div className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] left-1/2 z-30 w-full max-w-md -translate-x-1/2 px-3">
        <div className="rounded-2xl border border-white/30 bg-background/80 p-2 shadow-2xl shadow-primary/10 ring-1 ring-border backdrop-blur-2xl">
          <div className="flex items-end gap-2">
            <button
              onClick={handleVoice}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground hover:bg-accent/80"
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
              className="max-h-32 flex-1 resize-none bg-transparent px-2 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            {isLoading ? (
              <button
                onClick={() => stop()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive text-destructive-foreground"
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
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-travel-blue-dark text-primary-foreground shadow-lg shadow-primary/30 disabled:opacity-40"
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
    <div className="animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
      <div className="mb-6 mt-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-primary via-travel-blue to-travel-blue-dark text-primary-foreground shadow-xl shadow-primary/40">
          <svg
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3l1.8 4.6L18 9.4l-4.2 1.8L12 15.8l-1.8-4.6L6 9.4l4.2-1.8L12 3z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14z"
            />
          </svg>
        </div>
        <h2 className="mt-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-2xl font-bold tracking-tight text-transparent">
          Hi! I'm Asvior AI ✈️
        </h2>
        <p className="mx-auto mt-1 max-w-xs text-sm leading-relaxed text-muted-foreground">
          Tell me your nationality and destination and I'll guide you through the visa process step
          by step.
        </p>
      </div>

      <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Quick actions
      </p>
      <div className="grid grid-cols-2 gap-2">
        {QUICK_ACTIONS.map((a) => (
          <button
            key={a.label}
            onClick={() => onPick(a.prompt)}
            className="group flex items-center gap-2 rounded-2xl border border-white/30 bg-card/60 p-3 text-left shadow-sm ring-1 ring-border backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="text-xl">{a.icon}</span>
            <span className="text-xs font-semibold leading-tight">{a.label}</span>
          </button>
        ))}
      </div>

      <p className="mb-2 mt-6 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Try asking
      </p>
      <div className="space-y-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="flex w-full items-center justify-between gap-2 rounded-xl bg-card/60 p-3 text-left text-sm ring-1 ring-border backdrop-blur-xl transition-colors hover:bg-accent"
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
      <div className="flex justify-end animate-bubble-in">
        <div className="max-w-[85%] rounded-3xl rounded-tr-md bg-gradient-to-br from-primary to-royal-deep px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-float">
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
    <div className="flex gap-2 animate-bubble-in">
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl gradient-primary text-primary-foreground shadow-float">
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3l1.8 4.6L18 9.4l-4.2 1.8L12 15.8l-1.8-4.6L6 9.4l4.2-1.8L12 3z"
          />
        </svg>
      </div>
      <div className="flex-1 space-y-2">
        {segments.length === 0 ||
        (segments.length === 1 && segments[0].kind === "text" && !segments[0].content.trim()) ? (
          <div className="rounded-2xl rounded-tl-md border border-white/30 bg-card/70 px-4 py-3 text-sm ring-1 ring-border backdrop-blur-xl">
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
                  className="prose prose-sm max-w-none rounded-2xl rounded-tl-md border border-white/30 bg-card/70 px-4 py-3 text-sm text-card-foreground shadow-sm ring-1 ring-border backdrop-blur-xl prose-headings:mt-2 prose-headings:mb-1 prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0 prose-a:text-primary dark:prose-invert"
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
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      <div
        className="relative max-h-[80vh] w-full overflow-y-auto rounded-t-3xl border border-white/30 bg-card/95 p-4 shadow-2xl ring-1 ring-border backdrop-blur-2xl sm:max-w-md sm:rounded-3xl"
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
              <li key={b.id} className="rounded-xl border border-border bg-background/60 p-3">
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
