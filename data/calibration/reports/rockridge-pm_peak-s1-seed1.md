# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 25244 veh/h x scale 1 = 25244 veh/h. Run took 30.5 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 3 | FAIL |
| Backlog / spawned | < 2% | 0.1% (18 of 25318) | pass |
| Arterial mean speed (run) | > 4 m/s | 8.05 m/s (last 15 min 7.64) | pass |

Overall: **NOT STABLE**. Mean trip delay 163 s, mean trip time 457 s, completed 24526, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 3052 | 3 | 2007 | 0 | 9.22 |
| 10 | 3096 | 1 | 4060 | 0 | 8.37 |
| 15 | 3132 | 2 | 6061 | 0 | 7.89 |
| 20 | 3273 | 2 | 8060 | 1 | 8.36 |
| 25 | 3340 | 4 | 10158 | 1 | 8.54 |
| 30 | 3421 | 6 | 12245 | 1 | 8.13 |
| 35 | 3401 | 17 | 14346 | 1 | 7.88 |
| 40 | 3422 | 3 | 16358 | 1 | 7.66 |
| 45 | 3489 | 9 | 18385 | 1 | 7.87 |
| 50 | 3586 | 8 | 20424 | 2 | 7.67 |
| 55 | 3587 | 3 | 22515 | 3 | 7.72 |
| 60 | 3694 | 18 | 24526 | 3 | 7.52 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 22439 | 0.05 | 4.9% | 1.108 | 1.068 | 7.6% | 0.2% | 1.044 | 3.5% | 0.1% | 6.2% | 2308 | 9.8% |
| gate to gate | 9099 | 0.09 | 8.0% | 1.108 | 1.082 | 6.4% | 0.1% | 1.047 | 3.7% | 0.1% | 9.8% | 655 | 12.0% |
| with a local end | 13340 | 0.03 | 2.8% | 1.107 | 1.058 | 8.5% | 0.4% | 1.043 | 3.4% | 0.0% | 3.7% | 1653 | 9.0% |
| guided drivers | 10480 | 0.11 | 9.7% | 1.107 | 1.068 | 7.5% | 0.3% | 1.044 | 3.5% | 0.0% | 5.7% | 1060 | 9.1% |
| other drivers | 11959 | 0.01 | 0.7% | 1.108 | 1.069 | 7.7% | 0.2% | 1.045 | 3.5% | 0.1% | 6.5% | 1248 | 10.5% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (466 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1559 | 11.7 | 3% |
| freeway to the surface gates | 853 | 9.0 | 2% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1292 | 1% | 17% | 81% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 1213 | 1% | 28% | 70% | 0.1 |

## Per-mode results

Offered: 25244 car veh/h; 1500 bicycle flows (1170/h); 2000 pedestrian flows (1995/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 3694 | 24526 | 457 | |
| Bicycle | 105 | 1192 | 369 | |
| Pedestrian | 274 | 1905 | 506 | mean crossing delay 9.3 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 388, bicycle conflicts 1671, close passes 1060, pedestrian injury-risk index 0.046, bicycle injury-risk index 0.056 (proxy), mean vehicle speed at pedestrian encounters 2.38 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 203 trips (191 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 250 trips (235 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 220 trips (203 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 272 trips (249 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 50% | +3 | 203 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 2% | -31 | 203 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 3% | -3 | 203 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 25% | -2 | 203 |  |
| Colby Street NB | from | freeway | 47% | 63% | +16 | 250 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 16% | -32 | 250 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 22% | -3 | 250 |  |
| Colby Street NB | to | College Avenue | 3% | 1% | -2 | 250 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 10% | -36 | 220 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 1% | -25 | 220 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 7% | -9 | 220 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 61% | -7 | 220 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 15% | -28 | 272 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 24% | -22 | 272 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 22% | -0 | 272 |  |
| Colby Street SB | to | freeway | 45% | 58% | +13 | 272 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 9% | -25 | 272 |  |

Headline shares within tolerance: 2 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 20% | 797 | 25% | 554 |
| onto freeway | Hillegass Avenue | 12% | 14% | 797 | 21% | 554 |
| onto freeway | Martin Street | 10% | 14% | 797 | 17% | 554 |
| onto freeway | Colby Street | 8% | 18% | 797 | 26% | 554 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 13% | 797 | 9% | 554 |
| onto freeway | Benvenue Avenue | 5% | 1% | 797 | 2% | 554 |
| from freeway | College Avenue | 10% | 8% | 1013 | 6% | 661 |
| from freeway | Martin Street | 10% | 14% | 1013 | 21% | 661 |
| from freeway | Colby Street | 8% | 14% | 1013 | 22% | 661 |
| from freeway | Hillegass Avenue | 5% | 7% | 1013 | 10% | 661 |
| from freeway | Benvenue Avenue | 3% | 2% | 1013 | 3% | 661 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 33.08 | 28.12 | 28.1 | 520 |
| 1116 | Market Street | Tertiary | 2 | 87 | uncontrolled | 9.69 | 8.29 | 8.3 | 329 |
| 2921 | Russell Street | Residential | 1 | 260 | uncontrolled | 9.65 | 8.43 | 8.4 | 94 |
| 4175 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 9.28 | 0.58 | 0.6 | 1602 |
| 1025 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 9.08 | 7.84 | 7.8 | 608 |
| 3395 | Ashby Avenue | Primary | 1 | 129 | signal | 8.82 | 6.39 | 6.4 | 572 |
| 1002 | Adeline Street | Secondary | 3 | 71 | uncontrolled | 8.35 | 6.94 | 6.9 | 536 |
| 1123 | Alcatraz Avenue | Tertiary | 1 | 299 | two_way_stop | 7.59 | 4.83 | 4.8 | 439 |
| 4329 | Claremont Avenue | Secondary | 2 | 113 | signal | 7.27 | 6.15 | 6.2 | 282 |
| 1001 | Adeline Street | Secondary | 3 | 121 | two_way_stop | 7.19 | 5.82 | 5.8 | 599 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 7.19 | 6.11 | 6.1 | 550 |
| 2037 | Alcatraz Avenue | Tertiary | 1 | 202 | uncontrolled | 6.98 | 5.27 | 5.3 | 401 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 6.75 | 5.50 | 5.5 | 782 |
| 3434 | Claremont Avenue | Secondary | 1 | 93 | all_way_stop | 6.72 | 3.78 | 3.8 | 457 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 6.11 | 4.80 | 4.8 | 1318 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 5.68 | 0.10 | 110 s: 34/28/34 |
| 446 | Market Street / Stanford Avenue | signal |  | 5.60 | 0.18 | 75 s: 50/15 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 4.84 | 0.84 | 75 s: 30/35 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 4.02 | 0.02 | 75 s: 29/16/15 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.97 | 0.01 | 80 s: 17/53 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 3.74 | 0.04 | 75 s: 15/30/15 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal |  | 3.67 | 0.01 | 75 s: 47/18 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 3.34 | 0.18 | 75 s: 45/20 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.22 | 0.00 | 75 s: 32/33 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.21 | 0.13 | 75 s: 43/22 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 3.18 | 0.39 | 75 s: 45/20 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.98 | 0.03 | 75 s: 45/20 |
| 501 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.97 | 0.13 | 75 s: 23/42 |
| 947 | Ashby Avenue / Telegraph Avenue | signal |  | 2.87 | 0.00 | 75 s: 22/43 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.80 | 0.00 | 75 s: 50/15 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 680: 34 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666]; 34 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 446: 50 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 15 s: Market Street 4L [1108], Market Street 3L [1111]
- node 447: 30 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 35 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 30: 29 s: Adeline Street 1L [747], Adeline Street 1L [1030]; 16 s: Market Street 2L [755], Market Street 2L [1113]; 15 s: 57th Street 1L [44], 57th Street 1L [1151]
- node 479: 17 s: Martin Luther King Junior Way 3L [1025], Adeline Street 3L [4143]; 53 s: Stanford Avenue 1L [4139]

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 4173 | 52nd Street | 52nd Street | uncontrolled | 2 | 46.5 |
| 2921 | Russell Street | Russell Street | uncontrolled | 1 | 16.2 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 1756 | Claremont Avenue | 14 | 483 |
| 417 | 58th Street / Market Street | 1 | 66 |
| 435 | 61st Street / Adeline Street | 1 | 38 |
| 460 | Alcatraz Avenue / Ellis Street | 1 | 17 |
| 490 | California Street | 1 | 12 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 998 | 1052 |
| Telegraph | S | 10 | 874 | 1052 |
| College | N | 3 | 406 | 408 |
| College | S | 3 | 778 | 781 |
| Claremont | N | 6 | 438 | 719 |
| Claremont | S | 7 | 473 | 772 |
| Alcatraz | E | 6 | 491 | 510 |
| Alcatraz | W | 6 | 341 | 389 |
| Hillegass | N | 4 | 106 | 149 |
| Hillegass | S | 4 | 120 | 160 |
| Colby | N | 7 | 124 | 200 |
| Colby | S | 7 | 174 | 188 |
| Martin | E | 2 | 166 | 166 |
| Martin | W | 2 | 184 | 184 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 4250 |
| 943 | Telegraph Avenue / Ward Street | 1458 |
| 1672 | Warren Freeway | 1228 |
| 265 | Ashby Avenue | 1134 |
| 183 | San Pablo Avenue | 947 |
| 184 | Alcatraz Avenue | 702 |
| 974 | Broadway | 601 |
| 763 | Telegraph Avenue | 578 |
| 276 | Martin Luther King Junior Way | 551 |
| 870 | Colby Street | 519 |
