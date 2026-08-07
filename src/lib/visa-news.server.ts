import type { HomeVisaUpdate } from "@/data/home-feed";
import { getCountryName } from "@/lib/visa";
import { countryCodeFromTravelAdviceUrl, resolveCountryCode } from "@/lib/country-resolver";
import {
  detectBadges,
  enrichImmigrationUpdate,
  rankImmigrationUpdates,
} from "@/lib/immigration-news-ranking";

type FeedSource = {
  url: string;
  source: string;
  defaultCountry?: string;
  /** Assign destination country from gov.uk travel advice links/titles. */
  travelAdvice?: boolean;
  maxItems?: number;
};

const FCDO_SOURCE = "UK Foreign, Commonwealth & Development Office";

/** Per-country UK FCDO travel advice feeds — reliable official entry/visa updates worldwide. */
const TRAVEL_ADVICE_SLUGS = [
  "australia",
  "new-zealand",
  "fiji",
  "papua-new-guinea",
  "japan",
  "singapore",
  "south-korea",
  "thailand",
  "malaysia",
  "indonesia",
  "india",
  "philippines",
  "vietnam",
  "taiwan",
  "mexico",
  "brazil",
  "argentina",
  "colombia",
  "chile",
  "germany",
  "france",
  "spain",
  "italy",
  "netherlands",
  "poland",
  "sweden",
  "portugal",
  "greece",
  "switzerland",
  "united-arab-emirates",
  "saudi-arabia",
  "qatar",
  "israel",
  "turkey",
  "south-africa",
  "kenya",
  "nigeria",
  "egypt",
  "morocco",
  "ghana",
];

const travelAdviceFeeds: FeedSource[] = TRAVEL_ADVICE_SLUGS.map((slug) => ({
  url: `https://www.gov.uk/foreign-travel-advice/${slug}.atom`,
  source: FCDO_SOURCE,
  travelAdvice: true,
  maxItems: 1,
}));

