import { readFileSync, writeFileSync } from 'node:fs';
import { msaAverage } from './lib/acceptance';
import { readSeeds, type SeedRun } from './lib/assess';
const [src, out, nIter] = process.argv.slice(2);
const periods: Record<string, number[]> = { am_peak: [1, 2, 3], midday: [1, 2, 3], pm_peak: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] };
function meanDelay(runs: SeedRun[]): Float64Array {
  const n = runs[0].linkMeanDelayS!.length; const o = new Float64Array(n);
  for (let l = 0; l < n; l++) { let w = 0, s = 0; for (const r of runs) { const q = r.linkFlowVehPerHour![l]; w += q; s += q * r.linkMeanDelayS![l]; } o[l] = w / runs.length >= 60 && w > 0 ? s / w : 0; }
  return o;
}
const delayS: Record<string, number[]> = {};
for (const [p, seeds] of Object.entries(periods)) {
  let avg: Float64Array | null = null;
  for (let k = 0; k < Number(nIter); k++) avg = msaAverage(avg, meanDelay(readSeeds(`${src}/iter${k}`, 'rockridge', p, seeds)), k + 1);
  delayS[p] = [...avg!].map((x) => Math.round(x * 10) / 10);
}
writeFileSync(out, JSON.stringify({ links: delayS.pm_peak.length, note: 'scratch', delayS }));
