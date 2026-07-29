// Asvior AI concierge — OpenRouter provider (OpenAI-compatible).
//
// OpenRouter exposes an OpenAI-compatible /chat/completions endpoint at
// https://openrouter.ai/api/v1. `@ai-sdk/openai-compatible` already knows
// how to speak that protocol, so we just point it at OpenRouter and add
// the two recommended attribution headers.
//
// Required env vars (Vercel Project Settings — never committed):
//   OPENROUTER_API_KEY   — bearer key from https://openrouter.ai/keys
//
// Optional:
//   OPENROUTER_BASE_URL  — override the endpoint (defaults to the public URL)
//   OPENROUTER_MODEL     — override the default model
//   OPENROUTER_SITE_URL  — used for the `HTTP-Referer` attribution header
//                          (falls back to https://asvior.app)
//   OPENROUTER_APP_NAME  — used for the `X-Title` attribution header
//                          (falls back to "Asvior")
//
// Legacy AI_GATEWAY_* env vars are still honoured so a partial Vercel
// rollout doesn't break /api/chat mid-deploy. Remove them once the
// OPENROUTER_* vars are set in every environment.
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const OPENROUTER_DEFAULT_BASE_URL = "https://openrouter.ai/api/v1";
const OPENROUTER_DEFAULT_MODEL = "google/gemini-2.0-flash-001";
const OPENROUTER_DEFAULT_SITE = "https://asvior.app";
const OPENROUTER_DEFAULT_APP_NAME = "Asvior";

export class MissingOpenRouterConfigError extends Error {
  constructor(missing: string[]) {
    super(
      `Missing OpenRouter environment variable(s): ${missing.join(", ")}. ` +
        `Set OPENROUTER_API_KEY in Vercel Project Settings ` +
        `(https://openrouter.ai/keys).`,
    );
    this.name = "MissingOpenRouterConfigError";
  }
}

export function getOpenRouterApiKey(): string | undefined {
  return process.env.OPENROUTER_API_KEY || process.env.AI_GATEWAY_API_KEY;
}

export function getOpenRouterModel(): string {
  return process.env.OPENROUTER_MODEL || process.env.AI_GATEWAY_MODEL || OPENROUTER_DEFAULT_MODEL;
}

export function createAsviorAiGatewayProvider(apiKey: string) {
  const baseURL =
    process.env.OPENROUTER_BASE_URL ||
    process.env.AI_GATEWAY_BASE_URL ||
    OPENROUTER_DEFAULT_BASE_URL;

  const siteUrl = process.env.OPENROUTER_SITE_URL || OPENROUTER_DEFAULT_SITE;
  const appName = process.env.OPENROUTER_APP_NAME || OPENROUTER_DEFAULT_APP_NAME;

  return createOpenAICompatible({
    name: "openrouter",
    baseURL,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      // OpenRouter's own attribution headers — appear on the OpenRouter
      // dashboard so the operator can see which app is spending credits.
      "HTTP-Referer": siteUrl,
      "X-Title": appName,
      "X-Asvior-SDK": "vercel-ai-sdk",
    },
  });
}
