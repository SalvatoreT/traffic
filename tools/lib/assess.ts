// Reading calibrate reports of many seeds and scoring them: stability, headline shares, station GEH on the simulator's own link flows, noise file.
// Used by tools/assess.ts (final assessment) and tools/cost-loop.ts (feedback loop). No simulator code here.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { evaluateCases, seedStat, summarizeCases, linkSpread, encodeUint16, type AcceptanceSummary, type CaseResult } from './acceptance';

export interface SeedRun {
  seed: number; minutes: number; period: string;
  health: { gridlockRemoved: number; backlogPct: number; completed: number; arterialMeanSpeed: number; spawned: number };
  shares: { block: string; side: string; via: string; observed: number; observedPm: number | null; modelled: number | null; headline: boolean }[];
  rampShares: { direction: string; via: string; observed: number; modelledSide: number | null }[];
  linkFlowVehPerHour: number[] | null;
  linkMeanDelayS: number[] | null;
  features?: { id: string; label: string; kind: string; trips: number; vehPerHour: number }[];
  observedSignals?: { node: number; applies?: boolean; streets: string; cycleS: number; greenS: number[]; observedCycleS: number; approaches: { links: number[]; observedGreenS: number; modeledGreenS: number | null; exitsPerHour: number }[] }[];
  patternBypass?: { bypass: string; arterial: string; dir: string; corridorTrips: number; viaBypass: number }[];
  patternFreewayThrough?: { trips: string; localMiles: number; shareOfLocalMiles: number }[];
}

export interface StationFile {
  stations: { id: string; kind: string; label: string; corridor: string; held: boolean; links: number[]; target: Record<string, number>; feature?: { kind: string } }[];
  /** Interior links that start at a surface arterial, with the vehicles the volunteer count recorded entering there (per period id). */
  entries?: { side: string; label: string; link: number; counted: Record<string, number | null> }[];
}

export const seedFile = (dir: string, area: string, period: string, scale: number, seed: number) => join(dir, `${area}-${period}-s${scale}-seed${seed}.json`);

export function readSeeds(dir: string, area: string, period: string, seeds: number[], scale = 1): SeedRun[] {
  const out: SeedRun[] = [];
  for (const s of seeds) {
    const p = seedFile(dir, area, period, scale, s);
    if (existsSync(p)) out.push({ ...JSON.parse(readFileSync(p, 'utf8')), seed: s });
  }
  return out;
}

export interface ShareStat { block: string; side: string; via: string; observed: number; mean: number; lo: number; hi: number; sd: number; errPoints: number; within10: boolean; headline: boolean }

/** Seed mean and 95% interval of every route share; observed is the PM value where the file has one and the period is the PM peak. */
export function shareStats(runs: SeedRun[], usePm: boolean): ShareStat[] {
  if (!runs.length) return [];
  return runs[0].shares.map((q, i) => {
    const vals = runs.map((r) => r.shares[i].modelled ?? NaN);
    const st = seedStat(vals);
    const obs = usePm && q.observedPm != null ? q.observedPm : q.observed;
    const err = (st.mean - obs) * 100;
    return { block: q.block, side: q.side, via: q.via, observed: obs, mean: st.mean, lo: st.lo, hi: st.hi, sd: st.sd, errPoints: err, within10: Math.abs(err) <= 10, headline: q.headline };
  });
}

export interface RampStat { direction: string; via: string; observed: number; mean: number; lo: number; hi: number; errPoints: number }
export function rampStats(runs: SeedRun[]): RampStat[] {
  if (!runs.length) return [];
  return runs[0].rampShares.map((q, i) => { const st = seedStat(runs.map((r) => r.rampShares[i].modelledSide ?? NaN)); return { direction: q.direction, via: q.via, observed: q.observed, mean: st.mean, lo: st.lo, hi: st.hi, errPoints: (st.mean - q.observed) * 100 }; });
}

/** Mean absolute error of the headline shares, in points, on the seed means. */
export const headlineError = (ss: ShareStat[]): number => { const h = ss.filter((q) => q.headline); return h.length ? h.reduce((a, q) => a + Math.abs(q.errPoints), 0) / h.length : NaN; };

export interface StationScore { period: string; fitted: AcceptanceSummary; held: AcceptanceSummary; interior: { fitted: AcceptanceSummary; held: AcceptanceSummary }; other: { fitted: AcceptanceSummary; held: AcceptanceSummary }; cases: (CaseResult & { corridor: string; label: string; kind: string; stationId: string })[]; skippedWithoutLinks: number }

