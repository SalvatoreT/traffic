## Why

The cut-through headline was a distance: vehicle-kilometers driven by through vehicles on local links. A distance depends on how far each car drives on side streets, so it moves when a diversion lengthens or shortens a route even if the same number of cars cut through. People ask how many cars use their street, and a count answers that. The user decided on 2026-11-13 to make the headline a count of vehicles and drop distance from the UI.

## What Changes

- The simulator counts each through vehicle (a gate-to-gate trip) once, the first time it exits a residential or service link after t = 0, and reports `cutThrough.vehicles` and `cutThrough.vehiclesPerHour`.
- The proposals search scores, ranks and reports on through vehicles per hour. **BREAKING**: the proposals JSON is version 3 and `cutThrough` carries `baselineVehPerHour` and `scenarioVehPerHour` (and the file `baseline` carries `cutThroughVehPerHour`) in place of the vehicle-mile fields.
- The UI shows "Cut-through vehicles" in veh/h and "N → M through vehicles an hour" on each proposal. The distance unit leaves user-facing copy.
- The distance-based `vehKm` and `shareOfLocalVehKm` stay in the simulator's metrics for calibration tools and tests. The UI keeps the share, relabeled as a share of side-street driving, and it is not the headline.
- The proposals reader treats groups written before the change as out of date instead of failing.

## Capabilities

### Modified Capabilities

- `traffic-simulation`: the cut-through metric requirement.
- `proposals`: the search objective and file contents.
- `simulator-ui`: the results panel and Proposals tab figures.

## Impact

`crates/sim` (`sim.rs`, `model.rs`, `explore/`), `src/lib/{metrics,format,proposals}.ts`, `src/components/Proposals.tsx`, `src/types.ts`, `src/sim/mock.ts`, fixtures and tests, `data/proposals/README.md`. `public/data/rockridge.proposals.json` is stale until the searches are rerun.
