# Calibration report: rockridge midday scale 1 seed 1 (60 min)

Offered demand 16182 veh/h x scale 1 = 16182 veh/h. Run took 30.7 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 14 | FAIL |
| Backlog / spawned | < 2% | 2.9% (462 of 15843) | FAIL |
| Arterial mean speed (run) | > 4 m/s | 6.50 m/s (last 15 min 5.95) | pass |

Overall: **NOT STABLE**. Mean trip delay 408 s, mean trip time 820 s, completed 11180, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1270 | 9 | 61 | 0 | 9.22 |
| 10 | 2256 | 43 | 443 | 0 | 7.97 |
| 15 | 2825 | 69 | 1198 | 0 | 7.07 |
| 20 | 3187 | 94 | 2133 | 0 | 7.09 |
| 25 | 3469 | 141 | 3179 | 0 | 7.01 |
| 30 | 3715 | 184 | 4250 | 4 | 6.63 |
| 35 | 3934 | 223 | 5344 | 5 | 6.24 |
| 40 | 4119 | 278 | 6482 | 6 | 6.49 |
| 45 | 4259 | 334 | 7669 | 6 | 5.88 |
| 50 | 4403 | 365 | 8843 | 9 | 5.55 |
| 55 | 4514 | 418 | 10006 | 13 | 6.21 |
| 60 | 4649 | 462 | 11180 | 14 | 6.08 |
## Per-mode results

