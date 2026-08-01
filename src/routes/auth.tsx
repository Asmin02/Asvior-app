import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plane, Mail, Lock, User as UserIcon, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getEmailVerificationRedirectUrl, getPasswordResetRedirectUrl } from "@/lib/auth-redirects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

function AuthPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
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
  }, [navigate]);

  useEffect(() => {
    if (!search.message) return;
    toast.success(search.message);
    navigate({ to: "/auth", search: {}, replace: true });
  }, [navigate, search.message]);

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

  return (
    <div data-testid="auth-page" className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0 gradient-hero-bg" aria-hidden />
      <div
        className="pointer-events-none absolute -top-20 -right-16 h-72 w-72 rounded-full bg-primary/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-emerald/25 blur-3xl"
        aria-hidden
      />

      <div className="relative px-6 pt-8">
        <Link
          data-testid="auth-back-link"
          to="/"
          className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Link>

        <div className="mt-10 text-center animate-fade-up">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl gradient-primary shadow-float">
            <Plane className="h-8 w-8 text-primary-foreground" strokeWidth={2.2} />
          </div>
          <h1 className="mt-5 text-display text-3xl text-foreground">
            {mode === "signup"
              ? "Join Asvior"
              : mode === "forgot"
                ? "Reset password"
                : "Welcome back"}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {mode === "signup"
              ? "Save trips, favorites, and travel profile."
              : mode === "forgot"
                ? "We'll email you a reset link."
                : "Sign in to sync your travel data."}
          </p>
        </div>

        <form
          onSubmit={handle}
          className="mt-8 glass rounded-3xl p-5 space-y-3 animate-scale-in"
          data-testid="auth-form"
        >
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
            className="mt-2 h-12 w-full rounded-2xl gradient-primary text-sm font-semibold shadow-float"
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
    <div className="rounded-2xl border border-border bg-card/70 px-4 py-2.5 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
      <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}
