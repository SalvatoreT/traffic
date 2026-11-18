# rockridge-midday-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Cars cleared from gridlock near the study area (judged zone) | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.97 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.01 | 0.01 | 0.00 | 0.02 | 0.00 to 0.01 |
| health | backlog growth in the second half of the run | points of spawned | 0.01 | 0.01 | -0.01 | 0.02 | -0.00 to 0.01 |
| health | completed trips | trips | 16635.50 | 90.20 | 16494.00 | 16831.00 | 16570.98 to 16700.02 |
| health | arterial mean speed | m/s | 9.97 | 0.06 | 9.89 | 10.07 | 9.93 to 10.01 |
| health | arterial mean speed, last 15 min | m/s | 10.04 | 0.08 | 9.88 | 10.17 | 9.99 to 10.10 |
| junction recovery | courtesy admissions per hour | veh/h | 21.80 | 4.24 | 17.00 | 29.00 | 18.77 to 24.83 |
| junction recovery | yield fallback admissions per hour | veh/h | 10.40 | 3.57 | 5.00 | 18.00 | 7.85 to 12.95 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, judged (near the study area, and far ones whose chain reaches it) | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, near the study area | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, farther out | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, farther out with a chain into the judged zone | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | trips waiting at origins in the judged zone at the end | trips | 0.40 | 0.70 | 0.00 | 2.00 | -0.10 to 0.90 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 25.33 | 1.74 | 22.51 | 28.63 | 24.09 to 26.58 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 10.0 | 0.7 | 8.9 | 11.3 | 9.5 to 10.5 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 22.29 | 3.32 | 16.81 | 28.66 | 19.92 to 24.67 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 8.8 | 1.3 | 6.6 | 11.4 | 7.9 to 9.7 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 18.70 | 2.26 | 16.00 | 23.00 | 17.08 to 20.32 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 840.50 | 39.23 | 780.00 | 919.00 | 812.44 to 868.56 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 25.70 | 3.13 | 20.00 | 31.00 | 23.46 to 27.94 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 907.70 | 37.24 | 847.00 | 946.00 | 881.07 to 934.33 |
| headline share | Hillegass Avenue NB from freeway | % | 53.0 | 2.9 | 48.9 | 57.6 | 51.0 to 55.1 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 3.6 | 1.6 | 1.3 | 7.2 | 2.4 to 4.8 |
| share | Hillegass Avenue NB to College Avenue | % | 10.3 | 2.6 | 6.6 | 14.2 | 8.5 to 12.2 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 30.3 | 3.4 | 25.2 | 35.3 | 27.9 to 32.8 |
| headline share | Colby Street NB from freeway | % | 52.1 | 2.8 | 47.5 | 56.2 | 50.1 to 54.1 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 49.7 | 5.2 | 40.5 | 57.4 | 46.0 to 53.4 |
| share | Colby Street NB to Telegraph Avenue | % | 36.7 | 6.5 | 24.4 | 46.8 | 32.1 to 41.3 |
| share | Colby Street NB to College Avenue | % | 4.3 | 1.3 | 2.2 | 6.5 | 3.4 to 5.2 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 28.7 | 3.1 | 22.4 | 32.5 | 26.5 to 30.9 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 3.3 | 1.8 | 1.5 | 7.5 | 2.0 to 4.6 |
| share | Hillegass Avenue SB from College Avenue | % | 15.8 | 3.5 | 9.2 | 20.5 | 13.2 to 18.3 |
| headline share | Hillegass Avenue SB to freeway | % | 47.8 | 4.5 | 41.0 | 57.5 | 44.6 to 51.1 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 28.8 | 4.9 | 22.3 | 37.7 | 25.3 to 32.4 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 22.4 | 4.7 | 14.5 | 29.3 | 19.1 to 25.8 |
| share | Colby Street SB from Telegraph Avenue | % | 21.0 | 3.0 | 16.9 | 26.0 | 18.9 to 23.2 |
| headline share | Colby Street SB to freeway | % | 42.3 | 4.2 | 34.9 | 48.4 | 39.3 to 45.3 |
| share | Colby Street SB to Forest Street | % | 11.5 | 2.1 | 8.3 | 14.7 | 10.0 to 13.0 |
| ramp share | onto freeway via College Avenue | % | 18.6 | 1.8 | 15.3 | 21.9 | 17.4 to 19.9 |
| ramp share | onto freeway via Hillegass Avenue | % | 16.4 | 0.9 | 14.3 | 17.6 | 15.7 to 17.1 |
| ramp share | onto freeway via Martin Street | % | 17.2 | 1.9 | 13.9 | 20.1 | 15.9 to 18.6 |
| ramp share | onto freeway via Colby Street | % | 15.9 | 2.5 | 12.6 | 19.3 | 14.1 to 17.7 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 12.0 | 1.7 | 10.3 | 16.1 | 10.7 to 13.2 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.5 | 1.0 | 2.6 | 5.8 | 3.8 to 5.2 |
| ramp share | from freeway via College Avenue | % | 10.6 | 1.1 | 9.1 | 12.6 | 9.8 to 11.4 |
| ramp share | from freeway via Martin Street | % | 13.1 | 1.0 | 11.3 | 14.7 | 12.4 to 13.9 |
| ramp share | from freeway via Colby Street | % | 11.5 | 1.5 | 9.5 | 15.0 | 10.4 to 12.5 |
| ramp share | from freeway via Hillegass Avenue | % | 7.9 | 0.9 | 6.5 | 9.2 | 7.2 to 8.5 |
| ramp share | from freeway via Benvenue Avenue | % | 3.1 | 0.7 | 2.1 | 4.4 | 2.6 to 3.6 |
| corridor flow | Telegraph N median link flow | veh/h | 637.32 | 39.55 | 572.40 | 698.40 | 609.03 to 665.61 |
| corridor flow | Telegraph S median link flow | veh/h | 606.00 | 35.03 | 559.20 | 654.00 | 580.95 to 631.05 |
| corridor flow | College N median link flow | veh/h | 236.16 | 14.66 | 208.80 | 258.00 | 225.67 to 246.65 |
| corridor flow | College S median link flow | veh/h | 436.92 | 33.30 | 370.80 | 501.60 | 413.10 to 460.74 |
| corridor flow | Claremont N median link flow | veh/h | 291.36 | 21.04 | 266.40 | 322.80 | 276.31 to 306.41 |
| corridor flow | Claremont S median link flow | veh/h | 188.52 | 32.45 | 150.00 | 247.20 | 165.31 to 211.73 |
| corridor flow | Alcatraz E median link flow | veh/h | 334.08 | 27.25 | 290.40 | 367.20 | 314.59 to 353.57 |
| corridor flow | Alcatraz W median link flow | veh/h | 224.16 | 17.84 | 189.60 | 249.60 | 211.40 to 236.92 |
| corridor flow | Hillegass N median link flow | veh/h | 66.00 | 10.84 | 40.80 | 79.20 | 58.25 to 73.75 |
| corridor flow | Hillegass S median link flow | veh/h | 67.08 | 4.02 | 60.00 | 73.20 | 64.21 to 69.95 |
| corridor flow | Colby N median link flow | veh/h | 87.96 | 13.27 | 68.40 | 112.80 | 78.47 to 97.45 |
| corridor flow | Colby S median link flow | veh/h | 88.92 | 9.98 | 72.00 | 102.00 | 81.78 to 96.06 |
| corridor flow | Martin E median link flow | veh/h | 76.80 | 8.87 | 58.80 | 92.40 | 70.45 to 83.15 |
| corridor flow | Martin W median link flow | veh/h | 98.52 | 7.51 | 91.20 | 114.00 | 93.15 to 103.89 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 39 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 19 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 6 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 10 | within |
| Intents listed, together | | 101 (71 to 131) | 74 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 31 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 38.6 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 7.5 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.0 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 3.2 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 3.1 | Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 2.3 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 2.2 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 2.2 | SR-24 then Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave to the south (downtown Oakland) | 1.8 | Claremont Avenue then Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.7 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.5 | SR-24 then Claremont Avenue |
| College Ave from the north (Berkeley) | Emeryville and West Oakland streets (55th to 67th Streets) | 1.2 | College Avenue then Alcatraz Avenue |
| other pairs | | 7.1 | |

