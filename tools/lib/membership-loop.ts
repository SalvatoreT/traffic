// Fitting demand on the simulator's own route choice for every station the report binary exports (calibration round 48). No I/O.
// Station choice is a rule on the stations file and the frozen split, never on a score. The loop's iteration runs are pooled with equal weight, the method of
// successive averages with step 1/n [PowellSheffi1982]. Applying that step rule to this fixed point (demand, routes, membership, demand) is an ASSUMPTION: the
// reference concerns equilibrium assignment, and its paper was not opened.
import type { ThroughMeasured } from './demand-fit';
import { checkSelectOdSeed, membershipEvidence, pooledMembership, pooledStations, sameMembershipEvidence, throughTargetId, type MembershipEvidence, type SelectOd } from './through-membership';

/** The fields of a stations-file entry that decide what the report binary can export. */
export interface StationRec {
  id: string; kind: string; links: number[]; detectors?: string[] | null;
  feature?: { kind?: string; a?: number; b?: number; first?: number; last?: number; links?: number[] } | null;
  source?: string | null; target: Record<string, number>;
}

export type ExportVia = 'link' | 'route';

/**
 * What `calibrate --select-od` writes for a station (crates/sim/src/bin/calibrate.rs): link stations with a detector list, or with neither a detector list nor a
 * ramp or turning-movement kind (counted at the block); movement and route stations by their feature. Everything else has no export and stays static.
 */
export function exportOf(st: StationRec): { via: ExportVia } | { reason: string } {
  if (st.links.length > 0) {
    if (Array.isArray(st.detectors)) { if (st.detectors.length) return { via: 'link' }; }
    else if (st.kind !== 'ramp' && st.kind !== 'tmc') return { via: 'link' };
    else return { reason: `${st.kind} leg without a detector list: the report binary writes no pairs for it` };
  }
  const f = st.feature;
  if (f && (f.kind === 'move' || f.kind === 'path') && (f.a ?? f.first) !== undefined && (f.b ?? f.last) !== undefined) {
    if (f.kind === 'path' && !f.links && st.source !== 'volunteer-count') return { reason: 'whole-street path without its links: the report binary skips it' };
    return { via: 'route' };
  }
  return { reason: st.links.length ? 'link station with an empty detector list' : 'no links and no movement or route feature (a gate total)' };
}

export interface Selection {
  period: string;
  selected: { id: string; via: ExportVia }[];
  /** Fitted in the period but without an export. */
  stayStatic: { id: string; reason: string }[];
  /** Left out because the view withholds them (training view). */
  withheld: string[];
}

/** The stations of one view and period whose membership the loop fits: every station with a target in the period and an export, minus the view's withheld ones. */
export function selectStations(stations: StationRec[], period: string, withheld?: Set<string>): Selection {
  const out: Selection = { period, selected: [], stayStatic: [], withheld: [] };
  for (const st of stations) {
    if (!((st.target[period] ?? 0) > 0)) continue;
    if (withheld?.has(st.id)) { out.withheld.push(st.id); continue; }
    const e = exportOf(st);
    if ('via' in e) out.selected.push({ id: st.id, via: e.via }); else out.stayStatic.push({ id: st.id, reason: e.reason });
  }
  return out;
}

/** The pairs of every export of a seed run, in veh/h of the run. */
function stationPairs(run: SelectOd): Map<string, Map<string, number>> {
  const out = new Map<string, Map<string, number>>();
  const perH = 60 / run.minutes;
  for (const ft of [...(run.features ?? []), ...(run.links ?? [])]) {
    const m = out.get(ft.id) ?? out.set(ft.id, new Map()).get(ft.id)!;
    for (const [o, d, n] of ft.trips) { const q = `${o}>${d}`; m.set(q, (m.get(q) ?? 0) + n * perH); }
  }
  return out;
}

export interface MeanSe { mean: number; se: number }
export interface IterationStats { seeds: number; flow: Record<string, MeanSe>; pairs: Record<string, Record<string, MeanSe>> }

const meanSe = (xs: number[]): MeanSe => {
  const n = xs.length, mean = xs.reduce((a, b) => a + b, 0) / n;
  return { mean, se: n > 1 ? Math.sqrt(xs.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1) / n) : NaN };
};

