import { VISA_CODES } from "@/data/visa-data";
import { getCountryName } from "@/lib/visa";

export interface HomeTrendingDestination {
  code: string;
  name: string;
  places: string[];
  imageIndex: number;
}

export interface HomeVisaUpdate {
  id: string;
  countryCode: string;
  title: string;
  summary: string;
  publishedAt: string;
  source: string;
  url?: string;
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

export function getDailyTrendingDestinations(date: Date, count = 6): HomeTrendingDestination[] {
  const total = LOCAL_COUNTRY_DATASET.length;
  if (total === 0) return [];
  const size = Math.max(1, Math.min(count, total));

  const indices = Array.from({ length: total }, (_, i) => i);
  const random = seededRandom(daySeed(date) + total * 37);

  for (let i = indices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const tmp = indices[i];
    indices[i] = indices[j];
    indices[j] = tmp;
  }

  return indices.slice(0, size).map((i) => LOCAL_COUNTRY_DATASET[i]);
}

