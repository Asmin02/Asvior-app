import type { HomeVisaUpdate, ImmigrationBadge } from "@/data/home-feed";
import type { Region } from "@/data/regions";
import { COUNTRY_PROFILES } from "@/data/country-profiles";

const HOURS = 60 * 60 * 1000;

const VISA_KEYWORDS = [
  "visa",
  "e-visa",
  "evisa",
  "schengen",
  "visa-free",
  "visa free",
  "visa requirement",
  "tourist visa",
  "work visa",
  "student visa",
];

const IMMIGRATION_KEYWORDS = [
  "immigration",
  "citizenship",
  "permanent resident",
  "green card",
  "work permit",
  "residence permit",
  "naturalization",
  "asylum",
  "refugee",
];

const BORDER_KEYWORDS = [
  "border",
  "entry",
  "customs",
  "checkpoint",
  "passport control",
  "border control",
  "port of entry",
];

const IMPORTANCE_KEYWORDS = [
  ...VISA_KEYWORDS,
  ...IMMIGRATION_KEYWORDS,
  ...BORDER_KEYWORDS,
  "passport",
  "travel advisory",
  "travel alert",
  "immigration policy",
];

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeUrl(url: string | undefined): string {
  if (!url) return "";
  try {
    const parsed = new URL(url.trim());
    parsed.hash = "";
    parsed.search = "";
    return `${parsed.hostname}${parsed.pathname}`.replace(/\/+$/, "").toLowerCase();
  } catch {
    return normalizeText(url);
  }
}

export function countryRegion(code: string): Region {
  const profile = COUNTRY_PROFILES[code.toUpperCase()];
  if (profile?.region) return profile.region;

  const fallback: Record<string, Region> = {
    US: "americas",
    CA: "americas",
    MX: "americas",
    BR: "americas",
    AR: "americas",
    GB: "europe",
    DE: "europe",
    FR: "europe",
    IT: "europe",
    ES: "europe",
    PT: "europe",
    NL: "europe",
    CH: "europe",
    AT: "europe",
    BE: "europe",
    NO: "europe",
    SE: "europe",
    DK: "europe",
    FI: "europe",
    IE: "europe",
    PL: "europe",
    CZ: "europe",
    HU: "europe",
    GR: "europe",
    TR: "middle-east",
    JP: "asia",
    KR: "asia",
    SG: "asia",
    MY: "asia",
    TH: "asia",
    VN: "asia",
    ID: "asia",
    PH: "asia",
    CN: "asia",
    HK: "asia",
    TW: "asia",
    IN: "asia",
    NP: "asia",
    AE: "middle-east",
    QA: "middle-east",
    SA: "middle-east",
    OM: "middle-east",
    BH: "middle-east",
    KW: "middle-east",
    AU: "oceania",
    NZ: "oceania",
    ZA: "africa",
    MA: "africa",
    EG: "africa",
    EU: "europe",
  };
  return fallback[code.toUpperCase()] ?? "asia";
}

function keywordScore(text: string): number {
  const normalized = normalizeText(text);
  let score = 0;
  for (const keyword of IMPORTANCE_KEYWORDS) {
    if (normalized.includes(keyword)) {
      score += keyword.length > 8 ? 6 : 4;
    }
  }
  return score;
}

export function computeImportance(item: Pick<HomeVisaUpdate, "title" | "summary">): number {
  return keywordScore(item.title) * 2 + keywordScore(item.summary);
}

export function detectBadges(
  item: Pick<HomeVisaUpdate, "title" | "summary" | "publishedAt">,
  now = Date.now(),
): ImmigrationBadge[] {
  const badges: ImmigrationBadge[] = [];
  const ageMs = now - new Date(item.publishedAt).getTime();
  const text = normalizeText(`${item.title} ${item.summary}`);

  if (Number.isFinite(ageMs) && ageMs >= 0 && ageMs < 24 * HOURS) badges.push("new");
  if (VISA_KEYWORDS.some((k) => text.includes(k))) badges.push("visa");
  if (IMMIGRATION_KEYWORDS.some((k) => text.includes(k))) badges.push("immigration");
  if (BORDER_KEYWORDS.some((k) => text.includes(k))) badges.push("border");

  return badges;
}

export function freshnessScore(publishedAt: string, now = Date.now()): number {
  const ageMs = now - new Date(publishedAt).getTime();
  if (!Number.isFinite(ageMs) || ageMs < 0) return 0;
  if (ageMs < 24 * HOURS) return 30;
  if (ageMs < 7 * 24 * HOURS) return 20;
  if (ageMs < 30 * 24 * HOURS) return 10;
  return 2;
}

type ScoredUpdate = HomeVisaUpdate & { score: number };

function scoreItem(
  item: HomeVisaUpdate,
  affinity: Set<string>,
  now: number,
): ScoredUpdate {
  let score = 50; // official government source baseline
  score += computeImportance(item);
  score += freshnessScore(item.publishedAt, now);
  if (affinity.has(item.countryCode)) score += 25;
  return { ...item, score };
}

