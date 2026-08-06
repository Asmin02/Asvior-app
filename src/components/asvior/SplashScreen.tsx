import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const MIN_MS = 720;

export function SplashScreen() {
  const [phase, setPhase] = useState<"show" | "exit" | "done">("show");

  useEffect(() => {
    const start = performance.now();
    let exitTimer: ReturnType<typeof setTimeout>;
    let doneTimer: ReturnType<typeof setTimeout>;

    const finish = () => {
      const wait = Math.max(0, MIN_MS - (performance.now() - start));
      exitTimer = setTimeout(() => setPhase("exit"), wait);
      doneTimer = setTimeout(() => setPhase("done"), wait + 420);
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
      <img src="/asvior-mark.png" alt="" className="asv-splash-mark" width={80} height={80} />
      <p className="asv-splash-name">Asvior</p>
      <p className="asv-splash-tag">Where will AI take you?</p>
    </div>
  );
}
