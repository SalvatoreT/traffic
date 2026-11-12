# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 27393 veh/h x scale 1 = 27393 veh/h. Run took 51.5 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 212 | FAIL |
| Backlog / spawned | < 2% | 6.8% (1752 of 25822) | FAIL |
| Arterial mean speed (run) | > 4 m/s | 4.10 m/s (last 15 min 2.75) | pass |

Overall: **NOT STABLE**. Mean trip delay 579 s, mean trip time 998 s, completed 12519, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2217 | 10 | 97 | 0 | 9.35 |
| 10 | 3956 | 8 | 654 | 0 | 6.89 |
| 15 | 5205 | 91 | 1621 | 0 | 5.88 |
| 20 | 6160 | 138 | 2903 | 4 | 5.85 |
| 25 | 6902 | 273 | 4304 | 13 | 4.78 |
| 30 | 7616 | 462 | 5688 | 25 | 4.84 |
| 35 | 8655 | 641 | 6803 | 38 | 4.37 |
| 40 | 9564 | 862 | 7918 | 54 | 4.02 |
| 45 | 10613 | 989 | 9081 | 71 | 3.68 |
| 50 | 11538 | 1171 | 10239 | 106 | 3.03 |
| 55 | 12260 | 1493 | 11444 | 159 | 2.61 |
| 60 | 13091 | 1752 | 12519 | 212 | 2.61 |
## Per-mode results

