import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Plane,
  CheckSquare,
  Wallet,
  ArrowRight,
  Search,
  BookOpen,
  Compass,
  Trash2,
  X,
  Sparkles,
  Globe2,
  TrendingUp,
} from "lucide-react";
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
import { TopBar, EmptyState, ProfileAvatar } from "@/components/asvior";
import { COUNTRY_PROFILES } from "@/data/country-profiles";
import { getCountryHeroImage } from "@/lib/country-image";
import {
  clearRecentSearches,
  flagEmoji,
  getCountryName,
  getVisaRequirement,
  loadRecentSearches,
  loadSavedPassport,
  MAX_RECENT_SEARCHES,
  removeRecentSearch,
  type RecentSearch,
} from "@/lib/visa";
import { loadBookmarks } from "@/components/ai-cards";
import { GUEST_STORAGE_SCOPE } from "@/lib/app-session";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/lib/i18n";
import { usePreferredCurrency } from "@/lib/use-preferred-currency";
import { stashPendingAiPrompt } from "@/lib/ai-prompt";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Asvior — Where will AI take you?" },
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

const POPULAR_DESTINATIONS = [
  { code: "JP", city: "Kyoto", country: "Japan" },
  { code: "GR", city: "Santorini", country: "Greece" },
  { code: "FR", city: "Paris", country: "France" },
  { code: "IT", city: "Rome", country: "Italy" },
  { code: "TH", city: "Bangkok", country: "Thailand" },
  { code: "US", city: "New York", country: "United States" },
] as const;

const EASY_ENTRY_DESTINATIONS = [
  { code: "AE", city: "Dubai", budget: 185 },
  { code: "ID", city: "Ubud", budget: 75 },
  { code: "PT", city: "Lisbon", budget: 110 },
  { code: "IS", city: "Reykjavík", budget: 240 },
  { code: "MA", city: "Marrakech", budget: 85 },
] as const;

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

function greetingKeyFor(date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return "greeting.morning";
  if (h < 17) return "greeting.afternoon";
  return "greeting.evening";
}

function countryImage(code: string): string {
  return getCountryHeroImage(code);
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
      icon: <Plane className="h-5 w-5" />,
    });
    candidates.push({
      kind: "country",
      title: `${flagEmoji(latestSearch.destination)} ${toName} country guide`,
      subtitle: "Continue from your last viewed destination",
      timestamp: latestSearch.timestamp + 1,
      code: latestSearch.destination,
      icon: <Compass className="h-5 w-5" />,
    });
  }

  if (hasBudget) {
    candidates.push({
      kind: "budget",
      title: "Budget planner",
      subtitle: "Continue estimating costs for your trip",
      timestamp: 1,
      icon: <Wallet className="h-5 w-5" />,
    });
  }

  if (hasChecklist) {
    candidates.push({
      kind: "checklist",
      title: "Travel checklist",
      subtitle: "Resume your pre-departure checklist",
      timestamp: 1,
      icon: <BookOpen className="h-5 w-5" />,
    });
  }

  if (aiBookmark) {
    candidates.push({
      kind: "ai",
      title: "Asvior AI",
      subtitle: aiBookmark.title || "Continue where your last chat ended",
      timestamp: aiBookmark.createdAt,
      icon: <Sparkles className="h-5 w-5" />,
    });
  }

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.timestamp - a.timestamp);
  return candidates[0];
}

function DiscoverChipCard({
  code,
  city,
  country,
}: {
  code: string;
  city: string;
  country: string;
}) {
  const image = countryImage(code);

  return (
    <Link to="/country/$code" params={{ code }} className="asv-discover-chip">
      <div className="asv-discover-chip-photo">
        <img src={image} alt={city} loading="lazy" />
      </div>
      <p className="asv-discover-chip-name">{city}</p>
      <p className="asv-discover-chip-meta">{country}</p>
    </Link>
  );
}

function EasyEntryCard({
  code,
  city,
  budget,
  formatMoney,
}: {
  code: string;
  city: string;
  budget: number;
  formatMoney: (amount: number, opts?: { fromUsd?: boolean; compact?: boolean }) => string;
}) {
  const image = countryImage(code);
  const daily = formatMoney(budget, { fromUsd: true, compact: true });

  return (
    <Link
      to="/country/$code"
      params={{ code }}
      className="asv-discover-chip !w-[140px]"
    >
      <div className="asv-discover-chip-photo relative !aspect-[4/5]">
        <img src={image} alt={city} loading="lazy" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2.5 pt-8">
          <p className="text-sm font-bold text-white">{city}</p>
          <p className="text-xs font-semibold text-white/80">{daily} /day</p>
        </div>
      </div>
    </Link>
  );
}

