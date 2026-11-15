// Run manifests and the compatibility rules of an assessment (change protect-calibration-evidence, D3). A run report written by the calibrate binary carries a
// `manifest`: simulator fingerprint, input file hashes, period, scale, seed, duration, warm-up, initialization and settings. An authoritative assessment needs
// the exact requested seed set, each run's manifest, one compatible set of runs, and inputs that still match the files on disk. No I/O except `hashFile`.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface InputRef { path: string; sha256: string | null }
export interface DemandBuild { view?: string; split?: string | null; config?: string | null; network?: string | null; countFile?: string | null }
export interface RunManifest {
  schema: number;
  simulator: { fingerprint: string; revision?: string | null; dirty?: boolean | null; version?: string };
  inputs: { network: InputRef; demand: InputRef; demandBuild?: DemandBuild | null; targets: InputRef; stations: InputRef; split: InputRef; demandConfig: InputRef; areaConfig: InputRef; groups: InputRef };
  run: { area: string; period: string; scale: number; seed: number; minutes: number; warmupMin: number; measurementWindow: { fromMin: number; toMin: number }; initialLoad: boolean; settings: Record<string, unknown> };
}
export interface ManifestRun { seed: number; manifest?: RunManifest | null }

export const hashFile = (path: string): string | null => (existsSync(path) ? createHash('sha256').update(readFileSync(path)).digest('hex') : null);
export const sha256Text = (text: string): string => createHash('sha256').update(text).digest('hex');
/** SHA-256 of the file as the report producer read it. */
export const runFileSha = (path: string): string | null => hashFile(path);

/** Which kind of demand a run set was made on. `main` is the shipped demand, `cv` the cross-validation (training view) demand. */
export type Role = 'main' | 'cv';

export interface ExpectedInputs {
  network: string | null; targets: string | null; stations: string | null; split: string | null; demandConfig: string | null; areaConfig: string | null; groups: string | null;
  /** Hash of the demand file this role should have run on. */
  demand: string | null;
}

export const expectedInputs = (root: string, area: string, demandFile: string | null): ExpectedInputs => ({
  network: hashFile(join(root, `public/data/${area}.network.json`)), targets: hashFile(join(root, `data/calibration/${area}.targets.json`)), stations: hashFile(join(root, `data/demand/${area}.stations.json`)),
  split: hashFile(join(root, `data/demand/${area}.split.json`)), demandConfig: hashFile(join(root, `data/demand/${area}.config.json`)), areaConfig: hashFile(join(root, `data/areas/${area}.json`)), groups: hashFile(join(root, `data/demand/${area}.groups.json`)),
  demand: demandFile ? hashFile(demandFile) : null,
});

const INPUT_KEYS = ['network', 'targets', 'stations', 'split', 'demandConfig', 'areaConfig', 'groups', 'demand'] as const;

/** The parts of a manifest that must be equal across the runs of one set (seed excluded). */
const comparable = (m: RunManifest) => ({
  fingerprint: m.simulator.fingerprint,
  inputs: Object.fromEntries(INPUT_KEYS.map((k) => [k, m.inputs[k]?.sha256 ?? null])),
  build: m.inputs.demandBuild ?? null,
  run: { ...m.run, seed: undefined },
});

export interface SetCheck { problems: string[]; revisions: string[]; dirty: boolean; fingerprint: string | null }

/**
 * Problems of one run set (one period, one role): exactly the requested seeds, each with a manifest that names its own seed and agrees with the others, and
 * inputs that equal the files now on disk. Runs are as read by `readRuns`: `seed` is the file's seed, `reportSeed` the seed the report itself says.
 */
