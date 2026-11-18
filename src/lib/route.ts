import { legacyProposalAnchor } from './proposals';

export type View = 'map' | 'proposals' | 'streets' | 'methodology' | 'assumptions' | 'sources';

/** One row per tab: the path is derived from the id, and the same table answers both directions. */
export const VIEWS: readonly { id: View; label: string; path: string }[] = (
  [['map', 'Map'], ['proposals', 'Proposals'], ['streets', 'Streets'], ['methodology', 'Methodology'], ['assumptions', 'Assumptions'], ['sources', 'Sources']] as const
).map(([id, label]) => ({ id, label, path: id === 'map' ? '/' : `/${id}` }));

export const viewLabel = (v: View): string => VIEWS.find((x) => x.id === v)!.label;
export const pathOfView = (v: View): string => VIEWS.find((x) => x.id === v)!.path;

/** The tab a path names, or null for a path that names none. Case and trailing slashes do not matter; `/index.html` is the Map. */
export function viewOfPath(pathname: string): View | null {
  const p = pathname.replace(/\/+$/, '').toLowerCase();
  if (p === '' || p === '/index.html') return 'map';
  return VIEWS.find((v) => v.path === p)?.id ?? null;
}

export type Fragment = { kind: 'none' } | { kind: 'scenario'; hash: string } | { kind: 'anchor'; id: string };

/** A scenario fragment is `#v1` or `#v1;…`; any other non-empty fragment is a section anchor. */
export function parseFragment(hash: string): Fragment {
  const h = hash.replace(/^#/, '');
  if (!h) return { kind: 'none' };
  if (h === 'v1' || h.startsWith('v1;')) return { kind: 'scenario', hash: `#${h}` };
  let id = h;
  try { id = decodeURIComponent(h); } catch { /* keep the raw text */ }
  return { kind: 'anchor', id };
}

/** The fragment as a scenario decoder should see it: empty unless it is a scenario. */
export const scenarioOnly = (hash: string): string => {
  const f = parseFragment(hash);
  return f.kind === 'scenario' ? f.hash : '';
};

/** Ids the sections carried before anchors were named after their headings. */
const ALIASES: Partial<Record<View, Record<string, string>>> = {
  assumptions: { 'ref-intents': 'why-cars-cut-through', 'ref-movements': 'assumed-movement-flows' },
  sources: { 'ref-calibration': 'calibration' },
};
export function canonicalAnchor(view: View, id: string): string {
  const hit = ALIASES[view]?.[id];
  if (hit) return hit;
  if (view === 'proposals') return legacyProposalAnchor(id) ?? id;
  return view === 'sources' && /^ref-.+/.test(id) ? id.slice(4) : id;
}

export interface Place { view: View; known: boolean; fragment: Fragment }

export function parseLocation(pathname: string, hash: string): Place {
  const view = viewOfPath(pathname);
  const f = parseFragment(hash);
  const fragment: Fragment = f.kind === 'anchor' && view ? { kind: 'anchor', id: canonicalAnchor(view, f.id) } : f;
  return { view: view ?? 'map', known: view !== null, fragment };
}

/** What follows the path: the anchor when one is showing, otherwise the scenario, otherwise nothing. */
export function fragmentFor(scenarioHash: string, anchor: string | null): string {
  return anchor ? `#${encodeURIComponent(anchor)}` : scenarioHash;
}

export const urlFor = (view: View, scenarioHash: string, anchor: string | null = null, search = ''): string =>
  `${pathOfView(view)}${search}${fragmentFor(scenarioHash, anchor)}`;

export const titleFor = (view: View, areaName: string): string => `${viewLabel(view)} · Traffic: ${areaName}`;
