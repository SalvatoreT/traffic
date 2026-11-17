import { useEffect, useMemo, useRef, useState } from 'react';
import type { Intervention, Network } from '../types';
import { changeTicks, DEAD_BAND_CUTTHROUGH } from '../lib/change';
import { badgeKey } from '../lib/legend';
import { ATTRIBUTION, BADGE_NAME, BADGE_TEXT } from '../lib/mapexport';
import type { NetIndex } from '../lib/naming';
import { blockChanges, buildPicture, mismatchNote, periodNote, pathOf, pictureAlt, pictureFacts, type BlockChange } from '../lib/picture';
import { allCarsByBlock, allCarsLine, allCarsPictureLine, allCarsShort, ALL_CARS_MISSING, noiseNote, streetsThatChange, throughLine } from '../lib/proposal-map';
import { seedsPhrase, signedNum, type LoadedHashes, type Proposal, type ProposalGroup } from '../lib/proposals';
import { changeWidthFor, colorForIntensity, divergingGradient, mutedColor, type Mode } from '../lib/ramps';
import { canTrace } from '../lib/redistribution-view';
import { blockMeasured } from '../lib/scope';
import { controlLabel } from '../lib/selection';
import { itemFor, parseRedistribution, redistributionBasis, redistributionLine, redistributionRows, redistributionUrl, redistributionVerdict, type StoredItem, type StoredRedistribution } from '../lib/stored-redistribution';
import { markCenter, markSvg } from '../lib/shareimage';
import { useNear } from '../lib/useNear';

const ROUTE_COLOR = { light: '#5b2a86', dark: '#d9b8ff' } as const;
const BG = { light: '#f1efe8', dark: '#1a222c' } as const;
const INK = { light: '#1b2430', dark: '#e8edf3' } as const;
const WIDTH_SCALE = 0.62;

type Sel = { kind: 'block'; block: number } | { kind: 'iv'; iv: number } | null;
const same = (a: Sel, b: Sel) => !!a && !!b && a.kind === b.kind && (a.kind === 'block' ? a.block === (b as { block: number }).block : a.iv === (b as { iv: number }).iv);

type RState = { status: 'idle' | 'loading' | 'missing' } | { status: 'stale'; reason: string } | { status: 'ok'; data: StoredRedistribution };

/** The stored redirect data for one proposal, fetched when its card nears the screen and checked against what the card's figures were made on. */
function useRedistribution(near: boolean, areaId: string, group: ProposalGroup, p: Proposal, period: string, loaded: LoadedHashes): RState {
  const [state, setState] = useState<RState>({ status: 'idle' });
  const simulator = group.computed.simulator;
  useEffect(() => {
    if (!near) return;
    let dead = false;
    setState({ status: 'loading' });
    (async () => {
      let r: StoredRedistribution | null = null;
      try {
        const res = await fetch(redistributionUrl(areaId, group.id, p.id));
        r = res.ok ? parseRedistribution(await res.text()) : null;
      } catch { r = null; }
      if (dead) return;
      if (!r) { setState({ status: 'missing' }); return; }
      const v = redistributionVerdict(r, {
        group: group.id, proposal: p.id, link: p.link, period, seeds: p.evidence?.seeds ?? group.computed.seeds,
        inputs: { networkHash: group.computed.networkHash, demandHash: group.computed.demandHash, simulator },
        loaded: { network: loaded.network, demand: loaded.demand, simulator: loaded.simulator ?? null },
      });
      setState(v.ok ? { status: 'ok', data: r } : { status: 'stale', reason: v.reason });
    })();
    return () => { dead = true; };
  }, [near, areaId, group, p, period, loaded.network, loaded.demand, loaded.simulator, simulator]);
  return state;
}

interface Props {
  net: Network; index: NetIndex; p: Proposal; group: ProposalGroup; ivs: Intervention[]; areaId: string;
  mode: Mode; periodLabel(id: string): string; searchedPeriods: string[]; loaded: LoadedHashes;
  /** Opens the live "Where traffic goes" view for this proposal. */
  onTrace?(): void;
}

