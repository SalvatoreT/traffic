# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 20315 veh/h x scale 1 = 20315 veh/h. Run took 34.6 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 1 | FAIL |
| Backlog / spawned | < 2% | 0.8% (164 of 20092) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.30 m/s (last 15 min 8.80) | pass |

Overall: **NOT STABLE**. Mean trip delay 127 s, mean trip time 425 s, completed 17612, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1482 | 0 | 211 | 0 | 11.38 |
| 10 | 2099 | 0 | 1221 | 0 | 9.81 |
| 15 | 2347 | 2 | 2691 | 0 | 9.71 |
| 20 | 2458 | 8 | 4300 | 0 | 9.30 |
| 25 | 2404 | 41 | 5996 | 0 | 9.42 |
| 30 | 2488 | 20 | 7658 | 0 | 9.43 |
| 35 | 2494 | 26 | 9322 | 0 | 9.25 |
| 40 | 2542 | 41 | 10974 | 0 | 9.33 |
| 45 | 2549 | 21 | 12642 | 1 | 9.26 |
| 50 | 2604 | 48 | 14247 | 1 | 8.69 |
| 55 | 2625 | 80 | 15918 | 1 | 8.83 |
| 60 | 2479 | 164 | 17612 | 1 | 8.88 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 17612 | 0.02 | 1.8% | 1.101 | 1.061 | 7.6% | 0.1% | 1.034 | 3.9% | 0.0% | 5.9% | 1855 | 15.2% |
| gate to gate | 9266 | 0.03 | 2.8% | 1.105 | 1.079 | 6.5% | 0.0% | 1.037 | 3.9% | 0.0% | 8.7% | 830 | 15.1% |
| with a local end | 8346 | 0.01 | 0.7% | 1.097 | 1.034 | 8.8% | 0.3% | 1.031 | 3.9% | 0.0% | 2.8% | 1025 | 15.3% |
| guided drivers | 8180 | 0.04 | 3.8% | 1.101 | 1.060 | 7.4% | 0.1% | 1.034 | 3.8% | 0.0% | 5.9% | 872 | 14.7% |
| other drivers | 9432 | 0.00 | 0.1% | 1.102 | 1.061 | 7.8% | 0.1% | 1.035 | 4.1% | 0.0% | 5.9% | 983 | 15.7% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (234 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1120 | 13.1 | 6% |
| freeway to the surface gates | 1220 | 3.3 | 1% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 998 | 2% | 8% | 90% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 974 | 4% | 15% | 82% | 0.2 |

## Per-mode results

Offered: 20315 car veh/h; 1500 bicycle flows (1061/h); 2000 pedestrian flows (1540/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 2479 | 17612 | 425 | |
| Bicycle | 111 | 948 | 352 | |
| Pedestrian | 193 | 1231 | 480 | mean crossing delay 5.4 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 241, bicycle conflicts 1139, close passes 602, pedestrian injury-risk index 0.043, bicycle injury-risk index 0.047 (proxy), mean vehicle speed at pedestrian encounters 2.38 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 62 trips (60 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 37 trips (36 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 125 trips (119 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 143 trips (122 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 53% | +6 | 62 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 5% | -16 | 62 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 5% | -1 | 62 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 31% | +4 | 62 |  |
| Colby Street NB | from | freeway | 47% | 41% | -6 | 37 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 16% | -32 | 37 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 24% | -1 | 37 |  |
| Colby Street NB | to | College Avenue | 3% | 0% | -3 | 37 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 25% | -21 | 125 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 18% | -8 | 125 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 21% | +5 | 125 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 61% | +4 | 125 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 10% | -33 | 143 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 39% | -7 | 143 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 35% | +13 | 143 |  |
| Colby Street SB | to | freeway | 45% | 31% | -14 | 143 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 38% | +4 | 143 |  |

Headline shares within tolerance: 3 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 13% | 721 | 13% | 673 |
| onto freeway | Hillegass Avenue | 12% | 12% | 721 | 13% | 673 |
| onto freeway | Martin Street | 10% | 18% | 721 | 19% | 673 |
| onto freeway | Colby Street | 8% | 7% | 721 | 7% | 673 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 17% | 721 | 14% | 673 |
| onto freeway | Benvenue Avenue | 5% | 4% | 721 | 4% | 673 |
| from freeway | College Avenue | 10% | 8% | 1263 | 7% | 926 |
| from freeway | Martin Street | 10% | 12% | 1263 | 17% | 926 |
| from freeway | Colby Street | 8% | 7% | 1263 | 9% | 926 |
| from freeway | Hillegass Avenue | 5% | 3% | 1263 | 5% | 926 |
| from freeway | Benvenue Avenue | 3% | 2% | 1263 | 3% | 926 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4436 | Ashby Avenue | Primary | 2 | 96 | signal | 10.99 | 9.72 | 9.7 | 281 |
| 265 | 59th Street | Residential | 1 | 150 | two_way_stop | 10.75 | 9.97 | 10.0 | 74 |
| 1679 | 52nd Street | Secondary | 4 | 53 | signal | 9.33 | 7.64 | 7.6 | 641 |
| 315 | Stanford Avenue | Secondary | 2 | 354 | uncontrolled | 8.25 | 3.97 | 4.0 | 1212 |
| 225 | 61st Street | Residential | 1 | 137 | two_way_stop | 7.44 | 5.85 | 5.8 | 211 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 6.79 | 5.31 | 5.3 | 594 |
| 728 | 55th Street | Tertiary | 1 | 238 | signal | 6.07 | 4.28 | 4.3 | 438 |
| 338 | San Pablo Avenue | Primary | 3 | 37 | two_way_stop | 5.92 | 4.14 | 4.1 | 1309 |
| 2061 | Alcatraz Avenue | Tertiary | 1 | 202 | uncontrolled | 5.37 | 3.95 | 4.0 | 419 |
| 248 | 60th Street | Residential | 1 | 318 | two_way_stop | 5.21 | 4.18 | 4.2 | 124 |
| 341 | San Pablo Avenue | Primary | 2 | 75 | uncontrolled | 5.14 | 3.66 | 3.7 | 589 |
| 1139 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 5.01 | 3.62 | 3.6 | 325 |
| 352 | San Pablo Avenue | Primary | 2 | 50 | uncontrolled | 4.92 | 2.69 | 2.7 | 1322 |
| 268 | 59th Street | Residential | 1 | 118 | two_way_stop | 4.76 | 4.04 | 4.0 | 164 |
| 4206 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 4.59 | 0.32 | 0.3 | 1534 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 688 | 52nd Street / Shattuck Avenue | signal |  | 4.27 | 0.27 | 75 s: 21/44 |
| 454 | Market Street / Stanford Avenue | signal |  | 3.28 | 0.11 | 75 s: 47/18 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.16 | 0.01 | 75 s: 14/15/13/13 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 2.90 | 0.04 | 75 s: 28/37 |
| 339 | 52nd Street / Martin Luther King Junior Way | signal |  | 2.70 | 0.02 | 75 s: 44/21 |
| 1422 | Ashby Avenue / Claremont Avenue | signal |  | 2.63 | 0.10 | 75 s: 42/23 |
| 1389 | Ashby Avenue / Domingo Avenue / Tunnel Road | signal |  | 2.57 | 0.18 | 75 s: 29/16/15 |
| 863 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.49 | 0.03 | 75 s: 39/26 |
| 455 | Adeline Street / Alcatraz Avenue | signal |  | 2.48 | 0.03 | 75 s: 25/40 |
| 131 | 61st Street / San Pablo Avenue | two_way_stop |  | 2.29 | 0.78 |  |
| 509 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.22 | 0.06 | 75 s: 26/39 |
| 959 | Ashby Avenue / Telegraph Avenue | signal |  | 2.06 | 0.00 | 75 s: 25/40 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.02 | 0.02 | 75 s: 36/29 |
| 956 | Ashby Avenue / Shattuck Avenue | signal |  | 2.00 | 0.02 | 75 s: 47/18 |
| 1084 | Claremont Avenue / Colby Street / Forest Street | signal |  | 1.89 | 0.00 | 75 s: 30/15/15 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 688: 21 s: 52nd Street 4L [1679], 52nd Street 4L [1683]; 44 s: Shattuck Avenue 2L [1670], Shattuck Avenue 2L [1722]
- node 454: 47 s: Stanford Avenue 1L [958], Stanford Avenue 3L [1072]; 18 s: Market Street 4L [1125], Market Street 3L [1128]
- node 30: 14 s: Adeline Street 1L [764], Adeline Street 1L [1047]; 15 s: Market Street 2L [772], Market Street 2L [1130]; 13 s: 57th Street 1L [44]; 13 s: 57th Street 1L [1168]
- node 37: 28 s: San Pablo Avenue 3L [114], San Pablo Avenue 3L [115]; 37 s: Stanford Avenue 3L [108], Stanford Avenue 2L [4140]
- node 339: 44 s: Martin Luther King Junior Way 4L [721], Martin Luther King Junior Way 4L [778]; 21 s: 52nd Street 2L [775], 52nd Street 1L [777]

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 218 | Idaho Street | 59th Street / Idaho Street | two_way_stop | 1 | 43.1 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 183 | San Pablo Avenue | 163 | 1467 |
| 266 | Ashby Avenue | 1 | 1242 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 774 | 806 |
| Telegraph | S | 10 | 992 | 1151 |
| College | N | 3 | 187 | 187 |
| College | S | 3 | 236 | 245 |
| Claremont | N | 6 | 618 | 832 |
| Claremont | S | 7 | 436 | 739 |
| Alcatraz | E | 6 | 330 | 348 |
| Alcatraz | W | 6 | 468 | 491 |
| Hillegass | N | 4 | 47 | 53 |
| Hillegass | S | 4 | 84 | 94 |
| Colby | N | 7 | 10 | 14 |
| Colby | S | 7 | 74 | 88 |
| Martin | E | 2 | 149 | 149 |
| Martin | W | 2 | 170 | 170 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 610 | Grove Shafter Freeway | 4119 |
| 955 | Telegraph Avenue / Ward Street | 2059 |
| 1688 | Warren Freeway | 1491 |
| 183 | San Pablo Avenue | 1467 |
| 266 | Ashby Avenue | 1242 |
| 104 | San Pablo Avenue | 530 |
| 1774 | Claremont Avenue | 520 |
| 283 | Market Street | 492 |
| 771 | Telegraph Avenue | 466 |
| 1735 | Grove Shafter Freeway | 289 |
