# rockridge-midday-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Cars cleared from gridlock near the study area (judged zone) | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 10.06 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.01 | 0.01 | 0.00 | 0.02 | 0.00 to 0.01 |
| health | backlog growth in the second half of the run | points of spawned | -0.00 | 0.02 | -0.03 | 0.02 | -0.01 to 0.01 |
| health | completed trips | trips | 16347.90 | 121.44 | 16143.00 | 16533.00 | 16261.03 to 16434.77 |
| health | arterial mean speed | m/s | 10.06 | 0.04 | 10.00 | 10.13 | 10.03 to 10.09 |
| health | arterial mean speed, last 15 min | m/s | 10.10 | 0.10 | 9.89 | 10.26 | 10.03 to 10.17 |
| junction recovery | courtesy admissions per hour | veh/h | 55.80 | 5.87 | 50.00 | 66.00 | 51.60 to 60.00 |
| junction recovery | yield fallback admissions per hour | veh/h | 4.80 | 1.62 | 2.00 | 7.00 | 3.64 to 5.96 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, judged (near the study area, and far ones whose chain reaches it) | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, near the study area | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, farther out | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, farther out with a chain into the judged zone | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | trips waiting at origins in the judged zone at the end | trips | 0.60 | 0.70 | 0.00 | 2.00 | 0.10 to 1.10 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 25.19 | 2.45 | 20.70 | 28.19 | 23.44 to 26.94 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 9.7 | 1.1 | 7.8 | 11.1 | 8.9 to 10.5 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 21.97 | 4.64 | 16.11 | 29.26 | 18.65 to 25.29 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 8.4 | 1.6 | 6.3 | 10.9 | 7.3 to 9.5 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 26.60 | 3.89 | 21.00 | 33.00 | 23.82 to 29.38 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 832.70 | 25.73 | 790.00 | 869.00 | 814.30 to 851.10 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 47.40 | 5.70 | 36.00 | 56.00 | 43.32 to 51.48 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 986.90 | 31.87 | 935.00 | 1045.00 | 964.10 to 1009.70 |
| headline share | Hillegass Avenue NB from freeway | % | 47.8 | 2.7 | 43.4 | 52.2 | 45.9 to 49.8 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 3.6 | 1.5 | 1.4 | 5.9 | 2.5 to 4.7 |
| share | Hillegass Avenue NB to College Avenue | % | 12.3 | 3.0 | 8.1 | 16.7 | 10.2 to 14.4 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 31.8 | 4.2 | 27.8 | 40.3 | 28.8 to 34.8 |
| headline share | Colby Street NB from freeway | % | 48.4 | 3.0 | 43.8 | 52.8 | 46.3 to 50.6 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 50.1 | 4.3 | 42.7 | 58.3 | 47.0 to 53.1 |
| share | Colby Street NB to Telegraph Avenue | % | 40.0 | 3.4 | 35.2 | 47.1 | 37.5 to 42.4 |
| share | Colby Street NB to College Avenue | % | 5.2 | 1.4 | 3.3 | 7.0 | 4.2 to 6.2 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 40.4 | 6.8 | 28.1 | 49.0 | 35.6 to 45.3 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 5.6 | 2.4 | 1.0 | 10.2 | 3.9 to 7.4 |
| share | Hillegass Avenue SB from College Avenue | % | 24.6 | 4.1 | 15.6 | 28.9 | 21.6 to 27.5 |
| headline share | Hillegass Avenue SB to freeway | % | 57.6 | 5.2 | 48.1 | 66.7 | 53.9 to 61.4 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 26.6 | 2.8 | 22.8 | 30.1 | 24.5 to 28.6 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 21.3 | 4.2 | 14.5 | 28.5 | 18.2 to 24.3 |
| share | Colby Street SB from Telegraph Avenue | % | 20.7 | 3.7 | 15.9 | 28.0 | 18.1 to 23.4 |
| headline share | Colby Street SB to freeway | % | 42.2 | 3.3 | 36.1 | 46.9 | 39.9 to 44.6 |
| share | Colby Street SB to Forest Street | % | 18.9 | 3.6 | 13.0 | 23.8 | 16.4 to 21.5 |
| ramp share | onto freeway via College Avenue | % | 20.0 | 2.0 | 16.9 | 22.9 | 18.6 to 21.4 |
| ramp share | onto freeway via Hillegass Avenue | % | 16.8 | 1.6 | 13.9 | 19.3 | 15.7 to 17.9 |
| ramp share | onto freeway via Martin Street | % | 17.5 | 1.9 | 14.5 | 21.3 | 16.1 to 18.8 |
| ramp share | onto freeway via Colby Street | % | 14.5 | 1.4 | 12.2 | 17.7 | 13.5 to 15.5 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 12.4 | 1.7 | 9.1 | 14.7 | 11.2 to 13.6 |
| ramp share | onto freeway via Benvenue Avenue | % | 5.1 | 1.3 | 3.5 | 6.8 | 4.2 to 6.0 |
| ramp share | from freeway via College Avenue | % | 9.9 | 1.4 | 8.4 | 12.3 | 8.9 to 10.9 |
| ramp share | from freeway via Martin Street | % | 13.3 | 1.6 | 11.6 | 16.0 | 12.1 to 14.4 |
| ramp share | from freeway via Colby Street | % | 11.3 | 1.8 | 8.5 | 14.4 | 10.0 to 12.7 |
| ramp share | from freeway via Hillegass Avenue | % | 8.5 | 1.0 | 6.7 | 9.9 | 7.8 to 9.2 |
| ramp share | from freeway via Benvenue Avenue | % | 3.2 | 0.8 | 2.0 | 4.4 | 2.6 to 3.8 |
| corridor flow | Telegraph N median link flow | veh/h | 638.52 | 30.71 | 584.40 | 682.80 | 616.55 to 660.49 |
| corridor flow | Telegraph S median link flow | veh/h | 590.88 | 24.36 | 547.20 | 622.80 | 573.46 to 608.30 |
| corridor flow | College N median link flow | veh/h | 188.04 | 23.34 | 159.60 | 231.60 | 171.34 to 204.74 |
| corridor flow | College S median link flow | veh/h | 530.64 | 22.23 | 504.00 | 577.20 | 514.74 to 546.54 |
| corridor flow | Claremont N median link flow | veh/h | 273.72 | 23.59 | 237.60 | 313.20 | 256.84 to 290.60 |
| corridor flow | Claremont S median link flow | veh/h | 198.12 | 25.88 | 153.60 | 231.60 | 179.61 to 216.63 |
| corridor flow | Alcatraz E median link flow | veh/h | 358.56 | 13.59 | 338.40 | 379.20 | 348.84 to 368.28 |
| corridor flow | Alcatraz W median link flow | veh/h | 241.08 | 23.33 | 195.60 | 283.20 | 224.39 to 257.77 |
| corridor flow | Hillegass N median link flow | veh/h | 74.88 | 5.22 | 69.60 | 85.20 | 71.15 to 78.61 |
| corridor flow | Hillegass S median link flow | veh/h | 72.84 | 7.38 | 61.20 | 85.20 | 67.56 to 78.12 |
| corridor flow | Colby N median link flow | veh/h | 86.88 | 9.45 | 74.40 | 102.00 | 80.12 to 93.64 |
| corridor flow | Colby S median link flow | veh/h | 88.20 | 8.14 | 79.20 | 106.80 | 82.37 to 94.03 |
| corridor flow | Martin E median link flow | veh/h | 85.20 | 8.91 | 70.80 | 104.40 | 78.83 to 91.57 |
| corridor flow | Martin W median link flow | veh/h | 80.52 | 10.84 | 67.20 | 100.80 | 72.76 to 88.28 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 42 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 23 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 5 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 9 | within |
| Intents listed, together | | 101 (71 to 131) | 79 | |
| Other through cars (no intent listed) | | | 3 | |

