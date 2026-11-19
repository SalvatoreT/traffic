// Fitting demand on the simulator's own route choice for every station the report binary exports (calibration round 48). No I/O.
// Station choice is a rule on the stations file and the frozen split, never on a score. The loop's iteration runs are pooled with equal weight, the method of
// successive averages with step 1/n [PowellSheffi1982]. Applying that step rule to this fixed point (demand, routes, membership, demand) is an ASSUMPTION: the
// reference concerns equilibrium assignment, and its paper was not opened.
import type { ThroughMeasured } from './demand-fit';
import { checkSelectOdSeed, membershipEvidence, pooledStations, sameMembershipEvidence, type MembershipEvidence, type SelectOd } from './through-membership';

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

export interface Pooled { measured: ThroughMeasured; zeroHit: string[]; absent: string[]; dropped: string[] }

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
    periods: Object.fromEntries(Object.entries(i.periods).map(([p, v]) => [p, { runs: 0, source: '', hits: {}, trips: {}, stations: { ...v.measured, zeroHit: v.zeroHit } }])),
  };
}

/** The training view's file must name no withheld station, in hits or in zero-hit lists. */
export function assertNoWithheld(file: { periods: Record<string, { stations?: ThroughMeasured & { zeroHit?: string[] } }> }, withheld: Set<string>): void {
  const bad: string[] = [];
  for (const [p, v] of Object.entries(file.periods)) for (const id of [...Object.keys(v.stations?.hits ?? {}), ...(v.stations?.zeroHit ?? [])]) if (withheld.has(id)) bad.push(`${p}: ${id}`);
  if (bad.length) throw new Error(`the training membership file names withheld stations: ${bad.slice(0, 5).join('; ')}`);
}

export interface ReportCheck { problems: string[]; periods: Record<string, { runs: number; stations: number; of: number }> }

/**
 * Reads the fit report of a build. With a membership file expected, the report must carry the `Simulated membership from` note and, for each period of the file,
 * the note with its run count and station count; a silent fall back to static membership is the failure this guards against. With none expected (the first
 * pass), the report must say that there was no file.
 */
export function checkFitReport(text: string, o: { view: string; file: string | null; runs: Record<string, number>; minStations: Record<string, number> }): ReportCheck {
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
  return { problems, periods };
}

export interface CeilingStat { stations: number; above: number; excess: number; /** Offered car veh/h of the period's static fit and of the final fit. */ staticTotal: number; finalTotal: number }

/** The gate prior ceiling lines of a fit report (round 49), per period; empty when the switch is off. */
/** Loop abort (round 49, D11', ASSUMPTION written before any run): after a build from pass 1 on, offered car demand above the static fit's by more than this share stops the loop. */
export const CEILING_ABORT_SHARE = 0.03;

export function gatePriorFromReport(text: string): Record<string, CeilingStat> {
  const out: Record<string, CeilingStat> = {};
  for (const m of text.matchAll(/^Gate prior ceilings (\S+): (\d+) stations; (\d+) above ceiling; excess (\d+) veh\/h; offered car (\d+) to (\d+) veh\/h/gm)) out[m[1]] = { stations: +m[2], above: +m[3], excess: +m[4], staticTotal: +m[5], finalTotal: +m[6] };
  return out;
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
