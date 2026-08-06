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
import { PageBadge, PageHeader, PageShell } from "@/components/PageShell";
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
import {
  applyAppearancePreferences,
  cacheAppearancePreferences,
  cacheGuestAppearancePreferences,
  DEFAULT_CURRENCY,
  DEFAULT_LANGUAGE,
  readGuestAppearancePreferences,
} from "@/lib/app-session";
import { APP_VERSION, SUPPORT_EMAIL } from "@/lib/app-info";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Asvior" },
      {
        name: "description",
        content: "Theme, language, currency, notifications, privacy, and account options.",
      },
    ],
  }),
  component: SettingsPage,
});

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "pt", label: "Português" },
  { code: "ar", label: "العربية" },
  { code: "hi", label: "हिन्दी" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
];
const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "INR", "AED", "CNY", "BRL", "AUD", "CAD"];

interface Settings {
  dark_mode: boolean;
  language: string;
  currency: string;
  notify_passport_expiry: boolean;
  notify_visa: boolean;
  notify_flight: boolean;
  notify_packing: boolean;
}

const DEFAULT: Settings = {
  dark_mode: false,
  language: "en",
  currency: "USD",
  notify_passport_expiry: true,
  notify_visa: true,
  notify_flight: true,
  notify_packing: true,
};

