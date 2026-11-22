> Round 34 ran on 2026-11-16 (`data/calibration/rockridge.record-archive-*.md`). Archived late, on 2026-11-22; its requirements were merged into the specs by hand first, so the archive ran with --skip-specs.

## Why

Round 33 modeled the resident field observation at Ashby Ave / Claremont Ave ("Claremont northbound has a left-turn arrow") as a protected left phase added to a flow-based plan. That added a third phase, took green from Ashby Ave and left the gridlock of the delay-feedback fit at this junction and on the hillside streets behind it. The lead's reading: the observation and the 2010 PM worksheet in [SafewayCollege-DEIR2011] agree. The worksheet runs the two Claremont Ave approaches as split phases, and under split phasing every movement of the approach, the left included, runs on a green arrow with no opposing traffic. So the junction is the worksheet's split-phase plan, which round 33 tried only together with the experimental queue-first left-turn model. This round enters that plan on the default engine, checks whether the queue-first model now holds on the network, and redoes the fit.

## What changes

- Ashby Ave / Claremont Ave: the worksheet's observed plan replaces the phasing-only observation. Claremont Ave northbound and southbound are split phases, 17.0 s and 17.5 s with 4.5 s of clearance each; Ashby Ave has one phase of 50.5 s with 6.0 s of clearance, permitted lefts; cycle 100 s. Northbound is coded with no left-turn lane, as in the worksheet. PM is DATA (2010); AM and midday reuse the PM plan as an ASSUMPTION, the convention of the other observed plans without a worksheet for the period.
- Engine and importer, generically: an observed approach may carry its own clearance interval, so a plan whose phases have different clearances (as Synchro worksheets often do) holds its cycle. An observation may say the approach has no left-turn lane, and the simulator then adds no class-rule pocket there.
- The queue-first left-turn model is rerun on the shipped and iteration demand and switched on only if gridlock clearing does not get worse on either demand on both seed sets.
- The delay-feedback fit is redone to convergence under its unchanged acceptance rule.
- serde_json's `float_roundtrip` feature: reports that `calibrate --seeds` rewrites are byte-identical to a solo run.
- Evaluation and round 34 in the calibration record and the area's `calibration` note.

## Capabilities

### New Capabilities

### Modified Capabilities

- `traffic-simulation`: per-phase clearance from an observed timing; no class-rule pocket on an approach observed to have no left-turn lane.
- `street-network`: the importer carries a per-approach clearance and the no-left-turn-lane coding from `signalObservations`.

## Impact

- `crates/sim/src/model.rs`, `eff.rs`, `topo.rs`, tests; `crates/sim/Cargo.toml` (`float_roundtrip`). The simulator fingerprint changes; on a network without the new fields, runs are identical to round 33.
- `tools/lib/signal-obs.ts`, `tools/lib/types.ts`, `tools/signal-obs.test.ts`.
- `data/areas/rockridge.json` (the observed plan, the calibration note), `data/areas/README.md`, `public/data/*` (network, demand), `data/calibration/*` (validation, cost loop, record, assessment).
