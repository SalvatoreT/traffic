> Round 33 ran on 2026-11-16 (`data/calibration/rockridge.record-archive-*.md`). Archived late, on 2026-11-22; its requirements were merged into the specs by hand first, so the archive ran with --skip-specs.

## Why

After round 32 one junction type stands between the model and an accepted delay-feedback fit. At iteration 2 of that fit all four through-car blocks and all four headline shares are in range, and the fit fails only its removal rule (3.3 an hour). About half of those removals sit at Ashby Ave / Claremont Ave and on the hillside streets queued behind it, where the northbound Claremont Ave approach carries 314 of its 577 counted vehicles. Validation case l1 (a left-turn pocket that overflows every cycle) fails. This round checks left turns at signals as primitives first, then the phasing at Ashby Ave / Claremont Ave, and then redoes the fit.

## What changes

- Left turns at signals as primitives: new validation cases p1 to p3 (permissive left capacity against 200, 400 and 600 veh/h of opposing flow), judged against the permitted-left method of [Fambro1991] (newly verified in `docs/references.md`). The simulator's permissive left capacity is checked and a queue-first left-turn model is built as an option (`Config::queue_first_left`, `calibrate --queue-first-left`), measured and left off because the network got less stable.
- l1: its note gives the [Fambro1991] capacity beside its unchanged range; the deviation stays unreviewed.
- Phasing at Ashby Ave / Claremont Ave: a field observation relayed by the project lead (a left-turn arrow on the northbound approach) enters the area config as an observed phase without timing. The engine and the importer accept a phase observed without a timing sheet (cycle and greens by flow), generically. New validation case b13 (a protected left).
- Ashby Ave / Claremont Ave and the hillside queue re-measured on round 32's iteration-2 delay-feedback demand, seeds 1 to 20.
- `npm run data` (network changes at that one signal; demand flows and frozen split unchanged; no link renumbered); the delay-feedback fit redone to convergence under its unchanged acceptance rule; validation suite, ten seeds per period, assessment, `--od-costs`; round 33 in the calibration record and the area's `calibration` note.

## Capabilities

### New Capabilities

### Modified Capabilities

- `traffic-simulation`: an observed phase without timing; queue-first permissive left turns as an option.
- `calibration`: validation cases p1 to p3 and b13; the l1 note.

## Impact

- `crates/sim/src/sim.rs`, `params.rs`, `model.rs`, `eff.rs`, `validate.rs`, `bin/calibrate.rs`, `tests/signals.rs`: the simulator fingerprint changes; with `queue_first_left` off, runs on the same network and demand are identical to round 32. Native and WASM stay bit-identical.
- `tools/lib/signal-obs.ts`, `tools/lib/types.ts`, `tools/signal-obs.test.ts`: observations without timing.
- `data/areas/rockridge.json` (the observation, the calibration note), `public/data/*` (network), `data/calibration/*` (validation, deviations, cost loop, record, assessment), `docs/references.md` ([Fambro1991], [FHWA-STM2008] section 4.8.4).
