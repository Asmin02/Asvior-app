import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { exchangeAuthCallbackSession, inferAuthFlowType } from "@/lib/auth-callback-exchange";
import { setRecoveryInProgress } from "@/lib/auth-recovery";
import { toast } from "sonner";

// Canonical Supabase auth landing page.
//
// Email links should use token_hash (see SUPABASE_SETUP.md) so confirmation and
// password reset work even when the mail app opens a different browser.
// PKCE ?code=... is still supported for OAuth and same-browser flows.

type CallbackSearch = {
  code?: string;
  token_hash?: string;
  type?: string;
  error?: string;
  error_description?: string;
};

export const Route = createFileRoute("/auth/callback")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Signing you in — Asvior" }, { name: "robots", content: "noindex" }],
  }),
  validateSearch: (raw): CallbackSearch => ({
    code: typeof raw.code === "string" ? raw.code : undefined,
    token_hash: typeof raw.token_hash === "string" ? raw.token_hash : undefined,
    type: typeof raw.type === "string" ? raw.type : undefined,
    error: typeof raw.error === "string" ? raw.error : undefined,
    error_description:
      typeof raw.error_description === "string" ? raw.error_description : undefined,
  }),
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [status, setStatus] = useState<"working" | "ok" | "error">("working");
  const [message, setMessage] = useState("Confirming your email…");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const hashFragment =
          typeof window !== "undefined" && window.location.hash.length > 1
            ? window.location.hash
            : undefined;
        const flowType = inferAuthFlowType(search.type, hashFragment);

        const supabaseUrl =
          import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";

        const { error: exchangeError } = await exchangeAuthCallbackSession(
          supabase,
          search,
          { flow: flowType, hashFragment, supabaseUrl },
        );
        if (exchangeError) throw exchangeError;

        const { data } = await supabase.auth.getSession();
        if (cancelled) return;

        if (!data.session) {
          const noSessionMessage =
            flowType === "recovery"
              ? "The password reset link is invalid or has expired."
              : "The confirmation link is invalid or has expired.";
          setStatus("error");
          setMessage(noSessionMessage);
          toast.error(noSessionMessage);
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
          toast.success(
            flowType === "signup"
              ? "Email confirmed — welcome to Asvior!"
              : "Signed in successfully.",
          );
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
  }, [
    navigate,
    search.code,
    search.token_hash,
    search.error,
    search.error_description,
    search.type,
  ]);

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

export { inferAuthFlowType };
