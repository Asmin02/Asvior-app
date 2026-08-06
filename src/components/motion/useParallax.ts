import { useEffect, useRef } from "react";

/**
 * Lightweight parallax. Writes a CSS custom property on the node from a
 * rAF-throttled scroll listener so the browser can keep the transform on the
 * compositor (no React re-renders, no layout reads per frame beyond one rect).
 */
export function useParallax<T extends HTMLElement>(speed = 0.28, maxPx = 140) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      // -1 (below viewport) .. 1 (above viewport)
      const progress = (rect.top + rect.height / 2 - viewport / 2) / viewport;
      const offset = Math.max(-maxPx, Math.min(maxPx, -progress * speed * viewport));
      node.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [speed, maxPx]);

  return ref;
}
