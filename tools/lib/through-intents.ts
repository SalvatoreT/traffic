import { expandGroups, STUDY_GROUP, type ApproachGroups } from './approach-groups';
import type { FreewayRamp, RampCfg } from './ramps';

export type IntentBasis = 'observed' | 'assumed';
export interface ThroughIntentCfg {
  id: string;
  /** Shown to people. Optional for a reason keyed by one ramp: it takes the ramp's label. */
  label?: string;
  /** Id of an entry of `sections`: the heading the reason is listed under. */
  section?: string;
  /** A through car that will use this on-ramp (a ramp id), or any on-ramp no reason lists (`other`). */
  onRamp?: string;
  /** A through car that came by this off-ramp (a ramp id), or any off-ramp no reason lists (`other`). */
  offRamp?: string;
  /** Origin and destination groups of a reason that does not name a ramp. */
  fromGroups?: string[];
  toGroups?: string[];
  avoids?: string;
  basis: IntentBasis;
  note: string;
}
export interface ThroughIntentsCfg {
  intents: ThroughIntentCfg[];
  /** Ordered headings the reasons are grouped under. */
  sections?: { id: string; title: string }[];
  /** How ramps are named (`freewayName`, `labels`). */
  ramps?: RampCfg;
}
/** What the demand file and the app carry for each intent (groups are resolved away; the order is the order flows index). */
export interface IntentOut { id: string; label: string; section?: string; onRamp?: string; offRamp?: string; avoids?: string; basis: IntentBasis; note: string }
export interface Resolved { out: IntentOut; from: Set<string>; to: Set<string> }
export interface IntentFlow { origin: number; destination: number; mode?: string; intent?: number }

/** Intents with their group lists expanded (sets resolved). Throws on an unknown group, a repeated id or a missing field, so a typo stops the build. */
export function resolveIntents(cfg: ThroughIntentsCfg, groups: Pick<ApproachGroups, 'groups' | 'sets'>, ramps: Pick<FreewayRamp, 'id' | 'kind' | 'label'>[] = []): Resolved[] {
  const seen = new Set<string>();
  const sections = new Map((cfg.sections ?? []).map((s) => [s.id, s.title]));
  return cfg.intents.map((i) => {
    if (!i.id || seen.has(i.id)) throw new Error(`throughIntents: missing or repeated id ${i.id}`);
    seen.add(i.id);
    if (!i.note) throw new Error(`throughIntents ${i.id}: a note is required`);
    if (i.basis !== 'observed' && i.basis !== 'assumed') throw new Error(`throughIntents ${i.id}: basis must be observed or assumed`);
    if (i.section && !sections.has(i.section)) throw new Error(`throughIntents ${i.id}: unknown section ${i.section}`);
    const section = i.section ? { section: sections.get(i.section)! } : {};
    const rampKey = i.onRamp ?? i.offRamp;
    if (rampKey) {
      if (i.onRamp && i.offRamp) throw new Error(`throughIntents ${i.id}: onRamp and offRamp are alternatives`);
      const kind = i.onRamp ? 'on' : 'off';
      const ramp = rampKey === 'other' ? null : ramps.find((r) => r.id === rampKey && r.kind === kind);
      if (rampKey !== 'other' && !ramp) throw new Error(`throughIntents ${i.id}: no ${kind}-ramp ${rampKey} in the network`);
      const label = i.label ?? ramp?.label;
      if (!label) throw new Error(`throughIntents ${i.id}: a label is required`);
      return { out: { id: i.id, label, ...section, ...(i.onRamp ? { onRamp: i.onRamp } : { offRamp: i.offRamp }), ...(i.avoids ? { avoids: i.avoids } : {}), basis: i.basis, note: i.note }, from: new Set<string>(), to: new Set<string>() };
    }
    if (!i.label) throw new Error(`throughIntents ${i.id}: a label is required`);
    if (!i.fromGroups?.length || !i.toGroups?.length) throw new Error(`throughIntents ${i.id}: fromGroups and toGroups are required`);
    const from = new Set(expandGroups(groups, i.fromGroups));
    const to = new Set(expandGroups(groups, i.toGroups));
    if (from.has(STUDY_GROUP) || to.has(STUDY_GROUP)) throw new Error(`throughIntents ${i.id}: a through trip has no end in the study area`);
    return { out: { id: i.id, label: i.label, ...section, ...(i.avoids ? { avoids: i.avoids } : {}), basis: i.basis, note: i.note }, from, to };
  });
}

/** Index of the first intent that holds the pair, or -1 (the trip counts under Other). */
export function intentOf(res: Resolved[], fromGroup: string, toGroup: string): number {
  return res.findIndex((r) => !r.out.onRamp && !r.out.offRamp && r.from.has(fromGroup) && r.to.has(toGroup));
}

/** The fields of a ramp the demand file carries. */
export const rampOut = (r: FreewayRamp) => ({ id: r.id, kind: r.kind, node: r.node, links: r.links, label: r.label, ...(r.direction ? { direction: r.direction } : {}) });

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
