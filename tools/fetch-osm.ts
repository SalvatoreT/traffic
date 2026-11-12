import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
];

const box = ([minLon, minLat, maxLon, maxLat]: number[]) => `(${minLat},${minLon},${maxLat},${maxLon})`;

// Bicycle route relations come last with members listed by id only (no geometry): the importer needs the way ids of
// bicycle routes. Bus routes come from the GTFS feed (tools/fetch-transit.ts), so their relations are not fetched.
const relationQuery = (bbox: number[]) => `[out:json][timeout:60];relation[route=bicycle]${box(bbox)};out body;`;
const query = (bbox: number[]) => {
  const b = box(bbox);
  return `[out:json][timeout:90];(way[highway]${b};node[highway~"traffic_signals|stop|crossing|mini_roundabout"]${b};node[traffic_calming]${b};);out body;>;out skel qt;relation[route=bicycle]${b};out body;`;
};

async function run(q: string): Promise<string> {
  for (let attempt = 0; attempt < 2; attempt++) {
    for (const url of ENDPOINTS) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "User-Agent": "traffic-data-fetch/1.0" },
          body: new URLSearchParams({ data: q }),
          signal: AbortSignal.timeout(120_000),
        });
        const text = await res.text();
        if (res.ok && text.includes('"elements"')) {
          JSON.parse(text);
          return text;
        }
        console.warn(`${url}: HTTP ${res.status}`);
      } catch (e) {
        console.warn(`${url}: ${e}`);
      }
    }
  }
  throw new Error("no Overpass endpoint returned data");
}

// Fallback when no Overpass mirror answers: the OpenStreetMap map API, tiled (a request is limited to 50,000 nodes), converted to the
// same Overpass JSON shape (highway ways with all their nodes, tagged nodes of the Overpass query, bicycle route relations).
// Needs more requests but no heavy query; used with --api or automatically after every Overpass endpoint has failed.
const API = "https://api.openstreetmap.org/api/0.6/map.json";
type El = { type: string; id: number; lat?: number; lon?: number; tags?: Record<string, string>; nodes?: number[]; members?: unknown[] };

async function apiTile(b: number[], depth = 0): Promise<El[]> {
  const url = `${API}?bbox=${b.map((v) => v.toFixed(6)).join(",")}`;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "traffic-data-fetch/1.0" }, signal: AbortSignal.timeout(120_000) });
      if (res.status === 400 && depth < 6) {
        const [x0, y0, x1, y1] = b;
        const mx = (x0 + x1) / 2;
        const my = (y0 + y1) / 2;
        const parts = [[x0, y0, mx, my], [mx, y0, x1, my], [x0, my, mx, y1], [mx, my, x1, y1]];
        return (await Promise.all(parts.map((p) => apiTile(p, depth + 1)))).flat();
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return ((await res.json()) as { elements: El[] }).elements;
    } catch (e) {
      console.warn(`${url}: ${e}`);
      await new Promise((r) => setTimeout(r, 3000 * (attempt + 1)));
    }
  }
  throw new Error(`OpenStreetMap API failed for ${url}`);
}

async function fetchViaApi(bbox: number[], nx = 8, ny = 5): Promise<string> {
  const [minLon, minLat, maxLon, maxLat] = bbox;
  const all = new Map<string, El>();
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < ny; j++) {
      const tile = [minLon + ((maxLon - minLon) * i) / nx, minLat + ((maxLat - minLat) * j) / ny, minLon + ((maxLon - minLon) * (i + 1)) / nx, minLat + ((maxLat - minLat) * (j + 1)) / ny];
      for (const e of await apiTile(tile)) all.set(`${e.type}/${e.id}`, e);
      console.log(`tile ${i},${j}: ${all.size} elements`);
    }
  }
  const ways = [...all.values()].filter((e) => e.type === "way" && e.tags?.highway);
  const wayNodes = new Set(ways.flatMap((w) => w.nodes ?? []));
  const keepTag = (e: El) => /^(traffic_signals|stop|crossing|mini_roundabout)$/.test(e.tags?.highway ?? "") || e.tags?.traffic_calming !== undefined;
  const out: El[] = [];
  for (const e of all.values()) {
    if (e.type === "way" && e.tags?.highway) out.push({ type: "way", id: e.id, nodes: e.nodes, tags: e.tags });
    else if (e.type === "node" && (wayNodes.has(e.id) || keepTag(e))) {
      out.push(keepTag(e) ? { type: "node", id: e.id, lat: e.lat, lon: e.lon, tags: e.tags } : { type: "node", id: e.id, lat: e.lat, lon: e.lon });
    } else if (e.type === "relation" && e.tags?.route === "bicycle") out.push(e);
  }
  return JSON.stringify({ version: 0.6, generator: "OpenStreetMap API 0.6 /map (tiled), converted", elements: out });
}

const force = process.argv.includes("--force");
const viaApi = process.argv.includes("--api");
// --relations: keep the stored ways and nodes (so ids and the network stay identical) and refresh only the relations.
const relationsOnly = process.argv.includes("--relations");
for (const file of readdirSync("data/areas").filter((f) => f.endsWith(".json"))) {
  const area = JSON.parse(readFileSync(join("data/areas", file), "utf8"));
  if (relationsOnly) {
    const old = JSON.parse(readFileSync(area.extract, "utf8"));
    const rel = JSON.parse(await run(relationQuery(area.bbox)));
    old.elements = [...old.elements.filter((e: { type: string }) => e.type !== "relation"), ...rel.elements];
    writeFileSync(area.extract, JSON.stringify(old));
    console.log(`updated relations in ${area.extract} (${rel.elements.length})`);
    continue;
  }
  if (existsSync(area.extract) && !force) {
    console.log(`${area.extract} exists (use --force to refresh, --relations to refresh bicycle routes only)`);
    continue;
  }
  mkdirSync(dirname(area.extract), { recursive: true });
  let text: string;
  if (viaApi) text = await fetchViaApi(area.bbox);
  else {
    try {
      text = await run(query(area.bbox));
    } catch (e) {
      console.warn(`${e}; falling back to the OpenStreetMap API`);
      text = await fetchViaApi(area.bbox);
    }
  }
  writeFileSync(area.extract, text);
  console.log(`wrote ${area.extract}`);
}
