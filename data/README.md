# Data

Git holds nothing large: a pre-commit hook rejects files over 200 KB. Source extracts
and generated study-area files live in the Cloudflare R2 bucket `traffic-data`:

| Local path (gitignored) | R2 key | What |
| --- | --- | --- |
| `data/osm/<area>.overpass.json` | `osm/<area>.overpass.json` | Raw OpenStreetMap extract (Rockridge: 8.7 MB) |
| `data/demand/raw/*` | `demand/raw/*` | Raw counts / census downloads |
| `target/membership/*.json` | `demand/membership/*` | Simulated route membership of the fitted count stations (see below); not served at `/data` |
| `public/data/*` | `areas/*` | Generated network, demand, basemap served to the app |
| `public/data/results/<area>/*.json` | `areas/results/<area>/*` | Precomputed finished hours of the published proposals (see below) |

- `npm run data:fetch`: download source data from its origins (Overpass, Oakland open data, Census)
- `npm run data`: regenerate `public/data/*` from the local source files, in order: network (`import-osm`), then demand (`build-demand`), which reads the network
- `npm run data:push`: upload sources and generated files to R2 and update `data/manifest.json`
  (needs `wrangler login`)
- `npm run data:pull`: download everything listed in `data/manifest.json` from R2

The deployed Worker reads `areas/*` from the bucket at `/data/*`; local dev serves
`public/data/*` directly. To publish new data, run `data:fetch`, then `data`, then `data:push`.

The OSM extract now includes bicycle route relations. A machine that holds an older extract can add them without changing any way or node id: `npx tsx tools/fetch-osm.ts --relations`.

The OSM fetch tries the Overpass mirrors first. When none answers (the case on 2026-11-12), `tools/fetch-osm.ts` falls back to the OpenStreetMap map API, tiled into 40 requests and converted to the same JSON shape; `npx tsx tools/fetch-osm.ts --force --api` uses it directly. The extract covers the model area in `data/areas/<area>.json` (`bbox`), which is wider than the study area.

## Membership files

Since round 52 the shipped demand is fitted on the simulator's own route choice. The config (`countFit.throughTargets.simulatedMembership` in `data/demand/<area>.config.json`) names two files under `target/membership/`: `<area>.membership.json` for the shipped demand and `<area>.membership-training.json` for the cross-validation demand. Each holds, for every fitted count station, the share of simulated trips that use each origin-destination pair, pooled over the passes of `tools/membership-loop.ts`, with the hashes of the network, split, config, stations, targets and simulator they were made on. They are 2 to 3 MB each, so they are not in git. `data:push` uploads them to `demand/membership/*` in the bucket (a prefix the Worker accepts for upload and does not serve at `/data`), lists them in `data/manifest.json` with the other source inputs, and `data:pull` restores them to `target/membership/`.

`npm run data` needs them. Without a file the build notes it in the fit report and uses static membership, which gives a different demand (and different hashes everywhere downstream); the first pass of the membership loop relies on that. With a file whose recorded hashes or simulator fingerprint do not match the current inputs, the build stops and names the fields that differ. Pull before building, and after a simulator change see "When the simulator fingerprint changes".

## Precomputed scenario results

Each Proposals card hovers its changes: where the through cars that used a closed movement go with the package. `npm run data:redistribution` makes that from traced runs (build the WASM first with `npm run wasm`). For every proposal in `public/data/<area>.proposals.json` it runs today's traffic once per seed and the proposal's package once per seed, on the proposal's own confirmation seeds and the period of its picture, and follows the baseline through trips (neither end in the study area) that drove each closed movement of each of its filters, diverters, turn bans and one-ways (the accounting of `npm run simulate -- --redistribution`). It writes `public/data/redistribution/<area>/<group>.<proposal>.json`: per intervention, cars an hour that used it, where they were in the package's run (other side streets, bounding streets or streets already used, removed, found no route, still waiting, not followed), the top routes with their links, and the side-street blocks that gain. Each file carries the proposal's link, period, seeds and the network hash, demand hash and simulator fingerprint it was made on; the card shows it only when all of them match the card's own figures and what is loaded, and otherwise says the redirect data is not available. A file that is current is skipped unless `--force`. Run it after the proposal search and before `npm run data:results`:

