## Context

Assessment of the network of 2026-11-18 (commit b1ff0ef, the street-control fixes; network 53c823f20d91, demand 9cdebdabf05c, cross-validation demand 2f9ae152b9bb, simulator d45a275dd7be0713cec6a64394b7d8a9), ten seeds per period, committed as ff5d667. PM peak fitted 74 of 92 recent stations within GEH 5, held out 14 of 24; AM peak fitted 70 of 77, held out 14 of 19; D5 4 of 4; the eight whole-street traversals within GEH 5; D16 holds in every period. The assessment of 2026-11-17 on the previous network (PM 78 of 92 and 13 of 24, AM 67 of 77 and 14 of 19) is the third column of the round's table and no longer the bar.

A diagnosis on the PM peak found a gap between what the demand fit plans and what the simulator does. The fit's static assignment (`tools/lib/assign.ts`) charges flat control delays per control type (`crates/sim/data/node-delays.json`: signal 10 s, all-way stop 8 s, minor stop 14 s) plus the BPR factor. The simulator's arterial signal approaches cost 15 to 50 s per car. The fit therefore sees arterials faster than the simulator does, and the simulator sends two to seven times more cars through the grid than the fit's final assignment planned on fitted stations. Counted, fit's static final, simulated, PM: Forest St eastbound 66, 75, 201; 60th St eastbound at Telegraph Ave 27, 25, 74; Howell St southbound 17, 33, 84. The held-out misses (McAuley St eastbound Howell to Canning 12 counted against 161, 60th St eastbound 23 against 130, Ayala Ave northbound 60 against 155, figures of the 2026-11-17 assessment) are on the same diagonal.

## Decisions

D0. Project lead, 2026-11-18: "Yes, as a calibration round." The trip estimate uses the simulator's measured per-junction delays. This is a method change with no new knobs, and it is adopted only if no worse than the published assessment (D3).

D1. The static assignment reads a measured control delay per approach link (the delay is at the end of the inbound link) and period, from a generated file. The file records the area, the demand view, the SHA-256 of the network, the SHA-256 and path of the demand the runs used, the simulator fingerprint, the seeds and the run length. The measured value is the flow-weighted mean delay per car on the link over the ten seeds, less the flow-weighted median delay of links that end at no control and carry no hump, floored at zero. This is how the constants of `node-delays.json` were derived (`tools/node-delays.ts`), applied per approach, and it reads the delays the calibrate reports already carry (`linkMeanDelayS`); there is no new measurement code in the simulator. An approach needs at least 20 veh/h on average over the seeds (ASSUMPTION: the cut `tools/node-delays.ts` already uses; about 200 cars over ten seeds); under that, and for any approach or period without a value, the constant of the control type stays. A measured value replaces the constant for every movement leaving the approach; an approach with no control keeps zero. Nothing in the code names an area. A file whose area, view, network hash or simulator fingerprint differs from the build is not used: the build warns and the fit report names the mismatch. The BPR factor and every other fit setting stay as they are. The simulator does not change; the fingerprint must stay d45a275dd7be0713cec6a64394b7d8a9 (the tools are outside it).

D2. Delays depend on demand and demand on delays. A fixed schedule, with no convergence tuning: pass 0 measures the delays on the b1ff0ef demand (ten seeds, each period) and refits; pass 1 measures on the pass-0 demand and refits; stop. The pass-1 demand is the candidate. The cross-validation demand (training view) is built the same way from delays measured on training-view demand only, so no held-out count informs any input. The split stays frozen (`data/demand/rockridge.split.json`). The record reports how far the delays and the demand moved between the passes.

