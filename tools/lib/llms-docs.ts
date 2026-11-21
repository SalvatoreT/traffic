import type { AreaEntry, Demand, Metrics, Network } from '../../src/types';
import { linkStatsView } from '../../src/types';
import { parseRefLinks } from '../../src/lib/ref-links';
import type { StoredIndex, StoredInputs } from '../../src/lib/stored-results';
import type { BaselineIntents } from '../../src/lib/baseline-intents';
import type { AssumptionsFile } from '../../src/lib/assumptions';
import { derivedFactorsSentence, intentShares } from '../../src/lib/assumptions';
import { aggregate, CHANGE_TOP, DEAD_BAND } from '../../src/lib/change';
import { CARDS } from '../../src/lib/metrics';
import { EARLY_NOTE, EARLY_SECONDS, RUN_SECONDS } from '../../src/lib/run';
import { formatValue, type Kind } from '../../src/lib/format';
import { BASIS_HELP, BASIS_TEXT } from '../../src/lib/intents';
import { calibrationCaveat } from '../../src/lib/caveat';
import { buildIndex, type NetIndex } from '../../src/lib/naming';
import { blockMeasured } from '../../src/lib/scope';
import { isLocal } from '../../src/lib/intents';
import { ROUTE_CAVEAT } from '../../src/lib/throughroutes';
import { SPEED_LIMITS_MPH, SIGNAL_CYCLES_S } from '../../src/lib/selection';
import {
  allTrafficHeadline, allTrafficNote, allTrafficRows, beforeAfterPct, comparisonText, cutThroughHeadline, evidenceNote, formatComputed, harmHeadline, hashMatches, INTERVAL_SCOPE, intervalText, linkHash, periodsPhrase,
  provenanceLine, proposalNotices, bestForText, detourText, seedsPhrase, signedNum, signedPct, listOptions, type Proposal, type ProposalGroup, type Proposals,
} from '../../src/lib/proposals';
import {
  ASSUMPTIONS_INTRO, DERIVED_TARGETS_INTRO, EXPLORATORY_NOTE, FIXED_DEMAND_CAVEAT, LEGACY_GROUP_NOTE, MOVEMENTS_INTRO, PROPOSALS_LEAD, SOURCES_CALIBRATED, SOURCES_UNCALIBRATED, STREETS_INTRO,
} from '../../src/lib/copy';
import {
  BUILD_ALT, BUILD_INTRO, BUILD_STEPS, CHECK_INTRO, CUT_ALT, CUT_INTRO, CUT_TRIPS, CUT_TRIP_STYLES, LIMITS, LIMITS_INTRO, PROPOSAL_ALT, PROPOSAL_INTRO, PROPOSAL_STEPS, checkStatus, whatThisIs,
} from '../../src/lib/methodology';
import { pathOfSlug, slugOf } from '../../src/lib/share-path';
import { INTERVENTION_TYPES } from './intervention-types';
import { blockPlace, nodePlace, linkFor } from './describe-network';
import { diverterOptions } from '../../src/lib/diverter';
import { filterChoices } from '../../src/lib/blocked';

/** The honest line every generated page opens with. */
export const NOT_A_FORECAST = 'This is a simulation, not a forecast. Its results are hypotheses to compare against the baseline, and the model is not validated against observed traffic beyond what the calibration notes below say.';

export interface BaselineSet {
  period: string; metrics: Metrics; linkStats: Float32Array;
  key: string; computed: string; inputs: StoredInputs; seed: number; seconds: number;
}
export interface Currency { current: boolean; reasons: string[] }

export interface LlmsInput {
  /** Site origin without a trailing slash, and the public source repository. */
  site: string; repo: string;
  /** ISO timestamp of generation. */
  generated: string;
  area: AreaEntry; network: Network; demand: Demand;
  /** Full SHA-256 hex of the served network and demand files. */
  hashes: { network: string; demand: string };
  /** The simulator build's fingerprint, or null when the WASM package is not built here. */
  simulator: string | null;
  boundary: string[] | null;
  proposals: Proposals | null;
  assumptions: AssumptionsFile | null;
  baselines: Record<string, BaselineSet>;
  baselineIntents: BaselineIntents | null;
  resultsIndex: StoredIndex | null;
  /** Files the pages link to, as /data paths that exist in this publish. */
  dataFiles: string[];
  docs: { scenarioLinks: string; dataFiles: string; runLocally: string; references: string; readme: string; proposalsReadme: string; license: string };
}

// --- small helpers

const short = (h: string) => h.slice(0, 16);
export const shortLabel = (label: string) => label.replace(/\s*\(.*\)\s*$/, '');
const cell = (s: string | number) => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
export function table(head: string[], rows: (string | number)[][]): string {
  return [`| ${head.map(cell).join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...rows.map((r) => `| ${r.map(cell).join(' | ')} |`)].join('\n');
}
const list = (xs: string[]) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** The text under one heading, up to the next heading of the same or higher level, without the heading line. */
export function section(md: string, heading: string): string {
  const lines = md.replace(/\r/g, '').split('\n');
  const level = (l: string) => /^(#{1,6})\s/.exec(l)?.[1].length ?? 0;
  const at = lines.findIndex((l) => level(l) > 0 && l.replace(/^#+\s+/, '').trim() === heading);
  if (at < 0) return '';
  const depth = level(lines[at]);
  let end = lines.length;
  for (let i = at + 1; i < lines.length; i++) if (level(lines[i]) > 0 && level(lines[i]) <= depth) { end = i; break; }
  return lines.slice(at + 1, end).join('\n').trim();
}

/** Writes each `Links:` line of the bibliography as markdown links, so the text pages show labels instead of bare URLs. */
export function linkRefs(md: string): string {
  return md.split('\n').map((l) => {
    const p = parseRefLinks(l);
    return p ? `Links: ${p.map((x) => `[${x.label}](${x.url})`).join(' · ')}` : l;
  }).join('\n');
}

/** Headings shifted down by `by` levels (capped at 6), skipping fenced code. */
export function demote(md: string, by: number): string {
  let fence = false;
  return md.replace(/\r/g, '').split('\n').map((l) => {
    if (/^```/.test(l)) fence = !fence;
    if (fence || !/^#{1,6}\s/.test(l)) return l;
    const n = /^#+/.exec(l)![0].length;
    return `${'#'.repeat(Math.min(6, n + by))}${l.slice(n)}`;
  }).join('\n');
}

