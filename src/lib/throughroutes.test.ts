import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import type { Intervention, NetLink, NetNode, Network, RoadClass } from '../types';
import { buildIndex } from './naming';
import { diverterOptions } from './diverter';
import { checkThroughRoutes, formatRouteLength, routeHeadline, SAME_STREET_MIN_M, throughRoutes } from './throughroutes';

class B {
  nodes: NetNode[] = [];
  links: NetLink[] = [];
  turnBans: NonNullable<Network['turnBans']> = [];
  n(x: number, y: number): number {
    this.nodes.push({ id: this.nodes.length, osmId: this.nodes.length, x, y, control: 'uncontrolled', gate: false, inStudyArea: true });
    return this.nodes.length - 1;
  }
  /** Two-way street between two nodes unless `oneWay`; returns [forward, reverse | null]. */
  s(name: string, cls: RoadClass, a: number, b: number, oneWay = false): [number, number | null] {
    const mk = (from: number, to: number, reverse: number | null): NetLink => {
      const f = this.nodes[from], t = this.nodes[to];
      return {
        id: this.links.length, osmWayId: this.links.length, from, to, reverse, name, class: cls, lanes: 1, speedLimit: 11,
        length: Math.hypot(t.x - f.x, t.y - f.y), geometry: [[f.x, f.y], [t.x, t.y]], stopAtEnd: false, humps: [],
        inStudyArea: true,
      };
    };
    const fwd = mk(a, b, null);
    this.links.push(fwd);
    if (oneWay) return [fwd.id, null];
    const back = mk(b, a, fwd.id);
    this.links.push(back);
    fwd.reverse = back.id;
    return [fwd.id, back.id];
  }
  net(): Network {
    return { version: 1, id: 't', name: 't', origin: { lon: -122.25, lat: 37.84 }, bbox: [0, 0, 0, 0], studyArea: [], nodes: this.nodes, links: this.links, turnBans: this.turnBans };
  }
}
const run = (net: Network, ivs: Intervention[] = []) => checkThroughRoutes(net, buildIndex(net), ivs);

/** West Avenue and East Avenue bound the area; Mid Street crosses it in two blocks. */
function rat() {
  const b = new B();
  const w0 = b.n(0, -100), w1 = b.n(0, 0), w2 = b.n(0, 100), e0 = b.n(400, -100), e1 = b.n(400, 0), e2 = b.n(400, 100), m = b.n(200, 0);
  b.s('West Avenue', 'tertiary', w0, w1); b.s('West Avenue', 'tertiary', w1, w2);
  b.s('East Avenue', 'tertiary', e0, e1); b.s('East Avenue', 'tertiary', e1, e2);
  const west = b.s('Mid Street', 'residential', w1, m), east = b.s('Mid Street', 'residential', m, e1);
  return { b, net: b.net(), west, east, m };
}

/** Four bounding streets meeting a four-way intersection inside. */
function cross() {
  const b = new B();
  const x = b.n(200, 200);
  const w = b.n(0, 200), e = b.n(400, 200), n = b.n(200, 400), s = b.n(200, 0);
  for (const [name, p, dx, dy] of [['West Avenue', w, 0, 100], ['East Avenue', e, 0, 100], ['North Avenue', n, 100, 0], ['South Avenue', s, 100, 0]] as const) {
    const q = b.n(b.nodes[p].x + dx, b.nodes[p].y + dy), r = b.n(b.nodes[p].x - dx, b.nodes[p].y - dy);
    b.s(name, 'tertiary', r, p); b.s(name, 'tertiary', p, q);
  }
  b.s('Mid Street', 'residential', w, x); b.s('Mid Street', 'residential', x, e);
  b.s('Cross Street', 'residential', n, x); b.s('Cross Street', 'residential', x, s);
  return { net: b.net(), x };
}

