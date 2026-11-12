import type { Network } from '../types';
import { type Block, type NetIndex } from './naming';

export interface PlaceResult { key: string; label: string; study: boolean; kind: 'block' | 'node'; /** Block index or node id. */ id: number }
export interface ScopeOptions { showService: boolean }

/** Whether a block is listed: only the visible region (study area plus buffer); service roads only when asked. */
export function blockVisible(b: Block, o: ScopeOptions, cls?: string): boolean {
  return b.inFocus && (o.showService || b.cls !== 'service' || cls === 'service');
}

/** Every place the search can find, study area first. */
export function placeResults(net: Network, idx: NetIndex, o: ScopeOptions): { blocks: PlaceResult[]; nodes: PlaceResult[] } {
  const byStudy = (a: PlaceResult, b: PlaceResult) => Number(b.study) - Number(a.study);
  const blocks: PlaceResult[] = [];
  idx.blocks.forEach((b, i) => { if (blockVisible(b, o)) blocks.push({ key: `b${i}`, label: b.label, study: b.inStudyArea, kind: 'block', id: i }); });
  const nodes: PlaceResult[] = [];
  for (const n of idx.intersections) {
    if (!idx.nodeInFocus[n]) continue;
    nodes.push({ key: `n${n}`, label: idx.nodeName[n], study: net.nodes[n].inStudyArea, kind: 'node', id: n });
  }
  return { blocks: blocks.sort(byStudy), nodes: nodes.sort(byStudy) };
}

export type ListEvent = 'type' | 'escape' | 'choose' | 'focus' | 'blur';

/** Whether the result list has been dismissed. Only typing, Escape and choosing change it; focus and blur never do. */
export function listDismissed(dismissed: boolean, ev: ListEvent): boolean {
  if (ev === 'type') return false;
  if (ev === 'escape' || ev === 'choose') return true;
  return dismissed;
}

/** The list shows while there is a query and results, until dismissed. */
export const listOpen = (query: string, dismissed: boolean, results: number): boolean => query.trim() !== '' && !dismissed && results > 0;
