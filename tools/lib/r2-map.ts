// Which local directories the R2 sync covers and the bucket prefix of each.
// Only `areas/` is served at /data; the other prefixes are inputs for rebuilds.
import { join } from "node:path";

export interface R2Mapping { local: string; prefix: string; match?: RegExp }

export const MAPPINGS: R2Mapping[] = [
  { local: "data/osm", prefix: "osm", match: /\.json$/ },
  { local: "data/demand/raw", prefix: "demand/raw" },
  { local: "target/membership", prefix: "demand/membership", match: /\.json$/ },
  { local: "public/data", prefix: "areas" },
];

export function localPath(key: string): string | null {
  const m = MAPPINGS.find((x) => key.startsWith(`${x.prefix}/`));
  return m ? join(m.local, key.slice(m.prefix.length + 1)) : null;
}
