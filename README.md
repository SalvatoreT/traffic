# Traffic

A neighbourhood traffic simulator. It runs a microscopic model of today's traffic on a real street network. You add
interventions (modal filters, speed humps, traffic circles, one-way streets, turn bans, signal changes) and see the
result next to the baseline. The first study area is the Rockridge Trapezoid in North Oakland, CA; study areas are
data, so nothing in the code is specific to it. The simulation core is Rust compiled to WASM and runs in a Web Worker; the UI is
React and MapLibre.

The baseline is not yet calibrated against observed traffic, so treat results as illustrations.

## Quick start

```sh
npm install
npm run data:pull      # download study-area data from R2 (needs wrangler login)
# or, without R2 access: npm run data:fetch && npm run data
npm run dev            # Vite + local Worker
npm test               # Rust unit tests + TypeScript tests
npm run build          # WASM build, typecheck, production bundle
```

Building the WASM needs a Rust toolchain with the `wasm32-unknown-unknown` target (`npm run wasm`).

## Deploy (Cloudflare Workers Builds)

Connect the repository in the Cloudflare dashboard and set:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- R2 bucket `traffic-data`, bound to the Worker as `DATA` (see `wrangler.jsonc`)

The Worker serves the static app and reads generated study-area files from the bucket at `/data/*`.

## Repository layout

| Path | What |
| --- | --- |
| `crates/sim` | Rust simulation core (native and WASM), deterministic for a given seed |
| `src/` | React + TypeScript UI, sim worker client |
| `worker/` | Cloudflare Worker entry |
| `tools/` | Data pipeline: OSM import, demand generation, R2 sync |
| `data/` | Source extracts, provenance and calibration targets |
| `public/data/` | Generated study-area files |
| `docs/references.md` | Bibliography and citation keys |
| `openspec/` | Specs and change history |

Contributors and agents should read [AGENTS.md](AGENTS.md).

## How the model works

- Vehicles follow the Intelligent Driver Model
  ([Treiber2000], [Kesting2010]); the sim steps at 0.25 s.
- Signals use fixed-time Webster-style plans ([Webster1958]); stop-controlled
  and all-way-stop junctions use gap acceptance ([Brilon1999]); circles use
  yield-on-entry ([Rodegerdts2010]).
- Routes are chosen on travel time with iterative equilibrium assignment
  ([Wardrop1952], [Peeta2001]), so traffic reroutes when streets are closed.
- Demand is fixed: the same trips are made before and after each change. Real
  schemes also remove traffic ([Thomas2024]), which this version does not model.
- Safety is reported as surrogate indicators (speeds, time-to-collision
  conflicts; [Hayward1972], [Mahmud2017]), not crash predictions.
- Parameters and demand that are not sourced are labelled as assumptions in
  code, specs and the UI.

Keys resolve in [docs/references.md](docs/references.md), which records how each entry was verified.

## Data sources and limits

- Network and basemap: OpenStreetMap (Overpass extract). Tagging errors and missing turn restrictions carry through.
- Demand: Oakland turning-movement counts, Caltrans AADT and ramp volumes, and Census LODES commute flows, combined with
  assumed trip rates and peak factors. Counts cover few intersections, the ramp counts are from 2012, and local trip
  generation is largely assumed. See [data/demand/README.md](data/demand/README.md).
- Calibration targets: summary route shares from resident-provided select-link data, recorded as percentages only and
  only indicative. Nothing is fitted yet. See [data/calibration/README.md](data/calibration/README.md).
- Large files live in R2, not in git; see [data/README.md](data/README.md).

## Specs and changes

Non-trivial changes go through OpenSpec: propose with `npx openspec new change <name>`, write the proposal, spec deltas,
design and tasks, and validate with `npx openspec validate <name> --strict --no-interactive`.
After implementing, archive with `npx openspec archive <name> --yes`. See [AGENTS.md](AGENTS.md).

## Licence and attribution

Code is released under the licence in [LICENSE](LICENSE). Map data is (c) OpenStreetMap contributors, available under the
[ODbL](https://www.openstreetmap.org/copyright); derived network and basemap files carry the same attribution.
