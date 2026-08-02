import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { AsviorLogo } from "@/components/AsviorLogo";

export function InfoPage({
  badge,
  title,
  subtitle,
  children,
  showLogo = true,
}: {
  badge: ReactNode;
  title: string;
  subtitle: string;
  children: ReactNode;
  showLogo?: boolean;
}) {
  return (
    <div className="pb-8">
      <header className="border-b border-border bg-card px-4 py-5">
        <Link
          to="/settings"
          aria-label="Back to settings"
          className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-secondary"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        {showLogo ? (
          <AsviorLogo className="mx-auto mb-4 h-24 w-auto max-w-[220px]" showTagline={false} />
        ) : null}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground">
          {badge}
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
      </header>
      <section className="mt-4 space-y-3 px-4">{children}</section>
    </div>
  );
}

export function InfoSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="premium-card rounded-2xl p-5">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}
