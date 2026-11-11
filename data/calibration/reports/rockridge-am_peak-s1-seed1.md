# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 6992 veh/h x scale 1 = 6992 veh/h. Run took 1.3 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 14 | FAIL |
| Backlog / spawned | < 2% | 1.6% (110 of 6979) | pass |
| Arterial mean speed (run) | > 4 m/s | 5.13 m/s (last 15 min 4.22) | pass |

Overall: **NOT STABLE**. Mean trip delay 235 s, mean trip time 447 s, completed 5867, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 482 | 5 | 96 | 0 | 7.64 |
| 10 | 611 | 34 | 549 | 0 | 6.58 |
| 15 | 659 | 32 | 1064 | 1 | 6.26 |
| 20 | 727 | 56 | 1576 | 1 | 6.01 |
| 25 | 793 | 73 | 2095 | 1 | 5.60 |
| 30 | 831 | 87 | 2645 | 3 | 4.98 |
| 35 | 873 | 94 | 3161 | 4 | 5.07 |
| 40 | 1002 | 89 | 3669 | 6 | 5.03 |
| 45 | 1006 | 91 | 4244 | 9 | 4.81 |
| 50 | 986 | 106 | 4803 | 12 | 4.02 |
| 55 | 1015 | 112 | 5367 | 13 | 4.41 |
| 60 | 1098 | 110 | 5867 | 14 | 4.23 |

## Select-link shares: modelled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 5 links (path Claremont Avenue -> Alcatraz Avenue (424 m)), 104 trips (94 completed)
- Colby Street NB: 10 links (path Claremont Avenue -> Alcatraz Avenue (664 m)), 184 trips (162 completed)
- Hillegass Avenue SB: 5 links (path Alcatraz Avenue -> Claremont Avenue (424 m)), 107 trips (99 completed)
- Colby Street SB: 10 links (path Alcatraz Avenue -> Claremont Avenue (664 m)), 340 trips (292 completed)

| Block | Side | Via | Observed | Modelled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 30% | -17 | 104 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 0% | -21 | 104 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 12% | +6 | 104 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 42% | +15 | 104 |  |
| Colby Street NB | from | freeway | 47% | 47% | -0 | 184 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 38% | -10 | 184 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 40% | +15 | 184 |  |
| Colby Street NB | to | College Avenue | 3% | 5% | +2 | 184 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 22% | -24 | 107 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 2% | -24 | 107 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 15% | -1 | 107 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 36% | -21 | 107 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 38% | -5 | 340 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 25% | -21 | 340 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 32% | +10 | 340 |  |
| Colby Street SB | to | freeway | 45% | 70% | +25 | 340 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 20% | -14 | 340 |  |

Headline shares within tolerance: 1 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only; modelled shares are over all trips on the ramps (so modelled is an upper bound for streets that serve both sides).

