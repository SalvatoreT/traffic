// Writes public/data/<area>.assumptions.json for the Assumptions tab from the demand config and the demand fit report. Reads the served demand file only to record its hash; never writes it.
//   npm run data:assumptions [-- --config data/demand/rockridge.config.json]
// Run it after every demand build (`npm run data` does).
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { hashText } from '../src/lib/proposals';
import { buildAssumptions, derivedTargetsView, type AssumptionsCfg } from './lib/assumptions-data';
import { writeFileAtomic } from './lib/atomic';
import { mapMovement, nodeStreets } from './lib/volunteer-count';
import type { Network } from '../src/types';

const root = resolve(import.meta.dirname, '..');
const arg = (k: string, d: string) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : d; };

const cfgPath = resolve(root, arg('--config', 'data/demand/rockridge.config.json'));
const cfg = JSON.parse(readFileSync(cfgPath, 'utf8')) as AssumptionsCfg & { area: string; output: string; countFit?: { output?: string }; network: string; volunteerCount?: { file: string } };
const fitPath = resolve(root, cfg.countFit?.output ?? `data/demand/${cfg.area}.fit.md`);
const demandPath = resolve(root, cfg.output);
const countSourceId = cfg.volunteerCount ? (JSON.parse(readFileSync(resolve(root, cfg.volunteerCount.file), 'utf8')) as { source: { id: string } }).source.id : '';
const net = JSON.parse(readFileSync(resolve(root, cfg.network), 'utf8')) as Network;
const ns = nodeStreets(net as never);
const links: Record<string, { from: number; to: number; node: number }> = {};
for (const m of cfg.assumedMovementFlows.movements) {
  if (!m.count) continue;
  const r = mapMovement({ ...m.count, period: 'pm', vehicles: 0 }, net as never, ns);
  if (r.a === null || r.b === null) { console.warn(`no map for ${m.id}: ${r.reason}`); continue; }
  links[m.id] = { from: r.a, to: r.b, node: net.links[r.a].to };
}
const stationsPath = resolve(root, `data/demand/${cfg.area}.stations.json`);
const derivedTargets = existsSync(stationsPath) ? derivedTargetsView((JSON.parse(readFileSync(stationsPath, 'utf8')) as { stations: never[] }).stations, cfg as never) : null;
const file = buildAssumptions(cfg, readFileSync(fitPath, 'utf8'), {
  area: cfg.area, demandHash: await hashText(readFileSync(demandPath, 'utf8')), countSourceId, generated: new Date().toISOString(), links, derivedTargets,
});
const out = resolve(root, `public/data/${cfg.area}.assumptions.json`);
writeFileAtomic(out, JSON.stringify(file) + '\n');
console.log(`wrote ${out}: ${file.movements.length} movements, ${file.derivedTargets?.stations.length ?? 0} derived targets, demand ${file.inputs.demandHash.slice(0, 12)}`);