/** Light inline-SVG map of one proposal: through cars an hour by block, its changes in place, and what hovering, focusing or tapping them says. */
export function ProposalMap({ net, index, p, group, ivs, areaId, mode, periodLabel, searchedPeriods, loaded, onTrace }: Props) {
  const pic = p.picture!;
  const box = useRef<HTMLDivElement>(null);
  const near = useNear(box);
  const short = (id: string) => periodLabel(id).replace(/\s*\(.*\)\s*$/, '');
  const when = short(pic.period);
  const runs = p.evidence?.seeds ?? group.computed.seeds;
  const redist = useRedistribution(near, areaId, group, p, pic.period, loaded);

  const facts = useMemo(() => pictureFacts(p, pic, index), [p, pic, index]);
  const model = useMemo(() => buildPicture(net, index, p, pic, ivs, facts), [net, index, p, pic, ivs, facts]);
  const changes = useMemo(() => new Map(blockChanges(pic, index).map((c) => [c.block, c])), [pic, index]);
  const allCars = useMemo(() => allCarsByBlock(p, index), [p, index]);
  const ranked = useMemo(() => streetsThatChange([...changes.values()].filter((c) => blockMeasured(index.blocks[c.block]))), [changes, index]);
  const streets = useMemo(() => (near ? index.blocks.flatMap((b, i) => (blockMeasured(b) ? [{ i, d: pathOf(net.links[b.links[0]].geometry), label: b.label }] : [])) : []), [near, index, net]);
  const marksBy = useMemo(() => {
    const m = new Map<number, typeof model.marks>();
    for (const k of model.marks) m.set(k.iv, [...(m.get(k.iv) ?? []), k]);
    return m;
  }, [model]);
  const ivLabel = (i: number) => p.interventions[i]?.label ?? (ivs[i] ? BADGE_NAME[ivs[i].type] : `Change ${i + 1}`);
  const stored = redist.status === 'ok' ? redist.data : null;
  const itemOf = (i: number): StoredItem | undefined => (stored && ivs[i] ? itemFor(stored, ivs[i]) : undefined);

  const [hover, setHover] = useState<Sel>(null);
  const [pin, setPin] = useState<Sel>(null);
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null);
  const sel = hover ?? pin;
  const toggle = (s: Sel) => setPin((cur) => (same(cur, s) ? null : s));
  const mouseEnter = (s: Sel) => (e: React.PointerEvent) => { if (e.pointerType === 'mouse') setHover(s); };
  const track = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !box.current) return;
    const r = box.current.getBoundingClientRect();
    setTip({ x: e.clientX - r.left, y: e.clientY - r.top });
  };
  const leave = (e: React.PointerEvent) => { if (e.pointerType === 'mouse') { setHover(null); setTip(null); } };

  const v = model.view;
  const unit = model.unit;
  const muted = mutedColor(mode);
  const ink = INK[mode], bg = BG[mode];
  const alt = pictureAlt(p, pic, facts, when);
  const note = periodNote(searchedPeriods.map(short), when);
  const mismatch = mismatchNote(facts, when);
  const kinds = new Set(model.marks.map((m) => m.kind));
  const badgeTypes = [...new Set(model.marks.flatMap((m) => (m.kind === 'badge' ? [m.type] : [])))];
  const signTypes = [...new Set(model.marks.flatMap((m) => (m.kind === 'sign' ? [m.type] : [])))];
  const controls = [...new Set(ivs.flatMap((iv) => (iv.type === 'control' ? [controlLabel(iv.control).toLowerCase()] : [])))];
  const badgeName = (t: Intervention['type']) => (t === 'control' && controls.length ? `${BADGE_NAME.control} (${controls.join(', ')})` : BADGE_NAME[t]);
  const traceable = ivs.map((iv, i) => ({ iv, i })).filter(({ iv }) => canTrace(iv));
  const ticks = changeTicks('cutthrough');

  const selItem = sel?.kind === 'iv' ? itemOf(sel.iv) : undefined;
  const routes = selItem ? selItem.routes.filter((r) => r.links.length > 1 && r.perHour >= 0.5).slice(0, 3) : [];
  const routeGeom = routes.map((r) => {
    const pts: [number, number][] = [];
    for (const l of r.links) for (const q of net.links[l]?.geometry ?? []) { const last = pts[pts.length - 1]; if (!last || last[0] !== q[0] || last[1] !== q[1]) pts.push(q); }
    const mid = pts[Math.floor(pts.length / 2)] ?? [0, 0];
    const a = pts[pts.length - 2] ?? pts[0], b = pts[pts.length - 1] ?? pts[0];
    return { d: pathOf(pts), mid: { x: mid[0], y: -mid[1] }, tip: { x: b[0], y: -b[1], deg: (Math.atan2(-(b[1] - a[1]), b[0] - a[0]) * 180) / Math.PI } };
  });

  const blockText = (b: number) => {
    const c: BlockChange = changes.get(b) ?? { block: b, label: index.blocks[b].label, base: 0, scen: 0, delta: 0 };
    const a = allCars ? (allCars.get(b) ?? { block: b, label: c.label, base: 0, scen: 0, delta: 0 }) : null;
    return { c, line: throughLine(c, when), noise: noiseNote(c.delta), all: a ? allCarsPictureLine(a, c, when) : allCarsLine(p, pic, c.label, when), allShort: a ? allCarsShort(a) : null };
  };
  const readout = (() => {
    if (!sel) return <p className="muted pm-hint">Hover or tap a street or a change on the map, or pick one from the lists. Only side streets inside the study area are measured; the rest is faint context.</p>;
    if (sel.kind === 'block') {
      const t = blockText(sel.block);
      return (
        <div>
          <p className="pm-name"><strong>{t.c.label}</strong></p>
          <p>{t.line}</p>
          {t.noise && <p className="muted small">{t.noise}</p>}
          <p className="small">{t.all ?? ALL_CARS_MISSING}</p>
          <p className="muted small">Through cars only: cars with no trip that starts or ends in the area; {seedsPhrase(runs)}.</p>
        </div>
      );
    }
    const iv = ivs[sel.iv];
    const label = ivLabel(sel.iv);
    if (!iv || !canTrace(iv)) return <div><p className="pm-name"><strong>{label}</strong></p><p className="small">This change does not close a car movement, so no traffic is redirected by it.</p></div>;
    const missing = redist.status === 'stale'
      ? `The stored redirect data is out of date (${redist.reason}).`
      : redist.status === 'missing' ? 'No stored redirect data has been published for this proposal.' : redist.status === 'ok' ? 'The stored redirect data has nothing for this change.' : 'Loading the redirect data…';
    return (
      <div>
        <p className="pm-name"><strong>{label}</strong></p>
        {selItem ? (
          <>
            <p>{redistributionLine(selItem, when)}</p>
            {routes.length > 0 && (
              <ul className="pm-routes">{selItem.routes.slice(0, 3).map((r, k) => <li key={r.streets}><strong>{k + 1}.</strong> {r.streets}: {Math.round(r.perHour)} cars an hour</li>)}</ul>
            )}
            <details className="pm-detail">
              <summary>Where they went, in detail</summary>
              <dl className="pm-rows">{redistributionRows(selItem).map((r) => <div key={r.label}><dt>{r.label}</dt><dd>{r.value}</dd></div>)}</dl>
              {selItem.receiving.length > 0 && <p className="small">Side streets that gain these cars: {selItem.receiving.map((x) => `${x.block} (${Math.round(x.perHour)} an hour)`).join('; ')}.</p>}
            </details>
            {stored && <p className="muted small">{redistributionBasis(stored)}</p>}
          </>
        ) : (
          <p className="small">{missing} {onTrace && <button type="button" className="btn small-btn" onClick={onTrace}>Where traffic goes</button>}</p>
        )}
      </div>
    );
  })();

  const rowProps = (s: Sel) => ({
    onMouseEnter: () => setHover(s), onMouseLeave: () => setHover(null),
    onFocus: () => setPin(s), onClick: () => toggle(s),
    'aria-pressed': same(pin, s),
  });
  const rowCls = (s: Sel) => (same(sel, s) ? 'pm-on' : undefined);
  const top = ranked.slice(0, 8), rest = ranked.slice(8);
  const row = (c: BlockChange) => {
    const s: Sel = { kind: 'block', block: c.block };
    return (
      <tr key={c.block} className={rowCls(s)}>
        <th scope="row"><button type="button" className="pm-link" {...rowProps(s)}>{c.label}</button></th>
        <td>{Math.round(c.base)} → {Math.round(c.scen)}</td>
        <td>{signedNum(Math.round(c.scen) - Math.round(c.base), '', 0).trim()}</td>
        {allCars && (() => { const a = allCars.get(c.block); return <td>{a ? `${Math.round(a.base)} → ${Math.round(a.scen)}` : 'none'}</td>; })()}
      </tr>
    );
  };
  const table = (rows: BlockChange[]) => (
    <table className="pm-table">
      <thead><tr><th scope="col">Street block</th><th scope="col">Through cars an hour, today → proposal</th><th scope="col">Change</th>{allCars && <th scope="col">All cars an hour, today → proposal</th>}</tr></thead>
      <tbody>{rows.map(row)}</tbody>
    </table>
  );

  return (
    <section className="pm" aria-label={`Map of ${p.title}`} onKeyDown={(e) => { if (e.key === 'Escape') { setPin(null); setHover(null); } }}>
      <div className="pm-grid">
        <div className="pm-mapcol">
          <div ref={box} className="pm-frame" style={{ aspectRatio: `${v.w} / ${v.h}` }} onPointerMove={track} onPointerLeave={leave}>
            {near ? (
              <svg className="pm-svg" viewBox={`${v.x} ${v.y} ${v.w} ${v.h}`} role="img" aria-label={alt}>
                <rect x={v.x} y={v.y} width={v.w} height={v.h} fill={bg} />
                <path d={model.minor} fill="none" stroke={muted} strokeWidth={unit} strokeLinecap="round" strokeLinejoin="round" />
                <path d={model.major} fill="none" stroke={muted} strokeWidth={2 * unit} strokeLinecap="round" strokeLinejoin="round" />
                <path d={model.outline} fill="none" stroke={ink} strokeWidth={1.4 * unit} strokeDasharray={`${6 * unit} ${4 * unit}`} opacity={0.75} />
                {model.blocks.map((b) => <path key={b.block} d={b.d} fill="none" stroke={colorForIntensity(b.t, mode, true)} strokeWidth={changeWidthFor(b.t) * WIDTH_SCALE * unit} strokeLinecap="round" strokeLinejoin="round" />)}
                {sel?.kind === 'block' && (() => { const s = streets.find((x) => x.i === sel.block); return s ? <path d={s.d} fill="none" stroke={ink} strokeWidth={11 * unit} strokeLinecap="round" strokeLinejoin="round" opacity={0.9} /> : null; })()}
                {sel?.kind === 'block' && (() => { const s = streets.find((x) => x.i === sel.block); const b = model.blocks.find((x) => x.block === sel.block); return s ? <path d={s.d} fill="none" stroke={b ? colorForIntensity(b.t, mode, true) : muted} strokeWidth={7.5 * unit} strokeLinecap="round" strokeLinejoin="round" /> : null; })()}
                {model.names.map((nm) => <text key={nm.text} x={0} y={0} transform={`translate(${nm.x} ${nm.y}) rotate(${nm.angle})`} textAnchor="middle" dy={-3.5 * unit} fontSize={10.5 * unit} fontWeight={600} fill={ink} stroke={bg} strokeWidth={3 * unit} paintOrder="stroke" strokeLinejoin="round">{nm.text}</text>)}
                {model.pins.map((q) => <text key={q.text + q.x} x={q.x} y={q.y} textAnchor={q.end ? 'end' : 'start'} fontSize={10.5 * unit * 1.15} fontWeight={700} fill={ink} stroke={bg} strokeWidth={3.5 * unit} paintOrder="stroke" strokeLinejoin="round">{q.text}</text>)}
                {streets.map((s) => (
                  <path key={s.i} d={s.d} fill="none" stroke="transparent" strokeWidth={22 * unit} strokeLinecap="round" style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
                    onPointerEnter={mouseEnter({ kind: 'block', block: s.i })} onClick={() => toggle({ kind: 'block', block: s.i })} />
                ))}
                {routeGeom.map((r, k) => (
                  <g key={k} stroke={ROUTE_COLOR[mode]} fill={ROUTE_COLOR[mode]} pointerEvents="none">
                    <path d={r.d} fill="none" strokeWidth={4.2 * unit} strokeLinecap="round" strokeLinejoin="round" opacity={0.95} stroke={bg} />
                    <path d={r.d} fill="none" strokeWidth={2.8 * unit} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${7 * unit} ${3 * unit}`} />
                    <g transform={`translate(${r.tip.x} ${r.tip.y}) rotate(${r.tip.deg}) scale(${unit * 1.3})`}><path d="M0 0 L-10 -5.5 L-10 5.5 Z" stroke={bg} strokeWidth={1.4} paintOrder="stroke" /></g>
                    <g transform={`translate(${r.mid.x} ${r.mid.y})`}><circle r={8 * unit} fill={ROUTE_COLOR[mode]} stroke={bg} strokeWidth={1.5 * unit} /><text textAnchor="middle" dominantBaseline="central" fontSize={10 * unit} fontWeight={700} fill={bg} stroke="none">{k + 1}</text></g>
                  </g>
                ))}
                {[...marksBy.entries()].map(([i, ms]) => {
                  const s: Sel = { kind: 'iv', iv: i };
                  return (
                    <g key={i} style={{ cursor: 'pointer' }} onPointerEnter={mouseEnter(s)} onClick={() => toggle(s)}>
                      {ms.map((m, k) => {
                        const c = markCenter(m, unit);
                        return (
                          <g key={k}>
                            {same(sel, s) && <circle cx={c.x} cy={c.y} r={(m.kind === 'sign' ? 19 : 17) * unit} fill="none" stroke={ink} strokeWidth={2.2 * unit} strokeDasharray={`${4 * unit} ${3 * unit}`} />}
                            <g dangerouslySetInnerHTML={{ __html: markSvg(m, unit, model.bar) }} />
                            <circle cx={c.x} cy={c.y} r={15 * unit} fill="transparent" />
                          </g>
                        );
                      })}
                    </g>
                  );
                })}
              </svg>
            ) : <p className="pm-wait muted small">Map loads as you scroll.</p>}
            {tip && sel && (
              <div className="pm-tip" aria-hidden="true" style={{ left: tip.x, top: tip.y }}>
                {sel.kind === 'block' ? <><strong>{blockText(sel.block).c.label}</strong><br />{blockText(sel.block).line}{blockText(sel.block).allShort && <><br />{blockText(sel.block).allShort}</>}</> : <strong>{ivLabel(sel.iv)}</strong>}
              </div>
            )}
            <p className="pm-attr">{ATTRIBUTION}</p>
          </div>
          <div className="pm-legend">
            <div className="pm-ramp" style={{ background: divergingGradient(mode) }} role="presentation" />
            <div className="pm-ticks" aria-hidden="true">{ticks.map((t) => <span key={t}>{t}</span>)}</div>
            <p className="small muted">{when}, change in through cars an hour on each block, proposal vs. today. Blue: fewer. Orange: more. Thicker line: bigger change. Thin gray: within normal run-to-run variation (about {Math.round(DEAD_BAND_CUTTHROUGH)} cars an hour). Only side streets inside the study area are measured.</p>
            {(kinds.size > 0 || model.pins.length > 0) && (
              <ul className="pm-keys small muted">
                {kinds.has('bar') && <li>Yellow and black bar across a street: closed to through cars.</li>}
                {kinds.has('diverter') && <li>Striped line across a junction: diagonal diverter.</li>}
                {kinds.has('arrow') && <li>Arrow: one-way street, in the direction shown.</li>}
                {signTypes.map((t) => <li key={t}>{badgeKey(t).label}.</li>)}
                {badgeTypes.length > 0 && <li>Lettered badges: {badgeTypes.map((t) => `${BADGE_TEXT[t]} ${badgeName(t)}`).join(', ')}.</li>}
                {model.pins.length > 0 && facts.named && <li>Bold number: change on {facts.named.label}, {facts.namedKind === 'largest' ? 'the block with the largest through-car increase' : 'the block the search flagged'}{model.pins.length > 1 && facts.gain ? `, and on ${facts.gain.label}, the biggest gain in the ${when}` : ''}.</li>}
                {routeGeom.length > 0 && <li>Purple dashed line with a number and an arrow: a route the redirected cars take.</li>}
              </ul>
            )}
            {note && <p className="small muted">{note}</p>}
            {mismatch && <p className="small muted">{mismatch}</p>}
          </div>
        </div>
        <div className="pm-side">
          <div className="pm-read" aria-live="polite">{readout}</div>
          <div className="pm-lists">
          <h5>Streets that change</h5>
          {ranked.length === 0 ? <p className="muted small">No side-street block changes by a whole car an hour in the {when}.</p> : (
            <>
              <p className="muted small">Through cars an hour in the {when}, largest change first{allCars ? ', with all cars (through cars and local trips) beside them' : ''}; {seedsPhrase(runs)}. Select a street to see it on the map.</p>
              {table(top)}
              {rest.length > 0 && <details className="pm-more"><summary>{rest.length} more {rest.length === 1 ? 'block' : 'blocks'}</summary>{table(rest)}</details>}
            </>
          )}
          {traceable.length > 0 && (
            <>
              <h5>Where filtered traffic goes</h5>
              <ul className="pm-goes">
                {traceable.map(({ i }) => {
                  const s: Sel = { kind: 'iv', iv: i };
                  const it = itemOf(i);
                  return (
                    <li key={i} className={rowCls(s)}>
                      <button type="button" className="pm-link" {...rowProps(s)}>{ivLabel(i)}</button>
                      {it ? <span className="muted small"> {redistributionLine(it, when)}</span> : redist.status === 'loading' || redist.status === 'idle' ? <span className="muted small"> Loading…</span> : redist.status === 'ok' ? <span className="muted small"> No redirect data for this change.</span> : null}
                    </li>
                  );
                })}
              </ul>
              {(redist.status === 'missing' || redist.status === 'stale') && <p className="small muted">{redist.status === 'stale' ? `The stored redirect data is out of date (${redist.reason}).` : 'No stored redirect data has been published for this proposal.'} {onTrace && <>Run it live with <button type="button" className="btn small-btn" onClick={onTrace}>Where traffic goes</button>.</>}</p>}
            </>
          )}
          </div>
        </div>
      </div>
    </section>
  );
}

