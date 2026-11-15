# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 25105 veh/h x scale 1 = 25105 veh/h. Run took 26.0 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 8 | FAIL |
| Backlog / spawned | < 2% | 0.2% (49 of 25371) | pass |
| Arterial mean speed (run) | > 4 m/s | 7.90 m/s (last 15 min 7.56) | pass |

Overall: **NOT STABLE**. Mean trip delay 182 s, mean trip time 440 s, completed 24727, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2961 | 18 | 2102 | 0 | 8.62 |
| 10 | 2957 | 27 | 4170 | 0 | 7.99 |
| 15 | 3101 | 10 | 6144 | 0 | 8.12 |
| 20 | 3198 | 7 | 8196 | 1 | 8.39 |
| 25 | 3146 | 10 | 10327 | 2 | 8.32 |
| 30 | 3225 | 22 | 12415 | 3 | 8.17 |
| 35 | 3281 | 8 | 14497 | 3 | 7.41 |
| 40 | 3278 | 10 | 16518 | 3 | 7.43 |
| 45 | 3246 | 7 | 18621 | 3 | 7.95 |
| 50 | 3312 | 13 | 20653 | 3 | 7.80 |
| 55 | 3515 | 15 | 22677 | 7 | 7.49 |
| 60 | 3629 | 49 | 24727 | 8 | 7.38 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 22535 | 0.05 | 4.4% | 1.099 | 1.062 | 5.8% | 0.0% | 1.038 | 2.7% | 0.0% | 5.7% | 2506 | 11.9% |
| gate to gate | 8033 | 0.07 | 7.0% | 1.103 | 1.075 | 4.9% | 0.0% | 1.041 | 2.5% | 0.0% | 9.1% | 542 | 14.8% |
| with a local end | 14502 | 0.03 | 2.9% | 1.096 | 1.056 | 6.4% | 0.0% | 1.036 | 2.8% | 0.0% | 3.8% | 1964 | 11.1% |
| guided drivers | 10346 | 0.09 | 8.7% | 1.098 | 1.060 | 5.8% | 0.0% | 1.037 | 2.5% | 0.0% | 5.8% | 1171 | 11.4% |
| other drivers | 12189 | 0.01 | 0.7% | 1.099 | 1.063 | 5.9% | 0.0% | 1.038 | 2.8% | 0.0% | 5.7% | 1335 | 12.4% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (558 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1639 | 40.2 | 7% |
| freeway to the surface gates | 1118 | 37.2 | 7% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1348 | 4% | 18% | 78% | 0.2 |
| Hillegass Avenue | College Avenue | 3 | S | 1552 | 6% | 20% | 75% | 0.2 |

## Per-mode results

Offered: 25105 car veh/h; 626 bicycle flows (764/h); 2000 pedestrian flows (1731/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 3629 | 24727 | 440 | |
| Bicycle | 61 | 791 | 266 | |
| Pedestrian | 197 | 1669 | 434 | mean crossing delay 8.1 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 277, bicycle conflicts 1119, close passes 669, pedestrian injury severity mean 0.041 (AIS4+, 10686 supported of 10686 encounters), cyclist injury severity mean 0.067 (MAIS3+F, 3819 supported of 7394 encounters) (separate endpoints, never summed), mean vehicle speed at pedestrian encounters 2.21 m/s.


## Through cars on the counted blocks (a car is through when neither trip end is in the study area)

Observed through range = from the cars that drove the whole street (volunteer count, a lower bound) to the block volume less the cars whose trip ends along the street (an upper bound). Observed freeway-end trips = observed block volume times the observed freeway share of the street (the headline share of the targets file); these include freeway trips that end inside the study area, so they are not an expected through count. Modeled through = select-link trips with no end in the study area, per hour. Modeled freeway = select-link trips from or to a freeway node, per hour.

| Block | Observed volume (veh/h) | Observed freeway share | Observed freeway-end trips (veh/h) | Observed through range (veh/h) | Modeled through (veh/h) | In range | Modeled freeway trips (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | 110 | 47.0% | 52 | 48 to 95 | 94 | yes | 138 |
| Colby Street NB | 174 | 47.0% | 82 | 102 to 145 | 154 | above | 140 |
| Hillegass Avenue SB | 160 | 68.0% | 109 | 79 to 120 | 160 | above | 142 |
| Colby Street SB | 160 | 45.0% | 72 | 39 to 117 | 184 | above | 116 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 1 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 154 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 64 | above |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 46 | above |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 16 | above |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 24 | above |
| Intents listed, together | | 101 (71 to 131) | 150 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 17 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 64.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 19.0 | Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 18.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 12.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 11.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 6.0 | none near the study area |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 6.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 4.0 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 3.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 3.0 | SR-24 then Claremont Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | San Pablo Ave (Emeryville and West Oakland) | 2.0 | Claremont Avenue then Alcatraz Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.0 | Telegraph Avenue |
| other pairs | | 5.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 104 veh/h; Claremont Avenue then College Avenue 19 veh/h; Claremont Avenue 17 veh/h; none near the study area 7 veh/h; SR-24 then Claremont Avenue then College Avenue 3 veh/h; Claremont Avenue then Alcatraz Avenue 2 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 94 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 17 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 38 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 7 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 26 | above |
| Intents listed, together | | 43 (20 to 68) | 88 | |
| Other through cars (no intent listed) | | | 6 | |

Model through cars by origin and destination group (largest 12 of 22 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 22.0 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 12.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 9.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 8.0 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 8.0 | SR-24 then Claremont Avenue then College Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.0 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 4.0 | SR-24 then Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | San Pablo Ave (Emeryville and West Oakland) | 3.0 | College Avenue then Alcatraz Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 3.0 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 3.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 2.0 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Claremont Avenue |
| other pairs | | 12.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 31 veh/h; SR-24 24 veh/h; Claremont Avenue 8 veh/h; SR-24 then Claremont Avenue 8 veh/h; SR-24 then Claremont Avenue then College Avenue 8 veh/h; SR-24 then Telegraph Avenue 6 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 160 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 40 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 56 | within |
| Intents listed, together | | 87 (78 to 110) | 96 | |
| Other through cars (no intent listed) | | | 64 | |

Model through cars by origin and destination group (largest 12 of 19 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 40.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 29.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 19.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 18.0 | Alcatraz Avenue then College Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 15.0 | College Avenue then Claremont Avenue then SR-24 |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.0 | Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 8.0 | College Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.0 | College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Alcatraz Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 2.0 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | San Pablo Ave (Emeryville and West Oakland) | 2.0 | Claremont Avenue then Alcatraz Avenue |
| other pairs | | 9.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 90 veh/h; Alcatraz Avenue then College Avenue 20 veh/h; College Avenue then Claremont Avenue then SR-24 15 veh/h; College Avenue 12 veh/h; Claremont Avenue then SR-24 10 veh/h; Claremont Avenue 5 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 184 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 14 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 28 | above |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 39 | above |
| Intents listed, together | | 46 (39 to 72) | 81 | |
| Other through cars (no intent listed) | | | 103 | |

Model through cars by origin and destination group (largest 12 of 26 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 47.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 23.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 14.0 | Alcatraz Avenue then College Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.0 | Claremont Avenue then SR-24 |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.0 | none near the study area |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 10.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.0 | Telegraph Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 9.0 | College Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.0 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 5.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 4.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 4.0 | none near the study area |
| other pairs | | 26.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 99 veh/h; none near the study area 31 veh/h; Alcatraz Avenue then College Avenue 17 veh/h; Claremont Avenue then SR-24 12 veh/h; College Avenue 9 veh/h; SR-24 6 veh/h.

### Study area, all residential and service streets

Model: 965 through cars per hour.

Model through cars by origin and destination group (largest 12 of 74 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 135.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 93.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 74.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 67.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 47.0 | Claremont Avenue then College Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 47.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 47.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 40.0 | Claremont Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 32.0 | Alcatraz Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 32.0 | Telegraph Avenue then Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | SR-24 westbound on-ramps (toward Oakland and I-980) | 29.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 26.0 | Telegraph Avenue |
| other pairs | | 296.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 553 veh/h; none near the study area 86 veh/h; Claremont Avenue 79 veh/h; Claremont Avenue then College Avenue 47 veh/h; Alcatraz Avenue then College Avenue 36 veh/h; SR-24 32 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 260; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 177; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 137; Telegraph Ave from the north (Berkeley) 99; West Oakland to the southwest (Adeline St, Market St) 49; Ashby Ave from the west (Emeryville and I-80) 47; Telegraph Ave to the south (downtown Oakland) 47; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 33; Claremont Ave and Tunnel Rd toward the hills 26; Emeryville and West Oakland streets (55th to 67th Streets) 25.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 247; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 239; Telegraph Ave from the north (Berkeley) 134; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 124; Claremont Ave and Tunnel Rd toward the hills 49; College Ave from the north (Berkeley) 45; Emeryville and West Oakland streets (55th to 67th Streets) 43; San Pablo Ave (Emeryville and West Oakland) 17; Shattuck Ave from the north (Berkeley) 13; Ashby Ave from the west (Emeryville and I-80) 12.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent that fits it (the on-ramp on its planned route, the off-ramp it has driven, or the origin and destination groups of its trip), at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (985 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| on-2853241697 | observed | 253 | 26% |
| Other on-ramps | assumed | 14 | 1% |
| off-52990846 | observed | 141 | 14% |
| Other off-ramps | assumed | 13 | 1% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 151 | 15% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 204 | 21% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 93 | 9% |
| Other (no intent listed) |  | 116 | 12% |

Intents listed cover 88% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 246 trips (225 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 316 trips (280 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 263 trips (249 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 327 trips (306 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 52% | +5 | 246 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 4% | -29 | 246 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 15% | +9 | 246 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 24% | -3 | 246 |  |
| Colby Street NB | from | freeway | 47% | 41% | -6 | 316 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 46% | -2 | 316 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 43% | +18 | 316 |  |
| Colby Street NB | to | College Avenue | 3% | 5% | +2 | 316 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 25% | -21 | 263 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 6% | -20 | 263 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 16% | -0 | 263 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 52% | -16 | 263 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 27% | -16 | 327 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 15% | -31 | 327 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 31% | +9 | 327 |  |
| Colby Street SB | to | freeway | 45% | 35% | -10 | 327 | within |
| Colby Street SB | to | Forest Street | 34% | 24% | -10 | 327 |  |

Headline shares within tolerance: 3 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 12% | 869 | 14% | 770 |
| onto freeway | Hillegass Avenue | 12% | 13% | 869 | 15% | 770 |
| onto freeway | Martin Street | 10% | 14% | 869 | 13% | 770 |
| onto freeway | Colby Street | 8% | 11% | 869 | 13% | 770 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 19% | 869 | 15% | 770 |
| onto freeway | Benvenue Avenue | 5% | 2% | 869 | 2% | 770 |
| from freeway | College Avenue | 10% | 9% | 768 | 9% | 735 |
| from freeway | Martin Street | 10% | 12% | 768 | 13% | 735 |
| from freeway | Colby Street | 8% | 13% | 768 | 14% | 735 |
| from freeway | Hillegass Avenue | 5% | 7% | 768 | 8% | 735 |
| from freeway | Benvenue Avenue | 3% | 2% | 768 | 2% | 735 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 30.40 | 26.46 | 26.5 | 444 |
| 4175 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 16.30 | 3.00 | 3.0 | 1526 |
| 1025 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 13.54 | 11.85 | 11.9 | 642 |
| 4397 | Ashby Avenue | Primary | 2 | 96 | signal | 12.68 | 10.05 | 10.0 | 461 |
| 2921 | Russell Street | Residential | 1 | 260 | uncontrolled | 9.10 | 7.66 | 7.7 | 163 |
| 3370 | The Uplands | Tertiary | 1 | 311 | uncontrolled | 8.58 | 5.53 | 5.5 | 328 |
| 1123 | Alcatraz Avenue | Tertiary | 1 | 299 | two_way_stop | 8.52 | 6.94 | 6.9 | 324 |
| 1024 | Martin Luther King Junior Way | Secondary | 3 | 75 | two_way_stop | 8.00 | 6.47 | 6.5 | 818 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 7.97 | 7.23 | 7.2 | 553 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 7.87 | 5.29 | 5.3 | 355 |
| 1116 | Market Street | Tertiary | 2 | 87 | uncontrolled | 7.78 | 7.19 | 7.2 | 188 |
| 4150 | Alcatraz Avenue | Tertiary | 1 | 160 | uncontrolled | 6.96 | 5.96 | 6.0 | 270 |
| 2819 | College Avenue | Tertiary | 2 | 50 | signal | 6.86 | 5.64 | 5.6 | 709 |
| 3457 | The Uplands | Tertiary | 1 | 151 | two_way_stop | 6.62 | 5.44 | 5.4 | 161 |
| 1111 | Market Street | Tertiary | 3 | 31 | signal | 6.49 | 6.14 | 6.1 | 224 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 446 | Market Street / Stanford Avenue | signal |  | 5.08 | 0.15 | 75 s: 50/15 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 4.83 | 0.10 | 110 s: 30/28/38 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 4.71 | 0.20 | 75 s: 16/27/17 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 4.60 | 0.61 | 75 s: 48/17 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 4.04 | 0.05 | 120 s: 27/83 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.43 | 0.26 | 75 s: 44/21 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.34 | 0.05 | 75 s: 17/27/16 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.25 | 0.07 | 75 s: 39/26 |
| 1069 | Claremont Avenue / Colby Street / Forest Street | signal |  | 3.11 | 0.03 | 79 s: 25/4/35 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 2.95 | 0.22 | 75 s: 48/17 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.86 | 0.08 | 75 s: 47/18 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.86 | 0.01 | 75 s: 41/24 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 2.74 | 0.02 | 75 s: 32/33 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.72 | 0.03 | 75 s: 46/19 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal |  | 2.65 | 0.02 | 75 s: 39/26 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 446: 50 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 15 s: Market Street 4L [1108], Market Street 3L [1111]
- node 680: 30 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 38 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 1080: 16 s: Claremont Avenue 2L [2756], Claremont Avenue 2L [2798]; 27 s: College Avenue 2L [2761], College Avenue 2L [2819]; 17 s: 62nd Street 1L [2622]
- node 447: 48 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 17 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 479: 27 s: Martin Luther King Junior Way 3L [1025], Adeline Street 3L [4143]; 83 s: Stanford Avenue 1L [4139]

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 1000 | Sacramento Street | Sacramento Street | uncontrolled | 2 | 52.4 |
| 914 | 62nd Street | 62nd Street / Martin Luther King Junior Way | uncontrolled | 2 | 53.3 |
| 934 | 60th Street | 60th Street / Market Street | two_way_stop | 1 | 18.9 |
| 931 | 62nd Street | 62nd Street / King Street | traffic_circle | 1 | 21.5 |
| 1137 | Dover Street | 61st Street / Dover Street | uncontrolled | 1 | 26.5 |
| 921 | King Street | 63rd Street / King Street | two_way_stop | 1 | 50.6 |

## Junction recovery

Policy `physical`. Node entries by cars and cyclists in the run: 792197 (settle interval 0). An admission is an entry the ordinary rule would have refused; head-seconds count the time a waiting head vehicle had the reason invoked, and the part of it in which it still could not enter. Courtesy and the yield fallback change priority only; under `physical` the conflict bypass never admits.

| Reason | Admissions per hour | Per 1,000 entries | Head-s invoked | Head-s blocked |
| --- | --- | --- | --- | --- |
| courtesy | 418.0 | 0.528 | 1380 | 1245 |
| yield fallback | 192.0 | 0.242 | 59 | 0 |
| conflict bypass | 0.0 | 0.000 | 234 | 234 |

Vehicles removed while held in a node by a full exit: 2 (2.0 per hour, included in the gridlock removals).

| Node | Streets | Control | Courtesy | Yield fallback | Conflict bypass | Held removals |
| --- | --- | --- | --- | --- | --- | --- |
| 147 | 59th Street / Grace Avenue / Los Angeles Street | two_way_stop | 28 | 3 | 0 | 0 |
| 430 | Alcatraz Avenue / King Street | two_way_stop | 19 | 5 | 0 | 0 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal | 24 | 0 | 0 | 0 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal | 21 | 2 | 0 | 0 |
| 436 | 62nd Street / Adeline Street / Stanford Avenue | two_way_stop | 21 | 0 | 0 | 0 |
| 342 | 56th Street / Shattuck Avenue | two_way_stop | 3 | 17 | 0 | 0 |
| 395 | 65th Street / Shattuck Avenue | two_way_stop | 9 | 9 | 0 | 0 |
| 1429 | Claremont Avenue / Claremont Boulevard | two_way_stop | 16 | 0 | 0 | 0 |
| 165 | Alcatraz Avenue / Baker Street | two_way_stop | 10 | 4 | 0 | 0 |
| 492 | Aileen Street / Shattuck Avenue | two_way_stop | 5 | 8 | 0 | 0 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 602 | Grove Shafter Freeway | 28 | 4111 |
| 1089 | 63rd Street / College Avenue | 6 | 342 |
| 654 | 53rd Street / Shattuck Avenue | 4 | 19 |
| 1093 | College Avenue / Harwood Avenue | 4 | 132 |
| 924 | Ashby Avenue / Regent Street | 2 | 40 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | 2 | 142 |
| 339 | 55th Street / Dover Street | 1 | 33 |
| 648 | 54th Street / Shattuck Avenue | 1 | 20 |
| 784 | 61st Street / Racine Street | 1 | 36 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 1034 | 1064 |
| Telegraph | S | 10 | 1075 | 1158 |
| College | N | 3 | 414 | 414 |
| College | S | 3 | 709 | 713 |
| Claremont | N | 6 | 461 | 707 |
| Claremont | S | 7 | 383 | 920 |
| Alcatraz | E | 6 | 497 | 552 |
| Alcatraz | W | 6 | 344 | 348 |
| Hillegass | N | 4 | 152 | 154 |
| Hillegass | S | 4 | 172 | 206 |
| Colby | N | 7 | 156 | 216 |
| Colby | S | 7 | 176 | 224 |
| Martin | E | 2 | 176 | 176 |
| Martin | W | 2 | 151 | 151 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 4111 |
| 1672 | Warren Freeway | 1289 |
| 265 | Ashby Avenue | 1134 |
| 183 | San Pablo Avenue | 987 |
| 943 | Telegraph Avenue / Ward Street | 976 |
| 974 | Broadway | 808 |
| 763 | Telegraph Avenue | 636 |
| 276 | Martin Luther King Junior Way | 524 |
| 184 | Alcatraz Avenue | 460 |
| 104 | San Pablo Avenue | 382 |
