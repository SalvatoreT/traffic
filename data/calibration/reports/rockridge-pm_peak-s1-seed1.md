# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 7331 veh/h x scale 1 = 7331 veh/h. Run took 1.6 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 69 | FAIL |
| Backlog / spawned | < 2% | 5.0% (353 of 7092) | FAIL |
| Arterial mean speed (run) | > 4 m/s | 3.68 m/s (last 15 min 2.70) | FAIL |

Overall: **NOT STABLE**. Mean trip delay 349 s, mean trip time 572 s, completed 5246, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 521 | 3 | 89 | 0 | 7.58 |
| 10 | 747 | 7 | 487 | 0 | 6.14 |
| 15 | 861 | 2 | 969 | 1 | 5.28 |
| 20 | 916 | 10 | 1515 | 2 | 5.33 |
| 25 | 1079 | 19 | 1996 | 3 | 4.83 |
| 30 | 1123 | 54 | 2540 | 8 | 4.20 |
| 35 | 1290 | 85 | 2974 | 16 | 2.73 |
| 40 | 1456 | 120 | 3370 | 29 | 2.93 |
| 45 | 1481 | 180 | 3861 | 38 | 3.60 |
| 50 | 1552 | 274 | 4337 | 47 | 3.11 |
| 55 | 1642 | 319 | 4801 | 60 | 2.51 |
| 60 | 1777 | 353 | 5246 | 69 | 2.49 |

## Select-link shares: modelled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 5 links (path Claremont Avenue -> Alcatraz Avenue (424 m)), 247 trips (198 completed)
- Colby Street NB: 10 links (path Claremont Avenue -> Alcatraz Avenue (664 m)), 260 trips (201 completed)
- Hillegass Avenue SB: 5 links (path Alcatraz Avenue -> Claremont Avenue (424 m)), 201 trips (130 completed)
- Colby Street SB: 10 links (path Alcatraz Avenue -> Claremont Avenue (664 m)), 482 trips (357 completed)

| Block | Side | Via | Observed | Modelled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 26% | -21 | 247 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 0% | -33 | 247 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 14% | +8 | 247 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 36% | +9 | 247 |  |
| Colby Street NB | from | freeway | 47% | 36% | -11 | 260 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 35% | -13 | 260 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 34% | +9 | 260 |  |
| Colby Street NB | to | College Avenue | 3% | 12% | +9 | 260 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 25% | -21 | 201 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 0% | -26 | 201 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 21% | +5 | 201 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 45% | -23 | 201 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 41% | -2 | 482 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 20% | -26 | 482 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 44% | +22 | 482 |  |
| Colby Street SB | to | freeway | 45% | 61% | +16 | 482 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 14% | -20 | 482 |  |

Headline shares within tolerance: 0 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only; modelled shares are over all trips on the ramps (so modelled is an upper bound for streets that serve both sides).

