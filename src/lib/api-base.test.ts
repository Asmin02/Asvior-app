import { describe, expect, it, vi } from "vitest";

vi.mock("@capacitor/core", () => ({
  Capacitor: { isNativePlatform: vi.fn(() => false) },
}));

import { Capacitor } from "@capacitor/core";
import { resolveApiUrl } from "@/lib/api-base";

describe("resolveApiUrl", () => {
  it("uses a relative path on web", () => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);
    expect(resolveApiUrl("/api/chat")).toBe("/api/chat");
  });

  it("uses the production origin in bundled Capacitor", () => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
    expect(resolveApiUrl("/api/chat")).toBe("https://asvior.app/api/chat");
  });
});
