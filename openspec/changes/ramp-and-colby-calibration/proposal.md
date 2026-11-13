## Why

The baseline was archived on 2026-11-13 with two gaps listed as known limits: the SR-24 off-ramp at 52nd St carried 473 veh/h against 1,278 counted (and the Clifton St ramp 1,527 against 972), and Colby St northbound lost its traffic before Alcatraz Ave. The user decided the same day that these two are not acceptable as limits and that work continues without waiting for new counts from them. Earlier rounds had no observed turning movements, lane use or signal timing at the 52nd St ramp and no observed travel time on Telegraph Ave. Published environmental review documents and the county's speed monitoring hold both.

## What Changes

- Peak-hour turning-movement counts at 14 intersections from two certified environmental impact reports enter the demand fit: the volume entering and leaving on each leg, the left and right turns, and, where a leg is a freeway ramp, the counted hour in place of the ramp's ADT times an assumed K.
- Observed peak-period speeds on Telegraph Ave, Shattuck Ave and College Ave from the county's level-of-service monitoring become travel-time targets that the assessment reports.
- A signal observation can give one side of a street a phase of its own. The signal at Shattuck Ave and 52nd St takes its observed cycle and greens this way.
- A crosswalk is served with the phase of the approach that runs beside it.
- A left-turn lane marked along a link holds its left-turners for the whole link, drivers sort for a turn up to 150 m ahead and keep to that side of the road, and route costs use the measured time of the vehicles that made the same movement.
- Drive-through lanes are no longer imported as streets.
- The record gets a seventeenth round with before and after figures, and the known-limits list is updated.

## Capabilities

### Modified Capabilities

- `demand-model`: published intersection counts as count stations.
- `calibration`: observed arterial travel times in the assessment.
- `traffic-simulation`: observed phases, crosswalk phase, lane choice, route costs by turn.
- `street-network`: observed signal timing by side and phase; drive-through ways.

## Impact

`tools/lib/intersection-counts.ts` (new), `tools/build-demand.ts`, `tools/lib/assess.ts`, `tools/assess.ts`, `tools/lib/signal-obs.ts`, `tools/lib/network.ts`, `crates/sim` (`eff.rs`, `sim.rs`, `sim/ped.rs`, `sim/initial.rs`, `route.rs`, `wander.rs`, `topo.rs`, `params.rs`, `model.rs`, `validate.rs`), `data/demand/rockridge.intersection-counts.json` (new), `data/demand/rockridge.config.json`, `data/areas/rockridge.json`, `data/calibration/rockridge.targets.json`, `docs/references.md`, the calibration record and READMEs. The network and demand files change, so their hashes change and the published proposals are stale until the searches are rerun.
