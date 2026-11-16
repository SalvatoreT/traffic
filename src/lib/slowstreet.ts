import type { Intervention, Network, NetLink } from '../types';

/**
 * Slow Street: one intervention that limits every block of one named street, inside the study area, to 15 mph. The street comes from the
 * network alone (names, study-area flag, shared intersections). The engine never sees the item: the Rust side expands it into one
 * per-block speed limit each (`crates/sim/src/explore/street.rs`, which this file mirrors).
 */
export const SLOW_STREET_MPH = 15;
export const SLOW_STREET_MPS = Math.round((SLOW_STREET_MPH / 2.2369362920544) * 100) / 100;
const UNNAMED = 'Unnamed road';

export interface StreetRun {
  name: string;
  /** Directed links of each block (one or two), blocks in order of their lowest link id. */
  blocks: number[][];
  /** First link of the block with the lowest link id: the same whichever block of the run was chosen. */
  canonical: number;
  from: string;
  to: string;
  /** The street has other blocks in the study area that this run does not reach. */
  split: boolean;
}

const nameOf = (l: NetLink) => l.name.trim();
const blockKey = (net: Network, l: NetLink) => (l.reverse !== null && l.reverse !== l.id && net.links[l.reverse] ? Math.min(l.id, l.reverse) : l.id);
const joinNames = (names: string[], fallback: string) =>
  names.length === 0 ? fallback : names.length <= 2 ? names.join(' / ') : `${names[0]} / ${names[1]} / +${names.length - 2}`;

/** The connected run of the street of `link` inside the study area, or null for an unnamed link or one outside the study area. */
export function streetRun(net: Network, link: number): StreetRun | null {
  const l0 = net.links[link];
  if (!l0 || !nameOf(l0)) return null;
  const name = nameOf(l0);
  const blocks = new Map<number, number[]>();
  for (const l of net.links) if (nameOf(l) === name) { const k = blockKey(net, l); (blocks.get(k) ?? blocks.set(k, []).get(k)!).push(l.id); }
  for (const [k, ls] of [...blocks]) if (!ls.some((i) => net.links[i].inStudyArea)) blocks.delete(k);
  const start = blockKey(net, l0);
  if (!blocks.has(start)) return null;
  const ends = (ls: number[]) => [...new Set(ls.flatMap((i) => [net.links[i].from, net.links[i].to]))];
  const atNode = new Map<number, number[]>();
  for (const [k, ls] of blocks) for (const n of ends(ls)) (atNode.get(n) ?? atNode.set(n, []).get(n)!).push(k);
  const run = new Set<number>();
  const todo = [start];
  for (let k = todo.pop(); k !== undefined; k = todo.pop()) {
    if (run.has(k)) continue;
    run.add(k);
    for (const n of ends(blocks.get(k)!)) todo.push(...atNode.get(n)!.filter((b) => !run.has(b)));
  }
  const touching = new Map<number, number>();
  for (const k of run) for (const n of ends(blocks.get(k)!)) touching.set(n, (touching.get(n) ?? 0) + 1);
  const streets = new Map<number, Set<string>>();
  for (const l of net.links) {
    const t = nameOf(l);
    if (t && t !== name && t !== UNNAMED) for (const n of [l.from, l.to]) (streets.get(n) ?? streets.set(n, new Set()).get(n)!).add(t);
  }
  const text = (n: number) => joinNames([...(streets.get(n) ?? [])].sort((p, q) => (p < q ? -1 : p > q ? 1 : 0)), net.nodes[n].gate ? 'the study-area edge' : 'a dead end');
  const endNodes = [...touching].filter(([, c]) => c === 1).map(([n]) => n);
  const dist = (a: number, b: number) => Math.hypot(net.nodes[a].x - net.nodes[b].x, net.nodes[a].y - net.nodes[b].y);
  let pair: [number, number] | null = null, best = -1;
  endNodes.forEach((a, i) => { for (const b of endNodes.slice(i + 1)) if (dist(a, b) > best) { best = dist(a, b); pair = [a, b]; } });
  let from = '', to = '';
  if (pair) {
    const [a, b] = pair as [number, number];
    const ta = text(a), tb = text(b);
    const la = ta.toLowerCase(), lb = tb.toLowerCase();
    [from, to] = la < lb || (la === lb && a <= b) ? [ta, tb] : [tb, ta];
  }
  const keys = [...run].sort((p, q) => p - q);
  return { name, canonical: blocks.get(keys[0])![0], blocks: keys.map((k) => blocks.get(k)!), from, to, split: run.size < blocks.size };
}

/** "Slow Street on Colby Street (15 mph, 62nd Street to Alcatraz Avenue)". */
export function slowStreetLabel(run: StreetRun): string {
  const span = run.from ? `${run.from} to ${run.to}` : 'a loop';
  const gap = run.split ? '; this connected stretch only, the street has another stretch in the study area' : '';
  return `Slow Street on ${run.name} (${SLOW_STREET_MPH} mph, ${span}${gap})`;
}

/** The blocks of a run, by one link each, that a 15 mph limit would slow (a limit never raises a slower block). */
export function slowedBlocks(net: Network, run: StreetRun): number[] {
  return run.blocks.filter((b) => b.every((l) => net.links[l].speedLimit > SLOW_STREET_MPS + 0.1)).map((b) => b[0]);
}

/** The engine's form of an intervention list: each Slow Street becomes a per-block speed limit. */
export function expandSlowStreets(net: Network, ivs: Intervention[]): Intervention[] {
  if (!ivs.some((iv) => iv.type === 'slow_street')) return ivs;
  return ivs.flatMap((iv): Intervention[] => {
    if (iv.type !== 'slow_street') return [iv];
    const run = streetRun(net, iv.link);
    return run ? slowedBlocks(net, run).map((link) => ({ type: 'speed_limit' as const, link, speed: SLOW_STREET_MPS })) : [];
  });
}
