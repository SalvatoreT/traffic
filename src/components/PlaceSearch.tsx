import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { AreaBundle } from '../types';
import { matchesQuery, type NetIndex } from '../lib/naming';
import { placeResults, type PlaceResult } from '../lib/picker';
import type { Selection } from '../lib/selection';

const CAP = 30;

interface Props {
  bundle: AreaBundle; index: NetIndex;
  showService: boolean; onShowService(v: boolean): void;
  showOutside: boolean; onShowOutside(v: boolean): void;
  onChoose(s: Selection): void;
}

/** One search box for street blocks and intersections: a combobox with a grouped listbox. */
export function PlaceSearch(p: Props) {
  const id = useId();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrap = useRef<HTMLDivElement>(null);
  const all = useMemo(() => placeResults(p.bundle.network, p.index, { showService: p.showService, showOutside: p.showOutside }), [p.bundle, p.index, p.showService, p.showOutside]);
  const found = useMemo(() => ({
    blocks: all.blocks.filter((r) => matchesQuery(r.label, q)),
    nodes: all.nodes.filter((r) => matchesQuery(r.label, q)),
  }), [all, q]);
  const shown = useMemo(() => ({ blocks: found.blocks.slice(0, CAP), nodes: found.nodes.slice(0, CAP) }), [found]);
  const flat: PlaceResult[] = useMemo(() => [...shown.blocks, ...shown.nodes], [shown]);
  const expanded = open && flat.length > 0;
  useEffect(() => setActive(-1), [q, p.showService, p.showOutside]);
  useEffect(() => { if (active >= 0) document.getElementById(`${id}-o${active}`)?.scrollIntoView({ block: 'nearest' }); }, [active, id]);

  const choose = (r: PlaceResult) => {
    p.onChoose(r.kind === 'block' ? { kind: 'block', block: r.id, point: null, nearLink: null, via: 'search' } : { kind: 'node', node: r.id, via: 'search' });
    setQ(''); setOpen(false); setActive(-1);
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((a) => (flat.length ? Math.min(flat.length - 1, a + 1) : -1)); }
    else if (e.key === 'ArrowUp' && expanded) { e.preventDefault(); setActive((a) => Math.max(-1, a - 1)); }
    else if (e.key === 'Enter' && expanded && (active >= 0 || q.trim())) { e.preventDefault(); choose(flat[Math.max(0, active)]); }
    else if (e.key === 'Escape') {
      if (open) { e.stopPropagation(); setOpen(false); setActive(-1); }
      else if (q) { e.stopPropagation(); setQ(''); }
    }
  };
  const total = found.blocks.length + found.nodes.length;
  const option = (r: PlaceResult, i: number) => (
    <div key={r.key} id={`${id}-o${i}`} role="option" aria-selected={active === i} className={`pl-opt ${active === i ? 'on' : ''}`}
      onMouseDown={(e) => e.preventDefault()} onClick={() => choose(r)}>{r.label}</div>
  );
  return (
    <div className="picker" ref={wrap} onBlur={(e) => { if (!wrap.current?.contains(e.relatedTarget as Node)) setOpen(false); }}>
      <label className="field" htmlFor={`${id}-q`}>Find a street or intersection</label>
      <input id={`${id}-q`} type="search" role="combobox" aria-expanded={expanded} aria-controls={`${id}-list`} aria-autocomplete="list" autoComplete="off"
        aria-activedescendant={expanded && active >= 0 ? `${id}-o${active}` : undefined} placeholder="Type a street name"
        value={q} onChange={(e) => { setQ(e.target.value); setOpen(true); }} onKeyDown={onKey} onFocus={() => { if (q) setOpen(true); }} />
      <div className="check-row">
        <label className="check"><input type="checkbox" checked={p.showService} onChange={(e) => p.onShowService(e.target.checked)} /> Show service roads</label>
        <label className="check"><input type="checkbox" checked={p.showOutside} onChange={(e) => p.onShowOutside(e.target.checked)} /> Include streets outside the study area</label>
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