/** Per station, the simulated flow over the seeds of one iteration (mean and standard error) and the same per origin-destination pair. */
export function iterationStats(runs: SelectOd[], ids?: Set<string>): IterationStats {
  if (runs.length < 2) throw new Error('a standard error needs at least two seeds');
  const per = runs.map(stationPairs);
  const all = new Set(per.flatMap((m) => [...m.keys()]));
  const flow: IterationStats['flow'] = {}, pairs: IterationStats['pairs'] = {};
  for (const id of all) {
    if (ids && !ids.has(id)) continue;
    flow[id] = meanSe(per.map((m) => [...(m.get(id)?.values() ?? [])].reduce((a, b) => a + b, 0)));
    const qs = new Set(per.flatMap((m) => [...(m.get(id)?.keys() ?? [])]));
    pairs[id] = {};
    for (const q of qs) pairs[id][q] = meanSe(per.map((m) => m.get(id)?.get(q) ?? 0));
  }
  return { seeds: runs.length, flow, pairs };
}

export interface Shift { stations: number; flowRms: number; flowSeRms: number; flowRatio: number; membershipRms: number; membershipSeRms: number; membershipRatio: number; converged: boolean }

/** Ratio of the change to the seed noise at or below which an iteration counts as unchanged (ASSUMPTION, written before any run: 1, the change is no larger than its standard error). */
export const STOP_RATIO = 1;

/**
 * Change between two iterations' runs. Flow: per station, the difference of the seed-mean flows. Membership: per station, the sum over pairs of the difference
 * of the seed-mean pair flows. Each is compared as a root mean square over stations with the root mean square of its combined standard error (square root of
 * the two seed variances of the mean), so that two samples of one distribution give a ratio near 1 for flow and below 1 for membership.
 */
export function iterationShift(prev: IterationStats, cur: IterationStats): Shift {
  const ids = Object.keys(cur.flow).filter((id) => id in prev.flow && (cur.flow[id].mean > 0 || prev.flow[id].mean > 0));
  const sq = (xs: number[]) => (xs.length ? Math.sqrt(xs.reduce((a, b) => a + b * b, 0) / xs.length) : 0);
  const df: number[] = [], sf: number[] = [], dm: number[] = [], sm: number[] = [];
  for (const id of ids) {
    df.push(cur.flow[id].mean - prev.flow[id].mean);
    sf.push(Math.hypot(cur.flow[id].se, prev.flow[id].se));
    let l1 = 0, se = 0;
    for (const q of new Set([...Object.keys(cur.pairs[id] ?? {}), ...Object.keys(prev.pairs[id] ?? {})])) {
      const a = cur.pairs[id]?.[q], b = prev.pairs[id]?.[q];
      l1 += Math.abs((a?.mean ?? 0) - (b?.mean ?? 0));
      se += Math.hypot(a?.se ?? 0, b?.se ?? 0);
    }
    dm.push(l1); sm.push(se);
  }
  const ratio = (a: number, b: number) => (b > 0 ? a / b : a > 0 ? Infinity : 0);
  const flowRms = sq(df), flowSeRms = sq(sf), membershipRms = sq(dm), membershipSeRms = sq(sm);
  const flowRatio = ratio(flowRms, flowSeRms), membershipRatio = ratio(membershipRms, membershipSeRms);
  return { stations: ids.length, flowRms, flowSeRms, flowRatio, membershipRms, membershipSeRms, membershipRatio, converged: ids.length > 0 && flowRatio <= STOP_RATIO && membershipRatio <= STOP_RATIO };
}

export interface RunSet { label: string; flows: { origin: number; destination: number; vehPerHour: number }[]; sod: SelectOd[] }

/** Every iteration pooled in a file has the same number of seeds, so each weighs 1/n. */
export function assertEqualWeight(sets: RunSet[]): void {
  const n = new Set(sets.map((s) => s.sod.length));
  if (n.size !== 1 || sets.some((s) => s.sod.length < 2)) throw new Error(`iterations must carry the same number of seeds (at least two) to pool with equal weight, got ${sets.map((s) => s.sod.length).join(', ')}`);
}

export interface Pooled { measured: ThroughMeasured; zeroHit: string[]; absent: string[]; dropped: string[]; /** Round 51: the through targets' pool (study-area trips left out) and the shares' pool (every trip), when the sub-switches are on. */ through?: PooledBlocks; blocks?: PooledBlocks }

