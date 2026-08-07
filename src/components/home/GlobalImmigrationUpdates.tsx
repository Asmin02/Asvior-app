import { useDeferredValue, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Globe2,
  Search,
  X,
} from "lucide-react";
import type { HomeVisaUpdate, ImmigrationBadge } from "@/data/home-feed";
import type { Region } from "@/data/regions";
import { REGION_META, REGION_ORDER } from "@/data/regions";
import { CountryFlag } from "@/components/CountryFlag";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

type FilterKey = "all" | Region;

const FILTER_OPTIONS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  ...REGION_ORDER.map((region) => ({ key: region as FilterKey, label: REGION_META[region].label })),
];

const SEARCH_HINTS = [
  "Country",
  "Visa",
  "Immigration",
  "Passport",
  "Tourist visa",
  "Work visa",
  "Student visa",
];

const BADGE_META: Record<
  ImmigrationBadge,
  { label: string; className: string }
> = {
  new: {
    label: "New",
    className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-emerald-500/20",
  },
  visa: {
    label: "Visa Update",
    className: "bg-sky-500/15 text-sky-700 dark:text-sky-300 ring-sky-500/20",
  },
  immigration: {
    label: "Immigration",
    className: "bg-violet-500/15 text-violet-700 dark:text-violet-300 ring-violet-500/20",
  },
  border: {
    label: "Border Update",
    className: "bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-amber-500/20",
  },
};

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function matchesSearch(item: HomeVisaUpdate, query: string): boolean {
  if (!query) return true;
  const haystack = `${item.countryName} ${item.title} ${item.summary} ${item.source}`.toLowerCase();
  return query
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

function ImmigrationCard({ item }: { item: HomeVisaUpdate }) {
  const badges = item.badges ?? [];
  const body = (
    <article className="immigration-card group relative overflow-hidden rounded-3xl p-4 sm:p-5">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative flex items-start gap-3.5">
        <div className="shrink-0 rounded-2xl bg-muted/60 p-2 ring-1 ring-border/50">
          <CountryFlag code={item.countryCode} size="md" rounded="rounded-xl" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {item.countryName}
            </p>
            {badges.map((badge) => {
              const meta = BADGE_META[badge];
              if (!meta) return null;
              return (
                <span
                  key={badge}
                  className={cn(
                    "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] ring-1 ring-inset",
                    meta.className,
                  )}
                >
                  {meta.label}
                </span>
              );
            })}
          </div>
          <h3 className="mt-1.5 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            {item.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {item.summary}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="truncate text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
              {item.source} · {formatDate(item.publishedAt)}
            </p>
            <span className="spring-press inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              Read more
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
          </div>
        </div>
      </div>
    </article>
  );

  if (item.url) {
    return (
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="block">
        {body}
      </a>
    );
  }

  return (
    <Link to="/country/$code" params={{ code: item.countryCode }} className="block">
      {body}
    </Link>
  );
}

function ImmigrationSkeleton() {
  return (
    <div className="immigration-card rounded-3xl p-4 sm:p-5">
      <div className="flex items-start gap-3.5">
        <div className="skeleton-block h-11 w-11 shrink-0 rounded-2xl" />
        <div className="min-w-0 flex-1 space-y-2.5">
          <div className="skeleton-block h-3 w-24 rounded" />
          <div className="skeleton-block h-4 w-full rounded" />
          <div className="skeleton-block h-4 w-4/5 rounded" />
          <div className="skeleton-block h-3 w-2/5 rounded" />
        </div>
      </div>
    </div>
  );
}

export function GlobalImmigrationUpdates({
  items,
  loading,
  meta,
  affinity = new Set<string>(),
  maxVisible = 12,
}: {
  items: HomeVisaUpdate[];
  loading: boolean;
  meta: { fetchedAt: string; stale: boolean; countryCount?: number } | null;
  affinity?: Set<string>;
  maxVisible?: number;
}) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());

  const filtered = useMemo(() => {
    let list = items;
    if (filter !== "all") list = list.filter((item) => item.region === filter);
    if (deferredSearch) list = list.filter((item) => matchesSearch(item, deferredSearch));
    return list.slice(0, maxVisible);
  }, [items, filter, deferredSearch, maxVisible]);

  const personalized = useMemo(
    () =>
      [...filtered].sort(
        (a, b) => Number(affinity.has(b.countryCode)) - Number(affinity.has(a.countryCode)),
      ),
    [filtered, affinity],
  );

  const countryCount = useMemo(() => {
    if (meta?.countryCount && meta.countryCount > 0) return meta.countryCount;
    return new Set(items.map((item) => item.countryCode)).size;
  }, [items, meta?.countryCount]);

  return (
    <section aria-labelledby="global-immigration-heading" className="space-y-4">
      <Reveal>
        <div className="premium-card rounded-3xl px-4 py-4 sm:px-5 sm:py-5">
          <div className="flex items-start gap-3">
            <span
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-lg"
              aria-hidden
            >
              🌍
            </span>
            <div className="min-w-0 space-y-1">
              <h2 id="global-immigration-heading" className="section-title leading-tight">
                Global Immigration Updates
              </h2>
              <p className="text-sm text-muted-foreground">
                Official government immigration sources
              </p>
              <p className="text-xs font-medium text-muted-foreground/90">
                {countryCount} countries • Refreshed every 24 hours
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={40}>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={2}
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${SEARCH_HINTS.join(", ")}…`}
            aria-label="Search immigration updates"
            className="h-11 w-full rounded-2xl border border-border/70 bg-background/80 pl-10 pr-10 text-sm shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/80 focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      </Reveal>

      <Reveal delay={60}>
        <div
          className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Filter by region"
        >
          {FILTER_OPTIONS.map((option) => {
            const active = filter === option.key;
            return (
              <button
                key={option.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(option.key)}
                className={cn(
                  "spring-press shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition-all duration-300",
                  active
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </Reveal>

      <div className="min-h-[18rem] space-y-3">
        {loading ? (
          <>
            {[0, 1, 2, 3].map((i) => (
              <ImmigrationSkeleton key={i} />
            ))}
          </>
        ) : personalized.length === 0 ? (
          <Reveal>
            <div className="premium-card rounded-3xl px-5 py-8 text-center">
              <Globe2 className="mx-auto h-8 w-8 text-muted-foreground/70" strokeWidth={1.6} />
              <p className="mt-3 text-sm font-semibold text-foreground">No matching updates</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {search || filter !== "all"
                  ? "Try another region or search term."
                  : "Official sources refresh every 24 hours."}
              </p>
            </div>
          </Reveal>
        ) : (
          personalized.map((item, i) => (
            <Reveal key={item.id} delay={i * 40}>
              <ImmigrationCard item={item} />
            </Reveal>
          ))
        )}
      </div>
    </section>
  );
}
