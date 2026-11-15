// Writes public/data/<area>.assumptions.json for the Assumptions tab from the demand config and the demand fit report. Reads the served demand file only to record its hash; never writes it.
//   npm run data:assumptions [-- --config data/demand/rockridge.config.json]
// Run it after every demand build (`npm run data` does).
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { hashText } from '../src/lib/proposals';
import { buildAssumptions, type AssumptionsCfg } from './lib/assumptions-data';

const root = resolve(import.meta.dirname, '..');
const arg = (k: string, d: string) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : d; };

const cfgPath = resolve(root, arg('--config', 'data/demand/rockridge.config.json'));
const cfg = JSON.parse(readFileSync(cfgPath, 'utf8')) as AssumptionsCfg & { area: string; output: string; countFit?: { output?: string }; volunteerCount?: { file: string } };
const fitPath = resolve(root, cfg.countFit?.output ?? `data/demand/${cfg.area}.fit.md`);
const demandPath = resolve(root, cfg.output);
const countSourceId = cfg.volunteerCount ? (JSON.parse(readFileSync(resolve(root, cfg.volunteerCount.file), 'utf8')) as { source: { id: string } }).source.id : '';
const file = buildAssumptions(cfg, readFileSync(fitPath, 'utf8'), {
  area: cfg.area, demandHash: await hashText(readFileSync(demandPath, 'utf8')), countSourceId, generated: new Date().toISOString(),
});
const out = resolve(root, `public/data/${cfg.area}.assumptions.json`);
writeFileSync(out, JSON.stringify(file) + '\n');
console.log(`wrote ${out}: ${file.movements.length} movements, demand ${file.inputs.demandHash.slice(0, 12)}`);