export function currency(inputs: StoredInputs, i: Pick<LlmsInput, 'hashes' | 'simulator'>): Currency {
  const reasons: string[] = [];
  if (!hashMatches(inputs.networkHash, i.hashes.network)) reasons.push('the street network has changed');
  if (!hashMatches(inputs.demandHash, i.hashes.demand)) reasons.push('the demand has changed');
  if (i.simulator !== null && inputs.simulator !== i.simulator) reasons.push('the simulator has changed');
  return { current: reasons.length === 0, reasons };
}
const simUnchecked = (i: LlmsInput) => (i.simulator === null ? ' The simulator build was not available to this generator, so whether the simulator changed was not checked.' : '');
const outOfDate = (c: Currency) => `**Out of date.** Since these numbers were computed, ${list(c.reasons)}. The numbers are shown as computed and do not describe the data served now.`;

const periodLabelOf = (d: Demand) => { const m = new Map(d.periods.map((p) => [p.id, shortLabel(p.label)])); return (id: string) => m.get(id) ?? id; };
const abs = (i: LlmsInput, path: string) => `${i.site}${path}`;

function calibrationLine(a: AreaEntry): string {
  const c = a.calibration;
  return `${c?.status === 'calibrated' ? 'Calibrated, with limits.' : 'Preview, not yet calibrated.'} ${c?.note ?? ''}`.trim();
}

function header(i: LlmsInput, o: { title: string; human?: string; json: string[]; note?: string }): string {
  const jsons = o.json.map((j) => `<${abs(i, j)}>`).join(', ');
  return [
    `# ${o.title}`,
    '',
    `> ${NOT_A_FORECAST}`,
    '',
    `Generated ${i.generated.slice(0, 10)} for ${i.area.name} (\`${i.area.id}\`) from network file \`${short(i.hashes.network)}\` and demand file \`${short(i.hashes.demand)}\` (first 16 hex characters of the SHA-256 of the files served at ${abs(i, `/data/${i.area.id}.network.json`)} and ${abs(i, `/data/${i.area.id}.demand.json`)}).`,
    `${o.human ? `Human page: <${abs(i, o.human)}>. ` : ''}${o.json.length ? `Data: ${jsons}. ` : ''}Index of everything: <${abs(i, '/llms.txt')}>.`,
    `Calibration: ${calibrationLine(i.area)}`,
    ...(o.note ? ['', o.note] : []),
    '',
  ].join('\n');
}

// --- the Map overview

const mapTab = (periods: string[]) => [
  `The Map tab shows the study area and a 250 m buffer around it, with the simulated traffic drawn live. Pick a period (${periods.map((p) => `\`${p}\``).join(', ')}), a demand scale and a playback speed, then press play. A run covers one simulated hour; at the top speed ("Max") it goes straight to the end.`,
  'Select a street block or an intersection on the map, or search for one by name, and choose from the interventions that apply there (the types are listed in /llms-full.txt). Each change restarts both runs. Today\'s traffic (the baseline) and the scenario run side by side from the same seed, period and demand, so the Results panel compares like with like.',
  'The map colors the side streets inside the study area (residential and service streets) by through cars (cut-through) or by all-car flow, and, once a scenario has an intervention, shows the change from the baseline. Bounding streets and everything outside the study area are drawn as plain context and carry no figures. The Results panel lists the figures by card: through traffic on side streets and close-following conflicts. A link to the scenario can be copied and shared; a link to a published proposal opens already at the end of the hour from a stored result when one is valid for the data served.',
].join('\n\n');

export function baselineTable(i: LlmsInput): string {
  const label = periodLabelOf(i.demand);
  const have = order(i).filter((p) => i.baselines[p]);
  if (have.length === 0) return 'No stored baseline results are available to this generator, so no headline figures are shown. Run `npm run simulate` for the baseline.';
  const all = CARDS.flatMap((c) => c.metrics);
  const cols = ['ctVeh', 'ctShare'].map((id) => all.find((m) => m.id === id)!);
  const unit: Record<string, string> = { flow: 'cars an hour', share: '%' };
  return table(
    ['Period', ...cols.map((c) => `${c.label} (${unit[c.kind]})`)],
    have.map((p) => { const m = i.baselines[p].metrics; return [label(p), ...cols.map((c) => formatValue(c.kind as Kind, c.get(m), false))]; }),
  );
}

function baselineStatus(i: LlmsInput): string {
  const sets = Object.values(i.baselines);
  if (sets.length === 0) return '';
  const c = currency(sets[0].inputs, i);
  const s = sets[0];
  const run = `One simulated hour at seed ${s.seed}, demand 1, from stored result \`${s.key}\` computed ${s.computed.slice(0, 10)} (network \`${short(s.inputs.networkHash)}\`, demand \`${short(s.inputs.demandHash)}\`, simulator \`${s.inputs.simulator.slice(0, 8)}\`).`;
  return `${run}${c.current ? ` These inputs match the data served now.${simUnchecked(i)}` : `\n\n${outOfDate(c)}`}`;
}

export function indexMd(i: LlmsInput): string {
  const label = periodLabelOf(i.demand);
  return [
    header(i, { title: `Traffic: ${i.area.name}, overview`, human: '/', json: [`/data/areas.json`, ...(i.resultsIndex ? [`/data/results/${i.area.id}/index.json`] : [])] }),
    '## What this is',
    '',
    `Traffic is a web app that simulates neighborhood traffic as it is today on a real street network. You try interventions (modal filters, speed humps, traffic circles, one-way streets, turn bans, signal changes, diagonal diverters) and compare the outcome with the baseline. The study area is ${i.area.name}${i.boundary?.length ? `, bounded by ${list(i.boundary)}` : ''}. The simulated network is much wider than the study area, so routes and edge traffic are realistic; results come from the whole network.`,
    '',
    ...(calibrationCaveat(i.area.calibration) ? [calibrationCaveat(i.area.calibration)!, ''] : []),
    FIXED_DEMAND_CAVEAT.replace(/ \[Thomas2024\]/, ' [Thomas2024, see /sources.md]'),
    '',
    '## The Map tab',
    '',
    mapTab(order(i)),
    '',
    '## Today\'s baseline',
    '',
    'Through cars cross the study area without a trip that starts or ends in it. The first column counts them on all the side streets together (residential and service streets inside the study area), each car once. The share is the part of all the distance driven on those streets that is through traffic. These figures are for today\'s traffic with no interventions.',
    '',
    baselineTable(i),
    '',
    baselineStatus(i),
    '',
    `Periods: ${i.demand.periods.map((p) => `\`${p.id}\` is ${p.label}`).join('; ')}.`,
    '',
    '## Other pages',
    '',
    `- [Proposals](${abs(i, '/proposals.md')}): published packages of interventions, with their figures and scenario links.`,
    `- [Streets](${abs(i, '/streets.md')}): today's cars an hour on every block.`,
    `- [Methodology](${abs(i, '/methodology.md')}): how the model and the proposals are made, in plain language.`,
    `- [Assumptions](${abs(i, '/assumptions.md')}): the judgment calls in the model.`,
    `- [Sources](${abs(i, '/sources.md')}): inputs, provenance and the bibliography.`,
    `- [Scenario link format](${abs(i, '/scenario-links.md')}), [data files](${abs(i, '/data-files.md')}) and [how to run the model yourself](${abs(i, '/run-locally.md')}).`,
    '',
  ].join('\n');
}

