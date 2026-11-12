# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 20315 veh/h x scale 1 = 20315 veh/h. Run took 23.2 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.9% (183 of 20073) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.34 m/s (last 15 min 8.92) | pass |

Overall: **STABLE**. Mean trip delay 125 s, mean trip time 423 s, completed 17576, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1482 | 0 | 211 | 0 | 11.38 |
| 10 | 2099 | 0 | 1221 | 0 | 9.81 |
| 15 | 2347 | 2 | 2691 | 0 | 9.71 |
| 20 | 2458 | 8 | 4300 | 0 | 9.30 |
| 25 | 2404 | 41 | 5996 | 0 | 9.42 |
| 30 | 2488 | 20 | 7658 | 0 | 9.43 |
| 35 | 2494 | 26 | 9322 | 0 | 9.25 |
| 40 | 2541 | 41 | 10975 | 0 | 9.35 |
| 45 | 2529 | 25 | 12659 | 0 | 9.24 |
| 50 | 2554 | 69 | 14277 | 0 | 8.84 |
| 55 | 2593 | 103 | 15928 | 0 | 8.80 |
| 60 | 2497 | 183 | 17576 | 0 | 9.12 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 17576 | 0.02 | 1.5% | 1.100 | 1.061 | 7.6% | 0.1% | 1.033 | 3.9% | 0.0% | 5.8% | 1854 | 15.6% |
| gate to gate | 9223 | 0.02 | 2.3% | 1.105 | 1.079 | 6.5% | 0.0% | 1.037 | 3.9% | 0.0% | 8.6% | 829 | 15.6% |
| with a local end | 8353 | 0.01 | 0.7% | 1.096 | 1.034 | 8.8% | 0.2% | 1.030 | 3.9% | 0.0% | 2.8% | 1025 | 15.6% |
| guided drivers | 8156 | 0.03 | 3.1% | 1.099 | 1.060 | 7.4% | 0.1% | 1.033 | 3.7% | 0.0% | 5.8% | 871 | 14.9% |
| other drivers | 9420 | 0.00 | 0.1% | 1.102 | 1.062 | 7.8% | 0.1% | 1.034 | 4.0% | 0.0% | 5.8% | 983 | 16.2% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (230 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1104 | 14.1 | 6% |
| freeway to the surface gates | 1213 | 3.1 | 1% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 993 | 2% | 8% | 90% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 976 | 3% | 14% | 82% | 0.2 |

## Per-mode results

Offered: 20315 car veh/h; 1500 bicycle flows (1061/h); 2000 pedestrian flows (1540/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 2497 | 17576 | 423 | |
| Bicycle | 112 | 947 | 352 | |
| Pedestrian | 192 | 1232 | 480 | mean crossing delay 5.3 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 234, bicycle conflicts 1178, close passes 634, pedestrian injury-risk index 0.043, bicycle injury-risk index 0.047 (proxy), mean vehicle speed at pedestrian encounters 2.41 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 63 trips (59 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 35 trips (33 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 126 trips (120 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 147 trips (123 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 57% | +10 | 63 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 5% | -16 | 63 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 3% | -3 | 63 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 30% | +3 | 63 |  |
| Colby Street NB | from | freeway | 47% | 43% | -4 | 35 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 17% | -31 | 35 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 29% | +4 | 35 |  |
| Colby Street NB | to | College Avenue | 3% | 0% | -3 | 35 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 25% | -21 | 126 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 16% | -10 | 126 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 20% | +4 | 126 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 60% | +3 | 126 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 10% | -33 | 147 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 39% | -7 | 147 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 37% | +15 | 147 |  |
| Colby Street SB | to | freeway | 45% | 31% | -14 | 147 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 42% | +8 | 147 |  |

Headline shares within tolerance: 2 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 12% | 721 | 12% | 676 |
| onto freeway | Hillegass Avenue | 12% | 12% | 721 | 13% | 676 |
| onto freeway | Martin Street | 10% | 17% | 721 | 18% | 676 |
| onto freeway | Colby Street | 8% | 7% | 721 | 7% | 676 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 17% | 721 | 14% | 676 |
| onto freeway | Benvenue Avenue | 5% | 4% | 721 | 4% | 676 |
| from freeway | College Avenue | 10% | 8% | 1247 | 7% | 931 |
| from freeway | Martin Street | 10% | 12% | 1247 | 16% | 931 |
| from freeway | Colby Street | 8% | 7% | 1247 | 9% | 931 |
| from freeway | Hillegass Avenue | 5% | 4% | 1247 | 5% | 931 |
| from freeway | Benvenue Avenue | 3% | 2% | 1247 | 3% | 931 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 265 | 59th Street | Residential | 1 | 150 | two_way_stop | 11.33 | 10.57 | 10.6 | 65 |
| 4436 | Ashby Avenue | Primary | 2 | 96 | signal | 10.90 | 9.62 | 9.6 | 277 |
| 1679 | 52nd Street | Secondary | 4 | 53 | signal | 9.02 | 7.34 | 7.3 | 689 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 7.07 | 5.65 | 5.7 | 556 |
| 728 | 55th Street | Tertiary | 1 | 238 | signal | 6.54 | 4.77 | 4.8 | 456 |
| 225 | 61st Street | Residential | 1 | 137 | two_way_stop | 6.35 | 4.70 | 4.7 | 234 |
| 338 | San Pablo Avenue | Primary | 3 | 37 | two_way_stop | 6.03 | 4.24 | 4.2 | 1279 |
| 315 | Stanford Avenue | Secondary | 2 | 354 | uncontrolled | 5.93 | 2.44 | 2.4 | 1295 |
| 341 | San Pablo Avenue | Primary | 2 | 75 | uncontrolled | 5.89 | 4.41 | 4.4 | 550 |
| 2061 | Alcatraz Avenue | Tertiary | 1 | 202 | uncontrolled | 5.48 | 4.04 | 4.0 | 424 |
| 248 | 60th Street | Residential | 1 | 318 | two_way_stop | 5.47 | 4.36 | 4.4 | 143 |
| 352 | San Pablo Avenue | Primary | 2 | 50 | uncontrolled | 5.06 | 2.77 | 2.8 | 1295 |
| 1139 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 4.98 | 3.61 | 3.6 | 324 |
| 268 | 59th Street | Residential | 1 | 118 | two_way_stop | 4.45 | 3.87 | 3.9 | 112 |
| 108 | Stanford Avenue | Secondary | 3 | 61 | signal | 4.38 | 2.55 | 2.5 | 1292 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 688 | 52nd Street / Shattuck Avenue | signal |  | 4.26 | 0.26 | 75 s: 22/43 |
| 454 | Market Street / Stanford Avenue | signal |  | 3.34 | 0.11 | 75 s: 50/15 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.12 | 0.01 | 75 s: 13/15/14/13 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 2.94 | 0.04 | 75 s: 26/39 |
| 339 | 52nd Street / Martin Luther King Junior Way | signal |  | 2.73 | 0.02 | 75 s: 42/23 |
| 1422 | Ashby Avenue / Claremont Avenue | signal |  | 2.61 | 0.11 | 75 s: 43/22 |
| 1389 | Ashby Avenue / Domingo Avenue / Tunnel Road | signal |  | 2.57 | 0.17 | 75 s: 29/16/15 |
| 863 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.50 | 0.03 | 75 s: 41/24 |
| 455 | Adeline Street / Alcatraz Avenue | signal |  | 2.45 | 0.03 | 75 s: 24/41 |
| 131 | 61st Street / San Pablo Avenue | two_way_stop |  | 2.31 | 0.82 |  |
| 509 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.18 | 0.06 | 75 s: 27/38 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.08 | 0.02 | 75 s: 36/29 |
| 956 | Ashby Avenue / Shattuck Avenue | signal |  | 2.07 | 0.02 | 75 s: 45/20 |
| 959 | Ashby Avenue / Telegraph Avenue | signal |  | 1.92 | 0.00 | 75 s: 22/43 |
| 960 | Telegraph Avenue / Webster Street | signal |  | 1.89 | 0.01 | 75 s: 23/15/22 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 688: 22 s: 52nd Street 4L [1679], 52nd Street 4L [1683]; 43 s: Shattuck Avenue 2L [1670], Shattuck Avenue 2L [1722]
- node 454: 50 s: Stanford Avenue 1L [958], Stanford Avenue 3L [1072]; 15 s: Market Street 4L [1125], Market Street 3L [1128]
- node 30: 13 s: Adeline Street 1L [764], Adeline Street 1L [1047]; 15 s: Market Street 2L [772], Market Street 2L [1130]; 14 s: 57th Street 1L [44]; 13 s: 57th Street 1L [1168]
- node 37: 26 s: San Pablo Avenue 3L [114], San Pablo Avenue 3L [115]; 39 s: Stanford Avenue 3L [108], Stanford Avenue 2L [4140]
- node 339: 42 s: Martin Luther King Junior Way 4L [721], Martin Luther King Junior Way 4L [778]; 23 s: 52nd Street 2L [775], 52nd Street 1L [777]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 183 | San Pablo Avenue | 183 | 1467 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 784 | 822 |
| Telegraph | S | 10 | 1022 | 1175 |
| College | N | 3 | 185 | 186 |
| College | S | 3 | 230 | 241 |
| Claremont | N | 6 | 608 | 839 |
| Claremont | S | 7 | 433 | 740 |
| Alcatraz | E | 6 | 338 | 354 |
| Alcatraz | W | 6 | 466 | 488 |
| Hillegass | N | 4 | 49 | 54 |
| Hillegass | S | 4 | 84 | 92 |
| Colby | N | 7 | 8 | 13 |
| Colby | S | 7 | 77 | 88 |
| Martin | E | 2 | 144 | 144 |
| Martin | W | 2 | 172 | 172 |

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
