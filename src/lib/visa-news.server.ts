import type { HomeVisaUpdate } from "@/data/home-feed";

/** Trusted government / immigration RSS sources. */
const FEED_SOURCES = [
  {
    url: "https://travel.state.gov/_res/rss/TAs.xml",
    source: "U.S. Department of State",
    defaultCountry: "US",
  },
  {
    url: "https://www.gov.uk/government/organisations/uk-visas-and-immigration.atom",
    source: "UK Visas and Immigration",
    defaultCountry: "GB",
  },
  {
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/news.atom",
    source: "Immigration, Refugees and Citizenship Canada",
    defaultCountry: "CA",
  },
  {
    url: "https://immi.homeaffairs.gov.au/news-media/archive/rss",
    source: "Australian Department of Home Affairs",
    defaultCountry: "AU",
  },
  {
    url: "https://www.immigration.govt.nz/about-us/media-centre/news-notifications/rss",
    source: "Immigration New Zealand",
    defaultCountry: "NZ",
  },
  {
    url: "https://www.ica.gov.sg/rss/news",
    source: "Immigration & Checkpoints Authority Singapore",
    defaultCountry: "SG",
  },
  {
    url: "https://www.mofa.go.jp/mofaj/rss/whatsnew.xml",
    source: "Ministry of Foreign Affairs of Japan",
    defaultCountry: "JP",
  },
  {
    url: "https://www.schengenvisainfo.com/news/feed/",
    source: "Schengen Visa Info",
    defaultCountry: "EU",
  },
] as const;

/** Round-robin across countries so one source cannot dominate the feed. */
function interleaveByCountry(items: HomeVisaUpdate[], limit: number): HomeVisaUpdate[] {
  const buckets = new Map<string, HomeVisaUpdate[]>();
  for (const item of items) {
    const list = buckets.get(item.countryCode) ?? [];
    list.push(item);
    buckets.set(item.countryCode, list);
  }
  const queues = [...buckets.values()].map((list) =>
    [...list].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    ),
  );
  const out: HomeVisaUpdate[] = [];
  let round = 0;
  while (out.length < limit && queues.some((q) => q.length > round)) {
    for (const q of queues) {
      const next = q[round];
      if (next) out.push(next);
      if (out.length >= limit) break;
    }
    round += 1;
  }
  return out;
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

type NewsCache = {
  fetchedAt: number;
  items: HomeVisaUpdate[];
};

let memoryCache: NewsCache | null = null;

function stripTags(html: string): string {
  return html
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseFeedItems(
  xml: string,
  source: string,
  defaultCountry: string,
): HomeVisaUpdate[] {
  const items: HomeVisaUpdate[] = [];
  const blocks =
    xml.match(/<item[\s\S]*?<\/item>/gi) ??
    xml.match(/<entry[\s\S]*?<\/entry>/gi) ??
    [];

  for (const block of blocks) {
    const title = stripTags(block.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
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

    if (!title) continue;

    items.push({
      id: `${source}-${link || title}`.slice(0, 120).replace(/[^a-zA-Z0-9-_]/g, "-"),
      countryCode: defaultCountry,
      title: title.slice(0, 160),
      summary: (desc || title).slice(0, 280),
      publishedAt,
      source,
      url: link || undefined,
    });
  }

  return items;
}

async function fetchFeed(
  url: string,
  source: string,
  defaultCountry: string,
): Promise<HomeVisaUpdate[]> {
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml" },
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseFeedItems(xml, source, defaultCountry);
  } catch (err) {
    console.warn("[visa-news] feed fetch failed:", url, err);
    return [];
  }
}

export type VisaNewsPayload = {
  items: HomeVisaUpdate[];
  fetchedAt: string;
  stale: boolean;
  source: "live" | "cache" | "empty";
};

export async function getVisaNewsUpdates(force = false): Promise<VisaNewsPayload> {
  const now = Date.now();

  if (!force && memoryCache && now - memoryCache.fetchedAt < CACHE_TTL_MS) {
    return {
      items: memoryCache.items,
      fetchedAt: new Date(memoryCache.fetchedAt).toISOString(),
      stale: false,
      source: "cache",
    };
  }

  const batches = await Promise.all(
    FEED_SOURCES.map((f) => fetchFeed(f.url, f.source, f.defaultCountry)),
  );

  const merged = interleaveByCountry(batches.flat(), 12);

  if (merged.length > 0) {
    memoryCache = { fetchedAt: now, items: merged };
    return {
      items: merged,
      fetchedAt: new Date(now).toISOString(),
      stale: false,
      source: "live",
    };
  }

  if (memoryCache?.items.length) {
    return {
      items: memoryCache.items,
      fetchedAt: new Date(memoryCache.fetchedAt).toISOString(),
      stale: true,
      source: "cache",
    };
  }

  return {
    items: [],
    fetchedAt: new Date(now).toISOString(),
    stale: true,
    source: "empty",
  };
}
