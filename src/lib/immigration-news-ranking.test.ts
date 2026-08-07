import { describe, expect, it } from "vitest";
import {
  dedupeImmigrationUpdates,
  detectBadges,
  rankImmigrationUpdates,
} from "@/lib/immigration-news-ranking";
import type { HomeVisaUpdate } from "@/data/home-feed";

function item(
  overrides: Partial<HomeVisaUpdate> & Pick<HomeVisaUpdate, "id" | "countryCode" | "title">,
): HomeVisaUpdate {
  return {
    countryName: overrides.countryName ?? overrides.countryCode,
    summary: overrides.summary ?? "Summary text",
    publishedAt: overrides.publishedAt ?? new Date().toISOString(),
    source: overrides.source ?? "Official Source",
    region: overrides.region ?? "europe",
    badges: overrides.badges ?? [],
    importance: overrides.importance ?? 10,
    isOfficial: true,
    ...overrides,
  };
}

describe("dedupeImmigrationUpdates", () => {
  it("removes duplicate titles", () => {
    const items = [
      item({ id: "1", countryCode: "US", title: "Visa update", summary: "First summary" }),
      item({ id: "2", countryCode: "CA", title: "Visa update", summary: "Second summary" }),
    ];
    expect(dedupeImmigrationUpdates(items)).toHaveLength(1);
  });

  it("removes duplicate urls", () => {
    const items = [
      item({
        id: "1",
        countryCode: "US",
        title: "Visa update",
        url: "https://example.com/a",
        summary: "First summary",
      }),
      item({
        id: "2",
        countryCode: "GB",
        title: "Border notice",
        url: "https://example.com/a/",
        summary: "Second summary",
      }),
    ];
    expect(dedupeImmigrationUpdates(items)).toHaveLength(1);
  });
});

describe("rankImmigrationUpdates", () => {
  const now = Date.parse("2026-08-08T12:00:00.000Z");

  it("avoids consecutive articles from the same country when alternatives exist", () => {
    const items = [
      item({
        id: "us-1",
        countryCode: "US",
        title: "US visa policy update",
        publishedAt: "2026-08-08T10:00:00.000Z",
        importance: 40,
      }),
      item({
        id: "us-2",
        countryCode: "US",
        title: "US immigration bulletin",
        publishedAt: "2026-08-08T09:00:00.000Z",
        importance: 35,
      }),
      item({
        id: "ca-1",
        countryCode: "CA",
        title: "Canada immigration news",
        publishedAt: "2026-08-07T10:00:00.000Z",
        importance: 30,
      }),
      item({
        id: "gb-1",
        countryCode: "GB",
        title: "UK visa guidance",
        publishedAt: "2026-08-07T09:00:00.000Z",
        importance: 28,
      }),
    ];

    const ranked = rankImmigrationUpdates(items, { limit: 4, now });
    for (let i = 1; i < ranked.length; i += 1) {
      if (ranked[i].countryCode === ranked[i - 1].countryCode) {
        const remainingCountries = new Set(items.map((entry) => entry.countryCode));
        expect(remainingCountries.size).toBeLessThanOrEqual(2);
      }
    }
    expect(new Set(ranked.map((entry) => entry.countryCode)).size).toBeGreaterThan(1);
  });

  it("boosts affinity countries in ordering", () => {
    const items = [
      item({
        id: "jp",
        countryCode: "JP",
        title: "Japan entry update",
        publishedAt: "2026-08-01T10:00:00.000Z",
        importance: 20,
      }),
      item({
        id: "fr",
        countryCode: "FR",
        title: "France visa update",
        publishedAt: "2026-08-01T09:00:00.000Z",
        importance: 20,
      }),
    ];

    const ranked = rankImmigrationUpdates(items, {
      limit: 2,
      affinity: new Set(["JP"]),
      now,
    });
    expect(ranked[0]?.countryCode).toBe("JP");
  });
});

describe("detectBadges", () => {
  const now = Date.parse("2026-08-08T12:00:00.000Z");

  it("marks fresh visa articles with NEW and Visa Update badges", () => {
    const badges = detectBadges(
      {
        title: "New tourist visa rules",
        summary: "Updated visa requirements for travelers",
        publishedAt: "2026-08-08T08:00:00.000Z",
      },
      now,
    );
    expect(badges).toContain("new");
    expect(badges).toContain("visa");
  });
});
