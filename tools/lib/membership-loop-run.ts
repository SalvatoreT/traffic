// The membership loop's file handling and control flow (calibration round 48); the CLI is tools/membership-loop.ts. Builds and simulator runs go through a `Runner`,
// so tests can stand in for them. Leak guards: the training file is pooled only from runs of the training demand and checked for withheld station ids; station
// choice and the stop rule read stations, the frozen split and simulated flows, never an assessment or a held-out score; the split file is hashed before and after.
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { hashFile } from './run-manifest';
import { writeFileAtomic } from './atomic';
import { withheldStationIds, type SplitManifest } from './lineage';
import type { SelectOd } from './through-membership';
import { assertNoWithheld, checkFitReport, checkRunSet, iterationShift, iterationStats, membershipFile, poolStations, selectStations, type IterationStats, type Pooled, type RunSet, type Selection, type Shift, type StationRec } from './membership-loop';
import type { MembershipEvidence } from './through-membership';

export type View = 'shipped' | 'training';
export interface LoopOptions { root: string; area: string; views: View[]; periods: string[]; seeds: number[]; iterations: number; jobs: number; dir: string; configPath: string; resume: boolean }
export interface CalibrateJob { period: string; seed: number; demand: string; out: string }
export interface Runner {
  build(view: View, logFile: string): void;
  calibrate(jobs: CalibrateJob[], concurrency: number, logDir: string): Promise<void>;
}
export interface LoopPaths { config: string; demand: Record<View, string>; report: Record<View, string>; stations: string; membership: Record<View, string>; membershipConfig: Record<View, string>; split: string; network: string }

/** File locations from the demand config; the membership files are the ones `countFit.throughTargets.simulatedMembership` names. */
export function loopPaths(root: string, configPath: string, cfg: any): LoopPaths {
  const fc = cfg.countFit, sm = fc?.throughTargets?.simulatedMembership;
  if (!sm) throw new Error('the config has no countFit.throughTargets.simulatedMembership entry; apply the round 48 candidate first (openspec/changes/calibration-round-48/apply-candidate.py)');
  const abs = (p: string) => resolve(root, p);
  return {
    config: abs(configPath), demand: { shipped: abs(cfg.output), training: abs(fc.validation.demandOutput) },
    report: { shipped: abs(fc.output), training: abs(fc.output.replace(/\.md$/, '.cv.md')) },
    stations: abs(fc.stationsOutput), membership: { shipped: abs(sm.file), training: abs(sm.trainingFile) }, membershipConfig: { shipped: sm.file, training: sm.trainingFile },
    split: abs(fc.validation.splitFile ?? `data/demand/${cfg.area}.split.json`), network: abs(cfg.network),
  };
}

const readJson = <T>(p: string): T => JSON.parse(readFileSync(p, 'utf8')) as T;
const sodFiles = (dir: string, period: string) => readdirSync(dir).filter((f) => f.startsWith(`sod-${period}-`) && f.endsWith('.json')).sort((a, b) => Number(a.match(/-(\d+)\.json$/)![1]) - Number(b.match(/-(\d+)\.json$/)![1]));

export interface PassReport { pass: number; view: View; period: string; /** Car veh/h the pass's demand offers; the loop reports it because a fit on simulated membership can move volume. */ offered: number; selected: number; withHits: number; zeroHit: string[]; absent: string[]; shift: Shift | null }
export interface LoopSummary { passes: number; stoppedEarly: boolean; reports: PassReport[]; hashes: Record<string, string>; stayStatic: Record<string, Selection['stayStatic']>; selected: Record<string, number>; withheld: Record<string, number> }

/** The stations file's entries and the split's withheld ids, read when needed (the stations file is rewritten by the shipped build). */
function selections(p: LoopPaths, periods: string[]): Record<View, Selection[]> {
  const st = readJson<{ stations: StationRec[] }>(p.stations).stations;
  const withheld = withheldStationIds(readJson<SplitManifest>(p.split));
  return { shipped: periods.map((q) => selectStations(st, q)), training: periods.map((q) => selectStations(st, q, withheld)) };
}

