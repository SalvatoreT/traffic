import type { Network } from '../types';
import { directedLabel, type Block, type NetIndex } from './naming';

export type PickTarget = 'block' | 'dirlink' | 'node';
export interface PickItem { key: string; label: string; study: boolean; kind: PickTarget; id: number }

export interface ScopeOptions { showService: boolean; showOutside: boolean }

/** Whether a block is listed: focus area unless outside streets are included; service roads only when asked. */
export function blockVisible(b: Block, o: ScopeOptions, cls?: string): boolean {
  return (o.showOutside || b.inFocus) && (o.showService || b.cls !== 'service' || cls === 'service');
}

export function pickerItems(net: Network, idx: NetIndex, target: PickTarget, o: ScopeOptions): PickItem[] {
  const out: PickItem[] = [];
  if (target === 'block') {
    for (const b of idx.blocks) if (blockVisible(b, o)) out.push({ key: `b${b.key}`, label: b.label, study: b.inStudyArea, kind: 'block', id: b.links[0] });
  } else if (target === 'dirlink') {
    for (const l of net.links) {
      if (l.reverse === null) continue;
      const b = idx.blocks[idx.blockOfLink[l.id]];
      if (!blockVisible(b, o)) continue;
      out.push({ key: `d${l.id}`, label: `Keep ${directedLabel(net, idx, l.id)} (${b.label})`, study: l.inStudyArea, kind: 'dirlink', id: l.id });
    }
  } else {
    for (const n of idx.intersections) {
      if (!o.showOutside && !idx.nodeInFocus[n]) continue;
      out.push({ key: `n${n}`, label: idx.nodeName[n], study: net.nodes[n].inStudyArea, kind: 'node', id: n });
    }
  }
  return out.sort((a, b) => Number(b.study) - Number(a.study));
}
