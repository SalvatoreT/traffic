import { useEffect, useMemo, useState } from 'react';
import './assumptions.css';
import type { AreaBundle, DemandIntent } from '../types';
import { assumptionsCurrent, fetchAssumptions, intentShares, type AssumedMovementView, type AssumptionsFile } from '../lib/assumptions';
import { baselineIntent, baselineVerdict, fetchBaselineIntents, type BaselineIntents } from '../lib/baseline-intents';
import { buildIntentMap } from '../lib/intentmap';
import { IntentMap } from './IntentMap';
import { OverviewMap, TurnMap } from './TurnMap';
import { buildOverview, buildTurnMap } from '../lib/turnmap';
import { BASIS_HELP, BASIS_TEXT, OTHER_ID, byCars, describePaths, endsSentence, isLocal, rampOfIntent, rampPoint } from '../lib/intents';
import { ATTRIBUTION } from '../lib/mapexport';
import type { NetIndex } from '../lib/naming';
import { buildBaseMap } from '../lib/picture';
import type { LoadedHashes } from '../lib/proposals';
import type { Mode } from '../lib/ramps';
import { AnchorHeading, NavLink } from './Anchor';

interface Props {
  bundle: AreaBundle; index: NetIndex; mode: Mode;
  hashes: LoadedHashes | null;
  /** The simulator's fingerprint: undefined while the engine starts, null when it has none (the mock engine). */
  fingerprint: string | null | undefined;
}

const shortLabel = (label: string) => label.replace(/\s*\(.*\)\s*$/, '');
const rounded = (n: number | undefined) => (n === undefined ? '—' : String(Math.round(n)));
const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

function useJson<T>(load: () => Promise<T | null>, key: string, skip: boolean): { value: T | null; done: boolean } {
  const [s, setS] = useState<{ value: T | null; done: boolean }>({ value: null, done: false });
  useEffect(() => {
    if (skip) { setS({ value: null, done: true }); return; }
    let live = true;
    void load().then((v) => { if (live) setS({ value: v, done: true }); });
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, skip]);
  return s;
}

export function Assumptions({ bundle, index, mode, hashes, fingerprint }: Props) {
  const area = bundle.entry.id;
  const periods = bundle.demand.periods;
  const first = bundle.entry.calibration?.defaultPeriod ?? periods[0]?.id;
  const order = useMemo(() => [...periods].sort((a, b) => Number(b.id === first) - Number(a.id === first)), [periods, first]);
  const periodName = (id: string) => shortLabel(periods.find((p) => p.id === id)?.label ?? id);
  const assumed = useJson<AssumptionsFile>(() => fetchAssumptions(area), area, bundle.synthetic);
  const baseline = useJson<BaselineIntents>(() => fetchBaselineIntents(area), area, bundle.synthetic || !bundle.demand.intents?.length);
  const status = !baseline.done ? 'loading' : !baseline.value ? 'missing' : fingerprint === undefined || !hashes ? 'pending'
    : baselineVerdict(baseline.value, { area, networkHash: hashes.network, demandHash: hashes.demand, simulator: fingerprint }) === 'ok' ? 'ok' : 'stale';
  const defs = bundle.demand.intents;
  return (
    <div className="assume-view">
      <AnchorHeading as="h2" id="assumptions" label="Assumptions">Assumptions</AnchorHeading>
      <p>
        These are the judgment calls in the model: the parts that rest on reasoning and not on a count. They are the first things to question, and changing any of them would change the results.
        The measured inputs, the data behind them and the research are on the{' '}
        <NavLink view="sources" className="link">Sources</NavLink> page.
      </p>
      <Movements file={assumed.value} loaded={assumed.done} order={order.map((p) => p.id)} periodName={periodName} demandHash={hashes?.demand ?? null} net={bundle.network} mode={mode} />
      {defs?.length ? <Reasons defs={defs} bundle={bundle} index={index} mode={mode} baseline={baseline.value} status={status} order={order.map((p) => p.id)} first={first} periodName={periodName} /> : null}
      <p className="muted small">Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a> (ODbL).</p>
    </div>
  );
}

const MOVEMENTS_ID = 'assumed-movement-flows';
const MovementsHeading = () => <AnchorHeading id={MOVEMENTS_ID} label="Assumed movement flows">Assumed movement flows</AnchorHeading>;