// --- proposals

const periodsList = (ids: string[], l: (id: string) => string) => list(ids.map(l));

export function proposalsMd(i: LlmsInput): string {
  const label = periodLabelOf(i.demand);
  const file = i.proposals;
  const out: string[] = [header(i, { title: `Traffic: ${i.area.name}, proposals`, human: '/proposals', json: [`/data/${i.area.id}.proposals.json`] })];
  out.push('## About these proposals', '', PROPOSALS_LEAD, '', `Each package has a share link (\`/p/<slug>\`, the address to give people) and a scenario link. Open either in the app, or run the scenario link yourself with \`npm run simulate -- --link "<link>"\` (see ${abs(i, '/run-locally.md')}). The numbers below were computed by the proposal search, averaged over several seeds, which is why a single local run at seed 1 can differ.`, '');
  if (file?.withdrawn) {
    out.push('**The proposals have been withdrawn for now.**', '', file.withdrawn, '');
    return out.join('\n');
  }
  if (!file || file.groups.length === 0) {
    out.push('No proposals have been computed for this area yet.', '');
    return out.join('\n');
  }
  out.push(`Figures: **through cars an hour** are cars that cross the area without a trip that starts or ends in it, counted across all the side streets together; **all cars** are every car on a block, through cars and local trips together. A through number is never compared with an all-cars number. "Before → after" is today's streets to the streets with the package; negative is a reduction.`, '');
  out.push('Options are listed by through cars removed, largest first.', '');
  const loaded = { network: i.hashes.network, demand: i.hashes.demand, simulator: i.simulator };
  for (const g of file.groups) out.push(...statusMd(i, g, loaded, label));
  const listed = listOptions(file);
  if (listed.search.length === 0 && listed.reference.length === 0) {
    if (!file.groups.some((g) => g.legacy)) out.push('No options were found.', '');
    return out.join('\n');
  }
  const card = (x: { group: ProposalGroup; proposal: Proposal }, n: number | null) => cardMd(i, x.group, x.proposal, n, periodsPhrase(x.group.computed.periods, label), label);
  listed.search.forEach((x, k) => out.push(...card(x, k + 1)));
  if (listed.reference.length) { out.push('## For comparison', ''); listed.reference.forEach((x) => out.push(...card(x, null))); }
  return out.join('\n');
}

/** How one search's figures were made and whether they may be shown as current. A file from before 2026-11-15 can hold several. */
function statusMd(i: LlmsInput, g: ProposalGroup, loaded: { network: string | null; demand: string | null; simulator: string | null }, label: (id: string) => string): string[] {
  const notices = proposalNotices(g.computed, loaded);
  const out: string[] = [];
  out.push(formatComputed(g.computed, label), '');
  out.push(`Run: ${seedsPhrase(g.computed.seeds)} for ${g.computed.minutes ?? 60} simulated minutes each in ${periodsList(g.computed.periods, label)}, on network \`${g.computed.networkHash}\` and demand \`${g.computed.demandHash}\`; the area was \`${g.computed.calibration}\` at the time. ${provenanceLine(g.computed)}`, '');
  if (g.computed.simulator) out.push(INTERVAL_SCOPE, '');
  for (const f of g.computed.estimation?.selection.failed ?? []) out.push(`**Failed confirmation.** ${f.title}. ${f.reason}.`, '');
  out.push(`Calibration now: ${calibrationLine(i.area)}`, '');
  if (notices.exploratory) out.push(`**Exploratory.** ${EXPLORATORY_NOTE}`, '');
  if (notices.unverified && !notices.stale) out.push(`**Not verified.** ${notices.unverifiedText}`, '');
  if (notices.stale) out.push(`**Out of date.** ${notices.staleText} These numbers were computed on network \`${g.computed.networkHash}\` and demand \`${g.computed.demandHash}\`; the files served now are network \`${short(i.hashes.network)}\` and demand \`${short(i.hashes.demand)}\`.`, '');
  if (g.legacy) out.push(`**Out of date.** ${LEGACY_GROUP_NOTE}`, '');
  return out;
}

