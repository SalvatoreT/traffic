import { type ReactNode, useCallback, useEffect, useId, useRef, useState } from 'react';
import type { AreaBundle, ControlType, Intervention } from '../types';
import type { NetIndex } from '../lib/naming';
import { describeIntervention } from '../lib/describe';
import { filterSentence, filterText } from '../lib/blocked';
import { EARLY_LABEL } from '../lib/run';
import { menuSymbol, menuSymbolHtml, type MenuSymbol } from '../lib/menusymbols';
import { turnKindOf } from '../lib/turnkind';
import { pictoOf, symbolOf } from '../lib/signs';
import { aggregate, CHANGE_NAME, CHANGE_UNIT, diffValue, formatSigned, metricValue, readoutText } from '../lib/change';
import { blockMeasured } from '../lib/scope';
import { linkStatsView, type Overlay } from '../types';
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
  /** Link stats for the today / with scenario / change line on a selected street; null without a scenario. */
  readout?: { overlay: Overlay; scen: Float32Array | null; base: Float32Array | null; early?: boolean } | null;
}

interface Choice { key: string; label: string; detail?: string; symbol?: MenuSymbol | null; pick(): void }

/** A fixed-width column for a choice's picture, so the labels line up whether or not a choice has one. Decorative: the choice's text is its name. */
function Ico({ symbol }: { symbol?: MenuSymbol | null }) {
  return <span className="sel-ico" aria-hidden="true" {...(symbol ? { dangerouslySetInnerHTML: { __html: menuSymbolHtml(symbol) } } : {})} />;
}

