import type { HomeVisaUpdate } from "@/data/home-feed";

/** Trusted government / immigration RSS sources — one per country, global mix. */
const FEED_SOURCES = [
  {
    url: "https://www.mofa.go.jp/mofaj/rss/whatsnew.xml",
    source: "Ministry of Foreign Affairs of Japan",
    defaultCountry: "JP",
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
    url: "https://travel.state.gov/_res/rss/TAs.xml",
    source: "U.S. Department of State",
    defaultCountry: "US",
  },
  {
    url: "https://www.ica.gov.sg/rss/news",
    source: "Immigration & Checkpoints Authority Singapore",
    defaultCountry: "SG",
  },
  {
    url: "https://www.auswaertiges-amt.de/en/newsroom/news/rss",
    source: "German Federal Foreign Office",
    defaultCountry: "DE",
  },
  {
    url: "https://www.diplomatie.gouv.fr/spip.php?page=backend-fd&id_rubrique=1",
    source: "France Diplomatie",
    defaultCountry: "FR",
  },
  {
    url: "https://www.mofa.go.kr/eng/rss/notice.xml",
    source: "Ministry of Foreign Affairs, Republic of Korea",
    defaultCountry: "KR",
  },
  {
    url: "https://www.immigration.go.th/rss",
    source: "Thailand Immigration Bureau",
    defaultCountry: "TH",
  },
  {
    url: "https://www.immigration.govt.nz/about-us/media-centre/news-notifications/rss",
    source: "Immigration New Zealand",
    defaultCountry: "NZ",
  },
  {
    url: "https://www.esteri.it/it/rss/notizie/",
    source: "Italian Ministry of Foreign Affairs",
    defaultCountry: "IT",
  },
  {
    url: "https://u.ae/en/rss/news",
    source: "United Arab Emirates Government",
    defaultCountry: "AE",
  },
  {
    url: "https://www.imi.gov.my/index.php/feed/",
    source: "Immigration Department of Malaysia",
    defaultCountry: "MY",
  },
  {
    url: "https://www.immigration.gov.np/feed",
    source: "Department of Immigration Nepal",
    defaultCountry: "NP",
  },
  {
    url: "https://www.gov.uk/government/organisations/uk-visas-and-immigration.atom",
    source: "UK Visas and Immigration",
    defaultCountry: "GB",
  },
  {
    url: "https://www.ireland.ie/en/rss/news/",
    source: "Department of Foreign Affairs Ireland",
    defaultCountry: "IE",
  },
  {
    url: "https://www.government.nl/rss/latest",
    source: "Government of the Netherlands",
    defaultCountry: "NL",
  },
  {
    url: "https://www.mea.gov.in/press-releases.htm?51/rss",
    source: "Ministry of External Affairs, India",
    defaultCountry: "IN",
  },
] as const;

/** Preferred country order for the feed so no single country dominates. */
const COUNTRY_ORDER = [
  "JP", "CA", "AU", "US", "SG", "DE", "FR", "KR",
  "TH", "NZ", "IT", "AE", "MY", "NP", "GB", "IE", "NL", "IN",
];


/**
 * Strict round-robin: never two articles from the same country in a row, and
 * the newest article of each country wins its slot. Country order rotates by
 * UTC day so the feed does not open with the same country every time.
 */
function interleaveByCountry(items: HomeVisaUpdate[], limit: number): HomeVisaUpdate[] {
  const buckets = new Map<string, HomeVisaUpdate[]>();
  for (const item of items) {
    const list = buckets.get(item.countryCode) ?? [];
    list.push(item);
    buckets.set(item.countryCode, list);
  }

  const dayIndex = Math.floor(Date.now() / 86_400_000);
  const present = [...buckets.keys()].sort((a, b) => {
    const ia = COUNTRY_ORDER.indexOf(a);
    const ib = COUNTRY_ORDER.indexOf(b);
    return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib);
  });
  const offset = present.length ? dayIndex % present.length : 0;
  const rotated = [...present.slice(offset), ...present.slice(0, offset)];

  const queues = rotated.map((code) =>
    [...(buckets.get(code) ?? [])].sort(
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

  const merged = interleaveByCountry(batches.flat(), 18);

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
