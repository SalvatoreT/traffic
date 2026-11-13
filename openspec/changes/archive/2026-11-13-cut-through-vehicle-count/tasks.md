## 1. Simulator
- [x] 1.1 Count each through vehicle once on its first local-link exit; expose `vehicles` and `vehiclesPerHour`
- [x] 1.2 Rust tests: three local links count once, non-through counts zero, arterial-only counts zero, determinism

## 2. Search and file
- [x] 2.1 Objective, harm reporting, per-period change, JSON and report on vehicles per hour
- [x] 2.2 Proposals file version 3; merge keeps version 2 groups; update `data/proposals/README.md`

## 3. UI
- [x] 3.1 Results row in veh/h, share relabeled, definition note, drop the distance unit
- [x] 3.2 Proposal detail line, legacy group handling, fixtures and TS tests

## 4. Specs
- [x] 4.1 Delta specs, validate, archive after `npm test` and `npm run build`
