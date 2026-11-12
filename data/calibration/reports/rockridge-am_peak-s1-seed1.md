# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 22121 veh/h x scale 1 = 22121 veh/h. Run took 28.8 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 49 | FAIL |
| Backlog / spawned | < 2% | 2.9% (627 of 21627) | FAIL |
| Arterial mean speed (run) | > 4 m/s | 5.85 m/s (last 15 min 5.00) | pass |

Overall: **NOT STABLE**. Mean trip delay 427 s, mean trip time 845 s, completed 14496, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1796 | 0 | 75 | 0 | 9.91 |
| 10 | 3054 | 3 | 655 | 0 | 7.57 |
| 15 | 3877 | 48 | 1645 | 1 | 6.85 |
| 20 | 4504 | 5 | 2919 | 1 | 6.94 |
| 25 | 4974 | 52 | 4261 | 7 | 6.32 |
| 30 | 5227 | 173 | 5718 | 11 | 5.79 |
| 35 | 5581 | 227 | 7138 | 19 | 5.74 |
| 40 | 5956 | 358 | 8578 | 21 | 5.74 |
| 45 | 6322 | 401 | 9985 | 24 | 5.55 |
| 50 | 6749 | 414 | 11391 | 28 | 5.20 |
| 55 | 6848 | 614 | 12924 | 38 | 4.79 |
| 60 | 7082 | 627 | 14496 | 49 | 5.00 |
## Per-mode results

