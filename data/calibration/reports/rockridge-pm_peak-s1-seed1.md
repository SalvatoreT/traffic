# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 23525 veh/h x scale 1 = 23525 veh/h. Run took 23.6 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 10 | FAIL |
| Backlog / spawned | < 2% | 2.9% (657 of 22972) | FAIL |
| Arterial mean speed (run) | > 4 m/s | 7.26 m/s (last 15 min 6.66) | pass |

Overall: **NOT STABLE**. Mean trip delay 261 s, mean trip time 601 s, completed 18354, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1776 | 1 | 186 | 0 | 10.58 |
| 10 | 2830 | 13 | 1115 | 0 | 8.52 |
| 15 | 3313 | 65 | 2517 | 0 | 8.00 |
| 20 | 3568 | 137 | 4197 | 0 | 7.91 |
| 25 | 3857 | 128 | 5933 | 1 | 7.46 |
| 30 | 3934 | 180 | 7775 | 2 | 7.50 |
| 35 | 4061 | 263 | 9556 | 3 | 7.02 |
| 40 | 4179 | 369 | 11293 | 3 | 6.76 |
| 45 | 4327 | 484 | 13051 | 3 | 6.86 |
| 50 | 4326 | 522 | 14869 | 6 | 7.17 |
| 55 | 4500 | 496 | 16645 | 8 | 6.49 |
| 60 | 4608 | 657 | 18354 | 10 | 6.31 |
## Per-mode results

