import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * V7 Button — the only button in the app.
 * States: default / hover (lift + sheen) / pressed (spring) / loading / success /
 * disabled. Every variant is token-driven; no hardcoded colors.
 */
const buttonV7 = cva("btn-base ripple", {
  variants: {
    variant: {
      signal: "btn-signal btn-sheen",
      ink: "btn-ink btn-sheen",
      soft: "btn-soft",
      outline: "btn-outline",
      ghost: "btn-ghost",
      danger: "btn-danger",
      success: "btn-success",
    },
    size: {
      xs: "btn-xs",
      sm: "btn-sm",
      md: "btn-md",
      lg: "btn-lg",
      icon: "btn-icon",
    },
    block: {
      true: "w-full",
      false: "",
    },
  },
  defaultVariants: { variant: "signal", size: "md", block: false },
});

export interface ButtonV7Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonV7> {
  asChild?: boolean;
  loading?: boolean;
  succeeded?: boolean;
  /** Rendered before the label; hidden while loading. */
  icon?: React.ReactNode;
  /** Rendered after the label. */
  trailing?: React.ReactNode;
}

export const ButtonV7 = forwardRef<HTMLButtonElement, ButtonV7Props>(function ButtonV7(
  {
    className,
    variant,
    size,
    block,
    asChild,
    loading = false,
    succeeded = false,
    icon,
    trailing,
    children,
    disabled,
    ...props
  },
  ref,
) {
  const Comp = asChild ? Slot : "button";

  if (asChild) {
    return (
      <Comp
        ref={ref}
        className={cn(buttonV7({ variant, size, block }), className)}
        aria-busy={loading || undefined}
        {...props}
      >
        {children}
      </Comp>
    );
  }

  return (
    <button
      ref={ref}
      className={cn(buttonV7({ variant, size, block }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      ) : succeeded ? (
        <Check className="h-4 w-4 animate-scale-in" aria-hidden />
      ) : (
        icon
      )}
      {children}
      {!loading && trailing}
    </button>
  );
});
