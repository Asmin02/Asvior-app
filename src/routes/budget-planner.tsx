import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/budget-planner")({
  head: () => ({
    meta: [
      { title: "Budget Planner — VisaPilot" },
      { name: "description", content: "Plan and track your trip costs with VisaPilot's budget planner." },
      { property: "og:title", content: "Budget Planner — VisaPilot" },
      { property: "og:description", content: "Plan and track your trip costs with VisaPilot's budget planner." },
    ],
  }),
  component: BudgetPlannerPage,
});

interface Category {
  key: string;
  label: string;
  color: string;
  icon: React.ReactNode;
}

const categories: Category[] = [
  { key: "flight", label: "Flight", color: "bg-travel-blue text-white", icon: <PlaneIcon className="h-4 w-4" /> },
  { key: "hotel", label: "Hotel", color: "bg-travel-blue-light text-travel-blue-dark", icon: <HotelIcon className="h-4 w-4" /> },
  { key: "food", label: "Food", color: "bg-travel-sky text-travel-blue-dark", icon: <FoodIcon className="h-4 w-4" /> },
  { key: "transport", label: "Transport", color: "bg-travel-sand text-travel-blue-dark", icon: <CarIcon className="h-4 w-4" /> },
  { key: "other", label: "Other", color: "bg-muted text-foreground", icon: <GiftIcon className="h-4 w-4" /> },
];

function BudgetPlannerPage() {
  const [values, setValues] = useState<Record<string, string>>({
    flight: "",
    hotel: "",
    food: "",
    transport: "",
    other: "",
  });

  const numbers = useMemo(() => {
    const out: Record<string, number> = {};
    for (const c of categories) out[c.key] = parseFloat(values[c.key]) || 0;
    return out;
  }, [values]);

  const total = useMemo(
    () => categories.reduce((sum, c) => sum + numbers[c.key], 0),
    [numbers],
  );

  const fmt = (n: number) =>
    n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="px-5 pt-8 pb-6">
      <h1 className="text-2xl font-bold text-foreground">Budget Planner</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter each cost — your total updates automatically.
      </p>

      <div className="mt-6 space-y-3">
        {categories.map((c) => (
          <div key={c.key} className="flex items-center gap-3">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${c.color}`}>
              {c.icon}
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground">{c.label} cost</label>
              <div className="relative mt-0.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                <Input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={values[c.key]}
                  onChange={(e) => setValues((v) => ({ ...v, [c.key]: e.target.value }))}
                  className="pl-7"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-primary p-5 text-primary-foreground shadow-md">
        <p className="text-xs uppercase tracking-wide opacity-80">Total Trip Budget</p>
        <p className="mt-1 text-3xl font-bold">${fmt(total)}</p>
        {total > 0 && (
          <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-white/20">
            {categories.map((c) => {
              const pct = (numbers[c.key] / total) * 100;
              if (pct <= 0) return null;
              return (
                <div
                  key={c.key}
                  className={c.color.split(" ")[0]}
                  style={{ width: `${pct}%` }}
                  title={`${c.label}: ${pct.toFixed(0)}%`}
                />
              );
            })}
          </div>
        )}
      </div>

      {total > 0 && (
        <div className="mt-5 grid grid-cols-2 gap-3">
          {categories.map((c) => {
            const amount = numbers[c.key];
            const pct = total > 0 ? (amount / total) * 100 : 0;
            return (
              <Card key={c.key} className="ring-1 ring-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${c.color}`}>
                      {c.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-foreground">{c.label}</p>
                      <p className="text-[10px] text-muted-foreground">{pct.toFixed(0)}% of trip</p>
                    </div>
                  </div>
                  <p className="mt-2 text-lg font-bold text-foreground">${fmt(amount)}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PlaneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  );
}
function HotelIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5M3.75 21V3h12v18M15.75 21V8.25H20.25V21M6.75 6.75h.75M6.75 9.75h.75M6.75 12.75h.75M11.25 6.75h.75M11.25 9.75h.75M11.25 12.75h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  );
}
function FoodIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zM3.75 12h.007v.008H3.75V12zM3.75 17.25h.007v.008H3.75v-.008z" />
    </svg>
  );
}
function CarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  );
}
function GiftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H4.5a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  );
}
