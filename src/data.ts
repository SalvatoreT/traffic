import type { AreaBundle, AreaEntry, Demand, GeoFC, Network, Transit } from './types';
import { buildFixture } from './fixtures/area';

async function getJson<T>(url: string): Promise<T> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url}: ${r.status}`);
  const text = await r.text();
  return JSON.parse(text) as T; // an SPA fallback returns HTML, which throws here
}

export async function loadArea(preferred?: string, forceFixture = false): Promise<AreaBundle> {
  if (!forceFixture) {
    try {
      const areas = await getJson<AreaEntry[]>('/data/areas.json');
      const entry = areas.find((a) => a.id === preferred) ?? areas[0];
      if (entry) {
        const base = (f: string) => (f.startsWith('/') || f.startsWith('http') ? f : `/data/${f}`);
        const [network, demand, basemap] = await Promise.all([
          getJson<Network>(base(entry.network)),
          getJson<Demand>(base(entry.demand)),
          getJson<GeoFC>(base(entry.basemap)),
        ]);
        let transit: Transit | undefined;
        if (entry.transit) {
          try { transit = await getJson<Transit>(base(entry.transit)); } catch (e) { console.info('No transit file:', (e as Error).message); }
        }
        return { entry, network, demand, basemap, synthetic: false, transit };
      }
    } catch (e) {
      console.info('Using synthetic fixture area:', (e as Error).message);
    }
  }
  return buildFixture();
}
