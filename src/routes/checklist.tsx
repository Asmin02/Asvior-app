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
import { PageBadge, PageHeader, PageShell } from "@/components/PageShell";

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
  const isComplete = progress === 100;

  return (
    <PageShell className="pb-6">
      <PageHeader
        badge={<PageBadge icon={<CheckCircle2 className="h-3.5 w-3.5" />}>Autosaved</PageBadge>}
        title="Checklist"
        subtitle="Everything you need before takeoff."
        action={
          checked.size > 0 ? (
            <button
              onClick={reset}
              className="mt-1 shrink-0 rounded-full border border-border/60 bg-card/70 px-3 py-1.5 text-[11px] font-semibold text-muted-foreground backdrop-blur-sm transition-transform active:scale-95"
            >
              Reset
            </button>
          ) : undefined
        }
      />

      <section className="px-4">
        <div className="premium-card animate-fade-in flex items-center gap-5 rounded-3xl p-5">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 96 96">
              <circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted/70"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke="url(#checklistGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(progress / 100) * 251.3} 251.3`}
                className="transition-all duration-700 ease-out"
              />
              <defs>
                <linearGradient id="checklistGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="oklch(0.79 0.07 84)" />
                  <stop offset="100%" stopColor="oklch(0.52 0.2 262)" />
                </linearGradient>
              </defs>
            </svg>
            {isComplete ? (
              <Sparkles className="h-7 w-7 text-primary" />
            ) : (
              <span className="text-xl font-semibold tracking-[-0.02em] text-foreground">
                {progress}%
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">
              {checked.size} of {defaultItems.length} packed
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {isComplete ? "You're ready to fly! ✈️" : "Keep going — you're almost there."}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-4 space-y-2.5 px-4">
        {defaultItems.map((item, i) => {
          const isChecked = checked.has(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              style={{ animationDelay: `${i * 40}ms` }}
              className={`premium-card animate-fade-in flex w-full min-h-[4.5rem] items-center gap-3 rounded-2xl p-4 text-left transition-all active:scale-[0.99] ${
                isChecked ? "opacity-60" : "hover:-translate-y-0.5 hover:elev-2"
              }`}
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors ${
                  isChecked ? "grad-signal text-white" : "bg-primary/10 text-primary"
                }`}
              >
                {isChecked ? <CheckCircle2 className="h-5 w-5" /> : item.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm font-semibold ${isChecked ? "text-muted-foreground line-through" : "text-foreground"}`}
                >
                  {item.label}
                </p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
              {!isChecked && <Circle className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />}
            </button>
          );
        })}
      </section>

      {isComplete && (
        <section className="mt-4 px-4">
          <div className="animate-fade-in relative overflow-hidden rounded-3xl grad-ink p-5 text-white elev-3">
            <span className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-aurora/25 blur-2xl" />
            <div className="relative flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/12">
                <Sparkles className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold">You're all set!</p>
                <p className="mt-0.5 text-[11px] text-white/75">Safe travels ✈️</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="mt-6 px-4">
        <Link
          to="/summary"
          className="flex items-center justify-center gap-2 rounded-2xl grad-signal px-4 py-3.5 text-sm font-semibold text-white elev-2 transition-transform active:scale-95"
        >
          View & share trip summary
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </PageShell>
  );
}
