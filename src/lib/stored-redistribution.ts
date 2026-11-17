/**
 * Where the traffic that used a proposal's closures goes, stored per published proposal so a card can show it on hover without running anything.
 * Made by `npm run data:redistribution` with the same trace and accounting as `simulate --redistribution` (`displacement` in redistribution.ts):
 * the baseline's through trips (neither end in the study area) that drove the closed movement within the hour, followed into the proposal's run.
 */
import type { Intervention } from '../types';
import { hashMatches, seedsPhrase } from './proposals';
import { scenarioKey } from './redistribution';

export const STORED_REDIST_VERSION = 1;
export const STORED_REDIST_METHOD = 'displacement-1';
/** Routes and receiving blocks kept per intervention. */
export const STORED_TOP = 4;

export interface StoredRoute {
  /** The streets the followed trips drove within 400 m of the closed junctions, in order. */
  streets: string;
  /** Through cars an hour on this route, mean over the runs. */
  perHour: number;
  /** The links of the route near the closure, for drawing it. */
  links: number[];
}
export interface StoredItem {
  /** `scenarioKey` of the one intervention, so the card finds it whatever the order of its scenario. */
  key: string;
  /** Position in the decoded scenario when the file was made. */
  index: number;
  type: Intervention['type'];
  label: string;
  /** Through cars an hour that drove a movement this intervention closes, in the baseline. */
  usedPerHour: number;
  /** Where those cars were in the proposal's run, cars an hour; the parts add up to `usedPerHour`. */
  perHour: { sideStreets: number; stayOnArterials: number; removed: number; unroutable: number; waiting: number; unmatched: number };
  routes: StoredRoute[];
  /** Side-street blocks the followed cars newly drive, most first. */
  receiving: { block: string; perHour: number }[];
}
export interface StoredRedistribution {
  kind: 'proposal-redistribution';
  version: typeof STORED_REDIST_VERSION;
  method: string;
  area: string; group: string; proposal: string;
  /** The proposal's link, so a file made for another package is not shown. */
  link: string;
  period: string;
  inputs: { networkHash: string; demandHash: string; simulator: string };
  seeds: number[];
  seconds: number;
  computed: string;
  calibration: string;
  items: StoredItem[];
}

export const redistributionUrl = (area: string, group: string, proposal: string) => `/data/redistribution/${area}/${group}.${proposal}.json`;

/** The stored file, or null when it is missing or not in this reader's form. */
export function parseRedistribution(text: string): StoredRedistribution | null {
  let x: unknown;
  try { x = JSON.parse(text); } catch { return null; }
  const r = x as StoredRedistribution | null;
  if (!r || typeof r !== 'object' || r.kind !== 'proposal-redistribution' || r.version !== STORED_REDIST_VERSION || r.method !== STORED_REDIST_METHOD) return null;
  if (!Array.isArray(r.items) || !Array.isArray(r.seeds) || typeof r.link !== 'string') return null;
  return r;
}

export interface RedistWant {
  group: string; proposal: string; link: string; period: string; seeds: number[];
  /** What the card's own figures were computed on. The simulator is null when the app could not check it. */
  inputs: { networkHash: string; demandHash: string; simulator: string | undefined };
  /** What the app has loaded; an input it could not compute is left out of the check. */
  loaded: { network: string | null; demand: string | null; simulator: string | null };
}
export type RedistVerdict = { ok: true } | { ok: false; reason: string };