function cardMd(i: LlmsInput, g: ProposalGroup, p: Proposal, n: number | null, when: string, label: (id: string) => string): string[] {
  const cut = cutThroughHeadline(p.cutThrough, when, g.computed.seeds, i.area.name);
  const harm = harmHeadline(p.harm, when);
  const rows = allTrafficRows(p, label);
  const note = allTrafficNote(rows);
  const stored = (i.resultsIndex?.results ?? []).filter((r) => r.proposals.some((x) => x.group === g.id && x.id === p.id));
  const out: string[] = [`### ${n === null ? '' : `${n}. `}${p.title}`, ''];
  if (p.accessProblem) out.push(`**Street access check failed.** ${p.accessProblem}.`, '');
  if (p.simulationProblem) out.push(`**Simulation validity check failed.** ${p.simulationProblem}.`, '');
  if (p.kind === 'reference') out.push(`*Earlier proposal.*${p.note ? ` ${p.note}` : ''}`, '');
  const best = bestForText(p);
  if (best) out.push(`${best}.`, '');
  out.push(`- **${cut.figure}** ${cut.label} (${cut.change}). ${cut.scope} ${cut.interval}`);
  const big = allTrafficHeadline(rows);
  out.push(big.none ? `- ${big.label}` : `- **${big.figure}** ${big.label}. ${big.split} ${big.interval}`);
  const dt = detourText(p.residentsDetour);
  out.push(dt ? `- **${dt.figure}** ${dt.label}. ${dt.detail}` : '', '');
  out.push('Changes:', '', ...p.interventions.map((iv) => `- ${iv.label} (${iv.type})`), '');
  if (p.variants?.length) {
    out.push('Variants (tweaks of this proposal that do about the same; each opens on the map and runs live; no share path or stored result):', '',
      ...p.variants.map((v) => `- ${v.differs.join('; ')}${v.cutThrough ? ` — through cars an hour ${Math.round(v.cutThrough.baselineVehPerHour)} → ${Math.round(v.cutThrough.scenarioVehPerHour)} (${signedPct(v.cutThrough.changePct)}${v.cutThrough.seeds?.length ? `; ${seedsPhrase(v.cutThrough.seeds)}` : ''})` : ''}: <${abs(i, `/${linkHash(v.link)}`)}>`), '');
  }
  out.push(p.summary, '');
  out.push(`Share link: <${abs(i, pathOfSlug(slugOf(g.id, p.link)))}> (opens this proposal on the map; chat apps show a preview card for it)`, `Scenario link: <${abs(i, `/${linkHash(p.link)}`)}>`, '');
  out.push(harm.none ? `- ${harm.label}. ${harm.definition}` : `- **${harm.figure}** ${harm.label}. ${harm.definition}`, '');
  out.push(evidenceNote(p, g), '');
  const comparison = g.optionComparisons?.find((c) => c.option === p.id);
  if (comparison) out.push(comparisonText(comparison, (id) => g.proposals.find((x) => x.id === id)?.title ?? id), '');
  out.push('Through cars an hour on all the side streets, by period (before → after, change, and the interval over runs):', '', table(['Period', 'Through cars an hour', 'Interval over runs, cars an hour'], Object.entries(p.byPeriod).map(([id, v]) => [label(id), beforeAfterPct(v.cutThrough), intervalText(v.cutThrough.effect, '')])), '');
  out.push('All cars (through cars and local trips together) on the one block with the largest increase in all traffic, by period, and beside it the block behind the search\'s ranking penalty (the largest increase past an assumed noise band, a screening rule and not an uncertainty interval; the two can differ):', '',
    table(['Period', 'Block', 'All cars an hour, before → after', 'Of the change: through cars', 'Of the change: local trips', 'Interval over runs', 'Ranking penalty block and cars an hour past its band', 'Blocks past the noise band'],
      rows.map((r) => [r.period, r.block === null ? 'None flagged by the noise band' : `${r.block}${r.flagged ? ' (flagged by the search, not necessarily the largest increase)' : ''}`, r.block === null ? '—' : `${Math.round(r.before)} → ${Math.round(r.after)} (${signedNum(r.change, 'cars an hour', 0)})`, r.block === null ? '—' : signedNum(r.through, 'cars an hour', 0), r.block === null ? '—' : signedNum(r.local, 'cars an hour', 0), r.interval, r.penaltyBlock === null || r.penalty === 0 ? 'None past its band' : `${r.penaltyBlock}${r.penalty === null ? '' : `: ${signedNum(r.penalty, 'cars an hour', 0)}`}`, r.blocksAbove])), '');
  if (note) out.push(note, '');
  if (stored.length && i.resultsIndex) {
    const c = currency(i.resultsIndex.inputs, i);
    out.push(`Stored full-hour results (seed 1, demand 1)${c.current ? '' : `, out of date because ${list(c.reasons)}`}: ${stored.map((r) => `${label(r.period)} <${abs(i, `/data/results/${i.area.id}/${r.key}.json`)}>`).join('; ')}.`, '');
  }
  return out;
}

// --- methodology

export function methodologyMd(i: LlmsInput): string {
  const c = checkStatus(i.area.calibration);
  const steps = (xs: { label: string[]; text: string }[]) => xs.map((s, k) => `${k + 1}. **${s.label.join(' ')}.** ${s.text}`);
  const out: string[] = [header(i, { title: `Traffic: ${i.area.name}, methodology`, human: '/methodology', json: [] })];
  out.push('## What this is', '', ...whatThisIs(i.area.name).flatMap((t) => [t, '']));
  out.push('## Building today\'s traffic', '', BUILD_INTRO, '', ...steps(BUILD_STEPS), '', `Diagram: ${BUILD_ALT.desc}`, '');
  out.push('## What counts as cut-through', '', CUT_INTRO, '', ...CUT_TRIPS.map((t, k) => `${t.n}. **Trip ${t.n}, ${CUT_TRIP_STYLES[k]}.** ${t.text}`), '', `Diagram: ${CUT_ALT.desc}`, '');
  out.push('## Checking the model', '', CHECK_INTRO, '', `Status today: ${c.status}${c.note ? ` ${c.note}` : ''}`, '', `The judgment calls are in ${abs(i, '/assumptions.md')} and the data and results of the checks are in ${abs(i, '/sources.md')}.`, '');
  out.push('## How proposals are made', '', PROPOSAL_INTRO, '', ...steps(PROPOSAL_STEPS), '', `Diagram: ${PROPOSAL_ALT.desc}`, '');
  out.push('## What it can\'t tell you', '', LIMITS_INTRO, '', ...LIMITS.map((l) => `- ${l}`), '');
  return `${out.join('\n')}\n`;
}

// --- assumptions

