import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

const BUCKET = "traffic-data";
const MANIFEST = "data/manifest.json";
const MAPPINGS: { local: string; prefix: string; match?: RegExp }[] = [
  { local: "data/osm", prefix: "osm", match: /\.json$/ },
  { local: "data/demand/raw", prefix: "demand/raw" },
  { local: "data/transit/raw", prefix: "transit/raw" },
  { local: "public/data", prefix: "areas" },
];

function wrangler(args: string[], capture = false): string {
  return execFileSync("npx", ["wrangler", ...args], {
    encoding: "utf8",
    stdio: capture ? ["ignore", "pipe", "inherit"] : "inherit",
  }) as string;
}

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

function push() {
  const keys: string[] = [];
  for (const m of MAPPINGS) {
    for (const file of walk(m.local)) {
      if (m.match && !m.match.test(file)) continue;
      const key = `${m.prefix}/${relative(m.local, file)}`;
      wrangler(["r2", "object", "put", `${BUCKET}/${key}`, "--file", file, "--remote"]);
      keys.push(key);
    }
  }
  writeFileSync(MANIFEST, JSON.stringify({ bucket: BUCKET, keys: keys.sort() }, null, 2) + "\n");
}

function pull() {
  const keys: string[] = JSON.parse(readFileSync(MANIFEST, "utf8")).keys;
  for (const key of keys) {
    const m = MAPPINGS.find((x) => key.startsWith(`${x.prefix}/`));
    if (!m) continue;
    const file = join(m.local, key.slice(m.prefix.length + 1));
    mkdirSync(dirname(file), { recursive: true });
    wrangler(["r2", "object", "get", `${BUCKET}/${key}`, "--file", file, "--remote"]);
  }
}

const cmd = process.argv[2];
if (cmd === "push") push();
else if (cmd === "pull") pull();
else {
  console.error("usage: r2-sync <push|pull>");
  process.exit(1);
}
