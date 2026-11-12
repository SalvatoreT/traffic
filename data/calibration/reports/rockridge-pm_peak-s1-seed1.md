# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 7523 veh/h x scale 1 = 7523 veh/h. Run took 1.7 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 6 | FAIL |
| Backlog / spawned | < 2% | 0.8% (60 of 7559) | pass |
| Arterial mean speed (run) | > 4 m/s | 4.26 m/s (last 15 min 3.38) | pass |

Overall: **NOT STABLE**. Mean trip delay 308 s, mean trip time 522 s, completed 5816, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 549 | 0 | 86 | 0 | 7.12 |
| 10 | 740 | 5 | 516 | 0 | 6.00 |
| 15 | 797 | 7 | 1083 | 0 | 5.92 |
| 20 | 857 | 4 | 1648 | 0 | 5.53 |
| 25 | 912 | 61 | 2204 | 0 | 4.93 |
| 30 | 1080 | 43 | 2703 | 0 | 4.99 |
| 35 | 1208 | 31 | 3212 | 0 | 4.03 |
| 40 | 1394 | 12 | 3677 | 0 | 3.56 |
| 45 | 1499 | 37 | 4210 | 2 | 3.52 |
| 50 | 1599 | 21 | 4746 | 4 | 3.42 |
| 55 | 1655 | 24 | 5304 | 4 | 3.77 |
| 60 | 1737 | 60 | 5816 | 6 | 2.95 |

## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 101 trips (72 completed)
- Colby Street NB: 9 links (path Claremont Avenue -> Alcatraz Avenue (667 m)), 308 trips (230 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 289 trips (216 completed)
- Colby Street SB: 9 links (path Alcatraz Avenue -> Claremont Avenue (667 m)), 605 trips (443 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 41% | -6 | 101 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 0% | -33 | 101 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 18% | +12 | 101 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 35% | +8 | 101 |  |
| Colby Street NB | from | freeway | 47% | 45% | -2 | 308 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 41% | -7 | 308 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 41% | +16 | 308 |  |
| Colby Street NB | to | College Avenue | 3% | 14% | +11 | 308 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 10% | -36 | 289 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 0% | -26 | 289 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 3% | -13 | 289 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 54% | -14 | 289 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 52% | +9 | 605 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 14% | -32 | 605 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 61% | +39 | 605 |  |
| Colby Street SB | to | freeway | 45% | 48% | +3 | 605 | within |
| Colby Street SB | to | Forest Street | 34% | 24% | -10 | 605 |  |

Headline shares within tolerance: 3 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only; modeled shares are over all trips on the ramps (so modeled is an upper bound for streets that serve both sides).

| Direction | Via | Observed | Modeled | n ramp trips |
| --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 13% | 709 |
| onto freeway | Hillegass Avenue | 12% | 18% | 709 |
| onto freeway | Martin Street | 10% | 6% | 709 |
| onto freeway | Colby Street | 8% | 30% | 709 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 56% | 709 |
| onto freeway | Benvenue Avenue | 5% | 0% | 709 |
| from freeway | College Avenue | 10% | 13% | 1023 |
| from freeway | Martin Street | 10% | 18% | 1023 |
| from freeway | Colby Street | 8% | 14% | 1023 |
| from freeway | Hillegass Avenue | 5% | 5% | 1023 |
| from freeway | Benvenue Avenue | 3% | 0% | 1023 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 602 | Claremont Avenue | Secondary | 2 | 194 | signal | 21.11 | 14.39 | 14.4 | 847 |
| 379 | (unnamed) | Motorway | 2 | 188 | signal | 17.88 | 13.44 | 13.4 | 660 |
| 497 | Telegraph Avenue | Secondary | 2 | 94 | signal | 16.61 | 14.23 | 14.2 | 458 |
| 381 | (unnamed) | Motorway | 2 | 112 | signal | 11.32 | 7.59 | 7.6 | 1000 |
| 166 | Hillegass Avenue | Residential | 1 | 298 | two_way_stop | 8.94 | 7.94 | 7.9 | 94 |
| 494 | Telegraph Avenue | Secondary | 2 | 94 | signal | 8.86 | 6.47 | 6.5 | 692 |
| 603 | Claremont Avenue | Secondary | 2 | 193 | uncontrolled | 8.59 | 6.97 | 7.0 | 334 |
| 46 | Martin Street | Residential | 1 | 110 | two_way_stop | 7.99 | 7.41 | 7.4 | 74 |
| 657 | 51st Street | Secondary | 3 | 64 | signal | 7.96 | 7.22 | 7.2 | 294 |
| 723 | Claremont Avenue | Secondary | 2 | 150 | signal | 7.96 | 6.43 | 6.4 | 532 |
| 50 | Colby Street | Residential | 1 | 158 | signal | 7.78 | 5.76 | 5.8 | 253 |
| 888 | Telegraph Avenue | Secondary | 3 | 81 | signal | 7.73 | 6.70 | 6.7 | 454 |
| 617 | Telegraph Avenue | Secondary | 3 | 46 | signal | 7.70 | 5.29 | 5.3 | 948 |
| 777 | Claremont Avenue | Secondary | 2 | 90 | two_way_stop | 7.50 | 5.42 | 5.4 | 761 |
| 496 | Telegraph Avenue | Secondary | 2 | 61 | signal | 6.84 | 5.93 | 5.9 | 269 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 310 | Alcatraz Avenue / Telegraph Avenue | signal |  | 5.73 | 0.34 | 75 s: 44/21 |
| 48 | 52nd Street / Claremont Avenue / Telegraph Avenue | signal |  | 5.02 | 0.08 | 120 s: 41/15/49 |
| 70 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 4.61 | 0.08 | 75 s: 22/23/16 |
| 284 | 51st Street / Telegraph Avenue | signal |  | 3.60 | 0.22 | 75 s: 50/15 |
| 38 | Claremont Avenue / Colby Street / Forest Street | signal |  | 3.54 | 0.03 | 75 s: 34/31 |
| 226 | Aileen Street / Telegraph Avenue | signal |  | 3.31 | 0.55 | 75 s: 39/26 |
| 273 | 56th Street / Telegraph Avenue | signal |  | 3.02 | 0.06 | 75 s: 40/25 |
| 265 | College Avenue / Hudson Street / Manila Avenue | signal |  | 2.81 | 0.03 | 75 s: 23/18/19 |
| 213 | Claremont Avenue / Hudson Street | signal |  | 2.77 | 0.21 | 75 s: 40/25 |
| 234 | Claremont Avenue / Clifton Street | signal |  | 2.62 | 0.23 | 75 s: 46/19 |
| 211 | 55th Street / Telegraph Avenue | signal |  | 1.63 | 0.53 | 75 s: 50/15 |
| 151 | 59th Street / Telegraph Avenue | signal |  | 1.55 | 0.22 | 75 s: 50/15 |
| 172 | 57th Street / Telegraph Avenue | two_way_stop |  | 1.54 | 0.79 |  |
| 34 | Claremont Avenue / Martin Street | two_way_stop |  | 1.51 | 0.58 |  |
| 57 | Auburn Avenue / Claremont Avenue / Mystic Street | signal |  | 1.49 | 0.00 | 75 s: 30/15/15 |

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 304 | Redondo Avenue | Cavour Street / Redondo Avenue | uncontrolled | 1 | 40.4 |
| 606 | Telegraph Avenue | Telegraph Avenue | uncontrolled | 1 | 41.0 |
| 878 | Telegraph Avenue | 58th Street / Telegraph Avenue | two_way_stop | 1 | 45.4 |
| 822 | Telegraph Avenue | 58th Street / Racine Street / Telegraph Avenue | two_way_stop | 1 | 45.7 |
| 74 | Ayala Avenue | Ayala Avenue / Martin Street | two_way_stop | 1 | 56.1 |
| 72 | Ayala Avenue | Ayala Avenue / Martin Street | two_way_stop | 1 | 56.3 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 317 | Telegraph Avenue | 33 | 1151 |
| 290 | Telegraph Avenue | 20 | 1118 |
| 351 | Claremont Avenue | 4 | 591 |
| 34 | Claremont Avenue / Martin Street | 2 | 41 |
| 116 | 63rd Street / College Avenue | 1 | 48 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 1238 | 1338 |
| Telegraph | S | 10 | 640 | 749 |
| College | N | 3 | 308 | 308 |
| College | S | 3 | 460 | 470 |
| Claremont | N | 6 | 439 | 761 |
| Claremont | S | 7 | 731 | 1063 |
| Alcatraz | E | 7 | 620 | 722 |
| Alcatraz | W | 7 | 337 | 379 |
| Hillegass | N | 4 | 48 | 62 |
| Hillegass | S | 4 | 185 | 188 |
| Colby | N | 7 | 139 | 157 |
| Colby | S | 7 | 259 | 290 |
| Martin | E | 2 | 86 | 86 |
| Martin | W | 2 | 220 | 220 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 317 | Telegraph Avenue | 1151 |
| 290 | Telegraph Avenue | 1118 |
| 374 | Grove Shafter Freeway | 1026 |
| 227 | Grove Shafter Freeway | 649 |
| 351 | Claremont Avenue | 591 |
| 363 | Alcatraz Avenue | 568 |
| 226 | Aileen Street / Telegraph Avenue | 229 |
| 276 | Broadway / College Avenue | 198 |
| 266 | Broadway / Manila Avenue | 197 |
| 298 | Broadway | 197 |
