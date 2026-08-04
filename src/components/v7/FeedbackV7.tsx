import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ---------------- Skeleton / loading ---------------- */
export function SkeletonV7({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} aria-hidden />;
}

export function SkeletonList({ rows = 3, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)} aria-hidden>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="card-base p-4">
          <div className="flex items-center gap-3">
            <SkeletonV7 className="h-11 w-11 rounded-md" />
            <div className="min-w-0 flex-1 space-y-2">
              <SkeletonV7 className="h-3.5 w-1/2" />
              <SkeletonV7 className="h-3 w-3/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SpinnerV7({
  className,
  label = "Loading",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn("spinner-ring h-5 w-5 block", className)}
    />
  );
}

/** Lazy-loading image with a shimmer placeholder baked in. */
export function ImageV7({
  src,
  alt,
  className,
  wrapperClassName,
  ratio = "aspect-[4/3]",
}: {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  ratio?: string;
}) {
  return (
    <div className={cn("img-shimmer overflow-hidden", ratio, wrapperClassName)}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={cn("size-full object-cover animate-fade-in", className)}
      />
    </div>
  );
}

/* ---------------- Progress ---------------- */
export function ProgressV7({
  value,
  label,
  className,
}: {
  value: number;
  label?: string;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn("progress-track", className)}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "Progress"}
    >
      <div className="progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ---------------- Empty state ---------------- */
export function EmptyStateV7({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("empty-canvas animate-fade-up", className)}>
      <span className="empty-orb animate-float">{icon}</span>
      <h3 className="text-title mt-5 text-lg text-foreground">{title}</h3>
      <p className="mt-2 max-w-[34ch] text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}

/* ---------------- Error state ---------------- */
export function ErrorStateV7({
  title = "Something slipped off course",
  description = "We couldn't load this just now. It's usually temporary — give it another try.",
  icon,
  action,
  className,
}: {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("empty-canvas animate-fade-up", className)} role="alert">
      <span className="empty-orb text-danger">{icon}</span>
      <h3 className="text-title mt-5 text-lg text-foreground">{title}</h3>
      <p className="mt-2 max-w-[36ch] text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/* ---------------- Section header ---------------- */
export function SectionHeaderV7({
  eyebrow,
  title,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow && <p className="text-eyebrow mb-1">{eyebrow}</p>}
        <h2 className="text-title truncate text-xl text-foreground">{title}</h2>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
