import type { AreaEntry, Demand, Intervention, Metrics, Network } from '../../src/types';
import { linkStatsView } from '../../src/types';
import { ITEM_CODES, decodeMeta, decodeScenario, encodeScenario, HASH_VERSION, type Unplaced } from '../../src/lib/hash';
import { aggregate, DEAD_BAND_CUTTHROUGH } from '../../src/lib/change';
import { displayValue, MPS_TO_MPH, type Kind } from '../../src/lib/format';
import { CARDS, MODE_CARDS, hasModes, networkHealth } from '../../src/lib/metrics';
import { intentTable } from '../../src/lib/intents';
import { isLocal } from '../../src/lib/intents';
import { describeIntervention } from '../../src/lib/describe';
import { nearestStreetName } from '../../src/lib/hash';
import { defaultPeriod } from '../../src/lib/run';
import type { Block, NetIndex } from '../../src/lib/naming';
import { CliError, EXIT } from './agent-area';

export const REPORT_VERSION = 1;
export const REPORT_DISCLAIMER = 'A simulation result, not a forecast. The same trips are made before and after each change (fixed demand), and the model is run on one random seed. Read it as a comparison with the baseline, and see "calibration" for what is and is not checked against counts.';

export interface Args {
  link?: string; interventions?: string; area: string; period?: string; seed: number; minutes: number; demand?: number;
  blocks: 'side' | 'all' | 'none'; top: number; pretty: boolean; strict: boolean; dataDir?: string;
  find?: string; listInterventions: boolean; places: boolean; limit: number; help: boolean; noCache: boolean;
}

const VALUE_FLAGS = ['--link', '--interventions', '--area', '--period', '--seed', '--minutes', '--demand', '--blocks', '--top', '--find', '--limit', '--data-dir'] as const;
const BOOL_FLAGS = ['--json', '--pretty', '--strict', '--list-interventions', '--places', '--help', '-h', '--no-cache'] as const;

const num = (flag: string, v: string, min: number, max: number, int = false): number => {
  const n = Number(v);
  if (v.trim() === '' || !Number.isFinite(n) || n < min || n > max || (int && !Number.isInteger(n))) {
    throw new CliError(`${flag} needs ${int ? 'a whole number' : 'a number'} from ${min} to ${max}, not "${v}".`, EXIT.usage);
  }
  return n;
};

export function parseArgs(argv: string[]): Args {
  const a: Args = { area: 'rockridge', seed: 1, minutes: 60, blocks: 'side', top: 15, pretty: true, strict: false, listInterventions: false, places: false, limit: 20, help: false, noCache: false };
  for (let i = 0; i < argv.length; i++) {
    const raw = argv[i];
    const eq = raw.startsWith('--') ? raw.indexOf('=') : -1;
    const flag = eq > 0 ? raw.slice(0, eq) : raw;
    if ((BOOL_FLAGS as readonly string[]).includes(flag)) {
      if (flag === '--json') a.pretty = false;
      else if (flag === '--pretty') a.pretty = true;
      else if (flag === '--strict') a.strict = true;
      else if (flag === '--list-interventions') a.listInterventions = true;
      else if (flag === '--no-cache') a.noCache = true;
      else if (flag === '--places') a.places = true;
      else a.help = true;
      continue;
    }
    if (!(VALUE_FLAGS as readonly string[]).includes(flag)) throw new CliError(`Unknown option ${raw}. Run with --help for the options.`, EXIT.usage);
    const value = eq > 0 ? raw.slice(eq + 1) : argv[++i];
    if (value === undefined) throw new CliError(`${flag} needs a value.`, EXIT.usage);
    switch (flag) {
      case '--link': a.link = value; break;
      case '--interventions': a.interventions = value; break;
      case '--area': a.area = value; break;
      case '--period': a.period = value; break;
      case '--seed': a.seed = num(flag, value, 0, 4294967295, true); break;
      case '--minutes': a.minutes = num(flag, value, 1, 180); break;
      case '--demand': a.demand = num(flag, value, 0.1, 3); break;
      case '--blocks':
        if (value !== 'side' && value !== 'all' && value !== 'none') throw new CliError('--blocks is side, all or none.', EXIT.usage);
        a.blocks = value; break;
      case '--top': a.top = num(flag, value, 1, 1000, true); break;
      case '--limit': a.limit = num(flag, value, 1, 1000, true); break;
      case '--find': a.find = value; break;
      case '--data-dir': a.dataDir = value; break;
    }
  }
  if (a.link !== undefined && a.interventions !== undefined) throw new CliError('Give --link or --interventions, not both.', EXIT.usage);
  return a;
}

