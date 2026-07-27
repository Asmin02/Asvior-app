import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { CountryCombobox, type CountryOption } from "@/components/CountryCombobox";
import { VISA_CODES } from "@/data/visa-data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/favorites")({
  head: () => ({ meta: [{ title: "Favorite Destinations — Asvior" }] }),
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

  useEffect(() => {
    load();
  }, []);
  const load = async () => {
    setLoadError(false);
    const { data, error } = await supabase
      .from("favorite_destinations")
      .select("country_code")
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
    if (!adding) return;
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { error } = await supabase
      .from("favorite_destinations")
      .insert({ user_id: u.user.id, country_code: adding });
    if (error && !error.message.includes("duplicate")) toast.error(error.message);
    else toast.success(`Added ${getCountryName(adding)}`);
    setAdding("");
    load();
  };

  const remove = async (code: string) => {
    const { error } = await supabase
      .from("favorite_destinations")
      .delete()
      .eq("country_code", code);
    if (error) {
      toast.error("Couldn't remove — check your connection and try again.");
      return;
    }
    load();
  };

  return (
    <div className="px-5 pt-8 pb-6">
      <h1 className="text-2xl font-bold text-foreground">Favorite Destinations</h1>
      <p className="mt-1 text-sm text-muted-foreground">Quick-access list of countries you love.</p>

      <Card className="mt-5 ring-1 ring-border">
        <CardContent className="p-4">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
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
            <Button onClick={add} disabled={!adding}>
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="mt-5 grid grid-cols-2 gap-3" aria-hidden>
          <div className="h-32 animate-pulse rounded-xl bg-muted" />
          <div className="h-32 animate-pulse rounded-xl bg-muted" />
          <div className="h-32 animate-pulse rounded-xl bg-muted" />
          <div className="h-32 animate-pulse rounded-xl bg-muted" />
        </div>
      ) : loadError ? (
        <Card className="mt-6 ring-1 ring-border">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-2xl">
              📡
            </div>
            <p className="text-sm font-semibold text-foreground">Couldn't load your favorites.</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Check your connection and try again.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setLoading(true);
                load();
              }}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : favs.length === 0 ? (
        <Card className="mt-6 ring-1 ring-border">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-travel-sky text-2xl">
              🌍
            </div>
            <p className="text-sm font-semibold text-foreground">No favorites yet.</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Start planning your first adventure — add a dream destination above.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3">
          {favs.map((code) => (
            <Card key={code} className="ring-1 ring-border animate-fade-in">
              <CardContent className="p-4 text-center">
                <div className="text-4xl">{flag(code)}</div>
                <p className="mt-2 truncate text-sm font-semibold text-foreground">
                  {getCountryName(code)}
                </p>
                <button
                  onClick={() => remove(code)}
                  className="mt-2 text-[11px] text-destructive hover:underline"
                  aria-label={`Remove ${getCountryName(code)} from favorites`}
                >
                  Remove
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
