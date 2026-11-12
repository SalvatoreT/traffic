# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 20594 veh/h x scale 1 = 20594 veh/h. Run took 32.2 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 1.1% (217 of 20315) | pass |
| Arterial mean speed (run) | > 4 m/s | 8.23 m/s (last 15 min 7.57) | pass |

Overall: **STABLE**. Mean trip delay 173 s, mean trip time 490 s, completed 17313, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1501 | 0 | 167 | 0 | 10.95 |
| 10 | 2331 | 2 | 1079 | 0 | 9.32 |
| 15 | 2775 | 4 | 2489 | 0 | 8.94 |
| 20 | 2863 | 1 | 4057 | 0 | 8.69 |
| 25 | 2801 | 4 | 5847 | 0 | 8.05 |
| 30 | 2900 | 13 | 7457 | 0 | 8.06 |
| 35 | 3022 | 21 | 9008 | 0 | 8.02 |
| 40 | 2926 | 91 | 10754 | 0 | 8.22 |
| 45 | 2860 | 82 | 12498 | 0 | 8.29 |
| 50 | 3038 | 54 | 14048 | 0 | 7.31 |
| 55 | 3119 | 115 | 15633 | 0 | 7.59 |
| 60 | 3002 | 217 | 17313 | 0 | 7.80 |
## Per-mode results

