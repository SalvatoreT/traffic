import { useMemo } from 'react';
import type { Intervention, Network } from '../types';
import { changeTicks, DEAD_BAND_CUTTHROUGH } from '../lib/change';
import { BADGE_STYLE, BADGE_TEXT, ATTRIBUTION } from '../lib/mapexport';
import type { NetIndex } from '../lib/naming';
import { buildPicture, mismatchNote, periodNote, pictureAlt, pictureCaption, pictureFacts, type Mark } from '../lib/picture';
import { changeWidthFor, colorForIntensity, divergingGradient, mutedColor, type Mode } from '../lib/ramps';
import type { Proposal } from '../lib/proposals';

const WIDTH_SCALE = 0.62;
const BADGE_NAME: Partial<Record<Intervention['type'], string>> = {
  speed_hump: 'speed hump', speed_limit: 'lower speed limit (mph)', traffic_circle: 'traffic circle', control: 'all-way stop', signal_timing: 'signal timing', turn_ban: 'turn ban',
};

function MarkShape({ m, unit, bar }: { m: Mark; unit: number; bar: { len: number; thick: number } }) {
  if (m.kind === 'bar') {
    const L = bar.len, T = bar.thick, dash = T * 0.5 * 1.5;
    return (
      <g transform={`translate(${m.x} ${m.y}) rotate(${m.bearing})`}>
        <rect x={-L / 2} y={-T / 2} width={L} height={T} fill="#fff" />
        <rect x={-L / 2} y={-T * 0.375} width={L} height={T * 0.75} fill="#111" />
        <line x1={-L / 2} y1={0} x2={L / 2} y2={0} stroke="#ffd43b" strokeWidth={T * 0.5} strokeDasharray={`${dash} ${dash}`} />
      </g>
    );
  }
  if (m.kind === 'diverter') {
    const h = 9.5 * unit, k = 0.55 * unit;
    return (
      <g transform={`translate(${m.x} ${m.y}) rotate(${m.bearing})`} strokeLinecap="butt">
        <line x1={0} y1={-h} x2={0} y2={h} stroke="#fff" strokeWidth={14 * k} />
        <line x1={0} y1={-h} x2={0} y2={h} stroke="#111" strokeWidth={10 * k} />
        <line x1={0} y1={-h} x2={0} y2={h} stroke="#ffd43b" strokeWidth={6 * k} strokeDasharray={`${7 * k} ${3 * k}`} />
      </g>
    );
  }
  if (m.kind === 'arrow') {
    return (
      <g transform={`translate(${m.x} ${m.y}) rotate(${m.bearing}) scale(${unit})`}>
        <path d="M0 -8 L5.5 4.5 L0 2 L-5.5 4.5 Z" fill="#111" stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" paintOrder="stroke" />
      </g>
    );
  }
  const st = BADGE_STYLE[m.type];
  const label = m.text || BADGE_TEXT[m.type];
  const w = Math.max(17, label.length * 6.4 + 7), h = 15;
  const r = st.radius === 'round' ? h / 2 : Math.min(...st.radius, h / 2);
  return (
    <g transform={`translate(${m.x} ${m.y}) scale(${unit})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={r} fill={st.fill} stroke={st.edge} strokeWidth={1.4} />
      <text x={0} y={0.5} textAnchor="middle" dominantBaseline="central" fontSize={8.5} fontWeight={700} fill={st.ink}>{label}</text>
    </g>
  );
}

interface Props {
  net: Network; index: NetIndex; p: Proposal; ivs: Intervention[]; mode: Mode;
  periodLabel(id: string): string; searchedPeriods: string[];
}

/** The card's picture: the change in through cars an hour on each block for one period, with the proposal's changes drawn on the streets. Null when the proposal has no picture data. */
export function ProposalPicture({ net, index, p, ivs, mode, periodLabel, searchedPeriods }: Props) {
  const pic = p.picture;
  const facts = useMemo(() => (pic ? pictureFacts(p, pic, index) : null), [p, pic, index]);
  const model = useMemo(() => (pic && facts ? buildPicture(net, index, p, pic, ivs, facts) : null), [net, index, p, pic, ivs, facts]);
  if (!pic || !facts || !model) return null;
  const when = periodLabel(pic.period);
  const alt = pictureAlt(p, pic, facts, when);
  const note = periodNote(searchedPeriods.map(periodLabel), when);
  const mismatch = mismatchNote(facts, when);
  const { view, unit } = model;
  const text = 'var(--text)', halo = 'var(--surface-2)';
  const muted = mutedColor(mode);
  const kinds = new Set(model.marks.map((m) => m.kind));
  const badgeTypes = [...new Set(model.marks.flatMap((m) => (m.kind === 'badge' ? [m.type] : [])))];
  const ticks = changeTicks('cutthrough');
  const fontSize = 10.5 * unit;
  const pinTexts = model.pins.map((q) => q.text);
  return (
    <figure className="prop-pic">
      <svg viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`} role="img" aria-label={alt} className="prop-pic-svg" preserveAspectRatio="xMidYMid meet">
        <rect x={view.x} y={view.y} width={view.w} height={view.h} fill={halo} />
        <path d={model.minor} fill="none" stroke={muted} strokeWidth={1 * unit} strokeLinecap="round" strokeLinejoin="round" />
        <path d={model.major} fill="none" stroke={muted} strokeWidth={2 * unit} strokeLinecap="round" strokeLinejoin="round" />
        <path d={model.outline} fill="none" stroke={text} strokeWidth={1.4 * unit} strokeDasharray={`${6 * unit} ${4 * unit}`} opacity={0.75} />
        {model.pins.map((q, i) => (
          <path key={`o${i}`} d={q.d} fill="none" stroke={text} strokeWidth={9 * unit} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={q.dashed ? `${5 * unit} ${4 * unit}` : undefined} />
        ))}
        {model.pins.map((q, i) => (
          <path key={`h${i}`} d={q.d} fill="none" stroke={halo} strokeWidth={6.5 * unit} strokeLinecap="round" strokeLinejoin="round" />
        ))}
        {model.blocks.map((b) => (
          <path key={b.block} d={b.d} fill="none" stroke={colorForIntensity(b.t, mode, true)} strokeWidth={changeWidthFor(b.t) * WIDTH_SCALE * unit} strokeLinecap="round" strokeLinejoin="round" />
        ))}
        {model.names.map((n) => (
          <text key={n.text} x={0} y={0} transform={`translate(${n.x} ${n.y}) rotate(${n.angle})`} textAnchor="middle" dy={-3.5 * unit} fontSize={fontSize} fontWeight={600}
            fill={text} stroke={halo} strokeWidth={3 * unit} paintOrder="stroke" strokeLinejoin="round">{n.text}</text>
        ))}
        {model.marks.map((m, i) => <MarkShape key={i} m={m} unit={unit} bar={model.bar} />)}
        {model.pins.map((q, i) => (
          <text key={`t${i}`} x={q.x} y={q.y} textAnchor={q.end ? 'end' : 'start'} fontSize={fontSize * 1.15} fontWeight={700} fill={text} stroke={halo} strokeWidth={3.5 * unit} paintOrder="stroke" strokeLinejoin="round">{pinTexts[i]}</text>
        ))}
      </svg>
      <figcaption>
        <p className="prop-pic-cap"><strong>{pictureCaption(when)}</strong></p>
        {note && <p className="prop-pic-note">{note}</p>}
        {mismatch && <p className="prop-pic-note">{mismatch}</p>}
        <div className="prop-pic-legend" aria-hidden="false">
          <div className="prop-pic-ramp" style={{ background: divergingGradient(mode) }} role="presentation" />
          <div className="prop-pic-ticks" aria-hidden="true">{ticks.map((t) => <span key={t}>{t}</span>)}</div>
          <p className="prop-pic-key">Cars an hour. Blue: fewer through cars. Orange: more. Thin gray: within normal run-to-run variation (about {Math.round(DEAD_BAND_CUTTHROUGH)} cars an hour). The scale is the one on the map's Change in cut-through view.</p>
          {model.pins.length > 0 && (
            <ul className="prop-pic-pins">
              {facts.named && <li><strong>Outlined, labeled {model.pins[0].text}:</strong> {facts.named.label}, the block the card names as gaining the most.</li>}
              {model.pins.length > 1 && facts.gain && <li><strong>Dashed outline, labeled {model.pins[1].text}:</strong> {facts.gain.label}, the biggest gain in the {when}.</li>}
            </ul>
          )}
          {(kinds.size > 0) && (
            <ul className="prop-pic-marks">
              {kinds.has('bar') && <li>Yellow and black bar across a street: closed to through cars.</li>}
              {kinds.has('diverter') && <li>Striped line across a junction: diagonal diverter.</li>}
              {kinds.has('arrow') && <li>Arrow: one-way street, in the direction shown.</li>}
              {badgeTypes.length > 0 && <li>Lettered badges: {badgeTypes.map((t) => `${BADGE_TEXT[t]} ${BADGE_NAME[t] ?? t}`).join(', ')}.</li>}
            </ul>
          )}
        </div>
        <p className="prop-pic-attr">{ATTRIBUTION}</p>
      </figcaption>
    </figure>
  );
}