Offered: 23525 car veh/h; 1500 bicycle flows (1148/h); 2000 pedestrian flows (1991/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 4608 | 18354 | 601 | |
| Bicycle | 117 | 1003 | 355 | |
| Pedestrian | 284 | 1612 | 487 | mean crossing delay 6.6 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 433, bicycle conflicts 1451, close passes 950, pedestrian injury-risk index 0.039, bicycle injury-risk index 0.045 (proxy), mean vehicle speed at pedestrian encounters 2.25 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 155 trips (126 completed)
- Colby Street NB: 9 links (path Claremont Avenue -> Alcatraz Avenue (674 m)), 210 trips (147 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 219 trips (190 completed)
- Colby Street SB: 9 links (path Alcatraz Avenue -> Claremont Avenue (674 m)), 259 trips (217 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 75% | +28 | 155 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 5% | -28 | 155 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 6% | +0 | 155 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 37% | +10 | 155 |  |
| Colby Street NB | from | freeway | 47% | 46% | -1 | 210 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 46% | -2 | 210 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 51% | +26 | 210 |  |
| Colby Street NB | to | College Avenue | 3% | 8% | +5 | 210 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 29% | -17 | 219 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 12% | -14 | 219 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 19% | +3 | 219 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 53% | -15 | 219 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 29% | -14 | 259 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 42% | -4 | 259 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 53% | +31 | 259 |  |
| Colby Street SB | to | freeway | 45% | 25% | -20 | 259 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 55% | +21 | 259 |  |

Headline shares within tolerance: 1 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only; modeled shares are over all trips on the ramps (so modeled is an upper bound for streets that serve both sides).

| Direction | Via | Observed | Modeled | n ramp trips |
| --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 11% | 672 |
| onto freeway | Hillegass Avenue | 12% | 10% | 672 |
| onto freeway | Martin Street | 10% | 20% | 672 |
| onto freeway | Colby Street | 8% | 10% | 672 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 54% | 672 |
| onto freeway | Benvenue Avenue | 5% | 2% | 672 |
| from freeway | College Avenue | 10% | 7% | 982 |
| from freeway | Martin Street | 10% | 36% | 982 |
| from freeway | Colby Street | 8% | 17% | 982 |
| from freeway | Hillegass Avenue | 5% | 11% | 982 |
| from freeway | Benvenue Avenue | 3% | 2% | 982 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4221 | (unnamed) | Motorway | 2 | 513 | uncontrolled | 52.71 | 36.61 | 36.6 | 709 |
| 4236 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 17.37 | 0.99 | 1.0 | 1416 |
| 4220 | 45th Street | Residential | 1 | 363 | uncontrolled | 14.93 | 11.33 | 11.3 | 295 |
| 4228 | (unnamed) | Motorway | 3 | 72 | uncontrolled | 14.76 | 5.66 | 5.7 | 2213 |
| 4226 | (unnamed) | Motorway | 2 | 690 | uncontrolled | 14.06 | 3.95 | 3.9 | 1231 |
| 734 | 55th Street | Tertiary | 1 | 238 | signal | 13.85 | 10.60 | 10.6 | 599 |
| 1690 | 52nd Street | Secondary | 4 | 53 | signal | 13.84 | 11.62 | 11.6 | 856 |
| 4227 | (unnamed) | Motorway | 2 | 134 | uncontrolled | 12.54 | 4.00 | 4.0 | 1411 |
| 1697 | 52nd Street | Tertiary | 2 | 111 | uncontrolled | 12.01 | 11.34 | 11.3 | 154 |
| 744 | 56th Street | Residential | 1 | 243 | two_way_stop | 10.78 | 10.18 | 10.2 | 76 |
| 4195 | Martin Luther King Junior Way | Secondary | 3 | 147 | uncontrolled | 10.11 | 7.23 | 7.2 | 1470 |
| 4196 | 54th Street | Residential | 1 | 233 | two_way_stop | 9.83 | 8.25 | 8.3 | 160 |
| 4204 | Adeline Street | Secondary | 3 | 185 | signal | 9.60 | 8.09 | 8.1 | 349 |
| 4466 | Ashby Avenue | Primary | 2 | 96 | signal | 9.14 | 7.89 | 7.9 | 302 |
| 1145 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 9.04 | 6.40 | 6.4 | 439 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 694 | 52nd Street / Shattuck Avenue | signal |  | 5.31 | 0.26 | 75 s: 34/31 |
| 458 | Market Street / Stanford Avenue | signal |  | 4.83 | 0.23 | 75 s: 50/15 |
| 459 | Adeline Street / Alcatraz Avenue | signal |  | 4.52 | 0.60 | 75 s: 38/27 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.79 | 0.03 | 75 s: 30/35 |
| 343 | 55th Street / Martin Luther King Junior Way | signal |  | 3.52 | 0.29 | 75 s: 33/32 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.42 | 0.07 | 75 s: 45/20 |
| 874 | Alcatraz Avenue / Telegraph Avenue | signal |  | 3.33 | 0.08 | 75 s: 35/30 |
| 1405 | Ashby Avenue / Domingo Avenue / Tunnel Road | signal |  | 3.21 | 0.17 | 75 s: 24/15/21 |
| 967 | Ashby Avenue / Shattuck Avenue | signal |  | 3.13 | 0.08 | 75 s: 42/23 |
| 627 | 52nd Street / Claremont Avenue / Telegraph Avenue | signal |  | 3.04 | 0.15 | 75 s: 15/15/30 |
| 1438 | Ashby Avenue / Claremont Avenue | signal |  | 2.98 | 0.03 | 75 s: 49/16 |
| 1107 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.95 | 0.00 | 75 s: 15/30/15 |
| 687 | 55th Street / Telegraph Avenue | signal |  | 2.94 | 0.13 | 75 s: 16/49 |
| 491 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 2.93 | 0.00 | 75 s: 15/30/15 |
| 342 | 52nd Street / Martin Luther King Junior Way | signal |  | 2.86 | 0.52 | 60 s: 60 |

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 595 | Martin Luther King Junior Way | 45th Street / Martin Luther King Junior Way | signal | 3 | 45.1 |
| 3785 | Tunnel Road | Hiller Drive / Tunnel Road | two_way_stop | 1 | 20.1 |
| 1623 | 52nd Street | 52nd Street | uncontrolled | 1 | 27.9 |
| 319 | 62nd Street | 62nd Street / Lowell Street | two_way_stop | 1 | 32.7 |
| 2109 | Aileen Street | Aileen Street | uncontrolled | 1 | 54.4 |
| 1980 | Aileen Street | Aileen Street / Telegraph Avenue | signal | 1 | 54.6 |
| 1746 | (unnamed) | Telegraph Avenue | uncontrolled | 1 | 56.1 |
| 2108 | Aileen Street | Aileen Street / Shattuck Avenue | two_way_stop | 1 | 59.9 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 1769 | (unnamed) | 652 | 2934 |
| 1405 | Ashby Avenue / Domingo Avenue / Tunnel Road | 3 | 203 |
| 286 | Market Street | 1 | 592 |
| 893 | Colby Street | 1 | 423 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 936 | 1028 |
| Telegraph | S | 10 | 712 | 792 |
| College | N | 3 | 400 | 402 |
| College | S | 3 | 562 | 565 |
| Claremont | N | 6 | 412 | 796 |
| Claremont | S | 7 | 667 | 1003 |
| Alcatraz | E | 6 | 420 | 437 |
| Alcatraz | W | 6 | 463 | 493 |
| Hillegass | N | 4 | 110 | 161 |
| Hillegass | S | 4 | 169 | 173 |
| Colby | N | 7 | 109 | 136 |
| Colby | S | 7 | 136 | 158 |
| Martin | E | 2 | 158 | 158 |
| Martin | W | 2 | 376 | 376 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 1769 | (unnamed) | 2934 |
| 269 | Ashby Avenue | 1134 |
| 966 | Telegraph Avenue / Ward Street | 1064 |
| 615 | Grove Shafter Freeway | 942 |
| 617 | (unnamed) | 918 |
| 104 | San Pablo Avenue | 863 |
| 183 | San Pablo Avenue | 830 |
| 1753 | Grove Shafter Freeway | 729 |
| 1704 | Warren Freeway | 700 |
| 1743 | Grove Shafter Freeway | 650 |
