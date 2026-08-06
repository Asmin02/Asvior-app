import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, Luggage, MapPin, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { EmptyState, LoadingRows } from "@/components/asvior";
import { PageBadge, PageHeader, PageShell } from "@/components/PageShell";
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

function formatDateRange(start: string | null, end: string | null) {
  if (!start && !end) return null;
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  if (start && end) return `${fmt(start)} – ${fmt(end)}`;
  return start ? fmt(start) : end ? fmt(end) : null;
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
    <PageShell className="app-scroll-page">
      <PageHeader
        badge={
          <PageBadge icon={<Luggage className="h-3.5 w-3.5" />}>
            {trips.length} saved {trips.length === 1 ? "trip" : "trips"}
          </PageBadge>
        }
        title="Saved Trips"
        subtitle="All your planned journeys in one place."
      />

      <section className="asv-page-pad mt-6 pb-6">
        {loading ? (
          <LoadingRows rows={3} />
        ) : loadError ? (
          <EmptyState
            icon={<span className="text-2xl">📡</span>}
            title="Couldn't load your trips"
            description="Check your connection and try again."
            action={
              <button
                type="button"
                className="asv-btn asv-btn-secondary asv-btn-sm"
                onClick={() => {
                  setLoading(true);
                  load();
                }}
              >
                Retry
              </button>
            }
          />
        ) : trips.length === 0 ? (
          <EmptyState
            icon={<Luggage className="h-8 w-8" />}
            title="No saved trips yet"
            description="Save a budget or checklist as a trip from the summary page and it will appear here."
          />
        ) : (
          <div className="asv-stagger space-y-3">
            {trips.map((t) => {
              const dates = formatDateRange(t.start_date, t.end_date);
              return (
                <article key={t.id} className="asv-card asv-card-pad">
                  {editing === t.id ? (
                    <div className="space-y-3">
                      <div className="asv-field">
                        <label className="asv-label">Trip name</label>
                        <input
                          className="asv-input"
                          value={draft.name || ""}
                          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                          placeholder="Trip name"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="asv-field">
                          <label className="asv-label">Start</label>
                          <input
                            type="date"
                            className="asv-input !min-h-11"
                            value={draft.start_date || ""}
                            onChange={(e) => setDraft({ ...draft, start_date: e.target.value })}
                          />
                        </div>
                        <div className="asv-field">
                          <label className="asv-label">End</label>
                          <input
                            type="date"
                            className="asv-input !min-h-11"
                            value={draft.end_date || ""}
                            onChange={(e) => setDraft({ ...draft, end_date: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="asv-field">
                        <label className="asv-label">Notes</label>
                        <input
                          className="asv-input"
                          value={draft.notes || ""}
                          onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                          placeholder="Notes"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={save} className="asv-btn asv-btn-primary flex-1">
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditing(null)}
                          className="asv-btn asv-btn-secondary flex-1"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2.5">
                            <div className="asv-tool-icon shrink-0">
                              <MapPin className="h-4 w-4" />
                            </div>
                            <h2 className="asv-title truncate">{t.name}</h2>
                          </div>
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="asv-pill asv-pill--primary">
                              {flag(t.passport_code)} {getCountryName(t.passport_code)}
                            </span>
                            <span className="text-xs text-[var(--asv-ink-tertiary)]">→</span>
                            <span className="asv-pill asv-pill--accent">
                              {flag(t.destination_code)} {getCountryName(t.destination_code)}
                            </span>
                          </div>
                          {dates && (
                            <p className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-[var(--asv-ink-secondary)]">
                              <Calendar className="h-3.5 w-3.5 shrink-0 text-[var(--asv-primary)]" />
                              {dates}
                            </p>
                          )}
                          {t.notes && (
                            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[var(--asv-ink-secondary)]">
                              {t.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <button
                            type="button"
                            onClick={() => startEdit(t)}
                            className="asv-btn asv-btn-icon !min-h-9 !w-9"
                            aria-label="Edit trip"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(t.id)}
                            className="asv-btn asv-btn-icon !min-h-9 !w-9 text-[var(--asv-coral)]"
                            aria-label="Delete trip"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </PageShell>
  );
}
