# Calibration report: rockridge midday scale 1 seed 1 (60 min)

Offered demand 14884 veh/h x scale 1 = 14884 veh/h. Run took 18.2 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (0 of 14871) | pass |
| Arterial mean speed (run) | > 4 m/s | 10.41 m/s (last 15 min 10.40) | pass |

Overall: **STABLE**. Mean trip delay 77 s, mean trip time 385 s, completed 13269, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1156 | 0 | 162 | 0 | 11.28 |
| 10 | 1580 | 1 | 998 | 0 | 10.52 |
| 15 | 1756 | 0 | 2160 | 0 | 10.46 |
| 20 | 1597 | 0 | 3515 | 0 | 10.35 |
| 25 | 1655 | 0 | 4753 | 0 | 10.29 |
| 30 | 1607 | 0 | 5991 | 0 | 10.25 |
| 35 | 1544 | 0 | 7252 | 0 | 10.53 |
| 40 | 1537 | 1 | 8465 | 0 | 10.48 |
| 45 | 1654 | 0 | 9580 | 0 | 10.21 |
| 50 | 1674 | 0 | 10816 | 0 | 10.60 |
| 55 | 1630 | 0 | 12036 | 0 | 10.41 |
| 60 | 1602 | 0 | 13269 | 0 | 10.18 |
## Per-mode results

