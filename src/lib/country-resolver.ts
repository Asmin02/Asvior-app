import { VISA_CODES } from "@/data/visa-data";
import { getCountryName } from "@/lib/visa";

function normalizeKey(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const SLUG_OVERRIDES: Record<string, string> = {
  "dominican-republic": "DO",
  "south-korea": "KR",
  "north-korea": "KP",
  "new-zealand": "NZ",
  "south-africa": "ZA",
  "south-sudan": "SS",
  "sri-lanka": "LK",
  "costa-rica": "CR",
  "el-salvador": "SV",
  "saudi-arabia": "SA",
  "united-arab-emirates": "AE",
  "united-states": "US",
  "united-kingdom": "GB",
  "hong-kong": "HK",
  "czech-republic": "CZ",
  "bosnia-and-herzegovina": "BA",
  "trinidad-and-tobago": "TT",
  "papua-new-guinea": "PG",
  "ivory-coast": "CI",
  "cote-d-ivoire": "CI",
  "the-gambia": "GM",
  "the-bahamas": "BS",
  "the-philippines": "PH",
  "the-netherlands": "NL",
};

const NAME_TO_CODE = new Map<string, string>();

for (const code of VISA_CODES) {
  NAME_TO_CODE.set(normalizeKey(getCountryName(code)), code);
}

NAME_TO_CODE.set(normalizeKey("Türkiye"), "TR");
NAME_TO_CODE.set(normalizeKey("Turkiye"), "TR");
NAME_TO_CODE.set(normalizeKey("Turkey"), "TR");
NAME_TO_CODE.set(normalizeKey("Czechia"), "CZ");
NAME_TO_CODE.set(normalizeKey("United States of America"), "US");
NAME_TO_CODE.set(normalizeKey("Russia"), "RU");
NAME_TO_CODE.set(normalizeKey("Taiwan"), "TW");
NAME_TO_CODE.set(normalizeKey("Vatican City"), "VA");
NAME_TO_CODE.set(normalizeKey("Palestine"), "PS");

/** Resolve a country display name or gov.uk-style slug to an ISO code. */
export function resolveCountryCode(nameOrSlug: string): string | null {
  const raw = nameOrSlug.trim();
  if (!raw) return null;

  const slug = raw.toLowerCase();
  if (SLUG_OVERRIDES[slug]) return SLUG_OVERRIDES[slug];

  const fromSlug = normalizeKey(slug.replace(/-/g, " "));
  if (NAME_TO_CODE.has(fromSlug)) return NAME_TO_CODE.get(fromSlug)!;

  const fromName = normalizeKey(raw);
  if (NAME_TO_CODE.has(fromName)) return NAME_TO_CODE.get(fromName)!;

  return null;
}

/** Extract destination country code from a gov.uk foreign travel advice URL. */
export function countryCodeFromTravelAdviceUrl(url: string): string | null {
  const match = url.match(/foreign-travel-advice\/([^/?#]+)/i);
  if (!match) return null;
  return resolveCountryCode(match[1]);
}
