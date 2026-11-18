import { describe, expect, it } from 'vitest';
import links from '../../crates/sim/tests/fixtures/links.json';
import type { Network } from '../types';
import { buildIndex } from './naming';

// The shared fixture (tools/gen-proposal-link-fixtures.ts) has "Loop Road": a spur, two arcs around a loop and a tail, with no other
// street meeting the loop's two junctions. The Rust twin checks the same labels in crates/sim/tests/explore.rs.
const net = links.network as unknown as Network;

describe('block names at a junction where no other street meets', () => {
  const idx = buildIndex(net);
  const loop = idx.blocks.filter((b) => b.name === 'Loop Road');

  it('never calls a loop or a continuing street a dead end', () => {
    expect(loop).toHaveLength(4);
    for (const b of loop) expect(b.label).not.toMatch(/dead end/);
  });

  it('names each block by the cross streets beyond the loop', () => {
    const want = 'Loop Road between North Edge Ave / West Edge Ave and Birch St / West Edge Ave';
    for (const b of loop) expect(b.label).toBe(want);
  });

  it('still calls a real dead end a dead end', () => {
    const node = (id: number, x: number) => ({ id, osmId: id, x, y: 0, control: 'uncontrolled' as const, gate: false, inStudyArea: true });
    const pair = (id: number, a: number, b: number, name: string) => [a, b].map((from, k) => ({
      id: id + k, osmWayId: id, from: k ? b : a, to: k ? a : b, reverse: id + 1 - k, name, class: 'residential' as const, lanes: 1, speedLimit: 11, length: 50,
      geometry: [[from * 50, 0], [(k ? a : b) * 50, 0]] as [number, number][], stopAtEnd: false, humps: [], inStudyArea: true,
    }));
    const tiny = { ...net, nodes: [node(0, 0), node(1, 50), node(2, 100), node(3, 150)], links: [...pair(0, 0, 1, 'Cross Rd'), ...pair(2, 1, 2, 'Spur Rd'), ...pair(4, 2, 3, 'Spur Rd')] } as unknown as Network;
    const labels = buildIndex(tiny).blocks.filter((b) => b.name === 'Spur Rd').map((b) => b.label).sort();
    expect(labels).toEqual(['Spur Rd between Cross Rd and a dead end', 'Spur Rd between Cross Rd and a dead end']);
  });
});
