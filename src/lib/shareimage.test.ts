import { describe, expect, it } from 'vitest';
import { buildFixture } from '../fixtures/area';
import { buildMockProposals } from '../fixtures/proposals';
import { buildIndex } from './naming';
import { buildPicture, pictureFacts } from './picture';
import { buildShareSvg, qrMatrix, QR_MODULE, shareAlt, shareInputFor, SHARE_SCALE, SHARE_W, wrapText, type Measure } from './shareimage';
import type { Proposal, ProposalPicture } from './proposals';

const net = buildFixture().network;
const index = buildIndex(net);
const mock = buildMockProposals(net, { networkHash: 'a'.repeat(64), demandHash: 'b'.repeat(64), calibration: 'uncalibrated' }).groups[0].proposals[0];
const measure: Measure = (t, size, weight) => t.length * size * (weight >= 700 ? 0.58 : 0.54);
const labels: Record<string, string> = { pm_peak: 'PM peak (16:00-18:00 weekday, hourly rate)', am_peak: 'AM peak (07:00-09:00 weekday, hourly rate)', midday: 'Midday (11:00-13:00 weekday, hourly rate)' };
const label = (id: string) => labels[id] ?? id;
const short = (id: string) => label(id).replace(/\s*\(.*\)\s*$/, '');

function build(searched: string[], changes = 2, withPeriod = true) {
  const inside = net.links.filter((l) => l.inStudyArea);
  const pic: ProposalPicture = { period: 'pm_peak', links: inside.slice(0, 4).map((l) => l.id), base: [40, 30, 20, 10], scen: [5, 5, 25, 10] };
  const p: Proposal = {
    ...mock, title: 'Filter on Martin and Ayala', picture: pic,
    interventions: Array.from({ length: changes }, (_, i) => ({ type: 'modal_filter', label: `Modal filter at Street ${i} & Avenue ${i}` })),
    cutThrough: { baselineVehPerHour: 445, scenarioVehPerHour: 94, changePct: -78.9 },
    byPeriod: !withPeriod ? {} : { ...mock.byPeriod, pm_peak: { ...mock.byPeriod[Object.keys(mock.byPeriod)[0]], cutThrough: { baselineVehPerHour: 610, scenarioVehPerHour: 130, changePct: -78.7 } } },
  };
  const facts = pictureFacts(p, pic, index);
  const model = buildPicture(net, index, p, pic, [], facts);
  const input = shareInputFor({ areaName: 'Test Area', status: 'Calibrated, with limits.', p, pic, facts, model, searched, periodLabel: label, shortLabel: short, caption: '', openUrl: 'https://example.org/#v1;a=test;p=pm_peak;s=mn,9q9p642ut2~mf,9q9p3cqyux' });
  return { input, img: buildShareSvg(input, measure) };
}

describe('shareable picture', () => {
  it('says whether the figures are a mean and over how many runs, and names the block honestly', () => {
    const { input } = build(['pm_peak', 'am_peak']);
    const withRuns = shareInputFor({ ...{ areaName: 'T', status: 's', p: mock, pic: { period: 'pm_peak', links: [], base: [], scen: [] }, facts: { named: null, namedKind: 'largest', drop: null, gain: null }, model: { marks: [], pins: [] } as never, searched: ['pm_peak', 'am_peak'], periodLabel: label, shortLabel: short, caption: '', openUrl: 'x' }, runs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] });
    expect(withRuns.averageFigure?.label).toBe('Average of PM peak and AM peak, all side streets, mean of 10 runs (seeds 1 to 10)');
    expect(input.averageFigure?.label).toBe('Average of PM peak and AM peak, all side streets');
  });
  it('carries the title, changes, period, legend, both figures, status, attribution and site', () => {
    const { img } = build(['pm_peak', 'am_peak', 'midday']);
    for (const t of ['Filter on Martin and Ayala', 'Modal filter at Street 0 &amp; Avenue 0', 'PM peak (16:00-18:00 weekday)', '610 → 130 an hour (−78.7%)'.replace('−78.7%', '−79%'),
      '445 → 94 an hour (−79%)', 'Average of PM peak, AM peak and Midday', 'Calibrated,', 'limits.', '© OpenStreetMap contributors', 'traffic.transit.directory', 'Cars an hour. Blue: fewer through cars', 'simulator']) {
      expect(img.svg, t).toContain(t);
    }
    expect(img.svg).toMatch(/^<svg xmlns="http:\/\/www.w3.org\/2000\/svg"/);
  });
  it('does not label the average as the picture\'s period when that period has no result', () => {
    const { input, img } = build(['pm_peak', 'am_peak'], 2, false);
    expect(input.periodFigure).toBeNull();
    expect(img.svg).not.toContain('the period this picture shows');
    expect(img.svg).toContain('Average of PM peak and AM peak');
    expect(build(['pm_peak'], 2, false).input.periodFigure).toBeNull();
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
  it('has no number in the title', () => {
    expect(build(['pm_peak']).input.title).toBe('Filter on Martin and Ayala');
  });
  it('draws a QR code of the open link in clear space at the bottom right', () => {
    const { img, input } = build(['pm_peak', 'am_peak']);
    const m = qrMatrix(input.openUrl);
    expect(m.length).toBeGreaterThanOrEqual(21);
    expect(QR_MODULE * SHARE_SCALE).toBeGreaterThanOrEqual(5);
    const q = img.qr, footer = img.sections.find((s) => s.name === 'footer')!;
    expect(q.size).toBe((q.modules + 8) * QR_MODULE);
    expect(q.x + q.size).toBe(SHARE_W - 32);
    expect(q.y).toBeGreaterThanOrEqual(footer.top);
    expect(q.y + q.size).toBeLessThanOrEqual(footer.bottom);
    for (const l of img.lines) if (l.y >= q.y && l.y <= q.y + q.size && l.x < q.x) expect(l.x + l.width, l.text).toBeLessThanOrEqual(q.x - 8);
    for (const s of img.sections) if (s.name !== 'footer') expect(s.bottom).toBeLessThanOrEqual(q.y);
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

describe('smallestFit', () => {
  const blob = (n: number) => ({ size: n }) as Blob;
  it('takes the first encoding that fits and stops there', async () => {
    const { smallestFit } = await import('./shareimage');
    const sizes = [900, 400, 100]; let calls = 0;
    const b = await smallestFit(async () => blob(sizes[calls++]), 450, [{ scale: 2, quality: 0.8 }, { scale: 2, quality: 0.6 }, { scale: 1, quality: 0.6 }]);
    expect(b!.size).toBe(400); expect(calls).toBe(2);
  });
  it('falls back to the smallest when none fits and skips failed encodings', async () => {
    const { smallestFit } = await import('./shareimage');
    const out = [blob(900), null, blob(700)]; let i = 0;
    const b = await smallestFit(async () => out[i++], 450, [{ scale: 2, quality: 0.8 }, { scale: 2, quality: 0.6 }, { scale: 1, quality: 0.6 }]);
    expect(b!.size).toBe(700);
  });
});