Offered: 20594 car veh/h; 1500 bicycle flows (1056/h); 2000 pedestrian flows (1541/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 3002 | 17313 | 490 | |
| Bicycle | 97 | 949 | 356 | |
| Pedestrian | 196 | 1238 | 478 | mean crossing delay 5.9 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 285, bicycle conflicts 1402, close passes 954, pedestrian injury-risk index 0.044, bicycle injury-risk index 0.047 (proxy), mean vehicle speed at pedestrian encounters 2.46 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 84 trips (76 completed)
- Colby Street NB: 9 links (path Claremont Avenue -> Alcatraz Avenue (674 m)), 67 trips (59 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 169 trips (156 completed)
- Colby Street SB: 9 links (path Alcatraz Avenue -> Claremont Avenue (674 m)), 147 trips (133 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 67% | +20 | 84 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 10% | -11 | 84 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 5% | -1 | 84 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 30% | +3 | 84 |  |
| Colby Street NB | from | freeway | 47% | 42% | -5 | 67 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 25% | -23 | 67 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 24% | -1 | 67 |  |
| Colby Street NB | to | College Avenue | 3% | 10% | +7 | 67 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 38% | -8 | 169 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 15% | -11 | 169 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 24% | +8 | 169 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 46% | -11 | 169 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 16% | -27 | 147 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 62% | +16 | 147 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 41% | +19 | 147 |  |
| Colby Street SB | to | freeway | 45% | 21% | -24 | 147 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 47% | +13 | 147 |  |

Headline shares within tolerance: 1 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 10% | 602 | 19% | 311 |
| onto freeway | Hillegass Avenue | 12% | 7% | 602 | 13% | 311 |
| onto freeway | Martin Street | 10% | 28% | 602 | 9% | 311 |
| onto freeway | Colby Street | 8% | 2% | 602 | 5% | 311 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 30% | 602 | 5% | 311 |
| onto freeway | Benvenue Avenue | 5% | 4% | 602 | 7% | 311 |
| from freeway | College Avenue | 10% | 6% | 816 | 6% | 597 |
| from freeway | Martin Street | 10% | 12% | 816 | 17% | 597 |
| from freeway | Colby Street | 8% | 6% | 816 | 8% | 597 |
| from freeway | Hillegass Avenue | 5% | 5% | 816 | 7% | 597 |
| from freeway | Benvenue Avenue | 3% | 3% | 816 | 4% | 597 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4221 | (unnamed) | Motorway | 2 | 513 | uncontrolled | 40.08 | 27.09 | 27.1 | 787 |
| 4195 | Martin Luther King Junior Way | Secondary | 3 | 147 | uncontrolled | 17.39 | 11.40 | 11.4 | 1442 |
| 1690 | 52nd Street | Secondary | 4 | 53 | signal | 13.69 | 11.12 | 11.1 | 995 |
| 734 | 55th Street | Tertiary | 1 | 238 | signal | 11.73 | 9.39 | 9.4 | 346 |
| 4236 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 10.99 | 1.46 | 1.5 | 1452 |
| 1916 | 58th Street | Residential | 1 | 221 | two_way_stop | 8.80 | 7.90 | 7.9 | 108 |
| 744 | 56th Street | Residential | 1 | 243 | two_way_stop | 8.36 | 7.53 | 7.5 | 80 |
| 4466 | Ashby Avenue | Primary | 2 | 96 | signal | 8.20 | 7.07 | 7.1 | 292 |
| 4228 | (unnamed) | Motorway | 3 | 72 | uncontrolled | 8.02 | 2.91 | 2.9 | 2280 |
| 1697 | 52nd Street | Tertiary | 2 | 111 | uncontrolled | 7.62 | 7.01 | 7.0 | 223 |
| 4196 | 54th Street | Residential | 1 | 233 | two_way_stop | 6.95 | 6.23 | 6.2 | 100 |
| 4220 | 45th Street | Residential | 1 | 363 | uncontrolled | 6.93 | 4.02 | 4.0 | 380 |
| 784 | Martin Luther King Junior Way | Secondary | 4 | 32 | signal | 6.70 | 5.37 | 5.4 | 1444 |
| 1840 | 56th Street | Residential | 1 | 168 | two_way_stop | 6.61 | 6.22 | 6.2 | 54 |
| 1145 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 6.07 | 4.60 | 4.6 | 277 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 458 | Market Street / Stanford Avenue | signal |  | 4.75 | 0.18 | 75 s: 50/15 |
| 694 | 52nd Street / Shattuck Avenue | signal |  | 4.44 | 0.51 | 75 s: 41/24 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.58 | 0.05 | 75 s: 32/33 |
| 459 | Adeline Street / Alcatraz Avenue | signal |  | 2.98 | 0.18 | 75 s: 26/39 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.93 | 0.02 | 75 s: 45/20 |
| 1405 | Ashby Avenue / Domingo Avenue / Tunnel Road | signal |  | 2.88 | 0.14 | 75 s: 28/15/17 |
| 627 | 52nd Street / Claremont Avenue / Telegraph Avenue | signal |  | 2.87 | 0.16 | 75 s: 15/15/30 |
| 343 | 55th Street / Martin Luther King Junior Way | signal |  | 2.73 | 0.04 | 75 s: 33/32 |
| 1438 | Ashby Avenue / Claremont Avenue | signal |  | 2.70 | 0.01 | 75 s: 43/22 |
| 874 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.68 | 0.02 | 75 s: 42/23 |
| 342 | 52nd Street / Martin Luther King Junior Way | signal |  | 2.68 | 0.03 | 60 s: 60 |
| 967 | Ashby Avenue / Shattuck Avenue | signal |  | 2.37 | 0.01 | 75 s: 35/30 |
| 513 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.36 | 0.04 | 75 s: 22/43 |
| 349 | 55th Street / Shattuck Avenue | signal |  | 2.28 | 0.04 | 120 s: 45/65 |
| 1107 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.25 | 0.00 | 75 s: 18/27/15 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 1769 | (unnamed) | 217 | 2494 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 701 | 736 |
| Telegraph | S | 10 | 865 | 940 |
| College | N | 3 | 258 | 259 |
| College | S | 3 | 362 | 362 |
| Claremont | N | 6 | 410 | 572 |
| Claremont | S | 7 | 498 | 878 |
| Alcatraz | E | 6 | 326 | 347 |
| Alcatraz | W | 6 | 443 | 476 |
| Hillegass | N | 4 | 61 | 77 |
| Hillegass | S | 4 | 136 | 142 |
| Colby | N | 7 | 20 | 28 |
| Colby | S | 7 | 82 | 106 |
| Martin | E | 2 | 212 | 212 |
| Martin | W | 2 | 133 | 133 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 1769 | (unnamed) | 2494 |
| 269 | Ashby Avenue | 1234 |
| 966 | Telegraph Avenue / Ward Street | 1125 |
| 1743 | Grove Shafter Freeway | 957 |
| 104 | San Pablo Avenue | 838 |
| 183 | San Pablo Avenue | 838 |
| 615 | Grove Shafter Freeway | 819 |
| 617 | (unnamed) | 800 |
| 1704 | Warren Freeway | 720 |
| 286 | Market Street | 623 |
