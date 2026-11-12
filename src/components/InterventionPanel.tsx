import { type ReactNode, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { AreaBundle, ControlType, Intervention } from '../types';
import { linkStreet, matchesQuery, type NetIndex } from '../lib/naming';
import { pickerItems } from '../lib/picker';
import { interventionInStudyArea } from '../lib/area';
import { describeIntervention } from '../lib/describe';
import type { PickKind } from './MapView';

export type ToolId =
  | 'modal_filter_link' | 'modal_filter_node' | 'speed_hump' | 'speed_limit' | 'traffic_circle'
  | 'control' | 'signal_timing' | 'one_way' | 'turn_ban';
type Target = 'block' | 'dirlink' | 'node';

interface ToolDef { id: ToolId; label: string; target: Target; help: string }
export const TOOLS: ToolDef[] = [
  { id: 'modal_filter_link', label: 'Modal filter (street)', target: 'block', help: 'Blocks motor vehicles from passing along a block. Access to both sides is kept and routes adapt.' },
  { id: 'modal_filter_node', label: 'Modal filter (intersection)', target: 'node', help: 'No motor through-movement at the intersection.' },
  { id: 'speed_hump', label: 'Speed hump', target: 'block', help: 'Adds a hump at mid-block in both directions; vehicles slow to the crossing speed.' },
  { id: 'speed_limit', label: 'Speed limit', target: 'block', help: 'Changes the speed limit on a block, both directions.' },
  { id: 'traffic_circle', label: 'Traffic circle', target: 'node', help: 'Replaces the intersection control with yield-on-entry at reduced speed.' },
  { id: 'control', label: 'Intersection control', target: 'node', help: 'Change the control type at an intersection.' },
  { id: 'signal_timing', label: 'Signal cycle', target: 'node', help: 'Set the cycle length of a signal; splits are re-derived.' },
  { id: 'one_way', label: 'One-way street', target: 'dirlink', help: 'Keeps the chosen direction and closes the opposite one.' },
  { id: 'turn_ban', label: 'Turn ban', target: 'node', help: 'Pick an intersection, then the turn to forbid.' },
];

const CONTROLS: { v: ControlType; label: string }[] = [
  { v: 'all_way_stop', label: 'All-way stop' }, { v: 'two_way_stop', label: 'Two-way stop' },
  { v: 'signal', label: 'Traffic signal' }, { v: 'uncontrolled', label: 'Uncontrolled' },
];
const LIMITS = [10, 15, 20, 25, 30, 35];

export interface PickHandlers { link(id: number): void; node(id: number): void }

interface Props {
  bundle: AreaBundle; index: NetIndex;
  showService: boolean; onShowService(v: boolean): void;
  showOutside: boolean; onShowOutside(v: boolean): void;
  interventions: Intervention[];
  onAdd(list: Intervention[], message: string): void;
  onRemove(i: number): void;
  onClear(): void;
  onPickMode(kind: PickKind, directional: boolean): void;
  registerPick(h: PickHandlers | null): void;
  /** Rendered next to Clear all, only when the scenario has interventions. */
  shareSlot?: ReactNode;
}

export function InterventionPanel(p: Props) {
  const { bundle: B, index: X } = p;
  const [tool, setTool] = useState<ToolId>('modal_filter_link');
  const [q, setQ] = useState('');
  const [limit, setLimit] = useState(20);
  const [control, setControl] = useState<ControlType>('all_way_stop');
  const [cycle, setCycle] = useState(90);
  const [banNode, setBanNode] = useState<number | null>(null);
  const [banFrom, setBanFrom] = useState<number | null>(null);
  const [banTo, setBanTo] = useState<number | null>(null);
  const toolDef = TOOLS.find((t) => t.id === tool)!;
  const listId = useId();

  const limitMps = (v: number) => v / 2.2369362920544;

  const addForLink = (linkId: number) => {
    const blk = X.blocks[X.blockOfLink[linkId]];
    const L = B.network.links;
    switch (tool) {
      case 'modal_filter_link': {
        const iv: Intervention = { type: 'modal_filter', link: blk.links[0] };
        return p.onAdd([iv], `Added: ${describeIntervention(iv, B.network, X)}`);
      }
      case 'speed_hump': {
        const iv: Intervention = { type: 'speed_hump', link: blk.links[0], position: L[blk.links[0]].length / 2 };
        return p.onAdd([iv], `Added speed hump on ${blk.label}`);
      }
      case 'speed_limit': {
        const iv: Intervention = { type: 'speed_limit', link: blk.links[0], speed: limitMps(limit) };
        return p.onAdd([iv], `Added: ${describeIntervention(iv, B.network, X)}`);
      }
      case 'one_way': {
        const l = L[linkId];
        if (l.reverse === null) return p.onAdd([], 'That street is already one-way.');
        const iv: Intervention = { type: 'one_way', link: linkId };
        return p.onAdd([iv], `Added: ${describeIntervention(iv, B.network, X)}`);
      }
    }
  };
  const addForNode = (nodeId: number) => {
    let iv: Intervention | null = null;
    switch (tool) {
      case 'modal_filter_node': iv = { type: 'modal_filter', node: nodeId }; break;
      case 'traffic_circle': iv = { type: 'traffic_circle', node: nodeId }; break;
      case 'control': iv = { type: 'control', node: nodeId, control }; break;
      case 'signal_timing':
        if (B.network.nodes[nodeId].control !== 'signal') return p.onAdd([], `${X.nodeName[nodeId]} is not signalized. Use "Intersection control" to make it a signal first.`);
        iv = { type: 'signal_timing', node: nodeId, cycle }; break;
      case 'turn_ban': setBanNode(nodeId); setBanFrom(null); setBanTo(null); return;
    }
    if (iv) p.onAdd([iv], `Added: ${describeIntervention(iv, B.network, X)}`);
  };

  // map picking is routed through the latest handlers
  const handlers = useRef<PickHandlers>({ link: () => {}, node: () => {} });
  handlers.current = { link: addForLink, node: addForNode };
  useEffect(() => { p.registerPick({ link: (i) => handlers.current.link(i), node: (i) => handlers.current.node(i) }); return () => p.registerPick(null); }, []); // eslint-disable-line
  useEffect(() => {
    p.onPickMode(toolDef.target === 'node' ? 'node' : 'link', toolDef.target === 'dirlink');
    setBanNode(null); setQ('');
  }, [tool]); // eslint-disable-line

  const items = useMemo(() => {
    const raw = pickerItems(B.network, X, toolDef.target, { showService: p.showService, showOutside: p.showOutside });
    return raw.map((it) => ({ ...it, apply: () => (it.kind === 'node' ? addForNode(it.id) : addForLink(it.id)) }));
  }, [tool, X, B, limit, control, cycle, p.showService, p.showOutside]); // eslint-disable-line

  const filtered = useMemo(() => items.filter((i) => matchesQuery(i.label, q)), [items, q]);
  const [shown, setShown] = useState(80);
  useEffect(() => setShown(80), [q, tool]);
  const listRef = useRef<HTMLUListElement>(null);
  const onListKey = (e: React.KeyboardEvent) => {
    const btns = Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? []);
    const i = btns.indexOf(document.activeElement as HTMLButtonElement);
    let n = -1;
    if (e.key === 'ArrowDown') n = Math.min(btns.length - 1, i + 1);
    else if (e.key === 'ArrowUp') n = Math.max(0, i - 1);
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = btns.length - 1;
    if (n >= 0) { e.preventDefault(); btns[n]?.focus(); }
  };
  const onSearchKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); listRef.current?.querySelector<HTMLButtonElement>('button')?.focus(); }
  };

  const banIn = banNode !== null ? X.incomingLinks[banNode] : [];
  const banOut = banNode !== null ? X.outgoingLinks[banNode] : [];
  const linkLbl = (id: number, dir: 'from' | 'to') => {
    const l = B.network.links[id];
    const other = dir === 'from' ? l.from : l.to;
    return `${X.linkName[id]} ${dir === 'from' ? 'from' : 'toward'} ${X.nodeStreets[other].filter((s) => s !== X.linkName[id] && s !== linkStreet(l)).join(' / ') || X.nodeName[other]}`;
  };

  return (
    <div className="iv-panel">
      {p.interventions.length === 0 ? (
        <p className="muted scn-empty">No interventions yet. Pick a tool, then a street.</p>
      ) : (
        <section className="scn-top" aria-labelledby={`${listId}-scn`}>
          <h3 className="scn-h" id={`${listId}-scn`}>Scenario <span className="count">{p.interventions.length}</span></h3>
          <ol className="scn-list">
            {p.interventions.map((iv, i) => {
              const d = describeIntervention(iv, B.network, X);
              return (
                <li key={i}>
                  <span className={`iv-badge static iv-${iv.type}`} aria-hidden="true">{iv.type === 'speed_limit' ? Math.round(iv.speed * 2.23694) : iv.type === 'modal_filter' ? 'MF' : iv.type === 'speed_hump' ? 'SH' : iv.type === 'traffic_circle' ? 'TC' : iv.type === 'control' ? 'IC' : iv.type === 'signal_timing' ? 'ST' : iv.type === 'one_way' ? '1W' : 'TB'}</span>
                  <span className="desc">{d}{!interventionInStudyArea(iv, B.network) && <>{" "}<span className="tag">outside study area</span></>}</span>
                  <button type="button" className="btn small-btn" onClick={() => p.onRemove(i)} aria-label={`Remove: ${d}`}>Remove</button>
                </li>
              );
            })}
          </ol>
          <div className="scn-actions">
            <button type="button" className="btn" onClick={p.onClear}>Clear all</button>
            {p.shareSlot}
          </div>
        </section>
      )}
      <fieldset className="tools">
        <legend>Tool</legend>
        <div className="tool-grid">
          {TOOLS.map((t) => (
            <button key={t.id} type="button" className={`tool ${tool === t.id ? 'on' : ''}`} aria-pressed={tool === t.id} onClick={() => setTool(t.id)}>{t.label}</button>
          ))}
        </div>
      </fieldset>
      <p className="muted small" id={`${listId}-help`}>{toolDef.help}</p>

      {tool === 'speed_limit' && (
        <label className="field">New limit
          <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
            {LIMITS.map((v) => <option key={v} value={v}>{v} mph</option>)}
          </select>
        </label>
      )}
      {tool === 'control' && (
        <label className="field">Control type
          <select value={control} onChange={(e) => setControl(e.target.value as ControlType)}>
            {CONTROLS.map((c) => <option key={c.v} value={c.v}>{c.label}</option>)}
          </select>
        </label>
      )}
      {tool === 'signal_timing' && (
        <label className="field">Cycle length (s)
          <input type="number" min={30} max={150} step={5} value={cycle} onChange={(e) => setCycle(Math.max(30, Math.min(150, Number(e.target.value) || 90)))} />
        </label>
      )}

      {tool === 'turn_ban' && banNode !== null ? (
        <div className="ban-form">
          <p><strong>{X.nodeName[banNode]}</strong> <button type="button" className="link" onClick={() => setBanNode(null)}>Change intersection</button></p>
          <label className="field">Vehicles coming from
            <select value={banFrom ?? ''} onChange={(e) => { setBanFrom(e.target.value === '' ? null : Number(e.target.value)); setBanTo(null); }}>
              <option value="">Choose…</option>
              {banIn.map((id) => <option key={id} value={id}>{linkLbl(id, 'from')}</option>)}
            </select>
          </label>
          <label className="field">may not turn onto
            <select value={banTo ?? ''} onChange={(e) => setBanTo(e.target.value === '' ? null : Number(e.target.value))} disabled={banFrom === null}>
              <option value="">Choose…</option>
              {banOut.filter((id) => banFrom === null || B.network.links[id].to !== B.network.links[banFrom].from).map((id) => <option key={id} value={id}>{linkLbl(id, 'to')}</option>)}
            </select>
          </label>
          <button type="button" className="btn primary" disabled={banFrom === null || banTo === null}
            onClick={() => { const iv: Intervention = { type: 'turn_ban', fromLink: banFrom!, toLink: banTo! }; p.onAdd([iv], `Added: ${describeIntervention(iv, B.network, X)}`); setBanFrom(null); setBanTo(null); }}>
            Add turn ban
          </button>
        </div>
      ) : (
        <div className="picker">
          <label className="field" htmlFor={`${listId}-q`}>
            {toolDef.target === 'node' ? 'Find an intersection' : toolDef.target === 'dirlink' ? 'Find a street direction' : 'Find a street block'}
          </label>
          <input id={`${listId}-q`} type="search" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onSearchKey}
            placeholder="Type a street name" aria-describedby={`${listId}-help`} />
          <div className="check-row">
            {toolDef.target !== 'node' && (
              <label className="check"><input type="checkbox" checked={p.showService} onChange={(e) => p.onShowService(e.target.checked)} /> Show service roads</label>
            )}
            <label className="check"><input type="checkbox" checked={p.showOutside} onChange={(e) => p.onShowOutside(e.target.checked)} /> Include streets outside the study area</label>
          </div>
          <p className="muted small" aria-live="polite">{filtered.length} match{filtered.length === 1 ? '' : 'es'}. Press Enter or Space on an item to add it, or click the map.</p>
          <ul className="pick-list" ref={listRef} onKeyDown={onListKey} aria-label="Matching places">
            {filtered.slice(0, shown).map((it) => (
              <li key={it.key}><button type="button" onClick={it.apply}><span>{it.label}</span><span className="add" aria-hidden="true">+</span></button></li>
            ))}
          </ul>
          {filtered.length > shown && <button type="button" className="btn" onClick={() => setShown((s) => s + 80)}>Show more ({filtered.length - shown})</button>}
        </div>
      )}

    </div>
  );
}
