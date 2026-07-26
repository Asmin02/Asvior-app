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

const DEMO_VISA_UPDATES: HomeVisaUpdate[] = [
  {
    id: "japan-evisa-expansion",
    countryCode: "JP",
    title: "Japan expands eVisa program",
    summary: "Additional eligible nationalities announced for tourism eVisa applications.",
    publishedAt: "2026-07-25T08:30:00.000Z",
    source: "Asvior Newsroom",
  },
  {
    id: "thailand-visa-free-extension",
    countryCode: "TH",
    title: "Thailand extends visa-free entry",
    summary: "Visa-free stay duration extended for selected passport holders.",
    publishedAt: "2026-07-25T06:15:00.000Z",
    source: "Asvior Newsroom",
  },
  {
    id: "uk-processing-update",
    countryCode: "GB",
    title: "UK updates visitor visa processing",
    summary: "Average processing timelines adjusted for peak summer demand.",
    publishedAt: "2026-07-24T14:45:00.000Z",
    source: "Asvior Newsroom",
  },
  {
    id: "uae-tourist-policy",
    countryCode: "AE",
    title: "UAE announces new tourist policy",
    summary: "Entry policy update focuses on digital documentation and faster arrival checks.",
    publishedAt: "2026-07-24T10:00:00.000Z",
    source: "Asvior Newsroom",
  },
  {
    id: "schengen-biometric-window",
    countryCode: "FR",
    title: "Schengen states align biometric appointment windows",
    summary: "Consulates publish harmonized appointment guidance for short-stay applicants.",
    publishedAt: "2026-07-23T18:00:00.000Z",
    source: "Asvior Newsroom",
  },
  {
    id: "portugal-seasonal-processing",
    countryCode: "PT",
    title: "Portugal issues seasonal processing notice",
    summary: "Travelers are advised to submit applications earlier during August peak travel.",
    publishedAt: "2026-07-23T12:15:00.000Z",
    source: "Asvior Newsroom",
  },
  {
    id: "vietnam-evisa-categories",
    countryCode: "VN",
    title: "Vietnam updates eVisa category guidance",
    summary: "Clarified categories for tourism and short business entries.",
    publishedAt: "2026-07-22T21:00:00.000Z",
    source: "Asvior Newsroom",
  },
  {
    id: "saudi-multi-entry",
    countryCode: "SA",
    title: "Saudi tourist visa guidance refreshed",
    summary: "Updated advisory around multi-entry validity and insurance terms.",
    publishedAt: "2026-07-22T08:00:00.000Z",
    source: "Asvior Newsroom",
  },
  {
    id: "canada-document-check",
    countryCode: "CA",
    title: "Canada adds pre-arrival document check reminder",
    summary: "Air travelers encouraged to validate permit and passport pairing before departure.",
    publishedAt: "2026-07-21T16:20:00.000Z",
    source: "Asvior Newsroom",
  },
  {
    id: "singapore-lane-expansion",
    countryCode: "SG",
    title: "Singapore expands smart arrival lanes",
    summary: "More travelers can use automated lanes with pre-submitted arrival forms.",
    publishedAt: "2026-07-21T09:10:00.000Z",
    source: "Asvior Newsroom",
  },
];

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

export function getLatestVisaUpdates(date: Date, count = 8): HomeVisaUpdate[] {
  const total = DEMO_VISA_UPDATES.length;
  if (total === 0) return [];
  const size = Math.max(1, Math.min(count, total));
  const start = daySeed(date) % total;

  const rotated = Array.from({ length: total }, (_, i) => DEMO_VISA_UPDATES[(start + i) % total]);
  return rotated.slice(0, size);
}
