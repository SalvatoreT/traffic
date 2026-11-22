## ADDED Requirements

### Requirement: Route choice on perceived costs drawn once per driver
A car SHALL choose and re-plan its route as the shortest path on its own perceived costs. Each arc (a trip's first link, or a movement with the link it enters) SHALL be perceived as normal with mean its current cost and variance `ROUTE_DISPERSION_S` times that cost, truncated at zero [DaganzoSheffi1977], [Sheffi1985]. Each arc's deviate SHALL be fixed for the trip and derived from the driver's seed and the arc.

#### Scenario: Paired and native and WASM runs
- **WHEN** the same driver asks for a route in a native and a WASM run, or in a baseline and a scenario run on the same costs
- **THEN** it perceives every arc the same way

#### Scenario: Dispersion is an assumption
- **WHEN** no source gives a dispersion for urban street networks
- **THEN** `ROUTE_DISPERSION_S` is labeled ASSUMPTION and `Config::route_dispersion` can override it

#### Scenario: Equal routes with different numbers of junctions
- **WHEN** two routes of equal cost lead from an origin to a destination and one offers a side link onto the other at each of 20 junctions, each side link costing 2.5 standard deviations of the perceived difference more
- **THEN** between 45% and 55% of drivers stay on the route with the junctions (validation case r2)

#### Scenario: A costlier route
- **WHEN** two routes with no link in common differ in cost by d
- **THEN** the share on the costlier route is within 0.03 of Phi(-d / sqrt(dispersion x (cA + cB))) (validation cases r3 to r6)

#### Scenario: The same driver twice
- **WHEN** a driver with the same seed asks for a route twice on the same costs
- **THEN** it gets the same route

## MODIFIED Requirements

### Requirement: Drivers keep their route unless an alternative is clearly better or the route is blocked
A car SHALL choose its route at departure from current measured link times and afterwards change it only when the route is blocked, or when it follows live guidance and an alternative is cheaper than the remaining route by more than the indifference band. Costs use current link times perceived with the driver's own perception error, drawn once for the trip (route choice on perceived costs). The guidance share (`Config::guided_share`, [Guin2021]) replaces any flat re-route share; the band and limits are ASSUMPTIONS in `params.rs`.

#### Scenario: Near-equal routes
- **WHEN** a driver following guidance faces an alternative cheaper by less than the band or the absolute floor
- **THEN** it keeps its route at every epoch

#### Scenario: Clearly better route
- **WHEN** an alternative without backtracking is cheaper by more than the band and the floor
- **THEN** the driver switches once and does not switch again within the minimum gap, and never more than the cap

#### Scenario: Backtracking
- **WHEN** the only cheaper alternative reverses onto the link just left or revisits a node of the trip and the current route is open
- **THEN** the driver keeps its route; if the route is closed the driver may backtrack

#### Scenario: Blocked route
- **WHEN** an intervention closes a link on the remaining route of a car, or its next link has had no room for the blocked-wait limit
- **THEN** the car re-plans, guided or not, and cars whose route is unaffected keep theirs
