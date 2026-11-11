import type { Network, NetLink } from '../types';

export interface Block {
  key: number;            // lowest link id in the block
  name: string;
  links: number[];        // 1 or 2 directed links (a two-way street block has both)
  a: number; b: number;   // end nodes (a = from of first link)
  label: string;          // "Oak St between A and B"
  lengthM: number;
  cls: NetLink['class'];
  inStudyArea: boolean;
}
export interface NetIndex {
  linkName: string[];     // friendly per-link street name ("Unnamed service road off Oak St")
  nodeName: string[];
  nodeStreets: string[][];
  blocks: Block[];
  blockOfLink: number[];  // link id -> index in blocks
  incomingLinks: number[][];
  outgoingLinks: number[][];
  intersections: number[]; // node ids worth listing
}

export const UNNAMED = 'Unnamed road';
const CUL_DE_SAC = '(cul-de-sac end)';
export const linkStreet = (l: NetLink) => l.name.trim() || UNNAMED;

function joinNames(names: string[], fallback: string): string {
  if (names.length === 0) return fallback;
  if (names.length <= 2) return names.join(' / ');
  return `${names[0]} / ${names[1]} / +${names.length - 2}`;
}

export function buildIndex(net: Network): NetIndex {
  const n = net.nodes.length;
  const incoming: number[][] = Array.from({ length: n }, () => []);
  const outgoing: number[][] = Array.from({ length: n }, () => []);
  for (const l of net.links) { outgoing[l.from].push(l.id); incoming[l.to].push(l.id); }

  const nodeStreets: string[][] = Array.from({ length: n }, () => []);
  for (const l of net.links) {
    for (const nid of [l.from, l.to]) {
      const s = linkStreet(l);
      if (!nodeStreets[nid].includes(s)) nodeStreets[nid].push(s);
    }
  }
  nodeStreets.forEach((a) => a.sort((p, q) => (p === UNNAMED ? 1 : q === UNNAMED ? -1 : p.localeCompare(q))));
  const nodeName = nodeStreets.map((s, i) =>
    s.length === 0 ? `Node ${i}` : s.length === 1 ? `${s[0]} (junction)` : joinNames(s, `Node ${i}`).replace(/ \/ /g, ' & '),
  );

  const linkName = net.links.map((l) => {
    const own = l.name.trim();
    if (own) return own;
    const kind = l.class === 'service' ? 'service road' : 'road';
    const near = [...nodeStreets[l.from], ...nodeStreets[l.to]].filter((s) => s !== UNNAMED);
    return near.length ? `Unnamed ${kind} off ${near[0]}` : `Unnamed ${kind}`;
  });

  const blocks: Block[] = [];
  const blockOfLink: number[] = new Array(net.links.length).fill(-1);
  for (const l of net.links) {
    if (blockOfLink[l.id] >= 0) continue;
    const rev = l.reverse !== null && l.reverse !== l.id ? net.links[l.reverse] : null;
    const ids = rev ? [Math.min(l.id, rev.id), Math.max(l.id, rev.id)] : [l.id];
    const first = net.links[ids[0]];
    const unnamed = !first.name.trim();
    const name = linkName[first.id];
    const others = (nid: number) => nodeStreets[nid].filter((s) => s !== name && s !== UNNAMED);
    const isDeadEnd = (nid: number) => !net.nodes[nid].gate && incoming[nid].length + outgoing[nid].length <= (rev ? 2 : 1);
    const endText = (nid: number) => joinNames(others(nid), net.nodes[nid].gate ? 'the study-area edge' : 'a dead end');
    let label: string;
    if (unnamed) {
      const dead = isDeadEnd(first.from) ? first.from : isDeadEnd(first.to) ? first.to : -1;
      const far = dead === first.from ? first.to : first.from;
      const base = name.replace(/^Unnamed (service road|road) off /, '');
      const farStreets = others(far).filter((s) => s !== base);
      label = dead >= 0 ? `${name} ${CUL_DE_SAC}` : farStreets.length ? `${name} to ${joinNames(farStreets, '')}` : name;
    } else {
      label = `${name} between ${endText(first.from)} and ${endText(first.to)}`;
    }
    const idx = blocks.length;
    for (const id of ids) blockOfLink[id] = idx;
    blocks.push({
      key: ids[0], name, links: ids, a: first.from, b: first.to,
      label, lengthM: first.length, cls: first.class,
      inStudyArea: first.inStudyArea,
    });
  }
  blocks.sort((p, q) => p.name.localeCompare(q.name) || p.key - q.key);
  blocks.forEach((b, i) => b.links.forEach((id) => (blockOfLink[id] = i)));

  const intersections: number[] = [];
  for (let i = 0; i < n; i++) {
    const neigh = new Set<number>();
    for (const id of outgoing[i]) neigh.add(net.links[id].to);
    for (const id of incoming[i]) neigh.add(net.links[id].from);
    if (neigh.size >= 3 || net.nodes[i].control === 'signal') intersections.push(i);
  }
  intersections.sort((p, q) => nodeName[p].localeCompare(nodeName[q]) || p - q);
  return { linkName, nodeName, nodeStreets, blocks, blockOfLink, incomingLinks: incoming, outgoingLinks: outgoing, intersections };
}

/** Directed description: "Oak St toward Elm St" */
export function directedLabel(net: Network, idx: NetIndex, linkId: number): string {
  const l = net.links[linkId];
  const me = idx.linkName[linkId];
  const others = idx.nodeStreets[l.to].filter((s) => s !== linkStreet(l));
  return `${me} toward ${joinNames(others, idx.nodeName[l.to])}`;
}

export function matchesQuery(text: string, q: string): boolean {
  const t = text.toLowerCase();
  return q.toLowerCase().split(/\s+/).filter(Boolean).every((w) => t.includes(w));
}
