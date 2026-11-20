import { describe, expect, it } from 'vitest';
import { MAPPINGS, localPath } from './lib/r2-map';
import { isAllowedKey } from '../worker/upload';

describe('R2 sync mappings', () => {
  it('maps the membership files to a prefix the upload endpoint accepts and /data does not serve', () => {
    const m = MAPPINGS.find((x) => x.local === 'target/membership')!;
    expect(m.prefix).toBe('demand/membership');
    expect(isAllowedKey(`${m.prefix}/rockridge.membership.json`)).toBe(true);
    expect(m.prefix.startsWith('areas/')).toBe(false);
    expect(localPath('demand/membership/rockridge.membership.json')).toBe('target/membership/rockridge.membership.json');
    expect(localPath('demand/membership/rockridge.membership-training.json')).toBe('target/membership/rockridge.membership-training.json');
  });
  it('keeps the other mappings apart', () => {
    expect(localPath('demand/raw/a/b.csv')).toBe('data/demand/raw/a/b.csv');
    expect(localPath('areas/rockridge.demand.json')).toBe('public/data/rockridge.demand.json');
    expect(localPath('osm/rockridge.overpass.json')).toBe('data/osm/rockridge.overpass.json');
    expect(localPath('jobs/x/y.json')).toBeNull();
  });
  it('every mapped prefix is allowed by the upload endpoint', () => {
    for (const m of MAPPINGS) expect(isAllowedKey(`${m.prefix}/x.json`)).toBe(true);
  });
});
