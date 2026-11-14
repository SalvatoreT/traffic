import type { AreaBundle, Intervention } from '../types';
import { compassWord, headingTo, type NetIndex } from './naming';
import { pointAlong } from './geom';
import { controlLabel } from './selection';
import { connectedLabel } from './diverter';
import { filterSentence, filterText } from './blocked';

export function describeIntervention(iv: Intervention, net: AreaBundle['network'], idx: NetIndex): string {
  const ln = (id: number) => idx.blocks[idx.blockOfLink[id]]?.label ?? `link ${id}`;
  const nn = (id: number) => idx.nodeName[id] ?? `node ${id}`;
  switch (iv.type) {
    case 'modal_filter': return 'link' in iv ? `Modal filter on ${ln(iv.link)}` : `Modal filter at ${nn(iv.node)}`;
    case 'speed_limit': return `Speed limit ${Math.round(iv.speed * 2.23694)} mph on ${ln(iv.link)}`;
    case 'speed_hump': return `Speed hump on ${ln(iv.link)}`;
    case 'traffic_circle': return `Traffic circle at ${nn(iv.node)}`;
    case 'control': return `${controlLabel(iv.control)} at ${nn(iv.node)}`;
    case 'signal_timing': return `Signal cycle ${iv.cycle} s at ${nn(iv.node)}`;
    case 'one_way': { if (!net.links[iv.link]) return `One-way on ${ln(iv.link)}`; const to = headingTo(idx, net, iv.link); return `One-way ${compassWord(net, iv.link)} on ${ln(iv.link)}${to ? ` (${to})` : ''}`; }
    case 'diagonal_diverter': {
      const c = connectedLabel(net, idx, iv.node, iv.bearing);
      return `Diagonal diverter at ${nn(iv.node)}${c ? `, connecting ${c}` : ''}`;
    }
    case 'turn_ban': {
      const a = net.links[iv.fromLink], b = net.links[iv.toLink];
      return `Turn ban at ${a ? nn(a.to) : '?'}: ${a ? idx.linkName[a.id] : '?'} to ${b ? idx.linkName[b.id] : '?'}`;
    }
  }
}
/** The short label, and for a modal filter what it closes: "Modal filter at A & B: cars cannot pass through this intersection. Closed to through cars: ...". */
export function describeInterventionFull(iv: Intervention, net: AreaBundle['network'], idx: NetIndex): string {
  const short = describeIntervention(iv, net, idx);
  const t = filterText(iv, net, idx);
  if (!t) return short;
  const s = filterSentence(t);
  return `${short}: ${s.charAt(0).toLowerCase()}${s.slice(1)}`;
}
export function interventionPoint(iv: Intervention, net: AreaBundle['network']): [number, number] {
  const node = (id: number): [number, number] => [net.nodes[id]?.x ?? 0, net.nodes[id]?.y ?? 0];
  const mid = (id: number, pos?: number): [number, number] => {
    const l = net.links[id];
    if (!l) return [0, 0];
    const p = pointAlong(l.geometry, pos ?? l.length / 2);
    return [p.x, p.y];
  };
  switch (iv.type) {
    case 'modal_filter': return 'link' in iv ? mid(iv.link) : node(iv.node);
    case 'speed_hump': return mid(iv.link, iv.position);
    case 'speed_limit': case 'one_way': return mid(iv.link);
    case 'turn_ban': return node(net.links[iv.fromLink]?.to ?? 0);
    default: return node(iv.node);
  }
}

const TYPE_LABEL: Record<Intervention['type'], string> = {
  modal_filter: 'Modal filter', speed_limit: 'Speed limit', speed_hump: 'Speed hump', traffic_circle: 'Traffic circle',
  control: 'Intersection control', signal_timing: 'Signal timing', one_way: 'One-way street', turn_ban: 'Turn ban',
  diagonal_diverter: 'Diagonal diverter',
};
export const interventionTypeLabel = (t: Intervention['type']): string => TYPE_LABEL[t];
