import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GlobalImmigrationUpdates } from "@/components/home/GlobalImmigrationUpdates";
import { normalizeHomeVisaUpdate, type HomeVisaUpdate } from "@/data/home-feed";

const sampleItems: HomeVisaUpdate[] = [
  {
    id: "sample-1",
    countryCode: "GB",
    title: "Guidance: English language requirement levels for immigration applications",
    summary: "This document sets out the English language requirement levels for different visa routes.",
    publishedAt: "2026-08-07T09:54:12.000Z",
    source: "UK Visas and Immigration",
    url: "https://www.gov.uk/government/publications/english-language-requirement-levels-for-immigration-applications",
    countryName: "United Kingdom",
    region: "europe",
    isOfficial: true,
    importance: 16,
    badges: ["new", "visa", "immigration"],
  },
];

function renderFeed(items: HomeVisaUpdate[]) {
  render(
    <GlobalImmigrationUpdates
      items={items}
      loading={false}
      meta={{ fetchedAt: "2026-08-07T18:28:58.993Z", stale: false }}
      maxVisible={12}
    />,
  );
}

describe("GlobalImmigrationUpdates", () => {
  it("renders loaded feed without crashing", () => {
    renderFeed(sampleItems);
    expect(screen.getByRole("heading", { name: "Global Immigration Updates" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Read more/i }).length).toBeGreaterThan(0);
  });

  it("handles legacy cached rows without badges", () => {
    const legacy = normalizeHomeVisaUpdate({
      id: "legacy",
      countryCode: "MY",
      title: "SISPAA",
      summary: "SISPAA",
      publishedAt: "2023-07-11T05:15:30.000Z",
      source: "Immigration Department of Malaysia",
      url: "https://www.imi.gov.my/index.php/2023/07/11/sispaa/",
    });
    expect(() => renderFeed([legacy])).not.toThrow();
    expect(screen.getByText("Malaysia")).toBeInTheDocument();
  });
});
