import { createFileRoute, useNavigate, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, Lock, User as UserIcon, ArrowLeft, Eye, EyeOff, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getEmailVerificationRedirectUrl, getPasswordResetRedirectUrl } from "@/lib/auth-redirects";
import { useT } from "@/lib/i18n";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { message?: string } => ({
    message: typeof search.message === "string" ? search.message : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — Asvior" },
      { name: "description", content: "Sign in or create your Asvior account." },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup" | "forgot";

export function shouldBypassAuthPage(pathname: string): boolean {
  return pathname !== "/auth" && pathname.startsWith("/auth/");
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function AuthPage() {
  const t = useT();
  const navigate = useNavigate();
  const location = useLocation();
  const search = Route.useSearch();
  const shouldRenderChildRoute = shouldBypassAuthPage(location.pathname);
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (shouldRenderChildRoute) return;

    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      if (data.session) navigate({ to: "/profile" });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;
      if (event === "SIGNED_IN" && session) navigate({ to: "/profile" });
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [navigate, shouldRenderChildRoute]);

  useEffect(() => {
    if (shouldRenderChildRoute) return;
    if (!search.message) return;
    toast.success(search.message);
    navigate({ to: "/auth", search: {}, replace: true });
  }, [navigate, search.message, shouldRenderChildRoute]);

  if (shouldRenderChildRoute) {
    return <Outlet />;
  }

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate({ to: "/profile" });
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: getEmailVerificationRedirectUrl(),
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        if (data.session) {
          toast.success("Account created — you're signed in.");
          navigate({ to: "/profile" });
        } else {
          toast.success("Account created — check your email to verify, then sign in.");
          setMode("signin");
          setPassword("");
        }
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: getPasswordResetRedirectUrl(),
        });
        if (error) throw error;
        toast.success("Check your email for a reset link.");
        setMode("signin");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  const heading =
    mode === "signup" ? "Join Asvior" : mode === "forgot" ? "Reset password" : t("auth.welcomeBack");
  const subtitle =
    mode === "signup"
      ? t("auth.signUpSubtitle")
      : mode === "forgot"
        ? t("auth.forgotSubtitle")
        : t("auth.signInSubtitle");

  return (
    <div className="asv-app min-h-dvh" data-testid="auth-page">
      <div className="asv-auth-hero px-[var(--asv-space-page)] pb-20 pt-[calc(var(--asv-safe-top)+12px)]">
        <img src="/hero-sunrise.jpg" alt="" className="asv-auth-hero-bg" />
        <div className="asv-auth-hero-overlay" aria-hidden />
        <div className="relative z-[1]">
          <Link
            data-testid="auth-back-link"
            to="/"
            className="asv-btn asv-btn-icon !border-white/20 !bg-white/10 !text-white backdrop-blur-sm"
            aria-label={t("common.back")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="asv-animate-in mt-10 text-center text-white">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[var(--asv-radius-xl)] bg-white/15 shadow-[0_8px_32px_rgb(0_0_0_/_20%)] backdrop-blur-sm">
              <img src="/asvior-mark.png" alt="" className="h-9 w-9" />
            </div>
            <h1 className="asv-display text-3xl text-white">{heading}</h1>
            <p className="asv-subtitle mx-auto mt-2 max-w-xs !text-white/75">{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="-mt-12 px-[var(--asv-space-page)] pb-[calc(env(safe-area-inset-bottom,0px)+32px)]">
        {mode !== "forgot" && (
          <div
            className="asv-card asv-animate-in mb-4 flex gap-1 p-1.5 shadow-[var(--asv-shadow-md)]"
            role="tablist"
            aria-label="Authentication mode"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signin"}
              data-testid="auth-switch-signin-btn"
              onClick={() => setMode("signin")}
              className={`asv-btn flex-1 !min-h-10 !rounded-[var(--asv-radius-sm)] !border-0 !shadow-none ${
                mode === "signin"
                  ? "asv-btn-primary !text-white"
                  : "asv-btn-ghost !bg-transparent !text-[var(--asv-ink-secondary)]"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signup"}
              data-testid="auth-switch-signup-btn"
              onClick={() => setMode("signup")}
              className={`asv-btn flex-1 !min-h-10 !rounded-[var(--asv-radius-sm)] !border-0 !shadow-none ${
                mode === "signup"
                  ? "asv-btn-primary !text-white"
                  : "asv-btn-ghost !bg-transparent !text-[var(--asv-ink-secondary)]"
              }`}
            >
              Sign up
            </button>
          </div>
        )}

        <form
          onSubmit={handle}
          className="asv-card asv-card-pad asv-animate-in space-y-4 shadow-[var(--asv-shadow-md)]"
          data-testid="auth-form"
          style={{ animationDelay: "60ms" }}
        >
          {mode === "signup" && (
            <Field label="Full name" icon={<UserIcon className="h-4 w-4" />}>
              <input
                data-testid="auth-fullname-input"
                className="asv-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Traveler"
              />
            </Field>
          )}

          <Field label="Email" icon={<Mail className="h-4 w-4" />}>
            <input
              data-testid="auth-email-input"
              className="asv-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </Field>

          {mode !== "forgot" && (
            <Field label="Password" icon={<Lock className="h-4 w-4" />}>
              <div className="relative">
                <input
                  data-testid="auth-password-input"
                  className="asv-input pr-12"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                />
                <button
                  type="button"
                  data-testid="auth-password-toggle-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="asv-btn asv-btn-ghost absolute right-2 top-1/2 !min-h-8 !min-w-8 -translate-y-1/2 !p-0"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>
          )}

          <button
            type="submit"
            data-testid="auth-submit-btn"
            disabled={busy}
            className="asv-btn asv-btn-primary w-full"
          >
            {busy
              ? "Please wait…"
              : mode === "signup"
                ? "Create account"
                : mode === "forgot"
                  ? "Send reset link"
                  : "Sign in"}
          </button>

          {mode === "signin" && (
            <div className="space-y-2 pt-1 text-center text-xs">
              <button
                data-testid="auth-forgot-btn"
                type="button"
                onClick={() => setMode("forgot")}
                className="font-semibold text-[var(--asv-primary)] hover:underline"
              >
                {t("auth.forgotPassword")}
              </button>
            </div>
          )}
        </form>

        {mode === "signin" && (
          <div className="asv-animate-in mt-4 space-y-2.5" style={{ animationDelay: "120ms" }}>
            <p className="asv-label text-center">Or continue with</p>
            <button
              type="button"
              className="asv-btn asv-btn-secondary w-full"
              onClick={() => toast.info(t("auth.comingSoon"))}
            >
              <GoogleIcon />
              {t("auth.continueGoogle")}
            </button>
            <button
              type="button"
              className="asv-btn asv-btn-secondary w-full"
              onClick={() => toast.info(t("auth.comingSoon"))}
            >
              <AppleIcon />
              {t("auth.continueApple")}
            </button>
          </div>
        )}

        {mode === "forgot" && (
          <button
            data-testid="auth-back-signin-btn"
            type="button"
            onClick={() => setMode("signin")}
            className="asv-btn asv-btn-ghost mt-4 w-full text-xs font-semibold !text-[var(--asv-primary)]"
          >
            {t("auth.backToSignIn")}
          </button>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <span className="asv-label inline-flex items-center gap-1.5">
        <span className="text-[var(--asv-primary)]">{icon}</span>
        {label}
      </span>
      {children}
    </div>
  );
}
