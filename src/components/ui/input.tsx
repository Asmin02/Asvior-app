import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "asv-input min-h-12 w-full rounded-[var(--asv-radius-md)] border border-[var(--asv-border)] bg-[var(--asv-surface)] px-4 py-3 text-[var(--asv-text-base)] font-medium text-[var(--asv-ink)] shadow-none outline-none transition-colors placeholder:text-[var(--asv-ink-tertiary)] focus-visible:border-[var(--asv-primary)] focus-visible:ring-[3px] focus-visible:ring-[var(--asv-primary)]/12 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
