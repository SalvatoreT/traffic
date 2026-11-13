# Calibration report: rockridge midday scale 1 seed 1 (60 min)

Offered demand 15894 veh/h x scale 1 = 15894 veh/h. Run took 14.4 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (1 of 15784) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.95 m/s (last 15 min 10.07) | pass |

Overall: **STABLE**. Mean trip delay 74 s, mean trip time 373 s, completed 15912, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1767 | 0 | 1351 | 0 | 9.85 |
| 10 | 1711 | 0 | 2715 | 0 | 9.56 |
| 15 | 1641 | 1 | 4112 | 0 | 10.02 |
| 20 | 1706 | 2 | 5428 | 0 | 10.23 |
| 25 | 1667 | 0 | 6757 | 0 | 10.13 |
| 30 | 1647 | 0 | 8057 | 0 | 10.06 |
| 35 | 1617 | 0 | 9366 | 0 | 9.83 |
| 40 | 1716 | 2 | 10611 | 0 | 9.62 |
| 45 | 1708 | 1 | 11916 | 0 | 9.91 |
| 50 | 1642 | 1 | 13305 | 0 | 10.07 |
| 55 | 1617 | 4 | 14652 | 0 | 10.14 |
| 60 | 1709 | 1 | 15912 | 0 | 10.01 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 14608 | 0.00 | 0.3% | 1.092 | 1.056 | 4.7% | 0.0% | 1.029 | 2.0% | 0.0% | 6.0% | 1368 | 9.9% |
| gate to gate | 6422 | 0.01 | 0.6% | 1.096 | 1.075 | 3.5% | 0.1% | 1.026 | 1.8% | 0.0% | 9.4% | 443 | 4.8% |
| with a local end | 8186 | 0.00 | 0.2% | 1.089 | 1.046 | 5.6% | 0.0% | 1.031 | 2.1% | 0.0% | 3.3% | 926 | 12.4% |
| guided drivers | 6750 | 0.01 | 0.8% | 1.091 | 1.055 | 4.5% | 0.0% | 1.028 | 2.0% | 0.0% | 6.1% | 613 | 11.8% |
| other drivers | 7858 | 0.00 | 0.0% | 1.093 | 1.058 | 4.8% | 0.1% | 1.030 | 2.0% | 0.0% | 5.8% | 755 | 8.4% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (258 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 899 | 6.7 | 3% |
| freeway to the surface gates | 654 | 8.0 | 3% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 904 | 1% | 13% | 86% | 0.0 |
| Hillegass Avenue | College Avenue | 3 | S | 834 | 0% | 24% | 75% | 0.0 |

## Per-mode results

Offered: 15894 car veh/h; 100 bicycle flows (379/h); 2000 pedestrian flows (1580/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 1709 | 15912 | 373 | |
| Bicycle | 18 | 369 | 169 | |
| Pedestrian | 214 | 1464 | 443 | mean crossing delay 6.5 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 229, bicycle conflicts 120, close passes 210, pedestrian injury-risk index 0.054, bicycle injury-risk index 0.077 (proxy), mean vehicle speed at pedestrian encounters 2.69 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 98 trips (96 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 131 trips (127 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 97 trips (87 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 163 trips (149 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 58% | +11 | 98 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 1% | -20 | 98 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 5% | -1 | 98 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 24% | -3 | 98 |  |
| Colby Street NB | from | freeway | 47% | 64% | +17 | 131 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 9% | -39 | 131 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 18% | -7 | 131 |  |
| Colby Street NB | to | College Avenue | 3% | 2% | -1 | 131 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 8% | -38 | 97 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 5% | -21 | 97 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 2% | -14 | 97 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 70% | +13 | 97 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 26% | -17 | 163 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 17% | -29 | 163 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 15% | -7 | 163 |  |
| Colby Street SB | to | freeway | 45% | 71% | +26 | 163 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 10% | -24 | 163 |  |

Headline shares within tolerance: 0 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 16% | 454 | 19% | 344 |
| onto freeway | Hillegass Avenue | 12% | 11% | 454 | 15% | 344 |
| onto freeway | Martin Street | 10% | 14% | 454 | 16% | 344 |
| onto freeway | Colby Street | 8% | 20% | 454 | 26% | 344 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 9% | 454 | 8% | 344 |
| onto freeway | Benvenue Avenue | 5% | 4% | 454 | 5% | 344 |
| from freeway | College Avenue | 10% | 7% | 621 | 6% | 448 |
| from freeway | Martin Street | 10% | 17% | 621 | 23% | 448 |
| from freeway | Colby Street | 8% | 12% | 621 | 17% | 448 |
| from freeway | Hillegass Avenue | 5% | 6% | 621 | 8% | 448 |
| from freeway | Benvenue Avenue | 3% | 1% | 621 | 2% | 448 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 6.02 | 3.14 | 3.1 | 1012 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 4.67 | 3.82 | 3.8 | 722 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 4.33 | 3.55 | 3.5 | 548 |
| 460 | Sacramento Street | Tertiary | 2 | 104 | two_way_stop | 4.00 | 3.02 | 3.0 | 479 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 3.87 | 3.09 | 3.1 | 803 |
| 1111 | Market Street | Tertiary | 3 | 31 | signal | 3.57 | 3.17 | 3.2 | 427 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 3.30 | 2.91 | 2.9 | 593 |
| 498 | Sacramento Street | Tertiary | 3 | 48 | signal | 3.30 | 2.66 | 2.7 | 452 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 3.10 | 1.95 | 2.0 | 475 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 3.06 | 2.49 | 2.5 | 402 |
| 2005 | Shattuck Avenue | Tertiary | 1 | 92 | signal | 2.97 | 2.15 | 2.1 | 443 |
| 1037 | Sacramento Street | Tertiary | 3 | 40 | signal | 2.96 | 2.18 | 2.2 | 946 |
| 108 | Stanford Avenue | Secondary | 3 | 61 | signal | 2.96 | 1.66 | 1.7 | 1052 |
| 2008 | Shattuck Avenue | Tertiary | 1 | 93 | signal | 2.78 | 2.00 | 2.0 | 432 |
| 1025 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 2.70 | 2.14 | 2.1 | 391 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 4.68 | 0.05 | 110 s: 34/28/34 |
| 446 | Market Street / Stanford Avenue | signal |  | 4.52 | 0.12 | 75 s: 50/15 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 4.19 | 0.05 | 75 s: 24/41 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 2.66 | 0.00 | 75 s: 23/42 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 2.64 | 0.01 | 75 s: 19/26/15 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.63 | 0.03 | 75 s: 31/34 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.58 | 0.01 | 75 s: 36/29 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 2.35 | 0.01 | 75 s: 24/41 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.22 | 0.02 | 75 s: 15/31/14 |
| 501 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.22 | 0.07 | 75 s: 35/30 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.12 | 0.02 | 75 s: 40/25 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.11 | 0.00 | 75 s: 44/21 |
| 947 | Ashby Avenue / Telegraph Avenue | signal |  | 2.01 | 0.00 | 75 s: 22/43 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 2.00 | 0.00 | 75 s: 44/21 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 1.99 | 0.09 | 75 s: 48/17 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 680: 34 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666]; 34 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 446: 50 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 15 s: Market Street 4L [1108], Market Street 3L [1111]
- node 447: 24 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 41 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 37: 23 s: San Pablo Avenue 3L [114], San Pablo Avenue 3L [115]; 42 s: Stanford Avenue 3L [108], Stanford Avenue 2L [4109]
- node 30: 19 s: Adeline Street 1L [747], Adeline Street 1L [1030]; 26 s: Market Street 2L [755], Market Street 2L [1113]; 15 s: 57th Street 1L [44], 57th Street 1L [1151]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 1093 | College Avenue / Harwood Avenue | 1 | 21 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 652 | 682 |
| Telegraph | S | 10 | 402 | 424 |
| College | N | 3 | 185 | 186 |
| College | S | 3 | 422 | 425 |
| Claremont | N | 6 | 253 | 420 |
| Claremont | S | 7 | 174 | 388 |
| Alcatraz | E | 6 | 404 | 444 |
| Alcatraz | W | 6 | 268 | 278 |
| Hillegass | N | 4 | 67 | 72 |
| Hillegass | S | 4 | 60 | 67 |
| Colby | N | 7 | 82 | 91 |
| Colby | S | 7 | 108 | 127 |
| Martin | E | 2 | 79 | 79 |
| Martin | W | 2 | 128 | 128 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 2641 |
| 943 | Telegraph Avenue / Ward Street | 1157 |
| 1672 | Warren Freeway | 960 |
| 265 | Ashby Avenue | 781 |
| 183 | San Pablo Avenue | 712 |
| 104 | San Pablo Avenue | 417 |
| 763 | Telegraph Avenue | 406 |
| 974 | Broadway | 364 |
| 275 | Market Street | 320 |
| 276 | Martin Luther King Junior Way | 235 |
