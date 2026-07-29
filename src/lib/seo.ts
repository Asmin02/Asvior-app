// Small, framework-agnostic helpers for SEO / canonical host handling.
//
// Kept out of the SSR entry so both `src/server.ts` and the future
// (unit-testable) code can share the same rules.

export const CANONICAL_ORIGIN = "https://asvior.app";
// Hosts that ARE the public Asvior brand. Requests reaching Vercel with a
// Host header outside this set (e.g. `asvior-main.vercel.app`,
// `asvior-git-*.vercel.app`, or a raw Vercel deployment id) will be
// served with `X-Robots-Tag: noindex, nofollow` so they cannot compete
// with asvior.app in search-engine results pages.
const CANONICAL_HOSTS = new Set<string>(["asvior.app", "www.asvior.app"]);

export function normalizeHost(rawHost: string | null | undefined): string {
  return (rawHost ?? "").toLowerCase().replace(/:\d+$/, "");
}

export function isCanonicalHost(host: string | null | undefined): boolean {
  return CANONICAL_HOSTS.has(normalizeHost(host));
}

export function buildCanonicalUrl(pathname: string): string {
  const cleanPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  // Trailing slash on the root only — every other path is exact.
  return `${CANONICAL_ORIGIN}${cleanPath === "/" ? "" : cleanPath}`;
}