/**
 * Equal-weight pool of the iteration runs for the selected stations only. A station with no simulated trip in any pooled run is not written: the fit
 * would otherwise take a membership of zero for it, so it keeps its static membership and is listed in `zeroHit`. A selected station the runs did not export is listed in `absent`.
 * `dropped` are exported stations outside the selection (withheld, gates, no target), removed together with the pairs only they used, so that no pair list carries them.
 */
export function poolStations(sets: RunSet[], selected: Set<string>): Pooled {
  assertEqualWeight(sets);
  const m = pooledStations(sets);
  const hits: ThroughMeasured['hits'] = {};
  const zeroHit: string[] = [], dropped: string[] = [];
  for (const [id, h] of Object.entries(m.hits)) {
    if (!selected.has(id)) { dropped.push(id); continue; }
    if (Object.values(h).reduce((a, b) => a + b, 0) <= 0) { zeroHit.push(id); continue; }
    hits[id] = h;
  }
  const keep = new Set(Object.values(hits).flatMap((h) => Object.keys(h)));
  const trips = Object.fromEntries(Object.entries(m.trips).filter(([q]) => keep.has(q)));
  const absent = [...selected].filter((id) => !(id in m.hits)).sort();
  return { measured: { runs: m.runs, source: m.source, hits, trips }, zeroHit: zeroHit.sort(), absent, dropped: dropped.sort() };
}

/** Round 51 sub-switches of the candidate's `simulatedMembership` entry: through targets and select-link shares take simulated membership from the runs' block export. */
export interface BlockSwitches { throughTargets: boolean; shares: boolean }
/** Round 52 sub-switch: a whole-street route count with simulated membership weighs its blocks spanned. */
export const routeWeightSwitch = (sm: { routeWeightPerBlock?: unknown } | undefined): boolean => sm?.routeWeightPerBlock === true;
export const blockSwitches = (sm: { throughTargets?: unknown; shares?: unknown } | undefined): BlockSwitches => ({ throughTargets: sm?.throughTargets === true, shares: sm?.shares === true });

export interface PooledBlocks { measured: ThroughMeasured; /** Blocks the runs exported without a counted trip (after the study-area filter, if any): they keep static routes. */ zeroHit: string[] }

/**
 * Equal-weight pool of the iteration runs' select-link block pairs (`blocks` of `calibrate --select-od`: per block, every trip that used a link of it). With `inStudy`, trips with a
 * trip end in the study area are left out (the through targets' definition, `pooledMembership`); with an empty set every trip counts (the select-link shares' definition). A block with no
 * counted trip is not written, so the fit keeps its static routes, and is listed in `zeroHit`. Hits are keyed `through <label>` as the through targets are.
 */
export function poolBlocks(sets: RunSet[], inStudy: Set<number>): PooledBlocks {
  assertEqualWeight(sets);
  for (const s of sets) for (const r of s.sod) if (!Array.isArray(r.blocks)) throw new Error(`seed ${r.seed} of ${s.label} has no block export (blocks); the binary or its arguments are wrong`);
  const m = pooledMembership(sets, inStudy);
  const labels = new Set(sets.flatMap((s) => s.sod.flatMap((r) => r.blocks.map((b) => throughTargetId(b.label)))));
  const hits: ThroughMeasured['hits'] = {}, zeroHit: string[] = [];
  for (const id of [...labels].sort()) {
    const h = m.hits[id];
    if (h && Object.values(h).reduce((a, b) => a + b, 0) > 0) hits[id] = h; else zeroHit.push(id.slice('through '.length));
  }
  const keep = new Set(Object.values(hits).flatMap((h) => Object.keys(h)));
  return { measured: { runs: m.runs, source: m.source, hits, trips: Object.fromEntries(Object.entries(m.trips).filter(([q]) => keep.has(q))) }, zeroHit };
}

