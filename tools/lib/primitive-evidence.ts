// Primitive-validation evidence in an assessment (change protect-calibration-evidence, D5). The validation suite writes `data/calibration/validation.json`: a manifest
// (simulator fingerprint, suite hash) and every case with its cited range. A failed case that the regression test tolerates (a known deviation) stays a failed check here.
// A deviation is covered only by a reviewed exception: what it means for the intended comparisons, and the follow-up. No I/O.
import { isDeepStrictEqual } from 'node:util';
import type { PrimitiveVerdict } from './verdict';

export interface KnownDeviation { id: string; reason: string; reviewed: boolean; relevance: string; followUp: string | null }
export interface ValidationCase { id: string; name: string; unit: string; sim: number; lo: number; hi: number; source: string; note: string; pass: boolean; knownDeviation: KnownDeviation | null }
export interface ValidationFile {
  manifest: { schema: number; simulator: { fingerprint: string; revision?: string | null; dirty?: boolean | null }; suite: { sha256: string; cases: number }; deviations: { path: string; sha256: string | null } };
  cases: ValidationCase[];
  failing: string[];
  notDocumented: string[];
}

export interface PrimitiveEvidence {
  state: 'present' | 'missing' | 'incompatible';
  why: string;
  simulatorFingerprint: string | null;
  cases: number;
  failed: ValidationCase[];
  /** Failures with no documented deviation at all. */
  undocumented: ValidationCase[];
  /** Failures with a documented deviation that has not been reviewed for the intended comparisons. */
  unreviewed: ValidationCase[];
  reviewed: ValidationCase[];
}

/** A reviewed exception names its relevance and its follow-up; a flag alone is not a review. */
export const isReviewed = (d: KnownDeviation | null): boolean => !!d && d.reviewed === true && typeof d.relevance === 'string' && d.relevance.trim() !== '' && d.relevance !== 'unreviewed' && typeof d.followUp === 'string' && d.followUp.trim() !== '';

export interface PrimitiveSources {
  suiteHash: string | null;
  cases: Pick<ValidationCase, 'id' | 'lo' | 'hi' | 'source' | 'unit'>[];
  deviationsHash: string | null;
  deviations: KnownDeviation[];
}

function sameIds(actual: string[], expected: string[]): boolean {
  const ids = new Set(expected);
  return actual.length === ids.size && expected.length === ids.size && new Set(actual).size === actual.length && actual.every((id) => ids.has(id));
}

