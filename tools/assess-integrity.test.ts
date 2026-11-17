import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { buildEvidence, checkPair, checkRunSet, type RunManifest } from './lib/run-manifest';
import { isolationProblems, resolveOutputs } from './lib/assess-outputs';
import { fittedRampCountError, headlineSharesPass, scoreStations, stationEvidenceProblems, type SeedRun, type StationFile } from './lib/assess';
import { backlogGrowth, computeStability, stabilityRule, suggestStatus } from './lib/verdict';
import { isReviewed, primitiveEvidence, primitiveLines, type ValidationFile } from './lib/primitive-evidence';

const repo = resolve(import.meta.dirname, '..');
const stub = join(repo, 'tools/fixtures/stub-calibrate.mjs');
const temps: string[] = [];
afterAll(() => { for (const t of temps) rmSync(t, { recursive: true, force: true }); });

const sha = (p: string) => createHash('sha256').update(readFileSync(p)).digest('hex');
const put = (root: string, rel: string, text: string) => { mkdirSync(dirname(join(root, rel)), { recursive: true }); writeFileSync(join(root, rel), text); };

/** A throwaway repository root with the real targets, stations, config and area files, small stub demands, and a published evidence set whose bytes the tests watch. */
function makeRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'assess-integrity-'));
  temps.push(root);
  for (const f of ['data/calibration/rockridge.targets.json', 'data/demand/rockridge.stations.json', 'data/demand/rockridge.config.json', 'data/areas/rockridge.json', 'data/calibration/rockridge.volunteer-count-2025-02-25.json']) { mkdirSync(dirname(join(root, f)), { recursive: true }); cpSync(join(repo, f), join(root, f)); }
  put(root, 'data/demand/rockridge.split.json', '{"version":1}\n');
  put(root, 'public/data/rockridge.network.json', '{"links":[],"nodes":[]}');
  const sources = {
    split: sha(join(root, 'data/demand/rockridge.split.json')), config: sha(join(root, 'data/demand/rockridge.config.json')),
    network: sha(join(root, 'public/data/rockridge.network.json')), countFile: sha(join(root, 'data/calibration/rockridge.volunteer-count-2025-02-25.json')),
  };
  put(root, 'public/data/rockridge.demand.json', JSON.stringify({ periods: [], build: { view: 'shipped', ...sources } }));
  put(root, 'target/validation/rockridge.demand.json', JSON.stringify({ periods: [], build: { view: 'training', ...sources } }));
  put(root, 'data/calibration/rockridge.assessment.md', 'PUBLISHED ASSESSMENT\n');
  put(root, 'data/calibration/reports/rockridge-pm_peak-s1-seeds1-10.json', '{"published":true}\n');
  put(root, 'public/data/rockridge.noise.json', '{"published":true}\n');
  return root;
}
const published = (root: string) => ['data/calibration/rockridge.assessment.md', 'data/calibration/reports/rockridge-pm_peak-s1-seeds1-10.json', 'public/data/rockridge.noise.json'].map((f) => sha(join(root, f)));

function assess(root: string, args: string[], env: Record<string, string> = {}) {
  const r = spawnSync(process.execPath, ['--import', 'tsx', join(repo, 'tools/assess.ts'), '--root', root, '--periods', 'pm_peak', ...args], { cwd: repo, encoding: 'utf8', env: { ...process.env, CALIBRATE_BIN: stub, ...env }, maxBuffer: 16 * 1024 * 1024 });
  return { status: r.status, out: r.stdout ?? '', err: r.stderr ?? '' };
}
/** Runs the stub into `dir` as the real binary would (both demands), so that --reuse has reports to read. */
function stubRuns(root: string, dir: string, env: Record<string, string> = {}, seeds = '1-10') {
  for (const [d, demand] of [[dir, 'public/data/rockridge.demand.json'], [`${dir}-cv`, 'target/validation/rockridge.demand.json']] as const) {
    spawnSync(stub, ['--area', 'rockridge', '--period', 'pm_peak', '--minutes', '60', '--seeds', seeds, '--keep-seeds', d, '--out', join(d, 'summary'), '--demand', demand], { cwd: root, env: { ...process.env, ...env } });
  }
}

