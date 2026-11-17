import { useId, type ReactNode } from 'react';
import type { AreaEntry } from '../types';
import {
  BUILD_ALT, BUILD_INTRO, BUILD_STEPS, CHECK_INTRO, CHECK_MORE_LEAD, CHECK_MORE_MID, CHECK_MORE_TAIL, CUT_ALT, CUT_INTRO, CUT_TRIPS, CUT_TRIP_STYLES, LIMITS, LIMITS_INTRO,
  METHOD_TITLE, PROPOSAL_ALT, PROPOSAL_INTRO, PROPOSAL_STEPS, checkStatus, whatThisIs, type Step,
} from '../lib/methodology';
import { AnchorHeading, NavLink } from './Anchor';
import './methodology.css';

type Icon = 'map' | 'counts' | 'route' | 'drive' | 'try' | 'score' | 'keep' | 'retest' | 'sort';

function Glyph({ icon, x, y }: { icon: Icon; x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} className="mg-glyph" aria-hidden="true">
      {icon === 'map' && <><path d="M2 12h36M2 26h36M13 2v36M27 2v36" /><rect x="2" y="2" width="36" height="36" rx="3" /></>}
      {icon === 'counts' && <><path d="M4 38V24M14 38V10M24 38V18M34 38V4" className="mg-thick" /><path d="M0 38h40" /></>}
      {icon === 'route' && <><path d="M4 34C4 18 20 24 20 14M20 14C20 8 24 6 34 6M20 24C20 32 26 34 34 34" /><circle cx="4" cy="34" r="3" className="mg-fill" /><circle cx="34" cy="6" r="3" /><circle cx="34" cy="34" r="3" /></>}
      {icon === 'drive' && <><rect x="1" y="14" width="14" height="10" rx="3" className="mg-fill" /><rect x="19" y="14" width="14" height="10" rx="3" className="mg-fill" /><path d="M2 32h36M38 14v-8" /></>}
      {icon === 'try' && <><path d="M20 6v28M6 20h28" className="mg-thick" /><rect x="2" y="2" width="36" height="36" rx="8" /></>}
      {icon === 'score' && <><path d="M6 22l9 9L34 9" className="mg-thick" /></>}
      {icon === 'keep' && <><path d="M3 5h34L24 21v14l-8 3V21z" /></>}
      {icon === 'retest' && <><path d="M32 12a14 14 0 1 0 3 12" /><path d="M34 4v10H24" /></>}
      {icon === 'sort' && <><path d="M4 8h32M4 20h22M4 32h12" className="mg-thick" /></>}
    </g>
  );
}

const BUILD_ICONS: Icon[] = ['map', 'counts', 'route', 'drive'];
const PROPOSAL_ICONS: Icon[] = ['try', 'score', 'keep', 'retest', 'sort'];

/** Steps in a row from tablet width up, stacked below it; both drawings carry the same labels and the numbered list under them says the same in sentences. */
function Flow({ steps, icons, alt }: { steps: Step[]; icons: Icon[]; alt: { title: string; desc: string } }) {
  const uid = useId();
  const n = steps.length;
  const W = 900, gap = 44, bw = (W - gap * (n - 1)) / n, H = 132;
  const rowTitle = `${uid}t1`, rowDesc = `${uid}d1`, colTitle = `${uid}t2`, colDesc = `${uid}d2`;
  const colH = n * 64 + (n - 1) * 26;
  const num = (cx: number, cy: number, k: number) => (
    <g><circle cx={cx} cy={cy} r="13" className="mg-badge" /><text x={cx} y={cy + 5} textAnchor="middle" className="mg-badge-text">{k + 1}</text></g>
  );
  return (
    <>
      <svg className="mg-row" viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby={`${rowTitle} ${rowDesc}`}>
        <title id={rowTitle}>{alt.title}</title><desc id={rowDesc}>{alt.desc}</desc>
        {steps.map((s, k) => {
          const x = k * (bw + gap);
          return (
            <g key={k}>
              <rect x={x} y="0" width={bw} height={H} rx="12" className="mg-box" />
              {num(x + 22, 22, k)}
              <Glyph icon={icons[k]} x={x + bw / 2 - 20} y={20} />
              {s.label.map((l, j) => <text key={j} x={x + bw / 2} y={80 + j * 20} textAnchor="middle" className="mg-label">{l}</text>)}
              {k < n - 1 && <path d={`M${x + bw + 8} ${H / 2}h${gap - 22}m-8 -7l9 7l-9 7`} className="mg-arrow" />}
            </g>
          );
        })}
      </svg>
      <svg className="mg-col" viewBox={`0 0 320 ${colH}`} role="img" aria-labelledby={`${colTitle} ${colDesc}`}>
        <title id={colTitle}>{alt.title}</title><desc id={colDesc}>{alt.desc}</desc>
        {steps.map((s, k) => {
          const y = k * 90;
          return (
            <g key={k}>
              <rect x="0" y={y} width="320" height="64" rx="12" className="mg-box" />
              {num(24, y + 32, k)}
              <Glyph icon={icons[k]} x={52} y={y + 12} />
              <text x="112" y={y + 38} className="mg-label">{s.label.join(' ')}</text>
              {k < n - 1 && <path d={`M160 ${y + 68}v14m-7 -8l7 8l7 -8`} className="mg-arrow" />}
            </g>
          );
        })}
      </svg>
    </>
  );
}

