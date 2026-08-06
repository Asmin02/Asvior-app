import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Unified page title block — sits below the brand TopBar with consistent spacing. */
export function AppPageHeader({
  overline,
  badge,
  title,
  subtitle,
  action,
  className,
}: {
  overline?: ReactNode;
  badge?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("asv-app-page-header asv-page-pad", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {overline}
          {badge}
          <h1 className="asv-headline mt-2">{title}</h1>
          {subtitle && <p className="asv-subtitle mt-1.5">{subtitle}</p>}
        </div>
        {action}
      </div>
    </header>
  );
}
