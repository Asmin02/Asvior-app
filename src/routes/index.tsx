import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plane,
  CheckSquare,
  Wallet,
  Sparkles,
  Globe2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Clock,
  X,
  FileText,
  Compass,
  Search,
  CalendarClock,
  BookOpen,
  MessageCircle,
  RefreshCw,
  Settings,
} from "lucide-react";
import regionEurope from "@/assets/region-europe.jpg";
import regionAsia from "@/assets/region-asia.jpg";
import regionAmericas from "@/assets/region-americas.jpg";
import regionOceania from "@/assets/region-oceania.jpg";
import regionMiddleEast from "@/assets/region-middle-east.jpg";
import regionAfrica from "@/assets/region-africa.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { supabase } from "@/integrations/supabase/client";
import { getCountryName, flagEmoji, loadRecentSearches, type RecentSearch } from "@/lib/visa";
import { loadBookmarks } from "@/components/ai-cards";
import { GUEST_STORAGE_SCOPE } from "@/lib/app-session";
import {
  getDailyTrendingDestinations,
  getLatestVisaUpdates,
  type HomeVisaUpdate,
} from "@/data/home-feed";
import { useThemePhase } from "@/components/ThemeProvider";
import { greetingFor, phaseSurfaceClass } from "@/lib/theme-phase";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Asvior — Travel Smarter. Explore Further." },
      {
        name: "description",
        content:
          "The premium AI travel platform: instant visa checks across 199 countries, smart budgeting, packing lists, and a personal AI concierge.",
      },
      { property: "og:title", content: "Asvior — Travel Smarter. Explore Further." },
      {
        property: "og:description",
        content:
          "The premium AI travel platform: instant visa checks across 199 countries, smart budgeting, packing lists, and a personal AI concierge.",
      },
    ],
  }),
  component: HomePage,
});

type Destination = {
  code: string;
  name: string;
  tagline: string;
  image: string;
};

type BookmarkSnapshot = {
  id: string;
  title: string;
  preview: string;
  createdAt: number;
};

type ContinueActivity =
  | { kind: "visa"; title: string; subtitle: string; timestamp: number; icon: React.ReactNode }
  | {
      kind: "country";
      title: string;
      subtitle: string;
      timestamp: number;
      code: string;
      icon: React.ReactNode;
    }
  | { kind: "budget"; title: string; subtitle: string; timestamp: number; icon: React.ReactNode }
  | { kind: "checklist"; title: string; subtitle: string; timestamp: number; icon: React.ReactNode }
  | { kind: "ai"; title: string; subtitle: string; timestamp: number; icon: React.ReactNode };

const POPULAR: Destination[] = [
  { code: "JP", name: "Japan", tagline: "Ancient meets neon", image: regionAsia },
  { code: "FR", name: "France", tagline: "Timeless elegance", image: regionEurope },
  { code: "US", name: "USA", tagline: "Coast to coast", image: regionAmericas },
  { code: "AE", name: "UAE", tagline: "Skyline dreams", image: regionMiddleEast },
  { code: "AU", name: "Australia", tagline: "Wild horizons", image: regionOceania },
];

const TRENDING_IMAGES = [
  regionEurope,
  regionAsia,
  regionAmericas,
  regionOceania,
  regionMiddleEast,
  regionAfrica,
];
const HOME_REFERENCE_DATE = new Date("2026-01-01T00:00:00.000Z");
const PUBLISHED_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

