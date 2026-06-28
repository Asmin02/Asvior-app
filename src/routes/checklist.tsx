import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/checklist")({
  head: () => ({
    meta: [
      { title: "Travel Checklist — VisaPilot" },
      { name: "description", content: "Essential travel checklist — your progress saves automatically." },
      { property: "og:title", content: "Travel Checklist — VisaPilot" },
      { property: "og:description", content: "Essential travel checklist — your progress saves automatically." },
    ],
  }),
  component: ChecklistPage,
});

interface CheckItem {
  id: string;
  label: string;
  description: string;
}

const defaultItems: CheckItem[] = [
  { id: "passport", label: "Passport", description: "Valid for at least 6 months beyond travel dates" },
  { id: "flight", label: "Flight Ticket", description: "Confirmed round-trip or onward ticket" },
  { id: "hotel", label: "Hotel Booking", description: "Confirmed accommodation reservation" },
  { id: "insurance", label: "Travel Insurance", description: "Covers medical emergencies and trip cancellation" },
  { id: "money", label: "Money / Card", description: "Local currency, credit/debit cards, backup cash" },
  { id: "charger", label: "Charger / Adapter", description: "Power bank, chargers, and correct plug adapter" },
  { id: "clothes", label: "Clothes", description: "Weather-appropriate clothing and comfortable shoes" },
];

const STORAGE_KEY = "vp_checklist";

function ChecklistPage() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const arr = JSON.parse(raw) as string[];
        if (Array.isArray(arr)) setChecked(new Set(arr));
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(checked)));
  }, [checked, loaded]);

  const toggleItem = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const reset = () => setChecked(new Set());

  const progress = Math.round((checked.size / defaultItems.length) * 100);

  return (
    <div className="px-5 pt-8 pb-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Travel Checklist</h1>
          <p className="mt-1 text-sm text-muted-foreground">Saved automatically on this device.</p>
        </div>
        {checked.size > 0 && (
          <button
            onClick={reset}
            className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Reset
          </button>
        )}
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-muted-foreground">{checked.size} of {defaultItems.length} packed</span>
          <span className="text-primary">{progress}%</span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        {defaultItems.map((item) => {
          const isChecked = checked.has(item.id);
          return (
            <Card
              key={item.id}
              className={`cursor-pointer ring-1 transition-all active:scale-[0.99] ${
                isChecked ? "bg-muted/40 ring-border" : "bg-card ring-border"
              }`}
              onClick={() => toggleItem(item.id)}
            >
              <CardContent className="flex items-start gap-3 p-4">
                <div className="mt-0.5 shrink-0">
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => toggleItem(item.id)}
                    className="h-5 w-5"
                  />
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-sm font-semibold ${
                      isChecked ? "text-muted-foreground line-through" : "text-foreground"
                    }`}
                  >
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {progress === 100 && (
        <div className="mt-6 rounded-xl bg-green-50 p-4 text-center ring-1 ring-green-200 dark:bg-green-950/40 dark:ring-green-900/60">
          <p className="text-sm font-semibold text-green-700 dark:text-green-300">You're all set!</p>
          <p className="mt-0.5 text-xs text-green-600 dark:text-green-400">Safe travels.</p>
        </div>
      )}

      <Link
        to="/summary"
        className="mt-6 flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
      >
        View &amp; Share Trip Summary
      </Link>
    </div>
  );
}
