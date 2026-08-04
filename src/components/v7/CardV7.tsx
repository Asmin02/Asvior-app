import { forwardRef, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * V7 Card system.
 * `CardV7`         — the default container for all content blocks.
 * `CardImmersive`  — full-bleed media card with built-in legibility scrim.
 * `CardHeaderV7`   — eyebrow / title / action row.
 */
const cardV7 = cva("card-base", {
  variants: {
    tone: {
      default: "",
      sunken: "surface-sunken shadow-none",
      glass: "surface-glass",
      ink: "surface-ink border-transparent",
      outline: "bg-transparent shadow-none",
    },
    size: {
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
      flush: "p-0",
    },
    radius: {
      lg: "rounded-lg",
      xl: "rounded-xl",
      "2xl": "rounded-2xl",
    },
    interactive: { true: "card-interactive", false: "" },
    glow: { true: "card-glow", false: "" },
  },
  defaultVariants: {
    tone: "default",
    size: "md",
    radius: "lg",
    interactive: false,
    glow: false,
  },
});

export interface CardV7Props
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardV7> {}

export const CardV7 = forwardRef<HTMLDivElement, CardV7Props>(function CardV7(
  { className, tone, size, radius, interactive, glow, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(cardV7({ tone, size, radius, interactive, glow }), className)}
      {...props}
    />
  );
});

export function CardHeaderV7({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow && <p className="text-eyebrow mb-1.5">{eyebrow}</p>}
        <h3 className="text-title truncate text-lg text-foreground">{title}</h3>
        {description && (
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/** Full-bleed media card. Children render above the scrim. */
export function CardImmersive({
  className,
  children,
  ratio = "aspect-[4/5]",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ratio?: string }) {
  return (
    <div className={cn("card-immersive lift", ratio, className)} {...props}>
      {children}
    </div>
  );
}
