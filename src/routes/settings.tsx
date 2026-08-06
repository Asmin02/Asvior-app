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
  Sun,
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
import { notifyCurrencyChanged } from "@/lib/currency";
import { notifyLanguageChanged, useT } from "@/lib/i18n";
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

const SETTINGS_SWITCH_CLASS =
  "h-7 w-12 data-[state=checked]:bg-primary [&>span]:h-6 [&>span]:w-6 [&>span]:data-[state=checked]:translate-x-5";

function SettingsPage() {
  const navigate = useNavigate();
  const t = useT();
  const [s, setS] = useState<Settings>(DEFAULT);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const uid = data.session?.user?.id ?? null;
      setUserId(uid);
      if (data.session?.user) {
        const user = data.session.user;
        setUserEmail(user.email ?? null);
        const meta = user.user_metadata as { full_name?: string; name?: string } | undefined;
        setUserName(meta?.full_name || meta?.name || user.email?.split("@")[0] || null);
      } else {
        setUserEmail(null);
        setUserName(null);
      }

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

    applyAppearancePreferences({ darkMode: next.dark_mode, language: next.language });

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

    if ("language" in patch) {
      notifyLanguageChanged(next.language);
      toast.success(t("settings.saved"));
    }
    if ("currency" in patch) {
      notifyCurrencyChanged(next.currency);
      toast.success(t("settings.saved"));
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
    <PageShell className="asv-scroll-page">
      <PageHeader
        badge={
          <PageBadge icon={<Palette className="h-3.5 w-3.5" />}>
            {userId ? t("settings.synced") : t("settings.local")}
          </PageBadge>
        }
        title={t("settings.title")}
        subtitle={t("settings.subtitle")}
      />

      <div className="asv-page-pad mt-2 space-y-6 pb-6">
        {userId && (userName || userEmail) && (
          <div className="asv-settings-profile">
            <div className="asv-settings-avatar">
              <img src="/asvior-mark.png" alt="" className="h-7 w-7" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="asv-title truncate">{userName ?? "Traveler"}</p>
              <p className="asv-subtitle mt-0.5 truncate">{userEmail}</p>
            </div>
            <Link to="/profile" className="asv-btn asv-btn-secondary asv-btn-sm shrink-0">
              Profile
            </Link>
          </div>
        )}

        {/* Appearance */}
        <SettingsGroup overline={t("settings.appearance")}>
          <div className="asv-card overflow-hidden">
            <ToggleRow
              icon={s.dark_mode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              label={t("settings.darkMode")}
              hint={t("settings.darkHint")}
            >
              <Switch
                checked={s.dark_mode}
                onCheckedChange={(v) => update({ dark_mode: v })}
                aria-label="Toggle dark mode"
                className={SETTINGS_SWITCH_CLASS}
              />
            </ToggleRow>
          </div>
        </SettingsGroup>

        {/* Preferences */}
        <SettingsGroup overline={t("settings.preferences")}>
          <div className="asv-card asv-card-pad space-y-4">
            <Select
              label={t("settings.language")}
              icon={<Languages className="h-3.5 w-3.5" />}
              value={s.language}
              onChange={(v) => update({ language: v })}
              options={LANGUAGES.map((l) => [l.code, l.label] as const)}
            />
            <Select
              label={t("settings.currency")}
              icon={<DollarSign className="h-3.5 w-3.5" />}
              value={s.currency}
              onChange={(v) => update({ currency: v })}
              options={CURRENCIES.map((c) => [c, c] as const)}
            />
          </div>
        </SettingsGroup>

        {/* Notifications */}
        <SettingsGroup overline={t("settings.notifications")}>
          <div className="asv-card overflow-hidden">
            <ToggleRow
              icon={<Bell className="h-4 w-4" />}
              label="Passport expiry"
              hint="Warn me before my passport expires."
            >
              <Switch
                checked={s.notify_passport_expiry}
                onCheckedChange={(v) => update({ notify_passport_expiry: v })}
                aria-label="Toggle passport expiry notifications"
                className={SETTINGS_SWITCH_CLASS}
              />
            </ToggleRow>
            <ToggleRow label="Visa updates" hint="Application status reminders.">
              <Switch
                checked={s.notify_visa}
                onCheckedChange={(v) => update({ notify_visa: v })}
                aria-label="Toggle visa update notifications"
                className={SETTINGS_SWITCH_CLASS}
              />
            </ToggleRow>
            <ToggleRow label="Flights" hint="Heads-up before departure.">
              <Switch
                checked={s.notify_flight}
                onCheckedChange={(v) => update({ notify_flight: v })}
                aria-label="Toggle flight notifications"
                className={SETTINGS_SWITCH_CLASS}
              />
            </ToggleRow>
            <ToggleRow label="Packing" hint="Finish your checklist on time.">
              <Switch
                checked={s.notify_packing}
                onCheckedChange={(v) => update({ notify_packing: v })}
                aria-label="Toggle packing notifications"
                className={SETTINGS_SWITCH_CLASS}
              />
            </ToggleRow>
          </div>
        </SettingsGroup>

        {/* Support & Legal */}
        <SettingsGroup overline="Support & Legal">
          <div className="asv-card overflow-hidden">
            <LinkRow to="/about" icon={<Plane className="h-4 w-4" />} label="About Asvior" />
            <LinkRow to="/contact" icon={<Mail className="h-4 w-4" />} label="Contact" />
            <LinkRow to="/support" icon={<Info className="h-4 w-4" />} label="Support" />
            <LinkRow
              to="/privacy"
              icon={<ShieldCheck className="h-4 w-4" />}
              label="Privacy Policy"
            />
            <LinkRow to="/terms" icon={<FileText className="h-4 w-4" />} label="Terms of Service" />
            <a href={`mailto:${SUPPORT_EMAIL}?subject=Asvior%20Support`} className="asv-row !px-4">
              <span className="asv-row-icon !h-10 !w-10 shrink-0">
                <Mail className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1 text-sm font-semibold">Contact support</span>
              <ChevronRight className="h-4 w-4 shrink-0 text-[var(--asv-ink-tertiary)]" />
            </a>
          </div>
          <p className="mt-2 px-1 text-[11px] text-[var(--asv-ink-tertiary)]">
            Asvior v{APP_VERSION} · Travel Smarter. Explore Further.
          </p>
        </SettingsGroup>

        {/* Account deletion */}
        {userId && (
          <SettingsGroup overline="Account">
            <div className="asv-card asv-card-pad">
              <p className="text-xs leading-relaxed text-[var(--asv-ink-secondary)]">
                Permanently delete your account, profile, trips, favorites, and search history. This
                cannot be undone.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    disabled={deleting}
                    className="asv-btn mt-4 w-full bg-[var(--asv-danger-soft)] text-[var(--asv-danger)] disabled:opacity-60"
                  >
                    <Trash2 className="h-4 w-4" />
                    {deleting ? "Deleting account…" : "Delete account"}
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-[var(--asv-radius-lg)]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This permanently removes your profile, saved trips, favorites, visa history, and
                      settings. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-[var(--asv-radius-md)]">
                      Keep my account
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="rounded-[var(--asv-radius-md)] bg-[var(--asv-danger)] text-white hover:bg-[var(--asv-danger)]/90"
                    >
                      Delete permanently
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </SettingsGroup>
        )}
      </div>
    </PageShell>
  );
}

function SettingsGroup({
  overline,
  children,
}: {
  overline: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <p className="asv-overline mb-2 px-1">{overline}</p>
      {children}
    </section>
  );
}

function ToggleRow({
  icon,
  label,
  hint,
  children,
}: {
  icon?: React.ReactNode;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[3.5rem] items-center justify-between gap-3 border-b border-[var(--asv-divider)] px-4 py-3 last:border-b-0">
      <div className="flex min-w-0 items-center gap-3">
        {icon && (
          <span className="asv-row-icon !h-9 !w-9 shrink-0">{icon}</span>
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--asv-ink)]">{label}</p>
          {hint && <p className="text-[11px] text-[var(--asv-ink-tertiary)]">{hint}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function LinkRow({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link to={to} className="asv-row !px-4">
      <span className="asv-row-icon !h-10 !w-10 shrink-0">{icon}</span>
      <span className="min-w-0 flex-1 text-sm font-semibold">{label}</span>
      <ChevronRight className="h-4 w-4 shrink-0 text-[var(--asv-ink-tertiary)]" />
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
      <label htmlFor={id} className="asv-label mb-2 flex items-center gap-1.5">
        {icon}
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="asv-input font-semibold"
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
