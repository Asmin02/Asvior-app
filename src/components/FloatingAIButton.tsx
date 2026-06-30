import { Link, useRouterState } from "@tanstack/react-router";

export function FloatingAIButton() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname.startsWith("/assistant") || pathname.startsWith("/auth") || pathname.startsWith("/reset-password")) {
    return null;
  }

  return (
    <Link
      to="/assistant"
      aria-label="Open AI Assistant"
      className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary via-travel-blue to-travel-blue-dark text-primary-foreground shadow-2xl shadow-primary/40 ring-1 ring-white/20 backdrop-blur-md transition-transform active:scale-95 hover:scale-105"
    >
      <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-primary/30 blur-xl animate-pulse" />
      <SparkleIcon className="h-6 w-6 drop-shadow" />
    </Link>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.8 4.6L18 9.4l-4.2 1.8L12 15.8l-1.8-4.6L6 9.4l4.2-1.8L12 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14z" />
    </svg>
  );
}
