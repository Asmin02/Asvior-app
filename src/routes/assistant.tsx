import { createFileRoute, Link } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Capacitor, CapacitorHttp } from "@capacitor/core";
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
      { name: "description", content: "Chat with Asvior AI for instant visa, document, budget, weather, and travel guidance." },
    ],
  }),
  component: AssistantPage,
});

const CHAT_HISTORY_LIMIT = 50;

const QUICK_ACTIONS = [
  { label: "Check Visa", icon: "🛂", prompt: "Help me check if I need a visa. Ask me my passport country and destination." },
  { label: "Required Documents", icon: "📄", prompt: "What documents do I typically need for an international trip? Walk me through a checklist." },
  { label: "Travel Checklist", icon: "✅", prompt: "Build me a smart pre-departure travel checklist." },
  { label: "Budget Planner", icon: "💰", prompt: "Help me estimate a realistic travel budget. Ask me destination, duration, and travel style." },
  { label: "Embassy Finder", icon: "🏛️", prompt: "How do I find the nearest embassy or consulate for a country I'm visiting?" },
  { label: "Travel Tips", icon: "🌍", prompt: "Give me your top 10 smart travel tips for international travelers." },
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
  // Assistant always starts fresh; previous conversations are available via history.
  return [];
}

function getText(message: UIMessage): string {
  if (!message.parts) return "";
  return message.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
}

function buildConversationSnapshot(messages: UIMessage[]): BookmarkedConversation | null {
  if (messages.length === 0) return null;
  const firstUser = messages.find((m) => m.role === "user");
  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
  if (!firstUser && !lastAssistant) return null;

  const title = firstUser ? getText(firstUser).slice(0, 60) : "Travel chat";
  const preview = lastAssistant ? getText(lastAssistant).replace(/```[\s\S]*?```/g, "").slice(0, 120) : "";
  return {
    id: `hist_${Date.now()}`,
    title,
    preview,
    createdAt: Date.now(),
    messages,
  };
}

function loadHistoryConversations(): BookmarkedConversation[] {
  return loadBookmarks().slice(0, CHAT_HISTORY_LIMIT);
}

const LOVABLE_CHAT_API = "https://asviorapp.lovable.app/api/chat";

function resolveChatApi(): string {
  const explicit = import.meta.env.VITE_ASVIOR_CHAT_API as string | undefined;
  if (explicit && explicit.trim()) return explicit.trim();

  // Native builds cannot serve local app routes like /api/chat.
  if (Capacitor.isNativePlatform()) return LOVABLE_CHAT_API;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  if (supabaseUrl && supabaseUrl.trim()) {
    return `${supabaseUrl.replace(/\/$/, "")}/functions/v1/asvior-chat`;
  }

  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID as string | undefined;
  if (projectId && projectId.trim()) {
    return `https://${projectId.trim()}.supabase.co/functions/v1/asvior-chat`;
  }

  // Web/SSR fallback for local development only.
  return "/api/chat";
}

function isSupabaseFunctionApi(url: string): boolean {
  return /\/functions\/v1\//.test(url);
}

function getSupabaseApiKey(): string | undefined {
  const publishable = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
  if (publishable && publishable.trim()) return publishable.trim();

  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (anon && anon.trim()) return anon.trim();

  return undefined;
}

async function nativeHttpFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
  const method = (init?.method ?? "GET").toUpperCase();
  const headersObj = Object.fromEntries(new Headers(init?.headers).entries());

  let data: unknown;
  if (typeof init?.body === "string") {
    try {
      data = JSON.parse(init.body);
    } catch {
      data = init.body;
    }
  }

  const result = await CapacitorHttp.request({
    url,
    method,
    headers: headersObj,
    data,
    responseType: "text",
  });

  const text = typeof result.data === "string" ? result.data : JSON.stringify(result.data ?? "");
  return new Response(text, {
    status: result.status,
    headers: result.headers as HeadersInit,
  });
}

