import { type ReactNode, useCallback, useEffect, useId, useRef, useState } from 'react';
import type { AreaBundle, ControlType, Intervention } from '../types';
import type { NetIndex } from '../lib/naming';
import { describeIntervention } from '../lib/describe';
import {
  blockActions, humpPosition, interventionsAt, mphToMps, nodeActions, controlLabel, type Selection,
} from '../lib/selection';

export interface Change { add: Intervention[]; remove?: (iv: Intervention) => boolean }
export type Placement = 'popover' | 'sheet' | 'inline';

interface Props {
  bundle: AreaBundle; index: NetIndex; selection: Selection; interventions: Intervention[];
  placement: Placement;
  onApply(change: Change, message: string): void;
  onRemove(i: number): void;
  onClose(): void;
}

interface Choice { key: string; label: string; pick(): void }

/** A button that reveals a few choices. Picking one applies it, folds the list and returns focus to the button. */
function ChoiceGroup({ label, hint, choices }: { label: string; hint?: string; choices: Choice[] }) {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const id = useId();
  return (
    <>
      <button ref={btn} type="button" className="sel-act has-choices" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        <span>{label}</span>{hint && <span className="sel-hint">{hint}</span>}
      </button>
      <div id={id} className={`collapse ${open ? 'open' : ''}`} inert={!open}>
        <div>
          <ul className="sel-choices">
            {choices.map((c) => (
              <li key={c.key}>
                <button type="button" className="sel-choice" onClick={() => { c.pick(); setOpen(false); btn.current?.focus(); }}>{c.label}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

interface TurnFrom { link: number; label: string; to: { link: number; label: string }[] }
function TurnBan({ options, onPick }: { options: TurnFrom[]; onPick(from: number, to: number, fromLabel: string, toLabel: string): void }) {
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState<TurnFrom | null>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const id = useId();
  const fromStillThere = from && options.find((o) => o.link === from.link);
  const step = fromStillThere ? 2 : 1;
  useEffect(() => { box.current?.querySelector<HTMLButtonElement>('.sel-choice')?.focus(); }, [step]); // eslint-disable-line
  const finish = () => { setOpen(false); setFrom(null); btn.current?.focus(); };
  return (
    <>
      <button ref={btn} type="button" className="sel-act has-choices" aria-expanded={open} aria-controls={id}
        onClick={() => { setOpen((o) => !o); setFrom(null); }}>
        <span>Ban a turn</span>
      </button>
      <div id={id} className={`collapse ${open ? 'open' : ''}`} inert={!open}>
        <div><div ref={box} className="sel-turn">
          {step === 1 ? (
            <>
              <p className="sel-q" id={`${id}-q1`}>Vehicles coming from</p>
              <ul className="sel-choices" aria-labelledby={`${id}-q1`}>
                {options.map((o) => <li key={o.link}><button type="button" className="sel-choice" onClick={() => setFrom(o)}>{o.label}</button></li>)}
              </ul>
            </>
          ) : (
            <>
              <p className="sel-q" id={`${id}-q2`}>{fromStillThere ? `From ${fromStillThere.label}: may not turn` : ''}</p>
              <ul className="sel-choices" aria-labelledby={`${id}-q2`}>
                {fromStillThere?.to.map((t) => (
                  <li key={t.link}><button type="button" className="sel-choice" onClick={() => { onPick(from!.link, t.link, from!.label, t.label); finish(); }}>{t.label}</button></li>
                ))}
              </ul>
              <button type="button" className="link" onClick={() => setFrom(null)}>Back</button>
            </>
          )}
        </div></div>
      </div>
    </>
  );
}

export function SelectionMenu(p: Props) {
  const { bundle: B, index: X, selection: s, interventions: ivs } = p;
  const net = B.network;
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);

  // Move focus in when the menu opens or the place changes.
  const key = s.kind === 'block' ? `b${s.block}` : `n${s.node}`;
  useEffect(() => {
    title.current?.focus({ preventScroll: p.placement === 'popover' });
    // The sheet may still be lifting from collapsed (inert) on the first pass.
    const id = requestAnimationFrame(() => { if (root.current && !root.current.contains(document.activeElement)) title.current?.focus({ preventScroll: p.placement === 'popover' }); });
    return () => cancelAnimationFrame(id);
  }, [key]); // eslint-disable-line
  // After an action, keep focus inside the menu even when the button that held it went away.
  const keepFocus = useCallback(() => {
    requestAnimationFrame(() => { if (root.current && !root.current.contains(document.activeElement)) title.current?.focus(); });
  }, []);
  const apply = (change: Change, message?: string) => {
    p.onApply(change, message ?? `Added: ${change.add.map((iv) => describeIntervention(iv, net, X)).join('; ')}`);
    keepFocus();
  };

  let heading: string, sub: string, actions: ReactNode;
  if (s.kind === 'block') {
    const blk = X.blocks[s.block];
    const hasPrefix = blk.label.startsWith(blk.name) && blk.label.length > blk.name.length;
    heading = hasPrefix ? blk.name : blk.label;
    sub = hasPrefix ? blk.label.slice(blk.name.length).trim() : 'Street block';
    const a = blockActions(net, X, s, ivs);
    const first = blk.links[0];
    const hereLink = (iv: Intervention) => 'link' in iv && blk.links.includes(iv.link);
    actions = (
      <>
        {a.modalFilter && <li><button type="button" className="sel-act" onClick={() => apply({ add: [{ type: 'modal_filter', link: first }] })}>Add modal filter</button></li>}
        {a.hump && (
          <li><button type="button" className="sel-act" onClick={() => apply({ add: [{ type: 'speed_hump', link: first, position: humpPosition(net, X, s.block, s.point) }] })}>
            {a.hump === 'move' ? 'Move speed hump here' : 'Add speed hump'}</button></li>
        )}
        {a.speedLimit.choices.length > 0 && (
          <li><ChoiceGroup label="Set speed limit" hint={`now ${a.speedLimit.currentMph} mph`}
            choices={a.speedLimit.choices.map((mph) => ({ key: String(mph), label: `${mph} mph`, pick: () => apply({ add: [{ type: 'speed_limit', link: first, speed: mphToMps(mph) }] }) }))} /></li>
        )}
        {a.oneWay.length > 0 && (
          <li><ChoiceGroup label="Make one-way"
            choices={a.oneWay.map((o) => ({ key: String(o.link), label: o.label, pick: () => apply({ add: [{ type: 'one_way', link: o.link }], remove: (iv) => iv.type === 'one_way' && hereLink(iv) }) }))} /></li>
        )}
      </>
    );
  } else {
    heading = X.nodeName[s.node];
    sub = 'Intersection';
    const a = nodeActions(net, X, s, ivs);
    const node = s.node;
    const dropCycle = (c: ControlType) => (c === 'signal' ? undefined : (iv: Intervention) => iv.type === 'signal_timing' && iv.node === node);
    actions = (
      <>
        {a.modalFilter && <li><button type="button" className="sel-act" onClick={() => apply({ add: [{ type: 'modal_filter', node }] })}>Add modal filter (no through traffic)</button></li>}
        {a.trafficCircle && <li><button type="button" className="sel-act" onClick={() => apply({ add: [{ type: 'traffic_circle', node }], remove: dropCycle('traffic_circle') })}>Add traffic circle</button></li>}
        {a.control.choices.length > 0 && (
          <li><ChoiceGroup label="Change control" hint={`now ${controlLabel(a.control.current).toLowerCase()}`}
            choices={a.control.choices.map((c) => ({ key: c.value, label: c.label, pick: () => apply({ add: [{ type: 'control', node, control: c.value }], remove: dropCycle(c.value) }) }))} /></li>
        )}
        {a.cycles && (
          <li><ChoiceGroup label="Set signal cycle"
            choices={a.cycles.map((c) => ({ key: String(c), label: `${c} s`, pick: () => apply({ add: [{ type: 'signal_timing', node, cycle: c }] }) }))} /></li>
        )}
        {a.turnBan.length > 0 && (
          <li><TurnBan options={a.turnBan}
            onPick={(fromLink, toLink, fl, tl) => apply({ add: [{ type: 'turn_ban', fromLink, toLink }] }, `Added turn ban at ${heading}: ${fl} may not turn ${tl}.`)} /></li>
        )}
      </>
    );
  }

  const here = interventionsAt(net, X, s, ivs);
  const Root = p.placement === 'popover' ? 'div' : 'section';
  return (
    <Root ref={root as never} className={`sel-menu sel-${p.placement}`} {...(p.placement === 'popover' ? { role: 'dialog' } : {})}
      aria-labelledby={`${id}-t ${id}-s`}
      onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); p.onClose(); } }}>
      <div className="sel-head">
        <div>
          <h3 id={`${id}-t`} ref={title} tabIndex={-1} className="sel-title">{heading}</h3>
          <p id={`${id}-s`} className="sel-sub">{sub}</p>
        </div>
        <button type="button" className="btn small-btn" onClick={p.onClose}>Close</button>
      </div>
      {here.length > 0 && (
        <div className="sel-sec">
          <h4 className="sel-h">Already here</h4>
          <ul className="sel-here">
            {here.map((i) => {
              const d = describeIntervention(ivs[i], net, X);
              return (
                <li key={i}>
                  <span className="sel-here-d">{d}</span>
                  <button type="button" className="btn small-btn" aria-label={`Remove: ${d}`} onClick={() => { p.onRemove(i); keepFocus(); }}>Remove</button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <div className="sel-sec">
        <h4 className="sel-h">Add or change</h4>
        <ul className="sel-actions">{actions}</ul>
      </div>
    </Root>
  );
}
