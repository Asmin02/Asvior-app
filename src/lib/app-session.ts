export const DEFAULT_THEME = "light";
export const DEFAULT_LANGUAGE = "en";
export const DEFAULT_CURRENCY = "USD";
export const GUEST_STORAGE_SCOPE = "guest";

const APPEARANCE_KEYS = {
  theme: "vp_theme",
  language: "vp_lang",
  currency: "vp_currency",
} as const;

const GUEST_APPEARANCE_KEY = "vp_guest_appearance_v1";

const SESSION_LOCAL_KEYS = [
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

function normalizeAppearance(preferences: Partial<AppearancePreferences>): AppearancePreferences {
  return {
    darkMode: preferences.darkMode === true,
    language: preferences.language || DEFAULT_LANGUAGE,
    currency: preferences.currency || DEFAULT_CURRENCY,
  };
}

export function buildScopedStorageKey(baseKey: string, scope = GUEST_STORAGE_SCOPE): string {
  return `${baseKey}:${scope || GUEST_STORAGE_SCOPE}`;
}

export function applyAppearancePreferences(
  preferences: Pick<AppearancePreferences, "darkMode" | "language">,
): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", preferences.darkMode);
  document.documentElement.setAttribute("lang", preferences.language || DEFAULT_LANGUAGE);
}

export function cacheAppearancePreferences(preferences: AppearancePreferences): void {
  if (typeof localStorage === "undefined") return;
  const normalized = normalizeAppearance(preferences);
  localStorage.setItem(APPEARANCE_KEYS.theme, normalized.darkMode ? "dark" : "light");
  localStorage.setItem(APPEARANCE_KEYS.language, normalized.language);
  localStorage.setItem(APPEARANCE_KEYS.currency, normalized.currency);
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

export function cacheGuestAppearancePreferences(preferences: AppearancePreferences): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(GUEST_APPEARANCE_KEY, JSON.stringify(normalizeAppearance(preferences)));
  } catch {
    // Ignore storage failures to keep UX non-blocking.
  }
}

export function readGuestAppearancePreferences(): AppearancePreferences {
  if (typeof localStorage === "undefined") {
    return normalizeAppearance({});
  }
  try {
    const raw = localStorage.getItem(GUEST_APPEARANCE_KEY);
    if (!raw) return normalizeAppearance({});
    const parsed = JSON.parse(raw) as Partial<AppearancePreferences>;
    return normalizeAppearance(parsed);
  } catch {
    return normalizeAppearance({});
  }
}

export function resetGuestAppearance(): void {
  const guestPreferences = readGuestAppearancePreferences();
  applyAppearancePreferences({
    darkMode: guestPreferences.darkMode,
    language: guestPreferences.language,
  });
  cacheAppearancePreferences(guestPreferences);
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("asvior:language-change", { detail: { language: guestPreferences.language } }),
    );
    window.dispatchEvent(
      new CustomEvent("asvior:currency-change", { detail: { currency: guestPreferences.currency } }),
    );
  }
}

export function clearSignedOutLocalState(userScopeToClear?: string): void {
  if (typeof localStorage === "undefined") return;

  const scopedBases = [
    "vp_ai_chat_v1",
    "vp_ai_bookmarks_v1",
    "vp_budget",
    "vp_checklist",
    "vp_recent_searches",
  ] as const;

  try {
    for (const key of SESSION_LOCAL_KEYS) {
      localStorage.removeItem(key);
    }

    for (let index = localStorage.length - 1; index >= 0; index -= 1) {
      const key = localStorage.key(index);
      if (!key) continue;
      for (const base of scopedBases) {
        if (!key.startsWith(`${base}:`)) continue;
        if (userScopeToClear) {
          if (key === buildScopedStorageKey(base, userScopeToClear)) {
            localStorage.removeItem(key);
          }
        } else if (key !== buildScopedStorageKey(base, GUEST_STORAGE_SCOPE)) {
          localStorage.removeItem(key);
        }
        break;
      }
      if (SESSION_PREFIX_KEYS.some((prefix) => key.startsWith(prefix))) {
        localStorage.removeItem(key);
      }
    }
  } catch {
    // Ignore storage cleanup failures so sign-out is never blocked.
  }
}