export function assumptionsMd(i: LlmsInput): string {
  const label = periodLabelOf(i.demand);
  const out: string[] = [header(i, { title: `Traffic: ${i.area.name}, assumptions`, human: '/assumptions', json: [`/data/${i.area.id}.assumptions.json`, ...(i.baselineIntents ? [`/data/results/${i.area.id}/baseline-intents.json`] : [])] })];
  out.push(ASSUMPTIONS_INTRO, '', `The measured inputs, the data behind them and the research are on the Sources page (${abs(i, '/sources.md')}).`, '');
  out.push('## Assumed movement flows', '', MOVEMENTS_INTRO, '');
  const f = i.assumptions;
  if (!f) out.push('The list of movements is not available for this area.', '');
  else {
    const current = hashMatches(f.inputs.demandHash, i.hashes.demand);
    const order = [...i.demand.periods.map((p) => p.id)];
    const lead = i.area.calibration?.defaultPeriod ?? order[0];
    const detours = [...new Set(f.movements.map((m) => m.maxDetour))];
    out.push(`Counted: the cars an hour that made each turn, from ${f.count.label}, one hour each in ${list(f.count.measured.map(label))}.${f.count.scaled.length ? ` ${list(f.count.scaled.map(label))} has no count: its figure is the count scaled by assumed volume factors.` : ''} Assumed: how many cars the model assigns to each turn, how many of those are through cars (neither trip end in the study area), and who the cars are.${detours.length === 1 ? ` A trip joins a turn only if the turn adds no more than ${Math.round((detours[0] - 1) * 100)}% to its best route.` : ''}`, '');
    out.push(`Generated from the demand file \`${short(f.inputs.demandHash)}\`.${current ? '' : ` **Out of date.** These figures were made for an earlier version of the demand data (the file served now is \`${short(i.hashes.demand)}\`).`}`, '');
    f.movements.forEach((m, k) => {
      out.push(`### ${k + 1}. ${m.label}`, '');
      out.push(table(['Period', 'Counted (cars an hour)', 'Assigned (cars an hour)', 'Of which through cars'], order.filter((p) => m.counted[p] !== undefined || m.assigned[p]).map((p) => [
        `${label(p)}${f.count.scaled.includes(p) ? ' (scaled)' : ''}`, m.counted[p] ?? '—', m.assigned[p] ? Math.round(m.assigned[p].total) : '—', m.assigned[p] ? Math.round(m.assigned[p].through) : '—',
      ])), '');
      if (m.belowThreshold && Object.keys(m.belowThreshold).length && m.belowThresholdNote) out.push(m.belowThresholdNote, '');
      const who = intentShares(m, lead);
      if (who.length) out.push(`Who the cars are assumed to be, ${label(lead)}:`, '', ...who.map((w) => `- ${w.pct}% (${Math.round(w.vph)} cars an hour) ${w.label} (${w.through ? 'through cars' : 'start or end here'})`), '');
    });
    out.push('Cars an hour. Percentages are shares of the cars assigned to that turn. An assigned number below the counted one means the model places only part of the count on this turn; the rest is left to the ordinary routing.', '');
  }
  const intents = i.demand.intents ?? [];
  if (intents.length) {
    out.push('## Why cars cut through', '', 'These are hypotheses about why drivers cross the study area without an end in it, not what drivers said. A through trip that uses a residential or service street is filed under the first reason that fits: the freeway on-ramp it will use, the off-ramp it came by, or, for trips that use no ramp, where it starts and ends; any other goes under Other.', '', `**${BASIS_TEXT.observed}:** ${BASIS_HELP.observed}`, '', `**${BASIS_TEXT.assumed}:** ${BASIS_HELP.assumed}`, '');
    const b = i.baselineIntents;
    const bc = b ? currency(b.inputs, i) : null;
    if (b && bc && !bc.current) out.push(outOfDate(bc), '');
    if (!b) out.push('No stored baseline by reason is available, so cars an hour are not shown.', '');
    let section = '';
    for (const d of intents) {
      if (d.section && d.section !== section) { section = d.section; out.push(`### ${section}`, ''); }
      out.push(`#### ${d.label}`, '', `${BASIS_TEXT[d.basis]}. ${d.note}`, '');
      if (d.avoids) out.push(`Would otherwise use ${d.avoids}, by the model's shortest route with the side streets closed.`, '');
      if (b) {
        const per = order(i).map((p) => ({ p, v: b.periods[p]?.byIntent.find((x) => x.id === d.id)?.vehiclesPerHour })).filter((x) => x.v !== undefined);
        if (per.length) out.push(`Today's through cars an hour: ${per.map((x) => `${label(x.p)} ${Math.round(x.v!)}`).join(', ')}.`, '');
      }
    }
    out.push(`Through cars that fit none of the listed reasons are tallied as Other${b ? `: ${order(i).map((p) => `${label(p)} ${Math.round(b.periods[p]?.byIntent.find((x) => x.id === 'other')?.vehiclesPerHour ?? 0)}`).join(', ')} an hour` : ''}.`, '');
  }
  const dt = f?.derivedTargets;
  if (dt?.stations.length) {
    const periods = order(i), lead = i.area.calibration?.defaultPeriod ?? periods[0];
    out.push('', '## Targets derived from daily totals', '', DERIVED_TARGETS_INTRO, '', derivedFactorsSentence(dt, lead, label), '');
    out.push(table(['Station', 'Source', ...periods.map(label), 'Status'], dt.stations.map((s) => [s.label, `${s.source}${s.year ? `, ${s.year}` : ''}`, ...periods.map((p) => s.targets[p] ?? '—'), 'derived from a daily total, not judged'])), '');
  }
  return out.join('\n');
}
const order = (i: LlmsInput) => i.demand.periods.map((p) => p.id);

// --- sources

export function sourcesMd(i: LlmsInput, withBibliography = true): string {
  const cal = i.area.calibration;
  const out: string[] = [header(i, { title: `Traffic: ${i.area.name}, sources`, human: '/sources', json: [`/data/${i.area.id}.demand.json`, '/data/areas.json'] })];
  out.push('## Calibration', '', cal?.status === 'calibrated' ? SOURCES_CALIBRATED : SOURCES_UNCALIBRATED, '');
  if (cal?.note) out.push(cal.note, '');
  const cav = calibrationCaveat(cal);
  if (cav) out.push(cav, '');
  out.push('## Data provenance', '', 'Where each input comes from. A note that starts with DATA rests on a count or a published table; one that says ASSUMPTION is a judgment call, listed in the Assumptions page.', '');
  for (const p of i.demand.provenance.filter((x) => !/^Assumed movement flows/.test(x.source))) out.push(`- **${/^https?:\/\//.test(p.url) ? `[${p.source}](${p.url.replace(/[()]/g, encodeURIComponent)})` : p.source}**. ${p.note}`);
  out.push('', 'Map data © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright) (ODbL).', '');
  out.push('## Research references', '');
  out.push(withBibliography ? demote(linkRefs(i.docs.references), 2) : `The bibliography, with a verification status for each entry, is at ${abs(i, '/sources.md')}.`);
  return `${out.join('\n')}\n`;
}

