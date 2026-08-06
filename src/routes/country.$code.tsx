import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  BadgeDollarSign,
  Banknote,
  CalendarDays,
  Check,
  Clock,
  Compass,
  ExternalLink,
  FileText,
  Globe2,
  Heart,
  Landmark,
  Languages,
  MapPin,
  Phone,
  Plug,
  ShieldCheck,
  Sparkles,
  Utensils,
  Bus,
  X,
} from "lucide-react";
import { CountryCombobox, type CountryOption } from "@/components/CountryCombobox";
import { VISA_CODES } from "@/data/visa-data";
import {
  flagEmoji,
  getCountryName,
  getVisaRequirement,
  loadSavedPassport,
  savePassport,
  type VisaStatus,
} from "@/lib/visa";
import { getCountryProfile } from "@/data/country-profiles";
import { REGION_META } from "@/data/regions";
import { supabase } from "@/integrations/supabase/client";
import { stashPendingAiPrompt } from "@/lib/ai-prompt";
import { usePreferredCurrency } from "@/lib/use-preferred-currency";
import { getCountryHeroImage } from "@/lib/country-image";

export const Route = createFileRoute("/country/$code")({
  loader: ({ params }) => {
    const code = params.code.toUpperCase();
    return { code, name: getCountryName(code) };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.name ?? "Country";
    return {
      meta: [
        { title: `${name} Travel Guide — Asvior` },
        {
          name: "description",
          content: `Visa rules, costs, attractions, and local tips for ${name}.`,
        },
        { property: "og:title", content: `${name} Travel Guide — Asvior` },
        {
          property: "og:description",
          content: `Visa rules, costs, attractions, and local tips for ${name}.`,
        },
      ],
    };
  },
  component: CountryHubPage,
});

const COUNTRY_OPTIONS: CountryOption[] = VISA_CODES.map((code) => ({
  code,
  name: getCountryName(code),
})).sort((a, b) => a.name.localeCompare(b.name));

const statusMeta: Record<
  VisaStatus,
  { pill: string; icon: React.ReactNode; banner: string }
> = {
  "Visa Free": {
    pill: "asv-pill asv-pill--success",
    icon: <ShieldCheck className="h-3.5 w-3.5" />,
    banner: "bg-[var(--asv-success)]",
  },
  "Visa on Arrival": {
    pill: "asv-pill asv-pill--warning",
    icon: <Clock className="h-3.5 w-3.5" />,
    banner: "bg-[var(--asv-warning)]",
  },
  ETA: {
    pill: "asv-pill asv-pill--accent",
    icon: <Globe2 className="h-3.5 w-3.5" />,
    banner: "bg-[var(--asv-accent)]",
  },
  eVisa: {
    pill: "asv-pill asv-pill--primary",
    icon: <Globe2 className="h-3.5 w-3.5" />,
    banner: "bg-[var(--asv-primary)]",
  },
  "Visa Required": {
    pill: "asv-pill asv-pill--primary",
    icon: <FileText className="h-3.5 w-3.5" />,
    banner: "bg-[var(--asv-primary)]",
  },
  "No Admission": {
    pill: "asv-pill asv-pill--primary",
    icon: <X className="h-3.5 w-3.5" />,
    banner: "bg-[var(--asv-ink)]",
  },
};

const FEE_HINT: Record<VisaStatus, string> = {
  "Visa Free": "Free — no visa fee",
  "Visa on Arrival": "Typically $20–$70 (cash)",
  ETA: "Typically $10–$25",
  eVisa: "Typically $25–$100",
  "Visa Required": "Varies by embassy ($40–$200)",
  "No Admission": "—",
};