/** Evidence and run-setting checks of one iteration's seed runs of one period and view, as `tools/through-membership.ts` makes them. Returns the evidence and the setup string. */
export function checkRunSet(sod: SelectOd[], files: string[], o: { demandHash: string; period: string; area: string; view: string; seeds: number[]; seen: Set<string> }): { evidence: MembershipEvidence; setup: string } {
  if (sod.length !== o.seeds.length || sod.some((r, i) => r.seed !== o.seeds[i])) throw new Error(`${o.period}: expected seeds ${o.seeds.join(',')}, found ${sod.map((r) => r.seed).join(',')}`);
  let evidence: MembershipEvidence | undefined, setup: string | undefined;
  for (const [i, run] of sod.entries()) {
    checkSelectOdSeed(run, o.demandHash, o.period, files[i], o.seen);
    if (!run.features || !run.links) throw new Error(`${files[i]}: no station exports (features, links); the binary or its arguments are wrong`);
    const cur = membershipEvidence(run, o.demandHash);
    if (cur.view !== o.view) throw new Error(`${files[i]}: a ${cur.view} view run cannot feed the ${o.view} view`);
    if (run.manifest!.run.area !== o.area || (evidence && !sameMembershipEvidence(evidence, cur))) throw new Error('runs differ in simulator, area, source, split or demand view');
    const s = JSON.stringify({ ...run.manifest!.run, seed: undefined });
    if (setup !== undefined && setup !== s) throw new Error('runs differ in settings or measurement window');
    evidence = cur; setup = s;
  }
  return { evidence: evidence!, setup: setup! };
}

export interface MembershipFileInput { area: string; networkId: string; evidence: MembershipEvidence; setups: Record<string, string>; periods: Record<string, Pooled>; iterations: number; view: string }

/** The file `countFit.throughTargets.simulatedMembership` points at, in the layout of `tools/through-membership.ts --stations`. */
export function membershipFile(i: MembershipFileInput): object {
  return {
    area: i.area, network: i.networkId, evidence: i.evidence, setups: i.setups,
    note: `Simulated station pairs, ${i.view} view, equal-weight pool of ${i.iterations} iteration(s) of seed runs (calibration round 48). Model output, not data. A station with no simulated trip is listed in zeroHit and keeps its static membership. Written by tools/membership-loop.ts.`,
    periods: Object.fromEntries(Object.entries(i.periods).map(([p, v]) => [p, {
      runs: v.through?.measured.runs ?? 0, source: v.through?.measured.source ?? '', hits: v.through?.measured.hits ?? {}, trips: v.through?.measured.trips ?? {},
      ...(v.through ? { throughZeroHit: v.through.zeroHit } : {}), ...(v.blocks ? { blocks: { ...v.blocks.measured, zeroHit: v.blocks.zeroHit } } : {}),
      stations: { ...v.measured, zeroHit: v.zeroHit },
    }])),
  };
}

/** The training view's file must name no withheld station, in hits or in zero-hit lists. */
export function assertNoWithheld(file: { periods: Record<string, { hits?: Record<string, unknown>; throughZeroHit?: string[]; blocks?: ThroughMeasured & { zeroHit?: string[] }; stations?: ThroughMeasured & { zeroHit?: string[] } }> }, withheld: Set<string>): void {
  const bad: string[] = [];
  for (const [p, v] of Object.entries(file.periods)) for (const id of [...Object.keys(v.stations?.hits ?? {}), ...(v.stations?.zeroHit ?? []), ...Object.keys(v.hits ?? {}), ...(v.throughZeroHit ?? []), ...Object.keys(v.blocks?.hits ?? {}), ...(v.blocks?.zeroHit ?? [])]) if (withheld.has(id) || withheld.has(id.replace(/^through /, ''))) bad.push(`${p}: ${id}`);
  if (bad.length) throw new Error(`the training membership file names withheld stations: ${bad.slice(0, 5).join('; ')}`);
}

export interface ReportCheck { problems: string[]; periods: Record<string, { runs: number; stations: number; of: number }> }

/**
 * Reads the fit report of a build. With a membership file expected, the report must carry the `Simulated membership from` note and, for each period of the file,
 * the note with its run count and station count; a silent fall back to static membership is the failure this guards against. With none expected (the first
 * pass), the report must say that there was no file.
 */
