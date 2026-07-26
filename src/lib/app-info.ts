export const APP_VERSION = "3.0.0";
export const APP_NAME = "Asvior";
export const APP_URL = "https://asvior.app";
export const SUPPORT_EMAIL = "support@asvior.app";

/**
 * Returns the canonical site URL used for auth redirects, deep links, and
 * shared metadata. Falls back to VITE_SITE_URL, then window.location.origin,
 * then APP_URL. Safe to call from SSR.
 */
export function getSiteUrl(): string {
  const envUrl =
    (typeof process !== "undefined" && process.env?.VITE_SITE_URL) ||
    (typeof import.meta !== "undefined" && (import.meta as unknown as { env?: Record<string, string> })?.env?.VITE_SITE_URL);
  if (envUrl) return envUrl.replace(/\/+$/, "");
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin.replace(/\/+$/, "");
  }
  return APP_URL;
}
