import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Clock,
  Compass,
  Globe2,
  Heart,
  Loader2,
  ShieldCheck,
  X,
  ExternalLink,
  FileText,
  Plane,
  Stamp,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountryCombobox, type CountryOption } from "@/components/CountryCombobox";
import { VISA_CODES } from "@/data/visa-data";
import {
  flagEmoji,
  getCountryName,
  getVisaRequirement,
  loadSavedPassport,
  savePassport,
  saveRecentSearch,
  type VisaResult,
  type VisaStatus,
} from "@/lib/visa";
import { supabase } from "@/integrations/supabase/client";
import { recordVisaCheckSuccess } from "@/lib/in-app-review";
import { toast } from "sonner";
import { GUEST_STORAGE_SCOPE } from "@/lib/app-session";
import { PageBadge, PageHeader, PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/visa-check")({
  head: () => ({
    meta: [
      { title: "Visa Check — Asvior" },
      { name: "description", content: "Real visa requirements between 199 countries." },
    ],
  }),
  component: VisaCheckPage,
});

const COUNTRY_OPTIONS: CountryOption[] = VISA_CODES.map((code) => ({
  code,
  name: getCountryName(code),
})).sort((a, b) => a.name.localeCompare(b.name));

const statusMeta: Record<
  VisaStatus,
  { pill: string; icon: React.ReactNode; label: string; tone: string }
> = {
  "Visa Free": {
    pill: "asv-pill asv-pill--success",
    icon: <ShieldCheck className="h-3.5 w-3.5" />,
    label: "Visa Free",
    tone: "var(--asv-success)",
  },
  "Visa on Arrival": {
    pill: "asv-pill asv-pill--warning",
    icon: <Clock className="h-3.5 w-3.5" />,
    label: "Visa on Arrival",
    tone: "var(--asv-warning)",
  },
  ETA: {
    pill: "asv-pill asv-pill--accent",
    icon: <Globe2 className="h-3.5 w-3.5" />,
    label: "ETA Required",
    tone: "var(--asv-accent)",
  },
  eVisa: {
    pill: "asv-pill asv-pill--accent",
    icon: <Globe2 className="h-3.5 w-3.5" />,
    label: "eVisa",
    tone: "var(--asv-accent)",
  },
  "Visa Required": {
    pill: "asv-pill asv-pill--warning",
    icon: <X className="h-3.5 w-3.5" />,
    label: "Visa Required",
    tone: "var(--asv-danger)",
  },
  "No Admission": {
    pill: "asv-pill asv-pill--warning",
    icon: <X className="h-3.5 w-3.5" />,
    label: "No Admission",
    tone: "var(--asv-danger)",
  },
};

const LOADING_STEPS = [
  "Checking visa requirements...",
  "Reviewing entry rules...",
  "Preparing document checklist...",
  "Finalizing your results...",
];

const VISA_TIMELINE = [
  { icon: <ShieldCheck className="h-4 w-4" />, label: "Verify status" },
  { icon: <FileText className="h-4 w-4" />, label: "Gather documents" },
  { icon: <Stamp className="h-4 w-4" />, label: "Apply if needed" },
  { icon: <Plane className="h-4 w-4" />, label: "Travel ready" },
];

