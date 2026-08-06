import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plane, Building2, UtensilsCrossed, Car, Gift, Wallet, ArrowRight, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePreferredCurrency } from "@/lib/use-preferred-currency";
import { useT } from "@/lib/i18n";
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
  icon: React.ReactNode;
  color: string;
}

const categories: Category[] = [
  { key: "flight", label: "Flight", icon: <Plane className="h-4 w-4" />, color: "var(--asv-primary)" },
  { key: "hotel", label: "Hotel", icon: <Building2 className="h-4 w-4" />, color: "var(--asv-accent)" },
  { key: "food", label: "Food", icon: <UtensilsCrossed className="h-4 w-4" />, color: "var(--asv-success)" },
  { key: "transport", label: "Transport", icon: <Car className="h-4 w-4" />, color: "var(--asv-warning)" },
  { key: "other", label: "Other", icon: <Gift className="h-4 w-4" />, color: "var(--asv-gold)" },
];

const BUDGET_STORAGE_KEY = "vp_budget";

function BudgetPlannerPage() {
  const t = useT();
  const { symbol, format } = usePreferredCurrency();
  const [values, setValues] = useState<Record<string, string>>({
    flight: "",
    hotel: "",
    food: "",
    transport: "",
    other: "",
  });
  const [loaded, setLoaded] = useState(false);

  const categoriesLocalized = useMemo(
    () =>
      categories.map((c) => ({
        ...c,
        label: t(`budget.${c.key}`),
      })),
    [t],
  );

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

  const topCategory = useMemo(() => {
    if (total <= 0) return null;
    return categoriesLocalized.reduce((max, c) =>
      numbers[c.key] > numbers[max.key] ? c : max,
    categoriesLocalized[0]);
  }, [numbers, total, categoriesLocalized]);

  return (
    <PageShell className="asv-scroll-page" showProfileAvatar>
      <PageHeader
        badge={<PageBadge icon={<Wallet className="h-3.5 w-3.5" />}>{t("budget.badge")}</PageBadge>}
        title={t("budget.title")}
        subtitle={t("budget.subtitle")}
      />

      {/* Analytics hero */}
      <section className="asv-page-pad mt-1">
        <div className="asv-ai-banner p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/70">
                {t("budget.total")}
              </p>
              <p className="asv-display mt-2 text-3xl text-white">{format(total)}</p>
              {topCategory && total > 0 && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-white/75">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Largest: {topCategory.label} ({((numbers[topCategory.key] / total) * 100).toFixed(0)}%)
                </p>
              )}
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--asv-radius-md)] bg-white/15">
              <Wallet className="h-6 w-6 text-white" />
            </div>
          </div>

          {total > 0 ? (
            <div className="asv-progress mt-5 !h-2.5 !bg-white/20">
              <div className="flex h-full w-full overflow-hidden rounded-[inherit]">
                {categoriesLocalized.map((c) => {
                  const pct = (numbers[c.key] / total) * 100;
                  if (pct <= 0) return null;
                  return (
                    <div
                      key={c.key}
                      style={{ width: `${pct}%`, background: c.color }}
                      title={`${c.label}: ${pct.toFixed(0)}%`}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-white/70">{t("budget.addCosts")}</p>
          )}
        </div>
      </section>

      {/* Category breakdown legend */}
      {total > 0 && (
        <section className="asv-page-pad mt-4">
          <div className="flex flex-wrap gap-2">
            {categoriesLocalized.map((c) => {
              const pct = (numbers[c.key] / total) * 100;
              if (pct <= 0) return null;
              return (
                <span key={c.key} className="asv-chip asv-chip--active">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: c.color }}
                  />
                  {c.label} {pct.toFixed(0)}%
                </span>
              );
            })}
          </div>
        </section>
      )}

      {/* Category inputs with progress bars */}
      <section className="asv-page-pad mt-4 space-y-3">
        <p className="asv-overline">Category breakdown</p>
        {categoriesLocalized.map((c, i) => {
          const amount = numbers[c.key];
          const pct = total > 0 ? (amount / total) * 100 : 0;
          return (
            <div
              key={c.key}
              className="asv-card asv-card-pad asv-animate-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="asv-tool-icon shrink-0"
                  style={{ background: `color-mix(in srgb, ${c.color} 12%, transparent)`, color: c.color }}
                >
                  {c.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <label className="asv-label">{c.label}</label>
                    {amount > 0 && total > 0 && (
                      <span className="asv-pill asv-pill--primary">{pct.toFixed(0)}%</span>
                    )}
                  </div>
                  <div className="relative mt-1.5">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-sm font-semibold text-[var(--asv-ink-tertiary)]">
                      {symbol}
                    </span>
                    <Input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={values[c.key]}
                      onChange={(e) => setValues((v) => ({ ...v, [c.key]: e.target.value }))}
                      className="border-0 bg-transparent pl-7 pr-0 text-lg font-bold shadow-none focus-visible:ring-0"
                    />
                  </div>
                </div>
              </div>
              {total > 0 && (
                <div className="asv-progress mt-3">
                  <div
                    className="asv-progress-bar"
                    style={{ width: `${pct}%`, background: c.color }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </section>

      {total > 0 && (
        <section className="asv-page-pad mt-6 pb-[calc(var(--asv-tab-clearance)+12px)]">
          <Link to="/summary" className="asv-btn asv-btn-primary w-full">
            {t("budget.viewSummary")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      )}
    </PageShell>
  );
}
