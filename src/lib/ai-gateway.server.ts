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
// OpenRouter's free auto-router. Picks a working free-tier model at
// request time so we do NOT hard-code a specific model id that OpenRouter
// might retire (this was the cause of the production 404
// "No endpoints found for google/gemini-2.0-flash-001"). Override with
// OPENROUTER_MODEL in Vercel to target a specific paid model.
const OPENROUTER_DEFAULT_MODEL = "openrouter/free";
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
  // Trim so an accidental " openrouter/free" or trailing newline in Vercel
  // env still resolves cleanly. Empty string is treated as "not set" so
  // clearing the env var falls back to the default rather than sending an
  // empty model id to OpenRouter.
  const override = process.env.OPENROUTER_MODEL?.trim() || process.env.AI_GATEWAY_MODEL?.trim();
  return override || OPENROUTER_DEFAULT_MODEL;
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
