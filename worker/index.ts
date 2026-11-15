import { isServableName } from "./paths";
import { serveText, textRoute } from "./llms";
import { handleDataApi } from "./upload";
import { pageKey, serveCard, servePage } from "./og";

interface Env {
  ASSETS: Fetcher;
  DATA: R2Bucket;
  UPLOAD_TOKEN?: string;
}

/** Every /data response says what it is, so a browser never guesses. */
function tagged(res: Response, extra: Record<string, string> = {}): Response {
  const headers = new Headers(res.headers);
  headers.set("x-content-type-options", "nosniff");
  for (const [k, v] of Object.entries(extra)) headers.set(k, v);
  return new Response(res.status === 304 || res.status === 204 ? null : res.body, { status: res.status, statusText: res.statusText, headers });
}
const notFound = () => tagged(Response.json({ error: "not found" }, { status: 404 }), { "cache-control": "no-cache" });

async function serveData(req: Request, env: Env, name: string): Promise<Response> {
  if (!isServableName(name)) return tagged(new Response(null, { status: 400 }));
  const object = await env.DATA.get(`areas/${name}`, { onlyIf: req.headers });
  if (!object) {
    // A file that is not stored is a plain 404, not the app page the single-page fallback would send.
    const res = await env.ASSETS.fetch(req);
    if (res.status === 304) return tagged(res, { "cache-control": "no-cache" });
    return res.ok && (res.headers.get("content-type") ?? "").includes("json") ? tagged(res, { "cache-control": "no-cache" }) : notFound();
  }
  // Revalidated on every use, so a new bundle never pairs with data from before a publish; the ETag keeps that a 304 when nothing changed.
  const headers = new Headers({
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-cache",
    etag: object.httpEtag,
  });
  if (!("body" in object)) return tagged(new Response(null, { status: 304, headers }));
  return tagged(new Response(object.body, { headers }));
}

function decoded(s: string): string | null {
  try { return decodeURIComponent(s); } catch { return null; }
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    if (url.pathname === "/api/health") return Response.json({ ok: true });
    if (url.pathname.startsWith("/api/data/")) {
      const key = decoded(url.pathname.slice(10));
      if (key === null) return new Response("Bad request.", { status: 400 });
      return handleDataApi(req, env, key);
    }
    if (url.pathname.startsWith("/data/")) {
      const name = decoded(url.pathname.slice(6));
      return name === null ? tagged(new Response(null, { status: 400 })) : serveData(req, env, name);
    }
    if (url.pathname.startsWith("/og/")) return serveCard(req, env, url.pathname.slice(4));
    if (pageKey(url.pathname) !== null) return servePage(req, env);
    // A share path with a shape the previews do not cover still opens the app.
    if (url.pathname.startsWith("/p/")) return env.ASSETS.fetch(req);
    const text = textRoute(url.pathname);
    if (text) return serveText(req, env, text);
    return new Response(null, { status: 404 });
  },
};
