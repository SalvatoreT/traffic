import type { AreaEntry, Demand, Intervention, Network } from '../../src/types';
import { aggregate } from '../../src/lib/change';
import { calibrationStatusText } from '../../src/lib/caveat';
import { decodeScenario } from '../../src/lib/hash';
import { buildIndex, type NetIndex } from '../../src/lib/naming';
import { buildBaseMap, buildPicture, cardPicture, pathOf, wholeChange, type PictureModel } from '../../src/lib/picture';
import { bestForText, evidenceStatus, linkHash, signedPct, type EvidenceStatus, type LoadedHashes, type Proposal, type Proposals } from '../../src/lib/proposals';
import { signedCars } from '../../src/lib/proposal-map';
import { OVERLAY_TOP, quantizeIntensity } from '../../src/lib/ramps';
import { VIEWS, titleFor, type View } from '../../src/lib/route';
import { defaultPeriod } from '../../src/lib/run';
import { pathOfSlug, publishedList } from '../../src/lib/share-path';
import { linkStatsView } from '../../src/types';
import type { CardInput } from './og-card';

const NUMBER_WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
export const numberWord = (n: number): string => NUMBER_WORDS[n] ?? String(n);
const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const plural = (n: number, one: string, many = `${one}s`) => `${n === 1 ? one : many}`;
/** "PM peak" from "PM peak (16:00-18:00 weekday, hourly rate)". */
export const shortPeriod = (label: string): string => label.replace(/\s*\(.*\)\s*$/, '');

/**
 * "Two changes: A; B." Each label is cut to what fits `budget` characters, and the rest are counted: "Six changes: A; B; and 4 more."
 * At least the first change is always named.
 */
export function changesSentence(labels: string[], budget = 120): string {
  const n = labels.length;
  if (n === 0) return '';
  const head = `${capital(numberWord(n))} ${plural(n, 'change')}: `;
  const shown: string[] = [];
  for (const l of labels) {
    const next = [...shown, l];
    const rest = n - next.length;
    const text = `${head}${next.join('; ')}${rest > 0 ? `; and ${rest} more` : ''}.`;
    if (shown.length > 0 && text.length > budget) break;
    shown.push(l);
  }
  const rest = n - shown.length;
  return `${head}${shown.join('; ')}${rest > 0 ? `; and ${rest} more` : ''}.`;
}

/** A change label up to its first comma: the long ones go on to say which legs a diverter joins. */
export const firstClause = (label: string): string => label.replace(/,.*$/, '');
const DESCRIPTION_BEFORE_CAVEAT = 210;

export interface Figure { pct: number; before: number; after: number; averaged: boolean }
/** The through-car figure for the period the card's map shows, like for like; the card's average over the searched periods when it has none for that period. */
export function proposalFigure(p: Proposal): Figure {
  const r = p.picture ? p.byPeriod[p.picture.period]?.cutThrough : undefined;
  const c = r ?? p.cutThrough;
  return { pct: c.changePct, before: Math.round(c.baselineVehPerHour), after: Math.round(c.scenarioVehPerHour), averaged: !r };
}
export const bigPct = (pct: number, before: number, after: number): string => (before === after ? 'No change' : signedPct(pct));
const toneOf = (before: number, after: number) => (after < before ? 'down' : after > before ? 'up' : 'flat') as 'down' | 'up' | 'flat';

/** What a proposal card's map shows, in words: which cars the colors count and the labeled blocks. Through cars only for a file without an all-car picture. */
export function mapAlt(areaName: string, card: ReturnType<typeof cardPicture>, when: string): string {
  if (card.kind === 'through') return `Map of ${areaName} with this proposal's changes drawn on the streets, blue where through cars drop and orange where they rise.`;
  const { gain, drop } = card.facts;
  const part = (what: string, c: NonNullable<typeof gain>) => `the biggest ${what}, ${signedCars(wholeChange(c))} cars an hour, is labeled on ${c.label}`;
  const named = [gain ? part('gain', gain) : '', drop ? part('drop', drop) : ''].filter(Boolean).join('; ');
  return `Map of ${areaName} with this proposal's changes drawn on the streets. Colors and numbers are the change in all cars an hour on each block (through cars and local trips together), blue where all cars drop and orange where they rise${named ? `; ${named}` : ''}.`;
}

export interface PageMeta { title: string; description: string; imageAlt: string }
export interface Plan { path: string; name: string; meta: PageMeta; card: CardInput }

