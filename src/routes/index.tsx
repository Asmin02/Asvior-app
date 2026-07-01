import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Plane,
  CheckSquare,
  Wallet,
  Sparkles,
  Globe2,
  ArrowRight,
  Compass,
  ShieldCheck,
  Zap,
} from "lucide-react";

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

        {/* Hero illustration */}
        <div className="relative mt-8 h-40">
          <div className="glass absolute inset-x-4 top-0 flex items-center gap-3 rounded-3xl p-4 animate-float">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gradient-emerald text-white shadow-soft">
              <Globe2 className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-emerald">Visa Free · 90 days</p>
              <p className="truncate text-sm font-bold text-foreground">🇺🇸 → 🇯🇵 Japan</p>
            </div>
            <ShieldCheck className="h-5 w-5 text-emerald" />
          </div>
          <div className="glass absolute inset-x-10 top-16 flex items-center gap-3 rounded-3xl p-4 shadow-float" style={{ animationDelay: "300ms" }}>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gradient-primary text-primary-foreground shadow-soft">
              <Compass className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-primary">Trip · 7 days</p>
              <p className="truncate text-sm font-bold text-foreground">Lisbon adventure</p>
            </div>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">€1,240</span>
          </div>
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

        <p className="mt-8 pb-4 text-center text-[11px] text-muted-foreground">
          Trusted by travelers worldwide · No account required
        </p>
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
