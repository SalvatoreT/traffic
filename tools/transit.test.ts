import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { deflateRawSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { makeProjection, type Pt } from './lib/geo';
import { addStopTimes, parseGtfs, referenceDate, activeServices } from './lib/gtfs';
import { buildTransit, type Transit, type TransitConfig } from './lib/transit';
import type { Network } from './lib/types';
import { readZipBuffer } from './lib/zip';

const root = resolve(import.meta.dirname, '..');
const netPath = resolve(root, 'public/data/rockridge.network.json');
const cfg: TransitConfig = {
  ...JSON.parse(readFileSync(resolve(root, 'data/transit/rockridge.config.json'), 'utf8')),
};

function zip(files: Record<string, string>): Buffer {
  const parts: Buffer[] = [];
  const central: Buffer[] = [];
  let off = 0;
  Object.entries(files).forEach(([name, text], i) => {
    const raw = Buffer.from(text);
    const data = i % 2 ? deflateRawSync(raw) : raw;
    const method = i % 2 ? 8 : 0;
    const nm = Buffer.from(name);
    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0);
    lh.writeUInt16LE(method, 8);
    lh.writeUInt32LE(data.length, 18);
    lh.writeUInt32LE(raw.length, 22);
    lh.writeUInt16LE(nm.length, 26);
    const ch = Buffer.alloc(46);
    ch.writeUInt32LE(0x02014b50, 0);
    ch.writeUInt16LE(method, 10);
    ch.writeUInt32LE(data.length, 20);
    ch.writeUInt32LE(raw.length, 24);
    ch.writeUInt16LE(nm.length, 28);
    ch.writeUInt32LE(off, 42);
    parts.push(lh, nm, data);
    central.push(ch, nm);
    off += 30 + nm.length + data.length;
  });
  const cd = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(Object.keys(files).length, 10);
  end.writeUInt32LE(cd.length, 12);
  end.writeUInt32LE(off, 16);
  return Buffer.concat([...parts, cd, end]);
}

const hhmm = (s: number) => `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:00`;

