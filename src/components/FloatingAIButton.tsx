import { Link, useRouterState } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

export function FloatingAIButton() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (
    pathname.startsWith("/assistant") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/reset-password")
  ) {
    return null;
  }

  return (
    <Link
      to="/assistant"
      aria-label="Open AI Concierge"
      className="fixed bottom-[calc(6.5rem+env(safe-area-inset-bottom))] right-5 z-40 flex h-13 items-center gap-2 rounded-full bg-gradient-to-br from-primary to-[color-mix(in_oklab,var(--primary)_70%,var(--foreground))] px-5 py-3.5 text-primary-foreground shadow-[0_16px_34px_-14px_color-mix(in_oklab,var(--primary)_85%,transparent)] transition-transform active:scale-95"
    >
      <MessageCircle className="h-5 w-5" strokeWidth={1.9} />
      <span className="text-sm font-semibold tracking-tight">AI Concierge</span>
    </Link>
  );
}

