// Packages that hold many turn bans (a ban set): how the scenario panel groups them, how the card lists them by street and how the picture marks them.
import type { Intervention, Network } from '../types';
import type { NetIndex } from './naming';
import { turnKindOf, type TurnKind } from './turnkind';

type TurnBan = Extract<Intervention, { type: 'turn_ban' }>;

/** From this many turn bans in one scenario the scenario panel folds them into one entry, and a picture draws one mark for each intersection instead of one for each ban. */
export const GROUP_BANS_MIN = 6;

export type ScenarioEntry = { kind: 'one'; index: number } | { kind: 'bans'; indices: number[] };

/** The scenario's entries in order: each intervention on its own, except that a scenario with at least `GROUP_BANS_MIN` turn bans lists them as one entry at the place of the first. */
export function scenarioEntries(ivs: readonly Intervention[]): ScenarioEntry[] {
  const bans = ivs.flatMap((iv, i) => (iv.type === 'turn_ban' ? [i] : []));
  if (bans.length < GROUP_BANS_MIN) return ivs.map((_, index) => ({ kind: 'one', index }));
  const out: ScenarioEntry[] = [];
  ivs.forEach((iv, index) => {
    if (iv.type !== 'turn_ban') out.push({ kind: 'one', index });
    else if (index === bans[0]) out.push({ kind: 'bans', indices: bans });
  });
  return out;
}

const KIND_WORD: Record<TurnKind, string> = { left: 'Left turn', right: 'Right turn', straight: 'Straight-on movement', 'u-turn': 'U-turn' };

export interface BanLine { index: number; text: string; turn: TurnKind | null }
export interface BanGroup { street: string; bans: BanLine[] }

/** The turn bans among `ivs` grouped by the street they start on (a bounding street or one outside the area), streets and lines in alphabetical order. `index` is the intervention's position in `ivs`. */
export function groupBans(ivs: readonly Intervention[], net: Network, idx: NetIndex): BanGroup[] {
  const by = new Map<string, BanLine[]>();
  ivs.forEach((iv, index) => {
    if (iv.type !== 'turn_ban') return;
    const turn = turnKindOf(net, iv.fromLink, iv.toLink);
    const street = idx.linkName[iv.fromLink] ?? `link ${iv.fromLink}`;
    const text = `${turn ? KIND_WORD[turn] : 'Turn'} onto ${idx.linkName[iv.toLink] ?? `link ${iv.toLink}`}`;
    by.set(street, [...(by.get(street) ?? []), { index, text, turn }]);
  });
  return [...by.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([street, bans]) => ({ street, bans: bans.sort((a, b) => a.text.localeCompare(b.text) || a.index - b.index) }));
}

export interface BanMark { node: number; /** The first ban at the intersection, so the mark answers for it. */ index: number; turn: 'left' | 'right' | 'many' | 'other'; count: number }

/** One mark for each intersection where turn bans start, when a package holds `GROUP_BANS_MIN` or more; null for fewer (each ban then has its own mark). The mark shows the turn when every ban there is the same side, and both when they differ. */
export function banMarks(ivs: readonly Intervention[], net: Network): BanMark[] | null {
  const bans = ivs.flatMap((iv, index) => (iv.type === 'turn_ban' ? [{ iv: iv as TurnBan, index }] : []));
  if (bans.length < GROUP_BANS_MIN) return null;
  const at = new Map<number, { index: number; turns: Set<TurnKind | null> }>();
  for (const { iv, index } of bans) {
    const node = net.links[iv.fromLink]?.to;
    if (node === undefined) continue;
    const e = at.get(node) ?? { index, turns: new Set<TurnKind | null>() };
    e.turns.add(turnKindOf(net, iv.fromLink, iv.toLink));
    at.set(node, e);
  }
  return [...at.entries()].map(([node, e]) => {
    const t = [...e.turns];
    const turn = t.length === 1 && t[0] === 'left' ? 'left' : t.length === 1 && t[0] === 'right' ? 'right' : t.length > 1 && t.every((x) => x === 'left' || x === 'right') ? 'many' : 'other';
    return { node, index: e.index, turn, count: bans.filter(({ iv }) => net.links[iv.fromLink]?.to === node).length };
  });
}
