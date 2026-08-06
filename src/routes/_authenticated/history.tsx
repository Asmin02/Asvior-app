import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Compass,
  Heart,
  History,
  Luggage,
  MessageCircle,
  Plane,
  Trash2,
  WifiOff,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  EmptyStateCard,
  LoadingSkeleton,
  PageBadge,
  PageHeader,
  PageShell,
} from "@/components/PageShell";
import { loadBookmarks, removeBookmark, type BookmarkedConversation } from "@/components/ai-cards";
import { buildScopedStorageKey } from "@/lib/app-session";
import { loadRecentSearches, type RecentSearch } from "@/lib/visa";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/history")({
  head: () => ({ meta: [{ title: "Travel History — Asvior" }] }),
  component: HistoryPage,
});

function getCountryName(code: string) {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code;
  } catch {
    return code;
  }
}

interface HistoryRow {
  id: string;
  passport_code: string;
  destination_code: string;
  status: string;
  created_at: string;
}
interface TripRow {
  id: string;
  name: string;
  destination_code: string | null;
  created_at: string;
}

interface FavoriteRow {
  id: string;
  country_code: string;
  created_at: string;
}

type HistoryTab = "all" | "visa" | "trips" | "recent" | "ai" | "favorites";

type HistoryItem = {
  key: string;
  id: string;
  kind: Exclude<HistoryTab, "all">;
  createdAt: number;
  title: string;
  subtitle: string;
  status?: string;
  destinationCode?: string;
  payload?: unknown;
};

const SCOPED_CHAT_KEY = "vp_ai_chat_v1";
const SCOPED_RECENT_KEY = "vp_recent_searches";

function toTimestamp(iso: string): number {
  const time = new Date(iso).getTime();
  return Number.isFinite(time) ? time : 0;
}

function saveRecentSearches(scope: string, items: RecentSearch[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(buildScopedStorageKey(SCOPED_RECENT_KEY, scope), JSON.stringify(items));
  } catch {
    // Ignore local write failures to avoid blocking UI.
  }
}

function HistoryPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [checks, setChecks] = useState<HistoryRow[]>([]);
  const [trips, setTrips] = useState<TripRow[]>([]);
  const [favorites, setFavorites] = useState<FavoriteRow[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkedConversation[]>([]);
  const [tab, setTab] = useState<HistoryTab>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const load = useCallback(async () => {
    setLoadError(false);
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      setChecks([]);
      setTrips([]);
      setFavorites([]);
      setRecentSearches([]);
      setBookmarks([]);
      setUserId(null);
      setLoading(false);
      return;
    }

    const uid = userData.user.id;
    setUserId(uid);

    const [checksRes, tripsRes, favoritesRes] = await Promise.all([
      supabase
        .from("visa_history")
        .select("*")
        .eq("user_id", uid)
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("saved_trips")
        .select("id, name, destination_code, created_at")
        .eq("user_id", uid)
        .order("created_at", { ascending: false }),
      supabase
        .from("favorite_destinations")
        .select("id, country_code, created_at")
        .eq("user_id", uid)
        .order("created_at", { ascending: false }),
    ]);
    if (checksRes.error || tripsRes.error || favoritesRes.error) {
      setLoadError(true);
      setLoading(false);
      return;
    }

    setChecks((checksRes.data as HistoryRow[]) || []);
    setTrips((tripsRes.data as TripRow[]) || []);
    setFavorites((favoritesRes.data as FavoriteRow[]) || []);
    setRecentSearches(loadRecentSearches(uid));
    setBookmarks(loadBookmarks(uid));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const allItems = useMemo<HistoryItem[]>(() => {
    const visaItems: HistoryItem[] = checks.map((row) => ({
      key: `visa:${row.id}`,
      id: row.id,
      kind: "visa",
      createdAt: toTimestamp(row.created_at),
      title: `${getCountryName(row.passport_code)} → ${getCountryName(row.destination_code)}`,
      subtitle: "Visa check",
      status: row.status,
      destinationCode: row.destination_code,
    }));

    const tripItems: HistoryItem[] = trips.map((row) => ({
      key: `trip:${row.id}`,
      id: row.id,
      kind: "trips",
      createdAt: toTimestamp(row.created_at),
      title: row.name,
      subtitle: row.destination_code ? `${getCountryName(row.destination_code)}` : "Saved trip",
      destinationCode: row.destination_code || undefined,
    }));

    const favoriteItems: HistoryItem[] = favorites.map((row) => ({
      key: `favorite:${row.id}`,
      id: row.id,
      kind: "favorites",
      createdAt: toTimestamp(row.created_at),
      title: `${getCountryName(row.country_code)}`,
      subtitle: "Saved country",
      destinationCode: row.country_code,
    }));

    const recentItems: HistoryItem[] = recentSearches.map((row) => ({
      key: `recent:${row.passport}-${row.destination}-${row.timestamp}`,
      id: `${row.passport}-${row.destination}-${row.timestamp}`,
      kind: "recent",
      createdAt: row.timestamp,
      title: `${getCountryName(row.passport)} → ${getCountryName(row.destination)}`,
      subtitle: "Recent local search",
      status: row.status,
      destinationCode: row.destination,
      payload: row,
    }));

    const aiItems: HistoryItem[] = bookmarks.map((row) => ({
      key: `ai:${row.id}`,
      id: row.id,
      kind: "ai",
      createdAt: row.createdAt,
      title: row.title || "AI conversation",
      subtitle: row.preview || "Saved AI chat",
      payload: row,
    }));

    return [...visaItems, ...tripItems, ...favoriteItems, ...recentItems, ...aiItems].sort(
      (a, b) => b.createdAt - a.createdAt,
    );
  }, [bookmarks, checks, favorites, recentSearches, trips]);

  const visibleItems = useMemo(
    () => (tab === "all" ? allItems : allItems.filter((item) => item.kind === tab)),
    [allItems, tab],
  );

  const selectedItems = useMemo(
    () => visibleItems.filter((item) => selected.has(item.key)),
    [selected, visibleItems],
  );

  const toggleSelected = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const clearSelection = () => setSelected(new Set());

  const deleteItems = async (items: HistoryItem[]) => {
    if (!userId || items.length === 0) return;
    setProcessing(true);
    try {
      const visaIds = items.filter((item) => item.kind === "visa").map((item) => item.id);
      const tripIds = items.filter((item) => item.kind === "trips").map((item) => item.id);
      const favoriteIds = items.filter((item) => item.kind === "favorites").map((item) => item.id);
      const recentIds = new Set(
        items.filter((item) => item.kind === "recent").map((item) => item.id),
      );
      const aiIds = items.filter((item) => item.kind === "ai").map((item) => item.id);

      if (visaIds.length > 0) {
        await supabase.from("visa_history").delete().eq("user_id", userId).in("id", visaIds);
      }
      if (tripIds.length > 0) {
        await supabase.from("saved_trips").delete().eq("user_id", userId).in("id", tripIds);
      }
      if (favoriteIds.length > 0) {
        await supabase
          .from("favorite_destinations")
          .delete()
          .eq("user_id", userId)
          .in("id", favoriteIds);
      }

      if (recentIds.size > 0) {
        const nextRecent = recentSearches.filter(
          (row) => !recentIds.has(`${row.passport}-${row.destination}-${row.timestamp}`),
        );
        setRecentSearches(nextRecent);
        saveRecentSearches(userId, nextRecent);
      }

      if (aiIds.length > 0) {
        aiIds.forEach((id) => removeBookmark(id, userId));
        setBookmarks(loadBookmarks(userId));
      }

      clearSelection();
      await load();
      toast.success(items.length === 1 ? "History item deleted" : "History updated");
    } catch (error) {
      void error;
      toast.error("Couldn't update history. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const restoreAiConversation = (item: HistoryItem) => {
    if (!userId || item.kind !== "ai") return;
    const bookmark = item.payload as BookmarkedConversation;
    try {
      localStorage.setItem(
        buildScopedStorageKey(SCOPED_CHAT_KEY, userId),
        JSON.stringify(bookmark.messages || []),
      );
      toast.success("Conversation restored");
      navigate({ to: "/assistant" });
    } catch {
      toast.error("Couldn't restore conversation");
    }
  };

  return (
    <PageShell className="pb-6">
      <PageHeader
        badge={<PageBadge icon={<History className="h-3.5 w-3.5" />}>Unified activity</PageBadge>}
        title="Travel History"
        subtitle="Manage all your travel activity in one place."
      />

      <div className="relative mt-5 space-y-2 px-4">
        <div
          className="premium-pill grid grid-cols-3 gap-1.5 p-1.5"
          role="tablist"
          aria-label="History type"
        >
          {(
            [
              ["all", "All"],
              ["recent", "Recent"],
              ["ai", "AI"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              role="tab"
              aria-selected={tab === value}
              onClick={() => {
                setTab(value);
                clearSelection();
              }}
              className={`rounded-2xl py-2 text-xs font-semibold transition-colors ${
                tab === value
                  ? "bg-navy text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div
          className="premium-pill grid grid-cols-3 gap-1.5 p-1.5"
          role="tablist"
          aria-label="History type secondary"
        >
          {(
            [
              ["visa", "Visa"],
              ["trips", "Trips"],
              ["favorites", "Favorites"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              role="tab"
              aria-selected={tab === value}
              onClick={() => {
                setTab(value);
                clearSelection();
              }}
              className={`rounded-2xl py-2 text-xs font-semibold transition-colors ${
                tab === value
                  ? "bg-navy text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {!loading && !loadError && visibleItems.length > 0 && (
        <div className="relative mt-3 flex flex-wrap items-center gap-2 px-4">
          <Button
            size="sm"
            variant="outline"
            className="rounded-2xl"
            onClick={() => {
              if (selected.size === visibleItems.length) {
                clearSelection();
                return;
              }
              setSelected(new Set(visibleItems.map((item) => item.key)));
            }}
          >
            {selected.size === visibleItems.length ? "Deselect all" : "Select all"}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="rounded-2xl"
            disabled={selectedItems.length === 0 || processing}
            onClick={() => void deleteItems(selectedItems)}
          >
            Delete selected
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-2xl"
            disabled={visibleItems.length === 0 || processing}
            onClick={() => void deleteItems(visibleItems)}
          >
            Clear current tab
          </Button>
        </div>
      )}

      <div className="relative mt-4 space-y-2.5 px-4">
        {loading ? (
          <LoadingSkeleton rows={4} />
        ) : loadError ? (
          <EmptyStateCard
            icon={<WifiOff className="h-6 w-6 text-muted-foreground" />}
            title="Couldn't load your history"
            description="Check your connection and try again."
            action={
              <Button
                variant="outline"
                size="sm"
                className="rounded-2xl"
                onClick={() => {
                  setLoading(true);
                  void load();
                }}
              >
                Retry
              </Button>
            }
          />
        ) : visibleItems.length === 0 ? (
          <EmptyStateCard
            icon={<Plane className="h-6 w-6 text-primary" />}
            title="No travel history yet"
            description="Start exploring and your activity will appear here."
            action={
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-2xl bg-navy px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-soft"
              >
                Start Exploring
              </Link>
            }
          />
        ) : (
          visibleItems.map((item, i) => {
            const isSelected = selected.has(item.key);
            return (
              <div
                key={item.key}
                className="premium-card animate-fade-in rounded-2xl p-4 transition-transform"
                style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleSelected(item.key)}
                    aria-label={isSelected ? "Deselect history item" : "Select history item"}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all active:scale-90 ${
                      isSelected
                        ? "bg-navy text-primary-foreground shadow-soft"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isSelected ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Clock3 className="h-4 w-4" />
                    )}
                  </button>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-lg">
                    {item.kind === "favorites" && <Heart className="h-4 w-4 text-rose-500" />}
                    {item.kind === "ai" && <MessageCircle className="h-4 w-4 text-primary" />}
                    {(item.kind === "visa" || item.kind === "recent") && (
                      <Compass className="h-4 w-4 text-primary" />
                    )}
                    {item.kind === "trips" && <Luggage className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-foreground">{item.title}</p>
                    <p className="text-[11px] text-muted-foreground">{item.subtitle}</p>
                    <p className="text-[10px] font-medium text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {item.status && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                        {item.status}
                      </span>
                    )}
                    {item.destinationCode && (
                      <Link
                        to="/country/$code"
                        params={{ code: item.destinationCode }}
                        className="premium-pill rounded-xl px-2.5 py-1 text-[10px] font-semibold"
                      >
                        Open
                      </Link>
                    )}
                    {item.kind === "ai" && (
                      <button
                        onClick={() => restoreAiConversation(item)}
                        className="premium-pill rounded-xl px-2.5 py-1 text-[10px] font-semibold"
                      >
                        Open
                      </button>
                    )}
                    <button
                      onClick={() => void deleteItems([item])}
                      className="premium-pill flex h-8 w-8 items-center justify-center rounded-xl text-destructive"
                      aria-label="Delete history item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </PageShell>
  );
}
