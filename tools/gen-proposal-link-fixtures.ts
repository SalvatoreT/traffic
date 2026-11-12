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

const idx = buildIndex(net);
const L = (a: [number, number], b: [number, number]) => between(nodeAt(...a).id, nodeAt(...b).id);
const ivSets: { name: string; ivs: Intervention[]; period?: string; demandScale?: number }[] = [
  { name: 'modal filter on a straight block', ivs: [{ type: 'modal_filter', link: L([2, 1], [3, 1]).id }] },
  { name: 'modal filter on a bent block, reverse link', ivs: [{ type: 'modal_filter', link: L([3, 2], [2, 2]).id }] },
  { name: 'modal filter at a node', ivs: [{ type: 'modal_filter', node: nodeAt(3, 3).id }] },
  { name: 'speed limits', ivs: [{ type: 'speed_limit', link: L([1, 3], [1, 4]).id, speed: 6.71 }, { type: 'speed_limit', link: L([2, 4], [3, 4]).id, speed: 8.94 }] },
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
