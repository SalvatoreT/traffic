# rockridge-am_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.10 (min 0.00, max 1.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 8.98 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 9 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.10 | 0.32 | 0.00 | 1.00 | -0.13 to 0.33 |
| health | gridlock removals per hour | veh/h | 0.10 | 0.32 | 0.00 | 1.00 | -0.13 to 0.33 |
| health | entry backlog | % of spawned | 0.02 | 0.01 | 0.00 | 0.04 | 0.01 to 0.03 |
| health | backlog growth in the second half of the run | points of spawned | 0.00 | 0.02 | -0.03 | 0.04 | -0.01 to 0.02 |
| health | completed trips | trips | 22199.90 | 163.89 | 21895.00 | 22501.00 | 22082.67 to 22317.13 |
| health | arterial mean speed | m/s | 8.98 | 0.10 | 8.78 | 9.13 | 8.91 to 9.06 |
| health | arterial mean speed, last 15 min | m/s | 9.06 | 0.12 | 8.92 | 9.28 | 8.97 to 9.15 |
| junction recovery | courtesy admissions per hour | veh/h | 157.90 | 15.76 | 127.00 | 175.00 | 146.63 to 169.17 |
| junction recovery | yield fallback admissions per hour | veh/h | 79.30 | 17.35 | 56.00 | 122.00 | 66.89 to 91.71 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 20.18 | 2.34 | 16.62 | 24.00 | 18.50 to 21.85 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 5.5 | 0.7 | 4.6 | 6.8 | 5.0 to 6.0 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 20.41 | 3.46 | 16.42 | 26.21 | 17.93 to 22.88 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 5.6 | 0.9 | 4.4 | 6.8 | 4.9 to 6.2 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 33.10 | 4.68 | 26.00 | 40.00 | 29.75 to 36.45 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1078.50 | 30.35 | 1019.00 | 1117.00 | 1056.79 to 1100.21 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 33.40 | 7.72 | 24.00 | 44.00 | 27.88 to 38.92 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1230.00 | 41.56 | 1166.00 | 1286.00 | 1200.27 to 1259.73 |
| headline share | Hillegass Avenue NB from freeway | % | 53.7 | 4.4 | 42.9 | 59.6 | 50.5 to 56.9 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 8.7 | 0.8 | 7.0 | 9.6 | 8.1 to 9.3 |
| share | Hillegass Avenue NB to College Avenue | % | 13.0 | 2.6 | 8.4 | 16.8 | 11.2 to 14.9 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 26.7 | 3.9 | 22.0 | 34.5 | 24.0 to 29.5 |
| headline share | Colby Street NB from freeway | % | 45.8 | 4.2 | 42.6 | 56.0 | 42.9 to 48.8 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 45.0 | 3.7 | 38.9 | 50.0 | 42.4 to 47.6 |
| share | Colby Street NB to Telegraph Avenue | % | 41.4 | 3.0 | 36.6 | 44.9 | 39.3 to 43.6 |
| share | Colby Street NB to College Avenue | % | 3.0 | 1.3 | 0.9 | 5.0 | 2.1 to 3.9 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 21.6 | 3.4 | 17.9 | 28.8 | 19.2 to 24.0 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 1.7 | 0.9 | 0.0 | 3.0 | 1.0 to 2.4 |
| share | Hillegass Avenue SB from College Avenue | % | 9.2 | 1.9 | 5.2 | 12.6 | 7.8 to 10.6 |
| headline share | Hillegass Avenue SB to freeway | % | 60.8 | 5.2 | 52.6 | 68.8 | 57.1 to 64.5 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 18.9 | 3.6 | 14.1 | 25.1 | 16.3 to 21.4 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 10.0 | 1.1 | 8.2 | 11.6 | 9.2 to 10.8 |
| share | Colby Street SB from Telegraph Avenue | % | 18.1 | 2.5 | 14.1 | 22.1 | 16.3 to 19.8 |
| headline share | Colby Street SB to freeway | % | 47.6 | 2.4 | 44.0 | 51.6 | 45.9 to 49.4 |
| share | Colby Street SB to Forest Street | % | 12.8 | 4.0 | 7.9 | 21.5 | 9.9 to 15.6 |
| ramp share | onto freeway via College Avenue | % | 16.1 | 1.1 | 14.9 | 18.1 | 15.3 to 16.8 |
| ramp share | onto freeway via Hillegass Avenue | % | 13.9 | 1.5 | 12.0 | 16.8 | 12.7 to 15.0 |
| ramp share | onto freeway via Martin Street | % | 15.5 | 1.7 | 12.5 | 17.4 | 14.3 to 16.7 |
| ramp share | onto freeway via Colby Street | % | 15.0 | 1.6 | 12.3 | 17.9 | 13.9 to 16.2 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 8.4 | 1.4 | 5.8 | 11.0 | 7.4 to 9.5 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.9 | 0.9 | 2.9 | 6.0 | 4.2 to 5.5 |
| ramp share | from freeway via College Avenue | % | 11.4 | 1.7 | 9.1 | 13.5 | 10.2 to 12.6 |
| ramp share | from freeway via Martin Street | % | 13.1 | 0.8 | 11.9 | 14.9 | 12.5 to 13.7 |
| ramp share | from freeway via Colby Street | % | 12.2 | 1.0 | 10.8 | 13.8 | 11.5 to 12.9 |
| ramp share | from freeway via Hillegass Avenue | % | 6.9 | 1.1 | 4.5 | 8.1 | 6.1 to 7.7 |
| ramp share | from freeway via Benvenue Avenue | % | 3.1 | 0.7 | 2.1 | 4.3 | 2.6 to 3.6 |
| corridor flow | Telegraph N median link flow | veh/h | 749.16 | 47.50 | 672.00 | 838.80 | 715.18 to 783.14 |
| corridor flow | Telegraph S median link flow | veh/h | 690.36 | 29.55 | 634.80 | 732.00 | 669.23 to 711.49 |
| corridor flow | College N median link flow | veh/h | 222.48 | 13.07 | 208.80 | 249.60 | 213.13 to 231.83 |
| corridor flow | College S median link flow | veh/h | 422.04 | 19.68 | 391.20 | 446.40 | 407.96 to 436.12 |
| corridor flow | Claremont N median link flow | veh/h | 412.56 | 20.46 | 381.60 | 446.40 | 397.93 to 427.19 |
| corridor flow | Claremont S median link flow | veh/h | 423.84 | 22.10 | 384.00 | 460.80 | 408.03 to 439.65 |
| corridor flow | Alcatraz E median link flow | veh/h | 401.40 | 25.30 | 362.40 | 447.60 | 383.30 to 419.50 |
| corridor flow | Alcatraz W median link flow | veh/h | 324.36 | 22.95 | 282.00 | 360.00 | 307.94 to 340.78 |
| corridor flow | Hillegass N median link flow | veh/h | 96.84 | 10.21 | 82.80 | 121.20 | 89.53 to 104.15 |
| corridor flow | Hillegass S median link flow | veh/h | 80.88 | 10.00 | 70.80 | 102.00 | 73.73 to 88.03 |
| corridor flow | Colby N median link flow | veh/h | 120.12 | 9.52 | 100.80 | 129.60 | 113.31 to 126.93 |
| corridor flow | Colby S median link flow | veh/h | 144.36 | 13.17 | 122.40 | 160.80 | 134.94 to 153.78 |
| corridor flow | Martin E median link flow | veh/h | 126.00 | 10.58 | 102.00 | 136.80 | 118.43 to 133.57 |
| corridor flow | Martin W median link flow | veh/h | 103.68 | 9.40 | 87.60 | 112.80 | 96.96 to 110.40 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 35 | below |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 17 | below |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 2 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 19 | above |
| Intents listed, together | | 101 (71 to 131) | 73 | |
| Other through cars (no intent listed) | | | 3 | |

