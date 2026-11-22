## Why

The published model (round 52) is labeled "Not calibrated" because 10 of the 24 recent PM held-out stations miss GEH 5. Six of those ten are the Caltrans stations on state routes at the model edge: SR-13 on Ashby Ave and Tunnel Rd, and SR-123 on San Pablo Ave, in and out. Their hourly targets are not hourly counts. Each is a published annual average daily traffic times an assumed peak-hour share (K, 0.09) times an assumed directional split (0.45 inbound and 0.55 outbound in the PM peak), and both factors are ASSUMPTIONs. Each is also the only count on its gate, so holding it out leaves the cross-validation demand with a class-default gate: the San Pablo gate offers 202 veh/h against 1,020. The out-of-sample miss measures that gap and says little about the simulator (calibration record, round 42 and the audit of 2026-11-18 and 2026-11-19).

The project lead decided on 2026-11-21 that targets derived from daily totals are reported separately and not judged. They stay in the fit as inputs. The held-out and fitted checks are judged on hourly counts only, and the site says so.

## What changes

- A station whose target is a daily total times assumed factors is a derived target. It is found from its source kind (`caltrans-aadt`, `caltrans-ramp`), set where the build applies the factor, and not from a list of streets (design D1).
- Derived targets are never held out. They are in the fit in both views. The frozen split keeps its draw, and the rule is applied on top of it, so no other station changes side (design D2).
- The assessment, the demand fit report and the status rule leave derived targets out of the fitted and held-out pass counts in every period, list them in a table of their own marked "derived from a daily total, not judged", and print the pass counts under the old scope beside the new ones. Thresholds are unchanged (design D3).
- The training demand records a digest of the stations it leaves out, in its `build` object and in its membership evidence. A file built under the earlier rule is refused (design D4).
- The Assumptions tab, the text pages and the docs explain derived targets. The section is built from the stations file and shows only when the assumptions data lists them (design D5).
- A runbook with scripts for the laptop: re-verify the baseline, run the membership loop and both demand builds, check that the shipped side is identical, run the ten-seed assessments, pack the candidate outputs (design D6).

This change prepares code, runbook and candidate outputs. It does not touch `data/areas/rockridge.json`, the published data or the site. The calibration note changes by the documented procedure after the project lead has reviewed the laptop figures.

## Impact

- Shipped demand `2d16d8f8eb0950ca`, the stations file, the split file, the config and the shipped membership file stay byte-identical. Proposals, results and redistribution need no rerun.
- The cross-validation demand changes (the 6 AADT stations, 2 AADT gate stations and 5 held ramps join the training view) and so does the training membership file. The assessment, `rockridge.fit.cv*.md` and the Assumptions data are regenerated.
- Expected PM recent held-out figure: 14 of 18 (78%), still below the 85% rule. Expected PM fitted: 79 of 89 (89%). AM is unchanged because its AADT and ramp targets were already left out as scaled copies of the PM figure.
- Code: `tools/lib/derived-targets.ts`, `lineage.ts`, `recency.ts`, `assess.ts`, `run-manifest.ts`, `through-membership.ts`, `validation-scope.ts`, `assumptions-data.ts`, `llms-docs.ts`, `tools/build-demand.ts`, `tools/assess.ts`, `crates/sim/src/bin/calibrate.rs` (a bin: the simulator fingerprint does not change). UI: `src/components/Assumptions.tsx`, `src/lib/assumptions.ts`, `src/lib/copy.ts`. Specs: `calibration`, `demand-model`, `simulator-ui`.