function FeaturedTripCard({
  activity,
  t,
}: {
  activity: ContinueActivity;
  t: (key: string) => string;
}) {
  const image =
    activity.kind === "country"
      ? countryImage(activity.code)
      : countryImage("JP");

  const content = (
    <>
      <img src={image} alt="" loading="lazy" />
      <div className="asv-trip-featured-overlay" aria-hidden />
      <div className="asv-trip-featured-body">
        <p className="asv-trip-featured-dates">{t("home.pickUp")}</p>
        <p className="asv-trip-featured-title">{activity.title.replace(/^[^\s]+\s/, "")}</p>
      </div>
    </>
  );

  if (activity.kind === "visa") {
    return (
      <Link to="/visa-check" className="asv-trip-featured">
        {content}
      </Link>
    );
  }
  if (activity.kind === "country") {
    return (
      <Link to="/country/$code" params={{ code: activity.code }} className="asv-trip-featured">
        {content}
      </Link>
    );
  }
  if (activity.kind === "budget") {
    return (
      <Link to="/budget-planner" className="asv-trip-featured">
        {content}
      </Link>
    );
  }
  if (activity.kind === "checklist") {
    return (
      <Link to="/checklist" className="asv-trip-featured">
        {content}
      </Link>
    );
  }
  return (
    <Link to="/assistant" className="asv-trip-featured">
      {content}
    </Link>
  );
}

