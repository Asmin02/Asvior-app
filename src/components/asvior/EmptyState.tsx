import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("asv-empty", className)}>
      <div className="asv-empty-illus">{icon}</div>
      <p className="asv-title">{title}</p>
      {description && <p className="asv-subtitle mt-2 max-w-xs">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function LoadingScreen({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-[40dvh] flex-col items-center justify-center px-8" role="status">
      <div className="asv-skeleton h-14 w-14 rounded-2xl" />
      <div className="mt-6 w-full max-w-xs space-y-2.5">
        <div className="asv-skeleton h-3 w-full rounded-full" />
        <div className="asv-skeleton h-3 w-4/5 rounded-full" />
      </div>
      <p className="asv-subtitle mt-5">{label}</p>
    </div>
  );
}

export function LoadingRows({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-hidden>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="asv-skeleton h-[76px] rounded-[var(--asv-radius-lg)]" />
      ))}
    </div>
  );
}
