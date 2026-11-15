import { describe, expect, it } from "vitest";
import worker from "./index";

type Stored = { body: string; etag: string };
function env(files: Record<string, Stored> = {}, assets: (req: Request) => Response = () => new Response("<!doctype html><title>app</title>", { headers: { "content-type": "text/html" } })) {
  const DATA = {
    async get(key: string, opts?: { onlyIf?: Headers }) {
      const hit = files[key];
      if (!hit) return null;
      if (opts?.onlyIf?.get("if-none-match") === hit.etag) return { httpEtag: hit.etag };
      return { httpEtag: hit.etag, body: hit.body };
    },
  } as unknown as R2Bucket;
  return { DATA, ASSETS: { fetch: async (r: Request) => assets(r) } as unknown as Fetcher };
}
const get = (path: string, e: ReturnType<typeof env>, headers: Record<string, string> = {}) => worker.fetch(new Request(`https://example.test${path}`, { headers }), e);

describe("/data", () => {
  it("serves a stored file with an ETag, nosniff and revalidation on every use", async () => {
    const r = await get("/data/rockridge.network.json", env({ "areas/rockridge.network.json": { body: "{}", etag: '"a"' } }));
    expect(r.status).toBe(200);
    expect(r.headers.get("cache-control")).toBe("no-cache");
    expect(r.headers.get("etag")).toBe('"a"');
    expect(r.headers.get("x-content-type-options")).toBe("nosniff");
    expect(await r.text()).toBe("{}");
  });
  it("answers a matching If-None-Match with 304, results included", async () => {
    const e = env({ "areas/results/rockridge/k.json": { body: "{}", etag: '"b"' }, "areas/x.json": { body: "{}", etag: '"c"' } });
    for (const [path, etag] of [["/data/results/rockridge/k.json", '"b"'], ["/data/x.json", '"c"']]) {
      const r = await get(path, e, { "if-none-match": etag });
      expect(r.status).toBe(304);
      expect(r.headers.get("etag")).toBe(etag);
      expect(r.headers.get("cache-control")).toBe("no-cache");
      expect(r.headers.get("x-content-type-options")).toBe("nosniff");
    }
  });
  it("returns a 404 JSON error for a missing file, not the app page", async () => {
    for (const path of ["/data/missing.json", "/data/results/rockridge/nope.json"]) {
      const r = await get(path, env());
      expect(r.status).toBe(404);
      expect(r.headers.get("content-type")).toContain("json");
      expect(r.headers.get("x-content-type-options")).toBe("nosniff");
      expect(await r.json()).toEqual({ error: "not found" });
    }
  });
  it("still serves a JSON file the static assets hold (local development)", async () => {
    const e = env({}, () => new Response("{}", { headers: { "content-type": "application/json" } }));
    const r = await get("/data/local.json", e);
    expect(r.status).toBe(200);
    expect(r.headers.get("cache-control")).toBe("no-cache");
  });
  it("answers a malformed percent sequence with 400, not a server error", async () => {
    for (const path of ["/data/%", "/data/%E0%A4%A", "/data/results/%zz/x.json"]) {
      const r = await get(path, env());
      expect(r.status).toBe(400);
      expect(r.headers.get("x-content-type-options")).toBe("nosniff");
    }
    expect((await get("/api/data/%", env())).status).toBe(400);
  });
  it("rejects names it does not serve", async () => {
    expect((await get("/data/..%2fsecret", env())).status).toBe(400);
  });
});
