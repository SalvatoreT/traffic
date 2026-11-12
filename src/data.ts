import type { AreaBundle, AreaEntry, Demand, GeoFC, Network } from './types';
import { buildFixture } from './fixtures/area';
import { straightenJunctionEnds } from './lib/junctionends';

export interface LoadProgress { loaded: number; total: number | null }
export type ProgressFn = (p: LoadProgress) => void;

/** A study-area file could not be fetched or read. The UI offers a retry. */
export class DataLoadError extends Error {
  constructor(message: string, readonly kind: 'network' | 'http' | 'parse', readonly status?: number) { super(message); this.name = 'DataLoadError'; }
}

interface Part { loaded: number; total: number | null }

/** Total bytes are known only once every file has reported a length; until then the UI shows a spinner. */
export function aggregateProgress(parts: Part[]): LoadProgress {
  const loaded = parts.reduce((s, p) => s + p.loaded, 0);
  const known = parts.length > 0 && parts.every((p) => p.total !== null && p.total > 0);
  return { loaded, total: known ? parts.reduce((s, p) => s + (p.total as number), 0) : null };
}

const fileName = (url: string) => url.split('/').pop() ?? url;

async function getText(url: string, part?: Part, onPart?: () => void): Promise<string> {
  let r: Response;
  try { r = await fetch(url); } catch { throw new DataLoadError(`Could not reach the server for ${fileName(url)}.`, 'network'); }
  if (!r.ok) throw new DataLoadError(`${fileName(url)} returned status ${r.status}.`, 'http', r.status);
  const len = Number(r.headers.get('content-length'));
  if (part) { part.total = len > 0 ? len : null; onPart?.(); }
  if (!r.body || !part) return r.text();
  const reader = r.body.getReader();
  const dec = new TextDecoder();
  const out: string[] = [];
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      part.loaded += value.byteLength;
      out.push(dec.decode(value, { stream: true }));
      onPart?.();
    }
  } catch { throw new DataLoadError(`The download of ${fileName(url)} was interrupted.`, 'network'); }
  out.push(dec.decode());
  return out.join('');
}

function parse<T>(url: string, text: string): T {
  try { return JSON.parse(text) as T; } catch { throw new DataLoadError(`${fileName(url)} is not valid data.`, 'parse'); }
}

export async function loadArea(preferred?: string, forceFixture = false, onProgress?: ProgressFn): Promise<AreaBundle> {
  if (forceFixture) return buildFixture();
  let areas: AreaEntry[] | null = null;
  try {
    areas = parse<AreaEntry[]>('/data/areas.json', await getText('/data/areas.json'));
  } catch (e) {
    // A missing index (404) or an SPA fallback page means no data files are deployed; anything else is a real failure.
    const err = e as DataLoadError;
    if (!(err.kind === 'parse' || (err.kind === 'http' && err.status === 404))) throw err;
    console.info('Using synthetic fixture area:', err.message);
  }
  const entry = areas?.find((a) => a.id === preferred) ?? areas?.[0];
  if (!entry) return buildFixture();

  const base = (f: string) => (f.startsWith('/') || f.startsWith('http') ? f : `/data/${f}`);
  const urls = { network: base(entry.network), demand: base(entry.demand), basemap: base(entry.basemap) };
  const parts: Record<'network' | 'demand' | 'basemap', Part> = {
    network: { loaded: 0, total: null }, demand: { loaded: 0, total: null }, basemap: { loaded: 0, total: null },
  };
  const active = (['network', 'demand', 'basemap'] as const).map((k) => parts[k]);
  let lastPost = 0;
  const report = () => {
    const now = performance.now();
    if (now - lastPost < 50) return;
    lastPost = now;
    onProgress?.(aggregateProgress(active));
  };
  onProgress?.({ loaded: 0, total: null });
  const [networkText, demandText, basemapText] = await Promise.all([
    getText(urls.network, parts.network, report),
    getText(urls.demand, parts.demand, report),
    getText(urls.basemap, parts.basemap, report),
  ]);
  onProgress?.(aggregateProgress(active.map((p) => ({ loaded: p.total ?? p.loaded, total: p.total }))));
  const parsed = parse<Network>(urls.network, networkText);
  const { network, changed } = straightenJunctionEnds(parsed);
  const demand = parse<Demand>(urls.demand, demandText);
  const basemap = parse<GeoFC>(urls.basemap, basemapText);
  return { entry, network, demand, basemap, synthetic: false, raw: { network: networkText, demand: demandText, simNetwork: changed > 0 ? JSON.stringify(network) : undefined } };
}
