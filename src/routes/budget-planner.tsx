import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plane, Building2, UtensilsCrossed, Car, Gift, Wallet, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

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
    gradient: "bg-navy text-primary-foreground",
    bar: "bg-navy",
    icon: <Plane className="h-4 w-4" />,
  },
  {
    key: "hotel",
    label: "Hotel",
    gradient: "bg-emerald text-white",
    bar: "bg-emerald",
    icon: <Building2 className="h-4 w-4" />,
  },
  {
    key: "food",
    label: "Food",
    gradient: "bg-secondary text-navy",
    bar: "bg-navy/70",
    icon: <UtensilsCrossed className="h-4 w-4" />,
  },
  {
    key: "transport",
    label: "Transport",
    gradient: "bg-secondary text-navy",
    bar: "bg-navy/50",
    icon: <Car className="h-4 w-4" />,
  },
  {
    key: "other",
    label: "Other",
    gradient: "bg-secondary text-navy",
    bar: "bg-navy/30",
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
    <div>
      <header className="border-b border-border bg-card px-4 py-5">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground">
          <Wallet className="h-3.5 w-3.5" /> Live budget tracker
        </div>
        <h1 className="mt-2 text-2xl font-bold text-foreground">Budget Planner</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Log each cost — your total updates as you type.
        </p>
      </header>

      <section className="mt-4 px-4">
        <div className="rounded-2xl bg-navy p-6 text-primary-foreground shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wide opacity-75">
            Total trip budget
          </p>
          <p className="mt-2 text-4xl font-bold">${fmt(total)}</p>
          {total > 0 ? (
            <div className="mt-4 flex h-2 w-full overflow-hidden rounded-full bg-white/20">
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
            <p className="mt-4 text-xs opacity-75">Add costs below to see your breakdown.</p>
          )}
        </div>
      </section>

      <section className="mt-4 space-y-2 px-4">
        {categories.map((c) => (
          <div key={c.key} className="premium-card flex items-center gap-3 rounded-2xl p-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${c.gradient}`}
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
        <section className="mt-6 px-4 pb-6">
          <Link
            to="/summary"
            className="flex items-center justify-center gap-2 rounded-xl bg-navy px-4 py-3.5 text-sm font-semibold text-primary-foreground"
          >
            View & share trip summary
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      )}
    </div>
  );
}
