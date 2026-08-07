import { describe, expect, it } from "vitest";
import { countryCodeFromTravelAdviceUrl, resolveCountryCode } from "@/lib/country-resolver";

describe("country-resolver", () => {
  it("resolves gov.uk travel advice slugs", () => {
    expect(countryCodeFromTravelAdviceUrl("https://www.gov.uk/foreign-travel-advice/germany")).toBe(
      "DE",
    );
    expect(
      countryCodeFromTravelAdviceUrl("https://www.gov.uk/foreign-travel-advice/south-korea"),
    ).toBe("KR");
    expect(
      countryCodeFromTravelAdviceUrl("https://www.gov.uk/foreign-travel-advice/united-arab-emirates"),
    ).toBe("AE");
  });

  it("resolves display names from RSS titles", () => {
    expect(resolveCountryCode("Japan")).toBe("JP");
    expect(resolveCountryCode("Singapore")).toBe("SG");
    expect(resolveCountryCode("United States")).toBe("US");
  });
});