Offered: 22121 car veh/h; 1500 bicycle flows (1056/h); 2000 pedestrian flows (1541/h); 0 bus routes running (0 dropped as unlinked, 0 runs blocked). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 7082 | 14496 | 845 | |
| Bus | 0 | 0 | 0 | mean speed 0.00 m/s |
| Bicycle | 103 | 934 | 368 | |
| Pedestrian | 223 | 1245 | 486 | mean crossing delay 6.7 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 294, bicycle conflicts 1377, close passes 997, pedestrian injury-risk index 0.035, bicycle injury-risk index 0.040 (proxy), mean vehicle speed at pedestrian encounters 2.04 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 264 trips (187 completed)
- Colby Street NB: 9 links (path Claremont Avenue -> Alcatraz Avenue (674 m)), 377 trips (261 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 406 trips (309 completed)
- Colby Street SB: 9 links (path Alcatraz Avenue -> Claremont Avenue (674 m)), 624 trips (446 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 64% | +17 | 264 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 2% | -19 | 264 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 12% | +6 | 264 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 39% | +12 | 264 |  |
| Colby Street NB | from | freeway | 47% | 49% | +2 | 377 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 32% | -16 | 377 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 35% | +10 | 377 |  |
| Colby Street NB | to | College Avenue | 3% | 16% | +13 | 377 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 15% | -31 | 406 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 4% | -22 | 406 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 8% | -8 | 406 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 68% | +11 | 406 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 40% | -3 | 624 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 27% | -19 | 624 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 50% | +28 | 624 |  |
| Colby Street SB | to | freeway | 45% | 40% | -5 | 624 | within |
| Colby Street SB | to | Forest Street | 34% | 48% | +14 | 624 |  |

Headline shares within tolerance: 2 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only; modeled shares are over all trips on the ramps (so modeled is an upper bound for streets that serve both sides).

| Direction | Via | Observed | Modeled | n ramp trips |
| --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 17% | 850 |
| onto freeway | Hillegass Avenue | 12% | 26% | 850 |
| onto freeway | Martin Street | 10% | 12% | 850 |
| onto freeway | Colby Street | 8% | 17% | 850 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 55% | 850 |
| onto freeway | Benvenue Avenue | 5% | 2% | 850 |
| from freeway | College Avenue | 10% | 10% | 1122 |
| from freeway | Martin Street | 10% | 21% | 1122 |
| from freeway | Colby Street | 8% | 14% | 1122 |
| from freeway | Hillegass Avenue | 5% | 13% | 1122 |
| from freeway | Benvenue Avenue | 3% | 2% | 1122 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4221 | (unnamed) | Motorway | 2 | 513 | uncontrolled | 90.13 | 66.58 | 66.6 | 821 |
| 3785 | Tunnel Road | Tertiary | 1 | 1310 | two_way_stop | 38.02 | 32.72 | 32.7 | 130 |
| 4291 | Grove Shafter Freeway | Motorway | 4 | 645 | uncontrolled | 33.60 | 24.58 | 24.6 | 1014 |
| 4220 | 45th Street | Residential | 1 | 363 | uncontrolled | 25.25 | 17.38 | 17.4 | 418 |
| 1982 | (unnamed) | Motorway | 2 | 188 | signal | 21.27 | 15.56 | 15.6 | 906 |
| 4195 | Martin Luther King Junior Way | Secondary | 3 | 147 | uncontrolled | 20.81 | 16.64 | 16.6 | 928 |
| 734 | 55th Street | Tertiary | 1 | 238 | signal | 18.65 | 13.39 | 13.4 | 738 |
| 4343 | (unnamed) | Motorway | 1 | 449 | uncontrolled | 16.24 | 2.67 | 2.7 | 568 |
| 1635 | Telegraph Avenue | Secondary | 2 | 94 | signal | 15.81 | 13.79 | 13.8 | 414 |
| 4228 | (unnamed) | Motorway | 3 | 72 | uncontrolled | 15.79 | 9.19 | 9.2 | 1826 |
| 744 | 56th Street | Residential | 1 | 243 | two_way_stop | 15.48 | 14.71 | 14.7 | 76 |
| 1690 | 52nd Street | Secondary | 4 | 53 | signal | 14.96 | 12.63 | 12.6 | 943 |
| 1145 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 14.32 | 10.24 | 10.2 | 570 |
| 1697 | 52nd Street | Tertiary | 2 | 111 | uncontrolled | 13.60 | 12.96 | 13.0 | 121 |
| 1601 | (unnamed) | Motorway | 2 | 112 | signal | 13.51 | 8.83 | 8.8 | 1192 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 694 | 52nd Street / Shattuck Avenue | signal |  | 5.20 | 0.66 | 75 s: 41/24 |
| 458 | Market Street / Stanford Avenue | signal |  | 4.82 | 0.21 | 75 s: 50/15 |
| 343 | 55th Street / Martin Luther King Junior Way | signal |  | 4.60 | 0.64 | 75 s: 23/42 |
| 459 | Adeline Street / Alcatraz Avenue | signal |  | 4.54 | 0.44 | 75 s: 38/27 |
| 1107 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 4.34 | 0.10 | 75 s: 22/22/16 |
| 874 | Alcatraz Avenue / Telegraph Avenue | signal |  | 4.08 | 0.21 | 75 s: 26/39 |
| 342 | 52nd Street / Martin Luther King Junior Way | signal |  | 3.64 | 1.64 | 60 s: 60 |
| 687 | 55th Street / Telegraph Avenue | signal |  | 3.52 | 0.38 | 75 s: 15/50 |
| 627 | 52nd Street / Claremont Avenue / Telegraph Avenue | signal |  | 3.40 | 0.19 | 80 s: 15/15/35 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.27 | 0.06 | 75 s: 50/15 |
| 1438 | Ashby Avenue / Claremont Avenue | signal |  | 3.24 | 0.13 | 75 s: 50/15 |
| 967 | Ashby Avenue / Shattuck Avenue | signal |  | 3.24 | 0.01 | 75 s: 50/15 |
| 513 | Alcatraz Avenue / Shattuck Avenue | signal |  | 3.12 | 0.07 | 95 s: 48/37 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.07 | 0.04 | 75 s: 36/29 |
| 1405 | Ashby Avenue / Domingo Avenue / Tunnel Road | signal |  | 3.05 | 0.13 | 75 s: 27/16/17 |

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 1634 | Telegraph Avenue | Aileen Street / Telegraph Avenue | signal | 10 | 23.8 |
| 2064 | Telegraph Avenue | Telegraph Avenue | uncontrolled | 5 | 27.0 |
| 793 | Martin Luther King Junior Way | Martin Luther King Junior Way | uncontrolled | 5 | 30.8 |
| 784 | Martin Luther King Junior Way | 52nd Street / Martin Luther King Junior Way | signal | 2 | 22.6 |
| 727 | Martin Luther King Junior Way | 52nd Street / Martin Luther King Junior Way | signal | 2 | 22.8 |
| 595 | Martin Luther King Junior Way | 45th Street / Martin Luther King Junior Way | signal | 2 | 43.8 |
| 957 | 60th Street | 60th Street / Market Street | two_way_stop | 2 | 54.8 |
| 897 | 65th Street | 65th Street / Shattuck Avenue | two_way_stop | 1 | 13.6 |
| 4195 | Martin Luther King Junior Way | Martin Luther King Junior Way | uncontrolled | 1 | 24.1 |
| 787 | Martin Luther King Junior Way | 55th Street / Martin Luther King Junior Way | signal | 1 | 31.2 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 1769 | (unnamed) | 530 | 2476 |
| 1793 | Claremont Avenue | 94 | 628 |
| 674 | Aileen Street / Carberry Avenue | 2 | 19 |
| 140 | 63rd Street / Baker Street | 1 | 10 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 654 | 749 |
| Telegraph | S | 10 | 562 | 677 |
| College | N | 3 | 434 | 436 |
| College | S | 3 | 620 | 628 |
| Claremont | N | 6 | 576 | 853 |
| Claremont | S | 7 | 882 | 1300 |
| Alcatraz | E | 6 | 527 | 576 |
| Alcatraz | W | 6 | 679 | 754 |
| Hillegass | N | 4 | 113 | 224 |
| Hillegass | S | 4 | 239 | 248 |
| Colby | N | 7 | 157 | 205 |
| Colby | S | 7 | 346 | 376 |
| Martin | E | 2 | 106 | 106 |
| Martin | W | 2 | 284 | 284 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 1769 | (unnamed) | 2476 |
| 269 | Ashby Avenue | 1237 |
| 966 | Telegraph Avenue / Ward Street | 1102 |
| 617 | (unnamed) | 796 |
| 615 | Grove Shafter Freeway | 796 |
| 104 | San Pablo Avenue | 698 |
| 183 | San Pablo Avenue | 648 |
| 1793 | Claremont Avenue | 628 |
| 1580 | Tunnel Road | 601 |
| 1751 | Tunnel Road | 601 |
