import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

const BUCKET = "traffic-data";
const MANIFEST = "data/manifest.json";
const MAPPINGS: { local: string; prefix: string; match?: RegExp }[] = [
  { local: "data/osm", prefix: "osm", match: /\.json$/ },
  { local: "data/demand/raw", prefix: "demand/raw" },
  { local: "public/data", prefix: "areas" },
];

const SITE = process.env.TRAFFIC_UPLOAD_URL?.replace(/\/$/, "");
const TOKEN = process.env.TRAFFIC_UPLOAD_TOKEN ?? "proxy-injected";

function contentType(file: string): string {
  if (file.endsWith(".json")) return "application/json; charset=utf-8";
  if (file.endsWith(".csv")) return "text/csv; charset=utf-8";
  return "application/octet-stream";
}

async function sitePut(key: string, file: string) {
  const body = readFileSync(file);
  const res = await fetch(`${SITE}/api/data/${key}`, {
    method: "PUT",
    headers: { "x-upload-token": TOKEN, "content-type": contentType(file), "content-length": String(body.length) },
    body,
  });
  if (!res.ok) throw new Error(`upload ${key}: HTTP ${res.status} ${await res.text()}`);
  console.log(`uploaded ${key} (${body.length} bytes)`);
}

async function siteGet(key: string, file: string) {
  const res = await fetch(`${SITE}/api/data/${key}`, { headers: { "x-upload-token": TOKEN } });
  if (!res.ok) throw new Error(`download ${key}: HTTP ${res.status} ${await res.text()}`);
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  console.log(`downloaded ${key}`);
}

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

async function push() {
  const keys: string[] = [];
  for (const m of MAPPINGS) {
    for (const file of walk(m.local)) {
      if (m.match && !m.match.test(file)) continue;
      const key = `${m.prefix}/${relative(m.local, file)}`;
      if (SITE) await sitePut(key, file);
      else wrangler(["r2", "object", "put", `${BUCKET}/${key}`, "--file", file, "--remote"]);
      keys.push(key);
    }
  }
  writeFileSync(MANIFEST, JSON.stringify({ bucket: BUCKET, keys: keys.sort() }, null, 2) + "\n");
}

async function pull() {
  const keys: string[] = JSON.parse(readFileSync(MANIFEST, "utf8")).keys;
  for (const key of keys) {
    const m = MAPPINGS.find((x) => key.startsWith(`${x.prefix}/`));
    if (!m) continue;
    const file = join(m.local, key.slice(m.prefix.length + 1));
    mkdirSync(dirname(file), { recursive: true });
    if (SITE) await siteGet(key, file);
    else wrangler(["r2", "object", "get", `${BUCKET}/${key}`, "--file", file, "--remote"]);
  }
}

const cmd = process.argv[2];
if (cmd === "push") await push();
else if (cmd === "pull") await pull();
else {
  console.error("usage: r2-sync <push|pull>");
  process.exit(1);
}