function Movements({ file, loaded, order, periodName, demandHash, net, mode }: { file: AssumptionsFile | null; loaded: boolean; order: string[]; periodName: (id: string) => string; demandHash: string | null; net: AreaBundle['network']; mode: Mode }) {
  const intro = (
    <>
      <p>
        A turn counts as an <strong>assumed movement</strong> when the volunteer count shows cars making it and the model's routing alone did not send enough cars that way. The counts show cars making each turn listed here.
        To match them, the model assigns trips to each turn, up to the counted volume. When a change blocks a turn, those trips try the same kind of turn on a parallel street, then their ordinary route.
      </p>
    </>
  );
  if (!loaded) return <section aria-labelledby={MOVEMENTS_ID}><MovementsHeading />{intro}<p className="muted" role="status">Loading the turns…</p></section>;
  if (!file) return <section aria-labelledby={MOVEMENTS_ID}><MovementsHeading />{intro}<p className="muted">The list of movements is not available for this area.</p></section>;
  const counted = order.filter((p) => file.count.measured.includes(p) || file.count.scaled.includes(p));
  const lead = order[0];
  const detours = [...new Set(file.movements.map((m) => m.maxDetour))];
  const extra = detours.length === 1 ? ` A trip joins a turn only if the turn adds no more than ${Math.round((detours[0] - 1) * 100)}% to its best route.` : '';
  const scaled = file.count.scaled.map(periodName).join(' and ');
  const groups = groupMovements(net, file.movements);
  const mapped = groups.some((g) => g.title !== null);
  return (
    <section aria-labelledby={MOVEMENTS_ID}>
      <MovementsHeading />
      {intro}
      <p>
        <strong>Counted:</strong> the cars an hour that made each turn, from {file.count.label}, one hour each in {file.count.measured.map(periodName).join(' and ')}.
        {scaled && ` ${scaled} has no count: its figure is the count scaled by assumed volume factors.`}{' '}
        <strong>Assumed:</strong> how many cars the model assigns to each turn in the {periodName(lead)}, how many of those are through cars (neither trip end in the study area), and who the cars are.{extra}
      </p>
      {mapped && <p>On each map the two highlighted streets are the one the cars arrive on and the one they leave on. The arrow curves through the junction the way they turn and the numbered circle marks the junction. The street names and the arrow carry the same information, so the highlight color is not needed to read a map.</p>}
      {demandHash !== null && !assumptionsCurrent(file, demandHash) && <p className="caveat">These figures were made for an earlier version of the demand data, so they may not match the model that is loaded.</p>}
      <MovementCards groups={groups} net={net} mode={mode} counted={counted} lead={lead} scaled={file.count.scaled} periodName={periodName} />
      <p className="move-key">Cars an hour. Percentages are shares of the cars assigned to that turn. An assigned number below the counted one means the model places only part of the count on this turn; the rest is left to the ordinary routing.{mapped && ` ${ATTRIBUTION}.`}</p>
    </section>
  );
}

interface MoveGroup { key: string; id: string | null; title: string | null; items: { m: AssumedMovementView; n: number }[] }

/** The movements under a subheading per pair of streets they connect, numbered in the order shown; movements without map fields share one untitled group. */
export function groupMovements(net: AreaBundle['network'], ms: AssumedMovementView[]): MoveGroup[] {
  const groups: MoveGroup[] = [];
  for (const m of ms) {
    const names = m.from !== undefined && m.to !== undefined && net.links[m.from] && net.links[m.to]
      ? [...new Set([net.links[m.from].name.trim(), net.links[m.to].name.trim()])].filter(Boolean).sort() : [];
    const key = names.join('|');
    let g = groups.find((x) => x.key === key);
    if (!g) { g = { key, id: null, title: names.length ? names.join(' and ') : null, items: [] }; groups.push(g); }
    g.items.push({ m, n: 0 });
  }
  let n = 0;
  const taken = new Set<string>(['assumptions', MOVEMENTS_ID, REASONS_ID]);
  for (const g of groups) {
    for (const it of g.items) it.n = ++n;
    if (!g.title) continue;
    const base = g.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'streets';
    let id = base, i = 2;
    while (taken.has(id)) id = `${base}-${i++}`;
    taken.add(id);
    g.id = id;
  }
  return groups;
}

function MovementCards({ groups, net, mode, counted, lead, scaled, periodName }: { groups: MoveGroup[]; net: AreaBundle['network']; mode: Mode; counted: string[]; lead: string; scaled: string[]; periodName: (id: string) => string }) {
  const base = useMemo(() => buildBaseMap(net), [net]);
  const all = groups.flatMap((g) => g.items);
  const turns = all.flatMap((it) => (it.m.from !== undefined && it.m.to !== undefined && net.links[it.m.from] && net.links[it.m.to] ? [{ n: it.n, from: it.m.from, to: it.m.to }] : []));
  const overview = useMemo(() => (turns.length ? buildOverview(net, turns, base) : null), [net, base, turns.map((t) => `${t.from}-${t.to}`).join(',')]); // eslint-disable-line react-hooks/exhaustive-deps
  const alt = overview ? overviewAlt(net, turns, groups) : '';
  return (
    <>
      {overview && (
        <figure className="move-overview">
          <OverviewMap model={overview} alt={alt} />
          <figcaption className="muted small">Where the {turns.length} assumed turns are. The numbers match the cards below.</figcaption>
        </figure>
      )}
      {groups.map((g) => (
        <div key={g.key} className="move-group">
          {g.title && g.id && <AnchorHeading as="h4" id={g.id} label={g.title}>{g.title}</AnchorHeading>}
          <ul className="moves">
            {g.items.map(({ m, n }) => <MovementCard key={m.id} m={m} n={n} net={net} mode={mode} base={base} counted={counted} lead={lead} scaled={scaled} periodName={periodName} />)}
          </ul>
        </div>
      ))}
    </>
  );
}

