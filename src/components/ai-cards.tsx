import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { buildScopedStorageKey, GUEST_STORAGE_SCOPE } from "@/lib/app-session";

// ---------- Types ----------
export type VisaCardData = {
  passport?: string;
  destination?: string;
  required?: boolean;
  status?: string; // e.g. "Visa Free", "eVisa", "Visa Required"
  maxStay?: string;
  processingTime?: string;
  fee?: string;
  officialUrl?: string;
  lastUpdated?: string;
  notes?: string;
};

export type DocChecklistData = {
  id?: string;
  title?: string;
  items: string[];
};

export type BudgetCardData = {
  destination?: string;
  currency?: string; // local
  baseCurrency?: string; // user currency, default USD
  rate?: number; // baseCurrency -> currency multiplier (1 base = rate local)
  tiers: {
    budget?: number; // per day in local currency
    standard?: number;
    luxury?: number;
  };
  notes?: string;
};

export type SuggestionsData = { questions: string[] };

// ---------- Parser ----------
// Splits markdown into ordered segments: text or card blocks.
// Cards are fenced code blocks with language: visa-card | doc-checklist | budget-card | suggestions
export type Segment =
  | { kind: "text"; content: string }
  | { kind: "visa"; data: VisaCardData }
  | { kind: "checklist"; data: DocChecklistData }
  | { kind: "budget"; data: BudgetCardData }
  | { kind: "suggestions"; data: SuggestionsData };

const CARD_LANGS = ["visa-card", "doc-checklist", "budget-card", "suggestions"] as const;
const FENCE_RE = /```(visa-card|doc-checklist|budget-card|suggestions)\s*\n([\s\S]*?)```/g;

export function parseSegments(markdown: string): Segment[] {
  const segments: Segment[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  FENCE_RE.lastIndex = 0;
  while ((m = FENCE_RE.exec(markdown)) !== null) {
    const [full, lang, body] = m;
    if (m.index > lastIndex) {
      segments.push({ kind: "text", content: markdown.slice(lastIndex, m.index) });
    }
    try {
      const data = JSON.parse(body.trim());
      if (lang === "visa-card") segments.push({ kind: "visa", data });
      else if (lang === "doc-checklist") segments.push({ kind: "checklist", data });
      else if (lang === "budget-card") segments.push({ kind: "budget", data });
      else if (lang === "suggestions") segments.push({ kind: "suggestions", data });
    } catch {
      // fall back to raw text if JSON invalid
      segments.push({ kind: "text", content: full });
    }
    lastIndex = m.index + full.length;
  }
  if (lastIndex < markdown.length) {
    segments.push({ kind: "text", content: markdown.slice(lastIndex) });
  }
  return segments;
}

export function hasAnyCardFence(markdown: string): boolean {
  return CARD_LANGS.some((l) => markdown.includes("```" + l));
}

// ---------- Visa Summary Card ----------
export function VisaSummaryCard({ data }: { data: VisaCardData }) {
  const statusColor = data.required
    ? "from-amber-500/20 to-orange-500/10 text-amber-700 dark:text-amber-300 ring-amber-500/30"
    : "from-emerald-500/20 to-teal-500/10 text-emerald-700 dark:text-emerald-300 ring-emerald-500/30";

  return (
    <div className="premium-card overflow-hidden rounded-[1.5rem] animate-bubble-in">
      <div className="flex items-center gap-2 border-b border-champagne/12 bg-gradient-to-r from-primary/10 to-champagne/8 px-4 py-2.5">
        <span className="text-lg">🛂</span>
        <h3 className="text-sm font-semibold tracking-tight">Visa Summary</h3>
        {data.passport && data.destination && (
          <span className="ml-auto text-[10px] font-medium text-muted-foreground">
            {data.passport} → {data.destination}
          </span>
        )}
      </div>
      <div className="space-y-3 p-4">
        <div
          className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold ring-1 ${statusColor}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {data.status || (data.required ? "Visa Required" : "Visa Free")}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <InfoTile icon="⏱️" label="Max stay" value={data.maxStay} />
          <InfoTile icon="📅" label="Processing" value={data.processingTime} />
          <InfoTile icon="💵" label="Official fee" value={data.fee} />
          <InfoTile icon="🔄" label="Updated" value={data.lastUpdated} />
        </div>

        {data.notes && (
          <p className="rounded-lg bg-muted/50 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
            {data.notes}
          </p>
        )}

        {data.officialUrl && (
          <a
            href={data.officialUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center justify-center gap-2 rounded-2xl premium-button px-4 py-2.5 text-xs font-semibold shadow-float transition-transform active:scale-[0.98]"
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
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
            Official immigration site
          </a>
        )}
      </div>
    </div>
  );
}

function InfoTile({ icon, label, value }: { icon: string; label: string; value?: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-2.5">
      <div className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        <span>{icon}</span> {label}
      </div>
      <div className="mt-0.5 text-sm font-semibold text-foreground">{value || "—"}</div>
    </div>
  );
}

// ---------- Document Checklist Card ----------
const CHECKLIST_STORAGE = "vp_ai_doc_checklists_v1";

function loadAllChecklists(): Record<string, string[]> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(CHECKLIST_STORAGE) || "{}");
  } catch (error) {
    void error;
    return {};
  }
}
function saveAllChecklists(v: Record<string, string[]>) {
  try {
    localStorage.setItem(CHECKLIST_STORAGE, JSON.stringify(v));
  } catch (error) {
    void error;
  }
}