/** GEH and size bands of the simulator's link flows (mean over the seeds) against the count targets of link-based stations; gate stations have no link and are skipped. */
export function scoreStations(runs: SeedRun[], file: StationFile, period: string): StationScore {
  const withFlows = runs.filter((r) => r.linkFlowVehPerHour);
  const cases: StationScore['cases'] = [];
  let skipped = 0;
  for (const st of file.stations) {
    const target = st.target[period];
    if (!(target > 0)) continue;
    if (!st.links.length) { skipped++; continue; }
    const modeled = withFlows.length ? withFlows.reduce((a, r) => a + st.links.reduce((b, l) => b + (r.linkFlowVehPerHour![l] ?? 0), 0), 0) / withFlows.length : NaN;
    const [c] = evaluateCases([{ id: st.id, modeled, counted: target, held: st.held }]);
    cases.push({ ...c, corridor: st.corridor, label: st.label, kind: st.kind, stationId: st.id });
  }
  const part = (sel: (c: (typeof cases)[number]) => boolean) => ({ fitted: summarizeCases(cases.filter((c) => sel(c) && !c.held)), held: summarizeCases(cases.filter((c) => sel(c) && c.held)) });
  return { period, fitted: summarizeCases(cases.filter((c) => !c.held)), held: summarizeCases(cases.filter((c) => c.held)), interior: part((c) => c.kind === 'count'), other: part((c) => c.kind !== 'count'), cases, skippedWithoutLinks: skipped };
}

/** Corridor ratio: simulated flow over counted flow, summed over the link-based stations of a corridor, mean over seeds with its 95% interval across seeds. */
export function corridorRatios(runs: SeedRun[], file: StationFile, period: string): { corridor: string; stations: number; ratio: number; lo: number; hi: number }[] {
  const by = new Map<string, StationFile['stations']>();
  for (const st of file.stations) if (st.links.length && st.target[period] > 0) (by.get(st.corridor) ?? by.set(st.corridor, []).get(st.corridor)!).push(st);
  return [...by].map(([corridor, sts]) => {
    const tgt = sts.reduce((a, s) => a + s.target[period], 0);
    const per = runs.filter((r) => r.linkFlowVehPerHour).map((r) => sts.reduce((a, s) => a + s.links.reduce((b, l) => b + (r.linkFlowVehPerHour![l] ?? 0), 0), 0) / tgt);
    const st = seedStat(per);
    return { corridor, stations: sts.length, ratio: st.mean, lo: st.lo, hi: st.hi };
  }).sort((a, b) => a.corridor.localeCompare(b.corridor));
}

/** Per-link standard deviation of flow over the seeds, per period, as a compact file (Uint16 counts of `unit` veh/h; links under `minMeanVehPerHour` are zero). */
export function noiseFile(area: string, byPeriod: Record<string, SeedRun[]>, unit = 0.5, minMean = 5): { area: string; unit: string; seeds: number[]; minutes: number; links: number; note: string; sd: Record<string, number[]> } {
  const sd: Record<string, number[]> = {};
  let links = 0, seeds: number[] = [], minutes = 0;
  for (const [p, runs] of Object.entries(byPeriod)) {
    const flows = runs.filter((r) => r.linkFlowVehPerHour).map((r) => r.linkFlowVehPerHour!);
    if (flows.length < 2) continue;
    const { mean, sd: s } = linkSpread(flows);
    const v = Float64Array.from(s, (x, l) => (mean[l] >= minMean ? x : 0));
    sd[p] = encodeUint16(v, unit);
    links = v.length; seeds = runs.map((r) => r.seed); minutes = runs[0].minutes;
  }
  return { area, unit: `sd[period][link] x ${unit} veh/h, sample standard deviation of the flow on the link after the warm-up across the seeds`, seeds, minutes, links, note: 'Seed-to-seed spread of the baseline link flows (veh/h). It measures simulator noise only (demand is fixed), at the baseline; a scenario run is expected to have a similar spread (ASSUMPTION). Links with a mean flow under 5 veh/h are zero.', sd };
}

/** Simulated link flow of every station link (sum over its links), mean over the seeds, and the modeled value of every route feature (turning movements, whole-street paths). */
export function meanLinkFlow(runs: SeedRun[], links: number[]): number {
  const w = runs.filter((r) => r.linkFlowVehPerHour);
  return w.length ? w.reduce((a, r) => a + links.reduce((b, l) => b + (r.linkFlowVehPerHour![l] ?? 0), 0), 0) / w.length : NaN;
}
export function featureStats(runs: SeedRun[], id: string) {
  const v = runs.map((r) => r.features?.find((x) => x.id === id)?.vehPerHour ?? NaN);
  return seedStat(v);
}
