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
      className="fixed bottom-[calc(5.75rem+env(safe-area-inset-bottom))] right-4 z-40 flex h-12 items-center gap-2 rounded-full bg-navy px-4 text-primary-foreground shadow-float transition-transform active:scale-95"
    >
      <MessageCircle className="h-5 w-5" strokeWidth={2} />
      <span className="text-sm font-semibold">AI Concierge</span>
    </Link>
  );
}
