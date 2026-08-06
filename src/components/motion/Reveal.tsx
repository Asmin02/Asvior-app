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

    // Respect the OS accessibility setting: show content immediately.
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      setRevealed(true);
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }

    // Already in view on mount (above the fold): reveal on the next frame so
    // the transition still runs but nothing is ever stuck invisible.
    const rect = node.getBoundingClientRect();
    if (rect.top < (window.innerHeight || 0) && rect.bottom > 0) {
      const raf = requestAnimationFrame(() => setRevealed(true));
      if (once) return () => cancelAnimationFrame(raf);
    }


    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            if (once) observer.disconnect();
          } else if (entry.boundingClientRect.bottom <= 0) {
            // Scrolled past faster than the observer could report an
            // intersection — never leave skipped content invisible.
            setRevealed(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setRevealed(false);
          }
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0 },
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
