import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Share2,
  Download,
  Save,
  CheckCircle2,
  Circle,
  FileText,
  Wallet,
  Luggage,
  Calendar,
} from "lucide-react";
import { PageBadge, PageHeader, PageShell } from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { usePreferredCurrency } from "@/lib/use-preferred-currency";
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
  const { format } = usePreferredCurrency();
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
      if (v > 0) lines.push(`  • ${c.label}: ${format(v)}`);
    }
    lines.push(`  ─────────────`, `  Total: ${format(total)}`);
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
  const checklistPct = Math.round((packed / checklistItems.length) * 100);

  return (
    <PageShell>
      <style>{`
        @media print {
          nav, .no-print { display: none !important; }
          body { background: white !important; }
          #summary-printable { padding: 0 !important; }
          .asv-ai-banner { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div className="no-print">
        <PageHeader
          badge={
            <PageBadge icon={<FileText className="h-3.5 w-3.5" />}>Ready to share</PageBadge>
          }
          title="Trip Summary"
          subtitle="Share with your travel buddies or save as PDF."
        />
      </div>

      <div id="summary-printable" className="asv-page-pad mt-4 space-y-5 pb-4">
        {/* Elegant header band */}
        <div className="asv-ai-banner overflow-hidden p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                Asvior Trip Summary
              </p>
              <p className="asv-display mt-2 text-2xl text-white">{today}</p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--asv-radius-md)] bg-white/15">
              <Luggage className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-[var(--asv-radius-md)] bg-white/10 p-3 text-center backdrop-blur-sm">
              <p className="text-lg font-bold text-white">{packed}/{checklistItems.length}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-white/60">Packed</p>
            </div>
            <div className="rounded-[var(--asv-radius-md)] bg-white/10 p-3 text-center backdrop-blur-sm">
              <p className="text-lg font-bold text-white">{checklistPct}%</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-white/60">Ready</p>
            </div>
            <div className="rounded-[var(--asv-radius-md)] bg-white/10 p-3 text-center backdrop-blur-sm">
              <p className="text-lg font-bold text-white">{format(total)}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-white/60">Budget</p>
            </div>
          </div>
        </div>

        {/* Checklist section */}
        <div className="asv-card overflow-hidden">
          <div className="border-b border-[var(--asv-divider)] px-5 py-4">
            <div className="flex items-center justify-between">
              <h2 className="asv-title flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--asv-success)]" />
                Checklist
              </h2>
              <span className="asv-pill asv-pill--success">{checklistPct}%</span>
            </div>
            <div className="asv-progress mt-3">
              <div className="asv-progress-bar" style={{ width: `${checklistPct}%` }} />
            </div>
          </div>
          <ul className="divide-y divide-[var(--asv-divider)]">
            {checklistItems.map((item) => {
              const isChecked = checked.has(item.id);
              return (
                <li key={item.id} className="flex items-center gap-3 px-5 py-3.5">
                  {isChecked ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--asv-success)]" />
                  ) : (
                    <Circle
                      className="h-5 w-5 shrink-0 text-[var(--asv-ink-muted)]"
                      strokeWidth={1.5}
                    />
                  )}
                  <span
                    className={`flex-1 text-sm ${
                      isChecked
                        ? "text-[var(--asv-ink-tertiary)] line-through"
                        : "font-medium text-[var(--asv-ink)]"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wide ${
                      isChecked ? "text-[var(--asv-success)]" : "text-[var(--asv-ink-muted)]"
                    }`}
                  >
                    {isChecked ? "Done" : "Pending"}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Budget section */}
        <div className="asv-card overflow-hidden">
          <div className="border-b border-[var(--asv-divider)] px-5 py-4">
            <h2 className="asv-title flex items-center gap-2">
              <Wallet className="h-4 w-4 text-[var(--asv-primary)]" />
              Budget
            </h2>
          </div>
          <div className="p-5">
            {total === 0 ? (
              <p className="text-sm text-[var(--asv-ink-secondary)]">
                No budget entered yet.{" "}
                <Link
                  to="/budget-planner"
                  className="font-semibold text-[var(--asv-primary)] underline no-print"
                >
                  Add costs
                </Link>
                .
              </p>
            ) : (
              <>
                <ul className="space-y-3">
                  {budgetCategories.map((c) => {
                    const v = budget[c.key] || 0;
                    if (v <= 0) return null;
                    const pct = total > 0 ? (v / total) * 100 : 0;
                    return (
                      <li key={c.key}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-[var(--asv-ink)]">{c.label}</span>
                          <span className="font-bold text-[var(--asv-ink)]">{format(v)}</span>
                        </div>
                        <div className="asv-progress mt-1.5">
                          <div className="asv-progress-bar" style={{ width: `${pct}%` }} />
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-5 flex items-center justify-between rounded-[var(--asv-radius-md)] bg-[var(--asv-canvas)] p-4">
                  <span className="text-sm font-semibold text-[var(--asv-ink)]">Total budget</span>
                  <span className="asv-display text-xl">{format(total)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-[10px] text-[var(--asv-ink-tertiary)]">
          <Calendar className="h-3 w-3" />
          Generated by Asvior · {today}
        </div>
      </div>

      <div className="no-print asv-page-pad mt-4 space-y-2.5 pb-6">
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
          className="asv-btn asv-btn-primary w-full"
        >
          <Save className="h-4 w-4" /> Save to my account
        </button>
        <button onClick={handleShare} className="asv-btn asv-btn-primary w-full">
          <Share2 className="h-4 w-4" /> Share summary
        </button>
        <button
          onClick={() => typeof window !== "undefined" && window.print()}
          className="asv-btn asv-btn-secondary w-full"
        >
          <Download className="h-4 w-4" /> Export as PDF
        </button>
        {shareMsg && (
          <p className="text-center text-xs text-[var(--asv-ink-tertiary)]">{shareMsg}</p>
        )}
      </div>
    </PageShell>
  );
}
