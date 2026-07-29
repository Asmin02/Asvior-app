import { describe, expect, it } from "vitest";

import { CANONICAL_ORIGIN, buildCanonicalUrl, isCanonicalHost, normalizeHost } from "@/lib/seo";

describe("SEO canonical host detection", () => {
  it("recognises asvior.app and www.asvior.app as canonical", () => {
    expect(isCanonicalHost("asvior.app")).toBe(true);
    expect(isCanonicalHost("www.asvior.app")).toBe(true);
    expect(isCanonicalHost("ASVIOR.APP")).toBe(true);
    expect(isCanonicalHost("asvior.app:443")).toBe(true);
  });

  it("marks Vercel deployment hostnames as non-canonical", () => {
    expect(isCanonicalHost("asvior-main.vercel.app")).toBe(false);
    expect(isCanonicalHost("asvior-git-fix-seo.vercel.app")).toBe(false);
    expect(isCanonicalHost("asvior-abc123.vercel.app")).toBe(false);
  });

  it("marks IP-only hosts and empty hosts as non-canonical", () => {
    expect(isCanonicalHost("localhost")).toBe(false);
    expect(isCanonicalHost("127.0.0.1")).toBe(false);
    expect(isCanonicalHost("")).toBe(false);
    expect(isCanonicalHost(null)).toBe(false);
    expect(isCanonicalHost(undefined)).toBe(false);
  });
});

describe("SEO canonical URL builder", () => {
  it("returns the bare origin for the homepage", () => {
    expect(buildCanonicalUrl("/")).toBe(CANONICAL_ORIGIN);
  });

  it("preserves the pathname for interior routes", () => {
    expect(buildCanonicalUrl("/visa-check")).toBe("https://asvior.app/visa-check");
    expect(buildCanonicalUrl("/country/JP")).toBe("https://asvior.app/country/JP");
  });

  it("adds a leading slash if the caller forgot", () => {
    expect(buildCanonicalUrl("about")).toBe("https://asvior.app/about");
  });
});

describe("normalizeHost", () => {
  it("lowercases and strips the port", () => {
    expect(normalizeHost("ASVIOR.APP:443")).toBe("asvior.app");
    expect(normalizeHost("Localhost:3000")).toBe("localhost");
  });

  it("survives nullish input", () => {
    expect(normalizeHost(null)).toBe("");
    expect(normalizeHost(undefined)).toBe("");
  });
});