| Direction | Via | Observed | Modelled | n ramp trips |
| --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 14% | 718 |
| onto freeway | Hillegass Avenue | 12% | 5% | 718 |
| onto freeway | Martin Street | 10% | 23% | 718 |
| onto freeway | Colby Street | 8% | 24% | 718 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 45% | 718 |
| onto freeway | Benvenue Avenue | 5% | 1% | 718 |
| from freeway | College Avenue | 10% | 22% | 876 |
| from freeway | Martin Street | 10% | 29% | 876 |
| from freeway | Colby Street | 8% | 8% | 876 |
| from freeway | Hillegass Avenue | 5% | 4% | 876 |
| from freeway | Benvenue Avenue | 3% | 0% | 876 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 394 | (unnamed) | Motorway | 2 | 182 | signal | 21.76 | 18.12 | 18.1 | 463 |
| 396 | (unnamed) | Motorway | 2 | 112 | signal | 13.49 | 9.63 | 9.6 | 864 |
| 628 | Claremont Avenue | Secondary | 2 | 194 | signal | 12.14 | 9.52 | 9.5 | 540 |
| 518 | Telegraph Avenue | Secondary | 2 | 90 | signal | 11.39 | 8.14 | 8.1 | 1202 |
| 637 | Telegraph Avenue | Secondary | 2 | 74 | uncontrolled | 9.95 | 6.13 | 6.1 | 872 |
| 757 | Claremont Avenue | Secondary | 2 | 145 | signal | 9.20 | 7.93 | 7.9 | 239 |
| 918 | (unnamed) | Motorway | 1 | 293 | uncontrolled | 8.27 | 4.46 | 4.5 | 877 |
| 639 | Telegraph Avenue | Secondary | 3 | 44 | signal | 8.11 | 5.79 | 5.8 | 907 |
| 813 | Claremont Avenue | Secondary | 2 | 86 | two_way_stop | 6.88 | 5.37 | 5.4 | 439 |
| 949 | (unnamed) | Service | 1 | 124 | uncontrolled | 6.73 | 6.46 | 6.5 | 54 |
| 938 | Telegraph Avenue | Secondary | 2 | 48 | uncontrolled | 6.60 | 4.06 | 4.1 | 908 |
| 619 | Claremont Avenue | Secondary | 2 | 177 | signal | 6.41 | 5.45 | 5.5 | 278 |
| 546 | Forest Street | Residential | 1 | 95 | signal | 5.62 | 4.78 | 4.8 | 233 |
| 47 | Martin Street | Residential | 1 | 110 | two_way_stop | 5.52 | 3.00 | 3.0 | 280 |
| 48 | Martin Street | Residential | 1 | 110 | two_way_stop | 5.33 | 4.00 | 4.0 | 158 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space |
| --- | --- | --- | --- | --- | --- |
| 336 | Alcatraz Avenue / Telegraph Avenue | signal |  | 5.27 | 0.08 |
| 50 | 52nd Street / Claremont Avenue / Telegraph Avenue | signal |  | 3.48 | 0.37 |
| 270 | Claremont Avenue / Forest Street | signal |  | 2.88 | 0.30 |
| 306 | 51st Street / Telegraph Avenue | signal |  | 2.75 | 0.11 |
| 39 | Claremont Avenue / Colby Street | signal |  | 2.32 | 0.80 |
| 75 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.26 | 0.08 |
| 223 | 55th Street / Telegraph Avenue | signal |  | 2.07 | 0.67 |
| 53 | 56th Street / Telegraph Avenue | signal |  | 1.93 | 0.74 |
| 246 | Aileen Street / Telegraph Avenue | signal |  | 1.85 | 0.19 |
| 250 | Claremont Avenue / Clifton Street | signal |  | 1.75 | 0.06 |
| 273 | Alcatraz Avenue / College Avenue | signal |  | 1.53 | 0.04 |
| 287 | College Avenue / Hudson Street / Manila Avenue | signal |  | 1.46 | 0.03 |
| 304 | College Avenue / Keith Avenue / Shafter Avenue | signal |  | 1.40 | 0.08 |
| 52 | 56th Street / Telegraph Avenue | signal |  | 1.39 | 0.04 |
| 327 | Telegraph Avenue | uncontrolled |  | 1.39 | 1.23 |

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 884 | 56th Street | 56th Street / Telegraph Avenue | signal | 6 | 14.2 |
| 527 | Aileen Street | Aileen Street / Telegraph Avenue | signal | 2 | 35.7 |
| 828 | Hudson Street | Claremont Avenue / Hudson Street | signal | 1 | 27.8 |
| 905 | Cavour Street | Cavour Street / Claremont Avenue | two_way_stop | 1 | 44.2 |
| 604 | Claremont Avenue | Claremont Avenue / Vicente Way | two_way_stop | 1 | 44.3 |
| 940 | Claremont Avenue | Claremont Avenue / Hudson Street | signal | 1 | 47.4 |
| 955 | Grove Shafter Freeway | Grove Shafter Freeway | uncontrolled | 1 | 53.6 |
| 832 | Aileen Street | Aileen Street | uncontrolled | 1 | 56.4 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 343 | Telegraph Avenue | 109 | 1226 |
| 203 | Forest Street / Locksley Avenue | 1 | 202 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 13 | 1288 | 1342 |
| Telegraph | S | 13 | 1133 | 1214 |
| College | N | 10 | 623 | 689 |
| College | S | 10 | 548 | 583 |
| Claremont | N | 7 | 228 | 540 |
| Claremont | S | 8 | 278 | 828 |
| Alcatraz | E | 7 | 492 | 582 |
| Alcatraz | W | 7 | 500 | 563 |
| Hillegass | N | 4 | 48 | 62 |
| Hillegass | S | 4 | 60 | 64 |
| Colby | N | 7 | 74 | 116 |
| Colby | S | 7 | 193 | 245 |
| Martin | E | 2 | 158 | 158 |
| Martin | W | 2 | 280 | 280 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 343 | Telegraph Avenue | 1226 |
| 311 | Telegraph Avenue | 956 |
| 404 | Grove Shafter Freeway | 880 |
| 379 | Claremont Avenue | 654 |
| 391 | Alcatraz Avenue | 627 |
| 242 | Grove Shafter Freeway | 551 |
| 203 | Forest Street / Locksley Avenue | 202 |
| 288 | Broadway / Manila Avenue | 188 |
| 321 | Broadway | 188 |
| 241 | Aileen Street / Telegraph Avenue | 161 |
