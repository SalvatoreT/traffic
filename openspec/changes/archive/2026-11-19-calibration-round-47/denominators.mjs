// Usage: node openspec/changes/calibration-round-47/denominators.mjs <stations.json> [<other stations.json> ...]
// Station counts the assessment judges, per period, from a stations file and the recency setting of data/demand/rockridge.config.json:
// link stations with a target, not a scaled copy of another period's count (derived), count year within `recentYears` of the reference year, fitted and held out.
// This is the selection of scoreStations and ruleSplit in tools/lib/assess.ts and tools/lib/recency.ts, without any simulation.
import { readFileSync } from 'node:fs';
const rc = JSON.parse(readFileSync('data/demand/rockridge.config.json', 'utf8')).countFit.recency;
for (const file of process.argv.slice(2)) {
  const sts = JSON.parse(readFileSync(file, 'utf8')).stations;
  console.log(file);
  for (const p of ['pm_peak', 'am_peak']) {
    const t = { fitted: 0, held: 0 };
    for (const s of sts) {
      if (!(s.target?.[p] > 0) || !s.links?.length || s.derived?.includes(p)) continue;
      if (s.year == null || rc.referenceYear - s.year > rc.recentYears) continue;
      t[s.held ? 'held' : 'fitted']++;
    }
    console.log(`  ${p}: recent fitted ${t.fitted}, recent held out ${t.held}`);
  }
}
