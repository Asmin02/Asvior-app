import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/trips")({
  head: () => ({ meta: [{ title: "Saved Trips — VisaPilot" }] }),
  component: TripsPage,
});

function getCountryName(code: string | null) {
  if (!code) return "—";
  try { return new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code; } catch { return code; }
}
function flag(code: string | null) {
  if (!code || code.length !== 2) return "";
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1a5 + c.charCodeAt(0)));
}

interface Trip {
  id: string; name: string; destination_code: string | null; passport_code: string | null;
  start_date: string | null; end_date: string | null; notes: string | null; created_at: string;
}

function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Trip>>({});

  useEffect(() => { load(); }, []);
  const load = async () => {
    const { data } = await supabase.from("saved_trips").select("*").order("created_at", { ascending: false });
    setTrips((data as Trip[]) || []);
    setLoading(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this trip?")) return;
    await supabase.from("saved_trips").delete().eq("id", id);
    toast.success("Trip deleted");
    load();
  };

  const startEdit = (t: Trip) => { setEditing(t.id); setDraft(t); };

  const save = async () => {
    if (!editing) return;
    const { error } = await supabase.from("saved_trips").update({
      name: draft.name, notes: draft.notes, start_date: draft.start_date || null, end_date: draft.end_date || null,
    }).eq("id", editing);
    if (error) toast.error(error.message);
    else { toast.success("Saved"); setEditing(null); load(); }
  };

  return (
    <div className="px-5 pt-8 pb-6">
      <h1 className="text-2xl font-bold text-foreground">Saved Trips</h1>
      <p className="mt-1 text-sm text-muted-foreground">All your planned journeys in one place.</p>

      {loading ? (
        <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
      ) : trips.length === 0 ? (
        <Card className="mt-6 ring-1 ring-border">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-travel-sky text-travel-blue-dark text-2xl">🧳</div>
            <p className="text-sm font-semibold text-foreground">No trips yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Save your budget or checklist as a trip to see it here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-5 space-y-3">
          {trips.map((t) => (
            <Card key={t.id} className="ring-1 ring-border">
              <CardContent className="p-4">
                {editing === t.id ? (
                  <div className="space-y-2">
                    <Input value={draft.name || ""} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Trip name" />
                    <div className="flex gap-2">
                      <Input type="date" value={draft.start_date || ""} onChange={(e) => setDraft({ ...draft, start_date: e.target.value })} />
                      <Input type="date" value={draft.end_date || ""} onChange={(e) => setDraft({ ...draft, end_date: e.target.value })} />
                    </div>
                    <Input value={draft.notes || ""} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} placeholder="Notes" />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={save} className="flex-1">Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditing(null)} className="flex-1">Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">{t.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {flag(t.passport_code)} {getCountryName(t.passport_code)} → {flag(t.destination_code)} {getCountryName(t.destination_code)}
                        </p>
                        {(t.start_date || t.end_date) && (
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            {t.start_date || "?"} – {t.end_date || "?"}
                          </p>
                        )}
                        {t.notes && <p className="mt-1 line-clamp-2 text-xs text-foreground/80">{t.notes}</p>}
                      </div>
                      <div className="flex flex-col gap-1">
                        <button onClick={() => startEdit(t)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Edit"><EditIcon className="h-4 w-4" /></button>
                        <button onClick={() => remove(t.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" aria-label="Delete"><TrashIcon className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function EditIcon({ className }: { className?: string }) { return <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>; }
function TrashIcon({ className }: { className?: string }) { return <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>; }