describe('complete station and headline evidence', () => {
  it('uses the observed end of each link and requires every seed at that screenline', () => {
    const file: StationFile = { stations: [{ id: 'junction', label: 'Main and slip', kind: 'tmc', corridor: 'Main', links: [0, 1], detectors: ['stop', 'start'], target: { pm: 75 }, held: false }] };
    const run = { linkFlowVehPerHour: [999, 999], linkStartVehPerHour: [40, 5], linkStopLineVehPerHour: [70, 2] } as SeedRun;
    expect(scoreStations([run], file, 'pm').cases[0].modeled).toBe(75);
    for (const start of [[], [40, NaN], [40, -1]]) {
      const bad = { ...run, linkStartVehPerHour: start };
      expect(stationEvidenceProblems(bad, file, 'pm')).toEqual(['junction']);
      expect(scoreStations([run, bad], file, 'pm').fitted.meets).toBe(false);
    }
  });

  it('uses stop-line errors on fitted off-ramps when selecting an iteration', () => {
    const station = { id: 'ramp', kind: 'tmc', label: 'North interchange, ramp (S leg) entering', corridor: 'North', held: false, links: [0], detectors: ['stop' as const], target: { pm: 70 } };
    const run = { linkFlowVehPerHour: [200, 900], linkStopLineVehPerHour: [50, 75] } as SeedRun;
    const score = scoreStations([run], { stations: [station, { ...station, id: 'other', links: [1], held: true, target: { pm: 900 } }] }, 'pm');
    expect(fittedRampCountError(score.cases)).toBe(20);
  });

  it('checks all observed headline keys in each seed, independent of row order', () => {
    const observation = { via: 'Freeway', share: 0.3 };
    const targets = [{ street: 'Main', direction: 'SB', from: [observation], to: [observation] }];
    const shares = ['from', 'to'].map((side) => ({ block: 'Main SB', side, via: 'Freeway', observed: 0.3, observedPm: null, modelled: 0.25, headline: true }));
    const run = { shares } as SeedRun;
    expect(headlineSharesPass([run, { shares: [...shares].reverse() } as SeedRun], targets, 10)).toBe(true);
    for (const rows of [[shares[0]], [shares[0], shares[0], shares[1]], [shares[0], { ...shares[1], modelled: NaN }]]) {
      expect(headlineSharesPass([run, { shares: rows } as SeedRun], targets, 10)).toBe(false);
    }
  });
});

