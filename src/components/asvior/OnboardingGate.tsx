import { useEffect, useState, type ReactNode } from "react";
import { Globe, Sparkles, Shield } from "lucide-react";

const STORAGE_KEY = "asvior_onboarded_v2";

const slides = [
  {
    icon: Globe,
    title: "Discover the world",
    body: "Immersive destination guides, visa intelligence, and travel inspiration curated for you.",
  },
  {
    icon: Shield,
    title: "Travel with confidence",
    body: "Visa requirements, document checklists, and budget tools — everything before you depart.",
  },
  {
    icon: Sparkles,
    title: "Your AI travel companion",
    body: "Plan trips, compare costs, and get instant answers from Asvior AI in natural conversation.",
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
          <div className="asv-empty-illus mx-auto mb-6" style={{ width: 80, height: 80 }}>
            <Icon className="h-9 w-9" />
          </div>
          <h2 className="asv-headline text-center">{slide.title}</h2>
          <p className="asv-subtitle mt-3 text-center">{slide.body}</p>
          <div className="mt-8 flex justify-center gap-2">
            {slides.map((_, i) => (
              <span
                key={i}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === step ? 28 : 8,
                  background: i === step ? "var(--asv-primary)" : "var(--asv-border)",
                }}
              />
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-2.5">
            {isLast ? (
              <button type="button" className="asv-btn asv-btn-primary w-full" onClick={complete}>
                Start exploring
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
