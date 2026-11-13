## Why

The first end-to-end run gridlocks at 100% demand, and nothing yet checks the baseline
against observation. Residents provided StreetLight select-link shares for Hillegass Ave
and Colby St (`data/calibration/rockridge.targets.json`) showing about half of that
traffic travels to or from the freeway ramps. Interventions can only be compared credibly
once the baseline reproduces today's pattern without artificial gridlock.

## What Changes

- A native calibration tool that runs the simulation headless, performs select-link
  analysis and reports modeled versus observed shares and network health.
- Importer fixes found during integration: roundabout rings collapse to one node, and
  gates that cannot be reached or left are flagged so demand never targets them.
- Demand and model parameters tuned so the baseline is stable and matches the targets
  within stated tolerances; every tuned value recorded with its before/after and reason.
- The UI states the calibration status of the baseline.

## Capabilities

### New Capabilities

- `calibration`: measuring the baseline against observed data and recording fit

### Modified Capabilities

- `street-network`: roundabout handling and gate reachability
- `demand-model`: flows restricted to reachable gate pairs

## Impact

`crates/sim` (select-link output, native CLI), `tools/` (importer, demand, calibration
runner), regenerated `public/data/*` (must be re-published to R2), UI status text.

## Out of scope

Automatic parameter optimization, mode shift and multimodal agents.
