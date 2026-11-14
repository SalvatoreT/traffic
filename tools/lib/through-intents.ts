import { expandGroups, STUDY_GROUP, type ApproachGroups } from './approach-groups';

export type IntentBasis = 'observed' | 'assumed';
export interface ThroughIntentCfg {
  id: string;
  label: string;
  fromGroups: string[];
  toGroups: string[];
  avoids?: string;
  basis: IntentBasis;
  note: string;
}
export interface ThroughIntentsCfg { intents: ThroughIntentCfg[] }
/** What the demand file and the app carry for each intent (groups are resolved away; the order is the order flows index). */
export interface IntentOut { id: string; label: string; avoids?: string; basis: IntentBasis; note: string }
export interface Resolved { out: IntentOut; from: Set<string>; to: Set<string> }
export interface IntentFlow { origin: number; destination: number; mode?: string; intent?: number }

/** Intents with their group lists expanded (sets resolved). Throws on an unknown group, a repeated id or a missing field, so a typo stops the build. */
export function resolveIntents(cfg: ThroughIntentsCfg, groups: Pick<ApproachGroups, 'groups' | 'sets'>): Resolved[] {
  const seen = new Set<string>();
  return cfg.intents.map((i) => {
    if (!i.id || seen.has(i.id)) throw new Error(`throughIntents: missing or repeated id ${i.id}`);
    seen.add(i.id);
    if (!i.label || !i.note) throw new Error(`throughIntents ${i.id}: label and note are required`);
    if (i.basis !== 'observed' && i.basis !== 'assumed') throw new Error(`throughIntents ${i.id}: basis must be observed or assumed`);
    if (!i.fromGroups?.length || !i.toGroups?.length) throw new Error(`throughIntents ${i.id}: fromGroups and toGroups are required`);
    const from = new Set(expandGroups(groups, i.fromGroups));
    const to = new Set(expandGroups(groups, i.toGroups));
    if (from.has(STUDY_GROUP) || to.has(STUDY_GROUP)) throw new Error(`throughIntents ${i.id}: a through trip has no end in the study area`);
    return { out: { id: i.id, label: i.label, ...(i.avoids ? { avoids: i.avoids } : {}), basis: i.basis, note: i.note }, from, to };
  });
}

/** Index of the first intent that holds the pair, or -1 (the trip counts under Other). */
export function intentOf(res: Resolved[], fromGroup: string, toGroup: string): number {
  return res.findIndex((r) => r.from.has(fromGroup) && r.to.has(toGroup));
}

/** Sets `intent` on the car flows that match one; clears it on the others. Returns the PM-style volume per intent slot (the last slot is no intent). */
export function annotateFlows(flows: IntentFlow[], res: Resolved[], groupOf: (node: number) => string): number[] {
  const vol = new Array(res.length + 1).fill(0);
  for (const f of flows as (IntentFlow & { vehPerHour?: number })[]) {
    if (f.mode) continue;
    const gf = groupOf(f.origin), gt = groupOf(f.destination);
    const k = gf === STUDY_GROUP || gt === STUDY_GROUP ? -1 : intentOf(res, gf, gt);
    if (k >= 0) f.intent = k; else delete f.intent;
    vol[k >= 0 ? k : res.length] += f.vehPerHour ?? 0;
  }
  return vol;
}
