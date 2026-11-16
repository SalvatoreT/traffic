## 1. Rust

- [x] 1.1 `explore/street.rs`: run, label, expand; `ss` in the decoder and the encoder; label in `naming.rs`
- [x] 1.2 Expansion where the app builds the simulation (`wasm.rs`) and where the search runs and checks packages
- [x] 1.3 Candidates: Slow Streets in place of per-block limits; place, conflict and same-intervention rules
- [x] 1.4 `--check-singles` alone, header, one row per candidate; check flags refuse `--out` and `--report`
- [x] 1.5 Tests: run, label, expansion, link round trip, old links, candidates, places, real network, check-only

## 2. App

- [x] 2.1 `src/lib/slowstreet.ts`, the `ss` item in `hash.ts`, labels, scenario key, selection, badge, mock engine
- [x] 2.2 Editor: whole-street choice first and suggested
- [x] 2.3 Docs, intervention table, text pages, CLI JSON form
- [x] 2.4 Tests and the shared link fixture

## 3. Measure and close

- [x] 3.1 Measure single Slow Streets and the pair beside the best filter (not published; D6)
- [x] 3.2 `cargo test -p traffic-sim`, `npx vitest run`, `npx tsc --noEmit`, native and WASM parity
- [ ] 3.3 Validate, archive, merge, push
