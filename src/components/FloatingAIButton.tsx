import { Link, useRouterState } from "@tanstack/react-router";
import { AsviorMark } from "@/components/AsviorMark";

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
      aria-label="Open Asvior AI"
      className="floating-ai-btn bottom-[calc(5.75rem+env(safe-area-inset-bottom))] right-4"
    >
      <span className="floating-ai-btn-icon">
        <AsviorMark className="floating-ai-btn-mark" aria-hidden />
      </span>
      <span className="text-sm font-semibold tracking-tight text-white">Asvior AI</span>
    </Link>
  );
}
