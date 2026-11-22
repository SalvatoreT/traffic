# Single-seed sanity check, PM peak, seed 1 (container, not a verdict)

One seed on the published shipped demand (2d16d8f8eb0950ca), option off against on, scored with `tools/diag/control-charge-score.ts`. One seed moves the diagonal sum by 10 to 15% and the fitted pass count by about 3 between neighboring settings (calibration record, "Router diagnosis for the diagonal"), so this is a wiring check. The container has no cross-validation demand from the derived-targets job, so the held-out columns are empty, and the standard errors are empty for one seed.

# Control delay charged once, stage 1 scoring, pm_peak, seeds 1

Pass counts under the judged scope (derived targets not judged), GEH below 5; fitted on the shipped demand, held out on the cross-validation demand:

| Set | Recent fitted | Recent held out | Older fitted | Older held out | All fitted | All held out | D5 shares within 10 points | Whole street within GEH 5 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| off | 75 of 89 | - | 54 of 87 | - | 129 of 176 | - | 3 of 4 | 4 of 4 |
| on | 78 of 89 | - | 48 of 87 | - | 126 of 176 | - | 4 of 4 | 4 of 4 |

The five stations of the residential diagonal, simulated veh/h on the shipped demand (mean +- standard error over seeds; counted in the last row):

| Set | Ayala Ave NB McAuley-Howell | 60th St EB Howell-Colby | McAuley St EB Howell-Colby | Howell St SB 59th-McAuley | Forest Ave EB | Sum |
| --- | --- | --- | --- | --- | --- | --- |
| off | 60.0 +- - | 82.0 +- - | 80.0 +- - | 82.0 +- - | 152.0 +- - | 456.0 +- - |
| on | 42.0 +- - | 65.0 +- - | 49.0 +- - | 71.0 +- - | 86.0 +- - | 313.0 +- - |
| counted | 60 | 23 | 12 | 17 | 66 | 178 |

Colby Street NB, six blocks (simulated over counted) and the eight whole-street traversals (simulated veh/h, GEH against the count):

| Set | Colby NB six blocks | Hillegass Avenue NB | Colby Street NB | Hillegass Avenue SB | Colby Street SB |
| --- | --- | --- | --- | --- | --- |
| off | 886 / 1046 = 0.85 | 65 (obs 48, GEH 2.2) | 89 (obs 102, GEH 1.4) | 77 (obs 79, GEH 0.2) | 74 (obs 39, GEH 4.7) |
| on | 926 / 1046 = 0.89 | 53 (obs 48, GEH 0.7) | 97 (obs 102, GEH 0.5) | 58 (obs 79, GEH 2.6) | 64 (obs 39, GEH 3.4) |

Arterial travel times (s, mean over seeds; observed range in brackets; * outside the range):

| Set | Telegraph Ave NB, 51st St to Russell St | Telegraph Ave SB, Russell St to 51st St | Shattuck Ave NB, 51st St to Alcatraz Ave | Shattuck Ave SB, Alcatraz Ave to 51st St | College Ave NB, Miles Ave to Ashby Ave | College Ave SB, Ashby Ave to Miles Ave |
| --- | --- | --- | --- | --- | --- | --- |
| off | 320 (302-420) | 434 (300-376) * | 267 (144-178) * | 269 (158-221) * | 236 (188-318) | 292 (202-293) |
| on | 329 (302-420) | 471 (300-376) * | 333 (144-178) * | 286 (158-221) * | 283 (188-318) | 241 (202-293) |

Stability and flow (mean over seeds):

| Set | Backlog % (mean, max) | Cars cleared from gridlock per hour | Judged-zone clearings per hour | Through cars/h on the four whole-street runs | Completed trips |
| --- | --- | --- | --- | --- | --- |
| off | 0.9, 0.9 | 7.0 | 0.0 | 593 | 23855 |
| on | 1.5, 1.5 | 19.0 | 0.0 | 462 | 23251 |