/** A button that reveals a few choices. Picking one applies it, folds the list and returns focus to the button. */
function ChoiceGroup({ label, hint, note, defaultOpen, symbol, choices }: { label: string; hint?: string; note?: string | null; defaultOpen?: boolean; symbol?: MenuSymbol | null; choices: Choice[] }) {
  const [open, setOpen] = useState(!!defaultOpen);
  const btn = useRef<HTMLButtonElement>(null);
  const id = useId();
  return (
    <>
      <button ref={btn} type="button" className="sel-act has-choices" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        <Ico symbol={symbol} /><span>{label}</span>{hint && <span className="sel-hint">{hint}</span>}
      </button>
      <div id={id} className={`collapse ${open ? 'open' : ''}`} inert={!open}>
        <div>
          {note && <p className="iv-more" id={`${id}-note`}>{note}</p>}
          <ul className="sel-choices">
            {choices.map((c) => (
              <li key={c.key}>
                <button type="button" className="sel-choice" aria-describedby={c.detail ? `${id}-${c.key}` : undefined} onClick={() => { c.pick(); setOpen(false); btn.current?.focus(); }}><Ico symbol={c.symbol} /><span>{c.label}</span></button>
                {c.detail && <span className="iv-more" id={`${id}-${c.key}`}>{c.detail}</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

interface TurnFrom { link: number; label: string; to: { link: number; label: string }[] }
function TurnBan({ options, net, onPick }: { options: TurnFrom[]; net: AreaBundle['network']; onPick(from: number, to: number, fromLabel: string, toLabel: string): void }) {
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState<TurnFrom | null>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const id = useId();
  const fromStillThere = from && options.find((o) => o.link === from.link);
  const step = fromStillThere ? 2 : 1;
  useEffect(() => { if (open) box.current?.querySelector<HTMLButtonElement>('.sel-choice')?.focus(); }, [step, open]); // eslint-disable-line
  const finish = () => { setOpen(false); setFrom(null); btn.current?.focus(); };
  return (
    <>
      <button ref={btn} type="button" className="sel-act has-choices" aria-expanded={open} aria-controls={id}
        onClick={() => { setOpen((o) => !o); setFrom(null); }}>
        <Ico symbol={{ picto: 'turn_ban_left' }} /><span>Ban a turn</span>
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
                  <li key={t.link}><button type="button" className="sel-choice" onClick={() => { onPick(from!.link, t.link, from!.label, t.label); finish(); }}><Ico symbol={{ picto: pictoOf({ type: 'turn_ban', turn: turnKindOf(net, from!.link, t.link) })! }} /><span>{t.label}</span></button></li>
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
        {a.modalFilter && <li><button type="button" className="sel-act" onClick={() => apply({ add: [{ type: 'modal_filter', link: first }] })}><Ico symbol={{ picto: 'modal_filter' }} /><span>Add modal filter</span></button></li>}
        {a.hump && (
          <li><button type="button" className="sel-act" onClick={() => apply({ add: [{ type: 'speed_hump', link: first, position: humpPosition(net, X, s.block, s.point) }] })}>
            <Ico symbol={{ picto: 'speed_hump' }} /><span>{a.hump === 'move' ? 'Move speed hump here' : 'Add speed hump'}</span></button></li>
        )}
        {(a.slowStreet || a.speedLimit.choices.length > 0) && (
          <li><ChoiceGroup label="Set speed limit" hint={`now ${a.speedLimit.currentMph} mph`} defaultOpen={!!a.slowStreet} symbol={{ mph: 'NN' }}
            choices={[
              ...(a.slowStreet ? [{ key: 'slow-street', label: 'Apply to the whole street (Slow Street, 15 mph)', detail: a.slowStreet.label, symbol: menuSymbol({ type: 'slow_street', link: a.slowStreet.link }, net), pick: () => apply({ add: [{ type: 'slow_street' as const, link: a.slowStreet!.link }] }) }] : []),
              ...a.speedLimit.choices.map((mph) => ({ key: String(mph), label: `This block only: ${mph} mph`, symbol: { mph }, pick: () => apply({ add: [{ type: 'speed_limit' as const, link: first, speed: mphToMps(mph) }] }) })),
            ]} /></li>
        )}
        {a.oneWay.length > 0 && (
          <li><ChoiceGroup label="Make one-way" symbol={{ picto: 'one_way' }}
            choices={a.oneWay.map((o) => ({ key: String(o.link), label: o.label, symbol: menuSymbol({ type: 'one_way', link: o.link }, net), pick: () => apply({ add: [{ type: 'one_way', link: o.link }], remove: (iv) => iv.type === 'one_way' && hereLink(iv) }) }))} /></li>
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
        {a.modalFilter && (() => {
          const F = a.filters;
          const dropLegs = (iv: Intervention) => iv.type === 'modal_filter' && 'node' in iv && iv.node === node && iv.legs !== undefined;
          if (F.streets.length === 0) {
            return <li><button type="button" className="sel-act" onClick={() => apply({ add: [{ type: 'modal_filter', node }] })}><Ico symbol={{ picto: 'modal_filter' }} /><span>Add modal filter (no through traffic)</span></button>{F.wholeClosed && <p className="iv-more">{F.wholeClosed}</p>}</li>;
          }
          const streets: Choice[] = F.streets.map((o) => ({
            key: o.links.join('.'), label: o.label, detail: o.closed, symbol: { picto: 'modal_filter' },
            pick: () => apply({ add: [{ type: 'modal_filter', node, legs: o.links }] }, `Added: Modal filter on ${o.street} at ${heading}.`),
          }));
          const whole: Choice[] = F.whole ? [{
            key: 'whole', label: 'Filter the whole intersection', detail: F.wholeClosed, symbol: { picto: 'modal_filter' },
            pick: () => apply({ add: [{ type: 'modal_filter', node }], remove: dropLegs }),
          }] : [];
          return <li><ChoiceGroup label="Add modal filter" symbol={{ picto: 'modal_filter' }} hint="no through traffic for cars" note={F.why} defaultOpen={F.merged}
            choices={F.merged ? [...streets, ...whole] : [...whole, ...streets]} /></li>;
        })()}
        {a.trafficCircle && <li><button type="button" className="sel-act" onClick={() => apply({ add: [{ type: 'traffic_circle', node }], remove: dropCycle('traffic_circle') })}><Ico symbol={{ picto: 'traffic_circle' }} /><span>Add traffic circle</span></button></li>}
        {a.control.choices.length > 0 && (
          <li><ChoiceGroup label="Change control" hint={`now ${controlLabel(a.control.current).toLowerCase()}`}
            choices={a.control.choices.map((c) => ({ key: c.value, label: c.label, symbol: menuSymbol({ type: 'control', node, control: c.value }, net), pick: () => apply({ add: [{ type: 'control', node, control: c.value }], remove: dropCycle(c.value) }) }))} /></li>
        )}
        {a.cycles && (
          <li><ChoiceGroup label="Set signal cycle" symbol={{ picto: 'signal_timing' }}
            choices={a.cycles.map((c) => ({ key: String(c), label: `${c} s`, symbol: menuSymbol({ type: 'signal_timing', node, cycle: c }, net), pick: () => apply({ add: [{ type: 'signal_timing', node, cycle: c }] }) }))} /></li>
        )}
        {a.diverter.options.length > 0 && (
          <li><ChoiceGroup label={a.diverter.switching ? 'Switch diagonal diverter' : 'Add diagonal diverter'}
            hint="no through traffic for cars" symbol={{ picto: 'diagonal_diverter' }}
            choices={a.diverter.options.map((o) => ({
              key: String(o.bearing), symbol: { picto: 'diagonal_diverter' },
              label: a.diverter.switching ? `Switch to ${o.label}` : o.label,
              pick: () => apply(
                { add: [{ type: 'diagonal_diverter', node, bearing: o.bearing }], remove: (iv) => iv.type === 'diagonal_diverter' && iv.node === node },
                `${a.diverter.switching ? 'Switched to' : 'Added'} diagonal diverter at ${heading}, connecting ${o.label}.`,
              ),
            }))} /></li>
        )}
        {a.turnBan.length > 0 && (
          <li><TurnBan options={a.turnBan} net={net}
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
          {s.kind === 'block' && p.readout && !blockMeasured(X.blocks[s.block]) && <p className="sel-readout">Outside the study area: not measured.</p>}
          {s.kind === 'block' && p.readout && blockMeasured(X.blocks[s.block]) && (() => {
            const blk = X.blocks[s.block], o = p.readout.overlay;
            const b = aggregate(linkStatsView(p.readout.base), blk.links), c = aggregate(linkStatsView(p.readout.scen), blk.links);
            const n = (v: number | null) => (v === null ? 'no traffic' : `${v.toFixed(0)} ${CHANGE_UNIT[o]}`);
            const spoken = `${CHANGE_NAME[o]}: today ${n(metricValue(o, b))}, with scenario ${n(metricValue(o, c))}, change ${formatSigned(diffValue(o, b, c))} ${CHANGE_UNIT[o]}.`;
            return <p className="sel-readout"><span aria-hidden="true">{readoutText(o, b, c)}<span className="sub"> (today → with scenario)</span>{p.readout.early && <span className="early-tag"> {EARLY_LABEL}</span>}</span><span className="sr-only">{spoken}{p.readout.early ? ` ${EARLY_LABEL}.` : ''}</span></p>;
          })()}
        </div>
        <button type="button" className="btn small-btn" onClick={p.onClose}>Close</button>
      </div>
      {here.length > 0 && (
        <div className="sel-sec">
          <h4 className="sel-h">Already here</h4>
          <ul className="sel-here">
            {here.map((i) => {
              const d = describeIntervention(ivs[i], net, X);
              const ft = filterText(ivs[i], net, X);
              return (
                <li key={i}>
                  <span className="sel-here-d">{d}{ft && <span className="iv-more">{filterSentence(ft)}</span>}</span>
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