Offered: 14884 car veh/h; 532 bicycle flows (583/h); 2000 pedestrian flows (1820/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 1602 | 13269 | 385 | |
| Bicycle | 46 | 542 | 292 | |
| Pedestrian | 209 | 1495 | 484 | mean crossing delay 5.0 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 325, bicycle conflicts 532, close passes 219, pedestrian injury-risk index 0.048, bicycle injury-risk index 0.051 (proxy), mean vehicle speed at pedestrian encounters 2.67 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 56 trips (53 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 58 trips (50 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 111 trips (103 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 97 trips (90 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 62% | +16 | 56 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 4% | -17 | 56 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 4% | -2 | 56 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 25% | -2 | 56 |  |
| Colby Street NB | from | freeway | 47% | 28% | -19 | 58 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 12% | -36 | 58 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 41% | +16 | 58 |  |
| Colby Street NB | to | College Avenue | 3% | 9% | +6 | 58 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 25% | -21 | 111 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 13% | -13 | 111 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 30% | +14 | 111 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 49% | -8 | 111 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 15% | -28 | 97 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 29% | -17 | 97 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 55% | +33 | 97 |  |
| Colby Street SB | to | freeway | 45% | 20% | -25 | 97 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 65% | +31 | 97 |  |

Headline shares within tolerance: 1 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 14% | 485 | 14% | 465 |
| onto freeway | Hillegass Avenue | 12% | 13% | 485 | 14% | 465 |
| onto freeway | Martin Street | 10% | 8% | 485 | 8% | 465 |
| onto freeway | Colby Street | 8% | 6% | 485 | 6% | 465 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 12% | 485 | 11% | 465 |
| onto freeway | Benvenue Avenue | 5% | 5% | 485 | 5% | 465 |
| from freeway | College Avenue | 10% | 8% | 743 | 8% | 568 |
| from freeway | Martin Street | 10% | 13% | 743 | 18% | 568 |
| from freeway | Colby Street | 8% | 6% | 743 | 8% | 568 |
| from freeway | Hillegass Avenue | 5% | 5% | 743 | 7% | 568 |
| from freeway | Benvenue Avenue | 3% | 3% | 743 | 3% | 568 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1679 | 52nd Street | Secondary | 4 | 53 | signal | 7.63 | 6.37 | 6.4 | 563 |
| 4436 | Ashby Avenue | Primary | 2 | 96 | signal | 4.07 | 3.39 | 3.4 | 278 |
| 1768 | Shattuck Avenue | Tertiary | 1 | 89 | signal | 3.23 | 2.11 | 2.1 | 890 |
| 2032 | Shattuck Avenue | Tertiary | 1 | 93 | signal | 3.06 | 1.74 | 1.7 | 854 |
| 728 | 55th Street | Tertiary | 1 | 238 | signal | 2.91 | 2.22 | 2.2 | 343 |
| 1139 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 2.88 | 2.33 | 2.3 | 277 |
| 1054 | Sacramento Street | Tertiary | 3 | 40 | signal | 2.38 | 1.68 | 1.7 | 670 |
| 2029 | Shattuck Avenue | Tertiary | 1 | 92 | signal | 2.32 | 1.40 | 1.4 | 641 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 2.11 | 1.46 | 1.5 | 547 |
| 1677 | Shattuck Avenue | Tertiary | 1 | 101 | signal | 2.09 | 1.24 | 1.2 | 649 |
| 1770 | Shattuck Avenue | Tertiary | 1 | 86 | two_way_stop | 2.05 | 0.83 | 0.8 | 910 |
| 2064 | Telegraph Avenue | Secondary | 3 | 57 | signal | 2.02 | 1.40 | 1.4 | 632 |
| 4170 | Stanford Avenue | Secondary | 1 | 89 | signal | 1.98 | 1.34 | 1.3 | 330 |
| 2272 | Telegraph Avenue | Secondary | 2 | 104 | signal | 1.96 | 1.12 | 1.1 | 1049 |
| 3478 | Claremont Avenue | Secondary | 3 | 43 | signal | 1.92 | 1.51 | 1.5 | 385 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 688 | 52nd Street / Shattuck Avenue | signal |  | 3.21 | 0.22 | 75 s: 22/43 |
| 509 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.22 | 0.02 | 80 s: 19/51 |
| 1422 | Ashby Avenue / Claremont Avenue | signal |  | 2.17 | 0.03 | 75 s: 34/31 |
| 1095 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.03 | 0.00 | 75 s: 27/18/15 |
| 863 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.01 | 0.01 | 75 s: 36/29 |
| 956 | Ashby Avenue / Shattuck Avenue | signal |  | 1.95 | 0.01 | 75 s: 35/30 |
| 959 | Ashby Avenue / Telegraph Avenue | signal |  | 1.75 | 0.00 | 75 s: 27/38 |
| 1389 | Ashby Avenue / Domingo Avenue / Tunnel Road | signal |  | 1.74 | 0.07 | 75 s: 30/15/15 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 1.66 | 0.01 | 75 s: 40/25 |
| 454 | Market Street / Stanford Avenue | signal |  | 1.62 | 0.01 | 75 s: 42/23 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 1.61 | 0.00 | 75 s: 33/32 |
| 346 | 55th Street / Shattuck Avenue | signal |  | 1.55 | 0.01 | 85 s: 25/50 |
| 455 | Adeline Street / Alcatraz Avenue | signal |  | 1.41 | 0.01 | 75 s: 18/47 |
| 1236 | Ashby Avenue / College Avenue | signal |  | 1.39 | 0.00 | 75 s: 40/25 |
| 592 | Adeline Street / Ashby Avenue | signal |  | 1.34 | 0.00 | 75 s: 39/26 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 688: 22 s: 52nd Street 4L [1679], 52nd Street 4L [1683]; 43 s: Shattuck Avenue 2L [1670], Shattuck Avenue 2L [1722]
- node 509: 19 s: Alcatraz Avenue 1L [1139], Alcatraz Avenue 2L [2105]; 51 s: Shattuck Avenue 1L [2029], Shattuck Avenue 1L [2032]
- node 1422: 34 s: Ashby Avenue 1L [3426], Ashby Avenue 2L [3457]; 31 s: Claremont Avenue 3L [3478], Claremont Avenue 2L [4366]
- node 1095: 27 s: Claremont Avenue 2L [2787], Claremont Avenue 2L [2829]; 18 s: College Avenue 2L [2792], College Avenue 2L [2850]; 15 s: 62nd Street 1L [2651]
- node 863: 36 s: Telegraph Avenue 3L [2063], Telegraph Avenue 3L [2064]; 29 s: Alcatraz Avenue 2L [2057], Alcatraz Avenue 2L [2086]

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 558 | 602 |
| Telegraph | S | 10 | 581 | 614 |
| College | N | 3 | 175 | 175 |
| College | S | 3 | 203 | 205 |
| Claremont | N | 6 | 442 | 607 |
| Claremont | S | 7 | 382 | 560 |
| Alcatraz | E | 6 | 359 | 374 |
| Alcatraz | W | 6 | 289 | 314 |
| Hillegass | N | 4 | 36 | 50 |
| Hillegass | S | 4 | 78 | 84 |
| Colby | N | 7 | 23 | 28 |
| Colby | S | 7 | 56 | 71 |
| Martin | E | 2 | 56 | 56 |
| Martin | W | 2 | 114 | 114 |

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
