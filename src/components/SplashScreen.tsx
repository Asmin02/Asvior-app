import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AsviorMark } from "@/components/AsviorMark";

const MIN_MS = 900;

/** Premium in-app splash — matches native splash and sign-in branding. */
export function SplashScreen() {
  const [phase, setPhase] = useState<"enter" | "show" | "exit" | "done">("enter");

  useEffect(() => {
    const enterTimer = setTimeout(() => setPhase("show"), 40);
    const start = performance.now();
    let exitTimer: ReturnType<typeof setTimeout>;
    let doneTimer: ReturnType<typeof setTimeout>;

    const finish = () => {
      const wait = Math.max(0, MIN_MS - (performance.now() - start));
      exitTimer = setTimeout(() => setPhase("exit"), wait);
      doneTimer = setTimeout(() => setPhase("done"), wait + 480);
    };

    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={cn(
        "brand-splash",
        phase === "enter" && "brand-splash--enter",
        phase === "exit" && "brand-splash--exit",
      )}
      aria-hidden
      role="presentation"
    >
      <div className="brand-splash-glow" aria-hidden />
      <div className={cn("brand-splash-mark-wrap", phase === "show" && "brand-splash-mark-wrap--show")}>
        <AsviorMark className="brand-splash-mark" />
      </div>
      <p className={cn("brand-splash-name", phase === "show" && "brand-splash-name--show")}>ASVIOR</p>
      <div className={cn("brand-splash-loader", phase === "show" && "brand-splash-loader--show")} aria-hidden>
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
