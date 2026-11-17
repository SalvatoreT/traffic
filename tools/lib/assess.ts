// Reading calibrate reports of many seeds and scoring them: stability, headline shares, station GEH on the simulator's own link flows, noise file.
// Used by tools/assess.ts (final assessment) and tools/cost-loop.ts (feedback loop). No simulator code here.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { geh, GEH_GOOD, evaluateCases, seedStat, summarizeCases, linkSpread, encodeUint16, type AcceptanceSummary, type CaseResult } from './acceptance';
import { seedFileName, type RunManifest } from './run-manifest';
import type { DetectorEnd } from './demand-fit';
import { backlogGrowth, type Stability, type ZoneSplit } from './verdict';

export interface SeedRun {
  seed: number; minutes: number; period: string; area?: string; scale?: number;
  manifest?: RunManifest | null;
  series?: { tMin: number; backlog: number }[];
  health: { gridlockRemoved: number; backlogPct: number; completed: number; arterialMeanSpeed: number; spawned: number };
  shares: { block: string; side: string; via: string; observed: number; observedPm: number | null; modelled: number | null; headline: boolean }[];
  rampShares: { direction: string; via: string; observed: number; modelledSide: number | null }[];
  linkFlowVehPerHour: number[] | null;
  linkStartVehPerHour?: number[] | null;
  linkStopLineVehPerHour?: number[] | null;
  linkMeanDelayS: number[] | null;
  features?: { id: string; label: string; kind: string; trips: number; vehPerHour: number }[];
  observedSignals?: { node: number; applies?: boolean; streets: string; cycleS: number; greenS: number[]; observedCycleS: number; approaches: { links: number[]; observedGreenS: number; modeledGreenS: number | null; exitsPerHour: number }[] }[];
  throughCheck?: { block: string; observedWholeStreet?: number | null; modeledWholeStreet?: number; modeledThrough: number; fitted?: boolean }[];
  patternBypass?: { bypass: string; arterial: string; dir: string; corridorTrips: number; viaBypass: number }[];
  patternFreewayThrough?: { trips: string; localMiles: number; shareOfLocalMiles: number }[];
  junctionRecovery?: { policy: string; crossings: number; courtesy: { admissions: number }; yieldFallback: { admissions: number }; conflictBypass: { admissions: number }; heldRemovals: number };
  gridlockZone?: GridlockZone | null;
}

/** One sentence on the junction recovery rules of the runs (change expose-junction-fallback-validity): policy, admissions per hour by reason and held-vehicle removals. */
export function recoverySentence(runs: SeedRun[]): string {
  const jr = runs.map((r) => ({ r: r.junctionRecovery, h: 60 / (r.minutes || 60) })).filter((x) => x.r);
  if (!jr.length) return 'The runs carry no junction recovery figures.';
  const mean = (g: (x: NonNullable<SeedRun['junctionRecovery']>) => number) => jr.reduce((a, x) => a + g(x.r!) * x.h, 0) / jr.length;
  const policies = [...new Set(jr.map((x) => x.r!.policy))].join(', ');
  const entries = mean((x) => x.crossings);
  return `Junction recovery policy ${policies}: admissions the ordinary rule would have refused, per hour, courtesy ${mean((x) => x.courtesy.admissions).toFixed(1)}, yield fallback ${mean((x) => x.yieldFallback.admissions).toFixed(1)}, conflict bypass ${mean((x) => x.conflictBypass.admissions).toFixed(1)}, out of ${Math.round(entries)} node entries; vehicles removed while held in a node ${mean((x) => x.heldRemovals).toFixed(2)} per hour (part of the removals).`;
}

export interface StationFile {
  stations: { id: string; kind: string; label: string; corridor: string; held: boolean; derived?: string[]; source?: string | null; year?: number | null; links: number[]; detectors?: DetectorEnd[]; target: Record<string, number>; feature?: { kind: string } }[];
  /** Interior links that start at a surface arterial, with the vehicles the volunteer count recorded entering there (per period id). */
  entries?: { side: string; label: string; link: number; counted: Record<string, number | null> }[];
}

export const seedFile = (dir: string, area: string, period: string, scale: number, seed: number) => join(dir, `${area}-${period}-s${scale}-seed${seed}.json`);

