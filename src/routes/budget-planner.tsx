import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plane, Building2, UtensilsCrossed, Car, Gift, Wallet, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PageBadge, PageHeader, PageShell } from "@/components/PageShell";

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
  iconTone: string;
  bar: string;
  icon: React.ReactNode;
}

const categories: Category[] = [
  {
    key: "flight",
    label: "Flight",
    iconTone: "grad-signal text-white",
    bar: "bg-primary",
    icon: <Plane className="h-4 w-4" />,
  },
  {
    key: "hotel",
    label: "Hotel",
    iconTone: "bg-emerald/15 text-emerald",
    bar: "bg-emerald",
    icon: <Building2 className="h-4 w-4" />,
  },
  {
    key: "food",
    label: "Food",
    iconTone: "bg-gold/15 text-gold",
    bar: "bg-gold",
    icon: <UtensilsCrossed className="h-4 w-4" />,
  },
  {
    key: "transport",
    label: "Transport",
    iconTone: "bg-primary/10 text-primary",
    bar: "bg-primary/60",
    icon: <Car className="h-4 w-4" />,
  },
  {
    key: "other",
    label: "Other",
    iconTone: "bg-muted text-muted-foreground",
    bar: "bg-muted-foreground/50",
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
    <PageShell className="pb-28">
      <PageHeader
        badge={<PageBadge icon={<Wallet className="h-3.5 w-3.5" />}>Live budget tracker</PageBadge>}
        title="Budget Planner"
        subtitle="Log each cost — your total updates as you type."
      />

      <section className="px-4">
        <div className="animate-fade-in relative overflow-hidden rounded-3xl grad-ink p-6 text-white elev-3">
          <span className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-aurora/25 blur-2xl" />
          <span className="pointer-events-none absolute -bottom-16 -left-8 h-40 w-40 rounded-full bg-gold/15 blur-2xl" />
          <div className="relative">
            <p className="text-eyebrow text-white/60">Total trip budget</p>
            <p className="mt-2 text-4xl font-semibold tracking-[-0.03em]">${fmt(total)}</p>
            {total > 0 ? (
              <>
                <div className="mt-5 flex h-2.5 w-full overflow-hidden rounded-full bg-white/15">
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
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
                  {categories
                    .filter((c) => numbers[c.key] > 0)
                    .map((c) => (
                      <span
                        key={c.key}
                        className="flex items-center gap-1.5 text-[11px] text-white/80"
                      >
                        <span className={`h-2 w-2 rounded-full ${c.bar}`} />
                        {c.label} · {((numbers[c.key] / total) * 100).toFixed(0)}%
                      </span>
                    ))}
                </div>
              </>
            ) : (
              <p className="mt-4 text-xs text-white/70">Add costs below to see your breakdown.</p>
            )}
          </div>
        </div>
      </section>

      <section className="mt-4 space-y-2.5 px-4">
        {categories.map((c, i) => (
          <div
            key={c.key}
            style={{ animationDelay: `${i * 40}ms` }}
            className="premium-card animate-fade-in flex items-center gap-3 rounded-2xl p-3.5 transition-transform focus-within:-translate-y-0.5"
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${c.iconTone}`}
            >
              {c.icon}
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
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
                  className="border-0 bg-transparent pl-4 pr-0 text-base font-semibold text-foreground shadow-none focus-visible:ring-0"
                />
              </div>
            </div>
            {numbers[c.key] > 0 && total > 0 && (
              <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">
                {((numbers[c.key] / total) * 100).toFixed(0)}%
              </span>
            )}
          </div>
        ))}
      </section>

      {total > 0 && (
        <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+4.5rem)] z-30 px-4">
          <Link
            to="/summary"
            className="mx-auto flex max-w-md items-center justify-center gap-2 rounded-2xl grad-signal px-4 py-3.5 text-sm font-semibold text-white elev-4 transition-transform active:scale-95"
          >
            View & share trip summary
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </PageShell>
  );
}
