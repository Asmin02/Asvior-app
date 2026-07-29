import { getOpenRouterModel } from "@/lib/ai-gateway.server";

describe("OpenRouter model selection", () => {
  const originalOpenRouterModel = process.env.OPENROUTER_MODEL;
  const originalLegacyModel = process.env.AI_GATEWAY_MODEL;

  afterEach(() => {
    if (originalOpenRouterModel === undefined) {
      delete process.env.OPENROUTER_MODEL;
    } else {
      process.env.OPENROUTER_MODEL = originalOpenRouterModel;
    }
    if (originalLegacyModel === undefined) {
      delete process.env.AI_GATEWAY_MODEL;
    } else {
      process.env.AI_GATEWAY_MODEL = originalLegacyModel;
    }
  });

  it("defaults to openrouter/free when no env override is present", () => {
    delete process.env.OPENROUTER_MODEL;
    delete process.env.AI_GATEWAY_MODEL;

    expect(getOpenRouterModel()).toBe("openrouter/free");
  });

  it("uses OPENROUTER_MODEL when it is supplied", () => {
    process.env.OPENROUTER_MODEL = "anthropic/claude-3.5-sonnet";
    delete process.env.AI_GATEWAY_MODEL;

    expect(getOpenRouterModel()).toBe("anthropic/claude-3.5-sonnet");
  });

  it("trims surrounding whitespace from OPENROUTER_MODEL", () => {
    process.env.OPENROUTER_MODEL = "   openai/gpt-4o-mini\n";
    delete process.env.AI_GATEWAY_MODEL;

    expect(getOpenRouterModel()).toBe("openai/gpt-4o-mini");
  });

  it("treats an empty OPENROUTER_MODEL as unset and falls back to the default", () => {
    process.env.OPENROUTER_MODEL = "   ";
    delete process.env.AI_GATEWAY_MODEL;

    expect(getOpenRouterModel()).toBe("openrouter/free");
  });

  it("never resolves to the retired google/gemini-2.0-flash-001 by default", () => {
    delete process.env.OPENROUTER_MODEL;
    delete process.env.AI_GATEWAY_MODEL;

    // Guardrail: the production 404 (No endpoints found for
    // google/gemini-2.0-flash-001) was caused by this exact id being the
    // hard-coded default. If it ever comes back, this test fails.
    expect(getOpenRouterModel()).not.toBe("google/gemini-2.0-flash-001");
    expect(getOpenRouterModel()).not.toMatch(/gemini-2\.0-flash/);
  });
});
