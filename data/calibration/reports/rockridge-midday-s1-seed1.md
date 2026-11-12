# Calibration report: rockridge midday scale 1 seed 1 (60 min)

Offered demand 15401 veh/h x scale 1 = 15401 veh/h. Run took 52.7 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (1 of 15521) | pass |
| Arterial mean speed (run) | > 4 m/s | 10.32 m/s (last 15 min 10.33) | pass |

Overall: **STABLE**. Mean trip delay 79 s, mean trip time 387 s, completed 13868, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1158 | 0 | 170 | 0 | 11.66 |
| 10 | 1638 | 0 | 1006 | 0 | 10.59 |
| 15 | 1801 | 0 | 2191 | 0 | 10.19 |
| 20 | 1795 | 0 | 3477 | 0 | 10.03 |
| 25 | 1717 | 1 | 4906 | 0 | 10.20 |
| 30 | 1712 | 1 | 6177 | 0 | 10.06 |
| 35 | 1709 | 0 | 7499 | 0 | 10.59 |
| 40 | 1703 | 1 | 8789 | 0 | 10.39 |
| 45 | 1704 | 2 | 10048 | 0 | 10.09 |
| 50 | 1696 | 1 | 11319 | 0 | 10.17 |
| 55 | 1688 | 0 | 12606 | 0 | 10.28 |
| 60 | 1653 | 1 | 13868 | 0 | 10.52 |
## Per-mode results

