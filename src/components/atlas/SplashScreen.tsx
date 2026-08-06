import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const MIN_MS = 680;

export function SplashScreen() {
  const [phase, setPhase] = useState<"show" | "exit" | "done">("show");

  useEffect(() => {
    const start = performance.now();
    let exitTimer: ReturnType<typeof setTimeout>;
    let doneTimer: ReturnType<typeof setTimeout>;

    const finish = () => {
      const wait = Math.max(0, MIN_MS - (performance.now() - start));
      exitTimer = setTimeout(() => setPhase("exit"), wait);
      doneTimer = setTimeout(() => setPhase("done"), wait + 380);
    };

    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div className={cn("asv-splash", phase === "exit" && "asv-splash--exit")} aria-hidden>
      <svg viewBox="0 0 80 80" className="asv-splash-mark" aria-hidden>
        <circle cx="40" cy="40" r="38" fill="#0055FF" />
        <path
          d="M24 52L38 28H44L30 52H24ZM44 28L58 52H52L46 40L40 52H34L44 28Z"
          fill="#fff"
        />
        <path
          d="M18 44C28 36 40 32 52 36C58 38 62 40 66 44"
          stroke="#FFD166"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <p className="asv-splash-name">Asvior</p>
      <p className="asv-splash-tag">Travel, planned beautifully</p>
    </div>
  );
}