// --- streets

export interface StreetRow { label: string; cls: string; periods: { flow: number; cut: number }[] }

export function streetRows(net: Network, idx: NetIndex, periods: string[], baselines: Record<string, BaselineSet>): StreetRow[] {
  const views = periods.map((p) => (baselines[p] ? linkStatsView(baselines[p].linkStats) : null));
  const rows: StreetRow[] = [];
  for (const b of idx.blocks) {
    if (!blockMeasured(b)) continue;
    const per = views.map((v) => {
      if (!v) return { flow: 0, cut: 0 };
      const a = aggregate(v, b.links);
      return { flow: Math.round(a.flow), cut: Math.round(a.cut) };
    });
    if (per.every((p) => p.flow === 0 && p.cut === 0)) continue;
    rows.push({ label: b.label, cls: b.cls, periods: per });
  }
  return rows;
}

export function streetsMd(i: LlmsInput): string {
  const label = periodLabelOf(i.demand);
  const idx = buildIndex(i.network);
  const periods = order(i).filter((p) => i.baselines[p]);
  const out: string[] = [header(i, { title: `Traffic: ${i.area.name}, streets`, human: '/streets', json: i.resultsIndex ? [`/data/results/${i.area.id}/index.json`] : [] })];
  out.push(STREETS_INTRO, '');
  if (periods.length === 0) { out.push('No stored baseline results are available, so there are no street figures.', ''); return out.join('\n'); }
  const first = i.baselines[periods[0]];
  const c = currency(first.inputs, i);
  out.push(`Source: the stored baseline (today's traffic, no interventions) of one simulated hour at seed ${first.seed}, demand 1, one run per period (stored result \`${first.key}\`, computed ${first.computed.slice(0, 10)}, network \`${short(first.inputs.networkHash)}\`, demand \`${short(first.inputs.demandHash)}\`, simulator \`${first.inputs.simulator.slice(0, 8)}\`).${c.current ? simUnchecked(i) : ''}`, '');
  if (!c.current) out.push(outOfDate(c), '');
  out.push('Side streets inside the study area only, service roads included; bounding streets and streets outside the study area are not listed. Blocks with no cars in any period are left out. One seed is one sample: differences of a few cars an hour between runs are within run-to-run variation. These are today\'s figures; to see how a change moves them, run `npm run simulate -- --blocks all`.', '');
  const head = ['Street block', 'Class', ...periods.flatMap((p) => [`${label(p)}: all cars`, `${label(p)}: through cars`])];
  const rows = streetRows(i.network, idx, periods, i.baselines);
  out.push(table(head, rows.map((r) => [r.label, r.cls, ...r.periods.flatMap((p) => [p.flow, p.cut])])), '');
  out.push(`${rows.length} blocks. All cars and through cars are cars an hour on the block, both directions summed; through cars are part of all cars.`, '');
  return out.join('\n');
}

// --- reference sections used by llms-full.txt

export function typesMd(): string {
  return INTERVENTION_TYPES.map((t) => [
    `### ${t.name} (code \`${t.codes.join('`, `')}\`)`, '',
    `- Goes on: a ${t.appliesTo}, at ${t.at}.`,
    `- Link parameters: ${t.params}.`,
    `- JSON form: \`${t.json}\``,
    `- Effect: ${t.effect}`,
    `- Offered: ${t.offered}`,
    '',
  ].join('\n')).join('\n');
}

/** Worked examples taken from the area's own network, so they are always valid for it. */
export function examplesMd(i: LlmsInput): string {
  const idx = buildIndex(i.network);
  const net = i.network;
  const period = i.area.calibration?.defaultPeriod ?? i.demand.periods[0]?.id;
  const studyNode = idx.intersections.find((n) => net.nodes[n].inStudyArea && diverterOptions(net, idx, n).length === 2 && filterChoices(net, idx, n, []).streets.length > 0)
    ?? idx.intersections.find((n) => net.nodes[n].inStudyArea);
  const studyBlockIdx = idx.blocks.findIndex((b) => b.inStudyArea && b.cls === 'residential' && b.links.length === 2);
  const rows: [string, string, string][] = [];
  const items: string[] = [];
  const add = (type: string, pick: string | ((o: { type: string; item: string }) => boolean), o: { type: string; label: string; item: string }[]) => {
    const hit = typeof pick === 'string' ? o.find((x) => x.type === pick) : o.find(pick);
    if (hit) { rows.push([type, hit.label.replace(/: .*$/, ''), hit.item]); items.push(hit.item); }
  };
  if (studyBlockIdx >= 0) {
    const b = blockPlace(net, idx, studyBlockIdx);
    for (const t of ['modal_filter', 'speed_hump', 'slow_street', 'speed_limit', 'one_way']) add(t, t, b.options);
  }
  if (studyNode !== undefined) {
    const n = nodePlace(net, idx, studyNode);
    add('modal_filter at an intersection', (x) => x.type === 'modal_filter' && !x.item.split(',')[2], n.options);
    add('modal_filter on one street at an intersection', (x) => x.type === 'modal_filter' && x.item.split(',').length === 3, n.options);
    for (const t of ['traffic_circle', 'control', 'diagonal_diverter', 'turn_ban']) add(t, t, n.options);
  }
  if (rows.length === 0) return '';
  const combo = items.slice(0, 2);
  return [
    `Examples from ${i.area.name}'s own network (each is valid as it stands):`, '',
    table(['Type', 'What it does here', 'Item'], rows), '',
    `Two of them together, in the ${period} period: \`${linkFor(i.area.id, period, combo)}\`. As a full link: \`${i.site}/${linkFor(i.area.id, period, combo)}\`.`, '',
  ].join('\n');
}