function CountryHubPage() {
  const navigate = useNavigate();
  const { code, name } = Route.useLoaderData();
  const profile = getCountryProfile(code, name);
  const regionMeta = REGION_META[profile.region] ?? REGION_META.asia;
  const heroImage = getCountryHeroImage(code);
  const { format } = usePreferredCurrency();

  const [passport, setPassport] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [isFav, setIsFav] = useState(false);
  const [days, setDays] = useState(7);

  useEffect(() => {
    setPassport(loadSavedPassport());
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  useEffect(() => {
    if (!userId) {
      setIsFav(false);
      return;
    }
    supabase
      .from("favorite_destinations")
      .select("id")
      .eq("user_id", userId)
      .eq("country_code", code)
      .maybeSingle()
      .then(({ data }) => setIsFav(!!data));
  }, [userId, code]);

  const visa = useMemo(
    () => (passport ? getVisaRequirement(passport, code) : null),
    [passport, code],
  );

  const toggleFav = async () => {
    if (!userId) {
      toast.error("Sign in to save countries");
      return;
    }
    if (isFav) {
      await supabase
        .from("favorite_destinations")
        .delete()
        .eq("user_id", userId)
        .eq("country_code", code);
      setIsFav(false);
      toast.success(`Removed ${name} from favorites`);
    } else {
      await supabase.from("favorite_destinations").insert({ user_id: userId, country_code: code });
      setIsFav(true);
      toast.success(`Saved ${name} ❤️`);
    }
  };

  const immigrationUrl = `https://www.google.com/search?q=${encodeURIComponent(`${name} official immigration authority website`)}`;

  const aiQuestions = [
    `What are the best things to do in ${name}?`,
    `Is ${name} safe for tourists right now?`,
    `What's a realistic ${days}-day budget for ${name}?`,
    `What should I pack for ${name} in ${profile.bestSeason}?`,
  ];

  const handleAiPrompt = (question: string) => {
    stashPendingAiPrompt(question);
    void navigate({ to: "/assistant", search: { q: question } });
  };

  return (
    <div className="asv-page asv-scroll-page">
      {/* Immersive hero */}
      <section className="relative h-[26rem] overflow-hidden">
        <img
          src={heroImage}
          alt={`${name} travel scenery`}
          width={1024}
          height={576}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--asv-ink)]/50 via-[var(--asv-ink)]/20 to-[var(--asv-canvas)]" />

        <div className="absolute inset-x-0 top-0 flex items-center justify-between asv-page-pad pt-3">
          <Link
            to="/countries"
            aria-label="Back to countries"
            className="asv-btn-icon asv-card-glass !border-white/30 !bg-white/90"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={toggleFav}
            aria-label={isFav ? "Remove from favorites" : "Save country"}
            className={`asv-btn-icon asv-card-glass !border-white/30 !bg-white/90 ${
              isFav ? "text-[var(--asv-danger)]" : "text-[var(--asv-ink)]"
            }`}
          >
            <Heart className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-0 asv-page-pad pb-4">
          <span className="text-5xl drop-shadow-lg">{flagEmoji(code)}</span>
          <h1 className="asv-display mt-2 text-[var(--asv-text-3xl)] text-white drop-shadow-md">
            {name}
          </h1>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-white/85">
            <MapPin className="h-4 w-4" />
            {profile.capital} · {regionMeta.label}
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/90">{profile.intro}</p>

          {/* Hero highlights row */}
          <div className="mt-4 flex flex-wrap gap-2">
            {visa && (
              <span className={`${statusMeta[visa.status].pill} !text-white/95 !bg-white/20 backdrop-blur-sm`}>
                {statusMeta[visa.status].icon}
                {visa.status}
              </span>
            )}
            <span className="asv-pill !bg-white/20 !text-white backdrop-blur-sm">
              <CalendarDays className="h-3 w-3" />
              {profile.bestSeason}
            </span>
            <span className="asv-pill !bg-white/20 !text-white backdrop-blur-sm">
              <Banknote className="h-3 w-3" />
              {format(profile.cost.budget, { fromUsd: true, compact: true })}/day
            </span>
          </div>
        </div>
      </section>

      {/* Passport selector */}
      <section className="asv-page-pad asv-section -mt-6 relative z-[1]">
        <div className="asv-card asv-card-glass asv-card-pad shadow-[var(--asv-shadow-lg)]">
          <label className="asv-label mb-2 block">Your passport</label>
          <CountryCombobox
            value={passport}
            onChange={(v) => {
              setPassport(v);
              savePassport(v);
            }}
            options={COUNTRY_OPTIONS}
            placeholder="Select your passport to see visa rules..."
          />
        </div>
      </section>

      {/* Visa information */}
      {visa && (
        <Section title="Visa information" icon={<ShieldCheck className="h-4 w-4" />}>
          <div className="asv-card overflow-hidden">
            <div className={`px-5 py-4 text-white ${statusMeta[visa.status].banner}`}>
              <span className={`inline-flex items-center gap-1.5 ${statusMeta[visa.status].pill}`}>
                {statusMeta[visa.status].icon}
                {visa.status}
              </span>
              <p className="mt-2 text-sm font-semibold opacity-95">
                {getCountryName(passport)} → {name}
              </p>
            </div>
            <div className="space-y-3 p-5">
              <p className="text-sm leading-relaxed text-[var(--asv-ink)]">{visa.explanation}</p>
              <div className="grid grid-cols-2 gap-3">
                <InfoTile
                  icon={<Clock className="h-4 w-4" />}
                  label="Max stay"
                  value={visa.maxStay}
                />
                <InfoTile
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Processing"
                  value={visa.processingTime}
                />
              </div>
              <InfoTile
                icon={<BadgeDollarSign className="h-4 w-4" />}
                label="Government fee"
                value={FEE_HINT[visa.status]}
              />
              <div className="grid grid-cols-1 gap-2 pt-1">
                <a
                  href={visa.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="asv-btn asv-btn-primary w-full"
                >
                  <Globe2 className="h-4 w-4" /> Official visa website{" "}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a
                  href={immigrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="asv-btn asv-btn-secondary w-full"
                >
                  <Landmark className="h-4 w-4" /> Immigration authority{" "}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
              <p className="rounded-[var(--asv-radius-lg)] bg-[var(--asv-canvas)] p-3 text-center text-xs leading-relaxed text-[var(--asv-ink-secondary)]">
                Visa requirements may change at any time. Always verify the latest information with
                the official embassy, immigration authority or government before making travel
                arrangements.
              </p>
            </div>
          </div>
        </Section>
      )}

      {visa && visa.status !== "No Admission" && (
        <Section title="Document checklist" icon={<FileText className="h-4 w-4" />}>
          <DocChecklist passport={passport} code={code} documents={visa.documents} />
        </Section>
      )}

      {/* Travel cost */}
      <Section title="Travel cost" icon={<Banknote className="h-4 w-4" />}>
        <div className="asv-card asv-card-pad">
          <div className="flex items-center justify-between">
            <p className="asv-label !normal-case !tracking-normal">Trip length</p>
            <div className="flex gap-1.5">
              {[3, 7, 14].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDays(d)}
                  className={`asv-chip !min-h-8 !px-3 !py-1 !text-xs ${
                    days === d ? "asv-chip--active" : ""
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 space-y-2.5">
            <CostRow
              emoji="🎒"
              label="Budget"
              daily={profile.cost.budget}
              days={days}
              tone="asv-pill--success"
            />
            <CostRow
              emoji="🧳"
              label="Standard"
              daily={profile.cost.standard}
              days={days}
              tone="asv-pill--primary"
            />
            <CostRow
              emoji="👑"
              label="Luxury"
              daily={profile.cost.luxury}
              days={days}
              tone="asv-pill--warning"
            />
          </div>
          <p className="mt-3 text-center text-xs text-[var(--asv-ink-tertiary)]">
            Estimates per person excluding international flights.
          </p>
        </div>
      </Section>

      {/* Travel information grid */}
      <Section title="Travel information" icon={<Compass className="h-4 w-4" />}>
        <div className="grid grid-cols-2 gap-3">
          <InfoCard
            icon={<CalendarDays className="h-4 w-4" />}
            label="Best season"
            value={profile.bestSeason}
          />
          <InfoCard
            icon={<Banknote className="h-4 w-4" />}
            label="Currency"
            value={profile.currency}
          />
          <InfoCard
            icon={<Languages className="h-4 w-4" />}
            label="Language"
            value={profile.language}
          />
          <InfoCard icon={<Clock className="h-4 w-4" />} label="Time zone" value={profile.timezone} />
          <InfoCard icon={<Plug className="h-4 w-4" />} label="Power plug" value={profile.plug} />
          <InfoCard
            icon={<Phone className="h-4 w-4" />}
            label="Emergency"
            value={profile.emergency}
          />
        </div>
      </Section>

      {/* Top attractions horizontal scroll */}
      <Section title="Top attractions" icon={<MapPin className="h-4 w-4" />}>
        <div className="-mx-[var(--asv-space-page)] flex gap-3 overflow-x-auto asv-page-pad pb-2 [scrollbar-width:none]">
          {profile.attractions.map((a, i) => (
            <div key={a.name} className="asv-dest-card w-[180px] shrink-0">
              <img
                src={getCountryHeroImage(code)}
                alt={a.name}
                width={1024}
                height={576}
                loading="lazy"
                style={{ objectPosition: `${(i * 33) % 100}% center` }}
              />
              <div className="asv-dest-card-overlay" aria-hidden />
              <div className="asv-dest-card-body">
                <span className="text-xl">{a.emoji}</span>
                <p className="asv-dest-card-title mt-1 text-base">{a.name}</p>
                <p className="mt-0.5 text-xs leading-snug text-white/75">{a.blurb}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Local tips */}
      <Section title="Local tips" icon={<Sparkles className="h-4 w-4" />}>
        <div className="space-y-2.5">
          <TipRow
            icon={<Utensils className="h-4 w-4" />}
            tone="asv-pill--warning"
            label="Food"
            text={profile.tips.food}
          />
          <TipRow
            icon={<Landmark className="h-4 w-4" />}
            tone="asv-pill--primary"
            label="Culture"
            text={profile.tips.culture}
          />
          <TipRow
            icon={<Bus className="h-4 w-4" />}
            tone="asv-pill--success"
            label="Transport"
            text={profile.tips.transport}
          />
          <TipRow
            icon={<ShieldCheck className="h-4 w-4" />}
            tone="asv-pill--accent"
            label="Safety"
            text={profile.tips.safety}
          />
        </div>
      </Section>

      {/* AI prompt shortcuts */}
      <section className="asv-page-pad asv-section pb-8">
        <div className="asv-ai-banner">
          <div className="relative z-[1] flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--asv-radius-md)] bg-white/15">
              <Sparkles className="h-6 w-6" aria-hidden />
            </div>
            <div>
              <span className="asv-label !text-white/70">AI Concierge</span>
              <p className="asv-headline mt-1 !text-white">Ask AI about {name}</p>
              <p className="mt-1 text-sm text-white/80">Instant answers from Asvior AI</p>
            </div>
          </div>
        </div>
        <div className="mt-3 space-y-2">
          {aiQuestions.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => handleAiPrompt(question)}
              className="asv-card asv-card--lift flex w-full items-center justify-between gap-2 p-3.5 text-left"
            >
              <span className="min-w-0 flex-1 text-sm font-medium text-[var(--asv-ink)]">
                {question}
              </span>
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-[var(--asv-primary)]" aria-hidden />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="asv-page-pad asv-section">
      <div className="asv-section-head">
        <div>
          <p className="asv-overline flex items-center gap-1.5">
            <span className="text-[var(--asv-primary)]">{icon}</span>
            {title}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[var(--asv-radius-lg)] bg-[var(--asv-canvas)] p-3">
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--asv-ink-tertiary)]">
        <span className="text-[var(--asv-primary)]">{icon}</span>
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-[var(--asv-ink)]">{value}</p>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="asv-card asv-card-pad">
      <div className="asv-tool-icon !h-10 !w-10">{icon}</div>
      <p className="asv-label mt-3 !normal-case !tracking-normal">{label}</p>
      <p className="mt-1 text-sm font-semibold leading-snug text-[var(--asv-ink)]">{value}</p>
    </div>
  );
}

function CostRow({
  emoji,
  label,
  daily,
  days,
  tone,
}: {
  emoji: string;
  label: string;
  daily: number;
  days: number;
  tone: string;
}) {
  const { format } = usePreferredCurrency();
  return (
    <div className="flex items-center gap-3 rounded-[var(--asv-radius-lg)] bg-[var(--asv-canvas)] p-3">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--asv-radius-md)] text-lg asv-pill ${tone}`}
      >
        {emoji}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-[var(--asv-ink)]">{label}</p>
        <p className="text-xs text-[var(--asv-ink-secondary)]">
          {format(daily, { fromUsd: true, compact: true })}/day
        </p>
      </div>
      <p className="text-sm font-extrabold text-[var(--asv-ink)]">
        {format(daily * days, { fromUsd: true, compact: true })}
      </p>
    </div>
  );
}

function TipRow({
  icon,
  tone,
  label,
  text,
}: {
  icon: React.ReactNode;
  tone: string;
  label: string;
  text: string;
}) {
  return (
    <div className="asv-card asv-card-pad flex items-start gap-3">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--asv-radius-md)] asv-pill ${tone}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-[var(--asv-ink)]">{label}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-[var(--asv-ink-secondary)]">{text}</p>
      </div>
    </div>
  );
}