Model through cars by origin and destination group (largest 12 of 38 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 41.5 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 8.5 | Claremont Avenue then College Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 7.2 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.2 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 3.1 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 3.0 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.9 | SR-24 then Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 1.8 | SR-24 then Claremont Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.1 | Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.9 | Telegraph Avenue |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 0.6 | College Avenue then Alcatraz Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.6 | Telegraph Avenue |
| other pairs | | 5.7 | |

By the arterial these cars would otherwise use: Telegraph Avenue 59 veh/h; Claremont Avenue then College Avenue 9 veh/h; none near the study area 3 veh/h; SR-24 then Claremont Avenue 3 veh/h; Claremont Avenue 2 veh/h; SR-24 then Claremont Avenue then College Avenue 2 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 16 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 26 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 6 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 10 | within |
| Intents listed, together | | 43 (20 to 68) | 57 | |
| Other through cars (no intent listed) | | | 5 | |

Model through cars by origin and destination group (largest 12 of 36 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 12.3 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 11.9 | SR-24 |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.1 | Claremont Avenue then Alcatraz Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.8 | SR-24 then Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.7 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 3.1 | SR-24 then Claremont Avenue then College Avenue |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.3 | Claremont Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.2 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 2.0 | Claremont Avenue then College Avenue |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 1.5 | College Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.3 | SR-24 then Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.1 | Claremont Avenue |
| other pairs | | 10.6 | |

By the arterial these cars would otherwise use: Telegraph Avenue 19 veh/h; SR-24 14 veh/h; Claremont Avenue then Alcatraz Avenue 7 veh/h; SR-24 then Claremont Avenue 5 veh/h; Claremont Avenue 4 veh/h; Claremont Avenue then College Avenue 3 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 27 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 35 | below |
| Intents listed, together | | 87 (78 to 110) | 62 | |
| Other through cars (no intent listed) | | | 26 | |

Model through cars by origin and destination group (largest 12 of 30 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 26.7 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.9 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.1 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 9.7 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.7 | College Avenue then Claremont Avenue then SR-24 |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.4 | College Avenue |
| San Pablo Ave (Emeryville and West Oakland) | College Ave from the north (Berkeley) | 2.4 | Alcatraz Avenue then College Avenue |
| San Pablo Ave (Emeryville and West Oakland) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.9 | Alcatraz Avenue then College Avenue |
| Telegraph Ave from the north (Berkeley) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.8 | College Avenue |
| Shattuck Ave from the north (Berkeley) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.7 | College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.5 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 0.9 | Claremont Avenue |
| other pairs | | 4.8 | |

By the arterial these cars would otherwise use: Telegraph Avenue 37 veh/h; Claremont Avenue then SR-24 25 veh/h; College Avenue then Claremont Avenue then SR-24 9 veh/h; Alcatraz Avenue then College Avenue 8 veh/h; College Avenue 6 veh/h; Claremont Avenue 2 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 14 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 9 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 27 | within |
| Intents listed, together | | 46 (39 to 72) | 50 | |
| Other through cars (no intent listed) | | | 38 | |

Model through cars by origin and destination group (largest 12 of 49 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 14.7 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.6 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.0 | Claremont Avenue then SR-24 |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.1 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.1 | College Avenue then Claremont Avenue then SR-24 |
| San Pablo Ave (Emeryville and West Oakland) | College Ave from the north (Berkeley) | 3.9 | Alcatraz Avenue then College Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 3.8 | none near the study area |
| San Pablo Ave (Emeryville and West Oakland) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 3.7 | Alcatraz Avenue then College Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.3 | College Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.7 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 1.6 | SR-24 |
| Shattuck Ave from the north (Berkeley) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.4 | College Avenue |
| other pairs | | 15.1 | |

By the arterial these cars would otherwise use: Telegraph Avenue 29 veh/h; Claremont Avenue then SR-24 21 veh/h; Alcatraz Avenue then College Avenue 11 veh/h; College Avenue 6 veh/h; SR-24 5 veh/h; none near the study area 5 veh/h.

### Study area, all residential and service streets

Model: 409 through cars per hour.

Model through cars by origin and destination group (largest 12 of 86 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 46.6 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 37.8 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 34.7 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 34.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 21.3 | Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 18.0 | Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 16.8 | Telegraph Avenue |
| San Pablo Ave (Emeryville and West Oakland) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 13.4 | Alcatraz Avenue then College Avenue |
| San Pablo Ave (Emeryville and West Oakland) | College Ave from the north (Berkeley) | 13.0 | Alcatraz Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 12.2 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 11.7 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.6 | College Avenue then Claremont Avenue then SR-24 |
| other pairs | | 138.3 | |

By the arterial these cars would otherwise use: Telegraph Avenue 209 veh/h; Alcatraz Avenue then College Avenue 34 veh/h; Claremont Avenue 28 veh/h; SR-24 25 veh/h; Claremont Avenue then SR-24 22 veh/h; Claremont Avenue then College Avenue 20 veh/h.

By origin group: SR-24 eastbound off-ramps (arriving from Oakland and I-980) 77; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 76; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 59; Telegraph Ave from the north (Berkeley) 43; San Pablo Ave (Emeryville and West Oakland) 30; West Oakland to the southwest (Adeline St, Market St) 24; Claremont Ave and Tunnel Rd toward the hills 22; Telegraph Ave to the south (downtown Oakland) 21; College Ave from the north (Berkeley) 16; SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) 10.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 111; Telegraph Ave from the north (Berkeley) 76; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 70; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 64; Claremont Ave and Tunnel Rd toward the hills 22; College Ave from the north (Berkeley) 22; Telegraph Ave to the south (downtown Oakland) 9; San Pablo Ave (Emeryville and West Oakland) 7; Ashby Ave from the west (Emeryville and I-80) 6; SR-24 eastbound on-ramps (toward the Caldecott Tunnel) 5.


Per-seed detail: `rockridge-midday-s1-seed1.md` (seed 1 in full).
