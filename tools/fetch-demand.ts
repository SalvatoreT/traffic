// Re-downloads and area-filters every file in data/demand/raw/. Node built-ins only (global fetch).
// Usage: npx tsx tools/fetch-demand.ts [config.json] [--force]
// Existing outputs are skipped unless --force. Area values come from the config.
import { createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync, openSync, readSync, closeSync, statSync, unlinkSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { tmpdir } from 'node:os';
import { inflateRawSync } from 'node:zlib';
import { extractLodes } from './lib/demand-lodes-extract.ts';

const args = process.argv.slice(2);
const force = args.includes('--force');
const cfg = JSON.parse(readFileSync(args.find((a) => a.endsWith('.json')) ?? 'data/demand/rockridge.config.json', 'utf8'));
const fx = cfg.fetch;
const [minLon, minLat, maxLon, maxLat] = cfg.bbox as number[];

const web = async (url: string) => {
  const r = await fetch(url);
  if (!r.ok || !r.body) throw new Error(`${url}: HTTP ${r.status}`);
  return Readable.fromWeb(r.body as never);
};

// --- Caltrans AADT (ArcGIS feature service, bbox padded) ---
async function caltrans() {
  const out = cfg.raw.caltrans;
  if (existsSync(out) && !force) return console.log(`skip ${out}`);
  const pad = fx.caltransPadDeg;
  const q = new URLSearchParams({
    geometry: [minLon - pad, minLat - pad, maxLon + pad, maxLat + pad].join(','), geometryType: 'esriGeometryEnvelope', inSR: '4326',
    spatialRel: 'esriSpatialRelIntersects', outFields: '*', returnGeometry: 'false', f: 'json'
  });
  const r = await fetch(`${fx.caltransQuery}?${q}`);
  if (!r.ok) throw new Error(`Caltrans HTTP ${r.status}`);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, await r.text());
  console.log(`wrote ${out}`);
}

// --- Oakland multi-modal counts: download the zip to a temp file, extract the named members (zip central directory) ---
async function oaklandTmc() {
  const dir = cfg.raw.oaklandTmc;
  const outName = (m: string) => m.replace('/', '_').replace(/&/g, '_');
  const todo = (fx.tmcMembers as string[]).filter((m) => force || !existsSync(join(dir, outName(m))));
  if (!todo.length) return console.log(`skip ${dir}`);
  const tmp = join(tmpdir(), 'oakland-tmc.zip');
  await pipeline(await web(fx.tmcZip), createWriteStream(tmp));
  const size = statSync(tmp).size, fd = openSync(tmp, 'r');
  const read = (pos: number, len: number) => { const b = Buffer.alloc(len); readSync(fd, b, 0, len, pos); return b; };
  const tailLen = Math.min(size, 70000);
  const tail = read(size - tailLen, tailLen);
  const eocd = tail.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  const nEntries = tail.readUInt16LE(eocd + 10), cdSize = tail.readUInt32LE(eocd + 12), cdOff = tail.readUInt32LE(eocd + 16);
  const cd = read(cdOff, cdSize);
  mkdirSync(dir, { recursive: true });
  let p = 0;
  for (let i = 0; i < nEntries; i++) {
    const method = cd.readUInt16LE(p + 10), csize = cd.readUInt32LE(p + 20), nlen = cd.readUInt16LE(p + 28), elen = cd.readUInt16LE(p + 30), clen = cd.readUInt16LE(p + 32), lho = cd.readUInt32LE(p + 42);
    const name = cd.toString('utf8', p + 46, p + 46 + nlen);
    p += 46 + nlen + elen + clen;
    if (!todo.includes(name)) continue;
    const lh = read(lho, 30);
    const data = read(lho + 30 + lh.readUInt16LE(26) + lh.readUInt16LE(28), csize);
    writeFileSync(join(dir, outName(name)), method === 0 ? data : inflateRawSync(data));
    console.log(`wrote ${join(dir, outName(name))}`);
  }
  closeSync(fd); unlinkSync(tmp);
}

// --- LODES: stream xwalk and OD (gz) straight through the area filter ---
async function lodes() {
  const out = cfg.raw.lodes;
  if (existsSync(out) && !force) return console.log(`skip ${out}`);
  const year = cfg.lodes.year;
  const od = fx.lodesBase + fx.lodesOd.replace('{year}', String(year));
  mkdirSync(dirname(out), { recursive: true });
  await extractLodes(() => web(od), () => web(fx.lodesBase + fx.lodesXwalk), cfg, out);
  console.log(`wrote ${out}`);
}

await caltrans();
await oaklandTmc();
await lodes();