By the arterial these cars would otherwise use: Telegraph Avenue 57 veh/h; none near the study area 3 veh/h; Claremont Avenue then College Avenue 3 veh/h; Claremont Avenue 3 veh/h; SR-24 2 veh/h; SR-24 then Claremont Avenue then College Avenue 2 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 13 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 20 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 4 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 6 | within |
| Intents listed, together | | 43 (20 to 68) | 43 | |
| Other through cars (no intent listed) | | | 9 | |

Model through cars by origin and destination group (largest 12 of 37 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 11.6 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 9.8 | Telegraph Avenue |
| College Ave from the north (Berkeley) | Emeryville and West Oakland streets (55th to 67th Streets) | 5.1 | College Avenue then Alcatraz Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 3.9 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.3 | SR-24 then Claremont Avenue |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.9 | Claremont Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 1.6 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.6 | Claremont Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.5 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.2 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.1 | SR-24 then Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Telegraph Avenue |
| other pairs | | 9.3 | |

By the arterial these cars would otherwise use: Telegraph Avenue 16 veh/h; SR-24 13 veh/h; College Avenue then Alcatraz Avenue 6 veh/h; Claremont Avenue then Alcatraz Avenue 4 veh/h; SR-24 then Claremont Avenue then College Avenue 4 veh/h; SR-24 then Claremont Avenue 2 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 24 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 30 | below |
| Intents listed, together | | 87 (78 to 110) | 54 | |
| Other through cars (no intent listed) | | | 17 | |

Model through cars by origin and destination group (largest 12 of 20 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 23.5 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.3 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.8 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.6 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.3 | Alcatraz Avenue then College Avenue |
| Alcatraz Ave from the west (Emeryville side) | College Ave from the north (Berkeley) | 2.6 | Alcatraz Avenue then College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 2.2 | Alcatraz Avenue then College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.5 | Alcatraz Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.3 | Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | College Ave from the north (Berkeley) | 1.3 | College Avenue |
| Telegraph Ave from the north (Berkeley) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.2 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | College Ave from the north (Berkeley) | 1.0 | Alcatraz Avenue then College Avenue |
| other pairs | | 1.4 | |

By the arterial these cars would otherwise use: Telegraph Avenue 24 veh/h; Claremont Avenue then SR-24 22 veh/h; Alcatraz Avenue then College Avenue 13 veh/h; College Avenue then Claremont Avenue then SR-24 7 veh/h; College Avenue 3 veh/h; Alcatraz Avenue then Claremont Avenue 2 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 16 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 8 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 31 | above |
| Intents listed, together | | 46 (39 to 72) | 56 | |
| Other through cars (no intent listed) | | | 23 | |

Model through cars by origin and destination group (largest 12 of 47 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.9 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.7 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.8 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.3 | College Avenue then Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 3.9 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.9 | Alcatraz Avenue then College Avenue |
| Alcatraz Ave from the west (Emeryville side) | College Ave from the north (Berkeley) | 2.7 | Alcatraz Avenue then College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | College Ave from the north (Berkeley) | 2.3 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.8 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 1.6 | SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.6 | none near the study area |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.5 | Alcatraz Avenue then Claremont Avenue |
| other pairs | | 14.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 30 veh/h; Claremont Avenue then SR-24 11 veh/h; Alcatraz Avenue then College Avenue 9 veh/h; College Avenue then Claremont Avenue then SR-24 8 veh/h; none near the study area 6 veh/h; SR-24 4 veh/h.

### Study area, all residential and service streets

Model: 399 through cars per hour.

Model through cars by origin and destination group (largest 12 of 95 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 45.5 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 35.3 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 30.3 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 22.3 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave to the south (downtown Oakland) | 21.3 | Claremont Avenue then Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 19.6 | Claremont Avenue then SR-24 |
| San Pablo Ave (Emeryville and West Oakland) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 18.4 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 14.1 | Claremont Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.0 | College Avenue then Claremont Avenue then SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 11.9 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 9.4 | Alcatraz Avenue then College Avenue |
| San Pablo Ave (Emeryville and West Oakland) | College Ave from the north (Berkeley) | 9.2 | Claremont Avenue then College Avenue |
| other pairs | | 149.7 | |

By the arterial these cars would otherwise use: Telegraph Avenue 186 veh/h; Claremont Avenue 41 veh/h; Alcatraz Avenue then College Avenue 24 veh/h; SR-24 23 veh/h; Claremont Avenue then Telegraph Avenue 21 veh/h; Claremont Avenue then SR-24 20 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 76; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 72; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 57; Telegraph Ave from the north (Berkeley) 41; San Pablo Ave (Emeryville and West Oakland) 32; Claremont Ave and Tunnel Rd toward the hills 22; College Ave from the north (Berkeley) 20; Telegraph Ave to the south (downtown Oakland) 20; West Oakland to the southwest (Adeline St, Market St) 14; Ashby Ave from the west (Emeryville and I-80) 12.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 104; Telegraph Ave from the north (Berkeley) 66; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 59; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 45; College Ave from the north (Berkeley) 34; Claremont Ave and Tunnel Rd toward the hills 25; Telegraph Ave to the south (downtown Oakland) 23; West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) 14; Emeryville and West Oakland streets (55th to 67th Streets) 9; SR-24 eastbound on-ramps (toward the Caldecott Tunnel) 6.


Per-seed detail: `rockridge-midday-s1-seed1.md` (seed 1 in full).
