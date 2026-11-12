# Calibration report: rockridge midday scale 1 seed 1 (60 min)

Offered demand 14897 veh/h x scale 1 = 14897 veh/h. Run took 17.5 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (2 of 14989) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.90 m/s (last 15 min 9.96) | pass |

Overall: **STABLE**. Mean trip delay 94 s, mean trip time 401 s, completed 15000, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1808 | 0 | 1292 | 0 | 9.45 |
| 10 | 1886 | 1 | 2529 | 0 | 9.59 |
| 15 | 1782 | 1 | 3902 | 0 | 10.05 |
| 20 | 1702 | 1 | 5220 | 0 | 10.01 |
| 25 | 1720 | 1 | 6466 | 0 | 9.98 |
| 30 | 1671 | 1 | 7708 | 0 | 9.70 |
| 35 | 1632 | 0 | 8933 | 0 | 10.22 |
| 40 | 1722 | 0 | 10086 | 0 | 9.83 |
| 45 | 1711 | 0 | 11342 | 0 | 10.11 |
| 50 | 1691 | 1 | 12578 | 0 | 9.83 |
| 55 | 1721 | 1 | 13811 | 0 | 9.98 |
| 60 | 1779 | 2 | 15000 | 0 | 10.06 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 13740 | 0.01 | 0.5% | 1.100 | 1.059 | 7.9% | 0.0% | 1.031 | 3.8% | 0.0% | 7.0% | 1510 | 19.7% |
| gate to gate | 7489 | 0.01 | 0.7% | 1.106 | 1.078 | 7.5% | 0.0% | 1.033 | 3.5% | 0.0% | 10.5% | 775 | 20.8% |
| with a local end | 6251 | 0.00 | 0.3% | 1.092 | 1.029 | 8.4% | 0.1% | 1.029 | 4.2% | 0.0% | 2.8% | 735 | 18.5% |
| guided drivers | 6372 | 0.01 | 1.2% | 1.099 | 1.058 | 8.0% | 0.1% | 1.032 | 3.8% | 0.0% | 6.7% | 699 | 20.8% |
| other drivers | 7368 | 0.00 | 0.0% | 1.100 | 1.060 | 7.9% | 0.0% | 1.031 | 3.8% | 0.0% | 7.2% | 810 | 18.7% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (218 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 905 | 11.2 | 5% |
| freeway to the surface gates | 945 | 4.8 | 2% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 805 | 3% | 10% | 87% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 880 | 6% | 12% | 82% | 0.2 |

## Per-mode results

Offered: 14897 car veh/h; 532 bicycle flows (583/h); 2000 pedestrian flows (1820/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 1779 | 15000 | 401 | |
| Bicycle | 44 | 598 | 299 | |
| Pedestrian | 219 | 1735 | 484 | mean crossing delay 5.0 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 318, bicycle conflicts 521, close passes 233, pedestrian injury-risk index 0.043, bicycle injury-risk index 0.049 (proxy), mean vehicle speed at pedestrian encounters 2.37 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 68 trips (66 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 53 trips (51 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 109 trips (104 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 108 trips (102 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 75% | +28 | 68 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 7% | -14 | 68 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 6% | -0 | 68 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 25% | -2 | 68 |  |
| Colby Street NB | from | freeway | 47% | 40% | -7 | 53 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 13% | -35 | 53 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 28% | +3 | 53 |  |
| Colby Street NB | to | College Avenue | 3% | 2% | -1 | 53 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 24% | -22 | 109 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 11% | -15 | 109 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 24% | +8 | 109 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 56% | -1 | 109 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 11% | -32 | 108 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 31% | -15 | 108 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 32% | +10 | 108 |  |
| Colby Street SB | to | freeway | 45% | 30% | -15 | 108 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 43% | +9 | 108 |  |

Headline shares within tolerance: 2 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 11% | 518 | 11% | 496 |
| onto freeway | Hillegass Avenue | 12% | 13% | 518 | 14% | 496 |
| onto freeway | Martin Street | 10% | 19% | 518 | 19% | 496 |
| onto freeway | Colby Street | 8% | 7% | 518 | 8% | 496 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 20% | 518 | 15% | 496 |
| onto freeway | Benvenue Avenue | 5% | 6% | 518 | 6% | 496 |
| from freeway | College Avenue | 10% | 5% | 846 | 6% | 650 |
| from freeway | Martin Street | 10% | 13% | 846 | 17% | 650 |
| from freeway | Colby Street | 8% | 7% | 846 | 9% | 650 |
| from freeway | Hillegass Avenue | 5% | 6% | 846 | 8% | 650 |
| from freeway | Benvenue Avenue | 3% | 2% | 846 | 2% | 650 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4436 | Ashby Avenue | Primary | 2 | 96 | signal | 9.02 | 7.92 | 7.9 | 233 |
| 728 | 55th Street | Tertiary | 1 | 238 | signal | 8.12 | 6.39 | 6.4 | 282 |
| 1679 | 52nd Street | Secondary | 4 | 53 | signal | 8.06 | 6.94 | 6.9 | 431 |
| 265 | 59th Street | Residential | 1 | 150 | two_way_stop | 4.35 | 3.81 | 3.8 | 102 |
| 4166 | 54th Street | Residential | 1 | 233 | two_way_stop | 3.76 | 3.06 | 3.1 | 112 |
| 2032 | Shattuck Avenue | Tertiary | 1 | 93 | signal | 3.51 | 2.24 | 2.2 | 626 |
| 1139 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 3.50 | 2.74 | 2.7 | 281 |
| 1768 | Shattuck Avenue | Tertiary | 1 | 89 | signal | 3.45 | 2.33 | 2.3 | 715 |
| 764 | Adeline Street | Secondary | 1 | 80 | signal | 3.06 | 2.65 | 2.7 | 152 |
| 1770 | Shattuck Avenue | Tertiary | 1 | 86 | two_way_stop | 2.92 | 1.44 | 1.4 | 712 |
| 1677 | Shattuck Avenue | Tertiary | 1 | 101 | signal | 2.91 | 1.92 | 1.9 | 637 |
| 2018 | Shattuck Avenue | Tertiary | 1 | 152 | two_way_stop | 2.90 | 1.02 | 1.0 | 678 |
| 2029 | Shattuck Avenue | Tertiary | 1 | 92 | signal | 2.87 | 1.83 | 1.8 | 715 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 2.82 | 1.98 | 2.0 | 611 |
| 225 | 61st Street | Residential | 1 | 137 | two_way_stop | 2.79 | 1.48 | 1.5 | 334 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 688 | 52nd Street / Shattuck Avenue | signal |  | 3.82 | 0.25 | 75 s: 25/40 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 2.49 | 0.00 | 75 s: 15/14/13/13 |
| 339 | 52nd Street / Martin Luther King Junior Way | signal |  | 2.45 | 0.01 | 75 s: 38/27 |
| 509 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.35 | 0.03 | 75 s: 25/40 |
| 863 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.26 | 0.02 | 75 s: 38/27 |
| 1422 | Ashby Avenue / Claremont Avenue | signal |  | 2.23 | 0.04 | 75 s: 36/29 |
| 959 | Ashby Avenue / Telegraph Avenue | signal |  | 2.11 | 0.00 | 75 s: 25/40 |
| 1389 | Ashby Avenue / Domingo Avenue / Tunnel Road | signal |  | 2.10 | 0.17 | 75 s: 28/17/15 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 2.07 | 0.01 | 75 s: 39/26 |
| 454 | Market Street / Stanford Avenue | signal |  | 2.01 | 0.01 | 75 s: 50/15 |
| 956 | Ashby Avenue / Shattuck Avenue | signal |  | 1.85 | 0.00 | 75 s: 29/36 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 1.82 | 0.01 | 75 s: 50/15 |
| 1084 | Claremont Avenue / Colby Street / Forest Street | signal |  | 1.72 | 0.00 | 75 s: 30/15/15 |
| 1095 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 1.69 | 0.00 | 75 s: 29/16/15 |
| 346 | 55th Street / Shattuck Avenue | signal |  | 1.67 | 0.01 | 75 s: 27/38 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 688: 25 s: 52nd Street 4L [1679], 52nd Street 4L [1683]; 40 s: Shattuck Avenue 2L [1670], Shattuck Avenue 2L [1722]
- node 30: 15 s: Adeline Street 1L [764], Adeline Street 1L [1047]; 14 s: Market Street 2L [772], Market Street 2L [1130]; 13 s: 57th Street 1L [44]; 13 s: 57th Street 1L [1168]
- node 339: 38 s: Martin Luther King Junior Way 4L [721], Martin Luther King Junior Way 4L [778]; 27 s: 52nd Street 2L [775], 52nd Street 1L [777]
- node 509: 25 s: Alcatraz Avenue 1L [1139], Alcatraz Avenue 2L [2105]; 40 s: Shattuck Avenue 1L [2029], Shattuck Avenue 1L [2032]
- node 863: 38 s: Telegraph Avenue 3L [2063], Telegraph Avenue 3L [2064]; 27 s: Alcatraz Avenue 2L [2057], Alcatraz Avenue 2L [2086]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 403 | 65th Street / Shattuck Avenue | 1 | 20 |
| 882 | Colby Street | 1 | 192 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 576 | 596 |
| Telegraph | S | 10 | 763 | 798 |
| College | N | 3 | 163 | 163 |
| College | S | 3 | 216 | 218 |
| Claremont | N | 6 | 439 | 613 |
| Claremont | S | 7 | 344 | 575 |
| Alcatraz | E | 6 | 370 | 382 |
| Alcatraz | W | 6 | 295 | 323 |
| Hillegass | N | 4 | 50 | 58 |
| Hillegass | S | 4 | 82 | 83 |
| Colby | N | 7 | 13 | 32 |
| Colby | S | 7 | 50 | 60 |
| Martin | E | 2 | 125 | 125 |
| Martin | W | 2 | 133 | 133 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 610 | Grove Shafter Freeway | 2992 |
| 955 | Telegraph Avenue / Ward Street | 1233 |
| 1688 | Warren Freeway | 981 |
| 183 | San Pablo Avenue | 957 |
| 266 | Ashby Avenue | 780 |
| 283 | Market Street | 409 |
| 771 | Telegraph Avenue | 340 |
| 1774 | Claremont Avenue | 315 |
| 986 | Broadway | 297 |
| 104 | San Pablo Avenue | 273 |
