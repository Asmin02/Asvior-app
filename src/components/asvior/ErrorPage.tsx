import type { ReactNode } from "react";

export function ErrorPage({
  code,
  title,
  description,
  primaryAction,
  secondaryAction,
}: {
  code?: string;
  title: string;
  description: string;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
}) {
  return (
    <div className="asv-error">
      {code && <p className="asv-error-code">{code}</p>}
      <h1 className="asv-headline mt-4">{title}</h1>
      <p className="asv-subtitle mt-3 max-w-sm">{description}</p>
      <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
        {primaryAction}
        {secondaryAction}
      </div>
    </div>
  );
}