function HomePage() {
  const t = useT();
  const navigate = useNavigate();
  const { format: formatMoney } = usePreferredCurrency();
  const [recent, setRecent] = useState<RecentSearch[]>([]);
  const [storageScope, setStorageScope] = useState(GUEST_STORAGE_SCOPE);
  const [recentSheetOpen, setRecentSheetOpen] = useState(false);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [hasBudget, setHasBudget] = useState(false);
  const [hasChecklist, setHasChecklist] = useState(false);
  const [latestAiBookmark, setLatestAiBookmark] = useState<BookmarkSnapshot | null>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [homeNow, setHomeNow] = useState<Date | null>(null);
  const greeting = useMemo(
    () => (homeNow ? t(greetingKeyFor(homeNow)) : t("greeting.welcome")),
    [homeNow, t],
  );
  const continueActivity = useMemo(
    () => buildContinueActivity(recent, hasBudget, hasChecklist, signedIn ? latestAiBookmark : null),
    [signedIn, recent, hasBudget, hasChecklist, latestAiBookmark],
  );

  const hasUserActivity = useMemo(
    () => !!continueActivity || recent.length > 0 || hasBudget || hasChecklist,
    [continueActivity, recent.length, hasBudget, hasChecklist],
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

  const handleAiPrompt = useCallback(
    (prompt: string) => {
      stashPendingAiPrompt(prompt);
      void navigate({ to: "/assistant", search: { q: prompt } });
    },
    [navigate],
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
      setStorageScope(GUEST_STORAGE_SCOPE);
      setRecent(loadRecentSearches(GUEST_STORAGE_SCOPE));
      try {
        const b = localStorage.getItem("vp_budget");
        const c = localStorage.getItem("vp_checklist");
        setHasBudget(!!b);
        setHasChecklist(!!c && c !== "[]");
      } catch {
        setHasBudget(false);
        setHasChecklist(false);
      }
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

  return (
    <div className="asv-page asv-page--home">
      <section className="asv-hero" aria-label="Welcome">
        <img src="/hero-sunrise.jpg" alt="" className="asv-hero-bg" />
        <div className="asv-hero-fade" aria-hidden />
        <TopBar
          variant="hero"
          showMark={false}
          right={
            <ProfileAvatar to={signedIn ? "/profile" : "/auth"} variant="hero" />
          }
        />
        <div className="asv-hero-body asv-page-pad">
          <p className="asv-hero-greeting">
            {greeting}
            {name ? `, ${name.split(" ")[0]}` : ""}
          </p>
          <h1 className="asv-hero-headline">{t("home.headline")}</h1>
          <Link
            to="/countries"
            className="asv-hero-search"
            aria-label={t("home.searchPlaceholder")}
          >
            <Search className="asv-hero-search-icon" aria-hidden />
            <span className="asv-hero-search-text">{t("home.searchPlaceholder")}</span>
          </Link>
        </div>
      </section>

      <div className="asv-stagger asv-home-body">
        <section className="asv-page-pad asv-section !mt-0" aria-label="Live AI insight">
          <div className="asv-live-insight">
            <div className="asv-live-insight-kicker">
              <span className="asv-live-insight-dots" aria-hidden>
                <span /><span /><span />
              </span>
              {t("home.liveInsight")}
            </div>
            <p className="asv-live-insight-text">{t("home.liveInsightMessage")}</p>
            <div className="asv-live-insight-actions">
              <Link to="/assistant" className="asv-live-insight-btn asv-live-insight-btn--primary">
                {t("home.optimise")}
              </Link>
              <Link to="/countries" className="asv-live-insight-btn asv-live-insight-btn--ghost">
                {t("home.showMore")}
              </Link>
            </div>
          </div>
        </section>

        <section className="asv-page-pad asv-section" aria-label={t("home.quickActions")}>
          <div className="asv-quick-grid">
            <Link to="/visa-check" className="asv-quick-grid-item">
              <span className="asv-quick-grid-icon asv-quick-grid-icon--visa">
                <Plane className="h-5 w-5" />
              </span>
              <span className="asv-quick-grid-label">{t("home.visaCheck")}</span>
            </Link>
            <Link to="/budget-planner" className="asv-quick-grid-item">
              <span className="asv-quick-grid-icon asv-quick-grid-icon--budget">
                <Wallet className="h-5 w-5" />
              </span>
              <span className="asv-quick-grid-label">{t("home.budget")}</span>
            </Link>
            <Link to="/checklist" className="asv-quick-grid-item">
              <span className="asv-quick-grid-icon asv-quick-grid-icon--checklist">
                <CheckSquare className="h-5 w-5" />
              </span>
              <span className="asv-quick-grid-label">{t("home.checklist")}</span>
            </Link>
            <Link to="/trips" className="asv-quick-grid-item">
              <span className="asv-quick-grid-icon asv-quick-grid-icon--itinerary">
                <BookOpen className="h-5 w-5" />
              </span>
              <span className="asv-quick-grid-label">{t("home.itinerary")}</span>
            </Link>
          </div>
        </section>

        {hasUserActivity && continueActivity ? (
          <section className="asv-page-pad asv-section" aria-label={t("home.upcomingTrip")}>
            <div className="asv-section-head !mb-3">
              <h2 className="asv-title">{t("home.upcomingTrip")}</h2>
            </div>
            <FeaturedTripCard activity={continueActivity} t={t} />
          </section>
        ) : (
          <section className="asv-page-pad asv-section" aria-label={t("home.welcomeTitle")}>
            <div className="asv-welcome-card">
              <p className="asv-overline">{t("home.welcomeKicker")}</p>
              <h2 className="asv-title mt-2">{t("home.welcomeTitle")}</h2>
              <p className="asv-subtitle mt-1.5">{t("home.welcomeSubtitle")}</p>
              <div className="asv-welcome-actions mt-5">
                <Link to="/trips" className="asv-btn asv-btn-primary w-full">
                  {t("home.planFirstTrip")}
                </Link>
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/visa-check" className="asv-btn asv-btn-secondary w-full">
                    {t("home.visaCheck")}
                  </Link>
                  <Link to="/budget-planner" className="asv-btn asv-btn-secondary w-full">
                    {t("home.budget")}
                  </Link>
                </div>
                <Link to="/countries" className="asv-btn asv-btn-secondary w-full">
                  {t("home.exploreDestinations")}
                </Link>
              </div>
            </div>
          </section>
        )}

        <section className="asv-section" aria-labelledby="home-popular-heading">
          <div className="asv-section-head asv-page-pad">
            <h2 id="home-popular-heading" className="asv-title">
              {t("home.popular")}
            </h2>
            <Link to="/countries" className="asv-section-link">
              {t("home.exploreAll")}
            </Link>
          </div>
          <div className="asv-discover-strip asv-page-pad">
            {POPULAR_DESTINATIONS.map((dest) => (
              <DiscoverChipCard
                key={dest.code}
                code={dest.code}
                city={dest.city}
                country={dest.country}
              />
            ))}
          </div>
        </section>

        <section className="asv-section" aria-labelledby="home-easy-entry-heading">
          <div className="asv-section-head asv-page-pad">
            <h2 id="home-easy-entry-heading" className="asv-title">
              {t("home.easyEntry")}
            </h2>
            <Link to="/visa-check" className="asv-section-link">
              {t("home.visaHub")}
            </Link>
          </div>
          <div className="asv-discover-strip asv-page-pad">
            {EASY_ENTRY_DESTINATIONS.map((dest) => (
              <EasyEntryCard
                key={dest.code}
                code={dest.code}
                city={dest.city}
                budget={dest.budget}
                formatMoney={formatMoney}
              />
            ))}
          </div>
        </section>

        <section className="asv-page-pad asv-section" aria-label={t("home.travelInspiration")}>
          <Link to="/assistant" className="asv-ai-banner block">
            <div className="relative z-[1]">
              <span className="asv-label !text-white/70">{t("home.travelInspiration")}</span>
              <p className="asv-headline mt-2 !text-white">{t("home.inspirationTagline")}</p>
            </div>
            <span className="relative z-[1] mt-4 inline-flex asv-btn asv-btn-sm bg-white/15 !text-white hover:bg-white/25">
              {t("home.buildWithAi")} <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
          {hasUserActivity && recent.length > 0 ? (
            <div className="asv-insights mt-4">
              <div className="asv-insight">
                <p className="asv-insight-value">{recent.length}</p>
                <p className="asv-insight-label">{t("home.recent")}</p>
              </div>
            </div>
          ) : null}
        </section>
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
            <AlertDialogTitle>{t("home.clearConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("home.clearConfirmDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("home.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearRecent}>{t("home.clearHistory")}</AlertDialogAction>
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
    <div className="relative overflow-hidden">
      <div
        className="absolute inset-y-0 right-0 flex w-24 items-center justify-center bg-[var(--asv-danger)] text-white"
        aria-hidden
      >
        <Trash2 className="h-4 w-4" />
      </div>
      <div
        className="relative touch-pan-y bg-[var(--asv-surface)]"
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
          className="asv-row !border-b-[var(--asv-divider)]"
        >
          <div className="asv-row-icon text-lg">{flagEmoji(item.destination)}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[var(--asv-ink)]">
              {getCountryName(item.destination)}
            </p>
            <p className="text-xs text-[var(--asv-ink-secondary)]">{item.status}</p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
            className="asv-btn-icon !min-h-8 !min-w-8 shrink-0"
            aria-label={`Remove ${getCountryName(item.destination)} from recent searches`}
          >
            <X className="h-4 w-4" />
          </button>
          <ArrowRight className="h-4 w-4 shrink-0 text-[var(--asv-ink-tertiary)]" aria-hidden />
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
      <div className="absolute inset-0 bg-[var(--asv-ink)]/40 backdrop-blur-sm" />
      <div
        className="asv-onboard-slide relative max-h-[80vh] overflow-y-auto sm:max-w-md sm:rounded-[var(--asv-radius-2xl)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="asv-title">Recent searches</h2>
          <button
            onClick={onClose}
            className="asv-btn-icon !min-h-8 !min-w-8"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {items.length === 0 ? (
          <p className="asv-subtitle py-10 text-center">No recent searches yet.</p>
        ) : (
          <>
            <ul className="space-y-2">
              {items.map((r) => (
                <li key={`${r.passport}-${r.destination}-${r.timestamp}`}>
                  <div className="asv-card asv-row !rounded-[var(--asv-radius-lg)] px-4">
                    <Link
                      to="/country/$code"
                      params={{ code: r.destination }}
                      onClick={onClose}
                      className="flex min-w-0 flex-1 items-center gap-3 no-underline text-inherit"
                    >
                      <div className="asv-row-icon text-lg">{flagEmoji(r.destination)}</div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[var(--asv-ink)]">
                          {getCountryName(r.destination)}
                        </p>
                        <p className="text-xs text-[var(--asv-ink-secondary)]">{r.status}</p>
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={() => onRemove(r)}
                      className="asv-btn-icon !min-h-9 !min-w-9 shrink-0"
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
              className="asv-btn asv-btn-secondary mt-4 w-full !text-[var(--asv-danger)]"
            >
              Clear history
            </button>
          </>
        )}
      </div>
    </div>
  );
}
