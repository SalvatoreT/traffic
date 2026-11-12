import { useEffect, useId, useMemo, useState } from 'react';
import type { AreaBundle } from '../types';
import { matchesQuery, type NetIndex } from '../lib/naming';
import { listDismissed, listOpen, placeResults, type PlaceResult } from '../lib/picker';
import { hoverHandlers, type Hover } from '../lib/highlight';
import type { Selection } from '../lib/selection';

const CAP = 30;
const placeHover = (r: PlaceResult): Hover => (r.kind === 'block' ? { kind: 'block', block: r.id } : { kind: 'node', node: r.id });

interface Props {
  bundle: AreaBundle; index: NetIndex;
  showService: boolean; onShowService(v: boolean): void;
  onChoose(s: Selection): void;
  onHover(h: Hover | null): void;
}

/** One search box for street blocks and intersections: a combobox with a grouped listbox. */
export function PlaceSearch(p: Props) {
  const id = useId();
  const [q, setQ] = useState('');
  const [dismissed, setDismissed] = useState(false);
  const [active, setActive] = useState(-1);
  const all = useMemo(() => placeResults(p.bundle.network, p.index, { showService: p.showService }), [p.bundle, p.index, p.showService]);
  const found = useMemo(() => ({
    blocks: all.blocks.filter((r) => matchesQuery(r.label, q)),
    nodes: all.nodes.filter((r) => matchesQuery(r.label, q)),
  }), [all, q]);
  const shown = useMemo(() => ({ blocks: found.blocks.slice(0, CAP), nodes: found.nodes.slice(0, CAP) }), [found]);
  const flat: PlaceResult[] = useMemo(() => [...shown.blocks, ...shown.nodes], [shown]);
  const expanded = listOpen(q, dismissed, flat.length);
  useEffect(() => setActive(-1), [q, p.showService]);
  const activeResult = expanded && active >= 0 ? flat[active] : null;
  const { onHover } = p;
  useEffect(() => {
    if (!expanded) onHover(null);
  }, [expanded, onHover]);
  useEffect(() => {
    if (activeResult) onHover(placeHover(activeResult));
  }, [activeResult, onHover]);
  useEffect(() => { if (active >= 0) document.getElementById(`${id}-o${active}`)?.scrollIntoView({ block: 'nearest' }); }, [active, id]);

  const choose = (r: PlaceResult) => {
    p.onChoose(r.kind === 'block' ? { kind: 'block', block: r.id, point: null, nearLink: null, via: 'search' } : { kind: 'node', node: r.id, via: 'search' });
    setQ(''); setDismissed(listDismissed(dismissed, 'choose')); setActive(-1); p.onHover(null);
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setDismissed(listDismissed(dismissed, 'type')); setActive((a) => (flat.length ? Math.min(flat.length - 1, a + 1) : -1)); }
    else if (e.key === 'ArrowUp' && expanded) { e.preventDefault(); setActive((a) => Math.max(-1, a - 1)); }
    else if (e.key === 'Enter' && expanded && (active >= 0 || q.trim())) { e.preventDefault(); choose(flat[Math.max(0, active)]); }
    else if (e.key === 'Escape') {
      if (expanded) { e.stopPropagation(); setDismissed(listDismissed(dismissed, 'escape')); setActive(-1); }
      else if (q) { e.stopPropagation(); setQ(''); }
    }
  };
  const total = found.blocks.length + found.nodes.length;
  const option = (r: PlaceResult, i: number) => (
    <div key={r.key} id={`${id}-o${i}`} role="option" aria-selected={active === i} className={`pl-opt ${active === i ? 'on' : ''}`}
      onMouseDown={(e) => e.preventDefault()} onClick={() => choose(r)} {...hoverHandlers(p.onHover, placeHover(r))}>{r.label}</div>
  );
  return (
    <div className="picker">
      <label className="field" htmlFor={`${id}-q`}>Find a street or intersection</label>
      <input id={`${id}-q`} type="search" role="combobox" aria-expanded={expanded} aria-controls={`${id}-list`} aria-autocomplete="list" autoComplete="off"
        aria-activedescendant={expanded && active >= 0 ? `${id}-o${active}` : undefined} placeholder="Type a street name"
        value={q} onChange={(e) => { setQ(e.target.value); setDismissed(listDismissed(dismissed, 'type')); }} onKeyDown={onKey} />
      <div className="check-row">
        <label className="check"><input type="checkbox" checked={p.showService} onChange={(e) => p.onShowService(e.target.checked)} /> Show service roads</label>
      </div>
      <p className="muted small" role="status">
        {q.trim() ? `${found.blocks.length} street block${found.blocks.length === 1 ? '' : 's'}, ${found.nodes.length} intersection${found.nodes.length === 1 ? '' : 's'}.${total > flat.length ? ` Showing the first ${CAP} of each. Keep typing to narrow.` : ''}` : ''}
      </p>
      <div id={`${id}-list`} role="listbox" aria-label="Matching places" className="pl-list" hidden={!expanded}>
        {shown.blocks.length > 0 && (
          <div role="group" aria-labelledby={`${id}-gb`}>
            <div className="pl-group" id={`${id}-gb`}>Street blocks</div>
            {shown.blocks.map((r, i) => option(r, i))}
          </div>
        )}
        {shown.nodes.length > 0 && (
          <div role="group" aria-labelledby={`${id}-gn`}>
            <div className="pl-group" id={`${id}-gn`}>Intersections</div>
            {shown.nodes.map((r, i) => option(r, shown.blocks.length + i))}
          </div>
        )}
      </div>
    </div>
  );
}
