import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Compass, Search, Sparkles } from "lucide-react";
import { VISA_CODES } from "@/data/visa-data";
import { getCountryName, flagEmoji } from "@/lib/visa";
import { PageBadge, PageHeader, PageShell } from "@/components/PageShell";
import { COUNTRY_PROFILES } from "@/data/country-profiles";
import { REGION_META, REGION_ORDER, type Region } from "@/data/regions";

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
  // Country display names come from the browser's Intl API, which can differ
  // from the server's — build the list after mount to avoid hydration mismatch.
  const [all, setAll] = useState<Entry[]>([]);
  useEffect(() => setAll(buildAll()), []);

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
    <PageShell className="pb-6">
      <PageHeader
        badge={<PageBadge icon={<Compass className="h-3.5 w-3.5" />}>Smart Country Hub</PageBadge>}
        title="Explore the world"
        subtitle="199 interactive country dashboards — visas, costs, attractions, and insider tips."
      />

      {/* Search */}
      <div className="mt-5 px-4">
        <div className="premium-card flex items-center gap-2.5 rounded-2xl px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any country..."
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* Region chips */}
        <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
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

      {/* Featured */}
      {showFeatured && (
        <section className="mt-5">
          <p className="px-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Trending destinations
          </p>
          <div className="mt-3 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
            {FEATURED.map((code) => {
              const p = COUNTRY_PROFILES[code];
              const img = p ? REGION_META[p.region as Region]?.image : undefined;
              return (
                <Link
                  key={code}
                  to="/country/$code"
                  params={{ code }}
                  className="group relative h-44 w-32 shrink-0 overflow-hidden rounded-2xl border border-border shadow-soft"
                >
                  {img && (
                    <img
                      src={img}
                      alt={getCountryName(code)}
                      width={1024}
                      height={576}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <span className="text-2xl drop-shadow">{flagEmoji(code)}</span>
                    <p className="mt-0.5 text-[13px] font-bold leading-tight text-white">
                      {getCountryName(code)}
                    </p>
                    {p && <p className="text-[10px] font-medium text-white/70">{p.capital}</p>}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* All countries */}
      <section className="mt-6 px-4 pb-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            {query || region !== "all"
              ? `${filtered.length} result${filtered.length === 1 ? "" : "s"}`
              : "All countries"}
          </p>
          <Sparkles className="h-3.5 w-3.5 text-primary" />
        </div>

        {filtered.length === 0 ? (
          <div className="premium-card rounded-2xl p-8 text-center">
            <p className="text-sm font-semibold text-foreground">No countries found</p>
            <p className="mt-1 text-xs text-muted-foreground">Try a different name or region.</p>
          </div>
        ) : (
          <div className="premium-card overflow-hidden rounded-2xl">
            {filtered.map((c, i) => {
              const p = COUNTRY_PROFILES[c.code];
              return (
                <Link
                  key={c.code}
                  to="/country/$code"
                  params={{ code: c.code }}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-primary/5 active:bg-primary/10 ${
                    i !== 0 ? "border-t border-border/60" : ""
                  }`}
                >
                  <span className="text-2xl">{flagEmoji(c.code)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{c.name}</p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {p
                        ? `${p.capital} · ${REGION_META[p.region as Region]?.label ?? ""}`
                        : c.code}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              );
            })}
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
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-colors ${
        active
          ? "bg-navy text-primary-foreground shadow-soft"
          : "premium-card text-muted-foreground"
      }`}
    >
      {label}
    </button>
  );
}
