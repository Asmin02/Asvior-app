import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { CountryCombobox, type CountryOption } from "@/components/CountryCombobox";
import { VISA_CODES } from "@/data/visa-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "My Profile — VisaPilot" }] }),
  component: ProfilePage,
});

function getCountryName(code: string): string {
  try { return new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code; } catch { return code; }
}
const COUNTRY_OPTIONS: CountryOption[] = VISA_CODES
  .map((c) => ({ code: c, name: getCountryName(c) }))
  .sort((a, b) => a.name.localeCompare(b.name));

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

function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { data } = await supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle();
    if (data) {
      setProfile(data as Profile);
      if (data.photo_url) {
        const { data: signed } = await supabase.storage.from("avatars").createSignedUrl(data.photo_url, 3600);
        setAvatarSrc(signed?.signedUrl ?? null);
      }
    }
  };

  const save = async () => {
    if (!profile) return;
    setBusy(true);
    const { error } = await supabase.from("profiles").update({
      full_name: profile.full_name,
      nationality: profile.nationality,
      passport_country: profile.passport_country,
      passport_number: profile.passport_number,
      passport_expiry: profile.passport_expiry,
    }).eq("id", profile.id);
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Profile saved");
  };

  const uploadAvatar = async (file: File) => {
    if (!profile) return;
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${profile.id}/avatar.${ext}`;
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type });
    if (upErr) { toast.error(upErr.message); setUploading(false); return; }
    await supabase.from("profiles").update({ photo_url: path }).eq("id", profile.id);
    const { data: signed } = await supabase.storage.from("avatars").createSignedUrl(path, 3600);
    setAvatarSrc(signed?.signedUrl ?? null);
    setProfile({ ...profile, photo_url: path });
    setUploading(false);
    toast.success("Photo updated");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  if (!profile) return <div className="px-5 pt-10 text-sm text-muted-foreground">Loading…</div>;

  const expiryDate = profile.passport_expiry ? new Date(profile.passport_expiry) : null;
  const daysToExpiry = expiryDate ? Math.ceil((expiryDate.getTime() - Date.now()) / 86400000) : null;
  const expiryWarn = daysToExpiry !== null && daysToExpiry < 180;

  return (
    <div className="pb-6">
      {/* Premium gradient header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-travel-blue via-travel-blue-dark to-[oklch(0.25_0.1_260)] px-5 pb-16 pt-10 text-white">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_30%,white_1px,transparent_1px),radial-gradient(circle_at_80%_70%,white_1px,transparent_1px)] [background-size:60px_60px]" />
        <div className="relative flex items-center justify-between">
          <h1 className="text-lg font-semibold">My Profile</h1>
          <button onClick={signOut} className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm hover:bg-white/20">
            Sign out
          </button>
        </div>
        <div className="relative mt-6 flex items-center gap-4">
          <button
            onClick={() => fileRef.current?.click()}
            className="group relative h-20 w-20 overflow-hidden rounded-full ring-4 ring-white/30 transition-transform active:scale-95"
          >
            {avatarSrc ? (
              <img src={avatarSrc} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-white/20 text-2xl font-bold">
                {(profile.full_name || profile.email || "?").charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <CameraIcon className="h-5 w-5" />
            </div>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAvatar(f); }}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-bold">{profile.full_name || "Add your name"}</p>
            <p className="truncate text-xs opacity-80">{profile.email}</p>
            {uploading && <p className="text-[10px] opacity-70">Uploading…</p>}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="-mt-10 px-5">
        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-card p-3 shadow-lg ring-1 ring-border">
          <QuickLink to="/_authenticated/trips" icon={<SuitcaseIcon className="h-5 w-5" />} label="Trips" />
          <QuickLink to="/_authenticated/favorites" icon={<HeartIcon className="h-5 w-5" />} label="Favorites" />
          <QuickLink to="/_authenticated/history" icon={<HistoryIcon className="h-5 w-5" />} label="History" />
        </div>
      </div>

      {/* Expiry alert */}
      {expiryWarn && (
        <div className="mx-5 mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-900/60">
          ⚠ Your passport expires in {daysToExpiry} days. Many countries require 6+ months validity.
        </div>
      )}

      {/* Form */}
      <div className="mt-5 space-y-3 px-5">
        <Card className="ring-1 ring-border">
          <CardContent className="space-y-3 p-4">
            <Field label="Full name">
              <Input value={profile.full_name || ""} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
            </Field>
            <Field label="Email"><Input value={profile.email || ""} disabled /></Field>
          </CardContent>
        </Card>

        <Card className="ring-1 ring-border">
          <CardContent className="space-y-3 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Passport</p>
            <Field label="Nationality">
              <CountryCombobox value={profile.nationality || ""} onChange={(v) => setProfile({ ...profile, nationality: v })} options={COUNTRY_OPTIONS} placeholder="Select nationality..." />
            </Field>
            <Field label="Passport country">
              <CountryCombobox value={profile.passport_country || ""} onChange={(v) => setProfile({ ...profile, passport_country: v })} options={COUNTRY_OPTIONS} placeholder="Select passport country..." />
            </Field>
            <Field label="Passport number (optional)">
              <Input value={profile.passport_number || ""} onChange={(e) => setProfile({ ...profile, passport_number: e.target.value })} placeholder="••••••••" />
            </Field>
            <Field label="Passport expiry">
              <Input type="date" value={profile.passport_expiry || ""} onChange={(e) => setProfile({ ...profile, passport_expiry: e.target.value })} />
            </Field>
          </CardContent>
        </Card>

        <Button onClick={save} disabled={busy} className="w-full py-5 font-semibold">
          {busy ? "Saving…" : "Save profile"}
        </Button>

        <Link to="/settings" className="block rounded-xl bg-card p-4 text-center text-sm font-medium ring-1 ring-border hover:bg-muted">
          ⚙️ Settings & Notifications
        </Link>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

function QuickLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link to={to as any} className="flex flex-col items-center gap-1 rounded-xl p-3 transition-colors hover:bg-muted">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-travel-sky text-travel-blue-dark">{icon}</div>
      <span className="text-[11px] font-medium text-foreground">{label}</span>
    </Link>
  );
}

function CameraIcon({ className }: { className?: string }) { return <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>; }
function SuitcaseIcon({ className }: { className?: string }) { return <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>; }
function HeartIcon({ className }: { className?: string }) { return <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>; }
function HistoryIcon({ className }: { className?: string }) { return <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
