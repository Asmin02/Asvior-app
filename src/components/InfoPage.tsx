import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { TopBar } from "@/components/asvior";

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
  showLogo?: boolean;
}) {
  return (
    <div className="asv-page asv-scroll-page">
      <TopBar
        left={
          <Link to="/settings" aria-label="Back to settings" className="asv-btn asv-btn-icon">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        }
      />
      <header className="asv-page-pad pb-2">
        <div className="asv-card asv-card-featured asv-card-pad mt-2">
          <div className="asv-chip asv-chip--active inline-flex !bg-white/15 !text-white">
            {badge}
          </div>
          <h1 className="asv-display mt-4 text-2xl text-white">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-white/80">{subtitle}</p>
        </div>
      </header>
      <section className="asv-page-pad asv-stagger space-y-3 pb-8 pt-4">{children}</section>
    </div>
  );
}

export function InfoSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="asv-card asv-card-pad">
      <p className="asv-eyebrow">{title}</p>
      <div className="asv-subtitle mt-3 space-y-2.5 text-sm leading-relaxed">{children}</div>
    </article>
  );
}

export function InfoLink({
  href,
  children,
  variant = "secondary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <a
      href={href}
      className={
        variant === "primary"
          ? "asv-btn asv-btn-primary inline-flex !min-h-11"
          : "asv-btn asv-btn-secondary inline-flex !min-h-11"
      }
    >
      {children}
    </a>
  );
}
