/**
 * ASVIOR V7 — Design token contract (TypeScript mirror)
 *
 * The source of truth for every value lives in `src/styles.css`. This module
 * only exposes the *names* so components pick from a closed set instead of
 * inventing one-off classes. Nothing here emits CSS.
 */

/* ---------------- Spacing: 8pt system ---------------- */
export const SPACE = {
  /** 4px — hairline gaps, icon-to-label */
  xs: "1",
  /** 8px — base unit */
  sm: "2",
  /** 12px — dense stacks */
  md: "3",
  /** 16px — default gutter */
  lg: "4",
  /** 24px — section padding */
  xl: "6",
  /** 32px — block separation */
  "2xl": "8",
  /** 48px — major section rhythm */
  "3xl": "12",
} as const;

/** Horizontal page gutter used by every screen. */
export const PAGE_GUTTER = "px-4";
/** Vertical rhythm between top-level sections. */
export const SECTION_GAP = "space-y-8";

/* ---------------- Radius ---------------- */
export const RADIUS = {
  xs: "rounded-xs",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  full: "rounded-full",
} as const;

/* ---------------- Elevation ---------------- */
export const ELEVATION = {
  0: "",
  1: "elev-1",
  2: "elev-2",
  3: "elev-3",
  4: "elev-4",
  5: "elev-5",
  signal: "elev-signal",
} as const;
export type Elevation = keyof typeof ELEVATION;

/* ---------------- Color intents ---------------- */
export const INTENTS = [
  "neutral",
  "signal",
  "aurora",
  "success",
  "warning",
  "danger",
  "info",
] as const;
export type Intent = (typeof INTENTS)[number];

/* ---------------- Motion ---------------- */
export const DURATION = {
  instant: 120,
  fast: 180,
  base: 260,
  slow: 420,
  deliberate: 620,
} as const;

export const EASING = {
  /** Decelerate hard — entrances, card lift */
  outExpo: "var(--ease-out-expo)",
  /** Overshoot — press, pop, nav pill */
  spring: "var(--ease-spring)",
  /** Neutral — color and border transitions */
  standard: "var(--ease-standard)",
  /** Emphasized — sheets, page transitions */
  emphasized: "var(--ease-emphasized)",
} as const;

/* ---------------- Typography scale ---------------- */
export const TYPE = {
  display: "text-display text-4xl",
  displaySm: "text-display text-3xl",
  title: "text-title text-xl",
  titleSm: "text-title text-lg",
  heading: "text-title text-base",
  body: "text-base text-foreground",
  bodyMuted: "text-base text-muted-foreground",
  caption: "text-xs text-muted-foreground",
  eyebrow: "text-eyebrow",
  numeric: "text-numeric",
} as const;

/* ---------------- Icon sizing ---------------- */
export const ICON = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 22,
  xl: 28,
} as const;
/** Default lucide stroke across the app — thinner than lucide's 2 for a premium read. */
export const ICON_STROKE = 1.75;
