import { describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { assertNoWithheld, checkFitReport, exportOf, iterationShift, iterationStats, planLoop, poolStations, selectStations, type RunSet, type StationRec } from './lib/membership-loop';
import { loopPaths, renderReport, runLoop, type CalibrateJob, type Runner, type View } from './lib/membership-loop-run';
import { hashFile } from './lib/run-manifest';
import type { SelectOd } from './lib/through-membership';

const st = (id: string, over: Partial<StationRec> = {}): StationRec => ({ id, kind: 'count', links: [], target: { pm_peak: 100, am_peak: 50 }, ...over });
const stations: StationRec[] = [
  st('block', { links: [1] }),
  st('leg', { kind: 'tmc', links: [2], detectors: ['stop'] }),
  st('ramp-no-detector', { kind: 'ramp', links: [3] }),
  st('ramp', { kind: 'ramp', links: [4], detectors: ['start'] }),
  st('move', { feature: { kind: 'move', a: 5, b: 6 } }),
  st('route', { source: 'volunteer-count', feature: { kind: 'path', first: 7, last: 9, links: [7, 8, 9] } }),
  st('path-no-links', { source: 'caltrans', feature: { kind: 'path', first: 7, last: 9 } }),
  st('gate'),
  st('held', { links: [10] }),
  st('am-only', { links: [11], target: { am_peak: 20 } }),
];

describe('station choice by rule', () => {
  it('follows what the report binary exports', () => {
    expect(exportOf(stations[0])).toEqual({ via: 'link' });
    expect(exportOf(stations[1])).toEqual({ via: 'link' });
    expect(exportOf(stations[2])).toMatchObject({ reason: expect.stringMatching(/ramp leg without a detector list/) });
    expect(exportOf(stations[3])).toEqual({ via: 'link' });
    expect(exportOf(stations[4])).toEqual({ via: 'route' });
    expect(exportOf(stations[5])).toEqual({ via: 'route' });
    expect(exportOf(stations[6])).toMatchObject({ reason: expect.stringMatching(/without its links/) });
    expect(exportOf(stations[7])).toMatchObject({ reason: expect.stringMatching(/gate total/) });
  });
  it('selects per period, leaves the withheld ones out of the training view and names what stays static', () => {
    const ship = selectStations(stations, 'pm_peak');
    expect(ship.selected.map((s) => s.id)).toEqual(['block', 'leg', 'ramp', 'move', 'route', 'held']);
    expect(ship.stayStatic.map((s) => s.id)).toEqual(['ramp-no-detector', 'path-no-links', 'gate']);
    const train = selectStations(stations, 'pm_peak', new Set(['held']));
    expect(train.selected.map((s) => s.id)).not.toContain('held');
    expect(train.withheld).toEqual(['held']);
    expect(selectStations(stations, 'am_peak').selected.map((s) => s.id)).toContain('am-only');
    expect(selectStations(stations, 'pm_peak').selected.map((s) => s.id)).not.toContain('am-only');
  });
  it('does not read a station name or a count value to choose', () => {
    const renamed = stations.map((s) => ({ ...s, id: `x-${s.id}`, target: { pm_peak: s.target.pm_peak === undefined ? 0 : 7, am_peak: s.target.am_peak === undefined ? 0 : 7 } }));
    expect(selectStations(renamed, 'pm_peak').selected.length).toBe(selectStations(stations, 'pm_peak').selected.length);
  });
});

const run = (seed: number, minutes: number, links: Record<string, [number, number, number][]>, features: Record<string, [number, number, number][]> = {}): SelectOd => ({
  period: 'pm_peak', seed, minutes, blocks: [], stationCountVersion: 2,
  features: Object.entries(features).map(([id, trips]) => ({ id, trips })), links: Object.entries(links).map(([id, trips]) => ({ id, trips })),
});

describe('pooling the iteration runs', () => {
  const flows = [{ origin: 1, destination: 2, vehPerHour: 100 }, { origin: 3, destination: 4, vehPerHour: 50 }];
  const set = (label: string, n: number, hits: number): RunSet => ({ label, flows, sod: Array.from({ length: n }, (_, s) => run(s + 1, 60, { a: [[1, 2, hits]], b: [[3, 4, 5]], held: [[3, 4, 9]], z: [] })) });
  it('weighs each iteration by 1/n through equal seed counts and sums hits and offered trips', () => {
    const p = poolStations([set('i0', 2, 10), set('i1', 2, 30)], new Set(['a', 'b', 'z', 'missing']));
    expect(p.measured.runs).toBe(4);
    expect(p.measured.hits.a['1>2']).toBe(80);
    expect(p.measured.hits.a['1>2'] / p.measured.trips['1>2']).toBeCloseTo(0.2, 10);
  });
  it('lists zero-hit and unexported stations, and drops withheld ones with the pairs only they used', () => {
    const p = poolStations([set('i0', 2, 10), set('i1', 2, 30)], new Set(['a', 'z', 'missing']));
    expect(p.zeroHit).toEqual(['z']);
    expect(p.absent).toEqual(['missing']);
    expect(p.dropped).toEqual(['b', 'held']);
    expect(Object.keys(p.measured.hits)).toEqual(['a']);
    expect(Object.keys(p.measured.trips)).toEqual(['1>2']);
  });
  it('refuses unequal or single-seed iterations', () => {
    expect(() => poolStations([set('i0', 2, 10), set('i1', 3, 10)], new Set(['a']))).toThrow(/same number of seeds/);
    expect(() => poolStations([set('i0', 1, 10)], new Set(['a']))).toThrow(/at least two/);
  });
});

describe('stop rule', () => {
  const noisy = (base: number, seed0: number) => Array.from({ length: 10 }, (_, i) => run(i + 1, 60, { a: [[1, 2, base + ((seed0 * (i + 3)) % 7) - 3], [3, 4, 20 + ((seed0 * (i + 5)) % 5) - 2]] }));
  it('counts two samples of one distribution as unchanged', () => {
    const s = iterationShift(iterationStats(noisy(100, 1)), iterationStats(noisy(100, 2)));
    expect(s.flowRatio).toBeLessThanOrEqual(1);
    expect(s.membershipRatio).toBeLessThanOrEqual(1);
    expect(s.converged).toBe(true);
  });
  it('does not stop when a station moved by many standard errors', () => {
    const s = iterationShift(iterationStats(noisy(100, 1)), iterationStats(noisy(160, 2)));
    expect(s.flowRatio).toBeGreaterThan(1);
    expect(s.converged).toBe(false);
  });
  it('needs two seeds for a standard error', () => {
    expect(() => iterationStats([run(1, 60, { a: [] })])).toThrow(/two seeds/);
  });
});

describe('fit report check', () => {
  const note = (runs: number, n: number) => `- pm_peak: stations whose membership comes from simulated trips (${runs} runs; ${n} of ${n + 6} fitted stations; their assigned volumes in the station tables use it): a, b`;
  const base = { view: 'shipped', file: 'target/m.json', runs: { pm_peak: 20 }, minStations: { pm_peak: 2 } };
  it('accepts a report with both notes', () => {
    const r = checkFitReport(`- Simulated membership from target/m.json (shipped view)\n${note(20, 2)}\n`, base);
    expect(r.problems).toEqual([]);
    expect(r.periods.pm_peak).toEqual({ runs: 20, stations: 2, of: 8 });
  });
  it('fails loudly on the silent fall back to static membership', () => {
    const r = checkFitReport('- target/m.json lacks matching source, detector, split or demand-view evidence. Using static membership.\n', base);
    expect(r.problems.join(' ')).toMatch(/lacks the "Simulated membership from/);
    expect(r.problems.join(' ')).toMatch(/pm_peak: the report has no/);
  });
  it('fails on a wrong run count or too few stations', () => {
    const r = checkFitReport(`- Simulated membership from target/m.json (shipped view)\n${note(10, 1)}\n`, base);
    expect(r.problems.length).toBe(2);
  });
  it('requires the first pass to say it had no file', () => {
    expect(checkFitReport('- No simulated membership file for the shipped view (x). Using static route shares.\n', { ...base, file: null }).problems).toEqual([]);
    expect(checkFitReport('- Simulated membership from x (shipped view)\n', { ...base, file: null }).problems.length).toBe(1);
  });
});

describe('leak guard', () => {
  it('rejects a training file that names a withheld station in hits or in the zero-hit list', () => {
    const file = (hits: Record<string, Record<string, number>>, zeroHit: string[]) => ({ periods: { pm_peak: { stations: { runs: 2, source: '', hits, trips: {}, zeroHit } } } });
    expect(() => assertNoWithheld(file({ a: {} }, []), new Set(['held']))).not.toThrow();
    expect(() => assertNoWithheld(file({ held: {} }, []), new Set(['held']))).toThrow(/withheld/);
    expect(() => assertNoWithheld(file({}, ['held']), new Set(['held']))).toThrow(/withheld/);
  });
});

describe('plan', () => {
  it('builds both views each pass, runs one set per view, pools, and ends with a build on the last pool', () => {
    const plan = planLoop({ views: ['shipped', 'training'], periods: ['pm_peak', 'am_peak'], seeds: [1, 2, 3], iterations: 3, jobs: 4 });
    expect(plan.filter((s) => s.kind === 'build').length).toBe(6);
    expect(plan.filter((s) => s.kind === 'runs').length).toBe(6);
    expect(plan.filter((s) => s.kind === 'pool').length).toBe(3);
    expect(plan.filter((s) => s.kind === 'final').length).toBe(2);
    expect(plan[plan.length - 1].id).toBe('final-training-check');
  });
});

// A scratch checkout with a fake build and a fake calibrate that write what the real ones write.
function scratch(opt: { flat: boolean; dropNote?: boolean; growth?: number }) {
  const root = mkdtempSync(join(tmpdir(), 'mloop-'));
  const w = (f: string, text: string) => { mkdirSync(join(root, f, '..'), { recursive: true }); writeFileSync(join(root, f), text); };
  const cfg = { area: 't', network: 'net.json', output: 'out/demand.json', countFit: { output: 'out/fit.md', stationsOutput: 'st.json', validation: { demandOutput: 'out/cv.json', splitFile: 'split.json' }, throughTargets: { simulatedMembership: { method: 'export-supported', file: 'm/ship.json', trainingFile: 'm/train.json', priorTrips: 5 } } } };
  w('cfg.json', JSON.stringify(cfg));
  w('net.json', JSON.stringify({ id: 'net1' }));
  const fixture: StationRec[] = [st('a', { links: [1] }), st('m', { feature: { kind: 'move', a: 1, b: 2 } }), st('held', { links: [3] }), st('gate'), st('quiet', { links: [4] })];
  w('st.json', JSON.stringify({ stations: fixture }));
  w('split.json', JSON.stringify({ groups: [{ held: true, stations: ['held'], observations: [] }], withheldAggregates: [] }));
  const paths = loopPaths(root, 'cfg.json', cfg);
  const sha = (p: string) => hashFile(p)!;
  const builds: string[] = [];
  const jobsSeen: CalibrateJob[] = [];
  const runner: Runner = {
    build(view: View) {
      builds.push(view);
      const k = opt.flat ? 0 : Math.floor((builds.length - 1) / 2);
      const demand = { build: { view, network: sha(paths.network), split: 'split-sha', config: sha(paths.config), countFile: 'cf' }, periods: ['pm_peak', 'am_peak'].map((id) => ({ id, flows: [{ origin: 1, destination: 2, vehPerHour: 100 + k }, { origin: 3, destination: 4, vehPerHour: 50 }, { origin: 5, destination: 6, vehPerHour: 30 }] })) };
      mkdirSync(join(paths.demand[view], '..'), { recursive: true });
      writeFileSync(paths.demand[view], JSON.stringify(demand));
      const prior = existsMembership(paths.membership[view]);
      const lines = prior && !opt.dropNote
        ? [`- Simulated membership from ${paths.membershipConfig[view]} (${view} view)`, ...Object.entries(prior.periods).map(([q, v]: [string, any]) => `- ${q}: stations whose membership comes from simulated trips (${v.stations.runs} runs; ${Object.keys(v.stations.hits).length} of ${Object.keys(v.stations.hits).length + 1} fitted stations; their assigned volumes in the station tables use it): ${Object.keys(v.stations.hits).join(', ')}`)]
        : prior ? [`- ${paths.membershipConfig[view]} lacks matching source, detector, split or demand-view evidence. Using static membership.`] : [`- No simulated membership file for the ${view} view (${paths.membershipConfig[view]}). Using static route shares.`];
      if (opt.growth !== undefined) lines.push(...['pm_peak', 'am_peak'].map((q) => `Gate prior ceilings ${q}: 3 stations; 0 above ceiling; excess 0 veh/h; offered car 1000 to ${Math.round(1000 * (1 + (prior ? opt.growth ?? 0 : 0)))} veh/h.`));
      writeFileSync(paths.report[view], lines.join('\n'));
    },
    async calibrate(jobs) {
      jobsSeen.push(...jobs);
      for (const j of jobs) {
        const view: View = j.demand.includes('/training/') ? 'training' : 'shipped';
        const b = JSON.parse(readFileSync(j.demand, 'utf8')).build;
        const k = JSON.parse(readFileSync(j.demand, 'utf8')).periods[0].flows[0].vehPerHour - 100;
        const n = (x: number) => Math.max(0, Math.round(x + 40 * k + (((j.seed * 7 + x) % 5) - 2)));
        const manifest = {
          schema: 1, simulator: { fingerprint: 'fp' },
          inputs: { network: { path: '', sha256: b.network }, demand: { path: j.demand, sha256: sha(j.demand) }, demandBuild: b, targets: { path: '', sha256: 't' }, stations: { path: '', sha256: sha(paths.stations) }, split: { path: '', sha256: b.split }, demandConfig: { path: '', sha256: b.config }, areaConfig: { path: '', sha256: 'a' }, groups: { path: '', sha256: 'g' } },
          run: { area: 't', period: j.period, scale: 1, seed: j.seed, minutes: 60, warmupMin: 10, measurementWindow: { fromMin: 10, toMin: 60 }, initialLoad: true, settings: {} },
        };
        const sod = { stationCountVersion: 2, manifest, period: j.period, seed: j.seed, minutes: 60, blocks: [], features: [{ id: 'm', trips: [[5, 6, n(20)]] }], links: [{ id: 'a', trips: [[1, 2, n(30)], [3, 4, n(10)]] }, { id: 'held', trips: [[3, 4, n(8)]] }, { id: 'quiet', trips: [] }] };
        writeFileSync(j.out, JSON.stringify(sod));
      }
    },
  };
  return { root, runner, builds, jobsSeen, paths, opts: { root, area: 't', views: ['shipped', 'training'] as View[], periods: ['pm_peak', 'am_peak'], seeds: [1, 2, 3, 4, 5, 6], iterations: 3, jobs: 2, dir: join(root, 'loop'), configPath: 'cfg.json', resume: false } };
}
const existsMembership = (p: string) => { try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return null; } };

describe('the loop with a fake build and a fake simulator', () => {
  it('runs one process per seed and period, writes both files, keeps withheld stations out of the training file and stops early when nothing moves', async () => {
    const s = scratch({ flat: true });
    const out = await runLoop(s.opts, s.runner, () => undefined);
    expect(out.stoppedEarly).toBe(true);
    expect(out.passes).toBe(2);
    expect(s.builds).toEqual(['shipped', 'training', 'shipped', 'training', 'shipped', 'training']);
    const outs = s.jobsSeen.map((j) => j.out);
    expect(new Set(outs).size).toBe(outs.length);
    expect(outs.length).toBe(2 * 2 * 2 * 6);
    const ship = existsMembership(s.paths.membership.shipped), train = existsMembership(s.paths.membership.training);
    expect(Object.keys(ship.periods.pm_peak.stations.hits).sort()).toEqual(['a', 'held', 'm']);
    expect(Object.keys(train.periods.pm_peak.stations.hits).sort()).toEqual(['a', 'm']);
    expect(train.periods.pm_peak.stations.zeroHit).toEqual(['quiet']);
    expect(train.periods.pm_peak.stations.runs).toBe(12);
    expect(train.evidence.view).toBe('training');
    expect(out.stayStatic['shipped:pm_peak'].map((x) => x.id)).toEqual(['gate']);
    expect(out.selected['training:pm_peak']).toBe(3);
    expect(renderReport(out, s.opts)).toMatch(/Zero hits/);
  });
  it('refuses a non-empty loop directory without resume, before any build', async () => {
    const s = scratch({ flat: true });
    mkdirSync(s.opts.dir, { recursive: true });
    writeFileSync(join(s.opts.dir, 'state.json'), '{}');
    await expect(runLoop(s.opts, s.runner, () => undefined)).rejects.toThrow(/leftover loop files.*loop.*--resume/);
    expect(s.builds).toEqual([]);
  });
  it('refuses a leftover membership file without resume, before any build', async () => {
    const s = scratch({ flat: true });
    mkdirSync(dirname(s.paths.membership.shipped), { recursive: true });
    writeFileSync(s.paths.membership.shipped, '{}');
    await expect(runLoop(s.opts, s.runner, () => undefined)).rejects.toThrow(new RegExp(`leftover loop files.*${s.paths.membership.shipped.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
    expect(s.builds).toEqual([]);
  });
  it('accepts leftover files with resume and an empty or missing directory without it', async () => {
    const s = scratch({ flat: true });
    mkdirSync(s.opts.dir, { recursive: true });
    await expect(runLoop(s.opts, s.runner, () => undefined)).resolves.toBeDefined();
    const t = scratch({ flat: true });
    mkdirSync(t.opts.dir, { recursive: true });
    writeFileSync(join(t.opts.dir, 'state.json'), '{"done":[],"stoppedAfter":null,"reports":[],"stationsSha":null}');
    await expect(runLoop({ ...t.opts, resume: true }, t.runner, () => undefined)).resolves.toBeDefined();
  });
  it('runs all passes when the flows keep moving', async () => {
    const s = scratch({ flat: false });
    const out = await runLoop({ ...s.opts, seeds: [1, 2, 3, 4, 5, 6] }, s.runner, () => undefined);
    expect(out.stoppedEarly).toBe(false);
    expect(out.passes).toBe(3);
    expect(s.builds.length).toBe(2 * 4);
  });
  it('stops before the seed runs when offered demand grows more than 3% over the static fit', async () => {
    const s = scratch({ flat: true, growth: 0.031 });
    await expect(runLoop(s.opts, s.runner, () => undefined)).rejects.toThrow(/3\.1% above the static fit.*Stopping before this pass's seed runs/);
    expect(s.jobsSeen.every((j) => j.demand.includes('iter0'))).toBe(true);
    expect(s.jobsSeen.length).toBe(2 * 2 * 6);
  });
  it('carries on when the growth stays within 3% and reports the ceiling figures', async () => {
    const s = scratch({ flat: true, growth: 0.029 });
    const logs: string[] = [];
    const out = await runLoop(s.opts, s.runner, (l) => logs.push(l));
    expect(out.passes).toBe(2);
    expect(logs.some((l) => /pass 1 shipped build: gate prior ceilings pm_peak 3 stations, 0 above ceiling/.test(l))).toBe(true);
    expect(renderReport(out, s.opts)).toMatch(/Ceiling stations .* Offered \/ static fit/);
  });
  it('reports offered demand as a share of the static fit and warns after the final build when it is more than 10% below', async () => {
    const s = scratch({ flat: true, growth: -0.11 });
    const logs: string[] = [];
    await runLoop(s.opts, s.runner, (l) => logs.push(l));
    expect(logs.some((l) => /pass 1 shipped pm_peak: offered car demand is 89\.0% of the static fit's \(890 of 1000 veh\/h\)/.test(l))).toBe(true);
    expect(logs.filter((l) => /^WARNING shipped view, pm_peak, final build: offered car demand is 11\.0% below/.test(l))).toHaveLength(1);
    const ok = scratch({ flat: true, growth: -0.09 });
    const logs2: string[] = [];
    await runLoop(ok.opts, ok.runner, (l) => logs2.push(l));
    expect(logs2.some((l) => /^WARNING/.test(l))).toBe(false);
  });
  it('fails loudly when a build falls back to static membership', async () => {
    const s = scratch({ flat: true, dropNote: true });
    await expect(runLoop(s.opts, s.runner, () => undefined)).rejects.toThrow(/Simulated membership from|static/);
  });
  it('fails when a seed export is missing or from the other view', async () => {
    const s = scratch({ flat: true });
    const bad: Runner = { ...s.runner, async calibrate(jobs, c, d) { await s.runner.calibrate(jobs, c, d); const f = jobs[0].out; const j = JSON.parse(readFileSync(f, 'utf8')); delete j.features; writeFileSync(f, JSON.stringify(j)); } };
    await expect(runLoop(s.opts, bad, () => undefined)).rejects.toThrow(/no station exports/);
  });
  it('stops when the split file changes during the loop', async () => {
    const s = scratch({ flat: true });
    const tamper: Runner = { ...s.runner, build(v, l) { s.runner.build(v, l); if (s.builds.length === 6) writeFileSync(s.paths.split, '{"groups":[],"withheldAggregates":[]}'); } };
    await expect(runLoop(s.opts, tamper, () => undefined)).rejects.toThrow(/split/);
  });
});