describe('assessment of reused runs (C4)', () => {
  it('rejects a single seed of ten, listing the missing ones, and writes nothing', () => {
    const root = makeRoot(), before = published(root), dir = join(root, 'reuse');
    stubRuns(root, dir, { STUB_REMOVALS: '9999' }, '1');
    const r = assess(root, ['--reuse', dir, '--suffix', 'audit']);
    expect(r.status).toBe(3);
    expect(r.err).toMatch(/9 of 10 requested seeds have no report: 2, 3, 4, 5, 6, 7, 8, 9, 10/);
    expect(existsSync(join(root, 'data/calibration/rockridge.assessment-audit.md'))).toBe(false);
    expect(published(root)).toEqual(before);
  }, 60000);

  it('reports a one-seed diagnostic with its real sample size and no verdict, never "holds"', () => {
    const root = makeRoot(), dir = join(root, 'reuse');
    stubRuns(root, dir, { STUB_REMOVALS: '9999' }, '1');
    const r = assess(root, ['--reuse', dir, '--suffix', 'audit', '--diagnostic']);
    expect(r.status).toBe(0);
    const text = readFileSync(join(root, 'data/calibration/rockridge.assessment-audit.md'), 'utf8');
    expect(text).toContain('DIAGNOSTIC OUTPUT: no calibration or stability verdict is issued');
    expect(text).toMatch(/not judged \(diagnostic, 1 of 10 seeds\)/);
    expect(text).not.toMatch(/Stability rule \(D16\): holds/);
    expect(text).toMatch(/passes in 0 of 1 seeds/);
    expect(text).toContain('No status is suggested');
    expect(text).not.toMatch(/Suggested status:/);
  }, 60000);

  it('computes stability from the runs, not from a summary file: 9,999 removals in every seed fails', () => {
    const root = makeRoot();
    const r = assess(root, ['--suffix', 'x'], { STUB_REMOVALS: '9999' });
    expect(r.status).toBe(0);
    const text = readFileSync(join(root, 'data/calibration/rockridge.assessment-x.md'), 'utf8');
    expect(text).toMatch(/Stability rule \(D16\): fails/);
    expect(text).toMatch(/Cars cleared from gridlock \(all of them: no near\/far split\) 9999\.00 per hour/);
    expect(text).toMatch(/Suggested status: \*\*uncalibrated\*\*/);
  }, 60000);

  it('rejects incomplete detectors in one seed even when its manifest and other seeds match', () => {
    const root = makeRoot(), dir = join(root, 'reuse');
    stubRuns(root, dir);
    const f = join(dir, 'rockridge-pm_peak-s1-seed3.json');
    const report = JSON.parse(readFileSync(f, 'utf8'));
    report.linkStopLineVehPerHour = [];
    writeFileSync(f, JSON.stringify(report));
    const r = assess(root, ['--reuse', dir, '--suffix', 'x']);
    expect(r.status).toBe(3);
    expect(r.err).toMatch(/seed 3: missing or invalid measurements/);
    expect(existsSync(join(root, 'data/calibration/rockridge.assessment-x.md'))).toBe(false);
  }, 60000);

  it('rejects a complete reused seed set from a different requested measurement duration', () => {
    const root = makeRoot(), dir = join(root, 'reuse');
    stubRuns(root, dir);
    const r = assess(root, ['--reuse', dir, '--minutes', '120', '--suffix', 'x']);
    expect(r.status).toBe(3);
    expect(r.err).toMatch(/run settings do not match requested/);
  }, 60000);

  it('rejects a report that carries another seed than its file name', () => {
    const root = makeRoot(), dir = join(root, 'reuse');
    stubRuns(root, dir);
    const f = join(dir, 'rockridge-pm_peak-s1-seed3.json'), j = JSON.parse(readFileSync(f, 'utf8'));
    j.manifest.run.seed = 4; j.seed = 4;
    writeFileSync(f, JSON.stringify(j));
    const r = assess(root, ['--reuse', dir, '--suffix', 'x']);
    expect(r.status).toBe(3);
    expect(r.err).toMatch(/named for seed 3 but its report says seed 4 and its manifest seed 4/);
  }, 60000);

  it('rejects reports whose inputs changed after the runs (stale), and reports without a manifest', () => {
    const root = makeRoot(), dir = join(root, 'reuse');
    stubRuns(root, dir);
    writeFileSync(join(root, 'data/calibration/rockridge.targets.json'), readFileSync(join(root, 'data/calibration/rockridge.targets.json'), 'utf8') + ' ');
    const stale = assess(root, ['--reuse', dir, '--suffix', 'x']);
    expect(stale.status).toBe(3);
    expect(stale.err).toMatch(/the targets file is not the one the runs used/);
    const legacy = join(root, 'legacy');
    stubRuns(root, legacy, { STUB_NO_MANIFEST: '1' });
    const l = assess(root, ['--reuse', legacy, '--suffix', 'x']);
    expect(l.status).toBe(3);
    expect(l.err).toMatch(/seed 1 has no manifest/);
  }, 60000);

  it('rejects runs of different simulators in one set', () => {
    const root = makeRoot(), dir = join(root, 'reuse');
    stubRuns(root, dir, {}, '1-5');
    stubRuns(root, dir, { STUB_FINGERPRINT: 'a'.repeat(32) }, '6-10');
    const r = assess(root, ['--reuse', dir, '--suffix', 'x']);
    expect(r.status).toBe(3);
    expect(r.err).toMatch(/seed 6 differs from seed 1 in the simulator fingerprint/);
  }, 60000);

  it('rejects a cross-validation demand that is not the training view', () => {
    const root = makeRoot();
    const f = join(root, 'target/validation/rockridge.demand.json'), j = JSON.parse(readFileSync(f, 'utf8'));
    j.build.view = 'shipped';
    writeFileSync(f, JSON.stringify(j));
    const r = assess(root, ['--suffix', 'x']);
    expect(r.status).toBe(3);
    expect(r.err).toMatch(/cross-validation demand was built as view "shipped"/);
  }, 60000);
});

