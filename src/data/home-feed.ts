import { VISA_CODES } from "@/data/visa-data";
import { getCountryName } from "@/lib/visa";

export type TrendingLabel = "Trending" | "Popular" | "New";

export interface HomeTrendingDestination {
  code: string;
  name: string;
  places: string[];
  imageIndex: number;
  continent?: string;
  label?: TrendingLabel;
}


import type { Region } from "@/data/regions";

export type ImmigrationBadge = "new" | "visa" | "immigration" | "border";

export interface HomeVisaUpdate {
  id: string;
  countryCode: string;
  countryName: string;
  title: string;
  summary: string;
  publishedAt: string;
  source: string;
  url?: string;
  region: Region;
  badges: ImmigrationBadge[];
  importance: number;
  isOfficial: boolean;
}

const PLACE_OVERRIDES: Record<string, string[]> = {
  JP: ["Tokyo", "Kyoto", "Osaka"],
  FR: ["Paris", "Nice", "Lyon"],
  TH: ["Bangkok", "Phuket", "Chiang Mai"],
  IT: ["Rome", "Venice", "Milan"],
  PT: ["Lisbon", "Porto", "Faro"],
  ES: ["Barcelona", "Madrid", "Seville"],
  GB: ["London", "Edinburgh", "Bath"],
  AE: ["Dubai", "Abu Dhabi", "Sharjah"],
  US: ["New York", "Los Angeles", "Miami"],
  AU: ["Sydney", "Melbourne", "Perth"],
  TR: ["Istanbul", "Cappadocia", "Antalya"],
  VN: ["Hanoi", "Da Nang", "Ho Chi Minh City"],
  ID: ["Bali", "Jakarta", "Yogyakarta"],
  GR: ["Athens", "Santorini", "Crete"],
  MA: ["Marrakesh", "Casablanca", "Chefchaouen"],
  MX: ["Mexico City", "Cancun", "Oaxaca"],
  KR: ["Seoul", "Busan", "Jeju"],
  SG: ["Marina Bay", "Sentosa", "Chinatown"],
  CA: ["Vancouver", "Toronto", "Banff"],
  CH: ["Zurich", "Lucerne", "Zermatt"],
};

function fallbackPlaces(name: string): string[] {
  const cleaned = name.replace(/^Republic of\s+/i, "").replace(/^The\s+/i, "");
  const short = cleaned.split(" ")[0];
  return [`${short} City`, "Old Town", "National Park"];
}

function daySeed(date: Date): number {
  return Math.floor(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86400000,
  );
}

function seededRandom(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

// Local dataset designed to be replaced by API data later.
export const LOCAL_COUNTRY_DATASET: HomeTrendingDestination[] = VISA_CODES.map((code, index) => {
  const name = getCountryName(code);
  return {
    code,
    name,
    places: PLACE_OVERRIDES[code] ?? fallbackPlaces(name),
    imageIndex: index % 6,
  };
});

/** Curated, continent-balanced trending pool.
 * imageIndex maps to [europe, asia, americas, oceania, middleEast, africa]. */
const TRENDING_POOL: Array<{
  code: string;
  continent: string;
  imageIndex: number;
}> = [
  { code: "JP", continent: "Asia", imageIndex: 1 },
  { code: "TH", continent: "Asia", imageIndex: 1 },
  { code: "KR", continent: "Asia", imageIndex: 1 },
  { code: "SG", continent: "Asia", imageIndex: 1 },
  { code: "ID", continent: "Asia", imageIndex: 1 },
  { code: "VN", continent: "Asia", imageIndex: 1 },
  { code: "IT", continent: "Europe", imageIndex: 0 },
  { code: "FR", continent: "Europe", imageIndex: 0 },
  { code: "CH", continent: "Europe", imageIndex: 0 },
  { code: "NO", continent: "Europe", imageIndex: 0 },
  { code: "PT", continent: "Europe", imageIndex: 0 },
  { code: "GR", continent: "Europe", imageIndex: 0 },
  { code: "CA", continent: "Americas", imageIndex: 2 },
  { code: "BR", continent: "Americas", imageIndex: 2 },
  { code: "MX", continent: "Americas", imageIndex: 2 },
  { code: "US", continent: "Americas", imageIndex: 2 },
  { code: "AU", continent: "Oceania", imageIndex: 3 },
  { code: "NZ", continent: "Oceania", imageIndex: 3 },
  { code: "AE", continent: "Middle East", imageIndex: 4 },
  { code: "TR", continent: "Middle East", imageIndex: 4 },
  { code: "MA", continent: "Africa", imageIndex: 5 },
  { code: "ZA", continent: "Africa", imageIndex: 5 },
  { code: "EG", continent: "Africa", imageIndex: 5 },
  { code: "KE", continent: "Africa", imageIndex: 5 },
];

const LABELS: TrendingLabel[] = ["Trending", "Popular", "New"];

/**
 * Deterministic per-UTC-day selection: rotates automatically every 24 hours,
 * balanced across continents and never repeating a destination in one batch.
 */
export function getDailyTrendingDestinations(date: Date, count = 6): HomeTrendingDestination[] {
  const random = seededRandom(daySeed(date) * 2654435761);

  const byContinent = new Map<string, typeof TRENDING_POOL>();
  for (const entry of TRENDING_POOL) {
    const list = byContinent.get(entry.continent) ?? [];
    list.push(entry);
    byContinent.set(entry.continent, list);
  }

  // Shuffle each continent bucket and the continent order for the day.
  const shuffle = <T,>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1));
      const tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  };

  const queues = shuffle([...byContinent.values()].map(shuffle));

  const picked: typeof TRENDING_POOL = [];
  const seen = new Set<string>();
  let round = 0;
  while (picked.length < count && queues.some((q) => q.length > round)) {
    for (const q of queues) {
      const next = q[round];
      if (next && !seen.has(next.code)) {
        seen.add(next.code);
        picked.push(next);
      }
      if (picked.length >= count) break;
    }
    round += 1;
  }

  return picked.map((entry, i) => {
    const name = getCountryName(entry.code);
    return {
      code: entry.code,
      name,
      places: PLACE_OVERRIDES[entry.code] ?? fallbackPlaces(name),
      imageIndex: entry.imageIndex,
      continent: entry.continent,
      label: LABELS[(daySeed(date) + i) % LABELS.length],
    };
  });
}


