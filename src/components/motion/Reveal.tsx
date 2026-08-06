import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll-triggered entrance. Purely presentational: the element renders in the
 * DOM immediately (SSR-safe, no layout shift) and only its opacity/transform
 * animate once it enters the viewport.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
  once = true,
}: {
  children: ReactNode;
  /** Stagger offset in ms. */
  delay?: number;
  className?: string;
  as?: ElementType;
  once?: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setRevealed(false);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref as never}
      data-revealed={revealed ? "true" : "false"}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn("reveal", className)}
    >
      {children}
    </Tag>
  );
}
