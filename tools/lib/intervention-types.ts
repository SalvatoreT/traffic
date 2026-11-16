import { SIGNAL_CYCLES_S, SPEED_LIMITS_MPH } from '../../src/lib/selection';
import { ITEM_CODES } from '../../src/lib/hash';

/** What each intervention type means, in the app's own terms. The CLI's `--list-interventions` and the generated llms-full.txt both print this. */
export interface InterventionType {
  type: string;
  /** Link item codes that make this type. */
  codes: string[];
  name: string;
  appliesTo: 'street block' | 'intersection';
  /** Where the item's geohash points. */
  at: string;
  /** Parameters after the geohash, in order. */
  params: string;
  json: string;
  effect: string;
  offered: string;
}

const mph = SPEED_LIMITS_MPH.join(', ');
const cycles = SIGNAL_CYCLES_S.join(', ');

export const INTERVENTION_TYPES: InterventionType[] = [
  {
    type: 'modal_filter', codes: ['mf'], name: 'Modal filter on a street block', appliesTo: 'street block', at: 'the middle of the block', params: 'none',
    json: '{"type":"modal_filter","link":<link id>}',
    effect: 'Cars cannot drive along the block, in either direction. People walking and cycling still pass. Routes adapt, so trips that used the block take other streets.',
    offered: 'Every block.',
  },
  {
    type: 'modal_filter', codes: ['mn'], name: 'Modal filter at an intersection', appliesTo: 'intersection', at: 'the intersection',
    params: 'optional: the bearings, in whole degrees joined by ".", of the legs it closes (for example 90.270). Absent: every leg.',
    json: '{"type":"modal_filter","node":<node id>} or {"type":"modal_filter","node":<node id>,"legs":[<link ids on the closed legs>]}',
    effect: 'With no legs named, cars cannot pass between any two legs of the intersection. With legs named, cars cannot enter or leave by those legs and every other movement stays open (a junction the model merged from two offset junctions can then close one street and keep the other). Naming either direction of a leg closes both. People walking and cycling still pass.',
    offered: 'Every intersection; at a junction of several streets the app offers a filter per street that leaves at least two other legs connected, as well as the whole junction.',
  },
  {
    type: 'speed_limit', codes: ['sl'], name: 'Speed limit on a street block', appliesTo: 'street block', at: 'the middle of the block', params: 'the limit in meters per second (mph divided by 2.23694), 1 to 40',
    json: '{"type":"speed_limit","link":<link id>,"speed":<m/s>}',
    effect: 'Changes the desired speed of cars on the block, in both directions of a two-way block.',
    offered: `${mph} mph (UI choices, not published recommendations).`,
  },
  {
    type: 'slow_street', codes: ['ss'], name: 'Slow Street', appliesTo: 'street block', at: 'the middle of any block of the street (the whole street is limited)', params: 'none',
    json: '{"type":"slow_street","link":<link id of any block of the street>}',
    effect: 'Limits every block of that street inside the study area to 15 mph, as one change. The street is its name; a gap or a rename ends it, so only the connected run that holds the chosen block counts. A block already at or below 15 mph keeps its limit. ASSUMPTION: full compliance on average. Each car\'s desired speed scales to the limit with the model\'s usual spread, with no enforcement and no physical measure, and the street\'s free-flow time rises, so some trips take other routes.',
    offered: 'One per street that carries meaningful through traffic in the baseline.',
  },
  {
    type: 'speed_hump', codes: ['sh'], name: 'Speed hump', appliesTo: 'street block', at: 'the hump itself', params: 'none',
    json: '{"type":"speed_hump","link":<link id>,"position":<meters from the start of the link>}',
    effect: 'Cars slow to the hump crossing speed near the hump, which raises the block\'s travel time. One hump per block; adding another moves it.',
    offered: 'Every block; the app puts it at the clicked point and the CLI at mid-block.',
  },
  {
    type: 'traffic_circle', codes: ['tc'], name: 'Traffic circle', appliesTo: 'intersection', at: 'the intersection', params: 'none',
    json: '{"type":"traffic_circle","node":<node id>}',
    effect: 'Replaces the intersection\'s control with yield-on-entry at reduced negotiation speed [Rodegerdts2010].',
    offered: 'Every intersection that is not one already.',
  },
  {
    type: 'control', codes: ['ct'], name: 'Intersection control', appliesTo: 'intersection', at: 'the intersection',
    params: 'a letter: s traffic signal, a all-way stop, t two-way stop, u uncontrolled, c traffic circle',
    json: '{"type":"control","node":<node id>,"control":"signal"|"all_way_stop"|"two_way_stop"|"uncontrolled"|"traffic_circle"}',
    effect: 'Sets the node\'s control. A new signal runs a Webster-derived plan whose splits adapt to measured flows [Webster1958]; stops use gap acceptance [Brilon1999].',
    offered: 'All-way stop, two-way stop, traffic signal and uncontrolled, other than the current control.',
  },
  {
    type: 'signal_timing', codes: ['st'], name: 'Signal cycle', appliesTo: 'intersection', at: 'the signal', params: 'the cycle in seconds, 20 to 240',
    json: '{"type":"signal_timing","node":<node id>,"cycle":<seconds>}',
    effect: 'Pins the signal\'s cycle length; the green splits keep adapting to measured flows.',
    offered: `${cycles} s, at signals.`,
  },
  {
    type: 'one_way', codes: ['ow'], name: 'One-way street', appliesTo: 'street block', at: 'the middle of the block', params: 'the bearing of the direction that stays open, in degrees clockwise from north (rounded to 5)',
    json: '{"type":"one_way","link":<link id of the direction that stays open>}',
    effect: 'The block carries cars only in the kept direction; routing respects it.',
    offered: 'Two-way blocks, one choice per direction.',
  },
  {
    type: 'turn_ban', codes: ['tb'], name: 'Turn ban', appliesTo: 'intersection', at: 'the intersection', params: 'the bearing of the arriving link as it reaches the intersection, then the bearing of the leaving link as it leaves it (degrees clockwise from north, rounded to 5)',
    json: '{"type":"turn_ban","fromLink":<arriving link id>,"toLink":<leaving link id>}',
    effect: 'No route uses the arriving link followed by the leaving link.',
    offered: 'Each arriving link with each leaving link that is not a U-turn.',
  },
  {
    type: 'diagonal_diverter', codes: ['dd'], name: 'Diagonal diverter', appliesTo: 'intersection', at: 'the intersection', params: 'the barrier line\'s bearing in whole degrees, 0 to 179',
    json: '{"type":"diagonal_diverter","node":<node id>,"bearing":<0 to 179>}',
    effect: 'A barrier line runs through a four-leg intersection. Cars may only turn between the two legs on the same side of it, so neither street can be driven straight through and every street stays reachable. People walking and cycling pass in any direction.',
    offered: 'Four-leg intersections; two orientations.',
  },
];

export const DOC_CODES = [...new Set(INTERVENTION_TYPES.flatMap((t) => t.codes))];
export const codesMatchGrammar = (): boolean => DOC_CODES.length === ITEM_CODES.length && ITEM_CODES.every((c) => DOC_CODES.includes(c));
