## 1. Search

- [x] 1.1 `Figures`, `displaces_figures`, `beats_figures` and `displace_listed` in `report.rs`; `basis` and `seeds` on `Displaced`; the phrase names the seeds
- [x] 1.2 Pass after confirmation in `explore`: drop, no refill, notes, records, shortlist kept
- [x] 1.3 `confirmed.rs`: `reapply` (file) and `patch_report` (report); `explore --reapply-displacement FILE [--report FILE]`

## 2. App and docs

- [x] 2.1 `DroppedOption` type (`basis`, `seeds`); methodology step text
- [x] 2.2 `data/proposals/README.md`

## 3. Tests and check

- [x] 3.1 Pass: the p2/p3 case, goal winner kept, worst first and judged again, no drop when one removes clearly more (`crates/sim/tests/confirmed.rs`); search-time record carries its basis (`crates/sim/tests/objectives.rs`)
- [x] 3.2 Reapply on a fixture file and report (`crates/sim/tests/confirmed.rs`)
- [x] 3.3 `cargo test -p traffic-sim`, `npx vitest run`, `npx tsc --noEmit`, fingerprint unchanged
- [x] 3.4 Reapply on a copy of the 2026-11-17 file: p3 dropped, p4 and p5 renumbered, second run changes nothing
