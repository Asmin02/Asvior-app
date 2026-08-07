import { describe, expect, it, vi, beforeEach } from "vitest";
import { exchangeAuthCallbackSession, inferAuthFlowType } from "@/lib/auth-callback-exchange";

function mockSupabase() {
  return {
    auth: {
      verifyOtp: vi.fn().mockResolvedValue({ error: null }),
      exchangeCodeForSession: vi.fn().mockResolvedValue({ error: null }),
      setSession: vi.fn().mockResolvedValue({ error: null }),
    },
  };
}

describe("exchangeAuthCallbackSession", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("prefers token_hash verification for email links", async () => {
    const supabase = mockSupabase();
    const result = await exchangeAuthCallbackSession(
      supabase as never,
      { token_hash: "abc123", type: "email" },
      { flow: "signup", supabaseUrl: "https://ehfziddmhssffdvcxgzi.supabase.co" },
    );

    expect(result.error).toBeNull();
    expect(supabase.auth.verifyOtp).toHaveBeenCalledWith({
      token_hash: "abc123",
      type: "email",
    });
    expect(supabase.auth.exchangeCodeForSession).not.toHaveBeenCalled();
  });

  it("uses recovery type for password reset token_hash links", async () => {
    const supabase = mockSupabase();
    await exchangeAuthCallbackSession(
      supabase as never,
      { token_hash: "reset123", type: "recovery" },
      { flow: "recovery", supabaseUrl: "https://ehfziddmhssffdvcxgzi.supabase.co" },
    );

    expect(supabase.auth.verifyOtp).toHaveBeenCalledWith({
      token_hash: "reset123",
      type: "recovery",
    });
  });

  it("falls back to PKCE code exchange when no token_hash", async () => {
    const supabase = mockSupabase();
    await exchangeAuthCallbackSession(
      supabase as never,
      { code: "pkce-code" },
      { flow: "other", supabaseUrl: "https://ehfziddmhssffdvcxgzi.supabase.co" },
    );

    expect(supabase.auth.exchangeCodeForSession).toHaveBeenCalledWith("pkce-code");
  });

  it("returns a friendly error when PKCE verifier is missing", async () => {
    const supabase = mockSupabase();
    supabase.auth.exchangeCodeForSession = vi.fn().mockResolvedValue({
      error: new Error("PKCE code verifier not found in storage."),
    });

    const result = await exchangeAuthCallbackSession(
      supabase as never,
      { code: "pkce-code-missing-verifier" },
      { flow: "signup", supabaseUrl: "https://ehfziddmhssffdvcxgzi.supabase.co" },
    );

    expect(result.error?.message).toMatch(/same browser/i);
  });
});

describe("inferAuthFlowType", () => {
  it("maps email query type to signup flow", () => {
    expect(inferAuthFlowType("email")).toBe("signup");
  });
});
