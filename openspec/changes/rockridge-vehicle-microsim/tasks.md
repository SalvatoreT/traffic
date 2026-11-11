## 1. Foundation
- [ ] 1.1 AGENTS.md, CLAUDE.md, OpenSpec init and config
- [ ] 1.2 Vite + React + Cloudflare Worker scaffold, npm scripts
- [ ] 1.3 Rust workspace, `crates/sim`, wasm-pack build wired into `npm run build`
- [ ] 1.4 Verified bibliography in `docs/references.md`

## 2. Street network
- [ ] 2.1 OSM extract with provenance in `data/osm`
- [ ] 2.2 Importer → `public/data/rockridge.network.json` and basemap GeoJSON
- [ ] 2.3 Importer tests (connectivity, control derivation, gates)

## 3. Demand
- [ ] 3.1 Collect public counts / LODES for the area
- [ ] 3.2 Demand generator → `public/data/rockridge.demand.json` with provenance

## 4. Simulation core
- [ ] 4.1 Network, routing, demand spawning
- [ ] 4.2 IDM car-following, ballistic update
- [ ] 4.3 Intersection control and gap acceptance
- [ ] 4.4 Dynamic re-routing
- [ ] 4.5 Interventions
- [ ] 4.6 Metrics
- [ ] 4.7 WASM bindings
- [ ] 4.8 Unit and scenario tests

## 5. UI
- [ ] 5.1 Map, vehicle and signal rendering, overlays
- [ ] 5.2 Sim Web Worker and playback controls
- [ ] 5.3 Intervention editor
- [ ] 5.4 Baseline comparison
- [ ] 5.5 Accessibility pass, data table, sources page

## 6. Ship
- [ ] 6.1 End-to-end check in a browser
- [ ] 6.2 README
- [ ] 6.3 Archive change
