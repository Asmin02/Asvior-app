import { Link, useRouter } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

const HIDDEN = [
  "/",
  "/assistant",
  "/auth",
  "/reset-password",
  "/about",
  "/privacy",
  "/terms",
  "/contact",
  "/support",
];

export function FloatingAIButton() {
  const { state } = useRouter();
  const path = state.location.pathname;

  if (HIDDEN.some((p) => path === p || path.startsWith(`${p}/`))) return null;

  return (
    <Link to="/assistant" className="asv-fab" aria-label="Open Asvior AI">
      <Sparkles className="h-6 w-6" />
    </Link>
  );
}
