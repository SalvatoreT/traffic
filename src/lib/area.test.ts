import { describe, expect, it } from 'vitest';
import { buildFixture } from '../fixtures/area';
import { buildIndex } from './naming';
import { computeFocus, interventionInStudyArea, FOCUS_BUFFER_M } from './area';
import { blockVisible, placeResults } from './picker';
import { aggregateProgress } from '../data';
import { nextSpeedShown, speedNoteText } from './speed';
import type { Network } from '../types';

/** Fixture grid is 600 m wide; the study area is its inner 4x4 intersections plus a margin. */
const net: Network = buildFixture().network;

describe('focus area', () => {
  const focus = computeFocus(net);
  it('keeps every study-area link and node', () => {
    net.links.forEach((l) => { if (l.inStudyArea) expect(focus.link[l.id]).toBe(true); });
    net.nodes.forEach((n) => { if (n.inStudyArea) expect(focus.node[n.id]).toBe(true); });
  });
  it('adds streets within the buffer and drops those beyond it', () => {
    expect(computeFocus(net, 1).link.filter(Boolean).length).toBeLessThan(focus.link.filter(Boolean).length + 1);
    // Move the outline far from the network: nothing but flagged study-area links remains.
    const far: Network = { ...net, studyArea: net.studyArea.map(([lon, lat]) => [lon + 1, lat] as [number, number]) };
    const f = computeFocus(far);
    far.links.forEach((l) => expect(f.link[l.id]).toBe(l.inStudyArea));
  });
  it('measures the buffer from the outline', () => {
    // A node 100 m outside the outline is in focus at 150 m, out at 50 m.
    const out = net.nodes.find((n) => !n.inStudyArea)!;
    const moved: Network = { ...net, nodes: net.nodes.map((n) => (n.id === out.id ? { ...n, x: 1000, y: 1000 } : n)) };
    expect(FOCUS_BUFFER_M).toBe(150);
    expect(computeFocus(moved).node[out.id]).toBe(false);
  });
  it('falls back to the study-area flags when there is no outline', () => {
    const f = computeFocus({ ...net, studyArea: [] });
    net.nodes.forEach((n) => expect(f.node[n.id]).toBe(n.inStudyArea));
  });
});

describe('picker scope', () => {
  // Make some blocks clearly outside: shrink the flags so the outline excludes them.
  const small: Network = {
    ...net,
    studyArea: net.studyArea.map(([lon, lat]) => {
      const c = net.origin;
      return [c.lon + (lon - c.lon) * 0.4, c.lat + (lat - c.lat) * 0.4] as [number, number];
    }),
    nodes: net.nodes.map((n) => ({ ...n, inStudyArea: Math.abs(n.x) < 80 && Math.abs(n.y) < 80 })),
    links: net.links.map((l) => ({ ...l, inStudyArea: Math.abs(l.geometry[0][0]) < 80 && Math.abs(l.geometry[0][1]) < 80 && Math.abs(l.geometry[1][0]) < 80 && Math.abs(l.geometry[1][1]) < 80 })),
  };
  const idx = buildIndex(small);
  const base = { showService: true, showOutside: false };
  it('lists fewer blocks by default than with outside streets included', () => {
    const inside = placeResults(small, idx, base).blocks;
    const all = placeResults(small, idx, { ...base, showOutside: true }).blocks;
    expect(inside.length).toBeGreaterThan(0);
    expect(inside.length).toBeLessThan(all.length);
    expect(all.length).toBe(idx.blocks.length);
    idx.blocks.forEach((b, i) => { if (b.inStudyArea) expect(inside.some((r) => r.id === i)).toBe(true); });
  });
  it('filters intersections the same way', () => {
    expect(placeResults(small, idx, base).nodes.length).toBeLessThan(placeResults(small, idx, { ...base, showOutside: true }).nodes.length);
  });
  it('puts study-area items first', () => {
    for (const items of Object.values(placeResults(small, idx, { ...base, showOutside: true }))) {
      const firstOut = items.findIndex((i) => !i.study);
      if (firstOut >= 0) expect(items.slice(firstOut).every((i) => !i.study)).toBe(true);
    }
  });
  it('hides service roads unless asked, even in the focus area', () => {
    const svc = { ...idx.blocks[0], cls: 'service' as const, inFocus: true };
    expect(blockVisible(svc, { showService: false, showOutside: false })).toBe(false);
    expect(blockVisible(svc, { showService: true, showOutside: false })).toBe(true);
    expect(blockVisible(svc, { showService: false, showOutside: false }, 'service')).toBe(true);
    expect(blockVisible({ ...svc, cls: 'residential', inFocus: false }, { showService: true, showOutside: false })).toBe(false);
  });
});

describe('interventionInStudyArea', () => {
  it('uses the study-area flags of the targeted link or node', () => {
    const inLink = net.links.find((l) => l.inStudyArea)!, outLink = net.links.find((l) => !l.inStudyArea)!;
    expect(interventionInStudyArea({ type: 'speed_hump', link: inLink.id, position: 5 }, net)).toBe(true);
    expect(interventionInStudyArea({ type: 'speed_hump', link: outLink.id, position: 5 }, net)).toBe(false);
    const inNode = net.nodes.find((n) => n.inStudyArea)!, outNode = net.nodes.find((n) => !n.inStudyArea)!;
    expect(interventionInStudyArea({ type: 'traffic_circle', node: inNode.id }, net)).toBe(true);
    expect(interventionInStudyArea({ type: 'modal_filter', node: outNode.id }, net)).toBe(false);
    expect(interventionInStudyArea({ type: 'turn_ban', fromLink: outLink.id, toLink: inLink.id }, net)).toBe(net.nodes[outLink.to].inStudyArea);
  });
});

describe('load progress', () => {
  it('reports a total only when every file has a length', () => {
    expect(aggregateProgress([{ loaded: 5, total: 10 }, { loaded: 1, total: null }])).toEqual({ loaded: 6, total: null });
    expect(aggregateProgress([{ loaded: 5, total: 10 }, { loaded: 1, total: 20 }])).toEqual({ loaded: 6, total: 30 });
    expect(aggregateProgress([])).toEqual({ loaded: 0, total: null });
  });
});

describe('achieved speed note', () => {
  it('stays quiet near the requested speed and appears when well below it', () => {
    expect(nextSpeedShown(null, 60, 58)).toBeNull();
    expect(nextSpeedShown(null, 60, 54)).toBeNull(); // 90%: inside the quiet band
    expect(nextSpeedShown(null, 60, 38.4)).toBe(38);
    expect(speedNoteText(60, 38)).toBe('60× requested, running about 38×');
    expect(speedNoteText(60, null)).toBe('');
  });
  it('changes only on material differences and clears when speed recovers', () => {
    expect(nextSpeedShown(38, 60, 37)).toBe(38);
    expect(nextSpeedShown(38, 60, 30)).toBe(30);
    expect(nextSpeedShown(38, 60, null)).toBe(38);
    expect(nextSpeedShown(38, 60, 57)).toBeNull();
  });
});
