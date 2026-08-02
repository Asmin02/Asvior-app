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
    <div>
      <header className="flex items-start justify-between border-b border-border bg-card px-4 py-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5" /> Autosaved
          </div>
          <h1 className="mt-2 text-2xl font-bold text-foreground">Checklist</h1>
          <p className="mt-1 text-sm text-muted-foreground">Everything you need before takeoff.</p>
        </div>
        {checked.size > 0 && (
          <button
            onClick={reset}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-secondary"
          >
            Reset
          </button>
        )}
      </header>

      <section className="mt-4 px-4">
        <div className="premium-card flex items-center gap-4 rounded-2xl p-5">
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
                  <stop offset="0%" stopColor="oklch(0.79 0.07 84)" />
                  <stop offset="100%" stopColor="oklch(0.52 0.2 262)" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-lg font-bold text-foreground">{progress}%</span>
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

      <section className="mt-4 space-y-2 px-4">
        {defaultItems.map((item) => {
          const isChecked = checked.has(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`premium-card flex w-full min-h-[4.5rem] items-center gap-3 rounded-2xl p-4 text-left transition-colors active:scale-[0.99] ${
                isChecked ? "opacity-70" : "hover:bg-secondary/30"
              }`}
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                  isChecked ? "bg-navy text-primary-foreground" : "bg-secondary text-navy"
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
        <section className="mt-4 px-4">
          <div className="flex items-center gap-3 rounded-2xl bg-navy p-4 text-primary-foreground">
            <Sparkles className="h-5 w-5" />
            <div className="flex-1">
              <p className="text-sm font-bold">You're all set!</p>
              <p className="text-[11px] opacity-90">Safe travels ✈️</p>
            </div>
          </div>
        </section>
      )}

      <section className="mt-6 px-4 pb-6">
        <Link
          to="/summary"
          className="flex items-center justify-center gap-2 rounded-xl bg-navy px-4 py-3.5 text-sm font-semibold text-primary-foreground"
        >
          View & share trip summary
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
