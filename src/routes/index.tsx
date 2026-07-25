import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Plane,
  CheckSquare,
  Wallet,
  Sparkles,
  Globe2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  X,
  FileText,
  TrendingUp,
  MapPin,
  Compass,
  Search,
} from "lucide-react";
import regionEurope from "@/assets/region-europe.jpg";
import regionAsia from "@/assets/region-asia.jpg";
import regionAmericas from "@/assets/region-americas.jpg";
import regionOceania from "@/assets/region-oceania.jpg";
import regionMiddleEast from "@/assets/region-middle-east.jpg";
import { supabase } from "@/integrations/supabase/client";
import {
  getCountryName,
  flagEmoji,
  loadRecentSearches,
  type RecentSearch,
} from "@/lib/visa";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Asvior — Travel Smarter. Explore Further." },
      { name: "description", content: "The premium AI travel platform: instant visa checks across 199 countries, smart budgeting, packing lists, and a personal AI concierge." },
      { property: "og:title", content: "Asvior — Travel Smarter. Explore Further." },
      { property: "og:description", content: "The premium AI travel platform: instant visa checks across 199 countries, smart budgeting, packing lists, and a personal AI concierge." },
    ],
  }),
  component: HomePage,
});

type Destination = {
  code: string;
  name: string;
  tagline: string;
  image: string;
};

const POPULAR: Destination[] = [
  { code: "JP", name: "Japan", tagline: "Ancient meets neon", image: regionAsia },
  { code: "FR", name: "France", tagline: "Timeless elegance", image: regionEurope },
  { code: "US", name: "USA", tagline: "Coast to coast", image: regionAmericas },
  { code: "AE", name: "UAE", tagline: "Skyline dreams", image: regionMiddleEast },
  { code: "AU", name: "Australia", tagline: "Wild horizons", image: regionOceania },
];

const TRENDING = ["PT", "TH", "IS", "GR", "MA", "VN", "MX", "TR"];

function greetingFor(date = new Date()): string {
  const h = date.getHours();
  if (h < 5) return "Still up?";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 22) return "Good evening";
  return "Good night";
}

