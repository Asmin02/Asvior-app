// Shared visa requirement logic (data: passport-index-dataset)
import { VISA_DATA } from "@/data/visa-data";
import { buildScopedStorageKey, GUEST_STORAGE_SCOPE } from "@/lib/app-session";

export type VisaStatus =
  "Visa Free" | "Visa on Arrival" | "ETA" | "eVisa" | "Visa Required" | "No Admission";

export interface VisaResult {
  status: VisaStatus;
  explanation: string;
  maxStay: string;
  documents: string[];
  processingTime: string;
  officialUrl: string;
  source: string;
}

export function getCountryName(code: string): string {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code;
  } catch {
    return code;
  }
}

export function flagEmoji(code: string): string {
  if (!code || code.length !== 2) return "";
  const A = 0x1f1e6;
  return (
    String.fromCodePoint(A + (code.charCodeAt(0) - 65)) +
    String.fromCodePoint(A + (code.charCodeAt(1) - 65))
  );
}

export const OFFICIAL_URLS: Record<string, string> = {
  US: "https://travel.state.gov/content/travel/en/us-visas.html",
  GB: "https://www.gov.uk/check-uk-visa",
  CA: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html",
  AU: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder",
  NZ: "https://www.immigration.govt.nz/new-zealand-visas",
  IN: "https://indianvisaonline.gov.in/evisa/",
  CN: "https://www.visaforchina.cn/",
  JP: "https://www.mofa.go.jp/j_info/visit/visa/",
  KR: "https://www.k-eta.go.kr/",
  SG: "https://www.ica.gov.sg/enter-transit-depart/entering-singapore",
  TH: "https://www.thaievisa.go.th/",
  VN: "https://evisa.xuatnhapcanh.gov.vn/",
  ID: "https://molina.imigrasi.go.id/",
  MY: "https://malaysiavisa.imi.gov.my/",
  PH: "https://evisa.gov.ph/",
  AE: "https://smartservices.icp.gov.ae/",
  SA: "https://visa.visitsaudi.com/",
  QA: "https://www.moi.gov.qa/site/english/index.html",
  TR: "https://www.evisa.gov.tr/",
  EG: "https://visa2egypt.gov.eg/",
  KE: "https://evisa.go.ke/",
  ZA: "https://www.dha.gov.za/index.php/immigration-services",
  BR: "https://www.gov.br/mre/pt-br/consulado-virtual/visto",
  AR: "https://www.argentina.gob.ar/interior/migraciones",
  MX: "https://www.inm.gob.mx/",
  RU: "https://electronic-visa.kdmid.ru/",
  DE: "https://www.auswaertiges-amt.de/en/visa-service",
  FR: "https://france-visas.gouv.fr/",
  IT: "https://vistoperitalia.esteri.it/home/en",
  ES: "https://www.exteriores.gob.es/en/ServiciosAlCiudadano/Paginas/Visados.aspx",
  NL: "https://www.netherlandsworldwide.nl/visa-the-netherlands",
  CH: "https://www.sem.admin.ch/sem/en/home/themen/einreise.html",
  IE: "https://www.irishimmigration.ie/coming-to-visit-ireland/",
  SE: "https://www.migrationsverket.se/English/Private-individuals/Visiting-Sweden.html",
  NO: "https://www.udi.no/en/want-to-apply/visit/",
};

export function officialUrlFor(destination: string, passport?: string): string {
  const destName = getCountryName(destination);
  const passportName = passport ? getCountryName(passport) : "";
  return (
    OFFICIAL_URLS[destination] ||
    `https://www.google.com/search?q=${encodeURIComponent(
      `${destName} official visa information${passportName ? ` for ${passportName} citizens` : ""}`,
    )}`
  );
}

