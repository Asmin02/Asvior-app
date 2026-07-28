export const APP_VERSION = "3.0.0";
export const APP_NAME = "Asvior";
export const APP_URL = "https://asvior.app";
export const HELLO_EMAIL = "hello@asvior.app";
export const SUPPORT_EMAIL = "support@asvior.app";

/**
 * Returns the canonical site URL used for auth redirects, deep links, and
 * shared metadata. Priority:
 *   1. VITE_SITE_URL env (set explicitly in Vercel)
 *   2. APP_URL (compile-time constant — the source of truth)
 *   3. window.location.origin (last-resort fallback for local dev only)
 *
 * The reason APP_URL comes BEFORE window.location.origin is that we must
 * never construct a Supabase auth redirect that points at whatever URL the
 * user happens to have open — including stale preview builds, old CNAMEs
 * inherited from a previous hoster, or a Vercel preview subdomain. Auth
 * redirects always come home to https://asvior.app.
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
