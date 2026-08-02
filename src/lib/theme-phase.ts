/* =========================================================
   ASVIOR — Time-of-day theme engine
   A single source of truth for the app's dynamic "phase".
   The resolved phase drives ambient color tokens app-wide
   (see [data-phase="…"] rules in styles.css) and layers on
   top of the existing light / dark modes.
   ========================================================= */

export type DayPhase = "morning" | "afternoon" | "evening" | "night";

/** "auto" follows the device clock; any DayPhase locks that look. */
export type PhaseMode = "auto" | DayPhase;

export const PHASE_ORDER: DayPhase[] = ["morning", "afternoon", "evening", "night"];

export const PHASE_MODE_STORAGE_KEY = "vp_phase_mode_v1";

export const PHASE_LABELS: Record<DayPhase, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  night: "Night",
};

/** Short descriptors used in the settings picker. */
export const PHASE_DESCRIPTIONS: Record<DayPhase, string> = {
  morning: "Warm sunrise gold",
  afternoon: "Bright clear sky",
  evening: "Sunset amber & violet",
  night: "Deep midnight indigo",
};

/** Friendly greeting for the current phase / time. */
export function greetingFor(date = new Date()): string {
  const h = date.getHours();
  if (h < 5) return "Still up?";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 22) return "Good evening";
  return "Good night";
}

/** Maps a clock time to a phase. */
export function dayPhaseFor(date = new Date()): DayPhase {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 22) return "evening";
  return "night";
}

/** Resolves the active phase from a mode + optional reference time. */
export function resolvePhase(mode: PhaseMode, date = new Date()): DayPhase {
  return mode === "auto" ? dayPhaseFor(date) : mode;
}

export function isPhaseMode(value: unknown): value is PhaseMode {
  return (
    value === "auto" ||
    (typeof value === "string" && (PHASE_ORDER as string[]).includes(value))
  );
}

export function readStoredPhaseMode(): PhaseMode {
  if (typeof localStorage === "undefined") return "auto";
  try {
    const raw = localStorage.getItem(PHASE_MODE_STORAGE_KEY);
    return isPhaseMode(raw) ? raw : "auto";
  } catch {
    return "auto";
  }
}

export function storePhaseMode(mode: PhaseMode): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(PHASE_MODE_STORAGE_KEY, mode);
  } catch {
    // Non-blocking: persistence is best-effort.
  }
}

/** Utility class that paints the Home-style hero surface for a phase. */
export function phaseSurfaceClass(phase: DayPhase): string {
  return `phase-${phase}`;
}