describe('output isolation (C5)', () => {
  it('a suffixed variant with noise leaves every published file byte-identical', () => {
    const root = makeRoot(), before = published(root);
    const r = assess(root, ['--suffix', 'variant', '--noise']);
    expect(r.status).toBe(0);
    expect(published(root)).toEqual(before);
    expect(existsSync(join(root, 'data/calibration/rockridge.assessment-variant.md'))).toBe(true);
    expect(existsSync(join(root, 'target/assess-variants/variant/reports/rockridge-pm_peak-s1-seeds1-10.json'))).toBe(true);
    expect(readFileSync(join(root, 'public/data/rockridge.noise.json'), 'utf8')).toBe('{"published":true}\n');
  }, 60000);

  it('a run with no suffix needs --publish and otherwise writes nothing', () => {
    const root = makeRoot(), before = published(root);
    const r = assess(root, []);
    expect(r.status).toBe(2);
    expect(r.err).toMatch(/--publish/);
    expect(published(root)).toEqual(before);
    const ok = assess(root, ['--publish']);
    expect(ok.status).toBe(0);
    expect(published(root)).not.toEqual(before);
  }, 60000);

  it('a diagnostic never goes to the published set', () => {
    const root = makeRoot();
    expect(assess(root, ['--diagnostic']).status).toBe(2);
    expect(assess(root, ['--publish', '--diagnostic']).status).toBe(2);
  }, 60000);

  it('resolves separate output sets and detects a variant that points at published paths', () => {
    const pub = resolveOutputs({ root: '/r', area: 'a', minutes: 60, suffix: '' });
    const v = resolveOutputs({ root: '/r', area: 'a', minutes: 60, suffix: 'x' });
    const long = resolveOutputs({ root: '/r', area: 'a', minutes: 120, suffix: '' });
    expect(pub.published && !v.published && !long.published).toBe(true);
    for (const k of ['reports', 'assessment', 'noise', 'seeds'] as const) { expect(v[k]).not.toBe(pub[k]); expect(long[k]).not.toBe(pub[k]); expect(long[k]).not.toBe(v[k]); }
    expect(isolationProblems(v, '/r', 'a')).toEqual([]);
    expect(isolationProblems(resolveOutputs({ root: '/r', area: 'a', minutes: 60, suffix: 'x', out: 'data/calibration/reports/x' }), '/r', 'a')).toHaveLength(1);
  });
});

