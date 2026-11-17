## 1. Search

- [x] 1.1 Detour goal: floor and lowest detour with paired ties; remove the weight, its table, the flag and the JSON field
- [x] 1.2 Beam ranking for the detour goal above and below the floor
- [x] 1.3 Displacement rule, drops recorded in `computed.displacement` and the report
- [x] 1.4 `pictureAll` in the final comparison, the file and `--annotate`

## 2. App

- [x] 2.1 Tag label "least detour for residents" and its test
- [x] 2.2 Reader: `pictureAll` type and validation; street panel, hover tip and "Streets that change" show all cars; old wording when absent
- [x] 2.3 Docs (`data/proposals/README.md`)

## 3. Tests and check

- [x] 3.1 Selection: detour rule, paired ties, floor, beam value, displacement (`crates/sim/tests/objectives.rs`)
- [x] 3.2 Writer: `pictureAll` shape, scope and agreement with `picture`; annotate reproduces it (`crates/sim/tests/explore.rs`)
- [x] 3.3 Reader tests (`src/lib/proposal-map.test.ts`, `src/lib/picture.test.ts`, `src/lib/objectives.test.ts`)
- [x] 3.4 Smoke search to a scratch output (pm_peak, seeds 1-3, confirmation 101-103, 6 min runs, beam 2, depth 2, 10 candidates, `--no-known`): `pictureAll` is 1.9 KB per proposal against 1.7 KB for `picture` (128 links against 120), so the 87 KB published file would grow by about 13 KB, to about 100 KB
- [x] 3.5 `cargo test -p traffic-sim`, `npx vitest run`, `npx tsc --noEmit`
