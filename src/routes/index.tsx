import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
} from "lucide-react";
import regionEurope from "@/assets/region-europe.jpg";
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
      { title: "VisaPilot — Premium Travel & Visa Assistant" },
      { name: "description", content: "Check visa requirements, plan smarter trips, and get AI-powered travel guidance — all in one beautiful app." },
      { property: "og:title", content: "VisaPilot — Premium Travel & Visa Assistant" },
      { property: "og:description", content: "Check visa requirements, plan smarter trips, and get AI-powered travel guidance." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [recent, setRecent] = useState<RecentSearch[]>([]);
  const [hasTripPlan, setHasTripPlan] = useState(false);

  useEffect(() => {
    setRecent(loadRecentSearches());
    try {
      const b = localStorage.getItem("vp_budget");
      const c = localStorage.getItem("vp_checklist");
      setHasTripPlan(!!b || !!c);
    } catch {}
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Hero background */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] gradient-hero-bg" aria-hidden />
      <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-primary/25 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute top-40 -left-20 h-64 w-64 rounded-full bg-emerald/25 blur-3xl" aria-hidden />

      {/* Header */}
      <header className="relative flex items-center justify-between px-6 pt-8">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl gradient-primary shadow-float">
            <Plane className="h-5 w-5 text-primary-foreground" strokeWidth={2.4} />
          </div>
          <div>
            <p className="text-display text-lg text-foreground">VisaPilot</p>
            <p className="-mt-0.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Premium travel OS</p>
          </div>
        </div>
        <Link
          to="/profile"
          className="glass rounded-full px-3 py-1.5 text-[11px] font-semibold text-foreground"
        >
          Sign in
        </Link>
      </header>

      {/* Hero */}
      <section className="relative px-6 pt-10 animate-fade-up">
        <div className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          AI travel concierge · always on
        </div>
        <h1 className="mt-4 text-display text-[40px] leading-[1.05] text-foreground">
          Fly further.
          <br />
          <span className="bg-gradient-to-r from-primary via-royal-deep to-emerald bg-clip-text text-transparent">
            Plan smarter.
          </span>
        </h1>
        <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
          Check visas across 199 countries, build packing lists, plan budgets, and chat with your personal AI travel expert.
        </p>

        <div className="mt-6 flex gap-2">
          <Link
            to="/assistant"
            className="group inline-flex items-center gap-2 rounded-2xl gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-float transition-transform active:scale-95 hover:-translate-y-0.5"
          >
            <Sparkles className="h-4 w-4" />
            Ask VisaPilot AI
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/visa-check"
            className="glass inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-foreground"
          >
            Check visa
          </Link>
        </div>

        {/* Recent activity */}
        <div className="relative mt-8">
          {recent.length === 0 && !hasTripPlan ? (
            <div className="glass flex flex-col items-start gap-3 rounded-3xl p-5 animate-fade-up">
              <p className="text-sm font-medium text-muted-foreground">No recent searches yet.</p>
              <Link
                to="/visa-check"
                className="inline-flex items-center gap-2 rounded-2xl gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-float transition-transform active:scale-95"
              >
                <Globe2 className="h-4 w-4" />
                Start your first visa search
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3 animate-fade-up">
              {recent.slice(0, 2).map((r, i) => {
                const tone =
                  r.status === "Visa Free"
                    ? "text-emerald"
                    : r.status === "Visa on Arrival"
                    ? "text-amber-500"
                    : r.status === "eVisa" || r.status === "ETA"
                    ? "text-primary"
                    : r.status === "No Admission"
                    ? "text-navy"
                    : "text-destructive";
                const bg =
                  r.status === "Visa Free"
                    ? "gradient-emerald"
                    : r.status === "Visa on Arrival"
                    ? "bg-amber-100 text-amber-900"
                    : r.status === "eVisa" || r.status === "ETA"
                    ? "gradient-primary"
                    : r.status === "No Admission"
                    ? "gradient-navy"
                    : "bg-destructive/10 text-destructive";
                return (
                  <Link
                    key={`${r.passport}-${r.destination}-${r.timestamp}`}
                    to="/visa-check"
                    className="glass flex items-center gap-3 rounded-3xl p-4 shadow-soft transition-transform active:scale-[0.98]"
                    style={{ animationDelay: `${i * 120}ms` }}
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
                      <p className={`text-xs font-semibold ${tone}`}>{r.status}</p>
                      <p className="truncate text-sm font-bold text-foreground">
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
                  className="glass flex items-center gap-3 rounded-3xl p-4 shadow-soft transition-transform active:scale-[0.98]"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl gradient-navy text-white shadow-soft">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-primary">Trip plan</p>
                    <p className="truncate text-sm font-bold text-foreground">Continue planning your trip</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Feature grid */}
      <section className="relative mt-10 px-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Everything you need</p>
          <span className="text-[10px] font-semibold text-emerald">All free</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FeatureCard
            to="/visa-check"
            title="Visa Check"
            desc="199 countries"
            icon={<Plane className="h-5 w-5" />}
            tone="primary"
          />
          <FeatureCard
            to="/checklist"
            title="Checklist"
            desc="Never forget a thing"
            icon={<CheckSquare className="h-5 w-5" />}
            tone="emerald"
          />
          <FeatureCard
            to="/budget-planner"
            title="Budget"
            desc="Plan every dollar"
            icon={<Wallet className="h-5 w-5" />}
            tone="navy"
          />
          <FeatureCard
            to="/assistant"
            title="AI Assistant"
            desc="Ask anything"
            icon={<Sparkles className="h-5 w-5" />}
            tone="royal"
          />
        </div>

        {/* Country Hub banner */}
        <Link
          to="/countries"
          className="group relative mt-3 block overflow-hidden rounded-3xl shadow-float"
        >
          <img
            src={regionEurope}
            alt="Explore country guides"
            width={1024}
            height={576}
            loading="lazy"
            className="h-32 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/55 to-navy/10" />
          <div className="absolute inset-y-0 left-0 flex flex-col justify-center p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">New · Country Hub</p>
            <p className="mt-1 text-lg font-extrabold text-white">Explore 199 countries</p>
            <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-white/80">
              Visas · costs · attractions <ArrowRight className="h-3 w-3" />
            </p>
          </div>
        </Link>


        {/* CTA banner */}
        <Link
          to="/assistant"
          className="mt-6 flex items-center gap-3 overflow-hidden rounded-3xl gradient-navy p-5 text-white shadow-float"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <Zap className="h-5 w-5" strokeWidth={2.4} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">Try VisaPilot AI</p>
            <p className="mt-0.5 text-[11px] text-white/70">Visas, budgets, itineraries — instantly</p>
          </div>
          <ArrowRight className="h-5 w-5 opacity-80" />
        </Link>

        <footer className="mt-8 space-y-3 pb-4 text-center">
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

function FeatureCard({
  to,
  title,
  desc,
  icon,
  tone,
}: {
  to: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  tone: "primary" | "emerald" | "navy" | "royal";
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
      className="glass group relative flex flex-col justify-between overflow-hidden rounded-3xl p-4 transition-all active:scale-[0.98] hover:-translate-y-1 hover:shadow-float"
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
