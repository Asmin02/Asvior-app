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

  it("uses canonical asvior site url format", () => {
    Object.defineProperty(globalThis, "window", {
      value: { location: { origin: "https://asvior.app/" } },
      configurable: true,
    });

    expect(getAuthSiteUrl()).toBe("https://asvior.app");
    expect(getEmailVerificationRedirectUrl()).toBe("https://asvior.app");
    expect(getMagicLinkRedirectUrl()).toBe("https://asvior.app");
    expect(getPasswordResetRedirectUrl()).toBe("https://asvior.app/reset-password");
    expect(getOAuthRedirectUrl()).toBe("https://asvior.app/auth");
  });
});