/** Reads the reports that exist, relabeling each with the seed of its file name and skipping missing ones. For the cost loop's own scratch iterations only: an assessment uses `readRuns`, which checks what it reads. */
export function readSeeds(dir: string, area: string, period: string, seeds: number[], scale = 1): SeedRun[] {
  const out: SeedRun[] = [];
  for (const s of seeds) {
    const p = seedFile(dir, area, period, scale, s);
    if (existsSync(p)) out.push({ ...JSON.parse(readFileSync(p, 'utf8')), seed: s });
  }
  return out;
}

export interface FoundRun { seed: number; file: string; reportSeed?: number; manifest?: RunManifest | null; error?: string; run?: SeedRun }

/** Every requested seed's report as it is on disk: nothing is skipped or relabeled, so that missing, unreadable and mislabeled reports can be named. */
export function readRuns(dir: string, area: string, period: string, seeds: number[], scale = 1, minutes?: number): FoundRun[] {
  const out: FoundRun[] = [];
  for (const s of [...new Set(seeds)]) {
    const file = seedFileName(area, period, scale, s);
    const p = join(dir, file);
    if (!existsSync(p)) continue;
    try {
      const run = JSON.parse(readFileSync(p, 'utf8')) as SeedRun;
      const setup = run?.manifest?.run;
      if (run?.manifest && (run.manifest.schema !== 1 || !setup || !run.manifest.inputs || !run.manifest.simulator?.fingerprint)) {
        out.push({ seed: s, file, error: 'incomplete or unsupported run manifest' });
      } else if (setup && (run.area !== area || setup.area !== area || run.period !== period || setup.period !== period || run.scale !== scale || setup.scale !== scale ||
          run.minutes !== setup.minutes || (minutes !== undefined && run.minutes !== minutes) || setup.measurementWindow?.toMin !== run.minutes ||
          setup.measurementWindow.fromMin !== (run.minutes >= 30 ? setup.warmupMin : 0) || !(setup.measurementWindow.fromMin >= 0 && setup.measurementWindow.fromMin < run.minutes))) {
        out.push({ seed: s, file, error: `run settings do not match requested area, period, scale, duration or measurement window` });
      } else if (!run?.health || ![run.health.gridlockRemoved, run.health.backlogPct, run.health.completed, run.health.arterialMeanSpeed, run.health.spawned].every((value) => Number.isFinite(value) && value >= 0) ||
          !Array.isArray(run.shares) || !Array.isArray(run.rampShares) || !Number.isFinite(backlogGrowth(run))) {
        out.push({ seed: s, file, error: `seed ${s} has incomplete health, backlog series or route-share evidence` });
      } else {
        out.push({ seed: s, file, reportSeed: run.seed, manifest: run.manifest ?? null, run });
      }
    } catch (e) { out.push({ seed: s, file, error: `cannot read ${file}: ${(e as Error).message}` }); }
  }
  return out;
}

export interface ShareStat { block: string; side: string; via: string; observed: number; mean: number; lo: number; hi: number; sd: number; errPoints: number; within10: boolean; headline: boolean }

/** Seed mean and 95% interval of every route share; observed is the PM value where the file has one and the period is the PM peak. */
export function shareStats(runs: SeedRun[], usePm: boolean): ShareStat[] {
  if (!runs.length) return [];
  return runs[0].shares.map((q) => {
    const vals = runs.map((r) => {
      const rows = r.shares.filter((s) => s.block === q.block && s.side === q.side && s.via === q.via);
      return rows.length === 1 ? rows[0].modelled ?? NaN : NaN;
    });
    const st = seedStat(vals.every(Number.isFinite) ? vals : []);
    const obs = usePm && q.observedPm != null ? q.observedPm : q.observed;
    const err = (st.mean - obs) * 100;
    return { block: q.block, side: q.side, via: q.via, observed: obs, mean: st.mean, lo: st.lo, hi: st.hi, sd: st.sd, errPoints: err, within10: Math.abs(err) <= 10, headline: q.headline };
  });
}

