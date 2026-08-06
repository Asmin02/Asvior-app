import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Drop-in <img> that crossfades once decoded instead of popping in.
 * The element keeps the exact same box as before (no wrapper, no sizing
 * changes), so it cannot introduce layout shift — only the opacity animates.
 */
export function SmoothImage({
  className,
  onLoad,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  const ref = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (node?.complete) setLoaded(true);
  }, []);

  return (
    <img
      ref={ref}
      decoding="async"
      data-loaded={loaded ? "true" : "false"}
      onLoad={(event) => {
        setLoaded(true);
        onLoad?.(event);
      }}
      className={cn("img-fade", className)}
      {...props}
    />
  );
}
