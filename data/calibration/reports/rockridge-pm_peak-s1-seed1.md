# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 26299 veh/h x scale 1 = 26299 veh/h. Run took 41.4 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.7% (194 of 26258) | pass |
| Arterial mean speed (run) | > 4 m/s | 8.06 m/s (last 15 min 7.65) | pass |

Overall: **STABLE**. Mean trip delay 175 s, mean trip time 427 s, completed 25841, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 3004 | 4 | 2194 | 0 | 8.46 |
| 10 | 3035 | 9 | 4319 | 0 | 8.28 |
| 15 | 3148 | 3 | 6444 | 0 | 8.20 |
| 20 | 3063 | 2 | 8731 | 0 | 8.46 |
| 25 | 3234 | 7 | 10806 | 0 | 8.38 |
| 30 | 3144 | 46 | 13037 | 0 | 8.16 |
| 35 | 3135 | 72 | 15184 | 0 | 7.91 |
| 40 | 3262 | 89 | 17281 | 0 | 8.05 |
| 45 | 3310 | 119 | 19393 | 0 | 8.03 |
| 50 | 3373 | 139 | 21561 | 0 | 7.88 |
| 55 | 3469 | 157 | 23705 | 0 | 7.74 |
| 60 | 3469 | 194 | 25841 | 0 | 7.35 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 23669 | 0.04 | 3.5% | 1.094 | 1.058 | 5.2% | 0.1% | 1.037 | 2.9% | 0.0% | 0.4% | 2377 | 9.4% |
| gate to gate | 8314 | 0.07 | 6.0% | 1.099 | 1.074 | 4.6% | 0.0% | 1.038 | 2.7% | 0.0% | 0.4% | 515 | 12.7% |
| with a local end | 15355 | 0.02 | 2.2% | 1.091 | 1.052 | 5.6% | 0.1% | 1.037 | 3.1% | 0.0% | 0.3% | 1863 | 8.5% |
| guided drivers | 10958 | 0.08 | 7.4% | 1.096 | 1.059 | 5.5% | 0.1% | 1.039 | 3.0% | 0.0% | 0.4% | 1123 | 9.1% |
| other drivers | 12711 | 0.00 | 0.2% | 1.092 | 1.058 | 5.0% | 0.0% | 1.035 | 2.9% | 0.0% | 0.4% | 1254 | 9.7% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (428 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1415 | 38.8 | 9% |
| freeway to the surface gates | 1311 | 29.6 | 7% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1510 | 2% | 17% | 80% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 1322 | 6% | 23% | 71% | 0.3 |

## Per-mode results

Offered: 26299 car veh/h; 626 bicycle flows (764/h); 2000 pedestrian flows (1731/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 3469 | 25841 | 427 | |
| Bicycle | 49 | 794 | 267 | |
| Pedestrian | 223 | 1657 | 416 | mean crossing delay 7.8 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 279, bicycle conflicts 1198, close passes 668, pedestrian injury severity mean 0.042 (AIS4+, 11195 supported of 11195 encounters), cyclist injury severity mean 0.068 (MAIS3+F, 4026 supported of 8551 encounters) (separate endpoints, never summed), mean vehicle speed at pedestrian encounters 2.22 m/s.


## Through cars on the counted blocks (a car is through when neither trip end is in the study area)

Observed through range = from the cars that drove the whole street (volunteer count, a lower bound) to the block volume less the cars whose trip ends along the street (an upper bound). Observed freeway-end trips = observed block volume times the observed freeway share of the street (the headline share of the targets file); these include freeway trips that end inside the study area, so they are not an expected through count. Modeled through = select-link trips with no end in the study area, per hour. Modeled freeway = select-link trips from or to a freeway node, per hour.

| Block | Observed volume (veh/h) | Observed freeway share | Observed freeway-end trips (veh/h) | Observed through range (veh/h) | Modeled through (veh/h) | In range | Modeled freeway trips (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | 110 | 47.0% | 52 | 48 to 95 | 76 | yes | 104 |
| Colby Street NB | 174 | 47.0% | 82 | 102 to 145 | 134 | yes | 154 |
| Hillegass Avenue SB | 160 | 68.0% | 109 | 79 to 120 | 132 | above | 124 |
| Colby Street SB | 160 | 45.0% | 72 | 39 to 117 | 129 | above | 119 |

Fitted: Colby Street NB, Colby Street SB, Hillegass Avenue NB, Hillegass Avenue SB are targets of the demand fit (`countFit.throughTargets`, calibration round 39), so these rows are no longer an independent check. The checks that stay independent are the held-out count stations, the headline freeway shares, stability and the arterial travel times.

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 1 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 134 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 49 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 34 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 14 | within |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 35 | above |
| Intents listed, together | | 101 (71 to 131) | 132 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 12 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 49.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 34.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 10.0 | none near the study area |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 10.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 8.0 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 6.0 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.0 | SR-24 then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 4.0 | Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 3.0 | SR-24 |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 2.0 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | Alcatraz Avenue then Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Telegraph Avenue |

By the arterial these cars would otherwise use: Telegraph Avenue 96 veh/h; none near the study area 10 veh/h; Claremont Avenue 8 veh/h; SR-24 then Claremont Avenue then College Avenue 6 veh/h; SR-24 then Claremont Avenue 5 veh/h; Claremont Avenue then College Avenue 4 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 76 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 20 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 27 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 4 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 20 | above |
| Intents listed, together | | 43 (20 to 68) | 71 | |
| Other through cars (no intent listed) | | | 5 | |

Model through cars by origin and destination group (largest 12 of 20 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 15.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 14.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 12.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 8.0 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.0 | SR-24 then Claremont Avenue |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Claremont Avenue then Alcatraz Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | College Ave from the north (Berkeley) | 2.0 | Claremont Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 2.0 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | San Pablo Ave (Emeryville and West Oakland) | 2.0 | SR-24 |
| Alcatraz Ave from the west (Emeryville side) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 8.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 30 veh/h; SR-24 17 veh/h; SR-24 then Claremont Avenue then College Avenue 8 veh/h; Claremont Avenue 4 veh/h; SR-24 then Claremont Avenue 4 veh/h; Claremont Avenue then Alcatraz Avenue 3 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 132 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 45 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 57 | within |
| Intents listed, together | | 87 (78 to 110) | 102 | |
| Other through cars (no intent listed) | | | 30 | |

Model through cars by origin and destination group (largest 12 of 19 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 45.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 22.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 20.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.0 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 7.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 6.0 | Alcatraz Avenue then College Avenue |
| College Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 5.0 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.0 | Claremont Avenue |
| College Ave from the north (Berkeley) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 2.0 | College Avenue then Claremont Avenue |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | SR-24 westbound on-ramps (toward Oakland and I-980) | 2.0 | SR-24 |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 2.0 | Alcatraz Avenue then Claremont Avenue |
| Alcatraz Ave from the west (Emeryville side) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 7.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 76 veh/h; Claremont Avenue then SR-24 20 veh/h; College Avenue then Claremont Avenue then SR-24 11 veh/h; Alcatraz Avenue then College Avenue 6 veh/h; College Avenue 5 veh/h; Alcatraz Avenue then Claremont Avenue 3 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 129 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 14 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 14 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 55 | above |
| Intents listed, together | | 46 (39 to 72) | 83 | |
| Other through cars (no intent listed) | | | 46 | |

Model through cars by origin and destination group (largest 12 of 24 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 32.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 13.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.0 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.0 | College Avenue then Claremont Avenue then SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 6.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 6.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 5.0 | SR-24 |
| College Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 4.0 | College Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.0 | none near the study area |
| Emeryville and West Oakland streets (55th to 67th Streets) | Claremont Ave and Tunnel Rd toward the hills | 4.0 | Alcatraz Avenue then Claremont Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 3.0 | SR-24 |
| other pairs | | 16.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 67 veh/h; Claremont Avenue then SR-24 13 veh/h; Alcatraz Avenue then Claremont Avenue 10 veh/h; College Avenue then Claremont Avenue then SR-24 9 veh/h; SR-24 9 veh/h; Alcatraz Avenue then College Avenue 6 veh/h.

### Study area, all residential and service streets

Model: 675 through cars per hour.

Model through cars by origin and destination group (largest 12 of 66 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 101.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 80.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 59.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 53.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 47.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 28.0 | Claremont Avenue then SR-24 |
| Telegraph Ave to the south (downtown Oakland) | SR-24 westbound on-ramps (toward Oakland and I-980) | 23.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 19.0 | Claremont Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | SR-24 westbound on-ramps (toward Oakland and I-980) | 17.0 | none near the study area |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 16.0 | College Avenue then Claremont Avenue then SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 16.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 14.0 | Telegraph Avenue |
| other pairs | | 202.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 416 veh/h; none near the study area 50 veh/h; Claremont Avenue 46 veh/h; Alcatraz Avenue then Claremont Avenue 29 veh/h; SR-24 29 veh/h; Claremont Avenue then SR-24 28 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 159; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 146; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 103; Telegraph Ave from the north (Berkeley) 63; Telegraph Ave to the south (downtown Oakland) 41; Claremont Ave and Tunnel Rd toward the hills 32; College Ave from the north (Berkeley) 27; Emeryville and West Oakland streets (55th to 67th Streets) 22; Ashby Ave from the west (Emeryville and I-80) 19; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 18.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 235; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 135; Telegraph Ave from the north (Berkeley) 86; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 67; Claremont Ave and Tunnel Rd toward the hills 46; College Ave from the north (Berkeley) 27; Shattuck Ave from the north (Berkeley) 19; Ashby Ave from the west (Emeryville and I-80) 12; Telegraph Ave to the south (downtown Oakland) 10; SR-13 Warren Freeway (via SR-24 east) 8.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent that fits it (the on-ramp on its planned route, the off-ramp it has driven, or the origin and destination groups of its trip), at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (684 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| on-2853241697 | observed | 238 | 35% |
| Other on-ramps | assumed | 13 | 2% |
| off-52990846 | observed | 103 | 15% |
| Other off-ramps | assumed | 9 | 1% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 158 | 23% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 72 | 11% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 28 | 4% |
| Other (no intent listed) |  | 63 | 9% |

Intents listed cover 91% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 206 trips (187 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 301 trips (279 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 189 trips (178 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 277 trips (234 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 50% | +3 | 206 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 2% | -31 | 206 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 15% | +9 | 206 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 23% | -4 | 206 |  |
| Colby Street NB | from | freeway | 47% | 51% | +4 | 301 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 41% | -7 | 301 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 32% | +7 | 301 |  |
| Colby Street NB | to | College Avenue | 3% | 6% | +3 | 301 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 39% | -7 | 189 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 13% | -13 | 189 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 19% | +3 | 189 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 63% | -5 | 189 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 23% | -20 | 277 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 21% | -25 | 277 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 22% | +0 | 277 |  |
| Colby Street SB | to | freeway | 45% | 41% | -4 | 277 | within |
| Colby Street SB | to | Forest Street | 34% | 25% | -9 | 277 |  |

Headline shares within tolerance: 4 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 13% | 839 | 15% | 724 |
| onto freeway | Hillegass Avenue | 12% | 14% | 839 | 16% | 724 |
| onto freeway | Martin Street | 10% | 11% | 839 | 12% | 724 |
| onto freeway | Colby Street | 8% | 11% | 839 | 13% | 724 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 17% | 839 | 12% | 724 |
| onto freeway | Benvenue Avenue | 5% | 6% | 839 | 7% | 724 |
| from freeway | College Avenue | 10% | 10% | 763 | 10% | 728 |
| from freeway | Martin Street | 10% | 10% | 763 | 11% | 728 |
| from freeway | Colby Street | 8% | 11% | 763 | 11% | 728 |
| from freeway | Hillegass Avenue | 5% | 8% | 763 | 8% | 728 |
| from freeway | Benvenue Avenue | 3% | 3% | 763 | 3% | 728 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4175 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 21.65 | 4.01 | 4.0 | 1523 |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 16.14 | 12.17 | 12.2 | 680 |
| 2921 | Russell Street | Residential | 1 | 260 | uncontrolled | 14.61 | 13.13 | 13.1 | 127 |
| 4397 | Ashby Avenue | Primary | 2 | 96 | signal | 11.59 | 9.28 | 9.3 | 388 |
| 1089 | Market Street | Tertiary | 2 | 111 | two_way_stop | 11.51 | 8.17 | 8.2 | 974 |
| 460 | Sacramento Street | Tertiary | 2 | 104 | two_way_stop | 11.43 | 9.64 | 9.6 | 431 |
| 3395 | Ashby Avenue | Primary | 1 | 129 | signal | 9.98 | 8.09 | 8.1 | 443 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 8.99 | 7.45 | 7.5 | 1355 |
| 4167 | (unnamed) | Motorway | 3 | 75 | uncontrolled | 8.32 | 2.36 | 2.4 | 2436 |
| 4329 | Claremont Avenue | Secondary | 2 | 113 | signal | 7.90 | 6.79 | 6.8 | 354 |
| 3370 | The Uplands | Tertiary | 1 | 311 | uncontrolled | 7.76 | 5.25 | 5.2 | 328 |
| 3434 | Claremont Avenue | Secondary | 1 | 93 | all_way_stop | 7.76 | 4.52 | 4.5 | 462 |
| 1126 | Market Street | Tertiary | 2 | 113 | two_way_stop | 7.03 | 4.84 | 4.8 | 956 |
| 1025 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 6.99 | 5.27 | 5.3 | 959 |
| 704 | Martin Luther King Junior Way | Secondary | 4 | 68 | signal | 6.37 | 5.10 | 5.1 | 1243 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 4.95 | 0.29 | 75 s: 28/37 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 4.79 | 0.03 | 110 s: 30/28/38 |
| 446 | Market Street / Stanford Avenue | signal |  | 4.76 | 0.24 | 75 s: 31/34 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal |  | 4.31 | 0.02 | 75 s: 29/36 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 4.02 | 0.26 | 75 s: 23/22/15 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.78 | 0.09 | 75 s: 21/44 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 3.73 | 0.08 | 75 s: 19/26/15 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.28 | 0.11 | 75 s: 36/29 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.21 | 0.06 | 75 s: 36/29 |
| 332 | 55th Street / Martin Luther King Junior Way | signal |  | 3.18 | 0.04 | 75 s: 34/31 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.15 | 0.03 | 75 s: 22/21/16 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 2.87 | 0.02 | 75 s: 40/25 |
| 1069 | Claremont Avenue / Colby Street / Forest Street | signal |  | 2.82 | 0.03 | 79 s: 19/4/41 |
| 17 | 45th Street / San Pablo Avenue | signal |  | 2.80 | 0.02 | 75 s: 26/39 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.76 | 0.03 | 75 s: 49/16 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 447: 28 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 37 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 680: 30 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 38 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 446: 31 s: Stanford Avenue 3L [941], Stanford Avenue 3L [1055]; 34 s: Market Street 4L [1108], Market Street 3L [1111]
- node 331: 29 s: Martin Luther King Junior Way 4L [704], Martin Luther King Junior Way 4L [761]; 36 s: 52nd Street 2L [758], 52nd Street 1L [760]
- node 1406: 23 s: Ashby Avenue 1L [3395], Ashby Avenue 2L [3426]; 22 s: Claremont Avenue 2L [4329]; 15 s: Claremont Avenue 3L [3447]

## Cars cleared from gridlock near and far (judged zone)

Judged zone: the study area, its bounding streets and the junctions on them, plus nodes within 200 m of it along the network (111 nodes, 329 links). A far clearing counts against the stability rule when its blocking chain (vehicles held at least 60 s by a full exit, at the 5 s snapshot before it) reaches a link in the zone.

| Buffer (m) | Near | Far | Far, chain reaches the zone | Judged |
| --- | --- | --- | --- | --- |
| 100.0 | 0 | 0 | 0 | 0 |
| 200.0 | 0 | 0 | 0 | 0 |
| 400.0 | 0 | 0 | 0 | 0 |

Entry backlog at the end of the run: 3 trips waiting at origins in the zone, of 194 in all.

| Bounding street | Links | Longest standing queue on one link (m) | Link (length m) | At (min) | Share of samples with a link full |
| --- | --- | --- | --- | --- | --- |
| Telegraph Avenue | 28 | 91.0 | 2030 (101.0) | 43.5 | 0.062 |
| Alcatraz Avenue | 14 | 85.0 | 4238 (84.0) | 47.2 | 0.012 |
| College Avenue | 6 | 98.0 | 2805 (102.0) | 15.3 | 0.062 |
| Claremont Avenue | 13 | 55.0 | 2776 (161.0) | 32.1 | 0.0 |
| CA 24 | 3 | 39.0 | 1945 (188.0) | 43.9 | 0.0 |

## Junction recovery

Policy `physical`. Node entries by cars and cyclists in the run: 809500 (settle interval 0). An admission is an entry the ordinary rule would have refused; head-seconds count the time a waiting head vehicle had the reason invoked, and the part of it in which it still could not enter. Courtesy and the yield fallback change priority only; under `physical` the conflict bypass never admits.

| Reason | Admissions per hour | Per 1,000 entries | Head-s invoked | Head-s blocked |
| --- | --- | --- | --- | --- |
| courtesy | 359.0 | 0.443 | 1702 | 1590 |
| yield fallback | 174.0 | 0.215 | 52 | 0 |
| conflict bypass | 0.0 | 0.000 | 47 | 47 |

Vehicles removed while held in a node by a full exit: 0 (0.0 per hour, included in the gridlock removals).

| Node | Streets | Control | Courtesy | Yield fallback | Conflict bypass | Held removals |
| --- | --- | --- | --- | --- | --- | --- |
| 1429 | Claremont Avenue / Claremont Boulevard | two_way_stop | 26 | 1 | 0 | 0 |
| 141 | 63rd Street / Lowell Street / Market Street | two_way_stop | 14 | 11 | 0 | 0 |
| 147 | 59th Street / Grace Avenue / Los Angeles Street | two_way_stop | 14 | 9 | 0 | 0 |
| 165 | Alcatraz Avenue / Baker Street | two_way_stop | 14 | 8 | 0 | 0 |
| 430 | Alcatraz Avenue / King Street | two_way_stop | 9 | 8 | 0 | 0 |
| 1405 | Claremont Boulevard / Russell Street | two_way_stop | 14 | 2 | 0 | 0 |
| 766 | 57th Street / Shattuck Avenue | two_way_stop | 5 | 10 | 0 | 0 |
| 464 | 61st Street / Market Street | two_way_stop | 3 | 10 | 0 | 0 |
| 767 | 58th Street / Shattuck Avenue | two_way_stop | 6 | 7 | 0 | 0 |
| 168 | 62nd Street / Market Street | two_way_stop | 2 | 10 | 0 | 0 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 602 | Grove Shafter Freeway | 188 | 4106 |
| 324 | 51st Street / Martin Luther King Junior Way | 1 | 493 |
| 648 | 54th Street / Shattuck Avenue | 1 | 24 |
| 811 | 58th Street / Vicente Street | 1 | 46 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | 1 | 148 |
| 1120 | Forest Street / Miles Avenue | 1 | 183 |
| 1756 | Claremont Avenue | 1 | 471 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 1046 | 1072 |
| Telegraph | S | 10 | 1208 | 1240 |
| College | N | 3 | 420 | 422 |
| College | S | 3 | 468 | 469 |
| Claremont | N | 6 | 454 | 661 |
| Claremont | S | 7 | 306 | 835 |
| Alcatraz | E | 6 | 478 | 502 |
| Alcatraz | W | 6 | 352 | 371 |
| Hillegass | N | 4 | 113 | 137 |
| Hillegass | S | 4 | 144 | 148 |
| Colby | N | 7 | 170 | 216 |
| Colby | S | 7 | 180 | 204 |
| Martin | E | 2 | 115 | 115 |
| Martin | W | 2 | 125 | 125 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 4106 |
| 265 | Ashby Avenue | 1134 |
| 183 | San Pablo Avenue | 999 |
| 1719 | Grove Shafter Freeway | 998 |
| 1672 | Warren Freeway | 785 |
| 974 | Broadway | 777 |
| 943 | Telegraph Avenue / Ward Street | 740 |
| 763 | Telegraph Avenue | 697 |
| 324 | 51st Street / Martin Luther King Junior Way | 493 |
| 104 | San Pablo Avenue | 479 |
