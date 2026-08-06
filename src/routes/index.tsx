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
  Settings,
} from "lucide-react";
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
import {
  getDailyTrendingDestinations,
  getLatestVisaUpdates,
  type HomeVisaUpdate,
} from "@/data/home-feed";

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
  return (
    <Link
      to="/country/$code"
      params={{ code: item.countryCode }}
      className="premium-card block rounded-2xl p-4 transition-colors hover:bg-secondary/30"
    >
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
    <div className="pb-6">
      {/* Immersive hero */}
      <header className="relative overflow-hidden rounded-b-[2.25rem]">
        <img
          src={heroSkyline}
          alt="Aerial view of a turquoise coastline at golden hour"
          width={1280}
          height={1600}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/35 to-ink/85" />

        <div className="relative px-4 pb-24 pt-[calc(env(safe-area-inset-top)+1rem)]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <AsviorMark className="h-9 w-9 shrink-0" />
              <p className="truncate text-base font-bold tracking-[0.18em] text-white">ASVIOR</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                to="/settings"
                aria-label="Open settings"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 bg-white/12 text-white backdrop-blur-md transition-colors hover:bg-white/20"
              >
                <Settings className="h-4 w-4" />
              </Link>
              <Link
                to={signedIn ? "/profile" : "/auth"}
                className="inline-flex h-10 items-center rounded-xl border border-white/25 bg-white/12 px-3.5 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
              >
                {signedIn ? "Profile" : "Sign in"}
              </Link>
            </div>
          </div>

          <div className="mt-10 animate-fade-in">
            <p className="text-eyebrow text-white/70">
              {greeting}
              {name ? `, ${name.split(" ")[0]}` : ""}
            </p>
            <h1 className="mt-2 max-w-[15ch] text-3xl leading-tight font-semibold text-white">
              The world is closer than you think.
            </h1>
            <p className="mt-2.5 max-w-[32ch] text-sm leading-relaxed text-white/75">
              Visas, budgets and itineraries — planned by your AI travel companion.
            </p>
          </div>
        </div>
      </header>

      <div className="space-y-6 px-4 pt-4">
        {/* Floating premium search */}
        <Link
          to="/visa-check"
          aria-label="Search destinations, visas, or travel plans"
          className="-mt-[4.5rem] relative z-10 flex items-center gap-3 rounded-2xl border border-white/50 bg-card/90 p-4 elev-4 backdrop-blur-xl transition-transform duration-200 hover:-translate-y-0.5"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl grad-signal text-white">
            <Search className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">Where would you like to go?</p>
            <p className="text-xs text-muted-foreground">Destinations · Visas · Budgets</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </Link>

        {/* AI travel companion */}
        <Link
          to="/assistant"
          className="group relative block overflow-hidden rounded-2xl grad-ink p-5 text-white elev-3 transition-transform duration-200 hover:-translate-y-0.5"
        >
          <span className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-aurora/25 blur-2xl" />
          <span className="pointer-events-none absolute -bottom-16 -left-8 h-40 w-40 rounded-full bg-gold/20 blur-2xl" />
          <div className="relative flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/12">
              <Sparkles className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-eyebrow text-white/60">Asvior AI</p>
              <p className="mt-1 text-base font-semibold">Your personal travel companion</p>
              <p className="mt-1 text-xs leading-relaxed text-white/70">
                Ask anything — entry rules, 7-day plans, what a week really costs.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Plan my trip", "Do I need a visa?", "Best time to go"].map((q) => (
                  <span
                    key={q}
                    className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-2xs font-medium text-white/85"
                  >
                    {q}
                  </span>
                ))}
              </div>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 opacity-70 transition-transform duration-200 group-hover:translate-x-0.5" />
          </div>
        </Link>

        {/* Quick tools */}
        <section>
          <h2 className="section-title mb-3">Travel tools</h2>
          <div className="grid grid-cols-2 gap-3">
            <ToolCard
              to="/visa-check"
              title="Visa Check"
              desc="199 countries"
              icon={<Plane className="h-5 w-5" />}
            />
            <ToolCard
              to="/checklist"
              title="Checklist"
              desc="Pre-departure"
              icon={<CheckSquare className="h-5 w-5" />}
            />
            <ToolCard
              to="/budget-planner"
              title="Budget"
              desc="Plan costs"
              icon={<Wallet className="h-5 w-5" />}
            />
            <ToolCard
              to="/countries"
              title="Explore"
              desc="Country guides"
              icon={<Globe2 className="h-5 w-5" />}
            />
          </div>
        </section>

        {/* Continue / Recent trips */}
        {signedIn && continueActivity && (
          <section>
            <h2 className="section-title mb-3">Continue planning</h2>
            <ContinuePlanningCard activity={continueActivity} />
          </section>
        )}

        {/* Recent searches */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="section-title">Recent searches</h2>
            {recent.length > 0 && (
              <Link to="/visa-check" className="text-xs font-semibold text-navy">
                New search
              </Link>
            )}
          </div>
          {recent.length === 0 ? (
            <div className="premium-card rounded-2xl p-4 text-sm text-muted-foreground">
              No recent destinations yet. Start with a visa check.
            </div>
          ) : (
            <div className="space-y-2">
              {recent.slice(0, 5).map((r) => (
                <Link
                  key={`${r.passport}-${r.destination}-${r.timestamp}`}
                  to="/country/$code"
                  params={{ code: r.destination }}
                  className="premium-card flex items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-secondary/30"
                >
                  <CountryFlag code={r.destination} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {getCountryName(r.destination)}
                    </p>
                    <p className="text-xs text-muted-foreground">{r.status}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Popular destinations */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="section-title">Popular destinations</h2>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous destination"
                onClick={() => popularApi?.scrollPrev()}
                disabled={!canScrollPopularPrev}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next destination"
                onClick={() => popularApi?.scrollNext()}
                disabled={!canScrollPopularNext}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <Link to="/countries" className="ml-1 text-xs font-semibold text-navy">
                See all
              </Link>
            </div>
          </div>
          <Carousel setApi={setPopularApi} opts={{ align: "start", containScroll: "trimSnaps" }}>
            <CarouselContent className="-ml-3">
              {POPULAR.map((d) => (
                <CarouselItem key={d.code} className="basis-[44%] pl-3 sm:basis-[38%]">
                  <Link
                    to="/country/$code"
                    params={{ code: d.code }}
                    className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
                  >
                    <div className="relative h-32 overflow-hidden">
                      <img
                        src={d.image}
                        alt={d.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent" />
                      <div className="absolute inset-x-2 bottom-2 flex items-center gap-2">
                        <CountryFlag code={d.code} size="sm" className="ring-white/40" />
                        <p className="truncate text-sm font-semibold text-white">{d.name}</p>
                      </div>
                    </div>
                    <p className="px-3 py-2 text-xs text-muted-foreground">{d.tagline}</p>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>

        {/* Travel inspiration */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="section-title">Travel inspiration</h2>
            <span className="text-xs text-muted-foreground">Updated daily</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {dailyTrending.slice(0, 4).map((destination) => (
              <Link
                key={destination.code}
                to="/country/$code"
                params={{ code: destination.code }}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
              >
                <div className="relative h-24 overflow-hidden">
                  <img
                    src={TRENDING_IMAGES[destination.imageIndex]}
                    alt={destination.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                  <div className="absolute inset-x-2 bottom-2 flex items-center gap-1.5">
                    <CountryFlag code={destination.code} size="sm" className="ring-white/40" />
                    <p className="truncate text-xs font-semibold text-white">{destination.name}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Visa updates */}
        <section>
          <h2 className="section-title mb-3">Latest visa updates</h2>
          <div className="space-y-2">
            {visaUpdates.slice(0, 4).map((item) => (
              <VisaUpdateCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <footer className="border-t border-border pt-4 text-center">
          <nav
            aria-label="Legal"
            className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground"
          >
            <Link to="/about" className="hover:text-foreground">
              About
            </Link>
            <Link to="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link to="/contact" className="hover:text-foreground">
              Contact
            </Link>
            <Link to="/support" className="hover:text-foreground">
              Support
            </Link>
          </nav>
        </footer>
      </div>
    </div>
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
    <Link
      to={to}
      className="premium-card flex flex-col gap-3 rounded-2xl p-4 transition-colors hover:bg-secondary/30"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-navy">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </Link>
  );
}
