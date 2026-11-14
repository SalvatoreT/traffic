## Context

PM peak, ten seeds. Before: network c05a22fc9ebe8816, demand 7f462d0790a61860.

## Decisions

D1. What the data supports. The volunteer count gives cars that drove the whole street (PM: Colby NB 102, SB 39, Hillegass NB 48, SB 79) and cars whose trip ended along it (29, 43, 15, 40). The first is a lower bound on through cars (a whole-street car enters at Claremont Ave and leaves at Alcatraz Ave, both outside the study area). The block volume less the second is an upper bound. Observed volume times freeway share (52, 82, 109, 72 expected in round 18) counts freeway trips that end inside the study area, so it is the observed freeway-end trips and not a through count. Observed ranges: Hillegass NB 48 to 95, Colby NB 102 to 145, Hillegass SB 79 to 120, Colby SB 39 to 117.

D2. Are the model's local-end freeway trips plausible. Before this change 838 PM destinations and 951 origins sat at study-area nodes and 72% and 80% of them paired with a freeway node. The highest observed freeway share on any counted block is 68%, on streets chosen because they lead to the ramps, so a share of 72 to 80% of all study-area ends is too high. The total of the ends is plausible: [PBC-TripRates2022] gives 0.94 PM peak trips per detached dwelling, so 1,789 ends need about 1,900 dwellings, and the study area has 1,368 resident workers (LODES, 0.53 km2). The count-implied ends were an upper bound because only the counted streets were subtracted as through; with the through share extended (D4) the ends are 1,621. Dwellings are not in the data held (an API key is needed for 2020 block housing units).

D3. Side rule. A block loads only nodes whose `inStudyArea` flag equals whether its centroid is in the study polygon, within the spread radius, else the nearest such node. Before, blocks across Alcatraz Ave loaded the boundary corners and were then scaled up with the study area's blocks (offered ends 263 and 216 before, 174 and 132 after the rule). Through cars on the four blocks rose from 42, 43, 34, 67 to 58, 78, 56, 115.

D4. Extended through. ASSUMPTION: entries of Martin St, Forest St, 60th St and Dana St take the 45% through share the counted streets show (Martin St in the AM peak shows 48%). Telegraph Ave and College Ave entries are left at zero through.

D5. Fit weights. Raising the route-share weight from 0.5 to 1.5 brought the static shares within 10 points; 3 changed little. Whole-street count weight 1.

D6. Tried and not kept. (a) Cap of the freeway pairing of study-area ends at 0.5 and 0.7: headline shares fell to 38 / 35 / 53 / 30 and 39 / 44 / 52 / 31, through cars fell, removals 0.1 and 0.8. (b) Router cost factor of residential links 1.0 or 1.1 in the simulator on the old demand: shares 50 / 64 / 52 / 52, but removals 1.3 and 1.2 per hour. (c) Measured link delays in the fit, one iteration: 52nd St ramp 802 and Clifton St 956 veh/h, removals 0.1, but shares did not improve; with the heavier share weight removals were 5.8 per hour.

D7. Ramp split diagnosis. With the router's free-flow costs, flows from the freeway gates put 1,014 veh/h on the 52nd St ramp and 729 on Clifton St (static fit: 1,039 and 730). Adding the simulator's measured link delays moves 232 veh/h from 52nd St to Clifton St, giving 785 and 951 against 706 and 990 simulated. The split is the delay on the 52nd St side, not a shared gate.

D8. Colby NB left turn. The movement costs 19.9 s in the router. Of 6,019 veh/h of freeway-origin flows that can use it, 5,466 would cost more than 40% above their best route; 128 veh/h are within 10% with measured delays. The fit cannot raise a movement that almost no flow can reach. Residential factor 1.0 does not change it (9 veh/h).