```sh
npm run data:redistribution            # --jobs 4 by default; --only <proposal id>, --force
```

Runs are traced and slow: ten seeds of today's traffic plus ten of each package. The six published packages took about 41 minutes on four cores (`--jobs 4`, while another job shared the machine; a package alone takes four to nine minutes). Raw files are 2 to 8 KB each.

A shared link to a published proposal opens already at the end of the hour. `npm run data:results` runs every proposal in `public/data/<area>.proposals.json` (all groups, search and reference) for every demand period with the same WASM build the app runs (build it first with `npm run wasm`), at the app's seed and 100% demand, and writes `public/data/results/<area>/<key>.json` plus `index.json`. Run it after `npm run data` or any change to the simulator or the proposals file:

```
npm run wasm
npm run data:results            # --jobs 2 by default; --only <proposal id>, --periods pm_peak, --force
NODE_USE_ENV_PROXY=1 TRAFFIC_UPLOAD_URL=<site> npm run data:push
```

Each file's `metrics` also carries `junctionRecovery` (policy, node entries and, per recovery reason, the head-seconds invoked and blocked and the admissions); `docs/data-files.md` describes each field, and the Comparison tab summarizes it in words. Each file is about 90 KB gzipped and one simulated hour takes about a minute (two runs per file, with one baseline per period shared). Each file records the network hash, the demand hash and a fingerprint of the simulator's sources (`crates/sim/build.rs`); the app ignores a file unless all three match what it loaded and runs live instead. A file whose inputs still match is not recomputed. A full run removes files for scenarios that are no longer published. The key is a hash of the order-independent scenario and the period, so proposals with the same scenario share a file. Visitors' own scenarios are not stored: their links run to the end at Max.

The same run writes `public/data/results/<area>/baseline-intents.json`: today's traffic for each period split by the reasons of `throughIntents` (cars an hour and the links each reason's cars used), with the same three validity keys. The Assumptions tab draws a map for each reason from it, and shows no maps when it is missing or stale. For an area with `cutThroughCorridors` the same run also makes one traced hour per period (same seed, same totals; it checks that the traced run reproduces the stored through cars by reason and stops if not) and stores the through cars by corridor, direction and reason beside it (`docs/data-files.md`); `--baselines-only` rewrites it, and it is recomputed when the corridor settings change. After a demand change, regenerate it alone with `npm run data:results -- --baselines-only` (three simulations, about two minutes), and the Assumptions tab's table of assumed movements with `npm run data:assumptions` (reads the config and the fit report; `npm run data` runs it after the demand build).

## Text pages for language models

`npm run data:llms` writes `public/data/llms/` (`llms.txt`, `llms-full.txt`, `index.md`, `proposals.md`, `streets.md`, `assumptions.md`, `sources.md` and copies of the three guides in `docs/`) from the files in `public/data` and the docs. They are published with the rest (`areas/llms/*` in the bucket) and the Worker serves them at `/llms.txt`, `/llms-full.txt` and `/<name>.md`. Order at publish time: the proposal search, `npm run data:results`, then `npm run data:llms`, then `data:push`. Pages built from numbers that no longer match the network, demand or simulator say "Out of date" and still show them. Anyone can fetch the core files without credentials with `npm run data:download`.

## Link previews

`npm run data:previews` writes `public/data/og/`: a 1200 x 630 JPEG card for the home page, each tab and each published proposal, and `index.json`, which says what each path's preview shows. They are published with the rest (`areas/og/*` in the bucket). The Worker serves the cards at `/og/<name>-<hash>.jpg` and, for `/`, the tab paths and `/p/<slug>`, puts the matching tags in the page head (title, description, canonical, Open Graph, Twitter card). A card's name carries a hash of its bytes, so a changed card is a new address. Order at publish time: the proposal search, `npm run data:results`, `npm run data:llms`, `npm run data:previews`, then `data:push`. The generator writes a card for a proposals group only when the group was computed on the network and demand now served, and the stored baseline map only when the stored baseline was too; it prints what it skipped. Cards are drawn in Node with `@resvg/resvg-js` and the Inter subset in `tools/fonts/` (SIL Open Font License), with no system fonts.

