import { handleDataApi } from "./upload";

interface Env {
  ASSETS: Fetcher;
  DATA: R2Bucket;
  UPLOAD_TOKEN?: string;
}

async function serveData(req: Request, env: Env, name: string): Promise<Response> {
  if (!/^[\w.-]+$/.test(name)) return new Response(null, { status: 400 });
  const object = await env.DATA.get(`areas/${name}`, { onlyIf: req.headers });
  if (!object) return env.ASSETS.fetch(req);
  const headers = new Headers({
    "content-type": "application/json; charset=utf-8",
    "cache-control": "public, max-age=300",
    etag: object.httpEtag,
  });
  if (!("body" in object)) return new Response(null, { status: 304, headers });
  return new Response(object.body, { headers });
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    if (url.pathname === "/api/health") return Response.json({ ok: true });
    if (url.pathname.startsWith("/api/data/")) {
      return handleDataApi(req, env, decodeURIComponent(url.pathname.slice(10)));
    }
    if (url.pathname.startsWith("/data/")) return serveData(req, env, url.pathname.slice(6));
    return new Response(null, { status: 404 });
  },
};
