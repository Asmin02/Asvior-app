import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_LANGUAGE } from "@/lib/app-session";
import {
  RTL_LANGS,
  TRANSLATIONS,
  type LangCode,
} from "@/lib/i18n/translations";

export const LANGUAGE_CHANGE_EVENT = "asvior:language-change";

function normalizeLang(code?: string | null): LangCode {
  const value = (code || DEFAULT_LANGUAGE).toLowerCase() as LangCode;
  return value in TRANSLATIONS ? value : "en";
}

export function getPreferredLanguage(): LangCode {
  if (typeof localStorage === "undefined") return "en";
  try {
    return normalizeLang(localStorage.getItem("vp_lang"));
  } catch {
    return "en";
  }
}

export function translate(key: string, lang = getPreferredLanguage()): string {
  return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key;
}

export function notifyLanguageChanged(language: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(LANGUAGE_CHANGE_EVENT, { detail: { language: normalizeLang(language) } }),
  );
}

type I18nContextValue = {
  language: LangCode;
  t: (key: string) => string;
  isRtl: boolean;
};

const I18nContext = createContext<I18nContextValue>({
  language: "en",
  t: (key) => translate(key, "en"),
  isRtl: false,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LangCode>("en");

  useEffect(() => {
    const apply = (next: LangCode) => {
      setLanguage(next);
      document.documentElement.setAttribute("lang", next);
      document.documentElement.setAttribute("dir", RTL_LANGS.has(next) ? "rtl" : "ltr");
    };

    apply(getPreferredLanguage());

    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<{ language?: string }>).detail;
      apply(normalizeLang(detail?.language || getPreferredLanguage()));
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === "vp_lang") apply(getPreferredLanguage());
    };

    window.addEventListener(LANGUAGE_CHANGE_EVENT, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(LANGUAGE_CHANGE_EVENT, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const t = useCallback((key: string) => translate(key, language), [language]);

  const value = useMemo(
    () => ({
      language,
      t,
      isRtl: RTL_LANGS.has(language),
    }),
    [language, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

export function useT() {
  return useI18n().t;
}
