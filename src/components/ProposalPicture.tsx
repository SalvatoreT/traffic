import { useEffect, useMemo, useRef, useState } from 'react';
import type { Intervention, Network } from '../types';
import { DEAD_BAND_CUTTHROUGH } from '../lib/change';
import { BADGE_TEXT, ATTRIBUTION } from '../lib/mapexport';
import type { NetIndex } from '../lib/naming';
import { buildPicture, mismatchNote, periodNote, pictureAlt, pictureCaption, pictureFacts } from '../lib/picture';
import type { Proposal } from '../lib/proposals';
import { canvasMeasure, buildShareSvg, shareAlt, shareInputFor, svgToPng, SHARE_SCALE } from '../lib/shareimage';

const BADGE_NAME: Partial<Record<Intervention['type'], string>> = {
  speed_hump: 'speed hump', speed_limit: 'lower speed limit (mph)', traffic_circle: 'traffic circle', control: 'all-way stop', signal_timing: 'signal timing', turn_ban: 'turn ban',
};

/** Renders once the card nears the screen: a picture is a few hundred kilobytes of canvas work and a file can hold dozens. */
function useNear(ref: React.RefObject<Element | null>): boolean {
  const [near, setNear] = useState(typeof IntersectionObserver === 'undefined');
  useEffect(() => {
    const el = ref.current;
    if (near || !el) return;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setNear(true); io.disconnect(); } }, { rootMargin: '600px' });
    io.observe(el);
    return () => io.disconnect();
  }, [near, ref]);
  return near;
}

interface Props {
  net: Network; index: NetIndex; p: Proposal; ivs: Intervention[];
  areaName: string; areaId: string; status: string; number: number | null;
  periodLabel(id: string): string; searchedPeriods: string[];
}

/**
 * The card's picture, shown as a real image (a PNG) so it can be saved, copied or sent like any other: the proposal's name and changes, the through-car
 * figures for the period it shows and for the card's average, the map, its legend and where it came from. It is drawn the same, in light colors, in either theme.
 */
export function ProposalPicture({ net, index, p, ivs, areaName, areaId, status, number, periodLabel, searchedPeriods }: Props) {
  const pic = p.picture;
  const facts = useMemo(() => (pic ? pictureFacts(p, pic, index) : null), [p, pic, index]);
  const model = useMemo(() => (pic && facts ? buildPicture(net, index, p, pic, ivs, facts) : null), [net, index, p, pic, ivs, facts]);
  const short = (id: string) => periodLabel(id).replace(/\s*\(.*\)\s*$/, '');
  const share = useMemo(() => {
    if (!pic || !facts || !model) return null;
    const input = shareInputFor({ areaName, status, p, pic, facts, model, searched: searchedPeriods, periodLabel, shortLabel: short, caption: '', number });
    return { input, image: buildShareSvg(input, canvasMeasure()) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pic, facts, model, areaName, status, p, searchedPeriods, number]);
  const box = useRef<HTMLDivElement>(null);
  const near = useNear(box);
  const [png, setPng] = useState<{ url: string } | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!near || !share) return;
    let dead = false, made: string | null = null;
    svgToPng(share.image).then((b) => {
      if (dead) return;
      made = URL.createObjectURL(b);
      setPng({ url: made });
    }, () => { if (!dead) setFailed(true); });
    return () => { dead = true; if (made) URL.revokeObjectURL(made); };
  }, [near, share]);
  if (!pic || !facts || !model || !share) return null;
  const when = short(pic.period);
  const alt = shareAlt(share.input.title, share.input.changes, pictureAlt(p, pic, facts, when));
  const note = periodNote(searchedPeriods.map(short), when);
  const mismatch = mismatchNote(facts, when);
  const kinds = new Set(model.marks.map((m) => m.kind));
  const badgeTypes = [...new Set(model.marks.flatMap((m) => (m.kind === 'badge' ? [m.type] : [])))];
  const file = `${areaId}-proposal-${number ?? p.id}-${pic.period.replace(/_/g, '-')}.png`.toLowerCase().replace(/[^a-z0-9.-]+/g, '-');
  const { width, height } = share.image;
  return (
    <figure className="prop-pic">
      <div ref={box} className="prop-pic-frame" style={{ aspectRatio: `${width} / ${height}` }}>
        {png
          ? <img className="prop-pic-img" src={png.url} alt={alt} width={width * SHARE_SCALE} height={height * SHARE_SCALE} />
          : <p className="prop-pic-wait muted small" role="status">{failed ? 'The picture could not be drawn in this browser.' : 'Drawing the picture…'}</p>}
      </div>
      {png && <p className="prop-pic-dl"><a className="btn" href={png.url} download={file}>Download image<span className="sr-only">: {p.title}</span></a> <span className="muted small">PNG, light colors, ready to send.</span></p>}
      <figcaption>
        <p className="sr-only">{pictureCaption(when)}</p>
        {note && <p className="prop-pic-note">{note}</p>}
        {mismatch && <p className="prop-pic-note">{mismatch}</p>}
        <details className="prop-pic-legend">
          <summary>Picture legend as text</summary>
          <p className="prop-pic-key">Scale: cars an hour. Blue: fewer through cars. Orange: more. Thin gray: within normal run-to-run variation (about {Math.round(DEAD_BAND_CUTTHROUGH)} cars an hour). The scale is the one on the map's Change in cut-through view, from -100 or fewer to +100 or more.</p>
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
        </details>
        <p className="prop-pic-attr">{ATTRIBUTION}</p>
      </figcaption>
    </figure>
  );
}
