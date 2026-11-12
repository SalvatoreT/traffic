import type { Intervention } from '../types';

export function interventionKey(iv: Intervention): string {
  switch (iv.type) {
    case 'modal_filter': return 'link' in iv ? `mf-l${iv.link}` : `mf-n${iv.node}`;
    case 'speed_limit': return `sl-${iv.link}`;
    case 'speed_hump': return `sh-${iv.link}`;
    case 'traffic_circle': case 'control': case 'signal_timing': return `node-${iv.node}-${iv.type}`;
    case 'one_way': return `ow-${iv.link}`;
    case 'turn_ban': return `tb-${iv.fromLink}-${iv.toLink}`;
    case 'diagonal_diverter': return `dd-${iv.node}`;
  }
}

/** Add interventions, replacing any with the same key. Control changes at a node replace each other. */
export function addInterventions(list: Intervention[], add: Intervention[]): Intervention[] {
  const supersedes = (a: Intervention, b: Intervention) =>
    interventionKey(a) === interventionKey(b) ||
    (a.type !== 'turn_ban' && 'node' in a && b.type !== 'turn_ban' && 'node' in b &&
      a.node === b.node && ['control', 'traffic_circle'].includes(a.type) && ['control', 'traffic_circle'].includes(b.type));
  const kept = list.filter((x) => !add.some((a) => supersedes(a, x)));
  return [...kept, ...add];
}
