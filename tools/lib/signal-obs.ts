// Observed signal timing from the area config (`signalObservations`) attached to the signalized nodes of the network. No I/O.
import type { NetLink, NetNode } from './types';

export interface SignalObservation {
  /** Street names that all meet at the signalized junction. */
  at: string[];
  /** Name of the approach the observation is about (the links of that street that end at the junction). */
  approach: string;
  /** Demand periods the observation holds for. */
  periods: string[];
  cycleSeconds: number;
  greenSeconds: number;
  /** [lat, lon] of the signal, when the street names alone match several signals; the nearest matching signal within 80 m is taken. */
  near?: [number, number];
  /** Compass direction of travel of the approach, degrees, when the street arrives from two sides and the observation is about one of them. */
  heading?: number;
  /** The approach has a phase of its own: all its movements run while the opposing approach waits (split phasing, or a protected left turn). */
  ownPhase?: boolean;
  source: string;
}

const HEADING_TOL = 45;
const NEAR_M = 80;
const angDiff = (a: number, b: number) => Math.abs(((a - b + 540) % 360) - 180);

/** Attach `signalTiming` to the matching signalized node; returns the observations that matched no node or approach. */
export function applySignalObservations(nodes: NetNode[], links: NetLink[], obs: SignalObservation[], toXY?: (lat: number, lon: number) => [number, number]): string[] {
  const misses: string[] = [];
  const streets = new Map<number, Set<string>>();
  for (const l of links) if (l.name) for (const n of [l.from, l.to]) (streets.get(n) ?? streets.set(n, new Set()).get(n)!).add(l.name);
  for (const o of obs) {
    const hit = nodes.filter((n) => n.control === 'signal' && o.at.every((s) => streets.get(n.id)?.has(s)));
    let node = hit.length === 1 ? hit[0] : null;
    if (o.near && toXY) {
      const [x, y] = toXY(o.near[0], o.near[1]);
      const by = hit.map((n) => ({ n, d: Math.hypot(n.x - x, n.y - y) })).sort((p, q) => p.d - q.d)[0];
      node = by && by.d <= NEAR_M ? by.n : null;
    }
    const ins = node ? links.filter((l) => l.to === node.id && l.name === o.approach && (o.heading === undefined || angDiff(l.toBearing ?? 0, o.heading) <= HEADING_TOL)).map((l) => l.id) : [];
    if (!node || !ins.length) { misses.push(`${o.at.join(' / ')} (${o.approach}): ${hit.length > 1 ? 'several signals match' : !node ? 'no signal matches' : 'no approach link'}`); continue; }
    const green = { links: ins, greenS: o.greenSeconds, ...(o.ownPhase ? { ownPhase: true } : {}) };
    // Observations of one signal in the same periods and cycle are one timing with several approaches.
    const same = (node.signalTiming ??= []).find((t) => t.cycleS === o.cycleSeconds && t.periods.join() === o.periods.join());
    if (same) { same.greens.push(green); if (!same.source.includes(o.source)) same.source += `; ${o.source}`; } else node.signalTiming.push({ periods: o.periods, cycleS: o.cycleSeconds, greens: [green], source: o.source });
  }
  return misses;
}
