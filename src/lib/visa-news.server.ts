import type { HomeVisaUpdate } from "@/data/home-feed";
import { getCountryName } from "@/lib/visa";
import {
  detectBadges,
  enrichImmigrationUpdate,
  rankImmigrationUpdates,
} from "@/lib/immigration-news-ranking";

/** Trusted government / immigration RSS sources — global official mix. */
const FEED_SOURCES = [
  // Americas
  { url: "https://travel.state.gov/_res/rss/TAs.xml", source: "U.S. Department of State", defaultCountry: "US" },
  { url: "https://www.uscis.gov/news/rss/news-releases", source: "USCIS", defaultCountry: "US" },
  { url: "https://www.canada.ca/en/immigration-refugees-citizenship/news.atom", source: "Immigration, Refugees and Citizenship Canada", defaultCountry: "CA" },
  { url: "https://www.gob.mx/sre/rss", source: "Secretaría de Relaciones Exteriores Mexico", defaultCountry: "MX" },
  { url: "https://www.gov.br/mre/pt-br/assuntos/rss", source: "Ministry of Foreign Affairs Brazil", defaultCountry: "BR" },
  { url: "https://www.cancilleria.gob.ar/rss", source: "Ministry of Foreign Affairs Argentina", defaultCountry: "AR" },

  // Europe
  { url: "https://www.gov.uk/government/organisations/uk-visas-and-immigration.atom", source: "UK Visas and Immigration", defaultCountry: "GB" },
  { url: "https://home-affairs.ec.europa.eu/news/rss_en", source: "European Commission — Home Affairs", defaultCountry: "EU" },
  { url: "https://www.auswaertiges-amt.de/en/newsroom/news/rss", source: "German Federal Foreign Office", defaultCountry: "DE" },
  { url: "https://www.diplomatie.gouv.fr/spip.php?page=backend-fd&id_rubrique=1", source: "France Diplomatie", defaultCountry: "FR" },
  { url: "https://www.esteri.it/it/rss/notizie/", source: "Italian Ministry of Foreign Affairs", defaultCountry: "IT" },
  { url: "https://www.exteriores.gob.es/rss/en/noticias.xml", source: "Ministry of Foreign Affairs Spain", defaultCountry: "ES" },
  { url: "https://portaldiplomatico.mne.gov.pt/rss", source: "Ministry of Foreign Affairs Portugal", defaultCountry: "PT" },
  { url: "https://www.government.nl/rss/latest", source: "Government of the Netherlands", defaultCountry: "NL" },
  { url: "https://www.eda.admin.ch/eda/en/home/news/rss.xml", source: "Swiss Federal Department of Foreign Affairs", defaultCountry: "CH" },
  { url: "https://www.bmeia.gv.at/en/rss/", source: "Austrian Federal Ministry for European and International Affairs", defaultCountry: "AT" },
  { url: "https://diplomatie.belgium.be/en/news/rss", source: "Belgian Ministry of Foreign Affairs", defaultCountry: "BE" },
  { url: "https://www.regjeringen.no/rss/en/id269502/", source: "Norwegian Government", defaultCountry: "NO" },
  { url: "https://www.government.se/rss/", source: "Swedish Government", defaultCountry: "SE" },
  { url: "https://um.dk/en/rss/news", source: "Danish Ministry of Foreign Affairs", defaultCountry: "DK" },
  { url: "https://um.fi/rss/en", source: "Ministry for Foreign Affairs Finland", defaultCountry: "FI" },
  { url: "https://www.ireland.ie/en/rss/news/", source: "Department of Foreign Affairs Ireland", defaultCountry: "IE" },
  { url: "https://www.gov.pl/web/rss/diplomacy", source: "Ministry of Foreign Affairs Poland", defaultCountry: "PL" },
  { url: "https://www.mzv.cz/rss/en", source: "Ministry of Foreign Affairs Czech Republic", defaultCountry: "CZ" },
  { url: "https://kormany.hu/en/rss", source: "Hungarian Government", defaultCountry: "HU" },
  { url: "https://www.mfa.gr/rss/en", source: "Ministry of Foreign Affairs Greece", defaultCountry: "GR" },

  // Oceania
  { url: "https://immi.homeaffairs.gov.au/news-media/archive/rss", source: "Australian Department of Home Affairs", defaultCountry: "AU" },
  { url: "https://www.immigration.govt.nz/about-us/media-centre/news-notifications/rss", source: "Immigration New Zealand", defaultCountry: "NZ" },

  // Asia
  { url: "https://www.mofa.go.jp/mofaj/rss/whatsnew.xml", source: "Ministry of Foreign Affairs of Japan", defaultCountry: "JP" },
  { url: "https://www.mofa.go.kr/eng/rss/notice.xml", source: "Ministry of Foreign Affairs, Republic of Korea", defaultCountry: "KR" },
  { url: "https://www.ica.gov.sg/rss/news", source: "Immigration & Checkpoints Authority Singapore", defaultCountry: "SG" },
  { url: "https://www.immi.gov.my/index.php/feed/", source: "Immigration Department of Malaysia", defaultCountry: "MY" },
  { url: "https://www.immigration.go.th/rss", source: "Thailand Immigration Bureau", defaultCountry: "TH" },
  { url: "https://www.mofa.gov.vn/en/rss", source: "Ministry of Foreign Affairs Vietnam", defaultCountry: "VN" },
  { url: "https://kemlu.go.id/en/rss", source: "Ministry of Foreign Affairs Indonesia", defaultCountry: "ID" },
  { url: "https://dfa.gov.ph/rss", source: "Department of Foreign Affairs Philippines", defaultCountry: "PH" },
  { url: "https://www.immd.gov.hk/rss/news_en.xml", source: "Hong Kong Immigration Department", defaultCountry: "HK" },
  { url: "https://www.mofa.gov.tw/rss", source: "Ministry of Foreign Affairs Taiwan", defaultCountry: "TW" },
  { url: "https://www.mea.gov.in/press-releases.htm?51/rss", source: "Ministry of External Affairs India", defaultCountry: "IN" },
  { url: "https://www.immigration.gov.np/feed", source: "Department of Immigration Nepal", defaultCountry: "NP" },

  // Middle East
  { url: "https://u.ae/en/rss/news", source: "United Arab Emirates Government", defaultCountry: "AE" },
  { url: "https://www.moi.gov.qa/en/rss", source: "Ministry of Interior Qatar", defaultCountry: "QA" },
  { url: "https://www.mofa.gov.sa/en/rss", source: "Ministry of Foreign Affairs Saudi Arabia", defaultCountry: "SA" },
  { url: "https://www.mfa.gov.tr/rss.en.mfa", source: "Ministry of Foreign Affairs Türkiye", defaultCountry: "TR" },

  // Africa
  { url: "https://www.dirco.gov.za/rss", source: "Department of International Relations South Africa", defaultCountry: "ZA" },
  { url: "https://www.diplomatie.ma/en/rss", source: "Ministry of Foreign Affairs Morocco", defaultCountry: "MA" },
  { url: "https://www.mfa.gov.eg/en/rss", source: "Ministry of Foreign Affairs Egypt", defaultCountry: "EG" },
] as const;

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const FEED_LIMIT = 36;