describe('through routes', () => {
  it('finds the one rat run and describes it by street', () => {
    const { net } = rat();
    const c = run(net);
    expect(c.total).toBe(1);
    expect(c.routes[0].description).toBe('West Avenue to East Avenue via Mid Street');
    expect(c.routes[0].lengthM).toBeCloseTo(400);
    expect(c.cells).toHaveLength(1);
    expect(c.cells[0].entries.map((a) => a.street).sort()).toEqual(['East Avenue', 'West Avenue']);
    expect(c.cells[0].exits).toHaveLength(2);
  });

  it('is closed by a modal filter on a block or at the node', () => {
    const { net, west, m } = rat();
    expect(run(net, [{ type: 'modal_filter', link: west[0] }]).total).toBe(0);
    expect(run(net, [{ type: 'modal_filter', node: m }]).total).toBe(0);
  });

  it('keeps a route a one-way street still allows in one direction', () => {
    const { net, west, east } = rat();
    const c = run(net, [{ type: 'one_way', link: west[0] }, { type: 'one_way', link: east[0] }]);
    expect(c.total).toBe(1);
    expect(c.routes[0].fromStreet).toBe('West Avenue');
    // Opposite directions on the two blocks leave no way across.
    expect(run(net, [{ type: 'one_way', link: west[0] }, { type: 'one_way', link: east[1]! }]).total).toBe(0);
  });

  it('counts both directions as one route', () => {
    const { net } = rat();
    expect(run(net).routes).toHaveLength(1);
  });

  it('removes movements a diagonal diverter forbids and keeps both L-turns', () => {
    const { net, x } = cross();
    const idx = buildIndex(net);
    expect(run(net).total).toBe(6);
    const opts = diverterOptions(net, idx, x);
    expect(opts).toHaveLength(2);
    for (const o of opts) {
      const c = checkThroughRoutes(net, idx, [{ type: 'diagonal_diverter', node: x, bearing: o.bearing }]);
      expect(c.total).toBe(2);
      expect(c.routes.every((r) => r.fromStreet !== r.toStreet && r.via.length > 0)).toBe(true);
    }
    expect(checkThroughRoutes(net, idx, [{ type: 'modal_filter', node: x }]).total).toBe(0);
  });

  it('counts corner-cutting between adjacent bounding streets', () => {
    const b = new B();
    const w1 = b.n(0, 0), w0 = b.n(0, -100), n1 = b.n(300, 300), n0 = b.n(200, 300), n2 = b.n(400, 300), corner = b.n(0, 300);
    b.s('West Avenue', 'tertiary', w0, w1); b.s('West Avenue', 'tertiary', w1, corner);
    b.s('North Avenue', 'tertiary', corner, n0); b.s('North Avenue', 'tertiary', n0, n1); b.s('North Avenue', 'tertiary', n1, n2);
    const mid = b.n(150, 150);
    b.s('Slant Street', 'residential', w1, mid); b.s('Slant Street', 'residential', mid, n1);
    const c = run(b.net());
    expect(c.total).toBe(1);
    expect(c.routes[0].description).toBe('West Avenue to North Avenue via Slant Street');
  });

  it('counts a same-street bypass only when the ends are far enough apart', () => {
    const bypass = (gap: number) => {
      const b = new B();
      const a0 = b.n(0, -100), a1 = b.n(0, 0), a2 = b.n(0, gap), a3 = b.n(0, gap + 100);
      b.s('Long Avenue', 'tertiary', a0, a1); b.s('Long Avenue', 'tertiary', a1, a2); b.s('Long Avenue', 'tertiary', a2, a3);
      const m1 = b.n(150, 0), m2 = b.n(150, gap);
      b.s('Loop Street', 'residential', a1, m1); b.s('Loop Street', 'residential', m1, m2); b.s('Loop Street', 'residential', m2, a2);
      return run(b.net());
    };
    expect(bypass(SAME_STREET_MIN_M - 50).total).toBe(0);
    const far = bypass(SAME_STREET_MIN_M + 50);
    expect(far.total).toBe(1);
    expect(far.routes[0].description).toBe('Long Avenue to Long Avenue (a bypass) via Loop Street');
  });

  it('merges near-duplicate routes and keeps distinct ones', () => {
    const mk = (parallel: boolean) => {
      const b = new B();
      const w1 = b.n(0, 0), w2 = b.n(0, 20), e1 = b.n(600, 0);
      b.s('West Avenue', 'tertiary', w1, w2);
      b.s('East Avenue', 'tertiary', e1, b.n(600, 100));
      const j = b.n(100, 10), k = b.n(500, 0);
      b.s('Mid Street', 'residential', w1, j); b.s('Side Street', 'residential', w2, j);
      b.s('Mid Street', 'residential', j, k); b.s('Mid Street', 'residential', k, e1);
      if (parallel) { const p1 = b.n(100, 300), p2 = b.n(500, 300); b.s('Far Street', 'residential', w2, p1); b.s('Far Street', 'residential', p1, p2); b.s('Far Street', 'residential', p2, e1); }
      return run(b.net());
    };
    expect(mk(false).total).toBe(1);
    expect(mk(true).total).toBe(2);
  });

  it('applies turn restrictions from the network and from interventions', () => {
    const { b, net, west, east } = rat();
    const into = (w: [number, number | null], e: [number, number | null]) => ({ from: w[0], to: e[0] });
    const eastbound = into(west, east), westbound = { from: east[1]!, to: west[1]! };
    expect(run({ ...net, turnBans: [eastbound] }).total).toBe(1);
    expect(run({ ...net, turnBans: [eastbound, westbound] }).total).toBe(0);
    // A ban that holds only in some periods leaves the route open at other times.
    expect(run({ ...net, turnBans: [{ ...eastbound, periods: ['am_peak'] }, { ...westbound, periods: ['am_peak'] }] }).total).toBe(1);
    expect(run(net, [{ type: 'turn_ban', fromLink: eastbound.from, toLink: eastbound.to }]).total).toBe(1);
    expect(run(net, [{ type: 'turn_ban', fromLink: eastbound.from, toLink: eastbound.to }, { type: 'turn_ban', fromLink: westbound.from, toLink: westbound.to }]).total).toBe(0);
    expect(b.links.length).toBeGreaterThan(0);
  });

  it('splits cells at a filter', () => {
    const b = new B();
    const w1 = b.n(0, 0), w2 = b.n(0, 100), e1 = b.n(600, 0), e2 = b.n(600, 100), p = b.n(200, 0), q = b.n(400, 0);
    b.s('West Avenue', 'tertiary', w1, w2); b.s('East Avenue', 'tertiary', e1, e2);
    b.s('Mid Street', 'residential', w1, p); const mid = b.s('Mid Street', 'residential', p, q); b.s('Mid Street', 'residential', q, e1);
    const net = b.net();
    expect(run(net).cells).toHaveLength(1);
    const c = run(net, [{ type: 'modal_filter', link: mid[0] }]);
    expect(c.cells).toHaveLength(2);
    expect(c.total).toBe(0);
    for (const cell of c.cells) { expect(cell.links).toHaveLength(2); expect(cell.entries).toHaveLength(1); expect(cell.exits).toHaveLength(1); }
    expect(new Set(c.cells.map((x) => x.id)).size).toBe(2);
  });

  it('memoizes today and words the result', () => {
    const { net } = rat();
    const idx = buildIndex(net);
    expect(throughRoutes(net, [], idx)).toBe(throughRoutes(net, [], idx));
    expect(routeHeadline(3, 3, false)).toBe('3 routes let a car cross the area on side streets today.');
    expect(routeHeadline(1, 1, false)).toBe('1 route lets a car cross the area on side streets today.');
    expect(routeHeadline(2, 5, true)).toBe('2 routes still let a car cross the area on side streets, down from 5 today.');
    expect(routeHeadline(0, 5, true)).toBe('No car can cross the area on side streets, down from 5 today.');
    expect(formatRouteLength(100)).toBe('330 ft');
    expect(formatRouteLength(1000)).toBe('0.62 mi');
  });
});

const REAL = 'public/data/rockridge.network.json';
describe.skipIf(!fs.existsSync(REAL))('real network', () => {
  it('is fast enough to run on every change', () => {
    const net = JSON.parse(fs.readFileSync(REAL, 'utf8')) as Network;
    const idx = buildIndex(net);
    const ivs: Intervention[] = [{ type: 'modal_filter', link: net.links.find((l) => l.inStudyArea && l.class === 'residential')!.id }];
    checkThroughRoutes(net, idx, ivs);
    const t = performance.now();
    for (let i = 0; i < 10; i++) checkThroughRoutes(net, idx, ivs);
    expect((performance.now() - t) / 10).toBeLessThan(50);
    expect(checkThroughRoutes(net, idx, []).total).toBeGreaterThan(0);
  });
});
