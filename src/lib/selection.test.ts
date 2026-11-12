import { describe, expect, it } from 'vitest';
import { buildFixture } from '../fixtures/area';
import { buildIndex } from './naming';
import type { Intervention } from '../types';
import {
  blockActions, compassOf, hitTest, interventionsAt, linkCompass, nodeActions, oneWayLabel, selectionForIntervention, towardName,
  type Selection,
} from './selection';

const net = buildFixture().network;
const idx = buildIndex(net);
const blockSel = (block: number, extra: Partial<Extract<Selection, { kind: 'block' }>> = {}): Extract<Selection, { kind: 'block' }> =>
  ({ kind: 'block', block, point: null, nearLink: null, via: 'map', ...extra });
const nodeSel = (node: number): Extract<Selection, { kind: 'node' }> => ({ kind: 'node', node, via: 'map' });
const twoWay = idx.blocks.findIndex((b) => b.links.length === 2 && b.cls === 'residential');
const signalNode = net.nodes.find((n) => n.control === 'signal')!.id;
const stopNode = idx.intersections.find((n) => net.nodes[n].control === 'two_way_stop')!;

describe('compass labels', () => {
  it('names the four directions with north up', () => {
    expect(compassOf(0, 10)).toBe('North');
    expect(compassOf(10, 1)).toBe('East');
    expect(compassOf(0, -10)).toBe('South');
    expect(compassOf(-10, 2)).toBe('West');
  });
  it('labels each direction of a block with its destination street', () => {
    const [a, b] = idx.blocks[twoWay].links;
    const la = oneWayLabel(net, idx, a), lb = oneWayLabel(net, idx, b);
    expect(la).toMatch(/^(North|East|South|West)bound only, toward .+/);
    expect(la).not.toBe(lb);
    expect(linkCompass(net.links[a])).not.toBe(linkCompass(net.links[b]));
    expect(towardName(net, idx, a)).toBeTruthy();
  });
});

describe('hit testing', () => {
  const nodeIds = new Set(idx.intersections);
  const n = net.nodes[stopNode];
  it('prefers an intersection when both it and a street are in range', () => {
    const hit = hitTest(net, n.x + 3, n.y + 1, { nodeTolM: 12, linkTolM: 8, nodeIds });
    expect(hit).toEqual({ kind: 'node', node: stopNode });
  });
  it('picks the street away from intersections and nothing in empty space', () => {
    const l = net.links[idx.blocks[twoWay].links[0]];
    const mx = (l.geometry[0][0] + l.geometry[1][0]) / 2, my = (l.geometry[0][1] + l.geometry[1][1]) / 2;
    expect(hitTest(net, mx, my, { nodeTolM: 12, linkTolM: 8, nodeIds })?.kind).toBe('link');
    expect(hitTest(net, 9000, 9000, { nodeTolM: 12, linkTolM: 8, nodeIds })).toBeNull();
  });
  it('ignores nodes that are not intersections', () => {
    expect(hitTest(net, n.x, n.y, { nodeTolM: 12, linkTolM: 8, nodeIds: new Set() })?.kind).toBe('link');
  });
});

describe('street block actions', () => {
  const blk = idx.blocks[twoWay];
  it('offers every street action on a bare two-way block', () => {
    const a = blockActions(net, idx, blockSel(twoWay), []);
    expect(a.modalFilter).toBe(true);
    expect(a.hump).toBe('add');
    expect(a.oneWay).toHaveLength(2);
    expect(a.speedLimit.choices).not.toContain(a.speedLimit.currentMph);
  });
  it('puts the direction nearer the click first', () => {
    const a = blockActions(net, idx, blockSel(twoWay, { nearLink: blk.links[1] }), []);
    expect(a.oneWay[0].link).toBe(blk.links[1]);
  });
  it('leaves out what would do nothing', () => {
    const ivs: Intervention[] = [
      { type: 'modal_filter', link: blk.links[0] },
      { type: 'speed_hump', link: blk.links[0], position: net.links[blk.links[0]].length / 2 },
      { type: 'speed_limit', link: blk.links[0], speed: 20 / 2.2369362920544 },
      { type: 'one_way', link: blk.links[0] },
    ];
    const a = blockActions(net, idx, blockSel(twoWay), ivs);
    expect(a.modalFilter).toBe(false);
    expect(a.hump).toBeNull();
    expect(a.speedLimit.currentMph).toBe(20);
    expect(a.speedLimit.choices).toEqual([15, 25]);
    expect(a.oneWay.map((o) => o.link)).toEqual([blk.links[1]]);
    expect(a.oneWay[0].switching).toBe(true);
  });
  it('offers moving a hump that sits elsewhere on the block', () => {
    const ivs: Intervention[] = [{ type: 'speed_hump', link: blk.links[0], position: 10 }];
    expect(blockActions(net, idx, blockSel(twoWay), ivs).hump).toBe('move');
  });
  it('offers no one-way on a block that already has a single direction', () => {
    const oneWayBlock = idx.blocks.findIndex((b) => b.links.length === 1);
    expect(oneWayBlock).toBeGreaterThanOrEqual(0);
    expect(blockActions(net, idx, blockSel(oneWayBlock), []).oneWay).toEqual([]);
  });
});

