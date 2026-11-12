// Builds <area>.transit.json from a GTFS feed and the generated network. Node built-ins only.
// Usage: npx tsx tools/build-transit.ts [data/transit/<area>.config.json]
// Method and provenance: data/transit/README.md.
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { addStopTimes, parseGtfs, referenceDate, activeServices } from './lib/gtfs';
import { buildTransit, type RouteReport, type TransitConfig } from './lib/transit';
import { readZip } from './lib/zip';
import type { Network } from './lib/types';

export function formatReport(report: RouteReport[], periods: { id: string }[]): string {
  const head = ['route', 'dir', 'links', 'len m', 'stops', 'trips', ...periods.map((p) => `${p.id} s`)];
  const rows = report.map((r) => [r.name, String(r.dir), String(r.links), String(r.lengthM), String(r.stops), String(r.trips), ...periods.map((p) => (r.headways[p.id] === null ? '-' : String(r.headways[p.id])))]);
  const w = head.map((h, i) => Math.max(h.length, ...rows.map((r) => r[i].length)));
  const line = (r: string[]) => r.map((c, i) => c.padStart(w[i])).join('  ');
  return [line(head), ...rows.map(line)].join('\n');
}

function main() {
  const cfgPath = process.argv[2] ?? 'data/transit/rockridge.config.json';
  const cfg = JSON.parse(readFileSync(cfgPath, 'utf8')) as TransitConfig & { network: string; output: string; areas?: string; raw: { gtfs: string } };
  if (!existsSync(cfg.network)) {
    console.error(`Missing input file: ${cfg.network}\nNetwork: run tools/import-osm.ts.`);
    process.exit(1);
  }
  if (!existsSync(cfg.raw.gtfs)) {
    console.warn(`WARNING: no GTFS feed at ${cfg.raw.gtfs}; transit file not built (see data/transit/README.md: tools/fetch-transit.ts, or \`npm run data:pull\`).`);
    return;
  }
  const net: Network = JSON.parse(readFileSync(cfg.network, 'utf8'));
  const files = readZip(cfg.raw.gtfs);
  const text = (n: string) => files.get(n)?.toString('utf8');
  const g = parseGtfs(text);
  const ref = referenceDate(g, cfg.referenceDate);
  const active = activeServices(g, ref);
  const tripIds = new Set([...g.trips.values()].filter((t) => active.has(t.service)).map((t) => t.id));
  addStopTimes(g, text('stop_times.txt') ?? '', tripIds);
  const { transit, report } = buildTransit(net, g, cfg, ref);

  mkdirSync(dirname(cfg.output), { recursive: true });
  writeFileSync(cfg.output, JSON.stringify(transit));
  if (cfg.areas && existsSync(cfg.areas)) {
    const areas = JSON.parse(readFileSync(cfg.areas, 'utf8')) as { id: string; transit?: string }[];
    const a = areas.find((x) => x.id === cfg.area);
    if (a) {
      a.transit = `/data/${cfg.area}.transit.json`;
      writeFileSync(cfg.areas, JSON.stringify(areas, null, 2) + '\n');
    }
  }
  console.log(`Transit for ${cfg.area}: feed ${JSON.stringify(g.feed.feed_version ?? '?')}, reference weekday ${ref}, ${g.routes.size} routes in feed, ${transit.routes.length} entries in the model`);
  console.log(formatReport(report, cfg.periods));
}

if (process.argv[1]?.endsWith('build-transit.ts')) main();
