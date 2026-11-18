// Regenerates crates/sim/tests/fixtures/links.json: the TypeScript scenario-link encoder (src/lib/hash.ts) and naming
// (src/lib/naming.ts, src/lib/describe.ts) applied to the fixture grid with a few bent streets. The Rust encoder in
// crates/sim/src/explore/link.rs must reproduce these strings exactly.
// Run: npx tsx tools/gen-proposal-link-fixtures.ts
import { writeFileSync } from 'node:fs';
import { buildFixture } from '../src/fixtures/area';
import { encodeScenario } from '../src/lib/hash';
import { buildIndex } from '../src/lib/naming';
import { describeIntervention } from '../src/lib/describe';
import type { Intervention, Network } from '../src/types';

const net: Network = JSON.parse(JSON.stringify(buildFixture().network));
const geomLen = (g: [number, number][]) => g.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - g[i][0], p[1] - g[i][1]), 0);
const nodeAt = (i: number, j: number) => net.nodes.find((n) => Math.abs(n.x - (i - 2.5) * 120) < 1e-6 && Math.abs(n.y - (j - 2.5) * 120) < 1e-6)!;
const between = (a: number, b: number) => net.links.find((l) => l.from === a && l.to === b)!;

// Bend three streets so midpoints and end bearings differ from the chord.
for (const [a, b, dx, dy] of [[nodeAt(2, 2).id, nodeAt(3, 2).id, 12, 31], [nodeAt(1, 3).id, nodeAt(1, 4).id, -23, 7], [nodeAt(3, 3).id, nodeAt(3, 2).id, 18, -9]] as const) {
  const l = between(a, b), r = net.links[l.reverse!];
  const mid: [number, number] = [(net.nodes[a].x + net.nodes[b].x) / 2 + dx, (net.nodes[a].y + net.nodes[b].y) / 2 + dy];
  l.geometry = [[net.nodes[a].x, net.nodes[a].y], [mid[0] - 20, mid[1] - 5], mid, [net.nodes[b].x, net.nodes[b].y]];
  r.geometry = [...l.geometry].reverse() as [number, number][];
  l.length = r.length = geomLen(l.geometry);
}
// An unnamed service road and a one-way pair for the naming checks.
net.links.find((l) => l.from === nodeAt(2, 3).id && l.to === nodeAt(3, 3).id)!.name = '';

// A street that runs through a small loop: no other street meets the loop's two junctions, so its blocks are named by the cross streets
// beyond them, never "a dead end" (`loopStreet` in src/lib/naming.test.ts, the Rust twin in crates/sim/tests/explore.rs).
{
  const c = nodeAt(0, 0), d = nodeAt(0, 1);
  const addNode = (x: number, y: number) => { const id = net.nodes.length; net.nodes.push({ id, osmId: 9000 + id, x, y, control: 'uncontrolled', gate: false, inStudyArea: true }); return id; };
  const p = addNode(c.x - 60, c.y + 30), q = addNode(c.x - 60, c.y + 80);
  const pair = (a: number, b: number, via: [number, number] | null, way: number) => {
    const geo: [number, number][] = [[net.nodes[a].x, net.nodes[a].y], ...(via ? [via] : []), [net.nodes[b].x, net.nodes[b].y]];
    const len = geomLen(geo);
    const f = net.links.length;
    const mk = (id: number, from: number, to: number, g: [number, number][], rev: number) => ({ id, osmWayId: way, from, to, reverse: rev, name: 'Loop Road', class: 'residential' as const, lanes: 1, speedLimit: 11.2, length: len, geometry: g, stopAtEnd: false, humps: [], inStudyArea: true });
    net.links.push(mk(f, a, b, geo, f + 1) as never, mk(f + 1, b, a, [...geo].reverse() as [number, number][], f) as never);
  };
  pair(c.id, p, null, 9001);
  pair(p, q, [net.nodes[p].x - 25, (net.nodes[p].y + net.nodes[q].y) / 2], 9002);
  pair(p, q, [net.nodes[p].x + 25, (net.nodes[p].y + net.nodes[q].y) / 2], 9003);
  pair(q, d.id, null, 9004);
}

