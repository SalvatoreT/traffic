// Where each reason's through cars start and end, from the simulator's per-trip tally (stride 4: reason slot, origin node, destination node, cars), in the words of the approach groups.
// The summary is computed from the run, so no number in a note is written by hand. No I/O.

export interface IntentEnd { label: string; /** Whole percent of the reason's cars. */ share: number }
export interface IntentEnds { id: string; from: IntentEnd[]; to: IntentEnd[] }

const TOP = 3;
/** A group is named only when it carries at least this share of the reason's cars. ASSUMPTION: display threshold. */
export const MIN_END_SHARE = 0.1;

export function summarizeEnds(trips: ArrayLike<number>, ids: string[], groupOf: (node: number) => string, labelOf: (group: string) => string): IntentEnds[] {
  const from = ids.map(() => new Map<string, number>()), to = ids.map(() => new Map<string, number>());
  const total = ids.map(() => 0);
  for (let k = 0; k + 3 < trips.length; k += 4) {
    const s = trips[k];
    if (!(s >= 0 && s < ids.length)) continue;
    const n = trips[k + 3];
    total[s] += n;
    for (const [m, node] of [[from[s], trips[k + 1]], [to[s], trips[k + 2]]] as [Map<string, number>, number][]) {
      const g = groupOf(node);
      m.set(g, (m.get(g) ?? 0) + n);
    }
  }
  const top = (m: Map<string, number>, t: number): IntentEnd[] => [...m]
    .filter(([, n]) => t > 0 && n / t >= MIN_END_SHARE)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, TOP)
    .map(([g, n]) => ({ label: labelOf(g), share: Math.round((100 * n) / t) }));
  return ids.map((id, i) => ({ id, from: top(from[i], total[i]), to: top(to[i], total[i]) }));
}
