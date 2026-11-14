import { describe, expect, it } from 'vitest';
import { buildFixture } from '../fixtures/area';
import { decodeMeta, decodeScenario, encodeScenario } from './hash';
import { nearestOnPolyline, pointAlong } from './geom';
import { makeProjection } from './projection';
import { encodeGeohash } from './geohash';
import type { Intervention, NetLink, NetNode, Network } from '../types';

const base = buildFixture().network;
const clone = (n: Network): Network => JSON.parse(JSON.stringify(n));
const nodeAt = (n: Network, x: number, y: number) => n.nodes.find((q) => Math.hypot(q.x - x, q.y - y) < 1e-6)!;
const grid = (i: number, j: number) => [(i - 2.5) * 120, (j - 2.5) * 120] as const;
const linkBetween = (n: Network, a: readonly [number, number], b: readonly [number, number]) => {
  const A = nodeAt(n, ...a), B = nodeAt(n, ...b);
  return n.links.find((l) => l.from === A.id && l.to === B.id)!;
};

/** Rebuild a network with new node and link ids; geometry is unchanged. */
function reindex(n: Network, seed: number): Network {
  let s = seed;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const perm = (len: number) => {
    const a = Array.from({ length: len }, (_, i) => i);
    for (let i = len - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a; // a[newId] = oldId
  };
  const np = perm(n.nodes.length), lp = perm(n.links.length);
  const newNode = new Map(np.map((o, i) => [o, i]));
  const newLink = new Map(lp.map((o, i) => [o, i]));
  const nodes: NetNode[] = np.map((o, i) => ({ ...n.nodes[o], id: i }));
  const links: NetLink[] = lp.map((o, i) => {
    const l = n.links[o];
    return { ...l, id: i, from: newNode.get(l.from)!, to: newNode.get(l.to)!, reverse: l.reverse === null ? null : newLink.get(l.reverse)! };
  });
  return { ...n, nodes, links };
}

const geomLen = (g: [number, number][]) => g.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - g[i][0], p[1] - g[i][1]), 0);

/** Split a two-way street in two at its midpoint with a new node. */
function splitPair(n: Network, linkId: number): Network {
  const out = clone(n);
  const l = out.links[linkId];
  const r = out.links[l.reverse!];
  const [a, b] = [out.nodes[l.from], out.nodes[l.to]];
  const mid: NetNode = { ...a, id: out.nodes.length, osmId: 9999, x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, gate: false, control: 'uncontrolled' };
  out.nodes.push(mid);
  const half = (src: NetLink, from: number, to: number, g: [number, number][], id: number, rev: number): NetLink =>
    ({ ...src, id, from, to, geometry: g, length: geomLen(g), reverse: rev });
  const m: [number, number] = [mid.x, mid.y];
  const base0 = out.links.length;
  const replaceL = half(l, l.from, mid.id, [[a.x, a.y], m], l.id, base0 + 1);
  const replaceR = half(r, mid.id, l.from, [m, [a.x, a.y]], r.id, base0);
  // ids: keep l/r for the a-side halves; append the b-side halves
  const bl = half(l, mid.id, l.to, [m, [b.x, b.y]], base0, r.id);
  const br = half(r, l.to, mid.id, [[b.x, b.y], m], base0 + 1, l.id);
  replaceL.reverse = r.id; replaceR.reverse = l.id;
  out.links[l.id] = replaceL; out.links[r.id] = replaceR;
  out.links.push(bl, br);
  return out;
}

/** Split one junction into two nodes 10 m apart joined by a short link pair (a staggered junction). */
function splitJunction(n: Network, x: number, y: number): { net: Network; west: NetNode; east: NetNode } {
  const out = clone(n);
  const j = nodeAt(out, x, y);
  const west: NetNode = { ...j, x: x - 5 };
  const east: NetNode = { ...j, id: out.nodes.length, osmId: 9998, x: x + 5 };
  out.nodes[j.id] = west; out.nodes.push(east);
  for (const l of out.links) {
    for (const end of ['from', 'to'] as const) {
      if (l[end] !== j.id) continue;
      const g = l.geometry;
      const other = end === 'from' ? g[g.length - 1] : g[0];
      const toEast = other[0] > x || (other[0] === x && other[1] > y); // east and north arms use the east node
      const node = toEast ? east : west;
      l[end] = node.id;
      if (end === 'from') g[0] = [node.x, node.y]; else g[g.length - 1] = [node.x, node.y];
      l.length = geomLen(g);
    }
  }
  const id0 = out.links.length;
  const mk = (id: number, from: NetNode, to: NetNode, rev: number): NetLink => ({
    ...out.links[0], id, from: from.id, to: to.id, reverse: rev, name: 'Connector', length: 10,
    geometry: [[from.x, from.y], [to.x, to.y]],
  });
  out.links.push(mk(id0, west, east, id0 + 1), mk(id0 + 1, east, west, id0));
  return { net: out, west, east };
}

