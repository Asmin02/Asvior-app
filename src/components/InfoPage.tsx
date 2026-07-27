import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

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
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64 gradient-hero-bg"
        aria-hidden
      />
      <header className="relative px-6 pt-10">
        <Link
          to="/settings"
          aria-label="Back to settings"
          className="glass mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl text-foreground transition-transform active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold text-primary">
          {badge}
        </div>
        <h1 className="mt-3 text-display text-3xl text-foreground">{title}</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
      </header>
      <section className="relative mt-6 space-y-3 px-6 pb-8">{children}</section>
    </div>
  );
}

export function InfoSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="glass rounded-3xl p-5">
      <h2 className="text-sm font-bold text-foreground">{title}</h2>
      <div className="mt-2 space-y-2 text-[13px] leading-relaxed text-muted-foreground">
        {children}
      </div>
    </div>
  );
}
