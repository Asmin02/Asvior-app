import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CountryCombobox, type CountryOption } from "@/components/CountryCombobox";
import { VISA_CODES, VISA_DATA } from "@/data/visa-data";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/visa-check")({
  head: () => ({
    meta: [
      { title: "Visa Check — VisaPilot" },
      { name: "description", content: "Check real visa requirements between 199 countries with VisaPilot." },
      { property: "og:title", content: "Visa Check — VisaPilot" },
      { property: "og:description", content: "Check real visa requirements between 199 countries with VisaPilot." },
    ],
  }),
  component: VisaCheckPage,
});

type Status = "Visa Free" | "Visa on Arrival" | "ETA" | "eVisa" | "Visa Required" | "No Admission";

interface VisaResult {
  status: Status;
  explanation: string;
  maxStay: string;
  documents: string[];
  processingTime: string;
  officialUrl: string;
  source: string;
}

// Lazy display-name resolver (uses browser Intl.DisplayNames, falls back to code)
function getCountryName(code: string): string {
  try {
    const dn = new Intl.DisplayNames(["en"], { type: "region" });
    return dn.of(code) || code;
  } catch {
    return code;
  }
}

const COUNTRY_OPTIONS: CountryOption[] = VISA_CODES
  .map((code) => ({ code, name: getCountryName(code) }))
  .sort((a, b) => a.name.localeCompare(b.name));

