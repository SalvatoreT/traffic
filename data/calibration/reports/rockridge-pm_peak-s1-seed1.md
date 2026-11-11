# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 13106 veh/h x scale 1 = 13106 veh/h. Run took 5.0 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 764 | FAIL |
| Backlog / spawned | < 2% | 47.6% (4246 of 8916) | FAIL |
| Arterial mean speed (run) | > 4 m/s | 1.17 m/s (last 15 min 0.58) | FAIL |

Overall: **NOT STABLE**. Mean trip delay 794 s, mean trip time 994 s, completed 2853, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 898 | 89 | 104 | 0 | 6.49 |
| 10 | 1488 | 228 | 482 | 1 | 4.15 |
| 15 | 2079 | 412 | 839 | 4 | 2.68 |
| 20 | 2535 | 706 | 1165 | 29 | 1.79 |
| 25 | 3046 | 996 | 1410 | 70 | 1.54 |
| 30 | 3528 | 1350 | 1639 | 126 | 1.14 |
| 35 | 3882 | 1804 | 1884 | 183 | 0.88 |
| 40 | 4257 | 2191 | 2129 | 243 | 0.84 |
| 45 | 4529 | 2673 | 2369 | 346 | 0.82 |
| 50 | 4748 | 3267 | 2545 | 484 | 0.69 |
| 55 | 5059 | 3731 | 2687 | 632 | 0.53 |
| 60 | 5299 | 4246 | 2853 | 764 | 0.50 |

## Select-link shares: modelled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 5 links (path Claremont Avenue -> Alcatraz Avenue (424 m)), 191 trips (71 completed)
- Colby Street NB: 10 links (path Claremont Avenue -> Alcatraz Avenue (664 m)), 405 trips (137 completed)
- Hillegass Avenue SB: 5 links (path Alcatraz Avenue -> Claremont Avenue (424 m)), 371 trips (87 completed)
- Colby Street SB: 10 links (path Alcatraz Avenue -> Claremont Avenue (664 m)), 560 trips (147 completed)

| Block | Side | Via | Observed | Modelled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 10% | -37 | 191 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 3% | -30 | 191 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 43% | +37 | 191 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 14% | -13 | 191 |  |
| Colby Street NB | from | freeway | 47% | 21% | -26 | 405 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 18% | -30 | 405 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 31% | +6 | 405 |  |
| Colby Street NB | to | College Avenue | 3% | 34% | +31 | 405 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 33% | -13 | 371 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 8% | -18 | 371 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 28% | +12 | 371 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 23% | -45 | 371 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 47% | +4 | 560 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 24% | -22 | 560 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 52% | +30 | 560 |  |
| Colby Street SB | to | freeway | 45% | 24% | -21 | 560 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 21% | -13 | 560 |  |

Headline shares within tolerance: 0 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only; modelled shares are over all trips on the ramps (so modelled is an upper bound for streets that serve both sides).

