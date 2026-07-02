// Country travel profiles. Generated data is merged below; getCountryProfile
// always returns a usable profile (with a generic fallback for missing codes).
import type { Region } from "@/data/regions";

export interface CountryAttraction {
  name: string;
  blurb: string;
  emoji: string;
}

export interface CountryProfile {
  code: string;
  region: Region;
  capital: string;
  intro: string;
  bestSeason: string;
  currency: string;
  language: string;
  timezone: string;
  plug: string;
  emergency: string;
  cost: { budget: number; standard: number; luxury: number };
  attractions: CountryAttraction[];
  tips: { food: string; culture: string; transport: string; safety: string };
}

export const COUNTRY_PROFILES: Record<string, CountryProfile> = {};

export function getCountryProfile(code: string, name: string): CountryProfile {
  const p = COUNTRY_PROFILES[code];
  if (p) return p;
  return {
    code,
    region: "asia",
    capital: "—",
    intro: `${name} awaits — check entry rules and plan your trip with VisaPilot.`,
    bestSeason: "Varies by region",
    currency: "Local currency",
    language: "Local language",
    timezone: "—",
    plug: "Check before travel",
    emergency: "112 (most regions)",
    cost: { budget: 40, standard: 100, luxury: 250 },
    attractions: [
      { name: "Capital highlights", blurb: "Historic center, markets, and museums.", emoji: "🏛️" },
      { name: "Natural wonders", blurb: "Landscapes and national parks.", emoji: "🏞️" },
      { name: "Local cuisine", blurb: "Taste the signature national dishes.", emoji: "🍽️" },
      { name: "Cultural sites", blurb: "Traditions, festivals, and heritage.", emoji: "🎭" },
    ],
    tips: {
      food: "Try local specialties at busy, well-reviewed spots.",
      culture: "Learn a few local greetings — it goes a long way.",
      transport: "Use official taxis or licensed ride apps.",
      safety: "Keep documents secure and register with your embassy for long stays.",
    },
  };
}