Offered: 15401 car veh/h; 528 bicycle flows (580/h); 2000 pedestrian flows (1820/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 1653 | 13868 | 387 | |
| Bicycle | 49 | 542 | 301 | |
| Pedestrian | 226 | 1505 | 481 | mean crossing delay 5.2 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 336, bicycle conflicts 612, close passes 254, pedestrian injury-risk index 0.048, bicycle injury-risk index 0.050 (proxy), mean vehicle speed at pedestrian encounters 2.66 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 75 trips (70 completed)
- Colby Street NB: 9 links (path Claremont Avenue -> Alcatraz Avenue (674 m)), 51 trips (48 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 82 trips (74 completed)
- Colby Street SB: 9 links (path Alcatraz Avenue -> Claremont Avenue (674 m)), 89 trips (79 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 61% | +14 | 75 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 9% | -12 | 75 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 5% | -1 | 75 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 27% | -0 | 75 |  |
| Colby Street NB | from | freeway | 47% | 49% | +2 | 51 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 14% | -34 | 51 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 18% | -7 | 51 |  |
| Colby Street NB | to | College Avenue | 3% | 8% | +5 | 51 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 29% | -17 | 82 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 12% | -14 | 82 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 18% | +2 | 82 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 55% | -2 | 82 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 22% | -21 | 89 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 37% | -9 | 89 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 39% | +17 | 89 |  |
| Colby Street SB | to | freeway | 45% | 25% | -20 | 89 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 60% | +26 | 89 |  |

Headline shares within tolerance: 2 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 14% | 521 | 14% | 489 |
| onto freeway | Hillegass Avenue | 12% | 9% | 521 | 10% | 489 |
| onto freeway | Martin Street | 10% | 13% | 521 | 13% | 489 |
| onto freeway | Colby Street | 8% | 5% | 521 | 6% | 489 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 15% | 521 | 15% | 489 |
| onto freeway | Benvenue Avenue | 5% | 4% | 521 | 4% | 489 |
| from freeway | College Avenue | 10% | 7% | 831 | 6% | 668 |
| from freeway | Martin Street | 10% | 15% | 831 | 19% | 668 |
| from freeway | Colby Street | 8% | 6% | 831 | 8% | 668 |
| from freeway | Hillegass Avenue | 5% | 5% | 831 | 7% | 668 |
| from freeway | Benvenue Avenue | 3% | 2% | 831 | 3% | 668 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1689 | 52nd Street | Secondary | 4 | 53 | signal | 6.98 | 5.82 | 5.8 | 548 |
| 4464 | Ashby Avenue | Primary | 2 | 96 | signal | 5.01 | 4.15 | 4.1 | 274 |
| 2046 | Shattuck Avenue | Tertiary | 1 | 93 | signal | 3.97 | 2.71 | 2.7 | 656 |
| 1145 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 3.19 | 2.16 | 2.2 | 505 |
| 734 | 55th Street | Tertiary | 1 | 238 | signal | 2.76 | 2.02 | 2.0 | 350 |
| 2290 | Telegraph Avenue | Secondary | 2 | 104 | signal | 2.72 | 1.44 | 1.4 | 1262 |
| 1778 | Shattuck Avenue | Tertiary | 1 | 89 | signal | 2.63 | 1.61 | 1.6 | 838 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 2.53 | 1.78 | 1.8 | 616 |
| 2043 | Shattuck Avenue | Tertiary | 1 | 92 | signal | 2.52 | 1.68 | 1.7 | 552 |
| 265 | 59th Street | Residential | 1 | 150 | two_way_stop | 2.26 | 1.90 | 1.9 | 101 |
| 2078 | Telegraph Avenue | Secondary | 3 | 57 | signal | 2.06 | 1.31 | 1.3 | 751 |
| 108 | Stanford Avenue | Secondary | 3 | 61 | signal | 2.06 | 1.48 | 1.5 | 592 |
| 3506 | Claremont Avenue | Secondary | 3 | 43 | signal | 2.04 | 1.68 | 1.7 | 338 |
| 1060 | Sacramento Street | Tertiary | 3 | 40 | signal | 2.01 | 1.27 | 1.3 | 648 |
| 1687 | Shattuck Avenue | Tertiary | 1 | 101 | signal | 2.00 | 1.21 | 1.2 | 620 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 693 | 52nd Street / Shattuck Avenue | signal |  | 3.23 | 0.19 | 75 s: 17/48 |
| 872 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.28 | 0.02 | 75 s: 39/26 |
| 965 | Ashby Avenue / Shattuck Avenue | signal |  | 2.24 | 0.01 | 75 s: 35/30 |
| 513 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.20 | 0.02 | 75 s: 32/33 |
| 1436 | Ashby Avenue / Claremont Avenue | signal |  | 2.13 | 0.01 | 75 s: 34/31 |
| 968 | Ashby Avenue / Telegraph Avenue | signal |  | 2.01 | 0.00 | 75 s: 18/47 |
| 459 | Adeline Street / Alcatraz Avenue | signal |  | 1.93 | 0.05 | 75 s: 28/37 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 1.88 | 0.01 | 75 s: 37/28 |
| 458 | Market Street / Stanford Avenue | signal |  | 1.68 | 0.02 | 75 s: 50/15 |
| 1403 | Ashby Avenue / Domingo Avenue / Tunnel Road | signal |  | 1.66 | 0.10 | 75 s: 28/15/17 |
| 1249 | Ashby Avenue / College Avenue | signal |  | 1.61 | 0.01 | 75 s: 32/33 |
| 1105 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 1.60 | 0.00 | 75 s: 29/16/15 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 1.57 | 0.01 | 75 s: 45/20 |
| 349 | 55th Street / Shattuck Avenue | signal |  | 1.52 | 0.02 | 85 s: 24/51 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 1.47 | 0.02 | 75 s: 47/18 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 693: 17 s: 52nd Street 4L [1689], 52nd Street 4L [1693]; 48 s: Shattuck Avenue 2L [1680], Shattuck Avenue 2L [1732]
- node 872: 39 s: Telegraph Avenue 3L [2077], Telegraph Avenue 3L [2078]; 26 s: Alcatraz Avenue 2L [2071], Alcatraz Avenue 2L [2104]
- node 965: 35 s: Ashby Avenue 2L [2278], Ashby Avenue 2L [2388]; 30 s: Shattuck Avenue 2L [2319], Shattuck Avenue 2L [4254]
- node 513: 32 s: Alcatraz Avenue 1L [1145], Alcatraz Avenue 2L [2123]; 33 s: Shattuck Avenue 1L [2043], Shattuck Avenue 1L [2046]
- node 1436: 34 s: Ashby Avenue 1L [3454], Ashby Avenue 2L [3485]; 31 s: Claremont Avenue 3L [3506], Claremont Avenue 2L [4394]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 970 | Dana Street | 1 | 50 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 655 | 713 |
| Telegraph | S | 10 | 608 | 696 |
| College | N | 3 | 151 | 151 |
| College | S | 3 | 226 | 227 |
| Claremont | N | 6 | 445 | 662 |
| Claremont | S | 7 | 370 | 589 |
| Alcatraz | E | 6 | 383 | 394 |
| Alcatraz | W | 6 | 289 | 301 |
| Hillegass | N | 4 | 48 | 64 |
| Hillegass | S | 4 | 60 | 60 |
| Colby | N | 7 | 17 | 25 |
| Colby | S | 7 | 61 | 66 |
| Martin | E | 2 | 92 | 92 |
| Martin | W | 2 | 143 | 143 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 615 | Grove Shafter Freeway | 3002 |
| 964 | Telegraph Avenue / Ward Street | 1371 |
| 183 | San Pablo Avenue | 992 |
| 1702 | Warren Freeway | 970 |
| 269 | Ashby Avenue | 781 |
| 104 | San Pablo Avenue | 469 |
| 1788 | Claremont Avenue | 359 |
| 776 | Telegraph Avenue | 341 |
| 995 | Broadway | 319 |
| 286 | Market Street | 276 |
