# Calibration report: rockridge midday scale 1 seed 1 (60 min)

Offered demand 15341 veh/h x scale 1 = 15341 veh/h. Run took 16.9 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (0 of 15477) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.87 m/s (last 15 min 9.86) | pass |

Overall: **STABLE**. Mean trip delay 86 s, mean trip time 388 s, completed 15713, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1763 | 3 | 1366 | 0 | 9.61 |
| 10 | 1761 | 0 | 2668 | 0 | 9.54 |
| 15 | 1693 | 0 | 4032 | 0 | 10.07 |
| 20 | 1639 | 2 | 5330 | 0 | 10.04 |
| 25 | 1724 | 0 | 6561 | 0 | 10.11 |
| 30 | 1760 | 0 | 7801 | 0 | 9.69 |
| 35 | 1774 | 1 | 9140 | 0 | 9.84 |
| 40 | 1686 | 2 | 10520 | 0 | 9.96 |
| 45 | 1709 | 2 | 11786 | 0 | 10.10 |
| 50 | 1733 | 0 | 13094 | 0 | 9.77 |
| 55 | 1715 | 0 | 14389 | 0 | 9.89 |
| 60 | 1636 | 0 | 15713 | 0 | 9.93 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 14345 | 0.01 | 0.5% | 1.095 | 1.054 | 6.2% | 0.1% | 1.030 | 2.2% | 0.0% | 6.4% | 1814 | 12.9% |
| gate to gate | 7701 | 0.01 | 0.7% | 1.097 | 1.070 | 5.1% | 0.1% | 1.028 | 1.7% | 0.0% | 9.9% | 819 | 12.1% |
| with a local end | 6644 | 0.00 | 0.3% | 1.092 | 1.034 | 7.4% | 0.1% | 1.031 | 2.9% | 0.0% | 2.4% | 995 | 13.6% |
| guided drivers | 6597 | 0.01 | 1.0% | 1.094 | 1.053 | 6.2% | 0.1% | 1.029 | 2.2% | 0.0% | 6.1% | 869 | 12.9% |
| other drivers | 7748 | 0.00 | 0.1% | 1.096 | 1.056 | 6.2% | 0.1% | 1.030 | 2.3% | 0.0% | 6.7% | 945 | 12.9% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (312 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 856 | 9.2 | 3% |
| freeway to the surface gates | 1061 | 12.7 | 4% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 909 | 1% | 5% | 94% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 832 | 2% | 19% | 80% | 0.1 |

## Per-mode results

Offered: 15341 car veh/h; 532 bicycle flows (583/h); 2000 pedestrian flows (1820/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 1636 | 15713 | 388 | |
| Bicycle | 43 | 575 | 291 | |
| Pedestrian | 228 | 1731 | 481 | mean crossing delay 5.6 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 403, bicycle conflicts 470, close passes 367, pedestrian injury-risk index 0.056, bicycle injury-risk index 0.060 (proxy), mean vehicle speed at pedestrian encounters 2.83 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 88 trips (84 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 154 trips (150 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 113 trips (105 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 189 trips (172 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 80% | +33 | 88 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 1% | -20 | 88 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 2% | -4 | 88 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 23% | -4 | 88 |  |
| Colby Street NB | from | freeway | 47% | 83% | +36 | 154 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 4% | -44 | 154 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 18% | -7 | 154 |  |
| Colby Street NB | to | College Avenue | 3% | 0% | -3 | 154 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 6% | -40 | 113 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 3% | -23 | 113 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 3% | -13 | 113 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 80% | +23 | 113 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 11% | -32 | 189 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 22% | -24 | 189 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 31% | +9 | 189 |  |
| Colby Street SB | to | freeway | 45% | 68% | +23 | 189 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 10% | -24 | 189 |  |

Headline shares within tolerance: 0 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 14% | 642 | 14% | 621 |
| onto freeway | Hillegass Avenue | 12% | 12% | 642 | 13% | 621 |
| onto freeway | Martin Street | 10% | 16% | 642 | 16% | 621 |
| onto freeway | Colby Street | 8% | 17% | 642 | 17% | 621 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 16% | 642 | 11% | 621 |
| onto freeway | Benvenue Avenue | 5% | 4% | 642 | 4% | 621 |
| from freeway | College Avenue | 10% | 4% | 992 | 4% | 885 |
| from freeway | Martin Street | 10% | 14% | 992 | 16% | 885 |
| from freeway | Colby Street | 8% | 12% | 992 | 14% | 885 |
| from freeway | Hillegass Avenue | 5% | 7% | 992 | 8% | 885 |
| from freeway | Benvenue Avenue | 3% | 1% | 992 | 1% | 885 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1679 | 52nd Street | Secondary | 4 | 53 | signal | 7.25 | 6.34 | 6.3 | 416 |
| 2061 | Alcatraz Avenue | Tertiary | 1 | 202 | uncontrolled | 6.02 | 4.58 | 4.6 | 390 |
| 1125 | Market Street | Secondary | 4 | 36 | signal | 4.19 | 3.70 | 3.7 | 757 |
| 728 | 55th Street | Tertiary | 1 | 238 | signal | 4.02 | 2.71 | 2.7 | 467 |
| 1768 | Shattuck Avenue | Tertiary | 1 | 89 | signal | 3.94 | 2.97 | 3.0 | 529 |
| 4174 | Adeline Street | Secondary | 3 | 185 | signal | 3.49 | 1.60 | 1.6 | 880 |
| 1623 | Telegraph Avenue | Secondary | 2 | 61 | signal | 3.36 | 2.58 | 2.6 | 694 |
| 498 | Sacramento Street | Tertiary | 3 | 55 | signal | 3.24 | 2.19 | 2.2 | 779 |
| 778 | Martin Luther King Junior Way | Secondary | 4 | 32 | signal | 3.23 | 2.72 | 2.7 | 1158 |
| 2032 | Shattuck Avenue | Tertiary | 1 | 93 | signal | 3.22 | 2.19 | 2.2 | 494 |
| 1594 | 55th Street | Tertiary | 1 | 198 | signal | 3.18 | 2.37 | 2.4 | 259 |
| 2029 | Shattuck Avenue | Tertiary | 1 | 92 | signal | 3.16 | 2.23 | 2.2 | 442 |
| 1066 | Adeline Street | Secondary | 4 | 43 | signal | 3.14 | 2.63 | 2.6 | 601 |
| 2272 | Telegraph Avenue | Secondary | 2 | 104 | signal | 3.02 | 1.65 | 1.6 | 1391 |
| 536 | Ashby Avenue | Primary | 2 | 210 | signal | 2.98 | 1.66 | 1.7 | 802 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 454 | Market Street / Stanford Avenue | signal |  | 4.73 | 0.10 | 75 s: 50/15 |
| 688 | 52nd Street / Shattuck Avenue | signal |  | 4.16 | 0.24 | 75 s: 15/50 |
| 455 | Adeline Street / Alcatraz Avenue | signal |  | 3.49 | 0.01 | 75 s: 21/44 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.27 | 0.04 | 75 s: 28/16/16 |
| 339 | 52nd Street / Martin Luther King Junior Way | signal |  | 3.15 | 0.21 | 75 s: 46/19 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 2.73 | 0.02 | 75 s: 22/43 |
| 863 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.36 | 0.05 | 75 s: 46/19 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.33 | 0.02 | 75 s: 26/39 |
| 1422 | Ashby Avenue / Claremont Avenue | signal |  | 2.19 | 0.03 | 75 s: 47/18 |
| 1095 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.18 | 0.00 | 75 s: 22/23/15 |
| 340 | 55th Street / Martin Luther King Junior Way | signal |  | 2.16 | 0.00 | 75 s: 29/36 |
| 509 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.08 | 0.05 | 75 s: 31/34 |
| 959 | Ashby Avenue / Telegraph Avenue | signal |  | 2.03 | 0.00 | 75 s: 21/44 |
| 710 | Aileen Street / Telegraph Avenue | signal |  | 2.00 | 0.00 | 75 s: 28/37 |
| 592 | Adeline Street / Ashby Avenue | signal |  | 1.96 | 0.00 | 75 s: 36/29 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 454: 50 s: Stanford Avenue 1L [958], Stanford Avenue 3L [1072]; 15 s: Market Street 4L [1125], Market Street 3L [1128]
- node 688: 15 s: 52nd Street 4L [1679], 52nd Street 4L [1683]; 50 s: Shattuck Avenue 2L [1670], Shattuck Avenue 2L [1722]
- node 455: 21 s: Adeline Street 4L [1066], Adeline Street 4L [1068]; 44 s: Alcatraz Avenue 2L [1065], Alcatraz Avenue 2L [1150]
- node 30: 28 s: Adeline Street 1L [764], Adeline Street 1L [1047]; 16 s: Market Street 2L [772], Market Street 2L [1130]; 16 s: 57th Street 1L [44], 57th Street 1L [1168]
- node 339: 46 s: Martin Luther King Junior Way 4L [721], Martin Luther King Junior Way 4L [778]; 19 s: 52nd Street 2L [775], 52nd Street 1L [777]

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 758 | 815 |
| Telegraph | S | 10 | 725 | 740 |
| College | N | 3 | 144 | 145 |
| College | S | 3 | 349 | 353 |
| Claremont | N | 6 | 450 | 761 |
| Claremont | S | 7 | 511 | 822 |
| Alcatraz | E | 6 | 348 | 362 |
| Alcatraz | W | 6 | 241 | 271 |
| Hillegass | N | 4 | 67 | 70 |
| Hillegass | S | 4 | 89 | 108 |
| Colby | N | 7 | 92 | 122 |
| Colby | S | 7 | 103 | 120 |
| Martin | E | 2 | 108 | 108 |
| Martin | W | 2 | 160 | 160 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 610 | Grove Shafter Freeway | 3026 |
| 955 | Telegraph Avenue / Ward Street | 1499 |
| 1688 | Warren Freeway | 945 |
| 266 | Ashby Avenue | 781 |
| 183 | San Pablo Avenue | 719 |
| 1774 | Claremont Avenue | 346 |
| 771 | Telegraph Avenue | 340 |
| 104 | San Pablo Avenue | 336 |
| 283 | Market Street | 326 |
| 986 | Broadway | 270 |