describe('run sets and manifests (D3)', () => {
  const man = (seed: number, over: Partial<RunManifest['run']> = {}, fp = 'fp', build: object | null = { view: 'shipped', split: 's' }): RunManifest => ({
    schema: 1, simulator: { fingerprint: fp }, run: { area: 'a', period: 'p', scale: 1, seed, minutes: 60, warmupMin: 10, measurementWindow: { fromMin: 10, toMin: 60 }, initialLoad: true, settings: {}, ...over },
    inputs: { network: { path: 'n', sha256: 'n' }, demand: { path: 'd', sha256: 'd' }, demandBuild: build, targets: { path: 't', sha256: 't' }, stations: { path: 's', sha256: 's' }, split: { path: 'p', sha256: 's' }, demandConfig: { path: 'c', sha256: 'c' }, areaConfig: { path: 'a', sha256: 'a' }, groups: { path: 'g', sha256: 'g' } },
  });
  const receipt = { view: 'shipped' as const, recorded: { view: 'shipped', split: 's' }, sources: { split: 's' } };
  const expected = { network: 'n', targets: 't', stations: 's', split: 's', demandConfig: 'c', areaConfig: 'a', groups: 'g', demand: 'd' };
  const found = (seeds: number[], f: (s: number) => RunManifest = (s) => man(s)) => seeds.map((s) => ({ seed: s, file: `f${s}.json`, reportSeed: s, manifest: f(s) }));

  it('accepts the exact seed set and rejects duplicates in the request', () => {
    expect(checkRunSet('x', [1, 2, 3], found([1, 2, 3]), expected, receipt).problems).toEqual([]);
    expect(checkRunSet('x', [1, 1, 2], found([1, 2]), expected, receipt).problems.join(' ')).toMatch(/repeats 1/);
  });
  it('binds each build source and view to the demand file independently within a single run set', () => {
    const root = makeRoot(), demand = join(root, 'public/data/rockridge.demand.json');
    const ev = buildEvidence(root, 'rockridge', demand, 'shipped');
    for (const field of ['config', 'network', 'countFile', 'split'] as const) {
      const stale = { ...ev.recorded, [field]: 'previous' };
      const mismatched = checkRunSet('shipped', [1], found([1], (s) => man(s, {}, 'fp', stale)), expected, { ...ev, recorded: stale });
      expect(mismatched.problems.join(' ')).toContain(`build ${field} does not match`);
    }
    const only = (build: object | null, e = ev) => checkRunSet('shipped', [1], found([1], (s) => man(s, {}, 'fp', build)), expected, e).problems;
    expect(only(ev.recorded)).toEqual([]);
    expect(only({ ...ev.recorded, view: 'training' }).join(' ')).toContain('metadata in its demand file');
    expect(only(ev.recorded, { ...ev, view: 'training' }).join(' ')).toContain('expected a training demand');
    rmSync(join(root, 'data/calibration/rockridge.volunteer-count-2025-02-25.json'));
    expect(only(ev.recorded, buildEvidence(root, 'rockridge', demand, 'shipped')).join(' ')).toContain('build countFile');
    const custom = join(root, 'variant.json');
    put(root, 'variant.json', '{"periods":[]}');
    expect(only(null, buildEvidence(root, 'rockridge', custom, 'variant'))).toEqual([]);
  });

  it('rejects a different run setting inside one set', () => {
    expect(checkRunSet('x', [1, 2], found([1, 2], (s) => man(s, s === 2 ? { minutes: 120 } : {})), expected, receipt).problems.join(' ')).toMatch(/seed 2 differs from seed 1 in run setting minutes/);
  });
  it('requires the roles of main and cross-validation demands to match their view and split', () => {
    const main = man(1), cv = man(1, {}, 'fp', { view: 'training', split: 's' });
    expect(checkPair(main, cv, 's')).toEqual([]);
    expect(checkPair(main, man(1, {}, 'fp', { view: 'shipped', split: 's' }), 's').join(' ')).toMatch(/not "training"/);
    expect(checkPair(main, man(1, {}, 'fp', { view: 'training', split: 'other' }), 's').join(' ')).toMatch(/different split manifests/);
    expect(checkPair(main, man(1, {}, 'fp', null), 's').join(' ')).toMatch(/no build provenance/);
    expect(checkPair(main, man(1, {}, 'other'), 's').join(' ')).toMatch(/different simulators/);
  });
  it('two reports with the same area but different demand hashes are different run sets', () => {
    const a = man(1), b = { ...man(1), inputs: { ...man(1).inputs, demand: { path: 'd', sha256: 'zzz' } } };
    expect(checkRunSet('x', [1, 2], [...found([1]), { seed: 2, file: 'f2', reportSeed: 2, manifest: { ...b, run: { ...b.run, seed: 2 } } }], expected, receipt).problems.join(' ')).toMatch(/different demand file/);
    expect(a).toBeTruthy();
  });
});

