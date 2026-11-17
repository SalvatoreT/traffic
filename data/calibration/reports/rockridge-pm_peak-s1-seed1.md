# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 27519 veh/h x scale 1 = 27519 veh/h. Run took 38.8 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 1 | FAIL |
| Backlog / spawned | < 2% | 0.7% (181 of 27511) | pass |
| Arterial mean speed (run) | > 4 m/s | 8.25 m/s (last 15 min 8.16) | pass |

Overall: **NOT STABLE**. Mean trip delay 171 s, mean trip time 422 s, completed 27179, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 3068 | 7 | 2351 | 0 | 8.81 |
| 10 | 3124 | 20 | 4607 | 0 | 8.48 |
| 15 | 3222 | 32 | 6787 | 0 | 8.24 |
| 20 | 3311 | 40 | 9068 | 0 | 8.25 |
| 25 | 3184 | 77 | 11412 | 0 | 8.34 |
| 30 | 3384 | 68 | 13585 | 0 | 8.10 |
| 35 | 3334 | 89 | 15921 | 0 | 8.18 |
| 40 | 3180 | 105 | 18323 | 0 | 8.14 |
| 45 | 3271 | 78 | 20479 | 0 | 7.96 |
| 50 | 3295 | 118 | 22696 | 1 | 8.07 |
| 55 | 3397 | 132 | 24904 | 1 | 8.17 |
| 60 | 3408 | 181 | 27179 | 1 | 8.25 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 25003 | 0.02 | 2.3% | 1.096 | 1.059 | 6.1% | 0.0% | 1.034 | 2.9% | 0.0% | 0.2% | 2455 | 9.9% |
| gate to gate | 8734 | 0.04 | 4.1% | 1.098 | 1.072 | 5.0% | 0.0% | 1.032 | 2.2% | 0.0% | 0.1% | 653 | 11.0% |
| with a local end | 16269 | 0.01 | 1.4% | 1.094 | 1.051 | 6.6% | 0.0% | 1.035 | 3.3% | 0.0% | 0.2% | 1802 | 9.6% |
| guided drivers | 11508 | 0.05 | 4.7% | 1.096 | 1.059 | 6.3% | 0.0% | 1.034 | 3.0% | 0.0% | 0.2% | 1097 | 10.5% |
| other drivers | 13495 | 0.00 | 0.3% | 1.095 | 1.058 | 5.9% | 0.0% | 1.034 | 2.8% | 0.0% | 0.2% | 1358 | 9.5% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (438 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1015 | 35.1 | 8% |
| freeway to the surface gates | 1182 | 33.7 | 8% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1584 | 2% | 16% | 81% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 1428 | 4% | 25% | 71% | 0.2 |

## Per-mode results

Offered: 27519 car veh/h; 626 bicycle flows (764/h); 2000 pedestrian flows (2907/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 3408 | 27179 | 422 | |
| Bicycle | 66 | 777 | 259 | |
| Pedestrian | 329 | 2854 | 421 | mean crossing delay 8.1 s |

Pedestrian crosswalks at node 851: 124 completed in minutes 10.0 to 60.0, 148.8 per hour against 150.5 observed.

Vulnerable road users (surrogate indicators): pedestrian conflicts 500, bicycle conflicts 1193, close passes 706, pedestrian injury severity mean 0.043 (AIS4+, 17773 supported of 17773 encounters), cyclist injury severity mean 0.065 (MAIS3+F, 4048 supported of 8381 encounters) (separate endpoints, never summed), mean vehicle speed at pedestrian encounters 2.31 m/s.


## Volunteer whole-street counts

Each car counts once when it passes the last stop line after driving the full directed corridor in order. The measurement window is 50.0 minutes. The last two columns describe trips that visited any corridor link during the full run.

| Corridor | Counted whole street (veh/h) | Modeled whole street (veh/h) | Used in fit | Through trips on any link (veh/h) | Freeway trips on any link (veh/h) |
| --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | 48 | 48 | yes | 79 | 128 |
| Colby Street NB | 102 | 90 | yes | 148 | 129 |
| Hillegass Avenue SB | 79 | 62 | yes | 100 | 105 |
| Colby Street SB | 39 | 44 | yes | 133 | 130 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 1 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed: block volume 174 veh/h, whole-street cars 102, so through cars 102 to 145 veh/h. Model: 148 through cars per hour.

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 62 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 31 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 13 | within |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 39 | above |
| Intents listed, together | | 101 (71 to 131) | 145 | |
| Other through cars (no intent listed) | | | 3 | |

Model through cars by origin and destination group (largest 12 of 18 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 62.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 33.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 10.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 9.0 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 6.0 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 5.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 5.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 4.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | College Ave from the north (Berkeley) | 2.0 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | College Ave from the north (Berkeley) | 2.0 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Alcatraz Avenue then College Avenue |
| other pairs | | 6.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 123 veh/h; none near the study area 9 veh/h; SR-24 then Claremont Avenue then College Avenue 6 veh/h; SR-24 4 veh/h; Alcatraz Avenue then Claremont Avenue 2 veh/h; Alcatraz Avenue then College Avenue 1 veh/h.

### Hillegass Avenue NB

Observed: block volume 110 veh/h, whole-street cars 48, so through cars 48 to 95 veh/h. Model: 79 through cars per hour.

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 21 | above |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 27 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 3 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 22 | above |
| Intents listed, together | | 43 (20 to 68) | 73 | |
| Other through cars (no intent listed) | | | 6 | |

Model through cars by origin and destination group (largest 12 of 18 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 17.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 17.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 16.0 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 6.0 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.0 | SR-24 then Claremont Avenue |
| College Ave from the north (Berkeley) | Shattuck Ave from the north (Berkeley) | 3.0 | College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | College Ave from the north (Berkeley) | 2.0 | Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 2.0 | College Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 2.0 | none near the study area |
| College Ave from the north (Berkeley) | San Pablo Ave (Emeryville and West Oakland) | 1.0 | College Avenue then Claremont Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Alcatraz Avenue then College Avenue |
| San Pablo Ave (Emeryville and West Oakland) | Claremont Ave and Tunnel Rd toward the hills | 1.0 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 6.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 36 veh/h; SR-24 16 veh/h; SR-24 then Claremont Avenue then College Avenue 6 veh/h; College Avenue 5 veh/h; SR-24 then Claremont Avenue 5 veh/h; Claremont Avenue then College Avenue 2 veh/h.

### Hillegass Avenue SB

Observed: block volume 160 veh/h, whole-street cars 79, so through cars 79 to 120 veh/h. Model: 100 through cars per hour.

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 30 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 49 | within |
| Intents listed, together | | 87 (78 to 110) | 79 | |
| Other through cars (no intent listed) | | | 21 | |

Model through cars by origin and destination group (largest 12 of 14 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 29.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 24.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 16.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 5.0 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.0 | College Avenue then Claremont Avenue then SR-24 |
| San Pablo Ave (Emeryville and West Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 4.0 | Alcatraz Avenue then Claremont Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.0 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 3.0 | Claremont Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.0 | Alcatraz Avenue then Claremont Avenue |
| Alcatraz Ave from the west (Emeryville side) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 1.0 | Alcatraz Avenue then Claremont Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | SR-24 westbound on-ramps (toward Oakland and I-980) | 1.0 | none near the study area |
| other pairs | | 2.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 59 veh/h; Claremont Avenue then SR-24 17 veh/h; Alcatraz Avenue then College Avenue 8 veh/h; Alcatraz Avenue then Claremont Avenue 7 veh/h; College Avenue then Claremont Avenue then SR-24 5 veh/h; Claremont Avenue 3 veh/h.

### Colby Street SB

Observed: block volume 160 veh/h, whole-street cars 39, so through cars 39 to 117 veh/h. Model: 133 through cars per hour.

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 15 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 32 | above |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 48 | above |
| Intents listed, together | | 46 (39 to 72) | 95 | |
| Other through cars (no intent listed) | | | 38 | |

Model through cars by origin and destination group (largest 12 of 21 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 17.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.0 | Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.0 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.0 | none near the study area |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.0 | College Avenue then Claremont Avenue then SR-24 |
| San Pablo Ave (Emeryville and West Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 8.0 | Alcatraz Avenue then College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 5.0 | SR-24 |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.0 | none near the study area |
| Emeryville and West Oakland streets (55th to 67th Streets) | Claremont Ave and Tunnel Rd toward the hills | 5.0 | Alcatraz Avenue then Claremont Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 4.0 | SR-24 |
| Emeryville and West Oakland streets (55th to 67th Streets) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.0 | none near the study area |
| other pairs | | 13.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 57 veh/h; none near the study area 24 veh/h; Claremont Avenue then SR-24 14 veh/h; Alcatraz Avenue then College Avenue 11 veh/h; SR-24 11 veh/h; Alcatraz Avenue then Claremont Avenue 8 veh/h.

### Study area, all residential and service streets

Model: 660 through cars per hour.

Model through cars by origin and destination group (largest 12 of 59 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 114.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 71.0 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 71.0 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 39.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 34.0 | Telegraph Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | SR-24 westbound on-ramps (toward Oakland and I-980) | 30.0 | none near the study area |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | SR-24 westbound on-ramps (toward Oakland and I-980) | 27.0 | none near the study area |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 24.0 | Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 20.0 | none near the study area |
| San Pablo Ave (Emeryville and West Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 18.0 | Alcatraz Avenue then College Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Claremont Ave and Tunnel Rd toward the hills | 18.0 | Alcatraz Avenue then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 16.0 | SR-24 |
| other pairs | | 178.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 395 veh/h; none near the study area 93 veh/h; Alcatraz Avenue then Claremont Avenue 38 veh/h; SR-24 28 veh/h; Claremont Avenue then SR-24 25 veh/h; Alcatraz Avenue then College Avenue 24 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 153; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 121; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 118; Emeryville and West Oakland streets (55th to 67th Streets) 50; Telegraph Ave from the north (Berkeley) 45; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 29; Claremont Ave and Tunnel Rd toward the hills 25; San Pablo Ave (Emeryville and West Oakland) 24; Shattuck Ave from the north (Berkeley) 20; Telegraph Ave to the south (downtown Oakland) 20.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 228; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 159; Telegraph Ave from the north (Berkeley) 97; Claremont Ave and Tunnel Rd toward the hills 42; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 41; College Ave from the north (Berkeley) 18; Telegraph Ave to the south (downtown Oakland) 17; Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) 12; Ashby Ave from the west (Emeryville and I-80) 9; SR-13 Warren Freeway (via SR-24 east) 9.


## Through cars by intent (cut-through intent view)

A through car is tallied once, under the first intent that fits it (the on-ramp on its planned route, the off-ramp it has driven, or the origin and destination groups of its trip), at the moment the through count counts it. Cars an hour over the run, the same window as the through-car figure (662 an hour).

| Intent | Basis | Cars an hour | Share |
| --- | --- | --- | --- |
| on-2853241697 | observed | 229 | 35% |
| Other on-ramps | assumed | 17 | 3% |
| off-52990846 | observed | 121 | 18% |
| Other off-ramps | assumed | 4 | 1% |
| Downtown, south and west Oakland traffic using side streets to reach Berkeley and Telegraph Ave north | assumed | 152 | 23% |
| Berkeley and Telegraph Ave north traffic using side streets to reach downtown, south and west Oakland | assumed | 39 | 6% |
| Oakland cross-town traffic (West Oakland, Broadway, Piedmont, Emeryville) using side streets near Claremont Ave and Telegraph Ave | assumed | 30 | 5% |
| Other (no intent listed) |  | 70 | 11% |

Intents listed cover 89% of through cars.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 229 trips (216 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 260 trips (235 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 149 trips (138 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 267 trips (249 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 56% | +9 | 229 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 2% | -31 | 229 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 9% | +3 | 229 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 27% | +0 | 229 |  |
| Colby Street NB | from | freeway | 47% | 50% | +3 | 260 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 52% | +4 | 260 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 42% | +17 | 260 |  |
| Colby Street NB | to | College Avenue | 3% | 6% | +3 | 260 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 38% | -8 | 149 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 8% | -18 | 149 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 15% | -1 | 149 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 70% | +2 | 149 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 23% | -20 | 267 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 16% | -30 | 267 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 21% | -1 | 267 |  |
| Colby Street SB | to | freeway | 45% | 48% | +3 | 267 | within |
| Colby Street SB | to | Forest Street | 34% | 28% | -6 | 267 |  |

Headline shares within tolerance: 4 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 13% | 811 | 15% | 714 |
| onto freeway | Hillegass Avenue | 12% | 13% | 811 | 15% | 714 |
| onto freeway | Martin Street | 10% | 10% | 811 | 11% | 714 |
| onto freeway | Colby Street | 8% | 15% | 811 | 17% | 714 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 19% | 811 | 14% | 714 |
| onto freeway | Benvenue Avenue | 5% | 4% | 811 | 5% | 714 |
| from freeway | College Avenue | 10% | 9% | 737 | 10% | 713 |
| from freeway | Martin Street | 10% | 13% | 737 | 13% | 713 |
| from freeway | Colby Street | 8% | 14% | 737 | 14% | 713 |
| from freeway | Hillegass Avenue | 5% | 8% | 737 | 9% | 713 |
| from freeway | Benvenue Avenue | 3% | 3% | 737 | 3% | 713 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4175 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 23.38 | 4.33 | 4.3 | 1499 |
| 460 | Sacramento Street | Tertiary | 2 | 104 | two_way_stop | 9.95 | 8.34 | 8.3 | 427 |
| 4167 | (unnamed) | Motorway | 3 | 75 | uncontrolled | 9.41 | 2.96 | 3.0 | 2443 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 9.27 | 7.79 | 7.8 | 1561 |
| 834 | Martin Luther King Junior Way | Secondary | 4 | 49 | signal | 7.79 | 5.67 | 5.7 | 1231 |
| 3395 | Ashby Avenue | Primary | 1 | 129 | signal | 7.57 | 5.75 | 5.8 | 480 |
| 1089 | Market Street | Tertiary | 2 | 111 | two_way_stop | 7.43 | 4.88 | 4.9 | 1090 |
| 3457 | The Uplands | Tertiary | 1 | 151 | two_way_stop | 7.05 | 4.84 | 4.8 | 332 |
| 265 | 59th Street | Residential | 1 | 150 | two_way_stop | 7.02 | 6.34 | 6.3 | 90 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 7.01 | 5.66 | 5.7 | 1298 |
| 1666 | 52nd Street | Secondary | 4 | 39 | signal | 6.69 | 5.96 | 6.0 | 713 |
| 1162 | Alcatraz Avenue | Tertiary | 1 | 172 | signal | 6.59 | 5.00 | 5.0 | 474 |
| 704 | Martin Luther King Junior Way | Secondary | 4 | 68 | signal | 6.49 | 5.10 | 5.1 | 1294 |
| 4397 | Ashby Avenue | Primary | 2 | 96 | signal | 6.44 | 4.96 | 5.0 | 443 |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 6.41 | 3.35 | 3.3 | 1477 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 5.43 | 0.19 | 75 s: 36/29 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 5.00 | 0.07 | 110 s: 30/28/38 |
| 446 | Market Street / Stanford Avenue | signal |  | 4.92 | 0.28 | 75 s: 44/21 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal |  | 4.53 | 0.03 | 75 s: 28/37 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 3.83 | 0.09 | 75 s: 16/29/15 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 3.57 | 0.15 | 75 s: 25/20/15 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.54 | 0.03 | 75 s: 45/20 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.54 | 0.04 | 75 s: 24/41 |
| 332 | 55th Street / Martin Luther King Junior Way | signal |  | 3.30 | 0.05 | 75 s: 32/33 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.23 | 0.04 | 75 s: 26/16/18 |
| 1069 | Claremont Avenue / Colby Street / Forest Street | signal |  | 3.19 | 0.04 | 79 s: 23/4/37 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.19 | 0.12 | 75 s: 37/28 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 3.07 | 0.05 | 75 s: 44/21 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 3.07 | 0.02 | 75 s: 36/29 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.88 | 0.01 | 75 s: 36/29 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 447: 36 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 29 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 680: 30 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666], 52nd Street 4L [1662]; 38 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 446: 44 s: Stanford Avenue 3L [941], Stanford Avenue 3L [1055]; 21 s: Market Street 4L [1108], Market Street 3L [1111]
- node 331: 28 s: Martin Luther King Junior Way 4L [704], Martin Luther King Junior Way 4L [761]; 37 s: 52nd Street 2L [758], 52nd Street 1L [760]
- node 1080: 16 s: Claremont Avenue 2L [2756], Claremont Avenue 2L [2798]; 29 s: College Avenue 2L [2761], College Avenue 2L [2819]; 15 s: 62nd Street 1L [2622]

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 314 | 61st Street | 61st Street / Lowell Street | two_way_stop | 1 | 45.4 |

## Cars cleared from gridlock near and far (judged zone)

Judged zone: the study area, its bounding streets and the junctions on them, plus nodes within 200 m of it along the network (111 nodes, 329 links). A far clearing counts against the stability rule when its blocking chain (vehicles held at least 60 s by a full exit, at the 5 s snapshot before it) reaches a link in the zone.

| Buffer (m) | Near | Far | Far, chain reaches the zone | Judged |
| --- | --- | --- | --- | --- |
| 100.0 | 0 | 1 | 0 | 0 |
| 200.0 | 0 | 1 | 0 | 0 |
| 400.0 | 0 | 1 | 0 | 0 |

| Far node | Streets | Distance from the study area (m) | Cleared | Chain reaches the zone |
| --- | --- | --- | --- | --- |
| 167 | 61st Street / Lowell Street | 1633.0 | 1 | 0 |

Entry backlog at the end of the run: 1 trips waiting at origins in the zone, of 181 in all.

| Bounding street | Links | Longest standing queue on one link (m) | Link (length m) | At (min) | Share of samples with a link full |
| --- | --- | --- | --- | --- | --- |
| Telegraph Avenue | 28 | 65.0 | 1979 (81.0) | 36.5 | 0.007 |
| Alcatraz Avenue | 14 | 72.0 | 4238 (84.0) | 17.3 | 0.003 |
| College Avenue | 6 | 72.0 | 2805 (102.0) | 15.3 | 0.008 |
| Claremont Avenue | 13 | 59.0 | 2776 (161.0) | 12.4 | 0.0 |
| CA 24 | 3 | 39.0 | 1945 (188.0) | 49.0 | 0.0 |

## Junction recovery

Policy `physical`. Node entries by cars and cyclists in the run: 850903 (settle interval 0). An admission is an entry the ordinary rule would have refused; head-seconds count the time a waiting head vehicle had the reason invoked, and the part of it in which it still could not enter. Courtesy and the yield fallback change priority only; under `physical` the conflict bypass never admits.

| Reason | Admissions per hour | Per 1,000 entries | Head-s invoked | Head-s blocked |
| --- | --- | --- | --- | --- |
| courtesy | 294.0 | 0.346 | 1849 | 1756 |
| yield fallback | 142.0 | 0.167 | 42 | 0 |
| conflict bypass | 0.0 | 0.000 | 2 | 2 |

Vehicles removed while held in a node by a full exit: 0 (0.0 per hour, included in the gridlock removals).

| Node | Streets | Control | Courtesy | Yield fallback | Conflict bypass | Held removals |
| --- | --- | --- | --- | --- | --- | --- |
| 141 | 63rd Street / Lowell Street / Market Street | two_way_stop | 17 | 12 | 0 | 0 |
| 147 | 59th Street / Grace Avenue / Los Angeles Street | two_way_stop | 16 | 6 | 0 | 0 |
| 165 | Alcatraz Avenue / Baker Street | two_way_stop | 9 | 11 | 0 | 0 |
| 125 | Alcatraz Avenue / Idaho Street | two_way_stop | 8 | 6 | 0 | 0 |
| 168 | 62nd Street / Market Street | two_way_stop | 5 | 9 | 0 | 0 |
| 464 | 61st Street / Market Street | two_way_stop | 4 | 8 | 0 | 0 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal | 11 | 0 | 0 | 0 |
| 395 | 65th Street / Shattuck Avenue | two_way_stop | 6 | 5 | 0 | 0 |
| 430 | Alcatraz Avenue / King Street | two_way_stop | 5 | 4 | 0 | 0 |
| 727 | 52nd Street | uncontrolled | 8 | 1 | 0 | 0 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 602 | Grove Shafter Freeway | 172 | 4041 |
| 448 | Adeline Street / Harmon Street | 3 | 31 |
| 449 | Adeline Street / Fairview Street | 2 | 42 |
| 74 | 43rd Street / San Pablo Avenue | 1 | 199 |
| 127 | 59th Street / Idaho Street | 1 | 11 |
| 301 | 47th Street / Martin Luther King Junior Way | 1 | 255 |
| 1093 | College Avenue / Harwood Avenue | 1 | 84 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 1079 | 1120 |
| Telegraph | S | 10 | 1022 | 1050 |
| College | N | 3 | 392 | 395 |
| College | S | 3 | 611 | 614 |
| Claremont | N | 6 | 522 | 734 |
| Claremont | S | 7 | 325 | 839 |
| Alcatraz | E | 6 | 481 | 520 |
| Alcatraz | W | 6 | 378 | 414 |
| Hillegass | N | 4 | 101 | 152 |
| Hillegass | S | 4 | 107 | 118 |
| Colby | N | 7 | 155 | 169 |
| Colby | S | 7 | 132 | 181 |
| Martin | E | 2 | 83 | 83 |
| Martin | W | 2 | 138 | 138 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 4041 |
| 943 | Telegraph Avenue / Ward Street | 1137 |
| 265 | Ashby Avenue | 1134 |
| 974 | Broadway | 1086 |
| 183 | San Pablo Avenue | 1024 |
| 1719 | Grove Shafter Freeway | 957 |
| 763 | Telegraph Avenue | 749 |
| 1672 | Warren Freeway | 684 |
| 324 | 51st Street / Martin Luther King Junior Way | 545 |
| 104 | San Pablo Avenue | 490 |
