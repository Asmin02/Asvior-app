import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useId, useState } from "react";
import {
  Moon,
  Languages,
  DollarSign,
  Bell,
  Info,
  Palette,
  ShieldCheck,
  FileText,
  Mail,
  ChevronRight,
  Trash2,
  Plane,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { deleteAccount } from "@/lib/account.functions";
import { APP_VERSION, SUPPORT_EMAIL } from "@/lib/app-info";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Asvior" },
      { name: "description", content: "Theme, language, currency, notifications, privacy, and account options." },
    ],
  }),
  component: SettingsPage,
});

const LANGUAGES = [
  { code: "en", label: "English" }, { code: "es", label: "Español" }, { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" }, { code: "pt", label: "Português" }, { code: "ar", label: "العربية" },
  { code: "hi", label: "हिन्दी" }, { code: "zh", label: "中文" }, { code: "ja", label: "日本語" },
];
const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "INR", "AED", "CNY", "BRL", "AUD", "CAD"];

interface Settings {
  dark_mode: boolean; language: string; currency: string;
  notify_passport_expiry: boolean; notify_visa: boolean; notify_flight: boolean; notify_packing: boolean;
}

const DEFAULT: Settings = {
  dark_mode: false, language: "en", currency: "USD",
  notify_passport_expiry: true, notify_visa: true, notify_flight: true, notify_packing: true,
};