export interface BaselineInput { period: string; linkStats: Float32Array; throughVph: number }
export interface PreviewInput {
  siteHost: string;
  area: AreaEntry; network: Network; demand: Demand; hashes: { network: string; demand: string }; simulator?: string | null;
  proposals: Proposals | null;
  /** A stored baseline that was computed on the current inputs, or null. */
  baseline: BaselineInput | null;
}
export interface PreviewPlans { plans: Plan[]; fallback: Plan; skipped: string[] }

const BOOST = 2;

/** Today's through cars on each block, both directions together, on the map's fixed scale, as a drawing model. */
export function todayModel(net: Network, index: NetIndex, linkStats: Float32Array | null): PictureModel {
  const base = buildBaseMap(net);
  const view = linkStatsView(linkStats);
  const blocks = linkStats === null ? [] : index.blocks.flatMap((b, i) => {
    const cut = aggregate(view, b.links).cut;
    if (!(cut > 0)) return [];
    return [{ block: i, d: pathOf(net.links[b.links[0]].geometry), delta: cut, t: quantizeIntensity(Math.min(1, cut / OVERLAY_TOP.cutthrough)) }];
  }).sort((a, b) => a.t - b.t);
  return { ...base, blocks, marks: [], pins: [], bar: { len: 0, thick: 0 } };
}

const tabSummary = (view: View, area: string, status: string): string => {
  switch (view) {
    case 'streets': return `One row per street block in ${area}: simulated cars an hour, through cars and speed, as a text alternative to the map.`;
    case 'methodology': return `How the simulation of ${area} and its proposals are made, in plain language, and what it cannot tell you. ${status}`;
    case 'assumptions': return `The judgment calls behind the model: why cars cut through ${area}, and which turn movements are assumed. ${status}`;
    case 'sources': return `The data behind the simulation of ${area} and how its baseline compares with observed traffic. ${status}`;
    default: return '';
  }
};

