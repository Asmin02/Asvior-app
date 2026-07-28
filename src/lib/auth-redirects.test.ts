import {
  getAuthSiteUrl,
  getEmailVerificationRedirectUrl,
  getMagicLinkRedirectUrl,
  getOAuthRedirectUrl,
  getPasswordResetRedirectUrl,
} from "@/lib/auth-redirects";

describe("auth redirects", () => {
  const originalWindow = globalThis.window;

  afterEach(() => {
    if (originalWindow) {
      Object.defineProperty(globalThis, "window", {
        value: originalWindow,
        configurable: true,
      });
    }
  });

  it("all auth redirects resolve to https://asvior.app/auth/callback", () => {
    // Simulate the tab living on a stale preview origin — auth redirects
    // must STILL come home to asvior.app rather than following the tab.
    Object.defineProperty(globalThis, "window", {
      value: { location: { origin: "https://old-preview.vercel.app/" } },
      configurable: true,
    });

    expect(getAuthSiteUrl()).toBe("https://asvior.app");
    expect(getEmailVerificationRedirectUrl()).toBe("https://asvior.app/auth/callback");
    expect(getMagicLinkRedirectUrl()).toBe("https://asvior.app/auth/callback");
    expect(getPasswordResetRedirectUrl()).toBe("https://asvior.app/auth/callback?type=recovery");
    expect(getOAuthRedirectUrl()).toBe("https://asvior.app/auth/callback");
  });
});
