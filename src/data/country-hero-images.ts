/**
 * Curated destination photography — bundled locally for reliable offline/Android loading.
 * Falls back to regional imagery via getCountryHeroImage() when a code is not listed.
 */
export const COUNTRY_HERO_IMAGES: Record<string, string> = {
  JP: "/destinations/JP.jpg",
  GR: "/destinations/GR.jpg",
  FR: "/destinations/FR.jpg",
  IT: "/destinations/IT.jpg",
  TH: "/destinations/TH.jpg",
  US: "/destinations/US.jpg",
  AE: "/destinations/AE.jpg",
  ID: "/destinations/ID.jpg",
  PT: "/destinations/PT.jpg",
  IS: "/destinations/IS.jpg",
  MA: "/destinations/MA.jpg",
  CH: "/destinations/FR.jpg",
  MV: "/destinations/ID.jpg",
  NO: "/destinations/IS.jpg",
  TR: "/destinations/GR.jpg",
  AU: "/destinations/TH.jpg",
  BR: "/destinations/MA.jpg",
  ES: "/destinations/PT.jpg",
  GB: "/destinations/FR.jpg",
  SG: "/destinations/TH.jpg",
  KR: "/destinations/JP.jpg",
};

/** Featured trip card on home (Kyoto rice terraces). */
export const HOME_TRIP_HERO = "/destinations/trip.jpg";
