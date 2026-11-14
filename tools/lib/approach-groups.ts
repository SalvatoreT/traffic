// Approach groups (calibration round 21): named sets of outside nodes that say where a through car comes from or goes to, in words a resident uses.
// Membership is derived from the network (the streets and classes attached to a gate and its compass bearing from the study area), with config overrides where
// that fails. Nodes that are not gates take the group of the nearest surface gate (ASSUMPTION). Nothing area specific lives here; the groups are data in the area config.
// No I/O.

export interface GNode { id: number; x: number; y: number; gate: boolean; inStudyArea: boolean }
export interface GLink { from: number; to: number; name: string; class: string }

export interface GroupMatch {
  /** Any link at the gate carries one of these street names. */
  names?: string[];
  /** Any link at the gate is of one of these classes. */
  classes?: string[];
  /** `entry`: trips can only enter the model here; `exit`: they can only leave; omitted: either. */
  role?: 'entry' | 'exit';
  /** Compass bearing in degrees clockwise from north, from the study area's center to the gate, `[from, to]` going clockwise (wraps through 360). */
  sector?: [number, number];
}
export interface GroupRule { id: string; label: string; match: GroupMatch }
export interface ApproachGroupsCfg {
  /** Ordered: the first rule that matches a gate takes it. */
  groups: GroupRule[];
  /** Named unions of groups, usable wherever a group id is. */
  sets?: Record<string, string[]>;
  /** Node id (as text) to group id, for gates the rules place wrongly. */
  overrides?: Record<string, string>;
}
export interface Group { id: string; label: string; gates: number[]; nodes: number[] }
export interface ApproachGroups {
  groups: Group[];
  sets: Record<string, string[]>;
  /** Node id to group id, for every node outside the study area. */
  nodeGroup: Map<number, string>;
  studyId: string;
  /** Rule matched per gate, for the report. */
  how: Map<number, 'rule' | 'override'>;
}

export const STUDY_GROUP = 'study-area';
export const STUDY_LABEL = 'The study area (a trip end inside it)';

/** Compass bearing in degrees clockwise from north of (dx, dy), y up. */
export function compass(dx: number, dy: number): number {
  return ((Math.atan2(dx, dy) * 180) / Math.PI + 360) % 360;
}

export function inSector(b: number, [from, to]: [number, number]): boolean {
  const f = ((from % 360) + 360) % 360, t = ((to % 360) + 360) % 360;
  return f <= t ? b >= f && b < t : b >= f || b < t;
}

export function studyCenter(nodes: GNode[]): { x: number; y: number } {
  const s = nodes.filter((n) => n.inStudyArea);
  if (!s.length) throw new Error('approach groups: the study area has no nodes');
  return { x: s.reduce((a, n) => a + n.x, 0) / s.length, y: s.reduce((a, n) => a + n.y, 0) / s.length };
}

