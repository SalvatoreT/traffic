import type { BaseMap } from '../lib/picture';
import type { OverviewModel, TurnMapModel } from '../lib/turnmap';
import { INTENT_COLORS } from '../lib/intents';
import type { Mode } from '../lib/ramps';

const n1 = (v: number) => Math.round(v * 10) / 10;
const frame = (m: { view: { x: number; y: number; w: number; h: number } }) => `${n1(m.view.x)} ${n1(m.view.y)} ${n1(m.view.w)} ${n1(m.view.h)}`;

function Base({ m, nameSize }: { m: BaseMap; nameSize: number }) {
  const { view, unit } = m;
  return (
    <>
      <rect className="imap-bg" x={view.x} y={view.y} width={view.w} height={view.h} />
      <path className="imap-street" d={m.minor} fill="none" strokeWidth={n1(unit)} strokeLinecap="round" strokeLinejoin="round" />
      <path className="imap-street" d={m.major} fill="none" strokeWidth={n1(2 * unit)} strokeLinecap="round" strokeLinejoin="round" />
      <path className="imap-outline" d={m.outline} fill="none" strokeWidth={n1(1.4 * unit)} strokeDasharray={`${n1(6 * unit)} ${n1(4 * unit)}`} />
      {m.names.map((nm) => (
        <text key={nm.text} className="imap-name" transform={`translate(${n1(nm.x)} ${n1(nm.y)}) rotate(${n1(nm.angle)})`} textAnchor="middle" dy={n1(-3.5 * unit)} fontSize={n1(nameSize)} strokeWidth={n1(3 * unit)}>{nm.text}</text>
      ))}
    </>
  );
}

/** One turn as a static map: the approach and exit streets in the highlight color, a curved arrow through the junction, a numbered marker and the two street names. */
export function TurnMap({ model, n, mode, alt }: { model: TurnMapModel; n: number; mode: Mode; alt: string }) {
  const { unit, fontSize } = model;
  const c = INTENT_COLORS[mode];
  const lw = 4.2 * unit;
  const a = model.arrow.head;
  const s = 7 * unit;
  return (
    <svg className="imap tmap" viewBox={frame(model)} role="img" aria-label={alt} preserveAspectRatio="xMidYMid meet">
      <Base m={model} nameSize={fontSize * 0.9} />
      {[model.approach, model.departure].map((d, i) => <path key={`c${i}`} d={d} fill="none" stroke={c.casing} strokeWidth={n1(lw + 2.4 * unit)} strokeLinecap="butt" strokeLinejoin="round" />)}
      {[model.approach, model.departure].map((d, i) => <path key={`l${i}`} d={d} fill="none" stroke={c.line} strokeWidth={n1(lw)} strokeLinecap="butt" strokeLinejoin="round" />)}
      <path className="tmap-arrow-halo" d={model.arrow.d} fill="none" strokeWidth={n1(5.4 * unit)} strokeLinecap="round" />
      <path className="tmap-arrow" d={model.arrow.d} fill="none" strokeWidth={n1(2.6 * unit)} strokeLinecap="round" />
      <path className="tmap-head tmap-arrow-halo" transform={`translate(${n1(a.x)} ${n1(a.y)}) rotate(${n1(a.angle)})`} d={`M${n1(-1.2 * s)} ${n1(-0.8 * s)}L${n1(0.9 * s)} 0L${n1(-1.2 * s)} ${n1(0.8 * s)}Z`} strokeWidth={n1(2.4 * unit)} strokeLinejoin="round" />
      <path className="tmap-head" transform={`translate(${n1(a.x)} ${n1(a.y)}) rotate(${n1(a.angle)})`} d={`M${n1(-1.2 * s)} ${n1(-0.8 * s)}L${n1(0.9 * s)} 0L${n1(-1.2 * s)} ${n1(0.8 * s)}Z`} />
      {model.labels.map((l) => (
        <text key={l.kind} className="imap-end" transform={`translate(${n1(l.x)} ${n1(l.y)}) rotate(${n1(l.angle)})`} textAnchor="middle" dominantBaseline="central" fontSize={n1(fontSize)} strokeWidth={n1(3.5 * unit)}>{l.text}</text>
      ))}
      <Marker x={model.junction.x} y={model.junction.y} n={n} r={7.5 * unit} size={fontSize} unit={unit} />
    </svg>
  );
}

function Marker({ x, y, n, r, size, unit }: { x: number; y: number; n: number; r: number; size: number; unit: number }) {
  return (
    <g>
      <circle className="tmap-marker" cx={n1(x)} cy={n1(y)} r={n1(r)} strokeWidth={n1(1.6 * unit)} />
      <text className="tmap-num" x={n1(x)} y={n1(y)} textAnchor="middle" dominantBaseline="central" fontSize={n1(size * 0.95)}>{n}</text>
    </g>
  );
}

/** The study area with every assumed turn as a numbered marker; the numbers match the cards. */
export function OverviewMap({ model, alt }: { model: OverviewModel; alt: string }) {
  const { unit, fontSize, radius } = model;
  return (
    <svg className="imap tmap" viewBox={frame(model)} role="img" aria-label={alt} preserveAspectRatio="xMidYMid meet">
      <Base m={model} nameSize={fontSize * 0.95} />
      {model.junctions.map((j) => <line key={`k${j.node}`} className="tmap-leader" x1={n1(j.x)} y1={n1(j.y)} x2={n1(j.x)} y2={n1(j.stem)} strokeWidth={n1(1.6 * unit)} />)}
      {model.junctions.map((j) => <circle key={`j${j.node}`} className="tmap-dot" cx={n1(j.x)} cy={n1(j.y)} r={n1(3.2 * unit)} strokeWidth={n1(1.4 * unit)} />)}
      {model.junctions.map((j) => (
        <text key={`t${j.node}`} className="imap-end" x={n1(j.lx)} y={n1(j.ly)} textAnchor={j.anchor} fontSize={n1(fontSize)} strokeWidth={n1(3.5 * unit)}>{j.lines.map((t, i) => <tspan key={t} x={n1(j.lx)} dy={i ? n1(1.15 * fontSize) : 0}>{t}</tspan>)}</text>
      ))}
      {model.markers.map((k) => <Marker key={k.n} x={k.x} y={k.y} n={k.n} r={radius} size={fontSize} unit={unit} />)}
    </svg>
  );
}