function overviewAlt(net: AreaBundle['network'], turns: { n: number; from: number; to: number }[], groups: MoveGroup[]): string {
  const parts = groups.filter((g) => g.title).map((g) => {
    const ns = g.items.filter((it) => turns.some((t) => t.n === it.n)).map((it) => it.n);
    return `${ns.length === 1 ? 'turn' : 'turns'} ${ns.join(', ')} at ${g.title}`;
  });
  return `Map of the study area with the ${turns.length} assumed turns numbered: ${parts.join('; ')}.`;
}

function MovementCard({ m, n, net, mode, base, counted, lead, scaled, periodName }: { m: AssumedMovementView; n: number; net: AreaBundle['network']; mode: Mode; base: ReturnType<typeof buildBaseMap>; counted: string[]; lead: string; scaled: string[]; periodName: (id: string) => string }) {
  const a = m.assigned[lead];
  const who = intentShares(m, lead);
  const ok = m.from !== undefined && m.to !== undefined && !!net.links[m.from] && !!net.links[m.to];
  const model = useMemo(() => (ok ? buildTurnMap(net, m.from!, m.to!, base) : null), [ok, net, m.from, m.to, base]);
  return (
    <li className="move">
      <AnchorHeading as="h5" id={`move-${m.id}`} label={m.label}><span className="move-n">{n}</span> {m.label}</AnchorHeading>
      {model && <TurnMap model={model} n={n} mode={mode} alt={`Turn ${n}. Map of ${model.words}. A curved arrow runs from the first street through the junction onto the second.`} />}
      <dl className="move-nums">
        {counted.map((p) => <div key={p}><dt>Counted, {periodName(p)}{scaled.includes(p) ? ' (scaled)' : ''}</dt><dd>{rounded(m.counted[p])}{m.belowThreshold?.[p] !== undefined && <span className="tag tag-local">counted, no trips assigned</span>}</dd></div>)}
        <div className="assigned"><dt>Assigned, {periodName(lead)}</dt><dd>{rounded(a?.total)}</dd></div>
        <div className="assigned"><dt>Through cars, {periodName(lead)}</dt><dd>{rounded(a?.through)}</dd></div>
      </dl>
      {m.belowThreshold && Object.keys(m.belowThreshold).length > 0 && m.belowThresholdNote && <p className="muted move-below">{m.belowThresholdNote}</p>}
      {who.length > 0 && <Who who={who} lead={periodName(lead)} />}
    </li>
  );
}