function DocChecklist({
  passport,
  code,
  documents,
}: {
  passport: string;
  code: string;
  documents: string[];
}) {
  const storageKey = `vp_country_docs_v1_${passport}_${code}`;
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      setChecked(raw ? JSON.parse(raw) : {});
    } catch {
      setChecked({});
    }
  }, [storageKey]);

  const toggle = (doc: string) => {
    setChecked((prev) => {
      const next = { ...prev, [doc]: !prev[doc] };
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch (error) {
        void error;
      }
      return next;
    });
  };

  const done = documents.filter((d) => checked[d]).length;
  const pct = documents.length ? Math.round((done / documents.length) * 100) : 0;

  return (
    <div className="asv-card asv-card-pad">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-[var(--asv-ink)]">
          {done}/{documents.length} ready
        </p>
        <span className="asv-pill asv-pill--success">{pct}%</span>
      </div>
      <div className="asv-progress mt-2.5">
        <div className="asv-progress-bar" style={{ width: `${pct}%` }} />
      </div>
      <ul className="mt-4 space-y-2">
        {documents.map((doc) => {
          const isDone = !!checked[doc];
          return (
            <li key={doc}>
              <button
                type="button"
                onClick={() => toggle(doc)}
                className={`flex w-full items-center gap-3 rounded-[var(--asv-radius-lg)] p-3 text-left transition-all active:scale-[0.99] ${
                  isDone ? "bg-[var(--asv-success-soft)]" : "bg-[var(--asv-canvas)]"
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                    isDone
                      ? "border-[var(--asv-success)] bg-[var(--asv-success)] text-white"
                      : "border-[var(--asv-border)] bg-[var(--asv-surface)]"
                  }`}
                >
                  {isDone && <Check className="h-3 w-3" strokeWidth={3.5} />}
                </span>
                <span
                  className={`text-sm ${isDone ? "text-[var(--asv-ink-tertiary)] line-through" : "text-[var(--asv-ink)]"}`}
                >
                  {doc}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-center text-xs text-[var(--asv-ink-tertiary)]">
        Progress saves automatically on this device.
      </p>
    </div>
  );
}