function SettingsPage() {
  const navigate = useNavigate();
  const [s, setS] = useState<Settings>(DEFAULT);
  const [userId, setUserId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const uid = data.user?.id ?? null;
      setUserId(uid);
      if (uid) {
        const { data: row } = await supabase.from("user_settings").select("*").eq("user_id", uid).maybeSingle();
        if (row) {
          setS({
            dark_mode: row.dark_mode, language: row.language, currency: row.currency,
            notify_passport_expiry: row.notify_passport_expiry, notify_visa: row.notify_visa,
            notify_flight: row.notify_flight, notify_packing: row.notify_packing,
          });
          document.documentElement.classList.toggle("dark", row.dark_mode);
          document.documentElement.setAttribute("lang", row.language);
          localStorage.setItem("vp_theme", row.dark_mode ? "dark" : "light");
          localStorage.setItem("vp_lang", row.language);
          localStorage.setItem("vp_currency", row.currency);
        }
      } else {
        const dark = localStorage.getItem("vp_theme") === "dark";
        const lang = localStorage.getItem("vp_lang") || "en";
        const ccy = localStorage.getItem("vp_currency") || "USD";
        setS({ ...DEFAULT, dark_mode: dark, language: lang, currency: ccy });
      }
    })();
  }, []);

  const update = async (patch: Partial<Settings>) => {
    const next = { ...s, ...patch };
    setS(next);
    if ("dark_mode" in patch) {
      document.documentElement.classList.toggle("dark", next.dark_mode);
      localStorage.setItem("vp_theme", next.dark_mode ? "dark" : "light");
    }
    if ("language" in patch) {
      document.documentElement.setAttribute("lang", next.language);
      localStorage.setItem("vp_lang", next.language);
    }
    if ("currency" in patch) localStorage.setItem("vp_currency", next.currency);
    if (userId) await supabase.from("user_settings").upsert({ user_id: userId, ...next });
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      await supabase.auth.signOut();
      try {
        localStorage.removeItem("vp_ai_chat_v1");
      } catch {}
      toast.success("Your account has been deleted");
      navigate({ to: "/" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't delete your account. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 gradient-hero-bg" aria-hidden />

      <header className="relative px-6 pt-10">
        <div className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold text-primary">
          <Palette className="h-3.5 w-3.5" /> {userId ? "Synced to your account" : "Local device"}
        </div>
        <h1 className="mt-3 text-display text-3xl text-foreground">Settings</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Personalize your Asvior experience.</p>
      </header>

      <section className="relative mt-6 space-y-3 px-6 pb-6">
        <SettingsCard icon={<Moon className="h-4 w-4" />} title="Appearance">
          <Row label="Dark mode" hint="Easier on the eyes at night.">
            <Switch checked={s.dark_mode} onCheckedChange={(v) => update({ dark_mode: v })} aria-label="Toggle dark mode" />
          </Row>
        </SettingsCard>

        <SettingsCard icon={<Languages className="h-4 w-4" />} title="Preferences">
          <Select label="Language" value={s.language} onChange={(v) => update({ language: v })} options={LANGUAGES.map((l) => [l.code, l.label] as const)} />
          <div className="mt-3">
            <Select label="Currency" icon={<DollarSign className="h-3.5 w-3.5" />} value={s.currency} onChange={(v) => update({ currency: v })} options={CURRENCIES.map((c) => [c, c] as const)} />
          </div>
        </SettingsCard>

        <SettingsCard icon={<Bell className="h-4 w-4" />} title="Notifications">
          <Row label="Passport expiry" hint="Warn me before my passport expires.">
            <Switch checked={s.notify_passport_expiry} onCheckedChange={(v) => update({ notify_passport_expiry: v })} aria-label="Toggle passport expiry notifications" />
          </Row>
          <Row label="Visa updates" hint="Application status reminders.">
            <Switch checked={s.notify_visa} onCheckedChange={(v) => update({ notify_visa: v })} aria-label="Toggle visa update notifications" />
          </Row>
          <Row label="Flights" hint="Heads-up before departure.">
            <Switch checked={s.notify_flight} onCheckedChange={(v) => update({ notify_flight: v })} aria-label="Toggle flight notifications" />
          </Row>
          <Row label="Packing" hint="Finish your checklist on time.">
            <Switch checked={s.notify_packing} onCheckedChange={(v) => update({ notify_packing: v })} aria-label="Toggle packing notifications" />
          </Row>
        </SettingsCard>

        <SettingsCard icon={<Info className="h-4 w-4" />} title="Support & Legal">
          <div className="divide-y divide-border/60">
            <LinkRow to="/about" icon={<Plane className="h-4 w-4" />} label="About Asvior" />
            <LinkRow to="/privacy" icon={<ShieldCheck className="h-4 w-4" />} label="Privacy Policy" />
            <LinkRow to="/terms" icon={<FileText className="h-4 w-4" />} label="Terms of Service" />
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=Asvior%20Support`}
              className="flex min-h-11 items-center justify-between gap-3 py-3 text-sm font-semibold text-foreground transition-colors hover:text-primary"
            >
              <span className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Mail className="h-4 w-4" />
                </span>
                Contact support
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </a>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">Asvior v{APP_VERSION} · Travel Smarter. Explore Further.</p>
        </SettingsCard>

        {userId && (
          <SettingsCard icon={<Trash2 className="h-4 w-4" />} title="Account">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Permanently delete your account, profile, trips, favorites, and search history. This cannot be undone.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  disabled={deleting}
                  className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive transition-transform active:scale-[0.98] disabled:opacity-60"
                >
                  <Trash2 className="h-4 w-4" />
                  {deleting ? "Deleting account…" : "Delete account"}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-3xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently removes your profile, saved trips, favorites, visa history, and settings.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-2xl">Keep my account</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="rounded-2xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete permanently
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SettingsCard>
        )}
      </section>
    </div>
  );
}

function SettingsCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-3xl p-5">
      <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</span>
        {title}
      </p>
      {children}
    </div>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-11 items-center justify-between gap-3 py-2.5">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function LinkRow({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="flex min-h-11 items-center justify-between gap-3 py-3 text-sm font-semibold text-foreground transition-colors hover:text-primary"
    >
      <span className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</span>
        {label}
      </span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}

function Select({ label, value, onChange, options, icon }: { label: string; value: string; onChange: (v: string) => void; options: ReadonlyArray<readonly [string, string]>; icon?: React.ReactNode }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
        {icon}{label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-11 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground outline-none transition-all focus:ring-2 focus:ring-primary/40"
      >
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );
}
