import { describe, expect, it } from "vitest";
import { inferAuthFlowType } from "@/lib/auth-callback-exchange";
import { shouldBypassAuthPage } from "@/routes/auth";

describe("auth callback flow type detection", () => {
  it("detects recovery from query parameter", () => {
    expect(inferAuthFlowType("recovery", "")).toBe("recovery");
  });

  it("detects recovery from hash fragment", () => {
    expect(inferAuthFlowType(undefined, "#type=recovery")).toBe("recovery");
    expect(inferAuthFlowType(undefined, "access_token=x&type=recovery&refresh_token=y")).toBe(
      "recovery",
    );
  });

  it("detects signup/email confirmation flows", () => {
    expect(inferAuthFlowType("email", "")).toBe("signup");
    expect(inferAuthFlowType("signup", "")).toBe("signup");
    expect(inferAuthFlowType(undefined, "#type=signup")).toBe("signup");
  });

  it("treats other auth links as other", () => {
    expect(inferAuthFlowType(undefined, "")).toBe("other");
    expect(inferAuthFlowType("magiclink", "")).toBe("other");
  });
});

describe("auth page child-route bypass", () => {
  it("bypasses the sign-in page for auth callback paths", () => {
    expect(shouldBypassAuthPage("/auth/callback")).toBe(true);
    expect(shouldBypassAuthPage("/auth/callback/")).toBe(true);
  });

  it("does not bypass the real sign-in page", () => {
    expect(shouldBypassAuthPage("/auth")).toBe(false);
  });
});
