import { useState } from "react";
import { cn } from "@/lib/utils";
import { SmoothImage } from "@/components/motion/SmoothImage";

/**
 * Premium flag chip.
 *
 * Regional-indicator flag emoji do not render on Android or Windows, which is
 * why flags previously appeared as empty boxes. This renders a real raster
 * flag from flagcdn with a rounded mask, and falls back to a typographic
 * monogram tile if the image fails or the code is unknown.
 *
 * Pure presentation — no data or behaviour lives here.
 */

const SIZES = {
  sm: { box: "h-5 w-7", src: "w40", text: "text-[9px]" },
  md: { box: "h-7 w-10", src: "w80", text: "text-[10px]" },
  lg: { box: "h-9 w-[3.25rem]", src: "w160", text: "text-xs" },
  xl: { box: "h-12 w-[4.5rem]", src: "w320", text: "text-sm" },
} as const;

export type FlagSize = keyof typeof SIZES;

export function CountryFlag({
  code,
  size = "md",
  className,
  rounded = "rounded-lg",
}: {
  code: string | null | undefined;
  size?: FlagSize;
  className?: string;
  rounded?: string;
}) {
  const [failed, setFailed] = useState(false);
  const iso = (code ?? "").trim().toLowerCase();
  const s = SIZES[size];
  const valid = iso.length === 2 && /^[a-z]{2}$/.test(iso);

  if (!valid || failed) {
    return (
      <span
        aria-hidden
        className={cn(
          "inline-flex shrink-0 items-center justify-center bg-muted font-semibold uppercase tracking-[0.06em] text-muted-foreground ring-1 ring-inset ring-border/60",
          s.box,
          s.text,
          rounded,
          className,
        )}
      >
        {iso ? iso.toUpperCase() : "··"}
      </span>
    );
  }

  return (
    <SmoothImage
      src={`https://flagcdn.com/${s.src}/${iso}.png`}
      alt=""
      aria-hidden
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn(
        "shrink-0 object-cover ring-1 ring-inset ring-border/50",
        s.box,
        rounded,
        className,
      )}
    />
  );
}
