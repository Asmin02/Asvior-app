import { Link, useRouterState } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function FloatingAIButton() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname.startsWith("/assistant") || pathname.startsWith("/auth") || pathname.startsWith("/reset-password")) {
    return null;
  }

  return (
    <Link
      to="/assistant"
      aria-label="Open AI Assistant"
      className="group fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] right-5 z-40 flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary text-primary-foreground shadow-float transition-transform active:scale-95 hover:-translate-y-0.5"
    >
      <span className="pointer-events-none absolute inset-0 -z-10 rounded-2xl gradient-primary opacity-70 blur-xl animate-pulse" />
      <Sparkles className="h-6 w-6 drop-shadow" strokeWidth={2.2} />
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="absolute inset-0 animate-ping rounded-full bg-emerald opacity-70" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald ring-2 ring-background" />
      </span>
    </Link>
  );
}
