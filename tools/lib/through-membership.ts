// Pooling of simulated select-link trips into per-pair through counts (calibration round 39). No I/O.
import type { ThroughMeasured } from './demand-fit';
import type { RunManifest } from './run-manifest';

/** `calibrate --select-od` output: per counted street run, the trips (origin, destination, count) that used any of its links in one seed run. */
export interface SelectOd { stationCountVersion?: number; manifest?: RunManifest; period: string; seed: number; minutes: number; blocks: { label: string; links: number[]; trips: [number, number, number][] }[]; features?: { id: string; trips: [number, number, number][] }[]; /** Version 2 link stations count crossings at their configured detector. */ links?: { id: string; trips: [number, number, number][] }[] }

export interface MembershipEvidence {
  view: string; network: string; split: string; config: string; countFile: string; stations: string; targets: string; simulator: string; stationCountVersion: number;
}

const EVIDENCE_FIELDS: (keyof MembershipEvidence)[] = ['view', 'network', 'split', 'config', 'countFile', 'stations', 'targets', 'simulator', 'stationCountVersion'];

/** The evidence fields that differ or are missing; all of them when the file has no evidence. */
export function membershipEvidenceMismatches(a: MembershipEvidence | undefined, b: MembershipEvidence): (keyof MembershipEvidence)[] {
  return EVIDENCE_FIELDS.filter((field) => !a || !b[field] || a[field] !== b[field]);
}

/** Message for a build that finds a membership file whose evidence does not match; a silent fallback to static membership would change the published demand unnoticed. */
export function staleMembershipMessage(file: string, extra: string[], fields: (keyof MembershipEvidence)[], a: MembershipEvidence | undefined, b: MembershipEvidence): string {
  const short = (v: unknown) => (typeof v === 'string' && v.length > 16 ? v.slice(0, 16) : String(v ?? 'missing'));
  const parts = [...extra, ...fields.map((f) => `${f} (file ${short(a?.[f])}, build ${short(b[f])})`)];
  return `${file} holds membership evidence that does not match this build: ${parts.join('; ')}. Rerun the membership loop (npx tsx tools/membership-loop.ts) on the current inputs, or move the file away to build on static membership.`;
}

/** One pool is for one network, source observation set, split and demand view. */
export function sameMembershipEvidence(a: MembershipEvidence | undefined, b: MembershipEvidence): boolean {
  return !!a && membershipEvidenceMismatches(a, b).length === 0;
}

export function membershipEvidence(run: SelectOd, demandHash: string): MembershipEvidence {
  const m = run.manifest, b = m?.inputs.demandBuild;
  if (run.stationCountVersion !== 2 || !m?.simulator?.fingerprint || !b || !b.countFile || (b.view !== 'training' && b.view !== 'shipped') || !b.network || !b.split || !b.config ||
      !m.inputs.targets.sha256 || !m.inputs.stations.sha256 || m.inputs.network.sha256 !== b.network || m.inputs.demand.sha256 !== demandHash ||
      m.inputs.split.sha256 !== b.split || m.inputs.demandConfig.sha256 !== b.config ||
      m.run.period !== run.period || m.run.seed !== run.seed || m.run.minutes !== run.minutes || m.run.scale !== 1) {
    throw new Error('select-OD run does not match the supplied demand and its source, split and network evidence');
  }
  return { view: b.view, network: b.network, split: b.split, config: b.config, countFile: b.countFile, stations: m.inputs.stations.sha256, targets: m.inputs.targets.sha256, simulator: m.simulator.fingerprint, stationCountVersion: run.stationCountVersion };
}

/** Each demand may contribute a given seed once, under its canonical filename. */
export function checkSelectOdSeed(run: SelectOd, demandHash: string, requestedPeriod: string, file: string, seen: Set<string>): void {
  const key = `${demandHash}:${run.seed}`;
  if (!Number.isSafeInteger(run.seed) || run.seed < 0 || run.seed !== run.manifest?.run.seed || run.period !== requestedPeriod ||
      file !== `sod-${requestedPeriod}-${run.seed}.json` || seen.has(key)) throw new Error(`duplicate or mismatched select-OD seed in ${file}`);
  seen.add(key);
}

