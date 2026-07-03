import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Clock,
  Compass,
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
import { VISA_CODES } from "@/data/visa-data";
import {
  getCountryName,
  getVisaRequirement,
  loadSavedPassport,
  savePassport,
  saveRecentSearch,
  type VisaResult,
  type VisaStatus,
} from "@/lib/visa";
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

const COUNTRY_OPTIONS: CountryOption[] = VISA_CODES
  .map((code) => ({ code, name: getCountryName(code) }))
  .sort((a, b) => a.name.localeCompare(b.name));

const statusMeta: Record<VisaStatus, { tone: string; icon: React.ReactNode; label: string }> = {
  "Visa Free":       { tone: "gradient-emerald text-white",                icon: <ShieldCheck className="h-4 w-4" />, label: "Visa Free" },
  "Visa on Arrival": { tone: "bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200", icon: <Clock className="h-4 w-4" />, label: "Visa on Arrival" },
  ETA:               { tone: "bg-primary/10 text-primary",                 icon: <Globe2 className="h-4 w-4" />, label: "ETA Required" },
  eVisa:             { tone: "gradient-primary text-primary-foreground",    icon: <Globe2 className="h-4 w-4" />, label: "eVisa" },
  "Visa Required":   { tone: "bg-destructive/10 text-destructive",         icon: <X className="h-4 w-4" />, label: "Visa Required" },
  "No Admission":    { tone: "gradient-navy text-white",                    icon: <X className="h-4 w-4" />, label: "No Admission" },
};

function VisaCheckPage() {
  const [passport, setPassport] = useState(() => loadSavedPassport());
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
    if (r) {
      saveRecentSearch({
        passport,
        destination,
        status: r.status,
        timestamp: Date.now(),
      });
    }
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
              onChange={(v) => { setPassport(v); savePassport(v); setResult(null); }}
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

              <Link
                to="/country/$code"
                params={{ code: destination }}
                className="glass inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-foreground transition-transform active:scale-[0.98]"
              >
                <Compass className="h-4 w-4 text-primary" />
                Explore {getCountryName(destination)} guide
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

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
