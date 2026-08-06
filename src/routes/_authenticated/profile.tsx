import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  Camera,
  Luggage,
  Heart,
  History,
  Settings as SettingsIcon,
  LogOut,
  AlertTriangle,
  Mail,
  BookUser,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageBadge, PageHeader, PageShell } from "@/components/PageShell";
import { CountryCombobox, type CountryOption } from "@/components/CountryCombobox";
import { VISA_CODES } from "@/data/visa-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "My Profile — Asvior" }] }),
  component: ProfilePage,
});

function getCountryName(code: string): string {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code;
  } catch {
    return code;
  }
}
const COUNTRY_OPTIONS: CountryOption[] = VISA_CODES.map((c) => ({
  code: c,
  name: getCountryName(c),
})).sort((a, b) => a.name.localeCompare(b.name));

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  nationality: string | null;
  passport_country: string | null;
  passport_number: string | null;
  passport_expiry: string | null;
  photo_url: string | null;
}

const EMPTY_PROFILE: Omit<Profile, "id" | "email"> = {
  full_name: null,
  nationality: null,
  passport_country: null,
  passport_number: null,
  passport_expiry: null,
  photo_url: null,
};

function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      const user = userData.user;
      if (!user) {
        navigate({ to: "/auth" });
        return;
      }

      const { data: existing, error: fetchErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      if (fetchErr) throw fetchErr;

      let row = existing as Profile | null;

      // If no profile row exists yet (e.g. pre-trigger user, race, or bypass),
      // create one on the fly. This matches the Android client behaviour and
      // prevents the web UI from getting stuck on the skeleton.
      if (!row) {
        const meta = (user.user_metadata ?? {}) as { full_name?: string; name?: string };
        const insertPayload = {
          id: user.id,
          email: user.email ?? null,
          ...EMPTY_PROFILE,
          full_name: meta.full_name || meta.name || null,
        };
        const { data: inserted, error: insertErr } = await supabase
          .from("profiles")
          .upsert(insertPayload, { onConflict: "id" })
          .select("*")
          .maybeSingle();
        if (insertErr) {
          // Fall back to a local in-memory profile so the UI is not blank.
          row = insertPayload as Profile;
        } else {
          row = (inserted as Profile) ?? (insertPayload as Profile);
        }
      }

      setProfile(row);

      if (row?.photo_url) {
        const { data: signed } = await supabase.storage
          .from("avatars")
          .createSignedUrl(row.photo_url, 3600);
        setAvatarSrc(signed?.signedUrl ?? null);
      } else {
        setAvatarSrc(null);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not load profile";
      setLoadError(msg);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    load();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setProfile(null);
        navigate({ to: "/" });
      }
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, [load, navigate]);

  const save = async () => {
    if (!profile) return;
    setBusy(true);
    const { error } = await supabase.from("profiles").upsert(
      {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        nationality: profile.nationality,
        passport_country: profile.passport_country,
        passport_number: profile.passport_number,
        passport_expiry: profile.passport_expiry,
      },
      { onConflict: "id" },
    );
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Profile saved");
  };

  const uploadAvatar = async (file: File) => {
    if (!profile) return;
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${profile.id}/avatar.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (upErr) {
      toast.error(upErr.message);
      setUploading(false);
      return;
    }
    await supabase.from("profiles").update({ photo_url: path }).eq("id", profile.id);
    const { data: signed } = await supabase.storage.from("avatars").createSignedUrl(path, 3600);
    setAvatarSrc(signed?.signedUrl ?? null);
    setProfile({ ...profile, photo_url: path });
    setUploading(false);
    toast.success("Photo updated");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <PageShell className="pb-6">
        <div data-testid="profile-loading" className="animate-pulse space-y-4 px-4 pt-6">
          <div className="h-48 rounded-2xl bg-muted" />
          <div className="h-24 rounded-2xl bg-muted" />
          <div className="h-40 rounded-2xl bg-muted" />
        </div>
      </PageShell>
    );
  }

  if (loadError || !profile) {
    return (
      <PageShell className="pb-6">
        <div data-testid="profile-error" className="space-y-4 px-4 pt-6">
          <h1 className="text-2xl font-bold text-foreground">Could not load profile</h1>
          <p className="text-sm text-muted-foreground">
            {loadError ?? "We couldn't find your profile. Try signing out and back in."}
          </p>
          <div className="flex gap-2">
            <Button data-testid="profile-retry-btn" onClick={load} className="rounded-2xl">
              Retry
            </Button>
            <Button
              data-testid="profile-signout-btn"
              variant="outline"
              onClick={signOut}
              className="rounded-2xl"
            >
              Sign out
            </Button>
          </div>
        </div>
      </PageShell>
    );
  }

  const expiryDate = profile.passport_expiry ? new Date(profile.passport_expiry) : null;
  const daysToExpiry = expiryDate
    ? Math.ceil((expiryDate.getTime() - Date.now()) / 86400000)
    : null;
  const expiryWarn = daysToExpiry !== null && daysToExpiry < 180;

  return (
    <PageShell className="pb-6">
      <div data-testid="profile-page">
        <PageHeader
          badge={<PageBadge>My Profile</PageBadge>}
          title={profile.full_name || "My Profile"}
          subtitle={profile.email ?? undefined}
          action={
            <button
              data-testid="profile-header-signout-btn"
              onClick={signOut}
              className="premium-card flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[11px] font-semibold text-foreground transition-transform active:scale-95"
            >
              <LogOut className="h-3 w-3" /> Sign out
            </button>
          }
        />

        <div className="animate-fade-in px-4 pt-4">
          <div className="premium-card relative overflow-hidden rounded-3xl p-5">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl"
            />
            <div className="relative flex items-center gap-4">
              <button
                data-testid="profile-avatar-btn"
                onClick={() => fileRef.current?.click()}
                aria-label="Change profile photo"
                className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl ring-2 ring-border/70 transition-transform active:scale-95"
              >
                {avatarSrc ? (
                  <img src={avatarSrc} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 to-primary/5 text-2xl font-semibold text-navy">
                    {(profile.full_name || profile.email || "?").charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-ink/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera className="h-5 w-5 text-background" />
                </div>
              </button>
              <input
                data-testid="profile-avatar-input"
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadAvatar(f);
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-semibold tracking-[-0.01em] text-foreground">
                  {profile.full_name || "Add your name"}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{profile.email}</p>
                <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                  Member of Asvior
                </p>
                {uploading && <p className="mt-1 text-[10px] text-muted-foreground">Uploading…</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 animate-fade-in px-4" style={{ animationDelay: "60ms" }}>
          <div className="premium-card grid grid-cols-3 gap-2 rounded-3xl p-2">
            <QuickLink
              to="/trips"
              icon={<Luggage className="h-5 w-5" />}
              label="Trips"
              testId="quicklink-trips"
            />
            <QuickLink
              to="/favorites"
              icon={<Heart className="h-5 w-5" />}
              label="Favorites"
              testId="quicklink-favorites"
            />
            <QuickLink
              to="/history"
              icon={<History className="h-5 w-5" />}
              label="History"
              testId="quicklink-history"
            />
          </div>
        </div>

        {expiryWarn && (
          <div className="mx-4 mt-4 flex items-center gap-2 rounded-2xl bg-amber-100 p-3 text-xs font-medium text-amber-900 ring-1 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-200 dark:ring-amber-900/60">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            Your passport expires in {daysToExpiry} days. Many countries require 6+ months validity.
          </div>
        )}

        <div className="mt-5 space-y-3 px-4">
          <div
            className="premium-card animate-fade-in rounded-3xl p-5"
            style={{ animationDelay: "100ms" }}
          >
            <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <BookUser className="h-3.5 w-3.5 text-navy" /> Account
            </p>
            <Field label="Full name">
              <Input
                data-testid="profile-fullname-input"
                value={profile.full_name || ""}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="rounded-xl"
              />
            </Field>
            <div className="mt-3">
              <Field label="Email" icon={<Mail className="h-3.5 w-3.5" />}>
                <Input
                  data-testid="profile-email-input"
                  value={profile.email || ""}
                  disabled
                  className="rounded-xl"
                />
              </Field>
            </div>
          </div>

          <div
            className="premium-card animate-fade-in space-y-3 rounded-3xl p-5"
            style={{ animationDelay: "160ms" }}
          >
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <BookUser className="h-3.5 w-3.5 text-emerald" /> Passport
            </p>
            <Field label="Nationality">
              <CountryCombobox
                value={profile.nationality || ""}
                onChange={(v) => setProfile({ ...profile, nationality: v })}
                options={COUNTRY_OPTIONS}
                placeholder="Select nationality..."
              />
            </Field>
            <Field label="Passport country">
              <CountryCombobox
                value={profile.passport_country || ""}
                onChange={(v) => setProfile({ ...profile, passport_country: v })}
                options={COUNTRY_OPTIONS}
                placeholder="Select passport country..."
              />
            </Field>
            <Field label="Passport number (optional)">
              <Input
                data-testid="profile-passport-number-input"
                value={profile.passport_number || ""}
                onChange={(e) => setProfile({ ...profile, passport_number: e.target.value })}
                placeholder="••••••••"
                className="rounded-xl"
              />
            </Field>
            <Field label="Passport expiry">
              <Input
                data-testid="profile-passport-expiry-input"
                type="date"
                value={profile.passport_expiry || ""}
                onChange={(e) => setProfile({ ...profile, passport_expiry: e.target.value })}
                className="rounded-xl"
              />
            </Field>
          </div>

          <Button
            data-testid="profile-save-btn"
            onClick={save}
            disabled={busy}
            className="h-12 w-full rounded-2xl text-sm font-semibold active:scale-[0.98]"
          >
            {busy ? "Saving…" : "Save profile"}
          </Button>

          <Link
            data-testid="profile-settings-link"
            to="/settings"
            className="premium-card flex items-center justify-between rounded-2xl p-4 text-sm font-semibold text-foreground transition-transform active:scale-[0.98]"
          >
            <span className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4 text-navy" /> Settings & notifications
            </span>
            <span className="text-muted-foreground">›</span>
          </Link>
        </div>
      </div>
    </PageShell>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}

function QuickLink({
  to,
  icon,
  label,
  testId,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  testId?: string;
}) {
  return (
    <Link
      to={to as never}
      data-testid={testId}
      className="flex flex-col items-center gap-1.5 rounded-2xl p-3 transition-all hover:bg-secondary/60 active:scale-95"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-navy text-primary-foreground shadow-soft">
        {icon}
      </div>
      <span className="text-[11px] font-semibold text-foreground">{label}</span>
    </Link>
  );
}