function HomePage() {
  const [recent, setRecent] = useState<RecentSearch[]>([]);
  const [hasTripPlan, setHasTripPlan] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const greeting = useMemo(() => greetingFor(), []);

  useEffect(() => {
    setRecent(loadRecentSearches());
    try {
      const b = localStorage.getItem("vp_budget");
      const c = localStorage.getItem("vp_checklist");
      setHasTripPlan(!!b || !!c);
    } catch {}
    supabase.auth.getUser().then(({ data }) => {
      setSignedIn(!!data.user);
      const meta = data.user?.user_metadata as { full_name?: string; name?: string } | undefined;
      const n = meta?.full_name || meta?.name || data.user?.email?.split("@")[0] || null;
      setName(n);
    }).catch(() => {});
  }, []);

  return (
    <div className="relative overflow-hidden pb-24">
      {/* Hero background */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[640px] gradient-hero-bg" aria-hidden />
      <div className="pointer-events-none absolute -top-24 -right-16 h-80 w-80 rounded-full bg-primary/25 blur-3xl animate-float" aria-hidden />
      <div className="pointer-events-none absolute top-52 -left-24 h-72 w-72 rounded-full bg-emerald/25 blur-3xl animate-float" style={{ animationDelay: "1.2s" }} aria-hidden />

      {/* Header */}
      <header className="relative flex items-center justify-between px-6 pt-8 animate-fade-up">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl gradient-primary shadow-float">
            <Plane className="h-5 w-5 text-primary-foreground" strokeWidth={2.4} />
            <span className="absolute -inset-1 -z-10 rounded-3xl gradient-primary opacity-40 blur-md" />
          </div>
          <div>
            <p className="text-display text-lg leading-none text-foreground">Asvior</p>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Travel Smarter</p>
          </div>
        </div>
        <Link
          to="/profile"
          className="glass rounded-full px-3.5 py-2 text-[11px] font-semibold text-foreground transition-transform active:scale-95"
        >
          {signedIn ? "My profile" : "Sign in"}
        </Link>
      </header>

      {/* Greeting + Hero */}
      <section className="relative px-6 pt-10">
        <div className="animate-fade-up" style={{ animationDelay: "60ms" }}>
          <p className="text-sm font-semibold text-muted-foreground">
            {greeting}{name ? `, ${name.split(" ")[0]}` : ""} ✦
          </p>
          <h1 className="mt-2 text-display text-[42px] leading-[1.02] text-foreground">
            Where to
            <br />
            <span className="relative inline-block bg-gradient-to-r from-primary via-royal-deep to-emerald bg-clip-text text-transparent animate-gradient-shift">
              next?
            </span>
          </h1>
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
            Your personal AI concierge for visas, budgets, packing lists, and everything in between.
          </p>
        </div>

        {/* Search-like CTA */}
        <Link
          to="/visa-check"
          className="glass mt-6 flex items-center gap-3 rounded-2xl px-4 py-3.5 shadow-soft animate-fade-up transition-transform active:scale-[0.98] hover:-translate-y-0.5"
          style={{ animationDelay: "120ms" }}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl gradient-primary text-primary-foreground shadow-soft">
            <Search className="h-4 w-4" strokeWidth={2.4} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">Where do you want to fly?</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">Instant visa check · 199 countries</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </Link>

        <div className="mt-3 flex gap-2 animate-fade-up" style={{ animationDelay: "180ms" }}>
          <Link
            to="/assistant"
            className="group inline-flex flex-1 items-center justify-center gap-2 rounded-2xl gradient-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-float transition-transform active:scale-95 hover:-translate-y-0.5"
          >
            <Sparkles className="h-4 w-4" />
            Ask Asvior AI
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/countries"
            className="glass inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-foreground transition-transform active:scale-95"
          >
            <Compass className="h-4 w-4" />
            Explore
          </Link>
        </div>

        {/* Stat pills */}
        <div className="mt-5 grid grid-cols-3 gap-2 animate-fade-up" style={{ animationDelay: "240ms" }}>
          <StatPill value="199" label="Countries" />
          <StatPill value="24/7" label="AI Concierge" />
          <StatPill value="Free" label="Always" />
        </div>
      </section>

      {/* Recent activity */}
      <section className="relative mt-8 px-6">
        {recent.length === 0 && !hasTripPlan ? null : (
          <div className="mb-3 flex items-center justify-between animate-fade-up">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Continue where you left off</p>
          </div>
        )}

        {recent.length === 0 && !hasTripPlan ? null : (
          <div className="space-y-2.5">
            {recent.slice(0, 2).map((r, i) => {
              const tone =
                r.status === "Visa Free"
                  ? "text-emerald"
                  : r.status === "Visa on Arrival"
                  ? "text-amber-600 dark:text-amber-400"
                  : r.status === "eVisa" || r.status === "ETA"
                  ? "text-primary"
                  : r.status === "No Admission"
                  ? "text-foreground"
                  : "text-destructive";
              const bg =
                r.status === "Visa Free"
                  ? "gradient-emerald"
                  : r.status === "Visa on Arrival"
                  ? "bg-amber-500"
                  : r.status === "eVisa" || r.status === "ETA"
                  ? "gradient-primary"
                  : r.status === "No Admission"
                  ? "gradient-navy"
                  : "bg-destructive";
              return (
                <Link
                  key={`${r.passport}-${r.destination}-${r.timestamp}`}
                  to="/visa-check"
                  className="glass flex items-center gap-3 rounded-2xl p-3.5 shadow-soft animate-fade-up transition-transform active:scale-[0.98] hover:-translate-y-0.5"
                  style={{ animationDelay: `${i * 90}ms` }}
                >
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-soft ${bg}`}>
                    {r.status === "Visa Free" ? (
                      <ShieldCheck className="h-5 w-5" />
                    ) : r.status === "Visa on Arrival" ? (
                      <Clock className="h-5 w-5" />
                    ) : r.status === "No Admission" ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <Globe2 className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-[11px] font-semibold uppercase tracking-wide ${tone}`}>{r.status}</p>
                    <p className="mt-0.5 truncate text-sm font-bold text-foreground">
                      {flagEmoji(r.passport)} {getCountryName(r.passport)} → {flagEmoji(r.destination)} {getCountryName(r.destination)}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              );
            })}
            {hasTripPlan && (
              <Link
                to="/summary"
                className="glass flex items-center gap-3 rounded-2xl p-3.5 shadow-soft transition-transform active:scale-[0.98] hover:-translate-y-0.5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl gradient-navy text-white shadow-soft">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">Trip plan</p>
                  <p className="mt-0.5 truncate text-sm font-bold text-foreground">Continue planning your trip</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            )}
          </div>
        )}
      </section>

      {/* Popular destinations */}
      <section className="relative mt-10">
        <div className="mb-3 flex items-center justify-between px-6">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Popular destinations</p>
          <Link to="/countries" className="text-[11px] font-semibold text-primary">See all</Link>
        </div>
        <div className="scrollbar-hide -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2">
          {POPULAR.map((d, i) => (
            <Link
              key={d.code}
              to="/country/$code"
              params={{ code: d.code }}
              className="group relative block h-52 w-44 shrink-0 snap-start overflow-hidden rounded-3xl shadow-float animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <img
                src={d.image}
                alt={d.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/40 to-transparent" />
              <div className="absolute top-3 left-3 glass rounded-full px-2.5 py-1 text-[10px] font-bold text-foreground">
                {flagEmoji(d.code)} {d.name}
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Explore</p>
                <p className="mt-0.5 text-sm font-bold text-white">{d.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Feature grid */}
      <section className="relative mt-10 px-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Everything you need</p>
          <span className="text-[10px] font-semibold text-emerald">All free</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FeatureCard to="/visa-check" title="Visa Check" desc="199 countries" icon={<Plane className="h-5 w-5" />} tone="primary" delay={0} />
          <FeatureCard to="/checklist" title="Checklist" desc="Never forget a thing" icon={<CheckSquare className="h-5 w-5" />} tone="emerald" delay={70} />
          <FeatureCard to="/budget-planner" title="Budget" desc="Plan every dollar" icon={<Wallet className="h-5 w-5" />} tone="navy" delay={140} />
          <FeatureCard to="/assistant" title="Asvior AI" desc="Ask anything" icon={<Sparkles className="h-5 w-5" />} tone="royal" delay={210} />
        </div>
      </section>

      {/* Trending countries */}
      <section className="relative mt-10 px-6">
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp className="h-3.5 w-3.5 text-emerald" />
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Trending now</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {TRENDING.map((code, i) => (
            <Link
              key={code}
              to="/country/$code"
              params={{ code }}
              className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-semibold text-foreground animate-fade-up transition-transform active:scale-95 hover:-translate-y-0.5"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <span>{flagEmoji(code)}</span>
              <span>{getCountryName(code)}</span>
              <MapPin className="h-3 w-3 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </section>

      {/* Country Hub banner */}
      <section className="relative mt-8 px-6">
        <Link to="/countries" className="group relative block overflow-hidden rounded-3xl shadow-float">
          <img
            src={regionEurope}
            alt="Explore country guides"
            width={1024}
            height={576}
            loading="lazy"
            className="h-36 w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/60 to-navy/10" />
          <div className="absolute inset-y-0 left-0 flex flex-col justify-center p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Country Hub</p>
            <p className="mt-1 text-xl font-extrabold text-white">Explore 199 countries</p>
            <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-white/80">
              Visas · costs · attractions <ArrowRight className="h-3 w-3" />
            </p>
          </div>
        </Link>

        {/* CTA banner */}
        <Link
          to="/assistant"
          className="mt-4 flex items-center gap-3 overflow-hidden rounded-3xl gradient-navy p-5 text-white shadow-float transition-transform active:scale-[0.98] hover:-translate-y-0.5"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <Zap className="h-5 w-5" strokeWidth={2.4} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">Try Asvior AI</p>
            <p className="mt-0.5 text-[11px] text-white/70">Visas, budgets, itineraries — instantly</p>
          </div>
          <ArrowRight className="h-5 w-5 opacity-80" />
        </Link>

        <footer className="mt-10 space-y-3 pb-4 text-center">
          <p className="text-[11px] text-muted-foreground">
            Trusted by travelers worldwide · No account required
          </p>
          <nav aria-label="Legal" className="flex items-center justify-center gap-4 text-[11px] font-semibold text-muted-foreground">
            <Link to="/about" className="hover:text-foreground">About</Link>
            <span aria-hidden>·</span>
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <span aria-hidden>·</span>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
          </nav>
        </footer>
      </section>
    </div>
  );
}

function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="glass flex flex-col items-center rounded-2xl px-2 py-3 shadow-soft">
      <p className="text-display text-lg leading-none text-foreground">{value}</p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

function FeatureCard({
  to,
  title,
  desc,
  icon,
  tone,
  delay = 0,
}: {
  to: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  tone: "primary" | "emerald" | "navy" | "royal";
  delay?: number;
}) {
  const toneClasses: Record<string, string> = {
    primary: "gradient-primary text-primary-foreground",
    emerald: "gradient-emerald text-white",
    navy: "gradient-navy text-white",
    royal: "bg-primary/10 text-primary",
  };
  return (
    <Link
      to={to}
      className="glass group relative flex flex-col justify-between overflow-hidden rounded-3xl p-4 shadow-soft animate-fade-up transition-all active:scale-[0.98] hover:-translate-y-1 hover:shadow-float"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl shadow-soft ${toneClasses[tone]}`}>
        {icon}
      </div>
      <div className="mt-6">
        <p className="text-[15px] font-bold text-foreground">{title}</p>
        <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">{desc}</p>
      </div>
      <ArrowRight className="absolute top-4 right-4 h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
    </Link>
  );
}
