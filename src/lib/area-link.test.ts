import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadArea } from '../data';
import { buildFixture } from '../fixtures/area';
import { decodeMeta } from './hash';

const fx = buildFixture();
const index = [
  { id: 'rockridge', name: 'Rockridge', network: '/data/rockridge.network.json', demand: '/data/rockridge.demand.json', basemap: '/data/rockridge.basemap.json', center: [0, 0], zoom: 15 },
];
const files: Record<string, unknown> = {
  '/data/areas.json': index,
  '/data/rockridge.network.json': fx.network,
  '/data/rockridge.demand.json': fx.demand,
  '/data/rockridge.basemap.json': fx.basemap,
};

function serve() {
  vi.stubGlobal('fetch', async (url: string) => (url in files
    ? new Response(JSON.stringify(files[url]), { status: 200 })
    : new Response('not found', { status: 404 })));
}

afterEach(() => vi.unstubAllGlobals());

describe('scenario link to an area that is not listed', () => {
  it('reads the area id from the link', () => {
    expect(decodeMeta('v1;a=rockridge-compact').area).toBe('rockridge-compact');
  });

  it('opens the default area instead of failing', async () => {
    serve();
    const b = await loadArea(decodeMeta('v1;a=rockridge-compact').area);
    expect(b.entry.id).toBe('rockridge');
    expect(b.synthetic).toBe(false);
  });
});