export async function runLoop(o: LoopOptions, r: Runner, log: (s: string) => void = console.log): Promise<LoopSummary> {
  const cfg = readJson<any>(resolve(o.root, o.configPath));
  const p = loopPaths(o.root, o.configPath, cfg);
  if (o.seeds.length < 2) throw new Error('at least two seeds are needed for a standard error');
  mkdirSync(o.dir, { recursive: true });
  const statePath = join(o.dir, 'state.json');
  const state: { done: string[]; stoppedAfter: number | null; reports: PassReport[]; stationsSha: string | null } = o.resume && existsSync(statePath) ? readJson(statePath) : { done: [], stoppedAfter: null, reports: [], stationsSha: null };
  const save = () => writeFileAtomic(statePath, JSON.stringify(state, null, 1));
  const configSha = hashFile(p.config), splitSha = hashFile(p.split);
  const once = async (id: string, f: () => void | Promise<void>) => { if (state.done.includes(id)) { log(`skip ${id} (done)`); return; } log(`start ${id}`); await f(); state.done.push(id); save(); };
  const bin = (view: View, k: number) => join(o.dir, `iter${k}`, view);
  const verify = (view: View, k: number, fileKey: 'first' | 'pooled') => {
    const text = readFileSync(p.report[view], 'utf8');
    const used = fileKey === 'pooled';
    const file = used ? readJson<{ periods: Record<string, { stations: { hits: object } }> }>(p.membership[view]) : null;
    const runs = Object.fromEntries(o.periods.map((q) => [q, o.seeds.length * k]));
    const minStations = Object.fromEntries(o.periods.map((q) => [q, file ? Object.keys(file.periods[q]?.stations.hits ?? {}).length : 0]));
    const res = checkFitReport(text, { view, file: used ? p.membershipConfig[view] : null, runs: used ? runs : {}, minStations });
    if (res.problems.length) throw new Error(`${view} view, pass ${k}: ${res.problems.join('; ')}`);
    for (const [q, v] of Object.entries(res.periods)) if (v.stations !== minStations[q]) throw new Error(`${view} view, ${q}: ${v.stations} stations took simulated membership but the file holds ${minStations[q]}`);
    return res;
  };
  const build = async (id: string, view: View, k: number, final: boolean) => {
    await once(id, () => {
      r.build(view, join(o.dir, 'logs', `${id}.log`));
      if (hashFile(p.config) !== configSha) throw new Error('the demand config changed during the loop; membership evidence is tied to its hash');
      const s = hashFile(p.stations);
      if (state.stationsSha && s !== state.stationsSha) throw new Error('the stations file changed between builds; membership evidence is tied to its hash');
      if (view === 'shipped') state.stationsSha = s;
      verify(view, k, k === 0 && !final ? 'first' : 'pooled');
    });
  };

  for (let k = 0; k < o.iterations; k++) {
    for (const v of o.views) {
      await build(`i${k}-${v}-build`, v, k, false);
      mkdirSync(bin(v, k), { recursive: true });
      if (!existsSync(join(bin(v, k), 'demand.json'))) copyFileSync(p.demand[v], join(bin(v, k), 'demand.json'));
      await once(`i${k}-${v}-runs`, async () => {
        const jobs: CalibrateJob[] = o.periods.flatMap((q) => o.seeds.map((s) => ({ period: q, seed: s, demand: join(bin(v, k), 'demand.json'), out: join(bin(v, k), `sod-${q}-${s}.json`) })));
        await r.calibrate(jobs, o.jobs, join(o.dir, 'logs', `i${k}-${v}`));
      });
    }
    await once(`i${k}-pool`, () => {
      const sel = selections(p, o.periods);
      const evidence: Partial<Record<View, MembershipEvidence>> = {};
      const reports: PassReport[] = [];
      const stats: Record<string, IterationStats[]> = {};
      for (const v of o.views) {
        const pooled: Record<string, Pooled> = {}, setups: Record<string, string> = {};
        for (const [qi, q] of o.periods.entries()) {
          const sets: RunSet[] = [];
          stats[`${v}:${q}`] = [];
          for (let j = 0; j <= k; j++) {
            const dir = bin(v, j), demandPath = join(dir, 'demand.json');
            const files = sodFiles(dir, q);
            const sod = files.map((f) => readJson<SelectOd>(join(dir, f)));
            const ev = checkRunSet(sod, files, { demandHash: hashFile(demandPath)!, period: q, area: o.area, view: v, seeds: o.seeds, seen: new Set() });
            if (evidence[v] && JSON.stringify(evidence[v]) !== JSON.stringify(ev.evidence)) throw new Error(`${v} view: iteration ${j} ran on different evidence (simulator, config, stations, split) from the others`);
            evidence[v] = ev.evidence;
            if (ev.evidence.config !== configSha || ev.evidence.stations !== hashFile(p.stations) || ev.evidence.network !== hashFile(p.network)) throw new Error(`${v} view, iteration ${j}: the runs do not match the config, stations or network on disk`);
            setups[q] = ev.setup;
            const demand = readJson<{ periods: { id: string; flows: { origin: number; destination: number; vehPerHour: number; mode?: string }[] }[] }>(demandPath);
            sets.push({ label: `${dir} (${files.length} seeds)`, flows: demand.periods.find((x) => x.id === q)!.flows.filter((f) => !f.mode), sod });
            stats[`${v}:${q}`].push(iterationStats(sod, new Set(sel[v][qi].selected.map((s) => s.id))));
          }
          const s = sel[v][qi];
          pooled[q] = poolStations(sets, new Set(s.selected.map((x) => x.id)));
          const last = stats[`${v}:${q}`];
          reports.push({ pass: k, view: v, period: q, offered: Math.round(sets[sets.length - 1].flows.reduce((a, f) => a + f.vehPerHour, 0)), selected: s.selected.length, withHits: Object.keys(pooled[q].measured.hits).length, zeroHit: pooled[q].zeroHit, absent: pooled[q].absent, shift: last.length > 1 ? iterationShift(last[last.length - 2], last[last.length - 1]) : null });
        }
        const file = membershipFile({ area: o.area, networkId: readJson<{ id: string }>(p.network).id, evidence: evidence[v]!, setups, periods: pooled, iterations: k + 1, view: v });
        if (v === 'training') assertNoWithheld(file as never, withheldStationIds(readJson<SplitManifest>(p.split)));
        mkdirSync(dirname(p.membership[v]), { recursive: true });
        writeFileAtomic(p.membership[v], JSON.stringify(file));
      }
      state.reports.push(...reports);
      for (const x of reports) log(`pass ${k} ${x.view} ${x.period}: ${x.offered} car veh/h offered; ${x.withHits} of ${x.selected} selected stations have pairs; zero hits: ${x.zeroHit.length ? x.zeroHit.join(', ') : 'none'}; not exported: ${x.absent.length ? x.absent.join(', ') : 'none'}${x.shift ? `; flow change ${x.shift.flowRatio.toFixed(2)} and membership change ${x.shift.membershipRatio.toFixed(2)} of the seed standard error over ${x.shift.stations} stations` : ''}`);
      if (k >= 1 && reports.every((x) => x.shift?.converged)) state.stoppedAfter = k;
    });
    if (state.stoppedAfter !== null && state.stoppedAfter <= k) { log(`stop rule met at pass ${state.stoppedAfter}`); break; }
  }
  const passes = state.stoppedAfter !== null ? state.stoppedAfter + 1 : o.iterations;
  const hashes: Record<string, string> = {};
  for (const v of o.views) {
    await build(`final-${v}-build`, v, passes, true);
    hashes[`${v} demand`] = hashFile(p.demand[v])!.slice(0, 16);
    hashes[`${v} membership file`] = hashFile(p.membership[v])!.slice(0, 16);
  }
  if (hashFile(p.split) !== splitSha) throw new Error('the frozen split file changed during the loop');
  const stay: LoopSummary['stayStatic'] = {}, selected: LoopSummary['selected'] = {}, withheldN: LoopSummary['withheld'] = {};
  const sel = selections(p, o.periods);
  for (const v of o.views) for (const s of sel[v]) { stay[`${v}:${s.period}`] = s.stayStatic; selected[`${v}:${s.period}`] = s.selected.length; withheldN[`${v}:${s.period}`] = s.withheld.length; }
  return { passes, stoppedEarly: state.stoppedAfter !== null && state.stoppedAfter + 1 < o.iterations, reports: state.reports, hashes, stayStatic: stay, selected, withheld: withheldN };
}

