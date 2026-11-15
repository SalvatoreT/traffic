// Job storage for sharded batch runs (change sharded-batch-runs): the site's authenticated data endpoint, reached with the same header r2-sync uses.
// The credential is added by the session's network proxy; a variable can override the placeholder for a local stub.
import { createHash } from 'node:crypto';

export interface Store {
  put(key: string, data: Uint8Array, type?: string): Promise<void>;
  /** The object, or null when the key does not exist. */
  get(key: string): Promise<Buffer | null>;
}

export const sha256 = (data: Uint8Array | string): string => createHash('sha256').update(data).digest('hex');

const NAME = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,47}$/;
export function checkName(what: string, value: string | undefined): string {
  if (!value || !NAME.test(value) || value.includes('..')) throw new Error(`${what} must be 1 to 48 letters, digits, dots, dashes or underscores, starting with a letter or digit (got ${JSON.stringify(value ?? '')})`);
  return value;
}

/** A key under the job's prefix. */
export const jobKey = (job: string, ...parts: string[]): string => ['jobs', checkName('job id', job), ...parts].join('/');

export interface HttpOptions { fetchImpl?: typeof fetch; retries?: number; delayMs?: number }

export function httpStore(site: string | undefined, token: string | undefined, o: HttpOptions = {}): Store {
  if (!site) throw new Error('TRAFFIC_UPLOAD_URL is not set (the site that holds the data bucket, for example https://example.org)');
  const base = site.replace(/\/$/, '');
  const doFetch = o.fetchImpl ?? fetch;
  const retries = o.retries ?? 3, delayMs = o.delayMs ?? 500;
  async function call(method: 'PUT' | 'GET', key: string, body?: Uint8Array, type?: string): Promise<Response> {
    const headers: Record<string, string> = { 'x-upload-token': token ?? 'proxy-injected' };
    if (body) { headers['content-type'] = type ?? 'application/octet-stream'; headers['content-length'] = String(body.length); }
    let last = '';
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const res = await doFetch(`${base}/api/data/${key}`, { method, headers, body: body as BodyInit | undefined });
        if (res.status < 500 && res.status !== 429) return res;
        last = `HTTP ${res.status}`;
      } catch (e) { last = (e as Error).message; }
      if (attempt < retries) await new Promise((r) => setTimeout(r, delayMs * 2 ** attempt));
    }
    throw new Error(`${method} ${key}: ${last} after ${retries + 1} tries`);
  }
  return {
    async put(key, data, type) {
      const res = await call('PUT', key, data, type);
      if (!res.ok) throw new Error(`upload ${key}: HTTP ${res.status} ${await res.text()}`);
    },
    async get(key) {
      const res = await call('GET', key);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`download ${key}: HTTP ${res.status} ${await res.text()}`);
      return Buffer.from(await res.arrayBuffer());
    },
  };
}

export async function getJson<T>(store: Store, key: string): Promise<T | null> {
  const data = await store.get(key);
  if (!data) return null;
  try { return JSON.parse(data.toString('utf8')) as T; } catch (e) { throw new Error(`${key} is not valid JSON: ${(e as Error).message}`); }
}

export const putJson = (store: Store, key: string, value: unknown): Promise<void> => store.put(key, Buffer.from(JSON.stringify(value, null, 2) + '\n'), 'application/json; charset=utf-8');
