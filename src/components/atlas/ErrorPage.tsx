import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function ErrorPage({
  code,
  title,
  description,
  primaryAction,
  secondaryHref = "/",
  secondaryLabel = "Go home",
}: {
  code?: string;
  title: string;
  description: string;
  primaryAction?: ReactNode;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <div className="asv-app flex min-h-dvh items-center justify-center asv-page-pad">
      <div className="asv-card asv-card-pad w-full max-w-sm text-center">
        {code && (
          <p className="asv-eyebrow mb-2">{code}</p>
        )}
        <h1 className="asv-headline">{title}</h1>
        <p className="asv-subtitle mt-3">{description}</p>
        <div className="mt-6 flex flex-col gap-2">
          {primaryAction}
          <Link to={secondaryHref} className="asv-btn asv-btn-secondary w-full">
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
