import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Share2, Download, Save, CheckCircle2, Circle, FileText, Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/summary")({
  head: () => ({
    meta: [
      { title: "Trip Summary — Asvior" },
      { name: "description", content: "Your saved travel checklist and budget." },
    ],
  }),
  component: SummaryPage,
});

const CHECKLIST_KEY = "vp_checklist";
const BUDGET_KEY = "vp_budget";

const checklistItems = [
  { id: "passport", label: "Passport" },
  { id: "flight", label: "Flight Ticket" },
  { id: "hotel", label: "Hotel Booking" },
  { id: "insurance", label: "Travel Insurance" },
  { id: "money", label: "Money / Card" },
  { id: "charger", label: "Charger / Adapter" },
  { id: "clothes", label: "Clothes" },
];

const budgetCategories = [
  { key: "flight", label: "Flight" },
  { key: "hotel", label: "Hotel" },
  { key: "food", label: "Food" },
  { key: "transport", label: "Transport" },
  { key: "other", label: "Other" },
];

function SummaryPage() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [budget, setBudget] = useState<Record<string, number>>({});
  const [shareMsg, setShareMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHECKLIST_KEY);
      if (raw) { const arr = JSON.parse(raw); if (Array.isArray(arr)) setChecked(new Set(arr)); }
    } catch {}
    try {
      const raw = localStorage.getItem(BUDGET_KEY);
      if (raw) {
        const obj = JSON.parse(raw);
        const nums: Record<string, number> = {};
        for (const c of budgetCategories) nums[c.key] = parseFloat(obj?.[c.key]) || 0;
        setBudget(nums);
      }
    } catch {}
  }, []);

  const total = useMemo(() => budgetCategories.reduce((s, c) => s + (budget[c.key] || 0), 0), [budget]);
  const fmt = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const today = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  const buildShareText = () => {
    const lines = ["✈️ My Asvior Trip Summary", today, "", "📋 Checklist:"];
    for (const item of checklistItems) lines.push(`  ${checked.has(item.id) ? "✅" : "⬜"} ${item.label}`);
    lines.push("", "💰 Budget:");
    for (const c of budgetCategories) {
      const v = budget[c.key] || 0;
      if (v > 0) lines.push(`  • ${c.label}: $${fmt(v)}`);
    }
    lines.push(`  ─────────────`, `  Total: $${fmt(total)}`);
    return lines.join("\n");
  };

  const handleShare = async () => {
    const text = buildShareText();
    try {
      if (typeof navigator !== "undefined" && (navigator as any).share) {
        await (navigator as any).share({ title: "My Asvior Trip Summary", text });
        setShareMsg("Shared!");
      } else if (navigator?.clipboard) {
        await navigator.clipboard.writeText(text);
        setShareMsg("Copied to clipboard");
      } else setShareMsg("Sharing not supported");
    } catch { setShareMsg(null); }
    setTimeout(() => setShareMsg(null), 2500);
  };

  const packed = checklistItems.filter((i) => checked.has(i.id)).length;

  return (
    <div className="relative overflow-hidden">
      <style>{`@media print { nav, .no-print { display: none !important; } body { background: white !important; } }`}</style>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 gradient-hero-bg" aria-hidden />

      <header className="relative px-6 pt-10 no-print">
        <div className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold text-primary">
          <FileText className="h-3.5 w-3.5" /> Ready to share
        </div>
        <h1 className="mt-3 text-display text-3xl text-foreground">Trip Summary</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Share with your travel buddies or save as PDF.</p>
      </header>

      <div id="summary-printable" className="relative mt-6 space-y-4 px-6">
        <div className="relative overflow-hidden rounded-3xl gradient-navy p-6 text-white shadow-float">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/30 blur-3xl" />
          <p className="relative text-[11px] font-bold uppercase tracking-widest opacity-70">Asvior Trip Summary</p>
          <p className="relative mt-2 text-display text-2xl">{today}</p>
          <p className="relative mt-3 text-xs opacity-80">
            {packed} of {checklistItems.length} items packed · ${fmt(total)} budget
          </p>
        </div>

        <div className="glass rounded-3xl p-5">
          <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald" /> Checklist
          </h2>
          <ul className="mt-3 space-y-2">
            {checklistItems.map((item) => {
              const isChecked = checked.has(item.id);
              return (
                <li key={item.id} className="flex items-center gap-2.5 text-sm">
                  {isChecked
                    ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald" />
                    : <Circle className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={1.5} />}
                  <span className={isChecked ? "text-muted-foreground line-through" : "font-medium text-foreground"}>
                    {item.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="glass rounded-3xl p-5">
          <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            <Wallet className="h-3.5 w-3.5 text-primary" /> Budget
          </h2>
          {total === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              No budget entered yet.{" "}
              <Link to="/budget-planner" className="font-semibold text-primary underline no-print">Add costs</Link>.
            </p>
          ) : (
            <>
              <ul className="mt-3 space-y-2">
                {budgetCategories.map((c) => {
                  const v = budget[c.key] || 0;
                  if (v <= 0) return null;
                  const pct = total > 0 ? (v / total) * 100 : 0;
                  return (
                    <li key={c.key} className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{c.label}</span>
                      <span className="text-muted-foreground">
                        <span className="font-bold text-foreground">${fmt(v)}</span>{" "}
                        <span className="text-xs">({pct.toFixed(0)}%)</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <span className="text-sm font-semibold text-foreground">Total</span>
                <span className="text-display text-xl text-primary">${fmt(total)}</span>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-[10px] text-muted-foreground">Generated by Asvior</p>
      </div>

      <div className="no-print relative mt-6 space-y-2.5 px-6 pb-6">
        <button
          onClick={async () => {
            const { data } = await supabase.auth.getUser();
            if (!data.user) { toast.error("Sign in to save trips"); return; }
            const name = prompt("Name this trip:", `Trip · ${today}`);
            if (!name) return;
            const { error } = await supabase.from("saved_trips").insert({
              user_id: data.user.id, name, budget, checklist: Array.from(checked),
            });
            if (error) toast.error(error.message);
            else toast.success("Trip saved to your account");
          }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl gradient-emerald px-4 py-3.5 text-sm font-semibold text-white shadow-float transition-transform active:scale-[0.98]"
        >
          <Save className="h-4 w-4" /> Save to my account
        </button>
        <button
          onClick={handleShare}
          className="flex w-full items-center justify-center gap-2 rounded-2xl gradient-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-float transition-transform active:scale-[0.98]"
        >
          <Share2 className="h-4 w-4" /> Share summary
        </button>
        <button
          onClick={() => typeof window !== "undefined" && window.print()}
          className="glass flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-semibold text-foreground"
        >
          <Download className="h-4 w-4" /> Export as PDF
        </button>
        {shareMsg && <p className="text-center text-xs text-muted-foreground">{shareMsg}</p>}
      </div>
    </div>
  );
}
