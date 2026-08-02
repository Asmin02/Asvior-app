import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  dayPhaseFor,
  readStoredPhaseMode,
  storePhaseMode,
  type DayPhase,
  type PhaseMode,
} from "@/lib/theme-phase";

type ThemeContextValue = {
  /** The resolved phase currently applied to the document. */
  phase: DayPhase;
  /** "auto" (clock-driven) or a locked phase chosen by the user. */
  phaseMode: PhaseMode;
  /** Whether the phase follows the device clock. */
  isAuto: boolean;
  setPhaseMode: (mode: PhaseMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyPhaseToDocument(phase: DayPhase) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.phase = phase;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [phaseMode, setPhaseModeState] = useState<PhaseMode>("auto");
  const [autoPhase, setAutoPhase] = useState<DayPhase>(() => dayPhaseFor());

  // Load any persisted manual override once on mount.
  useEffect(() => {
    const stored = readStoredPhaseMode();
    if (stored !== "auto") {
      setPhaseModeState(stored);
    } else {
      setAutoPhase(dayPhaseFor());
    }
  }, []);

  // Keep the clock-driven phase fresh while in auto mode.
  useEffect(() => {
    if (phaseMode !== "auto") return;
    const tick = () => setAutoPhase(dayPhaseFor());
    tick();
    const interval = window.setInterval(tick, 60_000);
    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [phaseMode]);

  const phase = useMemo<DayPhase>(
    () => (phaseMode === "auto" ? autoPhase : phaseMode),
    [phaseMode, autoPhase],
  );

  // Reflect the resolved phase onto <html data-phase> for CSS token scoping.
  useEffect(() => {
    applyPhaseToDocument(phase);
  }, [phase]);

  const setPhaseMode = useCallback((mode: PhaseMode) => {
    setPhaseModeState(mode);
    storePhaseMode(mode);
    if (mode === "auto") setAutoPhase(dayPhaseFor());
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ phase, phaseMode, isAuto: phaseMode === "auto", setPhaseMode }),
    [phase, phaseMode, setPhaseMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemePhase(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemePhase must be used within a ThemeProvider");
  }
  return ctx;
}
