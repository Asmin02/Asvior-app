import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `You are VisaPilot AI, a world-class travel concierge inside the VisaPilot app. You help travelers with:

- Visa requirements, types (tourist, business, transit, eVisa, VoA), and processing times
- Required documents and passport validity (typically 6 months beyond stay)
- Entry requirements, customs rules, immigration tips
- Local currency, weather, best travel season, language, time zone
- Travel budget estimation (flights, hotels, food, transport)
- Packing checklists tailored to destination and season
- Safety tips and embassy / consulate information
- Recommending official government and embassy websites

Style:
- Warm, concise, confident. Use short paragraphs, bullet lists, and bold key terms.
- Always tailor answers to the passport country and destination when known. Ask one short clarifying question if essential info is missing.
- Use emoji sparingly (✈️ 🛂 💼 🌤️ 💰) to add warmth, not clutter.

CRITICAL: End substantive travel/visa answers with a brief disclaimer reminding users to verify with the official embassy or government immigration site before travel, and link to the relevant official portal when possible (e.g. travel.state.gov, gov.uk/visas-immigration, schengenvisainfo.com, official embassy of the destination country).`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as { messages?: UIMessage[] };
          const messages = body.messages;
          if (!Array.isArray(messages)) {
            return new Response("Messages are required", { status: 400 });
          }
          const key = process.env.LOVABLE_API_KEY;
          if (!key) {
            return new Response("Missing LOVABLE_API_KEY", { status: 500 });
          }

          const gateway = createLovableAiGatewayProvider(key);
          const result = streamText({
            model: gateway("google/gemini-3-flash-preview"),
            system: SYSTEM_PROMPT,
            messages: await convertToModelMessages(messages),
          });

          return result.toUIMessageStreamResponse({ originalMessages: messages });
        } catch (err) {
          console.error("chat error", err);
          const msg = err instanceof Error ? err.message : "Unknown error";
          return new Response(msg, { status: 500 });
        }
      },
    },
  },
});
