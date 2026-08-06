import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Eye, EyeOff, Lock, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LoadingScreen } from "@/components/asvior";
import { clearRecoveryInProgress, isRecoveryInProgress } from "@/lib/auth-recovery";
import { toast } from "sonner";

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

  if (checkingSession) {
    return (
      <div className="asv-app min-h-dvh">
        <LoadingScreen label="Checking reset link…" />
      </div>
    );
  }

  return (
    <div className="asv-app min-h-dvh" data-testid="reset-password-page">
      <div className="relative overflow-hidden px-[var(--asv-space-page)] pb-20 pt-[calc(var(--asv-safe-top)+12px)]">
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#1e1b4b] via-[var(--asv-primary)] to-[#9333ea]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-white/10 blur-2xl"
          aria-hidden
        />

        <div className="relative">
          <Link
            to="/auth"
            aria-label="Back to sign in"
            className="asv-btn asv-btn-icon !border-white/20 !bg-white/10 !text-white backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="asv-animate-in mt-10 text-center text-white">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[var(--asv-radius-xl)] bg-white/15 shadow-[0_8px_32px_rgb(0_0_0_/_20%)] backdrop-blur-sm">
              <Sparkles className="h-8 w-8" />
            </div>
            <h1 className="asv-display text-3xl text-white">Reset password</h1>
            <p className="asv-subtitle mx-auto mt-2 max-w-xs !text-white/75">
              Enter and confirm your new password.
            </p>
          </div>
        </div>
      </div>

      <div className="-mt-12 px-[var(--asv-space-page)] pb-[calc(env(safe-area-inset-bottom,0px)+32px)]">
        <form
          onSubmit={submit}
          className="asv-card asv-card-pad asv-animate-in space-y-4 shadow-[var(--asv-shadow-md)]"
        >
          <Field label="New password" icon={<Lock className="h-4 w-4" />}>
            <div className="relative">
              <input
                id="reset-password-input"
                data-testid="reset-password-input"
                className="asv-input pr-12"
                type={showNewPassword ? "text" : "password"}
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                autoComplete="new-password"
              />
              <button
                type="button"
                data-testid="reset-password-toggle-btn"
                onClick={() => setShowNewPassword((v) => !v)}
                aria-label={showNewPassword ? "Hide password" : "Show password"}
                aria-pressed={showNewPassword}
                className="asv-btn asv-btn-ghost absolute right-2 top-1/2 !min-h-8 !min-w-8 -translate-y-1/2 !p-0"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>

          <Field label="Confirm password" icon={<Lock className="h-4 w-4" />}>
            <div className="relative">
              <input
                id="reset-password-confirm-input"
                data-testid="reset-password-confirm-input"
                className="asv-input pr-12"
                type={showConfirmPassword ? "text" : "password"}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                autoComplete="new-password"
              />
              <button
                type="button"
                data-testid="reset-password-confirm-toggle-btn"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                aria-pressed={showConfirmPassword}
                className="asv-btn asv-btn-ghost absolute right-2 top-1/2 !min-h-8 !min-w-8 -translate-y-1/2 !p-0"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>

          <button
            data-testid="reset-password-submit-btn"
            type="submit"
            disabled={busy}
            className="asv-btn asv-btn-primary w-full"
          >
            {busy ? "Updating…" : "Update password"}
          </button>
        </form>
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
      <label className="asv-label inline-flex items-center gap-1.5">
        <span className="text-[var(--asv-primary)]">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}
