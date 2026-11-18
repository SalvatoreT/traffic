import { describe, expect, it } from 'vitest';
import { buildFixture } from '../fixtures/area';
import { buildIndex } from './naming';
import { allCarFacts, blockChanges, blockIntensity, buildPicture, mismatchNote, periodNote, pictureAlt, pictureCaption, pictureFacts, wholeChange } from './picture';
import { parseProposals, type Proposal, type ProposalPicture } from './proposals';
import { buildMockProposals } from '../fixtures/proposals';
import { colorForIntensity } from './ramps';

const net = buildFixture().network;
const index = buildIndex(net);
const inside = net.links.filter((l) => l.inStudyArea);
const blockOf = (id: number) => index.blockOfLink[id];
const mock = buildMockProposals(net, { networkHash: 'a'.repeat(64), demandHash: 'b'.repeat(64), calibration: 'uncalibrated' }).groups[0].proposals[0];

/** Two blocks: the first loses 60 through cars (30 on each direction), the second gains 24. */
function makePic(): { pic: ProposalPicture; loss: number; gain: number } {
  const a = inside[0], b = inside.find((l) => blockOf(l.id) !== blockOf(a.id))!;
  const aLinks = index.blocks[blockOf(a.id)].links, bLinks = index.blocks[blockOf(b.id)].links;
  const links = [...aLinks, bLinks[0]];
  const base = [...aLinks.map(() => 40), 5];
  const scen = [...aLinks.map(() => 10), 29];
  return { pic: { period: 'pm_peak', links, base, scen }, loss: blockOf(a.id), gain: blockOf(b.id) };
}
const withPic = (pic: ProposalPicture, worst: string, inc: number, above = 1): Proposal => ({
  ...mock, picture: pic,
  harm: { through: { largestIncrease: { block: worst, baselineVehPerHour: 10, scenarioVehPerHour: 10 + inc, increaseVehPerHour: inc }, adjustedPenalty: { block: above > 0 ? worst : null, penaltyVehPerHour: 0 }, blocksAboveBand: above } },
});