function Who({ who, lead }: { who: ReturnType<typeof intentShares>; lead: string }) {
  const wide = () => { try { return window.matchMedia('(min-width: 720px)').matches; } catch { return true; } };
  const [open, setOpen] = useState(wide);
  return (
    <details className="who-details" open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary>Who the cars are assumed to be, {lead}</summary>
      <ul className="who">
        {who.map((w) => (
          <li key={w.id}>
            <span className="pct">{w.pct}%</span> {w.label}
            <span className={`tag ${w.through ? 'tag-through' : 'tag-local'}`}>{w.through ? 'through cars' : 'start or end here'}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}

type Status = 'loading' | 'missing' | 'pending' | 'stale' | 'ok';
const STATUS_NOTE: Record<Exclude<Status, 'ok'>, string> = {
  loading: 'Loading today’s cars an hour for each reason…',
  pending: 'Today’s cars an hour and the maps appear once the simulation engine has started.',
  missing: 'The stored baseline for these maps is not available, so the cards show no maps or car counts.',
  stale: 'The stored baseline was computed for a different version of the street network, demand or simulator than the one loaded, so the cards show no maps or car counts.',
};

const REASONS_ID = 'why-cars-cut-through';

function Reasons({ defs, bundle, index, mode, baseline, status, order, first, periodName }: {
  defs: DemandIntent[]; bundle: AreaBundle; index: NetIndex; mode: Mode; baseline: BaselineIntents | null; status: Status; order: string[]; first: string | undefined; periodName: (id: string) => string;
}) {
  const net = bundle.network;
  const base = useMemo(() => buildBaseMap(net), [net]);
  const file = status === 'ok' ? baseline : null;
  const cars = (d: DemandIntent) => (file && first ? baselineIntent(file, first, defs, d.id)?.vph ?? 0 : 0);
  const sorted = file && first ? byCars(defs, cars).map((i) => defs.find((d) => d.id === i)!) : defs;
  const other = file && first ? file.periods[first]?.byIntent.find((b) => b.id === OTHER_ID) : undefined;
  return (
    <section aria-labelledby={REASONS_ID}>
      <AnchorHeading id={REASONS_ID} label="Why cars cut through">Why cars cut through</AnchorHeading>
      <p>
        These are hypotheses about why drivers cross the study area without an end in it, not what drivers said. A through trip that uses a residential or service street is filed under the first reason that fits: the freeway on-ramp it will use, the off-ramp it came by, or, for trips that use no ramp, where it starts and ends;
        any other goes under Other. <strong>{BASIS_TEXT.observed}:</strong> {BASIS_HELP.observed} <strong>{BASIS_TEXT.assumed}:</strong> {BASIS_HELP.assumed}
      </p>
      <p>
        Each map shows today’s traffic in the {first ? periodName(first) : 'baseline'}: the dashed violet line is the typical path of that reason’s cars, drawn wider where more cars an hour use the street, with arrowheads for the direction.
        {other && ` Through cars that fit none of the reasons are tallied as Other: ${Math.round(other.vehiclesPerHour)} an hour.`}
      </p>
      {status !== 'ok' && <p className="muted" role="status">{STATUS_NOTE[status]}</p>}
      <ul className="reasons">
        {sorted.map((d) => <ReasonCard key={d.id} d={d} net={net} index={index} mode={mode} base={base} file={file} order={order} first={first} periodName={periodName} defs={defs} ramps={bundle.demand.ramps} />)}
      </ul>
    </section>
  );
}

function ReasonCard({ d, net, index, mode, base, file, order, first, periodName, defs, ramps }: {
  d: DemandIntent; net: AreaBundle['network']; index: NetIndex; mode: Mode; base: ReturnType<typeof buildBaseMap>; file: BaselineIntents | null; order: string[]; first: string | undefined; periodName: (id: string) => string; defs: DemandIntent[]; ramps: AreaBundle['demand']['ramps'];
}) {
  const ramp = rampOfIntent(d, ramps);
  const rampAt = useMemo(() => (ramp ? rampPoint(net, ramp) : null), [ramp, net]);
  const lead = file && first ? baselineIntent(file, first, defs, d.id) : null;
  const perPeriod = file ? order.map((p) => ({ p, v: baselineIntent(file, p, defs, d.id)?.vph })).filter((x) => x.v !== undefined) : [];
  const drawn = lead && lead.paths.segments.some((s) => isLocal(net.links[s.link]));
  const text = lead ? describePaths(net, index, lead.paths) : '';
  const model = useMemo(() => (drawn && lead ? buildIntentMap(net, index, lead.paths, base, rampAt) : null), [drawn, lead, net, index, base, rampAt]);
  const widest = lead ? Math.round(lead.paths.maxVph) : 0;
  const alt = `${d.label}. Map of today’s traffic in the ${first ? periodName(first) : 'baseline'}. ${text} The widest line is about ${widest} ${plural(widest, 'car', 'cars')} an hour.${ramp ? ` The ramp is marked on the map: ${ramp.label}.` : ''}`;
  return (
    <li className="reason">
      <div className="reason-head">
        <AnchorHeading as="h4" id={`reason-${d.id}`} label={d.label}>{d.label}</AnchorHeading>
      </div>
      <p><span className={`badge badge-${d.basis}`} title={BASIS_HELP[d.basis]}>{BASIS_TEXT[d.basis]}</span>{d.section && <span className="intent-sec"> {d.section}</span>}</p>
      <p className="reason-note">{d.note}</p>
      {lead?.ends && endsSentence(d, lead.ends) && <p className="reason-ends">{endsSentence(d, lead.ends)}</p>}
      {d.avoids && <p>Would otherwise use {d.avoids}, by the model’s shortest route with the side streets closed.</p>}
      {perPeriod.length > 0 && (
        <dl className="reason-nums" aria-label="Through cars an hour today">
          {perPeriod.map((x) => <div key={x.p}><dt>{periodName(x.p)}</dt><dd>{Math.round(x.v!)} an hour</dd></div>)}
        </dl>
      )}
      {model && lead && (
        <figure>
          <IntentMap model={model} mode={mode} alt={alt} />
          <figcaption>
            <p>{text}</p>
            <p className="muted">{first ? periodName(first) : 'Baseline'}, today’s traffic. Widest line: {widest} an hour. {ATTRIBUTION}.</p>
          </figcaption>
        </figure>
      )}
      {lead && !model && <p className="muted">{text}</p>}
    </li>
  );
}
