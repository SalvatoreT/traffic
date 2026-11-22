# Control delay charged once, stage 1 scoring, pm_peak, seeds 1,2,3,4,5,6,7,8,9,10

Pass counts under the judged scope (derived targets not judged), GEH below 5; fitted on the shipped demand, held out on the cross-validation demand:

| Set | Recent fitted | Recent held out | Older fitted | Older held out | All fitted | All held out | D5 shares within 10 points | Whole street within GEH 5 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| off | 79 of 89 | 15 of 18 | 59 of 87 | 14 of 29 | 138 of 176 | 29 of 47 | 4 of 4 | 4 of 4 |
| on | 79 of 89 | 14 of 18 | 48 of 87 | 15 of 29 | 127 of 176 | 29 of 47 | 4 of 4 | 4 of 4 |

The five stations of the residential diagonal, simulated veh/h on the shipped demand (mean +- standard error over seeds; counted in the last row):

| Set | Ayala Ave NB McAuley-Howell | 60th St EB Howell-Colby | McAuley St EB Howell-Colby | Howell St SB 59th-McAuley | Forest Ave EB | Sum |
| --- | --- | --- | --- | --- | --- | --- |
| off | 63.7 +- 2.8 | 61.1 +- 3.7 | 59.7 +- 4.9 | 62.9 +- 3.7 | 101.8 +- 9.0 | 349.2 +- 20.0 |
| on | 54.1 +- 3.7 | 62.8 +- 5.2 | 56.3 +- 4.2 | 66.6 +- 4.5 | 104.3 +- 8.3 | 344.1 +- 22.4 |
| counted | 60 | 23 | 12 | 17 | 66 | 178 |

Colby Street NB, six blocks (simulated over counted) and the eight whole-street traversals (simulated veh/h, GEH against the count):

| Set | Colby NB six blocks | Hillegass Avenue NB | Colby Street NB | Hillegass Avenue SB | Colby Street SB |
| --- | --- | --- | --- | --- | --- |
| off | 850 / 1046 = 0.81 | 56 (obs 48, GEH 1.1) | 86 (obs 102, GEH 1.7) | 78 (obs 79, GEH 0.2) | 75 (obs 39, GEH 4.7) |
| on | 807 / 1046 = 0.77 | 53 (obs 48, GEH 0.8) | 83 (obs 102, GEH 2.0) | 78 (obs 79, GEH 0.1) | 65 (obs 39, GEH 3.6) |

Arterial travel times (s, mean over seeds; observed range in brackets; * outside the range):

| Set | Telegraph Ave NB, 51st St to Russell St | Telegraph Ave SB, Russell St to 51st St | Shattuck Ave NB, 51st St to Alcatraz Ave | Shattuck Ave SB, Alcatraz Ave to 51st St | College Ave NB, Miles Ave to Ashby Ave | College Ave SB, Ashby Ave to Miles Ave |
| --- | --- | --- | --- | --- | --- | --- |
| off | 326 (302-420) | 400 (300-376) * | 258 (144-178) * | 300 (158-221) * | 275 (188-318) | 241 (202-293) |
| on | 325 (302-420) | 461 (300-376) * | 253 (144-178) * | 314 (158-221) * | 271 (188-318) | 228 (202-293) |

Stability and flow (mean over seeds):

| Set | Backlog % (mean, max) | Cars cleared from gridlock per hour | Judged-zone clearings per hour | Through cars/h on the four whole-street runs | Completed trips |
| --- | --- | --- | --- | --- | --- |
| off | 1.1, 1.6 | 5.9 | 0.0 | 524 | 23824 |
| on | 1.2, 1.9 | 7.0 | 0.1 | 494 | 23660 |

## Stage 1 bar (pm_peak, off against on; design D2)

- Diagonal sum falls by more than twice its standard error: 5.1 veh/h against standard error 30.0 (Welch, 10 and 10 seeds): NOT MET.
- No judged count falls by more than 1: NOT MET (older fitted falls by 11; all fitted falls by 11) (falls: recent fitted 0; recent held out 1; older fitted 11; older held out -1; all fitted 11; all held out 0; D5 shares 0; whole street within GEH 5 0).
- Colby Street NB whole street inside GEH 5: MET (83 against 102, GEH 2.0).
- Telegraph travel times stay in range (inside the observed range wherever the baseline is; where the baseline is outside, no more than 10 s farther out): NOT MET.
