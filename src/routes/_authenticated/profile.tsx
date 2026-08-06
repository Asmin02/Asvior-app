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
  ChevronRight,
  User,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSkeleton, PageShell } from "@/components/PageShell";
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
      <PageShell className="asv-scroll-page">
        <div data-testid="profile-loading" className="asv-page-pad pt-4">
          <LoadingSkeleton rows={4} />
        </div>
      </PageShell>
    );
  }

  if (loadError || !profile) {
    return (
      <PageShell className="asv-scroll-page">
        <div data-testid="profile-error" className="asv-page-pad space-y-4 pt-4">
          <h1 className="asv-headline">Could not load profile</h1>
          <p className="asv-subtitle">
            {loadError ?? "We couldn't find your profile. Try signing out and back in."}
          </p>
          <div className="flex gap-2">
            <Button data-testid="profile-retry-btn" onClick={load}>
              Retry
            </Button>
            <Button data-testid="profile-signout-btn" variant="outline" onClick={signOut}>
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
    <PageShell className="asv-scroll-page">
      <div data-testid="profile-page">
        {/* Premium profile hero */}
        <div className="asv-ai-banner mx-[var(--asv-space-page)] mt-2 overflow-hidden p-6">
          <div className="flex items-start justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-white/60">My Profile</p>
            <button
              data-testid="profile-header-signout-btn"
              onClick={signOut}
              className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition-transform active:scale-95"
            >
              <LogOut className="h-3 w-3" /> Sign out
            </button>
          </div>

          <div className="mt-5 flex flex-col items-center text-center">
            <button
              data-testid="profile-avatar-btn"
              onClick={() => fileRef.current?.click()}
              aria-label="Change profile photo"
              className="group relative h-24 w-24 overflow-hidden rounded-full border-4 border-white/30 shadow-[var(--asv-shadow-lg)]"
            >
              {avatarSrc ? (
                <img src={avatarSrc} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white/20 text-3xl font-bold text-white">
                  {(profile.full_name || profile.email || "?").charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 group-active:opacity-100">
                <Camera className="h-6 w-6 text-white" />
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

            <p className="asv-display mt-4 text-xl text-white">
              {profile.full_name || "Add your name"}
            </p>
            <p className="mt-1 text-sm text-white/70">{profile.email}</p>
            {uploading && (
              <p className="mt-2 text-xs text-white/50">Uploading…</p>
            )}
          </div>
        </div>

        {/* Quick nav menu rows */}
        <div className="asv-page-pad mt-5">
          <div className="asv-card overflow-hidden">
            <QuickLink
              to="/trips"
              icon={<Luggage className="h-4 w-4" />}
              label="My Trips"
              description="Saved itineraries"
              testId="quicklink-trips"
            />
            <QuickLink
              to="/favorites"
              icon={<Heart className="h-4 w-4" />}
              label="Favorites"
              description="Saved destinations"
              testId="quicklink-favorites"
            />
            <QuickLink
              to="/history"
              icon={<History className="h-4 w-4" />}
              label="History"
              description="Visa searches"
              testId="quicklink-history"
            />
          </div>
        </div>

        {expiryWarn && (
          <div className="asv-page-pad mt-4">
            <div className="flex items-center gap-3 rounded-[var(--asv-radius-lg)] bg-[var(--asv-warning-soft)] p-4 ring-1 ring-[var(--asv-warning)]/20">
              <AlertTriangle className="h-5 w-5 shrink-0 text-[var(--asv-warning)]" />
              <p className="text-xs font-medium leading-relaxed text-[var(--asv-warning)]">
                Your passport expires in {daysToExpiry} days. Many countries require 6+ months
                validity.
              </p>
            </div>
          </div>
        )}

        <div className="asv-page-pad mt-5 space-y-4 pb-6">
          {/* Account section */}
          <div>
            <p className="asv-overline mb-2 px-1">Account</p>
            <div className="asv-card asv-card-pad space-y-4">
              <Field label="Full name" icon={<User className="h-3.5 w-3.5" />}>
                <Input
                  data-testid="profile-fullname-input"
                  value={profile.full_name || ""}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="rounded-[var(--asv-radius-md)]"
                />
              </Field>
              <Field label="Email" icon={<Mail className="h-3.5 w-3.5" />}>
                <Input
                  data-testid="profile-email-input"
                  value={profile.email || ""}
                  disabled
                  className="rounded-[var(--asv-radius-md)] opacity-60"
                />
              </Field>
            </div>
          </div>

          {/* Passport section */}
          <div>
            <p className="asv-overline mb-2 px-1">Passport details</p>
            <div className="asv-card asv-card-pad space-y-4">
              <Field label="Nationality" icon={<BookUser className="h-3.5 w-3.5" />}>
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
                  className="rounded-[var(--asv-radius-md)]"
                />
              </Field>
              <Field label="Passport expiry">
                <Input
                  data-testid="profile-passport-expiry-input"
                  type="date"
                  value={profile.passport_expiry || ""}
                  onChange={(e) => setProfile({ ...profile, passport_expiry: e.target.value })}
                  className="rounded-[var(--asv-radius-md)]"
                />
              </Field>
            </div>
          </div>

          <Button
            data-testid="profile-save-btn"
            onClick={save}
            disabled={busy}
            className="h-12 w-full text-sm font-semibold"
          >
            {busy ? "Saving…" : "Save profile"}
          </Button>

          <Link
            data-testid="profile-settings-link"
            to="/settings"
            className="asv-row asv-card !rounded-[var(--asv-radius-lg)] !px-4"
          >
            <span className="asv-row-icon !h-10 !w-10 shrink-0">
              <SettingsIcon className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">Settings & notifications</span>
              <span className="block text-[11px] text-[var(--asv-ink-tertiary)]">
                Theme, language, alerts
              </span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-[var(--asv-ink-tertiary)]" />
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
      <label className="asv-label mb-2 flex items-center gap-1.5">
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
  description,
  testId,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  testId?: string;
}) {
  return (
    <Link
      to={to as never}
      data-testid={testId}
      className="asv-row !px-4 transition-colors hover:bg-[var(--asv-canvas)]"
    >
      <span className="asv-row-icon !h-10 !w-10 shrink-0">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-[var(--asv-ink)]">{label}</span>
        <span className="block text-[11px] text-[var(--asv-ink-tertiary)]">{description}</span>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-[var(--asv-ink-tertiary)]" />
    </Link>
  );
}