/** Verified official sources that respond reliably from serverless environments. */
const FEED_SOURCES: FeedSource[] = [
  ...travelAdviceFeeds,
  {
    url: "https://www.gov.uk/foreign-travel-advice.atom",
    source: FCDO_SOURCE,
    travelAdvice: true,
    maxItems: 25,
  },
  {
    url: "https://www.federalregister.gov/api/v1/documents.rss?conditions[agencies][]=us-citizenship-and-immigration-services&per_page=25",
    source: "USCIS (Federal Register)",
    defaultCountry: "US",
    maxItems: 8,
  },
  {
    url: "https://www.federalregister.gov/api/v1/documents.rss?conditions[agencies][]=department-of-state&per_page=20",
    source: "U.S. Department of State (Federal Register)",
    defaultCountry: "US",
    maxItems: 6,
  },
  {
    url: "https://www.federalregister.gov/api/v1/documents.rss?conditions[agencies][]=us-customs-and-border-protection&per_page=20",
    source: "U.S. Customs and Border Protection (Federal Register)",
    defaultCountry: "US",
    maxItems: 6,
  },
  {
    url: "https://api.io.canada.ca/io-server/gc/news/en/v2?dept=departmentofcitizenshipandimmigration&sort=publishedDate&orderBy=desc&publishedDate%3E=2024-01-01&pick=25&format=atom",
    source: "Immigration, Refugees and Citizenship Canada",
    defaultCountry: "CA",
    maxItems: 8,
  },
  {
    url: "https://api.io.canada.ca/io-server/gc/news/en/v2?dept=canadaborderservicesagency&sort=publishedDate&orderBy=desc&publishedDate%3E=2024-01-01&pick=20&format=atom",
    source: "Canada Border Services Agency",
    defaultCountry: "CA",
    maxItems: 6,
  },
  {
    url: "https://www.gov.uk/government/organisations/uk-visas-and-immigration.atom",
    source: "UK Visas and Immigration",
    defaultCountry: "GB",
    maxItems: 8,
  },
  {
    url: "https://www.imi.gov.my/index.php/feed/",
    source: "Immigration Department of Malaysia",
    defaultCountry: "MY",
    maxItems: 6,
  },
  {
    url: "https://www.migration.gov.gr/feed/",
    source: "Greek Ministry of Migration and Asylum",
    defaultCountry: "GR",
    maxItems: 6,
  },
  {
    url: "https://igi.mai.gov.ro/en/feed/",
    source: "Romanian General Inspectorate for Immigration",
    defaultCountry: "RO",
    maxItems: 6,
  },
  {
    url: "https://www.immigration.go.ke/feed/",
    source: "Kenya Department of Immigration",
    defaultCountry: "KE",
    maxItems: 6,
  },
  {
    url: "https://www.gis.gov.gh/feed/",
    source: "Ghana Immigration Service",
    defaultCountry: "GH",
    maxItems: 6,
  },
  {
    url: "https://www.europarl.europa.eu/rss/doc/press-releases/en.xml",
    source: "European Parliament",
    defaultCountry: "EU",
    maxItems: 6,
  },
];

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const FEED_LIMIT = 48;
const MAX_ITEM_AGE_MS = 90 * 24 * 60 * 60 * 1000;
const FEED_HEADERS = {
  Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, application/atom+xml;q=0.9,*/*;q=0.8",
  "User-Agent": "Mozilla/5.0 (compatible; AsviorBot/1.0; +https://asvior.app; immigration feed)",
};

type NewsCache = {
  fetchedAt: number;
  items: HomeVisaUpdate[];
  countryCount: number;
};

let memoryCache: NewsCache | null = null;

export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripTags(html: string): string {
  return decodeHtmlEntities(
    html
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function immigrationRelevant(text: string): boolean {
  const normalized = text.toLowerCase();
  return /(visa|immigration|passport|border|entry|customs|citizenship|residen|asylum|schengen|e-?visa|work permit|travel advice|travel advisory)/.test(
    normalized,
  );
}

function parseFeedItems(feed: FeedSource, xml: string, now: number): HomeVisaUpdate[] {
  const items: HomeVisaUpdate[] = [];
  const blocks =
    xml.match(/<item[\s\S]*?<\/item>/gi) ??
    xml.match(/<entry[\s\S]*?<\/entry>/gi) ??
    [];

  for (const block of blocks) {
    const rawTitle = stripTags(block.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
    const link =
      stripTags(block.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1] ?? "") ||
      block.match(/<link[^>]*href="([^"]+)"/i)?.[1] ||
      "";
    const desc =
      stripTags(block.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] ?? "") ||
      stripTags(block.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i)?.[1] ?? "") ||
      stripTags(block.match(/<content[^>]*>([\s\S]*?)<\/content>/i)?.[1] ?? "");
    const pub =
      block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1] ??
      block.match(/<updated[^>]*>([\s\S]*?)<\/updated>/i)?.[1] ??
      block.match(/<published[^>]*>([\s\S]*?)<\/published>/i)?.[1] ??
      "";
    const publishedAt = pub ? new Date(pub).toISOString() : new Date().toISOString();

    if (!rawTitle) continue;

    const publishedMs = new Date(publishedAt).getTime();
    if (!Number.isNaN(publishedMs) && now - publishedMs > MAX_ITEM_AGE_MS) continue;

    let countryCode = feed.defaultCountry ?? "";
    let title = rawTitle.slice(0, 160);
    let summary = (desc || rawTitle).slice(0, 280);

    if (feed.travelAdvice) {
      const destination =
        countryCodeFromTravelAdviceUrl(link) ?? resolveCountryCode(rawTitle);
      if (!destination) continue;
      countryCode = destination;
      title = `${getCountryName(destination)} travel & entry update`;
      summary = (desc || `Official foreign travel advice for ${getCountryName(destination)}.`).slice(
        0,
        280,
      );
    }

    if (!countryCode) continue;

    const haystack = `${title} ${summary}`;
    if (!feed.travelAdvice && !immigrationRelevant(haystack)) continue;

    const countryName =
      countryCode === "EU" ? "European Union" : getCountryName(countryCode);

    const base = {
      id: `${feed.source}-${link || title}`.slice(0, 120).replace(/[^a-zA-Z0-9-_]/g, "-"),
      countryCode,
      title,
      summary,
      publishedAt,
      source: feed.source,
      url: link || undefined,
    };

    items.push(enrichImmigrationUpdate(base, countryName, now));
  }

  const cap = feed.maxItems ?? 10;
  if (feed.travelAdvice) {
    const seen = new Set<string>();
    const unique = items.filter((entry) => {
      if (seen.has(entry.countryCode)) return false;
      seen.add(entry.countryCode);
      return true;
    });
    return unique.slice(0, cap);
  }
  return items.slice(0, cap);
}

async function fetchFeed(feed: FeedSource, now: number): Promise<HomeVisaUpdate[]> {
  try {
    const res = await fetch(feed.url, {
      headers: FEED_HEADERS,
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseFeedItems(feed, xml, now);
  } catch (err) {
    console.warn("[visa-news] feed fetch failed:", feed.url, err);
    return [];
  }
}

async function fetchAllFeeds(now: number): Promise<HomeVisaUpdate[]> {
  const batchSize = 8;
  const items: HomeVisaUpdate[] = [];

  for (let i = 0; i < FEED_SOURCES.length; i += batchSize) {
    const batch = FEED_SOURCES.slice(i, i + batchSize);
    const batches = await Promise.all(batch.map((feed) => fetchFeed(feed, now)));
    items.push(...batches.flat());
  }

  return items;
}

export type VisaNewsPayload = {
  items: HomeVisaUpdate[];
  fetchedAt: string;
  stale: boolean;
  source: "live" | "cache" | "empty";
  countryCount: number;
};

export async function getVisaNewsUpdates(
  force = false,
  affinity: Set<string> = new Set(),
): Promise<VisaNewsPayload> {
  const now = Date.now();

  if (!force && memoryCache && now - memoryCache.fetchedAt < CACHE_TTL_MS) {
    const ranked = rankImmigrationUpdates(memoryCache.items, { limit: FEED_LIMIT, affinity, now });
    return {
      items: ranked,
      fetchedAt: new Date(memoryCache.fetchedAt).toISOString(),
      stale: false,
      source: "cache",
      countryCount: memoryCache.countryCount,
    };
  }

  const raw = await fetchAllFeeds(now);
  const countryCount = new Set(raw.map((item) => item.countryCode)).size;
  const merged = rankImmigrationUpdates(raw, {
    limit: FEED_LIMIT,
    affinity,
    now,
  });

  if (merged.length > 0) {
    memoryCache = { fetchedAt: now, items: raw, countryCount };
    return {
      items: merged,
      fetchedAt: new Date(now).toISOString(),
      stale: false,
      source: "live",
      countryCount,
    };
  }

  if (memoryCache?.items.length) {
    const ranked = rankImmigrationUpdates(memoryCache.items, { limit: FEED_LIMIT, affinity, now });
    return {
      items: ranked,
      fetchedAt: new Date(memoryCache.fetchedAt).toISOString(),
      stale: true,
      source: "cache",
      countryCount: memoryCache.countryCount,
    };
  }

  return {
    items: [],
    fetchedAt: new Date(now).toISOString(),
    stale: true,
    source: "empty",
    countryCount: 0,
  };
}

export { detectBadges, rankImmigrationUpdates, dedupeImmigrationUpdates } from "@/lib/immigration-news-ranking";
