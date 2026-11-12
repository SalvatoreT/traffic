# Calibration report: rockridge midday scale 1 seed 1 (60 min)

Offered demand 14884 veh/h x scale 1 = 14884 veh/h. Run took 19.8 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (0 of 14871) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.97 m/s (last 15 min 9.99) | pass |

Overall: **STABLE**. Mean trip delay 93 s, mean trip time 399 s, completed 13215, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1162 | 0 | 156 | 0 | 11.05 |
| 10 | 1603 | 2 | 974 | 0 | 10.22 |
| 15 | 1806 | 0 | 2110 | 0 | 10.04 |
| 20 | 1684 | 0 | 3428 | 0 | 9.89 |
| 25 | 1755 | 0 | 4653 | 0 | 9.71 |
| 30 | 1671 | 0 | 5927 | 0 | 9.70 |
| 35 | 1629 | 0 | 7167 | 0 | 10.07 |
| 40 | 1637 | 1 | 8365 | 0 | 10.02 |
| 45 | 1742 | 0 | 9492 | 0 | 9.76 |
| 50 | 1717 | 0 | 10773 | 0 | 10.01 |
| 55 | 1679 | 0 | 11987 | 0 | 10.00 |
| 60 | 1656 | 0 | 13215 | 0 | 9.96 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 13215 | 0.01 | 0.6% | 1.098 | 1.056 | 7.4% | 0.0% | 1.030 | 3.3% | 0.0% | 6.8% | 1341 | 18.1% |
| gate to gate | 7271 | 0.01 | 0.9% | 1.103 | 1.076 | 6.5% | 0.0% | 1.031 | 3.0% | 0.0% | 10.0% | 704 | 18.3% |
| with a local end | 5944 | 0.00 | 0.3% | 1.092 | 1.030 | 8.3% | 0.1% | 1.027 | 3.8% | 0.0% | 3.0% | 637 | 18.0% |
| guided drivers | 6123 | 0.01 | 1.3% | 1.096 | 1.055 | 7.0% | 0.0% | 1.029 | 3.3% | 0.0% | 6.5% | 611 | 18.1% |
| other drivers | 7092 | 0.00 | 0.0% | 1.100 | 1.058 | 7.6% | 0.0% | 1.030 | 3.4% | 0.0% | 7.1% | 730 | 18.2% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (175 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 895 | 12.6 | 7% |
| freeway to the surface gates | 972 | 6.7 | 4% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 770 | 2% | 10% | 88% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 818 | 3% | 13% | 84% | 0.1 |

## Per-mode results

Offered: 14884 car veh/h; 532 bicycle flows (583/h); 2000 pedestrian flows (1820/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 1656 | 13215 | 399 | |
| Bicycle | 47 | 541 | 296 | |
| Pedestrian | 210 | 1494 | 483 | mean crossing delay 4.9 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 280, bicycle conflicts 478, close passes 225, pedestrian injury-risk index 0.043, bicycle injury-risk index 0.050 (proxy), mean vehicle speed at pedestrian encounters 2.40 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 43 trips (40 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 42 trips (37 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 86 trips (81 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 80 trips (73 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 70% | +23 | 43 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 2% | -19 | 43 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 7% | +1 | 43 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 16% | -11 | 43 |  |
| Colby Street NB | from | freeway | 47% | 31% | -16 | 42 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 19% | -29 | 42 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 29% | +4 | 42 |  |
| Colby Street NB | to | College Avenue | 3% | 7% | +4 | 42 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 24% | -22 | 86 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 15% | -11 | 86 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 30% | +14 | 86 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 49% | -8 | 86 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 16% | -27 | 80 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 25% | -21 | 80 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 39% | +17 | 80 |  |
| Colby Street SB | to | freeway | 45% | 32% | -12 | 80 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 48% | +13 | 80 |  |

Headline shares within tolerance: 1 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 11% | 508 | 12% | 473 |
| onto freeway | Hillegass Avenue | 12% | 10% | 508 | 11% | 473 |
| onto freeway | Martin Street | 10% | 21% | 508 | 22% | 473 |
| onto freeway | Colby Street | 8% | 7% | 508 | 7% | 473 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 21% | 508 | 14% | 473 |
| onto freeway | Benvenue Avenue | 5% | 5% | 508 | 5% | 473 |
| from freeway | College Avenue | 10% | 7% | 804 | 6% | 601 |
| from freeway | Martin Street | 10% | 16% | 804 | 22% | 601 |
| from freeway | Colby Street | 8% | 6% | 804 | 8% | 601 |
| from freeway | Hillegass Avenue | 5% | 4% | 804 | 5% | 601 |
| from freeway | Benvenue Avenue | 3% | 2% | 804 | 3% | 601 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 728 | 55th Street | Tertiary | 1 | 238 | signal | 7.37 | 5.34 | 5.3 | 367 |
| 1679 | 52nd Street | Secondary | 4 | 53 | signal | 7.16 | 6.14 | 6.1 | 446 |
| 4436 | Ashby Avenue | Primary | 2 | 96 | signal | 5.66 | 4.74 | 4.7 | 271 |
| 4166 | 54th Street | Residential | 1 | 233 | two_way_stop | 4.05 | 3.40 | 3.4 | 95 |
| 1139 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 3.75 | 3.03 | 3.0 | 262 |
| 1677 | Shattuck Avenue | Tertiary | 1 | 101 | signal | 3.67 | 2.68 | 2.7 | 587 |
| 1768 | Shattuck Avenue | Tertiary | 1 | 89 | signal | 3.57 | 2.53 | 2.5 | 623 |
| 2018 | Shattuck Avenue | Tertiary | 1 | 152 | two_way_stop | 3.22 | 1.34 | 1.3 | 650 |
| 764 | Adeline Street | Secondary | 1 | 80 | signal | 3.01 | 2.62 | 2.6 | 157 |
| 1776 | Shattuck Avenue | Tertiary | 1 | 111 | two_way_stop | 2.96 | 1.40 | 1.4 | 649 |
| 1770 | Shattuck Avenue | Tertiary | 1 | 86 | two_way_stop | 2.84 | 1.71 | 1.7 | 635 |
| 1774 | Shattuck Avenue | Tertiary | 1 | 98 | two_way_stop | 2.80 | 1.38 | 1.4 | 642 |
| 2032 | Shattuck Avenue | Tertiary | 1 | 93 | signal | 2.71 | 1.57 | 1.6 | 704 |
| 2029 | Shattuck Avenue | Tertiary | 1 | 92 | signal | 2.56 | 1.52 | 1.5 | 748 |
| 265 | 59th Street | Residential | 1 | 150 | two_way_stop | 2.54 | 2.02 | 2.0 | 127 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 688 | 52nd Street / Shattuck Avenue | signal |  | 3.02 | 0.20 | 75 s: 23/42 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 2.49 | 0.00 | 75 s: 13/15/14/13 |
| 339 | 52nd Street / Martin Luther King Junior Way | signal |  | 2.39 | 0.01 | 75 s: 38/27 |
| 509 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.22 | 0.02 | 75 s: 15/50 |
| 1422 | Ashby Avenue / Claremont Avenue | signal |  | 2.10 | 0.03 | 75 s: 32/33 |
| 863 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.07 | 0.01 | 75 s: 37/28 |
| 956 | Ashby Avenue / Shattuck Avenue | signal |  | 2.03 | 0.01 | 75 s: 34/31 |
| 1389 | Ashby Avenue / Domingo Avenue / Tunnel Road | signal |  | 1.87 | 0.09 | 75 s: 27/15/18 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 1.82 | 0.01 | 75 s: 34/31 |
| 959 | Ashby Avenue / Telegraph Avenue | signal |  | 1.74 | 0.00 | 75 s: 26/39 |
| 346 | 55th Street / Shattuck Avenue | signal |  | 1.70 | 0.02 | 75 s: 39/26 |
| 454 | Market Street / Stanford Avenue | signal |  | 1.69 | 0.00 | 75 s: 50/15 |
| 960 | Telegraph Avenue / Webster Street | signal |  | 1.64 | 0.01 | 75 s: 21/16/23 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 1.62 | 0.01 | 75 s: 42/23 |
| 1084 | Claremont Avenue / Colby Street / Forest Street | signal |  | 1.49 | 0.00 | 75 s: 30/15/15 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 688: 23 s: 52nd Street 4L [1679], 52nd Street 4L [1683]; 42 s: Shattuck Avenue 2L [1670], Shattuck Avenue 2L [1722]
- node 30: 13 s: Adeline Street 1L [764], Adeline Street 1L [1047]; 15 s: Market Street 2L [772], Market Street 2L [1130]; 14 s: 57th Street 1L [44]; 13 s: 57th Street 1L [1168]
- node 339: 38 s: Martin Luther King Junior Way 4L [721], Martin Luther King Junior Way 4L [778]; 27 s: 52nd Street 2L [775], 52nd Street 1L [777]
- node 509: 15 s: Alcatraz Avenue 1L [1139], Alcatraz Avenue 2L [2105]; 50 s: Shattuck Avenue 1L [2029], Shattuck Avenue 1L [2032]
- node 1422: 32 s: Ashby Avenue 1L [3426], Ashby Avenue 2L [3457]; 33 s: Claremont Avenue 3L [3478], Claremont Avenue 2L [4366]

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 518 | 540 |
| Telegraph | S | 10 | 713 | 744 |
| College | N | 3 | 173 | 173 |
| College | S | 3 | 198 | 202 |
| Claremont | N | 6 | 402 | 587 |
| Claremont | S | 7 | 295 | 518 |
| Alcatraz | E | 6 | 344 | 349 |
| Alcatraz | W | 6 | 287 | 318 |
| Hillegass | N | 4 | 31 | 40 |
| Hillegass | S | 4 | 59 | 60 |
| Colby | N | 7 | 18 | 23 |
| Colby | S | 7 | 47 | 56 |
| Martin | E | 2 | 138 | 138 |
| Martin | W | 2 | 152 | 152 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 610 | Grove Shafter Freeway | 2996 |
| 955 | Telegraph Avenue / Ward Street | 1227 |
| 1688 | Warren Freeway | 963 |
| 183 | San Pablo Avenue | 908 |
| 266 | Ashby Avenue | 780 |
| 283 | Market Street | 350 |
| 771 | Telegraph Avenue | 341 |
| 1774 | Claremont Avenue | 323 |
| 986 | Broadway | 294 |
| 104 | San Pablo Avenue | 289 |