export function DocChecklistCard({ data }: { data: DocChecklistData }) {
  const id =
    data.id ||
    `cl_${(data.title || "list").toLowerCase().replace(/\s+/g, "_")}_${data.items.length}`;
  const [checked, setChecked] = useState<Set<string>>(new Set());

  useEffect(() => {
    const all = loadAllChecklists();
    setChecked(new Set(all[id] || []));
  }, [id]);

  const toggle = (item: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      const all = loadAllChecklists();
      all[id] = Array.from(next);
      saveAllChecklists(all);
      return next;
    });
  };

  const total = data.items.length;
  const done = checked.size;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="premium-card overflow-hidden rounded-[1.5rem] animate-bubble-in">
      <div className="flex items-center gap-2 border-b border-champagne/12 bg-gradient-to-r from-emerald/10 to-champagne/8 px-4 py-2.5">
        <span className="text-lg">📄</span>
        <h3 className="text-sm font-semibold tracking-tight">
          {data.title || "Document Checklist"}
        </h3>
        <span className="ml-auto text-[10px] font-medium text-muted-foreground">
          {done}/{total}
        </span>
      </div>
      <div className="p-4">
        <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <ul className="space-y-1.5">
          {data.items.map((item, i) => {
            const isOn = checked.has(item);
            return (
              <li key={i}>
                <button
                  onClick={() => toggle(item)}
                  className="flex w-full items-start gap-2.5 rounded-lg p-2 text-left transition-colors hover:bg-accent/60"
                >
                  <span
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                      isOn
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-muted-foreground/40"
                    }`}
                  >
                    {isOn && (
                      <svg
                        className="h-2.5 w-2.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={4}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span
                    className={`text-xs leading-relaxed ${isOn ? "text-muted-foreground line-through" : ""}`}
                  >
                    {item}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// ---------- Budget Card ----------
export function BudgetCard({ data }: { data: BudgetCardData }) {
  const local = data.currency || "USD";
  const base = data.baseCurrency || "USD";
  const rate = data.rate && data.rate > 0 ? data.rate : 1; // 1 base = rate local
  const [showBase, setShowBase] = useState(false);

  const fmt = (val?: number) => {
    if (val == null) return "—";
    const v = showBase ? val / rate : val;
    const cur = showBase ? base : local;
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: cur,
        maximumFractionDigits: 0,
      }).format(v);
    } catch {
      return `${cur} ${Math.round(v)}`;
    }
  };

  const tiers: { key: keyof BudgetCardData["tiers"]; label: string; icon: string; grad: string }[] =
    [
      { key: "budget", label: "Budget", icon: "🎒", grad: "from-emerald-500/20 to-teal-500/10" },
      { key: "standard", label: "Standard", icon: "🏨", grad: "from-sky-500/20 to-blue-500/10" },
      { key: "luxury", label: "Luxury", icon: "✨", grad: "from-amber-500/20 to-orange-500/10" },
    ];

  return (
    <div className="premium-card overflow-hidden rounded-[1.5rem] animate-bubble-in">
      <div className="flex items-center gap-2 border-b border-champagne/12 bg-gradient-to-r from-primary/10 to-champagne/8 px-4 py-2.5">
        <span className="text-lg">💰</span>
        <h3 className="text-sm font-semibold tracking-tight">
          Daily Budget {data.destination ? `· ${data.destination}` : ""}
        </h3>
        {local !== base && (
          <button
            onClick={() => setShowBase((s) => !s)}
            className="ml-auto rounded-full bg-background/70 px-2 py-0.5 text-[10px] font-semibold ring-1 ring-border hover:bg-accent"
          >
            {showBase ? base : local}
          </button>
        )}
      </div>
      <div className="space-y-2 p-4">
        {tiers.map((t) => (
          <div
            key={t.label}
            className={`flex items-center justify-between rounded-xl bg-gradient-to-r ${t.grad} px-3 py-2.5 ring-1 ring-border/60`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{t.icon}</span>
              <div>
                <div className="text-xs font-semibold">{t.label}</div>
                <div className="text-[10px] text-muted-foreground">per person · day</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold tracking-tight">{fmt(data.tiers[t.key])}</div>
              {local !== base && data.tiers[t.key] != null && (
                <div className="text-[10px] text-muted-foreground">
                  ≈{" "}
                  {showBase
                    ? new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency: local,
                        maximumFractionDigits: 0,
                      }).format(data.tiers[t.key]!)
                    : new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency: base,
                        maximumFractionDigits: 0,
                      }).format(data.tiers[t.key]! / rate)}
                </div>
              )}
            </div>
          </div>
        ))}
        {data.notes && (
          <p className="rounded-lg bg-muted/50 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
            {data.notes}
          </p>
        )}
      </div>
    </div>
  );
}

// ---------- Suggested Questions ----------
export function SuggestedQuestions({
  data,
  onPick,
}: {
  data: SuggestionsData;
  onPick: (q: string) => void;
}) {
  if (!data.questions?.length) return null;
  return (
    <div className="animate-in fade-in slide-in-from-bottom-1 duration-300">
      <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Suggested follow-ups
      </p>
      <div className="flex flex-wrap gap-1.5">
        {data.questions.slice(0, 5).map((q, i) => (
          <button
            key={i}
            onClick={() => onPick(q)}
            className="premium-pill rounded-full px-3 py-1.5 text-[11px] font-medium text-primary transition-colors hover:bg-primary/10"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- Loading Skeleton ----------
export function PremiumSkeleton() {
  return (
    <div className="flex gap-2 animate-bubble-in">
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl gradient-primary text-primary-foreground shadow-float">
        <span className="absolute inset-0 -z-10 rounded-2xl gradient-primary opacity-60 blur-md animate-thinking-pulse" />
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
      <div className="flex-1">
        <div className="glass inline-flex items-center gap-2.5 rounded-2xl rounded-tl-md px-4 py-3">
          <span className="inline-flex items-end gap-1">
            <span className="typing-dot" />
            <span className="typing-dot" style={{ animationDelay: "0.15s" }} />
            <span className="typing-dot" style={{ animationDelay: "0.3s" }} />
          </span>
          <span className="bg-gradient-to-r from-primary via-royal-deep to-emerald bg-[length:200%_100%] bg-clip-text text-xs font-semibold text-transparent animate-gradient-shift">
            Asvior AI is thinking…
          </span>
        </div>
        <div className="mt-2 space-y-2">
          <div className="skeleton h-2.5 w-11/12" />
          <div className="skeleton h-2.5 w-8/12" />
          <div className="skeleton h-2.5 w-6/12" />
        </div>
      </div>
    </div>
  );
}

// ---------- Rating ----------
const RATINGS_KEY = "vp_ai_ratings_v1";
function loadRatings(): Record<string, { rating: 1 | -1; feedback?: string }> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(RATINGS_KEY) || "{}");
  } catch (error) {
    void error;
    return {};
  }
}
function saveRatings(v: Record<string, { rating: 1 | -1; feedback?: string }>) {
  try {
    localStorage.setItem(RATINGS_KEY, JSON.stringify(v));
  } catch (error) {
    void error;
  }
}

export function RatingBar({ messageId }: { messageId: string }) {
  const [rating, setRating] = useState<1 | -1 | 0>(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const all = loadRatings();
    if (all[messageId]) setRating(all[messageId].rating);
  }, [messageId]);

  const rate = (r: 1 | -1) => {
    setRating(r);
    const all = loadRatings();
    all[messageId] = { rating: r, feedback: all[messageId]?.feedback };
    saveRatings(all);
    if (r === -1) setShowFeedback(true);
    else toast.success("Thanks for the feedback!");
  };

  const submitFeedback = () => {
    const all = loadRatings();
    all[messageId] = { rating: rating === 0 ? -1 : (rating as 1 | -1), feedback };
    saveRatings(all);
    setShowFeedback(false);
    toast.success("Feedback saved");
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1">
        <button
          onClick={() => rate(1)}
          className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] transition-colors ${
            rating === 1
              ? "bg-emerald-500/20 text-emerald-600"
              : "text-muted-foreground hover:bg-accent"
          }`}
          aria-label="Good response"
        >
          <svg
            className="h-3 w-3"
            viewBox="0 0 24 24"
            fill={rating === 1 ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
            />
          </svg>
        </button>
        <button
          onClick={() => rate(-1)}
          className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] transition-colors ${
            rating === -1 ? "bg-rose-500/20 text-rose-600" : "text-muted-foreground hover:bg-accent"
          }`}
          aria-label="Bad response"
        >
          <svg
            className="h-3 w-3"
            viewBox="0 0 24 24"
            fill={rating === -1 ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384"
            />
          </svg>
        </button>
      </div>
      {showFeedback && (
        <div className="flex gap-1">
          <input
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="What went wrong? (optional)"
            className="flex-1 rounded-md border border-border bg-background px-2 py-1 text-[11px] focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={submitFeedback}
            className="rounded-md bg-primary px-2 py-1 text-[11px] font-semibold text-primary-foreground"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- Bookmark ----------
export type BookmarkedConversation = {
  id: string;
  title: string;
  preview: string;
  createdAt: number;
  messages: unknown[];
};
const BOOKMARKS_KEY = "vp_ai_bookmarks_v1";
export function loadBookmarks(scope = GUEST_STORAGE_SCOPE): BookmarkedConversation[] {
  if (typeof window === "undefined") return [];
  try {
    const scoped = localStorage.getItem(buildScopedStorageKey(BOOKMARKS_KEY, scope));
    if (scoped) return JSON.parse(scoped);

    // One-time compatibility path for older installs that used a global key.
    if (scope === GUEST_STORAGE_SCOPE) {
      const legacy = localStorage.getItem(BOOKMARKS_KEY);
      if (legacy) return JSON.parse(legacy);
    }

    return [];
  } catch (error) {
    void error;
    return [];
  }
}
export function saveBookmark(b: BookmarkedConversation, scope = GUEST_STORAGE_SCOPE) {
  const all = loadBookmarks(scope).filter((x) => x.id !== b.id);
  all.unshift(b);
  try {
    localStorage.setItem(
      buildScopedStorageKey(BOOKMARKS_KEY, scope),
      JSON.stringify(all.slice(0, 50)),
    );
  } catch (error) {
    void error;
  }
}
export function removeBookmark(id: string, scope = GUEST_STORAGE_SCOPE) {
  const all = loadBookmarks(scope).filter((x) => x.id !== id);
  try {
    localStorage.setItem(buildScopedStorageKey(BOOKMARKS_KEY, scope), JSON.stringify(all));
  } catch (error) {
    void error;
  }
}

// ---------- Error retry ----------
export function ErrorRetry({
  message,
  onRetry,
  signInRequired,
}: {
  message?: string;
  onRetry: () => void;
  signInRequired?: boolean;
}) {
  return (
    <div className="flex gap-2 animate-in fade-in slide-in-from-bottom-1 duration-200">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-600">
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
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>
      <div className="flex-1 rounded-2xl rounded-tl-md border border-rose-500/30 bg-rose-500/5 p-3.5 backdrop-blur-xl">
        <p className="text-xs font-semibold text-rose-700 dark:text-rose-300">
          {signInRequired ? "Sign in to continue" : "Couldn't reach Asvior AI"}
        </p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          {message || "Network or service hiccup. Your question is safe — give it another try."}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {signInRequired && (
            <Link
              to="/auth"
              search={{ redirect: "/assistant" }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground shadow-sm transition-transform active:scale-95"
            >
              Sign in
            </Link>
          )}
          {!signInRequired && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm transition-transform active:scale-95"
            >
          <svg
            className="h-3 w-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992V4.356M2.985 19.644v-4.992h4.992m0 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
