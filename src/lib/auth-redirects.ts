import { APP_URL } from "@/lib/app-info";
import { isNative } from "@/lib/capacitor-env";

/** Canonical production origin — never derived from env or window.location. */
export const AUTH_PRODUCTION_ORIGIN = APP_URL;

// The custom URL scheme registered by the Android app in
// android/app/src/main/AndroidManifest.xml. Supabase will redirect email
// links to this scheme, and MainActivity dispatches them via the
// `appUrlOpen` listener in `native-init.ts`.
const NATIVE_APP_URL = "asvior://asvior.app";

// Canonical auth callback path. Both the web app and the Capacitor Android
// deep-link handler resolve here first, exchange the auth token for a session,
// then forward the user to /profile (or /reset-password for recovery links).
export const AUTH_CALLBACK_PATH = "/auth/callback";

/** Full HTTPS callback URL used in Supabase emails — hard-coded, never templated with SiteURL. */
export const AUTH_CALLBACK_URL = `${AUTH_PRODUCTION_ORIGIN}${AUTH_CALLBACK_PATH}`;

export const AUTH_CALLBACK_RECOVERY_URL = `${AUTH_CALLBACK_URL}?type=recovery`;

const FORBIDDEN_REDIRECT_HOSTS = [
  "localhost",
  "lovable.app",
  "lovableproject.com",
  "vercel.app",
];

/** Guard against accidental relative or preview URLs reaching Supabase. */
export function assertAuthRedirectUrl(url: string, label: string): string {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`${label} must be an absolute URL, got: ${url}`);
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "asvior:") {
    throw new Error(`${label} must use https (or asvior on native), got: ${url}`);
  }

  const host = parsed.hostname.toLowerCase();
  if (!host || host === "") {
    throw new Error(`${label} is missing a hostname: ${url}`);
  }

  for (const forbidden of FORBIDDEN_REDIRECT_HOSTS) {
    if (host === forbidden || host.endsWith(`.${forbidden}`)) {
      throw new Error(`${label} must not use ${forbidden}, got: ${url}`);
    }
  }

  if (parsed.protocol === "https:" && host !== "asvior.app") {
    throw new Error(`${label} must use https://asvior.app, got: ${url}`);
  }

  if (!parsed.pathname.startsWith(AUTH_CALLBACK_PATH)) {
    throw new Error(`${label} must target ${AUTH_CALLBACK_PATH}, got: ${url}`);
  }

  return url;
}

export function getAuthSiteUrl(): string {
  if (isNative()) return NATIVE_APP_URL;
  return AUTH_PRODUCTION_ORIGIN;
}

export function getEmailVerificationRedirectUrl(): string {
  return assertAuthRedirectUrl(`${getAuthSiteUrl()}${AUTH_CALLBACK_PATH}`, "emailRedirectTo");
}

export function getPasswordResetRedirectUrl(): string {
  return assertAuthRedirectUrl(
    `${getAuthSiteUrl()}${AUTH_CALLBACK_PATH}?type=recovery`,
    "redirectTo",
  );
}

export function getMagicLinkRedirectUrl(): string {
  return assertAuthRedirectUrl(`${getAuthSiteUrl()}${AUTH_CALLBACK_PATH}`, "magicLinkRedirectTo");
}

export function getOAuthRedirectUrl(): string {
  return assertAuthRedirectUrl(`${getAuthSiteUrl()}${AUTH_CALLBACK_PATH}`, "oauthRedirectTo");
}

/** Link body for Supabase email templates — never use {{ .SiteURL }}. */
export function getEmailConfirmationTemplateHref(): string {
  return `${AUTH_CALLBACK_URL}?token_hash={{ .TokenHash }}&type=email`;
}

export function getPasswordResetTemplateHref(): string {
  return `${AUTH_CALLBACK_URL}?token_hash={{ .TokenHash }}&type=recovery`;
}
