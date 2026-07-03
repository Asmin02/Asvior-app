import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plane, Mail, Lock, User as UserIcon, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — VisaPilot" },
      { name: "description", content: "Sign in or create your VisaPilot account." },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup" | "forgot";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/profile" });
    });
  }, [navigate]);

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
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: fullName } },
        });
        if (error) throw error;
        toast.success("Account created — you're signed in.");
        navigate({ to: "/profile" });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + "/reset-password",
        });
        if (error) throw error;
        toast.success("Check your email for a reset link.");
        setMode("signin");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0 gradient-hero-bg" aria-hidden />
      <div className="pointer-events-none absolute -top-20 -right-16 h-72 w-72 rounded-full bg-primary/30 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-emerald/25 blur-3xl" aria-hidden />

      <div className="relative px-6 pt-8">
        <Link to="/" className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Link>

        <div className="mt-10 text-center animate-fade-up">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl gradient-primary shadow-float">
            <Plane className="h-8 w-8 text-primary-foreground" strokeWidth={2.2} />
          </div>
          <h1 className="mt-5 text-display text-3xl text-foreground">
            {mode === "signup" ? "Join VisaPilot" : mode === "forgot" ? "Reset password" : "Welcome back"}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {mode === "signup"
              ? "Save trips, favorites, and travel profile."
              : mode === "forgot"
              ? "We'll email you a reset link."
              : "Sign in to sync your travel data."}
          </p>
        </div>

        <form onSubmit={handle} className="mt-8 glass rounded-3xl p-5 space-y-3 animate-scale-in">
          {mode === "signup" && (
            <Field label="Full name" icon={<UserIcon className="h-4 w-4" />}>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Traveler" className="border-0 bg-transparent pl-0 shadow-none focus-visible:ring-0" />
            </Field>
          )}
          <Field label="Email" icon={<Mail className="h-4 w-4" />}>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="border-0 bg-transparent pl-0 shadow-none focus-visible:ring-0" />
          </Field>
          {mode !== "forgot" && (
            <Field label="Password" icon={<Lock className="h-4 w-4" />}>
              <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="border-0 bg-transparent pl-0 shadow-none focus-visible:ring-0" />
            </Field>
          )}
          <Button
            type="submit"
            disabled={busy}
            className="mt-2 h-12 w-full rounded-2xl gradient-primary text-sm font-semibold shadow-float"
          >
            {busy ? "Please wait…" : mode === "signup" ? "Create account" : mode === "forgot" ? "Send reset link" : "Sign in"}
          </Button>
        </form>

        <div className="mt-5 space-y-2 text-center text-xs">
          {mode === "signin" && (
            <>
              <button onClick={() => setMode("forgot")} className="font-semibold text-primary hover:underline">Forgot password?</button>
              <p className="text-muted-foreground">
                New here?{" "}
                <button onClick={() => setMode("signup")} className="font-bold text-primary hover:underline">Create account</button>
              </p>
            </>
          )}
          {mode === "signup" && (
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <button onClick={() => setMode("signin")} className="font-bold text-primary hover:underline">Sign in</button>
            </p>
          )}
          {mode === "forgot" && (
            <button onClick={() => setMode("signin")} className="font-semibold text-primary hover:underline">Back to sign in</button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card/70 px-4 py-2.5 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
      <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        <span className="text-primary">{icon}</span>{label}
      </label>
      {children}
    </div>
  );
}
