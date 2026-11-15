import { beforeEach, describe, expect, it } from "vitest";
import { VIEWS } from "../src/lib/route";
import type { PreviewIndex, PreviewPage } from "../src/lib/previews";
import worker from "./index";
import { headTags, injectHead, pageKey, resetIndexCache } from "./og";

const SHELL = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Traffic — default</title>
    <meta name="description" content="Default description." />
    <meta property="og:title" content="Default og" />
    <meta name='twitter:card' content='summary' />
    <link rel="canonical" href="https://old.example/" />
    <link rel="alternate" type="text/markdown" href="/llms.txt" />
    <script type="module" src="/assets/app.js"></script>
  </head>
  <body><div id="root"></div></body>
</html>`;

const page = (over: Partial<PreviewPage> = {}): PreviewPage => ({
  title: "Filter on Martin and Ayala", description: "Simulated PM peak: through cars 598 → 512 an hour (−14%). Simulation, not a forecast.",
  image: "/og/p-charter-aaaa1111-0a1b2c3d.jpg", imageAlt: "A map.", imageWidth: 1200, imageHeight: 630, ...over,
});
const fallback = page({ title: "Traffic: Area", description: "Generic.", image: "/og/home-0a1b2c3d.jpg" });
const index = (pages: Record<string, PreviewPage> = {}): PreviewIndex => ({ version: 1, site: "https://site.example", siteName: "Traffic", fallback, pages });

type Stored = { body: string | Uint8Array; etag: string };
function env(files: Record<string, Stored> = {}, assets?: (req: Request) => Response) {
  const seen: Request[] = [];
  const DATA = {
    async get(key: string, opts?: { onlyIf?: Headers }) {
      const hit = files[key];
      if (!hit) return null;
      if (opts?.onlyIf?.get("if-none-match") === hit.etag) return { httpEtag: hit.etag };
      return { httpEtag: hit.etag, body: hit.body, text: async () => String(hit.body) };
    },
  } as unknown as R2Bucket;
  const shell = () => new Response(SHELL, { headers: { "content-type": "text/html", etag: '"shell"' } });
  return { seen, DATA, ASSETS: { fetch: async (r: Request) => { seen.push(r); return (assets ?? shell)(r); } } as unknown as Fetcher };
}
const stored = (idx: PreviewIndex | string): Record<string, Stored> => ({ "areas/og/index.json": { body: typeof idx === "string" ? idx : JSON.stringify(idx), etag: '"i"' } });
const get = (path: string, e: ReturnType<typeof env>, init: RequestInit = {}, host = "https://example.test") => worker.fetch(new Request(`${host}${path}`, init), e);
const tag = (html: string, key: string) => new RegExp(`<meta (?:name|property)="${key}" content="([^"]*)"`).exec(html)?.[1];

beforeEach(() => resetIndexCache());

describe("pageKey", () => {
  it("names the tab paths and share paths, and nothing else", () => {
    for (const v of VIEWS) expect(pageKey(v.path)).toBe(v.path);
    expect(pageKey("/Proposals/")).toBe("/proposals");
    expect(pageKey("/index.html")).toBe("/");
    expect(pageKey("/p/Charter-0abc1234/")).toBe("/p/charter-0abc1234");
    for (const p of ["/p", "/p/", "/p/a/b", "/p/a_b", "/data/x", "/proposals/extra", "/p/" + "a".repeat(81)]) expect(pageKey(p)).toBeNull();
  });
});

