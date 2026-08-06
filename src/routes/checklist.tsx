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
  ArrowRight,
  Sparkles,
  Luggage,
} from "lucide-react";
import { PageBadge, PageHeader, PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";

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
  const [justChecked, setJustChecked] = useState<string | null>(null);

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
      const wasChecked = next.has(id);
      if (wasChecked) next.delete(id);
      else {
        next.add(id);
        setJustChecked(id);
        setTimeout(() => setJustChecked(null), 600);
      }
      return next;
    });
  };
  const reset = () => setChecked(new Set());
  const progress = Math.round((checked.size / defaultItems.length) * 100);

  return (
    <PageShell className="asv-scroll-page" showProfileAvatar>
      <PageHeader
        badge={
          <PageBadge icon={<CheckCircle2 className="h-3.5 w-3.5" />}>Autosaved</PageBadge>
        }
        title="Checklist"
        subtitle="Everything you need before takeoff."
        action={
          checked.size > 0 ? (
            <Button variant="outline" size="sm" onClick={reset} className="shrink-0">
              Reset
            </Button>
          ) : undefined
        }
      />

      {/* Progress ring hero */}
      <section className="asv-page-pad mt-1">
        <div className="asv-card asv-card-pad">
          <div className="flex items-center gap-5">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="var(--asv-border)"
                  strokeWidth="6"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="var(--asv-primary)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${(progress / 100) * 213.6} 213.6`}
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <span className="asv-display text-lg">{progress}%</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="asv-title">
                {checked.size} of {defaultItems.length} packed
              </p>
              <p className="asv-subtitle mt-1">
                {progress === 100 ? "You're ready to fly!" : "Keep going — you're almost there."}
              </p>
              <div className="asv-progress mt-3">
                <div
                  className="asv-progress-bar transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline tracker */}
      <section className="asv-page-pad mt-5">
        <p className="asv-overline mb-3">Packing timeline</p>
        <div className="relative">
          <div className="absolute left-[21px] top-4 bottom-4 w-0.5 bg-[var(--asv-border)]" />
          <div
            className="absolute left-[21px] top-4 w-0.5 bg-[var(--asv-primary)] transition-all duration-500"
            style={{ height: `${Math.max(0, ((checked.size - 0.5) / defaultItems.length) * 100)}%` }}
          />

          <div className="asv-stagger space-y-2">
            {defaultItems.map((item, index) => {
              const isChecked = checked.has(item.id);
              const isAnimating = justChecked === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`relative flex w-full items-start gap-4 rounded-[var(--asv-radius-lg)] p-3 text-left transition-all duration-300 ${
                    isChecked
                      ? "bg-[var(--asv-success-soft)]"
                      : "asv-card asv-card-pad !p-3 hover:shadow-[var(--asv-shadow-sm)]"
                  } ${isAnimating ? "scale-[1.02]" : ""}`}
                >
                  <div
                    className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      isChecked
                        ? "border-[var(--asv-success)] bg-[var(--asv-success)] text-white"
                        : "border-[var(--asv-border)] bg-[var(--asv-surface)] text-[var(--asv-primary)]"
                    } ${isAnimating ? "animate-[asv-scale-in_300ms_var(--asv-ease-spring)]" : ""}`}
                  >
                    {isChecked ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <span className="text-xs font-bold">{index + 1}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`transition-colors ${
                          isChecked ? "text-[var(--asv-success)]" : "text-[var(--asv-primary)]"
                        }`}
                      >
                        {item.icon}
                      </span>
                      <p
                        className={`text-sm font-bold transition-all ${
                          isChecked
                            ? "text-[var(--asv-ink-tertiary)] line-through"
                            : "text-[var(--asv-ink)]"
                        }`}
                      >
                        {item.label}
                      </p>
                    </div>
                    <p className="mt-0.5 text-[11px] text-[var(--asv-ink-tertiary)]">
                      {item.description}
                    </p>
                  </div>
                  {!isChecked && (
                    <Circle
                      className="mt-3 h-5 w-5 shrink-0 text-[var(--asv-ink-muted)]"
                      strokeWidth={1.5}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {progress === 100 && (
        <section className="asv-page-pad mt-4 asv-animate-in">
          <div className="asv-ai-banner flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-display text-lg font-semibold text-white">You're all set!</p>
              <p className="text-sm text-white/80">Safe travels ✈️</p>
            </div>
            <Luggage className="h-8 w-8 text-white/40" />
          </div>
        </section>
      )}

      <section className="asv-page-pad mt-6 pb-[calc(var(--asv-tab-clearance)+12px)]">
        <Link to="/summary" className="asv-btn asv-btn-primary w-full">
          View & share trip summary
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </PageShell>
  );
}
