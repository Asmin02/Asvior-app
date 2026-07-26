// Asvior AI concierge — OpenAI-compatible AI gateway provider.
//
// The provider is fully configurable via environment variables so the
// operator can point at any OpenAI-compatible endpoint (self-hosted, OpenAI,
// Groq, Together, Fireworks, or a private AI gateway). No third-party
// vendor is hard-coded in this file.
//
// Required env vars for chat to work:
//   AI_GATEWAY_BASE_URL     — full URL to the /v1 endpoint (required)
//   AI_GATEWAY_API_KEY      — bearer key sent as Authorization: Bearer <key>
//                             AND as the header configured in
//                             AI_GATEWAY_API_KEY_HEADER (default: none)
//
// Optional:
//   AI_GATEWAY_API_KEY_HEADER — custom header name for the API key (some
//                               proprietary gateways require a bespoke header
//                               like "X-Api-Key" or similar).
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export class MissingAiGatewayConfigError extends Error {
  constructor(missing: string[]) {
    super(
      `Missing AI gateway environment variable(s): ${missing.join(", ")}. ` +
        `Set AI_GATEWAY_BASE_URL and AI_GATEWAY_API_KEY in Vercel Project Settings.`,
    );
    this.name = "MissingAiGatewayConfigError";
  }
}

export function createAsviorAiGatewayProvider(apiKey: string) {
  const baseURL = process.env.AI_GATEWAY_BASE_URL;
  if (!baseURL) throw new MissingAiGatewayConfigError(["AI_GATEWAY_BASE_URL"]);

  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    "X-Asvior-SDK": "vercel-ai-sdk",
  };
  const customHeader = process.env.AI_GATEWAY_API_KEY_HEADER;
  if (customHeader) headers[customHeader] = apiKey;

  return createOpenAICompatible({
    name: "asvior",
    baseURL,
    headers,
  });
}
