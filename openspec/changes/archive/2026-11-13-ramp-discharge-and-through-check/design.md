## Context

Round 17 narrowed the 52nd St ramp gap (473 to 544 veh/h against 1,024) and named the next lead: discharge of a turn into a short exit link. Seed 1, PM peak, links 4160 (ramp), 1749 (7 m), 1662 (53 m, four lanes, marked left lane), 1652 (32 m, one lane).

## Decisions

D1. Diagnosis first. The ramp's left lane held 39 to 56 cars. Heads on the 7 m link waited for room in the marked left lane of link 1662, which held six cars (its length) at the end of red. Through lanes of 1662 stood empty during green. The left lane let through about 7 cars per 110 s cycle. The head of the lane alternated between rolling up and braking, because the room check on the exit lane failed for 3 to 9 s at a time with one or two cars in it. OSM tags (way 393902217 `turn:lanes=right|right`, way 393902204 `left|||`) match the network; no lane or turn is lost in the import.

D2. Remove the reservation. `reserved` added a vehicle's length plus 2 m to the exit lane while it crossed and the next vehicle checked the room after subtracting it. With 2 cars crossing, 13 m was held on a 32 m link before the first of them had moved. Setting it to zero (`RESERVE_EXIT_ROOM = false`, an ASSUMPTION) leaves the physical rule: the next vehicle checks the room in front of the lane tail with 2 s of leader motion credited (`NODE_CROSS_S`), and a vehicle that finds no room on emerging stays in the node (`update_transit`). Box blocking is limited by that rule and by the gridlock breaker; PM removals fell from 2.30 to 0.30 per hour.

D3. Tried and not kept: (a) crediting transit vehicles with motion at their exit speed once they have emerged, with the horizon set to the crossing time of the asking vehicle: ramp 402, removals 4.3; (b) the same plus a look-ahead of the approach time: ramp 439, removals 5.2. Both kept part of the reservation and made the network more crowded without freeing the left lane.

D4. Through check in the report. A car is through when neither trip end is in the study area (commit 0bea4af). The select-link record carries the flag. For each target with `observedVehPerHour` and a freeway share, the report prints expected through (volume times share), modeled through cars per hour and, beside them, modeled trips from or to a freeway node. The two modeled columns differ because a car with a freeway end and an end in the study area is not through.

D5. The observed block volumes are the medians of the volunteer-count blocks of each street and direction (DATA, one day, one hour).
