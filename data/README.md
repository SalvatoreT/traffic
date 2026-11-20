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

`npm run data` needs them. Without a file, or when its recorded hashes do not match the current inputs, the build notes it in the fit report and falls back to static membership, which gives a different demand (and different hashes everywhere downstream). Pull before building.

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

Each file is about 90 KB gzipped and one simulated hour takes about a minute (two runs per file, with one baseline per period shared). Each file records the network hash, the demand hash and a fingerprint of the simulator's sources (`crates/sim/build.rs`); the app ignores a file unless all three match what it loaded and runs live instead. A file whose inputs still match is not recomputed. A full run removes files for scenarios that are no longer published. The key is a hash of the order-independent scenario and the period, so proposals with the same scenario share a file. Visitors' own scenarios are not stored: their links run to the end at Max.

The same run writes `public/data/results/<area>/baseline-intents.json`: today's traffic for each period split by the reasons of `throughIntents` (cars an hour and the links each reason's cars used), with the same three validity keys. The Assumptions tab draws a map for each reason from it, and shows no maps when it is missing or stale. After a demand change, regenerate it alone with `npm run data:results -- --baselines-only` (three simulations, about two minutes), and the Assumptions tab's table of assumed movements with `npm run data:assumptions` (reads the config and the fit report; `npm run data` runs it after the demand build).

## Text pages for language models

`npm run data:llms` writes `public/data/llms/` (`llms.txt`, `llms-full.txt`, `index.md`, `proposals.md`, `streets.md`, `assumptions.md`, `sources.md` and copies of the three guides in `docs/`) from the files in `public/data` and the docs. They are published with the rest (`areas/llms/*` in the bucket) and the Worker serves them at `/llms.txt`, `/llms-full.txt` and `/<name>.md`. Order at publish time: the proposal search, `npm run data:results`, then `npm run data:llms`, then `data:push`. Pages built from numbers that no longer match the network, demand or simulator say "Out of date" and still show them. Anyone can fetch the core files without credentials with `npm run data:download`.

## Link previews

`npm run data:previews` writes `public/data/og/`: a 1200 x 630 JPEG card for the home page, each tab and each published proposal, and `index.json`, which says what each path's preview shows. They are published with the rest (`areas/og/*` in the bucket). The Worker serves the cards at `/og/<name>-<hash>.jpg` and, for `/`, the tab paths and `/p/<slug>`, puts the matching tags in the page head (title, description, canonical, Open Graph, Twitter card). A card's name carries a hash of its bytes, so a changed card is a new address. Order at publish time: the proposal search, `npm run data:results`, `npm run data:llms`, `npm run data:previews`, then `data:push`. The generator writes a card for a proposals group only when the group was computed on the network and demand now served, and the stored baseline map only when the stored baseline was too; it prints what it skipped. Cards are drawn in Node with `@resvg/resvg-js` and the Inter subset in `tools/fonts/` (SIL Open Font License), with no system fonts.

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
