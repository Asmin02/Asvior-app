import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — VisaPilot" },
      { name: "description", content: "Theme, language, currency, and notification preferences." },
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
  const [s, setS] = useState<Settings>(DEFAULT);
  const [userId, setUserId] = useState<string | null>(null);

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

  return (
    <div className="px-5 pt-8 pb-6">
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {userId ? "Synced to your account." : "Sign in to sync across devices."}
      </p>

      <div className="mt-6 space-y-3">
        <Card className="ring-1 ring-border">
          <CardContent className="p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Appearance</p>
            <Row label="Dark Mode" hint="Easier on the eyes at night.">
              <Switch checked={s.dark_mode} onCheckedChange={(v) => update({ dark_mode: v })} />
            </Row>
          </CardContent>
        </Card>

        <Card className="ring-1 ring-border">
          <CardContent className="space-y-3 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Preferences</p>
            <Select label="Language" value={s.language} onChange={(v) => update({ language: v })} options={LANGUAGES.map((l) => [l.code, l.label] as const)} />
            <Select label="Currency" value={s.currency} onChange={(v) => update({ currency: v })} options={CURRENCIES.map((c) => [c, c] as const)} />
          </CardContent>
        </Card>

        <Card className="ring-1 ring-border">
          <CardContent className="p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Notifications</p>
            <Row label="Passport expiry reminders" hint="Warn me before my passport expires.">
              <Switch checked={s.notify_passport_expiry} onCheckedChange={(v) => update({ notify_passport_expiry: v })} />
            </Row>
            <Row label="Visa reminders" hint="Remind me about visa application status.">
              <Switch checked={s.notify_visa} onCheckedChange={(v) => update({ notify_visa: v })} />
            </Row>
            <Row label="Flight reminders" hint="Heads-up before departure.">
              <Switch checked={s.notify_flight} onCheckedChange={(v) => update({ notify_flight: v })} />
            </Row>
            <Row label="Packing reminders" hint="Nudge me to finish my checklist.">
              <Switch checked={s.notify_packing} onCheckedChange={(v) => update({ notify_packing: v })} />
            </Row>
          </CardContent>
        </Card>

        <Card className="ring-1 ring-border">
          <CardContent className="p-4">
            <p className="text-sm font-semibold text-foreground">About</p>
            <p className="mt-1 text-xs text-muted-foreground">VisaPilot v2.0 — premium travel & visa assistant.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </div>
  );
}
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: ReadonlyArray<readonly [string, string]> }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring">
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );
}
