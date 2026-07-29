import { getRuntimeHealth } from "@/lib/runtime-health";

describe("runtime health", () => {
  it("fails when OpenRouter key is missing", () => {
    const health = getRuntimeHealth({
      SUPABASE_URL: "https://rxhthyqirdafhkymztvb.supabase.co",
      SUPABASE_PUBLISHABLE_KEY: "sb_publishable_x",
      NODE_ENV: "production",
    });

    expect(health.ok).toBe(false);
    expect(health.required.OPENROUTER_API_KEY).toBe(false);
  });

  it("passes when all production env vars are present", () => {
    const health = getRuntimeHealth({
      OPENROUTER_API_KEY: "sk-or-v1-test",
      SUPABASE_URL: "https://rxhthyqirdafhkymztvb.supabase.co",
      SUPABASE_PUBLISHABLE_KEY: "sb_publishable_x",
      VERCEL_ENV: "production",
    });

    expect(health.ok).toBe(true);
    expect(health.environment).toBe("production");
  });

  it("accepts the legacy AI_GATEWAY_API_KEY env for backwards compatibility", () => {
    const health = getRuntimeHealth({
      AI_GATEWAY_API_KEY: "legacy-secret",
      SUPABASE_URL: "https://rxhthyqirdafhkymztvb.supabase.co",
      SUPABASE_PUBLISHABLE_KEY: "sb_publishable_x",
      VERCEL_ENV: "production",
    });

    expect(health.ok).toBe(true);
    expect(health.required.OPENROUTER_API_KEY).toBe(true);
  });
});
