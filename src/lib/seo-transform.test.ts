import { describe, expect, it } from "vitest";

import { applySeoTransform } from "@/server";

const CANONICAL_HTML_TEMPLATE = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>Asvior</title><link rel="canonical" href="https://asvior.app"/></head><body><main>hello</main></body></html>`;

function makeRequest(url: string): Request {
  return new Request(url);
}

function makeHtmlResponse(body: string): Response {
  return new Response(body, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

describe("applySeoTransform", () => {
  it("rewrites the SSR canonical link to include the request pathname on asvior.app", async () => {
    const req = makeRequest("https://asvior.app/visa-check");
    const res = makeHtmlResponse(CANONICAL_HTML_TEMPLATE);

    const out = await applySeoTransform(req, res);
    const html = await out.text();

    expect(html).toContain('<link rel="canonical" href="https://asvior.app/visa-check"/>');
    expect(html).not.toContain('<link rel="canonical" href="https://asvior.app"/>');
    expect(out.headers.get("x-robots-tag")).toBeNull();
  });

  it("leaves the homepage canonical bare (no trailing slash / path)", async () => {
    const req = makeRequest("https://asvior.app/");
    const res = makeHtmlResponse(CANONICAL_HTML_TEMPLATE);

    const out = await applySeoTransform(req, res);
    const html = await out.text();

    expect(html).toContain('<link rel="canonical" href="https://asvior.app"/>');
    expect(out.headers.get("x-robots-tag")).toBeNull();
  });

  it("treats www.asvior.app as canonical (still points canonical at bare asvior.app)", async () => {
    const req = makeRequest("https://www.asvior.app/countries");
    const res = makeHtmlResponse(CANONICAL_HTML_TEMPLATE);

    const out = await applySeoTransform(req, res);
    const html = await out.text();

    expect(html).toContain('<link rel="canonical" href="https://asvior.app/countries"/>');
    expect(out.headers.get("x-robots-tag")).toBeNull();
  });

  it("noindexes any Vercel deployment hostname at the HTTP header level", async () => {
    const req = makeRequest("https://asvior-main.vercel.app/");
    const res = makeHtmlResponse(CANONICAL_HTML_TEMPLATE);

    const out = await applySeoTransform(req, res);

    expect(out.headers.get("x-robots-tag")).toBe("noindex, nofollow, noarchive");
  });

  it('also injects a <meta name="robots"> tag into HTML for non-canonical hosts', async () => {
    const req = makeRequest("https://asvior-git-fix-seo.vercel.app/visa-check");
    const res = makeHtmlResponse(CANONICAL_HTML_TEMPLATE);

    const out = await applySeoTransform(req, res);
    const html = await out.text();

    expect(html).toContain('<meta name="robots" content="noindex, nofollow"/>');
    expect(out.headers.get("x-robots-tag")).toBe("noindex, nofollow, noarchive");
  });

  it("adds the noindex header to non-HTML responses on non-canonical hosts too", async () => {
    const req = makeRequest("https://asvior-abc123.vercel.app/robots.txt");
    const res = new Response("User-agent: *\nAllow: /\n", {
      status: 200,
      headers: { "content-type": "text/plain" },
    });

    const out = await applySeoTransform(req, res);
    const body = await out.text();

    expect(out.headers.get("x-robots-tag")).toBe("noindex, nofollow, noarchive");
    expect(body).toBe("User-agent: *\nAllow: /\n");
  });

  it("does NOT rewrite the canonical of non-HTML responses on canonical hosts", async () => {
    const req = makeRequest("https://asvior.app/sitemap.xml");
    const sitemap =
      '<?xml version="1.0"?><urlset><url><loc>https://asvior.app/</loc></url></urlset>';
    const res = new Response(sitemap, {
      status: 200,
      headers: { "content-type": "application/xml" },
    });

    const out = await applySeoTransform(req, res);
    const body = await out.text();

    expect(body).toBe(sitemap);
    expect(out.headers.get("x-robots-tag")).toBeNull();
  });
});
