import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import worker from "./index";
import { TEXT_PATHS } from "./llms";
import { isAllowedKey } from "./upload";

type Stored = { body: string; etag: string };
const SPA = () => new Response("<!doctype html><title>app</title>", { headers: { "content-type": "text/html" } });
function env(files: Record<string, Stored> = {}, assets: (req: Request) => Response = SPA) {
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
const get = (path: string, e: ReturnType<typeof env>, init: RequestInit = {}) => worker.fetch(new Request(`https://example.test${path}`, init), e);

describe("text pages for language models", () => {
  const files = {
    "areas/llms/llms.txt": { body: "# Traffic\n", etag: '"t"' },
    "areas/llms/llms-full.txt": { body: "# Traffic, full\n", etag: '"f"' },
    "areas/llms/proposals.md": { body: "# Proposals\n", etag: '"p"' },
  };
  it("serves llms.txt as text/plain and the pages as text/markdown, with nosniff and revalidation", async () => {
    for (const [path, type, body] of [["/llms.txt", "text/plain; charset=utf-8", "# Traffic\n"], ["/llms-full.txt", "text/plain; charset=utf-8", "# Traffic, full\n"], ["/proposals.md", "text/markdown; charset=utf-8", "# Proposals\n"]]) {
      const r = await get(path, env(files));
      expect(r.status).toBe(200);
      expect(r.headers.get("content-type")).toBe(type);
      expect(r.headers.get("x-content-type-options")).toBe("nosniff");
      expect(r.headers.get("cache-control")).toBe("no-cache");
      expect(r.headers.get("etag")).toMatch(/^"/);
      expect(await r.text()).toBe(body);
    }
  });
  it("answers a matching If-None-Match with 304", async () => {
    const r = await get("/llms.txt", env(files), { headers: { "if-none-match": '"t"' } });
    expect(r.status).toBe(304);
    expect(r.headers.get("etag")).toBe('"t"');
    expect(r.headers.get("x-content-type-options")).toBe("nosniff");
  });
  it("answers HEAD without a body", async () => {
    const r = await get("/proposals.md", env(files), { method: "HEAD" });
    expect(r.status).toBe(200);
    expect(await r.text()).toBe("");
  });
  it("returns a 404, not the app page, for a page that is not published", async () => {
    for (const path of ["/streets.md", "/index.md", "/llms.txt"]) {
      const r = await get(path, env());
      expect(r.status).toBe(404);
      expect(r.headers.get("content-type")).toContain("text/plain");
      expect(r.headers.get("x-content-type-options")).toBe("nosniff");
    }
  });
  it("reads the generated file from the static assets in local development", async () => {
    const seen: string[] = [];
    const e = env({}, (req) => { seen.push(new URL(req.url).pathname); return new Response("# local\n", { headers: { "content-type": "text/markdown" } }); });
    const r = await get("/sources.md", e);
    expect(seen).toEqual(["/data/llms/sources.md"]);
    expect(r.status).toBe(200);
    expect(r.headers.get("content-type")).toBe("text/markdown; charset=utf-8");
  });
  it("refuses methods other than GET and HEAD", async () => {
    const r = await get("/llms.txt", env(files), { method: "POST", body: "x" });
    expect(r.status).toBe(405);
    expect(r.headers.get("allow")).toBe("GET, HEAD");
  });
  it("leaves other paths alone", async () => {
    expect((await get("/other.md", env(files))).status).toBe(404);
    expect((await get("/llms.txt/", env(files))).status).toBe(404);
  });
});

describe("configuration", () => {
  it("lists every text route in run_worker_first", () => {
    const cfg = readFileSync(resolve(import.meta.dirname, "../wrangler.jsonc"), "utf8");
    const first = JSON.parse(cfg.replace(/^\s*\/\/.*$/gm, "")).assets.run_worker_first as string[];
    for (const p of TEXT_PATHS) expect(first).toContain(p);
  });
  it("lets the data upload carry the generated pages under areas/llms/", () => {
    for (const f of ["llms.txt", "llms-full.txt", "proposals.md", "scenario-links.md"]) expect(isAllowedKey(`areas/llms/${f}`)).toBe(true);
  });
});
