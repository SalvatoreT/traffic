> Round 38 ran on 2026-11-17 (`data/calibration/rockridge.record-archive-*.md`). Archived late, on 2026-11-22; its requirements were merged into the specs by hand first, so the archive ran with --skip-specs.

## Why

On 2026-11-16 the project lead kept the current model: the delay-feedback refit is not adopted and the entry-backlog check stays network-wide. The refit reached the cut-through ranges partly by sending too little traffic toward the study area (Telegraph Ave at Alcatraz Ave, north leg, 763 veh/h against 1,064 counted) and by leaving 370 to 460 trips waiting at far entries. This round goes after two measurable errors in the shipped model instead. Telegraph Ave carries 1,307 veh/h at the Alcatraz Ave north leg, a fitted station counted at 1,064. And about 143 to 206 trips per PM seed are still waiting at the SR-24 mainline gate at the end of the hour.

## What changes

- Diagnosis of the Telegraph Ave excess, link by link: the demand fit's assigned flows against the simulator's ten-seed flows, plus checks of en-route guidance, signal coordination and assumed movements. The same trips are reassigned on the fit's cost model with the simulator's measured delays (all of them, half of them, or only those in and around the judged zone).
- `countFit.assignment.measured.weight`: an optional damping weight on the measured delays in the fit's link costs (default 1, so builds without it are unchanged). A demand built with half the measured delays is tested under the unchanged rules and kept only if validation and the network both improve on both PM seed sets.
- SR-24 mainline gate: diagnosis of the waiting trips. Candidate engine fix: a trip waiting at a gate waits only behind trips with the same first and next link, so trips bound for a free branch no longer queue behind ones held by a full branch. It comes with validation cases for a 3-lane gate link and a forking gate link. The fix changes the simulator fingerprint and lands only if it measurably helps.
- Evaluation of the resulting shipped model, recorded as round 38.

## Capabilities

### New Capabilities

### Modified Capabilities

- `demand-model`: measured link delays can enter the fit's costs with a weight below 1.

## Impact

- `tools/lib/demand-fit.ts`, `tools/build-demand.ts`; possibly `crates/sim/src/sim.rs`, `crates/sim/src/params.rs`, `crates/sim/src/validate.rs`.
- The calibration record, `data/areas/rockridge.json` (`calibration` note and caveat), the assessment.
- The decisions of 2026-11-16 are recorded in `design.md`.
