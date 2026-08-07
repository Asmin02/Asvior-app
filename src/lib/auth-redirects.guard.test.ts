import {
  AUTH_CALLBACK_URL,
  assertAuthRedirectUrl,
  getEmailVerificationRedirectUrl,
  getPasswordResetRedirectUrl,
  getPasswordResetTemplateHref,
  getEmailConfirmationTemplateHref,
} from "@/lib/auth-redirects";

describe("auth redirect guards", () => {
  it("uses hard-coded production callback URLs", () => {
    expect(AUTH_CALLBACK_URL).toBe("https://asvior.app/auth/callback");
    expect(getEmailVerificationRedirectUrl()).toBe("https://asvior.app/auth/callback");
    expect(getPasswordResetRedirectUrl()).toBe(
      "https://asvior.app/auth/callback?type=recovery",
    );
  });

  it("email template hrefs never use SiteURL placeholder", () => {
    expect(getEmailConfirmationTemplateHref()).toBe(
      "https://asvior.app/auth/callback?token_hash={{ .TokenHash }}&type=email",
    );
    expect(getPasswordResetTemplateHref()).toBe(
      "https://asvior.app/auth/callback?token_hash={{ .TokenHash }}&type=recovery",
    );
    expect(getEmailConfirmationTemplateHref()).not.toContain("SiteURL");
  });

  it("rejects malformed redirect URLs", () => {
    expect(() => assertAuthRedirectUrl("http:///auth/callback", "test")).toThrow();
    expect(() => assertAuthRedirectUrl("/auth/callback", "test")).toThrow();
    expect(() => assertAuthRedirectUrl("http://localhost/auth/callback", "test")).toThrow();
    expect(() =>
      assertAuthRedirectUrl("https://preview.lovable.app/auth/callback", "test"),
    ).toThrow();
  });
});