describe("head tags", () => {
  it("writes the title, description, canonical, Open Graph and Twitter card tags", () => {
    const html = injectHead(SHELL, headTags(page(), "Traffic", "https://site.example", "/p/charter-aaaa1111"));
    expect(html).toContain("<title>Filter on Martin and Ayala</title>");
    expect(tag(html, "description")).toBe(page().description);
    expect(html).toContain('<link rel="canonical" href="https://site.example/p/charter-aaaa1111" />');
    expect(tag(html, "og:url")).toBe("https://site.example/p/charter-aaaa1111");
    expect(tag(html, "og:type")).toBe("website");
    expect(tag(html, "og:site_name")).toBe("Traffic");
    expect(tag(html, "og:title")).toBe("Filter on Martin and Ayala");
    expect(tag(html, "og:image")).toBe("https://site.example/og/p-charter-aaaa1111-0a1b2c3d.jpg");
    expect(tag(html, "og:image:width")).toBe("1200");
    expect(tag(html, "og:image:height")).toBe("630");
    expect(tag(html, "og:image:alt")).toBe("A map.");
    expect(tag(html, "twitter:card")).toBe("summary_large_image");
    expect(tag(html, "twitter:title")).toBe("Filter on Martin and Ayala");
    expect(tag(html, "twitter:image")).toBe("https://site.example/og/p-charter-aaaa1111-0a1b2c3d.jpg");
  });
  it("replaces the shell's own tags instead of adding a second set, and keeps the rest of the head", () => {
    const html = injectHead(SHELL, headTags(page(), "Traffic", "https://site.example", "/"));
    expect(html.match(/<title>/g)).toHaveLength(1);
    expect(html.match(/name="description"/g)).toHaveLength(1);
    expect(html.match(/rel="canonical"/g)).toHaveLength(1);
    expect(html.match(/property="og:title"/g)).toHaveLength(1);
    expect(html.match(/name="twitter:card"/g)).toHaveLength(1);
    expect(html).not.toContain("Default");
    expect(html).not.toContain("old.example");
    expect(html).toContain('<meta charset="utf-8" />');
    expect(html).toContain('rel="alternate"');
    expect(html).toContain('<script type="module" src="/assets/app.js"></script>');
    expect(html.indexOf("og:title")).toBeLessThan(html.indexOf("</head>"));
  });
  it("escapes everything from the index, so data cannot add markup or break out of an attribute", () => {
    const evil = `<script>alert(1)</script> "><img src=x onerror=alert(2)> & ' $& $1`;
    const html = injectHead(SHELL, headTags(page({ title: evil, description: evil, imageAlt: evil }), "Site <b>", "https://site.example", "/"));
    expect(html).not.toContain("<script>alert");
    expect(html).not.toContain("<img");
    expect(html).not.toMatch(/content="[^"]*"[^>]*onerror/);
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt; &quot;&gt;&lt;img src=x onerror=alert(2)&gt; &amp; &#39; $&amp; $1");
    expect(tag(html, "og:site_name")).toBe("Site &lt;b&gt;");
  });
  it("leaves a page with no head alone", () => {
    expect(injectHead("<p>no head</p>", "<title>x</title>")).toBe("<p>no head</p>");
  });
});

