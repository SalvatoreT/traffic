import { useMemo, useState } from 'react';
import type { Intervention, Network } from '../types';
import type { NetIndex } from '../lib/naming';
import { buildPicture, pictureFacts } from '../lib/picture';
import type { EvidenceStatus, Proposal } from '../lib/proposals';
import { canvasMeasure, buildShareSvg, shareInputFor, svgToPng } from '../lib/shareimage';

/** Said inside the exported picture itself, so a saved copy cannot be read as current evidence when it is not. */
export function evidenceSuffix(e: EvidenceStatus): string {
  if (e.state === 'stale') return ' Out of date: computed on other inputs than the ones in use.';
  if (e.state === 'unverified') return ' Provenance not verified: computed before the simulator version was recorded, or it could not be checked.';
  return '';
}

export const slug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60).replace(/-+$/, '');
export const imageFileName = (areaId: string, p: Proposal, ext: string) => `${slug(areaId)}-${slug(p.title) || slug(p.id)}-${slug(p.picture?.period ?? '')}.${ext}`;

interface Props {
  net: Network; index: NetIndex; p: Proposal; ivs: Intervention[];
  areaName: string; areaId: string; status: string; openUrl: string;
  periodLabel(id: string): string; searchedPeriods: string[];
  runs: number[]; evidence: EvidenceStatus;
}

/**
 * Draws the proposal's picture when it is asked for and saves it as a JPEG: the name and changes, the through-car figures, the map, its legend and where
 * it came from, in light colors in either theme. Nothing is drawn until the button is pressed.
 */
export function DownloadImage({ net, index, p, ivs, areaName, areaId, status, openUrl, periodLabel, searchedPeriods, runs, evidence }: Props) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const pic = p.picture;
  const facts = useMemo(() => (pic ? pictureFacts(p, pic, index) : null), [p, pic, index]);
  if (!pic || !facts) return null;
  const short = (id: string) => periodLabel(id).replace(/\s*\(.*\)\s*$/, '');
  const go = async () => {
    setBusy(true); setMsg('Drawing the image…');
    try {
      const model = buildPicture(net, index, p, pic, ivs, facts);
      const input = shareInputFor({ areaName, status: `${status}${evidenceSuffix(evidence)}`, p, pic, facts, model, searched: searchedPeriods, periodLabel, shortLabel: short, caption: '', openUrl, runs });
      const blob = await svgToPng(buildShareSvg(input, canvasMeasure()));
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = imageFileName(areaId, p, blob.type === 'image/jpeg' ? 'jpg' : 'png');
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      setMsg(`Saved ${a.download}.`);
    } catch (e) { setMsg((e as Error).message || 'The image could not be drawn in this browser.'); } finally { setBusy(false); }
  };
  return (
    <>
      <button type="button" className="btn" onClick={go} disabled={busy} aria-describedby={`dl-${p.id}`}>Download image<span className="sr-only">: {p.title}</span></button>
      <span id={`dl-${p.id}`} className="muted small prop-dl-msg" role="status">{msg}</span>
    </>
  );
}
