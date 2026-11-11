# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 7523 veh/h x scale 1 = 7523 veh/h. Run took 1.6 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 6 | FAIL |
| Backlog / spawned | < 2% | 0.7% (53 of 7566) | pass |
| Arterial mean speed (run) | > 4 m/s | 4.40 m/s (last 15 min 3.68) | pass |

Overall: **NOT STABLE**. Mean trip delay 298 s, mean trip time 512 s, completed 6060, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 544 | 0 | 91 | 0 | 7.39 |
| 10 | 759 | 6 | 496 | 0 | 5.84 |
| 15 | 831 | 7 | 1049 | 0 | 5.65 |
| 20 | 910 | 1 | 1598 | 0 | 5.48 |
| 25 | 998 | 6 | 2173 | 0 | 4.97 |
| 30 | 1169 | 9 | 2648 | 0 | 4.50 |
| 35 | 1210 | 20 | 3221 | 0 | 4.48 |
| 40 | 1199 | 71 | 3812 | 1 | 3.85 |
| 45 | 1325 | 48 | 4373 | 2 | 3.50 |
| 50 | 1354 | 78 | 4935 | 3 | 3.34 |
| 55 | 1415 | 71 | 5498 | 3 | 3.91 |
| 60 | 1500 | 53 | 6060 | 6 | 3.79 |

## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 157 trips (95 completed)
- Colby Street NB: 9 links (path Claremont Avenue -> Alcatraz Avenue (667 m)), 303 trips (238 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 254 trips (201 completed)
- Colby Street SB: 9 links (path Alcatraz Avenue -> Claremont Avenue (667 m)), 467 trips (376 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 46% | -1 | 157 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 0% | -33 | 157 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 6% | +0 | 157 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 39% | +12 | 157 |  |
| Colby Street NB | from | freeway | 47% | 56% | +9 | 303 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 45% | -3 | 303 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 51% | +26 | 303 |  |
| Colby Street NB | to | College Avenue | 3% | 5% | +2 | 303 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 11% | -35 | 254 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 1% | -25 | 254 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 3% | -13 | 254 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 52% | -16 | 254 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 48% | +5 | 467 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 13% | -33 | 467 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 61% | +39 | 467 |  |
| Colby Street SB | to | freeway | 45% | 52% | +7 | 467 | within |
| Colby Street SB | to | Forest Street | 34% | 17% | -17 | 467 |  |

Headline shares within tolerance: 3 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only; modeled shares are over all trips on the ramps (so modeled is an upper bound for streets that serve both sides).

| Direction | Via | Observed | Modeled | n ramp trips |
| --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 13% | 753 |
| onto freeway | Hillegass Avenue | 12% | 13% | 753 |
| onto freeway | Martin Street | 10% | 11% | 753 |
| onto freeway | Colby Street | 8% | 26% | 753 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 60% | 753 |
| onto freeway | Benvenue Avenue | 5% | 0% | 753 |
| from freeway | College Avenue | 10% | 13% | 974 |
| from freeway | Martin Street | 10% | 18% | 974 |
| from freeway | Colby Street | 8% | 19% | 974 |
| from freeway | Hillegass Avenue | 5% | 8% | 974 |
| from freeway | Benvenue Avenue | 3% | 0% | 974 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 379 | (unnamed) | Motorway | 2 | 188 | signal | 24.16 | 19.13 | 19.1 | 643 |
| 602 | Claremont Avenue | Secondary | 2 | 194 | signal | 20.34 | 13.59 | 13.6 | 863 |
| 497 | Telegraph Avenue | Secondary | 2 | 94 | signal | 20.11 | 17.76 | 17.8 | 403 |
| 381 | (unnamed) | Motorway | 2 | 112 | signal | 14.98 | 10.69 | 10.7 | 942 |
| 723 | Claremont Avenue | Secondary | 2 | 150 | signal | 13.01 | 11.18 | 11.2 | 468 |
| 876 | (unnamed) | Motorway | 1 | 293 | uncontrolled | 11.57 | 6.04 | 6.0 | 960 |
| 657 | 51st Street | Secondary | 3 | 64 | signal | 10.48 | 9.62 | 9.6 | 316 |
| 595 | Claremont Avenue | Secondary | 2 | 182 | signal | 9.32 | 6.95 | 6.9 | 707 |
| 897 | Grove Shafter Freeway | Motorway | 4 | 51 | uncontrolled | 7.98 | 5.64 | 5.6 | 990 |
| 166 | Hillegass Avenue | Residential | 1 | 298 | two_way_stop | 7.82 | 7.05 | 7.1 | 80 |
| 50 | Colby Street | Residential | 1 | 158 | signal | 7.61 | 6.06 | 6.1 | 182 |
| 617 | Telegraph Avenue | Secondary | 3 | 46 | signal | 7.56 | 4.86 | 4.9 | 1046 |
| 496 | Telegraph Avenue | Secondary | 2 | 61 | signal | 7.46 | 6.49 | 6.5 | 290 |
| 777 | Claremont Avenue | Secondary | 2 | 90 | two_way_stop | 7.13 | 5.07 | 5.1 | 707 |
| 448 | Alcatraz Avenue | Tertiary | 1 | 200 | signal | 6.71 | 5.72 | 5.7 | 232 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space |
| --- | --- | --- | --- | --- | --- |
| 310 | Alcatraz Avenue / Telegraph Avenue | signal |  | 5.83 | 0.27 |
| 38 | Claremont Avenue / Colby Street / Forest Street | signal |  | 3.94 | 0.01 |
| 284 | 51st Street / Telegraph Avenue | signal |  | 3.87 | 0.28 |
| 226 | Aileen Street / Telegraph Avenue | signal |  | 3.28 | 0.63 |
| 273 | 56th Street / Telegraph Avenue | signal |  | 3.03 | 0.00 |
| 70 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.88 | 0.18 |
| 48 | 52nd Street / Claremont Avenue / Telegraph Avenue | signal |  | 2.61 | 0.02 |
| 234 | Claremont Avenue / Clifton Street | signal |  | 2.46 | 0.25 |
| 213 | Claremont Avenue / Hudson Street | signal |  | 2.34 | 0.20 |
| 265 | College Avenue / Hudson Street / Manila Avenue | signal |  | 2.12 | 0.06 |
| 253 | Alcatraz Avenue / College Avenue | signal |  | 2.06 | 0.09 |
| 211 | 55th Street / Telegraph Avenue | signal |  | 1.46 | 0.46 |
| 172 | 57th Street / Telegraph Avenue | two_way_stop |  | 1.39 | 0.89 |
| 120 | 63rd Street / Telegraph Avenue | two_way_stop |  | 1.35 | 0.08 |
| 151 | 59th Street / Telegraph Avenue | signal |  | 1.20 | 0.01 |

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 897 | Grove Shafter Freeway | Grove Shafter Freeway | uncontrolled | 2 | 45.3 |
| 279 | 57th Street | 57th Street / Telegraph Avenue | two_way_stop | 1 | 35.8 |
| 376 | Aileen Street | Aileen Street / Telegraph Avenue | signal | 1 | 40.5 |
| 304 | Redondo Avenue | Cavour Street / Redondo Avenue | uncontrolled | 1 | 56.7 |
| 74 | Ayala Avenue | Ayala Avenue / Martin Street | two_way_stop | 1 | 58.6 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 374 | Grove Shafter Freeway | 40 | 1026 |
| 317 | Telegraph Avenue | 6 | 1151 |
| 351 | Claremont Avenue | 4 | 591 |
| 110 | Alcatraz Avenue / Benvenue Avenue | 2 | 88 |
| 226 | Aileen Street / Telegraph Avenue | 1 | 229 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 1110 | 1492 |
| Telegraph | S | 10 | 685 | 742 |
| College | N | 3 | 300 | 301 |
| College | S | 3 | 706 | 716 |
| Claremont | N | 6 | 427 | 707 |
| Claremont | S | 7 | 714 | 1237 |
| Alcatraz | E | 7 | 611 | 631 |
| Alcatraz | W | 7 | 347 | 368 |
| Hillegass | N | 4 | 89 | 116 |
| Hillegass | S | 4 | 144 | 172 |
| Colby | N | 7 | 164 | 216 |
| Colby | S | 7 | 184 | 253 |
| Martin | E | 2 | 142 | 142 |
| Martin | W | 2 | 197 | 197 |

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
