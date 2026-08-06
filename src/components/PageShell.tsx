import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * ASVIOR V7 "Skyline" — shared page chrome.
 * Bright, airy, travel-first: soft sky wash headers, generous rhythm, no
 * corporate boxes. Pure presentation; no behaviour lives here.
 */

export function PageShell({
  children,
  className,
}: {
  children: ReactNode;
  phase?: string;
  className?: string;
}) {
  return (
    <div className={cn("animate-page-enter min-h-full bg-background", className)}>{children}</div>
  );
}

export function PageHeader({
  badge,
  title,
  subtitle,
  action,
}: {
  badge?: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden px-5 pb-9 pt-[calc(var(--safe-top)+1.5rem)]">
      {/* soft sky wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-32 h-64 bg-[radial-gradient(60%_100%_at_50%_100%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent)]"
      />
      <div
        aria-hidden
        className="animate-aurora-drift pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[color-mix(in_oklab,var(--color-gold,var(--primary))_16%,transparent)] blur-3xl"
      />
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          {badge && (
            <div className="animate-fade-up" style={{ animationDelay: "40ms" }}>
              {badge}
            </div>
          )}
          <h1
            className="animate-fade-up mt-3.5 text-[2.125rem] font-semibold leading-[1.08] tracking-[-0.035em] text-foreground"
            style={{ animationDelay: "110ms" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="animate-fade-up mt-2.5 max-w-[34ch] text-sm leading-relaxed text-muted-foreground"
              style={{ animationDelay: "190ms" }}
            >
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
    </header>
  );
}

export function PageBadge({
  icon,
  children,
}: {
  icon?: ReactNode;
  children: ReactNode;
  tone?: "champagne" | "primary";
}) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/8 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary backdrop-blur-sm">
      {icon}
      {children}
    </div>
  );
}

export function EmptyStateCard({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="float-card animate-fade-up p-10 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-primary/14 to-primary/4 text-2xl ring-1 ring-primary/10">
        {icon}
      </div>
      <p className="text-base font-semibold tracking-tight text-foreground">{title}</p>
      <p className="mx-auto mt-2 max-w-[32ch] text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function LoadingSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-hidden>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="skeleton-block h-24 r-28"
          style={{ animationDelay: `${i * 90}ms` }}
        />
      ))}
    </div>
  );
}
