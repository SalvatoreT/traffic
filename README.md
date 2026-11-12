# Traffic

A neighborhood traffic simulator. It runs a microscopic model of today's traffic on a real street network, and you add
interventions to see the result next to the baseline. The first study area is the Rockridge Trapezoid in North Oakland,
CA, bounded by Telegraph Ave, Alcatraz Ave, College Ave, Claremont Ave and the SR-24 freeway. Study areas are data, so
nothing in the code is specific to Rockridge.

The simulated network is much wider than the study area: it runs from Ashby Ave south to about 52nd St and from
Sacramento St east to Tunnel Road, so that routes and edge traffic are realistic. The map shows the study area plus a
250 m buffer. Results come from the whole network.

Agents are cars, cyclists and pedestrians. Buses were removed on purpose. Interventions are modal filters, speed humps,
traffic circles, one-way streets, turn bans, signal changes and the diagonal diverter. You select a street block or an
intersection first, then pick from the interventions that apply there. A run covers one simulated hour, and scenario
links encode each intervention by location (geohash, format v1) so they survive network re-imports. The simulation core
is Rust compiled to WASM and runs in a Web Worker. The UI is React and MapLibre.

The baseline is not calibrated (see below), so treat results as illustrations.

## Quick start

```sh
npm install
npm run data:pull      # download study-area data from R2 (needs wrangler login)
# or, without R2 access: npm run data:fetch && npm run data
npm run dev            # Vite + local Worker
npm test               # Rust unit tests + TypeScript tests
npm run build          # WASM build, typecheck, production bundle
```

Building the WASM needs a Rust toolchain with the `wasm32-unknown-unknown` target (`npm run wasm`). The Rust-only tools
need no npm:

```sh
cargo run --release -p traffic-sim --bin validate                # primitive capacities against published ranges
cargo run --release -p traffic-sim --bin calibrate -- --area rockridge --period pm_peak --minutes 60 --seed 1
```

## How the model works

- Cars follow the Improved Intelligent Driver Model ([Treiber2000], [Treiber2014], [Kesting2010]); the sim steps at 0.25 s.
- Signals use Webster-style plans, with splits re-estimated from measured flows ([Webster1958]). Stop-controlled and
  all-way-stop junctions use gap acceptance ([Brilon1999]). Circles use yield-on-entry ([Rodegerdts2010]).
- Routes are chosen on travel time with iterative equilibrium assignment ([Wardrop1952], [Peeta2001]), so traffic
  reroutes when streets are closed.
- Demand is fitted to link counts and to observed route shares by assignment, using multiplicative updates
  ([VanZuylen1980], [Willumsen1981]) and successive averages ([PowellSheffi1982]). Details are in
  [data/demand/README.md](data/demand/README.md).
- Demand is fixed: the same trips are made before and after each change. Real schemes also remove traffic
  ([Thomas2024]), which this version does not model.
- Safety is reported as surrogate indicators (speeds, time-to-collision conflicts; [Hayward1972], [Mahmud2017]), not
  crash predictions.
- Parameters and demand that are not sourced are labeled as assumptions in code, specs and the UI.

Keys resolve in [docs/references.md](docs/references.md), which records how each entry was verified.

## What is and is not calibrated

The Rockridge area is marked `uncalibrated` in `data/areas/rockridge.json`.

- Validated: a suite of small synthetic networks checks the simulator's own capacities (signal saturation flow, stop and
  circle entry, link and motorway lane capacity, pedestrian and cyclist effects) against published ranges. Not every
  case passes. Results are in [data/calibration/validation.md](data/calibration/validation.md).
- Midday is the default period and is stable. The PM peak backs up at the SR-24 west end and the AM peak is borderline,
  so both are labeled experimental in the app.
- Route shares: the fit meets the observed shares in the static assignment, but in the simulator only one of the four
  freeway shares for Hillegass Ave and Colby St is within 10 points of the observed value (PM peak).
- Counts and assumptions: counts cover few intersections, ramp counts are from 2012 to 2021 and have no peak-hour
  direction, and local trip generation, walking and biking volumes and many parameters are assumptions.
- Observed route shares are percentages from resident-provided select-link data and are indicative only.

The record of every tuning step is [data/calibration/rockridge.record.md](data/calibration/rockridge.record.md). Tuning
follows its order: validate the simulator's primitives first, then tune demand.

## Data and publishing

Network, demand and calibration inputs are described in [data/README.md](data/README.md),
[data/areas/README.md](data/areas/README.md), [data/demand/README.md](data/demand/README.md) and
[data/calibration/README.md](data/calibration/README.md). Network and basemap come from OpenStreetMap, so tagging
errors and missing turn restrictions carry through. Demand uses Oakland turning-movement counts, Caltrans AADT and
ramp volumes, and Census LODES commute flows.

Git holds nothing large: a pre-commit hook (`.githooks/pre-commit`) blocks files over 200 KB. Source extracts and
generated files live in the R2 bucket `traffic-data`. To publish:

- With a Cloudflare login: `npm run data:fetch`, `npm run data`, then `npm run data:push`, or `npx wrangler r2 object put`.
- Without one: the Worker accepts `PUT /api/data/<key>` for keys under `areas/`, `osm/` and `demand/` when the request
  carries the upload secret. Set `TRAFFIC_UPLOAD_URL=https://<site>` and run `npm run data:push` (or `data:pull`). Setup
  of the secret is in [data/README.md](data/README.md).

## Deploy (Cloudflare Workers Builds)

Connect the repository in the Cloudflare dashboard and set:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- R2 bucket `traffic-data`, bound to the Worker as `DATA`, and the Worker name from `wrangler.jsonc`
  (`traffic-transit-directory`)

The Worker serves the static app and reads generated study-area files from the bucket at `/data/*`.

## Repository layout

| Path | What |
| --- | --- |
| `crates/sim` | Rust simulation core (native and WASM), plus the `validate` and `calibrate` binaries |
| `src/` | React + TypeScript UI, sim worker client |
| `worker/` | Cloudflare Worker: static assets, `/data/*`, authenticated `/api/data/<key>` |
| `tools/` | Data pipeline: OSM import, demand fitting, R2 sync |
| `data/` | Source extracts, provenance, calibration targets and record |
| `public/data/` | Generated study-area files |
| `docs/references.md` | Bibliography and citation keys |
| `openspec/` | Specs (current truth) and change history |

Non-trivial changes go through OpenSpec; commits follow Conventional Commits. Contributors and agents should read
[AGENTS.md](AGENTS.md).

## License and attribution

Code is released under the license in [LICENSE](LICENSE). Map data is (c) OpenStreetMap contributors, available under the
[ODbL](https://www.openstreetmap.org/copyright); derived network and basemap files carry the same attribution.
