import { createFileRoute, Link } from "@tanstack/react-router";
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
  officialUrlFor,
  savePassport,
  type VisaStatus,
} from "@/lib/visa";
import { getCountryProfile } from "@/data/country-profiles";
import { REGION_META } from "@/data/regions";
import { supabase } from "@/integrations/supabase/client";

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

const statusTone: Record<VisaStatus, string> = {
  "Visa Free": "bg-emerald text-white",
  "Visa on Arrival": "bg-amber-400/90 text-amber-950",
  ETA: "bg-sky-400/90 text-sky-950",
  eVisa: "bg-navy text-primary-foreground",
  "Visa Required": "bg-destructive text-destructive-foreground",
  "No Admission": "bg-navy text-white",
};

const statusIcon: Record<VisaStatus, React.ReactNode> = {
  "Visa Free": <ShieldCheck className="h-3.5 w-3.5" />,
  "Visa on Arrival": <Clock className="h-3.5 w-3.5" />,
  ETA: <Globe2 className="h-3.5 w-3.5" />,
  eVisa: <Globe2 className="h-3.5 w-3.5" />,
  "Visa Required": <FileText className="h-3.5 w-3.5" />,
  "No Admission": <X className="h-3.5 w-3.5" />,
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
  const { code, name } = Route.useLoaderData();
  const profile = getCountryProfile(code, name);
  const regionMeta = REGION_META[profile.region] ?? REGION_META.asia;

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

  return (
    <div className="relative overflow-x-hidden pb-6">
      {/* ============ HERO ============ */}
      <section className="relative h-[420px] overflow-hidden rounded-b-[2.25rem]">
        <img
          src={regionMeta.image}
          alt={`${name} travel scenery`}
          width={1024}
          height={576}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/20 to-ink/90" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />

        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-[calc(env(safe-area-inset-top)+1rem)]">
          <Link
            to="/countries"
            aria-label="Back to countries"
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/25 bg-white/12 text-white backdrop-blur-md transition-colors hover:bg-white/20 active:scale-95"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </Link>
          <button
            onClick={toggleFav}
            aria-label={isFav ? "Remove from favorites" : "Save country"}
            className={`flex h-10 w-10 items-center justify-center rounded-2xl border border-white/25 bg-white/12 backdrop-blur-md transition-colors hover:bg-white/20 active:scale-95 ${
              isFav ? "text-red-400" : "text-white"
            }`}
          >
            <Heart className={`h-4.5 w-4.5 ${isFav ? "fill-current" : ""}`} />
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-0 px-4 pb-5 animate-fade-in">
          <span className="text-5xl drop-shadow-lg">{flagEmoji(code)}</span>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-white">{name}</h1>
            {visa && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-2xs font-bold uppercase tracking-wider ${statusTone[visa.status]}`}
              >
                {statusIcon[visa.status]}
                {visa.status}
              </span>
            )}
          </div>
          <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-white/80">
            <MapPin className="h-3.5 w-3.5 text-white" />
            {profile.capital} · {regionMeta.label}
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/75">{profile.intro}</p>
        </div>
      </section>

      {/* ============ PASSPORT SELECTOR ============ */}
      <section className="relative -mt-8 z-10 px-4">
        <div className="rounded-2xl border border-white/50 bg-card/90 p-4 elev-4 backdrop-blur-xl">
          <label className="text-eyebrow mb-1.5 block text-muted-foreground">Your passport</label>
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

      {/* ============ VISA INFORMATION ============ */}
      {visa && (
        <Section title="Visa information" icon={<ShieldCheck className="h-4 w-4" />}>
          <div className="premium-card overflow-hidden rounded-3xl">
            <div className={`px-5 py-4 ${statusTone[visa.status]}`}>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest">
                {statusIcon[visa.status]}
                {visa.status}
              </div>
              <p className="mt-2 text-[13px] font-semibold opacity-95">
                {getCountryName(passport)} → {name}
              </p>
            </div>
            <div className="space-y-3 p-5">
              <p className="text-sm leading-relaxed text-foreground">{visa.explanation}</p>
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
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-navy px-4 py-3 text-sm font-semibold text-primary-foreground shadow-soft"
                >
                  <Globe2 className="h-4 w-4" /> Official visa website{" "}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a
                  href={immigrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="premium-card inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-foreground"
                >
                  <Landmark className="h-4 w-4 text-primary" /> Immigration authority{" "}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
              <p className="rounded-2xl bg-muted/60 p-3 text-center text-[10px] leading-relaxed text-muted-foreground">
                Visa requirements may change at any time. Always verify the latest information with
                the official embassy, immigration authority or government before making travel
                arrangements.
              </p>
            </div>
          </div>
        </Section>
      )}

      {/* ============ DOCUMENT CHECKLIST ============ */}
      {visa && visa.status !== "No Admission" && (
        <Section title="Document checklist" icon={<FileText className="h-4 w-4" />}>
          <DocChecklist passport={passport} code={code} documents={visa.documents} />
        </Section>
      )}

      {/* ============ TRAVEL COST ============ */}
      <Section title="Travel cost" icon={<Banknote className="h-4 w-4" />}>
        <div className="premium-card rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-eyebrow text-muted-foreground">Trip length</p>
            <div className="flex gap-1.5">
              {[3, 7, 14].map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`rounded-full px-3 py-1 text-[11px] font-bold transition-colors ${
                    days === d
                      ? "bg-navy text-primary-foreground shadow-soft"
                      : "bg-muted text-muted-foreground"
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
              tone="bg-emerald/12 text-emerald"
            />
            <CostRow
              emoji="🧳"
              label="Standard"
              daily={profile.cost.standard}
              days={days}
              tone="bg-primary/10 text-primary"
            />
            <CostRow
              emoji="👑"
              label="Luxury"
              daily={profile.cost.luxury}
              days={days}
              tone="bg-amber-400/15 text-amber-600 dark:text-amber-400"
            />
          </div>
          <p className="mt-3 text-center text-[10px] text-muted-foreground">
            Estimates per person (USD) excluding international flights.
          </p>
        </div>
      </Section>

      {/* ============ TRAVEL INFORMATION ============ */}
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
          <InfoCard
            icon={<Clock className="h-4 w-4" />}
            label="Time zone"
            value={profile.timezone}
          />
          <InfoCard icon={<Plug className="h-4 w-4" />} label="Power plug" value={profile.plug} />
          <InfoCard
            icon={<Phone className="h-4 w-4" />}
            label="Emergency"
            value={profile.emergency}
          />
        </div>
      </Section>

      {/* ============ TOP ATTRACTIONS ============ */}
      <Section title="Top attractions" icon={<MapPin className="h-4 w-4" />}>
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
          {profile.attractions.map((a, i) => (
            <div
              key={a.name}
              className="relative h-48 w-40 shrink-0 overflow-hidden rounded-3xl elev-2"
            >
              <img
                src={regionMeta.image}
                alt={a.name}
                width={1024}
                height={576}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: `${(i * 33) % 100}% center` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3.5">
                <span className="text-2xl drop-shadow">{a.emoji}</span>
                <p className="mt-1 text-[13px] font-bold leading-tight text-white">{a.name}</p>
                <p className="mt-0.5 text-[10px] leading-snug text-white/75">{a.blurb}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ============ LOCAL TIPS ============ */}
      <Section title="Local tips" icon={<Sparkles className="h-4 w-4" />}>
        <div className="space-y-2.5">
          <TipRow
            icon={<Utensils className="h-4 w-4" />}
            tone="bg-amber-400/15 text-amber-600 dark:text-amber-400"
            label="Food"
            text={profile.tips.food}
          />
          <TipRow
            icon={<Landmark className="h-4 w-4" />}
            tone="bg-primary/10 text-primary"
            label="Culture"
            text={profile.tips.culture}
          />
          <TipRow
            icon={<Bus className="h-4 w-4" />}
            tone="bg-emerald/12 text-emerald"
            label="Transport"
            text={profile.tips.transport}
          />
          <TipRow
            icon={<ShieldCheck className="h-4 w-4" />}
            tone="bg-destructive/10 text-destructive"
            label="Safety"
            text={profile.tips.safety}
          />
        </div>
      </Section>

      {/* ============ ASK AI ============ */}
      <section className="relative mt-8 px-4 pb-2">
        <div className="relative overflow-hidden rounded-3xl grad-ink p-5 text-white elev-3">
          <span className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-aurora/25 blur-2xl" />
          <span className="pointer-events-none absolute -bottom-16 -left-8 h-40 w-40 rounded-full bg-gold/20 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/12">
              <Sparkles className="h-5 w-5" strokeWidth={2.4} />
            </div>
            <div>
              <p className="text-sm font-bold">Ask AI about {name}</p>
              <p className="mt-0.5 text-2xs text-white/70">
                Instant answers from your travel concierge
              </p>
            </div>
          </div>
          <div className="relative mt-4 space-y-2">
            {aiQuestions.map((q) => (
              <Link
                key={q}
                to="/assistant"
                search={{ q }}
                className="flex items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-2.5 text-left text-[13px] font-medium transition-colors hover:bg-white/15 active:scale-[0.99]"
              >
                <span className="min-w-0 flex-1">{q}</span>
                <Sparkles className="h-3.5 w-3.5 shrink-0 opacity-70" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- Sub-components ---------- */

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
    <section className="relative mt-8 px-4">
      <p className="text-eyebrow mb-3 flex items-center gap-1.5 text-muted-foreground">
        <span className="text-primary">{icon}</span>
        {title}
      </p>
      {children}
    </section>
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

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="premium-card rounded-2xl p-4 transition-transform active:scale-[0.98]">
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-secondary text-navy">
        {icon}
      </div>
      <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-[13px] font-semibold leading-snug text-foreground">{value}</p>
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
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-muted/60 p-3">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-lg ${tone}`}
      >
        {emoji}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground">${daily}/day</p>
      </div>
      <p className="text-sm font-extrabold text-foreground">${(daily * days).toLocaleString()}</p>
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
    <div className="premium-card flex items-start gap-3 rounded-2xl p-4">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${tone}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-bold text-foreground">{label}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{text}</p>
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
    <div className="premium-card rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-foreground">
          {done}/{documents.length} ready
        </p>
        <span className="rounded-full bg-emerald/12 px-2.5 py-0.5 text-[11px] font-bold text-emerald">
          {pct}%
        </span>
      </div>
      <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-emerald transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <ul className="mt-4 space-y-2">
        {documents.map((doc) => {
          const isDone = !!checked[doc];
          return (
            <li key={doc}>
              <button
                onClick={() => toggle(doc)}
                className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-all active:scale-[0.99] ${
                  isDone ? "bg-emerald/10" : "bg-muted/60"
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                    isDone ? "border-emerald bg-emerald text-white" : "border-border bg-card"
                  }`}
                >
                  {isDone && <Check className="h-3 w-3" strokeWidth={3.5} />}
                </span>
                <span
                  className={`text-sm ${isDone ? "text-muted-foreground line-through" : "text-foreground"}`}
                >
                  {doc}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-center text-[10px] text-muted-foreground">
        Progress saves automatically on this device.
      </p>
    </div>
  );
}