function Steps({ steps }: { steps: Step[] }) {
  return <ol className="mg-steps">{steps.map((s, k) => <li key={k}><strong>{s.label.join(' ')}.</strong> {s.text}</li>)}</ol>;
}

/** A schematic of the study area, not its real outline: the study area is data, and the drawing must work for any of them. */
function CutThroughDiagram() {
  const uid = useId();
  const t = `${uid}t`, d = `${uid}d`;
  const badge = (cx: number, cy: number, k: number) => (
    <g><circle cx={cx} cy={cy} r="13" className="mg-badge" /><text x={cx} y={cy + 5} textAnchor="middle" className="mg-badge-text">{k}</text></g>
  );
  return (
    <svg className="mg-cut" viewBox="0 0 360 290" role="img" aria-labelledby={`${t} ${d}`}>
      <title id={t}>{CUT_ALT.title}</title><desc id={d}>{CUT_ALT.desc}</desc>
      <polygon points="50,50 310,40 330,230 30,240" className="mg-area" />
      <path d="M40 100H322M36 150H326M33 200H329M110 46V240M190 44V236M260 42V232" className="mg-side" />
      <polygon points="50,50 310,40 330,230 30,240" className="mg-bound" />
      <text x="286" y="132" textAnchor="end" className="mg-note">Study area</text>
      <text x="286" y="262" textAnchor="end" className="mg-note">Bounding street</text>
      <path d="M0 100H190V200H342" className="mg-trip mg-t1" />
      <path d="M335 193l14 7l-14 7z" className="mg-head mg-t1" />
      <path d="M110 0V150H152" className="mg-trip mg-t2" />
      <rect x="148" y="144" width="12" height="12" className="mg-end" />
      <path d="M0 242L338 229" className="mg-trip mg-t3" />
      <path d="M333 222l14 7l-14 8z" className="mg-head mg-t3" />
      {badge(20, 80, 1)}{badge(130, 16, 2)}{badge(60, 266, 3)}
    </svg>
  );
}

export function Methodology({ area }: { area: AreaEntry }) {
  const status = checkStatus(area.calibration);
  const [lead, simulation] = whatThisIs(area.name);
  const section = (id: string, heading: string, children: ReactNode) => (
    <section aria-labelledby={id}>
      <AnchorHeading id={id} label={heading}>{heading}</AnchorHeading>
      {children}
    </section>
  );
  return (
    <div className="sources-view method-view">
      <AnchorHeading as="h2" id="methodology" label={METHOD_TITLE}>{METHOD_TITLE}</AnchorHeading>
      <div className="method-cols">
      {section('what-this-is', 'What this is', <><p>{lead}</p><p>{simulation}</p></>)}
      {section('building-todays-traffic', 'Building today\'s traffic', <>
        <p>{BUILD_INTRO}</p>
        <figure><Flow steps={BUILD_STEPS} icons={BUILD_ICONS} alt={BUILD_ALT} /></figure>
        <Steps steps={BUILD_STEPS} />
      </>)}
      {section('what-counts-as-cut-through', 'What counts as cut-through', <>
        <p>{CUT_INTRO}</p>
        <figure><CutThroughDiagram /></figure>
        <ol className="mg-steps mg-trips">{CUT_TRIPS.map((c, k) => <li key={c.n} value={c.n}><strong>Trip {c.n}, {CUT_TRIP_STYLES[k]}.</strong> {c.text}</li>)}</ol>
      </>)}
      {section('checking-the-model', 'Checking the model', <>
        <p>{CHECK_INTRO}</p>
        <p className="mg-status" role="note"><strong>Status today: {status.status}</strong>{status.note ? <> {status.note}</> : null}</p>
        <p>{CHECK_MORE_LEAD} <NavLink view="assumptions" className="link">Assumptions</NavLink> {CHECK_MORE_MID} <NavLink view="sources" className="link">Sources</NavLink> {CHECK_MORE_TAIL}</p>
      </>)}
      {section('how-proposals-are-made', 'How proposals are made', <>
        <p>{PROPOSAL_INTRO}</p>
        <figure><Flow steps={PROPOSAL_STEPS} icons={PROPOSAL_ICONS} alt={PROPOSAL_ALT} /></figure>
        <Steps steps={PROPOSAL_STEPS} />
      </>)}
      {section('what-it-cant-tell-you', 'What it can\'t tell you', <>
        <p>{LIMITS_INTRO}</p>
        <ul>{LIMITS.map((l) => <li key={l}>{l}</li>)}</ul>
      </>)}
      </div>
    </div>
  );
}
