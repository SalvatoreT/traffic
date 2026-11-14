# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 21826 veh/h x scale 1 = 21826 veh/h. Run took 22.0 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (1 of 21874) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.56 m/s (last 15 min 9.54) | pass |

Overall: **STABLE**. Mean trip delay 129 s, mean trip time 425 s, completed 21246, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2537 | 2 | 1846 | 0 | 9.84 |
| 10 | 2604 | 0 | 3587 | 0 | 9.48 |
| 15 | 2684 | 5 | 5375 | 0 | 9.48 |
| 20 | 2664 | 1 | 7177 | 0 | 9.76 |
| 25 | 2705 | 4 | 8958 | 0 | 9.64 |
| 30 | 2845 | 1 | 10666 | 0 | 9.58 |
| 35 | 2925 | 1 | 12377 | 0 | 9.27 |
| 40 | 2899 | 1 | 14166 | 0 | 9.36 |
| 45 | 2914 | 4 | 15992 | 0 | 9.79 |
| 50 | 3062 | 9 | 17688 | 0 | 9.79 |
| 55 | 3203 | 2 | 19419 | 0 | 9.37 |
| 60 | 3163 | 1 | 21246 | 0 | 9.45 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 19451 | 0.00 | 0.5% | 1.092 | 1.055 | 4.8% | 0.0% | 1.027 | 1.9% | 0.0% | 5.4% | 1769 | 9.4% |
| gate to gate | 7843 | 0.01 | 0.6% | 1.097 | 1.069 | 4.0% | 0.0% | 1.021 | 1.8% | 0.0% | 7.7% | 474 | 9.5% |
| with a local end | 11608 | 0.00 | 0.4% | 1.089 | 1.045 | 5.4% | 0.0% | 1.030 | 2.0% | 0.0% | 3.9% | 1295 | 9.4% |
| guided drivers | 8986 | 0.01 | 1.0% | 1.091 | 1.053 | 4.7% | 0.0% | 1.026 | 2.0% | 0.0% | 5.3% | 797 | 8.4% |
| other drivers | 10465 | 0.00 | 0.0% | 1.093 | 1.056 | 5.0% | 0.0% | 1.027 | 1.9% | 0.0% | 5.5% | 973 | 10.2% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (311 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1341 | 7.3 | 2% |
| freeway to the surface gates | 832 | 2.0 | 1% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1129 | 3% | 15% | 82% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 1071 | 1% | 25% | 75% | 0.0 |

## Per-mode results

Offered: 21826 car veh/h; 497 bicycle flows (702/h); 2000 pedestrian flows (1340/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 3163 | 21246 | 425 | |
| Bicycle | 39 | 692 | 242 | |
| Pedestrian | 170 | 1254 | 465 | mean crossing delay 7.4 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 239, bicycle conflicts 444, close passes 643, pedestrian injury-risk index 0.049, bicycle injury-risk index 0.067 (proxy), mean vehicle speed at pedestrian encounters 2.54 m/s.


## Through cars on the counted blocks (a car is through when neither trip end is in the study area)

Observed through range = from the cars that drove the whole street (volunteer count, a lower bound) to the block volume less the cars whose trip ends along the street (an upper bound). Observed freeway-end trips = observed block volume times the observed freeway share of the street (the headline share of the targets file); these include freeway trips that end inside the study area, so they are not an expected through count. Modeled through = select-link trips with no end in the study area, per hour. Modeled freeway = select-link trips from or to a freeway node, per hour.

| Block | Observed volume (veh/h) | Observed freeway share | Observed freeway-end trips (veh/h) | Observed through range (veh/h) | Modeled through (veh/h) | In range | Modeled freeway trips (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 141 trips (136 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 175 trips (165 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 132 trips (125 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 167 trips (151 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 61% | +14 | 141 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 4% | -17 | 141 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 7% | +1 | 141 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 24% | -3 | 141 |  |
| Colby Street NB | from | freeway | 47% | 46% | -1 | 175 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 23% | -25 | 175 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 19% | -6 | 175 |  |
| Colby Street NB | to | College Avenue | 3% | 1% | -2 | 175 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 5% | -41 | 132 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 1% | -25 | 132 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 8% | -8 | 132 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 59% | +2 | 132 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 22% | -21 | 167 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 8% | -38 | 167 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 18% | -4 | 167 |  |
| Colby Street SB | to | freeway | 45% | 69% | +24 | 167 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 11% | -23 | 167 |  |

Headline shares within tolerance: 2 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 20% | 599 | 23% | 511 |
| onto freeway | Hillegass Avenue | 12% | 12% | 599 | 14% | 511 |
| onto freeway | Martin Street | 10% | 17% | 599 | 17% | 511 |
| onto freeway | Colby Street | 8% | 13% | 599 | 15% | 511 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 10% | 599 | 7% | 511 |
| onto freeway | Benvenue Avenue | 5% | 4% | 599 | 5% | 511 |
| from freeway | College Avenue | 10% | 7% | 845 | 8% | 683 |
| from freeway | Martin Street | 10% | 10% | 845 | 13% | 683 |
| from freeway | Colby Street | 8% | 10% | 845 | 12% | 683 |
| from freeway | Hillegass Avenue | 5% | 6% | 845 | 8% | 683 |
| from freeway | Benvenue Avenue | 3% | 2% | 845 | 3% | 683 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 18.20 | 10.39 | 10.4 | 1026 |
| 4382 | Warren Freeway | Motorway | 2 | 744 | uncontrolled | 9.01 | 1.33 | 1.3 | 1121 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 6.66 | 4.78 | 4.8 | 281 |
| 1025 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 6.10 | 5.16 | 5.2 | 871 |
| 2248 | Telegraph Avenue | Secondary | 2 | 104 | signal | 5.88 | 3.01 | 3.0 | 1966 |
| 769 | Martin Luther King Junior Way | Secondary | 3 | 112 | signal | 5.58 | 3.41 | 3.4 | 1378 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 5.56 | 4.45 | 4.5 | 856 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 5.54 | 4.48 | 4.5 | 707 |
| 108 | Stanford Avenue | Secondary | 3 | 61 | signal | 5.50 | 3.17 | 3.2 | 1670 |
| 4192 | Ashby Avenue | Primary | 2 | 99 | signal | 5.32 | 4.43 | 4.4 | 258 |
| 2303 | Telegraph Avenue | Secondary | 2 | 104 | signal | 5.03 | 3.17 | 3.2 | 1530 |
| 755 | Market Street | Tertiary | 2 | 77 | signal | 4.84 | 3.90 | 3.9 | 496 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 4.71 | 3.56 | 3.6 | 1258 |
| 2008 | Shattuck Avenue | Tertiary | 1 | 93 | signal | 4.29 | 2.96 | 3.0 | 570 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 4.21 | 3.72 | 3.7 | 850 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 5.28 | 0.02 | 90 s: 22/19/34 |
| 446 | Market Street / Stanford Avenue | signal |  | 5.18 | 0.02 | 75 s: 50/15 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 3.82 | 0.07 | 75 s: 27/38 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.60 | 0.01 | 75 s: 23/22/15 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.43 | 0.00 | 75 s: 24/41 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.28 | 0.01 | 75 s: 24/41 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.12 | 0.04 | 75 s: 36/29 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.92 | 0.00 | 75 s: 47/18 |
| 947 | Ashby Avenue / Telegraph Avenue | signal |  | 2.87 | 0.00 | 75 s: 20/45 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.67 | 0.00 | 75 s: 21/24/15 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 2.54 | 0.05 | 75 s: 50/15 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.47 | 0.03 | 75 s: 41/24 |
| 501 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.39 | 0.05 | 85 s: 28/47 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 2.38 | 0.00 | 75 s: 38/27 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.36 | 0.00 | 75 s: 44/21 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 680: 22 s: 52nd Street 4L [1662]; 19 s: 52nd Street 4L [1666]; 34 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 446: 50 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 15 s: Market Street 4L [1108], Market Street 3L [1111]
- node 447: 27 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 38 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 30: 23 s: Adeline Street 1L [747], Adeline Street 1L [1030]; 22 s: Market Street 2L [755], Market Street 2L [1113]; 15 s: 57th Street 1L [44], 57th Street 1L [1151]
- node 37: 24 s: San Pablo Avenue 3L [114], San Pablo Avenue 3L [115]; 41 s: Stanford Avenue 3L [108], Stanford Avenue 2L [4109]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 768 | 59th Street / Shattuck Avenue | 1 | 1 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 668 | 688 |
| Telegraph | S | 10 | 599 | 638 |
| College | N | 3 | 265 | 268 |
| College | S | 3 | 396 | 398 |
| Claremont | N | 6 | 406 | 674 |
| Claremont | S | 7 | 442 | 653 |
| Alcatraz | E | 6 | 330 | 348 |
| Alcatraz | W | 6 | 500 | 518 |
| Hillegass | N | 4 | 73 | 103 |
| Hillegass | S | 4 | 78 | 78 |
| Colby | N | 7 | 88 | 113 |
| Colby | S | 7 | 88 | 94 |
| Martin | E | 2 | 113 | 113 |
| Martin | W | 2 | 120 | 120 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 3727 |
| 943 | Telegraph Avenue / Ward Street | 2129 |
| 1672 | Warren Freeway | 1387 |
| 265 | Ashby Avenue | 1242 |
| 183 | San Pablo Avenue | 1179 |
| 763 | Telegraph Avenue | 505 |
| 275 | Market Street | 412 |
| 184 | Alcatraz Avenue | 394 |
| 974 | Broadway | 385 |
| 971 | Pleasant Valley Avenue | 339 |
