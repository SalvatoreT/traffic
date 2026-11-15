// Test stand-in for the site: serves /api/data/<key> on localhost through the real handleDataApi (worker/upload.ts) with an in-memory bucket.
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { handleDataApi, type UploadEnv } from '../../worker/upload';

export interface StubSite { url: string; store: Map<string, { body: Buffer; type: string }>; requests: string[]; failNext: { n: number }; close(): Promise<void> }

export async function startStubSite(token = 'dummy-token'): Promise<StubSite> {
  const store = new Map<string, { body: Buffer; type: string }>();
  const bucket = {
    async get(key: string) { const h = store.get(key); return h ? { body: h.body, httpEtag: '"e"', httpMetadata: { contentType: h.type } } : null; },
    async put(key: string, body: ReadableStream, opts: { httpMetadata: { contentType: string } }) { const b = Buffer.from(await new Response(body).arrayBuffer()); store.set(key, { body: b, type: opts.httpMetadata.contentType }); return { size: b.length, httpEtag: '"e"' }; },
  };
  const env = { DATA: bucket as unknown as R2Bucket, UPLOAD_TOKEN: token } as UploadEnv;
  const requests: string[] = [];
  const failNext = { n: 0 };
  const server: Server = createServer(async (req, res) => {
    const chunks: Buffer[] = [];
    for await (const c of req) chunks.push(c as Buffer);
    const body = Buffer.concat(chunks);
    requests.push(`${req.method} ${req.url}`);
    if (failNext.n > 0) { failNext.n--; res.writeHead(500).end('boom'); return; }
    const path = new URL(req.url ?? '/', 'http://x').pathname;
    if (!path.startsWith('/api/data/')) { res.writeHead(404).end('not found'); return; }
    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers.set(k, v);
    const r = await handleDataApi(new Request(`http://x${path}`, { method: req.method, headers, body: req.method === 'PUT' ? body : undefined }), env, decodeURIComponent(path.slice('/api/data/'.length)));
    res.writeHead(r.status, { 'content-type': r.headers.get('content-type') ?? 'text/plain' }).end(Buffer.from(await r.arrayBuffer()));
  });
  await new Promise<void>((ok) => server.listen(0, '127.0.0.1', ok));
  return { url: `http://127.0.0.1:${(server.address() as AddressInfo).port}`, store, requests, failNext, close: () => new Promise((ok) => { server.closeAllConnections(); server.close(() => ok()); }) };
}
