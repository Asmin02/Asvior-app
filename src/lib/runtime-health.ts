export type RuntimeHealth = {
  ok: boolean;
  service: string;
  environment: string;
  required: {
    OPENROUTER_API_KEY: boolean;
    SUPABASE_URL: boolean;
    SUPABASE_PUBLISHABLE_KEY: boolean;
  };
};

export function getRuntimeHealth(env: Record<string, string | undefined>): RuntimeHealth {
  const required = {
    OPENROUTER_API_KEY: Boolean(env.OPENROUTER_API_KEY),
    SUPABASE_URL: Boolean(env.SUPABASE_URL || env.VITE_SUPABASE_URL),
    SUPABASE_PUBLISHABLE_KEY: Boolean(
      env.SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY,
    ),
  };

  return {
    ok: Object.values(required).every(Boolean),
    service: "asvior",
    environment: env.VERCEL_ENV || env.NODE_ENV || "unknown",
    required,
  };
}
