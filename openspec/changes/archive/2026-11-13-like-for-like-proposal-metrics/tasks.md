## 1. Simulator and search
- [x] 1.1 `Simulation::cut_through_exits`; `RunOut.through` over the post-warm-up window
- [x] 1.2 Per-block through flow and spread in `PeriodStat`
- [x] 1.3 `through_harm`, `PeriodRes`, per-period all-traffic figures, through-car summary sentence
- [x] 1.4 JSON version 4 (`harm.through`, `byPeriod[p].cutThrough` and `allTraffic`); merge keeps versions 2 to 4
- [x] 1.5 Markdown report: named columns, per-period all-traffic table
- [x] 1.6 Rust tests

## 2. App
- [x] 2.1 Types, reader marks older groups `legacy`
- [x] 2.2 Card: two through-car figures with definitions; no-gain wording
- [x] 2.3 Details: through table, all-traffic table, split sentence computed from the data
- [x] 2.4 Proposals intro says the search penalizes all traffic
- [x] 2.5 Labels in Results, Streets table, legend, export caption, legend help
- [x] 2.6 TS tests

## 3. Docs and specs
- [x] 3.1 `data/proposals/README.md`
- [x] 3.2 Delta specs, validate, archive after `npm test` and `npm run build`
