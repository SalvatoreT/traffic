import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { round6 } from './lib/geo';
import { buildNetwork, CLASS_MAP } from './lib/network';
import type { AreaConfig, Network, Overpass } from './lib/types';

const root = resolve(import.meta.dirname, '..');
const outDir = resolve(root, 'public/data');

export function buildBasemap(cfg: AreaConfig, osm: Overpass) {
  const [minLon, minLat, maxLon, maxLat] = cfg.bbox;
  const nodes = new Map<number, [number, number]>();
  for (const e of osm.elements) if (e.type === 'node') nodes.set(e.id, [e.lon, e.lat]);
  const features: object[] = [];
  for (const e of osm.elements) {
    if (e.type !== 'way' || !e.tags?.highway) continue;
    let run: [number, number][] = [];
    const emit = () => {
      if (run.length >= 2) {
        features.push({
          type: 'Feature',
          properties: { kind: CLASS_MAP[e.tags.highway] ?? e.tags.highway, name: e.tags.name ?? '' },
          geometry: { type: 'LineString', coordinates: run },
        });
      }
      run = [];
    };
    for (const id of e.nodes) {
      const p = nodes.get(id);
      if (p && p[0] >= minLon && p[0] <= maxLon && p[1] >= minLat && p[1] <= maxLat) run.push([round6(p[0]), round6(p[1])]);
      else emit();
    }
    emit();
  }
  return { type: 'FeatureCollection', features };
}

export function summarize(net: Network): string {
  const lines: string[] = [];
  const tally = <T>(xs: T[], key: (x: T) => string) => {
    const m = new Map<string, number>();
    for (const x of xs) m.set(key(x), (m.get(key(x)) ?? 0) + 1);
    return [...m].sort().map(([k, v]) => `${k}=${v}`).join(' ');
  };
  lines.push(`${net.id}: ${net.nodes.length} nodes, ${net.links.length} links`);
  lines.push(`links by class: ${tally(net.links, (l) => l.class)}`);
  lines.push(`nodes by control: ${tally(net.nodes, (n) => n.control)}`);
  lines.push(`stopAtEnd links: ${net.links.filter((l) => l.stopAtEnd).length}, links with humps: ${net.links.filter((l) => l.humps.length).length}`);
  const gates = net.nodes.filter((n) => n.gate);
  const gateNames = gates.map((g) => {
    const names = new Set(net.links.filter((l) => l.from === g.id || l.to === g.id).map((l) => l.name || '(unnamed)'));
    return [...names].join('/');
  });
  lines.push(`gates: ${gates.length}`);
  lines.push(`  ${tally(gateNames, (s) => s)}`);
  const sa = net.links.filter((l) => l.inStudyArea);
  lines.push(`study area: ${net.nodes.filter((n) => n.inStudyArea).length} nodes, ${sa.length} links (${tally(sa, (l) => l.class)})`);
  return lines.join('\n');
}

function main() {
  const args = process.argv.slice(2);
  const configs = args.length
    ? args
    : readdirSync(resolve(root, 'data/areas')).filter((f) => f.endsWith('.json')).map((f) => resolve(root, 'data/areas', f));
  mkdirSync(outDir, { recursive: true });
  const manifest: object[] = [];
  for (const path of configs) {
    const cfg: AreaConfig = JSON.parse(readFileSync(path, 'utf8'));
    const osm: Overpass = JSON.parse(readFileSync(resolve(root, cfg.extract), 'utf8'));
    const { network, stats } = buildNetwork(cfg, osm);
    writeFileSync(resolve(outDir, `${cfg.id}.network.json`), JSON.stringify(network));
    writeFileSync(resolve(outDir, `${cfg.id}.basemap.json`), JSON.stringify(buildBasemap(cfg, osm)));
    console.log(summarize(network));
    console.log('stats:', JSON.stringify(stats));
    const ring = cfg.studyArea;
    const center = cfg.center ?? [
      round6(ring.reduce((s, p) => s + p[0], 0) / ring.length),
      round6(ring.reduce((s, p) => s + p[1], 0) / ring.length),
    ];
    manifest.push({
      id: cfg.id,
      name: cfg.name,
      network: `/data/${cfg.id}.network.json`,
      demand: `/data/${cfg.id}.demand.json`,
      basemap: `/data/${cfg.id}.basemap.json`,
      center,
      zoom: cfg.zoom ?? 15,
    });
  }
  writeFileSync(resolve(outDir, 'areas.json'), JSON.stringify(manifest, null, 2) + '\n');
}

if (process.argv[1]?.endsWith('import-osm.ts')) main();
