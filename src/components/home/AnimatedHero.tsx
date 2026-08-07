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
];

/**
 * Fully animated hero backdrop. No bitmap image — the entire card is a live
 * sky scene (sun, light rays, drifting clouds, aurora, parallax ridges,
 * flowing particles and an aeroplane crossing) that sits behind the content.
 */
export function AnimatedHero({ children }: { children: ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden rounded-[1.75rem] border border-white/10 shadow-[0_24px_60px_-40px_rgb(0_0_0/0.6)]">
      <div aria-hidden className="hero-sky">
        <span className="hero-aurora" />
        <span className="hero-sun" />
        <span className="hero-rays" />

        <span className="hero-cloud hero-cloud-3" />
        <span className="hero-cloud hero-cloud-1" />
        <span className="hero-cloud hero-cloud-2" />

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

        <span className="hero-plane">
          <span className="relative block">
            <span className="hero-trail" />
            <Plane className="h-4 w-4 rotate-[24deg]" strokeWidth={1.7} />
          </span>
        </span>

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

        {/* Readability veil — blends the scene into one component */}
        <span className="absolute inset-0 bg-gradient-to-tr from-slate-950/70 via-slate-950/25 to-transparent" />
        <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950/55 to-transparent" />
      </div>

      <div className="relative px-6 py-8">{children}</div>
    </section>
  );
}