function VisaCheckPage() {
  const [passport, setPassport] = useState(() => loadSavedPassport());
  const [destination, setDestination] = useState("");
  const [result, setResult] = useState<VisaResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  useEffect(() => {
    if (!userId || !destination) {
      setIsFav(false);
      return;
    }
    supabase
      .from("favorite_destinations")
      .select("id")
      .eq("user_id", userId)
      .eq("country_code", destination)
      .maybeSingle()
      .then(({ data }) => setIsFav(!!data));
  }, [userId, destination]);

  const options = useMemo(() => COUNTRY_OPTIONS, []);

  const handleCheck = async () => {
    if (!passport || !destination || checking) return;
    setResult(null);
    setChecking(true);
    setLoadingStep(0);
    const timer = setInterval(() => {
      setLoadingStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1));
    }, 380);
    await new Promise((res) => setTimeout(res, 1250));
    clearInterval(timer);
    const r = getVisaRequirement(passport, destination);
    setResult(r);
    setChecking(false);
    if (r) {
      saveRecentSearch(
        {
          passport,
          destination,
          status: r.status,
          timestamp: Date.now(),
        },
        userId || GUEST_STORAGE_SCOPE,
      );
    }
    if (userId && r) {
      await supabase.from("visa_history").insert({
        user_id: userId,
        passport_code: passport,
        destination_code: destination,
        status: r.status,
      });
    }
    if (r) {
      recordVisaCheckSuccess().catch(() => undefined);
    }
  };

  const toggleFav = async () => {
    if (!userId) {
      toast.error("Sign in to save favorites");
      return;
    }
    if (isFav) {
      await supabase
        .from("favorite_destinations")
        .delete()
        .eq("user_id", userId)
        .eq("country_code", destination);
      setIsFav(false);
      toast.success("Removed from favorites");
    } else {
      await supabase
        .from("favorite_destinations")
        .insert({ user_id: userId, country_code: destination });
      setIsFav(true);
      toast.success("Added to favorites");
    }
  };

  return (
    <PageShell className="asv-scroll-page" showProfileAvatar>
      <PageHeader
        badge={<PageBadge icon={<Plane className="h-3.5 w-3.5" />}>199 countries</PageBadge>}
        title="Visa Check"
        subtitle="Instantly see if you need a visa, how long you can stay, and what to bring."
      />

      {/* Journey selector */}
      <section className="asv-page-pad mt-1">
        <div className="asv-card asv-card-pad">
          <p className="asv-overline mb-4">Your journey</p>

          <div className="relative flex flex-col gap-0">
            <div className="absolute left-[22px] top-10 bottom-10 w-0.5 bg-gradient-to-b from-[var(--asv-primary)] via-[var(--asv-accent)] to-[var(--asv-primary-soft)]" />

            <div className="relative flex items-start gap-4 pb-6">
              <div className="asv-row-icon z-10 shrink-0 !h-11 !w-11">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1 pt-1">
                <label className="asv-label">Passport country</label>
                <div className="mt-2">
                  <CountryCombobox
                    value={passport}
                    onChange={(v) => {
                      setPassport(v);
                      savePassport(v);
                      setResult(null);
                    }}
                    options={options}
                    placeholder="Search passport country..."
                  />
                </div>
                {passport && (
                  <p className="sr-only">
                    Selected: {getCountryName(passport)}
                  </p>
                )}
              </div>
            </div>

            <div className="relative flex items-start gap-4">
              <div className="asv-row-icon z-10 shrink-0 !h-11 !w-11 !bg-[var(--asv-accent-soft)] !text-[var(--asv-accent)]">
                <Globe2 className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1 pt-1">
                <label className="asv-label">Destination</label>
                <div className="mt-2">
                  <CountryCombobox
                    value={destination}
                    onChange={(v) => {
                      setDestination(v);
                      setResult(null);
                    }}
                    options={options}
                    placeholder="Search destination..."
                  />
                </div>
                {destination && (
                  <p className="sr-only">
                    Selected: {getCountryName(destination)}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Button
            onClick={handleCheck}
            disabled={!passport || !destination || checking}
            className="mt-5 h-12 w-full"
          >
            {checking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheck className="h-4 w-4" />
            )}
            {checking ? "Checking..." : "Check requirements"}
          </Button>
        </div>
      </section>

      {/* Loading timeline */}
      {checking && (
        <section className="asv-page-pad mt-4 pb-2" aria-live="polite">
          <div className="asv-card asv-card-pad">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--asv-radius-md)] bg-[var(--asv-primary)] text-white">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--asv-ink)]">
                  {LOADING_STEPS[loadingStep]}
                </p>
                <div className="asv-progress mt-2.5">
                  <div
                    className="asv-progress-bar"
                    style={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-between gap-2">
              {LOADING_STEPS.map((step, i) => (
                <div key={step} className="flex flex-1 flex-col items-center gap-1.5">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                      i <= loadingStep
                        ? "bg-[var(--asv-primary)] text-white"
                        : "bg-[var(--asv-border)] text-[var(--asv-ink-tertiary)]"
                    }`}
                  >
                    {i < loadingStep ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </div>
                  <span className="hidden text-[9px] font-medium text-[var(--asv-ink-tertiary)] sm:block">
                    Step {i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Results dashboard */}
      {result && !checking && (
        <section className="asv-page-pad mt-4 space-y-4 pb-6 asv-animate-in">
          {/* Status hero */}
          <div
            className="asv-ai-banner p-5"
            style={{
              background: `linear-gradient(135deg, ${statusMeta[result.status].tone} 0%, var(--asv-primary) 100%)`,
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold text-white">
                  {statusMeta[result.status].icon}
                  {statusMeta[result.status].label}
                </span>
                <p className="asv-display mt-3 text-xl text-white">
                  {flagEmoji(passport)} → {flagEmoji(destination)}
                </p>
                <p className="mt-1 text-sm text-white/80">
                  {getCountryName(passport)} to {getCountryName(destination)}
                </p>
              </div>
              <button
                onClick={toggleFav}
                aria-label={isFav ? "Remove favorite" : "Add favorite"}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-transform active:scale-95"
              >
                <Heart className={`h-4 w-4 ${isFav ? "fill-white" : ""}`} />
              </button>
            </div>
          </div>

          {/* Process timeline */}
          <div className="asv-card asv-card-pad">
            <p className="asv-overline mb-4">Entry process</p>
            <div className="relative flex items-start justify-between">
              <div className="absolute left-[12%] right-[12%] top-5 h-0.5 bg-[var(--asv-border)]" />
              {VISA_TIMELINE.map((step, i) => (
                <div key={step.label} className="relative z-10 flex flex-1 flex-col items-center gap-2">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--asv-surface)] ${
                      i === 0
                        ? "bg-[var(--asv-primary-soft)] text-[var(--asv-primary)]"
                        : "bg-[var(--asv-canvas)] text-[var(--asv-ink-tertiary)]"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <span className="max-w-[4.5rem] text-center text-[10px] font-semibold leading-tight text-[var(--asv-ink-secondary)]">
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="px-1 text-sm leading-relaxed text-[var(--asv-ink-secondary)]">
            {result.explanation}
          </p>

          {/* Requirement stat cards */}
          <div className="asv-stat-grid">
            <div className="asv-stat">
              <Clock className="mx-auto mb-1 h-4 w-4 text-[var(--asv-primary)]" />
              <p className="asv-stat-value text-base">{result.maxStay}</p>
              <p className="asv-stat-label">Max stay</p>
            </div>
            <div className="asv-stat">
              <Globe2 className="mx-auto mb-1 h-4 w-4 text-[var(--asv-accent)]" />
              <p className="asv-stat-value text-base">{result.processingTime}</p>
              <p className="asv-stat-label">Processing</p>
            </div>
            <div className="asv-stat">
              <FileText className="mx-auto mb-1 h-4 w-4 text-[var(--asv-success)]" />
              <p className="asv-stat-value text-base">{result.documents.length}</p>
              <p className="asv-stat-label">Documents</p>
            </div>
          </div>

          {/* Document checklist */}
          <div className="asv-card asv-card-pad">
            <div className="flex items-center justify-between">
              <p className="asv-title flex items-center gap-2">
                <FileText className="h-4 w-4 text-[var(--asv-primary)]" />
                Required documents
              </p>
              <span className="asv-pill asv-pill--primary">{result.documents.length} items</span>
            </div>
            <ul className="mt-4 space-y-2">
              {result.documents.map((doc, i) => (
                <li
                  key={doc}
                  className="flex items-center gap-3 rounded-[var(--asv-radius-md)] bg-[var(--asv-canvas)] p-3"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--asv-success-soft)] text-[var(--asv-success)]">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-sm font-medium text-[var(--asv-ink)]">{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-2.5">
            <a
              href={result.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="asv-btn asv-btn-primary w-full"
            >
              <Globe2 className="h-4 w-4" />
              Visit official portal
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            <Link
              to="/country/$code"
              params={{ code: destination }}
              className="asv-btn asv-btn-secondary w-full"
            >
              <Compass className="h-4 w-4 text-[var(--asv-primary)]" />
              Explore {getCountryName(destination)} guide
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <p className="rounded-[var(--asv-radius-md)] bg-[var(--asv-canvas)] p-3 text-center text-[10px] leading-relaxed text-[var(--asv-ink-tertiary)]">
            Visa requirements may change at any time. Always verify the latest information with the
            official embassy, immigration authority or government before making travel arrangements.
            Source: Passport Index.
          </p>
        </section>
      )}
    </PageShell>
  );
}