function buildContinueActivity(
  recent: RecentSearch[],
  hasBudget: boolean,
  hasChecklist: boolean,
  aiBookmark: BookmarkSnapshot | null,
): ContinueActivity | null {
  const candidates: ContinueActivity[] = [];
  const latestSearch = recent[0];

  if (latestSearch) {
    const toName = getCountryName(latestSearch.destination);
    candidates.push({
      kind: "visa",
      title: `${flagEmoji(latestSearch.destination)} ${toName} visa route`,
      subtitle: `${latestSearch.status} for ${getCountryName(latestSearch.passport)} passport`,
      timestamp: latestSearch.timestamp + 2,
      icon: <Plane className="h-4.5 w-4.5" />,
    });
    candidates.push({
      kind: "country",
      title: `${flagEmoji(latestSearch.destination)} ${toName} country guide`,
      subtitle: "Continue from your last viewed destination",
      timestamp: latestSearch.timestamp + 1,
      code: latestSearch.destination,
      icon: <Compass className="h-4.5 w-4.5" />,
    });
  }

  if (hasBudget) {
    candidates.push({
      kind: "budget",
      title: "Budget planner",
      subtitle: "Continue estimating costs for your trip",
      timestamp: 1,
      icon: <Wallet className="h-4.5 w-4.5" />,
    });
  }

  if (hasChecklist) {
    candidates.push({
      kind: "checklist",
      title: "Travel checklist",
      subtitle: "Resume your pre-departure checklist",
      timestamp: 1,
      icon: <BookOpen className="h-4.5 w-4.5" />,
    });
  }

  if (aiBookmark) {
    candidates.push({
      kind: "ai",
      title: "AI conversation",
      subtitle: aiBookmark.title || "Continue where your last chat ended",
      timestamp: aiBookmark.createdAt,
      icon: <MessageCircle className="h-4.5 w-4.5" />,
    });
  }

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.timestamp - a.timestamp);
  return candidates[0];
}

function formatPublished(dateIso: string): string {
  const d = new Date(dateIso);
  if (Number.isNaN(d.getTime())) return "Just updated";
  return PUBLISHED_DATE_FORMATTER.format(d);
}

