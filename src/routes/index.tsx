import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Plane,
  CheckSquare,
  Wallet,
  Globe2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Search,
  MessageCircle,
  BookOpen,
  Compass,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { AsviorMark } from "@/components/AsviorMark";
import regionEurope from "@/assets/region-europe.jpg";
import regionAsia from "@/assets/region-asia.jpg";
import regionAmericas from "@/assets/region-americas.jpg";
import regionOceania from "@/assets/region-oceania.jpg";
import regionMiddleEast from "@/assets/region-middle-east.jpg";
import regionAfrica from "@/assets/region-africa.jpg";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { AsviorLogo } from "@/components/AsviorLogo";
import { supabase } from "@/integrations/supabase/client";
import {
  clearRecentSearches,
  flagEmoji,
  getCountryName,
  loadRecentSearches,
  MAX_RECENT_SEARCHES,
  removeRecentSearch,
  type RecentSearch,
} from "@/lib/visa";
import { loadBookmarks } from "@/components/ai-cards";
import { GUEST_STORAGE_SCOPE } from "@/lib/app-session";
import { toast } from "sonner";
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
      title: "Asvior AI",
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
      <div className="home-tool-icon shrink-0">{activity.icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{activity.title}</p>
        <p className="mt-0.5 truncate text-xs leading-relaxed text-muted-foreground">
          {activity.subtitle}
        </p>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
    </>
  );

  const className =
    "home-tool-card !flex-row items-center gap-3 p-4 hover:border-[color-mix(in_oklab,var(--royal)_22%,var(--border))]";

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
      className="home-visa-card transition-colors hover:border-[color-mix(in_oklab,var(--royal)_25%,var(--border))]"
    >
      <div className="flex items-start gap-3 pl-2">
        <span className="text-xl leading-none" aria-hidden>
          {flagEmoji(item.countryCode)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug text-foreground">{item.title}</p>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{item.summary}</p>
          <p className="mt-2.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {formatPublished(item.publishedAt)} · {item.source}
          </p>
        </div>
      </div>
    </Link>
  );
}

