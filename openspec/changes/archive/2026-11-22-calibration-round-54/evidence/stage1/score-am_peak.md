# Control delay charged once, stage 1 scoring, am_peak, seeds 1,2,3,4,5,6,7,8,9,10

Pass counts under the judged scope (derived targets not judged), GEH below 5; fitted on the shipped demand, held out on the cross-validation demand:

| Set | Recent fitted | Recent held out | Older fitted | Older held out | All fitted | All held out | D5 shares within 10 points | Whole street within GEH 5 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| off | 72 of 77 | 15 of 19 | 40 of 48 | 12 of 16 | 112 of 125 | 27 of 35 | 4 of 4 | 4 of 4 |
| on | 70 of 77 | 15 of 19 | 42 of 48 | 13 of 16 | 112 of 125 | 28 of 35 | 4 of 4 | 4 of 4 |

The five stations of the residential diagonal, simulated veh/h on the shipped demand (mean +- standard error over seeds; counted in the last row):

| Set | Ayala Ave NB McAuley-Howell | 60th St EB Howell-Colby | McAuley St EB Howell-Colby | Howell St SB 59th-McAuley | Forest Ave EB | Sum |
| --- | --- | --- | --- | --- | --- | --- |
| off | 47.5 +- 0.6 | 29.2 +- 2.0 | 28.9 +- 2.3 | - +- - | 61.6 +- 5.5 | - +- - |
| on | 37.8 +- 1.6 | 23.5 +- 2.1 | 18.8 +- 1.8 | - +- - | 42.7 +- 3.0 | - +- - |
| counted | 50 | 6 | 4 | 0 | 50 | 110 |

Colby Street NB, six blocks (simulated over counted) and the eight whole-street traversals (simulated veh/h, GEH against the count):

| Set | Colby NB six blocks | Hillegass Avenue NB | Colby Street NB | Hillegass Avenue SB | Colby Street SB |
| --- | --- | --- | --- | --- | --- |
| off | 600 / 789 = 0.76 | 39 (obs 34, GEH 0.8) | 42 (obs 33, GEH 1.5) | 30 (obs 36, GEH 1.0) | 39 (obs 46, GEH 1.1) |
| on | 556 / 789 = 0.70 | 36 (obs 34, GEH 0.3) | 39 (obs 33, GEH 1.0) | 30 (obs 36, GEH 1.0) | 37 (obs 46, GEH 1.4) |

Arterial travel times (s, mean over seeds; observed range in brackets; * outside the range):

| Set | Telegraph Ave NB, 51st St to Russell St | Telegraph Ave SB, Russell St to 51st St | Shattuck Ave NB, 51st St to Alcatraz Ave | Shattuck Ave SB, Alcatraz Ave to 51st St | College Ave NB, Miles Ave to Ashby Ave | College Ave SB, Ashby Ave to Miles Ave |
| --- | --- | --- | --- | --- | --- | --- |
| off | 301 (280-315) | 290 (245-285) * | 212 (130-160) * | 191 (147-201) | 270 (181-239) * | 186 (158-205) |
| on | 305 (280-315) | 315 (245-285) * | 212 (130-160) * | 223 (147-201) * | 284 (181-239) * | 184 (158-205) |

Stability and flow (mean over seeds):

| Set | Backlog % (mean, max) | Cars cleared from gridlock per hour | Judged-zone clearings per hour | Through cars/h on the four whole-street runs | Completed trips |
| --- | --- | --- | --- | --- | --- |
| off | 0.3, 0.6 | 0.4 | 0.0 | 272 | 21556 |
| on | 0.4, 0.7 | 0.5 | 0.0 | 240 | 21380 |

## Stage 1 bar (am_peak, off against on; design D2)

- Diagonal sum falls by more than twice its standard error: - veh/h against standard error - (Welch, 0 and 0 seeds): NOT MET (read for PM only; reported here for information).
- No judged count falls by more than 1: NOT MET (recent fitted falls by 2) (falls: recent fitted 2; recent held out 0; older fitted -2; older held out -1; all fitted 0; all held out -1; D5 shares 0; whole street within GEH 5 0).
- Colby Street NB whole street inside GEH 5: MET (39 against 33, GEH 1.0).
- Telegraph travel times stay in range (inside the observed range wherever the baseline is; where the baseline is outside, no more than 10 s farther out): NOT MET.
