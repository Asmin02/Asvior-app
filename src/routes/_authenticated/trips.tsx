import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Luggage, MapPin, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  EmptyStateCard,
  LoadingSkeleton,
  PageBadge,
  PageHeader,
  PageShell,
} from "@/components/PageShell";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/trips")({
  head: () => ({ meta: [{ title: "Saved Trips — ASVIOR" }] }),
  component: TripsPage,
});

function getCountryName(code: string | null) {
  if (!code) return "—";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code;
  } catch {
    return code;
  }
}

function flag(code: string | null) {
  if (!code || code.length !== 2) return "";
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1a5 + c.charCodeAt(0)));
}

interface Trip {
  id: string;
  name: string;
  destination_code: string | null;
  passport_code: string | null;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
  created_at: string;
}

function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Trip>>({});

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoadError(false);
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      setTrips([]);
      setLoading(false);
      return;
    }
    setUserId(userData.user.id);

    const { data, error } = await supabase
      .from("saved_trips")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });
    if (error) {
      setLoadError(true);
      setLoading(false);
      return;
    }
    setTrips((data as Trip[]) || []);
    setLoading(false);
  };

  const remove = async (id: string) => {
    if (!userId) return;
    if (!confirm("Delete this trip?")) return;
    await supabase.from("saved_trips").delete().eq("user_id", userId).eq("id", id);
    toast.success("Trip deleted");
    load();
  };

  const startEdit = (t: Trip) => {
    setEditing(t.id);
    setDraft(t);
  };

  const save = async () => {
    if (!editing || !userId) return;
    const { error } = await supabase
      .from("saved_trips")
      .update({
        name: draft.name,
        notes: draft.notes,
        start_date: draft.start_date || null,
        end_date: draft.end_date || null,
      })
      .eq("user_id", userId)
      .eq("id", editing);
    if (error) toast.error(error.message);
    else {
      toast.success("Saved");
      setEditing(null);
      load();
    }
  };

  return (
    <PageShell className="pb-6">
      <PageHeader
        badge={
          <PageBadge icon={<Luggage className="h-3.5 w-3.5" />}>
            {trips.length} saved {trips.length === 1 ? "trip" : "trips"}
          </PageBadge>
        }
        title="Saved Trips"
        subtitle="All your planned journeys in one place."
      />

      <section className="relative mt-6 px-4">
        {loading ? (
          <LoadingSkeleton rows={3} />
        ) : loadError ? (
          <EmptyStateCard
            icon="📡"
            title="Couldn't load your trips"
            description="Check your connection and try again."
            action={
              <Button
                variant="outline"
                size="sm"
                className="rounded-2xl"
                onClick={() => {
                  setLoading(true);
                  load();
                }}
              >
                Retry
              </Button>
            }
          />
        ) : trips.length === 0 ? (
          <EmptyStateCard
            icon={<Luggage className="h-7 w-7 text-navy" />}
            title="No saved trips yet"
            description="Save a budget or checklist as a trip from the summary page and it will appear here."
          />
        ) : (
          <div className="space-y-3">
            {trips.map((t) => (
              <div
                key={t.id}
                className="premium-card rounded-2xl p-5"
              >
                {editing === t.id ? (
                  <div className="space-y-3">
                    <Input
                      value={draft.name || ""}
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      placeholder="Trip name"
                    />
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={draft.start_date || ""}
                        onChange={(e) => setDraft({ ...draft, start_date: e.target.value })}
                      />
                      <Input
                        type="date"
                        value={draft.end_date || ""}
                        onChange={(e) => setDraft({ ...draft, end_date: e.target.value })}
                      />
                    </div>
                    <Input
                      value={draft.notes || ""}
                      onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                      placeholder="Notes"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={save} className="flex-1 rounded-2xl">
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditing(null)}
                        className="flex-1 rounded-2xl"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-navy text-primary-foreground">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <p className="truncate text-[15px] font-bold text-foreground">{t.name}</p>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {flag(t.passport_code)} {getCountryName(t.passport_code)} →{" "}
                        {flag(t.destination_code)} {getCountryName(t.destination_code)}
                      </p>
                      {(t.start_date || t.end_date) && (
                        <p className="mt-1 text-[11px] font-medium text-muted-foreground">
                          {t.start_date || "?"} – {t.end_date || "?"}
                        </p>
                      )}
                      {t.notes && (
                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                          {t.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button
                        onClick={() => startEdit(t)}
                        className="premium-pill flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:text-foreground"
                        aria-label="Edit trip"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => remove(t.id)}
                        className="premium-pill flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Delete trip"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
