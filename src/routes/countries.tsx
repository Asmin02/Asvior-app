import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Compass, Search, Sparkles } from "lucide-react";
import { VISA_CODES } from "@/data/visa-data";
import { getCountryName, flagEmoji } from "@/lib/visa";
import { AppPageHeader, EmptyState } from "@/components/asvior";
import { PageShell } from "@/components/PageShell";
import { COUNTRY_PROFILES } from "@/data/country-profiles";
import { REGION_META, REGION_ORDER, type Region } from "@/data/regions";
import { getCountryHeroImage } from "@/lib/country-image";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/countries")({
  head: () => ({
    meta: [
      { title: "Explore Countries — Asvior" },
      {
        name: "description",
        content:
          "Interactive travel guides for 199 countries: visas, costs, attractions, and local tips.",
      },
      { property: "og:title", content: "Explore Countries — Asvior" },
      { property: "og:description", content: "Interactive travel guides for 199 countries." },
    ],
  }),
  component: CountriesPage,
});

const FEATURED = ["JP", "FR", "TH", "IT", "AE", "US", "ID", "GR", "TR", "AU", "BR", "MA"];

interface Entry {
  code: string;
  name: string;
  region: Region | null;
}

function buildAll(): Entry[] {
  return VISA_CODES.map((code) => ({
    code,
    name: getCountryName(code),
    region: (COUNTRY_PROFILES[code]?.region as Region) ?? null,
  })).sort((a, b) => a.name.localeCompare(b.name));
}

function CountriesPage() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<Region | "all">("all");
  const [all, setAll] = useState<Entry[]>([]);
  const [profileTo, setProfileTo] = useState("/auth");

  useEffect(() => setAll(buildAll()), []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setProfileTo(data.session?.user ? "/profile" : "/auth");
    });
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((c) => {
      if (region !== "all" && c.region !== region) return false;
      if (!q) return true;
      return c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
    });
  }, [all, query, region]);

  const showFeatured = !query && region === "all";

  return (
    <PageShell className="asv-scroll-page" showProfileAvatar profileTo={profileTo}>
      <AppPageHeader
        overline={
          <p className="asv-overline flex items-center gap-1.5">
            <Compass className="h-3.5 w-3.5" aria-hidden />
            Smart Country Hub
          </p>
        }
        title="Explore the world"
        subtitle="199 interactive country dashboards — visas, costs, attractions, and insider tips."
      />

      <div className="asv-page-pad pb-2">
        <label className="asv-search">
          <Search className="asv-search-icon" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any country..."
            className="asv-search-input"
          />
        </label>

        <div className="asv-chip-scroll mt-4">
          <RegionChip active={region === "all"} onClick={() => setRegion("all")} label="All" />
          {REGION_ORDER.map((r) => (
            <RegionChip
              key={r}
              active={region === r}
              onClick={() => setRegion(r)}
              label={REGION_META[r].label}
            />
          ))}
        </div>
      </div>

      {showFeatured && (
        <section className="asv-section" aria-label="Trending destinations">
          <div className="asv-section-head asv-page-pad">
            <div>
              <p className="asv-overline">Trending</p>
              <h2 className="asv-title mt-1">Popular picks</h2>
            </div>
            <Sparkles className="h-5 w-5 text-[var(--asv-primary)]" aria-hidden />
          </div>
          <div className="asv-discover-strip asv-page-pad pb-2">
            {FEATURED.map((code) => {
              const img = getCountryHeroImage(code);
              const profile = COUNTRY_PROFILES[code];
              return (
                <Link
                  key={code}
                  to="/country/$code"
                  params={{ code }}
                  className="asv-dest-card asv-card--lift w-[152px] shrink-0"
                >
                  <img src={img} alt={getCountryName(code)} loading="lazy" />
                  <div className="asv-dest-card-overlay" aria-hidden />
                  <div className="asv-dest-card-body">
                    <span className="text-base leading-none">{flagEmoji(code)}</span>
                    <p className="asv-dest-card-title">{getCountryName(code)}</p>
                    {profile?.capital && (
                      <span className="asv-dest-card-chip">{profile.capital}</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="asv-section asv-page-pad pb-[calc(var(--asv-tab-clearance)+16px)]" aria-label="All countries">
        <div className="asv-section-head !mb-4">
          <h2 className="asv-title">{region === "all" ? "All countries" : REGION_META[region].label}</h2>
          <span className="asv-chip">{filtered.length}</span>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Search className="h-6 w-6" />}
            title="No countries found"
            description="Try a different search term or filter."
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {filtered.map((c) => (
              <Link
                key={c.code}
                to="/country/$code"
                params={{ code: c.code }}
                className="asv-country-tile asv-card--lift"
              >
                <img src={getCountryHeroImage(c.code)} alt="" loading="lazy" />
                <div className="asv-country-tile-overlay" aria-hidden />
                <div className="asv-country-tile-body">
                  <span>{flagEmoji(c.code)}</span>
                  <p>{c.name}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}

function RegionChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`asv-chip shrink-0 whitespace-nowrap transition-transform active:scale-95 ${
        active ? "asv-chip--active" : ""
      }`}
    >
      {label}
    </button>
  );
}
