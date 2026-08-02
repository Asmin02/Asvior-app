import { beforeEach, describe, expect, it } from "vitest";
import { buildScopedStorageKey, GUEST_STORAGE_SCOPE } from "@/lib/app-session";
import {
  clearRecentSearches,
  loadRecentSearches,
  MAX_RECENT_SEARCHES,
  MAX_RECENT_STORAGE,
  removeRecentSearch,
  saveRecentSearch,
  type RecentSearch,
} from "@/lib/visa";

const RECENT_KEY = "vp_recent_searches";

function entry(destination: string, passport = "US"): RecentSearch {
  return {
    passport,
    destination,
    status: "Visa Free",
    timestamp: Date.now(),
  };
}

describe("recent search persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("caps stored history while keeping home display at five items", () => {
    for (let i = 0; i < 55; i++) {
      saveRecentSearch(entry(`C${i}`));
    }
    const stored = loadRecentSearches();
    expect(stored).toHaveLength(MAX_RECENT_STORAGE);
    expect(stored[0].destination).toBe("C54");
    expect(stored.slice(0, MAX_RECENT_SEARCHES)).toHaveLength(MAX_RECENT_SEARCHES);
  });

  it("moves duplicate searches to the top without creating duplicates", () => {
    saveRecentSearch(entry("JP"));
    saveRecentSearch(entry("FR"));
    saveRecentSearch(entry("JP"));

    const items = loadRecentSearches();
    expect(items).toHaveLength(2);
    expect(items[0].destination).toBe("JP");
    expect(items[1].destination).toBe("FR");
  });

  it("clears scoped history", () => {
    saveRecentSearch(entry("JP"));
    clearRecentSearches();
    expect(loadRecentSearches()).toEqual([]);
    expect(localStorage.getItem(buildScopedStorageKey(RECENT_KEY, GUEST_STORAGE_SCOPE))).toBeNull();
  });

  it("removes a single recent search entry", () => {
    saveRecentSearch(entry("JP"));
    saveRecentSearch(entry("FR"));
    const next = removeRecentSearch("US", "JP");
    expect(next).toHaveLength(1);
    expect(next[0].destination).toBe("FR");
  });
});
