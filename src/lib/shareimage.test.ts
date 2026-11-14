import { describe, expect, it } from 'vitest';
import { buildFixture } from '../fixtures/area';
import { buildMockProposals } from '../fixtures/proposals';
import { buildIndex } from './naming';
import { buildPicture, pictureFacts } from './picture';
import { buildShareSvg, shareAlt, shareInputFor, SHARE_W, wrapText, type Measure } from './shareimage';
import type { Proposal, ProposalPicture } from './proposals';

const net = buildFixture().network;
const index = buildIndex(net);
const mock = buildMockProposals(net, { networkHash: 'a'.repeat(64), demandHash: 'b'.repeat(64), calibration: 'uncalibrated' }).groups[0].proposals[0];
const measure: Measure = (t, size, weight) => t.length * size * (weight >= 700 ? 0.58 : 0.54);
const labels: Record<string, string> = { pm_peak: 'PM peak (16:00-18:00 weekday, hourly rate)', am_peak: 'AM peak (07:00-09:00 weekday, hourly rate)', midday: 'Midday (11:00-13:00 weekday, hourly rate)' };
const label = (id: string) => labels[id] ?? id;
const short = (id: string) => label(id).replace(/\s*\(.*\)\s*$/, '');

function build(searched: string[], changes = 2) {
  const inside = net.links.filter((l) => l.inStudyArea);
  const pic: ProposalPicture = { period: 'pm_peak', links: inside.slice(0, 4).map((l) => l.id), base: [40, 30, 20, 10], scen: [5, 5, 25, 10] };
  const p: Proposal = {
    ...mock, title: 'Filter on Martin and Ayala', picture: pic,
    interventions: Array.from({ length: changes }, (_, i) => ({ type: 'modal_filter', label: `Modal filter at Street ${i} & Avenue ${i}` })),
    cutThrough: { baselineVehPerHour: 445, scenarioVehPerHour: 94, changePct: -78.9 },
    byPeriod: { ...mock.byPeriod, pm_peak: { ...mock.byPeriod[Object.keys(mock.byPeriod)[0]], cutThrough: { baselineVehPerHour: 610, scenarioVehPerHour: 130, changePct: -78.7 } } },
  };
  const facts = pictureFacts(p, pic, index);
  const model = buildPicture(net, index, p, pic, [], facts);
  const input = shareInputFor({ areaName: 'Test Area', status: 'Calibrated, with limits.', p, pic, facts, model, searched, periodLabel: label, shortLabel: short, caption: '', number: 3 });
  return { input, img: buildShareSvg(input, measure) };
}

describe('shareable picture', () => {
  it('carries the title, changes, period, legend, both figures, status, attribution and site', () => {
    const { img } = build(['pm_peak', 'am_peak', 'midday']);
    for (const t of ['3. Filter on Martin and Ayala', 'Modal filter at Street 0 &amp; Avenue 0', 'PM peak (16:00-18:00 weekday)', '610 → 130 an hour (−78.7%)'.replace('−78.7%', '−79%'),
      '445 → 94 an hour (−79%)', 'Average of PM peak, AM peak and Midday', 'Calibrated, with limits.', '© OpenStreetMap contributors', 'traffic.transit.directory', 'Cars an hour. Blue: fewer through cars']) {
      expect(img.svg, t).toContain(t);
    }
    expect(img.svg).toMatch(/^<svg xmlns="http:\/\/www.w3.org\/2000\/svg"/);
  });
  it('leaves out the average line when only the picture\'s period was searched', () => {
    const { img } = build(['pm_peak']);
    expect(img.svg).not.toContain('Average of');
  });
  it('fits every text line in the width and stacks its sections without overlap', () => {
    for (const searched of [['pm_peak'], ['pm_peak', 'am_peak', 'midday']]) for (const changes of [1, 8]) {
      const { img } = build(searched, changes);
      for (const l of img.lines) { expect(l.x).toBeGreaterThanOrEqual(0); expect(l.x + l.width, l.text).toBeLessThanOrEqual(SHARE_W); }
      for (let i = 1; i < img.sections.length; i++) expect(img.sections[i].top).toBeGreaterThanOrEqual(img.sections[i - 1].bottom);
      expect(img.sections[img.sections.length - 1].bottom).toBeLessThanOrEqual(img.height);
    }
  });
  it('grows with the number of changes', () => {
    expect(build(['pm_peak'], 8).img.height).toBeGreaterThan(build(['pm_peak'], 1).img.height);
  });
  it('wraps on word boundaries', () => {
    const ls = wrapText('one two three four five six seven', 10, 400, 100, measure);
    expect(ls.length).toBeGreaterThan(1);
    expect(ls.join(' ')).toBe('one two three four five six seven');
  });
  it('gives a text alternative with the name and the changes', () => {
    expect(shareAlt('1. A', ['x', 'y'], 'Map.')).toBe('1. A. Changes: x; y. Map.');
  });
});
