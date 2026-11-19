// search-c5: scenario links for the two turn-ban seed packages, found by street name on the current network and checked by decoding them back.
import { readFileSync } from 'node:fs';
import { decodeScenario, encodeScenario } from '../../../src/lib/hash';
import type { Intervention, Network } from '../../../src/types';

const net: Network = JSON.parse(readFileSync('public/data/rockridge.network.json', 'utf8'));
const L = net.links as any[];
const banned = new Set(((net as any).turnBans ?? []).map((b: any) => `${b.fromLink}>${b.toLink}`));
const pairs = (fromName: string, toName: string, toBearing?: [number, number]) => {
  const out: { node: number; from: any; to: any }[] = [];
  for (const a of L) {
    if (a.name !== fromName) continue;
    for (const b of L) {
      if (b.from !== a.to || b.name !== toName || b.to === a.from) continue;
      if (toBearing && !(b.fromBearing >= toBearing[0] && b.fromBearing <= toBearing[1])) continue;
      out.push({ node: a.to, from: a, to: b });
    }
  }
  return out;
};
const show = (title: string, ps: ReturnType<typeof pairs>) => {
  console.log(`\n${title}`);
  for (const p of ps) {
    const nodeNames = [...new Set(L.filter((l) => l.to === p.node || l.from === p.node).map((l) => l.name))].join(' / ');
    console.log(`  node ${p.node} (${nodeNames}; study area ${(net.nodes as any[])[p.node].inStudyArea}) link ${p.from.id} (${p.from.name}, end ${p.from.toBearing}) -> ${p.to.id} (${p.to.name}, start ${p.to.fromBearing})${banned.has(`${p.from.id}>${p.to.id}`) ? ' ALREADY BANNED' : ''}`);
  }
};
const clarHill = pairs('Claremont Avenue', 'Hillegass Avenue');
const alcHill = pairs('Alcatraz Avenue', 'Hillegass Avenue', [135, 225]);
const clarColby = pairs('Claremont Avenue', 'Colby Street');
const alcColby = pairs('Alcatraz Avenue', 'Colby Street', [135, 225]);
show('Claremont Avenue -> Hillegass Avenue (any node)', clarHill);
show('Alcatraz Avenue -> Hillegass Avenue southbound', alcHill);
show('Claremont Avenue -> Colby Street (any node)', clarColby);
show('Alcatraz Avenue -> Colby Street southbound', alcColby);

const want1: [number, number][] = [[2752, 2676], [2755, 2676], [2764, 2669], [2767, 2669]];
const want2: [number, number][] = [...want1, [2751, 2591], [2776, 2591], [2034, 2606], [2763, 2606]];
for (const [name, want] of [['Turn bans onto Hillegass Avenue', want1], ['Turn bans onto Hillegass Avenue and Colby Street', want2]] as const) {
  const ivs: Intervention[] = want.map(([a, b]) => ({ type: 'turn_ban', fromLink: a, toLink: b }) as Intervention);
  const link = encodeScenario(net, ivs, { area: 'rockridge', period: 'pm_peak' });
  const dec = decodeScenario(net, link);
  const got = dec.interventions.map((i: any) => `${i.fromLink}>${i.toLink}`).sort();
  const exp = want.map(([a, b]) => `${a}>${b}`).sort();
  console.log(`\n${name}\n  ${link}\n  decodes to ${got.join(' ')}; unplaced ${dec.unplaced.length}; invalid ${dec.invalid}; round trip ${JSON.stringify(got) === JSON.stringify(exp) ? 'OK' : 'MISMATCH'}`);
}
