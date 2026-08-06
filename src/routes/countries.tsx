import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Compass, Search, Sparkles, TrendingUp } from "lucide-react";
import { VISA_CODES } from "@/data/visa-data";
import { getCountryName } from "@/lib/visa";
import { CountryFlag } from "@/components/CountryFlag";
import { PageBadge, PageHeader, PageShell } from "@/components/PageShell";
import { COUNTRY_PROFILES } from "@/data/country-profiles";
import { REGION_META, REGION_ORDER, type Region } from "@/data/regions";
import { SmoothImage } from "@/components/motion/SmoothImage";

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
      <div className="-mt-4 px-4">
        <div className="relative z-10 flex items-center gap-3 rounded-2xl border border-white/50 bg-card/90 p-4 elev-4 backdrop-blur-xl transition-transform duration-200 focus-within:-translate-y-0.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl grad-signal text-white">
            <Search className="h-5 w-5" />
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any country..."
            className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* Region chips */}
        <div className="scroll-fluid rail-snap -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1">
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
        <section className="mt-6 animate-fade-in">
          <div className="flex items-center gap-1.5 px-4">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            <p className="text-eyebrow text-muted-foreground">Trending destinations</p>
          </div>
          <div className="scroll-fluid rail-snap mt-3 flex gap-3 overflow-x-auto px-4 pb-2">
            {FEATURED.map((code, i) => {
              const p = COUNTRY_PROFILES[code];
              const img = p ? REGION_META[p.region as Region]?.image : undefined;
              return (
                <Link
                  key={code}
                  to="/country/$code"
                  params={{ code }}
                  className="group relative h-52 w-40 shrink-0 overflow-hidden rounded-3xl elev-2 transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98] animate-fade-in"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  {img && (
                    <SmoothImage
                      src={img}
                      alt={getCountryName(code)}
                      width={1024}
                      height={576}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent" />
                  <div className="absolute inset-x-0 top-3 flex justify-end px-3">
                    <CountryFlag code={code} size="sm" className="ring-white/40" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-3.5">
                    <p className="text-[13px] font-bold leading-tight text-white">
                      {getCountryName(code)}
                    </p>
                    {p && <p className="mt-0.5 text-2xs font-medium text-white/70">{p.capital}</p>}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* All countries */}
      <section className="mt-7 px-4 pb-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-eyebrow text-muted-foreground">
            {query || region !== "all"
              ? `${filtered.length} result${filtered.length === 1 ? "" : "s"}`
              : "All countries"}
          </p>
          <Sparkles className="h-3.5 w-3.5 text-primary" />
        </div>

        {filtered.length === 0 ? (
          <div className="premium-card animate-fade-in rounded-3xl p-9 text-center">
            <p className="text-sm font-semibold text-foreground">No countries found</p>
            <p className="mt-1 text-xs text-muted-foreground">Try a different name or region.</p>
          </div>
        ) : (
          <div className="premium-card overflow-hidden rounded-3xl">
            {filtered.map((c, i) => {
              const p = COUNTRY_PROFILES[c.code];
              return (
                <Link
                  key={c.code}
                  to="/country/$code"
                  params={{ code: c.code }}
                  className={`flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-primary/5 active:bg-primary/10 ${
                    i !== 0 ? "border-t border-border/60" : ""
                  }`}
                >
                  <CountryFlag code={c.code} size="md" rounded="rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{c.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
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
      className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all active:scale-95 ${
        active
          ? "grad-signal text-white elev-2"
          : "border border-border/60 bg-card/70 text-muted-foreground backdrop-blur-sm hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}
