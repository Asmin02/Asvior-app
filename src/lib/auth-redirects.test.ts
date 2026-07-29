import {
  getAuthSiteUrl,
  getEmailVerificationRedirectUrl,
  getMagicLinkRedirectUrl,
  getOAuthRedirectUrl,
  getPasswordResetRedirectUrl,
} from "@/lib/auth-redirects";

describe("auth redirects", () => {
  const originalWindow = globalThis.window;
  const originalViteSiteUrl = process.env.VITE_SITE_URL;

  afterEach(() => {
    if (originalWindow) {
      Object.defineProperty(globalThis, "window", {
        value: originalWindow,
        configurable: true,
      });
    }
    if (originalViteSiteUrl === undefined) {
      delete process.env.VITE_SITE_URL;
    } else {
      process.env.VITE_SITE_URL = originalViteSiteUrl;
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

  it("ignores a stale VITE_SITE_URL env override for auth redirects", () => {
    // Belt-and-suspenders: even if a previous deployment (e.g. Lovable)
    // baked VITE_SITE_URL into the runtime, Supabase confirmation and
    // password-reset emails must STILL come home to https://asvior.app.
    process.env.VITE_SITE_URL = "https://legacy-lovable-preview.example.com";
    Object.defineProperty(globalThis, "window", {
      value: { location: { origin: "https://legacy-lovable-preview.example.com/" } },
      configurable: true,
    });

    expect(getAuthSiteUrl()).toBe("https://asvior.app");
    expect(getEmailVerificationRedirectUrl()).toBe("https://asvior.app/auth/callback");
    expect(getPasswordResetRedirectUrl()).toBe("https://asvior.app/auth/callback?type=recovery");
  });
});