export function figuresMd(i: LlmsInput): string {
  const cards = CARDS;
  const rows = cards.flatMap((c) => c.metrics.map((m) => [m.label, c.title, ({ flow: 'cars an hour', share: 'percent', count: 'count' } as Record<string, string>)[m.kind], m.lowerIsBetter === null ? 'neutral' : m.lowerIsBetter ? 'lower is better' : 'higher is better']));
  const maxLimit = SPEED_LIMITS_MPH.join(', ');
  return [
    '### Vocabulary', '',
    `- **Study area**: ${i.area.name}, the part of the network the question is about. **Side street**: a residential or service street inside the study area. **Block**: one street segment, both directions together.`,
    '- **Through car**: a car with neither trip end in the study area that uses at least one side street, counted once across all the side streets together. **All cars**: every car on a block, through cars and the local trips of people who start or end a trip in the area. Through cars are part of all cars, never added to them; a through number is never compared with an all-cars number.',
    '- **Baseline**: today\'s traffic with no interventions. **Scenario**: the same trips with the interventions placed. Demand is fixed: the same trips are made in both.',
    `- **Window**: a run is ${RUN_SECONDS / 3600} simulated hour of one demand period, started with traffic already on the streets. Rates are cars an hour over the run; per-block flows are averages over the run so far. ${EARLY_NOTE} Stored results and the app use seed 1.`,
    '- **Run-to-run variation**: the simulation is random but repeatable for a seed. Differences smaller than the seed-to-seed spread are noise; the map treats a change of less than ' + `${DEAD_BAND.cutthrough} through cars an hour or ${DEAD_BAND.flow} all cars an hour as no change (its colors saturate at ${CHANGE_TOP.cutthrough} and ${CHANGE_TOP.flow}), and proposals count a block as gaining only past max(2 standard deviations of its baseline across seeds, 10 cars an hour).`,
    '', '### The figures on the Results cards', '',
    ...cards.filter((c) => c.note).map((c) => `**${c.title}.** ${c.note}`),
    '', table(['Figure', 'Card', 'Unit', 'Direction'], rows), '',
    'A run in which the simulator had to remove vehicles to clear gridlock, or in which many trips wait to enter, is oversaturated and understates real congestion; Results then carries a caution.', '',
    `Through routes: ${ROUTE_CAVEAT} It is a quick check of the street layout and does not use traffic volumes.`, '',
    `Interventions offered in the app: speed limits ${maxLimit} mph; signal cycles ${SIGNAL_CYCLES_S.join(', ')} s. These are UI choices, not published recommendations.`, '',
    '### How the proposal figures are measured', '',
    demote(section(i.docs.proposalsReadme, 'What it measures'), 3), '',
    '### Reading a proposal', '',
    demote(section(i.docs.proposalsReadme, 'Reading the file'), 3), '',
  ].join('\n');
}

export function areaSection(i: LlmsInput): string {
  const [w, s, e, n] = i.network.bbox;
  const study = i.network.nodes.filter((x) => x.inStudyArea).length;
  const local = i.network.links.filter(isLocal).length;
  return [
    `**${i.area.name}** (\`${i.area.id}\`)${i.boundary?.length ? `, bounded by ${list(i.boundary)}` : ''}. The map opens at ${i.area.center[1]}, ${i.area.center[0]} (latitude, longitude). The simulated network covers longitudes ${w} to ${e} and latitudes ${s} to ${n}: ${i.network.nodes.length} intersections and ${i.network.links.length} directed street links, of which ${study} intersections and ${local} links (residential and service, one per direction) are inside the study area. Periods: ${i.demand.periods.map((p) => `\`${p.id}\` (${p.label})`).join('; ')}.`,
    '',
    ...(i.demand.ramps?.length ? [`Freeway ramps in the model: ${i.demand.ramps.map((r) => r.label).join('; ')}.`, ''] : []),
  ].join('\n');
}

export function dataListMd(i: LlmsInput): string {
  const a = i.area.id;
  const has = (p: string) => i.dataFiles.includes(p);
  const rows: [string, string][] = [
    ['/data/areas.json', 'Study areas: ids, names, file paths and the calibration status and caveat.'],
    [`/data/${a}.network.json`, 'The street network (nodes, links, turn bans) from OpenStreetMap.'],
    [`/data/${a}.demand.json`, 'Trips by period, the reasons through cars cross the area, freeway ramps, and the provenance of every input.'],
    [`/data/${a}.proposals.json`, 'Published packages of interventions with their figures, scenario links and per-link pictures.'],
    [`/data/${a}.assumptions.json`, 'The assumed movement flows with counted and assigned cars an hour.'],
    [`/data/${a}.noise.json`, 'Seed-to-seed spread of baseline link flows.'],
    [`/data/${a}.basemap.json`, 'GeoJSON the map draws under the network. Not needed to run or read results.'],
    [`/data/results/${a}/index.json`, 'Index of the stored full-hour simulations of the published proposals.'],
    [`/data/results/${a}/<key>.json`, 'One stored scenario in one period with today\'s baseline beside it (keys are in index.json).'],
    [`/data/results/${a}/baseline-intents.json`, 'Today\'s through cars by reason, per period.'],
  ];
  return rows.filter(([p]) => p.includes('<') || has(p) || i.dataFiles.length === 0).map(([p, d]) => (p.includes('<') ? `- \`${p}\` (under ${abs(i, `/data/results/${a}/`)}): ${d}` : `- [${p}](${abs(i, p)}): ${d}`)).join('\n');
}

// --- llms.txt and llms-full.txt

