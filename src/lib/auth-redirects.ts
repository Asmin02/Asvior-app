import { APP_URL, getSiteUrl } from "@/lib/app-info";
import { isNative } from "@/lib/capacitor-env";

// The custom URL scheme registered by the Android app in
// android/app/src/main/AndroidManifest.xml. Supabase will redirect email
// links to this scheme, and MainActivity dispatches them via the
// `appUrlOpen` listener in `native-init.ts`.
const NATIVE_APP_URL = "asvior://asvior.app";

// Canonical auth callback path. Both the web app and the Capacitor Android
// deep-link handler resolve here first, exchange the PKCE code for a session,
// then forward the user to /profile (or /reset-password for recovery links).
// Consolidating on a single path means Supabase's redirect_to always lands
// somewhere we control — even if a stale preview URL is still sitting in the
// user's mobile browser history.
export const AUTH_CALLBACK_PATH = "/auth/callback";

function trimTrailingSlashes(value: string): string {
  return value.replace(/\/+$/, "");
}

function toSafeUrl(input: string): string {
  try {
    const parsed = new URL(input);
    return trimTrailingSlashes(`${parsed.protocol}//${parsed.host}`);
  } catch {
    return APP_URL;
  }
}

export function getAuthSiteUrl(): string {
  // When running inside the Capacitor Android/iOS shell we must return a
  // redirect URL that will re-open THIS app (via the asvior:// scheme).
  // Otherwise Supabase emails send the user into the mobile browser and the
  // newly-issued session never reaches the installed app.
  if (isNative()) return NATIVE_APP_URL;
  return toSafeUrl(getSiteUrl());
}

export function getEmailVerificationRedirectUrl(): string {
  return `${getAuthSiteUrl()}${AUTH_CALLBACK_PATH}`;
}

export function getPasswordResetRedirectUrl(): string {
  return `${getAuthSiteUrl()}${AUTH_CALLBACK_PATH}?type=recovery`;
}

export function getMagicLinkRedirectUrl(): string {
  return `${getAuthSiteUrl()}${AUTH_CALLBACK_PATH}`;
}

export function getOAuthRedirectUrl(): string {
  return `${getAuthSiteUrl()}${AUTH_CALLBACK_PATH}`;
}
