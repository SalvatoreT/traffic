# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 20845 veh/h x scale 1 = 20845 veh/h. Run took 22.7 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 4 | FAIL |
| Backlog / spawned | < 2% | 0.0% (6 of 20895) | pass |
| Arterial mean speed (run) | > 4 m/s | 8.38 m/s (last 15 min 8.13) | pass |

Overall: **NOT STABLE**. Mean trip delay 149 s, mean trip time 442 s, completed 20714, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2552 | 0 | 1721 | 0 | 8.59 |
| 10 | 2662 | 0 | 3351 | 4 | 8.41 |
| 15 | 2660 | 0 | 5066 | 4 | 8.24 |
| 20 | 2646 | 25 | 6776 | 4 | 8.31 |
| 25 | 2511 | 18 | 8572 | 4 | 8.66 |
| 30 | 2571 | 1 | 10294 | 4 | 8.47 |
| 35 | 2639 | 0 | 12023 | 4 | 8.68 |
| 40 | 2555 | 6 | 13819 | 4 | 8.59 |
| 45 | 2747 | 31 | 15385 | 4 | 8.22 |
| 50 | 2792 | 36 | 17096 | 4 | 7.93 |
| 55 | 2728 | 1 | 18921 | 4 | 8.34 |
| 60 | 2650 | 6 | 20714 | 4 | 8.11 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 18968 | 0.03 | 2.6% | 1.117 | 1.074 | 9.7% | 0.5% | 1.046 | 4.7% | 0.0% | 6.8% | 2357 | 15.0% |
| gate to gate | 9364 | 0.04 | 4.0% | 1.117 | 1.089 | 7.8% | 0.1% | 1.042 | 3.7% | 0.0% | 10.8% | 880 | 13.1% |
| with a local end | 9604 | 0.01 | 1.3% | 1.117 | 1.050 | 11.6% | 0.8% | 1.049 | 5.7% | 0.0% | 2.9% | 1477 | 16.2% |
| guided drivers | 8657 | 0.06 | 5.6% | 1.116 | 1.074 | 9.4% | 0.5% | 1.045 | 4.6% | 0.0% | 6.7% | 1091 | 13.5% |
| other drivers | 10311 | 0.00 | 0.2% | 1.118 | 1.075 | 10.0% | 0.5% | 1.047 | 4.8% | 0.0% | 6.8% | 1266 | 16.4% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (390 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1044 | 9.8 | 3% |
| freeway to the surface gates | 1229 | 8.2 | 2% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 942 | 0% | 8% | 91% | 0.0 |
| Hillegass Avenue | College Avenue | 3 | S | 923 | 2% | 14% | 84% | 0.1 |

## Per-mode results

Offered: 20845 car veh/h; 1500 bicycle flows (1061/h); 2000 pedestrian flows (1540/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 2650 | 20714 | 442 | |
| Bicycle | 103 | 1063 | 346 | |
| Pedestrian | 214 | 1454 | 479 | mean crossing delay 5.7 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 382, bicycle conflicts 1356, close passes 1364, pedestrian injury-risk index 0.049, bicycle injury-risk index 0.060 (proxy), mean vehicle speed at pedestrian encounters 2.53 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 108 trips (96 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 173 trips (167 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 162 trips (151 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 243 trips (223 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 69% | +22 | 108 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 4% | -17 | 108 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 11% | +5 | 108 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 23% | -4 | 108 |  |
| Colby Street NB | from | freeway | 47% | 84% | +37 | 173 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 6% | -42 | 173 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 13% | -12 | 173 |  |
| Colby Street NB | to | College Avenue | 3% | 1% | -2 | 173 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 12% | -34 | 162 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 2% | -24 | 162 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 4% | -12 | 162 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 61% | +4 | 162 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 11% | -32 | 243 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 17% | -29 | 243 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 24% | +2 | 243 |  |
| Colby Street SB | to | freeway | 45% | 70% | +25 | 243 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 16% | -18 | 243 |  |

Headline shares within tolerance: 1 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 12% | 832 | 12% | 804 |
| onto freeway | Hillegass Avenue | 12% | 11% | 832 | 11% | 804 |
| onto freeway | Martin Street | 10% | 13% | 832 | 13% | 804 |
| onto freeway | Colby Street | 8% | 17% | 832 | 18% | 804 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 10% | 832 | 8% | 804 |
| onto freeway | Benvenue Avenue | 5% | 2% | 832 | 2% | 804 |
| from freeway | College Avenue | 10% | 7% | 1572 | 8% | 1292 |
| from freeway | Martin Street | 10% | 13% | 1572 | 16% | 1292 |
| from freeway | Colby Street | 8% | 8% | 1572 | 10% | 1292 |
| from freeway | Hillegass Avenue | 5% | 5% | 1572 | 7% | 1292 |
| from freeway | Benvenue Avenue | 3% | 2% | 1572 | 2% | 1292 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4208 | Grove Shafter Freeway | Motorway | 4 | 834 | uncontrolled | 53.60 | 1.42 | 1.4 | 2315 |
| 4191 | (unnamed) | Motorway | 2 | 513 | uncontrolled | 30.83 | 21.22 | 21.2 | 559 |
| 1679 | 52nd Street | Secondary | 4 | 53 | signal | 13.35 | 11.59 | 11.6 | 605 |
| 4165 | Martin Luther King Junior Way | Secondary | 3 | 147 | uncontrolled | 13.31 | 10.47 | 10.5 | 1434 |
| 4206 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 12.80 | 1.19 | 1.2 | 1429 |
| 728 | 55th Street | Tertiary | 1 | 238 | signal | 9.81 | 7.27 | 7.3 | 354 |
| 2061 | Alcatraz Avenue | Tertiary | 1 | 202 | uncontrolled | 8.33 | 6.49 | 6.5 | 401 |
| 1139 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 7.86 | 6.15 | 6.1 | 234 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 7.78 | 6.07 | 6.1 | 814 |
| 1125 | Market Street | Secondary | 4 | 36 | signal | 5.92 | 5.34 | 5.3 | 510 |
| 460 | Sacramento Street | Tertiary | 2 | 104 | two_way_stop | 5.84 | 4.69 | 4.7 | 480 |
| 265 | 59th Street | Residential | 1 | 150 | two_way_stop | 5.75 | 5.18 | 5.2 | 72 |
| 1590 | (unnamed) | Motorway | 2 | 112 | signal | 5.71 | 2.15 | 2.2 | 1600 |
| 3394 | Tunnel Road | Primary | 1 | 152 | two_way_stop | 5.50 | 2.59 | 2.6 | 806 |
| 1594 | 55th Street | Tertiary | 1 | 198 | signal | 5.49 | 3.81 | 3.8 | 344 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 688 | 52nd Street / Shattuck Avenue | signal |  | 5.45 | 0.54 | 75 s: 36/29 |
| 454 | Market Street / Stanford Avenue | signal |  | 4.97 | 0.19 | 75 s: 50/15 |
| 339 | 52nd Street / Martin Luther King Junior Way | signal |  | 4.40 | 0.29 | 75 s: 42/23 |
| 455 | Adeline Street / Alcatraz Avenue | signal |  | 4.34 | 0.03 | 75 s: 28/37 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.93 | 0.05 | 75 s: 24/41 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.36 | 0.02 | 75 s: 27/18/15 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.99 | 0.03 | 75 s: 35/30 |
| 863 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.76 | 0.04 | 75 s: 45/20 |
| 340 | 55th Street / Martin Luther King Junior Way | signal |  | 2.75 | 0.00 | 75 s: 39/26 |
| 1095 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.47 | 0.00 | 75 s: 21/24/15 |
| 487 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 2.46 | 0.01 | 75 s: 25/40 |
| 1422 | Ashby Avenue / Claremont Avenue | signal |  | 2.42 | 0.08 | 75 s: 50/15 |
| 237 | Ashby Avenue / Sacramento Street | signal |  | 2.41 | 0.00 | 75 s: 49/16 |
| 959 | Ashby Avenue / Telegraph Avenue | signal |  | 2.35 | 0.00 | 75 s: 16/49 |
| 509 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.30 | 0.06 | 75 s: 29/36 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 688: 36 s: 52nd Street 4L [1679], 52nd Street 4L [1683]; 29 s: Shattuck Avenue 2L [1670], Shattuck Avenue 2L [1722]
- node 454: 50 s: Stanford Avenue 1L [958], Stanford Avenue 3L [1072]; 15 s: Market Street 4L [1125], Market Street 3L [1128]
- node 339: 42 s: Martin Luther King Junior Way 4L [721], Martin Luther King Junior Way 4L [778]; 23 s: 52nd Street 2L [775], 52nd Street 1L [777]
- node 455: 28 s: Adeline Street 4L [1066], Adeline Street 4L [1068]; 37 s: Alcatraz Avenue 2L [1065], Alcatraz Avenue 2L [1150]
- node 37: 24 s: San Pablo Avenue 3L [114], San Pablo Avenue 3L [115]; 41 s: Stanford Avenue 3L [108], Stanford Avenue 2L [4140]

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 1127 | Market Street | 60th Street / Market Street | two_way_stop | 2 | 5.0 |
| 1128 | Market Street | Market Street / Stanford Avenue | signal | 2 | 5.7 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 610 | Grove Shafter Freeway | 4 | 4110 |
| 34 | 57th Street / San Pablo Avenue | 1 | 11 |
| 433 | 61st Street / Shattuck Avenue | 1 | 3 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 976 | 1032 |
| Telegraph | S | 10 | 1004 | 1090 |
| College | N | 3 | 298 | 298 |
| College | S | 3 | 370 | 372 |
| Claremont | N | 6 | 605 | 1068 |
| Claremont | S | 7 | 631 | 1069 |
| Alcatraz | E | 6 | 427 | 436 |
| Alcatraz | W | 6 | 390 | 432 |
| Hillegass | N | 4 | 76 | 88 |
| Hillegass | S | 4 | 101 | 126 |
| Colby | N | 7 | 112 | 158 |
| Colby | S | 7 | 154 | 167 |
| Martin | E | 2 | 128 | 128 |
| Martin | W | 2 | 226 | 226 |

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
