// Downloads Caltrans "Ramp Volumes on the California State Freeway System" workbooks (xlsx) and keeps the
// rows of the configured routes as JSON. Node built-ins only (xlsx = zip of XML; read with zlib).
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { inflateRawSync } from 'node:zlib';

export interface RampRow { route: string; postmile: string; desc: string; adt: Record<string, number> }

function zipMembers(buf: Buffer): Map<string, Buffer> {
  const eocd = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  const n = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const out = new Map<string, Buffer>();
  for (let i = 0; i < n; i++) {
    const method = buf.readUInt16LE(p + 10), csize = buf.readUInt32LE(p + 20), nlen = buf.readUInt16LE(p + 28), elen = buf.readUInt16LE(p + 30), clen = buf.readUInt16LE(p + 32), lho = buf.readUInt32LE(p + 42);
    const name = buf.toString('utf8', p + 46, p + 46 + nlen);
    p += 46 + nlen + elen + clen;
    const start = lho + 30 + buf.readUInt16LE(lho + 26) + buf.readUInt16LE(lho + 28);
    const data = buf.subarray(start, start + csize);
    out.set(name, method === 0 ? data : inflateRawSync(data));
  }
  return out;
}

const unxml = (s: string) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');

function sheetRows(xlsx: Buffer): Record<string, string>[] {
  const m = zipMembers(xlsx);
  const sst = [...(m.get('xl/sharedStrings.xml')?.toString('utf8') ?? '').matchAll(/<si>([\s\S]*?)<\/si>/g)]
    .map((x) => unxml([...x[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => t[1]).join('')));
  const rows: Record<string, string>[] = [];
  for (const [name, data] of m) {
    if (!/^xl\/worksheets\/sheet\d+\.xml$/.test(name)) continue;
    for (const r of data.toString('utf8').matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)) {
      const row: Record<string, string> = {};
      for (const c of r[1].matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
        const v = c[2]?.match(/<v>([\s\S]*?)<\/v>/);
        if (!v) continue;
        const ref = c[1].match(/\br="([A-Z]+)\d+"/)?.[1];
        if (ref) row[ref] = /\bt="s"/.test(c[1]) ? sst[+v[1]] : unxml(v[1]);
      }
      rows.push(row);
    }
  }
  return rows;
}

export async function extractRampAdt(urls: string[], routes: string[], out: string, get: (url: string) => Promise<Buffer>) {
  const merged = new Map<string, RampRow>();
  const files: { url: string; years: string }[] = [];
  for (const url of urls) {
    const rows = sheetRows(await get(url));
    const header = rows.find((r) => Object.values(r).includes('DIST_COUNTY_ROUTE'));
    if (!header) throw new Error(`${url}: no DIST_COUNTY_ROUTE header`);
    const col = (name: string) => Object.entries(header).find(([, v]) => v === name)?.[0];
    const [cRoute, cPfx, cPm, cDesc] = ['DIST_COUNTY_ROUTE', 'PM_PFX', 'POSTMILE', 'LOCATION_DESC'].map(col);
    const yearCols = Object.entries(header).filter(([, v]) => /^YR_\d{4}$/.test(v)).map(([k, v]) => [k, v.slice(3)] as const);
    files.push({ url, years: `${yearCols[0]?.[1]}-${yearCols.at(-1)?.[1]}` });
    for (const r of rows) {
      if (!routes.includes(r[cRoute!]) || !r[cDesc!]) continue;
      const pm = `${r[cPfx!] ?? ''}${Number(r[cPm!]).toFixed(3)}`;
      const key = `${r[cRoute!]}|${pm}|${r[cDesc!]}`;
      const e = merged.get(key) ?? { route: r[cRoute!], postmile: pm, desc: r[cDesc!], adt: {} };
      for (const [k, y] of yearCols) if (r[k] !== undefined && Number(r[k]) > 1001) e.adt[y] = Number(r[k]); // 1001 is a placeholder code in the source
      merged.set(key, e);
    }
  }
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify({ routes, files, rows: [...merged.values()].filter((r) => Object.keys(r.adt).length) }, null, 1));
}