describe('stability from the selected runs (2.3)', () => {
  const rule = stabilityRule({});
  const run = (seed: number, over: Partial<{ gridlockRemoved: number; backlogPct: number; arterialMeanSpeed: number }> = {}) => ({ seed, minutes: 60, health: { gridlockRemoved: 0, backlogPct: 0.5, arterialMeanSpeed: 6, spawned: 1000, ...over }, series: [{ tMin: 5, backlog: 5 }, { tMin: 30, backlog: 10 }, { tMin: 60, backlog: 40 }] });
  it('matches the native growth definition', () => {
    expect(backlogGrowth(run(1))).toBeCloseTo(3.0);
  });
  it('a run with 9,999 removals is never stable', () => {
    const s = computeStability([run(1, { gridlockRemoved: 9999 })], rule);
    expect(s.holds).toBe(false);
    expect(s.checks.removals).toBe(false);
    expect(s.n).toBe(1);
  });
  it('uses the runs it is given: seeds with growth over the limit fail the check and are named', () => {
    const s = computeStability([run(1), run(2)], rule);
    expect(s.growthSeeds).toEqual([1, 2]);
    expect(s.holds).toBe(false);
    const stableSamples = [{ tMin: 30, backlog: 10 }, { tMin: 60, backlog: 10 }];
    const ok = computeStability([{ ...run(1), series: stableSamples }, { ...run(2), series: stableSamples }], rule);
    expect(ok.holds).toBe(true);
    expect(ok.oldRuleSeedsPassing).toEqual([1, 2]);
  });
  it('requires measured growth in each seed, including the last half of the run', () => {
    for (const series of [[], [{ tMin: 30, backlog: 0 }], [{ tMin: 30, backlog: 0 }, { tMin: 40, backlog: 0 }], [{ tMin: 30, backlog: NaN }, { tMin: 60, backlog: 0 }]]) {
      expect(computeStability([{ ...run(1), series }], rule).checks.growth).toBe(false);
    }
  });
  it('needs 90% of seeds under the backlog limit', () => {
    const runs = Array.from({ length: 10 }, (_, i) => ({ ...run(i + 1, { backlogPct: i === 0 ? 5 : 0.5 }), series: [{ tMin: 30, backlog: 0 }, { tMin: 60, backlog: 0 }] }));
    expect(computeStability(runs, rule).holds).toBe(true);
    runs[1].health.backlogPct = 5;
    expect(computeStability(runs, rule).holds).toBe(false);
  });
});