| Direction | Via | Observed | Modelled | n ramp trips |
| --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 15% | 682 |
| onto freeway | Hillegass Avenue | 12% | 7% | 682 |
| onto freeway | Martin Street | 10% | 17% | 682 |
| onto freeway | Colby Street | 8% | 28% | 682 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 47% | 682 |
| onto freeway | Benvenue Avenue | 5% | 0% | 682 |
| from freeway | College Avenue | 10% | 26% | 764 |
| from freeway | Martin Street | 10% | 23% | 764 |
| from freeway | Colby Street | 8% | 9% | 764 |
| from freeway | Hillegass Avenue | 5% | 7% | 764 |
| from freeway | Benvenue Avenue | 3% | 0% | 764 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 394 | (unnamed) | Motorway | 2 | 182 | signal | 33.59 | 28.68 | 28.7 | 468 |
| 915 | Grove Shafter Freeway | Motorway | 4 | 645 | uncontrolled | 21.86 | 18.39 | 18.4 | 578 |
| 628 | Claremont Avenue | Secondary | 2 | 194 | signal | 19.52 | 16.34 | 16.3 | 498 |
| 619 | Claremont Avenue | Secondary | 2 | 177 | signal | 18.20 | 15.90 | 15.9 | 336 |
| 518 | Telegraph Avenue | Secondary | 2 | 90 | signal | 16.58 | 12.61 | 12.6 | 904 |
| 396 | (unnamed) | Motorway | 2 | 112 | signal | 15.82 | 12.07 | 12.1 | 709 |
| 918 | (unnamed) | Motorway | 1 | 293 | uncontrolled | 14.87 | 10.47 | 10.5 | 743 |
| 757 | Claremont Avenue | Secondary | 2 | 145 | signal | 12.58 | 11.27 | 11.3 | 208 |
| 643 | (unnamed) | Motorway | 1 | 194 | uncontrolled | 12.51 | 9.78 | 9.8 | 504 |
| 955 | Grove Shafter Freeway | Motorway | 4 | 51 | uncontrolled | 9.83 | 8.02 | 8.0 | 786 |
| 949 | (unnamed) | Service | 1 | 124 | uncontrolled | 8.90 | 8.74 | 8.7 | 28 |
| 637 | Telegraph Avenue | Secondary | 2 | 74 | uncontrolled | 8.66 | 6.04 | 6.0 | 757 |
| 813 | Claremont Avenue | Secondary | 2 | 86 | two_way_stop | 8.38 | 6.99 | 7.0 | 374 |
| 639 | Telegraph Avenue | Secondary | 3 | 44 | signal | 7.92 | 5.93 | 5.9 | 757 |
| 0 | (unnamed) | Motorway | 1 | 157 | uncontrolled | 7.73 | 5.69 | 5.7 | 554 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space |
| --- | --- | --- | --- | --- | --- |
| 336 | Alcatraz Avenue / Telegraph Avenue | signal |  | 4.85 | 0.20 |
| 50 | 52nd Street / Claremont Avenue / Telegraph Avenue | signal |  | 3.49 | 0.43 |
| 306 | 51st Street / Telegraph Avenue | signal |  | 3.38 | 0.17 |
| 270 | Claremont Avenue / Forest Street | signal |  | 3.17 | 0.38 |
| 75 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 3.05 | 0.18 |
| 39 | Claremont Avenue / Colby Street | signal |  | 2.58 | 0.84 |
| 53 | 56th Street / Telegraph Avenue | signal |  | 2.52 | 1.04 |
| 250 | Claremont Avenue / Clifton Street | signal |  | 2.41 | 0.41 |
| 246 | Aileen Street / Telegraph Avenue | signal |  | 2.39 | 0.46 |
| 223 | 55th Street / Telegraph Avenue | signal |  | 2.11 | 0.76 |
| 304 | College Avenue / Keith Avenue / Shafter Avenue | signal |  | 1.84 | 0.21 |
| 241 | Aileen Street / Telegraph Avenue | signal |  | 1.78 | 0.50 |
| 52 | 56th Street / Telegraph Avenue | signal |  | 1.62 | 0.17 |
| 323 | Claremont Avenue / Hudson Street | signal |  | 1.62 | 0.50 |
| 287 | College Avenue / Hudson Street / Manila Avenue | signal |  | 1.58 | 0.04 |

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 884 | 56th Street | 56th Street / Telegraph Avenue | signal | 9 | 14.4 |
| 527 | Aileen Street | Aileen Street / Telegraph Avenue | signal | 6 | 23.2 |
| 915 | Grove Shafter Freeway | Grove Shafter Freeway | uncontrolled | 6 | 37.1 |
| 391 | Aileen Street | Aileen Street / Telegraph Avenue | signal | 5 | 28.2 |
| 832 | Aileen Street | Aileen Street | uncontrolled | 4 | 27.5 |
| 955 | Grove Shafter Freeway | Grove Shafter Freeway | uncontrolled | 4 | 38.9 |
| 394 | (unnamed) | Aileen Street / Telegraph Avenue | signal | 2 | 32.5 |
| 393 | (unnamed) | (unnamed) | uncontrolled | 2 | 33.5 |
| 875 | Shafter Avenue | 51st Street / Shafter Avenue | signal | 2 | 39.8 |
| 305 | Carberry Avenue | 56th Street / Carberry Avenue | all_way_stop | 2 | 41.3 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 404 | Grove Shafter Freeway | 165 | 1033 |
| 343 | Telegraph Avenue | 97 | 1159 |
| 241 | Aileen Street / Telegraph Avenue | 86 | 227 |
| 141 | College Avenue / Harwood Avenue | 3 | 53 |
| 203 | Forest Street / Locksley Avenue | 1 | 249 |
| 321 | Broadway | 1 | 168 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 13 | 1039 | 1114 |
| Telegraph | S | 13 | 919 | 1018 |
| College | N | 10 | 725 | 798 |
| College | S | 10 | 569 | 605 |
| Claremont | N | 7 | 208 | 498 |
| Claremont | S | 8 | 400 | 964 |
| Alcatraz | E | 7 | 498 | 559 |
| Alcatraz | W | 7 | 358 | 422 |
| Hillegass | N | 4 | 112 | 124 |
| Hillegass | S | 4 | 103 | 121 |
| Colby | N | 7 | 88 | 121 |
| Colby | S | 7 | 228 | 251 |
| Martin | E | 2 | 136 | 136 |
| Martin | W | 2 | 232 | 232 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 343 | Telegraph Avenue | 1159 |
| 311 | Telegraph Avenue | 1125 |
| 404 | Grove Shafter Freeway | 1033 |
| 242 | Grove Shafter Freeway | 652 |
| 379 | Claremont Avenue | 594 |
| 391 | Alcatraz Avenue | 571 |
| 203 | Forest Street / Locksley Avenue | 249 |
| 241 | Aileen Street / Telegraph Avenue | 227 |
| 321 | Broadway | 168 |
| 288 | Broadway / Manila Avenue | 168 |
