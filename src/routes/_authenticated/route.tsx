import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: AuthenticatedGate,
});

function AuthenticatedGate() {
  const navigate = Route.useNavigate();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (cancelled) return;

      if (sessionData.session?.user) {
        setAllowed(true);
        setChecking(false);
        return;
      }

      const { data, error } = await supabase.auth.getUser();
      if (cancelled) return;

      if (error || !data.user) {
        setAllowed(false);
        setChecking(false);
        navigate({ to: "/auth", replace: true });
        return;
      }

      setAllowed(true);
      setChecking(false);
    };

    void verify();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (checking) {
    return (
      <div data-testid="auth-gate-loading" className="animate-pulse space-y-4 px-6 pt-10">
        <div className="h-12 rounded-2xl bg-muted" />
        <div className="h-24 rounded-3xl bg-muted" />
        <div className="h-24 rounded-3xl bg-muted" />
      </div>
    );
  }

  if (!allowed) return null;

  return <Outlet />;
}