describe.skipIf(!existsSync(netPath))('transit from GTFS (synthetic feed on the Rockridge network)', () => {
  const net: Network = JSON.parse(readFileSync(netPath, 'utf8'));
  const proj = makeProjection(net.origin.lon, net.origin.lat);
  // The longest chain of same-name arterial links.
  const chainFrom = (start: Network['links'][number]) => {
    const c = [start];
    for (;;) {
      const last = c.at(-1)!;
      const next = net.links.find((l) => l.from === last.to && l.name === last.name && l.to !== last.from && !c.includes(l));
      if (!next || c.length >= 10) return c;
      c.push(next);
    }
  };
  const chain = net.links
    .filter((l) => l.class !== 'motorway' && l.name && l.length > 30)
    .map(chainFrom)
    .reduce((b, c) => (c.length > b.length ? c : b));
  const path: Pt[] = chain.flatMap((l, i) => (i ? l.geometry.slice(1) : l.geometry));
  const ext = (a: Pt, b: Pt, d: number): Pt => {
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    return [b[0] + ((b[0] - a[0]) / l) * d, b[1] + ((b[1] - a[1]) / l) * d];
  };
  const noisy = path.map((p, i): Pt => [p[0] + (i % 2 ? 3 : -3), p[1] + 2]);
  const shape = [ext(path[1], path[0], 400), ...noisy, ext(path.at(-2)!, path.at(-1)!, 400)];
  const ll = (p: Pt) => proj.inv(p[0], p[1]);
  const stopsAt = chain.filter((_, i) => i % 2 === 1).map((l, i) => ({ id: `S${i}`, link: l, p: ll([l.geometry[0][0] + (l.geometry.at(-1)![0] - l.geometry[0][0]) / 2 + 6, l.geometry[0][1] + (l.geometry.at(-1)![1] - l.geometry[0][1]) / 2]) }));
  const clipLink = net.links.find((l) => l.name !== chain[0].name && l.class === 'residential' && l.length > 60)!;
  const clip = [ext(clipLink.geometry[1], clipLink.geometry[0], 60), clipLink.geometry[0], clipLink.geometry[1]];

  const times: number[] = [];
  const add = (from: number, to: number, every: number) => {
    for (let t = from; t < to; t += every) times.push(t);
  };
  add(7 * 3600, 9 * 3600, 900);
  add(11 * 3600, 13 * 3600, 1800);
  add(16 * 3600, 18 * 3600, 720);
  const csv = (h: string[], rows: (string | number)[][]) => [h.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const tripRows: (string | number)[][] = times.map((_, i) => ['51', 'WK', `T${i}`, 0, 'SH1']);
  tripRows.push(['99', 'WK', 'C0', 0, 'SH2'], ['51', 'SUN', 'X0', 0, 'SH1']);
  const stRows: (string | number)[][] = [];
  times.forEach((t, i) => stopsAt.forEach((s, k) => stRows.push([`T${i}`, hhmm(t + 60 * k), hhmm(t + 60 * k), s.id, k + 1])));
  stRows.push(['C0', '08:00:00', '08:00:00', 'S0', 1], ['X0', '08:00:00', '08:00:00', 'S0', 1]);
  const feed = zip({
    'feed_info.txt': csv(['feed_publisher_name', 'feed_version', 'feed_start_date', 'feed_end_date'], [['Test', 'v1', '20260101', '20261231']]),
    'routes.txt': csv(['route_id', 'route_short_name', 'route_long_name'], [['51', '51B', 'Test line'], ['99', '99', 'Corner clip']]),
    'stops.txt': csv(['stop_id', 'stop_name', 'stop_lat', 'stop_lon'], stopsAt.map((s) => [s.id, `"Stop, ${s.id}"`, s.p[1], s.p[0]])),
    'trips.txt': csv(['route_id', 'service_id', 'trip_id', 'direction_id', 'shape_id'], tripRows),
    'shapes.txt': csv(['shape_id', 'shape_pt_lat', 'shape_pt_lon', 'shape_pt_sequence'], [
      ...shape.map((p, i) => ['SH1', ll(p)[1], ll(p)[0], i + 1]),
      ...clip.map((p, i) => ['SH2', ll(p)[1], ll(p)[0], i + 1]),
    ]),
    'calendar.txt': csv(['service_id', ...'sunday,monday,tuesday,wednesday,thursday,friday,saturday'.split(','), 'start_date', 'end_date'], [
      ['WK', 0, 1, 1, 1, 1, 1, 0, '20260101', '20261231'],
      ['SUN', 1, 0, 0, 0, 0, 0, 0, '20260101', '20261231'],
    ]),
    'stop_times.txt': csv(['trip_id', 'arrival_time', 'departure_time', 'stop_id', 'stop_sequence'], stRows),
  });

  const files = readZipBuffer(feed);
  const text = (n: string) => files.get(n)?.toString('utf8');
  const g = parseGtfs(text);
  const ref = referenceDate(g);
  addStopTimes(g, text('stop_times.txt')!, new Set([...g.trips.values()].filter((t) => activeServices(g, ref).has(t.service)).map((t) => t.id)));
  const { transit, report } = buildTransit(net, g, cfg, ref);

  it('reads the zip, quoted fields and picks a weekday', () => {
    expect(g.stops.get('S0')!.name).toBe('Stop, S0');
    expect(new Date(Date.UTC(+ref.slice(0, 4), +ref.slice(4, 6) - 1, +ref.slice(6))).getUTCDay()).toBe(3);
    expect(g.stopTimes.has('X0')).toBe(false);
  });
  it('recovers the link chain through noise and drops the corner clip', () => {
    expect(transit.routes.map((r) => r.name)).toEqual(['51B']);
    const links = transit.routes[0].links;
    const want = new Set(chain.map((l) => l.id));
    expect(links.filter((id) => want.has(id)).length / chain.length).toBeGreaterThanOrEqual(0.8);
    for (let i = 1; i < links.length; i++) expect(net.links[links[i]].from).toBe(net.links[links[i - 1]].to);
  });
  it('places stops on links within their length, in order', () => {
    const r = transit.routes[0];
    expect(r.stops.length).toBe(stopsAt.length);
    for (const s of r.stops) {
      expect(r.links).toContain(s.link);
      expect(s.position).toBeGreaterThan(0);
      expect(s.position).toBeLessThanOrEqual(net.links[s.link].length);
      expect(s.dwell).toBe(20);
    }
    const idx = r.stops.map((s) => r.links.indexOf(s.link) * 1e4 + s.position);
    expect(idx).toEqual([...idx].sort((a, b) => a - b));
  });
  it('computes headways per period from weekday trips', () => {
    expect(transit.routes[0].headways).toEqual([
      { period: 'am_peak', seconds: 900 },
      { period: 'midday', seconds: 1800 },
      { period: 'pm_peak', seconds: 720 },
    ]);
    expect(report[0].trips).toBe(times.length);
  });
  it('carries provenance with the dwell assumption', () => {
    expect(transit.provenance[0].note).toMatch(/ASSUMPTION/);
  });
});

describe('generated rockridge transit file', () => {
  const path = resolve(root, 'public/data/rockridge.transit.json');
  it.skipIf(!existsSync(path) || !existsSync(netPath))('follows the Transit contract', () => {
    const t: Transit = JSON.parse(readFileSync(path, 'utf8'));
    const net: Network = JSON.parse(readFileSync(netPath, 'utf8'));
    expect(t.version).toBe(1);
    expect(t.area).toBe('rockridge');
    expect(t.provenance.length).toBeGreaterThan(0);
    const ids = new Set<string>();
    for (const r of t.routes) {
      expect(ids.has(r.id)).toBe(false);
      ids.add(r.id);
      expect(r.links.length).toBeGreaterThan(0);
      for (let i = 0; i < r.links.length; i++) {
        expect(net.links[r.links[i]]).toBeDefined();
        if (i) expect(net.links[r.links[i]].from).toBe(net.links[r.links[i - 1]].to);
      }
      for (const s of r.stops) {
        expect(r.links).toContain(s.link);
        expect(s.position).toBeGreaterThan(0);
        expect(s.position).toBeLessThanOrEqual(net.links[s.link].length);
        expect(s.dwell).toBeGreaterThan(0);
      }
      for (const h of r.headways) expect(h.seconds).toBeGreaterThan(0);
    }
  });
});
