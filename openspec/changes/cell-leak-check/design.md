## Context

Chosen by the user on 2026-11-12 from the simulator audit (`docs/simulator-audit.md`,
entry I1). The idea comes from A/B Street's low-traffic-neighborhood tool
[ABStreet-Docs] and from UK design guidance, which describes the same test done by hand
[WWC-LTN-Guide]. It is described here from their documentation; no code was consulted.

## Decisions

### D1 Perimeter and interior come from the area data
The perimeter is the set of bounding streets in the area file plus any street of a
higher class than residential that crosses the study area. Interior streets are the
residential and service blocks inside. Nothing is specific to one neighborhood.

### D2 Cells
A cell is a set of interior blocks a car can drive between without touching the
perimeter, given the current filters, diverters, one-ways and turn bans. Cells are shown
as tinted groups of streets with a non-color cue.

### D3 What counts as a through route
A route that enters the interior from one perimeter street and leaves onto a different
one, or onto the same one at a point far enough along that it works as a bypass, staying
on interior streets. Both movements the guidance names are covered: straight through,
and cutting a corner between adjacent perimeter streets. Routes are found per pair of
entry and exit points and merged when they share most of their length, so the list
stays short. Each is described by the streets it uses.

### D4 A screening aid, and labeled as one
The check ignores congestion and demand, so it can flag routes few drivers would use and
it says nothing about volumes. The UI says so in one sentence and keeps the simulated
results as the measure of effect.
