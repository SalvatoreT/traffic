import { describe, expect, it } from 'vitest';
import { buildFixture } from '../fixtures/area';
import { buildMockProposals } from '../fixtures/proposals';
import { decodeScenario } from './hash';
import { linkHash, type Proposals } from './proposals';
import { findBySlug, findPublished, linkKey, pathOfSlug, publishedList, slugFromPath, slugOf } from './share-path';

const net = buildFixture().network;
const hashes = { network: 'a'.repeat(64), demand: 'b'.repeat(64) };
const file = buildMockProposals(net, { networkHash: hashes.network, demandHash: hashes.demand, calibration: 'uncalibrated' });

describe('share path', () => {
  it('reads /p/<slug> and nothing else', () => {
    expect(slugFromPath('/p/charter-0abc1234')).toBe('charter-0abc1234');
    expect(slugFromPath('/p/Charter-0ABC1234/')).toBe('charter-0abc1234');
    for (const p of ['/p', '/p/', '/p/a/b', '/proposals', '/data/p/x', '/p/a_b', '/p/%20']) expect(slugFromPath(p)).toBeNull();
    expect(pathOfSlug('x-1')).toBe('/p/x-1');
  });
  it('does not depend on item order, token order or the area token', () => {
    const a = '#v1;a=rockridge;p=pm_peak;s=mn,9q9p3cxtt7~ct,9q9p3cxtt7,a';
    const b = 'v1;p=pm_peak;s=ct,9q9p3cxtt7,a~mn,9q9p3cxtt7';
    expect(linkKey(a)).toBe(linkKey(b));
    expect(slugOf('charter', a)).toBe(slugOf('charter', b));
  });
  it('differs by group, by period and by package', () => {
    const l = '#v1;p=pm_peak;s=mn,9q9p3cxtt7';
    expect(slugOf('charter', l)).not.toBe(slugOf('unconstrained', l));
    expect(slugOf('charter', l)).not.toBe(slugOf('charter', '#v1;p=am_peak;s=mn,9q9p3cxtt7'));
    expect(slugOf('charter', l)).not.toBe(slugOf('charter', '#v1;p=pm_peak;s=mn,9q9p3cxtt8'));
    expect(slugOf('charter', l)).toMatch(/^charter-[0-9a-z]{8}$/);
  });
  it('is stable when a search ranks the same package differently', () => {
    const moved: Proposals = JSON.parse(JSON.stringify(file));
    moved.groups[0].proposals.reverse().forEach((p, i) => { p.id = `q${i}`; });
    const slugs = (f: Proposals) => publishedList(f).map((x) => x.slug).sort();
    expect(slugs(moved)).toEqual(slugs(file));
  });
  it('lists every proposal once with a unique slug, and finds each by slug', () => {
    const list = publishedList(file);
    expect(list.length).toBe(file.groups.reduce((n, g) => n + g.proposals.length, 0));
    expect(new Set(list.map((x) => x.slug)).size).toBe(list.length);
    for (const x of list) expect(findBySlug(file, x.slug)?.proposal.id).toBe(x.proposal.id);
    expect(findBySlug(file, 'charter-00000000')).toBeNull();
  });
  it('keeps one entry for a package listed twice in a group', () => {
    const dup: Proposals = JSON.parse(JSON.stringify(file));
    dup.groups[0].proposals.push({ ...dup.groups[0].proposals[0], id: 'again' });
    expect(publishedList(dup).length).toBe(publishedList(file).length);
  });
});

describe('the map\'s scenario is a published proposal', () => {
  const first = file.groups[0].proposals[0];
  const ivs = decodeScenario(net, linkHash(first.link)).interventions;
  const period = decodeScenarioPeriod(first.link);
  function decodeScenarioPeriod(l: string) { return /p=([\w.-]+)/.exec(l)?.[1] ?? 'pm_peak'; }
  it('matches the same interventions in the same period', () => {
    expect(findPublished(net, file, hashes, ivs, period, 1, 'pm_peak')?.proposal.id).toBe(first.id);
    expect(findPublished(net, file, hashes, [...ivs].reverse(), period, 1, 'pm_peak')?.proposal.id).toBe(first.id);
  });
  it('does not match another period, another demand, no interventions or a changed set', () => {
    expect(findPublished(net, file, hashes, ivs, period === 'am_peak' ? 'midday' : 'am_peak', 1, 'pm_peak')).toBeNull();
    expect(findPublished(net, file, hashes, ivs, period, 1.2, 'pm_peak')).toBeNull();
    expect(findPublished(net, file, hashes, [], period, 1, 'pm_peak')).toBeNull();
    if (ivs.length > 1) expect(findPublished(net, file, hashes, ivs.slice(1), period, 1, 'pm_peak')?.proposal.link).not.toBe(first.link);
  });
  it('skips a group whose inputs changed', () => {
    expect(findPublished(net, file, { network: 'c'.repeat(64), demand: hashes.demand }, ivs, period, 1, 'pm_peak')).toBeNull();
  });
});
