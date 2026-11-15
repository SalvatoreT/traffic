import { useEffect, useMemo, useRef, useState } from 'react';
import './assumptions.css';
import type { AreaBundle, DemandIntent } from '../types';
import { assumptionsCurrent, fetchAssumptions, intentShares, type AssumedMovementView, type AssumptionsFile } from '../lib/assumptions';
import { baselineIntent, baselineVerdict, fetchBaselineIntents, type BaselineIntents } from '../lib/baseline-intents';
import { buildIntentMap } from '../lib/intentmap';
import { IntentMap } from './IntentMap';
import { BASIS_HELP, BASIS_TEXT, OTHER_ID, describePaths, isLocal } from '../lib/intents';
import { ATTRIBUTION } from '../lib/mapexport';
import type { NetIndex } from '../lib/naming';
import { buildBaseMap } from '../lib/picture';
import type { LoadedHashes } from '../lib/proposals';
import type { Mode } from '../lib/ramps';

interface Props {
  bundle: AreaBundle; index: NetIndex; mode: Mode;
  hashes: LoadedHashes | null;
  /** The simulator's fingerprint: undefined while the engine starts, null when it has none (the mock engine). */
  fingerprint: string | null | undefined;
  focusRef?: string | null;
  onSources(): void;
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

export function Assumptions({ bundle, index, mode, hashes, fingerprint, focusRef, onSources }: Props) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (focusRef) root.current?.querySelector<HTMLElement>(`#ref-${CSS.escape(focusRef)}`)?.scrollIntoView({ block: 'start' });
  }, [focusRef]);
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
    <div className="assume-view" ref={root}>
      <h2>Assumptions</h2>
      <p>
        These are the judgment calls in the model: the parts that rest on reasoning and not on a count. They are the first things to question, and changing any of them would change the results.
        The measured inputs, the data behind them and the research are on the{' '}
        <button type="button" className="link" onClick={onSources}>Sources</button> page.
      </p>
      <Movements file={assumed.value} loaded={assumed.done} order={order.map((p) => p.id)} periodName={periodName} demandHash={hashes?.demand ?? null} />
      {defs?.length ? <Reasons defs={defs} bundle={bundle} index={index} mode={mode} baseline={baseline.value} status={status} order={order.map((p) => p.id)} first={first} periodName={periodName} /> : null}
      <p className="muted small">Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a> (ODbL).</p>
    </div>
  );
}

function Movements({ file, loaded, order, periodName, demandHash }: { file: AssumptionsFile | null; loaded: boolean; order: string[]; periodName: (id: string) => string; demandHash: string | null }) {
  const intro = (
    <>
      <p>
        A turn counts as an <strong>assumed movement</strong> when the volunteer count shows cars making it and the model's routing alone did not send enough cars that way. The counts show cars making each turn listed here.
        To match them, the model assigns trips to each turn, up to the counted volume. When a change blocks a turn, those trips try the same kind of turn on a parallel street, then their ordinary route.
      </p>
    </>
  );
  if (!loaded) return <section id="ref-movements" aria-labelledby="mv-h" tabIndex={-1}><h3 id="mv-h">Assumed movement flows</h3>{intro}<p className="muted" role="status">Loading the table…</p></section>;
  if (!file) return <section id="ref-movements" aria-labelledby="mv-h" tabIndex={-1}><h3 id="mv-h">Assumed movement flows</h3>{intro}<p className="muted">The table of movements is not available for this area.</p></section>;
  const counted = order.filter((p) => file.count.measured.includes(p) || file.count.scaled.includes(p));
  const lead = order[0];
  const detours = [...new Set(file.movements.map((m) => m.maxDetour))];
  const extra = detours.length === 1 ? ` A trip joins a turn only if the turn adds no more than ${Math.round((detours[0] - 1) * 100)}% to its best route.` : '';
  const scaled = file.count.scaled.map(periodName).join(' and ');
  return (
    <section id="ref-movements" aria-labelledby="mv-h" tabIndex={-1}>
      <h3 id="mv-h">Assumed movement flows</h3>
      {intro}
      <p>
        <strong>Counted:</strong> the cars an hour that made each turn, from {file.count.label}, one hour each in {file.count.measured.map(periodName).join(' and ')}.
        {scaled && ` ${scaled} has no count: its figure is the count scaled by assumed volume factors.`}{' '}
        <strong>Assumed:</strong> how many cars the model assigns to each turn in the {periodName(lead)}, how many of those are through cars (neither trip end in the study area), and who the cars are.{extra}
      </p>
      {demandHash !== null && !assumptionsCurrent(file, demandHash) && <p className="caveat">These figures were made for an earlier version of the demand data, so they may not match the model that is loaded.</p>}
      <table className="move-table" role="table">
        <caption className="sr-only">Assumed movements: counted and assigned cars an hour, and who the cars are assumed to be</caption>
        <thead>
          <tr role="row">
            <th scope="col" role="columnheader">Turn</th>
            {counted.map((p) => <th key={p} scope="col" role="columnheader" className="num">Counted, {periodName(p)}{file.count.scaled.includes(p) ? ' (scaled)' : ''}</th>)}
            <th scope="col" role="columnheader" className="num">Assigned, {periodName(lead)}</th>
            <th scope="col" role="columnheader" className="num">Through cars, {periodName(lead)}</th>
            <th scope="col" role="columnheader">Who the cars are assumed to be, {periodName(lead)}</th>
          </tr>
        </thead>
        <tbody>
          {file.movements.map((m) => <MovementRow key={m.id} m={m} counted={counted} lead={lead} scaled={file.count.scaled} periodName={periodName} />)}
        </tbody>
      </table>
      <p className="move-key">Cars an hour. Percentages are shares of the cars assigned to that turn. An assigned number below the counted one means the model places only part of the count on this turn; the rest is left to the ordinary routing.</p>
    </section>
  );
}

