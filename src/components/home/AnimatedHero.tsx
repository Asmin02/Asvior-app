import type { ReactNode } from "react";
import { Plane } from "lucide-react";

const PARTICLES = [
  { left: "12%", top: "62%", size: 3, dur: 9, delay: 0 },
  { left: "28%", top: "78%", size: 2, dur: 12, delay: 2.5 },
  { left: "44%", top: "55%", size: 2.5, dur: 10, delay: 1.2 },
  { left: "61%", top: "72%", size: 2, dur: 14, delay: 4 },
  { left: "76%", top: "60%", size: 3, dur: 11, delay: 3 },
  { left: "88%", top: "80%", size: 2, dur: 13, delay: 5.5 },
  { left: "35%", top: "34%", size: 1.5, dur: 15, delay: 1.8 },
  { left: "68%", top: "28%", size: 1.5, dur: 16, delay: 6 },
  { left: "5%", top: "44%", size: 2, dur: 17, delay: 7.5 },
  { left: "52%", top: "86%", size: 2.5, dur: 12, delay: 8.5 },
];

const BIRDS = [
  { top: "30%", scale: 1, dur: 34, delay: 0 },
  { top: "36%", scale: 0.72, dur: 34, delay: 1.1 },
  { top: "25%", scale: 0.58, dur: 34, delay: 2.2 },
];

/**
 * Fully animated hero backdrop — a live sky scene rendered corner to corner.
 * Sun, sweeping rays, aurora, drifting clouds and fog, parallax ridges, a
 * shimmering water plane, a bird flock, two aircraft and flowing particles,
 * all wrapped in a slow camera drift. No bitmap image anywhere.
 */
export function AnimatedHero({ children }: { children: ReactNode }) {
  return (
    <section className="hero-shell relative isolate overflow-hidden rounded-[1.75rem] border border-white/10">
      <div aria-hidden className="hero-sky">
        <div className="hero-camera">
          <span className="hero-aurora" />
          <span className="hero-sun" />
          <span className="hero-rays" />
          <span className="hero-shimmer" />

          <span className="hero-cloud hero-cloud-3" />
          <span className="hero-cloud hero-cloud-1" />
          <span className="hero-cloud hero-cloud-2" />
          <span className="hero-fog" />

          {PARTICLES.map((p) => (
            <span
              key={`${p.left}-${p.top}`}
              className="hero-particle"
              style={{
                left: p.left,
                top: p.top,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDuration: `${p.dur}s`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}

          {/* Distant bird flock */}
          {BIRDS.map((b) => (
            <span
              key={`${b.top}-${b.delay}`}
              className="hero-bird"
              style={{
                top: b.top,
                transform: `scale(${b.scale})`,
                animationDuration: `${b.dur}s`,
                animationDelay: `-${b.delay}s`,
              }}
            >
              <svg viewBox="0 0 24 10" className="h-2.5 w-6">
                <path
                  d="M1 6 C4 1, 7 1, 10.5 5.4 C14 1, 17 1, 23 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          ))}

          {/* Parallax ridges */}
          <svg
            className="hero-ridge hero-ridge-back"
            viewBox="0 0 400 90"
            preserveAspectRatio="none"
            height="52%"
          >
            <path d="M0 90 L0 52 L60 24 L120 56 L190 18 L260 58 L330 30 L400 62 L400 90 Z" fill="rgba(15,23,42,0.35)" />
          </svg>
          <svg
            className="hero-ridge hero-ridge-mid"
            viewBox="0 0 400 90"
            preserveAspectRatio="none"
            height="40%"
          >
            <path d="M0 90 L0 66 L70 40 L140 70 L210 38 L290 72 L360 48 L400 70 L400 90 Z" fill="rgba(15,23,42,0.45)" />
          </svg>
          <svg
            className="hero-ridge hero-ridge-front"
            viewBox="0 0 400 90"
            preserveAspectRatio="none"
            height="28%"
          >
            <path d="M0 90 L0 76 L80 58 L160 80 L240 56 L320 82 L400 64 L400 90 Z" fill="rgba(15,23,42,0.6)" />
          </svg>

          {/* Reflective water plane at the very bottom */}
          <span className="hero-water">
            <span className="hero-water-glint" />
            <span className="hero-water-glint hero-water-glint-2" />
          </span>

          <span className="hero-plane hero-plane-far">
            <Plane className="h-3 w-3 rotate-[18deg]" strokeWidth={1.6} />
          </span>
          <span className="hero-plane">
            <span className="relative block">
              <span className="hero-trail" />
              <Plane className="h-4 w-4 rotate-[24deg]" strokeWidth={1.7} />
            </span>
          </span>
        </div>

        {/* Readability veil — blends the scene into one component */}
        <span className="absolute inset-0 bg-gradient-to-tr from-slate-950/72 via-slate-950/26 to-transparent" />
        <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950/60 to-transparent" />
        <span className="hero-vignette" />
      </div>

      <div className="relative px-6 py-9">{children}</div>
    </section>
  );
}
