## 1. Search

- [x] 1.1 `explore/objectives.rs`: the four objectives, their rules, eligibility, scores and the assumed constants
- [x] 1.2 Shared-cache beams per objective (`beam_search_in`, `BeamLimit`), per-objective finalists, one pooled recheck
- [x] 1.3 Residents' detour in the final comparison (paired by seed) and in screening
- [x] 1.4 Choice by objective: pools, winners, tags, folding, rest of the list; `--objectives`, `--detour-weight`, `--options 6`
- [x] 1.5 File: `objectives`, `residentsDetour`, `computed.objectives`; report: tags, detour, weight sensitivity table

## 2. App and pages

- [x] 2.1 Reader: tags, detour text, older files read as none
- [x] 2.2 Card: tag row and detour line; text pages and preview text; Methodology sentence
- [x] 2.3 Docs (`data/proposals/README.md`)

## 3. Tests and check

- [x] 3.1 Selection per objective, tags, pooling and folding, the light weight (`crates/sim/tests/objectives.rs`)
- [x] 3.2 Reader tests (`src/lib/objectives.test.ts`) and the Methodology word count
- [x] 3.3 Smoke search to a scratch output, end to end (D5)
- [x] 3.4 `cargo test -p traffic-sim`, `npx vitest run`, `npx tsc --noEmit`
- [x] 3.5 Validate, archive, merge, push
