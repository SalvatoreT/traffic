import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];

function query([minLon, minLat, maxLon, maxLat]: number[]): string {
  const b = `(${minLat},${minLon},${maxLat},${maxLon})`;
  // Relations (bicycle and bus routes) come last with members listed by id only (no geometry): the importer needs
  // the way ids of bicycle routes, and buses are matched from GTFS, so routes are kept only for provenance.
  return `[out:json][timeout:90];(way[highway]${b};node[highway~"traffic_signals|stop|crossing|mini_roundabout"]${b};node[traffic_calming]${b};);out body;>;out skel qt;relation[route~"^(bicycle|bus)$"]${b};out body;`;
}

async function fetchExtract(bbox: number[]): Promise<string> {
  for (const url of ENDPOINTS) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "User-Agent": "traffic-data-fetch/1.0" },
        body: new URLSearchParams({ data: query(bbox) }),
      });
      const text = await res.text();
      if (res.ok && text.includes('"elements"')) return text;
      console.warn(`${url}: HTTP ${res.status}`);
    } catch (e) {
      console.warn(`${url}: ${e}`);
    }
  }
  throw new Error("no Overpass endpoint returned data");
}

const force = process.argv.includes("--force");
for (const file of readdirSync("data/areas").filter((f) => f.endsWith(".json"))) {
  const area = JSON.parse(readFileSync(join("data/areas", file), "utf8"));
  if (existsSync(area.extract) && !force) {
    console.log(`${area.extract} exists (use --force to refresh)`);
    continue;
  }
  mkdirSync(dirname(area.extract), { recursive: true });
  writeFileSync(area.extract, await fetchExtract(area.bbox));
  console.log(`wrote ${area.extract}`);
}
