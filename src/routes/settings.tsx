import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — VisaPilot" },
      { name: "description", content: "Customize VisaPilot — dark mode and language preferences." },
      { property: "og:title", content: "Settings — VisaPilot" },
      { property: "og:description", content: "Customize VisaPilot — dark mode and language preferences." },
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

function SettingsPage() {
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const storedTheme = localStorage.getItem("vp_theme");
    const storedLang = localStorage.getItem("vp_lang") || "en";
    const isDark = storedTheme === "dark";
    setDark(isDark);
    setLang(storedLang);
  }, []);

  const toggleDark = (next: boolean) => {
    setDark(next);
    localStorage.setItem("vp_theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };

  const changeLang = (code: string) => {
    setLang(code);
    localStorage.setItem("vp_lang", code);
    document.documentElement.setAttribute("lang", code);
  };

  return (
    <div className="px-5 pt-8 pb-6">
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Personalize your VisaPilot experience.
      </p>

      <div className="mt-6 space-y-3">
        <Card className="ring-1 ring-border">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Dark Mode</p>
              <p className="text-xs text-muted-foreground">Easier on the eyes at night.</p>
            </div>
            <Switch checked={dark} onCheckedChange={toggleDark} />
          </CardContent>
        </Card>

        <Card className="ring-1 ring-border">
          <CardContent className="p-4">
            <p className="text-sm font-semibold text-foreground">Language</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Pick your preferred language for future content.
            </p>
            <select
              value={lang}
              onChange={(e) => changeLang(e.target.value)}
              className="mt-3 w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        <Card className="ring-1 ring-border">
          <CardContent className="p-4">
            <p className="text-sm font-semibold text-foreground">About</p>
            <p className="mt-1 text-xs text-muted-foreground">
              VisaPilot v1.1 — Your travel & visa assistant. Built for fast, mobile-first planning.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
