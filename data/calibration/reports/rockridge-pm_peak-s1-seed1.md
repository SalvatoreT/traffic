# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 24012 veh/h x scale 1 = 24012 veh/h. Run took 35.8 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 4 | FAIL |
| Backlog / spawned | < 2% | 0.9% (204 of 23925) | pass |
| Arterial mean speed (run) | > 4 m/s | 7.65 m/s (last 15 min 7.16) | pass |

Overall: **NOT STABLE**. Mean trip delay 209 s, mean trip time 515 s, completed 22990, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2912 | 4 | 2025 | 0 | 9.05 |
| 10 | 2944 | 20 | 3892 | 0 | 8.24 |
| 15 | 3162 | 58 | 5651 | 0 | 8.07 |
| 20 | 3302 | 59 | 7528 | 0 | 8.27 |
| 25 | 3402 | 66 | 9440 | 4 | 7.94 |
| 30 | 3549 | 59 | 11349 | 4 | 7.91 |
| 35 | 3623 | 67 | 13247 | 4 | 7.29 |
| 40 | 3865 | 126 | 15032 | 4 | 7.06 |
| 45 | 3912 | 167 | 17020 | 4 | 7.11 |
| 50 | 3860 | 185 | 19048 | 4 | 7.06 |
| 55 | 3815 | 207 | 21018 | 4 | 7.12 |
| 60 | 3834 | 204 | 22990 | 4 | 7.30 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 20851 | 0.07 | 5.9% | 1.125 | 1.086 | 10.8% | 0.3% | 1.062 | 5.9% | 0.0% | 7.4% | 2615 | 18.2% |
| gate to gate | 10668 | 0.09 | 8.2% | 1.131 | 1.101 | 11.0% | 0.2% | 1.068 | 6.1% | 0.1% | 11.7% | 1060 | 22.0% |
| with a local end | 10183 | 0.04 | 3.5% | 1.118 | 1.064 | 10.6% | 0.5% | 1.057 | 5.7% | 0.0% | 2.9% | 1554 | 15.6% |
| guided drivers | 9731 | 0.13 | 11.8% | 1.126 | 1.086 | 11.0% | 0.3% | 1.063 | 6.0% | 0.0% | 7.2% | 1213 | 19.0% |
| other drivers | 11120 | 0.01 | 0.8% | 1.124 | 1.086 | 10.6% | 0.4% | 1.062 | 5.8% | 0.0% | 7.6% | 1402 | 17.5% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (523 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1160 | 14.4 | 3% |
| freeway to the surface gates | 1389 | 7.0 | 1% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1118 | 1% | 9% | 91% | 0.0 |
| Hillegass Avenue | College Avenue | 3 | S | 1093 | 3% | 17% | 80% | 0.1 |

## Per-mode results

Offered: 24012 car veh/h; 1500 bicycle flows (1154/h); 2000 pedestrian flows (1991/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 3834 | 22990 | 515 | |
| Bicycle | 112 | 1168 | 352 | |
| Pedestrian | 284 | 1887 | 496 | mean crossing delay 9.7 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 376, bicycle conflicts 1453, close passes 1284, pedestrian injury-risk index 0.042, bicycle injury-risk index 0.054 (proxy), mean vehicle speed at pedestrian encounters 2.26 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 158 trips (152 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 236 trips (223 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 254 trips (223 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 318 trips (279 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 63% | +16 | 158 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 3% | -30 | 158 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 14% | +8 | 158 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 18% | -9 | 158 |  |
| Colby Street NB | from | freeway | 47% | 78% | +31 | 236 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 7% | -41 | 236 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 20% | -5 | 236 |  |
| Colby Street NB | to | College Avenue | 3% | 0% | -3 | 236 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 8% | -38 | 254 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 4% | -22 | 254 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 6% | -10 | 254 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 75% | +7 | 254 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 15% | -28 | 318 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 25% | -21 | 318 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 27% | +5 | 318 |  |
| Colby Street SB | to | freeway | 45% | 60% | +15 | 318 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 19% | -15 | 318 |  |

Headline shares within tolerance: 1 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 13% | 933 | 11% | 880 |
| onto freeway | Hillegass Avenue | 12% | 14% | 933 | 15% | 880 |
| onto freeway | Martin Street | 10% | 11% | 933 | 12% | 880 |
| onto freeway | Colby Street | 8% | 19% | 933 | 20% | 880 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 14% | 933 | 9% | 880 |
| onto freeway | Benvenue Avenue | 5% | 2% | 933 | 2% | 880 |
| from freeway | College Avenue | 10% | 6% | 1500 | 7% | 1184 |
| from freeway | Martin Street | 10% | 16% | 1500 | 20% | 1184 |
| from freeway | Colby Street | 8% | 11% | 1500 | 14% | 1184 |
| from freeway | Hillegass Avenue | 5% | 5% | 1500 | 7% | 1184 |
| from freeway | Benvenue Avenue | 3% | 1% | 1500 | 2% | 1184 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4208 | Grove Shafter Freeway | Motorway | 4 | 834 | uncontrolled | 36.22 | 3.00 | 3.0 | 2579 |
| 4174 | Adeline Street | Secondary | 3 | 185 | signal | 22.64 | 17.64 | 17.6 | 612 |
| 4206 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 21.54 | 1.10 | 1.1 | 1610 |
| 728 | 55th Street | Tertiary | 1 | 238 | signal | 14.73 | 10.54 | 10.5 | 464 |
| 4191 | (unnamed) | Motorway | 2 | 513 | uncontrolled | 13.94 | 10.33 | 10.3 | 341 |
| 1679 | 52nd Street | Secondary | 4 | 53 | signal | 11.85 | 10.57 | 10.6 | 394 |
| 1624 | Telegraph Avenue | Secondary | 2 | 94 | signal | 10.70 | 7.62 | 7.6 | 941 |
| 4366 | Claremont Avenue | Secondary | 2 | 113 | signal | 9.81 | 8.06 | 8.1 | 402 |
| 467 | Ashby Avenue | Primary | 2 | 193 | signal | 9.79 | 7.31 | 7.3 | 746 |
| 1068 | Adeline Street | Secondary | 4 | 50 | signal | 9.13 | 8.23 | 8.2 | 522 |
| 3465 | Claremont Avenue | Secondary | 1 | 93 | all_way_stop | 8.72 | 4.95 | 4.9 | 514 |
| 1139 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 8.72 | 6.85 | 6.8 | 258 |
| 1019 | Adeline Street | Secondary | 3 | 71 | uncontrolled | 8.70 | 7.07 | 7.1 | 647 |
| 3426 | Ashby Avenue | Primary | 1 | 129 | signal | 8.67 | 5.81 | 5.8 | 610 |
| 2061 | Alcatraz Avenue | Tertiary | 1 | 202 | uncontrolled | 8.65 | 6.52 | 6.5 | 437 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 454 | Market Street / Stanford Avenue | signal |  | 5.46 | 0.26 | 75 s: 50/15 |
| 688 | 52nd Street / Shattuck Avenue | signal |  | 5.25 | 0.47 | 75 s: 28/37 |
| 455 | Adeline Street / Alcatraz Avenue | signal |  | 5.02 | 0.91 | 75 s: 31/34 |
| 237 | Ashby Avenue / Sacramento Street | signal |  | 3.97 | 0.04 | 75 s: 37/28 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.58 | 0.30 | 75 s: 44/21 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.46 | 0.04 | 75 s: 19/26/15 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.40 | 0.04 | 75 s: 27/38 |
| 487 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.31 | 0.04 | 75 s: 22/43 |
| 863 | Alcatraz Avenue / Telegraph Avenue | signal |  | 3.29 | 0.09 | 75 s: 41/24 |
| 1095 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 3.25 | 0.04 | 75 s: 15/30/15 |
| 956 | Ashby Avenue / Shattuck Avenue | signal |  | 3.25 | 0.21 | 75 s: 44/21 |
| 1422 | Ashby Avenue / Claremont Avenue | signal |  | 3.11 | 0.44 | 75 s: 42/23 |
| 339 | 52nd Street / Martin Luther King Junior Way | signal |  | 3.06 | 0.03 | 75 s: 41/24 |
| 959 | Ashby Avenue / Telegraph Avenue | signal |  | 2.89 | 0.00 | 75 s: 17/48 |
| 509 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.85 | 0.07 | 90 s: 29/51 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 454: 50 s: Stanford Avenue 1L [958], Stanford Avenue 3L [1072]; 15 s: Market Street 4L [1125], Market Street 3L [1128]
- node 688: 28 s: 52nd Street 4L [1679], 52nd Street 4L [1683]; 37 s: Shattuck Avenue 2L [1670], Shattuck Avenue 2L [1722]
- node 455: 31 s: Adeline Street 4L [1066], Adeline Street 4L [1068]; 34 s: Alcatraz Avenue 2L [1065], Alcatraz Avenue 2L [1150]
- node 237: 37 s: Ashby Avenue 2L [467], Ashby Avenue 2L [541]; 28 s: Sacramento Street 3L [498], Sacramento Street 3L [501],  1L [551]
- node 185: 44 s: Alcatraz Avenue 1L [363], Alcatraz Avenue 1L [1179]; 21 s: Sacramento Street 3L [1053], Sacramento Street 3L [1054]

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 1068 | Adeline Street | Adeline Street / Alcatraz Avenue | signal | 4 | 23.9 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 610 | Grove Shafter Freeway | 146 | 4839 |
| 1774 | Claremont Avenue | 54 | 506 |
| 403 | 65th Street / Shattuck Avenue | 2 | 9 |
| 536 | Shattuck Avenue / Woolsey Street | 1 | 11 |
| 1104 | 63rd Street / College Avenue | 1 | 273 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 1247 | 1312 |
| Telegraph | S | 10 | 864 | 1000 |
| College | N | 3 | 389 | 390 |
| College | S | 3 | 726 | 732 |
| Claremont | N | 6 | 509 | 994 |
| Claremont | S | 7 | 724 | 1148 |
| Alcatraz | E | 6 | 605 | 628 |
| Alcatraz | W | 6 | 486 | 528 |
| Hillegass | N | 4 | 88 | 106 |
| Hillegass | S | 4 | 166 | 188 |
| Colby | N | 7 | 144 | 198 |
| Colby | S | 7 | 216 | 246 |
| Martin | E | 2 | 125 | 125 |
| Martin | W | 2 | 248 | 248 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 610 | Grove Shafter Freeway | 4839 |
| 955 | Telegraph Avenue / Ward Street | 2097 |
| 1688 | Warren Freeway | 1534 |
| 266 | Ashby Avenue | 1134 |
| 183 | San Pablo Avenue | 1085 |
| 771 | Telegraph Avenue | 549 |
| 1774 | Claremont Avenue | 506 |
| 284 | Martin Luther King Junior Way | 454 |
| 283 | Market Street | 452 |
| 986 | Broadway | 445 |
