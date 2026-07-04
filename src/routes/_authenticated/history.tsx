import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/history")({
  head: () => ({ meta: [{ title: "Travel History — VisaPilot" }] }),
  component: HistoryPage,
});

function getCountryName(code: string) { try { return new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code; } catch { return code; } }
function flag(code: string) { if (code.length !== 2) return ""; return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1a5 + c.charCodeAt(0))); }

interface HistoryRow { id: string; passport_code: string; destination_code: string; status: string; created_at: string; }
interface TripRow { id: string; name: string; destination_code: string | null; created_at: string; }

function HistoryPage() {
  const [checks, setChecks] = useState<HistoryRow[]>([]);
  const [trips, setTrips] = useState<TripRow[]>([]);
  const [tab, setTab] = useState<"visa" | "trips">("visa");

  useEffect(() => {
    supabase.from("visa_history").select("*").order("created_at", { ascending: false }).limit(50).then(({ data }) => setChecks((data as HistoryRow[]) || []));
    supabase.from("saved_trips").select("id, name, destination_code, created_at").order("created_at", { ascending: false }).then(({ data }) => setTrips((data as TripRow[]) || []));
  }, []);

  return (
    <div className="px-5 pt-8 pb-6">
      <h1 className="text-2xl font-bold text-foreground">Travel History</h1>
      <p className="mt-1 text-sm text-muted-foreground">Your visa checks and saved trips, all in one timeline.</p>

      <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
        <button onClick={() => setTab("visa")} className={`rounded-lg py-2 text-xs font-semibold ${tab === "visa" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>Visa Checks</button>
        <button onClick={() => setTab("trips")} className={`rounded-lg py-2 text-xs font-semibold ${tab === "trips" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>Trip Plans</button>
      </div>

      <div className="mt-4 space-y-2">
        {tab === "visa" ? (
          checks.length === 0 ? (
            <Card className="ring-1 ring-border">
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-travel-sky text-2xl">🛂</div>
                <p className="text-sm font-semibold text-foreground">No visa checks yet.</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Run your first visa search and it will appear here.</p>
              </CardContent>
            </Card>
          ) :
          checks.map((c) => (
            <Card key={c.id} className="ring-1 ring-border">
              <CardContent className="flex items-center gap-3 p-3">
                <div className="text-xl">{flag(c.passport_code)}→{flag(c.destination_code)}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{getCountryName(c.passport_code)} → {getCountryName(c.destination_code)}</p>
                  <p className="text-[11px] text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</p>
                </div>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{c.status}</span>
              </CardContent>
            </Card>
          ))
        ) : (
          trips.length === 0 ? (
            <Card className="ring-1 ring-border">
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-travel-sky text-2xl">🧳</div>
                <p className="text-sm font-semibold text-foreground">No saved trips yet.</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Start planning your first adventure.</p>
              </CardContent>
            </Card>
          ) :
          trips.map((t) => (
            <Card key={t.id} className="ring-1 ring-border">
              <CardContent className="flex items-center gap-3 p-3">
                <div className="text-2xl">{t.destination_code ? flag(t.destination_code) : "🧳"}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
