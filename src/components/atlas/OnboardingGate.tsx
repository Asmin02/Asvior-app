import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Compass, Map, Sparkles } from "lucide-react";

const STORAGE_KEY = "asvior_onboarded_v1";

const slides = [
  {
    icon: Compass,
    title: "Know before you go",
    body: "Visa rules, entry requirements, and document checklists for 199 countries.",
  },
  {
    icon: Map,
    title: "Plan every detail",
    body: "Budget your trip, track packing, and explore destinations with confidence.",
  },
  {
    icon: Sparkles,
    title: "AI travel companion",
    body: "Ask Asvior AI about visas, itineraries, costs, and local tips anytime.",
  },
];

export function OnboardingGate({ children }: { children: ReactNode }) {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "1") setShow(true);
    } catch {
      /* ignore */
    }
  }, []);

  const complete = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  if (!show) return <>{children}</>;

  const slide = slides[step];
  const Icon = slide.icon;
  const isLast = step === slides.length - 1;

  return (
    <>
      {children}
      <div className="asv-onboard" role="dialog" aria-modal="true" aria-label="Welcome to Asvior">
        <div className="asv-onboard-slide">
          <div className="asv-empty-icon mx-auto mb-6" style={{ width: 72, height: 72 }}>
            <Icon className="h-8 w-8" />
          </div>
          <h2 className="asv-headline text-center">{slide.title}</h2>
          <p className="asv-subtitle mt-3 text-center">{slide.body}</p>
          <div className="mt-8 flex gap-2 justify-center">
            {slides.map((_, i) => (
              <span
                key={i}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === step ? 24 : 8,
                  background: i === step ? "var(--asv-primary)" : "var(--asv-border)",
                }}
              />
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-2">
            {isLast ? (
              <button type="button" className="asv-btn asv-btn-primary w-full" onClick={complete}>
                Get started
              </button>
            ) : (
              <button
                type="button"
                className="asv-btn asv-btn-primary w-full"
                onClick={() => setStep((s) => s + 1)}
              >
                Continue
              </button>
            )}
            {!isLast && (
              <button type="button" className="asv-btn asv-btn-ghost w-full" onClick={complete}>
                Skip
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export function OnboardingResetLink() {
  return (
    <button
      type="button"
      className="asv-btn asv-btn-ghost text-xs"
      onClick={() => {
        try {
          localStorage.removeItem(STORAGE_KEY);
          window.location.reload();
        } catch {
          /* ignore */
        }
      }}
    >
      Replay onboarding
    </button>
  );
}
