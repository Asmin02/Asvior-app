export const DEFAULT_THEME = "light";
export const DEFAULT_LANGUAGE = "en";
export const DEFAULT_CURRENCY = "USD";

const APPEARANCE_KEYS = {
  theme: "vp_theme",
  language: "vp_lang",
  currency: "vp_currency",
} as const;

const SESSION_LOCAL_KEYS = [
  APPEARANCE_KEYS.theme,
  APPEARANCE_KEYS.language,
  APPEARANCE_KEYS.currency,
  "vp_ai_chat_v1",
  "vp_ai_bookmarks_v1",
  "vp_ai_doc_checklists_v1",
  "vp_ai_ratings_v1",
  "vp_budget",
  "vp_checklist",
  "vp_recent_searches",
  "vp_passport_code",
] as const;

const SESSION_PREFIX_KEYS = ["vp_country_docs_v1_"] as const;

export type AppearancePreferences = {
  darkMode: boolean;
  language: string;
  currency: string;
};

export function applyAppearancePreferences(
  preferences: Pick<AppearancePreferences, "darkMode" | "language">,
): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", preferences.darkMode);
  document.documentElement.setAttribute("lang", preferences.language || DEFAULT_LANGUAGE);
}

export function cacheAppearancePreferences(preferences: AppearancePreferences): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(APPEARANCE_KEYS.theme, preferences.darkMode ? "dark" : "light");
  localStorage.setItem(APPEARANCE_KEYS.language, preferences.language || DEFAULT_LANGUAGE);
  localStorage.setItem(APPEARANCE_KEYS.currency, preferences.currency || DEFAULT_CURRENCY);
}

export function readCachedAppearancePreferences(): AppearancePreferences | null {
  if (typeof localStorage === "undefined") return null;
  try {
    return {
      darkMode: localStorage.getItem(APPEARANCE_KEYS.theme) === "dark",
      language: localStorage.getItem(APPEARANCE_KEYS.language) || DEFAULT_LANGUAGE,
      currency: localStorage.getItem(APPEARANCE_KEYS.currency) || DEFAULT_CURRENCY,
    };
  } catch {
    return null;
  }
}

export function resetGuestAppearance(): void {
  applyAppearancePreferences({ darkMode: false, language: DEFAULT_LANGUAGE });
}

export function clearSignedOutLocalState(): void {
  if (typeof localStorage === "undefined") return;

  try {
    for (const key of SESSION_LOCAL_KEYS) {
      localStorage.removeItem(key);
    }

    for (let index = localStorage.length - 1; index >= 0; index -= 1) {
      const key = localStorage.key(index);
      if (!key) continue;
      if (SESSION_PREFIX_KEYS.some((prefix) => key.startsWith(prefix))) {
        localStorage.removeItem(key);
      }
    }
  } catch {
    // Ignore storage cleanup failures so sign-out is never blocked.
  }
}