function MovementRow({ m, counted, lead, scaled, periodName }: { m: AssumedMovementView; counted: string[]; lead: string; scaled: string[]; periodName: (id: string) => string }) {
  const a = m.assigned[lead];
  const who = intentShares(m, lead);
  return (
    <tr role="row">
      <th scope="row" role="rowheader">{m.label}</th>
      {counted.map((p) => <td key={p} role="cell" className="num" data-label={`Counted, ${periodName(p)}${scaled.includes(p) ? ' (scaled)' : ''}`}>{rounded(m.counted[p])}</td>)}
      <td role="cell" className="num" data-label={`Assigned, ${periodName(lead)}`}>{rounded(a?.total)}</td>
      <td role="cell" className="num" data-label={`Through cars, ${periodName(lead)}`}>{rounded(a?.through)}</td>
      <td role="cell" className="who-cell" data-label="Who the cars are assumed to be">
        {who.length ? (
          <ul className="who">
            {who.map((w) => (
              <li key={w.id}>
                <span className="pct">{w.pct}%</span> {w.label}
                <span className={`tag ${w.through ? 'tag-through' : 'tag-local'}`}>{w.through ? 'through cars' : 'start or end here'}</span>
              </li>
            ))}
          </ul>
        ) : '—'}
      </td>
    </tr>
  );
}

type Status = 'loading' | 'missing' | 'pending' | 'stale' | 'ok';
const STATUS_NOTE: Record<Exclude<Status, 'ok'>, string> = {
  loading: 'Loading today’s cars an hour for each reason…',
  pending: 'Today’s cars an hour and the maps appear once the simulation engine has started.',
  missing: 'The stored baseline for these maps is not available, so the cards show no maps or car counts.',
  stale: 'The stored baseline was computed for a different version of the street network, demand or simulator than the one loaded, so the cards show no maps or car counts.',
};

function Reasons({ defs, bundle, index, mode, baseline, status, order, first, periodName }: {
  defs: DemandIntent[]; bundle: AreaBundle; index: NetIndex; mode: Mode; baseline: BaselineIntents | null; status: Status; order: string[]; first: string | undefined; periodName: (id: string) => string;
}) {
  const net = bundle.network;
  const base = useMemo(() => buildBaseMap(net), [net]);
  const file = status === 'ok' ? baseline : null;
  const other = file && first ? file.periods[first]?.byIntent.find((b) => b.id === OTHER_ID) : undefined;
  return (
    <section id="ref-intents" aria-labelledby="intents-h" tabIndex={-1}>
      <h3 id="intents-h">Why cars cut through</h3>
      <p>
        These are hypotheses about why drivers cross the study area without an end in it, not what drivers said. A through trip that uses a residential or service street is filed under the first reason whose origin and destination fit;
        any other goes under Other. <strong>{BASIS_TEXT.observed}:</strong> {BASIS_HELP.observed} <strong>{BASIS_TEXT.assumed}:</strong> {BASIS_HELP.assumed}
      </p>
      <p>
        Each map shows today’s traffic in the {first ? periodName(first) : 'baseline'}: the dashed violet line is the typical path of that reason’s cars, drawn wider where more cars an hour use the street, with arrowheads for the direction.
        {other && ` Through cars that fit none of the reasons are tallied as Other: ${Math.round(other.vehiclesPerHour)} an hour.`}
      </p>
      {status !== 'ok' && <p className="muted" role="status">{STATUS_NOTE[status]}</p>}
      <ul className="reasons">
        {defs.map((d) => <ReasonCard key={d.id} d={d} net={net} index={index} mode={mode} base={base} file={file} order={order} first={first} periodName={periodName} defs={defs} />)}
      </ul>
    </section>
  );
}

function ReasonCard({ d, net, index, mode, base, file, order, first, periodName, defs }: {
  d: DemandIntent; net: AreaBundle['network']; index: NetIndex; mode: Mode; base: ReturnType<typeof buildBaseMap>; file: BaselineIntents | null; order: string[]; first: string | undefined; periodName: (id: string) => string; defs: DemandIntent[];
}) {
  const lead = file && first ? baselineIntent(file, first, defs, d.id) : null;
  const perPeriod = file ? order.map((p) => ({ p, v: baselineIntent(file, p, defs, d.id)?.vph })).filter((x) => x.v !== undefined) : [];
  const drawn = lead && lead.paths.segments.some((s) => isLocal(net.links[s.link]));
  const text = lead ? describePaths(net, index, lead.paths) : '';
  const model = useMemo(() => (drawn && lead ? buildIntentMap(net, index, lead.paths, base) : null), [drawn, lead, net, index, base]);
  const widest = lead ? Math.round(lead.paths.maxVph) : 0;
  const alt = `${d.label}. Map of today’s traffic in the ${first ? periodName(first) : 'baseline'}. ${text} The widest line is about ${widest} ${plural(widest, 'car', 'cars')} an hour.`;
  return (
    <li className="reason" id={`reason-${d.id}`}>
      <div className="reason-head">
        <h4>{d.label}</h4>
      </div>
      <p><span className={`badge badge-${d.basis}`} title={BASIS_HELP[d.basis]}>{BASIS_TEXT[d.basis]}</span></p>
      <p className="reason-note">{d.note}</p>
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
