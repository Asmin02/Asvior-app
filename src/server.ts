import "./lib/error-capture";

import { applyCapacitorCors, corsPreflightResponse } from "./lib/api-base";
import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { buildCanonicalUrl, isCanonicalHost } from "./lib/seo";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

// SEO / canonical-host post-processing.
//
// Runs on EVERY response leaving this Nitro worker (SSR HTML, static
// files, and API routes alike). Two things happen:
//
// 1. Non-canonical hosts (anything not asvior.app / www.asvior.app —
//    e.g. asvior-main.vercel.app, asvior-git-*.vercel.app, or a raw
//    Vercel deployment id) get `X-Robots-Tag: noindex, nofollow,
//    noarchive`. Google and Bing honour this header at the HTTP layer,
//    so the Vercel deployment domain stops competing with asvior.app
//    in search results — while remaining fully reachable for previews
//    and Play-Store App-Links.
//
// 2. On canonical hosts we rewrite the SSR-emitted static canonical link
//    (`<link rel="canonical" href="https://asvior.app">`) to include the
//    actual request pathname, so /visa-check, /country/JP, etc. each
//    advertise the correct canonical URL to crawlers. This is a plain
//    string replace on the exact tag the shell emits — no HTML parser
//    involved, no risk of touching page content.
async function applySeoResponse(request: Request, response: Response): Promise<Response> {
  return applySeoTransform(request, response);
}

// Extracted for unit testing. Pure: only inspects the request URL + the
// response headers/body, and returns a new Response.
export async function applySeoTransform(request: Request, response: Response): Promise<Response> {
  const url = new URL(request.url);
  const canonical = isCanonicalHost(url.host);
  const contentType = response.headers.get("content-type") ?? "";
  const isHtml = contentType.includes("text/html");

  if (canonical) {
    if (!isHtml) return response;
    // Rewrite the static canonical to include the real pathname.
    const body = await response.text();
    const targetCanonical = buildCanonicalUrl(url.pathname);
    const rewritten = body.replace(
      /<link\s+rel="canonical"\s+href="https:\/\/asvior\.app"\s*\/?>(?!\s*<link\s+rel="canonical")/i,
      `<link rel="canonical" href="${targetCanonical}"/>`,
    );
    return new Response(rewritten, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  }

  // Non-canonical host — noindex EVERYTHING sent from this response.
  const headers = new Headers(response.headers);
  headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");

  if (!isHtml) {
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  // Belt-and-suspenders: also inject a <meta name="robots" content="noindex">
  // into HTML so that a crawler that ignores the header (older Bingbot
  // variants have historically done this) still refuses to index the page.
  const body = await response.text();
  const withMeta = body.replace(
    /<head(\s[^>]*)?>/i,
    (match) => `${match}<meta name="robots" content="noindex, nofollow"/>`,
  );
  return new Response(withMeta, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function isCapacitorChatRequest(request: Request): boolean {
  return new URL(request.url).pathname === "/api/chat";
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    // Capacitor bundled builds POST to production /api/chat from https://localhost.
    // Vercel may not route OPTIONS to the TanStack handler, so answer preflight here.
    if (isCapacitorChatRequest(request) && request.method === "OPTIONS") {
      return corsPreflightResponse(request);
    }

    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(response);
      const seo = await applySeoResponse(request, normalized);
      if (isCapacitorChatRequest(request)) {
        return applyCapacitorCors(request, seo);
      }
      return seo;
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