// Best-effort official immigration / e-visa portal per destination (curated)
const OFFICIAL_URLS: Record<string, string> = {
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

function parseDays(code: string): number | null {
  if (code.startsWith("F") && code.length > 1) {
    const n = parseInt(code.slice(1), 10);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function getVisaRequirement(passport: string, destination: string): VisaResult | null {
  if (!passport || !destination) return null;

  const passportName = getCountryName(passport);
  const destName = getCountryName(destination);

  const officialUrl =
    OFFICIAL_URLS[destination] ||
    `https://www.google.com/search?q=${encodeURIComponent(
      `${destName} official visa information for ${passportName} citizens`,
    )}`;

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
      explanation: `No data available for ${passportName} → ${destName}. Confirm directly with the destination's embassy.`,
      maxStay: "Varies",
      documents: ["Valid passport"],
      processingTime: "Varies",
      officialUrl,
      source: "fallback",
    };
  }

  const days = parseDays(code);

  if (code === "S") {
    return {
      status: "Visa Free",
      explanation: "Domestic travel — no visa required.",
      maxStay: "Unlimited",
      documents: ["National ID or passport"],
      processingTime: "—",
      officialUrl,
      source: "passport-index-dataset",
    };
  }

  if (code === "F" || days !== null) {
    return {
      status: "Visa Free",
      explanation: `Citizens of ${passportName} can enter ${destName} visa-free${
        days ? ` for stays up to ${days} days` : ""
      }.`,
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
  }

  if (code === "A") {
    return {
      status: "Visa on Arrival",
      explanation: `Citizens of ${passportName} can obtain a visa on arrival in ${destName}.`,
      maxStay: "Typically 15–30 days (check destination rules)",
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
  }

  if (code === "E") {
    return {
      status: "eVisa",
      explanation: `Citizens of ${passportName} must apply online for an eVisa before travelling to ${destName}.`,
      maxStay: "Usually 30–90 days (depends on visa type)",
      documents: [
        "Valid passport (6+ months)",
        "Digital passport photo",
        "Completed online application",
        "Credit/debit card for visa fee",
        "Travel itinerary",
      ],
      processingTime: "Typically 24–72 hours, up to 2 weeks",
      officialUrl,
      source: "passport-index-dataset",
    };
  }

  if (code === "T") {
    return {
      status: "ETA",
      explanation: `Citizens of ${passportName} need an Electronic Travel Authorization before flying to ${destName}.`,
      maxStay: "Up to 90 days per entry (varies)",
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
  }

  if (code === "X") {
    return {
      status: "No Admission",
      explanation: `${destName} does not admit holders of ${passportName} passports. Contact the embassy for any exceptions.`,
      maxStay: "Not permitted",
      documents: ["Special authorization (if any)"],
      processingTime: "—",
      officialUrl,
      source: "passport-index-dataset",
    };
  }

  // "R" or anything else
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

const statusStyles: Record<Status, { chip: string; ring: string; icon: React.ReactNode }> = {
  "Visa Free": {
    chip: "text-green-700 bg-green-50 dark:text-green-300 dark:bg-green-950/40",
    ring: "ring-green-200 dark:ring-green-900/60",
    icon: <CheckIcon className="h-3.5 w-3.5" />,
  },
  "Visa on Arrival": {
    chip: "text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/40",
    ring: "ring-amber-200 dark:ring-amber-900/60",
    icon: <ClockIcon className="h-3.5 w-3.5" />,
  },
  ETA: {
    chip: "text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/40",
    ring: "ring-blue-200 dark:ring-blue-900/60",
    icon: <GlobeIcon className="h-3.5 w-3.5" />,
  },
  eVisa: {
    chip: "text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-950/40",
    ring: "ring-indigo-200 dark:ring-indigo-900/60",
    icon: <GlobeIcon className="h-3.5 w-3.5" />,
  },
  "Visa Required": {
    chip: "text-red-700 bg-red-50 dark:text-red-300 dark:bg-red-950/40",
    ring: "ring-red-200 dark:ring-red-900/60",
    icon: <CrossIcon className="h-3.5 w-3.5" />,
  },
  "No Admission": {
    chip: "text-zinc-700 bg-zinc-100 dark:text-zinc-300 dark:bg-zinc-900/60",
    ring: "ring-zinc-300 dark:ring-zinc-800",
    icon: <CrossIcon className="h-3.5 w-3.5" />,
  },
};

function VisaCheckPage() {
  const [passport, setPassport] = useState("");
  const [destination, setDestination] = useState("");
  const [result, setResult] = useState<VisaResult | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  useEffect(() => {
    if (!userId || !destination) { setIsFav(false); return; }
    supabase.from("favorite_destinations").select("id").eq("country_code", destination).maybeSingle()
      .then(({ data }) => setIsFav(!!data));
  }, [userId, destination]);

  const options = useMemo(() => COUNTRY_OPTIONS, []);

  const handleCheck = async () => {
    if (!passport || !destination) return;
    const r = getVisaRequirement(passport, destination);
    setResult(r);
    if (userId && r) {
      await supabase.from("visa_history").insert({
        user_id: userId, passport_code: passport, destination_code: destination, status: r.status,
      });
    }
  };

  const toggleFav = async () => {
    if (!userId) { toast.error("Sign in to save favorites"); return; }
    if (isFav) {
      await supabase.from("favorite_destinations").delete().eq("country_code", destination);
      setIsFav(false); toast.success("Removed from favorites");
    } else {
      await supabase.from("favorite_destinations").insert({ user_id: userId, country_code: destination });
      setIsFav(true); toast.success("Added to favorites");
    }
  };

  return (
    <div className="px-5 pt-8 pb-6">
      <h1 className="text-2xl font-bold text-foreground">Visa Check</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Real visa requirements for 199 countries — sourced from the Passport Index dataset.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Passport Country</label>
          <CountryCombobox
            value={passport}
            onChange={(v) => { setPassport(v); setResult(null); }}
            options={options}
            placeholder="Search passport country..."
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Destination Country</label>
          <CountryCombobox
            value={destination}
            onChange={(v) => { setDestination(v); setResult(null); }}
            options={options}
            placeholder="Search destination..."
          />
        </div>

        <Button
          onClick={handleCheck}
          disabled={!passport || !destination}
          className="w-full py-5 text-sm font-semibold"
        >
          Check Visa
        </Button>
      </div>

      {result && (
        <Card className={`mt-6 ring-1 ${statusStyles[result.status].ring}`}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-2">
              <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[result.status].chip}`}>
                {statusStyles[result.status].icon}
                {result.status}
              </div>
              <span className="text-[10px] text-muted-foreground">
                {getCountryName(passport)} → {getCountryName(destination)}
              </span>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-foreground">{result.explanation}</p>

            <div className="mt-4 space-y-3 border-t border-border pt-4">
              <InfoRow label="Maximum stay" value={result.maxStay} />
              <InfoRow label="Processing time" value={result.processingTime} />

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Required documents
                </p>
                <ul className="mt-1.5 space-y-1">
                  {result.documents.map((doc) => (
                    <li key={doc} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={result.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary/10 px-3 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
              >
                <GlobeIcon className="h-4 w-4" />
                Visit official information
                <ExternalIcon className="h-3.5 w-3.5" />
              </a>
            </div>

            <p className="mt-3 text-[10px] text-muted-foreground">
              Source: Passport Index dataset. Documents and processing times are general guidance — always confirm with the destination's official immigration authority.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm text-foreground">{value}</p>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}
function CrossIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.919 17.919 0 01-8.716-2.247m0 0A9.004 9.004 0 003 12c0 1.681.445 3.268 1.22 4.625" />
    </svg>
  );
}
function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
  );
}
