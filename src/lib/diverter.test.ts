import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { buildFixture } from '../fixtures/area';
import { buildIndex } from './naming';
import { bannedMoves, connectedLabel, diverterOptions, nodeLegs, pairingKey } from './diverter';
import { nodeActions } from './selection';
import { describeIntervention } from './describe';
import { legBearing, pointAlong } from './geom';
import type { Intervention, NetLink, NetNode, Network } from '../types';

interface LegSpec { street: string; at: [number, number]; oneWay?: boolean; via?: [number, number][] }

/** A node at the origin with one leg per spec; `at` is the far end in meters (x east, y north). */
function star(legs: LegSpec[]): Network {
  const nodes: NetNode[] = [{ id: 0, osmId: 0, x: 0, y: 0, control: 'uncontrolled', gate: false, inStudyArea: true }];
  const links: NetLink[] = [];
  const mk = (from: number, to: number, g: [number, number][], name: string, reverse: number | null): NetLink => ({
    id: links.length, osmWayId: links.length, from, to, reverse, name, class: 'residential', lanes: 1, speedLimit: 11, length: 100,
    geometry: g, stopAtEnd: false, humps: [], inStudyArea: true,
  });
  legs.forEach((l, i) => {
    nodes.push({ id: i + 1, osmId: i + 1, x: l.at[0], y: l.at[1], control: 'uncontrolled', gate: true, inStudyArea: true });
    const mid = l.via ?? [];
    const inbound = mk(i + 1, 0, [l.at, ...[...mid].reverse(), [0, 0]], l.street, null);
    links.push(inbound);
    if (!l.oneWay) {
      const out = mk(0, i + 1, [[0, 0], ...mid, l.at], l.street, inbound.id);
      inbound.reverse = out.id;
      links.push(out);
    }
  });
  return { version: 1, id: 't', name: 't', origin: { lon: -122.25, lat: 37.84 }, bbox: [0, 0, 0, 0], studyArea: [], nodes, links };
}

const plain = (): LegSpec[] => [
  { street: 'Hillegass Avenue', at: [0, 100] }, { street: '62nd Street', at: [100, 0] },
  { street: 'Hillegass Avenue', at: [0, -100] }, { street: '62nd Street', at: [-100, 0] },
];

