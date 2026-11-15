import { describe, expect, it } from 'vitest';
import { canonicalAnchor, fragmentFor, parseFragment, parseLocation, pathOfView, scenarioOnly, titleFor, urlFor, viewOfPath, VIEWS, type View } from './route';

const SCENARIO = '#v1;a=rockridge;s=mn,9q9p642ut2~mn,9q9p3fr7b5;p=pm_peak';

describe('path and tab', () => {
  it('maps every tab to one path and back', () => {
    expect(VIEWS.map((v) => v.path)).toEqual(['/', '/proposals', '/streets', '/assumptions', '/sources']);
    for (const v of VIEWS) { expect(pathOfView(v.id)).toBe(v.path); expect(viewOfPath(v.path)).toBe(v.id); }
  });
  it('derives each slug from the tab id', () => {
    for (const v of VIEWS) expect(v.path).toBe(v.id === 'map' ? '/' : `/${v.id}`);
  });
  it('ignores trailing slashes and case, and reads index.html as the Map', () => {
    expect(viewOfPath('/proposals/')).toBe('proposals');
    expect(viewOfPath('/Streets')).toBe('streets');
    expect(viewOfPath('/ASSUMPTIONS//')).toBe('assumptions');
    expect(viewOfPath('')).toBe('map');
    expect(viewOfPath('/index.html')).toBe('map');
  });
  it('returns null for a path that names no tab', () => {
    for (const p of ['/nope', '/proposals/extra', '/data/x.json', '/map', '/sources.html', '/%']) expect(viewOfPath(p)).toBeNull();
  });
});

describe('fragment kinds', () => {
  it('tells none, scenario and anchor apart', () => {
    expect(parseFragment('')).toEqual({ kind: 'none' });
    expect(parseFragment('#')).toEqual({ kind: 'none' });
    expect(parseFragment('#v1')).toEqual({ kind: 'scenario', hash: '#v1' });
    expect(parseFragment('v1;a=rockridge')).toEqual({ kind: 'scenario', hash: '#v1;a=rockridge' });
    expect(parseFragment(SCENARIO)).toEqual({ kind: 'scenario', hash: SCENARIO });
    expect(parseFragment('#why-cars-cut-through')).toEqual({ kind: 'anchor', id: 'why-cars-cut-through' });
  });
  it('does not take an id that only starts like a scenario for one', () => {
    for (const h of ['#v10', '#v1x;a=b', '#v2;a=b', '#V1;a=b', '#v1-notes']) expect(parseFragment(h).kind).toBe('anchor');
  });
  it('decodes percent escapes in an anchor and keeps a malformed one as written', () => {
    expect(parseFragment('#caf%C3%A9')).toEqual({ kind: 'anchor', id: 'café' });
    expect(parseFragment('#bad%E0%A4%A')).toEqual({ kind: 'anchor', id: 'bad%E0%A4%A' });
  });
  it('hands a scenario decoder nothing when the fragment is an anchor', () => {
    expect(scenarioOnly(SCENARIO)).toBe(SCENARIO);
    expect(scenarioOnly('#why-cars-cut-through')).toBe('');
    expect(scenarioOnly('')).toBe('');
  });
});

describe('location', () => {
  it('opens a tab with a scenario on any tab path', () => {
    for (const v of VIEWS) {
      const p = parseLocation(v.path, SCENARIO);
      expect(p).toEqual({ view: v.id, known: true, fragment: { kind: 'scenario', hash: SCENARIO } });
    }
  });
  it('opens an old link on the Map', () => {
    expect(parseLocation('/', SCENARIO).view).toBe('map');
    expect(parseLocation('/index.html', SCENARIO).fragment.kind).toBe('scenario');
  });
  it('falls back to the Map for an unknown path and says it was unknown', () => {
    expect(parseLocation('/nope', SCENARIO)).toEqual({ view: 'map', known: false, fragment: { kind: 'scenario', hash: SCENARIO } });
    expect(parseLocation('/nope', '').known).toBe(false);
  });
  it('reads an anchor on its tab and rewrites an old id to the current one', () => {
    expect(parseLocation('/assumptions', '#reason-on-2853241697').fragment).toEqual({ kind: 'anchor', id: 'reason-on-2853241697' });
    expect(parseLocation('/assumptions', '#ref-intents').fragment).toEqual({ kind: 'anchor', id: 'why-cars-cut-through' });
    expect(parseLocation('/sources', '#ref-Thomas2024').fragment).toEqual({ kind: 'anchor', id: 'Thomas2024' });
  });
});

describe('old ids', () => {
  it('redirects the ids the Assumptions and Sources tabs carried before', () => {
    expect(canonicalAnchor('assumptions', 'ref-intents')).toBe('why-cars-cut-through');
    expect(canonicalAnchor('assumptions', 'ref-movements')).toBe('assumed-movement-flows');
    expect(canonicalAnchor('sources', 'ref-calibration')).toBe('calibration');
    expect(canonicalAnchor('sources', 'ref-Treiber2000')).toBe('Treiber2000');
  });
  it('leaves current ids and other tabs alone', () => {
    expect(canonicalAnchor('assumptions', 'why-cars-cut-through')).toBe('why-cars-cut-through');
    expect(canonicalAnchor('sources', 'Treiber2000')).toBe('Treiber2000');
    expect(canonicalAnchor('proposals', 'ref-x')).toBe('ref-x');
    expect(canonicalAnchor('sources', 'ref-')).toBe('ref-');
  });
});

describe('building the address', () => {
  it('keeps the scenario in the URL on every tab', () => {
    for (const v of VIEWS) expect(urlFor(v.id, SCENARIO)).toBe(`${v.path}${SCENARIO}`);
  });
  it('shows the anchor instead of the scenario while one is showing', () => {
    expect(fragmentFor(SCENARIO, 'why-cars-cut-through')).toBe('#why-cars-cut-through');
    expect(urlFor('assumptions', SCENARIO, 'why-cars-cut-through')).toBe('/assumptions#why-cars-cut-through');
  });
  it('restores the scenario once the anchor is gone, and writes nothing without either', () => {
    expect(fragmentFor(SCENARIO, null)).toBe(SCENARIO);
    expect(urlFor('sources', '')).toBe('/sources');
    expect(urlFor('map', '')).toBe('/');
  });
  it('escapes an anchor and keeps the query string', () => {
    expect(fragmentFor('', 'a b/c')).toBe('#a%20b%2Fc');
    expect(parseFragment(fragmentFor('', 'a b/c'))).toEqual({ kind: 'anchor', id: 'a b/c' });
    expect(urlFor('streets', SCENARIO, null, '?mock=1')).toBe(`/streets?mock=1${SCENARIO}`);
  });
  it('round-trips every tab and fragment kind through the location parser', () => {
    for (const v of VIEWS) for (const anchor of [null, 'x-y']) {
      const url = urlFor(v.id, SCENARIO, anchor);
      const i = url.indexOf('#');
      const p = parseLocation(url.slice(0, i), url.slice(i));
      expect(p.view).toBe(v.id);
      expect(p.fragment).toEqual(anchor ? { kind: 'anchor', id: anchor } : { kind: 'scenario', hash: SCENARIO });
    }
  });
});

describe('title', () => {
  it('names the tab and the area', () => {
    expect(titleFor('proposals', 'Rockridge Trapezoid')).toBe('Proposals · Traffic: Rockridge Trapezoid');
    const views: View[] = VIEWS.map((v) => v.id);
    expect(new Set(views.map((v) => titleFor(v, 'X'))).size).toBe(views.length);
  });
});
