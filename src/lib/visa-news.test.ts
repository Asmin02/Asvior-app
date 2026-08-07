import { describe, expect, it } from "vitest";
import { decodeHtmlEntities } from "@/lib/visa-news.server";

describe("decodeHtmlEntities", () => {
  it("decodes numeric entities used in RSS titles", () => {
    expect(decodeHtmlEntities("Lawatan (JPJ) &#8211; 8 Januari 2018")).toBe(
      "Lawatan (JPJ) – 8 Januari 2018",
    );
  });

  it("decodes named entities", () => {
    expect(decodeHtmlEntities("Tom &amp; Jerry &quot;Trip&quot;")).toBe('Tom & Jerry "Trip"');
  });
});
