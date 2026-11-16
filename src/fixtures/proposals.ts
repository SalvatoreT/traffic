import type { Intervention, Network } from '../types';
import { buildIndex } from '../lib/naming';
import { describeIntervention } from '../lib/describe';
import { encodeScenario } from '../lib/hash';
import { REPORT_METHOD, type Effect, type Proposal, type Proposals, type Variant as Tweak } from '../lib/proposals';

/** `legacy` is the version 4 shape: figures only, with no provenance, intervals or largest-increase block. */
type Variant = 'fresh' | 'stale' | 'legacy';

const SEEDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
/** An effect with a symmetric interval around `mean`, its status read from the interval the way the search does. */
const eff = (mean: number, half: number, n = SEEDS.length): Effect => {
  const lo = mean - half, hi = mean + half;
  return { n, mean, sd: +(half * Math.sqrt(n) / 2.262).toFixed(2), interval: [+lo.toFixed(2), +hi.toFixed(2)], status: n < 10 ? 'insufficient' : lo > 0 ? 'increase' : hi < 0 ? 'decrease' : 'unresolved' };
};

/** Plausible values in the published shape, with links encoded against whatever network is loaded. Dev and tests only. */
export function buildMockProposals(network: Network, computed: { networkHash: string; demandHash: string; calibration: string; simulator?: string }, variant: Variant = 'fresh'): Proposals {
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
    const legacy = variant === 'legacy';
    const period = (k: number, w: number) => {
      const baseP = Math.round(base * (1 + (k - 1) * 0.04)), pct = cut * k;
      const scenP = +(baseP * (1 + pct / 100)).toFixed(1);
      const gain = w > 0 ? w * 2.2 : -3;
      const cutThrough = { baselineVehPerHour: baseP, scenarioVehPerHour: scenP, changePct: +pct.toFixed(1) };
      if (legacy) return { cutThrough, allTraffic: { worstBlock: BLOCK, baselineVehPerHour: 240, scenarioVehPerHour: +(240 + gain).toFixed(1), throughIncreaseVehPerHour: +(w * 0.4).toFixed(1), blocksAboveNoise: blocks } };
      return {
        cutThrough: { ...cutThrough, effect: eff(+(scenP - baseP).toFixed(1), 6) },
        allTraffic: {
          largestIncrease: { block: BLOCK, baselineVehPerHour: 240, scenarioVehPerHour: +(240 + gain).toFixed(1), increaseVehPerHour: +gain.toFixed(1), throughIncreaseVehPerHour: +(w * 0.4).toFixed(1), effect: eff(+gain.toFixed(1), w > 0 ? Math.max(2, w * 0.6) : 4) },
          adjustedPenalty: { block: blocks > 0 ? BLOCK : null, penaltyVehPerHour: blocks > 0 ? +(w * 0.8).toFixed(1) : 0 },
          blocksAboveBand: blocks,
        },
      };
    };
    const through = legacy
      ? { worstBlock: worst > 0 ? BLOCK : '', increaseVehPerHour: +(worst * 0.4).toFixed(1), blocksAboveNoise: blocks }
      : {
        largestIncrease: { block: BLOCK, baselineVehPerHour: 14, scenarioVehPerHour: +(14 + worst * 0.4).toFixed(1), increaseVehPerHour: +(worst * 0.4).toFixed(1), effect: eff(+(worst * 0.4).toFixed(1), worst > 0 ? Math.max(2, worst * 0.3) : 3) },
        adjustedPenalty: { block: blocks > 0 ? BLOCK : null, penaltyVehPerHour: blocks > 0 ? +(worst * 0.8).toFixed(1) : 0 },
        blocksAboveBand: blocks, blocksResolvedIncrease: Math.min(blocks, 2),
      };
    return {
      id, title, summary,
      link: encodeScenario(network, ivs, { area: network.id }),
      interventions: ivs.map((iv) => ({ type: iv.type, label: describeIntervention(iv, network, idx) })),
      cutThrough: legacy
        ? { baselineVehPerHour: base, scenarioVehPerHour: +(base * (1 + cut / 100)).toFixed(1), changePct: cut }
        : { baselineVehPerHour: base, scenarioVehPerHour: +(base * (1 + cut / 100)).toFixed(1), changePct: cut, effect: eff(+(base * cut / 100).toFixed(1), 5), changePctEffect: eff(cut, 4) },
      harm: { through } as Proposal['harm'],
      context: {
        boundingStreets: [
          { name: 'Telegraph Avenue', flowChangePct: -cut / 12, speedChangeMph: -0.2 },
          { name: 'College Avenue', flowChangePct: -cut / 9, speedChangeMph: -0.3 },
          { name: 'Claremont Avenue', flowChangePct: 1.4, speedChangeMph: 0 },
          { name: 'Alcatraz Avenue', flowChangePct: 2.1, speedChangeMph: -0.1 },
        ],
        insideTripTimeChangePct: Math.abs(cut) / 10, pedConflictsChangePct: cut / 5, bikeConflictsChangePct: cut / 6,
      },
      byPeriod: { 'am-peak': period(1.1, worst), 'pm-peak': period(0.9, Math.max(0, worst - 4)) } as Proposal['byPeriod'],
      ...(legacy ? {} : { evidence: { role: 'selection' as const, seeds: SEEDS, baselineVehPerHour: { 'am-peak': SEEDS.map(() => base), 'pm-peak': SEEDS.map(() => base) }, scenarioVehPerHour: { 'am-peak': SEEDS.map(() => base * (1 + cut / 100)), 'pm-peak': SEEDS.map(() => base * (1 + cut / 100)) } } }),
      ...extra,
    };
  };
  const tweak = (ivs: Intervention[], differs: string[], cut: number): Tweak => ({
    link: encodeScenario(network, ivs, { area: network.id }), differs, why: 'same-places', origin: { kind: 'search' },
    ...(variant === 'legacy' ? {} : { cutThrough: { baselineVehPerHour: 118, scenarioVehPerHour: +(118 * (1 + cut / 100)).toFixed(1), changePct: cut, role: 'selection', seeds: SEEDS } }),
  });
  const stale = variant === 'stale', legacy = variant === 'legacy';
  const { simulator, ...inputs } = computed;
  const meta = {
    computed: {
      date: '2026-11-12', periods: ['am-peak', 'pm-peak'], seeds: legacy ? [1, 2, 3, 4] : SEEDS, minutes: 60, ...inputs, networkHash: stale ? 'deadbeefdeadbeef' : computed.networkHash,
      ...(legacy ? {} : {
        simulator: simulator ?? 'mocksimulator0001', reportMethod: REPORT_METHOD, sourceRevision: '0123456789ab', settings: { beam: 3, depth: 8, minutes: 60 },
        estimation: { method: 'Student t interval on per-seed differences', level: 0.95, minPairs: 10, aggregation: 'Equal-weight mean of the periods within each seed.', scope: 'Seed variability only.', maximum: 'Chosen after looking at all blocks.', practicalFloors: 'Assumed dead bands.', selection: { estimates: 'exploratory' as const, discoverySeeds: SEEDS, confirmationSeeds: [], shortlist: [] } },
      }),
    },
    baseline: { cutThroughVehPerHour: { 'am-peak': 121, 'pm-peak': 115 } },
  };
  return {
    version: legacy ? 4 : 5, area: network.id,
    groups: [
      {
        id: 'unconstrained', title: 'Proposals', note: '', ...meta,
        proposals: [
          mk('one-filter', 'One filter on the busiest cut-through block', 'Closes one block to through cars. It is the lightest change that removes a clear share of cut-through.', [mf(1)], -12, 0, 0, { variants: [tweak([mf(2)], ['Use the filter on the next block instead'], -11), tweak([mf(1), mf(2)], ['Add: a second filter on the next block'], -13)] }),
          mk('two-filters-hump', 'Two filters and a speed hump', 'Closes two blocks to through cars and slows the street that picks up the diverted trips.', [mf(1), mf(3), { type: 'speed_hump', link: L(5), position: 20 }], -24, 8, 1),
          mk('filters-limit', 'Three filters and a lower speed limit', 'Closes three blocks to through cars and lowers the limit on the nearest alternate route.', [mf(1), mf(3), mf(4), sl(6)], -38, 22, 3),
          mk('filters-diverter', 'Four filters and one diverter', 'Breaks up the main routes through the neighborhood with four closures and one diagonal diverter.', [mf(1), mf(3), mf(4), mf(7), dd(2, 45)], -51, 31, 5, { variants: [tweak([mf(1), mf(3), mf(4), mf(7), dd(5, 45)], ['Use a diagonal diverter at the next junction instead of the first'], -50), tweak([mf(1), mf(3), mf(4), dd(2, 45)], ['Drop: the fourth filter'], -49), tweak([mf(1), mf(3), mf(5), mf(7), dd(2, 45)], ['Use the filter on the next block instead of the third'], -50), tweak([mf(1), mf(3), mf(4), mf(7)], ['Drop: the diverter'], -48)] }),
          mk('widest', 'Six changes across the interior', 'The strongest package found. It removes most cut-through and moves some of it to a few streets.', [mf(1), mf(3), mf(4), mf(7), dd(2, 45), dd(5, 135)], -63, 47, 7),
          mk('earlier-62nd-diverters', 'Diagonal diverters on 62nd Street at Hillegass and Colby', 'Two diagonal diverters on 62nd Street.', [dd(3, 45), dd(6, 135)], -29, 58, 6, {
            kind: 'reference', note: 'A package proposed earlier that many residents did not support. Shown for comparison.',
          }),
        ],
      },
    ],
  };
}
