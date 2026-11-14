# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 21939 veh/h x scale 1 = 21939 veh/h. Run took 24.2 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (5 of 22037) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.81 m/s (last 15 min 9.78) | pass |

Overall: **STABLE**. Mean trip delay 105 s, mean trip time 395 s, completed 21717, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2538 | 6 | 1804 | 0 | 9.80 |
| 10 | 2556 | 4 | 3637 | 0 | 9.52 |
| 15 | 2556 | 2 | 5456 | 0 | 9.70 |
| 20 | 2581 | 1 | 7302 | 0 | 9.76 |
| 25 | 2541 | 4 | 9149 | 0 | 9.86 |
| 30 | 2534 | 2 | 11025 | 0 | 9.84 |
| 35 | 2561 | 1 | 12826 | 0 | 9.84 |
| 40 | 2617 | 0 | 14598 | 0 | 10.01 |
| 45 | 2693 | 4 | 16367 | 0 | 10.06 |
| 50 | 2760 | 5 | 18144 | 0 | 9.77 |
| 55 | 2769 | 2 | 19890 | 0 | 9.55 |
| 60 | 2795 | 5 | 21717 | 0 | 10.01 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 19949 | 0.00 | 0.2% | 1.087 | 1.050 | 4.2% | 0.0% | 1.022 | 1.3% | 0.0% | 5.0% | 1913 | 8.3% |
| gate to gate | 7863 | 0.00 | 0.4% | 1.089 | 1.059 | 2.4% | 0.0% | 1.018 | 0.8% | 0.0% | 7.5% | 460 | 9.5% |
| with a local end | 12086 | 0.00 | 0.1% | 1.085 | 1.045 | 5.3% | 0.0% | 1.024 | 1.6% | 0.0% | 3.3% | 1454 | 7.9% |
| guided drivers | 9084 | 0.01 | 0.5% | 1.087 | 1.049 | 4.2% | 0.0% | 1.022 | 1.2% | 0.0% | 5.0% | 861 | 8.4% |
| other drivers | 10865 | 0.00 | 0.0% | 1.087 | 1.050 | 4.1% | 0.0% | 1.022 | 1.3% | 0.0% | 5.0% | 1053 | 8.2% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (356 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1303 | 27.7 | 8% |
| freeway to the surface gates | 1005 | 19.7 | 6% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 909 | 5% | 12% | 83% | 0.2 |
| Hillegass Avenue | College Avenue | 3 | S | 1106 | 4% | 21% | 75% | 0.2 |

## Per-mode results

Offered: 21939 car veh/h; 497 bicycle flows (702/h); 2000 pedestrian flows (1340/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 2795 | 21717 | 395 | |
| Bicycle | 55 | 687 | 240 | |
| Pedestrian | 169 | 1290 | 473 | mean crossing delay 7.7 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 241, bicycle conflicts 383, close passes 614, pedestrian injury-risk index 0.047, bicycle injury-risk index 0.073 (proxy), mean vehicle speed at pedestrian encounters 2.46 m/s.


## Through cars on the counted blocks (a car is through when neither trip end is in the study area)

Observed through range = from the cars that drove the whole street (volunteer count, a lower bound) to the block volume less the cars whose trip ends along the street (an upper bound). Observed freeway-end trips = observed block volume times the observed freeway share of the street (the headline share of the targets file); these include freeway trips that end inside the study area, so they are not an expected through count. Modeled through = select-link trips with no end in the study area, per hour. Modeled freeway = select-link trips from or to a freeway node, per hour.

| Block | Observed volume (veh/h) | Observed freeway share | Observed freeway-end trips (veh/h) | Observed through range (veh/h) | Modeled through (veh/h) | In range | Modeled freeway trips (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 1 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 29 | below |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 43 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 3 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 1 | below |
| Intents listed, together | | 101 (71 to 131) | 76 | |
| Other through cars (no intent listed) | | | 1 | |

Model through cars by origin and destination group (largest 12 of 17 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 19.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 7.0 | College Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 7.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 6.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 5.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 5.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | San Pablo Ave (Emeryville and West Oakland) | 5.0 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 5.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 3.0 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Shattuck Ave from the north (Berkeley) | 3.0 | SR-24 then Telegraph Avenue then Alcatraz Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Alcatraz Ave from the west (Emeryville side) | 2.0 | SR-24 then Telegraph Avenue |
| other pairs | | 7.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 34 veh/h; Claremont Avenue 24 veh/h; College Avenue 8 veh/h; SR-24 then Telegraph Avenue 4 veh/h; SR-24 then Telegraph Avenue then Alcatraz Avenue 4 veh/h; none near the study area 2 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 20 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 34 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 12 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 5 | within |
| Intents listed, together | | 43 (20 to 68) | 71 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 20 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 16.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 12.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 10.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 6.0 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 4.0 | College Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 4.0 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 3.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 3.0 | College Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 3.0 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Shattuck Ave from the north (Berkeley) | 2.0 | SR-24 then Telegraph Avenue then Alcatraz Avenue |
| Claremont Ave and Tunnel Rd toward the hills | San Pablo Ave (Emeryville and West Oakland) | 1.0 | Claremont Avenue then Alcatraz Avenue |
| College Ave from the north (Berkeley) | San Pablo Ave (Emeryville and West Oakland) | 1.0 | College Avenue then Claremont Avenue |
| other pairs | | 8.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 25 veh/h; SR-24 17 veh/h; SR-24 then Claremont Avenue then College Avenue 6 veh/h; Claremont Avenue 5 veh/h; none near the study area 5 veh/h; College Avenue 4 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 18 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 20 | below |
| Intents listed, together | | 87 (78 to 110) | 38 | |
| Other through cars (no intent listed) | | | 20 | |

Model through cars by origin and destination group (largest 12 of 9 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 18.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 8.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 6.0 | Alcatraz Avenue then Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.0 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 4.0 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 3.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 1.0 | Alcatraz Avenue then Claremont Avenue |
| College Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 1.0 | Telegraph Avenue |

By the arterial these cars would otherwise use: Telegraph Avenue 27 veh/h; Claremont Avenue then SR-24 14 veh/h; Alcatraz Avenue then Telegraph Avenue 6 veh/h; College Avenue then Claremont Avenue then SR-24 6 veh/h; Claremont Avenue 4 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 16 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 18 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 21 | within |
| Intents listed, together | | 46 (39 to 72) | 55 | |
| Other through cars (no intent listed) | | | 35 | |

Model through cars by origin and destination group (largest 12 of 18 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 18.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 15.0 | Alcatraz Avenue then College Avenue then Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 10.0 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | none near the study area |
| Alcatraz Ave from the west (Emeryville side) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 4.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 4.0 | Alcatraz Avenue then Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 3.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-13 Warren Freeway (via SR-24 east) | 3.0 | Alcatraz Avenue then College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.0 | SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | none near the study area |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 1.0 | SR-24 |
| other pairs | | 6.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 43 veh/h; Alcatraz Avenue then College Avenue then Claremont Avenue 15 veh/h; none near the study area 11 veh/h; SR-24 10 veh/h; Alcatraz Avenue then Telegraph Avenue 4 veh/h; Alcatraz Avenue then College Avenue 3 veh/h.

### Study area, all residential and service streets

Model: 467 through cars per hour.

Model through cars by origin and destination group (largest 12 of 54 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 44.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 36.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 34.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 31.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 24.0 | Alcatraz Avenue then College Avenue then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 23.0 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 18.0 | College Avenue |
| Telegraph Ave to the south (downtown Oakland) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 18.0 | Telegraph Avenue then Alcatraz Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 17.0 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | SR-24 westbound on-ramps (toward Oakland and I-980) | 17.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 16.0 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 13.0 | Telegraph Avenue |
| other pairs | | 176.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 200 veh/h; Claremont Avenue 71 veh/h; SR-24 31 veh/h; Alcatraz Avenue then College Avenue then Claremont Avenue 28 veh/h; none near the study area 19 veh/h; College Avenue 18 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 102; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 101; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 87; Telegraph Ave from the north (Berkeley) 49; Telegraph Ave to the south (downtown Oakland) 45; SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) 20; Claremont Ave and Tunnel Rd toward the hills 15; West Oakland to the southwest (Adeline St, Market St) 11; College Ave from the north (Berkeley) 9; Shattuck Ave from the north (Berkeley) 8.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 122; Telegraph Ave from the north (Berkeley) 68; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 50; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 50; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 24; Telegraph Ave to the south (downtown Oakland) 24; Claremont Ave and Tunnel Rd toward the hills 22; San Pablo Ave (Emeryville and West Oakland) 18; Emeryville and West Oakland streets (55th to 67th Streets) 18; Ashby Ave from the west (Emeryville and I-80) 13.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 173 trips (155 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 206 trips (177 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 110 trips (103 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 254 trips (233 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 56% | +9 | 173 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 5% | -16 | 173 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 15% | +9 | 173 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 36% | +9 | 173 |  |
| Colby Street NB | from | freeway | 47% | 46% | -1 | 206 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 53% | +5 | 206 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 31% | +6 | 206 |  |
| Colby Street NB | to | College Avenue | 3% | 3% | +0 | 206 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 25% | -21 | 110 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 5% | -21 | 110 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 12% | -4 | 110 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 68% | +11 | 110 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 26% | -17 | 254 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 9% | -37 | 254 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 17% | -5 | 254 |  |
| Colby Street SB | to | freeway | 45% | 49% | +4 | 254 | within |
| Colby Street SB | to | Forest Street | 34% | 8% | -26 | 254 |  |

Headline shares within tolerance: 3 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 15% | 718 | 16% | 664 |
| onto freeway | Hillegass Avenue | 12% | 12% | 718 | 13% | 664 |
| onto freeway | Martin Street | 10% | 14% | 718 | 15% | 664 |
| onto freeway | Colby Street | 8% | 12% | 718 | 13% | 664 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 11% | 718 | 9% | 664 |
| onto freeway | Benvenue Avenue | 5% | 5% | 718 | 5% | 664 |
| from freeway | College Avenue | 10% | 10% | 768 | 11% | 692 |
| from freeway | Martin Street | 10% | 11% | 768 | 12% | 692 |
| from freeway | Colby Street | 8% | 11% | 768 | 12% | 692 |
| from freeway | Hillegass Avenue | 5% | 7% | 768 | 8% | 692 |
| from freeway | Benvenue Avenue | 3% | 2% | 768 | 2% | 692 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 13.28 | 6.41 | 6.4 | 1087 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 8.14 | 5.67 | 5.7 | 316 |
| 769 | Martin Luther King Junior Way | Secondary | 3 | 112 | signal | 5.21 | 3.22 | 3.2 | 1367 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 5.16 | 3.82 | 3.8 | 1016 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 4.99 | 4.00 | 4.0 | 844 |
| 1666 | 52nd Street | Secondary | 4 | 39 | signal | 4.82 | 4.17 | 4.2 | 869 |
| 1025 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 4.80 | 4.08 | 4.1 | 845 |
| 2008 | Shattuck Avenue | Tertiary | 1 | 93 | signal | 4.71 | 3.48 | 3.5 | 517 |
| 108 | Stanford Avenue | Secondary | 3 | 61 | signal | 4.70 | 2.72 | 2.7 | 1600 |
| 2303 | Telegraph Avenue | Secondary | 2 | 104 | signal | 4.59 | 2.98 | 3.0 | 1307 |
| 1037 | Sacramento Street | Tertiary | 3 | 40 | signal | 4.54 | 3.56 | 3.6 | 1118 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 4.54 | 3.62 | 3.6 | 965 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 4.49 | 3.53 | 3.5 | 1136 |
| 2248 | Telegraph Avenue | Secondary | 2 | 104 | signal | 4.37 | 2.30 | 2.3 | 1696 |
| 1111 | Market Street | Tertiary | 3 | 31 | signal | 4.29 | 3.73 | 3.7 | 820 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 446 | Market Street / Stanford Avenue | signal |  | 5.62 | 0.09 | 75 s: 50/15 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 5.33 | 0.09 | 90 s: 18/19/37 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 4.41 | 0.04 | 75 s: 23/42 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.47 | 0.02 | 75 s: 32/33 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.27 | 0.00 | 75 s: 29/36 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.04 | 0.01 | 75 s: 15/30/15 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.01 | 0.00 | 75 s: 24/41 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.98 | 0.00 | 75 s: 38/27 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.91 | 0.06 | 75 s: 42/23 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 2.53 | 0.10 | 75 s: 50/15 |
| 501 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.51 | 0.05 | 75 s: 28/37 |
| 1069 | Claremont Avenue / Colby Street / Forest Street | signal |  | 2.35 | 0.00 | 79 s: 31/4/29 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.21 | 0.00 | 75 s: 36/29 |
| 947 | Ashby Avenue / Telegraph Avenue | signal |  | 2.18 | 0.00 | 75 s: 21/44 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal |  | 2.17 | 0.00 | 75 s: 42/23 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 446: 50 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 15 s: Market Street 4L [1108], Market Street 3L [1111]
- node 680: 18 s: 52nd Street 4L [1662]; 19 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 37 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 447: 23 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 42 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 185: 32 s: Alcatraz Avenue 1L [363], Alcatraz Avenue 1L [1162]; 33 s: Sacramento Street 3L [1036], Sacramento Street 3L [1037]
- node 479: 29 s: Martin Luther King Junior Way 3L [1025], Adeline Street 3L [4143]; 36 s: Stanford Avenue 1L [4139]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 1672 | Warren Freeway | 3 | 1154 |
| 324 | 51st Street / Martin Luther King Junior Way | 1 | 105 |
| 395 | 65th Street / Shattuck Avenue | 1 | 6 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 728 | 775 |
| Telegraph | S | 10 | 642 | 674 |
| College | N | 3 | 198 | 198 |
| College | S | 3 | 319 | 319 |
| Claremont | N | 6 | 398 | 665 |
| Claremont | S | 7 | 409 | 808 |
| Alcatraz | E | 6 | 350 | 404 |
| Alcatraz | W | 6 | 406 | 508 |
| Hillegass | N | 4 | 102 | 115 |
| Hillegass | S | 4 | 78 | 83 |
| Colby | N | 7 | 110 | 122 |
| Colby | S | 7 | 130 | 152 |
| Martin | E | 2 | 102 | 102 |
| Martin | W | 2 | 107 | 107 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 3739 |
| 943 | Telegraph Avenue / Ward Street | 1803 |
| 265 | Ashby Avenue | 1242 |
| 1672 | Warren Freeway | 1154 |
| 183 | San Pablo Avenue | 1028 |
| 763 | Telegraph Avenue | 508 |
| 275 | Market Street | 485 |
| 184 | Alcatraz Avenue | 369 |
| 971 | Pleasant Valley Avenue | 339 |
| 1756 | Claremont Avenue | 328 |
