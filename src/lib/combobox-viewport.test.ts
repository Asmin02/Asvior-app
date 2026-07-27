import { computeComboboxViewport } from "@/lib/combobox-viewport";

describe("computeComboboxViewport", () => {
  it("places menu below trigger when there is space", () => {
    const result = computeComboboxViewport({
      triggerTop: 120,
      triggerBottom: 160,
      triggerLeft: 24,
      triggerWidth: 300,
      viewportWidth: 390,
      viewportHeight: 844,
    });

    expect(result.placeAbove).toBe(false);
    expect(result.maxHeight).toBeGreaterThan(200);
    expect(result.width).toBeLessThanOrEqual(366);
  });

  it("places menu above when keyboard reduces bottom space", () => {
    const result = computeComboboxViewport({
      triggerTop: 520,
      triggerBottom: 560,
      triggerLeft: 16,
      triggerWidth: 320,
      viewportWidth: 390,
      viewportHeight: 620,
    });

    expect(result.placeAbove).toBe(true);
    expect(result.maxHeight).toBeGreaterThanOrEqual(140);
  });
});