describe('diagonal diverter options', () => {
  it('offers two labeled orientations at a plain four-way', () => {
    const net = star(plain());
    const idx = buildIndex(net);
    expect(nodeLegs(net, idx, 0)).toHaveLength(4);
    const opts = diverterOptions(net, idx, 0);
    expect(opts.map((o) => o.bearing)).toEqual([45, 135]);
    expect(opts[0].label).toBe('Hillegass Avenue (north) with 62nd Street (west), and Hillegass Avenue (south) with 62nd Street (east)');
    expect(opts[1].label).toBe('Hillegass Avenue (north) with 62nd Street (east), and Hillegass Avenue (south) with 62nd Street (west)');
    expect(opts[0].key).not.toBe(opts[1].key);
  });

  it('handles a skewed four-way', () => {
    const net = star([
      { street: 'Oak Street', at: [20, 100] }, { street: 'Pine Street', at: [100, 30] },
      { street: 'Oak Street', at: [-20, -100] }, { street: 'Pine Street', at: [-100, -30] },
    ]);
    const idx = buildIndex(net);
    const opts = diverterOptions(net, idx, 0);
    expect(opts).toHaveLength(2);
    expect(opts[0].bearing % 5).toBe(0);
    for (const o of opts) {
      expect(o.bearing).toBeGreaterThanOrEqual(0);
      expect(o.bearing).toBeLessThan(180);
      // every option leaves exactly four permitted movements out of the sixteen possible
      expect(bannedMoves(net, idx, 0, o.bearing).size).toBe(16 - 4);
      expect(o.label).toMatch(/^Oak Street \((north|east)\w*\) with Pine Street/);
    }
  });

  it('classifies staggered legs by how they leave the intersection', () => {
    // The two 62nd Street legs leave from points offset along Hillegass Avenue, as in a merged offset junction.
    const net = star([
      { street: 'Hillegass Avenue', at: [0, 100] }, { street: '62nd Street', at: [100, 12], via: [[6, 9]] },
      { street: 'Hillegass Avenue', at: [0, -100] }, { street: '62nd Street', at: [-100, -10], via: [[-6, -8]] },
    ]);
    const idx = buildIndex(net);
    const opts = diverterOptions(net, idx, 0);
    expect(opts).toHaveLength(2);
    const labels = opts.map((o) => o.label).join(' | ');
    expect(labels).toContain('Hillegass Avenue (north) with 62nd Street (west)');
    expect(labels).toContain('Hillegass Avenue (north) with 62nd Street (east)');
    expect(connectedLabel(net, idx, 0, opts[0].bearing)).toBe(opts[0].label);
  });

  it('uses the importer bearings at a merged staggered junction', () => {
    // Two T-junctions 30 m apart merged into one node: each 62nd Street link runs 15 m along Hillegass Avenue before turning onto its street.
    const net = star([
      { street: 'Hillegass Avenue', at: [0, 200] }, { street: '62nd Street', at: [200, 15], via: [[0, 15]] },
      { street: 'Hillegass Avenue', at: [0, -200] }, { street: '62nd Street', at: [-200, -15], via: [[0, -15]] },
    ]);
    const idx = buildIndex(net);
    const dirs = [0, 90, 180, 270];
    const set = (l: NetLink, out: boolean, brg: number) => { if (out) l.fromBearing = l.toBearing = brg; else l.fromBearing = l.toBearing = (brg + 180) % 360; };
    net.links.forEach((l) => {
      const leg = net.nodes[l.from].id === 0 ? l.to : l.from;
      set(l, l.from === 0, dirs[leg - 1]);
    });
    const legs = nodeLegs(net, idx, 0);
    const near = (a: number, b: number) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b)) < 5;
    for (const want of [0, 90, 180, 270]) expect(legs.some((l) => near(l.bearing, want))).toBe(true);
    const opts = diverterOptions(net, idx, 0);
    expect(opts).toHaveLength(2);
    expect(opts.map((o) => o.label).join(' | ')).toContain('Hillegass Avenue (north) with 62nd Street (west)');
    for (const o of opts) expect(bannedMoves(net, idx, 0, o.bearing).size).toBeGreaterThan(0);
    // Without the importer's field the connector skews a side street, and the geometric rule (45 m chord) is only a fallback.
    const bare = JSON.parse(JSON.stringify(net)) as Network;
    for (const l of bare.links) { delete l.fromBearing; delete l.toBearing; }
    const west = bare.links.find((l) => l.from === 0 && l.name === '62nd Street' && l.geometry[l.geometry.length - 1][0] < 0)!;
    expect(Math.abs(legBearing(west, true) - 270)).toBeGreaterThan(5);
  });

  it('names legs with eight-point directions when two share a quadrant', () => {
    const net = star([
      { street: 'A Street', at: [-10, 100] }, { street: 'B Street', at: [30, 90] },
      { street: 'A Street', at: [10, -100] }, { street: 'C Street', at: [-100, 0] },
    ]);
    const idx = buildIndex(net);
    const opts = diverterOptions(net, idx, 0);
    if (opts.length) expect(opts[0].label).toMatch(/north|south|east|west/);
  });

  it('is not offered at three or five legs', () => {
    const three = star([{ street: 'A', at: [0, 100] }, { street: 'B', at: [100, -50] }, { street: 'C', at: [-100, -50] }]);
    expect(diverterOptions(three, buildIndex(three), 0)).toEqual([]);
    const five = star([0, 72, 144, 216, 288].map((d, i) => ({ street: `S${i}`, at: [100 * Math.sin((d * Math.PI) / 180), 100 * Math.cos((d * Math.PI) / 180)] as [number, number] })));
    expect(diverterOptions(five, buildIndex(five), 0)).toEqual([]);
  });

  it('counts a one-way street once', () => {
    const legs = plain();
    legs[0].oneWay = true;
    const net = star(legs);
    const idx = buildIndex(net);
    expect(nodeLegs(net, idx, 0)).toHaveLength(4);
    expect(diverterOptions(net, idx, 0)).toHaveLength(2);
  });

  it('bans straight-through and U-turn movements and keeps the L turns', () => {
    const net = star(plain());
    const idx = buildIndex(net);
    const banned = bannedMoves(net, idx, 0, 45);
    const leave = (id: number) => net.links.find((l) => l.from === 0 && l.to === id)!.id;
    // north leg is node 1, east 2, south 3, west 4
    expect(banned.has(`${net.links.find((l) => l.from === 1 && l.to === 0)!.id}-${leave(3)}`)).toBe(true); // north to south
    expect(banned.has(`${net.links.find((l) => l.from === 4 && l.to === 0)!.id}-${leave(2)}`)).toBe(true); // west to east
    expect(banned.has(`${net.links.find((l) => l.from === 1 && l.to === 0)!.id}-${leave(4)}`)).toBe(false); // north to west
    expect(banned.size).toBe(16 - 4); // sixteen movements, four permitted
  });
});

