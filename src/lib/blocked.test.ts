import { describe, expect, it } from 'vitest';
import type { NetLink, NetNode, Network } from '../types';
import { buildIndex } from './naming';
import { bearingVector, closedLegs, filterChoices, filterLegs, filterSentence, filterText, markOffset, MARK_MIN_PX, MARK_STEP_PX, streetFilters } from './blocked';
import { describeInterventionFull } from './describe';

interface LegSpec { street: string; at: [number, number]; mouth?: [number, number] }

/** A node at the origin with one two-way leg per spec; `mouth` moves where the street begins, as at a merged offset junction. */
function star(legs: LegSpec[]): Network {
  const nodes: NetNode[] = [{ id: 0, osmId: 0, x: 0, y: 0, control: 'uncontrolled', gate: false, inStudyArea: true }];
  const links: NetLink[] = [];
  const mk = (from: number, to: number, g: [number, number][], name: string, reverse: number | null): NetLink => ({
    id: links.length, osmWayId: links.length, from, to, reverse, name, class: 'residential', lanes: 1, speedLimit: 11, length: 100,
    geometry: g, stopAtEnd: false, humps: [], inStudyArea: true,
  });
  legs.forEach((l, i) => {
    nodes.push({ id: i + 1, osmId: i + 1, x: l.at[0], y: l.at[1], control: 'uncontrolled', gate: true, inStudyArea: true });
    const m = l.mouth ?? [0, 0];
    const inbound = mk(i + 1, 0, [l.at, m], l.street, null);
    links.push(inbound);
    const out = mk(0, i + 1, [m, l.at], l.street, inbound.id);
    inbound.reverse = out.id;
    links.push(out);
  });
  return { version: 1, id: 't', name: 't', origin: { lon: -122.25, lat: 37.84 }, bbox: [0, 0, 0, 0], studyArea: [], nodes, links };
}

const cross = (): LegSpec[] => [
  { street: 'Ayala Avenue', at: [0, 100] }, { street: 'Ayala Avenue', at: [0, -100] },
  { street: 'Martin Street', at: [100, 0] }, { street: 'Martin Street', at: [-100, 0] },
];

describe('legs a node filter closes', () => {
  it('lists every leg of a plain four-way by street and compass word, north first', () => {
    const net = star(cross());
    const f = filterLegs(net, buildIndex(net), 0);
    expect(f.legs.map((l) => l.text)).toEqual(['Ayala Avenue (north)', 'Ayala Avenue (south)', 'Martin Street (east)', 'Martin Street (west)']);
    expect(f.merged).toBe(false);
    expect(f.spreadM).toBe(0);
    expect(f.legs.every((l) => l.offsetM === 0)).toBe(true);
  });

  it('lists a three-way', () => {
    const net = star(cross().slice(0, 3));
    const f = filterLegs(net, buildIndex(net), 0);
    expect(f.legs.map((l) => l.text)).toEqual(['Ayala Avenue (north)', 'Ayala Avenue (south)', 'Martin Street (east)']);
    expect(f.merged).toBe(false);
  });

  it('marks a junction whose street mouths sit apart as merged and gives the spread', () => {
    const net = star([
      { street: 'Ayala Avenue', at: [0, 100] }, { street: 'Ayala Avenue', at: [0, -100] },
      { street: 'Martin Street', at: [100, 10], mouth: [0, 10] }, { street: 'Martin Street', at: [-100, -10], mouth: [0, -10] },
    ]);
    const f = filterLegs(net, buildIndex(net), 0);
    expect(f.merged).toBe(true);
    expect(f.spreadM).toBe(20);
    expect(f.legs.find((l) => l.street === 'Martin Street' && l.direction === 'east')?.offsetM).toBeCloseTo(10);
    const t = filterText({ type: 'modal_filter', node: 0 }, net, buildIndex(net))!;
    expect(t.junction).toBe('This junction combines Ayala Avenue and Martin Street, which meet up to about 20 m apart. The filter covers the whole junction and closes all 4 legs to through cars.');
  });

  it('marks a junction of more than two streets as merged, with no spread when every leg starts at the node', () => {
    const net = star([
      { street: 'Ayala Avenue', at: [0, 100] }, { street: '57th Street', at: [80, 40] }, { street: 'Martin Street', at: [100, -30] },
      { street: 'Ayala Avenue', at: [0, -100] }, { street: 'Martin Street', at: [-100, 0] },
    ]);
    const f = filterLegs(net, buildIndex(net), 0);
    expect(f.legs).toHaveLength(5);
    expect(f.merged).toBe(true);
    expect(f.streets).toEqual(['57th Street', 'Ayala Avenue', 'Martin Street']);
    const t = filterText({ type: 'modal_filter', node: 0 }, net, buildIndex(net))!;
    expect(t.junction).toBe('This junction combines 57th Street, Ayala Avenue and Martin Street. The filter covers the whole junction and closes all 5 legs to through cars.');
  });

  it('tells two legs of one street apart when they share a compass word', () => {
    const net = star([
      { street: 'Oak Street', at: [10, 100] }, { street: 'Oak Street', at: [-10, 100] }, { street: 'Elm Street', at: [0, -100] },
    ]);
    const f = filterLegs(net, buildIndex(net), 0);
    expect(new Set(f.legs.map((l) => l.text)).size).toBe(3);
  });
});

