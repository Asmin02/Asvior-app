import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Clock,
  Globe2,
  Heart,
  ShieldCheck,
  X,
  ExternalLink,
  FileText,
  Plane,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountryCombobox, type CountryOption } from "@/components/CountryCombobox";
import { VISA_CODES, VISA_DATA } from "@/data/visa-data";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/visa-check")({
  head: () => ({
    meta: [
      { title: "Visa Check — VisaPilot" },
      { name: "description", content: "Real visa requirements between 199 countries." },
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

function getCountryName(code: string): string {
  try { return new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code; }
  catch { return code; }
}

const COUNTRY_OPTIONS: CountryOption[] = VISA_CODES
  .map((code) => ({ code, name: getCountryName(code) }))
  .sort((a, b) => a.name.localeCompare(b.name));

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
  const officialUrl = OFFICIAL_URLS[destination]
    || `https://www.google.com/search?q=${encodeURIComponent(`${destName} official visa information for ${passportName} citizens`)}`;

  if (passport === destination) {
    return { status: "Visa Free", explanation: "You don't need a visa to enter your own country.", maxStay: "Unlimited", documents: ["National ID or passport"], processingTime: "—", officialUrl, source: "passport-index-dataset" };
  }
  const code = VISA_DATA[passport]?.[destination];
  if (!code) {
    return { status: "Visa Required", explanation: `No data available for ${passportName} → ${destName}. Confirm directly with the embassy.`, maxStay: "Varies", documents: ["Valid passport"], processingTime: "Varies", officialUrl, source: "fallback" };
  }
  const days = parseDays(code);
  if (code === "S") return { status: "Visa Free", explanation: "Domestic travel — no visa required.", maxStay: "Unlimited", documents: ["National ID or passport"], processingTime: "—", officialUrl, source: "passport-index-dataset" };
  if (code === "F" || days !== null) return { status: "Visa Free", explanation: `Citizens of ${passportName} can enter ${destName} visa-free${days ? ` for stays up to ${days} days` : ""}.`, maxStay: days ? `${days} days per entry` : "Varies (visa-free)", documents: ["Valid passport (6+ months recommended)", "Return or onward ticket", "Proof of accommodation", "Proof of sufficient funds"], processingTime: "No application required", officialUrl, source: "passport-index-dataset" };
  if (code === "A") return { status: "Visa on Arrival", explanation: `Citizens of ${passportName} can obtain a visa on arrival in ${destName}.`, maxStay: "Typically 15–30 days", documents: ["Valid passport (6+ months)", "Passport-sized photo", "Visa fee (cash, often USD)", "Proof of onward travel", "Proof of accommodation"], processingTime: "Issued at the border (15–60 minutes)", officialUrl, source: "passport-index-dataset" };
  if (code === "E") return { status: "eVisa", explanation: `Citizens of ${passportName} must apply online for an eVisa before travelling to ${destName}.`, maxStay: "Usually 30–90 days", documents: ["Valid passport (6+ months)", "Digital passport photo", "Completed online application", "Credit/debit card for visa fee", "Travel itinerary"], processingTime: "24–72 hours, up to 2 weeks", officialUrl, source: "passport-index-dataset" };
  if (code === "T") return { status: "ETA", explanation: `Citizens of ${passportName} need an Electronic Travel Authorization before flying to ${destName}.`, maxStay: "Up to 90 days per entry", documents: ["Valid passport", "Online ETA application", "Email address", "Credit/debit card for fee"], processingTime: "Minutes to 72 hours", officialUrl, source: "passport-index-dataset" };
  if (code === "X") return { status: "No Admission", explanation: `${destName} does not admit holders of ${passportName} passports.`, maxStay: "Not permitted", documents: ["Special authorization (if any)"], processingTime: "—", officialUrl, source: "passport-index-dataset" };
  return { status: "Visa Required", explanation: `Citizens of ${passportName} must obtain a visa in advance before travelling to ${destName}.`, maxStay: "Varies by visa type (typically 30–90 days)", documents: ["Valid passport (6+ months)", "Completed visa application form", "Recent passport photos", "Proof of accommodation & itinerary", "Bank statements / proof of funds", "Invitation letter (if applicable)"], processingTime: "Typically 2–6 weeks", officialUrl, source: "passport-index-dataset" };
}

const statusMeta: Record<Status, { tone: string; icon: React.ReactNode; label: string }> = {
  "Visa Free":       { tone: "gradient-emerald text-white",                icon: <ShieldCheck className="h-4 w-4" />, label: "Visa Free" },
  "Visa on Arrival": { tone: "bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200", icon: <Clock className="h-4 w-4" />, label: "Visa on Arrival" },
  ETA:               { tone: "bg-primary/10 text-primary",                 icon: <Globe2 className="h-4 w-4" />, label: "ETA Required" },
  eVisa:             { tone: "gradient-primary text-primary-foreground",    icon: <Globe2 className="h-4 w-4" />, label: "eVisa" },
  "Visa Required":   { tone: "bg-destructive/10 text-destructive",         icon: <X className="h-4 w-4" />, label: "Visa Required" },
  "No Admission":    { tone: "gradient-navy text-white",                    icon: <X className="h-4 w-4" />, label: "No Admission" },
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
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 gradient-hero-bg" aria-hidden />
      <div className="pointer-events-none absolute -top-16 -right-10 h-52 w-52 rounded-full bg-primary/25 blur-3xl" aria-hidden />

      <header className="relative px-6 pt-10">
        <div className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold text-primary">
          <Plane className="h-3.5 w-3.5" /> 199 countries · live data
        </div>
        <h1 className="mt-3 text-display text-3xl text-foreground">Visa Check</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Instantly see if you need a visa, how long you can stay, and what to bring.
        </p>
      </header>

      <section className="relative mt-6 px-6 animate-fade-up">
        <div className="glass rounded-3xl p-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Passport
            </label>
            <CountryCombobox
              value={passport}
              onChange={(v) => { setPassport(v); setResult(null); }}
              options={options}
              placeholder="Search passport country..."
            />
          </div>

          <div className="flex justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ArrowRight className="h-4 w-4 rotate-90" />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Destination
            </label>
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
            className="mt-2 h-12 w-full rounded-2xl gradient-primary text-sm font-semibold shadow-float transition-transform active:scale-[0.98] hover:shadow-float"
          >
            <ShieldCheck className="h-4 w-4" />
            Check requirements
          </Button>
        </div>
      </section>

      {result && (
        <section className="relative mt-5 px-6 pb-6 animate-scale-in">
          <div className="glass overflow-hidden rounded-3xl">
            {/* Status header */}
            <div className={`${statusMeta[result.status].tone} px-5 py-4`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/25 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
                    {statusMeta[result.status].icon}
                    {statusMeta[result.status].label}
                  </div>
                  <p className="mt-2 text-[13px] font-semibold opacity-95">
                    {getCountryName(passport)} → {getCountryName(destination)}
                  </p>
                </div>
                <button
                  onClick={toggleFav}
                  aria-label={isFav ? "Remove favorite" : "Add favorite"}
                  className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm transition-transform active:scale-95"
                >
                  <Heart className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="space-y-4 p-5">
              <p className="text-sm leading-relaxed text-foreground">{result.explanation}</p>

              <div className="grid grid-cols-2 gap-3">
                <InfoTile icon={<Clock className="h-4 w-4" />} label="Max stay" value={result.maxStay} />
                <InfoTile icon={<Globe2 className="h-4 w-4" />} label="Processing" value={result.processingTime} />
              </div>

              <div className="rounded-2xl bg-muted/60 p-4">
                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" /> Required documents
                </p>
                <ul className="mt-2.5 space-y-1.5">
                  {result.documents.map((doc) => (
                    <li key={doc} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald/15 text-emerald">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={result.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl gradient-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-float transition-transform active:scale-[0.98]"
              >
                <Globe2 className="h-4 w-4" />
                Visit official portal
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              <p className="text-center text-[10px] text-muted-foreground">
                Source: Passport Index · Always verify with the destination's immigration authority.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-muted/60 p-3">
      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
