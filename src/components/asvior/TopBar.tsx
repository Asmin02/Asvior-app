import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ProfileAvatar({
  to,
  className,
  variant = "hero",
}: {
  to: string;
  className?: string;
  variant?: "hero" | "solid";
}) {
  return (
    <Link
      to={to}
      className={cn(
        "asv-avatar-btn",
        variant === "solid" && "asv-avatar-btn--solid",
        className,
      )}
      aria-label="Your profile"
    >
      <img src="/asvior-mark.png" alt="" width={22} height={22} />
    </Link>
  );
}

export function TopBar({
  brand = "Asvior",
  left,
  right,
  className,
  showMark = true,
  variant = "solid",
}: {
  brand?: string;
  left?: ReactNode;
  right?: ReactNode;
  className?: string;
  showMark?: boolean;
  variant?: "solid" | "hero";
}) {
  return (
    <header
      className={cn(
        "asv-topbar",
        variant === "hero" ? "asv-topbar--hero" : "asv-topbar--solid",
        className,
      )}
    >
      <div className="asv-topbar-side">{left}</div>
      <Link to="/" className="asv-brand" aria-label="Asvior home">
        {showMark && variant !== "hero" && <span className="asv-brand-mark" aria-hidden />}
        {brand}
      </Link>
      <div className="asv-topbar-side asv-topbar-side--end">{right}</div>
    </header>
  );
}
