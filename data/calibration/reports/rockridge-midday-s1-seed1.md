# Calibration report: rockridge midday scale 1 seed 1 (60 min)

Offered demand 4761 veh/h x scale 1 = 4761 veh/h. Run took 0.8 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 4 | FAIL |
| Backlog / spawned | < 2% | 0.0% (2 of 4857) | pass |
| Arterial mean speed (run) | > 4 m/s | 7.66 m/s (last 15 min 7.61) | pass |

Overall: **NOT STABLE**. Mean trip delay 86 s, mean trip time 290 s, completed 4454, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 318 | 5 | 61 | 0 | 8.29 |
| 10 | 399 | 1 | 404 | 0 | 7.77 |
| 15 | 399 | 0 | 808 | 0 | 7.29 |
| 20 | 382 | 2 | 1214 | 2 | 7.76 |
| 25 | 406 | 1 | 1600 | 2 | 7.88 |
| 30 | 391 | 3 | 2003 | 2 | 7.67 |
| 35 | 379 | 1 | 2424 | 2 | 7.76 |
| 40 | 425 | 0 | 2801 | 2 | 7.44 |
| 45 | 395 | 0 | 3228 | 3 | 7.55 |
| 50 | 406 | 0 | 3635 | 4 | 7.72 |
| 55 | 410 | 1 | 4045 | 4 | 7.72 |
| 60 | 399 | 2 | 4454 | 4 | 7.41 |

## Select-link shares: modelled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 5 links (path Claremont Avenue -> Alcatraz Avenue (424 m)), 65 trips (64 completed)
- Colby Street NB: 10 links (path Claremont Avenue -> Alcatraz Avenue (664 m)), 85 trips (84 completed)
- Hillegass Avenue SB: 5 links (path Alcatraz Avenue -> Claremont Avenue (424 m)), 70 trips (60 completed)
- Colby Street SB: 10 links (path Alcatraz Avenue -> Claremont Avenue (664 m)), 145 trips (136 completed)

| Block | Side | Via | Observed | Modelled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 52% | +5 | 65 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 0% | -21 | 65 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 9% | +3 | 65 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 29% | +2 | 65 |  |
| Colby Street NB | from | freeway | 47% | 65% | +18 | 85 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 18% | -30 | 85 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 22% | -3 | 85 |  |
| Colby Street NB | to | College Avenue | 3% | 6% | +3 | 85 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 20% | -26 | 70 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 1% | -25 | 70 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 3% | -13 | 70 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 44% | -13 | 70 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 48% | +5 | 145 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 26% | -20 | 145 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 41% | +19 | 145 |  |
| Colby Street SB | to | freeway | 45% | 61% | +16 | 145 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 23% | -11 | 145 |  |

Headline shares within tolerance: 1 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only; modelled shares are over all trips on the ramps (so modelled is an upper bound for streets that serve both sides).