/** The file applies only when it was made for this proposal's link and period, on the same runs and inputs as the card's figures and as what is loaded. */
export function redistributionVerdict(r: StoredRedistribution, w: RedistWant): RedistVerdict {
  const no = (reason: string): RedistVerdict => ({ ok: false, reason });
  if (r.group !== w.group || r.proposal !== w.proposal) return no('it is for another proposal');
  if (r.link !== w.link) return no('the proposal changed since it was made');
  if (r.period !== w.period) return no(`it is for ${r.period}, not the picture's period`);
  if (r.seeds.join(',') !== w.seeds.join(',')) return no('it was made on other runs than the card\'s figures');
  if (!hashMatches(w.inputs.networkHash, r.inputs.networkHash) && !hashMatches(r.inputs.networkHash, w.inputs.networkHash)) return no('the street network changed');
  if (!hashMatches(w.inputs.demandHash, r.inputs.demandHash) && !hashMatches(r.inputs.demandHash, w.inputs.demandHash)) return no('the demand changed');
  if (w.inputs.simulator && r.inputs.simulator !== w.inputs.simulator) return no('it was made by another simulator version');
  if (w.loaded.network !== null && !hashMatches(r.inputs.networkHash, w.loaded.network)) return no('it was made on another street network than the one loaded');
  if (w.loaded.demand !== null && !hashMatches(r.inputs.demandHash, w.loaded.demand)) return no('it was made on another demand than the one loaded');
  if (w.loaded.simulator !== null && r.inputs.simulator !== w.loaded.simulator) return no('it was made by another simulator version than the one loaded');
  return { ok: true };
}

export const itemFor = (r: StoredRedistribution, iv: Intervention): StoredItem | undefined => {
  const k = scenarioKey([iv]);
  return r.items.find((x) => x.key === k);
};

const round = (n: number) => Math.round(n);
const carsAnHour = (n: number) => (n > 0 && n < 0.5 ? 'under one car an hour' : `${round(n)} ${round(n) === 1 ? 'car' : 'cars'} an hour`);

function viaPhrase(routes: StoredRoute[]): string {
  const near = routes.filter((r) => r.streets && r.perHour >= 0.5).slice(0, 2);
  if (near.length === 0) return '';
  return near.map((r) => `${r.streets} (${round(r.perHour)} an hour)`).join(' and ');
}

/** One line for the hover: how many used the closed movement, where most go, and how many do not newly drive any side street. */
export function redistributionLine(item: StoredItem, when: string): string {
  if (item.usedPerHour < 0.5) return `Almost no through cars used this in the ${when}, so nothing is redirected.`;
  const via = viaPhrase(item.routes);
  const head = `About ${round(item.usedPerHour)} through cars an hour used this in the ${when}.`;
  const goes = via ? ` With the proposal, most go via ${via}.` : ' With the proposal, no single route takes most of them.';
  const leave = item.perHour.stayOnArterials >= 0.5 ? ` ${round(item.perHour.stayOnArterials)} do not newly drive any side street.` : '';
  return `${head}${goes}${leave}`;
}

/** The short form for the map tooltip: how many used the closed movement and the one route most take. */
export function redistributionTip(item: StoredItem): string {
  if (item.usedPerHour < 0.5) return 'Almost no through cars used this.';
  const top = item.routes.find((r) => r.streets && r.perHour >= 0.5);
  return `About ${round(item.usedPerHour)} through cars an hour used this${top ? `; most go via ${top.streets} (${round(top.perHour)} an hour)` : ''}.`;
}

/** The full breakdown, for the list under the map and the text alternative. */
export function redistributionRows(item: StoredItem): { label: string; value: string }[] {
  const p = item.perHour;
  const rows = [
    { label: 'Drive side streets they did not use before', value: carsAnHour(p.sideStreets) },
    { label: 'Stay on bounding streets or streets they already used', value: carsAnHour(p.stayOnArterials) },
  ];
  if (p.removed >= 0.05) rows.push({ label: 'Removed by the simulator (gridlock)', value: carsAnHour(p.removed) });
  if (p.unroutable >= 0.05) rows.push({ label: 'Found no route', value: carsAnHour(p.unroutable) });
  if (p.waiting >= 0.05) rows.push({ label: 'Still waiting to start at the end of the hour', value: carsAnHour(p.waiting) });
  if (p.unmatched >= 0.05) rows.push({ label: 'Could not be followed', value: carsAnHour(p.unmatched) });
  return rows;
}

export const redistributionBasis = (r: StoredRedistribution): string =>
  `Through cars only (no trip starts or ends in the area), followed from today's run into the proposal's run on the same seeds: ${seedsPhrase(r.seeds)}. A simulation of an uncalibrated model, not a forecast.`;
