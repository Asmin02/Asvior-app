import { forwardRef, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* ---------------- Chip / Badge ---------------- */
const chipV7 = cva("chip-base", {
  variants: {
    intent: {
      neutral: "chip-neutral",
      signal: "chip-signal",
      success: "chip-success",
      warning: "chip-warning",
      danger: "chip-danger",
      info: "chip-info",
      onMedia: "chip-onmedia",
    },
    size: {
      sm: "px-2 py-0.5 text-3xs",
      md: "",
      lg: "px-3 py-1.5 text-xs",
    },
  },
  defaultVariants: { intent: "neutral", size: "md" },
});

export interface ChipV7Props
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof chipV7> {
  icon?: ReactNode;
}

export function ChipV7({ className, intent, size, icon, children, ...props }: ChipV7Props) {
  return (
    <span className={cn(chipV7({ intent, size }), className)} {...props}>
      {icon}
      {children}
    </span>
  );
}

/* ---------------- Icon tile ---------------- */
const iconTile = cva("icon-tile", {
  variants: {
    size: { sm: "icon-tile-sm", md: "", lg: "icon-tile-lg" },
    tone: {
      soft: "",
      signal: "icon-tile-signal",
      aurora: "icon-tile-aurora",
      neutral: "bg-secondary text-foreground",
    },
  },
  defaultVariants: { size: "md", tone: "soft" },
});

export interface IconTileProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof iconTile> {}

export function IconTile({ className, size, tone, children, ...props }: IconTileProps) {
  return (
    <span className={cn(iconTile({ size, tone }), className)} {...props}>
      {children}
    </span>
  );
}

/* ---------------- Input ---------------- */
const inputV7 = cva("input-base", {
  variants: {
    tone: { default: "", sunken: "input-sunken" },
    invalid: { true: "input-invalid", false: "" },
  },
  defaultVariants: { tone: "default", invalid: false },
});

export interface InputV7Props
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">, VariantProps<typeof inputV7> {}

export const InputV7 = forwardRef<HTMLInputElement, InputV7Props>(function InputV7(
  { className, tone, invalid, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(inputV7({ tone, invalid }), className)}
      {...props}
    />
  );
});

export function FieldV7({
  label,
  hint,
  error,
  htmlFor,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)}>
      <label htmlFor={htmlFor} className="field-label">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-danger">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
