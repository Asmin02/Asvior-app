import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold cursor-pointer transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asv-primary)]/30 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "asv-btn asv-btn-primary",
        destructive: "asv-btn bg-[var(--asv-danger)] text-white",
        outline: "asv-btn asv-btn-secondary",
        secondary: "asv-btn asv-btn-secondary",
        ghost: "asv-btn asv-btn-ghost",
        link: "text-[var(--asv-primary)] underline-offset-4 hover:underline bg-transparent min-h-0 p-0",
      },
      size: {
        default: "min-h-12 px-5 text-sm rounded-[var(--asv-radius-md)]",
        sm: "min-h-10 px-4 text-xs rounded-[var(--asv-radius-sm)]",
        lg: "min-h-[52px] px-6 text-base rounded-[var(--asv-radius-md)]",
        icon: "asv-btn asv-btn-icon min-h-11 w-11",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
