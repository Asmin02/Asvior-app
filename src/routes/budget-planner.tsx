import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/budget-planner")({
  head: () => ({
    meta: [
      { title: "Budget Planner — VisaPilot" },
      { name: "description", content: "Plan your trip budget with a simple breakdown." },
      { property: "og:title", content: "Budget Planner — VisaPilot" },
      { property: "og:description", content: "Plan your trip budget with a simple breakdown." },
    ],
  }),
  component: BudgetPlannerPage,
});

interface BudgetBreakdown {
  label: string;
  percent: number;
  color: string;
  icon: React.ReactNode;
}

const breakdowns: BudgetBreakdown[] = [
  {
    label: "Flight",
    percent: 40,
    color: "bg-travel-blue",
    icon: <PlaneIcon className="h-4 w-4 text-white" />,
  },
  {
    label: "Hotel",
    percent: 30,
    color: "bg-travel-blue-light",
    icon: <HotelIcon className="h-4 w-4 text-travel-blue-dark" />,
  },
  {
    label: "Food",
    percent: 20,
    color: "bg-travel-sky",
    icon: <FoodIcon className="h-4 w-4 text-travel-blue-dark" />,
  },
  {
    label: "Extra",
    percent: 10,
    color: "bg-travel-sand",
    icon: <GiftIcon className="h-4 w-4 text-travel-blue-dark" />,
  },
];

function BudgetPlannerPage() {
  const [budget, setBudget] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const total = parseFloat(budget) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (total > 0) setSubmitted(true);
  };

  return (
    <div className="px-5 pt-8 pb-6">
      <h1 className="text-2xl font-bold text-foreground">Budget Planner</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your total budget and see a recommended breakdown.
      </p>

      <form onSubmit={handleSubmit} className="mt-6">
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Total Budget
        </label>
        <div className="flex gap-2">
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 2000"
            value={budget}
            onChange={(e) => {
              setBudget(e.target.value);
              setSubmitted(false);
            }}
            className="flex-1"
          />
          <Button type="submit" disabled={!budget || total <= 0}>
            Plan
          </Button>
        </div>
      </form>

      {submitted && total > 0 && (
        <div className="mt-6 space-y-3">
          <div className="rounded-xl bg-primary/5 p-4 text-center ring-1 ring-primary/10">
            <p className="text-xs text-muted-foreground">Total Budget</p>
            <p className="mt-0.5 text-2xl font-bold text-primary">
              ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {breakdowns.map((item) => {
              const amount = (total * item.percent) / 100;
              return (
                <Card key={item.label} className="ring-1 ring-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.color}`}>
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">{item.label}</p>
                        <p className="text-[10px] text-muted-foreground">{item.percent}%</p>
                      </div>
                    </div>
                    <p className="mt-2 text-lg font-bold text-foreground">
                      ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Visual bar */}
          <div className="mt-2 flex h-4 w-full overflow-hidden rounded-full">
            {breakdowns.map((item) => (
              <div
                key={item.label}
                className={`${item.color} first:rounded-l-full last:rounded-r-full`}
                style={{ width: `${item.percent}%` }}
              />
            ))}
          </div>
          <p className="text-center text-[10px] text-muted-foreground">
            Breakdown is a suggestion — adjust based on your trip style.
          </p>
        </div>
      )}
    </div>
  );
}

function PlaneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  );
}

function HotelIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
    </svg>
  );
}

function FoodIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}

function GiftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H4.5a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0 0v8.25m-2.625-8.25l.75 2.25m6-2.25l-.75 2.25M3.375 7.5h17.25c.621 0 1.125.504 1.125 1.125v0c0 .621-.504 1.125-1.125 1.125H3.375c-.621 0-1.125-.504-1.125-1.125v0c0-.621.504-1.125 1.125-1.125z" />
    </svg>
  );
}
