// Streams LODES8 OD (main, JT00) + geography crosswalk and writes a compact, area-filtered file.
// CLI: npx tsx tools/lib/demand-lodes-extract.ts <od.csv.gz> <xwalk.csv.gz> <config.json> <out.json>
// Also exported as extractLodes() for tools/fetch-demand.ts (streams straight from the network).
// LODES: US Census Bureau LEHD, public domain (see data/demand/README.md). [LODES]
import { createReadStream, readFileSync, writeFileSync } from 'node:fs';
import type { Readable } from 'node:stream';
import { createGunzip } from 'node:zlib';
import { createInterface } from 'node:readline';

export async function extractLodes(openOd: () => Promise<Readable>, openXwalk: () => Promise<Readable>, cfg: { bbox: number[]; lodes?: { year?: number } }, outPath: string) {
const [minLon, minLat, maxLon, maxLat] = cfg.bbox;
const cLat = (minLat + maxLat) / 2, cLon = (minLon + maxLon) / 2;
const BANDS_KM = [3, 8, 20, Infinity];
const SECTORS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

function sectorBand(lat: number, lon: number) {
  const dx = (lon - cLon) * 111320 * Math.cos((cLat * Math.PI) / 180);
  const dy = (lat - cLat) * 110540;
  const deg = ((Math.atan2(dx, dy) * 180) / Math.PI + 360) % 360;
  const sector = SECTORS[Math.round(deg / 45) % 8];
  const km = Math.hypot(dx, dy) / 1000;
  return { sector, band: BANDS_KM.findIndex((b) => km < b), km };
}

async function lines(path: string, fn: (cols: string[], first: boolean) => void) {
  const rl = createInterface({ input: createReadStream(path).pipe(createGunzip()), crlfDelay: Infinity });
  let first = true;
  for await (const l of rl) { fn(l.split(','), first); first = false; }
}

function splitCsv(l: string): string[] {
  const out: string[] = []; let cur = ''; let q = false;
  for (const ch of l) {
    if (ch === '"') q = !q;
    else if (ch === ',' && !q) { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}

const blk = new Map<string, { lat: number; lon: number }>();
const inside = new Set<string>();
const tracts = new Set<string>();
const idx: Record<string, number> = {};
{
  const rl = createInterface({ input: (await openXwalk()).pipe(createGunzip()), crlfDelay: Infinity });
  let first = true;
  for await (const l of rl) {
    const c = splitCsv(l);
    if (first) { c.forEach((n, i) => (idx[n] = i)); first = false; continue; }
    const lat = +c[idx.blklatdd], lon = +c[idx.blklondd];
    const id = c[idx.tabblk2020];
    blk.set(id, { lat, lon });
    if (lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat) { inside.add(id); tracts.add(c[idx.trct]); }
  }
}

type Row = { block: string; dir: 'out' | 'in'; sector: string; band: number; n: number };
const blocks = new Map<string, { resWorkers: number; jobs: number }>();
for (const id of inside) blocks.set(id, { resWorkers: 0, jobs: 0 });
const ext = new Map<string, Row>();
const internal = new Map<string, number>();
let rows = 0, kept = 0;
{
  const rl = createInterface({ input: (await openOd()).pipe(createGunzip()), crlfDelay: Infinity });
  let first = true;
  for await (const l of rl) {
    if (first) { first = false; continue; }
    rows++;
    const c = l.split(','); // w_geocode,h_geocode,S000,...
    const w = c[0], h = c[1], n = +c[2];
    const hi = inside.has(h), wi = inside.has(w);
    if (!hi && !wi) continue;
    kept++;
    if (hi) blocks.get(h)!.resWorkers += n;
    if (wi) blocks.get(w)!.jobs += n;
    if (hi && wi) { const k = `${h}>${w}`; internal.set(k, (internal.get(k) ?? 0) + n); continue; }
    const other = blk.get(hi ? w : h);
    if (!other) continue;
    const { sector, band } = sectorBand(other.lat, other.lon);
    const dir = hi ? 'out' : 'in';
    const block = hi ? h : w;
    const k = `${block}|${dir}|${sector}|${band}`;
    const r = ext.get(k) ?? { block, dir, sector, band, n: 0 };
    r.n += n; ext.set(k, r);
  }
}

const out = {
  source: 'LEHD LODES8 CA OD main JT00 + ca_xwalk',
  year: cfg.lodes?.year ?? 2024,
  bbox: cfg.bbox,
  filter: 'blocks whose xwalk centroid lies in bbox; OD rows with home or work block in that set',
  sectors: SECTORS,
  bandsKm: BANDS_KM.map((b) => (Number.isFinite(b) ? b : null)),
  tracts: [...tracts].sort(),
  odRowsScanned: rows, odRowsKept: kept,
  blocks: [...blocks].map(([id, v]) => ({ id, ...blk.get(id)!, ...v })),
  internal: [...internal].map(([k, n]) => { const [h, w] = k.split('>'); return { home: h, work: w, n }; }),
  external: [...ext.values()]
};
writeFileSync(outPath, JSON.stringify(out));
console.log(`LODES: blocks in bbox ${inside.size}, tracts ${[...tracts]}, rows scanned ${rows}, kept ${kept}, external rows ${ext.size}`);
return out;
}

if (process.argv[1]?.endsWith('demand-lodes-extract.ts')) {
  const [odPath, xwPath, cfgPath, outPath] = process.argv.slice(2);
  await extractLodes(async () => createReadStream(odPath), async () => createReadStream(xwPath), JSON.parse(readFileSync(cfgPath, 'utf8')), outPath);
}
