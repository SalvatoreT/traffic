## 1. Checks
- [x] 1.1 Held-out stations scored on the cross-validation demand, same seeds; gate on that figure; too few to judge is not a pass
- [x] 1.2 Derived targets marked and left out of the station rule; midday on stability only
- [x] 1.3 `--demand` and `--reuse` need `--suffix`; no through-car rows fails
- [x] 1.4 Recency summary rows keyed by weight; hard-coded observed values read from config and data; gate-station count wording
- [x] 1.5 Cross-validation demand gets the ramp split and the intent annotation; old validation assessment removed

## 2. Demand
- [x] 2.1 Fill entries not counted in a period for the trip-end scaling
- [x] 2.2 Natural flows of an assumed movement give up volume to the count
- [x] 2.3 Chained freeway links are one ramp; limitation of assumed flows from the mainline gates documented with numbers
- [x] 2.4 Alternatives for through flows only; Hillegass Ave and Colby St notes
- [x] 2.5 Movements counted below the fit minimum shown as counted

## 3. Hygiene
- [x] 3.1 Stale config keys, dead path, notes, spec text, fit report column, README
- [x] 3.2 Atomic result files; R2 sync skips symlinks and `*.tmp`

## 4. Measure
- [ ] 4.1 Rebuild, ten seeds in all periods on the final simulator, status and caveat
- [ ] 4.2 Scenario regression checks (63rd St, six filters)
