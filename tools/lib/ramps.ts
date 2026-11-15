// Freeway ramps of a network, in one place: the builder writes them into the demand file and the simulator classifies through cars by them. No I/O, no street names in code.
// An on-ramp is a chain of freeway-class links entered from a surface street; an off-ramp is a chain that ends at one. The links of a chain are one ramp: the chain runs through
// nodes that touch no surface street and have one freeway link in and one out, and stops where it merges into or leaves the freeway (a node with more links) or at a gate.
// A chain that runs from one surface street to another is a connector, not a ramp.

export interface RNode { id: number; osmId?: number; x: number; y: number; gate: boolean }
export interface RLink { id: number; from: number; to: number; name: string; class: string; length: number; geometry?: [number, number][] }
export type RampKind = 'on' | 'off';
export interface FreewayRamp {
  /** Stable for a network: kind and the OSM id of the surface node, with a count when several ramps meet one node. */
  id: string;
  kind: RampKind;
  /** The surface node where the ramp is entered (on) or left (off). */
  node: number;
  /** The freeway-class links of the chain, in driving order. */
  links: number[];
  /** Surface street names at the terminal node, the busiest class first. */
  streets: string[];
  /** Compass word for the way the freeway runs where the ramp joins or leaves it, or null. */
  direction: 'northbound' | 'eastbound' | 'southbound' | 'westbound' | null;
  label: string;
}
export interface RampCfg {
  /** The freeway as drivers name it, for labels. */
  freewayName?: string;
  /** Label overrides by ramp id. */
  labels?: Record<string, string>;
}

const RANK: Record<string, number> = { motorway: 0, primary: 1, secondary: 2, tertiary: 3, residential: 4, service: 5 };
const MAX_CHAIN = 24;

const bearing = (a: [number, number], b: [number, number]): number => ((Math.atan2(b[0] - a[0], b[1] - a[1]) * 180) / Math.PI + 360) % 360;
const cardinal = (b: number): FreewayRamp['direction'] => (['northbound', 'eastbound', 'southbound', 'westbound'] as const)[Math.round(b / 90) % 4];

export function deriveRamps(nodes: RNode[], links: RLink[], freeway: Set<string>, cfg: RampCfg = {}): FreewayRamp[] {
  const fw = links.filter((l) => freeway.has(l.class));
  const surfaceAt = new Map<number, RLink[]>();
  const fwIn = new Map<number, RLink[]>(), fwOut = new Map<number, RLink[]>();
  const push = (m: Map<number, RLink[]>, k: number, l: RLink) => { const a = m.get(k); if (a) a.push(l); else m.set(k, [l]); };
  for (const l of links) if (!freeway.has(l.class)) { push(surfaceAt, l.from, l); push(surfaceAt, l.to, l); }
  for (const l of fw) { push(fwOut, l.from, l); push(fwIn, l.to, l); }
  const isSurface = (n: number) => surfaceAt.has(n);
  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  const xy = (id: number): [number, number] => [nodeById.get(id)?.x ?? 0, nodeById.get(id)?.y ?? 0];
  const startBearing = (l: RLink): number => bearing(l.geometry?.[0] ?? xy(l.from), l.geometry?.[1] ?? xy(l.to));
  const endBearing = (l: RLink): number => bearing(l.geometry?.[l.geometry.length - 2] ?? xy(l.from), l.geometry?.[l.geometry.length - 1] ?? xy(l.to));
  const found: Omit<FreewayRamp, 'id' | 'label'>[] = [];
  const streetsAt = (n: number): string[] => {
    const best = new Map<string, number>();
    for (const l of surfaceAt.get(n) ?? []) if (l.name) best.set(l.name, Math.min(best.get(l.name) ?? 9, RANK[l.class] ?? 9));
    return [...best].sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0])).map((e) => e[0]);
  };
  for (const l0 of fw) {
    if (isSurface(l0.from) && !isSurface(l0.to)) {
      const chain = [l0];
      let node = l0.to, ok = true;
      while (!nodeById.get(node)?.gate && (fwIn.get(node)?.length ?? 0) === 1 && (fwOut.get(node)?.length ?? 0) === 1 && chain.length < MAX_CHAIN) {
        const next = fwOut.get(node)![0];
        if (isSurface(next.to)) { ok = false; break; }
        chain.push(next);
        node = next.to;
      }
      if (!ok) continue;
      const main = [...(fwOut.get(node) ?? [])].sort((a, b) => b.length - a.length)[0];
      found.push({ kind: 'on', node: l0.from, links: chain.map((l) => l.id), streets: streetsAt(l0.from), direction: cardinal(main ? startBearing(main) : endBearing(chain[chain.length - 1])) });
    }
    if (isSurface(l0.to) && !isSurface(l0.from)) {
      const chain = [l0];
      let node = l0.from, ok = true;
      while (!nodeById.get(node)?.gate && (fwIn.get(node)?.length ?? 0) === 1 && (fwOut.get(node)?.length ?? 0) === 1 && chain.length < MAX_CHAIN) {
        const prev = fwIn.get(node)![0];
        if (isSurface(prev.from)) { ok = false; break; }
        chain.unshift(prev);
        node = prev.from;
      }
      if (!ok) continue;
      const main = [...(fwIn.get(node) ?? [])].sort((a, b) => b.length - a.length)[0];
      found.push({ kind: 'off', node: l0.to, links: chain.map((l) => l.id), streets: streetsAt(l0.to), direction: cardinal(main ? endBearing(main) : startBearing(chain[0])) });
    }
  }
  found.sort((a, b) => a.kind.localeCompare(b.kind) || a.node - b.node || a.links[0] - b.links[0]);
  const seen = new Map<string, number>();
  return found.map((r) => {
    const base = `${r.kind}-${nodeById.get(r.node)?.osmId ?? r.node}`;
    const k = (seen.get(base) ?? 0) + 1;
    seen.set(base, k);
    const id = k === 1 ? base : `${base}-${k}`;
    return { ...r, id, label: cfg.labels?.[id] ?? rampLabel(r, cfg.freewayName) };
  });
}

/** "To SR-24 westbound by the Claremont Ave on-ramp at Hudson St", "From the SR-24 eastbound off-ramp at Claremont Ave / Clifton St". */
export function rampLabel(r: Pick<FreewayRamp, 'kind' | 'streets' | 'direction'>, freewayName?: string): string {
  const fw = freewayName ?? 'the freeway';
  const way = [freewayName ?? 'freeway', r.direction].filter(Boolean).join(' ');
  if (r.kind === 'on') {
    const [a, b] = r.streets;
    const where = a ? (b ? `the ${a} on-ramp at ${b}` : `the ${a} on-ramp`) : 'an on-ramp';
    return `To ${r.direction ? way : fw} by ${where}`;
  }
  return `From the ${way}${r.streets.length ? ` off-ramp at ${r.streets.slice(0, 2).join(' / ')}` : ' off-ramp'}`;
}
