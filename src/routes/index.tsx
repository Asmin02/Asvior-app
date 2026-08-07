import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plane,
  CheckSquare,
  Wallet,
  Sparkles,
  ArrowRight,
  Landmark,
  Lightbulb,
  Search,
  MessageCircle,
  BookOpen,
  Compass,
  X,
  MapPinned,
} from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { GlobalImmigrationUpdates } from "@/components/home/GlobalImmigrationUpdates";
import { CinematicHero } from "@/components/home/CinematicHero";
import { AsviorMark } from "@/components/AsviorMark";
import { ProfileMenu } from "@/components/home/ProfileMenu";
import { supabase } from "@/integrations/supabase/client";
import {
  clearRecentSearches,
  getCountryName,
  loadRecentSearches,
  removeRecentSearch,
  MAX_RECENT_SEARCHES,
  type RecentSearch,
} from "@/lib/visa";
import { CountryFlag } from "@/components/CountryFlag";
import { loadBookmarks } from "@/components/ai-cards";
import { GUEST_STORAGE_SCOPE } from "@/lib/app-session";
import { SmoothImage } from "@/components/motion/SmoothImage";
import {
  getDailyTrendingDestinations,
  normalizeHomeVisaUpdates,
  type HomeVisaUpdate,
} from "@/data/home-feed";
import { resolveApiUrl } from "@/lib/api-base";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Asvior — Premium AI Travel & Visa Companion" },
      {
        name: "description",
        content:
          "Plan trips with confidence: instant visa answers, AI itineraries, budgets, checklists and live official travel updates — all in one elegant app.",
      },
      { property: "og:title", content: "Asvior — Premium AI Travel & Visa Companion" },
      {
        property: "og:description",
        content:
          "Instant visa answers, AI itineraries, budgets, checklists and live official travel updates.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

type BookmarkSnapshot = { id: string; title: string; preview: string; createdAt: number };

type PlanItem = {
  id: string;
  title: string;
  subtitle: string;
  timestamp: number;
  icon: React.ReactNode;
  to: string;
  params?: Record<string, string>;
};

const TRENDING_IMAGES = [
  "/regions/region-europe.jpg",
  "/regions/region-asia.jpg",
  "/regions/region-americas.jpg",
  "/regions/region-oceania.jpg",
  "/regions/region-middle-east.jpg",
  "/regions/region-africa.jpg",
];

const HOME_REFERENCE_DATE = new Date("2026-01-01T00:00:00.000Z");

const EMBASSY_FINDER_PROMPT =
  "How do I find the nearest embassy or consulate for a country I'm visiting?";

const TRAVEL_TIPS_PROMPT =
  "Give me your top 10 smart travel tips for international travelers.";

const QUICK_ACTIONS = [
  {
    to: "/visa-check",
    title: "Visa Checker",
    desc: "199 countries",
    icon: Plane,
    tone: "sky",
  },
  {
    to: "/assistant",
    title: "AI Assistant",
    desc: "Ask anything",
    icon: Sparkles,
    tone: "violet",
  },
  {
    to: "/assistant",
    search: { q: EMBASSY_FINDER_PROMPT },
    title: "Embassy Finder",
    desc: "Official contacts",
    icon: Landmark,
    tone: "amber",
  },
  {
    to: "/budget-planner",
    title: "Budget Planner",
    desc: "Plan real costs",
    icon: Wallet,
    tone: "emerald",
  },
  {
    to: "/checklist",
    title: "Travel Checklist",
    desc: "Pre-departure",
    icon: CheckSquare,
    tone: "rose",
  },
  {
    to: "/assistant",
    search: { q: TRAVEL_TIPS_PROMPT },
    title: "Travel Tips",
    desc: "Know before you go",
    icon: Lightbulb,
    tone: "cyan",
  },
] as const;

const TONE_CLASS: Record<string, string> = {
  sky: "bg-sky-500/12 text-sky-600 dark:text-sky-300",
  violet: "bg-violet-500/12 text-violet-600 dark:text-violet-300",
  amber: "bg-amber-500/14 text-amber-600 dark:text-amber-300",
  emerald: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-300",
  rose: "bg-rose-500/12 text-rose-600 dark:text-rose-300",
  cyan: "bg-cyan-500/12 text-cyan-600 dark:text-cyan-300",
};

function greetingFor(date: Date): string {
  const h = date.getHours();
  if (h < 5) return "Good night";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function HomePage() {
  const [recent, setRecent] = useState<RecentSearch[]>([]);
  const [hasBudget, setHasBudget] = useState(false);
  const [hasChecklist, setHasChecklist] = useState(false);
  const [aiBookmark, setAiBookmark] = useState<BookmarkSnapshot | null>(null);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [signedIn, setSignedIn] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [scope, setScope] = useState<string>(GUEST_STORAGE_SCOPE);
  const [now, setNow] = useState<Date | null>(null);
  const [news, setNews] = useState<HomeVisaUpdate[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsMeta, setNewsMeta] = useState<{
    fetchedAt: string;
    stale: boolean;
    countryCount?: number;
  } | null>(null);

  const hydrated = now !== null;
  const referenceDate = now ?? HOME_REFERENCE_DATE;
  const greeting = useMemo(() => (now ? greetingFor(now) : "Welcome"), [now]);
  const trending = useMemo(() => getDailyTrendingDestinations(referenceDate, 6), [referenceDate]);

  /** Countries the traveller already engaged with — used to personalise ordering. */
  const affinity = useMemo(() => new Set(recent.map((r) => r.destination)), [recent]);

  const personalTrending = useMemo(
    () =>
      [...trending].sort(
        (a, b) => Number(affinity.has(b.code)) - Number(affinity.has(a.code)),
      ),
    [trending, affinity],
  );


  const refreshState = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    setSignedIn(!!user);
    const meta = user?.user_metadata as { full_name?: string; name?: string } | undefined;
    setName(meta?.full_name || meta?.name || user?.email?.split("@")[0] || null);
    setEmail(user?.email ?? null);

    const nextScope = user?.id ?? GUEST_STORAGE_SCOPE;
    setScope(nextScope);
    setRecent(loadRecentSearches(nextScope));

    try {
      setHasBudget(!!localStorage.getItem("vp_budget"));
      setHasChecklist(!!localStorage.getItem("vp_checklist"));
      const latest = user
        ? (loadBookmarks(user.id)
            .filter((v) => v && typeof v.createdAt === "number")
            .sort((a, b) => b.createdAt - a.createdAt)[0] as BookmarkSnapshot | undefined)
        : undefined;
      setAiBookmark(latest ?? null);
    } catch {
      setHasBudget(false);
      setHasChecklist(false);
      setAiBookmark(null);
    }
  }, []);

  useEffect(() => setNow(new Date()), []);

  useEffect(() => {
    let mounted = true;
    const run = () => {
      if (!mounted) return;
      refreshState().catch(() => undefined);
    };
    run();
    const { data: sub } = supabase.auth.onAuthStateChange(run);
    window.addEventListener("focus", run);
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
      window.removeEventListener("focus", run);
    };
  }, [refreshState]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(resolveApiUrl("/api/visa-news?schema=2"), { cache: "no-store" });
        if (!res.ok) throw new Error("failed");
        const payload = (await res.json()) as {
          items: HomeVisaUpdate[];
          fetchedAt: string;
          stale: boolean;
          countryCount?: number;
        };
        if (cancelled) return;
        setNews(normalizeHomeVisaUpdates(payload.items));
        setNewsMeta({
          fetchedAt: payload.fetchedAt,
          stale: !!payload.stale,
          countryCount: payload.countryCount,
        });
      } catch {
        if (!cancelled) {
          try {
            const retry = await fetch(resolveApiUrl("/api/visa-news?schema=2"), {
              cache: "no-store",
            });
            if (retry.ok) {
              const payload = (await retry.json()) as {
                items: HomeVisaUpdate[];
                fetchedAt: string;
                stale: boolean;
                countryCount?: number;
              };
              if (!cancelled && payload.items?.length) {
                setNews(normalizeHomeVisaUpdates(payload.items));
                setNewsMeta({
                  fetchedAt: payload.fetchedAt,
                  stale: !!payload.stale,
                  countryCount: payload.countryCount,
                });
                return;
              }
            }
          } catch {
            // fall through to empty state
          }
          setNews([]);
          setNewsMeta({ fetchedAt: new Date().toISOString(), stale: true });
        }
      } finally {
        if (!cancelled) setNewsLoading(false);
      }
    };
    void load();
    // Auto-refresh the official feed every 24 hours while the app stays open.
    const timer = window.setInterval(() => void load(), 24 * 60 * 60 * 1000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);


  const plans = useMemo<PlanItem[]>(() => {
    const items: PlanItem[] = [];
    for (const r of recent.slice(0, 3)) {
      items.push({
        id: `visa:${r.passport}:${r.destination}`,
        title: `${getCountryName(r.destination)} trip plan`,
        subtitle: `${r.status} · ${getCountryName(r.passport)} passport`,
        timestamp: r.timestamp,
        icon: <Compass className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.8} />,
        to: "/country/$code",
        params: { code: r.destination },
      });
    }
    if (hasBudget)
      items.push({
        id: "budget",
        title: "Budget planner",
        subtitle: "Continue estimating your trip costs",
        timestamp: 2,
        icon: <Wallet className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.8} />,
        to: "/budget-planner",
      });
    if (hasChecklist)
      items.push({
        id: "checklist",
        title: "Travel checklist",
        subtitle: "Resume your pre-departure list",
        timestamp: 1,
        icon: <BookOpen className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.8} />,
        to: "/checklist",
      });
    if (aiBookmark)
      items.push({
        id: `ai:${aiBookmark.id}`,
        title: aiBookmark.title || "AI conversation",
        subtitle: "Pick up where your last chat ended",
        timestamp: aiBookmark.createdAt,
        icon: <MessageCircle className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.8} />,
        to: "/assistant",
      });
    return items
      .filter((i) => !dismissed.includes(i.id))
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [recent, hasBudget, hasChecklist, aiBookmark, dismissed]);

  const dismissPlan = (item: PlanItem) => {
    setDismissed((d) => [...d, item.id]);
    if (item.id === "budget") {
      try {
        localStorage.removeItem("vp_budget");
      } catch {
        /* ignore */
      }
      setHasBudget(false);
    }
    if (item.id === "checklist") {
      try {
        localStorage.removeItem("vp_checklist");
      } catch {
        /* ignore */
      }
      setHasChecklist(false);
    }
    if (item.id.startsWith("visa:")) {
      const [, passport, destination] = item.id.split(":");
      setRecent(removeRecentSearch(passport, destination, scope));
    }
  };

  const clearPlans = () => {
    setDismissed((d) => [...d, ...plans.map((p) => p.id)]);
    setRecent(clearRecentSearches(scope));
    try {
      localStorage.removeItem("vp_budget");
      localStorage.removeItem("vp_checklist");
    } catch {
      /* ignore */
    }
    setHasBudget(false);
    setHasChecklist(false);
    setAiBookmark(null);
  };

  return (
    <div className="animate-page-enter pb-10">
      {/* ---------- Top navigation ---------- */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 px-5 pb-3 pt-[calc(var(--safe-top)+0.75rem)] backdrop-blur-xl">
        <div className="mx-auto grid max-w-3xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <AsviorMark className="h-9 w-9 shrink-0" />
            <div className="min-w-0">
              <p className="truncate text-[0.9375rem] font-semibold tracking-[-0.02em] text-foreground">
                Asvior
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {greeting}
                {name ? `, ${name.split(" ")[0]}` : ""}
              </p>
            </div>
          </div>
          <ProfileMenu signedIn={signedIn} name={name} email={email} />
        </div>
      </header>

      {/* ---------- Cinematic photographic hero ---------- */}
      <CinematicHero>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
          Your travel companion
        </p>
        <h1 className="mt-3 max-w-[15ch] text-[2.15rem] font-semibold leading-[1.06] tracking-[-0.035em] text-white">
          The world is closer than you think.
        </h1>
        <p className="mt-3 max-w-[34ch] text-[0.9375rem] leading-relaxed text-white/80">
          Visas, budgets and itineraries — planned by your AI travel companion.
        </p>
        <div className="mt-6 flex flex-wrap gap-2.5">
          <Link
            to="/assistant"
            className="spring-press cine-cta-primary inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold"
          >
            Start Planning
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
          <Link
            to="/visa-check"
            className="spring-press cine-cta-ghost inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold"
          >
            Visa Checker
          </Link>
        </div>
      </CinematicHero>

      <div className="mx-auto max-w-3xl space-y-7 px-5">
        {/* ---------- Search ---------- */}
        <Link
          to="/visa-check"
          className="search-float relative z-10 -mt-9"
          aria-label="Search destinations"
        >
          <span className="grad-signal flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white">
            <Search className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.9} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              Where would you like to go?
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              Destinations · Visas · Budgets
            </p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </Link>


        {/* ---------- Quick actions ---------- */}
        <section>
          <Reveal>
            <h2 className="section-title mb-3">Quick actions</h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {QUICK_ACTIONS.map((action, i) => (
              <Reveal key={action.title} delay={i * 55}>
                <Link
                  to={action.to}
                  search={"search" in action ? action.search : undefined}
                  className="float-card qa-tile group flex h-full flex-col gap-3 rounded-3xl p-4"
                >
                  <span
                    className={`qa-icon flex h-11 w-11 items-center justify-center rounded-2xl ${TONE_CLASS[action.tone]}`}
                  >
                    <action.icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.8} />
                  </span>

                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold tracking-[-0.01em] text-foreground">
                      {action.title}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {action.desc}
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- Continue planning ---------- */}
        <section>
          <Reveal>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="section-title">Continue planning</h2>
              {hydrated && plans.length > 0 && (
                <button
                  type="button"
                  onClick={clearPlans}
                  className="spring-press text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </button>
              )}
            </div>
          </Reveal>
          {!hydrated ? (
            <div className="space-y-2.5">
              {[0, 1].map((i) => (
                <div key={i} className="skeleton-block h-[4.5rem] rounded-3xl" />
              ))}
            </div>
          ) : plans.length === 0 ? (
            <EmptyPanel
              icon={<MapPinned className="h-5 w-5" strokeWidth={1.7} />}
              title="No trips in progress"
              body="Your visa checks, budgets and chats appear here."
              actionLabel="Start"
              actionTo="/assistant"
            />
          ) : (
            <div className="space-y-2.5">
              {plans.map((item, i) => (
                <Reveal key={item.id} delay={i * 55}>
                  <div className="float-card flex items-center gap-3 rounded-3xl p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      {item.icon}
                    </span>
                    <Link
                      to={item.to}
                      params={item.params as never}
                      className="min-w-0 flex-1 outline-none"
                    >
                      <p className="truncate text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {item.subtitle}
                      </p>
                    </Link>
                    <button
                      type="button"
                      aria-label={`Remove ${item.title}`}
                      onClick={() => dismissPlan(item)}
                      className="spring-press flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
                    >
                      <X className="h-4 w-4" strokeWidth={2} />
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </section>

        {/* ---------- Recent searches ---------- */}
        <section>
          <Reveal>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="section-title">Recent searches</h2>
              {hydrated && recent.length > 0 && (
                <button
                  type="button"
                  onClick={() => setRecent(clearRecentSearches(scope))}
                  className="spring-press text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </button>
              )}
            </div>
          </Reveal>
          {!hydrated ? (
            <div className="chip-rail">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="skeleton-block h-10 w-36 shrink-0 rounded-full" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <EmptyPanel
              icon={<Search className="h-5 w-5" strokeWidth={1.7} />}
              title="No searches yet"
              body="Visa results you check are saved here."
              actionLabel="Check visa"
              actionTo="/visa-check"
            />
          ) : (
            <div className="chip-rail" role="list">
              {recent.slice(0, MAX_RECENT_SEARCHES).map((r) => (
                <div
                  key={`${r.passport}-${r.destination}-${r.timestamp}`}
                  role="listitem"
                  className="search-chip float-card group flex shrink-0 items-center gap-2 rounded-full py-1.5 pl-2 pr-1.5"
                >
                  <Link
                    to="/country/$code"
                    params={{ code: r.destination }}
                    className="flex items-center gap-2 outline-none"
                    title={`${getCountryName(r.destination)} · ${r.status}`}
                  >
                    <CountryFlag code={r.destination} size="sm" />
                    <span className="whitespace-nowrap text-[0.8125rem] font-semibold text-foreground">
                      {getCountryName(r.destination)}
                    </span>
                  </Link>
                  <button
                    type="button"
                    aria-label={`Delete ${getCountryName(r.destination)} search`}
                    onClick={() => setRecent(removeRecentSearch(r.passport, r.destination, scope))}
                    className="spring-press flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" strokeWidth={2.2} />
                  </button>
                </div>
              ))}
            </div>
          )}

        </section>

        {/* ---------- Inspiration ---------- */}
        <section>
          <Reveal>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="section-title">Trending Destinations</h2>
              <Link to="/countries" className="text-xs font-semibold text-primary">
                See all
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {personalTrending.slice(0, 6).map((destination, i) => (
              <Reveal key={destination.code} delay={i * 55}>
                <Link
                  to="/country/$code"
                  params={{ code: destination.code }}
                  className="float-card group block overflow-hidden rounded-3xl p-0"
                >
                  <div className="relative h-28 overflow-hidden">
                    <SmoothImage
                      src={TRENDING_IMAGES[destination.imageIndex]}
                      alt={destination.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/78 via-slate-950/12 to-transparent" />
                    {destination.label && (
                      <span className="absolute left-2.5 top-2.5 rounded-full bg-white/22 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-white backdrop-blur-md">
                        {destination.label}
                      </span>
                    )}
                    <div className="absolute inset-x-3 bottom-2.5 flex items-center gap-1.5">
                      <CountryFlag code={destination.code} size="sm" className="ring-white/40" />
                      <p className="truncate text-xs font-semibold text-white">
                        {destination.name}
                      </p>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>


        <GlobalImmigrationUpdates
          items={news}
          loading={newsLoading}
          meta={newsMeta}
          affinity={affinity}
          maxVisible={12}
        />

        <footer className="border-t border-border/60 pt-6 text-center">
          <nav
            aria-label="Legal"
            className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground"
          >
            <Link to="/about" className="transition-colors hover:text-foreground">
              About
            </Link>
            <Link to="/privacy" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link to="/contact" className="transition-colors hover:text-foreground">
              Contact
            </Link>
            <Link to="/support" className="transition-colors hover:text-foreground">
              Support
            </Link>
          </nav>
        </footer>
      </div>
    </div>
  );
}

function EmptyPanel({
  icon,
  title,
  body,
  actionLabel,
  actionTo,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  actionLabel: string;
  actionTo: string;
}) {
  return (
    <Reveal>
      <div className="premium-card flex items-center gap-3 rounded-3xl px-4 py-3.5">
        <span className="grad-signal flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{body}</p>
        </div>
        <Link
          to={actionTo}
          className="spring-press inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-primary px-3.5 text-xs font-semibold text-primary-foreground"
        >
          {actionLabel}
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
        </Link>
      </div>
    </Reveal>
  );
}