describe('filter wording', () => {
  const net = star(cross());
  const idx = buildIndex(net);

  it('names the blocked legs and says once that walking and cycling still pass', () => {
    const s = filterSentence(filterText({ type: 'modal_filter', node: 0 }, net, idx)!);
    expect(s).toBe('Cars cannot pass through this intersection. Closed to through cars: Ayala Avenue (north), Ayala Avenue (south), Martin Street (east), Martin Street (west). People walking and cycling still pass.');
    expect(s.match(/walking and cycling/g)).toHaveLength(1);
  });

  it('adds the same sentence to the full label of a node filter', () => {
    const d = describeInterventionFull({ type: 'modal_filter', node: 0 }, net, idx);
    expect(d.startsWith('Modal filter at Ayala Avenue & Martin Street: cars cannot pass through this intersection. Closed to through cars: Ayala Avenue (north)')).toBe(true);
  });

  it('describes a block filter by the block, in both directions', () => {
    const t = filterText({ type: 'modal_filter', link: 0 }, net, idx)!;
    expect(t.closed).toBe(`Closed to through cars: ${idx.blocks[idx.blockOfLink[0]].label}, in both directions.`);
    expect(t.junction).toBeNull();
  });

  it('has nothing to add for other interventions', () => {
    expect(filterText({ type: 'speed_hump', link: 0 }, net, idx)).toBeNull();
    expect(describeInterventionFull({ type: 'speed_hump', link: 0, position: 10 }, net, idx)).toBe('Speed hump on ' + idx.blocks[idx.blockOfLink[0]].label);
  });
});

describe('mark placement', () => {
  it('points the unit vector the way a compass bearing leaves the node on screen', () => {
    const close = (v: [number, number], x: number, y: number) => { expect(v[0]).toBeCloseTo(x); expect(v[1]).toBeCloseTo(y); };
    close(bearingVector(0), 0, -1);
    close(bearingVector(90), 1, 0);
    close(bearingVector(180), 0, 1);
  });

  it('pushes a mark out to the minimum distance when the mouth is at the node', () => {
    const [x, y] = markOffset([0, 0], [0, -1]);
    expect(x).toBeCloseTo(0);
    expect(Math.hypot(x, y)).toBeCloseTo(MARK_MIN_PX);
  });

  it('keeps a mouth that is already far out and steps past it', () => {
    const [x, y] = markOffset([0, -100], [0, -1]);
    expect(x).toBeCloseTo(0);
    expect(y).toBeCloseTo(-100 - MARK_STEP_PX);
  });

  it('keeps a displaced mouth on its own street', () => {
    const [x, y] = markOffset([10, 0], [0, -1]);
    expect(x).toBeCloseTo(10);
    expect(y).toBeLessThan(0);
  });
});

