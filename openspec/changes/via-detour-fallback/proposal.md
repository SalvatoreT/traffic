## Why

The owner opened a scenario with modal filters at Martin St and Ayala Ave and at Ayala Ave and Forest St, and diagonal diverters at 62nd St and Colby St and at 63rd St and Hillegass Ave. Asked why 63rd St got so popular, they said it did not make sense to them. A diagnosis (PM peak, seeds 1 to 3, 60 minutes) found that 63rd St rose from 1,073 to 1,556 veh/h because of the assumed-movement flows (`via`, rounds 20 and 21). The simulator makes a `via` movement whenever the movement is open and its entry link can be reached at any cost. After the diverters, the cars that must turn into Hillegass Ave from Alcatraz Ave still make that turn, find Hillegass Ave closed at 63rd St, and loop around Colby St back to Alcatraz Ave. With `via` stripped from the demand, the 63rd St rise falls to 44 veh/h.

## What Changes

- A `via` movement is made only while the route through it costs at most a tolerance times the plain route in the current network (after interventions), judged on free-flow costs. The tolerance is `via.maxDetour` in the demand file, written by the builder from the movement's `maxDetour`; 1.3 applies when absent (ASSUMPTION).
- A via flow may carry `via.alternatives`, an ordered list of other movements of the same turn family on parallel streets, chosen by the builder from config: movements with an intent of the same origin and destination groups (ASSUMPTION). When the primary fails, the driver takes the cheapest alternative that passes, else the plain route.
- A via route that passes a node twice that the plain route does not fails the check.
- The check runs at spawn and at every re-plan before the movement is made.

## Impact

- `crates/sim/src/model.rs`, `params.rs`, `sim.rs`, `tests.rs`
- `tools/lib/assumed-movements.ts`, `tools/lib/demand-fit.ts`, `tools/build-demand.ts`, `tools/assumed-movements.test.ts`
- The demand file gains `via.maxDetour` and `via.alternatives`; volumes and the network do not change. A demand file without them behaves as before except for the default tolerance and the loop rule.