Offered: 27393 car veh/h; 1500 bicycle flows (1148/h); 2000 pedestrian flows (1991/h); 0 bus routes running (0 dropped as unlinked, 0 runs blocked). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 13091 | 12519 | 998 | |
| Bus | 0 | 0 | 0 | mean speed 0.00 m/s |
| Bicycle | 150 | 981 | 390 | |
| Pedestrian | 283 | 1614 | 493 | mean crossing delay 8.7 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 348, bicycle conflicts 1530, close passes 1040, pedestrian injury-risk index 0.031, bicycle injury-risk index 0.030 (proxy), mean vehicle speed at pedestrian encounters 1.87 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 353 trips (147 completed)
- Colby Street NB: 9 links (path Claremont Avenue -> Alcatraz Avenue (674 m)), 427 trips (194 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 437 trips (256 completed)
- Colby Street SB: 9 links (path Alcatraz Avenue -> Claremont Avenue (674 m)), 648 trips (387 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 62% | +15 | 353 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 7% | -26 | 353 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 23% | +17 | 353 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 44% | +17 | 353 |  |
| Colby Street NB | from | freeway | 47% | 45% | -2 | 427 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 44% | -4 | 427 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 44% | +19 | 427 |  |
| Colby Street NB | to | College Avenue | 3% | 14% | +11 | 427 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 21% | -25 | 437 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 5% | -21 | 437 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 14% | -2 | 437 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 56% | -12 | 437 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 45% | +2 | 648 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 26% | -20 | 648 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 53% | +31 | 648 |  |
| Colby Street SB | to | freeway | 45% | 38% | -7 | 648 | within |
| Colby Street SB | to | Forest Street | 34% | 51% | +17 | 648 |  |

Headline shares within tolerance: 2 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only; modeled shares are over all trips on the ramps (so modeled is an upper bound for streets that serve both sides).

| Direction | Via | Observed | Modeled | n ramp trips |
| --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 15% | 707 |
| onto freeway | Hillegass Avenue | 12% | 17% | 707 |
| onto freeway | Martin Street | 10% | 14% | 707 |
| onto freeway | Colby Street | 8% | 12% | 707 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 55% | 707 |
| onto freeway | Benvenue Avenue | 5% | 2% | 707 |
| from freeway | College Avenue | 10% | 11% | 1062 |
| from freeway | Martin Street | 10% | 20% | 1062 |
| from freeway | Colby Street | 8% | 16% | 1062 |
| from freeway | Hillegass Avenue | 5% | 19% | 1062 |
| from freeway | Benvenue Avenue | 3% | 4% | 1062 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4221 | (unnamed) | Motorway | 2 | 513 | uncontrolled | 83.66 | 68.34 | 68.3 | 553 |
| 4238 | Grove Shafter Freeway | Motorway | 4 | 834 | uncontrolled | 77.14 | 53.31 | 53.3 | 1768 |
| 4291 | Grove Shafter Freeway | Motorway | 4 | 645 | uncontrolled | 59.73 | 43.49 | 43.5 | 990 |
| 3785 | Tunnel Road | Tertiary | 1 | 1310 | two_way_stop | 38.59 | 33.75 | 33.7 | 124 |
| 4353 | Grove Shafter Freeway | Motorway | 4 | 416 | uncontrolled | 36.02 | 31.27 | 31.3 | 1326 |
| 4288 | Grove Shafter Freeway | Motorway | 4 | 835 | uncontrolled | 35.96 | 23.30 | 23.3 | 1709 |
| 4432 | Warren Freeway | Motorway | 3 | 384 | uncontrolled | 33.57 | 19.75 | 19.7 | 1345 |
| 4220 | 45th Street | Residential | 1 | 363 | uncontrolled | 31.75 | 24.15 | 24.2 | 347 |
| 4343 | (unnamed) | Motorway | 1 | 449 | uncontrolled | 25.75 | 8.50 | 8.5 | 595 |
| 1982 | (unnamed) | Motorway | 2 | 188 | signal | 23.86 | 17.92 | 17.9 | 961 |
| 4195 | Martin Luther King Junior Way | Secondary | 3 | 147 | uncontrolled | 23.48 | 19.19 | 19.2 | 929 |
| 4077 | Broadway Terrace | Tertiary | 2 | 154 | uncontrolled | 21.35 | 17.93 | 17.9 | 499 |
| 734 | 55th Street | Tertiary | 1 | 238 | signal | 19.23 | 14.51 | 14.5 | 632 |
| 2060 | Claremont Avenue | Secondary | 2 | 194 | signal | 19.19 | 13.11 | 13.1 | 787 |
| 2854 | Claremont Avenue | Secondary | 2 | 213 | signal | 18.73 | 16.46 | 16.5 | 362 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 694 | 52nd Street / Shattuck Avenue | signal |  | 6.31 | 1.62 | 75 s: 39/26 |
| 459 | Adeline Street / Alcatraz Avenue | signal |  | 5.72 | 0.77 | 75 s: 25/40 |
| 458 | Market Street / Stanford Avenue | signal |  | 5.45 | 0.25 | 75 s: 50/15 |
| 343 | 55th Street / Martin Luther King Junior Way | signal |  | 5.41 | 0.78 | 75 s: 15/50 |
| 1107 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 5.03 | 0.37 | 90 s: 28/15/32 |
| 874 | Alcatraz Avenue / Telegraph Avenue | signal |  | 4.55 | 0.34 | 75 s: 20/45 |
| 627 | 52nd Street / Claremont Avenue / Telegraph Avenue | signal |  | 4.30 | 0.33 | 75 s: 15/15/30 |
| 342 | 52nd Street / Martin Luther King Junior Way | signal |  | 4.25 | 2.65 | 60 s: 60 |
| 687 | 55th Street / Telegraph Avenue | signal |  | 4.12 | 0.42 | 75 s: 15/50 |
| 289 | 45th Street / Martin Luther King Junior Way | signal |  | 3.92 | 0.70 | 75 s: 15/50 |
| 967 | Ashby Avenue / Shattuck Avenue | signal |  | 3.91 | 0.12 | 75 s: 45/20 |
| 1438 | Ashby Avenue / Claremont Avenue | signal |  | 3.63 | 0.20 | 75 s: 50/15 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.62 | 0.08 | 75 s: 50/15 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.59 | 0.04 | 75 s: 33/32 |
| 1405 | Ashby Avenue / Domingo Avenue / Tunnel Road | signal |  | 3.58 | 0.18 | 75 s: 15/16/29 |

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 1634 | Telegraph Avenue | Aileen Street / Telegraph Avenue | signal | 16 | 16.3 |
| 595 | Martin Luther King Junior Way | 45th Street / Martin Luther King Junior Way | signal | 9 | 20.1 |
| 758 | Martin Luther King Junior Way | Martin Luther King Junior Way | uncontrolled | 7 | 33.1 |
| 1678 | Martin Luther King Junior Way | Martin Luther King Junior Way | uncontrolled | 5 | 20.5 |
| 857 | Martin Luther King Junior Way | 55th Street / Martin Luther King Junior Way | signal | 5 | 27.4 |
| 787 | Martin Luther King Junior Way | 55th Street / Martin Luther King Junior Way | signal | 5 | 27.4 |
| 793 | Martin Luther King Junior Way | Martin Luther King Junior Way | uncontrolled | 5 | 29.3 |
| 2064 | Telegraph Avenue | Telegraph Avenue | uncontrolled | 5 | 42.1 |
| 592 | Martin Luther King Junior Way | 45th Street / Martin Luther King Junior Way | signal | 3 | 20.1 |
| 2061 | Claremont Avenue | Claremont Avenue | uncontrolled | 3 | 26.3 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 1769 | (unnamed) | 1251 | 2921 |
| 74 | 43rd Street / San Pablo Avenue | 147 | 375 |
| 1793 | Claremont Avenue | 101 | 575 |
| 104 | San Pablo Avenue | 60 | 844 |
| 299 | Adeline Street | 38 | 321 |
| 89 | Powell Street | 29 | 348 |
| 1687 | Duncan Way | 26 | 499 |
| 286 | Market Street | 21 | 539 |
| 1430 | Claremont Boulevard | 20 | 497 |
| 1676 | Broadway Terrace | 11 | 499 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 625 | 715 |
| Telegraph | S | 10 | 586 | 689 |
| College | N | 3 | 419 | 426 |
| College | S | 3 | 469 | 475 |
| Claremont | N | 6 | 643 | 872 |
| Claremont | S | 7 | 799 | 1134 |
| Alcatraz | E | 6 | 506 | 617 |
| Alcatraz | W | 6 | 686 | 746 |
| Hillegass | N | 4 | 157 | 299 |
| Hillegass | S | 4 | 278 | 324 |
| Colby | N | 7 | 178 | 230 |
| Colby | S | 7 | 326 | 380 |
| Martin | E | 2 | 104 | 104 |
| Martin | W | 2 | 250 | 250 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 1769 | (unnamed) | 2921 |
| 269 | Ashby Avenue | 1132 |
| 966 | Telegraph Avenue / Ward Street | 1052 |
| 615 | Grove Shafter Freeway | 939 |
| 617 | (unnamed) | 939 |
| 104 | San Pablo Avenue | 844 |
| 183 | San Pablo Avenue | 769 |
| 1753 | Grove Shafter Freeway | 707 |
| 1704 | Warren Freeway | 654 |
| 1743 | Grove Shafter Freeway | 596 |
