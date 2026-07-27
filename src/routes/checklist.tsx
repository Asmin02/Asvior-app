import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Plane,
  Building2,
  ShieldCheck,
  CreditCard,
  Plug,
  Shirt,
  CheckCircle2,
  Circle,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/checklist")({
  head: () => ({
    meta: [
      { title: "Travel Checklist — Asvior" },
      {
        name: "description",
        content: "Never forget a thing — your checklist saves automatically.",
      },
    ],
  }),
  component: ChecklistPage,
});

interface CheckItem {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const defaultItems: CheckItem[] = [
  {
    id: "passport",
    label: "Passport",
    description: "Valid 6+ months beyond travel dates",
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    id: "flight",
    label: "Flight Ticket",
    description: "Confirmed round-trip or onward ticket",
    icon: <Plane className="h-4 w-4" />,
  },
  {
    id: "hotel",
    label: "Hotel Booking",
    description: "Confirmed accommodation reservation",
    icon: <Building2 className="h-4 w-4" />,
  },
  {
    id: "insurance",
    label: "Travel Insurance",
    description: "Covers medical + trip cancellation",
    icon: <ShieldCheck className="h-4 w-4" />,
  },
  {
    id: "money",
    label: "Money & Cards",
    description: "Local currency, cards, backup cash",
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    id: "charger",
    label: "Charger & Adapter",
    description: "Power bank + correct plug adapter",
    icon: <Plug className="h-4 w-4" />,
  },
  {
    id: "clothes",
    label: "Clothes",
    description: "Weather-appropriate outfits & shoes",
    icon: <Shirt className="h-4 w-4" />,
  },
];

const STORAGE_KEY = "vp_checklist";

function ChecklistPage() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const arr = JSON.parse(raw) as string[];
        if (Array.isArray(arr)) setChecked(new Set(arr));
      }
    } catch (error) {
      void error;
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(checked)));
  }, [checked, loaded]);

  const toggleItem = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const reset = () => setChecked(new Set());
  const progress = Math.round((checked.size / defaultItems.length) * 100);

  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 gradient-hero-bg"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-10 -right-10 h-52 w-52 rounded-full bg-emerald/25 blur-3xl"
        aria-hidden
      />

      <header className="relative flex items-start justify-between px-6 pt-10">
        <div>
          <div className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold text-emerald">
            <CheckCircle2 className="h-3.5 w-3.5" /> Autosaved
          </div>
          <h1 className="mt-3 text-display text-3xl text-foreground">Checklist</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Everything you need before takeoff.
          </p>
        </div>
        {checked.size > 0 && (
          <button
            onClick={reset}
            className="mt-1 rounded-full bg-muted px-3 py-1.5 text-[11px] font-semibold text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
          >
            Reset
          </button>
        )}
      </header>

      {/* Progress ring card */}
      <section className="relative mt-6 px-6 animate-fade-up">
        <div className="glass flex items-center gap-4 rounded-3xl p-5">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                className="text-muted"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="url(#grad)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={`${(progress / 100) * 213.6} 213.6`}
                className="transition-all duration-500"
              />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="oklch(0.62 0.22 258)" />
                  <stop offset="100%" stopColor="oklch(0.70 0.16 162)" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-display text-lg text-foreground">{progress}%</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-foreground">
              {checked.size} of {defaultItems.length} packed
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {progress === 100 ? "You're ready to fly!" : "Keep going — you're almost there."}
            </p>
          </div>
        </div>
      </section>

      <section className="relative mt-5 space-y-2.5 px-6">
        {defaultItems.map((item, i) => {
          const isChecked = checked.has(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              style={{ animationDelay: `${i * 30}ms` }}
              className={`glass group flex w-full items-center gap-3 rounded-2xl p-4 text-left transition-all animate-fade-up active:scale-[0.99] hover:-translate-y-0.5 ${
                isChecked ? "opacity-70" : ""
              }`}
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all ${
                  isChecked ? "gradient-emerald text-white shadow-soft" : "bg-muted text-primary"
                }`}
              >
                {isChecked ? <CheckCircle2 className="h-5 w-5" /> : item.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm font-bold ${isChecked ? "text-muted-foreground line-through" : "text-foreground"}`}
                >
                  {item.label}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{item.description}</p>
              </div>
              {!isChecked && <Circle className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />}
            </button>
          );
        })}
      </section>

      {progress === 100 && (
        <section className="relative mt-5 px-6 animate-scale-in">
          <div className="flex items-center gap-3 rounded-3xl gradient-emerald p-4 text-white shadow-float">
            <Sparkles className="h-5 w-5" />
            <div className="flex-1">
              <p className="text-sm font-bold">You're all set!</p>
              <p className="text-[11px] opacity-90">Safe travels ✈️</p>
            </div>
          </div>
        </section>
      )}

      <section className="relative mt-6 px-6 pb-6">
        <Link
          to="/summary"
          className="flex items-center justify-center gap-2 rounded-2xl gradient-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-float transition-transform active:scale-[0.98]"
        >
          View & share trip summary
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
