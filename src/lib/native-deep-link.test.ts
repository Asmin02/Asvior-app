import { describe, expect, it } from "vitest";
import { applyDeepLinkHash, parseDeepLinkTarget } from "@/lib/native-deep-link";

describe("parseDeepLinkTarget", () => {
  it("parses custom-scheme auth callback with query params", () => {
    const target = parseDeepLinkTarget(
      "asvior://asvior.app/auth/callback?type=recovery&code=abc123",
    );
    expect(target.pathname).toBe("/auth/callback");
    expect(target.search).toEqual({ type: "recovery", code: "abc123" });
    expect(target.hash).toBe("");
  });

  it("parses https app link callback", () => {
    const target = parseDeepLinkTarget(
      "https://asvior.app/auth/callback?code=xyz&type=signup",
    );
    expect(target.pathname).toBe("/auth/callback");
    expect(target.search).toEqual({ code: "xyz", type: "signup" });
  });

  it("captures hash fragments for legacy implicit auth", () => {
    const target = parseDeepLinkTarget(
      "asvior://asvior.app/auth/callback#access_token=a&refresh_token=b&type=recovery",
    );
    expect(target.pathname).toBe("/auth/callback");
    expect(target.hash).toBe("#access_token=a&refresh_token=b&type=recovery");
  });
});

describe("applyDeepLinkHash", () => {
  it("writes hash onto the current document URL", () => {
    window.history.replaceState(null, "", "/");
    applyDeepLinkHash("/auth/callback", { type: "recovery" }, "#access_token=x");
    expect(window.location.pathname).toBe("/auth/callback");
    expect(window.location.search).toBe("?type=recovery");
    expect(window.location.hash).toBe("#access_token=x");
  });
});
