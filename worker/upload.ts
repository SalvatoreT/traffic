export interface UploadEnv {
  DATA: R2Bucket;
  UPLOAD_TOKEN?: string;
}

export const UPLOAD_HEADER = "x-upload-token";
export const MAX_UPLOAD_BYTES = 64 * 1024 * 1024;
const PREFIXES = ["areas/", "osm/", "demand/"];

export function isAllowedKey(key: string): boolean {
  if (key.length > 256 || !/^[\w.\-/]+$/.test(key)) return false;
  if (key.split("/").some((part) => part === "" || part === "." || part === "..")) return false;
  return PREFIXES.some((p) => key.startsWith(p) && key.length > p.length);
}

async function digest(value: string): Promise<ArrayBuffer> {
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
}

export async function tokenMatches(given: string | null, expected: string | undefined): Promise<boolean> {
  if (!given || !expected) return false;
  const [a, b] = await Promise.all([digest(given), digest(expected)]);
  const x = new Uint8Array(a);
  const y = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

function json(status: number, body: unknown): Response {
  return Response.json(body, { status, headers: { "cache-control": "no-store" } });
}

export async function handleDataApi(req: Request, env: UploadEnv, key: string): Promise<Response> {
  if (!env.UPLOAD_TOKEN) return json(503, { error: "uploads are not configured" });
  if (!(await tokenMatches(req.headers.get(UPLOAD_HEADER), env.UPLOAD_TOKEN))) {
    return json(401, { error: "unauthorized" });
  }
  if (!isAllowedKey(key)) return json(400, { error: "key not allowed" });

  if (req.method === "GET") {
    const object = await env.DATA.get(key);
    if (!object) return json(404, { error: "not found" });
    return new Response(object.body, {
      headers: {
        "content-type": object.httpMetadata?.contentType ?? "application/octet-stream",
        "cache-control": "no-store",
        etag: object.httpEtag,
      },
    });
  }

  if (req.method === "PUT") {
    const length = Number(req.headers.get("content-length"));
    if (!Number.isFinite(length) || length <= 0) return json(411, { error: "content-length required" });
    if (length > MAX_UPLOAD_BYTES) return json(413, { error: "too large" });
    const object = await env.DATA.put(key, req.body, {
      httpMetadata: { contentType: req.headers.get("content-type") ?? "application/octet-stream" },
    });
    return json(200, { key, size: object.size, etag: object.httpEtag });
  }

  return json(405, { error: "method not allowed" });
}