Offered: 16182 car veh/h; 858 bicycle flows (812/h); 2000 pedestrian flows (2808/h); 0 bus routes running (0 dropped as unlinked, 0 runs blocked). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 4649 | 11180 | 820 | |
| Bus | 0 | 0 | 0 | mean speed 0.00 m/s |
| Bicycle | 101 | 706 | 368 | |
| Pedestrian | 383 | 2291 | 494 | mean crossing delay 5.7 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 466, bicycle conflicts 294, close passes 483, pedestrian injury-risk index 0.039, bicycle injury-risk index 0.038 (proxy), mean vehicle speed at pedestrian encounters 2.26 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 97 trips (82 completed)
- Colby Street NB: 9 links (path Claremont Avenue -> Alcatraz Avenue (674 m)), 153 trips (109 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 185 trips (147 completed)
- Colby Street SB: 9 links (path Alcatraz Avenue -> Claremont Avenue (674 m)), 254 trips (197 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 73% | +26 | 97 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 6% | -15 | 97 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 10% | +4 | 97 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 43% | +16 | 97 |  |
| Colby Street NB | from | freeway | 47% | 46% | -1 | 153 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 46% | -2 | 153 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 51% | +26 | 153 |  |
| Colby Street NB | to | College Avenue | 3% | 12% | +9 | 153 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 23% | -23 | 185 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 5% | -21 | 185 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 17% | +1 | 185 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 64% | +7 | 185 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 45% | +2 | 254 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 24% | -22 | 254 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 44% | +22 | 254 |  |
| Colby Street SB | to | freeway | 45% | 36% | -9 | 254 | within |
| Colby Street SB | to | Forest Street | 34% | 52% | +18 | 254 |  |

Headline shares within tolerance: 3 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only; modeled shares are over all trips on the ramps (so modeled is an upper bound for streets that serve both sides).

| Direction | Via | Observed | Modeled | n ramp trips |
| --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 14% | 646 |
| onto freeway | Hillegass Avenue | 12% | 11% | 646 |
| onto freeway | Martin Street | 10% | 19% | 646 |
| onto freeway | Colby Street | 8% | 8% | 646 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 59% | 646 |
| onto freeway | Benvenue Avenue | 5% | 2% | 646 |
| from freeway | College Avenue | 10% | 9% | 882 |
| from freeway | Martin Street | 10% | 19% | 882 |
| from freeway | Colby Street | 8% | 10% | 882 |
| from freeway | Hillegass Avenue | 5% | 8% | 882 |
| from freeway | Benvenue Avenue | 3% | 2% | 882 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 5099 | (unnamed) | Motorway | 2 | 150 | uncontrolled | 31.11 | 22.83 | 22.8 | 670 |
| 4619 | Tunnel Road | Tertiary | 1 | 1309 | two_way_stop | 26.34 | 21.91 | 21.9 | 120 |
| 5103 | (unnamed) | Motorway | 2 | 513 | uncontrolled | 19.03 | 11.20 | 11.2 | 638 |
| 5102 | 45th Street | Residential | 1 | 363 | uncontrolled | 15.89 | 13.76 | 13.8 | 188 |
| 2015 | Telegraph Avenue | Secondary | 2 | 94 | signal | 13.27 | 11.08 | 11.1 | 493 |
| 1049 | 55th Street | Tertiary | 1 | 238 | signal | 12.59 | 8.38 | 8.4 | 632 |
| 3567 | Ramona Avenue | Residential | 1 | 216 | uncontrolled | 11.15 | 2.60 | 2.6 | 520 |
| 1059 | 56th Street | Residential | 1 | 243 | two_way_stop | 10.93 | 9.81 | 9.8 | 77 |
| 2070 | 52nd Street | Secondary | 4 | 53 | signal | 10.75 | 9.07 | 9.1 | 734 |
| 2371 | (unnamed) | Motorway | 2 | 188 | signal | 10.29 | 5.19 | 5.2 | 1135 |
| 42 | 40th Street | Secondary | 4 | 77 | signal | 10.06 | 8.39 | 8.4 | 532 |
| 2449 | Claremont Avenue | Secondary | 2 | 194 | signal | 10.03 | 7.27 | 7.3 | 568 |
| 1981 | (unnamed) | Motorway | 2 | 112 | signal | 9.08 | 6.00 | 6.0 | 877 |
| 5101 | 45th Street | Residential | 1 | 363 | signal | 8.65 | 4.85 | 4.9 | 468 |
| 268 | San Pablo Avenue | Primary | 2 | 78 | signal | 8.32 | 7.01 | 7.0 | 348 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 855 | 52nd Street / Shattuck Avenue | signal |  | 4.47 | 0.59 | 75 s: 50/15 |
| 480 | 55th Street / Martin Luther King Junior Way | signal |  | 3.80 | 0.18 | 75 s: 37/28 |
| 790 | 52nd Street / Claremont Avenue / Telegraph Avenue | signal |  | 3.56 | 0.15 | 75 s: 18/15/27 |
| 423 | 40th Street / Market Street | signal |  | 3.42 | 0.22 | 75 s: 35/30 |
| 426 | 40th Street / West Street | signal |  | 3.36 | 0.27 | 75 s: 15/50 |
| 598 | Market Street / Stanford Avenue | signal |  | 3.24 | 0.14 | 75 s: 49/16 |
| 850 | 55th Street / Telegraph Avenue | signal |  | 3.14 | 0.23 | 75 s: 15/50 |
| 35 | 40th Street / Adeline Street | signal |  | 3.09 | 0.19 | 75 s: 49/16 |
| 1036 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.98 | 0.06 | 75 s: 37/28 |
| 274 | Alcatraz Avenue / Sacramento Street | signal |  | 2.96 | 0.03 | 75 s: 48/17 |
| 1298 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.91 | 0.02 | 75 s: 15/30/15 |
| 653 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.85 | 0.06 | 75 s: 28/37 |
| 147 | Park Avenue / San Pablo Avenue | signal |  | 2.85 | 0.01 | 75 s: 17/48 |
| 599 | Adeline Street / Alcatraz Avenue | signal |  | 2.74 | 0.07 | 75 s: 20/45 |
| 17 | 40th Street / San Pablo Avenue | signal |  | 2.73 | 0.01 | 75 s: 26/39 |

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 2014 | Telegraph Avenue | Aileen Street / Telegraph Avenue | signal | 4 | 27.3 |
| 1080 | Adeline Street | 56th Street / Adeline Street | two_way_stop | 1 | 28.5 |
| 2337 | North Street | North Street / Telegraph Avenue | two_way_stop | 1 | 29.9 |
| 1011 | 45th Street | 45th Street / West Street | all_way_stop | 1 | 32.4 |
| 927 | 44th Street | 44th Street / Market Street | two_way_stop | 1 | 39.4 |
| 940 | 43rd Street | 43rd Street / West Street | two_way_stop | 1 | 49.6 |
| 2163 | 52nd Street | 52nd Street | uncontrolled | 1 | 50.9 |
| 2070 | 52nd Street | 52nd Street / Shattuck Avenue | signal | 1 | 51.0 |
| 1094 | West Street | 42nd Street / West Street | all_way_stop | 1 | 51.3 |
| 895 | West Street | West Street | uncontrolled | 1 | 51.3 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 2123 | (unnamed) | 212 | 894 |
| 2124 | (unnamed) | 146 | 895 |
| 775 | Telegraph Avenue | 75 | 386 |
| 2114 | Market Street | 21 | 414 |
| 425 | West Street | 7 | 311 |
| 839 | 58th Street / Carberry Avenue | 1 | 15 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 744 | 950 |
| Telegraph | S | 10 | 368 | 427 |
| College | N | 3 | 182 | 182 |
| College | S | 3 | 529 | 535 |
| Claremont | N | 6 | 275 | 425 |
| Claremont | S | 7 | 544 | 884 |
| Alcatraz | E | 7 | 252 | 295 |
| Alcatraz | W | 7 | 277 | 306 |
| Hillegass | N | 4 | 58 | 78 |
| Hillegass | S | 4 | 125 | 125 |
| Colby | N | 7 | 64 | 79 |
| Colby | S | 7 | 133 | 150 |
| Martin | E | 2 | 146 | 146 |
| Martin | W | 2 | 168 | 168 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 2124 | (unnamed) | 895 |
| 2123 | (unnamed) | 894 |
| 373 | Ashby Avenue | 796 |
| 1128 | Telegraph Avenue / Ward Street | 739 |
| 2120 | Grove Shafter Freeway | 575 |
| 2122 | (unnamed) | 575 |
| 31 | 40th Street | 525 |
| 29 | San Pablo Avenue | 521 |
| 2100 | Grove Shafter Freeway | 433 |
| 2114 | Market Street | 414 |