function SettingsPage() {
  const navigate = useNavigate();
  const [s, setS] = useState<Settings>(DEFAULT);
  const [userId, setUserId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const uid = data.session?.user?.id ?? null;
      setUserId(uid);

      if (uid) {
        const { data: row } = await supabase
          .from("user_settings")
          .select("*")
          .eq("user_id", uid)
          .maybeSingle();
        if (row) {
          setS({
            dark_mode: row.dark_mode,
            language: row.language,
            currency: row.currency,
            notify_passport_expiry: row.notify_passport_expiry,
            notify_visa: row.notify_visa,
            notify_flight: row.notify_flight,
            notify_packing: row.notify_packing,
          });
          const preferences = {
            darkMode: row.dark_mode,
            language: row.language,
            currency: row.currency || DEFAULT_CURRENCY,
          };
          applyAppearancePreferences(preferences);
          cacheAppearancePreferences(preferences);
          return;
        }
      }

      const guestAppearance = readGuestAppearancePreferences();
      setS({
        ...DEFAULT,
        dark_mode: guestAppearance.darkMode,
        language: guestAppearance.language || DEFAULT_LANGUAGE,
        currency: guestAppearance.currency || DEFAULT_CURRENCY,
      });
      applyAppearancePreferences({
        darkMode: guestAppearance.darkMode,
        language: guestAppearance.language || DEFAULT_LANGUAGE,
      });
      cacheAppearancePreferences({
        darkMode: guestAppearance.darkMode,
        language: guestAppearance.language || DEFAULT_LANGUAGE,
        currency: guestAppearance.currency || DEFAULT_CURRENCY,
      });
    })();
  }, []);

  const update = async (patch: Partial<Settings>) => {
    const next = { ...s, ...patch };
    setS(next);

    if ("dark_mode" in patch) {
      applyAppearancePreferences({ darkMode: next.dark_mode, language: next.language });
    }
    if ("language" in patch) {
      applyAppearancePreferences({ darkMode: next.dark_mode, language: next.language });
    }

    cacheAppearancePreferences({
      darkMode: next.dark_mode,
      language: next.language,
      currency: next.currency,
    });

    if (!userId) {
      cacheGuestAppearancePreferences({
        darkMode: next.dark_mode,
        language: next.language,
        currency: next.currency,
      });
    }

    if (userId) {
      await supabase.from("user_settings").upsert({ user_id: userId, ...next });
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      await supabase.auth.signOut();
      toast.success("Your account has been deleted");
      navigate({ to: "/" });
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Couldn't delete your account. Please try again.",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <PageShell className="pb-6">
      <PageHeader
        badge={
          <PageBadge icon={<Palette className="h-3.5 w-3.5" />}>
            {userId ? "Synced to your account" : "Local device"}
          </PageBadge>
        }
        title="Settings"
        subtitle="Personalize your Asvior experience."
      />

      <section className="mt-6 space-y-3 px-4 pb-6">
        <SettingsCard icon={<Moon className="h-4 w-4" />} title="Appearance" delay={0}>
          <Row label="Dark mode" hint="Easier on the eyes at night.">
            <Switch
              checked={s.dark_mode}
              onCheckedChange={(v) => update({ dark_mode: v })}
              aria-label="Toggle dark mode"
            />
          </Row>
        </SettingsCard>

        <SettingsCard icon={<Languages className="h-4 w-4" />} title="Preferences" delay={60}>
          <Select
            label="Language"
            value={s.language}
            onChange={(v) => update({ language: v })}
            options={LANGUAGES.map((l) => [l.code, l.label] as const)}
          />
          <div className="mt-3">
            <Select
              label="Currency"
              icon={<DollarSign className="h-3.5 w-3.5" />}
              value={s.currency}
              onChange={(v) => update({ currency: v })}
              options={CURRENCIES.map((c) => [c, c] as const)}
            />
          </div>
        </SettingsCard>

        <SettingsCard icon={<Bell className="h-4 w-4" />} title="Notifications" delay={120}>
          <Row label="Passport expiry" hint="Warn me before my passport expires.">
            <Switch
              checked={s.notify_passport_expiry}
              onCheckedChange={(v) => update({ notify_passport_expiry: v })}
              aria-label="Toggle passport expiry notifications"
            />
          </Row>
          <Row label="Visa updates" hint="Application status reminders.">
            <Switch
              checked={s.notify_visa}
              onCheckedChange={(v) => update({ notify_visa: v })}
              aria-label="Toggle visa update notifications"
            />
          </Row>
          <Row label="Flights" hint="Heads-up before departure.">
            <Switch
              checked={s.notify_flight}
              onCheckedChange={(v) => update({ notify_flight: v })}
              aria-label="Toggle flight notifications"
            />
          </Row>
          <Row label="Packing" hint="Finish your checklist on time.">
            <Switch
              checked={s.notify_packing}
              onCheckedChange={(v) => update({ notify_packing: v })}
              aria-label="Toggle packing notifications"
            />
          </Row>
        </SettingsCard>

        <SettingsCard icon={<Info className="h-4 w-4" />} title="Support & Legal" delay={180}>
          <div className="divide-y divide-border/60">
            <LinkRow to="/about" icon={<Plane className="h-4 w-4" />} label="About Asvior" />
            <LinkRow to="/contact" icon={<Mail className="h-4 w-4" />} label="Contact" />
            <LinkRow to="/support" icon={<Info className="h-4 w-4" />} label="Support" />
            <LinkRow
              to="/privacy"
              icon={<ShieldCheck className="h-4 w-4" />}
              label="Privacy Policy"
            />
            <LinkRow to="/terms" icon={<FileText className="h-4 w-4" />} label="Terms of Service" />
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=Asvior%20Support`}
              className="flex min-h-11 items-center justify-between gap-3 py-3 text-sm font-semibold text-foreground transition-colors hover:text-primary"
            >
              <span className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary text-navy">
                  <Mail className="h-4 w-4" />
                </span>
                Contact support
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </a>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Asvior v{APP_VERSION} · Travel Smarter. Explore Further.
          </p>
        </SettingsCard>

        {userId && (
          <SettingsCard icon={<Trash2 className="h-4 w-4" />} title="Account" delay={240}>
            <div className="rounded-2xl bg-destructive/5 p-4 ring-1 ring-destructive/10">
              <p className="text-xs leading-relaxed text-muted-foreground">
                Permanently delete your account, profile, trips, favorites, and search history.
                This cannot be undone.
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
              <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently removes your profile, saved trips, favorites, visa history, and
                    settings. This action cannot be undone.
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
            </div>
          </SettingsCard>
        )}
      </section>
    </PageShell>
  );
}

function SettingsCard({
  icon,
  title,
  children,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <div
      className="premium-card animate-fade-in rounded-3xl p-5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-secondary text-navy">
          {icon}
        </span>
        {title}
      </p>
      {children}
    </div>
  );
}

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
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
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary text-navy">
          {icon}
        </span>
        {label}
      </span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: ReadonlyArray<readonly [string, string]>;
  icon?: React.ReactNode;
}) {
  const id = useId();
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground"
      >
        {icon}
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-11 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground outline-none transition-all focus:ring-2 focus:ring-navy/20"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </div>
  );
}
