import { useEffect, useMemo, useRef, useState } from 'react';
import type { Intervention, Network } from '../types';
import { changeTicks, DEAD_BAND_CUTTHROUGH, DEAD_BAND_FLOW } from '../lib/change';
import { badgeKey } from '../lib/legend';
import { ATTRIBUTION, BADGE_NAME, BADGE_TEXT } from '../lib/mapexport';
import type { NetIndex } from '../lib/naming';
import { blockChanges, buildPicture, cardPicture, mismatchNote, periodNote, pathOf, pictureAlt, wholeChange, type BlockChange } from '../lib/picture';
import { allCarsByBlock, allCarsFromFile, allCarsShort, ALL_CARS_MISSING, blockFigures, blockTip, changeTip, mostlyVisible, noiseNote, signedCars, streetsThatChange, throughLine, type Box, type TipText } from '../lib/proposal-map';
import { seedsPhrase, signedNum, type LoadedHashes, type Proposal, type ProposalGroup } from '../lib/proposals';
import { changeWidthFor, colorForIntensity, divergingGradient, mutedColor, type Mode } from '../lib/ramps';
import { canTrace } from '../lib/redistribution-view';
import { blockMeasured } from '../lib/scope';
import { controlLabel } from '../lib/selection';
import { cellCars, connectedRuns, itemFor, parseRedistribution, redistributionBasis, redistributionFigures, redistributionLine, redistributionTip, redistributionUrl, redistributionVerdict, type StoredItem, type StoredRedistribution } from '../lib/stored-redistribution';
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
  const readoutBox = useRef<HTMLDivElement>(null);
  const near = useNear(box);
  const short = (id: string) => periodLabel(id).replace(/\s*\(.*\)\s*$/, '');
  const when = short(pic.period);
  const runs = p.evidence?.seeds ?? group.computed.seeds;
  const redist = useRedistribution(near, areaId, group, p, pic.period, loaded);

  const { kind, pic: mapPic, facts } = useMemo(() => cardPicture(p, pic, index), [p, pic, index]);
  const model = useMemo(() => buildPicture(net, index, p, mapPic, ivs, facts, kind), [net, index, p, mapPic, ivs, facts, kind]);
  const changes = useMemo(() => new Map(blockChanges(pic, index).map((c) => [c.block, c])), [pic, index]);
  const allCars = useMemo(() => allCarsByBlock(p, index), [p, index]);
  const mapChanges = useMemo(() => blockChanges(mapPic, index), [mapPic, index]);
  const ranked = useMemo(() => streetsThatChange(mapChanges.filter((c) => blockMeasured(index.blocks[c.block]))), [mapChanges, index]);
  const band = kind === 'all' ? DEAD_BAND_FLOW : DEAD_BAND_CUTTHROUGH;
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
  const [back, setBack] = useState<HTMLElement | null>(null);
  const [mapSeen, setMapSeen] = useState(true);
  const grid = useRef<HTMLDivElement>(null);
  const pinBy = useRef<'focus' | 'click' | null>(null);
  const sel = hover ?? pin;
  const keyOf = (s: Sel) => (s ? `${s.kind}:${s.kind === 'block' ? s.block : s.iv}` : null);
  const selectionKey = keyOf(sel);
  useEffect(() => {
    if (readoutBox.current) readoutBox.current.scrollTop = 0;
  }, [selectionKey]);
  const dismiss = () => { setPin(null); setHover(null); setBack(null); pinBy.current = null; };
  useEffect(() => {
    if (!sel) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [!sel]);
  const stuck = () => !!grid.current && getComputedStyle(grid.current).getPropertyValue('--pm-pin').trim() === '1';
  const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const viewBox = (): Box => {
    const root = box.current?.closest('.stage');
    const r = root?.getBoundingClientRect();
    return r ? { left: r.left, top: r.top, right: r.right, bottom: r.bottom } : { left: 0, top: 0, right: innerWidth, bottom: innerHeight };
  };
  const toggle = (s: Sel) => {
    if (same(pin, s) && pinBy.current === 'click') { dismiss(); return; }
    setPin(s); pinBy.current = 'click';
  };
  const showOnMap = (from: HTMLElement | null) => {
    const el = box.current;
    if (!el) return;
    if (from) setBack(from);
    el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
  };
  const rowClick = (s: Sel) => (e: React.MouseEvent<HTMLElement>) => {
    const row = e.currentTarget;
    const turnOn = !same(pin, s) || pinBy.current !== 'click';
    toggle(s);
    if (turnOn && !stuck() && box.current && !mostlyVisible(box.current.getBoundingClientRect(), viewBox())) showOnMap(row);
  };
  const backToList = () => { const el = back; setBack(null); el?.focus(); };
  useEffect(() => {
    const el = box.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((es) => { const e = es[es.length - 1]; if (e) setMapSeen(e.intersectionRatio >= 0.5); }, { root: el.closest('.stage'), threshold: [0, 0.25, 0.5, 0.75, 1] });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const mouseEnter = (s: Sel) => (e: React.PointerEvent) => { if (e.pointerType === 'mouse') setHover(s); };
  const leave = (e: React.PointerEvent) => { if (e.pointerType === 'mouse') setHover(null); };

  const v = model.view;
  const unit = model.unit;
  const muted = mutedColor(mode);
  const ink = INK[mode], bg = BG[mode];
  const alt = pictureAlt(p, mapPic, facts, when, kind);
  const note = periodNote(searchedPeriods.map(short), when);
  const mismatch = kind === 'through' ? mismatchNote(facts, when) : '';
  const kinds = new Set(model.marks.map((m) => m.kind));
  const badgeTypes = [...new Set(model.marks.flatMap((m) => (m.kind === 'badge' ? [m.type] : [])))];
  const signTypes = [...new Set(model.marks.flatMap((m) => (m.kind === 'sign' ? [m.type] : [])))];
  const controls = [...new Set(ivs.flatMap((iv) => (iv.type === 'control' ? [controlLabel(iv.control).toLowerCase()] : [])))];
  const badgeName = (t: Intervention['type']) => (t === 'control' && controls.length ? `${BADGE_NAME.control} (${controls.join(', ')})` : BADGE_NAME[t]);
  const traceable = ivs.map((iv, i) => ({ iv, i })).filter(({ iv }) => canTrace(iv));
  const ticks = changeTicks(kind === 'all' ? 'flow' : 'cutthrough');

  const selItem = sel?.kind === 'iv' ? itemOf(sel.iv) : undefined;
  const routes = selItem ? selItem.routes.filter((r) => r.links.length > 1 && r.perHour >= 0.5).slice(0, 3) : [];
  const linkEnds = routes.length ? { from: net.links.map((l) => l.from), to: net.links.map((l) => l.to) } : null;
  const routeGeom = routes.map((r) => {
    const runs = connectedRuns(r.links, linkEnds!.from, linkEnds!.to).map((run) => {
      const pts: [number, number][] = [];
      for (const l of run) for (const q of net.links[l]?.geometry ?? []) { const last = pts[pts.length - 1]; if (!last || last[0] !== q[0] || last[1] !== q[1]) pts.push(q); }
      return pts;
    });
    const pts = runs.flat();
    const mid = pts[Math.floor(pts.length / 2)] ?? [0, 0];
    const a = pts[pts.length - 2] ?? pts[0], b = pts[pts.length - 1] ?? pts[0];
    return { d: runs.map((p) => pathOf(p)).join(' '), mid: { x: mid[0], y: -mid[1] }, tip: { x: b[0], y: -b[1], deg: (Math.atan2(-(b[1] - a[1]), b[0] - a[0]) * 180) / Math.PI } };
  });

  const blockText = (b: number) => {
    const c: BlockChange = changes.get(b) ?? { block: b, label: index.blocks[b].label, base: 0, scen: 0, delta: 0 };
    const a = allCars ? (allCars.get(b) ?? { block: b, label: c.label, base: 0, scen: 0, delta: 0 }) : allCarsFromFile(p, pic, c.label);
    return { c, line: throughLine(c, when), noise: noiseNote(a ? wholeChange(a) : c.delta, band), rows: blockFigures(c, a), hasAll: !!a, allShort: a ? allCarsShort(a) : null };
  };
  const figTable = (caption: string, head: string[], body: React.ReactNode) => (
    <table className="pm-fig">
      <caption>{caption}</caption>
      <thead><tr>{head.map((h, k) => <th key={h} scope="col" className={k === 0 ? 'pm-fig-corner' : undefined}>{h}</th>)}</tr></thead>
      <tbody>{body}</tbody>
    </table>
  );
  const readout = (() => {
    if (!sel) return <p className="muted pm-hint">Hover or tap a street or a change on the map, or pick one from the lists. Only side streets inside the study area are measured; the rest is faint context.</p>;
    if (sel.kind === 'block') {
      const t = blockText(sel.block);
      return (
        <div>
          <p className="pm-name"><strong>{t.c.label}</strong></p>
          {figTable(`${when}, cars an hour on this block`, ['Cars', 'Today', 'With this proposal', 'Change'],
            t.rows.map((r) => (
              <tr key={r.label}><th scope="row">{r.label}</th><td>{r.today}</td><td>{r.withProposal}</td><td className="pm-chg">{signedCars(r.change)}</td></tr>
            )))}
          {t.noise && <p className="muted small">{t.noise}</p>}
          {!t.hasAll && <p className="muted small">{ALL_CARS_MISSING}</p>}
          <p className="muted small pm-foot">Through cars: cars with no trip that starts or ends in the area. Local trips: cars of people who start or end a trip in the area. Figures are the {seedsPhrase(runs)}.</p>
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
            {figTable(`${when}, through cars an hour`, ['Through cars', 'Cars an hour'], <tr><th scope="row">Used this change today</th><td>{cellCars(selItem.usedPerHour)}</td></tr>)}
            {selItem.usedPerHour >= 0.5 && (
              <>
                {figTable('Where those cars went with the proposal', ['Where they went', 'Cars an hour'],
                  redistributionFigures(selItem).map((r) => <tr key={r.label}><th scope="row">{r.label}</th><td>{cellCars(r.value)}</td></tr>))}
                {routes.length > 0 && figTable('Main routes, numbered as on the map', ['Route', 'Cars an hour'],
                  routes.map((r, k) => <tr key={r.streets}><th scope="row"><span className="pm-rn">{k + 1}.</span> {r.streets}</th><td>{cellCars(r.perHour)}</td></tr>))}
                {selItem.receiving.length > 0 && (
                  <details className="pm-detail">
                    <summary>Side streets that gain these cars</summary>
                    {figTable('Side-street blocks that gain these cars', ['Block', 'Cars an hour'],
                      selItem.receiving.map((x) => <tr key={x.block}><th scope="row">{x.block}</th><td>{cellCars(x.perHour)}</td></tr>))}
                  </details>
                )}
              </>
            )}
            {selItem.usedPerHour < 0.5 && <p className="small">Almost no through cars used this in the {when}, so nothing is redirected.</p>}
            {stored && <p className="muted small pm-foot">{redistributionBasis(stored)}</p>}
          </>
        ) : (
          <p className="small">{missing} {onTrace && <button type="button" className="btn small-btn" onClick={onTrace}>Where traffic goes</button>}</p>
        )}
      </div>
    );
  })();

  const tipText = ((): TipText | null => {
    if (!sel) return null;
    if (sel.kind === 'block') { const t = blockText(sel.block); return blockTip(t.c.label, t.line, t.allShort); }
    const iv = ivs[sel.iv];
    if (!iv || !canTrace(iv)) return changeTip(ivLabel(sel.iv), 'Closes no car movement, so no traffic is redirected.');
    return changeTip(ivLabel(sel.iv), selItem ? redistributionTip(selItem) : redist.status === 'loading' || redist.status === 'idle' ? 'Loading the redirect data…' : 'No redirect data for this change.');
  })();
  const rowProps = (s: Sel) => ({
    onMouseEnter: () => setHover(s), onMouseLeave: () => setHover(null),
    onFocus: (e: React.FocusEvent<HTMLElement>) => { if (e.currentTarget.matches(':focus-visible')) { setPin(s); pinBy.current = 'focus'; } },
    onClick: rowClick(s),
    'aria-pressed': same(pin, s),
    'data-pm': keyOf(s)!,
  });
  const rowCls = (s: Sel) => (same(sel, s) ? 'pm-on' : undefined);
  const top = ranked.slice(0, 8), rest = ranked.slice(8);
  const row = (c: BlockChange) => {
    const s: Sel = { kind: 'block', block: c.block };
    const t = changes.get(c.block);
    return (
      <tr key={c.block} className={rowCls(s)}>
        <th scope="row"><button type="button" className="pm-link" {...rowProps(s)}>{c.label}</button></th>
        <td data-label={kind === 'all' ? 'All cars' : 'Through cars'}>{Math.round(c.base)} → {Math.round(c.scen)}</td>
        <td data-label="Change">{signedCars(wholeChange(c))}</td>
        {kind === 'all' && <td data-label="Through cars">{t ? `${Math.round(t.base)} → ${Math.round(t.scen)}` : 'none'}</td>}
        {kind === 'through' && allCars && (() => { const a = allCars.get(c.block); return <td data-label="All cars">{a ? `${Math.round(a.base)} → ${Math.round(a.scen)}` : 'none'}</td>; })()}
      </tr>
    );
  };
  const table = (rows: BlockChange[]) => (
    <table className="pm-table">
      <thead><tr><th scope="col">Street block</th><th scope="col">{kind === 'all' ? 'All cars' : 'Through cars'} an hour, today → proposal</th><th scope="col">Change</th>{kind === 'all' && <th scope="col">Through cars an hour, today → proposal</th>}{kind === 'through' && allCars && <th scope="col">All cars an hour, today → proposal</th>}</tr></thead>
      <tbody>{rows.map(row)}</tbody>
    </table>
  );

  return (
    <section className="pm" aria-label={`Map of ${p.title}`}>
      <div ref={grid} className="pm-grid">
        <div className="pm-mapcol">
          <div ref={box} className="pm-frame" style={{ aspectRatio: `${v.w} / ${v.h}`, '--ar': v.w / v.h } as React.CSSProperties} onPointerLeave={leave}>
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
                  <path key={s.i} data-street={s.i} d={s.d} fill="none" stroke="transparent" strokeWidth={22 * unit} strokeLinecap="round" style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
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
                    <g key={i} data-iv={i} style={{ cursor: 'pointer' }} onPointerEnter={mouseEnter(s)} onClick={() => toggle(s)}>
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
            <p className="pm-attr">{ATTRIBUTION}</p>
          </div>
          <div className="pm-ramp-block">
            <div className="pm-ramp" style={{ background: divergingGradient(mode) }} role="presentation" />
            <div className="pm-ticks" aria-hidden="true">{ticks.map((t) => <span key={t}>{t}</span>)}</div>
            {kind === 'all'
              ? <p className="small muted">{when}, change in all cars an hour on each block (through cars and local trips together), proposal vs. today, {seedsPhrase(runs)}. Colors and numbers on the map are this change. Blue: fewer. Orange: more. Thicker line: bigger change. Thin gray: within normal run-to-run variation (about {Math.round(band)} cars an hour). Only side streets inside the study area are measured. The headline at the top of the card counts through cars over the whole area; this map shows all cars, block by block.</p>
              : <p className="small muted">{when}, change in through cars an hour on each block, proposal vs. today. Blue: fewer. Orange: more. Thicker line: bigger change. Thin gray: within normal run-to-run variation (about {Math.round(band)} cars an hour). Only side streets inside the study area are measured. This file has no all-car map, so the map shows through cars only.</p>}
          </div>
        </div>
        <div className="pm-side">
          <div className="pm-mid">
            <div ref={readoutBox} className="pm-read" role="region" aria-label={`${p.title}: street and intervention details`} tabIndex={0} aria-live="polite" aria-atomic="true">
              {back && sel && <button type="button" className="btn small-btn pm-back" onClick={backToList}>Back to list</button>}
              {readout}
            </div>
            <div className="pm-streets">
              <h4>Streets that change</h4>
              {ranked.length === 0 ? <p className="muted small">No side-street block changes by a whole car an hour in the {when}.</p> : (
                <>
                  <p className="muted small">{kind === 'all' ? `All cars an hour in the ${when}, largest change first, with through cars beside them` : `Through cars an hour in the ${when}, largest change first${allCars ? ', with all cars (through cars and local trips) beside them' : ''}`}; {seedsPhrase(runs)}. Select a street to see it on the map.</p>
                  {table(top)}
                  {rest.length > 0 && <details className="pm-more"><summary>{rest.length} more {rest.length === 1 ? 'block' : 'blocks'}</summary>{table(rest)}</details>}
                </>
              )}
            </div>
          </div>
          <div className="pm-aside">
            {traceable.length > 0 && (
              <div className="pm-filters">
                <h4>Where filtered traffic goes</h4>
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
              </div>
            )}
            <div className="pm-key">
            {(kinds.size > 0 || model.pins.length > 0) && (
              <ul className="pm-keys small muted">
                {kinds.has('bar') && <li>Yellow and black bar across a street: closed to through cars.</li>}
                {kinds.has('diverter') && <li>Striped line across a junction: diagonal diverter.</li>}
                {kinds.has('arrow') && <li>Arrow: one-way street, in the direction shown.</li>}
                {signTypes.map((t) => <li key={t}>{badgeKey(t).label}.</li>)}
                {badgeTypes.length > 0 && <li>Lettered badges: {badgeTypes.map((t) => `${BADGE_TEXT[t]} ${badgeName(t)}`).join(', ')}.</li>}
                {model.pins.length > 0 && kind === 'all' && <li>Bold number: change in all cars an hour on that block, for the biggest gain{facts.drop ? ' and the biggest drop' : ''} in the {when}.</li>}
                {model.pins.length > 0 && kind === 'through' && facts.named && <li>Bold number: change on {facts.named.label}, {facts.namedKind === 'largest' ? 'the block with the largest through-car increase' : 'the block the search flagged'}{model.pins.length > 1 && facts.gain ? `, and on ${facts.gain.label}, the biggest gain in the ${when}` : ''}.</li>}
                {routeGeom.length > 0 && <li>Purple dashed line with a number and an arrow: a route the redirected cars take.</li>}
              </ul>
            )}
            {note && <p className="small muted">{note}</p>}
            {mismatch && <p className="small muted">{mismatch}</p>}
            </div>
          </div>
        </div>
        {sel && !mapSeen && tipText && (
          <div className="pm-peek">
            <span aria-hidden="true"><strong>{tipText.title}</strong>{tipText.lines[0] ? `: ${tipText.lines[0]}` : ''}</span>
            <button type="button" className="btn small-btn" onClick={() => showOnMap(grid.current?.querySelector<HTMLElement>(`[data-pm="${selectionKey}"]`) ?? null)}>Show on map<span className="sr-only">: {tipText.title}</span></button>
          </div>
        )}
      </div>
    </section>
  );
}