function parseDays(code: string): number | null {
  if (code.startsWith("F") && code.length > 1) {
    const n = parseInt(code.slice(1), 10);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function getVisaRequirement(passport: string, destination: string): VisaResult | null {
  if (!passport || !destination) return null;
  const passportName = getCountryName(passport);
  const destName = getCountryName(destination);
  const officialUrl = officialUrlFor(destination, passport);

  if (passport === destination) {
    return {
      status: "Visa Free",
      explanation: "You don't need a visa to enter your own country.",
      maxStay: "Unlimited",
      documents: ["National ID or passport"],
      processingTime: "—",
      officialUrl,
      source: "passport-index-dataset",
    };
  }
  const code = VISA_DATA[passport]?.[destination];
  if (!code) {
    return {
      status: "Visa Required",
      explanation: `No data available for ${passportName} → ${destName}. Confirm directly with the embassy.`,
      maxStay: "Varies",
      documents: ["Valid passport"],
      processingTime: "Varies",
      officialUrl,
      source: "fallback",
    };
  }
  const days = parseDays(code);
  if (code === "S")
    return {
      status: "Visa Free",
      explanation: "Domestic travel — no visa required.",
      maxStay: "Unlimited",
      documents: ["National ID or passport"],
      processingTime: "—",
      officialUrl,
      source: "passport-index-dataset",
    };
  if (code === "F" || days !== null)
    return {
      status: "Visa Free",
      explanation: `Citizens of ${passportName} can enter ${destName} visa-free${days ? ` for stays up to ${days} days` : ""}.`,
      maxStay: days ? `${days} days per entry` : "Varies (visa-free)",
      documents: [
        "Valid passport (6+ months recommended)",
        "Return or onward ticket",
        "Proof of accommodation",
        "Proof of sufficient funds",
      ],
      processingTime: "No application required",
      officialUrl,
      source: "passport-index-dataset",
    };
  if (code === "A")
    return {
      status: "Visa on Arrival",
      explanation: `Citizens of ${passportName} can obtain a visa on arrival in ${destName}.`,
      maxStay: "Typically 15–30 days",
      documents: [
        "Valid passport (6+ months)",
        "Passport-sized photo",
        "Visa fee (cash, often USD)",
        "Proof of onward travel",
        "Proof of accommodation",
      ],
      processingTime: "Issued at the border (15–60 minutes)",
      officialUrl,
      source: "passport-index-dataset",
    };
  if (code === "E")
    return {
      status: "eVisa",
      explanation: `Citizens of ${passportName} must apply online for an eVisa before travelling to ${destName}.`,
      maxStay: "Usually 30–90 days",
      documents: [
        "Valid passport (6+ months)",
        "Digital passport photo",
        "Completed online application",
        "Credit/debit card for visa fee",
        "Travel itinerary",
      ],
      processingTime: "24–72 hours, up to 2 weeks",
      officialUrl,
      source: "passport-index-dataset",
    };
  if (code === "T")
    return {
      status: "ETA",
      explanation: `Citizens of ${passportName} need an Electronic Travel Authorization before flying to ${destName}.`,
      maxStay: "Up to 90 days per entry",
      documents: [
        "Valid passport",
        "Online ETA application",
        "Email address",
        "Credit/debit card for fee",
      ],
      processingTime: "Minutes to 72 hours",
      officialUrl,
      source: "passport-index-dataset",
    };
  if (code === "X")
    return {
      status: "No Admission",
      explanation: `${destName} does not admit holders of ${passportName} passports.`,
      maxStay: "Not permitted",
      documents: ["Special authorization (if any)"],
      processingTime: "—",
      officialUrl,
      source: "passport-index-dataset",
    };
  return {
    status: "Visa Required",
    explanation: `Citizens of ${passportName} must obtain a visa in advance before travelling to ${destName}.`,
    maxStay: "Varies by visa type (typically 30–90 days)",
    documents: [
      "Valid passport (6+ months)",
      "Completed visa application form",
      "Recent passport photos",
      "Proof of accommodation & itinerary",
      "Bank statements / proof of funds",
      "Invitation letter (if applicable)",
    ],
    processingTime: "Typically 2–6 weeks",
    officialUrl,
    source: "passport-index-dataset",
  };
}

const PASSPORT_KEY = "vp_passport_code";
const RECENT_KEY = "vp_recent_searches";

export interface RecentSearch {
  passport: string;
  destination: string;
  status: string;
  timestamp: number;
}

export function loadSavedPassport(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(PASSPORT_KEY) || "";
  } catch {
    return "";
  }
}

export function savePassport(code: string) {
  try {
    localStorage.setItem(PASSPORT_KEY, code);
  } catch (error) {
    void error;
  }
}

export function saveRecentSearch(search: RecentSearch, scope = GUEST_STORAGE_SCOPE) {
  try {
    const raw = localStorage.getItem(buildScopedStorageKey(RECENT_KEY, scope));
    const arr: RecentSearch[] = raw ? JSON.parse(raw) : [];
    const next = [
      search,
      ...arr.filter((s) => s.passport !== search.passport || s.destination !== search.destination),
    ].slice(0, 6);
    localStorage.setItem(buildScopedStorageKey(RECENT_KEY, scope), JSON.stringify(next));
  } catch (error) {
    void error;
  }
}

export function loadRecentSearches(scope = GUEST_STORAGE_SCOPE): RecentSearch[] {
  if (typeof window === "undefined") return [];
  try {
    const scoped = localStorage.getItem(buildScopedStorageKey(RECENT_KEY, scope));
    if (scoped) return JSON.parse(scoped);

    if (scope === GUEST_STORAGE_SCOPE) {
      const legacy = localStorage.getItem(RECENT_KEY);
      return legacy ? JSON.parse(legacy) : [];
    }

    return [];
  } catch {
    return [];
  }
}
