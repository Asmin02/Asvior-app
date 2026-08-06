import regionEurope from "@/assets/region-europe.jpg";
import { COUNTRY_HERO_IMAGES } from "@/data/country-hero-images";import { COUNTRY_PROFILES } from "@/data/country-profiles";
import { REGION_META, type Region } from "@/data/regions";

/** Best available hero image for a country card or tile. */
export function getCountryHeroImage(code: string): string {
  const curated = COUNTRY_HERO_IMAGES[code];
  if (curated) return curated;

  const region = COUNTRY_PROFILES[code]?.region as Region | undefined;
  if (region && REGION_META[region]) return REGION_META[region].image;

  return regionEurope;
}
