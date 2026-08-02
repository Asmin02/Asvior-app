/** Parsed navigation target from a Capacitor deep link (asvior:// or https://). */
export type DeepLinkTarget = {
  pathname: string;
  search: Record<string, string>;
  hash: string;
};

export function parseDeepLinkTarget(rawUrl: string): DeepLinkTarget {
  const url = new URL(rawUrl);
  const search: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    search[key] = value;
  });
  return {
    pathname: url.pathname || "/",
    search,
    hash: url.hash || "",
  };
}

/** Apply hash fragment to the current document URL before the router mounts a route. */
export function applyDeepLinkHash(pathname: string, search: Record<string, string>, hash: string): void {
  if (!hash || typeof window === "undefined") return;
  const query = new URLSearchParams(search).toString();
  const path = query ? `${pathname}?${query}` : pathname;
  window.history.replaceState(null, "", `${path}${hash}`);
}
