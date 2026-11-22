import { describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { assertNoWithheld, checkFitReport, exportOf, iterationShift, iterationStats, planLoop, poolStations, selectStations, stopDecision, STOP_RATIO, type RunSet, type StationRec } from './lib/membership-loop';
import { diagnose, fitFinalsFromReport, renderDiagnostics, type StationInfo, type WatchFile } from './lib/loop-diagnostics';
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
function scratch(opt: { flat: boolean; only?: View; recency?: boolean; dropNote?: boolean; growth?: number; blocks?: boolean; dropShareNote?: boolean; route?: boolean; dropRoute?: boolean; end?: boolean; dropEnd?: boolean }) {
  const root = mkdtempSync(join(tmpdir(), 'mloop-'));
  const w = (f: string, text: string) => { mkdirSync(join(root, f, '..'), { recursive: true }); writeFileSync(join(root, f), text); };
  const cfg = { area: 't', network: 'net.json', output: 'out/demand.json', countFit: { output: 'out/fit.md', stationsOutput: 'st.json', validation: { demandOutput: 'out/cv.json', splitFile: 'split.json' }, ...(opt.recency ? { recency: { enabled: true, referenceYear: 2026, recentYears: 5 } } : {}), throughTargets: { simulatedMembership: { method: 'export-supported', file: 'm/ship.json', trainingFile: 'm/train.json', priorTrips: 5, ...(opt.blocks ? { throughTargets: true, shares: true } : {}), ...(opt.route ? { routeWeightPerBlock: true } : {}), ...(opt.end ? { endAlong: true } : {}) } } } };
  w('cfg.json', JSON.stringify(cfg));
  w('net.json', JSON.stringify({ id: 'net1', nodes: [{ id: 3, inStudyArea: true }, { id: 1 }] }));
  const fixture: StationRec[] = [st('a', { links: [1] }), st('m', { feature: { kind: 'move', a: 1, b: 2 } }), st('held', { links: [3] }), st('gate'), st('quiet', { links: [4] })].map((x) => (opt.recency ? { ...x, label: `${x.id} label`, year: 2025 } : x));
  w('st.json', JSON.stringify({ stations: fixture }));
  w('split.json', JSON.stringify({ groups: [{ held: true, stations: ['held'], observations: [] }], withheldAggregates: [] }));
  const paths = loopPaths(root, 'cfg.json', cfg);
  const sha = (p: string) => hashFile(p)!;
  const builds: string[] = [];
  const memSeen: string[] = [];
  const jobsSeen: CalibrateJob[] = [];
  const runner: Runner = {
    build(view: View) {
      builds.push(view);
      const k = opt.flat || (opt.only && opt.only !== view) ? 0 : Math.floor((builds.length - 1) / 2);
      const demand = { build: { view, network: sha(paths.network), split: 'split-sha', config: sha(paths.config), countFile: 'cf' }, periods: ['pm_peak', 'am_peak'].map((id) => ({ id, flows: [{ origin: 1, destination: 2, vehPerHour: 100 + k }, { origin: 3, destination: 4, vehPerHour: 50 }, { origin: 5, destination: 6, vehPerHour: 30 }] })) };
      mkdirSync(join(paths.demand[view], '..'), { recursive: true });
      writeFileSync(paths.demand[view], JSON.stringify(demand));
      const prior = existsMembership(paths.membership[view]);
      memSeen.push(prior ? JSON.stringify(prior) : '');
      const lines = prior && !opt.dropNote
        ? [`- Simulated membership from ${paths.membershipConfig[view]} (${view} view)`, ...Object.entries(prior.periods).map(([q, v]: [string, any]) => `- ${q}: stations whose membership comes from simulated trips (${v.stations.runs} runs; ${Object.keys(v.stations.hits).length} of ${Object.keys(v.stations.hits).length + 1} fitted stations; their assigned volumes in the station tables use it): ${Object.keys(v.stations.hits).join(', ')}`)]
        : prior ? [`- ${paths.membershipConfig[view]} lacks matching source, detector, split or demand-view evidence. Using static membership.`] : [`- No simulated membership file for the ${view} view (${paths.membershipConfig[view]}). Using static route shares.`];
      if (prior && opt.blocks && !opt.dropShareNote) {
        lines.push(...Object.entries(prior.periods).map(([q, v]: [string, any]) => `- ${q}: select-link shares take simulated membership (${v.blocks.runs} runs; ${Object.keys(v.blocks.hits).length} of 2 share constraints; blocks without a simulated trip keep static routes)`));
        lines.push(...['pm_peak', 'am_peak'].flatMap((q) => [`Share ${q} Main Street NB, trips to the freeway: simulated; target 50%; offered 40% (35%); final 48% (41%); 7 flows.`, `Share ${q} Quiet Street SB, trips to the freeway: static; target 45%; offered 30% (30%); final 31% (31%); 4 flows.`, `Through target ${q} Main Street NB, through cars (A to B): simulated; target 90; offered 70 (static routes 60); final 88 (static routes 75).`]));
      }
      if (opt.route && prior && !opt.dropRoute) lines.push(...['pm_peak', 'am_peak'].flatMap((q) => [view === 'shipped' ? `Route weight ${q} count route 2606>2592: simulated; base 1; blocks 7; weight 7; Colby Street SB, whole street (links 2606 to 2592).` : '']).filter(Boolean));
      if (opt.end && prior && !opt.dropEnd && view === 'shipped') lines.push(...['pm_peak', 'am_peak'].map((q) => `End along ${q} Colby Street SB: simulated; target 43; weight 2; offered 20.5 (static routes 12.0); after fit 38.0 (static routes 15.5); final 41.2 (static routes 16.0); 120 flows; 3 nodes (819 1071 793).`));
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
        const sod = { stationCountVersion: 2, manifest, period: j.period, seed: j.seed, minutes: 60, blocks: opt.blocks ? [{ label: 'Main Street NB', links: [1], trips: [[1, 2, n(20)], [3, 4, n(10)], [5, 6, n(6)]] }, { label: 'Quiet Street SB', links: [2], trips: [] }] : [], features: [{ id: 'm', trips: [[5, 6, n(20)]] }], links: [{ id: 'a', trips: [[1, 2, n(30)], [3, 4, n(10)]] }, { id: 'held', trips: [[3, 4, n(8)]] }, { id: 'quiet', trips: [] }] };
        writeFileSync(j.out, JSON.stringify(sod));
      }
    },
  };
  return { root, runner, builds, memSeen, jobsSeen, paths, opts: { root, area: 't', views: ['shipped', 'training'] as View[], periods: ['pm_peak', 'am_peak'], seeds: [1, 2, 3, 4, 5, 6], iterations: 3, jobs: 2, dir: join(root, 'loop'), configPath: 'cfg.json', resume: false } };
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
  it('with the sub-switches: through and block pairs go into the file, the training file stays clean, zero-hit blocks are listed and the targets are logged', async () => {
    const s = scratch({ flat: true, blocks: true });
    const logs: string[] = [];
    const out = await runLoop(s.opts, s.runner, (l) => logs.push(l));
    const ship = existsMembership(s.paths.membership.shipped), train = existsMembership(s.paths.membership.training);
    for (const f of [ship, train]) {
      const p = f.periods.pm_peak;
      expect(Object.keys(p.hits)).toEqual(['through Main Street NB']);
      expect(Object.keys(p.hits['through Main Street NB']).sort()).toEqual(['1>2', '5>6']);
      expect(Object.keys(p.blocks.hits['through Main Street NB']).sort()).toEqual(['1>2', '3>4', '5>6']);
      expect(p.throughZeroHit).toEqual(['Quiet Street SB']);
      expect(p.blocks.zeroHit).toEqual(['Quiet Street SB']);
      expect(p.runs).toBe(12);
      expect(p.blocks.runs).toBe(12);
    }
    expect(out.reports.find((x) => x.pass === 1 && x.view === 'shipped' && x.period === 'pm_peak')).toMatchObject({ zeroHitBlocks: ['Quiet Street SB'], zeroHitThrough: ['Quiet Street SB'] });
    expect(logs.some((l) => /pass 1 shipped pm_peak: .*share blocks without a simulated trip \(static routes\): Quiet Street SB; through blocks without a counted through trip \(static routes\): Quiet Street SB/.test(l))).toBe(true);
    expect(logs).toContain('pass 1 shipped pm_peak: share Main Street NB, trips to the freeway (simulated): target 50%, fit 48% on simulated membership, 41% on static routes, offered 40% (static routes 35%), 7 flows');
    expect(logs).toContain('pass 1 training am_peak: through target Main Street NB, through cars (A to B) (simulated): target 90 veh/h, fit 88 on the membership used, 75 on static routes, offered 70 (static routes 60)');
    const text = renderReport(out, s.opts);
    expect(text).toMatch(/## Share and through targets, by build/);
    expect(text).toMatch(/shipped:1 pm_peak share Main Street NB, trips to the freeway \(simulated\): target 50%, fit 48% \(static routes 41%\)/);
  });
  it('with the shares switch on, a build whose report lacks the shares note stops the loop', async () => {
    const s = scratch({ flat: true, blocks: true, dropShareNote: true });
    await expect(runLoop(s.opts, s.runner, () => undefined)).rejects.toThrow(/no "select-link shares take simulated membership" note/);
  });
  it('without the sub-switches the file and the log carry nothing of round 51', async () => {
    const s = scratch({ flat: true });
    const logs: string[] = [];
    const out = await runLoop(s.opts, s.runner, (l) => logs.push(l));
    const p = existsMembership(s.paths.membership.shipped).periods.pm_peak;
    expect(p).toMatchObject({ runs: 0, hits: {}, trips: {} });
    expect(p.blocks).toBeUndefined();
    expect(logs.some((l) => /share blocks|through blocks|share Main/.test(l))).toBe(false);
    expect(renderReport(out, s.opts)).not.toMatch(/Share and through targets/);
  });
  it('with routeWeightPerBlock: logs and records the route weights, keeps each build\'s fit report, and stops when a build has no route weight line', async () => {
    const s = scratch({ flat: true, route: true });
    const logs: string[] = [];
    const out = await runLoop(s.opts, s.runner, (l) => logs.push(l));
    expect(logs).toContain('pass 1 shipped pm_peak: route weight count route 2606>2592 (simulated): base 1, 7 blocks, weight 7');
    expect(renderReport(out, s.opts)).toMatch(/shipped:1 pm_peak route weight count route 2606>2592 \(simulated\): base 1, 7 blocks, weight 7/);
    expect(readFileSync(join(s.opts.dir, 'fits', 'i1-shipped-build', 'fit.md'), 'utf8')).toMatch(/Route weight pm_peak/);
    const t = scratch({ flat: true, route: true, dropRoute: true });
    await expect(runLoop(t.opts, t.runner, () => undefined)).rejects.toThrow(/no "Route weight" line/);
    const u = scratch({ flat: true });
    const quiet: string[] = [];
    await runLoop(u.opts, u.runner, (l) => quiet.push(l));
    expect(quiet.some((l) => /route weight/.test(l))).toBe(false);
  });
  it('with endAlong: logs and records the end-along figures, and stops when a shipped build has no End along line', async () => {
    const s = scratch({ flat: true, end: true });
    const logs: string[] = [];
    const out = await runLoop(s.opts, s.runner, (l) => logs.push(l));
    expect(logs).toContain('pass 1 shipped pm_peak: end along Colby Street SB (simulated): target 43 veh/h, weight 2, fit 41.2 on the membership used (16 on static routes), after the count-only fit 38 (15.5), offered 20.5 (12), 120 flows, 3 nodes');
    expect(renderReport(out, s.opts)).toMatch(/shipped:1 pm_peak end along Colby Street SB \(simulated\): target 43, weight 2, fit 41.2 \(static routes 16\).*nodes 819 1071 793/);
    expect(readFileSync(join(s.opts.dir, 'fits', 'i1-shipped-build', 'fit.md'), 'utf8')).toMatch(/End along pm_peak/);
    const t = scratch({ flat: true, end: true, dropEnd: true });
    await expect(runLoop(t.opts, t.runner, () => undefined)).rejects.toThrow(/no "End along" line for pm_peak/);
    const u = scratch({ flat: true });
    const quiet: string[] = [];
    await runLoop(u.opts, u.runner, (l) => quiet.push(l));
    expect(quiet.some((l) => /end along/.test(l))).toBe(false);
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

describe('loop control (calibration round 55)', () => {
  const shift = (flowRatio: number, membershipRatio: number) => ({ stations: 10, flowRms: 1, flowSeRms: 1, flowRatio, membershipRms: 1, membershipSeRms: 1, membershipRatio, converged: flowRatio <= STOP_RATIO && membershipRatio <= STOP_RATIO });
  const lines = (...x: [string, string, number, number][]) => x.map(([view, period, f, m]) => ({ view, period, shift: shift(f, m) }));

  it('stops only when every view and period is at or below the limit on flow and on membership', () => {
    const all = lines(['shipped', 'pm_peak', 0.9, 0.8], ['shipped', 'am_peak', 1, 1], ['training', 'pm_peak', 0.5, 0.4], ['training', 'am_peak', 0.7, 0.9]);
    expect(stopDecision(3, all)).toEqual({ met: true, blocking: [] });
    const one = lines(['shipped', 'pm_peak', 0.9, 0.8], ['shipped', 'am_peak', 0.9, 0.9], ['training', 'pm_peak', 0.5, 0.4], ['training', 'am_peak', 1.01, 0.9]);
    const d = stopDecision(3, one);
    expect(d.met).toBe(false);
    expect(d.blocking).toEqual(['training am_peak flow 1.01, membership 0.90']);
    expect(stopDecision(2, lines(['shipped', 'pm_peak', 0.9, 1.2], ['training', 'pm_peak', 0.9, 0.9])).blocking).toEqual(['shipped pm_peak flow 0.90, membership 1.20']);
  });
  it('never stops before pass 1 and needs a comparison in every line', () => {
    expect(stopDecision(0, lines(['shipped', 'pm_peak', 0, 0])).met).toBe(false);
    const d = stopDecision(1, [{ view: 'shipped', period: 'pm_peak', shift: null }]);
    expect(d).toEqual({ met: false, blocking: ['shipped pm_peak no previous pass'] });
    expect(stopDecision(1, []).met).toBe(false);
  });
  it('keeps the limit at 1 standard error', () => { expect(STOP_RATIO).toBe(1); });

  it('runs to the cap when the flows keep moving, says the rule was not met and names the lines', async () => {
    const s = scratch({ flat: false });
    const logs: string[] = [];
    const out = await runLoop({ ...s.opts, iterations: 5, seeds: [1, 2, 3, 4, 5, 6] }, s.runner, (l) => logs.push(l));
    expect(out.passes).toBe(5);
    expect(out.stoppedEarly).toBe(false);
    expect(out.stop).toMatchObject({ met: false, pass: null, cap: 5 });
    expect(out.stop.blocking.length).toBeGreaterThan(0);
    expect(s.builds.length).toBe(2 * 6);
    expect(logs.some((l) => /^stop rule not met by the cap of 5 passes: /.test(l))).toBe(true);
    expect(logs.some((l) => /^pass 1: stop rule not met .*(shipped|training) (pm|am)_peak flow/.test(l))).toBe(true);
    expect(renderReport(out, s.opts)).toMatch(/Passes run: 5 of at most 5 \(stop rule not met:/);
  });
  it('does not stop while one view still moves, though the other is flat', async () => {
    const s = scratch({ flat: false, only: 'training' });
    const out = await runLoop({ ...s.opts, iterations: 4, seeds: [1, 2, 3, 4, 5, 6] }, s.runner, () => undefined);
    expect(out.passes).toBe(4);
    expect(out.stop.met).toBe(false);
    expect(out.stop.blocking.every((x) => x.startsWith('training'))).toBe(true);
    const flat = scratch({ flat: true });
    const early = await runLoop({ ...flat.opts, iterations: 8 }, flat.runner, () => undefined);
    expect(early.stop).toMatchObject({ met: true, pass: 1, cap: 8, blocking: [] });
    expect(early.passes).toBe(2);
  });
  it('a larger cap leaves the first passes and the three-pass final build unchanged', async () => {
    const three = scratch({ flat: false });
    await runLoop({ ...three.opts, iterations: 3 }, three.runner, () => undefined);
    const eight = scratch({ flat: false });
    await runLoop({ ...eight.opts, iterations: 8 }, eight.runner, () => undefined);
    expect(three.builds.length).toBe(8);
    expect(eight.builds.length).toBe(2 * 9);
    const norm = (xs: string[], root: string) => xs.map((x) => x.split(root).join('ROOT'));
    expect(norm(eight.memSeen.slice(0, 8), eight.root)).toEqual(norm(three.memSeen, three.root));
    expect(eight.memSeen[6]).not.toBe('');
  });
  it('the default dry-run plan is the three-pass plan of rounds 48 to 53', () => {
    const ids = planLoop({ views: ['shipped', 'training'], periods: ['pm_peak', 'am_peak'], seeds: [1, 2, 3], iterations: 3, jobs: 4 }).map((x) => x.id);
    expect(ids).toEqual(['i0-shipped-build', 'i0-shipped-check', 'i0-shipped-runs', 'i0-training-build', 'i0-training-check', 'i0-training-runs', 'i0-pool', 'i1-shipped-build', 'i1-shipped-check', 'i1-shipped-runs', 'i1-training-build', 'i1-training-check', 'i1-training-runs', 'i1-pool', 'i2-shipped-build', 'i2-shipped-check', 'i2-shipped-runs', 'i2-training-build', 'i2-training-check', 'i2-training-runs', 'i2-pool', 'final-shipped-build', 'final-shipped-check', 'final-training-build', 'final-training-check']);
  });
  it('pools eight passes with weight 1/8 each', () => {
    const flows = [{ origin: 1, destination: 2, vehPerHour: 100 }];
    const mk = (n: number): RunSet => ({ label: `p${n}`, flows, sod: [1, 2].map((seed) => run(seed, 60, { a: [[1, 2, n + 1]] })) });
    const sets = Array.from({ length: 8 }, (_, n) => mk(n));
    const p = poolStations(sets, new Set(['a']));
    expect(p.measured.runs).toBe(16);
    expect(p.measured.hits.a['1>2'] / p.measured.trips['1>2']).toBeCloseTo((1 + 2 + 3 + 4 + 5 + 6 + 7 + 8) / 8 / 100, 10);
    expect(() => poolStations([...sets.slice(0, 7), { ...sets[7], sod: sets[7].sod.slice(0, 1) }], new Set(['a']))).toThrow(/same number of seeds/);
  });
});

describe('per-pass diagnostics (report only)', () => {
  const sod = (flows: Record<string, number>, seed: number): SelectOd => ({ period: 'pm_peak', seed, minutes: 60, blocks: [], links: Object.entries(flows).map(([id, n]) => ({ id, trips: [[1, 2, n]] })) }) as unknown as SelectOd;
  const stationsInfo: StationInfo[] = [
    { id: 'ok', kind: 'count', label: 'Ok Street', links: [1], target: { pm_peak: 100 }, year: 2025 },
    { id: 'far', kind: 'count', label: 'Far Street', links: [2], target: { pm_peak: 100 }, year: 2025 },
    { id: 'old', kind: 'count', label: 'Old Street', links: [3], target: { pm_peak: 100 }, year: 2010 },
    { id: 'aadt', kind: 'count', label: 'Aadt Street', links: [4], target: { pm_peak: 100 }, year: 2025, source: 'caltrans-aadt' },
    { id: 'copy', kind: 'count', label: 'Copy Street', links: [5], target: { pm_peak: 100 }, year: 2025, derived: ['pm_peak'] },
    { id: 'heldout', kind: 'count', label: 'Held Street', links: [6], target: { pm_peak: 100 }, year: 2025 },
    { id: 'nodet', kind: 'ramp', label: 'Ramp', links: [7], target: { pm_peak: 100 }, year: 2025 },
  ];
  const runs = [1, 2].map((seed) => sod({ ok: 98, far: 40, old: 100, aadt: 100, copy: 100, heldout: 101 }, seed));
  const recency = { referenceYear: 2026, recentYears: 5 };
  const watch: WatchFile = { heldOutMisses: [{ id: 'heldout', period: 'pm_peak' }, { id: 'heldout', period: 'am_peak' }], diagonal: [{ id: 'ok', period: 'pm_peak' }, { id: 'far', period: 'pm_peak' }] };

  it('counts recent hourly-count stations within GEH 5 on the side of the view', () => {
    const base = { pass: 2, period: 'pm_peak', runs, stations: stationsInfo, held: new Set(['heldout']), recency, watch: null, fit: null };
    const ship = diagnose({ ...base, view: 'shipped' });
    expect(ship.geh).toEqual({ n: 2, ok: 1, unmeasured: 1 });
    const train = diagnose({ ...base, view: 'training' });
    expect(train.geh).toEqual({ n: 1, ok: 1, unmeasured: 0 });
    expect(diagnose({ ...base, view: 'shipped', recency: null }).geh).toBeNull();
  });
  it('lists watched stations of the period with counted, fit and simulated values', () => {
    const fit = fitFinalsFromReport('| Station | Basis | Target | Assigned before | Ratio | After fit | Ratio | Final | Ratio |\n| --- | --- |\n| Ok Street | count | 100 | 150 | 1.5 | 101 | 1.0 | 97 | 0.97 | ok |\n| Far Street | count | 100 | 150 | 1.5 | 101 | 1.0 | 1,012 | 0.97 | ok |');
    expect(fit.get('Ok Street')).toEqual({ target: 100, final: 97 });
    expect(fit.get('Far Street')?.final).toBe(1012);
    const d = diagnose({ pass: 1, view: 'shipped', period: 'pm_peak', runs, stations: stationsInfo, held: new Set(['heldout']), recency, watch, fit });
    expect(d.watch.map((w) => [w.group, w.id, w.counted, w.fit, w.sim])).toEqual([['held-out miss', 'heldout', 100, null, 101], ['diagonal', 'ok', 100, 97, 98], ['diagonal', 'far', 100, 1012, 40]]);
  });
  it('leaves a watched station out when the stations file lacks it', () => {
    const d = diagnose({ pass: 1, view: 'shipped', period: 'pm_peak', runs, stations: stationsInfo, held: new Set<string>(), recency, watch: { heldOutMisses: [{ id: 'nowhere', period: 'pm_peak' }], diagonal: [{ id: 'ok', period: 'pm_peak' }] }, fit: null });
    expect(d.watch.map((w) => w.id)).toEqual(['ok']);
  });
  it('renders the tables and the diagonal sum', () => {
    const base = { stations: stationsInfo, held: new Set(['heldout']), recency, watch, fit: null };
    const diags = [0, 1].flatMap((pass) => ['shipped', 'training'].map((view) => diagnose({ ...base, pass, view, period: 'pm_peak', runs })));
    const text = renderDiagnostics(diags, { reports: [{ pass: 1, view: 'shipped', period: 'pm_peak', offered: 1000, shift: { flowRatio: 1.46, membershipRatio: 1.84 }, ceiling: { staticTotal: 1100, finalTotal: 990 } }] });
    expect(text).toMatch(/\| 1 \| shipped \| pm_peak \| 1\.46 \| 1\.84 \| 1000 \| 90\.0% \| 1\.06 \|/);
    expect(text).toMatch(/\| 1 \| shipped \| pm_peak \| 1 of 2 \| 1 \|/);
    expect(text).toMatch(/\| held-out miss \| pm_peak \| Held Street \| 100 \| 1 \| - \| 101 \| 101 \|/);
    expect(text).toMatch(/### Diagonal stations, pm_peak: sum[^#]*\| 1 \| 200 \| - \| 138 \| 138 \|/);
  });
  it('is logged and written by the loop, and changes no pooled file', async () => {
    const plain = scratch({ flat: true, recency: true });
    await runLoop(plain.opts, plain.runner, () => undefined);
    const withWatch = scratch({ flat: true, recency: true });
    const logs: string[] = [];
    const out = await runLoop({ ...withWatch.opts, watch: { heldOutMisses: [{ id: 'held', period: 'pm_peak' }], diagonal: [{ id: 'a', period: 'pm_peak' }, { id: 'quiet', period: 'pm_peak' }] } }, withWatch.runner, (l) => logs.push(l));
    expect(logs.some((l) => /^pass 1 shipped pm_peak: recent judged stations within GEH 5 on this pass's seeds: 0 of 2 \(fitted; 0 not measured\)/.test(l))).toBe(true);
    expect(logs.some((l) => /^pass 1 training pm_peak: recent judged stations within GEH 5 .* 0 of 1 \(held out;/.test(l))).toBe(true);
    expect(logs.some((l) => /^pass 1 training pm_peak: watched held label: counted 100, shipped fit -, simulated \d+/.test(l))).toBe(true);
    expect(logs.some((l) => /diagonal stations, counted 200, simulated \d+/.test(l))).toBe(true);
    expect(out.diagnostics.length).toBe(2 * 2 * 2);
    expect(readFileSync(join(withWatch.opts.dir, 'pools', 'i1-shipped.json'), 'utf8')).toBe(readFileSync(withWatch.paths.membership.shipped, 'utf8'));
    expect(readFileSync(join(withWatch.opts.dir, 'pools', 'i0-training.json'), 'utf8')).toMatch(/pool of 1 iteration/);
    expect(readFileSync(join(withWatch.opts.dir, 'diagnostics.md'), 'utf8')).toMatch(/### Watched stations/);
    const same = (a: string, ra: string, b: string, rb: string) => expect(readFileSync(a, 'utf8').split(ra).join('ROOT')).toBe(readFileSync(b, 'utf8').split(rb).join('ROOT'));
    same(withWatch.paths.membership.shipped, withWatch.root, plain.paths.membership.shipped, plain.root);
    same(withWatch.paths.membership.training, withWatch.root, plain.paths.membership.training, plain.root);
    same(withWatch.paths.demand.shipped, withWatch.root, plain.paths.demand.shipped, plain.root);
  });
  it('carries on without a watch file', async () => {
    const s = scratch({ flat: true, recency: true });
    const logs: string[] = [];
    const out = await runLoop(s.opts, s.runner, (l) => logs.push(l));
    expect(out.passes).toBe(2);
    expect(logs.some((l) => /^WARNING/.test(l))).toBe(false);
  });
  it('the committed watch file names stations that exist, have a target in their period and are recent', () => {
    const w = JSON.parse(readFileSync(join(import.meta.dirname, '../openspec/changes/calibration-round-55/watch.json'), 'utf8')) as WatchFile;
    const st = (JSON.parse(readFileSync(join(import.meta.dirname, '../data/demand/rockridge.stations.json'), 'utf8')) as { stations: StationInfo[] }).stations;
    expect(w.heldOutMisses.length).toBe(7);
    expect(w.diagonal.length).toBe(5);
    for (const e of [...w.heldOutMisses, ...w.diagonal]) {
      const x = st.find((q) => q.id === e.id);
      expect(x, e.id).toBeDefined();
      expect(x!.target[e.period], `${e.id} ${e.period}`).toBeGreaterThan(0);
      expect(2026 - x!.year!).toBeLessThanOrEqual(5);
    }
    expect(w.diagonal.reduce((a, e) => a + st.find((q) => q.id === e.id)!.target[e.period], 0)).toBe(178);
  });
});
