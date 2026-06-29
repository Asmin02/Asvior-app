import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName },
          },
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
    <div className="px-5 pt-10 pb-6">
      <Link to="/" className="text-xs text-muted-foreground">← Back</Link>
      <div className="mt-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-travel-blue to-travel-blue-dark text-white shadow-lg">
          <PlaneIcon className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-foreground">
          {mode === "signup" ? "Create your account" : mode === "forgot" ? "Reset password" : "Welcome back"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signup"
            ? "Save trips, favorites, and your travel profile."
            : mode === "forgot"
            ? "We'll email you a reset link."
            : "Sign in to sync your trips & profile."}
        </p>
      </div>

      <form onSubmit={handle} className="mt-7 space-y-3">
        {mode === "signup" && (
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Full name</label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Traveler" />
          </div>
        )}
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Email</label>
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        {mode !== "forgot" && (
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Password</label>
            <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
        )}
        <Button type="submit" disabled={busy} className="w-full py-5 text-sm font-semibold">
          {busy ? "Please wait…" : mode === "signup" ? "Create account" : mode === "forgot" ? "Send reset link" : "Sign in"}
        </Button>
      </form>

      <div className="mt-5 space-y-2 text-center text-xs">
        {mode === "signin" && (
          <>
            <button onClick={() => setMode("forgot")} className="text-primary hover:underline">Forgot password?</button>
            <p className="text-muted-foreground">
              New here? <button onClick={() => setMode("signup")} className="font-semibold text-primary hover:underline">Create account</button>
            </p>
          </>
        )}
        {mode === "signup" && (
          <p className="text-muted-foreground">
            Already have an account? <button onClick={() => setMode("signin")} className="font-semibold text-primary hover:underline">Sign in</button>
          </p>
        )}
        {mode === "forgot" && (
          <button onClick={() => setMode("signin")} className="text-primary hover:underline">Back to sign in</button>
        )}
      </div>
    </div>
  );
}

function PlaneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  );
}
