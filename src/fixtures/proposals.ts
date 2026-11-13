import type { Intervention, Network } from '../types';
import { buildIndex } from '../lib/naming';
import { describeIntervention } from '../lib/describe';
import { encodeScenario } from '../lib/hash';
import type { Proposal, Proposals } from '../lib/proposals';

type Variant = 'fresh' | 'stale';

/** Plausible values in the published shape, with links encoded against whatever network is loaded. Dev and tests only. */
export function buildMockProposals(network: Network, computed: { networkHash: string; demandHash: string; calibration: string }, variant: Variant = 'fresh'): Proposals {
  const idx = buildIndex(network);
  const inside = network.links.filter((l) => l.inStudyArea && l.length > 30 && (l.reverse === null || l.id < l.reverse));
  const nodes = network.nodes.filter((n) => n.inStudyArea && !n.gate);
  const L = (k: number) => inside[Math.floor((k * 0.37 * inside.length) % inside.length)]?.id ?? 0;
  const N = (k: number) => nodes[Math.floor((k * 0.41 * nodes.length) % nodes.length)]?.id ?? 0;
  const mf = (k: number): Intervention => ({ type: 'modal_filter', link: L(k) });
  const dd = (k: number, bearing: number): Intervention => ({ type: 'diagonal_diverter', node: N(k), bearing });
  const sl = (k: number): Intervention => ({ type: 'speed_limit', link: L(k), speed: 6.7 });
  const BLOCK = 'Colby Street between 63rd Street and North Street';
  const mk = (id: string, title: string, summary: string, ivs: Intervention[], cut: number, worst: number, blocks: number, extra: Partial<Proposal> = {}): Proposal => {
    const base = 118;
    const period = (k: number, w: number) => {
      const baseP = Math.round(base * (1 + (k - 1) * 0.04)), pct = cut * k;
      const gain = w > 0 ? w * 2.2 : -3;
      return {
        cutThrough: { baselineVehPerHour: baseP, scenarioVehPerHour: +(baseP * (1 + pct / 100)).toFixed(1), changePct: +pct.toFixed(1) },
        allTraffic: { worstBlock: BLOCK, baselineVehPerHour: 240, scenarioVehPerHour: +(240 + gain).toFixed(1), throughIncreaseVehPerHour: +(w * 0.4).toFixed(1), blocksAboveNoise: blocks },
      };
    };
    return {
      id, title, summary,
      link: encodeScenario(network, ivs, { area: network.id }),
      interventions: ivs.map((iv) => ({ type: iv.type, label: describeIntervention(iv, network, idx) })),
      cutThrough: { baselineVehPerHour: base, scenarioVehPerHour: +(base * (1 + cut / 100)).toFixed(1), changePct: cut },
      harm: { through: { worstBlock: worst > 0 ? BLOCK : '', increaseVehPerHour: +(worst * 0.4).toFixed(1), blocksAboveNoise: blocks } },
      context: {
        boundingStreets: [
          { name: 'Telegraph Avenue', flowChangePct: -cut / 12, speedChangeMph: -0.2 },
          { name: 'College Avenue', flowChangePct: -cut / 9, speedChangeMph: -0.3 },
          { name: 'Claremont Avenue', flowChangePct: 1.4, speedChangeMph: 0 },
          { name: 'Alcatraz Avenue', flowChangePct: 2.1, speedChangeMph: -0.1 },
        ],
        insideTripTimeChangePct: Math.abs(cut) / 10, pedConflictsChangePct: cut / 5, bikeConflictsChangePct: cut / 6,
      },
      byPeriod: { 'am-peak': period(1.1, worst), 'pm-peak': period(0.9, Math.max(0, worst - 4)) },
      ...extra,
    };
  };
  const stale = variant === 'stale';
  const meta = {
    computed: { date: '2026-11-12', periods: ['am-peak', 'pm-peak'], seeds: [1, 2, 3, 4], ...computed, networkHash: stale ? 'deadbeefdeadbeef' : computed.networkHash },
    baseline: { cutThroughVehPerHour: { 'am-peak': 121, 'pm-peak': 115 } },
  };
  return {
    version: 4, area: network.id,
    groups: [
      {
        id: 'charter', title: "Within the 2025 neighborhood pilot's limits", note: 'Nothing on the bounding streets or at their intersections, and only temporary measures.', ...meta,
        proposals: [
          mk('one-filter', 'One filter on the busiest cut-through block', 'Closes one block to through cars. It is the lightest change that removes a clear share of cut-through.', [mf(1)], -12, 0, 0),
          mk('filters-limit', 'Three filters and a lower speed limit', 'Closes three blocks to through cars and lowers the limit on the nearest alternate route.', [mf(1), mf(3), mf(4), sl(6)], -38, 22, 3),
        ],
      },
      {
        id: 'unconstrained', title: 'Without those limits', note: 'Every tool except new traffic lights, anywhere in the area. Shown for comparison.', ...meta,
        proposals: [
          mk('one-filter', 'One filter on the busiest cut-through block', 'Closes one block to through cars. It is the lightest change that removes a clear share of cut-through.', [mf(1)], -12, 0, 0),
          mk('two-filters-hump', 'Two filters and a speed hump', 'Closes two blocks to through cars and slows the street that picks up the diverted trips.', [mf(1), mf(3), { type: 'speed_hump', link: L(5), position: 20 }], -24, 8, 1),
          mk('filters-limit', 'Three filters and a lower speed limit', 'Closes three blocks to through cars and lowers the limit on the nearest alternate route.', [mf(1), mf(3), mf(4), sl(6)], -38, 22, 3),
          mk('filters-diverter', 'Four filters and one diverter', 'Breaks up the main routes through the neighborhood with four closures and one diagonal diverter.', [mf(1), mf(3), mf(4), mf(7), dd(2, 45)], -51, 31, 5),
          mk('widest', 'Six changes across the interior', 'The strongest package found. It removes most cut-through and moves some of it to a few streets.', [mf(1), mf(3), mf(4), mf(7), dd(2, 45), dd(5, 135)], -63, 47, 7),
          mk('earlier-62nd-diverters', 'Diagonal diverters on 62nd Street at Hillegass and Colby', 'Two diagonal diverters on 62nd Street.', [dd(3, 45), dd(6, 135)], -29, 58, 6, {
            kind: 'reference', note: 'A package proposed earlier that many residents did not support. Shown for comparison.',
          }),
        ],
      },
    ],
  };
}
