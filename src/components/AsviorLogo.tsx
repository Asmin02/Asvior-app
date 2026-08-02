import { cn } from "@/lib/utils";
import logoFull from "@/assets/asvior-logo-full.png";

type AsviorLogoProps = {
  className?: string;
  /** Show tagline under wordmark when space allows */
  showTagline?: boolean;
};

export function AsviorLogo({ className, showTagline = true }: AsviorLogoProps) {
  return (
    <img
      src={logoFull}
      alt="ASVIOR — Your Journey, Elevated"
      className={cn(
        "h-auto w-auto max-w-full select-none object-contain",
      !showTagline && "[clip-path:inset(0_0_20%_0)] object-[center_12%]",
        className,
      )}
      draggable={false}
    />
  );
}