type NewsCache = {
  fetchedAt: number;
  items: HomeVisaUpdate[];
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

function parseFeedItems(
  xml: string,
  source: string,
  defaultCountry: string,
  now: number,
): HomeVisaUpdate[] {
  const items: HomeVisaUpdate[] = [];
  const blocks =
    xml.match(/<item[\s\S]*?<\/item>/gi) ??
    xml.match(/<entry[\s\S]*?<\/entry>/gi) ??
    [];
    const countryName =
      defaultCountry === "EU" ? "European Union" : getCountryName(defaultCountry);

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

    const summary = (desc || title).slice(0, 280);
    const base = {
      id: `${source}-${link || title}`.slice(0, 120).replace(/[^a-zA-Z0-9-_]/g, "-"),
      countryCode: defaultCountry,
      title: title.slice(0, 160),
      summary,
      publishedAt,
      source,
      url: link || undefined,
    };

    items.push(enrichImmigrationUpdate(base, countryName, now));
  }

  return items;
}

async function fetchFeed(
  url: string,
  source: string,
  defaultCountry: string,
  now: number,
): Promise<HomeVisaUpdate[]> {
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml" },
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseFeedItems(xml, source, defaultCountry, now);
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
    };
  }

  const batches = await Promise.all(
    FEED_SOURCES.map((f) => fetchFeed(f.url, f.source, f.defaultCountry, now)),
  );

  const merged = rankImmigrationUpdates(batches.flat(), { limit: FEED_LIMIT, affinity, now });

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
    const ranked = rankImmigrationUpdates(memoryCache.items, { limit: FEED_LIMIT, affinity, now });
    return {
      items: ranked,
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

// Re-export for tests
export { detectBadges, rankImmigrationUpdates, dedupeImmigrationUpdates } from "@/lib/immigration-news-ranking";
