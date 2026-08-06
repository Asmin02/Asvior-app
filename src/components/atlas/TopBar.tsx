import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function TopBar({
  brand = "Asvior",
  left,
  right,
  className,
}: {
  brand?: string;
  left?: ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("asv-topbar", className)}>
      <div className="asv-topbar-side">{left}</div>
      <Link to="/" className="asv-brand" aria-label="Asvior home">
        {brand}
      </Link>
      <div className="asv-topbar-side asv-topbar-side--end">{right}</div>
    </header>
  );
}