/** The PM gate requires every observed freeway share in the target inventory in every seed. */
export function headlineSharesPass(runs: SeedRun[], targets: { street: string; direction: string; from?: { via: string; share: number; pmPeakShare?: number }[]; to?: { via: string; share: number; pmPeakShare?: number }[] }[], tolerancePoints: number): boolean {
  const comparisons = targets.flatMap((t) => (['from', 'to'] as const).flatMap((side) => (t[side] ?? []).filter((q) => q.via.toLowerCase() === 'freeway').map((q) => {
    const observed = q.pmPeakShare ?? q.share;
    const values = runs.map((run) => {
      const rows = run.shares.filter((s) => s.block === `${t.street} ${t.direction}` && s.side === side && s.via === q.via && s.headline);
      const value = rows[0]?.modelled;
      return rows.length === 1 && (rows[0].observedPm ?? rows[0].observed) === observed && typeof value === 'number' && value >= 0 && value <= 1 ? value : NaN;
    });
    return Math.abs(completeMean(values) - observed) * 100 <= tolerancePoints;
  })));
  return comparisons.length > 0 && comparisons.every(Boolean);
}

export interface RampStat { direction: string; via: string; observed: number; mean: number; lo: number; hi: number; errPoints: number }
export function rampStats(runs: SeedRun[]): RampStat[] {
  if (!runs.length) return [];
  return runs[0].rampShares.map((q) => {
    const values = runs.map((r) => {
      const rows = r.rampShares.filter((s) => s.direction === q.direction && s.via === q.via);
      return rows.length === 1 ? rows[0].modelledSide ?? NaN : NaN;
    });
    const st = seedStat(values.every(Number.isFinite) ? values : []);
    return { direction: q.direction, via: q.via, observed: q.observed, mean: st.mean, lo: st.lo, hi: st.hi, errPoints: (st.mean - q.observed) * 100 };
  });
}

/** Mean absolute error of the headline shares, in points, on the seed means. */
export const headlineError = (ss: ShareStat[]): number => { const h = ss.filter((q) => q.headline); return h.length ? h.reduce((a, q) => a + Math.abs(q.errPoints), 0) / h.length : NaN; };

export interface StationScore { period: string; fitted: AcceptanceSummary; held: AcceptanceSummary; interior: { fitted: AcceptanceSummary; held: AcceptanceSummary }; other: { fitted: AcceptanceSummary; held: AcceptanceSummary }; cases: (CaseResult & { corridor: string; label: string; kind: string; stationId: string; source?: string; year: number | null; derived: boolean })[]; skippedWithoutLinks: number; /** Of those, gate stations and movement or route stations (select-link counts). */ skippedGates: number; skippedFeatures: number }

type Screenline = Pick<StationFile['stations'][number], 'links' | 'detectors' | 'kind'>;

function stationFlow(run: SeedRun, station: Screenline): number {
  const { links, detectors } = station;
  if ((detectors && detectors.length !== links.length) || (!detectors && ['ramp', 'tmc'].includes(station.kind))) return NaN;
  return links.reduce((sum, link, i) => {
    const end = detectors?.[i];
    const counts = end === 'start' ? run.linkStartVehPerHour : end === 'stop' ? run.linkStopLineVehPerHour : end === undefined ? run.linkFlowVehPerHour : null;
    const count = counts?.[link];
    return sum + (typeof count === 'number' && Number.isFinite(count) && count >= 0 ? count : NaN);
  }, 0);
}

function completeMean(values: number[]): number {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : NaN;
}

export function stationEvidenceProblems(run: SeedRun, file: StationFile, period: string): string[] {
  const missing: string[] = [];
  const features = new Map<string, number>();
  const repeated = new Set<string>();
  for (const f of run.features ?? []) {
    if (features.has(f.id)) repeated.add(f.id);
    features.set(f.id, f.vehPerHour);
  }
  for (const st of file.stations) {
    if (!(st.target[period] > 0)) continue;
    if (st.links.length && !Number.isFinite(stationFlow(run, st))) missing.push(st.id);
    if (st.feature && (repeated.has(st.id) || !Number.isFinite(features.get(st.id)) || features.get(st.id)! < 0)) missing.push(st.id);
  }
  return missing;
}

