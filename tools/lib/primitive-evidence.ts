// Primitive-validation evidence in an assessment (change protect-calibration-evidence, D5). The validation suite writes `data/calibration/validation.json`: a manifest
// (simulator fingerprint, suite hash) and every case with its cited range. A failed case that the regression test tolerates (a known deviation) stays a failed check here.
// A deviation is covered only by a reviewed exception: what it means for the intended comparisons, and the follow-up. No I/O.
import type { PrimitiveVerdict } from './verdict';

export interface KnownDeviation { id: string; reason: string; reviewed: boolean; relevance: string; followUp: string | null }
export interface ValidationCase { id: string; name: string; unit: string; sim: number; lo: number; hi: number; source: string; note: string; pass: boolean; knownDeviation: KnownDeviation | null }
export interface ValidationFile {
  manifest: { schema: number; simulator: { fingerprint: string; revision?: string | null; dirty?: boolean | null }; suite: { sha256: string; cases: number } };
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
export const isReviewed = (d: KnownDeviation | null): boolean => !!d && d.reviewed && d.relevance.trim() !== '' && d.relevance !== 'unreviewed' && !!d.followUp && d.followUp.trim() !== '';

/** `runFingerprint` is the simulator fingerprint of the runs being assessed; evidence made on another simulator does not apply to them. */
export function primitiveEvidence(file: ValidationFile | null, runFingerprint: string | null): PrimitiveEvidence {
  const empty = { simulatorFingerprint: null, cases: 0, failed: [], undocumented: [], unreviewed: [], reviewed: [] };
  if (!file) return { state: 'missing', why: 'no data/calibration/validation.json: run `cargo run --release -p traffic-sim --bin validate`', ...empty };
  const fp = file.manifest?.simulator?.fingerprint ?? null;
  if (!fp) return { state: 'incompatible', why: 'validation.json has no simulator fingerprint (written before manifests)', ...empty };
  if (runFingerprint && fp !== runFingerprint) return { state: 'incompatible', why: `validation.json was made on simulator ${fp.slice(0, 12)}, the runs on ${runFingerprint.slice(0, 12)}`, ...empty, simulatorFingerprint: fp, cases: file.cases.length };
  const failed = file.cases.filter((c) => !c.pass);
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
