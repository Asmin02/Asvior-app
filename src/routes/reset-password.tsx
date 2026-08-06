import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AsviorMark } from "@/components/AsviorMark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clearRecoveryInProgress, isRecoveryInProgress } from "@/lib/auth-recovery";
import { toast } from "sonner";
import heroSkyline from "@/assets/hero-skyline.jpg";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset password — Asvior" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const recoveryStarted = await isRecoveryInProgress();
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;

      if (!data.session || !recoveryStarted) {
        toast.error("Password reset link is invalid or has expired.");
        navigate({
          to: "/auth",
          search: { message: "Password reset link is invalid or expired" },
          replace: true,
        });
        return;
      }

      setCheckingSession(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      await clearRecoveryInProgress();
      toast.success("Password updated successfully.");
      navigate({
        to: "/profile",
        replace: true,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not update password";
      toast.error(message);
    } finally {
      setBusy(false);
    }
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

      <div
        data-testid="reset-password-page"
        className="relative px-4 pt-[calc(var(--safe-top)+2rem)] pb-10"
      >
        <div className="animate-fade-in text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-white/15 bg-white/10 backdrop-blur-md elev-4">
            <AsviorMark className="h-12 w-12" />
          </div>
          <p className="mt-5 text-eyebrow text-primary-foreground/70">ASVIOR</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-primary-foreground">
            {checkingSession ? "Checking reset link…" : "New password"}
          </h1>
          {!checkingSession && (
            <p className="mx-auto mt-2 max-w-[30ch] text-sm leading-relaxed text-primary-foreground/70">
              Enter and confirm your new password.
            </p>
          )}
        </div>

        {!checkingSession && (
          <div
            className="mx-auto mt-8 w-full max-w-sm animate-fade-in rounded-3xl border border-border/50 bg-card/80 p-5 elev-5 backdrop-blur-xl"
            style={{ animationDelay: "80ms" }}
          >
            <form onSubmit={submit} className="space-y-3">
              <Field label="New password" icon={<Lock className="h-4 w-4" />}>
                <div className="flex items-center gap-2">
                  <Input
                    data-testid="reset-password-input"
                    type={showNewPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="border-0 bg-transparent pl-0 shadow-none focus-visible:ring-0"
                  />
                  <button
                    type="button"
                    data-testid="reset-password-toggle-btn"
                    onClick={() => setShowNewPassword((v) => !v)}
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                    aria-pressed={showNewPassword}
                    className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </Field>
              <Field label="Confirm password" icon={<Lock className="h-4 w-4" />}>
                <div className="flex items-center gap-2">
                  <Input
                    data-testid="reset-password-confirm-input"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="border-0 bg-transparent pl-0 shadow-none focus-visible:ring-0"
                  />
                  <button
                    type="button"
                    data-testid="reset-password-confirm-toggle-btn"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={
                      showConfirmPassword ? "Hide confirm password" : "Show confirm password"
                    }
                    aria-pressed={showConfirmPassword}
                    className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </Field>
              <Button
                data-testid="reset-password-submit-btn"
                type="submit"
                disabled={busy}
                className="mt-2 h-12 w-full rounded-full text-sm font-semibold transition-transform active:scale-95"
              >
                {busy ? "Updating…" : "Update password"}
              </Button>
            </form>
          </div>
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
    <div className="rounded-2xl border border-border/60 bg-background/60 px-4 py-2.5 transition-all focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10">
      <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}
