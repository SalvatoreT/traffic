# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 21569 veh/h x scale 1 = 21569 veh/h. Run took 43.2 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (3 of 21664) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.83 m/s (last 15 min 9.75) | pass |

Overall: **STABLE**. Mean trip delay 105 s, mean trip time 402 s, completed 21211, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2597 | 1 | 1807 | 0 | 9.62 |
| 10 | 2603 | 4 | 3560 | 0 | 9.57 |
| 15 | 2612 | 4 | 5348 | 0 | 9.76 |
| 20 | 2622 | 2 | 7122 | 0 | 9.93 |
| 25 | 2619 | 2 | 8912 | 0 | 9.94 |
| 30 | 2697 | 2 | 10676 | 0 | 10.00 |
| 35 | 2673 | 3 | 12444 | 0 | 9.91 |
| 40 | 2822 | 6 | 14169 | 0 | 10.05 |
| 45 | 2802 | 1 | 15984 | 0 | 10.00 |
| 50 | 2818 | 1 | 17720 | 0 | 9.77 |
| 55 | 2858 | 0 | 19473 | 0 | 9.72 |
| 60 | 3000 | 3 | 21211 | 0 | 9.77 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 19440 | 0.00 | 0.2% | 1.090 | 1.052 | 4.5% | 0.0% | 1.024 | 1.6% | 0.0% | 5.6% | 1826 | 7.8% |
| gate to gate | 7932 | 0.00 | 0.2% | 1.097 | 1.071 | 3.6% | 0.0% | 1.018 | 1.3% | 0.0% | 8.3% | 436 | 12.4% |
| with a local end | 11508 | 0.00 | 0.3% | 1.086 | 1.044 | 5.1% | 0.0% | 1.028 | 1.8% | 0.0% | 3.8% | 1390 | 6.4% |
| guided drivers | 8954 | 0.01 | 0.5% | 1.087 | 1.051 | 4.1% | 0.0% | 1.024 | 1.6% | 0.0% | 5.5% | 836 | 6.8% |
| other drivers | 10486 | 0.00 | 0.0% | 1.093 | 1.053 | 4.8% | 0.0% | 1.024 | 1.6% | 0.0% | 5.8% | 990 | 8.8% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (359 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1325 | 10.1 | 3% |
| freeway to the surface gates | 969 | 2.2 | 1% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1003 | 3% | 16% | 81% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 854 | 0% | 28% | 71% | 0.0 |

## Per-mode results

Offered: 21569 car veh/h; 477 bicycle flows (690/h); 2000 pedestrian flows (1338/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 3000 | 21211 | 402 | |
| Bicycle | 42 | 674 | 245 | |
| Pedestrian | 187 | 1251 | 482 | mean crossing delay 6.9 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 244, bicycle conflicts 410, close passes 632, pedestrian injury-risk index 0.052, bicycle injury-risk index 0.071 (proxy), mean vehicle speed at pedestrian encounters 2.59 m/s.


## Through cars on the counted blocks (a car is through when neither trip end is in the study area)

Expected = observed block volume times the observed freeway share of the street (the headline share of the targets file). Modeled through = select-link trips with no end in the study area, per hour. Modeled freeway = select-link trips from or to a freeway node, per hour.

| Block | Observed volume (veh/h) | Observed freeway share | Expected through (veh/h) | Modeled through (veh/h) | Modeled freeway trips (veh/h) |
| --- | --- | --- | --- | --- | --- |

## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 139 trips (131 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 230 trips (216 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 112 trips (105 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 230 trips (216 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 46% | -1 | 139 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 4% | -17 | 139 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 5% | -1 | 139 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 27% | -0 | 139 |  |
| Colby Street NB | from | freeway | 47% | 60% | +13 | 230 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 17% | -31 | 230 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 21% | -4 | 230 |  |
| Colby Street NB | to | College Avenue | 3% | 0% | -3 | 230 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 14% | -32 | 112 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 4% | -22 | 112 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 11% | -5 | 112 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 60% | +3 | 112 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 36% | -7 | 230 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 10% | -36 | 230 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 17% | -5 | 230 |  |
| Colby Street SB | to | freeway | 45% | 80% | +35 | 230 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 4% | -30 | 230 |  |

Headline shares within tolerance: 2 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 16% | 661 | 18% | 565 |
| onto freeway | Hillegass Avenue | 12% | 12% | 661 | 14% | 565 |
| onto freeway | Martin Street | 10% | 13% | 661 | 13% | 565 |
| onto freeway | Colby Street | 8% | 25% | 661 | 29% | 565 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 11% | 661 | 9% | 565 |
| onto freeway | Benvenue Avenue | 5% | 3% | 661 | 3% | 565 |
| from freeway | College Avenue | 10% | 7% | 780 | 8% | 645 |
| from freeway | Martin Street | 10% | 16% | 780 | 19% | 645 |
| from freeway | Colby Street | 8% | 17% | 780 | 21% | 645 |
| from freeway | Hillegass Avenue | 5% | 8% | 780 | 10% | 645 |
| from freeway | Benvenue Avenue | 3% | 2% | 780 | 2% | 645 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 10.69 | 4.96 | 5.0 | 1138 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 7.89 | 5.31 | 5.3 | 372 |
| 769 | Martin Luther King Junior Way | Secondary | 3 | 112 | signal | 5.91 | 3.55 | 3.6 | 1511 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 5.59 | 4.26 | 4.3 | 1030 |
| 108 | Stanford Avenue | Secondary | 3 | 61 | signal | 5.44 | 3.34 | 3.3 | 1337 |
| 2248 | Telegraph Avenue | Secondary | 2 | 104 | signal | 5.28 | 2.77 | 2.8 | 1819 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 5.07 | 4.08 | 4.1 | 652 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 4.51 | 4.08 | 4.1 | 778 |
| 2303 | Telegraph Avenue | Secondary | 2 | 104 | signal | 4.51 | 2.88 | 2.9 | 1456 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 4.32 | 3.34 | 3.3 | 1073 |
| 4192 | Ashby Avenue | Primary | 2 | 99 | signal | 4.07 | 3.40 | 3.4 | 174 |
| 2008 | Shattuck Avenue | Tertiary | 1 | 93 | signal | 4.05 | 2.95 | 3.0 | 563 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 4.02 | 3.25 | 3.2 | 1351 |
| 498 | Sacramento Street | Tertiary | 3 | 48 | signal | 3.95 | 3.15 | 3.1 | 667 |
| 1666 | 52nd Street | Secondary | 4 | 39 | signal | 3.78 | 3.28 | 3.3 | 745 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 446 | Market Street / Stanford Avenue | signal |  | 5.45 | 0.06 | 75 s: 50/15 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 5.29 | 0.03 | 90 s: 22/19/34 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 4.50 | 0.05 | 75 s: 29/36 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.38 | 0.01 | 75 s: 17/28/15 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.19 | 0.00 | 75 s: 31/34 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.07 | 0.01 | 75 s: 37/28 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.98 | 0.01 | 75 s: 46/19 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 2.64 | 0.00 | 75 s: 25/40 |
| 947 | Ashby Avenue / Telegraph Avenue | signal |  | 2.46 | 0.00 | 75 s: 15/50 |
| 501 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.44 | 0.02 | 75 s: 28/37 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.41 | 0.00 | 75 s: 35/30 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 2.41 | 0.04 | 75 s: 50/15 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.34 | 0.04 | 75 s: 33/32 |
| 332 | 55th Street / Martin Luther King Junior Way | signal |  | 2.29 | 0.00 | 75 s: 45/20 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.24 | 0.00 | 75 s: 17/28/15 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 446: 50 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 15 s: Market Street 4L [1108], Market Street 3L [1111]
- node 680: 22 s: 52nd Street 4L [1662]; 19 s: 52nd Street 4L [1666]; 34 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 447: 29 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 36 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 30: 17 s: Adeline Street 1L [747], Adeline Street 1L [1030]; 28 s: Market Street 2L [755], Market Street 2L [1113]; 15 s: 57th Street 1L [44], 57th Street 1L [1151]
- node 37: 31 s: San Pablo Avenue 3L [114], San Pablo Avenue 3L [115]; 34 s: Stanford Avenue 3L [108], Stanford Avenue 2L [4109]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 1089 | 63rd Street / College Avenue | 1 | 63 |
| 1111 | Broadway / Lawton Avenue / Rockridge Boulevard | 1 | 6 |
| 1398 | Claremont Boulevard | 1 | 228 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 780 | 840 |
| Telegraph | S | 10 | 535 | 558 |
| College | N | 3 | 276 | 277 |
| College | S | 3 | 388 | 389 |
| Claremont | N | 6 | 336 | 653 |
| Claremont | S | 7 | 397 | 679 |
| Alcatraz | E | 6 | 337 | 407 |
| Alcatraz | W | 6 | 522 | 553 |
| Hillegass | N | 4 | 78 | 107 |
| Hillegass | S | 4 | 71 | 72 |
| Colby | N | 7 | 130 | 146 |
| Colby | S | 7 | 157 | 175 |
| Martin | E | 2 | 96 | 96 |
| Martin | W | 2 | 166 | 166 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 3619 |
| 943 | Telegraph Avenue / Ward Street | 2064 |
| 1672 | Warren Freeway | 1359 |
| 265 | Ashby Avenue | 1242 |
| 183 | San Pablo Avenue | 1191 |
| 763 | Telegraph Avenue | 480 |
| 275 | Market Street | 429 |
| 184 | Alcatraz Avenue | 368 |
| 974 | Broadway | 358 |
| 1756 | Claremont Avenue | 298 |
