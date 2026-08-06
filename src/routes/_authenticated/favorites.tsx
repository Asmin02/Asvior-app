import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Globe2, Heart, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CountryCombobox, type CountryOption } from "@/components/CountryCombobox";
import { VISA_CODES } from "@/data/visa-data";
import { Button } from "@/components/ui/button";
import {
  EmptyStateCard,
  LoadingSkeleton,
  PageBadge,
  PageHeader,
  PageShell,
} from "@/components/PageShell";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/favorites")({
  head: () => ({ meta: [{ title: "Favorite Destinations — ASVIOR" }] }),
  component: FavoritesPage,
});

function getCountryName(code: string) {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code;
  } catch {
    return code;
  }
}

const OPTIONS: CountryOption[] = VISA_CODES.map((c) => ({ code: c, name: getCountryName(c) })).sort(
  (a, b) => a.name.localeCompare(b.name),
);

function FavoritesPage() {
  const [favs, setFavs] = useState<string[]>([]);
  const [adding, setAdding] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoadError(false);
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      setFavs([]);
      setLoading(false);
      return;
    }
    setUserId(userData.user.id);

    const { data, error } = await supabase
      .from("favorite_destinations")
      .select("country_code")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });
    if (error) {
      setLoadError(true);
      setLoading(false);
      return;
    }
    setFavs((data || []).map((r: { country_code: string }) => r.country_code));
    setLoading(false);
  };

  const add = async () => {
    if (!adding || !userId) return;
    const { error } = await supabase
      .from("favorite_destinations")
      .insert({ user_id: userId, country_code: adding });
    if (error && !error.message.includes("duplicate")) toast.error(error.message);
    else toast.success(`Added ${getCountryName(adding)}`);
    setAdding("");
    load();
  };

  const remove = async (code: string) => {
    if (!userId) return;
    const { error } = await supabase
      .from("favorite_destinations")
      .delete()
      .eq("user_id", userId)
      .eq("country_code", code);
    if (error) {
      toast.error("Couldn't remove — check your connection and try again.");
      return;
    }
    load();
  };

  return (
    <PageShell className="pb-6">
      <PageHeader
        badge={
          <PageBadge icon={<Heart className="h-3.5 w-3.5" />}>
            {favs.length} saved {favs.length === 1 ? "destination" : "destinations"}
          </PageBadge>
        }
        title="Favorites"
        subtitle="Quick-access list of countries you love."
      />

      <section className="relative mt-6 animate-fade-in px-4">
        <div className="premium-card rounded-3xl p-5">
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Add a country
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <CountryCombobox
                value={adding}
                onChange={setAdding}
                options={OPTIONS}
                placeholder="Search country..."
              />
            </div>
            <Button onClick={add} disabled={!adding} size="icon" aria-label="Add favorite">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="relative mt-5 px-4">
        {loading ? (
          <LoadingSkeleton rows={4} />
        ) : loadError ? (
          <EmptyStateCard
            icon="📡"
            title="Couldn't load your favorites"
            description="Check your connection and try again."
            action={
              <Button
                variant="outline"
                size="sm"
                className="rounded-2xl"
                onClick={() => {
                  setLoading(true);
                  load();
                }}
              >
                Retry
              </Button>
            }
          />
        ) : favs.length === 0 ? (
          <EmptyStateCard
            icon={<Globe2 className="h-7 w-7 text-navy" />}
            title="No favorites yet"
            description="Start planning your first adventure — add a dream destination above."
          />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {favs.map((code, i) => (
              <div
                key={code}
                className="premium-card group relative animate-fade-in overflow-hidden rounded-3xl p-4 text-center transition-transform"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-6 -top-8 h-20 w-20 rounded-full bg-primary/8 blur-2xl"
                />
                <Link to="/country/$code" params={{ code }} className="relative block">
                  <div className="flex justify-center">
                    <CountryFlag code={code} size="lg" rounded="rounded-xl" />
                  </div>
                  <p className="mt-2 truncate text-sm font-semibold tracking-[-0.01em] text-foreground">
                    {getCountryName(code)}
                  </p>
                </Link>
                <button
                  onClick={() => remove(code)}
                  className="relative mt-3 inline-flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-1 text-[10px] font-semibold text-destructive transition-all hover:bg-destructive/15 active:scale-95"
                  aria-label={`Remove ${getCountryName(code)} from favorites`}
                >
                  <Trash2 className="h-3 w-3" />
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
