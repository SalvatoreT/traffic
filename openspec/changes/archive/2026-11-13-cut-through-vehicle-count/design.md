## Decision: count, drop distance (user, 2026-11-13)

The headline cut-through metric is a count of vehicles, not a distance. Through vehicles per hour that use any side street in the study area. Proposals are searched and ranked on that count, and distance (veh-mi, veh-km) is removed from the UI.

## Definition

A through vehicle is a car on a gate-to-gate trip. It counts once, the first time it exits a link flagged local (residential or service inside the study area) at t >= 0. A per-vehicle flag records that it was counted and is cleared when the vehicle slot is reused. A vehicle that crosses three local links counts once, a vehicle on a trip with an origin or destination inside the area counts zero, and a through vehicle that stays on arterials counts zero.

`vehicles_per_hour` is the count times 3600 divided by elapsed simulated time, with elapsed floored at 1 s. With initial loading, time zero is the end of the settle interval, so the rate is over the time the user sees. In the headless search, which starts from an empty network, it is the whole run.

Per-link cut-through flow (`cum[l][1]`, the rolling link flow) is unchanged: it counts exits per link, so one vehicle contributes to every local link it uses. It suits a single street. The area headline counts each vehicle once, so the two totals differ by design.

## Share metric

`shareOfLocalVehKm` stays distance-based: through distance on local links divided by all distance on local links. A count has no natural denominator (all local-street vehicles would mix in trips that start or end inside the area), and the share answers a different question, how much of the driving on side streets is through traffic. The UI keeps it as "Through share of side-street driving" with a note that it is by distance driven. It is not ranked or searched on. `vehKm` stays in the Rust and TypeScript metric types because `calibrate`, `initload` and tests read it. It is not shown.

## Search objective

The score keeps its form, percent reduction of the cut-through measure minus a harm weight times harm [assumption, unchanged]. The reduction is now percent change in vehicles per hour, so a package is no longer credited for making through trips shorter. Noise bands and the harm definition are unchanged. The run-to-run spread is a coefficient of variation of a count and is larger than for distance at the same flow, which widens the "within noise" test for options; the code already derives it from the baseline seeds.

## Proposals file

Version 3. `cutThrough` becomes `{baselineVehPerHour, scenarioVehPerHour, changePct}` and the group `baseline` becomes `{cutThroughVehPerHour: {period: n}}`. `byPeriod[p].cutThroughChangePct` keeps its name and now describes the count. The writer merges into a version 2 file by keeping its groups as they are under a version 3 envelope; the reader marks any group whose proposals lack the new fields as `legacy`, shows no options for it and says it is out of date. A version 1 file still reads as the unconstrained group, also marked legacy when it has the old shape. Nothing throws on an old file.

## Not decided here

No citation is added: a count of vehicles needs no published parameter. The through-routes and select-link candidate ranking already count trips and are unchanged.