/** Compare the run and current suite identities, complete case inventory, cited ranges and current reviewed exceptions. */
export function primitiveEvidence(file: ValidationFile | null, runFingerprint: string | null, sources: PrimitiveSources | null): PrimitiveEvidence {
  const empty = { simulatorFingerprint: null, cases: 0, failed: [], undocumented: [], unreviewed: [], reviewed: [] };
  const incompatible = (why: string): PrimitiveEvidence => ({ ...empty, state: 'incompatible', why });
  if (!file) return { state: 'missing', why: 'no data/calibration/validation.json: run `cargo run --release -p traffic-sim --bin validate`', ...empty };
  const fp = file.manifest?.simulator?.fingerprint;
  if (!runFingerprint || fp !== runFingerprint) return incompatible('the validation and run simulator fingerprints are missing or differ');
  if (!sources || !sources.suiteHash || !sources.deviationsHash || !Array.isArray(sources.cases) || !sources.cases.length || !Array.isArray(sources.deviations) || file.manifest.schema !== 1 ||
      file.manifest.suite?.sha256 !== sources.suiteHash || file.manifest.deviations?.sha256 !== sources.deviationsHash ||
      file.manifest.deviations.path !== 'data/calibration/validation.deviations.json') return incompatible('the validation suite or reviewed deviations do not match the current files');
  const expected = new Map(sources.cases.map((c) => [c.id, c]));
  if (!Array.isArray(file.cases) || file.manifest.suite.cases !== file.cases.length ||
      !file.cases.every((c) => c && typeof c.id === 'string') || !sameIds(file.cases.map((c) => c.id), sources.cases.map((c) => c.id))) return incompatible('the validation case inventory is incomplete or has duplicate or unexpected ids');
  const deviations = new Map(sources.deviations.map((d) => [d.id, d]));
  if (deviations.size !== sources.deviations.length || sources.deviations.some((d) => !d || !expected.has(d.id))) return incompatible('the deviations file has duplicate or unknown case ids');
  for (const c of file.cases) {
    const ref = expected.get(c.id)!;
    const matches = (value: number, expected: number) => Math.abs(value - expected) <= 1e-12 * Math.max(1, Math.abs(expected));
    if (!matches(c.lo, ref.lo) || !matches(c.hi, ref.hi) || c.unit !== ref.unit || c.source !== ref.source) return incompatible(`case ${c.id} does not match its current cited range, unit or source`);
    if (![c.sim, c.lo, c.hi].every(Number.isFinite) || c.lo > c.hi || c.pass !== (c.sim >= c.lo && c.sim <= c.hi)) return incompatible(`case ${c.id} has invalid measurements, range, or pass status`);
    if (c.pass && deviations.has(c.id)) return incompatible(`case ${c.id} passed but is still listed as a current deviation`);
    if (!isDeepStrictEqual(c.knownDeviation, c.pass ? null : deviations.get(c.id) ?? null)) return incompatible(`the recorded exception for case ${c.id} differs from the current deviations file`);
  }
  const failed = file.cases.filter((c) => !c.pass);
  if (!Array.isArray(file.failing) || !sameIds(file.failing, failed.map((c) => c.id)) ||
      !Array.isArray(file.notDocumented) || !sameIds(file.notDocumented, failed.filter((c) => !c.knownDeviation).map((c) => c.id))) return incompatible('the failure summaries differ from the case results');
  const reviewed = failed.filter((c) => isReviewed(c.knownDeviation));
  const undocumented = failed.filter((c) => !c.knownDeviation);
  return { state: 'present', why: '', simulatorFingerprint: fp, cases: file.cases.length, failed, undocumented, unreviewed: failed.filter((c) => !reviewed.includes(c)), reviewed };
}

export const toVerdict = (e: PrimitiveEvidence): PrimitiveVerdict => ({ state: e.state, unreviewed: e.unreviewed.map((c) => c.id), reviewed: e.reviewed.map((c) => `${c.id}: ${c.knownDeviation!.relevance} (follow-up: ${c.knownDeviation!.followUp})`) });

/** The assessment section: failed checks stay failed, with the reason and the review state, apart from the regression test and the count-fit verdict. */
export function primitiveLines(e: PrimitiveEvidence): string[] {
  const L = ['## Primitive validation (separate from the count-fit verdict)', ''];
  if (e.state !== 'present') return [...L, `Primitive-validation evidence is ${e.state === 'missing' ? 'missing' : 'not for these runs'}: ${e.why}. No unqualified claim that the simulator's primitives meet their cited ranges is made here.`, ''];
  L.push(`The validation suite (${e.cases} cases, simulator ${e.simulatorFingerprint!.slice(0, 12)}, the one these runs used) fails ${e.failed.length} case(s) against the cited ranges. The regression test tolerates the documented deviations so that a new failure is caught; that tolerance is not a pass, and every failure below stays a failed evidence check. "Reviewed" means the deviation's relevance to the intended comparisons and its follow-up are written down in \`data/calibration/validation.deviations.json\`.`, '');
  if (!e.failed.length) return [...L, 'No case fails.', ''];
  L.push('| Case | Quantity | Simulated | Cited range | Source | Review | Why it fails |', '| --- | --- | --- | --- | --- | --- | --- |');
  for (const c of e.failed) {
    const d = c.knownDeviation;
    L.push(`| ${c.id} | ${c.name} | ${c.sim.toPrecision(3)} ${c.unit} | ${c.lo} to ${c.hi} | ${c.source} | ${!d ? 'NOT DOCUMENTED' : isReviewed(d) ? `reviewed: ${d.relevance}; follow-up: ${d.followUp}` : 'documented, not reviewed for the intended comparisons'} | ${d ? d.reason : c.note} |`);
  }
  L.push('', e.unreviewed.length ? `${e.unreviewed.length} failure(s) have no reviewed exception, so no unqualified validity claim is made and the status cannot be \`calibrated\`. Repair and revalidate the primitives that matter for the intended comparisons before adjusting demand to compensate for them.` : 'Every failure has a reviewed limited-use exception; the status carries those limits.', '');
  return L;
}
