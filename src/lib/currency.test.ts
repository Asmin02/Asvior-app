import { describe, expect, it } from "vitest";
import { convertFromUsd, currencySymbol, formatMoney } from "@/lib/currency";

describe("currency helpers", () => {
  it("converts from USD using known rates", () => {
    expect(convertFromUsd(100, "USD")).toBe(100);
    expect(convertFromUsd(100, "EUR")).toBeCloseTo(92);
  });

  it("returns currency symbols", () => {
    expect(currencySymbol("USD")).toBe("$");
    expect(currencySymbol("EUR")).toBe("€");
  });

  it("formats money with currency code", () => {
    const formatted = formatMoney(10, { currency: "USD" });
    expect(formatted).toContain("10");
  });
});