/** The loop's report as Markdown. */
export function renderReport(s: LoopSummary, o: { seeds: number[]; periods: string[] }): string {
  const L = ['# Membership loop (calibration round 48)', '', `Seeds ${o.seeds[0]} to ${o.seeds[o.seeds.length - 1]} per pass, periods ${o.periods.join(', ')}. Passes run: ${s.passes}${s.stoppedEarly ? ' (stop rule fired)' : ''}. Pooled with equal weight over passes (successive averages, step 1/n, ASSUMPTION for this fixed point).`, '',
    '| Pass | View | Period | Offered car veh/h | Selected | With pairs | Zero hits | Not exported | Flow change / seed SE | Membership change / seed SE |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...s.reports.map((x) => `| ${x.pass} | ${x.view} | ${x.period} | ${x.offered} | ${x.selected} | ${x.withHits} | ${x.zeroHit.join(', ') || '-'} | ${x.absent.join(', ') || '-'} | ${x.shift ? x.shift.flowRatio.toFixed(2) : '-'} | ${x.shift ? x.shift.membershipRatio.toFixed(2) : '-'} |`),
    '', '## Static membership', '', ...Object.entries(s.stayStatic).map(([k, v]) => `- ${k}: ${v.length ? v.map((x) => `${x.id} (${x.reason})`).join('; ') : 'none'}`), '', '## Files', '', ...Object.entries(s.hashes).map(([k, v]) => `- ${k}: ${v}`), ''];
  return L.join('\n');
}
