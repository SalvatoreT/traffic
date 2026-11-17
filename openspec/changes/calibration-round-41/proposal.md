## Why

After round 40 Colby St NB is the one through figure clearly above its range (150.6 on twenty seeds against 102 to 145). The excess joins Colby St from Forest St, where the simulator sends 86 cars an hour against 57 counted, though that turn is already a fit station: the fit counts it on its own static routes.

## What Changes

- `calibrate --select-od` also writes the origin-destination pairs of every movement and route station.
- Movement stations named in `countFit.throughTargets.measuredStations` take their membership from simulated trips, like the through targets.
- The four counted movements at Claremont Ave / Colby St / Forest St are tested that way under the frozen rails; kept only if the through distance falls on twenty seeds.
- Round 41 in the calibration record, with 62nd St and Forest St eastbound reported.

## Capabilities

### New Capabilities

### Modified Capabilities

- `demand-model`: named movement stations can take simulated membership.

## Impact

- `crates/sim/src/bin/calibrate.rs` (report binary only; the engine and fingerprint are unchanged), `tools/lib/demand-fit.ts`, `tools/lib/through-membership.ts`, `tools/through-membership.ts`, `tools/build-demand.ts`; the demand config and membership file if kept.