/** Remove duplicate titles, summaries, URLs, and near-identical RSS entries. */
export function dedupeImmigrationUpdates(items: HomeVisaUpdate[]): HomeVisaUpdate[] {
  const seenTitles = new Set<string>();
  const seenSummaries = new Set<string>();
  const seenUrls = new Set<string>();
  const out: HomeVisaUpdate[] = [];

  const sorted = [...items].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  for (const item of sorted) {
    const titleKey = normalizeText(item.title);
    const summaryKey = normalizeText(item.summary).slice(0, 120);
    const urlKey = normalizeUrl(item.url);

    if (titleKey && seenTitles.has(titleKey)) continue;
    if (summaryKey.length > 24 && seenSummaries.has(summaryKey)) continue;
    if (urlKey && seenUrls.has(urlKey)) continue;

    if (titleKey) seenTitles.add(titleKey);
    if (summaryKey.length > 24) seenSummaries.add(summaryKey);
    if (urlKey) seenUrls.add(urlKey);
    out.push(item);
  }

  return out;
}

/**
 * Interleave countries round-robin so the feed reads globally diverse.
 * Within each country, prefer highest-scored items and alternate sources.
 */
export function rankImmigrationUpdates(
  items: HomeVisaUpdate[],
  options: { limit?: number; affinity?: Set<string>; now?: number } = {},
): HomeVisaUpdate[] {
  const limit = options.limit ?? 24;
  const affinity = options.affinity ?? new Set<string>();
  const now = options.now ?? Date.now();

  const deduped = dedupeImmigrationUpdates(items);
  const byCountry = new Map<string, ScoredUpdate[]>();

  for (const item of deduped) {
    const scored = scoreItem(item, affinity, now);
    const bucket = byCountry.get(item.countryCode) ?? [];
    bucket.push(scored);
    byCountry.set(item.countryCode, bucket);
  }

  for (const bucket of byCountry.values()) {
    bucket.sort((a, b) => b.score - a.score);
  }

  // Cap pool depth per country so one source cannot dominate the rotation.
  const MAX_PER_COUNTRY = 2;
  for (const [code, bucket] of byCountry) {
    const bySource = new Map<string, ScoredUpdate[]>();
    for (const entry of bucket) {
      const sourceBucket = bySource.get(entry.source) ?? [];
      sourceBucket.push(entry);
      bySource.set(entry.source, sourceBucket);
    }

    const rotated: ScoredUpdate[] = [];
    const sources = [...bySource.keys()];
    while (rotated.length < MAX_PER_COUNTRY) {
      let added = false;
      for (const source of sources) {
        const sourceBucket = bySource.get(source);
        if (!sourceBucket?.length) continue;
        rotated.push(sourceBucket.shift()!);
        added = true;
        if (rotated.length >= MAX_PER_COUNTRY) break;
      }
      if (!added) break;
    }

    byCountry.set(code, rotated.length ? rotated : bucket.slice(0, MAX_PER_COUNTRY));
  }

  const countryOrder = [...byCountry.keys()].sort((a, b) => {
    const scoreA = byCountry.get(a)?.[0]?.score ?? 0;
    const scoreB = byCountry.get(b)?.[0]?.score ?? 0;
    if (scoreB !== scoreA) return scoreB - scoreA;
    return a.localeCompare(b);
  });

  const selected: ScoredUpdate[] = [];
  let depth = 0;

  while (selected.length < limit) {
    let added = false;

    for (const code of countryOrder) {
      const bucket = byCountry.get(code);
      if (!bucket || depth >= bucket.length) continue;

      const candidate = bucket[depth];
      const last = selected[selected.length - 1];

      if (last?.countryCode === candidate.countryCode) continue;

      selected.push(candidate);
      added = true;
      if (selected.length >= limit) break;
    }

    depth += 1;
    if (!added) break;
  }

  if (selected.length < limit) {
    const usedIds = new Set(selected.map((entry) => entry.id));
    const leftovers = [...deduped]
      .map((item) => scoreItem(item, affinity, now))
      .filter((entry) => !usedIds.has(entry.id))
      .sort((a, b) => b.score - a.score);

    for (const candidate of leftovers) {
      const last = selected[selected.length - 1];
      if (last?.countryCode === candidate.countryCode && countryOrder.length > 1) continue;
      selected.push(candidate);
      if (selected.length >= limit) break;
    }
  }

  return selected.map(({ score: _score, ...item }) => item);
}

export function enrichImmigrationUpdate(
  item: Omit<HomeVisaUpdate, "region" | "badges" | "importance" | "isOfficial" | "countryName"> & {
    countryName?: string;
  },
  countryName: string,
  now = Date.now(),
): HomeVisaUpdate {
  const base = {
    ...item,
    countryName,
    region: countryRegion(item.countryCode),
    isOfficial: true,
  };
  return {
    ...base,
    importance: computeImportance(base),
    badges: detectBadges(base, now),
  };
}