Model through cars by origin and destination group (largest 12 of 36 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 34.6 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 17.5 | Claremont Avenue then College Avenue then Alcatraz Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 7.7 | Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 3.0 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 2.3 | College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.4 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 1.3 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 1.1 | College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 0.9 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 0.7 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 0.7 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Ashby Ave from the west (Emeryville and I-80) | 0.4 | Claremont Avenue then Alcatraz Avenue |
| other pairs | | 4.2 | |

By the arterial these cars would otherwise use: Telegraph Avenue 48 veh/h; Claremont Avenue then College Avenue then Alcatraz Avenue 18 veh/h; Claremont Avenue 4 veh/h; College Avenue 4 veh/h; College Avenue then Alcatraz Avenue 1 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 14 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 25 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 7 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 14 | above |
| Intents listed, together | | 43 (20 to 68) | 61 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 47 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 13.3 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 7.9 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.3 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 6.1 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.7 | SR-24 then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 2.5 | College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.4 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 2.1 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 1.7 | College Avenue then Alcatraz Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.6 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.5 | SR-24 then Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.2 | Claremont Avenue |
| other pairs | | 12.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 21 veh/h; SR-24 14 veh/h; SR-24 then Claremont Avenue then College Avenue 6 veh/h; SR-24 then Claremont Avenue 6 veh/h; none near the study area 4 veh/h; Claremont Avenue 4 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 15 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 23 | below |
| Intents listed, together | | 87 (78 to 110) | 38 | |
| Other through cars (no intent listed) | | | 37 | |

Model through cars by origin and destination group (largest 12 of 30 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 23.3 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.9 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.7 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 5.6 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.2 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.0 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 3.5 | Telegraph Avenue |
| College Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 1.0 | College Avenue then Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 0.9 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | Oakland hills to the east (Broadway Terrace, Mountain Blvd, Moraga Ave) | 0.6 | SR-24 |
| Alcatraz Ave from the west (Emeryville side) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 0.4 | Alcatraz Avenue then Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | San Pablo Ave (Emeryville and West Oakland) | 0.3 | Claremont Avenue |
| other pairs | | 2.6 | |

By the arterial these cars would otherwise use: Telegraph Avenue 48 veh/h; Claremont Avenue then SR-24 18 veh/h; College Avenue then Claremont Avenue then SR-24 5 veh/h; Claremont Avenue 2 veh/h; College Avenue then Claremont Avenue 1 veh/h; SR-24 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 13 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 18 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 19 | within |
| Intents listed, together | | 46 (39 to 72) | 49 | |
| Other through cars (no intent listed) | | | 61 | |

Model through cars by origin and destination group (largest 12 of 55 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 29.2 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 16.6 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.2 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.7 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 7.5 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 5.8 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 5.1 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 3.0 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.5 | SR-24 |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 1.8 | SR-24 |
| Alcatraz Ave from the west (Emeryville side) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.6 | SR-24 |
| Claremont Ave and Tunnel Rd toward the hills | Emeryville and West Oakland streets (55th to 67th Streets) | 1.5 | Claremont Avenue |
| other pairs | | 15.7 | |

By the arterial these cars would otherwise use: Telegraph Avenue 76 veh/h; none near the study area 12 veh/h; SR-24 10 veh/h; Claremont Avenue 4 veh/h; Alcatraz Avenue then College Avenue 2 veh/h; Claremont Avenue then SR-24 1 veh/h.

### Study area, all residential and service streets

Model: 502 through cars per hour.

Model through cars by origin and destination group (largest 12 of 114 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 68.6 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 51.1 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 43.8 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 34.4 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.2 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | SR-24 westbound on-ramps (toward Oakland and I-980) | 22.1 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 21.3 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.7 | Claremont Avenue then SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 13.3 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 12.5 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 12.4 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 10.4 | Telegraph Avenue |
| other pairs | | 173.5 | |

By the arterial these cars would otherwise use: Telegraph Avenue 324 veh/h; Claremont Avenue 39 veh/h; SR-24 35 veh/h; none near the study area 21 veh/h; Claremont Avenue then SR-24 14 veh/h; Telegraph Avenue then Claremont Avenue 12 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 156; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 85; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 70; Telegraph Ave to the south (downtown Oakland) 40; Telegraph Ave from the north (Berkeley) 40; West Oakland to the southwest (Adeline St, Market St) 25; Claremont Ave and Tunnel Rd toward the hills 24; Shattuck Ave from the north (Berkeley) 12; College Ave from the north (Berkeley) 10; Emeryville and West Oakland streets (55th to 67th Streets) 9.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 127; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 102; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 63; Telegraph Ave from the north (Berkeley) 62; Claremont Ave and Tunnel Rd toward the hills 28; College Ave from the north (Berkeley) 18; West Oakland to the southwest (Adeline St, Market St) 15; Telegraph Ave to the south (downtown Oakland) 15; Emeryville and West Oakland streets (55th to 67th Streets) 13; Shattuck Ave from the north (Berkeley) 12.


Per-seed detail: `rockridge-am_peak-s1-seed1.md` (seed 1 in full).
