#!/usr/bin/env node
// Test stand-in for target/release/calibrate: writes per-seed reports with a manifest (as the real binary does) and a stub summary, from the files under the working directory.
// Environment: STUB_REMOVALS (gridlockRemoved of every run), STUB_FINGERPRINT, STUB_SKIP_SEEDS (comma list of seeds to leave out), STUB_NO_MANIFEST.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const a = process.argv.slice(2);
const get = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
const area = get('--area', 'rockridge'), period = get('--period', 'pm_peak'), minutes = Number(get('--minutes', '60'));
const seeds = get('--seeds', '1').split(',').flatMap((p) => { const m = p.match(/^(\d+)-(\d+)$/); return m ? Array.from({ length: +m[2] - +m[1] + 1 }, (_, i) => +m[1] + i) : [+p]; });
const keep = resolve(get('--keep-seeds', 'target/stub-seeds')), out = resolve(get('--out', 'target/stub-out'));
const demand = get('--demand', `public/data/${area}.demand.json`);
const sha = (p) => (existsSync(p) ? createHash('sha256').update(readFileSync(p)).digest('hex') : null);
const input = (p) => ({ path: p, sha256: sha(p) });
const build = existsSync(demand) ? JSON.parse(readFileSync(demand, 'utf8')).build ?? null : null;
const skip = new Set((process.env.STUB_SKIP_SEEDS ?? '').split(',').filter(Boolean).map(Number));
mkdirSync(keep, { recursive: true });
mkdirSync(out, { recursive: true });
const stations = JSON.parse(readFileSync(`data/demand/${area}.stations.json`, 'utf8')).stations ?? [];
const targets = JSON.parse(readFileSync(`data/calibration/${area}.targets.json`, 'utf8')).selectLink ?? [];
const linkRates = Array(1 + Math.max(0, ...stations.flatMap((s) => s.links))).fill(0);
const features = stations.filter((s) => s.feature).map((s) => ({ id: s.id, label: s.label, kind: s.feature.kind, trips: 0, vehPerHour: 0 }));
const shares = targets.flatMap((t) => ['from', 'to'].flatMap((side) => (t[side] ?? []).map((q) => ({ block: `${t.street} ${t.direction}`, side, via: q.via, observed: q.share, observedPm: q.pmPeakShare ?? null, modelled: q.pmPeakShare ?? q.share, headline: q.via === 'freeway' }))));
const throughCheck = targets.map((t) => ({ block: `${t.street} ${t.direction}`, observedWholeStreet: t.wholeStreetVehPerHour?.[period] ?? null, modeledWholeStreet: 0, modeledThrough: 0, fitted: true }));
for (const seed of seeds) {
  if (skip.has(seed)) continue;
  const manifest = {
    schema: 1,
    simulator: { fingerprint: process.env.STUB_FINGERPRINT ?? 'f'.repeat(32), revision: 'abc', dirty: false, version: '0.1.0' },
    inputs: { network: input(`public/data/${area}.network.json`), demand: input(demand), demandBuild: build, targets: input(`data/calibration/${area}.targets.json`), stations: input(`data/demand/${area}.stations.json`), split: input(`data/demand/${area}.split.json`), demandConfig: input(`data/demand/${area}.config.json`), areaConfig: input(`data/areas/${area}.json`), groups: input(`data/demand/${area}.groups.json`) },
    run: { area, period, scale: 1, seed, minutes, warmupMin: 10, measurementWindow: { fromMin: minutes >= 30 ? 10 : 0, toMin: minutes }, initialLoad: true, settings: {} },
  };
  const report = {
    area, period, scale: 1, seed, minutes,
    ...(process.env.STUB_NO_MANIFEST ? {} : { manifest }),
    health: { gridlockRemoved: Number(process.env.STUB_REMOVALS ?? 0), backlog: 10, spawned: 1000, backlogPct: 0.5, arterialMeanSpeed: 6, completed: 900, meanTripDelay: 1, meanTripTime: 2, unroutable: 0 },
    series: [{ tMin: minutes / 2, backlog: 6 }, { tMin: minutes, backlog: 7 }],
    shares, throughCheck, features, rampShares: [], linkFlowVehPerHour: linkRates, linkStartVehPerHour: linkRates, linkStopLineVehPerHour: linkRates, linkMeanDelayS: null,
  };
  writeFileSync(join(keep, `${area}-${period}-s1-seed${seed}.json`), JSON.stringify(report));
}
writeFileSync(join(out, `${area}-${period}-s1-seeds${seeds[0]}-${seeds[seeds.length - 1]}.json`), JSON.stringify({ stability: { holds: true, growthSeeds: [], oldRuleSeedsPassing: seeds } }));