export function llmsTxt(i: LlmsInput): string {
  const a = i.area;
  const repo = i.repo;
  return [
    `# Traffic: ${a.name}`,
    '',
    `> A simulation of neighborhood traffic as it is today on a real street network, for trying interventions (modal filters, speed humps, one-way streets, turn bans and more) and comparing outcomes with the baseline. First study area: ${a.name}. It is a simulation, not a forecast: ${calibrationLine(a)}`,
    '',
    'The site is a JavaScript app, so its pages are empty without scripts. Everything it says is in the text pages below, and everything it computes is in static JSON files. There is no server-side API that runs a scenario; to test an idea, run the model locally with the command-line tool described in /run-locally.md. The upload API under /api is for the maintainers and is not for visitors.',
    '',
    '## Read first',
    '',
    `- [Overview](${abs(i, '/index.md')}): what the site does, the limits and calibration status, and today's baseline figures by period.`,
    `- [Everything in one file](${abs(i, '/llms-full.txt')}): all of this text, the definitions of every figure, the intervention types, the scenario link format, the data files and how to run the model.`,
    '',
    '## Pages as text',
    '',
    `- [Proposals](${abs(i, '/proposals.md')}): every published package of interventions with its figures, scenario link and the run that produced the numbers (human page: ${abs(i, '/proposals')}).`,
    `- [Streets](${abs(i, '/streets.md')}): today's all cars and through cars on every side-street block, by period (human page: ${abs(i, '/streets')}).`,
    `- [Methodology](${abs(i, '/methodology.md')}): how the model and the proposals are made, a short plain-language guide (human page: ${abs(i, '/methodology')}).`,
    `- [Assumptions](${abs(i, '/assumptions.md')}): the judgment calls: assumed movement flows and the reasons cars cut through (human page: ${abs(i, '/assumptions')}).`,
    `- [Sources](${abs(i, '/sources.md')}): input provenance, the calibration statement and the research bibliography (human page: ${abs(i, '/sources')}).`,
    '',
    '## Using it',
    '',
    `- [Scenario link format](${abs(i, '/scenario-links.md')}): the complete grammar of a scenario link, how links are placed on the network and how to build one by hand.`,
    `- [Run the model yourself](${abs(i, '/run-locally.md')}): prerequisites and the commands to look up streets, run a scenario, follow where traffic goes when a closure is added, and read the JSON they print.`,
    `- [Data files](${abs(i, '/data-files.md')}): every JSON file, field by field, with units and what "out of date" means.`,
    '',
    '## Data',
    '',
    dataListMd(i),
    '',
    '## Source and license',
    '',
    `- [Source repository](${repo}): code, specifications, calibration record and bibliography. Public.`,
    `- Map data is (c) OpenStreetMap contributors under the ODbL (https://www.openstreetmap.org/copyright); keep the attribution when you reuse it. Code is under the repository's license.`,
    '',
    '## Optional',
    '',
    `- [Calibration record](${repo}/blob/main/data/calibration/${a.id}.record.md): every tuning step, in order.`,
    `- [Agent guide](${repo}/blob/main/AGENTS.md): how the repository is organized.`,
    '',
  ].join('\n');
}

export function llmsFull(i: LlmsInput, pages: Record<string, string>): string {
  const strip = (md: string) => md.replace(/^# .*\n/, '').replace(/^> .*\n/m, '').trim();
  const out: string[] = [];
  out.push(`# Traffic: ${i.area.name}, full text`, '', `> ${NOT_A_FORECAST}`, '',
    `Generated ${i.generated.slice(0, 10)} from network \`${short(i.hashes.network)}\` and demand \`${short(i.hashes.demand)}\`. This file holds the whole text of ${abs(i, '/llms.txt')} and the pages it links, so one fetch is enough. The block-by-block table is not repeated here: it is at ${abs(i, '/streets.md')}.`, '');
  out.push('## What this is and is not', '',
    `Traffic simulates neighborhood traffic as it is today and lets people try interventions and compare outcomes. It is a microscopic simulation: individual cars, cyclists and pedestrians on a real street network, one simulated hour at a time. It is a simulation, not a forecast: results are hypotheses about what a change would do, not predictions. The same trips are made before and after every change, while real schemes also remove some traffic. Nothing here is a recommendation by a public agency.`, '',
    `Calibration status: ${calibrationLine(i.area)}`, '', calibrationCaveat(i.area.calibration) ?? '', '',
    '### What is and is not calibrated', '', demote(section(i.docs.readme, 'What is and is not calibrated'), 3), '',
    '### Fixed demand', '', FIXED_DEMAND_CAVEAT.replace('[Thomas2024]', '[Thomas2024, in the bibliography at /sources.md]'), '',
    '### No server-side scenario API', '', 'The public site serves static files and no compute. There is no endpoint that runs a scenario, and none is planned: to test an idea, run the model locally (below). The only write path on the site is the data upload under /api, which needs a secret held by the maintainers. Please do not call it, and do not put load on the site beyond plain GETs of pages and files.', '');
  out.push('## The study area', '', areaSection(i));
  out.push('## Figures and definitions', '', figuresMd(i));
  out.push('## Intervention types', '', 'Each type, what it does in the simulation and how it is written in a scenario link and in JSON.', '', typesMd());
  out.push('## Scenario links', '', demote(strip(i.docs.scenarioLinks), 1), '', '### Examples for this area', '', examplesMd(i));
  out.push('## Data files', '', dataListMd(i), '', demote(strip(i.docs.dataFiles), 1), '');
  out.push('## Licensing and attribution', '', section(i.docs.dataFiles, 'Licenses'), '', `The source repository is ${i.repo} (public). Its license file: ${i.repo}/blob/main/LICENSE. Map data © OpenStreetMap contributors (ODbL): keep that attribution visible when you show maps or numbers derived from it.`, '');
  out.push('## Run it yourself', '', demote(strip(i.docs.runLocally), 1), '');
  for (const [name, title] of [['index.md', 'Overview page'], ['proposals.md', 'Proposals'], ['methodology.md', 'Methodology'], ['assumptions.md', 'Assumptions']] as const) {
    out.push(`## ${title}`, '', demote(strip(pages[name]), 2), '');
  }
  out.push('## Sources', '', demote(strip(sourcesMd(i, false)), 2), '');
  return `${out.join('\n')}\n`;
}

export function docPage(i: LlmsInput, title: string, body: string, source: string): string {
  return `# ${title}\n\n> ${NOT_A_FORECAST}\n\nGenerated ${i.generated.slice(0, 10)} from ${i.repo}/blob/main/${source}. Index of everything: <${abs(i, '/llms.txt')}>.\n\n${body.replace(/^# .*\n+/, '').trim()}\n`;
}

/** Every generated file by name. */
export function buildPages(i: LlmsInput): Record<string, string> {
  const pages: Record<string, string> = {
    'index.md': indexMd(i), 'proposals.md': proposalsMd(i), 'methodology.md': methodologyMd(i), 'assumptions.md': assumptionsMd(i), 'sources.md': sourcesMd(i), 'streets.md': streetsMd(i),
    'scenario-links.md': docPage(i, 'Scenario links', i.docs.scenarioLinks, 'docs/scenario-links.md'),
    'data-files.md': docPage(i, 'Data files', i.docs.dataFiles, 'docs/data-files.md'),
    'run-locally.md': docPage(i, 'Run the model yourself', i.docs.runLocally, 'docs/run-locally.md'),
  };
  pages['llms.txt'] = llmsTxt(i);
  pages['llms-full.txt'] = llmsFull(i, pages);
  return pages;
}
