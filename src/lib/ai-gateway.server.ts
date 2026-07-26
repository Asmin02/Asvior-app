// AI Gateway provider used by the Asvior AI concierge.
// Uses an OpenAI-compatible upstream (currently routed via the AI gateway service).
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export function createAsviorAiGatewayProvider(apiKey: string) {
  const baseURL =
    process.env.AI_GATEWAY_BASE_URL || "https://ai.gateway.lovable.dev/v1";
  return createOpenAICompatible({
    name: "asvior",
    baseURL,
    headers: {
      "Lovable-API-Key": apiKey,
      "X-Asvior-SDK": "vercel-ai-sdk",
    },
  });
}