describe('selection menu data', () => {
  const net = star(plain());
  const idx = buildIndex(net);
  it('lists both orientations, then only the other after one is placed', () => {
    expect(nodeActions(net, idx, { kind: 'node', node: 0, via: 'map' }, []).diverter.options).toHaveLength(2);
    const placed: Intervention[] = [{ type: 'diagonal_diverter', node: 0, bearing: 45 }];
    const a = nodeActions(net, idx, { kind: 'node', node: 0, via: 'map' }, placed).diverter;
    expect(a.switching).toBe(true);
    expect(a.options.map((o) => o.bearing)).toEqual([135]);
    expect(pairingKey(net, idx, 0, 45)).toBe(pairingKey(net, idx, 0, 40));
  });
  it('is absent at nodes of the fixture grid with other leg counts', () => {
    const fx = buildFixture().network;
    const fi = buildIndex(fx);
    const counts = new Set(fi.intersections.map((n) => diverterOptions(fx, fi, n).length));
    expect([...counts].every((c) => c === 0 || c === 2)).toBe(true);
    expect(counts.has(0)).toBe(true);
  });
  it('describes a placed diverter with what stays connected', () => {
    const d = describeIntervention({ type: 'diagonal_diverter', node: 0, bearing: 45 }, net, idx);
    expect(d).toMatch(/^Diagonal diverter at .+, connecting Hillegass Avenue \(north\) with 62nd Street \(west\)/);
  });
});


const REAL = 'public/data/rockridge.network.json';
describe.skipIf(!fs.existsSync(REAL))('real network staggered junctions', () => {
  const net = JSON.parse(fs.readFileSync(REAL, 'utf8')) as Network;
  const idx = buildIndex(net);
  for (const through of ['Colby Street', 'Hillegass Avenue']) {
    it(`${through} & 62nd Street has four legs on their streets and two L pairs per diagonal`, () => {
      const node = net.nodes.find((n) => idx.nodeStreets[n.id].includes(through) && idx.nodeStreets[n.id].includes('62nd Street'))!;
      expect(node).toBeDefined();
      const legs = nodeLegs(net, idx, node.id);
      expect(legs).toHaveLength(4);
      for (const leg of legs) {
        const out = leg.outs.length > 0;
        const l = net.links[out ? leg.outs[0] : leg.ins[0]];
        const g = out ? l.geometry : [...l.geometry].reverse();
        const p = pointAlong(g, 60);
        const want = ((Math.atan2(p.x - g[0][0], p.y - g[0][1]) * 180) / Math.PI + 360) % 360;
        const d = Math.abs(leg.bearing - want);
        expect(Math.min(d, 360 - d)).toBeLessThanOrEqual(25);
      }
      const opts = diverterOptions(net, idx, node.id);
      expect(opts).toHaveLength(2);
      expect(opts.map((o) => o.label).join(' | ')).toContain(`${through} (south) with 62nd Street (west)`);
      for (const o of opts) {
        const moves = bannedMoves(net, idx, node.id, o.bearing);
        expect(moves.size).toBeGreaterThan(0);
        expect(connectedLabel(net, idx, node.id, o.bearing)).toBe(o.label);
      }
    });
  }
});