export function checkFitReport(text: string, o: { view: string; file: string | null; runs: Record<string, number>; minStations: Record<string, number>; /** Round 51: per period, the runs and the number of blocks with simulated trips in the file, when the shares take simulated membership. */ blocks?: Record<string, { runs: number; blocks: number }> }): ReportCheck {
  const problems: string[] = [];
  const periods: ReportCheck['periods'] = {};
  if (o.file === null) {
    if (!/No simulated membership file for the \w+ view/.test(text)) problems.push('the first pass must build without a simulated membership file, and the report does not say so');
    return { problems, periods };
  }
  if (!text.includes(`Simulated membership from ${o.file} (${o.view} view)`)) problems.push(`the fit report lacks the "Simulated membership from ${o.file} (${o.view} view)" note: the build fell back to static membership`);
  for (const [p, runs] of Object.entries(o.runs)) {
    const m = new RegExp(`^- ${p}: stations whose membership comes from simulated trips \\((\\d+) runs; (\\d+) of (\\d+) fitted stations;`, 'm').exec(text);
    if (!m) { problems.push(`${p}: the report has no "stations whose membership comes from simulated trips" note`); continue; }
    periods[p] = { runs: +m[1], stations: +m[2], of: +m[3] };
    if (+m[1] !== runs) problems.push(`${p}: the fit pooled ${m[1]} runs, expected ${runs}`);
    if (+m[2] < (o.minStations[p] ?? 1)) problems.push(`${p}: only ${m[2]} stations took simulated membership, expected at least ${o.minStations[p]}`);
  }
  for (const [p, b] of Object.entries(o.blocks ?? {})) {
    const m = new RegExp(`^- ${p}: select-link shares take simulated membership \\((\\d+) runs; (\\d+) of (\\d+) share constraints;`, 'm').exec(text);
    if (!m) { problems.push(`${p}: the report has no "select-link shares take simulated membership" note (the file has simulated trips on ${b.blocks} block(s))`); continue; }
    if (+m[1] !== b.runs) problems.push(`${p}: the share constraints pooled ${m[1]} runs, expected ${b.runs}`);
    if (b.blocks > 0 && +m[2] < 1) problems.push(`${p}: no share constraint took simulated membership although the file has simulated trips on ${b.blocks} block(s)`);
  }
  return { problems, periods };
}

export interface KindStat { stations: number; above: number; excess: number; removed: number }
export interface CeilingStat {
  stations: number; above: number; excess: number; /** Offered car veh/h of the period's static fit and of the final fit. */ staticTotal: number; finalTotal: number;
  /** Round 50 lines, absent in a round 49 report: the split of the ceiling stations into gates and non-gate nodes, the offered car veh/h by flow type (static, final) and the non-gate node trip ends (static, final). */
  gate?: KindStat; nonGate?: KindStat;
  byType?: { static: Record<string, number>; final: Record<string, number> };
  ends?: { originInside: [number, number]; originOutside: [number, number]; destInside: [number, number]; destOutside: [number, number] };
}

/** The gate prior ceiling lines of a fit report (round 49), per period; empty when the switch is off. */
/** Loop abort (round 49, D11', ASSUMPTION written before any run): after a build from pass 1 on, offered car demand above the static fit's by more than this share stops the loop. */
export const CEILING_ABORT_SHARE = 0.03;
/** Round 50 (D4, ASSUMPTION written before any run): after the final build, offered car demand more than this share below the static fit's is reported with a stop-and-report warning (every node is capped, so the fit can only cut). */
export const CEILING_LOW_SHARE = 0.10;
/** Final offered car demand as a share of the static fit's. */
export const offeredShare = (c: Pick<CeilingStat, 'staticTotal' | 'finalTotal'>): number => (c.staticTotal > 0 ? c.finalTotal / c.staticTotal : NaN);

export function gatePriorFromReport(text: string): Record<string, CeilingStat> {
  const out: Record<string, CeilingStat> = {};
  for (const m of text.matchAll(/^Gate prior ceilings (\S+): (\d+) stations; (\d+) above ceiling; excess (\d+) veh\/h; offered car (\d+) to (\d+) veh\/h/gm)) out[m[1]] = { stations: +m[2], above: +m[3], excess: +m[4], staticTotal: +m[5], finalTotal: +m[6] };
  const kind = (t: string): KindStat | undefined => { const m = /^(\d+) stations, (\d+) above ceiling, excess (\d+) veh\/h, removed by the projection (\d+) veh\/h$/.exec(t.trim()); return m ? { stations: +m[1], above: +m[2], excess: +m[3], removed: +m[4] } : undefined; };
  const types = (t: string) => Object.fromEntries([...t.matchAll(/(through|local|ramp) (\d+)/g)].map((x) => [x[1], +x[2]]));
  const pr = (t: string): [number, number] => { const x = /^(\d+) to (\d+)$/.exec(t); return x ? [+x[1], +x[2]] : [NaN, NaN]; };
  let cur: string | null = null;
  for (const line of text.split('\n')) {
    let m: RegExpExecArray | null;
    if ((m = /^Gate prior ceilings (\S+): /.exec(line))) cur = out[m[1]] ? m[1] : null;
    else if (cur && (m = /^Offered car veh\/h by flow type, static fit then final: (.*?); (.*?)\.$/.exec(line))) out[cur].byType = { static: types(m[1]), final: types(m[2]) };
    else if ((m = /^Ceiling stations by kind (\S+): gate (.*?); non-gate (.*?)\.$/.exec(line)) && out[m[1]]) { out[m[1]].gate = kind(m[2]); out[m[1]].nonGate = kind(m[3]); }
    else if ((m = /^Non-gate node trip ends (\S+) \(veh\/h, static fit to final\): origins inside the study area (\d+ to \d+), outside (\d+ to \d+); destinations inside (\d+ to \d+), outside (\d+ to \d+)\.$/.exec(line)) && out[m[1]]) out[m[1]].ends = { originInside: pr(m[2]), originOutside: pr(m[3]), destInside: pr(m[4]), destOutside: pr(m[5]) };
  }
  return out;
}

