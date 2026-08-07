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
  Search,
  MessageCircle,
  BookOpen,
  Compass,
  User,
} from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { useParallax } from "@/components/motion/useParallax";
import regionEurope from "@/assets/region-europe.jpg";
import heroSkyline from "@/assets/hero-skyline.jpg";
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
import { AsviorMark } from "@/components/AsviorMark";
import { supabase } from "@/integrations/supabase/client";
import { getCountryName, loadRecentSearches, type RecentSearch } from "@/lib/visa";
import { CountryFlag } from "@/components/CountryFlag";
import { loadBookmarks } from "@/components/ai-cards";
import { GUEST_STORAGE_SCOPE } from "@/lib/app-session";
import { SmoothImage } from "@/components/motion/SmoothImage";
import {
  getDailyTrendingDestinations,
  type HomeVisaUpdate,
} from "@/data/home-feed";
import { resolveApiUrl } from "@/lib/api-base";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ASVIOR — Your Premium Travel Concierge" },
      {
        name: "description",
        content:
          "ASVIOR is your premium travel concierge for elevated trip planning, visa confidence, budgets, itineraries, and seamless global movement.",
      },
      { property: "og:title", content: "ASVIOR — Your Premium Travel Concierge" },
      {
        property: "og:description",
        content:
          "ASVIOR is your premium travel concierge for elevated trip planning, visa confidence, budgets, itineraries, and seamless global movement.",
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

function greetingFor(date = new Date()): string {
  const h = date.getHours();
  if (h < 5) return "Still up?";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 22) return "Good evening";
  return "Good night";
}

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
      title: `${toName} visa route`,
      subtitle: `${latestSearch.status} for ${getCountryName(latestSearch.passport)} passport`,
      timestamp: latestSearch.timestamp + 2,
      icon: <Plane className="h-4.5 w-4.5" />,
    });
    candidates.push({
      kind: "country",
      title: `${toName} country guide`,
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
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy text-primary-foreground">
        {activity.icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{activity.title}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{activity.subtitle}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground" />
    </>
  );

  const className =
    "premium-card flex items-center gap-3 rounded-2xl p-4 transition-colors hover:bg-secondary/40 active:scale-[0.99]";

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

function VisaUpdateCard({ item }: { item: HomeVisaUpdate; delay?: number }) {
  const inner = (
    <div className="flex items-start gap-3">
      <CountryFlag code={item.countryCode} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{item.title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.summary}</p>
        <p className="mt-2 text-[10px] font-medium text-muted-foreground">
          {formatPublished(item.publishedAt)} · {item.source}
        </p>
      </div>
    </div>
  );

  if (item.url) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="premium-card block rounded-2xl p-4 transition-colors hover:bg-secondary/30"
      >
        {inner}
      </a>
    );
  }

  return (
    <Link
      to="/country/$code"
      params={{ code: item.countryCode }}
      className="premium-card block rounded-2xl p-4 transition-colors hover:bg-secondary/30"
    >
      {inner}
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
  const [visaUpdates, setVisaUpdates] = useState<HomeVisaUpdate[]>([]);
  const [visaNewsLoading, setVisaNewsLoading] = useState(true);
  const [visaNewsMeta, setVisaNewsMeta] = useState<{
    fetchedAt: string;
    stale: boolean;
  } | null>(null);
  const referenceDate = homeNow ?? HOME_REFERENCE_DATE;
  const greeting = useMemo(() => (homeNow ? greetingFor(homeNow) : "Welcome"), [homeNow]);
  const dailyTrending = useMemo(
    () => getDailyTrendingDestinations(referenceDate, 6),
    [referenceDate],
  );
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

  const heroRef = useParallax<HTMLDivElement>(0.16, 90);
  const hydrated = homeNow !== null;

  useEffect(() => {
    setHomeNow(new Date());
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadVisaNews = async () => {
      try {
        const res = await fetch(resolveApiUrl("/api/visa-news"));
        if (!res.ok) throw new Error("Failed to load visa news");
        const payload = (await res.json()) as {
          items: HomeVisaUpdate[];
          fetchedAt: string;
          stale: boolean;
        };
        if (cancelled) return;
        setVisaUpdates(payload.items ?? []);
        setVisaNewsMeta({ fetchedAt: payload.fetchedAt, stale: !!payload.stale });
      } catch {
        if (!cancelled) {
          setVisaUpdates([]);
          setVisaNewsMeta({ fetchedAt: new Date().toISOString(), stale: true });
        }
      } finally {
        if (!cancelled) setVisaNewsLoading(false);
      }
    };

    void loadVisaNews();
    return () => {
      cancelled = true;
    };
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
    <div className="animate-page-enter pb-8">
      {/* Cinematic hero */}
      <header className="relative overflow-hidden rounded-b-[2rem]">
        <div ref={heroRef} className="parallax-layer absolute inset-0">
          <SmoothImage
            src={heroSkyline}
            alt="Aerial view of a turquoise coastline at golden hour"
            width={1280}
            height={1600}
            className="ken-burns h-[118%] w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/65 via-ink/25 to-ink/85" />
        <div
          aria-hidden
          className="animate-aurora-drift pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-aurora/20 blur-3xl"
        />

        <div className="relative px-5 pb-28 pt-[calc(var(--safe-top)+1rem)]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <AsviorMark className="h-9 w-9 shrink-0" />
              <p className="truncate text-base font-bold tracking-[0.2em] text-white">ASVIOR</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {signedIn ? (
                <Link
                  to="/profile"
                  aria-label="Open your profile"
                  className="tap glass-control inline-flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold uppercase text-white"
                >
                  {name ? name.trim().charAt(0) : <User className="h-4 w-4" strokeWidth={1.9} />}
                </Link>
              ) : (
                <Link
                  to="/auth"
                  className="tap glass-control inline-flex h-11 items-center gap-2 rounded-2xl px-4 text-xs font-semibold text-white"
                >
                  <User className="h-4 w-4" strokeWidth={1.9} />
                  Sign in
                </Link>
              )}
            </div>

          </div>

          <div className="mt-14">
            <p
              className="animate-fade-up text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70"
              style={{ animationDelay: "60ms" }}
            >
              {greeting}
              {name ? `, ${name.split(" ")[0]}` : ""}
            </p>
            <h1
              className="animate-fade-up mt-3 max-w-[14ch] text-[2.4rem] font-semibold leading-[1.05] tracking-[-0.035em] text-white"
              style={{ animationDelay: "140ms" }}
            >
              The world is closer than you think.
            </h1>
            <p
              className="animate-fade-up mt-3.5 max-w-[32ch] text-[0.9375rem] leading-relaxed text-white/80"
              style={{ animationDelay: "230ms" }}
            >
              Visas, budgets and itineraries — planned by your AI travel companion.
            </p>
          </div>
        </div>
      </header>

      <div className="space-y-9 px-5 pt-5">
        {/* Floating premium search */}
        <Link
          to="/visa-check"
          aria-label="Search destinations, visas, or travel plans"
          className="search-float animate-fade-up relative z-10 -mt-[5rem]"
          style={{ animationDelay: "320ms" }}
        >
          <span className="grad-signal flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white">
            <Search className="h-5 w-5" strokeWidth={1.9} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[0.9375rem] font-semibold tracking-tight text-foreground">
              Where would you like to go?
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">Destinations · Visas · Budgets</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </Link>

        {/* AI insight — premium glass */}
        <Reveal delay={40}>
          <Link to="/assistant" className="glass-insight spring-press block p-6">
            <span
              aria-hidden
              className="animate-aurora-drift pointer-events-none absolute -right-12 -top-14 h-44 w-44 rounded-full bg-primary/25 blur-3xl"
            />
            <span
              aria-hidden
              className="animate-aurora-drift pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-gold/20 blur-3xl"
              style={{ animationDelay: "3s" }}
            />
            <div className="relative flex items-start gap-3.5">
              <span className="grad-signal flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-[0_12px_28px_-14px_color-mix(in_oklab,var(--primary)_85%,transparent)]">
                <Sparkles className="h-5 w-5" strokeWidth={1.9} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  Asvior AI
                </p>
                <p className="mt-1.5 text-lg font-semibold tracking-[-0.02em] text-foreground">
                  Your personal travel companion
                </p>
                <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted-foreground">
                  Ask anything — entry rules, 7-day plans, what a week really costs.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Plan my trip", "Do I need a visa?", "Best time to go"].map((q) => (
                    <span
                      key={q}
                      className="rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 text-[11px] font-medium text-primary"
                    >
                      {q}
                    </span>
                  ))}
                </div>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </div>
          </Link>
        </Reveal>

        {/* Quick tools */}
        <section>
          <Reveal>
            <h2 className="section-title mb-4">Travel tools</h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-3.5">
            {[
              {
                to: "/visa-check",
                title: "Visa Check",
                desc: "199 countries",
                icon: <Plane className="h-5 w-5" strokeWidth={1.8} />,
              },
              {
                to: "/checklist",
                title: "Checklist",
                desc: "Pre-departure",
                icon: <CheckSquare className="h-5 w-5" strokeWidth={1.8} />,
              },
              {
                to: "/budget-planner",
                title: "Budget",
                desc: "Plan costs",
                icon: <Wallet className="h-5 w-5" strokeWidth={1.8} />,
              },
              {
                to: "/countries",
                title: "Explore",
                desc: "Country guides",
                icon: <Globe2 className="h-5 w-5" strokeWidth={1.8} />,
              },
            ].map((tool, i) => (
              <Reveal key={tool.to} delay={i * 70}>
                <ToolCard {...tool} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* Continue / Recent trips */}
        {signedIn && continueActivity && (
          <section>
            <Reveal>
              <h2 className="section-title mb-4">Continue planning</h2>
              <ContinuePlanningCard activity={continueActivity} />
            </Reveal>
          </section>
        )}

        {/* Recent searches */}
        <section>
          <Reveal>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="section-title">Recent searches</h2>
              {recent.length > 0 && (
                <Link to="/visa-check" className="text-xs font-semibold text-primary">
                  New search
                </Link>
              )}
            </div>
          </Reveal>
          {!hydrated ? (
            <div className="space-y-2.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="skeleton-block h-[4.25rem] r-28" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <Reveal>
              <div className="float-card p-5 text-sm text-muted-foreground">
                No recent destinations yet. Start with a visa check.
              </div>
            </Reveal>
          ) : (
            <div className="space-y-2.5">
              {recent.slice(0, 5).map((r, i) => (
                <Reveal key={`${r.passport}-${r.destination}-${r.timestamp}`} delay={i * 60}>
                  <Link
                    to="/country/$code"
                    params={{ code: r.destination }}
                    className="float-card flex items-center gap-3.5 p-4"
                  >
                    <CountryFlag code={r.destination} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {getCountryName(r.destination)}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{r.status}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </section>

        {/* Popular destinations */}
        <section>
          <Reveal>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="section-title">Popular destinations</h2>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Previous destination"
                  onClick={() => popularApi?.scrollPrev()}
                  disabled={!canScrollPopularPrev}
                  className="spring-press inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next destination"
                  onClick={() => popularApi?.scrollNext()}
                  disabled={!canScrollPopularNext}
                  className="spring-press inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <Link to="/countries" className="ml-1 text-xs font-semibold text-primary">
                  See all
                </Link>
              </div>
            </div>
          </Reveal>
          <Carousel setApi={setPopularApi} opts={{ align: "start", containScroll: "trimSnaps" }}>
            <CarouselContent className="-ml-3.5">
              {POPULAR.map((d, i) => (
                <CarouselItem key={d.code} className="basis-[52%] pl-3.5 sm:basis-[42%]">
                  <Reveal delay={i * 60}>
                    <DestinationCard destination={d} />
                  </Reveal>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>

        {/* Travel inspiration */}
        <section>
          <Reveal>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="section-title">Travel inspiration</h2>
              <span className="text-xs text-muted-foreground">Updated daily</span>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-3.5">
            {dailyTrending.slice(0, 4).map((destination, i) => (
              <Reveal key={destination.code} delay={i * 70}>
                <Link
                  to="/country/$code"
                  params={{ code: destination.code }}
                  className="float-card group block overflow-hidden p-0"
                >
                  <div className="relative h-28 overflow-hidden r-28">
                    <SmoothImage
                      src={TRENDING_IMAGES[destination.imageIndex]}
                      alt={destination.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
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

        {/* Visa updates */}
        <section>
          <Reveal>
            <div className="mb-4 flex items-end justify-between gap-3">
              <h2 className="section-title">Latest visa updates</h2>
              {visaNewsMeta && (
                <p className="text-[10px] text-muted-foreground">
                  {visaNewsMeta.stale ? "Last updated " : "Updated "}
                  {formatPublished(visaNewsMeta.fetchedAt)}
                </p>
              )}
            </div>
          </Reveal>
          {visaNewsLoading ? (
            <div className="space-y-2.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="premium-card h-24 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : visaUpdates.length === 0 ? (
            <div className="premium-card rounded-2xl p-4 text-sm text-muted-foreground">
              Live visa news is temporarily unavailable. Check back soon — we refresh official
              sources every 24 hours.
              {visaNewsMeta && (
                <p className="mt-2 text-[10px]">
                  Last checked {formatPublished(visaNewsMeta.fetchedAt)}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2.5">
              {visaUpdates.slice(0, 4).map((item, i) => (
                <Reveal key={item.id} delay={i * 60}>
                  <VisaUpdateCard item={item} />
                </Reveal>
              ))}
            </div>
          )}
        </section>

        <footer className="border-t border-border/70 pt-6 text-center">
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

function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Link
      to="/country/$code"
      params={{ code: destination.code }}
      className="float-card group block overflow-hidden p-0"
    >
      <div className="relative h-40 overflow-hidden rounded-t-[1.75rem]">
        <SmoothImage
          src={destination.image}
          alt={destination.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
        <div className="absolute inset-x-3.5 bottom-3 flex items-center gap-2">
          <CountryFlag code={destination.code} size="sm" className="ring-white/40" />
          <p className="truncate text-sm font-semibold text-white">{destination.name}</p>
        </div>
      </div>
      <p className="px-4 py-3 text-xs text-muted-foreground">{destination.tagline}</p>
    </Link>
  );
}

function ToolCard({
  to,
  title,
  desc,
  icon,
}: {
  to: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <Link to={to} className="float-card flex h-full flex-col gap-3.5 p-4.5">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold tracking-tight text-foreground">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
      </div>
    </Link>
  );
}

