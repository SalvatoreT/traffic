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

const force = process.argv.includes("--force");
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
  writeFileSync(area.extract, await run(query(area.bbox)));
  console.log(`wrote ${area.extract}`);
}