describe('a filter on part of a junction', () => {
  const merged = () => star([
    { street: 'Ayala Avenue', at: [0, 100] }, { street: 'Ayala Avenue', at: [0, -100] },
    { street: 'Martin Street', at: [100, 10], mouth: [0, 10] }, { street: 'Martin Street', at: [-100, -10], mouth: [0, -10] },
  ]);

  it('closes only the legs it names and says so', () => {
    const net = merged(), idx = buildIndex(net);
    const f = filterLegs(net, idx, 0);
    const martin = streetFilters(f).find((s) => s.street === 'Martin Street')!;
    expect(closedLegs(f, martin.links).map((l) => l.text)).toEqual(['Martin Street (east)', 'Martin Street (west)']);
    const iv = { type: 'modal_filter', node: 0, legs: martin.links };
    const t = filterText(iv, net, idx)!;
    expect(t.lead).toBe('Cars cannot enter or leave this intersection on Martin Street.');
    expect(t.closed).toBe('Closed to through cars: Martin Street (east), Martin Street (west).');
    expect(t.junction).toBe('This junction combines Ayala Avenue and Martin Street, which meet up to about 20 m apart. The filter closes only the legs of Martin Street; Ayala Avenue stays open through the junction.');
    expect(describeInterventionFull({ ...iv, type: 'modal_filter' }, net, idx)).toMatch(/^Modal filter on Martin Street at /);
  });

  it('without legs closes every leg as before', () => {
    const net = merged(), idx = buildIndex(net);
    const f = filterLegs(net, idx, 0);
    expect(closedLegs(f, undefined)).toHaveLength(4);
    expect(filterText({ type: 'modal_filter', node: 0 }, net, idx)!.junction).toMatch(/covers the whole junction and closes all 4 legs/);
  });

  it('offers a street only when two other legs stay connected', () => {
    const net4 = star(cross()), net3 = star(cross().slice(0, 3));
    expect(streetFilters(filterLegs(net4, buildIndex(net4), 0)).map((s) => s.street)).toEqual(['Ayala Avenue', 'Martin Street']);
    expect(streetFilters(filterLegs(net3, buildIndex(net3), 0)).map((s) => s.street)).toEqual(['Martin Street']);
    const one = star(cross().slice(0, 2));
    expect(streetFilters(filterLegs(one, buildIndex(one), 0))).toEqual([]);
  });

  it('puts per-street options first and explains why at a consolidated junction, and the whole junction first at a plain one', () => {
    const net = merged(), idx = buildIndex(net);
    const c = filterChoices(net, idx, 0, []);
    expect(c.merged && c.whole).toBe(true);
    expect(c.streets.map((s) => s.label)).toEqual(['Filter Ayala Avenue here', 'Filter Martin Street here']);
    expect(c.why).toMatch(/^This junction combines Ayala Avenue and Martin Street/);
    expect(c.streets[1].closed).toBe('Closed to through cars: Martin Street (east), Martin Street (west).');
    const plain = star(cross());
    expect(filterChoices(plain, buildIndex(plain), 0, []).why).toBeNull();
  });

  it('leaves out what is already placed', () => {
    const net = merged(), idx = buildIndex(net);
    const martin = streetFilters(filterLegs(net, idx, 0)).find((s) => s.street === 'Martin Street')!;
    const c = filterChoices(net, idx, 0, [{ type: 'modal_filter', node: 0, legs: martin.links }]);
    expect(c.streets.map((s) => s.street)).toEqual(['Ayala Avenue']);
    expect(c.whole).toBe(true);
    const w = filterChoices(net, idx, 0, [{ type: 'modal_filter', node: 0 }]);
    expect(w).toMatchObject({ whole: false, streets: [] });
  });
});