export function checkRunSet(label: string, requested: number[], found: { seed: number; file: string; reportSeed?: number; manifest?: RunManifest | null; error?: string }[], expected: ExpectedInputs): SetCheck {
  const problems: string[] = [];
  const dup = requested.filter((s, i) => requested.indexOf(s) !== i);
  if (dup.length) problems.push(`${label}: seed list repeats ${[...new Set(dup)].join(', ')}`);
  const byFile = new Map(found.map((f) => [f.seed, f]));
  const missing = requested.filter((s) => !byFile.has(s));
  if (missing.length) problems.push(`${label}: ${missing.length} of ${requested.length} requested seeds have no report: ${missing.join(', ')}`);
  const seen = new Map<number, string>();
  for (const f of found) {
    if (f.error) { problems.push(`${label}: seed ${f.seed}: ${f.error}`); continue; }
    if (!f.manifest) { problems.push(`${label}: seed ${f.seed} has no manifest (a report from before manifests; its provenance is unknown, regenerate it)`); continue; }
    const ms = f.manifest.run.seed;
    if (ms !== f.seed || (f.reportSeed !== undefined && f.reportSeed !== f.seed)) problems.push(`${label}: file ${f.file} is named for seed ${f.seed} but its report says seed ${f.reportSeed ?? '?'} and its manifest seed ${ms}`);
    if (seen.has(ms)) problems.push(`${label}: seed ${ms} appears in both ${seen.get(ms)} and ${f.file}`);
    seen.set(ms, f.file);
  }
  const withManifest = found.filter((f) => f.manifest) as { seed: number; file: string; manifest: RunManifest }[];
  let revisions: string[] = [], dirty = false, fingerprint: string | null = null;
  if (withManifest.length) {
    const ref = comparable(withManifest[0].manifest);
    fingerprint = ref.fingerprint;
    for (const f of withManifest.slice(1)) {
      const c = comparable(f.manifest);
      for (const k of ['fingerprint', 'build'] as const) if (JSON.stringify(c[k]) !== JSON.stringify(ref[k])) problems.push(`${label}: seed ${f.seed} differs from seed ${withManifest[0].seed} in ${k === 'fingerprint' ? 'the simulator fingerprint' : 'the demand build provenance'}`);
      for (const k of INPUT_KEYS) if (c.inputs[k] !== ref.inputs[k]) problems.push(`${label}: seed ${f.seed} was run on a different ${k} file than seed ${withManifest[0].seed}`);
      for (const k of Object.keys(ref.run) as (keyof typeof ref.run)[]) if (k !== 'seed' && JSON.stringify(c.run[k]) !== JSON.stringify(ref.run[k])) problems.push(`${label}: seed ${f.seed} differs from seed ${withManifest[0].seed} in run setting ${k}`);
    }
    const m = withManifest[0].manifest;
    for (const k of INPUT_KEYS) {
      const now = expected[k];
      if ((m.inputs[k]?.sha256 ?? null) !== now) problems.push(`${label}: the ${k} file is not the one the runs used (runs ${(m.inputs[k]?.sha256 ?? 'none').slice(0, 12)}, now ${(now ?? 'none').slice(0, 12)}): the runs are stale`);
    }
    revisions = [...new Set(withManifest.map((f) => f.manifest.simulator.revision ?? 'unknown'))];
    dirty = withManifest.some((f) => f.manifest.simulator.dirty === true);
  }
  return { problems, revisions, dirty, fingerprint };
}

/** Problems with using a main run set and a cross-validation run set together: the roles of their demand files and the evaluation setup must match. */
export function checkPair(main: RunManifest | null, cv: RunManifest | null, splitSha: string | null, mainIsShipped = true): string[] {
  const problems: string[] = [];
  if (!main || !cv) return problems;
  if (main.simulator.fingerprint !== cv.simulator.fingerprint) problems.push('main and cross-validation runs used different simulators');
  for (const k of ['network', 'targets', 'stations', 'split', 'demandConfig', 'areaConfig', 'groups'] as const) if (main.inputs[k]?.sha256 !== cv.inputs[k]?.sha256) problems.push(`main and cross-validation runs used different ${k} files`);
  const a = { ...main.run, seed: 0 }, b = { ...cv.run, seed: 0 };
  if (JSON.stringify(a) !== JSON.stringify(b)) problems.push('main and cross-validation runs differ in period, scale, duration, initialization, measurement window or settings');
  const mb = main.inputs.demandBuild, cb = cv.inputs.demandBuild;
  if (mainIsShipped && !mb) problems.push('the main demand has no build provenance (build.view): rebuild it with the current tools/build-demand.ts');
  else if (mainIsShipped && mb && mb.view !== 'shipped') problems.push(`the main demand was built as view "${mb.view}", not "shipped"`);
  if (!cb) problems.push('the cross-validation demand has no build provenance (build.view): rebuild it with `build-demand.ts --view training`');
  else if (cb.view !== 'training') problems.push(`the cross-validation demand was built as view "${cb.view}", not "training": a fit with held stations left out of only its last step is not out of sample`);
  if (mainIsShipped && mb && cb) {
    if (mb.split !== cb.split) problems.push('the main and cross-validation demands were built from different split manifests');
    if (mb.config !== cb.config) problems.push('the main and cross-validation demands were built from different demand configs');
    if (mb.network !== cb.network) problems.push('the main and cross-validation demands were built on different networks');
    if (mb.countFile !== cb.countFile) problems.push('the main and cross-validation demands were built from different count files');
  }
  if (splitSha && cb && cb.split !== splitSha) problems.push('the cross-validation demand was built from a split manifest that is not the current data/demand split file');
  if (splitSha && mainIsShipped && mb && mb.split !== splitSha) problems.push('the shipped demand was built from a split manifest that is not the current data/demand split file');
  return problems;
}

export const seedFileName = (area: string, period: string, scale: number, seed: number): string => `${area}-${period}-s${scale}-seed${seed}.json`;