/** GEH and size bands of the simulator's link flows (mean over the seeds) against the count targets of link-based stations; gate stations have no link and are skipped. */
export function scoreStations(runs: SeedRun[], file: StationFile, period: string): StationScore {
  const cases: StationScore['cases'] = [];
  let skipped = 0, gates = 0, features = 0;
  for (const st of file.stations) {
    const target = st.target[period];
    if (!(target > 0)) continue;
    if (!st.links.length) { skipped++; if (st.feature) features++; else gates++; continue; }
    const modeled = completeMean(runs.map((r) => stationFlow(r, st)));
    const [c] = evaluateCases([{ id: st.id, modeled, counted: target, held: st.held }]);
    cases.push({ ...c, corridor: st.corridor, label: st.label, kind: st.kind, stationId: st.id, source: st.source ?? undefined, year: st.year ?? null, derived: !!st.derived?.includes(period) });
  }
  const part = (sel: (c: (typeof cases)[number]) => boolean) => ({ fitted: summarizeCases(cases.filter((c) => sel(c) && !c.held)), held: summarizeCases(cases.filter((c) => sel(c) && c.held)) });
  return { period, fitted: summarizeCases(cases.filter((c) => !c.held)), held: summarizeCases(cases.filter((c) => c.held)), interior: part((c) => c.kind === 'count'), other: part((c) => c.kind !== 'count'), cases, skippedWithoutLinks: skipped, skippedGates: gates, skippedFeatures: features };
}

/** Fitted off-ramp screenlines used to choose a cost-loop iteration. All legs, including slip lanes, use their station detectors. */
export function fittedRampCountError(cases: StationScore['cases']): number {
  const fitted = cases.filter((q) => !q.held && q.kind === 'tmc' && /ramp \([NSEW] leg\) entering/.test(q.label));
  return completeMean(fitted.map((q) => Math.abs(q.modeled - q.counted)));
}