## When the simulator fingerprint changes

The fingerprint (`cargo run --release --bin fingerprint`, also stamped into the WASM) changes whenever a `.rs` source of the simulator changes, even a pure speedup. The published files record it, so after a change they stop matching the app the Worker serves:

- On the site: proposals show "Out of date", the Assumptions cards lose their maps and counts, and stored results and redistribution are ignored, so scenarios simulate live.
- In the tools: the membership files, `validation.json`, the calibration reports, the proposals file and the stored results no longer match, and `assess` and `explore` refuse or rerun. `npm run data` stops with the mismatching evidence fields rather than falling back to static membership.

Regenerate the whole chain on the new simulator and compare it with what is published. Heavy steps run on the laptop; times below are from 2026-11-21 on an M3 Pro.

1. `cargo build --release`, `npm run wasm`, `npm run check:wasm`; native and WASM runs must agree.
2. `npx tsx tools/membership-loop.ts` (heavy, about an hour), then `npm run data` (about 17 minutes).
3. `cargo run --release -p traffic-sim --bin validate` (seconds), then `npm run assess -- --publish --noise` on seeds 1 to 10 (about a minute on the faster simulator).
4. The proposal search with the flags and seeding of the published round (`explore`, about 45 minutes; keep the committed seeds file unless a figure changed).
5. `npm run data:redistribution`, `npm run data:results`, `npm run data:assumptions`, `npm run data:llms`, `npm run data:previews`.

Identity rule: when the model itself has not changed, every number must come out the same. Only the fingerprint, the revision and dates may differ. Compare each regenerated file with the published one (hashes for the demand, network, noise and membership files; a diff with stamps masked for reports, proposals and results). Any other difference means stop and report to the project lead; do not push. The record names every difference that was accepted.

The laptop does not push. It commits the regenerated files, split into parts under the 200 KB hook limit, with checksums and a list of how each file compares, on its development branch (round 52: `openspec/changes/archive/2026-11-21-restamp-round-52/evidence/publish/`). The cloud session reassembles them, verifies the checksums, clears the four generated folders (`results`, `og`, `llms`, `redistribution`) so that the manifest lists only new files, runs the TypeScript tests and then `data:push`, as under "Publishing without a Cloudflare token". It reads the live proposals file back.

`data/demand/<area>.control-delays*.json` carry the fingerprint they were measured on (round 44 for Rockridge). The config has no `controlDelays` entry, so the build never reads them and they still show the old fingerprint. Measure them again before adding an entry.

## Publishing without a Cloudflare token

The Worker takes data files at `/api/data/<key>` from requests that carry the upload
secret in an `X-Upload-Token` header. It only reads and writes keys under `areas/`,
`osm/` and `demand/`, and it is off until the secret exists.

One-time setup, on a machine where wrangler is logged in:

```
openssl rand -hex 32
npx wrangler secret put UPLOAD_TOKEN
```

Then publish or fetch with the site's address:

```
TRAFFIC_UPLOAD_URL=https://<site> TRAFFIC_UPLOAD_TOKEN=<secret> npm run data:push
TRAFFIC_UPLOAD_URL=https://<site> TRAFFIC_UPLOAD_TOKEN=<secret> npm run data:pull
```

In a cloud session the secret is stored as a network secret for the site's host, so
`TRAFFIC_UPLOAD_TOKEN` is left unset and the proxy fills in the header. Behind a proxy,
Node needs `NODE_USE_ENV_PROXY=1`.

The same endpoint also accepts keys under `jobs/`, which `npm run shard` uses to split simulation batches across sessions (`docs/sharded-runs.md`). Those objects are not served at `/data`.
