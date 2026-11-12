# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 20315 veh/h x scale 1 = 20315 veh/h. Run took 24.2 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (3 of 20253) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.81 m/s (last 15 min 9.67) | pass |

Overall: **STABLE**. Mean trip delay 105 s, mean trip time 405 s, completed 17841, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1469 | 0 | 224 | 0 | 11.53 |
| 10 | 2057 | 0 | 1263 | 0 | 10.35 |
| 15 | 2291 | 3 | 2746 | 0 | 9.91 |
| 20 | 2353 | 1 | 4412 | 0 | 9.73 |
| 25 | 2331 | 0 | 6110 | 0 | 9.80 |
| 30 | 2364 | 5 | 7797 | 0 | 9.77 |
| 35 | 2390 | 1 | 9451 | 0 | 9.85 |
| 40 | 2451 | 0 | 11106 | 0 | 9.53 |
| 45 | 2334 | 11 | 12868 | 0 | 9.59 |
| 50 | 2391 | 0 | 14509 | 0 | 9.66 |
| 55 | 2471 | 5 | 16148 | 0 | 9.78 |
| 60 | 2412 | 3 | 17841 | 0 | 9.57 |
## Per-mode results

Offered: 20315 car veh/h; 1500 bicycle flows (1061/h); 2000 pedestrian flows (1540/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 2412 | 17841 | 405 | |
| Bicycle | 105 | 954 | 350 | |
| Pedestrian | 196 | 1228 | 480 | mean crossing delay 5.7 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 280, bicycle conflicts 1284, close passes 694, pedestrian injury-risk index 0.046, bicycle injury-risk index 0.047 (proxy), mean vehicle speed at pedestrian encounters 2.54 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 85 trips (81 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 65 trips (60 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 120 trips (114 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 143 trips (123 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 67% | +20 | 85 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 4% | -17 | 85 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 2% | -4 | 85 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 26% | -1 | 85 |  |
| Colby Street NB | from | freeway | 47% | 38% | -9 | 65 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 23% | -25 | 65 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 23% | -2 | 65 |  |
| Colby Street NB | to | College Avenue | 3% | 12% | +9 | 65 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 18% | -29 | 120 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 9% | -17 | 120 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 10% | -6 | 120 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 63% | +6 | 120 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 10% | -33 | 143 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 35% | -11 | 143 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 43% | +21 | 143 |  |
| Colby Street SB | to | freeway | 45% | 29% | -16 | 143 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 49% | +15 | 143 |  |

Headline shares within tolerance: 2 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 17% | 752 | 16% | 710 |
| onto freeway | Hillegass Avenue | 12% | 12% | 752 | 13% | 710 |
| onto freeway | Martin Street | 10% | 10% | 752 | 10% | 710 |
| onto freeway | Colby Street | 8% | 6% | 752 | 7% | 710 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 14% | 752 | 12% | 710 |
| onto freeway | Benvenue Avenue | 5% | 4% | 752 | 4% | 710 |
| from freeway | College Avenue | 10% | 9% | 1234 | 8% | 927 |
| from freeway | Martin Street | 10% | 9% | 1234 | 12% | 927 |
| from freeway | Colby Street | 8% | 7% | 1234 | 9% | 927 |
| from freeway | Hillegass Avenue | 5% | 6% | 1234 | 7% | 927 |
| from freeway | Benvenue Avenue | 3% | 2% | 1234 | 2% | 927 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1679 | 52nd Street | Secondary | 4 | 53 | signal | 9.74 | 7.88 | 7.9 | 720 |
| 4436 | Ashby Avenue | Primary | 2 | 96 | signal | 6.99 | 6.04 | 6.0 | 272 |
| 265 | 59th Street | Residential | 1 | 150 | two_way_stop | 6.58 | 6.05 | 6.0 | 53 |
| 315 | Stanford Avenue | Secondary | 2 | 354 | uncontrolled | 6.53 | 3.02 | 3.0 | 1234 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 6.28 | 4.61 | 4.6 | 787 |
| 225 | 61st Street | Residential | 1 | 137 | two_way_stop | 5.76 | 4.05 | 4.1 | 235 |
| 108 | Stanford Avenue | Secondary | 3 | 61 | signal | 4.99 | 3.08 | 3.1 | 1224 |
| 2272 | Telegraph Avenue | Secondary | 2 | 104 | signal | 4.30 | 2.22 | 2.2 | 1722 |
| 728 | 55th Street | Tertiary | 1 | 238 | signal | 4.17 | 3.09 | 3.1 | 400 |
| 2327 | Telegraph Avenue | Secondary | 2 | 104 | signal | 4.05 | 2.54 | 2.5 | 1282 |
| 4191 | (unnamed) | Motorway | 2 | 513 | uncontrolled | 3.87 | 1.63 | 1.6 | 578 |
| 1768 | Shattuck Avenue | Tertiary | 1 | 89 | signal | 3.72 | 2.62 | 2.6 | 674 |
| 778 | Martin Luther King Junior Way | Secondary | 4 | 32 | signal | 3.71 | 2.77 | 2.8 | 1505 |
| 338 | San Pablo Avenue | Primary | 3 | 37 | two_way_stop | 3.64 | 2.12 | 2.1 | 1508 |
| 251 | 60th Street | Residential | 1 | 127 | two_way_stop | 3.61 | 3.23 | 3.2 | 84 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 688 | 52nd Street / Shattuck Avenue | signal |  | 4.09 | 0.22 | 75 s: 25/40 |
| 454 | Market Street / Stanford Avenue | signal |  | 3.20 | 0.12 | 75 s: 46/19 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 2.78 | 0.03 | 75 s: 28/37 |
| 863 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.51 | 0.03 | 75 s: 38/27 |
| 1422 | Ashby Avenue / Claremont Avenue | signal |  | 2.49 | 0.03 | 75 s: 34/31 |
| 1095 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.42 | 0.00 | 75 s: 25/20/15 |
| 1389 | Ashby Avenue / Domingo Avenue / Tunnel Road | signal |  | 2.24 | 0.12 | 75 s: 30/15/15 |
| 455 | Adeline Street / Alcatraz Avenue | signal |  | 2.16 | 0.01 | 75 s: 26/39 |
| 956 | Ashby Avenue / Shattuck Avenue | signal |  | 2.11 | 0.01 | 75 s: 42/23 |
| 509 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.10 | 0.04 | 75 s: 22/43 |
| 339 | 52nd Street / Martin Luther King Junior Way | signal |  | 2.06 | 0.02 | 60 s: 60 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.03 | 0.01 | 75 s: 35/30 |
| 959 | Ashby Avenue / Telegraph Avenue | signal |  | 1.91 | 0.00 | 75 s: 20/45 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 1.86 | 0.03 | 75 s: 49/16 |
| 346 | 55th Street / Shattuck Avenue | signal |  | 1.81 | 0.03 | 85 s: 39/36 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 688: 25 s: 52nd Street 4L [1679], 52nd Street 4L [1683]; 40 s: Shattuck Avenue 2L [1670], Shattuck Avenue 2L [1722]
- node 454: 46 s: Stanford Avenue 1L [958], Stanford Avenue 3L [1072]; 19 s: Market Street 4L [1125], Market Street 3L [1128]
- node 37: 28 s: San Pablo Avenue 3L [114], San Pablo Avenue 3L [115]; 37 s: Stanford Avenue 3L [108], Stanford Avenue 2L [4140]
- node 863: 38 s: Telegraph Avenue 3L [2063], Telegraph Avenue 3L [2064]; 27 s: Alcatraz Avenue 2L [2057], Alcatraz Avenue 2L [2086]
- node 1422: 34 s: Ashby Avenue 1L [3426], Ashby Avenue 2L [3457]; 31 s: Claremont Avenue 3L [3478], Claremont Avenue 2L [4366]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 183 | San Pablo Avenue | 3 | 1467 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 750 | 769 |
| Telegraph | S | 10 | 983 | 1086 |
| College | N | 3 | 182 | 182 |
| College | S | 3 | 319 | 322 |
| Claremont | N | 6 | 644 | 860 |
| Claremont | S | 7 | 512 | 830 |
| Alcatraz | E | 6 | 338 | 359 |
| Alcatraz | W | 6 | 491 | 494 |
| Hillegass | N | 4 | 64 | 76 |
| Hillegass | S | 4 | 73 | 92 |
| Colby | N | 7 | 22 | 28 |
| Colby | S | 7 | 78 | 84 |
| Martin | E | 2 | 88 | 88 |
| Martin | W | 2 | 126 | 126 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 610 | Grove Shafter Freeway | 4119 |
| 955 | Telegraph Avenue / Ward Street | 2059 |
| 1688 | Warren Freeway | 1491 |
| 183 | San Pablo Avenue | 1467 |
| 266 | Ashby Avenue | 1242 |
| 104 | San Pablo Avenue | 530 |
| 1774 | Claremont Avenue | 520 |
| 283 | Market Street | 492 |
| 771 | Telegraph Avenue | 466 |
| 1735 | Grove Shafter Freeway | 289 |