describe("pages through the Worker", () => {
  const idx = index({ "/": page({ title: "Traffic: Area", image: "/og/home-0a1b2c3d.jpg" }), "/proposals": page({ title: "Proposals" }), "/p/charter-aaaa1111": page() });

  it("serves the shell with the home tags for /", async () => {
    const r = await get("/", env(stored(idx)));
    expect(r.status).toBe(200);
    expect(r.headers.get("content-type")).toBe("text/html; charset=utf-8");
    expect(r.headers.get("x-content-type-options")).toBe("nosniff");
    expect(r.headers.get("cache-control")).toBe("public, max-age=0, must-revalidate");
    const html = await r.text();
    expect(html).toContain("<title>Traffic: Area</title>");
    expect(tag(html, "og:image")).toBe("https://site.example/og/home-0a1b2c3d.jpg");
    expect(html).toContain('id="root"');
  });
  it("serves its own tags for a tab", async () => {
    const html = await (await get("/proposals", env(stored(idx)))).text();
    expect(html).toContain("<title>Proposals</title>");
    expect(tag(html, "og:url")).toBe("https://site.example/proposals");
  });
  it("serves a published proposal's tags for /p/<slug>, with or without a trailing slash or capitals", async () => {
    for (const path of ["/p/charter-aaaa1111", "/p/charter-aaaa1111/", "/p/Charter-AAAA1111"]) {
      const html = await (await get(path, env(stored(idx)))).text();
      expect(html).toContain("<title>Filter on Martin and Ayala</title>");
      expect(tag(html, "og:url")).toBe("https://site.example/p/charter-aaaa1111");
      expect(tag(html, "og:description")).toContain("598 → 512");
    }
  });
  it("serves the generic preview for an unknown /p/<slug>, and still the app", async () => {
    const r = await get("/p/nope-00000000", env(stored(idx)));
    expect(r.status).toBe(200);
    const html = await r.text();
    expect(html).toContain("<title>Traffic: Area</title>");
    expect(tag(html, "og:description")).toBe("Generic.");
    expect(html).toContain('<script type="module"');
  });
  it("answers HEAD with the same headers and no body", async () => {
    const e = env(stored(idx));
    const r = await get("/p/charter-aaaa1111", e, { method: "HEAD" });
    expect(r.status).toBe(200);
    expect(r.headers.get("content-type")).toBe("text/html; charset=utf-8");
    expect(await r.text()).toBe("");
    expect(e.seen[0].method).toBe("GET");
  });
  it("does not pass the browser's validators to the shell, whose body it rewrites", async () => {
    const e = env(stored(idx));
    const r = await get("/", e, { headers: { "if-none-match": '"shell"', "if-modified-since": "Wed, 01 Jan 2020 00:00:00 GMT" } });
    expect(r.status).toBe(200);
    expect(e.seen[0].headers.get("if-none-match")).toBeNull();
    expect(e.seen[0].headers.get("if-modified-since")).toBeNull();
    expect(r.headers.get("etag")).toBeNull();
  });
  it("builds absolute URLs on the site from the index, and on the request's origin for localhost", async () => {
    const html = await (await get("/", env(stored(idx)), {}, "http://localhost:5173")).text();
    expect(tag(html, "og:image")).toBe("http://localhost:5173/og/home-0a1b2c3d.jpg");
    const prod = await (await get("/", env(stored(idx)), {}, "https://other.workers.dev")).text();
    expect(tag(prod, "og:image")).toBe("https://site.example/og/home-0a1b2c3d.jpg");
  });
  it("sends the shell as it is when the index is missing, empty of the right shape, or not JSON", async () => {
    for (const files of [{}, stored("not json"), stored(JSON.stringify({ version: 2 })), stored(JSON.stringify({ ...index(), fallback: { title: 1 } }))]) {
      resetIndexCache();
      const r = await get("/proposals", env(files));
      expect(r.status).toBe(200);
      expect(await r.text()).toBe(SHELL);
    }
  });
  it("drops index entries that are not well formed instead of trusting them", async () => {
    const bad = { ...index({ "/proposals": page({ image: "https://evil.example/x.jpg" }) }) };
    const html = await (await get("/proposals", env(stored(bad)))).text();
    expect(html).toContain("<title>Traffic: Area</title>");
    expect(html).not.toContain("evil.example");
  });
  it("reads the index from the static files when the bucket has none (local development)", async () => {
    const e = env({}, (r) => (new URL(r.url).pathname === "/data/og/index.json" ? new Response(JSON.stringify(idx), { headers: { "content-type": "application/json" } }) : new Response(SHELL, { headers: { "content-type": "text/html" } })));
    const html = await (await get("/proposals", e)).text();
    expect(html).toContain("<title>Proposals</title>");
  });
  it("remembers the index for a short time", async () => {
    let reads = 0;
    const e = env(stored(idx));
    const get1 = e.DATA.get.bind(e.DATA);
    (e.DATA as unknown as { get: unknown }).get = async (k: string, o?: unknown) => { reads++; return get1(k, o as never); };
    await get("/", e); await get("/proposals", e); await get("/streets", e);
    expect(reads).toBe(1);
  });
  it("leaves other methods to the assets", async () => {
    const e = env(stored(idx));
    const r = await get("/", e, { method: "POST", body: "x" });
    expect(e.seen).toHaveLength(1);
    expect(e.seen[0].method).toBe("POST");
    expect(r.status).toBe(200);
  });
  it("opens the app for a /p path of another shape", async () => {
    const r = await get("/p/a/b", env(stored(idx)));
    expect(r.status).toBe(200);
    expect(await r.text()).toBe(SHELL);
  });
});

