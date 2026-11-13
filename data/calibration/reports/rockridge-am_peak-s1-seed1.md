# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 20845 veh/h x scale 1 = 20845 veh/h. Run took 21.9 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (0 of 20899) | pass |
| Arterial mean speed (run) | > 4 m/s | 8.93 m/s (last 15 min 8.85) | pass |

Overall: **STABLE**. Mean trip delay 129 s, mean trip time 423 s, completed 20881, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2459 | 0 | 1809 | 0 | 9.40 |
| 10 | 2508 | 5 | 3499 | 0 | 8.96 |
| 15 | 2487 | 1 | 5237 | 0 | 8.95 |
| 20 | 2564 | 1 | 6881 | 0 | 8.85 |
| 25 | 2448 | 18 | 8634 | 0 | 8.72 |
| 30 | 2432 | 18 | 10415 | 0 | 9.11 |
| 35 | 2563 | 21 | 12077 | 0 | 9.11 |
| 40 | 2496 | 34 | 13849 | 0 | 8.85 |
| 45 | 2594 | 13 | 15555 | 0 | 8.72 |
| 50 | 2644 | 0 | 17279 | 0 | 8.62 |
| 55 | 2609 | 1 | 19039 | 0 | 8.84 |
| 60 | 2488 | 0 | 20881 | 0 | 9.09 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 19132 | 0.02 | 1.9% | 1.107 | 1.068 | 8.3% | 0.2% | 1.035 | 3.4% | 0.0% | 6.8% | 2398 | 13.8% |
| gate to gate | 9457 | 0.03 | 2.8% | 1.110 | 1.083 | 7.1% | 0.1% | 1.034 | 2.7% | 0.0% | 10.9% | 917 | 13.3% |
| with a local end | 9675 | 0.01 | 0.9% | 1.104 | 1.044 | 9.5% | 0.4% | 1.036 | 4.1% | 0.0% | 2.7% | 1481 | 14.1% |
| guided drivers | 8736 | 0.04 | 3.9% | 1.107 | 1.069 | 8.3% | 0.3% | 1.035 | 3.3% | 0.0% | 6.5% | 1086 | 12.7% |
| other drivers | 10396 | 0.00 | 0.1% | 1.107 | 1.068 | 8.3% | 0.2% | 1.035 | 3.5% | 0.0% | 7.0% | 1313 | 14.7% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (384 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1050 | 8.0 | 2% |
| freeway to the surface gates | 1248 | 10.8 | 3% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 954 | 0% | 10% | 90% | 0.0 |
| Hillegass Avenue | College Avenue | 3 | S | 939 | 1% | 14% | 84% | 0.1 |

## Per-mode results

Offered: 20845 car veh/h; 1500 bicycle flows (1061/h); 2000 pedestrian flows (1540/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 2488 | 20881 | 423 | |
| Bicycle | 101 | 1067 | 347 | |
| Pedestrian | 215 | 1453 | 479 | mean crossing delay 5.8 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 351, bicycle conflicts 1197, close passes 1402, pedestrian injury-risk index 0.052, bicycle injury-risk index 0.061 (proxy), mean vehicle speed at pedestrian encounters 2.60 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 108 trips (103 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 180 trips (173 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 159 trips (144 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 248 trips (219 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 72% | +25 | 108 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 4% | -17 | 108 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 9% | +3 | 108 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 23% | -4 | 108 |  |
| Colby Street NB | from | freeway | 47% | 82% | +35 | 180 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 7% | -41 | 180 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 12% | -13 | 180 |  |
| Colby Street NB | to | College Avenue | 3% | 3% | -0 | 180 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 12% | -34 | 159 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 1% | -25 | 159 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 6% | -10 | 159 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 58% | +1 | 159 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 8% | -35 | 248 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 16% | -30 | 248 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 23% | +1 | 248 |  |
| Colby Street SB | to | freeway | 45% | 73% | +28 | 248 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 10% | -24 | 248 |  |

Headline shares within tolerance: 1 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 13% | 823 | 13% | 796 |
| onto freeway | Hillegass Avenue | 12% | 11% | 823 | 11% | 796 |
| onto freeway | Martin Street | 10% | 12% | 823 | 12% | 796 |
| onto freeway | Colby Street | 8% | 19% | 823 | 20% | 796 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 10% | 823 | 8% | 796 |
| onto freeway | Benvenue Avenue | 5% | 2% | 823 | 2% | 796 |
| from freeway | College Avenue | 10% | 7% | 1472 | 8% | 1266 |
| from freeway | Martin Street | 10% | 14% | 1472 | 16% | 1266 |
| from freeway | Colby Street | 8% | 9% | 1472 | 11% | 1266 |
| from freeway | Hillegass Avenue | 5% | 6% | 1472 | 7% | 1266 |
| from freeway | Benvenue Avenue | 3% | 2% | 1472 | 2% | 1266 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4208 | Grove Shafter Freeway | Motorway | 4 | 834 | uncontrolled | 18.43 | 0.75 | 0.7 | 2264 |
| 1679 | 52nd Street | Secondary | 4 | 53 | signal | 12.21 | 10.59 | 10.6 | 517 |
| 4191 | (unnamed) | Motorway | 2 | 513 | uncontrolled | 10.18 | 6.28 | 6.3 | 460 |
| 4165 | Martin Luther King Junior Way | Secondary | 3 | 147 | uncontrolled | 9.20 | 6.58 | 6.6 | 1520 |
| 728 | 55th Street | Tertiary | 1 | 238 | signal | 8.28 | 6.00 | 6.0 | 478 |
| 4421 | Warren Freeway | Motorway | 2 | 744 | uncontrolled | 7.61 | 2.94 | 2.9 | 1139 |
| 3465 | Claremont Avenue | Secondary | 1 | 93 | all_way_stop | 7.31 | 3.99 | 4.0 | 545 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 7.12 | 5.67 | 5.7 | 820 |
| 4206 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 6.97 | 0.46 | 0.5 | 1489 |
| 2061 | Alcatraz Avenue | Tertiary | 1 | 202 | uncontrolled | 6.44 | 4.83 | 4.8 | 482 |
| 498 | Sacramento Street | Tertiary | 3 | 55 | signal | 6.05 | 5.03 | 5.0 | 548 |
| 1125 | Market Street | Secondary | 4 | 36 | signal | 5.80 | 5.22 | 5.2 | 502 |
| 1109 | (unnamed) | Service | 1 | 110 | uncontrolled | 5.77 | 4.91 | 4.9 | 136 |
| 778 | Martin Luther King Junior Way | Secondary | 4 | 32 | signal | 5.53 | 4.61 | 4.6 | 1530 |
| 2272 | Telegraph Avenue | Secondary | 2 | 104 | signal | 5.34 | 2.77 | 2.8 | 1812 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 454 | Market Street / Stanford Avenue | signal |  | 5.17 | 0.12 | 75 s: 50/15 |
| 688 | 52nd Street / Shattuck Avenue | signal |  | 5.08 | 0.49 | 75 s: 21/44 |
| 455 | Adeline Street / Alcatraz Avenue | signal |  | 4.21 | 0.12 | 75 s: 17/48 |
| 339 | 52nd Street / Martin Luther King Junior Way | signal |  | 4.11 | 0.48 | 75 s: 50/15 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.87 | 0.07 | 75 s: 29/36 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.27 | 0.02 | 75 s: 21/23/16 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.97 | 0.03 | 75 s: 35/30 |
| 863 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.87 | 0.05 | 75 s: 42/23 |
| 1422 | Ashby Avenue / Claremont Avenue | signal |  | 2.69 | 0.11 | 75 s: 50/15 |
| 237 | Ashby Avenue / Sacramento Street | signal |  | 2.65 | 0.01 | 75 s: 49/16 |
| 340 | 55th Street / Martin Luther King Junior Way | signal |  | 2.62 | 0.00 | 75 s: 29/36 |
| 1095 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.55 | 0.00 | 75 s: 20/25/15 |
| 487 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 2.51 | 0.02 | 75 s: 21/44 |
| 509 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.39 | 0.06 | 75 s: 19/46 |
| 956 | Ashby Avenue / Shattuck Avenue | signal |  | 2.24 | 0.00 | 75 s: 43/22 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 454: 50 s: Stanford Avenue 1L [958], Stanford Avenue 3L [1072]; 15 s: Market Street 4L [1125], Market Street 3L [1128]
- node 688: 21 s: 52nd Street 4L [1679], 52nd Street 4L [1683]; 44 s: Shattuck Avenue 2L [1670], Shattuck Avenue 2L [1722]
- node 455: 17 s: Adeline Street 4L [1066], Adeline Street 4L [1068]; 48 s: Alcatraz Avenue 2L [1065], Alcatraz Avenue 2L [1150]
- node 339: 50 s: Martin Luther King Junior Way 4L [721], Martin Luther King Junior Way 4L [778]; 15 s: 52nd Street 2L [775], 52nd Street 1L [777]
- node 37: 29 s: San Pablo Avenue 3L [114], San Pablo Avenue 3L [115]; 36 s: Stanford Avenue 3L [108], Stanford Avenue 2L [4140]

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 1000 | 1050 |
| Telegraph | S | 10 | 1028 | 1082 |
| College | N | 3 | 347 | 348 |
| College | S | 3 | 392 | 396 |
| Claremont | N | 6 | 618 | 1057 |
| Claremont | S | 7 | 604 | 1067 |
| Alcatraz | E | 6 | 470 | 475 |
| Alcatraz | W | 6 | 457 | 502 |
| Hillegass | N | 4 | 82 | 89 |
| Hillegass | S | 4 | 98 | 119 |
| Colby | N | 7 | 114 | 158 |
| Colby | S | 7 | 166 | 184 |
| Martin | E | 2 | 122 | 122 |
| Martin | W | 2 | 218 | 218 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 610 | Grove Shafter Freeway | 4110 |
| 955 | Telegraph Avenue / Ward Street | 2094 |
| 1688 | Warren Freeway | 1413 |
| 266 | Ashby Avenue | 1240 |
| 183 | San Pablo Avenue | 1171 |
| 104 | San Pablo Avenue | 554 |
| 283 | Market Street | 533 |
| 1774 | Claremont Avenue | 524 |
| 771 | Telegraph Avenue | 467 |
| 1735 | Grove Shafter Freeway | 333 |
