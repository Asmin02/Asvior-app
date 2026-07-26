import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset password — Asvior" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated");
      navigate({ to: "/profile" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not update password";
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div data-testid="reset-password-page" className="px-5 pt-10 pb-6">
      <h1 className="text-2xl font-bold text-foreground">Set a new password</h1>
      <p className="mt-1 text-sm text-muted-foreground">Enter a new password to continue.</p>
      <form onSubmit={submit} className="mt-6 space-y-3">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2">
          <Input
            data-testid="reset-password-input"
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            autoComplete="new-password"
            className="border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
          <button
            type="button"
            data-testid="reset-password-toggle-btn"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <Button data-testid="reset-password-submit-btn" type="submit" disabled={busy} className="w-full py-5 font-semibold">
          {busy ? "Updating…" : "Update password"}
        </Button>
      </form>
    </div>
  );
}
