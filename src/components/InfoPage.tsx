import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

/** Shared chrome for the legal / info pages (about, privacy, terms, support, contact). */
export function InfoPage({
  badge,
  title,
  subtitle,
  children,
}: {
  badge: ReactNode;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="pb-12">
      <header className="relative overflow-hidden px-5 pb-8 pt-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-28 h-56 bg-[radial-gradient(65%_100%_at_50%_100%,color-mix(in_oklab,var(--primary)_16%,transparent),transparent)]"
        />
        <div className="relative">
          <Link
            to="/settings"
            aria-label="Back to settings"
            className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border/60 bg-card/70 text-foreground shadow-sm backdrop-blur-xl transition-transform active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/8 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            {badge}
          </div>
          <h1 className="mt-3 text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground">
            {title}
          </h1>
          <p className="mt-2 max-w-[36ch] text-sm leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        </div>
      </header>
      <section className="space-y-4 px-5">{children}</section>
    </div>
  );
}

export function InfoSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="premium-card animate-fade-in rounded-3xl p-6">
      <h2 className="text-base font-semibold tracking-tight text-foreground">{title}</h2>
      <div className="mt-2.5 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </div>
  );
}