export function planPreviews(inp: PreviewInput): PreviewPlans {
  const { area, network, demand } = inp;
  const index = buildIndex(network);
  const status = calibrationStatusText(area.calibration);
  const periodLabel = (id: string) => shortPeriod(demand.periods.find((p) => p.id === id)?.label ?? id);
  const skipped: string[] = [];
  const caveat = `Simulation, not a forecast. ${status}`;
  const footer = [`Simulation, not a forecast`, status, inp.siteHost];
  const today = todayModel(network, index, inp.baseline?.linkStats ?? null);
  const homeMap: CardInput['map'] = { model: today, sequential: true, boost: BOOST, key: inp.baseline ? 'today' : 'none' };
  const homePeriod = inp.baseline ? periodLabel(inp.baseline.period) : null;
  const throughNow = inp.baseline ? Math.round(inp.baseline.throughVph) : null;
  const mapWords = inp.baseline
    ? `Map of ${area.name} in the ${homePeriod}: streets shaded darker where more through cars cut across the side streets today.`
    : `Map of ${area.name}.`;

  // Proposals first: how many are published decides what the Proposals tab says.
  const proposalPlans: Plan[] = [];
  const published = inp.proposals ? (() => { try { return publishedList(inp.proposals!); } catch (e) { skipped.push(`all proposals: ${(e as Error).message}`); return []; } })() : [];
  for (const { slug, group, proposal: p } of published) {
    const where = `${group.id}/${p.id}`;
    const evidence = evidenceStatus(group.computed, { ...inp.hashes, simulator: inp.simulator ?? null });
    if (evidence.state === 'stale') { skipped.push(`${where}: computed on another ${evidence.stale.join(' and ')}`); continue; }
    if (!p.picture) { skipped.push(`${where}: no picture, so no map for the card`); continue; }
    let ivs: Intervention[] = [];
    try { ivs = decodeScenario(network, linkHash(p.link)).interventions; } catch { /* drawn without its marks */ }
    if (ivs.length === 0) { skipped.push(`${where}: its link does not place on this network`); continue; }
    const card = cardPicture(p, p.picture, index);
    const model = buildPicture(network, index, p, card.pic, ivs, card.facts, card.kind);
    const fig = proposalFigure(p);
    const period = periodLabel(p.picture.period);
    const periodWords = fig.averaged ? 'average of the searched periods' : period;
    const pctText = signedPct(fig.pct);
    const changes = p.interventions.map((iv) => iv.label);
    const runs = group.computed.seeds.length;
    const mean = runs > 1 ? `, mean of ${runs} runs` : runs === 1 ? ', one run' : '';
    const lead = `Simulated ${periodWords}${mean}: through cars on side streets ${fig.before} → ${fig.after} an hour (${pctText}).`;
    const sentence = changesSentence(changes.map(firstClause), Math.max(70, DESCRIPTION_BEFORE_CAVEAT - lead.length));
    const description = `${lead} ${sentence} ${caveat}${evidence.state === 'unverified' ? ' Figures not verified against the current simulator.' : ''}`;
    const big = bigPct(fig.pct, fig.before, fig.after);
    const nChanges = `${capital(numberWord(changes.length))} ${plural(changes.length, 'change')}`;
    const alt = [
      `${p.title}.`,
      fig.before === fig.after ? `Simulated ${periodWords}${mean}: no change in through cars on the side streets, ${fig.before} an hour.` : `Simulated ${periodWords}${mean}: through cars on the side streets go from ${fig.before} to ${fig.after} an hour (${pctText}).`,
      `${nChanges}.`,
      ...(bestForText(p) ? [`${bestForText(p)}.`] : []),
      mapAlt(area.name, card, periodWords),
      'Simulation, not a forecast.',
    ].join(' ');
    proposalPlans.push({
      path: pathOfSlug(slug), name: `p-${slug}`, meta: { title: p.title, description, imageAlt: alt },
      card: {
        kicker: area.name, title: p.title,
        big: { figure: big, label: `through cars, ${periodWords}`, tone: toneOf(fig.before, fig.after) },
        lines: [`${fig.before} → ${fig.after} an hour`, nChanges],
        footer, map: { model, sequential: false, boost: BOOST, key: card.kind === 'all' ? 'change-all' : 'change', pins: card.kind === 'all' },
      },
    });
  }

  const counts = proposalPlans.length === 0 ? [] : published.filter((x) => proposalPlans.some((q) => q.path === pathOfSlug(x.slug))).map((x) => x.proposal.interventions.length);
  const lo = Math.min(...counts), hi = Math.max(...counts);
  const proposalsSummary = proposalPlans.length === 0
    ? `Packages of street changes for ${area.name}, found by searching the simulation. None are published right now. ${caveat}`
    : `${proposalPlans.length} ${plural(proposalPlans.length, 'package')} of street changes, ${lo === hi ? `${numberWord(lo)} ${plural(lo, 'change')} each` : `from ${numberWord(lo)} ${plural(lo, 'change')} to ${numberWord(hi)}`}, with simulated cut-through before and after. ${caveat}`;

  const tabs: Plan[] = VIEWS.map((v) => {
    const isMap = v.id === 'map';
    const title = isMap ? `Traffic: ${area.name}` : titleFor(v.id, area.name);
    const description = isMap
      ? `${throughNow !== null ? `Simulated ${homePeriod} today: about ${throughNow} through cars an hour cut across the side streets of ${area.name}. ` : `A simulation of neighborhood traffic in ${area.name} as it is today. `}Try filters, stops and one-way streets and compare the result. ${caveat}`
      : v.id === 'proposals' ? proposalsSummary : tabSummary(v.id, area.name, caveat);
    const full = description.includes('not a forecast') ? description : `${description} ${caveat}`;
    const card: CardInput = isMap
      ? {
        kicker: area.name, title: 'Neighborhood traffic simulator',
        big: throughNow !== null ? { figure: String(throughNow), label: `through cars an hour on the side streets, ${homePeriod} today`, tone: 'today' } : null,
        lines: ['Try street changes and compare.'], footer, map: homeMap,
      }
      : v.id === 'proposals'
        ? {
          kicker: area.name, title: 'Street changes to try',
          big: proposalPlans.length > 0 ? { figure: String(proposalPlans.length), label: `${plural(proposalPlans.length, 'package')} of changes, each with simulated results`, tone: 'today' } : null,
          lines: proposalPlans.length > 0 ? [] : ['Computed by searching the simulation.'], footer, map: homeMap,
        }
        : { kicker: area.name, title: v.label, big: null, lines: [full.split('. ').slice(0, 1).join('. ').replace(/\.?$/, '.')], footer, map: homeMap };
    const alt = cardAltFor(isMap || v.id === 'proposals' ? title : `${v.label}, ${area.name}`, card, mapWords);
    return { path: v.path, name: isMap ? 'home' : v.id, meta: { title, description: full, imageAlt: alt }, card };
  });

  const home = tabs[0];
  const fallback: Plan = { path: '*', name: 'site', meta: { ...home.meta }, card: home.card };
  return { plans: [...tabs, ...proposalPlans], fallback, skipped };
}

function cardAltFor(label: string, card: CardInput, mapWords: string): string {
  const parts = [`${label}.`];
  if (card.big) parts.push(`${card.big.figure} ${card.big.label}.`);
  parts.push(...card.lines.map((l) => (l.endsWith('.') ? l : `${l}.`)), mapWords, 'Simulation, not a forecast.');
  return parts.join(' ');
}