export function deriveApproachGroups(nodes: GNode[], links: GLink[], cfg: ApproachGroupsCfg): ApproachGroups {
  const c = studyCenter(nodes);
  const ids = new Set(cfg.groups.map((g) => g.id));
  if (ids.size !== cfg.groups.length || ids.has(STUDY_GROUP)) throw new Error('approach groups: ids must be unique and not the reserved id ' + STUDY_GROUP);
  const names = new Map<number, Set<string>>(), classes = new Map<number, Set<string>>(), outs = new Map<number, number>(), ins = new Map<number, number>();
  const add = <T>(m: Map<number, Set<T>>, k: number, v: T) => (m.get(k) ?? m.set(k, new Set()).get(k)!).add(v);
  for (const l of links) {
    for (const n of [l.from, l.to]) { if (l.name) add(names, n, l.name); add(classes, n, l.class); }
    outs.set(l.from, (outs.get(l.from) ?? 0) + 1);
    ins.set(l.to, (ins.get(l.to) ?? 0) + 1);
  }
  const gateGroup = new Map<number, string>();
  const how = new Map<number, 'rule' | 'override'>();
  const unmatched: number[] = [];
  const gates = nodes.filter((n) => n.gate && !n.inStudyArea);
  for (const g of gates) {
    const ov = cfg.overrides?.[String(g.id)];
    if (ov) {
      if (!ids.has(ov)) throw new Error(`approach groups: override for node ${g.id} names an unknown group ${ov}`);
      gateGroup.set(g.id, ov); how.set(g.id, 'override'); continue;
    }
    const b = compass(g.x - c.x, g.y - c.y);
    const role = (outs.get(g.id) ?? 0) > 0 && (ins.get(g.id) ?? 0) === 0 ? 'entry' : (ins.get(g.id) ?? 0) > 0 && (outs.get(g.id) ?? 0) === 0 ? 'exit' : undefined;
    const hit = cfg.groups.find((r) => {
      const m = r.match;
      if (m.names && !m.names.some((x) => names.get(g.id)?.has(x))) return false;
      if (m.classes && !m.classes.some((x) => classes.get(g.id)?.has(x))) return false;
      if (m.role && m.role !== role) return false;
      if (m.sector && !inSector(b, m.sector)) return false;
      return true;
    });
    if (!hit) { unmatched.push(g.id); continue; }
    gateGroup.set(g.id, hit.id); how.set(g.id, 'rule');
  }
  if (unmatched.length) throw new Error(`approach groups: no rule matches gate nodes ${unmatched.join(', ')}; add a rule or an override`);
  // Every other node outside the study area takes the group of the nearest surface gate that can be used the way the node is (ASSUMPTION): a coarse place name for a block loading node.
  const surface = gates.filter((g) => !classes.get(g.id)?.has('motorway'));
  const nodeGroup = new Map<number, string>();
  for (const n of nodes) {
    if (n.inStudyArea) continue;
    const own = gateGroup.get(n.id);
    if (own) { nodeGroup.set(n.id, own); continue; }
    let best = surface[0], bd = Infinity;
    for (const g of surface) { const d = (g.x - n.x) ** 2 + (g.y - n.y) ** 2; if (d < bd) { bd = d; best = g; } }
    nodeGroup.set(n.id, gateGroup.get(best.id)!);
  }
  const sets = cfg.sets ?? {};
  for (const [k, v] of Object.entries(sets)) {
    if (ids.has(k) || k === STUDY_GROUP) throw new Error(`approach groups: set ${k} has the id of a group`);
    for (const m of v) if (!ids.has(m) && m !== STUDY_GROUP) throw new Error(`approach groups: set ${k} names an unknown group ${m}`);
  }
  const groups: Group[] = cfg.groups.map((r) => ({ id: r.id, label: r.label, gates: [...gateGroup].filter(([, g]) => g === r.id).map(([n]) => n).sort((a, b) => a - b), nodes: [...nodeGroup].filter(([, g]) => g === r.id).map(([n]) => n).sort((a, b) => a - b) }));
  return { groups, sets, nodeGroup, studyId: STUDY_GROUP, how };
}

/** The group ids a name stands for: a group, a set, or the study area. */
export function expandGroups(g: Pick<ApproachGroups, 'groups' | 'sets'>, ref: string | string[]): string[] {
  const out = new Set<string>();
  for (const r of Array.isArray(ref) ? ref : [ref]) {
    if (r === STUDY_GROUP || g.groups.some((x) => x.id === r)) out.add(r);
    else if (g.sets[r]) for (const m of g.sets[r]) out.add(m);
    else throw new Error(`approach groups: unknown group or set ${r}`);
  }
  return [...out];
}

/** Group of a node: the study area for its nodes, else its derived group. */
export function groupOfNode(g: ApproachGroups, nodeById: Map<number, GNode>, id: number): string {
  if (nodeById.get(id)?.inStudyArea) return STUDY_GROUP;
  return g.nodeGroup.get(id) ?? '';
}

export interface GroupsFile {
  area: string;
  note: string;
  studyId: string;
  groups: { id: string; label: string; gates: number[]; nodes: number[] }[];
  sets: Record<string, string[]>;
}

export function groupsFile(area: string, g: ApproachGroups): GroupsFile {
  return {
    area,
    note: 'Approach groups (calibration round 21): named sets of outside nodes. Gate membership comes from the street names, classes, entry or exit role and compass sector in the area config `approachGroups`; other outside nodes take the group of the nearest surface gate (ASSUMPTION). Read by the calibrate report; written by tools/build-demand.ts.',
    studyId: g.studyId,
    groups: g.groups.map((x) => ({ id: x.id, label: x.label, gates: x.gates, nodes: x.nodes })),
    sets: g.sets,
  };
}
