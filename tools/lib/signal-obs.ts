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
  source: string;
}

/** Attach `signalTiming` to the matching signalized node; returns the observations that matched no node or approach. */
export function applySignalObservations(nodes: NetNode[], links: NetLink[], obs: SignalObservation[]): string[] {
  const misses: string[] = [];
  const streets = new Map<number, Set<string>>();
  for (const l of links) if (l.name) for (const n of [l.from, l.to]) (streets.get(n) ?? streets.set(n, new Set()).get(n)!).add(l.name);
  for (const o of obs) {
    const hit = nodes.filter((n) => n.control === 'signal' && o.at.every((s) => streets.get(n.id)?.has(s)));
    const node = hit.length === 1 ? hit[0] : null;
    const ins = node ? links.filter((l) => l.to === node.id && l.name === o.approach).map((l) => l.id) : [];
    if (!node || !ins.length) { misses.push(`${o.at.join(' / ')} (${o.approach}): ${hit.length > 1 ? 'several signals match' : !node ? 'no signal matches' : 'no approach link'}`); continue; }
    (node.signalTiming ??= []).push({ periods: o.periods, cycleS: o.cycleSeconds, greens: [{ links: ins, greenS: o.greenSeconds }], source: o.source });
  }
  return misses;
}
