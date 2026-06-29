import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset password — VisaPilot" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated");
      navigate({ to: "/profile" });
    } catch (err: any) {
      toast.error(err.message ?? "Could not update password");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="px-5 pt-10 pb-6">
      <h1 className="text-2xl font-bold text-foreground">Set a new password</h1>
      <p className="mt-1 text-sm text-muted-foreground">Enter a new password to continue.</p>
      <form onSubmit={submit} className="mt-6 space-y-3">
        <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" />
        <Button type="submit" disabled={busy} className="w-full py-5 font-semibold">
          {busy ? "Updating…" : "Update password"}
        </Button>
      </form>
    </div>
  );
}