describe('picture numbers', () => {
  it('sums both directions of a block and uses the map\'s scale and dead band', () => {
    const { pic, loss, gain } = makePic();
    const ch = blockChanges(pic, index);
    const l = ch.find((c) => c.block === loss)!, g = ch.find((c) => c.block === gain)!;
    expect(l.delta).toBe(-30 * index.blocks[loss].links.length);
    expect(g.delta).toBe(24);
    expect(blockIntensity(g.delta)).toBeGreaterThan(0);
    expect(blockIntensity(3)).toBe(0);
    expect(blockIntensity(-500)).toBe(-1);
    expect(colorForIntensity(blockIntensity(g.delta), 'light', true)).toMatch(/^#/);
  });
  it('finds the biggest drop and gain, and the block the card names', () => {
    const { pic, loss, gain } = makePic();
    const f = pictureFacts(withPic(pic, index.blocks[gain].label, 20), pic, index);
    expect(f.drop?.block).toBe(loss);
    expect(f.gain?.block).toBe(gain);
    expect(f.named?.block).toBe(gain);
    expect(pictureFacts(withPic(pic, '', 0, 0), pic, index).named).toBeNull();
  });
});

describe('picture words', () => {
  it('says whether the named block is the largest increase or the one the search flagged', () => {
    const { pic, gain } = makePic();
    const big = withPic(pic, index.blocks[gain].label, 20);
    expect(pictureFacts(big, pic, index)).toMatchObject({ namedKind: 'largest' });
    const flagged: Proposal = { ...big, harm: { through: { adjustedPenalty: { block: index.blocks[gain].label, penaltyVehPerHour: null, increaseVehPerHour: 20 }, blocksAboveBand: 1 } } };
    const f = pictureFacts(flagged, pic, index);
    expect(f.namedKind).toBe('flagged');
    expect(f.named?.block).toBe(gain);
    const none: Proposal = { ...big, harm: { through: { adjustedPenalty: { block: null, penaltyVehPerHour: null, increaseVehPerHour: 0 }, blocksAboveBand: 0 } } };
    expect(pictureFacts(none, pic, index).named).toBeNull();
  });
  it('says the period once, only when the figures average more than one', () => {
    expect(periodNote(['PM peak'], 'PM peak')).toBe('');
    expect(periodNote(['AM peak', 'PM peak', 'Midday'], 'PM peak')).toBe('The figures on this card average AM peak, PM peak and Midday. This map shows the PM peak only.');
    expect(pictureCaption('PM peak')).toBe('PM peak, change in through cars an hour on each block, proposal vs. today');
  });
  it('names the biggest drop and gain in the alt text, with the card\'s total for that period', () => {
    const { pic, loss, gain } = makePic();
    const p = withPic(pic, index.blocks[gain].label, 20);
    const alt = pictureAlt({ ...p, byPeriod: { pm_peak: { ...mock.byPeriod[Object.keys(mock.byPeriod)[0]], cutThrough: { baselineVehPerHour: 120, scenarioVehPerHour: 80, changePct: -33.3 } } } }, pic, pictureFacts(p, pic, index), 'PM peak');
    expect(alt).toContain('from 120 to 80 an hour (−40 cars an hour)');
    expect(alt).toContain(`biggest drop is on ${index.blocks[loss].label}`);
    expect(alt).toContain(`biggest gain is on ${index.blocks[gain].label}: +24`);
  });
  it('leaves the card\'s average out of the picture\'s alt text when its period has no result', () => {
    const { pic, gain } = makePic();
    const p = withPic(pic, index.blocks[gain].label, 20);
    const alt = pictureAlt({ ...p, byPeriod: {} }, pic, pictureFacts(p, pic, index), 'PM peak');
    expect(alt).not.toContain('In the area');
    expect(alt).toContain('biggest drop');
  });
  it('is quiet when the picture agrees with the card, and plain when it does not', () => {
    const { pic, loss, gain } = makePic();
    const agree = pictureFacts(withPic(pic, index.blocks[gain].label, 20), pic, index);
    expect(mismatchNote(agree, 'PM peak')).toBe('');
    const other = pictureFacts(withPic(pic, index.blocks[loss].label, 20), pic, index);
    const note = mismatchNote(other, 'PM peak');
    expect(note).toContain('does not gain through cars in the PM peak');
    expect(note).toContain(`biggest gain is on ${index.blocks[gain].label}, +24 cars an hour`);
    expect(mismatchNote(pictureFacts(withPic(pic, '', 0, 0), pic, index), 'PM peak')).toBe('');
  });
});

describe('all-car picture', () => {
  it('colors a block by all cars, on the flow scale, so a through-car fall can still be a rise', () => {
    expect(blockIntensity(30, 'through')).toBeGreaterThan(0);
    expect(blockIntensity(30, 'all')).toBe(0);
    expect(blockIntensity(246, 'all')).toBeGreaterThan(0);
    expect(blockIntensity(-246, 'all')).toBeLessThan(0);
  });
  it('writes the change from rounded figures, the way the detail box does', () => {
    expect(wholeChange({ base: 37.6, scen: 283.5 })).toBe(246);
    expect(wholeChange({ base: 0.4, scen: 0.6 })).toBe(1);
  });
  it('ranks the largest gain and drop in all cars and names no card block', () => {
    const { pic, loss, gain } = makePic();
    const f = allCarFacts(pic, index);
    expect(f.named).toBeNull();
    expect(f.gain?.block).toBe(gain);
    expect(f.drop?.block).toBe(loss);
  });
  it('pins the gain and the drop with the rounded all-car change, and says what the colors mean', () => {
    const { pic, gain } = makePic();
    const p = withPic(pic, index.blocks[gain].label, 20);
    const f = allCarFacts(pic, index);
    const m = buildPicture(net, index, p, pic, [], f, 'all');
    expect(m.pins.map((x) => x.text)).toEqual(['+24', `−${30 * index.blocks[blockChanges(pic, index).find((c) => c.delta < 0)!.block].links.length}`]);
    const alt = pictureAlt(p, pic, f, 'PM peak', 'all');
    expect(alt).toMatch(/change in all cars an hour on each block/);
    expect(alt).toMatch(/mean of the runs/);
  });
});

describe('picture drawing model', () => {
  it('draws a bar on each closed leg and a line for each changed block, strongest on top', () => {
    const { pic, gain } = makePic();
    const node = net.nodes.find((n) => n.inStudyArea && !n.gate)!;
    const p = withPic(pic, index.blocks[gain].label, 20);
    const f = pictureFacts(p, pic, index);
    const m = buildPicture(net, index, p, pic, [{ type: 'modal_filter', node: node.id }, { type: 'one_way', link: inside[0].id }], f);
    expect(m.marks.filter((k) => k.kind === 'bar').length).toBeGreaterThanOrEqual(2);
    expect(m.marks.some((k) => k.kind === 'arrow')).toBe(true);
    expect(m.blocks.length).toBe(2);
    expect(Math.abs(m.blocks[0].t)).toBeLessThanOrEqual(Math.abs(m.blocks[1].t));
    expect(m.pins.length).toBe(1);
    expect(m.view.w).toBeGreaterThan(0);
    expect(m.minor + m.major).toMatch(/^M/);
  });
});

describe('older files', () => {
  it('keeps a valid picture, drops a malformed one, and tolerates none', () => {
    const { pic } = makePic();
    const mk = (picture: unknown) => ({ ...mock, ...(picture === undefined ? {} : { picture }) });
    const file = (p: unknown) => parseProposals(JSON.stringify({ version: 4, area: 'x', groups: [{ id: 'g', title: 'g', note: '', computed: { date: '2026-01-01', periods: Object.keys(mock.byPeriod), seeds: [1], networkHash: 'a', demandHash: 'b', calibration: 'uncalibrated' }, baseline: { cutThroughVehPerHour: {} }, proposals: [p] }] }))!.groups[0].proposals[0];
    expect(file(mk(pic)).picture).toEqual(pic);
    expect(file(mk({ ...pic, base: [1] })).picture).toBeUndefined();
    expect(file(mk('nope')).picture).toBeUndefined();
    expect(file(mk(undefined)).picture).toBeUndefined();
  });
  it('keeps a valid all-cars picture, drops a malformed one without touching the through-car picture, and tolerates none', () => {
    const { pic } = makePic();
    const mk = (pictureAll: unknown) => ({ ...mock, picture: pic, ...(pictureAll === undefined ? {} : { pictureAll }) });
    const file = (p: unknown) => parseProposals(JSON.stringify({ version: 4, area: 'x', groups: [{ id: 'g', title: 'g', note: '', computed: { date: '2026-01-01', periods: Object.keys(mock.byPeriod), seeds: [1], networkHash: 'a', demandHash: 'b', calibration: 'uncalibrated' }, baseline: { cutThroughVehPerHour: {} }, proposals: [p] }] }))!.groups[0].proposals[0];
    expect(file(mk(pic)).pictureAll).toEqual(pic);
    const bad = file(mk({ ...pic, scen: [1] }));
    expect(bad.pictureAll).toBeUndefined();
    expect(bad.picture).toEqual(pic);
    expect(file(mk(undefined)).pictureAll).toBeUndefined();
  });
});
