import { describe, expect, it } from 'vitest';
import { compass, deriveApproachGroups, expandGroups, inSector, type ApproachGroupsCfg, type GLink, type GNode } from './lib/approach-groups';

// A study node at the origin, gates north, east and south, one freeway exit and one interior outside node near the south gate.
const nodes: GNode[] = [
  { id: 0, x: 0, y: 0, gate: false, inStudyArea: true },
  { id: 1, x: 0, y: 1000, gate: true, inStudyArea: false },
  { id: 2, x: 1000, y: 0, gate: true, inStudyArea: false },
  { id: 3, x: 0, y: -1000, gate: true, inStudyArea: false },
  { id: 4, x: 1000, y: 100, gate: true, inStudyArea: false },
  { id: 5, x: 50, y: -800, gate: false, inStudyArea: false },
  { id: 6, x: -1000, y: 20, gate: true, inStudyArea: false },
];
const links: GLink[] = [
  { from: 1, to: 0, name: 'Main Street', class: 'secondary' }, { from: 0, to: 1, name: 'Main Street', class: 'secondary' },
  { from: 0, to: 2, name: '', class: 'motorway' },
  { from: 4, to: 0, name: '', class: 'motorway' },
  { from: 3, to: 0, name: 'Main Street', class: 'secondary' }, { from: 0, to: 3, name: 'Main Street', class: 'secondary' },
  { from: 5, to: 3, name: 'Elm Street', class: 'residential' },
  { from: 6, to: 0, name: 'Oak Street', class: 'residential' },
];
const cfg: ApproachGroupsCfg = {
  groups: [
    { id: 'fw-out', label: 'Freeway east on-ramps', match: { classes: ['motorway'], role: 'exit' } },
    { id: 'fw-in', label: 'Freeway east off-ramps', match: { classes: ['motorway'], role: 'entry' } },
    { id: 'main-north', label: 'Main Street from the north', match: { names: ['Main Street'], sector: [315, 45] } },
    { id: 'main-south', label: 'Main Street to the south', match: { names: ['Main Street'], sector: [135, 225] } },
    { id: 'west', label: 'West side', match: { sector: [225, 315] } },
  ],
  sets: { freeway: ['fw-out', 'fw-in'] },
};

describe('approach groups', () => {
  it('measures compass bearings and sectors that wrap through north', () => {
    expect(compass(0, 10)).toBeCloseTo(0);
    expect(compass(10, 0)).toBeCloseTo(90);
    expect(compass(0, -10)).toBeCloseTo(180);
    expect(compass(-10, 0)).toBeCloseTo(270);
    expect(inSector(350, [315, 45])).toBe(true);
    expect(inSector(10, [315, 45])).toBe(true);
    expect(inSector(90, [315, 45])).toBe(false);
    expect(inSector(45, [315, 45])).toBe(false);
  });

  it('places each gate by the first matching rule, by name, class, role and sector', () => {
    const g = deriveApproachGroups(nodes, links, cfg);
    const of = (id: number) => g.nodeGroup.get(id);
    expect(of(1)).toBe('main-north');
    expect(of(3)).toBe('main-south');
    expect(of(2)).toBe('fw-out');
    expect(of(4)).toBe('fw-in');
    expect(of(6)).toBe('west');
    expect(g.nodeGroup.has(0)).toBe(false);
  });

  it('gives a node that is not a gate the group of the nearest surface gate, never a freeway gate', () => {
    const g = deriveApproachGroups(nodes, links, cfg);
    expect(g.nodeGroup.get(5)).toBe('main-south');
    const near = deriveApproachGroups([...nodes, { id: 7, x: 990, y: 90, gate: false, inStudyArea: false }], links, cfg);
    expect(near.nodeGroup.get(7)).not.toMatch(/^fw/);
  });

  it('every gate belongs to a group, and an override wins over the rules', () => {
    const missing = { ...cfg, groups: cfg.groups.filter((x) => x.id !== 'west') };
    expect(() => deriveApproachGroups(nodes, links, missing)).toThrow(/no rule matches gate nodes 6/);
    const g = deriveApproachGroups(nodes, links, { ...missing, overrides: { '6': 'main-north' } });
    expect(g.nodeGroup.get(6)).toBe('main-north');
    expect(g.how.get(6)).toBe('override');
    expect(() => deriveApproachGroups(nodes, links, { ...cfg, overrides: { '6': 'nope' } })).toThrow(/unknown group/);
  });

  it('expands sets and the reserved study-area id, and rejects unknown names', () => {
    const g = deriveApproachGroups(nodes, links, cfg);
    expect(expandGroups(g, ['freeway', 'main-north']).sort()).toEqual(['fw-in', 'fw-out', 'main-north']);
    expect(expandGroups(g, 'study-area')).toEqual(['study-area']);
    expect(() => expandGroups(g, 'nope')).toThrow(/unknown group or set/);
    expect(() => deriveApproachGroups(nodes, links, { ...cfg, sets: { x: ['nope'] } })).toThrow(/unknown group/);
  });

  it('the Rockridge config places every gate of the network', async () => {
    const { existsSync, readFileSync } = await import('node:fs');
    if (!existsSync('public/data/rockridge.network.json')) return;
    const net = JSON.parse(readFileSync('public/data/rockridge.network.json', 'utf8'));
    const area = JSON.parse(readFileSync('data/areas/rockridge.json', 'utf8'));
    const g = deriveApproachGroups(net.nodes, net.links, area.approachGroups);
    const gates = net.nodes.filter((n: GNode) => n.gate && !n.inStudyArea);
    expect(g.groups.reduce((s, x) => s + x.gates.length, 0)).toBe(gates.length);
    for (const id of ['sr24-east-on', 'sr24-west-on', 'sr24-off-west', 'sr24-off-east', 'telegraph-north', 'college-north']) expect(g.groups.find((x) => x.id === id)!.gates.length).toBeGreaterThan(0);
  });
});
