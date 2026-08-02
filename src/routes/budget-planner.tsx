import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plane, Building2, UtensilsCrossed, Car, Gift, Wallet, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useThemePhase } from "@/components/ThemeProvider";
import { phaseSurfaceClass } from "@/lib/theme-phase";

export const Route = createFileRoute("/budget-planner")({
  head: () => ({
    meta: [
      { title: "Budget Planner — Asvior" },
      { name: "description", content: "Plan and track every dollar of your trip." },
    ],
  }),
  component: BudgetPlannerPage,
});

interface Category {
  key: string;
  label: string;
  gradient: string;
  bar: string;
  icon: React.ReactNode;
}

const categories: Category[] = [
  {
    key: "flight",
    label: "Flight",
    gradient: "gradient-primary text-primary-foreground",
    bar: "bg-primary",
    icon: <Plane className="h-4 w-4" />,
  },
  {
    key: "hotel",
    label: "Hotel",
    gradient: "gradient-emerald text-white",
    bar: "bg-emerald",
    icon: <Building2 className="h-4 w-4" />,
  },
  {
    key: "food",
    label: "Food",
    gradient: "gradient-navy text-white",
    bar: "bg-navy",
    icon: <UtensilsCrossed className="h-4 w-4" />,
  },
  {
    key: "transport",
    label: "Transport",
    gradient: "bg-amber-500 text-white",
    bar: "bg-amber-500",
    icon: <Car className="h-4 w-4" />,
  },
  {
    key: "other",
    label: "Other",
    gradient: "bg-fuchsia-500 text-white",
    bar: "bg-fuchsia-500",
    icon: <Gift className="h-4 w-4" />,
  },
];

const BUDGET_STORAGE_KEY = "vp_budget";

function BudgetPlannerPage() {
  const [values, setValues] = useState<Record<string, string>>({
    flight: "",
    hotel: "",
    food: "",
    transport: "",
    other: "",
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(BUDGET_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") setValues((v) => ({ ...v, ...parsed }));
      }
    } catch (error) {
      void error;
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(values));
  }, [values, loaded]);

  const numbers = useMemo(() => {
    const out: Record<string, number> = {};
    for (const c of categories) out[c.key] = parseFloat(values[c.key]) || 0;
    return out;
  }, [values]);

  const total = useMemo(() => categories.reduce((s, c) => s + numbers[c.key], 0), [numbers]);
  const fmt = (n: number) =>
    n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="time-hero-surface phase-evening relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 gradient-hero-bg"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-16 -left-10 h-52 w-52 rounded-full bg-champagne/25 blur-3xl"
        aria-hidden
      />

      <header className="relative px-6 pt-10">
        <div className="premium-card inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold text-champagne">
          <Wallet className="h-3.5 w-3.5" /> Live budget tracker
        </div>
        <h1 className="mt-3 text-display text-3xl text-foreground">Budget Planner</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Log each cost — your total updates as you type.
        </p>
      </header>

      {/* Total card */}
      <section className="relative mt-6 px-6 animate-fade-up">
        <div className="relative overflow-hidden rounded-3xl gradient-navy p-6 text-white shadow-float">
          <div className="absolute -top-16 -right-10 h-40 w-40 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-emerald/25 blur-3xl" />
          <p className="relative text-[11px] font-bold uppercase tracking-widest opacity-70">
            Total trip budget
          </p>
          <p className="relative mt-2 text-display text-5xl">${fmt(total)}</p>
          {total > 0 ? (
            <div className="relative mt-4 flex h-2.5 w-full overflow-hidden rounded-full bg-white/15">
              {categories.map((c) => {
                const pct = (numbers[c.key] / total) * 100;
                if (pct <= 0) return null;
                return (
                  <div
                    key={c.key}
                    className={c.bar}
                    style={{ width: `${pct}%` }}
                    title={`${c.label}: ${pct.toFixed(0)}%`}
                  />
                );
              })}
            </div>
          ) : (
            <p className="relative mt-4 text-xs opacity-70">
              Add costs below to see your breakdown.
            </p>
          )}
        </div>
      </section>

      {/* Inputs */}
      <section className="relative mt-5 px-6 space-y-2.5">
        {categories.map((c, i) => (
          <div
            key={c.key}
            className="premium-card flex items-center gap-3 rounded-2xl p-3 animate-fade-up"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-soft ${c.gradient}`}
            >
              {c.icon}
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {c.label}
              </label>
              <div className="relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                  $
                </span>
                <Input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={values[c.key]}
                  onChange={(e) => setValues((v) => ({ ...v, [c.key]: e.target.value }))}
                  className="border-0 bg-transparent pl-4 pr-0 text-base font-bold text-foreground shadow-none focus-visible:ring-0"
                />
              </div>
            </div>
            {numbers[c.key] > 0 && total > 0 && (
              <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                {((numbers[c.key] / total) * 100).toFixed(0)}%
              </span>
            )}
          </div>
        ))}
      </section>

      {total > 0 && (
        <section className="relative mt-6 px-6 pb-6">
          <Link
            to="/summary"
            className="flex items-center justify-center gap-2 rounded-2xl gradient-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-float transition-transform active:scale-[0.98]"
          >
            View & share trip summary
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      )}
    </div>
  );
}