describe("card images", () => {
  const name = "home-0a1b2c3d.jpg";
  const jpg = new Uint8Array([0xff, 0xd8, 0xff]);
  it("serves a stored card as a long-lived, immutable JPEG", async () => {
    const r = await get(`/og/${name}`, env({ [`areas/og/${name}`]: { body: jpg, etag: '"c"' } }));
    expect(r.status).toBe(200);
    expect(r.headers.get("content-type")).toBe("image/jpeg");
    expect(r.headers.get("cache-control")).toBe("public, max-age=31536000, immutable");
    expect(r.headers.get("x-content-type-options")).toBe("nosniff");
    expect(r.headers.get("etag")).toBe('"c"');
    expect(new Uint8Array(await r.arrayBuffer())).toEqual(jpg);
  });
  it("answers a matching If-None-Match with 304 and HEAD with no body", async () => {
    const e = env({ [`areas/og/${name}`]: { body: jpg, etag: '"c"' } });
    const r = await get(`/og/${name}`, e, { headers: { "if-none-match": '"c"' } });
    expect(r.status).toBe(304);
    expect(r.headers.get("content-type")).toBe("image/jpeg");
    const h = await get(`/og/${name}`, e, { method: "HEAD" });
    expect(h.status).toBe(200);
    expect(await h.text()).toBe("");
  });
  it("answers 404 for a card that is not stored, never the app page", async () => {
    const r = await get(`/og/${name}`, env());
    expect(r.status).toBe(404);
    expect(r.headers.get("content-type")).toContain("text/plain");
    expect(r.headers.get("cache-control")).toBe("no-cache");
    expect(r.headers.get("x-content-type-options")).toBe("nosniff");
  });
  it("refuses names that are not card files", async () => {
    for (const bad of ["index.json", "..%2fx.jpg", "home.jpg", "home-0a1b2c3d.png", "HOME-0a1b2c3d.jpg", "a/b-0a1b2c3d.jpg"]) {
      expect((await get(`/og/${bad}`, env({ "areas/og/index.json": { body: "{}", etag: '"x"' } }))).status).toBe(404);
    }
    expect((await get(`/og/${name}`, env(), { method: "POST" })).status).toBe(405);
  });
  it("serves a static card when the bucket has none (local development), and ignores an HTML fallback", async () => {
    const asset = env({}, () => new Response(jpg, { headers: { "content-type": "image/jpeg" } }));
    expect((await get(`/og/${name}`, asset)).status).toBe(200);
    expect((await get(`/og/${name}`, env())).status).toBe(404);
  });
});

describe("other routes are unaffected", () => {
  const idx = stored(index({ "/": page() }));
  it("still serves /data, /api and the text pages", async () => {
    expect((await get("/api/health", env(idx))).status).toBe(200);
    expect((await get("/api/data/x.json", env(idx))).status).toBe(503);
    const data = await get("/data/x.json", env({ ...idx, "areas/x.json": { body: "{}", etag: '"a"' } }));
    expect(data.headers.get("content-type")).toContain("application/json");
    const md = await get("/proposals.md", env({ ...idx, "areas/llms/proposals.md": { body: "# P", etag: '"m"' } }));
    expect(md.headers.get("content-type")).toContain("markdown");
    expect(await md.text()).toBe("# P");
  });
  it("never rewrites a non-page path", async () => {
    const r = await get("/nowhere", env(idx));
    expect(r.status).toBe(404);
  });
});
