import type { IntentMapModel } from '../lib/intentmap';
import { INTENT_COLORS, INTENT_DASH } from '../lib/intents';
import type { Mode } from '../lib/ramps';

const n1 = (v: number) => Math.round(v * 10) / 10;

/**
 * One reason's typical path as a static map: the same dashed violet line as the live highlight, width by cars an hour, a chevron on each street for direction,
 * and where the path starts and ends. Colors for streets and text come from the theme's variables; the violet pair from the highlight's own constants.
 */
export function IntentMap({ model, mode, alt }: { model: IntentMapModel; mode: Mode; alt: string }) {
  const { view, unit, fontSize } = model;
  const c = INTENT_COLORS[mode];
  return (
    <svg className="imap" viewBox={`${n1(view.x)} ${n1(view.y)} ${n1(view.w)} ${n1(view.h)}`} role="img" aria-label={alt} preserveAspectRatio="xMidYMid meet">
      <rect className="imap-bg" x={view.x} y={view.y} width={view.w} height={view.h} />
      <path className="imap-street" d={model.minor} fill="none" strokeWidth={n1(unit)} strokeLinecap="round" strokeLinejoin="round" />
      <path className="imap-street" d={model.major} fill="none" strokeWidth={n1(2 * unit)} strokeLinecap="round" strokeLinejoin="round" />
      <path className="imap-outline" d={model.outline} fill="none" strokeWidth={n1(1.4 * unit)} strokeDasharray={`${n1(6 * unit)} ${n1(4 * unit)}`} />
      {model.names.map((nm) => (
        <text key={nm.text} className="imap-name" transform={`translate(${n1(nm.x)} ${n1(nm.y)}) rotate(${n1(nm.angle)})`} textAnchor="middle" dy={n1(-3.5 * unit)} fontSize={n1(fontSize * 0.95)} strokeWidth={n1(3 * unit)}>{nm.text}</text>
      ))}
      {model.lines.map((l) => <path key={`c${l.link}`} d={l.d} fill="none" stroke={c.casing} strokeWidth={n1(l.w + 2.4 * unit)} strokeLinecap="butt" strokeLinejoin="round" />)}
      {model.lines.map((l) => <path key={`l${l.link}`} d={l.d} fill="none" stroke={c.line} strokeWidth={n1(l.w)} strokeLinecap="butt" strokeLinejoin="round" strokeDasharray={`${n1(INTENT_DASH[0] * l.w)} ${n1(INTENT_DASH[1] * l.w)}`} />)}
      {model.arrows.map((a, i) => {
        const s = Math.max(6 * unit, 1.3 * a.w);
        return <path key={i} transform={`translate(${n1(a.x)} ${n1(a.y)}) rotate(${n1(a.angle)})`} d={`M${n1(-s)} ${n1(-0.75 * s)}L${n1(s)} 0L${n1(-s)} ${n1(0.75 * s)}Z`} fill={c.line} stroke={c.casing} strokeWidth={n1(1.2 * unit)} strokeLinejoin="round" />;
      })}
      {model.ramp && (
        <g>
          <path transform={`translate(${n1(model.ramp.dot.x)} ${n1(model.ramp.dot.y)}) rotate(45)`} d={`M${n1(-4.6 * unit)} ${n1(-4.6 * unit)}h${n1(9.2 * unit)}v${n1(9.2 * unit)}h${n1(-9.2 * unit)}Z`} fill={c.casing} stroke={c.line} strokeWidth={n1(2 * unit)} />
          <text className="imap-end" x={n1(model.ramp.x)} y={n1(model.ramp.y)} textAnchor={model.ramp.anchor} fontSize={n1(fontSize)} strokeWidth={n1(3.5 * unit)}>{model.ramp.text}</text>
        </g>
      )}
      {model.ends.map((e) => (
        <g key={e.kind}>
          <circle cx={n1(e.dot.x)} cy={n1(e.dot.y)} r={n1(4.6 * unit)} fill={e.kind === 'from' ? c.line : c.casing} stroke={c.line} strokeWidth={n1(1.6 * unit)} />
          <text className="imap-end" x={n1(e.x)} y={n1(e.y)} textAnchor={e.anchor} fontSize={n1(fontSize)} strokeWidth={n1(3.5 * unit)}>{e.text}</text>
        </g>
      ))}
    </svg>
  );
}
