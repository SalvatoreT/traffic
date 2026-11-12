import { describe, expect, it } from "vitest";
import { handleDataApi, isAllowedKey, tokenMatches, MAX_UPLOAD_BYTES, type UploadEnv } from "./upload";

function fakeBucket() {
  const store = new Map<string, { body: string; type: string }>();
  const bucket = {
    async get(key: string) {
      const hit = store.get(key);
      if (!hit) return null;
      return { body: hit.body, httpEtag: '"e"', httpMetadata: { contentType: hit.type } };
    },
    async put(key: string, body: ReadableStream | null, opts: { httpMetadata: { contentType: string } }) {
      const text = body ? await new Response(body).text() : "";
      store.set(key, { body: text, type: opts.httpMetadata.contentType });
      return { size: text.length, httpEtag: '"e"' };
    },
  };
  return { store, bucket: bucket as unknown as R2Bucket };
}

function request(method: string, key: string, init: { token?: string; body?: string; length?: string } = {}) {
  const headers = new Headers();
  if (init.token) headers.set("x-upload-token", init.token);
  if (init.body !== undefined) headers.set("content-length", init.length ?? String(init.body.length));
  if (init.length && init.body === undefined) headers.set("content-length", init.length);
  return new Request(`https://example.test/api/data/${key}`, { method, headers, body: init.body });
}

describe("isAllowedKey", () => {
  it("accepts data prefixes", () => {
    expect(isAllowedKey("areas/rockridge.network.json")).toBe(true);
    expect(isAllowedKey("osm/rockridge.overpass.json")).toBe(true);
    expect(isAllowedKey("demand/raw/oakland/a-b_c.csv")).toBe(true);
  });
  it("rejects everything else", () => {
    for (const key of ["", "areas/", "other/x.json", "areas/../secret", "areas//x", "/areas/x", "areas/x y", "areas/%2e%2e/x", "a".repeat(300)]) {
      expect(isAllowedKey(key)).toBe(false);
    }
  });
});

describe("tokenMatches", () => {
  it("matches only the exact token", async () => {
    expect(await tokenMatches("s3cret", "s3cret")).toBe(true);
    expect(await tokenMatches("s3cret ", "s3cret")).toBe(false);
    expect(await tokenMatches(null, "s3cret")).toBe(false);
    expect(await tokenMatches("s3cret", undefined)).toBe(false);
    expect(await tokenMatches("", "")).toBe(false);
  });
});

describe("handleDataApi", () => {
  it("is disabled without a configured secret", async () => {
    const { bucket } = fakeBucket();
    const res = await handleDataApi(request("PUT", "areas/x.json", { token: "t", body: "{}" }), { DATA: bucket }, "areas/x.json");
    expect(res.status).toBe(503);
  });

  it("rejects a missing or wrong token before looking at the key", async () => {
    const { bucket, store } = fakeBucket();
    const env: UploadEnv = { DATA: bucket, UPLOAD_TOKEN: "right" };
    expect((await handleDataApi(request("PUT", "areas/x.json", { body: "{}" }), env, "areas/x.json")).status).toBe(401);
    expect((await handleDataApi(request("PUT", "areas/x.json", { token: "wrong", body: "{}" }), env, "areas/x.json")).status).toBe(401);
    expect((await handleDataApi(request("GET", "other/x", { token: "wrong" }), env, "other/x")).status).toBe(401);
    expect(store.size).toBe(0);
  });

  it("stores and returns an object with the right token", async () => {
    const { bucket, store } = fakeBucket();
    const env: UploadEnv = { DATA: bucket, UPLOAD_TOKEN: "right" };
    const put = await handleDataApi(request("PUT", "areas/x.json", { token: "right", body: '{"a":1}' }), env, "areas/x.json");
    expect(put.status).toBe(200);
    expect(store.get("areas/x.json")?.body).toBe('{"a":1}');
    const get = await handleDataApi(request("GET", "areas/x.json", { token: "right" }), env, "areas/x.json");
    expect(await get.text()).toBe('{"a":1}');
    expect((await handleDataApi(request("GET", "areas/missing.json", { token: "right" }), env, "areas/missing.json")).status).toBe(404);
  });

  it("enforces key, size and method rules", async () => {
    const { bucket } = fakeBucket();
    const env: UploadEnv = { DATA: bucket, UPLOAD_TOKEN: "right" };
    expect((await handleDataApi(request("PUT", "secrets/x", { token: "right", body: "x" }), env, "secrets/x")).status).toBe(400);
    expect((await handleDataApi(request("PUT", "areas/x", { token: "right", length: String(MAX_UPLOAD_BYTES + 1) }), env, "areas/x")).status).toBe(413);
    expect((await handleDataApi(request("PUT", "areas/x", { token: "right" }), env, "areas/x")).status).toBe(411);
    expect((await handleDataApi(request("DELETE", "areas/x", { token: "right" }), env, "areas/x")).status).toBe(405);
  });
});