| Direction | Via | Observed | Modelled | n ramp trips |
| --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 14% | 534 |
| onto freeway | Hillegass Avenue | 12% | 4% | 534 |
| onto freeway | Martin Street | 10% | 34% | 534 |
| onto freeway | Colby Street | 8% | 13% | 534 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 49% | 534 |
| onto freeway | Benvenue Avenue | 5% | 0% | 534 |
| from freeway | College Avenue | 10% | 10% | 677 |
| from freeway | Martin Street | 10% | 32% | 677 |
| from freeway | Colby Street | 8% | 6% | 677 |
| from freeway | Hillegass Avenue | 5% | 5% | 677 |
| from freeway | Benvenue Avenue | 3% | 0% | 677 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 394 | (unnamed) | Motorway | 2 | 182 | signal | 7.87 | 5.82 | 5.8 | 424 |
| 757 | Claremont Avenue | Secondary | 2 | 145 | signal | 5.96 | 4.98 | 5.0 | 362 |
| 514 | Telegraph Avenue | Secondary | 2 | 53 | signal | 4.65 | 3.57 | 3.6 | 846 |
| 518 | Telegraph Avenue | Secondary | 2 | 90 | signal | 3.83 | 2.53 | 2.5 | 926 |
| 921 | Telegraph Avenue | Secondary | 2 | 84 | signal | 3.68 | 2.26 | 2.3 | 1051 |
| 396 | (unnamed) | Motorway | 2 | 112 | signal | 3.64 | 2.23 | 2.2 | 688 |
| 639 | Telegraph Avenue | Secondary | 3 | 44 | signal | 3.60 | 2.35 | 2.4 | 830 |
| 655 | Telegraph Avenue | Secondary | 3 | 50 | signal | 2.37 | 1.76 | 1.8 | 1090 |
| 48 | Martin Street | Residential | 1 | 110 | two_way_stop | 2.09 | 1.12 | 1.1 | 191 |
| 619 | Claremont Avenue | Secondary | 2 | 177 | signal | 1.97 | 1.52 | 1.5 | 294 |
| 517 | Telegraph Avenue | Secondary | 2 | 51 | signal | 1.85 | 1.00 | 1.0 | 928 |
| 47 | Martin Street | Residential | 1 | 110 | two_way_stop | 1.71 | 0.55 | 0.5 | 265 |
| 649 | Alcatraz Avenue | Tertiary | 2 | 40 | signal | 1.70 | 1.50 | 1.5 | 268 |
| 818 | Alcatraz Avenue | Tertiary | 2 | 44 | signal | 1.45 | 1.22 | 1.2 | 239 |
| 659 | Telegraph Avenue | Secondary | 2 | 112 | signal | 1.36 | 0.87 | 0.9 | 667 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space |
| --- | --- | --- | --- | --- | --- |
| 336 | Alcatraz Avenue / Telegraph Avenue | signal |  | 3.43 | 0.03 |
| 270 | Claremont Avenue / Forest Street | signal |  | 2.38 | 0.22 |
| 50 | 52nd Street / Claremont Avenue / Telegraph Avenue | signal |  | 1.70 | 0.00 |
| 39 | Claremont Avenue / Colby Street | signal |  | 1.52 | 0.58 |
| 306 | 51st Street / Telegraph Avenue | signal |  | 1.49 | 0.01 |
| 250 | Claremont Avenue / Clifton Street | signal |  | 1.46 | 0.00 |
| 223 | 55th Street / Telegraph Avenue | signal |  | 1.43 | 0.34 |
| 52 | 56th Street / Telegraph Avenue | signal |  | 1.32 | 0.00 |
| 53 | 56th Street / Telegraph Avenue | signal |  | 1.12 | 0.44 |
| 75 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 1.01 | 0.01 |
| 246 | Aileen Street / Telegraph Avenue | signal |  | 0.98 | 0.03 |
| 159 | 59th Street / Telegraph Avenue | signal |  | 0.97 | 0.00 |
| 287 | College Avenue / Hudson Street / Manila Avenue | signal |  | 0.92 | 0.01 |
| 273 | Alcatraz Avenue / College Avenue | signal |  | 0.80 | 0.01 |
| 177 | 66th Street / Telegraph Avenue | signal |  | 0.71 | 0.00 |

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 884 | 56th Street | 56th Street / Telegraph Avenue | signal | 4 | 15.7 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 321 | Broadway | 2 | 117 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 13 | 1136 | 1190 |
| Telegraph | S | 13 | 882 | 940 |
| College | N | 10 | 196 | 211 |
| College | S | 10 | 274 | 293 |
| Claremont | N | 7 | 362 | 655 |
| Claremont | S | 8 | 294 | 680 |
| Alcatraz | E | 7 | 372 | 374 |
| Alcatraz | W | 7 | 269 | 286 |
| Hillegass | N | 4 | 40 | 44 |
| Hillegass | S | 4 | 40 | 47 |
| Colby | N | 7 | 38 | 64 |
| Colby | S | 7 | 84 | 95 |
| Martin | E | 2 | 191 | 191 |
| Martin | W | 2 | 265 | 265 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 343 | Telegraph Avenue | 802 |
| 311 | Telegraph Avenue | 709 |
| 404 | Grove Shafter Freeway | 653 |
| 379 | Claremont Avenue | 416 |
| 242 | Grove Shafter Freeway | 405 |
| 391 | Alcatraz Avenue | 396 |
| 203 | Forest Street / Locksley Avenue | 151 |
| 241 | Aileen Street / Telegraph Avenue | 131 |
| 288 | Broadway / Manila Avenue | 117 |
| 321 | Broadway | 117 |
