import { describe, expect, it, vi } from "vitest";
import { inferAuthFlowType } from "@/lib/auth-callback-exchange";
import { shouldBypassAuthPage } from "@/routes/auth";
import { resolveCallbackParams } from "@/routes/auth.callback";

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

describe("auth callback param resolution", () => {
  it("falls back to window.location.search when parent route strips type", () => {
    vi.stubGlobal("window", {
      location: {
        search: "?token_hash=abc&type=recovery",
      },
    });

    expect(resolveCallbackParams({})).toEqual({
      code: undefined,
      token_hash: "abc",
      type: "recovery",
      error: undefined,
      error_description: undefined,
    });

    vi.unstubAllGlobals();
  });
});
