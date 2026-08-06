import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Share2, Download, Save, CheckCircle2, Circle, FileText, Wallet } from "lucide-react";
import { PageBadge, PageHeader, PageShell } from "@/components/PageShell";
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
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) setChecked(new Set(arr));
      }
    } catch (error) {
      void error;
    }
    try {
      const raw = localStorage.getItem(BUDGET_KEY);
      if (raw) {
        const obj = JSON.parse(raw);
        const nums: Record<string, number> = {};
        for (const c of budgetCategories) nums[c.key] = parseFloat(obj?.[c.key]) || 0;
        setBudget(nums);
      }
    } catch (error) {
      void error;
    }
  }, []);

  const total = useMemo(
    () => budgetCategories.reduce((s, c) => s + (budget[c.key] || 0), 0),
    [budget],
  );
  const fmt = (n: number) =>
    n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const today = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const buildShareText = () => {
    const lines = ["✈️ My Asvior Trip Summary", today, "", "📋 Checklist:"];
    for (const item of checklistItems)
      lines.push(`  ${checked.has(item.id) ? "✅" : "⬜"} ${item.label}`);
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
      const shareNavigator = navigator as Navigator & {
        share?: (data: { title: string; text: string }) => Promise<void>;
      };
      if (typeof navigator !== "undefined" && shareNavigator.share) {
        await shareNavigator.share({ title: "My Asvior Trip Summary", text });
        setShareMsg("Shared!");
      } else if (navigator?.clipboard) {
        await navigator.clipboard.writeText(text);
        setShareMsg("Copied to clipboard");
      } else setShareMsg("Sharing not supported");
    } catch (error) {
      void error;
      setShareMsg(null);
    }
    setTimeout(() => setShareMsg(null), 2500);
  };

  const packed = checklistItems.filter((i) => checked.has(i.id)).length;

  return (
    <PageShell className="pb-6">
      <style>{`@media print { nav, .no-print { display: none !important; } body { background: white !important; } }`}</style>

      <div className="no-print">
        <PageHeader
          badge={<PageBadge icon={<FileText className="h-3.5 w-3.5" />}>Ready to share</PageBadge>}
          title="Trip Summary"
          subtitle="Share with your travel buddies or save as PDF."
        />
      </div>

      <div id="summary-printable" className="space-y-4 px-4">
        <div className="animate-fade-in relative overflow-hidden rounded-3xl grad-ink p-6 text-white elev-3">
          <span className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-aurora/25 blur-2xl" />
          <div className="relative">
            <p className="text-eyebrow text-white/60">Asvior Trip Summary</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.02em]">{today}</p>
            <p className="mt-3 text-xs text-white/75">
              {packed} of {checklistItems.length} items packed · ${fmt(total)} budget
            </p>
          </div>
        </div>

        <div
          className="premium-card animate-fade-in rounded-3xl p-5"
          style={{ animationDelay: "60ms" }}
        >
          <h2 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald" /> Checklist
          </h2>
          <ul className="mt-3 space-y-2.5">
            {checklistItems.map((item) => {
              const isChecked = checked.has(item.id);
              return (
                <li key={item.id} className="flex items-center gap-2.5 text-sm">
                  {isChecked ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald" />
                  ) : (
                    <Circle className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={1.5} />
                  )}
                  <span
                    className={
                      isChecked
                        ? "text-muted-foreground line-through"
                        : "font-medium text-foreground"
                    }
                  >
                    {item.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div
          className="premium-card animate-fade-in rounded-3xl p-5"
          style={{ animationDelay: "120ms" }}
        >
          <h2 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <Wallet className="h-3.5 w-3.5 text-primary" /> Budget
          </h2>
          {total === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              No budget entered yet.{" "}
              <Link to="/budget-planner" className="font-semibold text-primary underline no-print">
                Add costs
              </Link>
              .
            </p>
          ) : (
            <>
              <ul className="mt-3 space-y-2.5">
                {budgetCategories.map((c) => {
                  const v = budget[c.key] || 0;
                  if (v <= 0) return null;
                  const pct = total > 0 ? (v / total) * 100 : 0;
                  return (
                    <li key={c.key} className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{c.label}</span>
                      <span className="text-muted-foreground">
                        <span className="font-semibold text-foreground">${fmt(v)}</span>{" "}
                        <span className="text-xs">({pct.toFixed(0)}%)</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                <span className="text-sm font-semibold text-foreground">Total</span>
                <span className="text-xl font-semibold tracking-[-0.02em] text-primary">
                  ${fmt(total)}
                </span>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-[10px] text-muted-foreground">Generated by Asvior</p>
      </div>

      <div className="no-print mt-6 space-y-2.5 px-4">
        <button
          onClick={async () => {
            const { data } = await supabase.auth.getUser();
            if (!data.user) {
              toast.error("Sign in to save trips");
              return;
            }
            const name = prompt("Name this trip:", `Trip · ${today}`);
            if (!name) return;
            const { error } = await supabase.from("saved_trips").insert({
              user_id: data.user.id,
              name,
              budget,
              checklist: Array.from(checked),
            });
            if (error) toast.error(error.message);
            else toast.success("Trip saved to your account");
          }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl grad-signal px-4 py-3.5 text-sm font-semibold text-white elev-2 transition-transform active:scale-95"
        >
          <Save className="h-4 w-4" /> Save to my account
        </button>
        <button
          onClick={handleShare}
          className="flex w-full items-center justify-center gap-2 rounded-2xl grad-ink px-4 py-3.5 text-sm font-semibold text-white elev-2 transition-transform active:scale-95"
        >
          <Share2 className="h-4 w-4" /> Share summary
        </button>
        <button
          onClick={() => typeof window !== "undefined" && window.print()}
          className="premium-card flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-semibold text-foreground transition-transform active:scale-95"
        >
          <Download className="h-4 w-4" /> Export as PDF
        </button>
        {shareMsg && <p className="text-center text-xs text-muted-foreground">{shareMsg}</p>}
      </div>
    </PageShell>
  );
}