D3. Keep rule, written before any run of the candidate. Against the assessment of b1ff0ef (D3's reference is that assessment, not the one of 2026-11-17), the candidate is adopted only if none of these is worse: recent PM fitted stations within GEH 5 at least 74 of 92; PM held out at least 14 of 24; AM fitted at least 70 of 77; AM held out at least 14 of 19; D5 holds with 4 of 4 headline shares within 10 points; all 8 whole-street traversal counts within GEH 5; D16 holds in every period. The validation suite must still pass 67 of 74 at the same fingerprint. One figure below its line fails the rule. The rule is not loosened after a result. The table also shows the 2026-11-17 column and the Howell-area stations, but they are reports, not conditions.

D4. No other change: no station-specific adjustment, no new parameter, no membership file, no network edit, no change to the split, the targets or the fit settings. If the round fails the rule, the published demand, assessment and area note stay as committed in ff5d667.

D5. User decision, 2026-11-18: the heavy runs (the two measurement passes, the candidate demand builds, the validation suite on the candidate and the ten-seed candidate assessment) run on the user's laptop, from `runbook.md`, not in the container that built the mechanism. The container did the baseline assessment (ff5d667), the mechanism and its tests, and this keep rule, all before any candidate run; no candidate demand was built and no candidate run was made there. The measured delay files of pass 0 that the container produced for a smoke test are not committed.

## What is not known

- Whether the delay the simulator measures on an approach includes queueing that BPR already charges, which would count it twice. D1 leaves the BPR factor on, as the fit does today; round 38 found that half of the measured link delay reproduced the simulator's routing best, and that the whole delay sent too little traffic toward the study area. This round replaces only the control part, and the held-out stations judge it.
- Whether two passes are enough for the delays and the demand to settle. D2 measures the movement between them and does not iterate further.

## Risks

- The fit may move little on the held-out stations, or the longer arterial delays may send too little traffic toward the study area. The keep rule decides.

## Laptop run, 2026-11-18

Run from `runbook.md` on the user's laptop (12 cores, `JOBS=12`), branch at f6dd21c. Logs, step times and the station comparison are in `evidence/`.

Step B reproduced the baseline: network 53c823f20d9165ed, demand 9cdebdabf05c4460, training demand 2f9ae152b9bbf78e, simulator d45a275dd7be0713cec6a64394b7d8a9, no change under `data/`. The OSM extract and the raw demand files were read from the bucket. The laptop's main checkout had the 2026-11-11 extract, which builds a different network (6dd5d90e0d9303fc).

SHA-256, first 16 characters. Each pass measures delays on the demand of the row above and refits with them. The network stays 53c823f20d9165ed throughout.

| Pass | Demand | Training demand | Delay file, shipped | Delay file, training |
| --- | --- | --- | --- | --- |
| baseline (b1ff0ef) | 9cdebdabf05c4460 | 2f9ae152b9bbf78e | none | none |
| 0 | a9acd0d97316ab6c | 615e6673197e309a | 8680288fa205a6b6 | b4dcc391bb0d843f |
| 1 (candidate) | 19ee7b952638016d | 5284e73cfa916f74 | 10228ecf206db509 | f541623d9549fe34 |

The config with the switch on was 65880d095980bc26.

Approaches measured and their mean control delay, AM / midday / PM:

| Pass | Shipped view | Training view |
| --- | --- | --- |
| 0 | 851 at 12.5 s / 701 at 9.6 s / 961 at 17.1 s | 769 at 15.4 s / 701 at 10.2 s / 886 at 16.9 s |
| 1 | 855 at 14.1 s / 705 at 10.8 s / 955 at 23.6 s | 719 at 12.4 s / 677 at 9.7 s / 893 at 21.0 s |

From pass 0 to pass 1, the RMS change of an approach's delay (approaches measured in both passes) was:

| View | AM | Midday | PM |
| --- | --- | --- | --- |
| Shipped | 770 approaches, 11.4 s | 618 approaches, 6.3 s | 875 approaches, 31.7 s |
| Training | 657 approaches, 25.8 s | 606 approaches, 5.7 s | 807 approaches, 25.2 s |

The delays had not settled after two passes.

Car demand offered, veh/h, AM / midday / PM:

| Demand | Shipped | Training |
| --- | --- | --- |
| Baseline | 23204 / 16221 / 27612 | 20584 / 16592 / 25044 |
| Pass 0 | 23324 / 16601 / 26620 | 19856 / 15763 / 24392 |
| Pass 1 | 22880 / 16407 / 26555 | 18988 / 16475 / 23865 |

Through trips in the shipped fit (final) went from 3745 to 3746 (AM), 3093 to 3175 (midday) and 5907 to 5701 (PM).

The validation suite passed 67 of 74 at d45a275dd7be0713cec6a64394b7d8a9.

Keep rule D3. The baseline station tallies were recomputed from this laptop's own runs on the b1ff0ef demands and match the committed assessment. The baseline's D5 and whole-street figures are taken from that assessment.

| Criterion | Line | Baseline | Candidate | Result |
| --- | --- | --- | --- | --- |
| PM fitted, recent, GEH < 5 | 74 of 92 | 74 | 69 | worse |
| PM held out | 14 of 24 | 14 | 14 | same |
| AM fitted | 70 of 77 | 70 | 67 | worse |
| AM held out | 14 of 19 | 14 | 14 | same |
| D5 headline shares within 10 points | 4 of 4 | 4 (mean error 4.6) | 2 (mean error 12.8) | worse |
| Whole-street traversals, GEH < 5 | 8 of 8 | 8 | 7 (Colby St SB, PM: 81 modeled, 39 counted, GEH 5.4) | worse |
| D16 in every period | holds | holds | holds | same |
| Validation | 67 of 74 | 67 | 67 | same |

Verdict: the candidate fails D3 on four figures. Under D4 the published demand, assessment and area note stay as committed in ff5d667. The config was reverted and the fit reports restored. The delay files stay as evidence: pass 1 under the configured names, pass 0 as `rockridge.control-delays.pass0*.json`. The candidate's fit reports are in `evidence/fit-pass1/`, and its assessment is `data/calibration/rockridge.assessment-r44.md`.

The measured delays closed most of the gap between what the fit plans and what the simulator does, but the fit closed it by planning more traffic through the grid. On Forest St eastbound (PM, counted 66), the fit's static final went from 61 to 183 and the simulated flow from 183 to 205. On Ayala Ave southbound, Forest St to McAuley St (counted 20), the static final went from 42 to 111, while the simulated flow went from 107 to 92. The Howell-area held-out stations moved toward their counts but stayed far above them. PM, counted / baseline / candidate on the cross-validation demand:

- McAuley St eastbound, Howell St to Canning St: 12 / 183 / 81
- 60th St eastbound: 23 / 162 / 117
- Ayala Ave northbound, Martin St to Howell St: 60 / 212 / 93 (now within GEH 5)

Other held-out stations went the other way (Hillegass Ave southbound, 62nd St to 61st St; Canning St southbound, 59th St to McAuley St), so the held-out totals did not change. Among recent stations, 11 flipped in the AM peak (4 to pass, 7 to fail) and 15 in the PM peak (5 to pass, 10 to fail). `evidence/stations.md` lists every flip.
