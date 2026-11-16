import type { Calibration } from '../types';
import { calibrationStatusText } from './caveat';

/** The Methodology tab's words, kept here so the generated text page (tools/build-llms.ts) and the component read the same copy. */

export interface Step { label: string[]; text: string }

export const METHOD_TITLE = 'Methodology';

export const whatThisIs = (area: string): string[] => [
  `This is a computer simulation of every car trip in and around ${area} for one hour. It answers one question: what happens to cut-through traffic if we change the streets?`,
  'It is a simulation, not a forecast. It shows how today\'s traffic would shift when a street changes.',
];

export const BUILD_INTRO = 'Four steps build the traffic the simulation starts from.';
export const BUILD_STEPS: Step[] = [
  { label: ['Street map'], text: 'The street map comes from OpenStreetMap, a free public map. It becomes a network of blocks, signals and stop signs.' },
  { label: ['Traffic counts'], text: 'City and state traffic counts, plus a resident volunteer count from one day, tell us how many trips to create and where they go.' },
  { label: ['Route choice'], text: 'Each simulated driver picks the route that looks fastest to them, with a little personal variation. Some switch when a clearly faster way opens up.' },
  { label: ['Driving'], text: 'Cars follow each other, queue at signals and yield at junctions.' },
];
export const BUILD_ALT = { title: 'Four steps that build today\'s traffic', desc: 'Street map, traffic counts, route choice, then driving, each leading to the next.' };

export const CUT_INTRO = 'A cut-through car has a trip that neither starts nor ends in the study area, and it drives on a side street inside it. Each car counts once, however many side streets it uses. We report cars an hour.';
export const CUT_TRIPS = [
  { n: 1, text: 'Cuts through. It starts and ends outside the area and crosses on side streets. Counted.' },
  { n: 2, text: 'Local trip. It ends inside the area, for example someone driving home. Not counted.' },
  { n: 3, text: 'Stays on a bounding street, a main road around the area. Not counted.' },
];
export const CUT_ALT = { title: 'Three trips and the study area', desc: 'An outline marks the study area, with a bounding street along each edge. Trip 1, drawn as a solid line, enters from the left, crosses on side streets and leaves on the right. Trip 2, a dashed line, enters from the top and ends at a point inside. Trip 3, a dotted line, runs along the bounding street at the bottom without entering.' };

export const CHECK_INTRO = 'We compare the simulation with traffic counts and with basic engineering checks, such as how many cars one signal can pass in an hour. We hold back about a quarter of the count locations when fitting trips and test against them. Earlier tuning rounds saw those scores, so this is a check, not a fully independent test.';
export const checkStatus = (cal: Calibration | undefined): { status: string; note: string | null } => ({ status: calibrationStatusText(cal), note: cal?.note?.trim() || null });
export const CHECK_MORE_LEAD = 'The judgment calls are on the';
export const CHECK_MORE_MID = 'tab and the data and results of the checks are on the';
export const CHECK_MORE_TAIL = 'tab.';

export const PROPOSAL_INTRO = 'A computer search builds proposals in five steps.';
export const PROPOSAL_STEPS: Step[] = [
  { label: ['Try changes'], text: 'It tries packages of changes: filters, diverters, one-way streets, stop signs and more. It starts at the places with the most cut-through traffic and adds one change at a time.' },
  { label: ['Score each'], text: 'Each package scores by the cut-through cars it removes. It loses points when it pushes more cars onto any one block.' },
  { label: ['Keep the best'], text: 'It keeps the best few. Near-duplicates fold into one option and become its variants.' },
  { label: ['Retest on new seeds'], text: 'It reruns the shortlist on fresh random seeds it has not seen. A seed is one random draw of driver variation. This keeps luck from flattering the published numbers.' },
  { label: ['Sort the list'], text: 'The list is sorted by cut-through cars removed, most first.' },
];
export const PROPOSAL_ALT = { title: 'Five steps that make a proposal list', desc: 'Try changes, score each, keep the best, retest on new seeds, then sort the list, each leading to the next.' };

export const LIMITS_INTRO = 'Keep these limits in mind.';
export const LIMITS: string[] = [
  'Demand is fixed. The same trips happen before and after a change. People do not skip trips, switch to walking or biking, or drive at another time, though cars can take other routes.',
  'Each period covers one typical weekday hour, not weekends or other seasons.',
  'Judgment calls are labeled as assumptions.',
  'Numbers are for comparing scenarios. They are not predictions.',
];

export const CUT_TRIP_STYLES = ['solid line', 'dashed line', 'dotted line'] as const;

/** Every sentence a reader sees, in order, for the word count and the text page. */
export function methodologyText(area: string, cal: Calibration | undefined): string {
  const c = checkStatus(cal);
  return [
    ...whatThisIs(area),
    BUILD_INTRO, ...BUILD_STEPS.map((s) => `${s.label.join(' ')}. ${s.text}`),
    CUT_INTRO, ...CUT_TRIPS.map((t) => t.text),
    CHECK_INTRO, `${c.status}${c.note ? ` ${c.note}` : ''}`, `${CHECK_MORE_LEAD} Assumptions ${CHECK_MORE_MID} Sources ${CHECK_MORE_TAIL}`,
    PROPOSAL_INTRO, ...PROPOSAL_STEPS.map((s) => `${s.label.join(' ')}. ${s.text}`),
    LIMITS_INTRO, ...LIMITS,
  ].join('\n');
}
