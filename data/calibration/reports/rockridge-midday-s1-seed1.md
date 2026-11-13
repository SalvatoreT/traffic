# Calibration report: rockridge midday scale 1 seed 1 (60 min)

Offered demand 16033 veh/h x scale 1 = 16033 veh/h. Run took 19.4 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (1 of 16193) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.88 m/s (last 15 min 9.82) | pass |

Overall: **STABLE**. Mean trip delay 77 s, mean trip time 366 s, completed 16334, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1731 | 1 | 1467 | 0 | 9.95 |
| 10 | 1688 | 0 | 2880 | 0 | 9.89 |
| 15 | 1618 | 1 | 4247 | 0 | 9.91 |
| 20 | 1625 | 0 | 5581 | 0 | 9.91 |
| 25 | 1634 | 2 | 6891 | 0 | 10.13 |
| 30 | 1689 | 0 | 8224 | 0 | 10.05 |
| 35 | 1661 | 3 | 9572 | 0 | 9.85 |
| 40 | 1739 | 2 | 10875 | 0 | 9.62 |
| 45 | 1798 | 1 | 12190 | 0 | 9.88 |
| 50 | 1782 | 0 | 13591 | 0 | 9.67 |
| 55 | 1666 | 0 | 15012 | 0 | 9.74 |
| 60 | 1693 | 1 | 16334 | 0 | 10.05 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 15000 | 0.00 | 0.5% | 1.091 | 1.053 | 5.2% | 0.1% | 1.028 | 1.7% | 0.0% | 5.3% | 1347 | 7.7% |
| gate to gate | 6694 | 0.01 | 0.9% | 1.094 | 1.071 | 3.2% | 0.1% | 1.031 | 1.5% | 0.0% | 8.3% | 485 | 4.6% |
| with a local end | 8306 | 0.00 | 0.2% | 1.089 | 1.042 | 6.9% | 0.0% | 1.026 | 1.9% | 0.0% | 2.9% | 862 | 9.4% |
| guided drivers | 6907 | 0.01 | 1.1% | 1.092 | 1.053 | 5.4% | 0.1% | 1.029 | 1.8% | 0.0% | 5.2% | 608 | 7.1% |
| other drivers | 8093 | 0.00 | 0.0% | 1.090 | 1.053 | 5.0% | 0.0% | 1.028 | 1.7% | 0.0% | 5.4% | 739 | 8.2% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (259 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1027 | 6.3 | 2% |
| freeway to the surface gates | 751 | 8.4 | 3% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 914 | 0% | 16% | 83% | 0.0 |
| Hillegass Avenue | College Avenue | 3 | S | 782 | 2% | 25% | 74% | 0.1 |

## Per-mode results

Offered: 16033 car veh/h; 560 bicycle flows (592/h); 2000 pedestrian flows (1824/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 1693 | 16334 | 366 | |
| Bicycle | 45 | 605 | 291 | |
| Pedestrian | 239 | 1738 | 491 | mean crossing delay 7.2 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 297, bicycle conflicts 529, close passes 486, pedestrian injury-risk index 0.053, bicycle injury-risk index 0.068 (proxy), mean vehicle speed at pedestrian encounters 2.63 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 100 trips (93 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 131 trips (128 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 103 trips (100 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 129 trips (121 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 56% | +9 | 100 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 4% | -17 | 100 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 8% | +2 | 100 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 30% | +3 | 100 |  |
| Colby Street NB | from | freeway | 47% | 69% | +22 | 131 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 8% | -40 | 131 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 19% | -6 | 131 |  |
| Colby Street NB | to | College Avenue | 3% | 2% | -1 | 131 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 6% | -40 | 103 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 0% | -26 | 103 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 0% | -16 | 103 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 61% | +4 | 103 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 19% | -24 | 129 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 12% | -34 | 129 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 15% | -7 | 129 |  |
| Colby Street SB | to | freeway | 45% | 55% | +10 | 129 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 12% | -22 | 129 |  |

Headline shares within tolerance: 2 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 20% | 430 | 27% | 308 |
| onto freeway | Hillegass Avenue | 12% | 11% | 430 | 15% | 308 |
| onto freeway | Martin Street | 10% | 21% | 430 | 30% | 308 |
| onto freeway | Colby Street | 8% | 12% | 430 | 17% | 308 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 13% | 430 | 9% | 308 |
| onto freeway | Benvenue Avenue | 5% | 3% | 430 | 4% | 308 |
| from freeway | College Avenue | 10% | 7% | 634 | 6% | 441 |
| from freeway | Martin Street | 10% | 10% | 634 | 15% | 441 |
| from freeway | Colby Street | 8% | 13% | 634 | 18% | 441 |
| from freeway | Hillegass Avenue | 5% | 6% | 634 | 8% | 441 |
| from freeway | Benvenue Avenue | 3% | 2% | 634 | 2% | 441 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 12.90 | 9.18 | 9.2 | 691 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 4.78 | 3.85 | 3.9 | 649 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 4.02 | 3.37 | 3.4 | 671 |
| 1111 | Market Street | Tertiary | 3 | 31 | signal | 3.44 | 3.08 | 3.1 | 406 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 3.20 | 2.11 | 2.1 | 384 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 3.19 | 2.51 | 2.5 | 624 |
| 769 | Martin Luther King Junior Way | Secondary | 3 | 112 | signal | 3.14 | 2.03 | 2.0 | 1055 |
| 498 | Sacramento Street | Tertiary | 3 | 48 | signal | 3.14 | 2.43 | 2.4 | 520 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 3.09 | 2.79 | 2.8 | 613 |
| 2008 | Shattuck Avenue | Tertiary | 1 | 93 | signal | 3.08 | 1.94 | 1.9 | 605 |
| 1037 | Sacramento Street | Tertiary | 3 | 40 | signal | 2.90 | 2.18 | 2.2 | 904 |
| 108 | Stanford Avenue | Secondary | 3 | 61 | signal | 2.75 | 1.61 | 1.6 | 881 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 2.69 | 2.14 | 2.1 | 528 |
| 3463 | Tunnel Road | Primary | 2 | 52 | signal | 2.59 | 2.13 | 2.1 | 756 |
| 1025 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 2.52 | 1.97 | 2.0 | 412 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 5.04 | 0.03 | 110 s: 34/28/34 |
| 446 | Market Street / Stanford Avenue | signal |  | 4.36 | 0.11 | 75 s: 50/15 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 3.91 | 0.05 | 75 s: 23/42 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.08 | 0.01 | 75 s: 29/16/15 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.79 | 0.02 | 75 s: 36/29 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 2.53 | 0.00 | 75 s: 25/40 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 2.50 | 0.00 | 75 s: 23/42 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.49 | 0.02 | 75 s: 39/26 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.36 | 0.01 | 75 s: 16/29/15 |
| 501 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.32 | 0.04 | 80 s: 30/40 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal |  | 2.17 | 0.00 | 75 s: 42/23 |
| 947 | Ashby Avenue / Telegraph Avenue | signal |  | 2.17 | 0.00 | 75 s: 20/45 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.02 | 0.02 | 75 s: 40/25 |
| 613 | 52nd Street / Claremont Avenue / Telegraph Avenue | signal |  | 1.96 | 0.06 | 75 s: 41/24 |
| 332 | 55th Street / Martin Luther King Junior Way | signal |  | 1.94 | 0.01 | 75 s: 48/17 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 680: 34 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666]; 34 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 446: 50 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 15 s: Market Street 4L [1108], Market Street 3L [1111]
- node 447: 23 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 42 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 30: 29 s: Adeline Street 1L [747], Adeline Street 1L [1030]; 16 s: Market Street 2L [755], Market Street 2L [1113]; 15 s: 57th Street 1L [44], 57th Street 1L [1151]
- node 185: 36 s: Alcatraz Avenue 1L [363], Alcatraz Avenue 1L [1162]; 29 s: Sacramento Street 3L [1036], Sacramento Street 3L [1037]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 885 | Howe Street / Telegraph Avenue | 1 | 38 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 529 | 559 |
| Telegraph | S | 10 | 383 | 413 |
| College | N | 3 | 216 | 217 |
| College | S | 3 | 445 | 448 |
| Claremont | N | 6 | 314 | 482 |
| Claremont | S | 7 | 240 | 383 |
| Alcatraz | E | 6 | 401 | 409 |
| Alcatraz | W | 6 | 276 | 284 |
| Hillegass | N | 4 | 56 | 68 |
| Hillegass | S | 4 | 54 | 60 |
| Colby | N | 7 | 91 | 95 |
| Colby | S | 7 | 62 | 74 |
| Martin | E | 2 | 108 | 108 |
| Martin | W | 2 | 108 | 108 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 2612 |
| 943 | Telegraph Avenue / Ward Street | 1259 |
| 1672 | Warren Freeway | 791 |
| 265 | Ashby Avenue | 781 |
| 183 | San Pablo Avenue | 561 |
| 184 | Alcatraz Avenue | 438 |
| 763 | Telegraph Avenue | 381 |
| 104 | San Pablo Avenue | 377 |
| 1719 | Grove Shafter Freeway | 345 |
| 1756 | Claremont Avenue | 322 |