export interface ShareLine { period: string; label: string; membership: 'simulated' | 'static'; target: number; offered: number; staticOffered: number; final: number; staticFinal: number; flows: number }
export interface ThroughLine { period: string; label: string; membership: 'simulated' | 'static'; target: number; offered: number; staticOffered: number; final: number; staticFinal: number }

/** The "Share <period> <label>: ..." lines of a fit report (round 51): each select-link or ramp share's fit figure against its target, on simulated membership and on the static routes. Empty when no share took simulated membership. */
export function shareLinesFromReport(text: string): ShareLine[] {
  const pc = (t: string) => (t === 'n/a' ? NaN : +t.replace('%', ''));
  return [...text.matchAll(/^Share (\S+) (.+?): (simulated|static); target (\S+); offered (\S+) \((\S+)\); final (\S+) \((\S+)\); (\d+) flows\.$/gm)].map((m) => ({ period: m[1], label: m[2], membership: m[3] as ShareLine['membership'], target: pc(m[4]), offered: pc(m[5]), staticOffered: pc(m[6]), final: pc(m[7]), staticFinal: pc(m[8]), flows: +m[9] }));
}

/** The "Through target <period> <label>: ..." lines (round 51), in cars per hour. */
export function throughLinesFromReport(text: string): ThroughLine[] {
  return [...text.matchAll(/^Through target (\S+) (.+?): (simulated|static); target (\d+); offered (\d+) \(static routes (\d+)\); final (\d+) \(static routes (\d+)\)\.$/gm)].map((m) => ({ period: m[1], label: m[2], membership: m[3] as ThroughLine['membership'], target: +m[4], offered: +m[5], staticOffered: +m[6], final: +m[7], staticFinal: +m[8] }));
}

export interface RouteWeightLine { period: string; id: string; membership: 'simulated' | 'static'; base: number; blocks: number; weight: number; label: string }

/** The "Route weight <period> <id>: ..." lines of a fit report (round 52): the weight each whole-street route station had in the fit. Empty when the sub-switch is off. */
export function routeWeightLinesFromReport(text: string): RouteWeightLine[] {
  return [...text.matchAll(/^Route weight (\S+) (count route \S+): (simulated|static); base (\S+); blocks (\d+); weight (\S+); (.+)\.$/gm)].map((m) => ({ period: m[1], id: m[2], membership: m[3] as RouteWeightLine['membership'], base: +m[4], blocks: +m[5], weight: +m[6], label: m[7] }));
}

export interface EndAlongLine { period: string; label: string; membership: 'simulated' | 'static'; target: number; weight: number; offered: number; staticOffered: number; afterFit: number; staticAfterFit: number; final: number; staticFinal: number; flows: number; nodes: number[] }

/** Round 53 sub-switch: the count's "ended along the street" figures are fit targets. */
export const endAlongSwitch = (sm: { endAlong?: unknown } | undefined): boolean => sm?.endAlong === true;

