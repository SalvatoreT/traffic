# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 20249 veh/h x scale 1 = 20249 veh/h. Run took 28.7 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.9% (180 of 20023) | pass |
| Arterial mean speed (run) | > 4 m/s | 8.88 m/s (last 15 min 8.47) | pass |

Overall: **STABLE**. Mean trip delay 145 s, mean trip time 445 s, completed 19707, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2472 | 3 | 1539 | 0 | 8.77 |
| 10 | 2546 | 20 | 3188 | 0 | 9.13 |
| 15 | 2422 | 69 | 4929 | 0 | 9.41 |
| 20 | 2446 | 43 | 6669 | 0 | 9.47 |
| 25 | 2442 | 51 | 8340 | 0 | 9.16 |
| 30 | 2457 | 98 | 9996 | 0 | 8.96 |
| 35 | 2547 | 132 | 11559 | 0 | 8.62 |
| 40 | 2555 | 94 | 13228 | 0 | 9.04 |
| 45 | 2587 | 98 | 14828 | 0 | 8.72 |
| 50 | 2677 | 87 | 16451 | 0 | 8.64 |
| 55 | 2778 | 104 | 18032 | 0 | 7.91 |
| 60 | 2654 | 180 | 19707 | 0 | 8.86 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 18039 | 0.03 | 2.4% | 1.106 | 1.064 | 8.4% | 0.3% | 1.040 | 4.8% | 0.0% | 6.0% | 2046 | 15.4% |
| gate to gate | 9391 | 0.04 | 3.8% | 1.108 | 1.080 | 6.8% | 0.0% | 1.040 | 4.3% | 0.0% | 9.1% | 869 | 13.1% |
| with a local end | 8648 | 0.01 | 0.9% | 1.105 | 1.038 | 10.1% | 0.6% | 1.040 | 5.3% | 0.0% | 2.6% | 1178 | 17.1% |
| guided drivers | 8344 | 0.05 | 5.0% | 1.104 | 1.062 | 7.9% | 0.2% | 1.038 | 4.4% | 0.0% | 6.0% | 965 | 14.2% |
| other drivers | 9695 | 0.00 | 0.2% | 1.108 | 1.065 | 8.9% | 0.4% | 1.042 | 5.1% | 0.0% | 6.1% | 1081 | 16.6% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (281 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1018 | 10.4 | 4% |
| freeway to the surface gates | 1184 | 5.4 | 2% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1043 | 2% | 9% | 89% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 1021 | 4% | 21% | 75% | 0.2 |

## Per-mode results

Offered: 20249 car veh/h; 1500 bicycle flows (1061/h); 2000 pedestrian flows (1540/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 2654 | 19707 | 445 | |
| Bicycle | 107 | 1062 | 362 | |
| Pedestrian | 184 | 1429 | 482 | mean crossing delay 5.5 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 303, bicycle conflicts 1314, close passes 833, pedestrian injury-risk index 0.042, bicycle injury-risk index 0.047 (proxy), mean vehicle speed at pedestrian encounters 2.34 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 76 trips (72 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 72 trips (67 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 132 trips (128 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 160 trips (145 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 68% | +21 | 76 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 1% | -20 | 76 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 4% | -2 | 76 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 25% | -2 | 76 |  |
| Colby Street NB | from | freeway | 47% | 32% | -15 | 72 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 14% | -34 | 72 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 25% | +0 | 72 |  |
| Colby Street NB | to | College Avenue | 3% | 22% | +19 | 72 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 28% | -18 | 132 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 14% | -12 | 132 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 11% | -5 | 132 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 61% | +4 | 132 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 17% | -26 | 160 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 38% | -8 | 160 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 35% | +13 | 160 |  |
| Colby Street SB | to | freeway | 45% | 29% | -16 | 160 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 46% | +12 | 160 |  |

Headline shares within tolerance: 1 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 14% | 777 | 13% | 714 |
| onto freeway | Hillegass Avenue | 12% | 12% | 777 | 13% | 714 |
| onto freeway | Martin Street | 10% | 14% | 777 | 15% | 714 |
| onto freeway | Colby Street | 8% | 7% | 777 | 7% | 714 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 15% | 777 | 12% | 714 |
| onto freeway | Benvenue Avenue | 5% | 4% | 777 | 5% | 714 |
| from freeway | College Avenue | 10% | 8% | 1308 | 8% | 980 |
| from freeway | Martin Street | 10% | 13% | 1308 | 17% | 980 |
| from freeway | Colby Street | 8% | 7% | 1308 | 10% | 980 |
| from freeway | Hillegass Avenue | 5% | 4% | 1308 | 5% | 980 |
| from freeway | Benvenue Avenue | 3% | 2% | 1308 | 2% | 980 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4436 | Ashby Avenue | Primary | 2 | 96 | signal | 14.45 | 12.68 | 12.7 | 300 |
| 4208 | Grove Shafter Freeway | Motorway | 4 | 834 | uncontrolled | 13.64 | 5.69 | 5.7 | 1970 |
| 265 | 59th Street | Residential | 1 | 150 | two_way_stop | 12.81 | 12.21 | 12.2 | 62 |
| 4206 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 9.92 | 0.62 | 0.6 | 1554 |
| 1679 | 52nd Street | Secondary | 4 | 53 | signal | 9.37 | 7.90 | 7.9 | 592 |
| 315 | Stanford Avenue | Secondary | 2 | 354 | uncontrolled | 9.17 | 4.33 | 4.3 | 1348 |
| 728 | 55th Street | Tertiary | 1 | 238 | signal | 8.37 | 5.95 | 5.9 | 438 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 8.36 | 6.64 | 6.6 | 570 |
| 341 | San Pablo Avenue | Primary | 2 | 75 | uncontrolled | 7.51 | 5.59 | 5.6 | 587 |
| 338 | San Pablo Avenue | Primary | 3 | 37 | two_way_stop | 7.19 | 5.05 | 5.0 | 1343 |
| 225 | 61st Street | Residential | 1 | 137 | two_way_stop | 6.13 | 4.81 | 4.8 | 188 |
| 352 | San Pablo Avenue | Primary | 2 | 50 | uncontrolled | 5.87 | 3.07 | 3.1 | 1343 |
| 108 | Stanford Avenue | Secondary | 3 | 61 | signal | 5.36 | 3.05 | 3.1 | 1355 |
| 1139 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 5.12 | 3.79 | 3.8 | 356 |
| 4191 | (unnamed) | Motorway | 2 | 513 | uncontrolled | 5.05 | 2.94 | 2.9 | 500 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 688 | 52nd Street / Shattuck Avenue | signal |  | 4.51 | 0.20 | 75 s: 24/41 |
| 454 | Market Street / Stanford Avenue | signal |  | 3.88 | 0.15 | 75 s: 50/15 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.60 | 0.00 | 75 s: 14/14/14/14 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.18 | 0.07 | 75 s: 27/38 |
| 1389 | Ashby Avenue / Domingo Avenue / Tunnel Road | signal |  | 2.98 | 0.26 | 75 s: 28/17/15 |
| 339 | 52nd Street / Martin Luther King Junior Way | signal |  | 2.91 | 0.01 | 75 s: 50/15 |
| 1422 | Ashby Avenue / Claremont Avenue | signal |  | 2.83 | 0.15 | 75 s: 43/22 |
| 863 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.77 | 0.04 | 75 s: 42/23 |
| 455 | Adeline Street / Alcatraz Avenue | signal |  | 2.74 | 0.04 | 75 s: 29/36 |
| 131 | 61st Street / San Pablo Avenue | two_way_stop |  | 2.54 | 0.77 |  |
| 509 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.44 | 0.10 | 75 s: 17/48 |
| 959 | Ashby Avenue / Telegraph Avenue | signal |  | 2.31 | 0.00 | 75 s: 18/47 |
| 956 | Ashby Avenue / Shattuck Avenue | signal |  | 2.28 | 0.11 | 75 s: 40/25 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.27 | 0.03 | 75 s: 35/30 |
| 960 | Telegraph Avenue / Webster Street | signal |  | 2.16 | 0.04 | 75 s: 22/15/23 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 688: 24 s: 52nd Street 4L [1679], 52nd Street 4L [1683]; 41 s: Shattuck Avenue 2L [1670], Shattuck Avenue 2L [1722]
- node 454: 50 s: Stanford Avenue 1L [958], Stanford Avenue 3L [1072]; 15 s: Market Street 4L [1125], Market Street 3L [1128]
- node 30: 14 s: Adeline Street 1L [764], Adeline Street 1L [1047]; 14 s: Market Street 2L [772], Market Street 2L [1130]; 14 s: 57th Street 1L [44]; 14 s: 57th Street 1L [1168]
- node 37: 27 s: San Pablo Avenue 3L [114], San Pablo Avenue 3L [115]; 38 s: Stanford Avenue 3L [108], Stanford Avenue 2L [4140]
- node 1389: 28 s: Tunnel Road 2L [3494],  1L [4378]; 17 s: Ashby Avenue 2L [4436]; 15 s: Domingo Avenue 1L [3375], Domingo Avenue 1L [4381]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 183 | San Pablo Avenue | 168 | 1502 |
| 610 | Grove Shafter Freeway | 8 | 4081 |
| 132 | 62nd Street / San Pablo Avenue | 4 | 26 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 779 | 815 |
| Telegraph | S | 10 | 1075 | 1153 |
| College | N | 3 | 229 | 229 |
| College | S | 3 | 308 | 311 |
| Claremont | N | 6 | 644 | 878 |
| Claremont | S | 7 | 509 | 785 |
| Alcatraz | E | 6 | 336 | 362 |
| Alcatraz | W | 6 | 482 | 492 |
| Hillegass | N | 4 | 58 | 64 |
| Hillegass | S | 4 | 100 | 108 |
| Colby | N | 7 | 24 | 29 |
| Colby | S | 7 | 85 | 92 |
| Martin | E | 2 | 127 | 127 |
| Martin | W | 2 | 176 | 176 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 610 | Grove Shafter Freeway | 4081 |
| 955 | Telegraph Avenue / Ward Street | 2104 |
| 183 | San Pablo Avenue | 1502 |
| 1688 | Warren Freeway | 1492 |
| 266 | Ashby Avenue | 1243 |
| 1774 | Claremont Avenue | 523 |
| 104 | San Pablo Avenue | 521 |
| 283 | Market Street | 515 |
| 771 | Telegraph Avenue | 466 |
| 1735 | Grove Shafter Freeway | 263 |