function ContinuePlanningCard({ activity }: { activity: ContinueActivity }) {
  const content = (
    <>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl gradient-primary text-primary-foreground shadow-soft">
        {activity.icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-foreground">{activity.title}</p>
        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{activity.subtitle}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground" />
    </>
  );

  const className =
    "glass flex items-center gap-3 rounded-2xl p-3.5 shadow-soft animate-fade-up transition-transform active:scale-[0.98] hover:-translate-y-0.5";

  if (activity.kind === "visa") {
    return (
      <Link to="/visa-check" className={className}>
        {content}
      </Link>
    );
  }

  if (activity.kind === "country") {
    return (
      <Link to="/country/$code" params={{ code: activity.code }} className={className}>
        {content}
      </Link>
    );
  }

  if (activity.kind === "budget") {
    return (
      <Link to="/budget-planner" className={className}>
        {content}
      </Link>
    );
  }

  if (activity.kind === "checklist") {
    return (
      <Link to="/checklist" className={className}>
        {content}
      </Link>
    );
  }

  return (
    <Link to="/assistant" className={className}>
      {content}
    </Link>
  );
}

function VisaUpdateCard({ item, delay }: { item: HomeVisaUpdate; delay: number }) {
  return (
    <Link
      to="/country/$code"
      params={{ code: item.countryCode }}
      className="glass block rounded-2xl p-4 shadow-soft animate-fade-up transition-transform active:scale-[0.99] hover:-translate-y-0.5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-xl" aria-hidden>
          {flagEmoji(item.countryCode)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-foreground">{item.title}</p>
          <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{item.summary}</p>
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {formatPublished(item.publishedAt)} · {item.source}
          </p>
        </div>
      </div>
    </Link>
  );
}

function HomePage() {
  const [recent, setRecent] = useState<RecentSearch[]>([]);
  const [hasBudget, setHasBudget] = useState(false);
  const [hasChecklist, setHasChecklist] = useState(false);
  const [latestAiBookmark, setLatestAiBookmark] = useState<BookmarkSnapshot | null>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [popularApi, setPopularApi] = useState<CarouselApi>();
  const [canScrollPopularPrev, setCanScrollPopularPrev] = useState(false);
  const [canScrollPopularNext, setCanScrollPopularNext] = useState(false);
  const [homeNow, setHomeNow] = useState<Date | null>(null);
  const referenceDate = homeNow ?? HOME_REFERENCE_DATE;
  const greeting = useMemo(() => (homeNow ? greetingFor(homeNow) : "Welcome"), [homeNow]);
  const { phase } = useThemePhase();
  const phaseClass = phaseSurfaceClass(phase);
  const dailyTrending = useMemo(
    () => getDailyTrendingDestinations(referenceDate, 6),
    [referenceDate],
  );
  const visaUpdates = useMemo(() => getLatestVisaUpdates(referenceDate, 8), [referenceDate]);
  const continueActivity = useMemo(
    () =>
      signedIn ? buildContinueActivity(recent, hasBudget, hasChecklist, latestAiBookmark) : null,
    [signedIn, recent, hasBudget, hasChecklist, latestAiBookmark],
  );

  const refreshContinueState = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    const isSignedIn = !!user;
    setSignedIn(isSignedIn);

    const meta = user?.user_metadata as { full_name?: string; name?: string } | undefined;
    const n = meta?.full_name || meta?.name || user?.email?.split("@")[0] || null;
    setName(n);

    if (!isSignedIn) {
      setRecent(loadRecentSearches(GUEST_STORAGE_SCOPE));
      setHasBudget(false);
      setHasChecklist(false);
      setLatestAiBookmark(null);
      return;
    }

    setRecent(loadRecentSearches(user.id));
    try {
      const b = localStorage.getItem("vp_budget");
      const c = localStorage.getItem("vp_checklist");
      setHasBudget(!!b);
      setHasChecklist(!!c);
      const latestBookmark = loadBookmarks(user.id)
        .filter((v) => v && typeof v.createdAt === "number")
        .sort((a, b) => b.createdAt - a.createdAt)[0] as BookmarkSnapshot | undefined;
      setLatestAiBookmark(latestBookmark ?? null);
    } catch {
      setHasBudget(false);
      setHasChecklist(false);
      setLatestAiBookmark(null);
    }
  }, []);

  useEffect(() => {
    setHomeNow(new Date());
  }, []);

  useEffect(() => {
    let mounted = true;

    refreshContinueState().catch(() => {
      if (!mounted) return;
      setSignedIn(false);
      setRecent([]);
      setHasBudget(false);
      setHasChecklist(false);
      setLatestAiBookmark(null);
    });

    const { data: authSub } = supabase.auth.onAuthStateChange(() => {
      if (!mounted) return;
      refreshContinueState().catch(() => {
        setSignedIn(false);
        setRecent([]);
        setHasBudget(false);
        setHasChecklist(false);
        setLatestAiBookmark(null);
      });
    });

    const onVisible = () => {
      if (!mounted || document.hidden) return;
      refreshContinueState().catch(() => {
        setSignedIn(false);
        setRecent([]);
        setHasBudget(false);
        setHasChecklist(false);
        setLatestAiBookmark(null);
      });
    };

    const onFocus = () => {
      if (!mounted) return;
      refreshContinueState().catch(() => {
        setSignedIn(false);
        setRecent([]);
        setHasBudget(false);
        setHasChecklist(false);
        setLatestAiBookmark(null);
      });
    };

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onFocus);

    return () => {
      mounted = false;
      authSub.subscription.unsubscribe();
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onFocus);
    };
  }, [refreshContinueState]);

  useEffect(() => {
    if (!popularApi) return;

    const updateButtons = () => {
      setCanScrollPopularPrev(popularApi.canScrollPrev());
      setCanScrollPopularNext(popularApi.canScrollNext());
    };

    updateButtons();
    popularApi.on("select", updateButtons);
    popularApi.on("reInit", updateButtons);

    return () => {
      popularApi.off("select", updateButtons);
      popularApi.off("reInit", updateButtons);
    };
  }, [popularApi]);

  return (
    <div className={`time-hero-surface ${phaseClass} relative overflow-hidden pb-24`}>
      {/* Hero background */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[640px] bg-gradient-to-b from-transparent via-background/30 to-background"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-24 -right-16 h-80 w-80 rounded-full bg-primary/25 blur-3xl animate-float transition-opacity duration-700"
        style={{ opacity: phase === "night" ? 0.32 : 0.55 }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-52 -left-24 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl animate-float transition-opacity duration-700"
        style={{ animationDelay: "1.2s", opacity: phase === "night" ? 0.2 : 0.72 }}
        aria-hidden
      />
      {phase === "night" && (
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 14% 20%, #fff 1px, transparent 1.5px), radial-gradient(circle at 82% 24%, #fff 1px, transparent 1.5px), radial-gradient(circle at 60% 42%, #dbe7ff 1px, transparent 1.4px)",
            backgroundSize: "170px 170px, 190px 190px, 210px 210px",
          }}
        />
      )}

      {/* Header */}
      <header className="relative flex items-center justify-between px-6 pt-8 animate-fade-up">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl gradient-primary shadow-float">
            <Plane className="h-5 w-5 text-primary-foreground" strokeWidth={2.4} />
            <span className="absolute -inset-1 -z-10 rounded-3xl gradient-primary opacity-40 blur-md" />
          </div>
          <div>
            <p className="text-display text-lg leading-none text-foreground">ASVIOR</p>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Your Premium Travel Concierge
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/settings"
            className="glass inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-transform active:scale-95"
            aria-label="Open settings"
          >
            <Settings className="h-4 w-4" />
          </Link>
          <Link
            to={signedIn ? "/profile" : "/auth"}
            className="glass rounded-full px-3.5 py-2 text-[11px] font-semibold text-foreground transition-transform active:scale-95"
          >
            {signedIn ? "My profile" : "Sign in"}
          </Link>
        </div>
      </header>

      {/* Greeting + Hero */}
      <section className="relative px-6 pt-10">
        <div className="animate-fade-up" style={{ animationDelay: "60ms" }}>
          <p className="text-sm font-semibold text-muted-foreground/90">
            {greeting}
            {name ? `, ${name.split(" ")[0]}` : ""} ✦
          </p>
          <h1 className="mt-2 text-display text-[44px] leading-[1.02] text-foreground">
            Design your
            <br />
            <span className="relative inline-block bg-gradient-to-r from-primary via-royal-deep to-champagne bg-clip-text text-transparent animate-gradient-shift">
              next journey.
            </span>
          </h1>
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted-foreground/90">
            Curated travel intelligence, visa confidence, budgeting clarity, and concierge-level
            planning in one luxury workspace.
          </p>
        </div>

        {/* Search-like CTA */}
        <Link
          to="/visa-check"
          className="glass mt-6 flex items-center gap-3 rounded-2xl px-4 py-3.5 shadow-soft animate-fade-up transition-transform active:scale-[0.98] hover:-translate-y-0.5"
          style={{ animationDelay: "120ms" }}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl gradient-champagne text-navy shadow-soft">
            <Search className="h-4 w-4" strokeWidth={2.4} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">
              Search by destination, visa need, or itinerary
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Instant visa check · 199 countries
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </Link>

        <div className="mt-3 flex gap-2 animate-fade-up" style={{ animationDelay: "180ms" }}>
          <Link
            to="/assistant"
            className="group inline-flex flex-1 items-center justify-center gap-2 rounded-2xl gradient-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-float transition-transform active:scale-95 hover:-translate-y-0.5"
          >
            <Sparkles className="h-4 w-4" />
            Ask Concierge
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/countries"
            className="glass inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-foreground transition-transform active:scale-95"
          >
            <Compass className="h-4 w-4" />
            Explore
          </Link>
        </div>
      </section>

      {/* Continue planning */}
      <section
        className="relative mt-7 px-6"
        style={{ contentVisibility: "auto", containIntrinsicSize: "320px" }}
      >
        {signedIn ? (
          <div className="mb-3 flex items-center justify-between animate-fade-up">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Continue planning
            </p>
          </div>
        ) : null}

        {!signedIn ? null : continueActivity ? (
          <ContinuePlanningCard activity={continueActivity} />
        ) : (
          <div className="glass rounded-2xl p-4 text-sm text-muted-foreground animate-fade-up">
            Start with a visa check, budget, checklist, or AI chat to continue from here.
          </div>
        )}
      </section>

      {/* Recent searches */}
      <section
        className="relative mt-5 px-6"
        style={{ contentVisibility: "auto", containIntrinsicSize: "260px" }}
      >
        <div className="mb-3 flex items-center justify-between animate-fade-up">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Recent searches
          </p>
        </div>
        {recent.length === 0 ? (
          <div className="glass rounded-2xl p-4 text-sm text-muted-foreground animate-fade-up">
            No recent destinations yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {recent.slice(0, 5).map((r, i) => (
              <Link
                key={`${r.passport}-${r.destination}-${r.timestamp}`}
                to="/country/$code"
                params={{ code: r.destination }}
                className="glass flex items-center gap-2.5 rounded-2xl p-3 shadow-soft animate-fade-up transition-transform active:scale-[0.98] hover:-translate-y-0.5"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="text-lg" aria-hidden>
                  {flagEmoji(r.destination)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {getCountryName(r.destination)}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{r.status}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Country Hub banner */}
      <section
        className="relative mt-8 px-6"
        style={{ contentVisibility: "auto", containIntrinsicSize: "300px" }}
      >
        <Link
          to="/countries"
          className="group relative block overflow-hidden rounded-3xl shadow-float"
        >
          <img
            src={regionEurope}
            alt="Explore country guides"
            width={1024}
            height={576}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            className="h-36 w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/60 to-navy/10" />
          <div className="absolute inset-y-0 left-0 flex flex-col justify-center p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
              Country Hub
            </p>
            <p className="mt-1 text-xl font-extrabold text-white">Explore 199 countries</p>
            <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-white/80">
              Visas · costs · attractions <ArrowRight className="h-3 w-3" />
            </p>
          </div>
        </Link>
      </section>

      {/* Popular destinations */}
      <section
        className="relative mt-9"
        style={{ contentVisibility: "auto", containIntrinsicSize: "420px" }}
      >
        <div className="mb-3 flex items-center justify-between px-6">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Popular destinations
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous destination"
              onClick={() => popularApi?.scrollPrev()}
              disabled={!canScrollPopularPrev}
              className="glass inline-flex h-7 w-7 items-center justify-center rounded-full text-foreground transition active:scale-95 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next destination"
              onClick={() => popularApi?.scrollNext()}
              disabled={!canScrollPopularNext}
              className="glass inline-flex h-7 w-7 items-center justify-center rounded-full text-foreground transition active:scale-95 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <Link to="/countries" className="text-[11px] font-semibold text-primary">
              See all
            </Link>
          </div>
        </div>
        <Carousel
          className="-mx-1 px-5"
          setApi={setPopularApi}
          opts={{ align: "start", containScroll: "trimSnaps", slidesToScroll: 1 }}
        >
          <CarouselContent className="-ml-3 pb-2">
            {POPULAR.map((d, i) => (
              <CarouselItem key={d.code} className="basis-auto pl-3">
                <Link
                  to="/country/$code"
                  params={{ code: d.code }}
                  className="group relative block h-52 w-44 overflow-hidden rounded-3xl shadow-float animate-fade-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <img
                    src={d.image}
                    alt={d.name}
                    loading={i === 0 ? "eager" : "lazy"}
                    fetchPriority={i === 0 ? "high" : "low"}
                    decoding="async"
                    draggable={false}
                    width={352}
                    height={416}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/40 to-transparent" />
                  <div className="absolute top-3 left-3 glass rounded-full px-2.5 py-1 text-[10px] font-bold text-foreground">
                    {flagEmoji(d.code)} {d.name}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                      Explore
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-white">{d.tagline}</p>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      {/* Feature grid */}
      <section
        className="relative mt-10 px-6"
        style={{ contentVisibility: "auto", containIntrinsicSize: "380px" }}
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Everything you need
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FeatureCard
            to="/visa-check"
            title="Visa Check"
            desc="199 countries"
            icon={<Plane className="h-5 w-5" />}
            tone="primary"
            delay={0}
          />
          <FeatureCard
            to="/checklist"
            title="Checklist"
            desc="Never forget a thing"
            icon={<CheckSquare className="h-5 w-5" />}
            tone="emerald"
            delay={70}
          />
          <FeatureCard
            to="/budget-planner"
            title="Budget"
            desc="Plan every dollar"
            icon={<Wallet className="h-5 w-5" />}
            tone="navy"
            delay={140}
          />
          <FeatureCard
            to="/assistant"
            title="Asvior AI"
            desc="Ask anything"
            icon={<Sparkles className="h-5 w-5" />}
            tone="royal"
            delay={210}
          />
        </div>
      </section>

      {/* Trending destinations */}
      <section
        className="relative mt-10 px-6"
        style={{ contentVisibility: "auto", containIntrinsicSize: "620px" }}
      >
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-display text-2xl text-foreground">Trending Destinations</h2>
            <p className="mt-0.5 text-xs font-semibold text-muted-foreground">Updated Daily</p>
          </div>
          <div className="glass inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald">
            <RefreshCw className="h-3 w-3" />
            24h rotation
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {dailyTrending.map((destination, i) => (
            <Link
              key={destination.code}
              to="/country/$code"
              params={{ code: destination.code }}
              className="group glass overflow-hidden rounded-3xl shadow-soft animate-fade-up transition-all active:scale-[0.98] hover:-translate-y-0.5 hover:shadow-float"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="relative h-28 overflow-hidden">
                <img
                  src={TRENDING_IMAGES[destination.imageIndex]}
                  alt={`${destination.name} destination`}
                  width={480}
                  height={320}
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 px-3 pb-2">
                  <p className="truncate text-sm font-bold text-white">
                    {flagEmoji(destination.code)} {destination.name}
                  </p>
                </div>
              </div>

              <div className="p-3.5">
                <p className="line-clamp-2 text-[12px] font-medium leading-relaxed text-muted-foreground">
                  {destination.places.slice(0, 5).join(" • ")}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                    Visa
                  </span>
                  <span className="rounded-full bg-emerald/12 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald">
                    Budget
                  </span>
                  <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground">
                    Attractions
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest visa updates */}
      <section
        className="relative mt-10 px-6"
        style={{ contentVisibility: "auto", containIntrinsicSize: "560px" }}
      >
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-display text-2xl text-foreground">Latest Visa Updates</h2>
            <p className="mt-0.5 text-xs font-semibold text-muted-foreground">
              Structured for future API feeds
            </p>
          </div>
          <CalendarClock className="h-4 w-4 text-primary" />
        </div>
        <div className="space-y-2.5">
          {visaUpdates.map((item, i) => (
            <VisaUpdateCard key={item.id} item={item} delay={i * 45} />
          ))}
        </div>
      </section>

      <section className="relative mt-10 px-6 pb-4">
        <footer className="space-y-3 text-center">
          <nav
            aria-label="Legal"
            className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-semibold text-muted-foreground"
          >
            <Link to="/about" className="hover:text-foreground">
              About
            </Link>
            <span aria-hidden>·</span>
            <Link to="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <span aria-hidden>·</span>
            <Link to="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <span aria-hidden>·</span>
            <Link to="/contact" className="hover:text-foreground">
              Contact
            </Link>
            <span aria-hidden>·</span>
            <Link to="/support" className="hover:text-foreground">
              Support
            </Link>
            <span aria-hidden>·</span>
            <a href="mailto:hello@asvior.app" className="hover:text-foreground">
              hello@asvior.app
            </a>
            <span aria-hidden>·</span>
            <a href="mailto:support@asvior.app" className="hover:text-foreground">
              support@asvior.app
            </a>
          </nav>
        </footer>
      </section>
    </div>
  );
}

function FeatureCard({
  to,
  title,
  desc,
  icon,
  tone,
  delay = 0,
}: {
  to: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  tone: "primary" | "emerald" | "navy" | "royal";
  delay?: number;
}) {
  const toneClasses: Record<string, string> = {
    primary: "gradient-primary text-primary-foreground",
    emerald: "gradient-emerald text-white",
    navy: "gradient-navy text-white",
    royal: "bg-primary/10 text-primary",
  };
  return (
    <Link
      to={to}
      className="glass group relative flex flex-col justify-between overflow-hidden rounded-3xl p-4 shadow-soft animate-fade-up transition-all active:scale-[0.98] hover:-translate-y-1 hover:shadow-float"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-2xl shadow-soft ${toneClasses[tone]}`}
      >
        {icon}
      </div>
      <div className="mt-6">
        <p className="text-[15px] font-bold text-foreground">{title}</p>
        <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">{desc}</p>
      </div>
      <ArrowRight className="absolute top-4 right-4 h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
    </Link>
  );
}