const idx = buildIndex(net);
const L = (a: [number, number], b: [number, number]) => between(nodeAt(...a).id, nodeAt(...b).id);
const ivSets: { name: string; ivs: Intervention[]; period?: string; demandScale?: number }[] = [
  { name: 'modal filter on a straight block', ivs: [{ type: 'modal_filter', link: L([2, 1], [3, 1]).id }] },
  { name: 'modal filter on a bent block, reverse link', ivs: [{ type: 'modal_filter', link: L([3, 2], [2, 2]).id }] },
  { name: 'modal filter at a node', ivs: [{ type: 'modal_filter', node: nodeAt(3, 3).id }] },
  {
    name: 'modal filter on one street at a node',
    ivs: [{ type: 'modal_filter', node: nodeAt(3, 3).id, legs: net.links.filter((l) => (l.from === nodeAt(3, 3).id || l.to === nodeAt(3, 3).id) && Math.abs(net.nodes[l.from === nodeAt(3, 3).id ? l.to : l.from].y - nodeAt(3, 3).y) < 1e-6).map((l) => l.id).sort((a, b) => a - b) }],
  },
  { name: 'speed limits', ivs: [{ type: 'speed_limit', link: L([1, 3], [1, 4]).id, speed: 6.71 }, { type: 'speed_limit', link: L([2, 4], [3, 4]).id, speed: 8.94 }] },
  { name: 'slow street', ivs: [{ type: 'slow_street', link: L([2, 2], [3, 2]).id }] },
  { name: 'slow street with a filter on its street and an unnamed block', ivs: [{ type: 'slow_street', link: L([3, 1], [4, 1]).id }, { type: 'modal_filter', link: L([2, 1], [3, 1]).id }, { type: 'slow_street', link: L([2, 3], [3, 3]).id }] },
  { name: 'speed hump', ivs: [{ type: 'speed_hump', link: L([2, 2], [3, 2]).id, position: 61.3 }] },
  { name: 'traffic circle and controls', ivs: [{ type: 'traffic_circle', node: nodeAt(2, 2).id }, { type: 'control', node: nodeAt(3, 2).id, control: 'all_way_stop' }, { type: 'control', node: nodeAt(2, 3).id, control: 'uncontrolled' }] },
  { name: 'signal timing', ivs: [{ type: 'signal_timing', node: nodeAt(1, 1).id, cycle: 60 }, { type: 'signal_timing', node: nodeAt(4, 4).id, cycle: 120 }] },
  { name: 'one-way both directions', ivs: [{ type: 'one_way', link: L([1, 2], [2, 2]).id }, { type: 'one_way', link: L([2, 3], [1, 3]).id }, { type: 'one_way', link: L([3, 2], [3, 3]).id }] },
  { name: 'turn bans', ivs: [{ type: 'turn_ban', fromLink: L([2, 1], [2, 2]).id, toLink: L([2, 2], [3, 2]).id }, { type: 'turn_ban', fromLink: L([4, 2], [3, 2]).id, toLink: L([3, 2], [3, 3]).id }] },
  { name: 'diagonal diverters', ivs: [{ type: 'diagonal_diverter', node: nodeAt(2, 3).id, bearing: 45 }, { type: 'diagonal_diverter', node: nodeAt(3, 3).id, bearing: 135 }] },
  { name: 'package with period', period: 'pm', ivs: [{ type: 'modal_filter', link: L([2, 1], [3, 1]).id }, { type: 'speed_hump', link: L([1, 3], [1, 4]).id, position: 30 }] },
  { name: 'empty with period', period: 'pm', ivs: [] },
];
const cases = ivSets.map((c) => ({
  name: c.name, period: c.period ?? null, interventions: c.ivs,
  link: encodeScenario(net, c.ivs, { area: 'fixture', period: c.period }),
  labels: c.ivs.map((iv) => describeIntervention(iv, net as never, idx)),
}));
writeFileSync(new URL('../crates/sim/tests/fixtures/links.json', import.meta.url), JSON.stringify({
  network: net,
  blockLabels: idx.blocks.map((b) => ({ key: b.key, label: b.label })),
  nodeNames: idx.nodeName,
  cases,
}));
console.log(cases.map((c) => `${c.name}: ${c.link}\n   ${c.labels.join(' | ')}`).join('\n'));
