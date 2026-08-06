import { createFileRoute, useNavigate, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, Lock, User as UserIcon, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getEmailVerificationRedirectUrl, getPasswordResetRedirectUrl } from "@/lib/auth-redirects";
import { AsviorMark } from "@/components/AsviorMark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import heroSkyline from "@/assets/hero-skyline.jpg";

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

function AuthPage() {
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
          // Email confirmations disabled — user is signed in immediately.
          toast.success("Account created — you're signed in.");
          navigate({ to: "/profile" });
        } else {
          // Email confirmations enabled — wait for verification link.
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

  const handleGoogle = async () => {
    toast.info("Google sign-in coming soon.");
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      <img
        src={heroSkyline}
        alt="Turquoise coastline at golden hour"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/45 to-background" />
      <div className="pointer-events-none absolute -right-16 top-24 h-56 w-56 rounded-full bg-aurora/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-40 h-56 w-56 rounded-full bg-gold/15 blur-3xl" />

      <div
        data-testid="auth-page"
        className="relative px-4 pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-10"
      >
        <Link
          data-testid="auth-back-link"
          to="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-primary-foreground backdrop-blur-md transition-transform active:scale-95"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Link>

        <div className="mt-14 animate-fade-in text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-white/15 bg-white/10 backdrop-blur-md elev-4">
            <AsviorMark className="h-12 w-12" />
          </div>
          <p className="mt-5 text-eyebrow text-primary-foreground/70">ASVIOR</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-primary-foreground">
            {mode === "signup"
              ? "Join Asvior"
              : mode === "forgot"
                ? "Reset password"
                : "Welcome back"}
          </h1>
          <p className="mx-auto mt-2 max-w-[30ch] text-sm leading-relaxed text-primary-foreground/70">
            {mode === "signup"
              ? "Save trips, favorites, and travel profile."
              : mode === "forgot"
                ? "We'll email you a reset link."
                : "Sign in to sync your travel data."}
          </p>
        </div>

        <div
          className="mx-auto mt-8 w-full max-w-sm animate-fade-in rounded-3xl border border-border/50 bg-card/80 p-5 elev-5 backdrop-blur-xl"
          style={{ animationDelay: "80ms" }}
        >
          <form onSubmit={handle} className="space-y-3" data-testid="auth-form">
            {mode === "signup" && (
              <Field label="Full name" icon={<UserIcon className="h-4 w-4" />}>
                <Input
                  data-testid="auth-fullname-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Traveler"
                  className="border-0 bg-transparent pl-0 shadow-none focus-visible:ring-0"
                />
              </Field>
            )}
            <Field label="Email" icon={<Mail className="h-4 w-4" />}>
              <Input
                data-testid="auth-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="border-0 bg-transparent pl-0 shadow-none focus-visible:ring-0"
              />
            </Field>
            {mode !== "forgot" && (
              <Field label="Password" icon={<Lock className="h-4 w-4" />}>
                <div className="flex items-center gap-2">
                  <Input
                    data-testid="auth-password-input"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    className="border-0 bg-transparent pl-0 shadow-none focus-visible:ring-0"
                  />
                  <button
                    type="button"
                    data-testid="auth-password-toggle-btn"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </Field>
            )}
            <Button
              type="submit"
              data-testid="auth-submit-btn"
              disabled={busy}
              className="mt-2 h-12 w-full rounded-full text-sm font-semibold transition-transform active:scale-95"
            >
              {busy
                ? "Please wait…"
                : mode === "signup"
                  ? "Create account"
                  : mode === "forgot"
                    ? "Send reset link"
                    : "Sign in"}
            </Button>
          </form>

          {mode !== "forgot" && (
            <>
              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-border/60" />
                <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  or
                </span>
                <div className="h-px flex-1 bg-border/60" />
              </div>
              <button
                type="button"
                onClick={handleGoogle}
                className="flex h-12 w-full items-center justify-center gap-2.5 rounded-full border border-border/60 bg-background/70 text-sm font-semibold text-foreground backdrop-blur-md transition-transform active:scale-95"
              >
                <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.47a5.53 5.53 0 01-2.4 3.63v3h3.87c2.27-2.09 3.58-5.17 3.58-8.81z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.96-1.07 7.94-2.92l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A11.999 11.999 0 0012 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.27 14.27a7.2 7.2 0 010-4.54v-3.11H1.27a12 12 0 000 10.76z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.77c1.76 0 3.35.6 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.69 1.27 6.62l4 3.11C6.22 6.88 8.87 4.77 12 4.77z"
                  />
                </svg>
                Continue with Google
              </button>
            </>
          )}

          <div className="mt-5 space-y-2 text-center text-xs">
            {mode === "signin" && (
              <>
                <button
                  data-testid="auth-forgot-btn"
                  onClick={() => setMode("forgot")}
                  className="font-semibold text-primary hover:underline"
                >
                  Forgot password?
                </button>
                <p className="text-muted-foreground">
                  New here?{" "}
                  <button
                    data-testid="auth-switch-signup-btn"
                    onClick={() => setMode("signup")}
                    className="font-bold text-primary hover:underline"
                  >
                    Create account
                  </button>
                </p>
              </>
            )}
            {mode === "signup" && (
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <button
                  data-testid="auth-switch-signin-btn"
                  onClick={() => setMode("signin")}
                  className="font-bold text-primary hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
            {mode === "forgot" && (
              <button
                data-testid="auth-back-signin-btn"
                onClick={() => setMode("signin")}
                className="font-semibold text-primary hover:underline"
              >
                Back to sign in
              </button>
            )}
          </div>
        </div>
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
    <div className="rounded-2xl border border-border/60 bg-background/60 px-4 py-2.5 transition-all focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10">
      <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}
