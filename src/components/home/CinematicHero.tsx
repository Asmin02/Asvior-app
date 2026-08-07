import type { ReactNode } from "react";

const FRAMES = [
  { src: "/hero/hero-cine-1.jpg", alt: "Aerial view of a tropical coastline at golden hour" },
  { src: "/hero/hero-cine-2.jpg", alt: "Airplane wing above a sea of clouds at sunrise" },
  { src: "/hero/hero-cine-3.jpg", alt: "City skyline reflected on calm water at blue hour" },
];


/**
 * Cinematic photographic hero — three real landscape frames crossfading with a
 * slow Ken Burns camera move, layered atmospheric haze, a drifting light sweep
 * and a curved bottom edge that melts into the page content below.
 */
export function CinematicHero({ children }: { children: ReactNode }) {
  return (
    <section className="cine-hero">
      <div className="cine-hero-stage" aria-hidden="false">
        {FRAMES.map((frame, i) => (
          <img
            key={frame.src}
            src={frame.src}
            alt={i === 0 ? frame.alt : ""}
            aria-hidden={i === 0 ? undefined : true}
            width={1600}
            height={1200}
            fetchPriority={i === 0 ? "high" : "low"}
            decoding="async"
            className="cine-hero-frame"
            style={{ animationDelay: `${i * -10}s` }}
          />
        ))}
        <span aria-hidden className="cine-haze" />
        <span aria-hidden className="cine-haze cine-haze-2" />
        <span aria-hidden className="cine-lightsweep" />
        <span aria-hidden className="cine-grain" />
        <span aria-hidden className="cine-scrim" />
      </div>

      <div className="cine-hero-content">{children}</div>
      <span aria-hidden className="cine-hero-curve" />
    </section>
  );
}
