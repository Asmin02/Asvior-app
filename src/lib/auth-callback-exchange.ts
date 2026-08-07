import type { EmailOtpType, SupabaseClient } from "@supabase/supabase-js";

export type AuthCallbackParams = {
  code?: string;
  token_hash?: string;
  token?: string;
  type?: string;
  error?: string;
  error_description?: string;
};

export type AuthCallbackFlow = "recovery" | "signup" | "other";

export function inferAuthFlowType(searchType?: string, hashFragment?: string): AuthCallbackFlow {
  if (searchType === "recovery") return "recovery";
  if (searchType === "signup" || searchType === "email") return "signup";
  if (!hashFragment) return "other";
  const hash = hashFragment.startsWith("#") ? hashFragment.slice(1) : hashFragment;
  const hashParams = new URLSearchParams(hash);
  const hashType = hashParams.get("type");
  if (hashType === "recovery") return "recovery";
  if (hashType === "signup" || hashType === "email") return "signup";
  return "other";
}

function pkceVerifierStorageKey(supabaseUrl: string): string {
  const ref = new URL(supabaseUrl).hostname.split(".")[0];
  return `sb-${ref}-auth-token-code-verifier`;
}

const PKCE_COOKIE = "asvior_pkce_verifier";

/** Mirror PKCE verifier to a short-lived cookie so email in-app browsers can recover it. */
export function mirrorPkceVerifierToCookie(supabaseUrl: string): void {
  if (typeof window === "undefined") return;
  try {
    const verifier = localStorage.getItem(pkceVerifierStorageKey(supabaseUrl));
    if (!verifier) return;
    document.cookie = `${PKCE_COOKIE}=${encodeURIComponent(verifier)}; path=/; max-age=3600; SameSite=Lax; Secure`;
  } catch {
    // ignore storage errors
  }
}

function restorePkceVerifierFromCookie(supabaseUrl: string): void {
  if (typeof window === "undefined") return;
  try {
    const key = pkceVerifierStorageKey(supabaseUrl);
    if (localStorage.getItem(key)) return;
    const match = document.cookie.match(new RegExp(`(?:^|; )${PKCE_COOKIE}=([^;]*)`));
    if (!match) return;
    const verifier = decodeURIComponent(match[1]);
    if (verifier) localStorage.setItem(key, verifier);
    document.cookie = `${PKCE_COOKIE}=; path=/; max-age=0; SameSite=Lax; Secure`;
  } catch {
    // ignore storage errors
  }
}

function resolveVerifyOtpType(type: string | undefined, flow: AuthCallbackFlow): EmailOtpType {
  if (type === "recovery") return "recovery";
  if (type === "signup") return "signup";
  if (type === "magiclink") return "magiclink";
  if (type === "invite") return "invite";
  if (type === "email_change") return "email_change";
  if (flow === "recovery") return "recovery";
  return "email";
}

const processedTokens = new Set<string>();

/**
 * Establish a Supabase session from an auth callback URL.
 * Prefers token_hash (works when email opens in a different browser).
 * Falls back to PKCE code exchange or legacy hash tokens.
 */
export async function exchangeAuthCallbackSession(
  supabase: SupabaseClient,
  params: AuthCallbackParams,
  options: {
    flow: AuthCallbackFlow;
    hashFragment?: string;
    supabaseUrl: string;
  },
): Promise<{ error: Error | null }> {
  const { flow, hashFragment, supabaseUrl } = options;

  if (params.error) {
    return { error: new Error(params.error_description || params.error) };
  }

  // 1) Token hash — recommended for email confirmation & password reset links.
  if (params.token_hash) {
    const dedupeKey = `hash:${params.token_hash}`;
    if (!processedTokens.has(dedupeKey)) {
      processedTokens.add(dedupeKey);
      const otpType = resolveVerifyOtpType(params.type, flow);
      const { error } = await supabase.auth.verifyOtp({
        token_hash: params.token_hash,
        type: otpType,
      });
      if (error) return { error };
    }
    return { error: null };
  }

  // 2) PKCE authorization code — same-browser flows (OAuth, some legacy emails).
  if (params.code) {
    const dedupeKey = `code:${params.code}`;
    if (!processedTokens.has(dedupeKey)) {
      processedTokens.add(dedupeKey);
      restorePkceVerifierFromCookie(supabaseUrl);
      const { error } = await supabase.auth.exchangeCodeForSession(params.code);
      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes("code verifier")) {
          return {
            error: new Error(
              "This sign-in link must be opened in the same browser where you signed up. Request a new confirmation or reset email and try again.",
            ),
          };
        }
        return { error };
      }
    }
    return { error: null };
  }

  // 3) Legacy implicit flow — `#access_token=...&refresh_token=...`
  if (hashFragment && hashFragment.length > 1) {
    const hash = new URLSearchParams(hashFragment.startsWith("#") ? hashFragment.slice(1) : hashFragment);
    const access_token = hash.get("access_token");
    const refresh_token = hash.get("refresh_token");
    if (access_token && refresh_token) {
      const { error } = await supabase.auth.setSession({ access_token, refresh_token });
      if (error) return { error };
    }
  }

  return { error: null };
}
