## 1. Foundation
- [x] 1.1 AGENTS.md, CLAUDE.md, OpenSpec init and config
- [x] 1.2 Vite + React + Cloudflare Worker scaffold, npm scripts
- [x] 1.3 Rust workspace, `crates/sim`, wasm-pack build wired into `npm run build`
- [x] 1.4 Verified bibliography in `docs/references.md`

## 2. Street network
- [x] 2.1 OSM extract with provenance in `data/osm`
- [x] 2.2 Importer → `public/data/rockridge.network.json` and basemap GeoJSON
- [x] 2.3 Importer tests (connectivity, control derivation, gates)

## 3. Demand
- [x] 3.1 Collect public counts / LODES for the area
- [x] 3.2 Demand generator → `public/data/rockridge.demand.json` with provenance

## 4. Simulation core
- [x] 4.1 Network, routing, demand spawning
- [x] 4.2 IDM car-following, ballistic update
- [x] 4.3 Intersection control and gap acceptance
- [x] 4.4 Dynamic re-routing
- [x] 4.5 Interventions
- [x] 4.6 Metrics
- [x] 4.7 WASM bindings
- [x] 4.8 Unit and scenario tests

## 5. UI
- [x] 5.1 Map, vehicle and signal rendering, overlays
- [x] 5.2 Sim Web Worker and playback controls
- [x] 5.3 Intervention editor
- [x] 5.4 Baseline comparison
- [x] 5.5 Accessibility pass, data table, sources page

## 6. Ship
- [x] 6.1 End-to-end check in a browser
- [x] 6.2 README
- [x] 6.3 Archive change