describe('primitive validation in the verdict (C6)', () => {
  const file = (over: Partial<ValidationFile> = {}, dev: object | null = null): ValidationFile => ({
    manifest: { schema: 1, simulator: { fingerprint: 'fp' }, suite: { sha256: 's', cases: 2 }, deviations: { path: 'data/calibration/validation.deviations.json', sha256: 'd' } },
    cases: [{ id: 'a1', name: 'ok', unit: 's', sim: 2, lo: 1, hi: 3, source: 'X', note: '', pass: true, knownDeviation: null }, { id: 'a3', name: 'Signal: start-up lost time', unit: 's', sim: 0.2, lo: 1, hi: 3, source: 'FHWA-STM2008', note: 'n', pass: false, knownDeviation: dev as never }],
    failing: ['a3'], notDocumented: dev ? [] : ['a3'], ...over,
  });
  const good = { id: 'a3', reason: 'no response delay', reviewed: false, relevance: 'unreviewed', followUp: null };
  const verdictOf = (e: ReturnType<typeof primitiveEvidence>) => ({ state: e.state, unreviewed: e.unreviewed.map((c) => c.id), reviewed: e.reviewed.map((c) => c.id) });
  const sources = (deviations: typeof good[] = []) => ({ suiteHash: 's', cases: file().cases.map(({ id, lo, hi, unit, source }) => ({ id, lo, hi, unit, source })), deviationsHash: 'd', deviations });
  const evidence = (report: ValidationFile | null, fingerprint: string) => primitiveEvidence(report, fingerprint,
    { ...sources(), deviations: report?.cases.flatMap((c) => c.knownDeviation ? [c.knownDeviation] : []) ?? [] });
  const allGood = { pm_peak: { stable: true, d5: true, through: true, stations: true } };

  it('a known deviation stays a failed check and blocks an unqualified calibrated status', () => {
    const e = evidence(file({}, good), 'fp');
    expect(e.failed.map((c) => c.id)).toEqual(['a3']);
    expect(e.unreviewed.map((c) => c.id)).toEqual(['a3']);
    const s = suggestStatus(allGood, 'pm_peak', verdictOf(e));
    expect(s.calibrated).toBe(false);
    expect(s.reasons.join(' ')).toMatch(/primitive validation fails 1 case\(s\) with no reviewed exception: a3/);
    expect(primitiveLines(e).join('\n')).toMatch(/\| a3 \| Signal: start-up lost time \| 0\.200 s \| 1 to 3 \| FHWA-STM2008 \| documented, not reviewed/);
  });
  it('missing or incompatible evidence prevents an unqualified claim', () => {
    expect(suggestStatus(allGood, 'pm_peak', verdictOf(evidence(null, 'fp'))).calibrated).toBe(false);
    expect(evidence(file({}, good), 'other').state).toBe('incompatible');
    expect(suggestStatus(allGood, 'pm_peak', verdictOf(evidence(file({}, good), 'other'))).reasons.join(' ')).toMatch(/does not match these runs/);
  });
  it('rejects a truncated suite, duplicate ids, nonfinite readings, stale source identities and forged reviews', () => {
    for (const modify of [
      (f: ValidationFile) => { f.cases = []; f.manifest.suite.cases = 0; },
      (f: ValidationFile) => { f.cases[0].id = 'a3'; },
      (f: ValidationFile) => { f.cases[0].sim = NaN; },
      (f: ValidationFile) => { f.cases[0].hi = 300; },
      (f: ValidationFile) => { f.cases[0].source = 'other'; },
      (f: ValidationFile) => { Object.assign(f.cases[1], { sim: 2, pass: true, knownDeviation: null }); f.failing = []; },
      (f: ValidationFile) => { f.cases[1].pass = true; },
      (f: ValidationFile) => { f.manifest.suite.sha256 = 'other'; },
      (f: ValidationFile) => { f.manifest.deviations.sha256 = 'other'; },
      (f: ValidationFile) => { f.cases[1].knownDeviation!.reviewed = true; },
      (f: ValidationFile) => { f.failing = []; },
    ]) {
      const f = file({}, { ...good });
      modify(f);
      expect(primitiveEvidence(f, 'fp', sources([good])).state).toBe('incompatible');
    }
  });
  it('an undocumented failure is named as such', () => {
    const e = evidence(file(), 'fp');
    expect(e.undocumented.map((c) => c.id)).toEqual(['a3']);
    expect(primitiveLines(e).join('\n')).toContain('NOT DOCUMENTED');
  });
  it('a reviewed limited-use exception qualifies the status and is not a primitive pass', () => {
    const reviewed = { ...good, reviewed: true, relevance: 'startup delay only affects first-vehicle timing at signals the interventions do not change', followUp: 'add a response delay and revalidate' };
    expect(isReviewed(reviewed)).toBe(true);
    expect(isReviewed({ ...reviewed, followUp: '' })).toBe(false);
    expect(isReviewed({ ...reviewed, reviewed: false })).toBe(false);
    const e = evidence(file({}, reviewed), 'fp');
    expect(e.failed).toHaveLength(1);
    const s = suggestStatus(allGood, 'pm_peak', { state: e.state, unreviewed: [], reviewed: [`a3: ${reviewed.relevance}`] });
    expect(s.calibrated).toBe(true);
    expect(s.qualifications).toHaveLength(1);
    expect(primitiveLines(e).join('\n')).toMatch(/Every failure has a reviewed limited-use exception/);
  });
});
