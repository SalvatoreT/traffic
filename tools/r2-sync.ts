import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, relative } from "node:path";
import { contentType } from "./lib/content-type";
import { MAPPINGS, localPath } from "./lib/r2-map";
import { walk } from "./lib/walk";

const BUCKET = "traffic-data";
const MANIFEST = "data/manifest.json";

const SITE = process.env.TRAFFIC_UPLOAD_URL?.replace(/\/$/, "");
const TOKEN = process.env.TRAFFIC_UPLOAD_TOKEN ?? "proxy-injected";

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

// `push --only key,prefix/` uploads just those keys and leaves the manifest alone.
const ONLY = process.argv.includes("--only") ? process.argv[process.argv.indexOf("--only") + 1].split(",") : null;

async function push() {
  const keys: string[] = [];
  for (const m of MAPPINGS) {
    for (const file of walk(m.local)) {
      if (m.match && !m.match.test(file)) continue;
      const key = `${m.prefix}/${relative(m.local, file)}`;
      if (ONLY && !ONLY.some((o) => key === o || (o.endsWith("/") && key.startsWith(o)))) continue;
      if (SITE) await sitePut(key, file);
      else wrangler(["r2", "object", "put", `${BUCKET}/${key}`, "--file", file, "--remote"]);
      keys.push(key);
    }
  }
  if (ONLY) return;
  writeFileSync(MANIFEST, JSON.stringify({ bucket: BUCKET, keys: keys.sort() }, null, 2) + "\n");
}

async function pull() {
  const keys: string[] = JSON.parse(readFileSync(MANIFEST, "utf8")).keys;
  for (const key of keys) {
    const file = localPath(key);
    if (!file) continue;
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
