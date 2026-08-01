import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const RECOVERY_SESSION_FLAG = "asvior_recovery_in_progress";

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
      const recoveryStarted =
        typeof window !== "undefined" && sessionStorage.getItem(RECOVERY_SESSION_FLAG) === "1";
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;

      if (!recoveryStarted || !data.session) {
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
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(RECOVERY_SESSION_FLAG);
      }
      await supabase.auth.signOut();
      navigate({
        to: "/auth",
        search: { message: "Password updated successfully" },
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
      <div data-testid="reset-password-page" className="px-5 pt-10 pb-6">
        <h1 className="text-2xl font-bold text-foreground">Checking reset link…</h1>
      </div>
    );
  }

  return (
    <div data-testid="reset-password-page" className="px-5 pt-10 pb-6">
      <h1 className="text-2xl font-bold text-foreground">Create New Password</h1>
      <p className="mt-1 text-sm text-muted-foreground">Enter and confirm your new password.</p>
      <form onSubmit={submit} className="mt-6 space-y-3">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2">
          <Input
            data-testid="reset-password-input"
            type={showNewPassword ? "text" : "password"}
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            autoComplete="new-password"
            className="border-0 bg-transparent shadow-none focus-visible:ring-0"
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
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2">
          <Input
            data-testid="reset-password-confirm-input"
            type={showConfirmPassword ? "text" : "password"}
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            autoComplete="new-password"
            className="border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
          <button
            type="button"
            data-testid="reset-password-confirm-toggle-btn"
            onClick={() => setShowConfirmPassword((v) => !v)}
            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            aria-pressed={showConfirmPassword}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <Button
          data-testid="reset-password-submit-btn"
          type="submit"
          disabled={busy}
          className="w-full py-5 font-semibold"
        >
          {busy ? "Updating…" : "Update password"}
        </Button>
      </form>
    </div>
  );
}
