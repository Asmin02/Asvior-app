import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const DEFAULT_OPENROUTER_MODEL = "openrouter/free";

export class MissingOpenRouterConfigError extends Error {
  constructor() {
    super(
      "Missing OPENROUTER_API_KEY. Set it in Vercel or Lovable project secrets before using Asvior AI.",
    );
    this.name = "MissingOpenRouterConfigError";
  }
}

/** Resolve the server-only OpenRouter key from deployment env (Vercel, Lovable, local .env). */
export function getOpenRouterApiKey(): string | undefined {
  const candidates = [
    process.env.OPENROUTER_API_KEY,
    process.env.LOVABLE_OPENROUTER_API_KEY,
    process.env.AI_GATEWAY_API_KEY,
  ];
  for (const value of candidates) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return undefined;
}

/**
 * Creates the server-only provider used by the Asvior AI chat route.
 * OpenRouter implements the OpenAI chat-completions API, so the existing
 * streaming UI can continue to use the AI SDK without client-side credentials.
 */
export function createOpenRouterProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "openrouter",
    baseURL: OPENROUTER_BASE_URL,
    apiKey,
    headers: {
      "HTTP-Referer": process.env.VITE_SITE_URL || "https://asvior.app",
      "X-OpenRouter-Title": "Asvior",
    },
  });
}

export function getOpenRouterModel(): string {
  const configured = process.env.OPENROUTER_MODEL?.trim() || process.env.AI_GATEWAY_MODEL?.trim();
  return configured || DEFAULT_OPENROUTER_MODEL;
}