export interface LinkParts { fragment: string; area?: string; period?: string; demandScale?: number }

/** The fragment of a pasted scenario link: a full URL, `#v1;...` or `v1;...`, with percent-escapes undone. */
export function linkFragment(input: string): string {
  let s = input.trim();
  const hash = s.indexOf('#');
  if (hash >= 0) s = s.slice(hash + 1);
  try { s = decodeURIComponent(s); } catch { throw new CliError(`The link has a broken percent-escape: ${input}`, EXIT.usage); }
  return s.replace(/^#/, '');
}

/** Why the app would refuse a link, in words, or null when the form is fine and only the placing on the network could fail. */
export function explainLink(fragment: string, area: string): string | null {
  const grammar = 'The form is `#v1;a=<area>;p=<period>;d=<demand scale>;s=<item>~<item>` and each item is `<code>,<10-character geohash>[,<parameters>]` (docs/scenario-links.md).';
  if (!(fragment === HASH_VERSION || fragment.startsWith(`${HASH_VERSION};`))) return `The link does not start with "#${HASH_VERSION};". ${grammar}`;
  const toks = fragment.split(';').slice(1);
  const a = toks.find((t) => t.startsWith('a='));
  if (a && a.slice(2) !== area) return `The link is for area "${a.slice(2)}" but the area is "${area}". Pass --area ${a.slice(2)} or drop a= from the link.`;
  const s = toks.find((t) => t.startsWith('s='));
  if (!s) return null;
  const items = s.slice(2).split('~');
  if (items.length > 200) return `The link has ${items.length} items; the limit is 200.`;
  for (const [i, raw] of items.entries()) {
    const f = raw.split(',');
    if (!ITEM_CODES.includes(f[0])) return `Item ${i + 1} ("${raw}") starts with "${f[0]}", which is not an intervention code. Codes: ${ITEM_CODES.join(', ')}.`;
    if (f[1] === undefined || f[1].length !== 10) return `Item ${i + 1} ("${raw}") needs a 10-character geohash after the code.`;
  }
  return `A parameter in one of the ${items.length} items is out of range or malformed, or a geohash uses a letter geohashes do not (a, i, l, o). ${grammar}`;
}

export interface Scenario {
  interventions: Intervention[]; unplaced: Unplaced[];
  period?: string; demandScale?: number; source: 'link' | 'file' | 'none';
}

export function scenarioFromLink(net: Network, link: string, area: string): Scenario {
  const fragment = linkFragment(link);
  const d = decodeScenario(net, `#${fragment}`);
  if (d.invalid) throw new CliError(`Cannot decode the scenario link. ${explainLink(fragment, area) ?? ''}`.trim(), EXIT.usage);
  const meta = decodeMeta(`#${fragment}`);
  return { interventions: d.interventions, unplaced: d.unplaced, period: meta.period, demandScale: meta.demandScale, source: 'link' };
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isInt = (v: unknown, max: number): v is number => typeof v === 'number' && Number.isInteger(v) && v >= 0 && v < max;
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const CONTROLS = ['signal', 'all_way_stop', 'two_way_stop', 'uncontrolled', 'traffic_circle'];

/** Checks the JSON list form against the network; ids that do not exist are errors, not silent skips. */
export function parseInterventionsJson(net: Network, text: string): Intervention[] {
  let raw: unknown;
  try { raw = JSON.parse(text); } catch { throw new CliError('The interventions file is not valid JSON. It is a list of objects such as {"type":"modal_filter","link":123}; see docs/scenario-links.md.', EXIT.usage); }
  const list = Array.isArray(raw) ? raw : isObj(raw) && Array.isArray(raw.interventions) ? raw.interventions : null;
  if (!list) throw new CliError('The interventions file must be a JSON list, or an object with an "interventions" list.', EXIT.usage);
  const nl = net.links.length, nn = net.nodes.length;
  return list.map((v, i) => {
    const bad = (why: string) => new CliError(`Intervention ${i + 1}: ${why} Types: modal_filter, speed_limit, speed_hump, traffic_circle, control, signal_timing, one_way, turn_ban, diagonal_diverter.`, EXIT.usage);
    if (!isObj(v) || typeof v.type !== 'string') throw bad('it needs a "type".');
    const t = v.type;
    const link = (k: string) => { if (!isInt(v[k], nl)) throw bad(`"${k}" must be a link id from 0 to ${nl - 1}.`); return v[k] as number; };
    const node = () => { if (!isInt(v.node, nn)) throw bad(`"node" must be a node id from 0 to ${nn - 1}.`); return v.node as number; };
    switch (t) {
      case 'modal_filter':
        if (v.link !== undefined) return { type: t, link: link('link') };
        if (v.legs !== undefined) {
          if (!Array.isArray(v.legs) || v.legs.length === 0 || !v.legs.every((x) => isInt(x, nl))) throw bad('"legs" must be a list of link ids.');
          return { type: t, node: node(), legs: v.legs as number[] };
        }
        return { type: t, node: node() };
      case 'speed_limit': if (!isNum(v.speed) || v.speed < 1 || v.speed > 40) throw bad('"speed" is meters per second, 1 to 40.'); return { type: t, link: link('link'), speed: v.speed };
      case 'speed_hump': if (!isNum(v.position) || v.position < 0) throw bad('"position" is meters from the start of the link.'); return { type: t, link: link('link'), position: v.position };
      case 'traffic_circle': return { type: t, node: node() };
      case 'control': if (typeof v.control !== 'string' || !CONTROLS.includes(v.control)) throw bad(`"control" is one of ${CONTROLS.join(', ')}.`); return { type: t, node: node(), control: v.control as Intervention & never };
      case 'signal_timing': if (!isNum(v.cycle) || v.cycle < 20 || v.cycle > 240) throw bad('"cycle" is seconds, 20 to 240.'); return { type: t, node: node(), cycle: v.cycle };
      case 'one_way': return { type: t, link: link('link') };
      case 'turn_ban': return { type: t, fromLink: link('fromLink'), toLink: link('toLink') };
      case 'diagonal_diverter': if (!isNum(v.bearing) || v.bearing < 0 || v.bearing >= 180) throw bad('"bearing" is degrees clockwise from north, 0 up to 180.'); return { type: t, node: node(), bearing: v.bearing };
      default: throw bad(`"${t}" is not an intervention type.`);
    }
  });
}

export function resolvePeriod(entry: AreaEntry, demand: Demand, ...wanted: (string | undefined)[]): { id: string; label: string } {
  const ids = demand.periods.map((p) => p.id);
  const w = wanted.find((x) => x !== undefined);
  const id = w ?? defaultPeriod(entry, demand.periods);
  if (!ids.includes(id)) throw new CliError(`Unknown period "${id}". Periods for this area: ${ids.join(', ')}.`, EXIT.usage);
  return { id, label: demand.periods.find((p) => p.id === id)!.label };
}

const r1 = (x: number) => Math.round(x * 10) / 10;
const pct = (b: number, s: number) => (b !== 0 ? r1(((s - b) / Math.abs(b)) * 100) : null);

const KIND_UNIT: Record<Kind, string> = { speed: 'mph', share: 'percent', minutes: 'minutes', seconds: 'seconds', count: 'count', flow: 'cars an hour', index: 'index (unitless)' };

const r3 = (x: number) => Math.round(x * 1000) / 1000;
export interface MetricRow {
  id: string; label: string; unit: string; baseline: number | null; scenario: number | null; change: number | null; changePct: number | null; lowerIsBetter: boolean | null;
  /** Why a value is null, for figures that can be unavailable (a severity mean with no scored encounter is not a measured zero). */
  unavailable?: { baseline?: string; scenario?: string };
}

/** Every figure of the app's Results cards in display units (cars an hour, mph, minutes, percent). */
export function metricRows(base: Metrics, scen: Metrics): MetricRow[] {
  const cards = [...CARDS, ...(hasModes(scen) && hasModes(base) ? MODE_CARDS : [])];
  return cards.flatMap((c) => c.metrics.map((d) => {
    const b = d.get(base), s = d.get(scen);
    const ok = Number.isFinite(b) && Number.isFinite(s);
    const bd = ok ? displayValue(d.kind as Kind, b) : null, sd = ok ? displayValue(d.kind as Kind, s) : null;
    const rd = d.kind === 'index' ? r3 : r1;
    const why = { baseline: Number.isFinite(b) ? null : d.why?.(base) ?? null, scenario: Number.isFinite(s) ? null : d.why?.(scen) ?? null };
    return {
      id: d.id, label: d.label, unit: KIND_UNIT[d.kind as Kind],
      baseline: bd === null ? null : rd(bd), scenario: sd === null ? null : rd(sd), change: bd === null || sd === null ? null : rd(sd - bd), changePct: bd === null || sd === null ? null : pct(bd, sd),
      lowerIsBetter: d.lowerIsBetter,
      ...(why.baseline || why.scenario ? { unavailable: { ...(why.baseline ? { baseline: why.baseline } : {}), ...(why.scenario ? { scenario: why.scenario } : {}) } } : {}),
    };
  }));
}

export interface BlockRow {
  block: number; label: string; street: string; class: string; links: number[];
  allCars: { baseline: number; scenario: number; change: number };
  throughCars: { baseline: number; scenario: number; change: number; beyondNoise: boolean };
  meanSpeedMph: { baseline: number | null; scenario: number | null; change: number | null };
}

const isSide = (net: Network, b: Block) => b.links.some((id) => isLocal(net.links[id]));

/**
 * One row per block with its cars an hour (both directions summed), as the Streets tab shows them. `side` keeps the study area's residential
 * and service blocks, the streets the through-car count covers; `all` keeps every block the Streets tab lists. A block with no cars in either run is left out.
 */
export function blockRows(net: Network, idx: NetIndex, base: Float32Array, scen: Float32Array, scope: 'side' | 'all'): BlockRow[] {
  const B = linkStatsView(base), S = linkStatsView(scen);
  const rows: BlockRow[] = [];
  for (const b of idx.blocks) {
    if (scope === 'side' ? !isSide(net, b) : !(b.inFocus)) continue;
    const bs = aggregate(B, b.links), ss = aggregate(S, b.links);
    if (bs.flow <= 0 && ss.flow <= 0 && bs.cut <= 0 && ss.cut <= 0) continue;
    const spd = (a: { flow: number; speed: number }) => (a.flow > 0 ? r1(a.speed * MPS_TO_MPH) : null);
    const sb = spd(bs), sc = spd(ss);
    const ct = ss.cut - bs.cut;
    rows.push({
      block: b.key, label: b.label, street: b.name, class: b.cls, links: b.links,
      allCars: { baseline: Math.round(bs.flow), scenario: Math.round(ss.flow), change: Math.round(ss.flow - bs.flow) },
      throughCars: { baseline: Math.round(bs.cut), scenario: Math.round(ss.cut), change: Math.round(ct), beyondNoise: Math.abs(ct) > DEAD_BAND_CUTTHROUGH },
      meanSpeedMph: { baseline: sb, scenario: sc, change: sb === null || sc === null ? null : r1(sc - sb) },
    });
  }
  return rows;
}

export interface UnplacedRow { type: string; lon: number; lat: number; reason: string; nearStreet: string | null }

export interface ReportInput {
  area: AreaEntry; network: Network; demand: Demand; index: NetIndex;
  hashes: { network: string; demand: string }; simulator: string;
  period: { id: string; label: string }; seed: number; seconds: number; demandScale: number;
  interventions: Intervention[]; unplaced: Unplaced[]; source: Scenario['source'];
  base: { metrics: Metrics; linkStats: Float32Array }; scen: { metrics: Metrics; linkStats: Float32Array };
  blocks: 'side' | 'all' | 'none'; top: number; notes: string[];
}

const health = (m: Metrics) => { const h = networkHealth(m); return { vehiclesOnNetwork: h.inNetwork, tripsWaitingToEnter: h.backlog, removedForGridlock: h.gridlockRemoved, unroutableTrips: h.unroutable, oversaturated: h.oversaturated }; };

export function buildReport(i: ReportInput) {
  const { network: net, index: idx, base, scen } = i;
  const ct = (m: Metrics) => m.cutThrough.vehiclesPerHour;
  const b = ct(base.metrics), s = ct(scen.metrics);
  const table = intentTable(i.demand.intents, base.metrics, scen.metrics);
  const cal = i.area.calibration;
  const link = encodeScenario(net, i.interventions, { area: i.area.id, period: i.period.id, demandScale: i.demandScale });
  const rows = i.blocks === 'none' ? [] : blockRows(net, idx, base.linkStats, scen.linkStats, i.blocks);
  const byChange = (x: BlockRow, y: BlockRow) => y.throughCars.change - x.throughCars.change || y.allCars.change - x.allCars.change || x.label.localeCompare(y.label);
  const sorted = [...rows].sort(byChange);
  const gains = sorted.filter((r) => r.throughCars.change > 0).slice(0, i.top);
  const drops = [...sorted].reverse().filter((r) => r.throughCars.change < 0).slice(0, i.top);
  const unplaced: UnplacedRow[] = i.unplaced.map((u) => ({ type: u.type, lon: +u.lon.toFixed(6), lat: +u.lat.toFixed(6), reason: u.reason, nearStreet: nearestStreetName(net, u.lon, u.lat) }));
  return {
    reportVersion: REPORT_VERSION,
    disclaimer: REPORT_DISCLAIMER,
    inputs: {
      area: i.area.id, areaName: i.area.name, period: i.period.id, periodLabel: i.period.label,
      seed: i.seed, simulatedSeconds: i.seconds, demandScale: i.demandScale, source: i.source,
      link: link || null,
      interventions: i.interventions.map((iv) => ({ ...iv, label: describeIntervention(iv, net, idx) })),
      unplacedInterventions: unplaced,
      hashes: { network: i.hashes.network.slice(0, 16), demand: i.hashes.demand.slice(0, 16), simulator: i.simulator },
      notes: i.notes,
    },
    calibration: { status: cal?.status ?? 'uncalibrated', note: cal?.note ?? null, caveat: (cal as { caveat?: string } | undefined)?.caveat ?? null },
    headline: {
      throughCarsPerHour: { definition: 'Through cars (neither trip end in the study area) that use a residential or service street in the study area, each counted once, in cars an hour over the run.', baseline: r1(b), scenario: r1(s), change: r1(s - b), changePct: pct(b, s) },
    },
    metrics: metricRows(base.metrics, scen.metrics),
    throughCarsByReason: table ? {
      unit: 'cars an hour', total: { baseline: table.baseTotal, scenario: table.scenTotal, change: table.changeTotal },
      reasons: table.rows.map((r) => ({ id: r.id, label: r.label, basis: r.basis, section: r.section ?? null, baseline: r.base, scenario: r.scen, change: r.change })),
    } : null,
    networkHealth: { baseline: health(base.metrics), scenario: health(scen.metrics), invalidInterventionsSkippedBySimulator: scen.metrics.invalidInterventions ?? 0, unplacedInterventions: unplaced.length },
    blocks: i.blocks === 'none' ? null : {
      scope: i.blocks === 'side' ? 'study-area residential and service blocks' : 'every block the Streets tab lists',
      units: { allCars: 'cars an hour, both directions', throughCars: 'cars an hour, both directions', meanSpeed: 'mph, flow-weighted' },
      noiseBandThroughCarsPerHour: DEAD_BAND_CUTTHROUGH,
      count: rows.length,
      ...(i.blocks === 'side' ? { topGains: gains, topDrops: drops } : { all: sorted }),
    },
  };
}

