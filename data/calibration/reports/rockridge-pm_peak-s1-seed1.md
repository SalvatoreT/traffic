# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 24768 veh/h x scale 1 = 24768 veh/h. Run took 24.7 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 2 | FAIL |
| Backlog / spawned | < 2% | 0.0% (4 of 24852) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.40 m/s (last 15 min 9.52) | pass |

Overall: **NOT STABLE**. Mean trip delay 141 s, mean trip time 432 s, completed 24075, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2936 | 6 | 1965 | 1 | 9.42 |
| 10 | 3041 | 0 | 3918 | 1 | 9.20 |
| 15 | 3177 | 8 | 5896 | 1 | 9.13 |
| 20 | 3241 | 6 | 7874 | 1 | 9.21 |
| 25 | 3236 | 2 | 9992 | 1 | 9.53 |
| 30 | 3299 | 6 | 11999 | 1 | 9.44 |
| 35 | 3410 | 4 | 13963 | 1 | 9.45 |
| 40 | 3341 | 6 | 16066 | 1 | 9.45 |
| 45 | 3362 | 9 | 18106 | 2 | 9.43 |
| 50 | 3352 | 6 | 20151 | 2 | 9.63 |
| 55 | 3418 | 9 | 22130 | 2 | 9.50 |
| 60 | 3619 | 4 | 24075 | 2 | 9.45 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 22017 | 0.01 | 0.7% | 1.091 | 1.049 | 5.3% | 0.1% | 1.030 | 2.2% | 0.0% | 5.6% | 2207 | 6.5% |
| gate to gate | 9093 | 0.01 | 1.0% | 1.089 | 1.052 | 3.9% | 0.0% | 1.025 | 2.1% | 0.0% | 8.5% | 659 | 4.3% |
| with a local end | 12924 | 0.01 | 0.5% | 1.093 | 1.047 | 6.2% | 0.1% | 1.032 | 2.4% | 0.0% | 3.5% | 1548 | 7.5% |
| guided drivers | 10132 | 0.02 | 1.6% | 1.093 | 1.049 | 5.6% | 0.1% | 1.030 | 2.4% | 0.0% | 5.6% | 1008 | 6.3% |
| other drivers | 11885 | 0.00 | 0.0% | 1.090 | 1.048 | 5.0% | 0.1% | 1.029 | 2.1% | 0.0% | 5.5% | 1199 | 6.8% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (399 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1465 | 8.8 | 2% |
| freeway to the surface gates | 824 | 18.9 | 5% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1477 | 1% | 15% | 83% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 1428 | 1% | 23% | 76% | 0.0 |

## Per-mode results

Offered: 24768 car veh/h; 626 bicycle flows (764/h); 2000 pedestrian flows (1731/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 3619 | 24075 | 432 | |
| Bicycle | 53 | 761 | 261 | |
| Pedestrian | 213 | 1619 | 425 | mean crossing delay 8.7 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 256, bicycle conflicts 456, close passes 463, pedestrian injury-risk index 0.047, bicycle injury-risk index 0.068 (proxy), mean vehicle speed at pedestrian encounters 2.41 m/s.


## Through cars on the counted blocks (a car is through when neither trip end is in the study area)

Observed through range = from the cars that drove the whole street (volunteer count, a lower bound) to the block volume less the cars whose trip ends along the street (an upper bound). Observed freeway-end trips = observed block volume times the observed freeway share of the street (the headline share of the targets file); these include freeway trips that end inside the study area, so they are not an expected through count. Modeled through = select-link trips with no end in the study area, per hour. Modeled freeway = select-link trips from or to a freeway node, per hour.

| Block | Observed volume (veh/h) | Observed freeway share | Observed freeway-end trips (veh/h) | Observed through range (veh/h) | Modeled through (veh/h) | In range | Modeled freeway trips (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | 110 | 47.0% | 52 | 48 to 95 | 42 | below | 95 |
| Colby Street NB | 174 | 47.0% | 82 | 102 to 145 | 81 | below | 134 |
| Hillegass Avenue SB | 160 | 68.0% | 109 | 79 to 120 | 33 | below | 105 |
| Colby Street SB | 160 | 45.0% | 72 | 39 to 117 | 69 | yes | 127 |

## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 156 trips (153 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 237 trips (231 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 148 trips (138 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 177 trips (166 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 57% | +10 | 156 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 1% | -32 | 156 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 1% | -5 | 156 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 19% | -8 | 156 |  |
| Colby Street NB | from | freeway | 47% | 50% | +3 | 237 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 16% | -32 | 237 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 30% | +5 | 237 |  |
| Colby Street NB | to | College Avenue | 3% | 2% | -1 | 237 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 6% | -40 | 148 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 2% | -24 | 148 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 3% | -13 | 148 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 71% | +3 | 148 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 20% | -23 | 177 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 10% | -36 | 177 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 21% | -1 | 177 |  |
| Colby Street SB | to | freeway | 45% | 69% | +24 | 177 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 12% | -22 | 177 |  |

Headline shares within tolerance: 2 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 16% | 732 | 20% | 573 |
| onto freeway | Hillegass Avenue | 12% | 11% | 732 | 14% | 573 |
| onto freeway | Martin Street | 10% | 12% | 732 | 13% | 573 |
| onto freeway | Colby Street | 8% | 14% | 732 | 18% | 573 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 9% | 732 | 8% | 573 |
| onto freeway | Benvenue Avenue | 5% | 3% | 732 | 4% | 573 |
| from freeway | College Avenue | 10% | 5% | 1134 | 7% | 870 |
| from freeway | Martin Street | 10% | 12% | 1134 | 15% | 870 |
| from freeway | Colby Street | 8% | 10% | 1134 | 14% | 870 |
| from freeway | Hillegass Avenue | 5% | 5% | 1134 | 7% | 870 |
| from freeway | Benvenue Avenue | 3% | 3% | 1134 | 4% | 870 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 17.99 | 11.52 | 11.5 | 892 |
| 1025 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 8.26 | 7.09 | 7.1 | 760 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 7.82 | 5.33 | 5.3 | 299 |
| 769 | Martin Luther King Junior Way | Secondary | 3 | 112 | signal | 6.83 | 4.15 | 4.1 | 1558 |
| 3395 | Ashby Avenue | Primary | 1 | 129 | signal | 6.71 | 3.68 | 3.7 | 966 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 6.61 | 5.56 | 5.6 | 798 |
| 3344 | Domingo Avenue | Residential | 1 | 110 | signal | 5.85 | 4.33 | 4.3 | 487 |
| 3434 | Claremont Avenue | Secondary | 1 | 93 | all_way_stop | 5.55 | 2.53 | 2.5 | 541 |
| 1607 | Telegraph Avenue | Secondary | 2 | 94 | signal | 5.28 | 2.93 | 2.9 | 1422 |
| 4329 | Claremont Avenue | Secondary | 2 | 113 | signal | 5.19 | 4.16 | 4.2 | 301 |
| 4382 | Warren Freeway | Motorway | 2 | 744 | uncontrolled | 5.07 | 1.02 | 1.0 | 1036 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 5.05 | 3.89 | 3.9 | 1248 |
| 4397 | Ashby Avenue | Primary | 2 | 96 | signal | 4.95 | 3.38 | 3.4 | 775 |
| 1603 | Telegraph Avenue | Secondary | 2 | 57 | signal | 4.93 | 2.77 | 2.8 | 1096 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 4.85 | 3.75 | 3.8 | 739 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 446 | Market Street / Stanford Avenue | signal |  | 5.57 | 0.07 | 75 s: 48/17 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 5.49 | 0.05 | 110 s: 34/28/34 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 4.01 | 0.07 | 75 s: 35/30 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.66 | 0.00 | 75 s: 21/44 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.56 | 0.02 | 75 s: 20/25/15 |
| 947 | Ashby Avenue / Telegraph Avenue | signal |  | 3.50 | 0.00 | 75 s: 24/41 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 3.35 | 0.02 | 75 s: 15/30/15 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.30 | 0.00 | 75 s: 27/38 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.19 | 0.01 | 75 s: 35/30 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 3.13 | 0.12 | 75 s: 50/15 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 2.82 | 0.00 | 75 s: 49/16 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.74 | 0.03 | 75 s: 40/25 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.74 | 0.00 | 75 s: 43/22 |
| 1373 | Ashby Avenue / Domingo Avenue / Tunnel Road | signal |  | 2.50 | 0.05 | 75 s: 34/31 |
| 1220 | Ashby Avenue / College Avenue | signal |  | 2.48 | 0.11 | 75 s: 41/24 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 446: 48 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 17 s: Market Street 4L [1108], Market Street 3L [1111]
- node 680: 34 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666]; 34 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 447: 35 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 30 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 479: 21 s: Martin Luther King Junior Way 3L [1025], Adeline Street 3L [4143]; 44 s: Stanford Avenue 1L [4139]
- node 30: 20 s: Adeline Street 1L [747], Adeline Street 1L [1030]; 25 s: Market Street 2L [755], Market Street 2L [1113]; 15 s: 57th Street 1L [44], 57th Street 1L [1151]

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 1662 | 52nd Street | 52nd Street / Shattuck Avenue | signal | 1 | 2.9 |
| 3376 | Claremont Crescent | Claremont Crescent | all_way_stop | 1 | 40.4 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 1113 | Chabot Road / Presley Way | 1 | 61 |
| 1232 | Ashby Avenue / Claremont Crescent | 1 | 35 |
| 1373 | Ashby Avenue / Domingo Avenue / Tunnel Road | 1 | 38 |
| 1385 | Oak Ridge Road / Tunnel Road | 1 | 4 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 989 | 1027 |
| Telegraph | S | 10 | 894 | 924 |
| College | N | 3 | 382 | 385 |
| College | S | 3 | 690 | 692 |
| Claremont | N | 6 | 425 | 653 |
| Claremont | S | 7 | 329 | 624 |
| Alcatraz | E | 6 | 433 | 452 |
| Alcatraz | W | 6 | 458 | 480 |
| Hillegass | N | 4 | 94 | 108 |
| Hillegass | S | 4 | 91 | 114 |
| Colby | N | 7 | 146 | 179 |
| Colby | S | 7 | 103 | 122 |
| Martin | E | 2 | 97 | 97 |
| Martin | W | 2 | 128 | 128 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 4213 |
| 943 | Telegraph Avenue / Ward Street | 1337 |
| 1672 | Warren Freeway | 1244 |
| 183 | San Pablo Avenue | 1213 |
| 265 | Ashby Avenue | 1134 |
| 763 | Telegraph Avenue | 700 |
| 974 | Broadway | 534 |
| 1719 | Grove Shafter Freeway | 508 |
| 1756 | Claremont Avenue | 507 |
| 276 | Martin Luther King Junior Way | 409 |
