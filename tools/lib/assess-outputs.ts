// Where an assessment writes (change protect-calibration-evidence, D4). The published set is the one the repository and the app read: the ten-seed summaries,
// `<area>.assessment.md` and the noise file. Any other (duration, suffix) gets a set of its own, so a variant can never replace published evidence; replacing the
// published set needs `--publish`. No I/O.
import { join, relative, resolve, sep } from 'node:path';

export interface OutputSet {
  /** Empty for the published set (60-minute runs, no suffix). */
  namespace: string;
  published: boolean;
  /** Native ten-seed summaries (`<prefix>-seeds1-10.{md,json}`) and the first seed in full. */
  reports: string;
  /** Per-seed reports of the main run and of the cross-validation run. */
  seeds: string;
  seedsCv: string;
  assessment: string;
  noise: string;
}

export interface OutputRequest { root: string; area: string; minutes: number; suffix: string; /** `--out`: where the native summaries go (variants and explicit publishing only). */ out?: string }

export function resolveOutputs(q: OutputRequest): OutputSet {
  const namespace = `${q.minutes === 60 ? '' : `${q.minutes}min`}${q.suffix ? `${q.minutes === 60 ? '' : '-'}${q.suffix}` : ''}`;
  const published = namespace === '';
  const seeds = join(q.root, 'target/assess-seeds', `${q.minutes}${q.suffix}`);
  if (published) {
    return { namespace, published, reports: resolve(q.root, q.out ?? 'data/calibration/reports'), seeds, seedsCv: `${seeds}-cv`, assessment: join(q.root, `data/calibration/${q.area}.assessment.md`), noise: join(q.root, `public/data/${q.area}.noise.json`) };
  }
  const home = join(q.root, 'target/assess-variants', namespace);
  return { namespace, published, reports: resolve(q.root, q.out ?? join(home, 'reports')), seeds, seedsCv: `${seeds}-cv`, assessment: join(q.root, `data/calibration/${q.area}.assessment${q.minutes === 60 ? '' : `-${q.minutes}min`}${q.suffix ? `-${q.suffix}` : ''}.md`), noise: join(home, `${q.area}.noise.json`) };
}

/** The published paths of an area, for the isolation check. */
export function publishedPaths(root: string, area: string): { reports: string; assessment: string; noise: string } {
  return { reports: join(root, 'data/calibration/reports'), assessment: join(root, `data/calibration/${area}.assessment.md`), noise: join(root, `public/data/${area}.noise.json`) };
}

const inside = (child: string, parent: string): boolean => { const r = relative(resolve(parent), resolve(child)); return r === '' || (!r.startsWith('..') && !r.startsWith(sep) && r !== '..'); };

/** Problems when a variant's output set touches published evidence (empty for the published set, which is allowed to once `--publish` is given). */
export function isolationProblems(set: OutputSet, root: string, area: string): string[] {
  if (set.published) return [];
  const pub = publishedPaths(root, area);
  const problems: string[] = [];
  if (inside(set.reports, pub.reports)) problems.push(`the summaries directory ${set.reports} is inside the published reports`);
  if (resolve(set.assessment) === resolve(pub.assessment)) problems.push('the assessment file is the published assessment');
  if (resolve(set.noise) === resolve(pub.noise)) problems.push('the noise file is the published noise file');
  return problems;
}