/** Corridor ratio: simulated flow over counted flow, summed over the link-based stations of a corridor, mean over seeds with its 95% interval across seeds. */
export function corridorRatios(runs: SeedRun[], file: StationFile, period: string): { corridor: string; stations: number; ratio: number; lo: number; hi: number }[] {
  const by = new Map<string, StationFile['stations']>();
  for (const st of file.stations) if (st.links.length && st.target[period] > 0) (by.get(st.corridor) ?? by.set(st.corridor, []).get(st.corridor)!).push(st);
  return [...by].map(([corridor, sts]) => {
    const tgt = sts.reduce((a, s) => a + s.target[period], 0);
    const per = runs.map((r) => sts.reduce((sum, s) => sum + stationFlow(r, s), 0) / tgt);
    const st = seedStat(per.every(Number.isFinite) ? per : []);
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
export function meanLinkFlow(runs: SeedRun[], links: number[], end?: DetectorEnd): number {
  const station = { links, detectors: end ? links.map(() => end) : undefined, kind: 'count' };
  return completeMean(runs.map((r) => stationFlow(r, station)));
}
export function featureStats(runs: SeedRun[], id: string) {
  const v = runs.map((r) => r.features?.find((x) => x.id === id)?.vehPerHour ?? NaN);
  return seedStat(v.every(Number.isFinite) ? v : []);
}

export interface TravelTimeSpec { id: string; street: string; from: string; to: string; lengthMi: number; observedMph: Record<string, Record<string, number>> }
export interface TravelNet { nodes: { id: number }[]; links: { id: number; from: number; to: number; name: string; length: number; speedLimit: number }[] }
export interface TravelTimeRow { id: string; lengthM: number; links: number; freeS: number; modeledS: number; lo: number; hi: number; modeledMph: number; observedMph: number[]; observedS: [number, number]; within: boolean }

/** Links of `street` from its junction with `from` to its junction with `to` (shortest by length), or null. */
export function streetPath(net: TravelNet, street: string, from: string, to: string): number[] | null {
  const touch = new Map<string, Set<number>>();
  for (const l of net.links) for (const n of [l.from, l.to]) (touch.get(l.name) ?? touch.set(l.name, new Set()).get(l.name)!).add(n);
  const on = touch.get(street), A = touch.get(from), B = touch.get(to);
  if (!on || !A || !B) return null;
  const out = new Map<number, number[]>();
  net.links.forEach((l, i) => { if (l.name === street) (out.get(l.from) ?? out.set(l.from, []).get(l.from)!).push(i); });
  const dist = new Map<number, number>(), prev = new Map<number, number>();
  const open = [...A].filter((n) => on.has(n));
  for (const n of open) dist.set(n, 0);
  while (open.length) {
    open.sort((x, y) => dist.get(y)! - dist.get(x)!);
    const n = open.pop()!;
    for (const i of out.get(n) ?? []) {
      const l = net.links[i], d = dist.get(n)! + l.length;
      if (d < (dist.get(l.to) ?? Infinity)) { dist.set(l.to, d); prev.set(l.to, i); open.push(l.to); }
    }
  }
  const ends = [...B].filter((n) => dist.has(n) && prev.has(n)).sort((x, y) => dist.get(x)! - dist.get(y)!);
  if (!ends.length) return null;
  const path: number[] = [];
  for (let n = ends[0]; prev.has(n); n = net.links[prev.get(n)!].from) path.unshift(prev.get(n)!);
  return path;
}

/** Simulated time over each observed segment: free-flow time plus the mean delay per vehicle of its links, per seed, against the observed speeds of the period. */
export function travelTimes(runs: SeedRun[], net: TravelNet, specs: TravelTimeSpec[], period: string): TravelTimeRow[] {
  const rows: TravelTimeRow[] = [];
  for (const q of specs) {
    const obs = Object.values(q.observedMph[period] ?? {});
    const path = streetPath(net, q.street, q.from, q.to);
    if (!path || !obs.length) continue;
    const lengthM = path.reduce((a, i) => a + net.links[i].length, 0), freeS = path.reduce((a, i) => a + net.links[i].length / net.links[i].speedLimit, 0);
    const st = seedStat(runs.filter((r) => r.linkMeanDelayS).map((r) => freeS + path.reduce((a, i) => a + r.linkMeanDelayS![i], 0)));
    const sOf = (mph: number) => (q.lengthMi * 1609.344) / (mph / 2.23694);
    const range: [number, number] = [sOf(Math.max(...obs)), sOf(Math.min(...obs))];
    // The modeled speed uses the published segment length, so a small difference in where the network places the cross streets does not count.
    const modeledS = st.mean * ((q.lengthMi * 1609.344) / lengthM);
    rows.push({ id: q.id, lengthM, links: path.length, freeS, modeledS, lo: st.lo * ((q.lengthMi * 1609.344) / lengthM), hi: st.hi * ((q.lengthMi * 1609.344) / lengthM), modeledMph: ((q.lengthMi * 1609.344) / modeledS) * 2.23694, observedMph: obs, observedS: range, within: modeledS >= range[0] && modeledS <= range[1] });
  }
  return rows;
}

export interface WholeStreetTarget { street: string; direction: string; wholeStreetVehPerHour?: Record<string, number> }

/** Compare each directional count to complete traversals of its ordered links, one reading from every seed. */
export function throughStats(runs: SeedRun[], targets: WholeStreetTarget[], period: string) {
  return targets.flatMap((target) => {
    const observed = target.wholeStreetVehPerHour?.[period];
    if (observed == null) return [];
    const block = `${target.street} ${target.direction}`;
    const matched = runs.map((run) => (run.throughCheck ?? []).filter((row) => row.block === block));
    const fittedValues = matched.map((rows) => rows.length === 1 ? rows[0].fitted : undefined);
    const fitted = fittedValues.length && fittedValues.every((x) => x === fittedValues[0]) ? fittedValues[0] : undefined;
    const values = matched.map((rows) => {
      const value = rows[0]?.modeledWholeStreet;
      return rows.length === 1 && rows[0].observedWholeStreet === observed && typeof value === 'number' && value >= 0 && Number.isFinite(value) ? value : NaN;
    });
    const stats = seedStat(values.every(Number.isFinite) ? values : []);
    const error = geh(stats.mean, observed);
    return [{ block, observed, fitted, mean: stats.mean, se: stats.n > 1 ? stats.sd / Math.sqrt(stats.n) : NaN, geh: error, inside: error < GEH_GOOD }];
  });
}

/** calibrate's per-seed `gridlockZone` (change calibration-round-37). */
export interface GridlockZone extends ZoneSplit {
  farSites: { node: number; streets: string; distM: number; cleared: number; linked: number }[];
  backlog: { zoneTrips: number; allTrips: number };
  boundingStreets: { street: string; links: number; maxQueueM: number; link: number | null; linkLengthM: number | null; tMin: number; fullShare: number }[];
}

/** Far clearings summed over the runs by node, most first. */
export function farSites(runs: SeedRun[]): { node: number; streets: string; distM: number; cleared: number; linked: number }[] {
  const by = new Map<number, { node: number; streets: string; distM: number; cleared: number; linked: number }>();
  for (const r of runs) for (const q of r.gridlockZone?.farSites ?? []) {
    const e = by.get(q.node) ?? by.set(q.node, { ...q, cleared: 0, linked: 0 }).get(q.node)!;
    e.cleared += q.cleared; e.linked += q.linked;
  }
  return [...by.values()].sort((a, b) => b.cleared - a.cleared || a.node - b.node);
}

/** Markdown on where the cars cleared from gridlock were held, the judged zone's backlog and the queues on its bounding streets. */
export function zoneLines(runs: SeedRun[], stab: Stability, limit: number): string[] {
  const f = (x: number, d = 2) => (Number.isFinite(x) ? x.toFixed(d) : '-');
  if (!stab.zoneScoped) return [`Cars cleared from gridlock are not split by place for these runs (no judged zone in the area config, or reports from before round 37), so every one counts: ${f(stab.allPerHourMean)} per hour.`, ''];
  const n = runs.length;
  const out = [`Cars cleared from gridlock per hour, seed means: ${f(stab.allPerHourMean)} in all; ${f(stab.nearPerHourMean)} near the study area (the judged zone: the study area, its bounding streets and the junctions on them, and ${stab.bufferM} m beyond along the network); ${f(stab.farPerHourMean)} farther out, of which ${f(stab.farLinkedPerHourMean)} were held in a chain of blocked vehicles that reached the zone and count against the rule. The rule judges ${f(stab.removalsPerHourMean)} per hour (limit ${limit}). With half and double the buffer: ${stab.sensitivity.filter((q) => q.factor !== 1).map((q) => `${q.bufferM} m ${f(q.perHourMean)} (${q.ok ? 'holds' : 'fails'})`).join(', ')}.`, ''];
  const sites = farSites(runs);
  if (sites.length) {
    out.push(`Far clearings by place, total over the ${n} seeds (a known weakness at the model's edges, where it has few counts):`, '', '| Node | Streets | Distance from the study area (m) | Cleared | Chain reached the zone |', '| --- | --- | --- | --- | --- |');
    for (const q of sites.slice(0, 10)) out.push(`| ${q.node} | ${q.streets} | ${q.distM} | ${q.cleared} | ${q.linked} |`);
    if (sites.length > 10) out.push(`| other ${sites.length - 10} places | | | ${sites.slice(10).reduce((a, q) => a + q.cleared, 0)} | ${sites.slice(10).reduce((a, q) => a + q.linked, 0)} |`);
    out.push('');
  }
  const zb = runs.map((r) => r.gridlockZone!.backlog);
  out.push(`Entry backlog at the end of the run at origins in the judged zone: ${f(zb.reduce((a, b) => a + b.zoneTrips, 0) / n, 1)} trips on average, of ${f(zb.reduce((a, b) => a + b.allTrips, 0) / n, 1)} waiting in all.`, '');
  const bs = runs[0].gridlockZone!.boundingStreets;
  if (bs.length) {
    out.push('Longest standing queue on one link of each bounding street (cars standing per lane times 6.5 m), seed mean and largest, and the share of 5 s samples with one of its links full:', '', '| Bounding street | Links | Mean of the longest queue (m) | Largest (m) | On link (length m) | Samples with a full link |', '| --- | --- | --- | --- | --- | --- |');
    bs.forEach((b, i) => {
      const rows = runs.map((r) => r.gridlockZone!.boundingStreets[i]);
      const top = rows.reduce((a, q) => (q.maxQueueM > a.maxQueueM ? q : a), rows[0]);
      out.push(`| ${b.street} | ${b.links} | ${f(rows.reduce((a, q) => a + q.maxQueueM, 0) / n, 0)} | ${top.maxQueueM} | ${top.link ?? '-'} (${top.linkLengthM ?? '-'}) | ${f((100 * rows.reduce((a, q) => a + q.fullShare, 0)) / n, 1)}% |`);
    });
    out.push('');
  }
  return out;
}
