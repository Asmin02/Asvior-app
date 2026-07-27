import { getRuntimeHealth } from "@/lib/runtime-health";

describe("runtime health", () => {
  it("fails when AI gateway key is missing", () => {
    const health = getRuntimeHealth({
      AI_GATEWAY_BASE_URL: "https://gateway.example.com/v1",
      SUPABASE_URL: "https://rxhthyqirdafhkymztvb.supabase.co",
      SUPABASE_PUBLISHABLE_KEY: "sb_publishable_x",
      NODE_ENV: "production",
    });

    expect(health.ok).toBe(false);
    expect(health.required.AI_GATEWAY_API_KEY).toBe(false);
  });

  it("passes when all production env vars are present", () => {
    const health = getRuntimeHealth({
      AI_GATEWAY_API_KEY: "secret",
      AI_GATEWAY_BASE_URL: "https://gateway.example.com/v1",
      SUPABASE_URL: "https://rxhthyqirdafhkymztvb.supabase.co",
      SUPABASE_PUBLISHABLE_KEY: "sb_publishable_x",
      VERCEL_ENV: "production",
    });

    expect(health.ok).toBe(true);
    expect(health.environment).toBe("production");
  });
});
