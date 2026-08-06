import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { setRecoveryInProgress } from "@/lib/auth-recovery";
import { toast } from "sonner";

export function inferAuthFlowType(
  searchType?: string,
  hashFragment?: string,
): "recovery" | "other" {
  if (searchType === "recovery") return "recovery";
  if (!hashFragment) return "other";
  const hash = hashFragment.startsWith("#") ? hashFragment.slice(1) : hashFragment;
  const hashParams = new URLSearchParams(hash);
  return hashParams.get("type") === "recovery" ? "recovery" : "other";
}

// Canonical Supabase auth landing page.
//
// Supabase redirects here after email confirmation, magic-link click, OAuth
// callback, or password recovery. The URL will look like:
//   https://asvior.app/auth/callback?code=<pkce_code>
//   https://asvior.app/auth/callback?type=recovery&code=<pkce_code>
//   https://asvior.app/auth/callback?error=access_denied&error_description=...
//
// Steps:
// 1. Read query params + hash fragment (Supabase sometimes uses `#access_token=...`).
// 2. Exchange the PKCE `code` for a session via
//    supabase.auth.exchangeCodeForSession — this is idempotent thanks to the
//    processed-code guard.
// 3. Route to /reset-password when `type=recovery`, otherwise /profile.
// 4. On error, route back to /auth with a toast so the user is not stranded.

type CallbackSearch = {
  code?: string;
  type?: string;
  error?: string;
  error_description?: string;
};

export const Route = createFileRoute("/auth/callback")({
  head: () => ({
    meta: [{ title: "Signing you in — Asvior" }, { name: "robots", content: "noindex" }],
  }),
  validateSearch: (raw): CallbackSearch => ({
    code: typeof raw.code === "string" ? raw.code : undefined,
    type: typeof raw.type === "string" ? raw.type : undefined,
    error: typeof raw.error === "string" ? raw.error : undefined,
    error_description:
      typeof raw.error_description === "string" ? raw.error_description : undefined,
  }),
  component: AuthCallbackPage,
});

const processedCodes = new Set<string>();

function AuthCallbackPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [status, setStatus] = useState<"working" | "ok" | "error">("working");
  const [message, setMessage] = useState("Confirming your email…");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const flowType = inferAuthFlowType(
          search.type,
          typeof window !== "undefined" ? window.location.hash : undefined,
        );

        // Explicit provider error takes precedence.
        if (search.error) {
          const desc = search.error_description || search.error;
          if (!cancelled) {
            setStatus("error");
            setMessage(desc);
            toast.error(desc);
            setTimeout(() => navigate({ to: "/auth", replace: true }), 1200);
          }
          return;
        }

        // 1) Modern PKCE flow — `?code=...`
        if (search.code) {
          if (!processedCodes.has(search.code)) {
            processedCodes.add(search.code);
            const { error } = await supabase.auth.exchangeCodeForSession(search.code);
            if (error) throw error;
          }
        } else if (typeof window !== "undefined" && window.location.hash.length > 1) {
          // 2) Legacy implicit flow — `#access_token=...&refresh_token=...`
          const hash = new URLSearchParams(window.location.hash.slice(1));
          const access_token = hash.get("access_token");
          const refresh_token = hash.get("refresh_token");
          if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            if (error) throw error;
          }
        }

        // At this point either we exchanged a code, applied hash tokens, or
        // Supabase already handled the session (detectSessionInUrl on web).
        // Verify we actually have one before declaring success.
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;

        if (!data.session) {
          const message =
            flowType === "recovery"
              ? "The password reset link is invalid or has expired."
              : "The confirmation link is invalid or has expired.";
          setStatus("error");
          setMessage(message);
          toast.error(message);
          setTimeout(() => navigate({ to: "/auth", replace: true }), 1400);
          return;
        }

        setStatus("ok");
        if (flowType === "recovery") {
          await setRecoveryInProgress();
          setMessage("Redirecting to password reset…");
          setTimeout(() => navigate({ to: "/reset-password", replace: true }), 400);
        } else {
          setMessage("You're in. Redirecting…");
          toast.success("Email confirmed — welcome to Asvior!");
          setTimeout(() => navigate({ to: "/profile", replace: true }), 400);
        }
      } catch (err) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : "Sign-in failed";
        setStatus("error");
        setMessage(msg);
        toast.error(msg);
        setTimeout(() => navigate({ to: "/auth", replace: true }), 1400);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [navigate, search.code, search.error, search.error_description, search.type]);

  return (
    <div
      data-testid="auth-callback-page"
      className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6"
    >
      <div className="pointer-events-none absolute inset-0 gradient-hero-bg" aria-hidden />
      <div
        className="glass relative w-full max-w-sm rounded-3xl px-6 py-8 text-center"
        data-testid="auth-callback-card"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-float">
          {status === "working" && (
            <Loader2 className="h-7 w-7 animate-spin text-primary-foreground" strokeWidth={2.4} />
          )}
          {status === "ok" && (
            <CheckCircle2 className="h-7 w-7 text-primary-foreground" strokeWidth={2.4} />
          )}
          {status === "error" && (
            <AlertTriangle className="h-7 w-7 text-primary-foreground" strokeWidth={2.4} />
          )}
        </div>
        <h1 className="mt-5 text-display text-2xl text-foreground">
          {status === "working" && "Almost there…"}
          {status === "ok" && "Confirmed"}
          {status === "error" && "Something went wrong"}
        </h1>
        <p data-testid="auth-callback-message" className="mt-2 text-sm text-muted-foreground">
          {message}
        </p>
      </div>
    </div>
  );
}
