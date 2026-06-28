import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/summary")({
  head: () => ({
    meta: [
      { title: "Trip Summary — VisaPilot" },
      { name: "description", content: "Your saved travel checklist and budget — share or export as PDF." },
      { property: "og:title", content: "Trip Summary — VisaPilot" },
      { property: "og:description", content: "Your saved travel checklist and budget — share or export as PDF." },
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
    const lines: string[] = [];
    lines.push("✈️ My VisaPilot Trip Summary");
    lines.push(today);
    lines.push("");
    lines.push("📋 Checklist:");
    for (const item of checklistItems) {
      lines.push(`  ${checked.has(item.id) ? "✅" : "⬜"} ${item.label}`);
    }
    lines.push("");
    lines.push("💰 Budget:");
    for (const c of budgetCategories) {
      const v = budget[c.key] || 0;
      if (v > 0) lines.push(`  • ${c.label}: $${fmt(v)}`);
    }
    lines.push(`  ─────────────`);
    lines.push(`  Total: $${fmt(total)}`);
    return lines.join("\n");
  };

  const handleShare = async () => {
    const text = buildShareText();
    try {
      if (typeof navigator !== "undefined" && (navigator as any).share) {
        await (navigator as any).share({ title: "My VisaPilot Trip Summary", text });
        setShareMsg("Shared!");
      } else if (navigator?.clipboard) {
        await navigator.clipboard.writeText(text);
        setShareMsg("Copied to clipboard");
      } else {
        setShareMsg("Sharing not supported");
      }
    } catch {
      setShareMsg(null);
    }
    if (shareMsg) return;
    setTimeout(() => setShareMsg(null), 2500);
  };

  const handleExportPdf = () => {
    if (typeof window !== "undefined") window.print();
  };

  const packed = checklistItems.filter((i) => checked.has(i.id)).length;
  const hasData = packed > 0 || total > 0;

  return (
    <div className="px-5 pt-8 pb-6">
      <style>{`
        @media print {
          nav, .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>

      <div className="no-print">
        <h1 className="text-2xl font-bold text-foreground">Trip Summary</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Share with travel buddies or save as a PDF.
        </p>
      </div>

      <div id="summary-printable" className="mt-5 space-y-5">
        <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
          <p className="text-xs uppercase tracking-wide opacity-80">VisaPilot Trip Summary</p>
          <p className="mt-1 text-lg font-bold">{today}</p>
          <p className="mt-2 text-xs opacity-80">
            {packed} of {checklistItems.length} items packed · Total budget ${fmt(total)}
          </p>
        </div>

        <Card className="ring-1 ring-border">
          <CardContent className="p-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Checklist
            </h2>
            <ul className="mt-3 space-y-2">
              {checklistItems.map((item) => {
                const isChecked = checked.has(item.id);
                return (
                  <li key={item.id} className="flex items-center gap-2 text-sm">
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                        isChecked
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background"
                      }`}
                    >
                      {isChecked && (
                        <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                          <path
                            fillRule="evenodd"
                            d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 011.4-1.4L8 12.58l7.3-7.3a1 1 0 011.4 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </span>
                    <span
                      className={
                        isChecked ? "text-muted-foreground line-through" : "text-foreground"
                      }
                    >
                      {item.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <Card className="ring-1 ring-border">
          <CardContent className="p-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Budget
            </h2>
            {total === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                No budget entered yet.{" "}
                <Link to="/budget-planner" className="text-primary underline no-print">
                  Add costs
                </Link>
                .
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
                        <span className="text-foreground">{c.label}</span>
                        <span className="text-muted-foreground">
                          ${fmt(v)}{" "}
                          <span className="text-xs">({pct.toFixed(0)}%)</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-bold text-primary">${fmt(total)}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-[10px] text-muted-foreground">
          Generated by VisaPilot
        </p>
      </div>

      {!hasData && (
        <p className="mt-4 text-center text-xs text-muted-foreground no-print">
          Tip: complete your checklist or budget to build a richer summary.
        </p>
      )}

      <div className="no-print mt-6 space-y-2">
        <button
          onClick={handleShare}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          Share Summary
        </button>
        <button
          onClick={handleExportPdf}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          Export as PDF
        </button>
        {shareMsg && (
          <p className="text-center text-xs text-muted-foreground">{shareMsg}</p>
        )}
      </div>
    </div>
  );
}