function HomePage() {
  const [recent, setRecent] = useState<RecentSearch[]>([]);
  const [storageScope, setStorageScope] = useState(GUEST_STORAGE_SCOPE);
  const [recentSheetOpen, setRecentSheetOpen] = useState(false);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
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

  const homeRecent = useMemo(
    () => recent.slice(0, MAX_RECENT_SEARCHES),
    [recent],
  );

  const handleRemoveRecent = useCallback(
    (item: RecentSearch) => {
      const next = removeRecentSearch(item.passport, item.destination, storageScope);
      setRecent(next);
      toast.success("Removed from recent searches");
    },
    [storageScope],
  );

  const handleClearRecent = useCallback(() => {
    clearRecentSearches(storageScope);
    setRecent([]);
    setClearConfirmOpen(false);
    setRecentSheetOpen(false);
    toast.success("Recent searches cleared");
  }, [storageScope]);

  const refreshContinueState = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    const isSignedIn = !!user;
    setSignedIn(isSignedIn);

    const meta = user?.user_metadata as { full_name?: string; name?: string } | undefined;
    const n = meta?.full_name || meta?.name || user?.email?.split("@")[0] || null;
    setName(n);

    if (!isSignedIn) {
      setStorageScope(GUEST_STORAGE_SCOPE);
      setRecent(loadRecentSearches(GUEST_STORAGE_SCOPE));
      setHasBudget(false);
      setHasChecklist(false);
      setLatestAiBookmark(null);
      return;
    }

    setStorageScope(user.id);
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
    <div className="home-page pb-8">
      <header className="home-header flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 flex-1 items-center">
          <AsviorLogo className="home-header-logo" showTagline={false} />
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          <Link
            to="/settings"
            className="home-header-action inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-foreground"
            aria-label="Open settings"
          >
            <Settings className="h-[1.125rem] w-[1.125rem]" />
          </Link>
          <Link
            to={signedIn ? "/profile" : "/auth"}
            className="home-header-signin inline-flex h-11 items-center px-4 text-sm font-semibold text-primary-foreground"
          >
            {signedIn ? "Profile" : "Sign in"}
          </Link>
        </div>
      </header>

      <section className="home-hero home-enter" aria-label="Welcome">
        <div className="home-hero-decor" aria-hidden="true">
          <div className="home-hero-grid" />
          <div className="home-hero-arc" />
          <div className="home-hero-ring" />
          <div className="home-hero-orb home-hero-orb--blue" />
          <div className="home-hero-orb home-hero-orb--gold" />
        </div>

        <div className="home-hero-content">
          <p className="home-kicker">Your journey starts here</p>
          <h1 className="home-greeting mt-3">
            {greeting}
            {name ? (
              <>
                , <span className="home-greeting-accent">{name.split(" ")[0]}</span>
              </>
            ) : null}
          </h1>
          <p className="home-tagline">
            Visa confidence, smart budgets, and Asvior AI guidance — all in one place.
          </p>

          <Link
            to="/visa-check"
            aria-label="Search destinations, visas, or travel plans"
            className="home-search"
          >
            <span className="home-search-icon">
              <Search className="h-4.5 w-4.5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="home-search-title">Where would you like to go?</p>
              <p className="home-search-subtitle">Destinations, visas, and travel plans</p>
            </div>
          </Link>
        </div>
      </section>

      <div className="home-content home-enter space-y-9 px-4 pt-5" style={{ animationDelay: "80ms" }}>
        <Link to="/assistant" className="home-concierge home-concierge--hero">
          <div className="home-concierge-shine" aria-hidden="true" />
          <div className="home-concierge-mesh" aria-hidden="true" />
          <div className="home-concierge-inner">
            <div className="home-concierge-icon">
              <AsviorMark className="home-concierge-icon-mark" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <span className="home-concierge-badge">Always on</span>
              <p className="home-concierge-title">Asvior AI</p>
              <p className="home-concierge-desc">
                Instant answers for visas, budgets, and trip planning
              </p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-[color-mix(in_oklab,var(--home-gold)_85%,white_15%)]" aria-hidden />
          </div>
        </Link>

        <section aria-labelledby="home-tools-heading">
          <div className="home-section-head">
            <div>
              <p className="home-section-kicker">Essentials</p>
              <h2 id="home-tools-heading" className="home-section-title">
                Travel tools
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ToolCard
              accent="visa"
              to="/visa-check"
              title="Visa Check"
              desc="199 countries"
              icon={<Plane className="h-[1.125rem] w-[1.125rem]" />}
            />
            <ToolCard
              accent="checklist"
              to="/checklist"
              title="Checklist"
              desc="Pre-departure"
              icon={<CheckSquare className="h-[1.125rem] w-[1.125rem]" />}
            />
            <ToolCard
              accent="budget"
              to="/budget-planner"
              title="Budget"
              desc="Plan costs"
              icon={<Wallet className="h-[1.125rem] w-[1.125rem]" />}
            />
            <ToolCard
              accent="explore"
              to="/countries"
              title="Explore"
              desc="Country guides"
              icon={<Globe2 className="h-[1.125rem] w-[1.125rem]" />}
            />
          </div>
        </section>

        {signedIn && continueActivity && (
          <section aria-labelledby="home-continue-heading">
            <div className="home-section-head">
              <div>
                <p className="home-section-kicker">Pick up where you left off</p>
                <h2 id="home-continue-heading" className="home-section-title">
                  Continue planning
                </h2>
              </div>
            </div>
            <ContinuePlanningCard activity={continueActivity} />
          </section>
        )}

        <section aria-labelledby="home-recent-heading">
          <div className="home-section-head">
            <div>
              <p className="home-section-kicker">History</p>
              <h2 id="home-recent-heading" className="home-section-title">
                Recent searches
              </h2>
            </div>
            {recent.length > 0 && (
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRecentSheetOpen(true)}
                  className="home-link-accent"
                >
                  View all
                </button>
                <Link to="/visa-check" className="home-link-accent shrink-0">
                  New search
                </Link>
              </div>
            )}
          </div>
          {homeRecent.length === 0 ? (
            <div className="home-empty-state">No recent destinations yet. Start with a visa check.</div>
          ) : (
            <div className="space-y-2">
              {homeRecent.map((r) => (
                <RecentSearchRow
                  key={`${r.passport}-${r.destination}-${r.timestamp}`}
                  item={r}
                  onRemove={() => handleRemoveRecent(r)}
                />
              ))}
            </div>
          )}
        </section>

        <section aria-labelledby="home-popular-heading">
          <div className="home-section-head">
            <div>
              <p className="home-section-kicker">Curated for you</p>
              <h2 id="home-popular-heading" className="home-section-title">
                Popular destinations
              </h2>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                aria-label="Previous destination"
                onClick={() => popularApi?.scrollPrev()}
                disabled={!canScrollPopularPrev}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card shadow-soft disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next destination"
                onClick={() => popularApi?.scrollNext()}
                disabled={!canScrollPopularNext}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card shadow-soft disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <Link to="/countries" className="home-link-accent ml-1">
                See all
              </Link>
            </div>
          </div>
          <Carousel setApi={setPopularApi} opts={{ align: "start", containScroll: "trimSnaps" }}>
            <CarouselContent className="-ml-3">
              {POPULAR.map((d) => (
                <CarouselItem key={d.code} className="basis-[46%] pl-3 sm:basis-[40%]">
                  <Link
                    to="/country/$code"
                    params={{ code: d.code }}
                    className="home-dest-card group block"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={d.image}
                        alt={d.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      <div className="home-dest-overlay absolute inset-0" />
                      <div className="absolute inset-x-0 bottom-0 p-3">
                        <p className="text-base font-bold tracking-tight text-white drop-shadow-sm">
                          {flagEmoji(d.code)} {d.name}
                        </p>
                        <p className="mt-0.5 text-xs font-medium text-white/80">{d.tagline}</p>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>

        <section aria-labelledby="home-inspiration-heading">
          <div className="home-section-head">
            <div>
              <p className="home-section-kicker">Discover</p>
              <h2 id="home-inspiration-heading" className="home-section-title">
                Travel inspiration
              </h2>
            </div>
            <span className="shrink-0 text-xs font-medium text-muted-foreground">Updated daily</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {dailyTrending.slice(0, 4).map((destination) => (
              <Link
                key={destination.code}
                to="/country/$code"
                params={{ code: destination.code }}
                className="home-dest-card group"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={TRENDING_IMAGES[destination.imageIndex]}
                    alt={destination.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="home-dest-overlay absolute inset-0" />
                  <p className="absolute bottom-3 left-3 right-3 truncate text-sm font-bold tracking-tight text-white drop-shadow-sm">
                    {flagEmoji(destination.code)} {destination.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="home-visa-heading">
          <div className="home-section-head">
            <div>
              <p className="home-section-kicker">Stay informed</p>
              <h2 id="home-visa-heading" className="home-section-title">
                Latest visa updates
              </h2>
            </div>
          </div>
          <div className="space-y-2.5">
            {visaUpdates.slice(0, 4).map((item) => (
              <VisaUpdateCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <footer className="border-t border-border/80 pt-5 text-center">
          <nav
            aria-label="Legal"
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground"
          >
            <Link to="/about" className="font-medium hover:text-foreground">
              About
            </Link>
            <Link to="/privacy" className="font-medium hover:text-foreground">
              Privacy
            </Link>
            <Link to="/terms" className="font-medium hover:text-foreground">
              Terms
            </Link>
            <Link to="/contact" className="font-medium hover:text-foreground">
              Contact
            </Link>
            <Link to="/support" className="font-medium hover:text-foreground">
              Support
            </Link>
          </nav>
        </footer>
      </div>

      {recentSheetOpen && (
        <RecentSearchesSheet
          items={recent}
          onClose={() => setRecentSheetOpen(false)}
          onClear={() => setClearConfirmOpen(true)}
          onRemove={handleRemoveRecent}
        />
      )}

      <AlertDialog open={clearConfirmOpen} onOpenChange={setClearConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear search history?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes all recent destination searches from this device. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearRecent}>Clear history</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function RecentSearchRow({
  item,
  onRemove,
}: {
  item: RecentSearch;
  onRemove: () => void;
}) {
  const [offsetX, setOffsetX] = useState(0);
  const offsetRef = useRef(0);
  const startX = useRef(0);
  const swiping = useRef(false);

  const resetSwipe = () => {
    offsetRef.current = 0;
    setOffsetX(0);
    swiping.current = false;
  };

  return (
    <div className="relative overflow-hidden rounded-[1.25rem]">
      <div
        className="absolute inset-y-0 right-0 flex w-24 items-center justify-center bg-destructive text-destructive-foreground"
        aria-hidden
      >
        <Trash2 className="h-4 w-4" />
      </div>
      <div
        className="relative touch-pan-y"
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: swiping.current ? "none" : "transform 200ms ease",
        }}
        onTouchStart={(e) => {
          startX.current = e.touches[0]?.clientX ?? 0;
          swiping.current = true;
        }}
        onTouchMove={(e) => {
          if (!swiping.current) return;
          const delta = (e.touches[0]?.clientX ?? 0) - startX.current;
          const next = Math.max(-96, Math.min(0, delta));
          offsetRef.current = next;
          setOffsetX(next);
        }}
        onTouchEnd={() => {
          swiping.current = false;
          if (offsetRef.current < -48) {
            onRemove();
            resetSwipe();
            return;
          }
          resetSwipe();
        }}
      >
        <Link
          to="/country/$code"
          params={{ code: item.destination }}
          className="home-recent-row home-tool-card !flex-row items-center gap-3 p-3.5"
        >
          <span className="text-lg leading-none" aria-hidden>
            {flagEmoji(item.destination)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {getCountryName(item.destination)}
            </p>
            <p className="text-xs text-muted-foreground">{item.status}</p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary/80 hover:text-destructive"
            aria-label={`Remove ${getCountryName(item.destination)} from recent searches`}
          >
            <X className="h-4 w-4" />
          </button>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        </Link>
      </div>
    </div>
  );
}

function RecentSearchesSheet({
  items,
  onClose,
  onClear,
  onRemove,
}: {
  items: RecentSearch[];
  onClose: () => void;
  onClear: () => void;
  onRemove: (item: RecentSearch) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-background/50" />
      <div
        className="premium-card relative max-h-[80vh] w-full overflow-y-auto rounded-t-2xl p-4 sm:max-w-md sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold">Recent searches</h2>
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
        {items.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">No recent searches yet.</p>
        ) : (
          <>
            <ul className="space-y-2">
              {items.map((r) => (
                <li key={`${r.passport}-${r.destination}-${r.timestamp}`}>
                  <div className="home-tool-card !flex-row items-center gap-3 p-3.5">
                    <Link
                      to="/country/$code"
                      params={{ code: r.destination }}
                      onClick={onClose}
                      className="flex min-w-0 flex-1 items-center gap-3"
                    >
                      <span className="text-lg leading-none" aria-hidden>
                        {flagEmoji(r.destination)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {getCountryName(r.destination)}
                        </p>
                        <p className="text-xs text-muted-foreground">{r.status}</p>
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={() => onRemove(r)}
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      aria-label={`Remove ${getCountryName(r.destination)}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={onClear}
              className="mt-4 w-full rounded-xl border border-border px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/5"
            >
              Clear history
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function ToolCard({
  to,
  title,
  desc,
  icon,
  accent,
}: {
  to: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  accent: "visa" | "checklist" | "budget" | "explore";
}) {
  return (
    <Link to={to} className={`home-tool-card home-tool-card--${accent}`}>
      <div className="home-tool-icon">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
      </div>
    </Link>
  );
}
