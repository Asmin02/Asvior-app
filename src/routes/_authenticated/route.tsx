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
      try {
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
      } catch {
        if (cancelled) return;
        setAllowed(false);
        setChecking(false);
        navigate({ to: "/auth", replace: true });
      }
    };

    void verify();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (checking) return null;

  if (!allowed) return null;

  return <Outlet />;
}