/** The "End along <period> <label>: ..." lines of a fit report (round 53): each run's target against the fit's own figure on the membership used and on the static routes. Empty when the sub-switch is off. */
export function endAlongLinesFromReport(text: string): EndAlongLine[] {
  const n = '(-?[\\d.]+)';
  const re = new RegExp(`^End along (\\S+) (.+?): (simulated|static); target ${n}; weight ${n}; offered ${n} \\(static routes ${n}\\); after fit ${n} \\(static routes ${n}\\); final ${n} \\(static routes ${n}\\); (\\d+) flows; \\d+ nodes \\(([\\d ]*)\\)\\.$`, 'gm');
  return [...text.matchAll(re)].map((m) => ({ period: m[1], label: m[2], membership: m[3] as EndAlongLine['membership'], target: +m[4], weight: +m[5], offered: +m[6], staticOffered: +m[7], afterFit: +m[8], staticAfterFit: +m[9], final: +m[10], staticFinal: +m[11], flows: +m[12], nodes: m[13].split(' ').filter(Boolean).map(Number) }));
}

export interface EndSeedLine { period: string; label: string; target: number; before: number; added: number; capped: number; after: number; final: number; staticFinal: number; pairs: number; origins: number }

/** Round 53 D8 sub-switch `countFit.endAlong.seedPairs`. */
export const seedPairsSwitch = (ea: { seedPairs?: unknown } | undefined): boolean => ea?.seedPairs === true;

/** The "End along seed <period> <run>: ..." lines of a fit report (round 53, D8): what seeding added to the seed table before the fit. Empty when the switch is off. */
export function endSeedLinesFromReport(text: string): EndSeedLine[] {
  const n = '(-?[\\d.]+)';
  const re = new RegExp(`^End along seed (\\S+) (.+?): target ${n}; before ${n}; added ${n}; capped ${n}; after ${n}; final ${n} \\(static routes ${n}\\); (\\d+) pairs; (\\d+) origins\\.$`, 'gm');
  return [...text.matchAll(re)].map((m) => ({ period: m[1], label: m[2], target: +m[3], before: +m[4], added: +m[5], capped: +m[6], after: +m[7], final: +m[8], staticFinal: +m[9], pairs: +m[10], origins: +m[11] }));
}

export interface Step { id: string; iteration: number; view: string | null; kind: 'build' | 'check' | 'runs' | 'pool' | 'final'; title: string; cmd?: string }

/** The loop as an ordered list, for the dry run and for `--resume`: pass k builds both views, runs them, checks the report and pools; the last pass builds without runs. */
export function planLoop(o: { views: string[]; periods: string[]; seeds: number[]; iterations: number; jobs: number }): Step[] {
  const steps: Step[] = [];
  const seeds = `${o.seeds[0]}-${o.seeds[o.seeds.length - 1]}`;
  for (let k = 0; k < o.iterations; k++) {
    for (const v of o.views) {
      steps.push({ id: `i${k}-${v}-build`, iteration: k, view: v, kind: 'build', title: `build the ${v} demand${k === 0 ? ' with static membership' : ` with the pool of passes 0 to ${k - 1}`}`, cmd: `npx tsx tools/build-demand.ts${v === 'training' ? ' --view training' : ''}` });
      steps.push({ id: `i${k}-${v}-check`, iteration: k, view: v, kind: 'check', title: k === 0 ? 'check that the report says no membership file was used' : 'check the fit report for the simulated membership notes (fails if absent)' });
      steps.push({ id: `i${k}-${v}-runs`, iteration: k, view: v, kind: 'runs', title: `seeds ${seeds}, ${o.periods.join(' and ')}: one process per seed, each with its own --select-od file`, cmd: `target/release/calibrate --area AREA --period PERIOD --minutes 60 --scale 1 --seed N --demand <copy of the ${v} demand> --select-od <dir>/sod-PERIOD-N.json --no-write` });
    }
    steps.push({ id: `i${k}-pool`, iteration: k, view: null, kind: 'pool', title: `pool passes 0 to ${k} with equal weight into the membership files, list zero-hit stations, compare pass ${k} with pass ${Math.max(0, k - 1)}${k === 0 ? ' (nothing to compare)' : ' (stop rule)'}` });
  }
  for (const v of o.views) {
    steps.push({ id: `final-${v}-build`, iteration: o.iterations, view: v, kind: 'final', title: `final ${v} build with the last pool (earlier if the stop rule fired)`, cmd: `npx tsx tools/build-demand.ts${v === 'training' ? ' --view training' : ''}` });
    steps.push({ id: `final-${v}-check`, iteration: o.iterations, view: v, kind: 'check', title: 'check the fit report, record the demand hashes' });
  }
  return steps;
}
