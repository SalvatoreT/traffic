## Context

Decisions made with the user on 2026-11-11:

| Question | Decision |
| --- | --- |
| Study area | Rockridge Trapezoid: Telegraph (W), College (E), Claremont (S), Alcatraz (N) |
| Focus | Cut-through traffic and safety first |
| Modes | Fully multimodal wanted for v1; staged, with vehicles here and peds/bikes/buses in the next change |
| Interventions | Modal filters, traffic calming, signal & stop control, one-way / turn restrictions |
| Demand | Public data, calibrated; assumptions documented |
| Stack | TypeScript UI + Rust/WASM simulation core (Leptos end-to-end and all-TS rejected) |
| Hosting | Cloudflare Workers |
| Process | OpenSpec cycle run automatically; delegate to Sonnet/Haiku where possible |

## Decisions

### D1 Rust core, TS UI
The sim core is a Rust crate (`crates/sim`) with no I/O, built natively for tests/batch
calibration and to WASM (wasm-bindgen via `wasm-pack --target web`) for the browser, where
it runs in a Web Worker. UI is React + MapLibre GL. Leptos lost because the map and
accessible-component ecosystem is JS-native, and all-TS lost on determinism, speed and
scaling to larger regions.

### D2 Microscopic, time-stepped model
Individual vehicles on directed links, fixed step Δt = 0.25 s, ballistic update
[Treiber2015]. Car-following: IDM [Treiber2000, Treiber2013] with per-driver parameters
drawn from urban-calibrated ranges. It is microscopic rather than meso or macro because the questions
(cut-through on specific blocks, speeds past homes, conflicts) are block-level, and people
need to see vehicles.

### D3 Intersections
Each node has a control type. Signals: fixed-time plans from Webster's method
[Webster1958] as baseline. Stop/yield/uncontrolled and turning conflicts: gap acceptance
with critical gap / follow-up headway [Brilon1999, HCM7]. Traffic circles: gap acceptance
on entry plus reduced negotiation speed [Rodegerdts2010]. A vehicle approaching a node
treats a closed stop line as a standing leader in IDM.

### D4 Route choice produces cut-through
Routes are time-shortest paths on generalized cost; link costs are updated from simulated
travel times and a share of drivers re-route periodically, approximating iterative
equilibrium [Wardrop1952, Peeta2001] and navigation-app behavior. The model measures cut-through instead of assuming it: a trip whose origin and destination are both boundary gates, counted on links
of class residential/service inside the study area.

### D5 Demand as a generic OD list
The sim consumes `{origin node, destination node, veh/h}` flows and spawns Poisson
arrivals. How the list is built (counts + LODES gravity model) lives in `tools/`, so other
areas can use other sources. Demand is inelastic in this change; evaporation evidence
[Thomas2024] is surfaced as a caveat in the UI until elasticity is modeled.

### D6 Safety metrics
Speed distributions on residential links, share of vehicles above 20/25 mph, and
surrogate conflicts by time-to-collision threshold [Hayward1972, Mahmud2017]. They are reported as
surrogates and are not crash predictions.

### D7 Basemap without a tile server
The basemap renders from the same OSM extract as GeoJSON layers in MapLibre. That needs no tile
hosting, makes no third-party requests at runtime, and keeps the payload tiny for a neighborhood. Revisit
(PMTiles on R2) when generalizing to large areas.

### D8 Study areas are data
`public/data/<area>.network.json`, `<area>.demand.json`, `<area>.basemap.json` plus an
area manifest. No area-specific code.

## Contracts

### Network file (`version: 1`)
Coordinates are meters in a local equirectangular projection about `origin`
(x east, y north). Links are directed; a two-way street is two links.

```ts
interface Network {
  version: 1; id: string; name: string;
  origin: { lon: number; lat: number };
  bbox: [minLon: number, minLat: number, maxLon: number, maxLat: number];
  studyArea: [lon: number, lat: number][];      // closed polygon
  nodes: Node[]; links: Link[];                  // ids are array indices
}
interface Node {
  id: number; osmId: number; x: number; y: number;
  control: 'signal' | 'all_way_stop' | 'two_way_stop' | 'uncontrolled' | 'traffic_circle';
  gate: boolean;        // model boundary: trips enter/leave here
  inStudyArea: boolean;
}
interface Link {
  id: number; osmWayId: number; from: number; to: number; reverse: number | null; // id of opposite-direction link
  name: string;
  class: 'motorway' | 'primary' | 'secondary' | 'tertiary' | 'residential' | 'service';
  lanes: number;        // in this direction
  speedLimit: number;   // m/s
  length: number;       // m
  geometry: [x: number, y: number][];   // from → to, ≥ 2 points
  stopAtEnd: boolean;   // stop sign faces this approach
  humps: number[];      // positions (m from start) of speed humps/bumps
  inStudyArea: boolean;
}
```

### Demand file
```ts
interface Demand {
  version: 1; area: string;
  periods: { id: string; label: string; flows: { origin: number; destination: number; vehPerHour: number }[] }[];
  provenance: { source: string; url: string; note: string }[];
}
```

### Interventions (scenario = ordered list)
```ts
type Intervention =
  | { type: 'modal_filter'; link: number }            // closes link and its reverse to motor vehicles
  | { type: 'modal_filter'; node: number }            // no motor through-movement at node
  | { type: 'speed_limit'; link: number; speed: number }   // m/s, applies to both directions
  | { type: 'speed_hump'; link: number; position: number }
  | { type: 'traffic_circle'; node: number }
  | { type: 'control'; node: number; control: Node['control'] }
  | { type: 'signal_timing'; node: number; cycle: number }  // s; splits re-derived by Webster
  | { type: 'one_way'; link: number }                 // keeps this link, closes its reverse
  | { type: 'turn_ban'; fromLink: number; toLink: number };
```

### WASM API (`crates/sim`, JS class `Simulation`)
```
new Simulation(networkJson: string, demandJson: string, configJson: string)
   config: { seed: number, period: string, demandScale: number }
setInterventions(json: string): void       // replaces the scenario; reroutes affected trips
step(seconds: number): void                // advances in fixed 0.25 s steps
time(): number
vehicles(): Float32Array                   // stride 6: x, y, heading(rad), speed(m/s), kind, flags(bit0 = cut-through)
signals(): Uint8Array                      // per link: 0 n/a, 1 green, 2 yellow, 3 red (state at link end)
linkStats(): Float32Array                  // stride 4 per link: flow veh/h, mean speed m/s, cut-through veh/h, density veh/km
metrics(): string                          // JSON, see traffic-simulation spec
reset(): void
```
