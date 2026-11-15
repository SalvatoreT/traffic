/**
 * Link previews. Crawlers read the HTML the server sends and never run scripts or see the URL fragment, so the head of the app shell is rewritten
 * per path: `/`, the tab paths and `/p/<slug>`. The words and the card image for each path are written at publish time by `npm run data:previews`
 * into `og/index.json` and `og/<name>-<hash>.jpg` (bucket keys `areas/og/...`). Without the index, the shell goes out as it is, with its own default tags.
 */
import { parsePreviewIndex, PREVIEW_FILE, PREVIEW_INDEX_FILE, PREVIEW_PREFIX, type PreviewIndex, type PreviewPage } from "../src/lib/previews";
import { VIEWS } from "../src/lib/route";

interface Env { ASSETS: Fetcher; DATA: R2Bucket }

/** Paths for `run_worker_first` in wrangler.jsonc. */
export const PAGE_PATHS: string[] = [...VIEWS.map((v) => v.path), "/p/*"];
export const CARD_PATHS = [`${PREVIEW_PREFIX}*`];

const SLUG = /^\/p\/[a-z0-9-]{1,80}$/;
/** The key a request path is looked up under: lower case, no trailing slash, `/index.html` as `/`. Null for a path that is not a page. */
export function pageKey(pathname: string): string | null {
  const p = pathname.replace(/\/+$/, "").toLowerCase() || "/";
  if (p === "/index.html") return "/";
  return VIEWS.some((v) => v.path === p) || SLUG.test(p) ? p : null;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** The head tags for one path. Every value from the index is escaped, so data can never add markup. */
export function headTags(page: PreviewPage, siteName: string, origin: string, path: string): string {
  const url = `${origin}${path === "/" ? "/" : path}`;
  const image = `${origin}${page.image}`;
  const m = (attr: "name" | "property", key: string, value: string | number) => `<meta ${attr}="${key}" content="${esc(String(value))}" />`;
  return [
    `<title>${esc(page.title)}</title>`,
    m("name", "description", page.description),
    `<link rel="canonical" href="${esc(url)}" />`,
    m("property", "og:type", "website"),
    m("property", "og:site_name", siteName),
    m("property", "og:title", page.title),
    m("property", "og:description", page.description),
    m("property", "og:url", url),
    m("property", "og:image", image),
    m("property", "og:image:type", "image/jpeg"),
    m("property", "og:image:width", page.imageWidth),
    m("property", "og:image:height", page.imageHeight),
    m("property", "og:image:alt", page.imageAlt),
    m("name", "twitter:card", "summary_large_image"),
    m("name", "twitter:title", page.title),
    m("name", "twitter:description", page.description),
    m("name", "twitter:image", image),
    m("name", "twitter:image:alt", page.imageAlt),
  ].join("\n    ");
}

const OWN_TAGS = [
  /<title\b[^>]*>[\s\S]*?<\/title>\s*/gi,
  /<meta\s[^>]*?(?:name|property)=["'](?:description|og:[^"']*|twitter:[^"']*)["'][^>]*>\s*/gi,
  /<link\s[^>]*?rel=["']canonical["'][^>]*>\s*/gi,
];

/** The page with its own title, description, canonical, Open Graph and Twitter tags replaced by `tags`. A page with no head is returned as it is. */
export function injectHead(html: string, tags: string): string {
  const end = html.search(/<\/head\s*>/i);
  if (end < 0) return html;
  let head = html.slice(0, end);
  for (const re of OWN_TAGS) head = head.replace(re, "");
  return `${head.replace(/\s+$/, "")}\n    ${tags}\n  ${html.slice(end)}`;
}

const TTL_MS = 60_000;
let cached: { at: number; index: PreviewIndex | null } | null = null;
/** For tests: forget the remembered index. */
export const resetIndexCache = () => { cached = null; };

async function readIndex(env: Env, origin: string): Promise<PreviewIndex | null> {
  const object = await env.DATA.get(`areas/og/${PREVIEW_INDEX_FILE}`);
  if (object) return parsePreviewIndex(await object.text());
  // Local development has no bucket entry: the generated files sit in public/data/og.
  const res = await env.ASSETS.fetch(new Request(new URL(`/data/og/${PREVIEW_INDEX_FILE}`, origin)));
  return res.ok && (res.headers.get("content-type") ?? "").includes("json") ? parsePreviewIndex(await res.text()) : null;
}

/** The index, remembered for a minute, so a crawl does not read the bucket for every page. A missing or broken index is null. */
export async function loadIndex(env: Env, origin: string, now = Date.now()): Promise<PreviewIndex | null> {
  if (cached && now - cached.at < TTL_MS) return cached.index;
  let index: PreviewIndex | null = null;
  try { index = await readIndex(env, origin); } catch { index = null; }
  cached = { at: now, index };
  return index;
}

const isLocal = (host: string) => host === "localhost" || host === "127.0.0.1" || host === "[::1]";

export async function servePage(req: Request, env: Env): Promise<Response> {
  const url = new URL(req.url);
  const key = pageKey(url.pathname);
  if (key === null || (req.method !== "GET" && req.method !== "HEAD")) return env.ASSETS.fetch(req);
  const index = await loadIndex(env, url.origin);
  if (!index) return env.ASSETS.fetch(req);
  // The shell is the same file for every path; the browser's own validators are not passed on, because the rewritten body differs by path.
  const headers = new Headers(req.headers);
  headers.delete("if-none-match"); headers.delete("if-modified-since"); headers.delete("range");
  const shell = await env.ASSETS.fetch(new Request(new URL("/", req.url), { method: "GET", headers }));
  if (!shell.ok || !(shell.headers.get("content-type") ?? "").includes("html")) return shell;
  const page = index.pages[key] ?? index.fallback;
  const origin = isLocal(url.hostname) ? url.origin : index.site.replace(/\/$/, "") || url.origin;
  const html = injectHead(await shell.text(), headTags(page, index.siteName, origin, key));
  return new Response(req.method === "HEAD" ? null : html, {
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=0, must-revalidate", "x-content-type-options": "nosniff" },
  });
}

const CARD_SAFE = { "x-content-type-options": "nosniff" };

/** A card image. Its name carries a hash of its bytes, so it never changes and is cached for a year; a new card is a new URL. */
export async function serveCard(req: Request, env: Env, name: string): Promise<Response> {
  if (req.method !== "GET" && req.method !== "HEAD") return new Response("Method not allowed.\n", { status: 405, headers: { ...CARD_SAFE, allow: "GET, HEAD", "content-type": "text/plain; charset=utf-8" } });
  const missing = () => new Response("Not found.\n", { status: 404, headers: { ...CARD_SAFE, "cache-control": "no-cache", "content-type": "text/plain; charset=utf-8" } });
  if (!PREVIEW_FILE.test(name)) return missing();
  const head = req.method === "HEAD";
  const base = { ...CARD_SAFE, "content-type": "image/jpeg", "cache-control": "public, max-age=31536000, immutable" };
  const object = await env.DATA.get(`areas/og/${name}`, { onlyIf: req.headers });
  if (object) {
    const headers = new Headers({ ...base, etag: object.httpEtag });
    if (!("body" in object)) return new Response(null, { status: 304, headers });
    return new Response(head ? null : object.body, { headers });
  }
  const res = await env.ASSETS.fetch(new Request(new URL(`/data/og/${name}`, req.url), { headers: req.headers }));
  if (res.status === 304) return new Response(null, { status: 304, headers: base });
  if (res.ok && (res.headers.get("content-type") ?? "").startsWith("image/")) {
    const headers = new Headers(base);
    const etag = res.headers.get("etag");
    if (etag) headers.set("etag", etag);
    return new Response(head ? null : res.body, { headers });
  }
  return missing();
}