function AssistantPage() {
  const [initialMessages] = useState<UIMessage[]>(() => loadInitialMessages());
  const chatSessionId = useMemo(() => `asvior-assistant-${Date.now()}`, []);
  const chatApi = useMemo(() => resolveChatApi(), []);
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: chatApi,
        fetch: async (input, init) => {
          const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
          const headers = new Headers(init?.headers);
          if (isSupabaseFunctionApi(url)) {
            const apiKey = getSupabaseApiKey();
            if (apiKey) {
              headers.set("apikey", apiKey);
              if (!headers.get("Authorization")) {
                headers.set("Authorization", `Bearer ${apiKey}`);
              }
            } else {
              console.error("[AI] Missing Supabase client key env (VITE_SUPABASE_PUBLISHABLE_KEY or VITE_SUPABASE_ANON_KEY)", { url });
            }
          }

          console.info("[AI] Sending chat request", {
            url,
            method: init?.method ?? "POST",
            hasApiKey: headers.has("apikey"),
            hasAuthorization: headers.has("Authorization"),
          });

          let response: Response;
          try {
            const requestInit: RequestInit = {
              ...init,
              headers,
            };

            if (Capacitor.isNativePlatform() && /^https?:\/\//.test(url)) {
              console.info("[AI] Using CapacitorHttp transport", { url, method: requestInit.method ?? "POST" });
              response = await nativeHttpFetch(input, requestInit);
            } else {
              response = await fetch(input, requestInit);
            }

            console.info("[AI] Chat request completed", {
              url,
              status: response.status,
              ok: response.ok,
            });
          } catch (error) {
            console.error("[AI] Chat request failed before response", { url, error });
            throw error;
          }

          if (!response.ok) {
            let body = "";
            try {
              body = await response.clone().text();
            } catch (error) {
              console.error("[AI] Failed reading error response body", { url, error });
            }
            console.error("[AI] Chat request returned non-OK status", {
              url,
              status: response.status,
              body,
            });
          }

          return response;
        },
      }),
    [chatApi],
  );

  const { messages, sendMessage, status, setMessages, stop, error, regenerate } = useChat({
    id: chatSessionId,
    messages: initialMessages,
    transport,
    onError: (e) => {
      console.error("[AI] useChat error", e);
      toast.error(e.message || "AI request failed");
    },
  });

  const [input, setInput] = useState("");
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkedConversation[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const latestMessagesRef = useRef<UIMessage[]>(initialMessages);
  const loggedAssistantCountRef = useRef(0);
  const isLoading = status === "submitted" || status === "streaming";

  const archiveConversation = useCallback((conversation: UIMessage[]) => {
    const snapshot = buildConversationSnapshot(conversation);
    if (!snapshot) return;
    saveBookmark(snapshot);
  }, []);

  useEffect(() => {
    console.info("[AI] Resolved chat API", {
      chatApi,
      usingSupabaseFunction: isSupabaseFunctionApi(chatApi),
      usingCapacitorNative: Capacitor.isNativePlatform(),
      hasSupabaseUrl: !!(import.meta.env.VITE_SUPABASE_URL as string | undefined),
      hasExplicitChatApi: !!(import.meta.env.VITE_ASVIOR_CHAT_API as string | undefined),
      hasSupabasePublishableKey: !!(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined),
      hasSupabaseAnonKey: !!(import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined),
    });
  }, [chatApi]);

  useEffect(() => {
    latestMessagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    // Ensure opening the assistant always starts a new live chat thread.
    setMessages([]);
  }, [setMessages]);

  useEffect(() => {
    if (showBookmarks) setBookmarks(loadHistoryConversations());
  }, [showBookmarks]);

  useEffect(() => {
    return () => {
      archiveConversation(latestMessagesRef.current);
    };
  }, [archiveConversation]);

  useEffect(() => {
    const assistantReplies = messages.filter((m) => m.role === "assistant");
    if (assistantReplies.length <= loggedAssistantCountRef.current) return;
    const latest = assistantReplies[assistantReplies.length - 1];
    console.info("[AI] Assistant response received", {
      responseCount: assistantReplies.length,
      length: getText(latest).length,
    });
    loggedAssistantCountRef.current = assistantReplies.length;
  }, [messages]);

  const handleSend = async (text: string) => {
    const value = text.trim();
    if (!value || isLoading) {
      console.info("[AI] Skipping send", {
        reason: !value ? "empty-input" : "already-loading",
      });
      return;
    }

    console.info("[AI] handleSend invoked", {
      length: value.length,
      chatApi,
      status,
    });

    setInput("");
    try {
      await sendMessage({ text: value });
      console.info("[AI] sendMessage completed");
    } catch (error) {
      console.error("[AI] sendMessage rejected", error);
      toast.error("Could not send message. Check logs for details.");
    }
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
    archiveConversation(messages);
    setMessages([]);
    toast.success("Started a new chat");
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
      toast.info("Send a message first to save it.");
      return;
    }
    const firstUser = messages.find((m) => m.role === "user");
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
    const title = firstUser ? getText(firstUser).slice(0, 60) : "Travel chat";
    const preview = lastAssistant ? getText(lastAssistant).replace(/```[\s\S]*?```/g, "").slice(0, 120) : "";
    saveBookmark({
      id: `bm_${Date.now()}`,
      title,
      preview,
      createdAt: Date.now(),
      messages,
    });
    toast.success("Conversation saved");
  };

  const restoreBookmark = (b: BookmarkedConversation) => {
    setMessages(b.messages as UIMessage[]);
    setShowBookmarks(false);
    toast.success("Conversation restored");
  };

  const deleteBookmark = (id: string) => {
    removeBookmark(id);
    setBookmarks(loadHistoryConversations());
  };

  const resizeComposer = () => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  };

  const isEmpty = messages.length === 0;
  const lastIsUserOrSubmitted = status === "submitted";

  return (
    <div className="relative flex min-h-dvh flex-col">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-travel-sky/40 via-background to-background dark:from-travel-blue/10" />
      <div className="pointer-events-none fixed -top-32 -right-20 -z-10 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
      <div className="pointer-events-none fixed top-40 -left-20 -z-10 h-72 w-72 rounded-full bg-travel-blue-light/40 blur-3xl" />

      <header className="sticky top-0 z-20 border-b border-white/20 bg-background/60 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Link to="/" aria-label="Back to home" className="flex h-9 w-9 items-center justify-center rounded-full bg-card/70 ring-1 ring-border">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
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
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
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
                New chat
              </button>
            </>
          )}
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain px-4 pb-40 pt-4 [-webkit-overflow-scrolling:touch]">
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
                isStreaming={isLoading && m.id === messages[messages.length - 1]?.id && m.role === "assistant"}
              />
            ))}
            {lastIsUserOrSubmitted && <PremiumSkeleton />}
            {error && !isLoading && (
              <ErrorRetry message={error.message} onRetry={() => regenerate()} />
            )}
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
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            </button>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                resizeComposer();
              }}
              onFocus={() => {
                resizeComposer();
                requestAnimationFrame(() => {
                  scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
                });
              }}
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
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
              </button>
            ) : (
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-travel-blue-dark text-primary-foreground shadow-lg shadow-primary/30 disabled:opacity-40"
                aria-label="Send"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
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
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.8 4.6L18 9.4l-4.2 1.8L12 15.8l-1.8-4.6L6 9.4l4.2-1.8L12 3z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14z" />
          </svg>
        </div>
        <h2 className="mt-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-2xl font-bold tracking-tight text-transparent">
          Hi! I'm Asvior AI ✈️
        </h2>
        <p className="mx-auto mt-1 max-w-xs text-sm leading-relaxed text-muted-foreground">
          Tell me your nationality and destination and I'll guide you through the visa process
          step by step.
        </p>
      </div>

      <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Quick actions</p>
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

      <p className="mb-2 mt-6 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Try asking</p>
      <div className="space-y-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="flex w-full items-center justify-between gap-2 rounded-xl bg-card/60 p-3 text-left text-sm ring-1 ring-border backdrop-blur-xl transition-colors hover:bg-accent"
          >
            <span className="line-clamp-2">{s}</span>
            <svg className="h-4 w-4 shrink-0 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

const MessageBubble = memo(function MessageBubble({
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
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.8 4.6L18 9.4l-4.2 1.8L12 15.8l-1.8-4.6L6 9.4l4.2-1.8L12 3z" />
        </svg>
      </div>
      <div className="flex-1 space-y-2">
        {segments.length === 0 || (segments.length === 1 && segments[0].kind === "text" && !segments[0].content.trim()) ? (
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
            if (seg.kind === "suggestions") return <SuggestedQuestions key={i} data={seg.data} onPick={onSuggestionPick} />;
            return null;
          })
        )}

        {!isStreaming && textOnlyForCopy && (
          <div className="ml-1 flex items-center gap-2">
            <button
              onClick={() => onCopy(textOnlyForCopy)}
              className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Copy
            </button>
            <RatingBar messageId={message.id} />
          </div>
        )}
      </div>
    </div>
  );
});

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      <div
        className="relative max-h-[80vh] w-full overflow-y-auto rounded-t-3xl border border-white/30 bg-card/95 p-4 shadow-2xl ring-1 ring-border backdrop-blur-2xl sm:max-w-md sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold">Chat History</h2>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-accent" aria-label="Close">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {bookmarks.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">No previous chats yet.</p>
        ) : (
          <ul className="space-y-2">
            {bookmarks.map((b) => (
              <li key={b.id} className="rounded-xl border border-border bg-background/60 p-3">
                <div className="flex items-start gap-2">
                  <button onClick={() => onRestore(b)} className="flex-1 text-left">
                    <div className="line-clamp-1 text-sm font-semibold">{b.title}</div>
                    <div className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">{b.preview}</div>
                    <div className="mt-1 text-[10px] text-muted-foreground">
                      {new Date(b.createdAt).toLocaleString()}
                    </div>
                  </button>
                  <button
                    onClick={() => onDelete(b.id)}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Delete"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
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
