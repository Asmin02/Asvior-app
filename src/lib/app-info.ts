export const APP_VERSION = "3.0.0";
export const APP_NAME = "Asvior";
export const APP_URL = "https://asvior.app";
export const HELLO_EMAIL = "hello@asvior.app";
export const SUPPORT_EMAIL = "support@asvior.app";

/**
 * Returns the canonical site URL used for deep links and shared metadata
 * (og:image, canonical link tags, etc.). Priority:
 *   1. VITE_SITE_URL env (set explicitly in Vercel for staging previews)
 *   2. APP_URL (compile-time constant — the source of truth)
 *   3. window.location.origin (last-resort fallback for local dev only)
 *
 * NOTE: This is NOT used for Supabase auth redirects — those are locked to
 * APP_URL directly in `src/lib/auth-redirects.ts` so that no environment
 * mis-configuration (e.g. a stale VITE_SITE_URL inherited from a previous
 * hoster like Lovable) can ever cause a confirmation email to point at the
 * wrong deployment.
 */
export function getSiteUrl(): string {
  const envUrl =
    (typeof process !== "undefined" && process.env?.VITE_SITE_URL) ||
    (typeof import.meta !== "undefined" &&
      (import.meta as unknown as { env?: Record<string, string> })?.env?.VITE_SITE_URL);
  if (envUrl) return envUrl.replace(/\/+$/, "");
  return APP_URL;
}

/**
 * Same as getSiteUrl() but allows the browser's origin to win when the code
 * is running on the true site (asvior.app) or on localhost during dev. This
 * is safe for non-auth uses like og:image and canonical link tags.
 */
export function getPreferredOriginUrl(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin.replace(/\/+$/, "");
  }
  return getSiteUrl();
}