| Direction | Via | Observed | Modelled | n ramp trips |
| --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 18% | 301 |
| onto freeway | Hillegass Avenue | 12% | 8% | 301 |
| onto freeway | Martin Street | 10% | 14% | 301 |
| onto freeway | Colby Street | 8% | 22% | 301 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 43% | 301 |
| onto freeway | Benvenue Avenue | 5% | 2% | 301 |
| from freeway | College Avenue | 10% | 27% | 480 |
| from freeway | Martin Street | 10% | 22% | 480 |
| from freeway | Colby Street | 8% | 11% | 480 |
| from freeway | Hillegass Avenue | 5% | 6% | 480 |
| from freeway | Benvenue Avenue | 3% | 3% | 480 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 915 | Grove Shafter Freeway | Motorway | 4 | 645 | uncontrolled | 45.51 | 42.12 | 42.1 | 455 |
| 463 | Chabot Road | Tertiary | 1 | 348 | two_way_stop | 39.67 | 39.15 | 39.1 | 54 |
| 394 | (unnamed) | Motorway | 2 | 182 | signal | 35.09 | 31.08 | 31.1 | 360 |
| 775 | Claremont Avenue | Secondary | 2 | 213 | signal | 31.33 | 28.29 | 28.3 | 278 |
| 929 | Miles Avenue | Tertiary | 2 | 138 | uncontrolled | 25.93 | 24.33 | 24.3 | 175 |
| 619 | Claremont Avenue | Secondary | 2 | 177 | signal | 24.72 | 22.49 | 22.5 | 238 |
| 918 | (unnamed) | Motorway | 1 | 293 | uncontrolled | 24.19 | 18.74 | 18.7 | 452 |
| 396 | (unnamed) | Motorway | 2 | 112 | signal | 22.17 | 18.82 | 18.8 | 427 |
| 274 | Bryant Avenue | Residential | 1 | 245 | uncontrolled | 21.51 | 20.95 | 20.9 | 41 |
| 800 | College Avenue | Tertiary | 1 | 217 | signal | 20.92 | 20.49 | 20.5 | 46 |
| 298 | Chabot Road | Tertiary | 1 | 285 | two_way_stop | 20.79 | 20.29 | 20.3 | 58 |
| 335 | Oak Grove Avenue | Residential | 1 | 372 | two_way_stop | 20.16 | 19.73 | 19.7 | 42 |
| 500 | Manila Avenue | Residential | 1 | 274 | signal | 20.11 | 19.10 | 19.1 | 110 |
| 628 | Claremont Avenue | Secondary | 2 | 194 | signal | 19.15 | 17.29 | 17.3 | 292 |
| 963 | Broadway | Primary | 1 | 209 | signal | 18.60 | 18.30 | 18.3 | 17 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space |
| --- | --- | --- | --- | --- | --- |
| 306 | 51st Street / Telegraph Avenue | signal |  | 6.33 | 0.96 |
| 50 | 52nd Street / Claremont Avenue / Telegraph Avenue | signal |  | 5.55 | 1.14 |
| 336 | Alcatraz Avenue / Telegraph Avenue | signal |  | 5.19 | 0.81 |
| 75 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 5.12 | 1.72 |
| 270 | Claremont Avenue / Forest Street | signal |  | 4.32 | 0.68 |
| 223 | 55th Street / Telegraph Avenue | signal |  | 3.95 | 1.08 |
| 287 | College Avenue / Hudson Street / Manila Avenue | signal |  | 3.70 | 0.73 |
| 250 | Claremont Avenue / Clifton Street | signal |  | 3.56 | 0.90 |
| 80 | 51st Street / Lawton Avenue | all_way_stop |  | 3.37 | 1.71 |
| 79 | 51st Street / Lawton Avenue | uncontrolled |  | 3.19 | 2.72 |
| 39 | Claremont Avenue / Colby Street | signal |  | 3.12 | 1.09 |
| 246 | Aileen Street / Telegraph Avenue | signal |  | 3.11 | 0.61 |
| 159 | 59th Street / Telegraph Avenue | signal |  | 2.94 | 0.53 |
| 304 | College Avenue / Keith Avenue / Shafter Avenue | signal |  | 2.94 | 0.93 |
| 297 | Broadway | uncontrolled |  | 2.94 | 2.87 |

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 682 | 51st Street | 51st Street / Lawton Avenue | uncontrolled | 21 | 16.5 |
| 915 | Grove Shafter Freeway | Grove Shafter Freeway | uncontrolled | 15 | 35.9 |
| 955 | Grove Shafter Freeway | Grove Shafter Freeway | uncontrolled | 14 | 26.1 |
| 836 | Broadway | Ada Street / Broadway | two_way_stop | 12 | 17.0 |
| 617 | Broadway | Broadway / Manila Avenue | signal | 12 | 17.5 |
| 820 | Presley Way | Chabot Road / Presley Way | uncontrolled | 12 | 24.6 |
| 963 | Broadway | Broadway / Manila Avenue | signal | 11 | 23.4 |
| 944 | Broadway | Broadway | uncontrolled | 10 | 19.4 |
| 529 | (unnamed) | College Avenue | uncontrolled | 10 | 21.3 |
| 749 | Broadway | Broadway / Clifton Street | uncontrolled | 9 | 20.3 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 299 | Broadway / College Avenue | 1132 | 1331 |
| 343 | Telegraph Avenue | 607 | 1154 |
| 321 | Broadway | 498 | 591 |
| 351 | 51st Street | 453 | 852 |
| 404 | Grove Shafter Freeway | 371 | 1027 |
| 231 | 52nd Street | 212 | 853 |
| 288 | Broadway / Manila Avenue | 208 | 591 |
| 317 | Miles Avenue | 194 | 467 |
| 311 | Telegraph Avenue | 155 | 1123 |
| 272 | Chabot Road / Presley Way | 97 | 201 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 13 | 656 | 966 |
| Telegraph | S | 13 | 490 | 740 |
| College | N | 10 | 138 | 193 |
| College | S | 10 | 338 | 439 |
| Claremont | N | 7 | 186 | 292 |
| Claremont | S | 8 | 410 | 533 |
| Alcatraz | E | 7 | 284 | 422 |
| Alcatraz | W | 7 | 124 | 180 |
| Hillegass | N | 4 | 73 | 96 |
| Hillegass | S | 4 | 173 | 203 |
| Colby | N | 7 | 116 | 155 |
| Colby | S | 7 | 230 | 311 |
| Martin | E | 2 | 79 | 79 |
| Martin | W | 2 | 80 | 80 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 299 | Broadway / College Avenue | 1331 |
| 343 | Telegraph Avenue | 1154 |
| 311 | Telegraph Avenue | 1123 |
| 404 | Grove Shafter Freeway | 1027 |
| 231 | 52nd Street | 853 |
| 351 | 51st Street | 852 |
| 242 | Grove Shafter Freeway | 653 |
| 379 | Claremont Avenue | 592 |
| 288 | Broadway / Manila Avenue | 591 |
| 321 | Broadway | 591 |