const hasStreet = (net: Network, id: number, name: string) => net.links[id].name === name;

describe('scenario links across differently indexed networks', () => {
  const sj = splitJunction(base, ...grid(2, 2));
  const A = sj.net; // source network: junction split in two nodes
  const humpLink = linkBetween(A, grid(4, 2), grid(4, 3));
  const filtered = linkBetween(A, grid(3, 3), grid(4, 3));
  const limited = linkBetween(A, grid(1, 3), grid(1, 4));
  const oneWay = linkBetween(A, grid(3, 4), grid(2, 4));
  const banFrom = linkBetween(A, grid(1, 2), [grid(2, 2)[0] - 5, grid(2, 2)[1]]);
  const banTo = linkBetween(A, [grid(2, 2)[0] - 5, grid(2, 2)[1]], grid(2, 1));
  const list: Intervention[] = [
    { type: 'modal_filter', link: filtered.id },
    { type: 'modal_filter', node: nodeAt(A, ...grid(3, 2)).id },
    { type: 'speed_limit', link: limited.id, speed: 8.9 },
    { type: 'speed_hump', link: humpLink.id, position: 90 },
    { type: 'traffic_circle', node: sj.west.id },
    { type: 'control', node: nodeAt(A, ...grid(4, 4)).id, control: 'all_way_stop' },
    { type: 'signal_timing', node: nodeAt(A, ...grid(1, 1)).id, cycle: 80 },
    { type: 'one_way', link: oneWay.id },
    { type: 'turn_ban', fromLink: banFrom.id, toLink: banTo.id },
    { type: 'diagonal_diverter', node: nodeAt(A, ...grid(3, 3)).id, bearing: 135 },
  ];
  // target network: junction merged, the hump's block split in two, everything re-indexed
  const T = reindex(splitPair(base, linkBetween(base, grid(4, 2), grid(4, 3)).id), 7);
  const hash = encodeScenario(A, list);
  const dec = decodeScenario(T, hash);

  it('uses a compact, URL-safe v1 format with the area id', () => {
    expect(hash.startsWith('#v1;a=fixture;s=')).toBe(true);
    expect(hash).toMatch(/^#[A-Za-z0-9;=,.~_-]+$/);
    expect(hash).toMatch(/^#v1;a=fixture;s=[a-z]{2},[0-9b-hjkmnp-z]{10}/);
    expect(hash.length).toBeLessThan(40 * list.length);
  });

  it('places every intervention', () => {
    expect(dec.unplaced).toEqual([]);
    expect(dec.invalid).toBe(false);
    expect(dec.interventions).toHaveLength(list.length);
  });

  it('lands each intervention on the geometrically same block or intersection', () => {
    const near = (net: Network, id: number, x: number, y: number) => nearestOnPolyline(net.links[id].geometry, x, y).dist;
    const mid = (l: NetLink) => pointAlong(l.geometry, l.length / 2);
    const [mf, mn, sl, sh, tc, ct, st, ow, tb, dd] = dec.interventions;
    const m1 = mid(filtered);
    expect(mf.type === 'modal_filter' && 'link' in mf && near(T, mf.link, m1.x, m1.y)).toBeLessThan(1.5);
    expect(mn.type === 'modal_filter' && 'node' in mn && T.nodes[mn.node]).toMatchObject({ x: nodeAt(A, ...grid(3, 2)).x, y: nodeAt(A, ...grid(3, 2)).y });
    const m3 = mid(limited);
    expect(sl).toMatchObject({ type: 'speed_limit', speed: 8.9 });
    expect(near(T, (sl as { link: number }).link, m3.x, m3.y)).toBeLessThan(1.5);
    expect(hasStreet(T, (sl as { link: number }).link, limited.name)).toBe(true);
    // hump: same point on the ground, on a half of the split block
    const hp = pointAlong(humpLink.geometry, 90);
    const shl = sh as { link: number; position: number };
    const hp2 = pointAlong(T.links[shl.link].geometry, shl.position);
    expect(Math.hypot(hp.x - hp2.x, hp.y - hp2.y)).toBeLessThan(1.5);
    expect(T.links[shl.link].length).toBeCloseTo(60, 3);
    // junction nodes merged: both land on the merged junction
    const J = nodeAt(T, ...grid(2, 2));
    expect(tc).toEqual({ type: 'traffic_circle', node: J.id });
    expect(ct).toMatchObject({ type: 'control', control: 'all_way_stop', node: nodeAt(T, ...grid(4, 4)).id });
    expect(st).toMatchObject({ type: 'signal_timing', cycle: 80, node: nodeAt(T, ...grid(1, 1)).id });
    // one-way keeps the same travel direction
    const owl = T.links[(ow as { link: number }).link];
    expect([T.nodes[owl.from].x, T.nodes[owl.from].y]).toEqual([...grid(3, 4)]);
    expect([T.nodes[owl.to].x, T.nodes[owl.to].y]).toEqual([...grid(2, 4)]);
    // turn ban: arrives from the west arm and leaves on the south arm of the merged junction
    const t = tb as { fromLink: number; toLink: number };
    expect(T.nodes[T.links[t.fromLink].to].id).toBe(J.id);
    expect(T.nodes[T.links[t.fromLink].from]).toMatchObject({ x: grid(1, 2)[0], y: grid(1, 2)[1] });
    expect(T.links[t.toLink].from).toBe(J.id);
    expect(T.nodes[T.links[t.toLink].to]).toMatchObject({ x: grid(2, 1)[0], y: grid(2, 1)[1] });
    // diagonal diverter: same intersection, same orientation
    expect(dd).toEqual({ type: 'diagonal_diverter', node: nodeAt(T, ...grid(3, 3)).id, bearing: 135 });
  });

  it('is stable: decoding against the encoding network gives the same placement twice', () => {
    expect(decodeScenario(T, hash)).toEqual(dec);
    const again = decodeScenario(T, encodeScenario(T, dec.interventions));
    expect(again.unplaced).toEqual([]);
    expect(again.interventions).toHaveLength(list.length);
  });

  it('round-trips on the same network', () => {
    const r = decodeScenario(A, hash);
    expect(r.interventions).toEqual(
      list.map((iv) => (iv.type === 'speed_hump' ? { ...iv, position: 90 } : iv)).map((iv) => {
        // two-way blocks resolve to one canonical direction
        if ('link' in iv && iv.type !== 'one_way') {
          const got = r.interventions.find((x) => x.type === iv.type && 'link' in x && (x.link === iv.link || x.link === A.links[iv.link].reverse));
          return got ?? iv;
        }
        return iv;
      }),
    );
  });
});

describe('matching tolerances and directions', () => {
  const proj = makeProjection(base.origin);
  const at = (x: number, y: number) => (([lon, lat]) => encodeGeohash(lat, lon))(proj.toLonLat(x, y));

  it('reports interventions with no match as unplaced and keeps the rest', () => {
    const [x, y] = grid(2, 2);
    const h = `#v1;a=fixture;s=tc,${at(x, y)}~mf,${at(900, 900)}~tc,${at(x + 60, y + 60)}~st,${at(x, y)},80`;
    const r = decodeScenario(base, h);
    expect(r.interventions.map((i) => i.type)).toEqual(['traffic_circle', 'signal_timing']);
    expect(r.unplaced.map((u) => u.type)).toEqual(['modal_filter', 'traffic_circle']);
    expect(r.unplaced[0].reason).toMatch(/street/);
    expect(r.unplaced[1].reason).toMatch(/intersection/);
    expect(r.unplaced[0]).toMatchObject({ lon: expect.any(Number), lat: expect.any(Number) });
  });

  it('accepts a point just inside the street tolerance', () => {
    const [x, y] = grid(2, 2);
    expect(decodeScenario(base, `#v1;s=mf,${at(x + 60, y + 20)}`).interventions).toHaveLength(1);
    expect(decodeScenario(base, `#v1;s=mf,${at(x + 60, y + 30)}`).unplaced).toHaveLength(1);
  });

  it('tells the two directions of a two-way street apart by bearing', () => {
    for (const net of [base, reindex(base, 3)]) {
      const east = linkBetween(net, grid(2, 2), grid(3, 2));
      const west = linkBetween(net, grid(3, 2), grid(2, 2));
      const h = encodeScenario(net, [{ type: 'one_way', link: east.id }]);
      const h2 = encodeScenario(net, [{ type: 'one_way', link: west.id }]);
      expect(h).not.toEqual(h2);
      expect(decodeScenario(net, h).interventions).toEqual([{ type: 'one_way', link: east.id }]);
      expect(decodeScenario(net, h2).interventions).toEqual([{ type: 'one_way', link: west.id }]);
    }
  });

  it('picks a stable direction for two-way interventions', () => {
    const e = linkBetween(base, grid(2, 2), grid(3, 2));
    const w = linkBetween(base, grid(3, 2), grid(2, 2));
    const he = encodeScenario(base, [{ type: 'modal_filter', link: e.id }]);
    const hw = encodeScenario(base, [{ type: 'modal_filter', link: w.id }]);
    expect(he).toEqual(hw);
    expect(decodeScenario(base, he).interventions).toEqual([{ type: 'modal_filter', link: e.id }]);
  });

  it('survives a mid-block hump position', () => {
    const l = linkBetween(base, grid(2, 2), grid(3, 2));
    const r = decodeScenario(base, encodeScenario(base, [{ type: 'speed_hump', link: l.id, position: 37.5 }]));
    expect(r.interventions[0]).toMatchObject({ type: 'speed_hump', link: l.id });
    expect((r.interventions[0] as { position: number }).position).toBeCloseTo(37.5, 0);
  });
});

describe('diagonal diverter links', () => {
  const at = nodeAt(base, ...grid(3, 3)).id;
  it('encodes as dd, geohash and whole-degree bearing', () => {
    const h = encodeScenario(base, [{ type: 'diagonal_diverter', node: at, bearing: 45 }]);
    expect(h).toMatch(/^#v1;a=fixture;s=dd,[0-9b-hjkmnp-z]{10},45$/);
    expect(decodeScenario(base, h).interventions).toEqual([{ type: 'diagonal_diverter', node: at, bearing: 45 }]);
  });
  it('keeps the orientation after the network is re-indexed', () => {
    const T = reindex(base, 3);
    for (const bearing of [0, 45, 135, 175]) {
      const d = decodeScenario(T, encodeScenario(base, [{ type: 'diagonal_diverter', node: at, bearing }]));
      expect(d.unplaced).toEqual([]);
      expect(d.interventions).toEqual([{ type: 'diagonal_diverter', node: nodeAt(T, ...grid(3, 3)).id, bearing }]);
    }
  });
  it('rejects bearings outside 0 to 179 and reports a missing intersection as unplaced', () => {
    const good = encodeScenario(base, [{ type: 'diagonal_diverter', node: at, bearing: 45 }]);
    expect(decodeScenario(base, good.replace(/,45$/, ',180')).invalid).toBe(true);
    expect(decodeScenario(base, good.replace(/,45$/, ',-5')).invalid).toBe(true);
    expect(decodeScenario(base, good.replace(/,45$/, ',x')).invalid).toBe(true);
    const far = encodeScenario(base, [{ type: 'diagonal_diverter', node: at, bearing: 45 }]).replace(/dd,[0-9a-z]{10}/, 'dd,' + encodeGeohash(10, 10));
    expect(decodeScenario(base, far).unplaced).toHaveLength(1);
  });
});

describe('unreadable links and meta', () => {
  const ok = encodeGeohash(37.84, -122.25);
  const bad = [
    '#a=rockridge&p=pm_peak&i=W3sidHlwZSI6Im9uZV93YXkiLCJsaW5rIjoyfV0',
    '#v2;a=fixture;s=mf,-122.25,37.84',
    '#v1;a=elsewhere;s=mf,' + ok,
    '#v1;a=fixture;s=zz,' + ok,
    '#v1;a=fixture;s=mf,abc',
    '#v1;a=fixture;s=mf,' + ok.toUpperCase(),
    '#v1;a=fixture;s=sl,' + ok + ',999',
    '#v1;a=fixture;s=ct,' + ok + ',x',
    '#v1;a=fixture;s=mf,' + ok + '~tc',
    '#%%garbage',
  ];
  it.each(bad)('flags %s and returns no interventions', (h) => {
    expect(decodeScenario(base, h)).toEqual({ interventions: [], unplaced: [], invalid: true });
  });
  it('does not flag empty or area-only hashes', () => {
    expect(decodeScenario(base, '').invalid).toBe(false);
    expect(decodeScenario(base, '#v1;a=fixture;p=am').invalid).toBe(false);
  });
  it('reads area, period and demand and writes them back', () => {
    const h = encodeScenario(base, [], { area: 'rockridge', period: 'pm_peak', demandScale: 1.2 });
    expect(h).toBe('#v1;a=rockridge;p=pm_peak;d=1.2');
    expect(decodeMeta(h)).toEqual({ area: 'rockridge', period: 'pm_peak', demandScale: 1.2 });
    expect(decodeMeta('#a=x&p=y&d=2')).toEqual({});
    // The app passes no period when it equals the default, so ordinary links do not pin one.
    expect(encodeScenario(base, [], { area: 'rockridge', period: undefined, demandScale: 1.2 })).toBe('#v1;a=rockridge;d=1.2');
    expect(decodeMeta('#v1;a=bad area!')).toEqual({});
  });
  it('gives an empty hash for the baseline without an area', () => {
    expect(encodeScenario(base, [], { area: null })).toBe('');
  });
});

describe('modal filters on part of a junction', () => {
  const nid = nodeAt(base, ...grid(3, 3)).id;
  const legLinks = (net: Network, node: number, toward: (dx: number, dy: number) => boolean) =>
    net.links.filter((l) => (l.from === node || l.to === node) && (() => {
      const other = net.nodes[l.from === node ? l.to : l.from], me = net.nodes[node];
      return toward(other.x - me.x, other.y - me.y);
    })()).map((l) => l.id).sort((a, b) => a - b);
  const eastWest = (net: Network, node: number) => legLinks(net, node, (dx, dy) => Math.abs(dx) > Math.abs(dy));
  const iv = (net: Network, node: number): Intervention => ({ type: 'modal_filter', node, legs: eastWest(net, node) });

  it('writes the closed legs as bearings after the geohash', () => {
    const h = encodeScenario(base, [iv(base, nid)]);
    expect(h).toMatch(/^#v1;a=fixture;s=mn,[0-9b-hjkmnp-z]{10},90\.270$/);
  });

  it('round-trips on the same network and after a re-index', () => {
    const h = encodeScenario(base, [iv(base, nid)]);
    expect(decodeScenario(base, h).interventions).toEqual([iv(base, nid)]);
    const T = reindex(base, 5);
    const tn = nodeAt(T, ...grid(3, 3)).id;
    expect(decodeScenario(T, h)).toEqual({ interventions: [iv(T, tn)], unplaced: [], invalid: false });
  });

  it('keeps the old whole-junction link meaning every leg', () => {
    const old = encodeScenario(base, [{ type: 'modal_filter', node: nid }]);
    expect(old).toMatch(/^#v1;a=fixture;s=mn,[0-9b-hjkmnp-z]{10}$/);
    expect(decodeScenario(base, old).interventions).toEqual([{ type: 'modal_filter', node: nid }]);
    // a link written before legs existed
    expect(decodeScenario(base, '#v1;a=fixture;s=mn,9q9p6177k0')).toEqual({ interventions: [{ type: 'modal_filter', node: nid }], unplaced: [], invalid: false });
    // closing every leg is the same filter and encodes the same way
    const all = legLinks(base, nid, () => true);
    expect(encodeScenario(base, [{ type: 'modal_filter', node: nid, legs: all }])).toBe(old);
  });

  it('reports a closed street that no longer exists as unplaced, and rejects malformed bearings', () => {
    const h = encodeScenario(base, [iv(base, nid)]);
    const stale = h.replace(/,90\.270$/, ',0.90.180.270.45');
    expect(decodeScenario(base, stale).unplaced).toHaveLength(1);
    expect(decodeScenario(base, stale).interventions).toEqual([]);
    for (const b of ['x', '400', '90.', '90..270', '-5']) expect(decodeScenario(base, h.replace(/,90\.270$/, `,${b}`)).invalid).toBe(true);
  });

  it('treats one street per junction and the whole junction as different items', () => {
    const a = encodeScenario(base, [iv(base, nid), { type: 'modal_filter', node: nid }]);
    expect(decodeScenario(base, a).interventions).toHaveLength(2);
  });
});
