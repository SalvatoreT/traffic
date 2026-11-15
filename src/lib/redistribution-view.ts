// What the redistribution view draws and says, kept out of the component so it can be tested.
import type { Intervention, Network } from '../types';
import type { BlockRow, Comparison, Effect, GraphQuery, RedistributionResult, RouteRow } from './redistribution';
import { FAR_ROUTE } from './redistribution';

/** Intervention types that can remove car movements, so a cohort of displaced trips exists. */
export const TRACEABLE: Intervention['type'][] = ['modal_filter', 'turn_ban', 'diagonal_diverter', 'one_way'];
export const canTrace = (iv: Intervention) => TRACEABLE.includes(iv.type);

export const ROLE_LABEL = { baseline: 'Today', closure: 'This closure alone', package: 'Whole package' } as const;
export const LAYER_LABEL = {
  possible: 'Possible paths',
  cohort: 'Simulated cohort routes',
  net: 'Net change, all cars',
} as const;
export type Layer = keyof typeof LAYER_LABEL;
/** Most items drawn per layer; the tables list them all. */
export const MAP_MAX = 3;

const MINUS = '−';
export const signed = (x: number, dp = 0) => {
  const r = Number(x.toFixed(dp));
  return r === 0 ? '0' : `${r > 0 ? '+' : MINUS}${Math.abs(r).toFixed(dp)}`;
};
export const round = (x: number) => String(Math.round(x));

/** One sentence on an interval: the sign it resolves, or why it resolves none. */
export function effectStatus(e: Effect | null | undefined): string {
  if (!e) return 'not available';
  if (e.status === 'insufficient') return `${e.n} run${e.n === 1 ? '' : 's'}, too few for an interval (10 needed)`;
  const iv = e.interval ? `95% interval ${signed(e.interval[0])} to ${signed(e.interval[1])}` : '';
  if (e.status === 'unresolved') return `${iv}, includes zero`;
  return `${iv}, ${e.status === 'increase' ? 'a resolved increase' : 'a resolved decrease'}`;
}

/** Street names along a link path, consecutive repeats merged. */
export function streetsOf(net: Network, links: number[]): string {
  const out: string[] = [];
  for (const l of links) {
    const s = net.links[l]?.name.trim() || 'Unnamed road';
    if (out[out.length - 1] !== s) out.push(s);
  }
  return out.join(' → ');
}

export interface PathItem { id: string; links: number[]; streets: string; extraS: number | null; movement: string }
/** Witness paths of one graph, cheapest detour first, each once. */
export function possiblePaths(net: Network, g: GraphQuery, movementLabel?: (a: number, b: number) => string): { items: PathItem[]; disconnected: string[]; unused: number; capped: boolean } {
  const seen = new Set<string>();
  const items: PathItem[] = [];
  const disconnected: string[] = [];
  let unused = 0, capped = false;
  for (const w of g.witnesses) {
    const mv = movementLabel ? movementLabel(w.movement[0], w.movement[1]) : streetsOf(net, w.movement);
    if (w.status === 'disconnected') disconnected.push(mv);
    if (w.status === 'unused') unused++;
    if (w.found > w.listed) capped = true;
    for (const p of w.paths) {
      const k = p.links.join(',');
      if (seen.has(k)) continue;
      seen.add(k);
      items.push({ id: k, links: p.links, streets: streetsOf(net, p.links), extraS: p.baselineCostS === null ? null : p.costS - p.baselineCostS, movement: mv });
    }
  }
  items.sort((a, b) => (a.extraS ?? Infinity) - (b.extraS ?? Infinity) || a.id.localeCompare(b.id));
  return { items, disconnected, unused, capped };
}

/** Cohort routes in a comparison: the ones its trips drove, most used first; routes only the baseline used come after. */
export function cohortRoutes(r: RedistributionResult, c: Comparison): RouteRow[] {
  return [...r.cohort.routes].sort((a, b) => b.counts[c] - a.counts[c] || b.counts.baseline - a.counts.baseline || a.key.localeCompare(b.key));
}
export const isFar = (row: RouteRow) => row.key === FAR_ROUTE;

/** Blocks to draw for the net layer: a resolved or raw change of at least one car an hour in the comparison. */
export function netBlocks(r: RedistributionResult, c: Comparison): BlockRow[] {
  return r.blocks.filter((b) => Math.abs(b.change[c].all.mean) >= 1);
}

export interface Frame { minX: number; maxY: number; w: number; h: number; links: { id: number; d: string; major: boolean }[] }
/** A square around the closed junctions with every link inside it, in SVG coordinates (y down, meters). */
export function mapFrame(net: Network, nodes: number[], half = 450): Frame {
  const xs = nodes.map((n) => net.nodes[n].x), ys = nodes.map((n) => net.nodes[n].y);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const minX = cx - half, maxX = cx + half, minY = cy - half, maxY = cy + half;
  const inside = (p: [number, number]) => p[0] >= minX - 50 && p[0] <= maxX + 50 && p[1] >= minY - 50 && p[1] <= maxY + 50;
  const links = net.links.filter((l) => l.geometry.some(inside) && (l.reverse === null || l.id < l.reverse)).map((l) => ({
    id: l.id, d: pathD(l.geometry, minX, maxY), major: l.class !== 'residential' && l.class !== 'service',
  }));
  return { minX, maxY, w: 2 * half, h: 2 * half, links };
}
export const pathD = (g: [number, number][], minX: number, maxY: number) => g.map(([x, y], i) => `${i ? 'L' : 'M'}${(x - minX).toFixed(1)} ${(maxY - y).toFixed(1)}`).join(' ');
/** A link path as one SVG path, link geometries joined, offset sideways by `off` meters to keep overlapping layers apart. */
export function linksD(net: Network, links: number[], f: Frame, off = 0): string {
  const pts: [number, number][] = [];
  for (const l of links) for (const p of net.links[l]?.geometry ?? []) {
    const last = pts[pts.length - 1];
    if (!last || last[0] !== p[0] || last[1] !== p[1]) pts.push(p);
  }
  if (off === 0 || pts.length < 2) return pathD(pts, f.minX, f.maxY);
  const shifted = pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1;
    return [p[0] + (dy / n) * off, p[1] - (dx / n) * off] as [number, number];
  });
  return pathD(shifted, f.minX, f.maxY);
}
export function midpoint(net: Network, links: number[], f: Frame): [number, number] {
  const l = net.links[links[Math.floor(links.length / 2)]];
  const g = l?.geometry ?? [[f.minX, f.maxY]];
  const p = g[Math.floor(g.length / 2)];
  return [p[0] - f.minX, f.maxY - p[1]];
}