/** Counted unique through trips using any corridor block, with neither trip end inside the study area. */
export function corridorThroughCounts(t: { observedCorridorThroughVehPerHour?: Record<string, number> }, periods: string[]): Record<string, number> {
  const target: Record<string, number> = {};
  for (const period of periods) {
    const value = t.observedCorridorThroughVehPerHour?.[period];
    if (value !== undefined && (!Number.isFinite(value) || value < 0)) throw new Error(`invalid observed corridor through volume for ${period}`);
    // Multiplicative OD fitting can use positive count targets only.
    if (value !== undefined && value > 0) target[period] = value;
  }
  return target;
}

export const throughTargetId = (label: string) => `through ${label}`;

/**
 * Pools seed runs (each set: the runs of one demand). Only trips with neither end in the study area count. `trips` sums, over every run, the veh/h each pair
 * with a counted trip offers in that run's demand, so hits / trips is the pair's share of trips on the street run. Counts are per hour of run.
 */
export function pooledMembership(sets: { label: string; flows: { origin: number; destination: number; vehPerHour: number }[]; sod: SelectOd[] }[], inStudy: Set<number>): ThroughMeasured {
  const hits: Record<string, Record<string, number>> = {};
  const pairs = new Set<string>();
  let runs = 0;
  const perSet: { vph: Map<string, number>; n: number }[] = [];
  for (const s of sets) {
    const vph = new Map<string, number>();
    for (const f of s.flows) { const q = `${f.origin}>${f.destination}`; vph.set(q, (vph.get(q) ?? 0) + f.vehPerHour); }
    for (const r of s.sod) {
      const perH = 60 / r.minutes;
      for (const b of r.blocks) {
        const h = (hits[throughTargetId(b.label)] ??= {});
        for (const [o, d, n] of b.trips) {
          if (inStudy.has(o) || inStudy.has(d)) continue;
          const q = `${o}>${d}`;
          h[q] = (h[q] ?? 0) + n * perH;
          pairs.add(q);
        }
      }
    }
    runs += s.sod.length;
    perSet.push({ vph, n: s.sod.length });
  }
  const trips: Record<string, number> = {};
  for (const q of [...pairs].sort()) trips[q] = Math.round(perSet.reduce((a, p) => a + p.n * (p.vph.get(q) ?? 0), 0) * 100) / 100;
  for (const h of Object.values(hits)) for (const q of Object.keys(h)) h[q] = Math.round(h[q] * 100) / 100;
  return { runs, source: sets.map((s) => s.label).join('; '), hits, trips };
}

/** Movement and route stations (round 41) and link stations (round 42): every trip that made the movement or used the links counts, through or not. Same pooling as `pooledMembership`; sets without station pairs are skipped. */
export function pooledStations(sets: { label: string; flows: { origin: number; destination: number; vehPerHour: number }[]; sod: SelectOd[] }[]): ThroughMeasured {
  const hits: Record<string, Record<string, number>> = {};
  const pairs = new Set<string>();
  let runs = 0;
  const perSet: { vph: Map<string, number>; n: number }[] = [];
  const used: string[] = [];
  for (const s of sets) {
    const sod = s.sod.filter((r) => r.features);
    if (!sod.length) continue;
    used.push(s.label);
    const vph = new Map<string, number>();
    for (const f of s.flows) { const q = `${f.origin}>${f.destination}`; vph.set(q, (vph.get(q) ?? 0) + f.vehPerHour); }
    for (const r of sod) for (const ft of [...r.features!, ...(r.links ?? [])]) {
      const h = (hits[ft.id] ??= {});
      for (const [o, d, n] of ft.trips) { const q = `${o}>${d}`; h[q] = (h[q] ?? 0) + (n * 60) / r.minutes; pairs.add(q); }
    }
    runs += sod.length;
    perSet.push({ vph, n: sod.length });
  }
  const trips: Record<string, number> = {};
  for (const q of [...pairs].sort()) trips[q] = Math.round(perSet.reduce((a, p) => a + p.n * (p.vph.get(q) ?? 0), 0) * 100) / 100;
  for (const h of Object.values(hits)) for (const q of Object.keys(h)) h[q] = Math.round(h[q] * 100) / 100;
  return { runs, source: used.join('; '), hits, trips };
}