describe('intersection actions', () => {
  it('offers everything but the current control and the existing circle', () => {
    const a = nodeActions(net, idx, nodeSel(stopNode), []);
    expect(a.control.current).toBe('two_way_stop');
    expect(a.control.choices.map((c) => c.value)).not.toContain('two_way_stop');
    expect(a.control.choices).toHaveLength(3);
    expect(a.cycles).toBeNull();
    expect(a.trafficCircle).toBe(true);
    expect(a.turnBan.length).toBeGreaterThan(0);
    const b = nodeActions(net, idx, nodeSel(stopNode), [{ type: 'traffic_circle', node: stopNode }]);
    expect(b.trafficCircle).toBe(false);
    expect(b.control.current).toBe('traffic_circle');
    expect(b.control.choices).toHaveLength(4);
  });
  it('offers a signal cycle only at signals, or once changed to one', () => {
    expect(nodeActions(net, idx, nodeSel(signalNode), []).cycles).toEqual([60, 90, 120]);
    expect(nodeActions(net, idx, nodeSel(signalNode), [{ type: 'signal_timing', node: signalNode, cycle: 90 }]).cycles).toEqual([60, 120]);
    expect(nodeActions(net, idx, nodeSel(stopNode), [{ type: 'control', node: stopNode, control: 'signal' }]).cycles).toEqual([60, 90, 120]);
    expect(nodeActions(net, idx, nodeSel(signalNode), [{ type: 'control', node: signalNode, control: 'all_way_stop' }]).cycles).toBeNull();
  });
  it('never offers a U-turn or an already banned turn', () => {
    const a = nodeActions(net, idx, nodeSel(stopNode), []);
    for (const f of a.turnBan) for (const t of f.to) expect(net.links[t.link].to).not.toBe(net.links[f.link].from);
    const f0 = a.turnBan[0], t0 = f0.to[0];
    const b = nodeActions(net, idx, nodeSel(stopNode), [{ type: 'turn_ban', fromLink: f0.link, toLink: t0.link }]);
    expect(b.turnBan.find((f) => f.link === f0.link)?.to.map((t) => t.link) ?? []).not.toContain(t0.link);
  });
  it('offers no modal filter where one exists', () => {
    expect(nodeActions(net, idx, nodeSel(stopNode), [{ type: 'modal_filter', node: stopNode }]).modalFilter).toBe(false);
  });
});

describe('interventions on a selection', () => {
  const blk = idx.blocks[twoWay];
  const ivs: Intervention[] = [
    { type: 'modal_filter', link: blk.links[1] },
    { type: 'traffic_circle', node: stopNode },
    { type: 'speed_limit', link: blk.links[0], speed: 8 },
  ];
  it('finds the ones on a block or an intersection', () => {
    expect(interventionsAt(net, idx, blockSel(twoWay), ivs)).toEqual([0, 2]);
    expect(interventionsAt(net, idx, nodeSel(stopNode), ivs)).toEqual([1]);
  });
  it('maps an intervention back to its place', () => {
    expect(selectionForIntervention(net, idx, ivs[0], null, 'list')).toMatchObject({ kind: 'block', block: twoWay });
    expect(selectionForIntervention(net, idx, ivs[1], null, 'list')).toMatchObject({ kind: 'node', node: stopNode });
  });
});
