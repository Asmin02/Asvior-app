import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CountryCombobox, type CountryOption } from "@/components/CountryCombobox";
import { VISA_CODES } from "@/data/visa-data";
import { EmptyState, LoadingRows } from "@/components/asvior";
import { PageBadge, PageHeader, PageShell } from "@/components/PageShell";
import { getCountryHeroImage } from "@/lib/country-image";
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

function flag(code: string) {
  if (code.length !== 2) return "";
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1a5 + c.charCodeAt(0)));
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
    <PageShell className="app-scroll-page">
      <PageHeader
        badge={
          <PageBadge icon={<Heart className="h-3.5 w-3.5" />}>
            {favs.length} saved {favs.length === 1 ? "destination" : "destinations"}
          </PageBadge>
        }
        title="Favorites"
        subtitle="Quick-access list of countries you love."
      />

      <section className="asv-page-pad mt-6">
        <div className="asv-card asv-card-pad">
          <p className="asv-eyebrow mb-3">Add destination</p>
          <div className="flex gap-2">
            <div className="flex-1">
              <CountryCombobox
                value={adding}
                onChange={setAdding}
                options={OPTIONS}
                placeholder="Search country..."
              />
            </div>
            <button
              type="button"
              onClick={add}
              disabled={!adding}
              className="asv-btn asv-btn-primary asv-btn-icon !min-h-[52px] !w-[52px] disabled:opacity-40"
              aria-label="Add favorite"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      <section className="asv-page-pad mt-5 pb-6">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="asv-skeleton aspect-[3/4] rounded-[var(--asv-radius-xl)]" />
            ))}
          </div>
        ) : loadError ? (
          <EmptyState
            icon={<span className="text-2xl">📡</span>}
            title="Couldn't load your favorites"
            description="Check your connection and try again."
            action={
              <button
                type="button"
                className="asv-btn asv-btn-secondary asv-btn-sm"
                onClick={() => {
                  setLoading(true);
                  load();
                }}
              >
                Retry
              </button>
            }
          />
        ) : favs.length === 0 ? (
          <EmptyState
            icon={<Heart className="h-8 w-8" />}
            title="No favorites yet"
            description="Start planning your first adventure — add a dream destination above."
          />
        ) : (
          <div className="asv-stagger grid grid-cols-2 gap-3">
            {favs.map((code) => (
              <div key={code} className="group relative">
                <Link
                  to="/country/$code"
                  params={{ code }}
                  className="asv-dest-card asv-card-interactive block"
                >
                  <img
                    src={getCountryHeroImage(code)}
                    alt={getCountryName(code)}
                    loading="lazy"
                  />
                  <div className="asv-dest-card-overlay" />
                  <div className="asv-dest-card-body">
                    <div className="text-3xl drop-shadow">{flag(code)}</div>
                    <p className="asv-dest-card-title mt-1 truncate">{getCountryName(code)}</p>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => remove(code)}
                  className="asv-btn asv-btn-ghost absolute right-2 top-2 !min-h-8 !rounded-full !bg-black/40 !px-2.5 !text-[10px] !text-white backdrop-blur-sm"
                  aria-label={`Remove ${getCountryName(code)} from favorites`}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
