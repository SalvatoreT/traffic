## Finding

Ten of the 24 recent PM held-out stations of the round 52 assessment miss GEH 5, and six of the ten are the Caltrans stations on SR-13 (Ashby Ave, Tunnel Rd) and SR-123 (San Pablo Ave), in and out. Their cross-validation flows are 143 to 830 veh/h against targets of 830 to 1,337 (GEH 15 to 31), while the same stations on the shipped demand score GEH 0.3 to 20. The cause is in the construction of the targets and of the cross-validation demand, and the simulator is not implicated:

- The target of each is an annual average daily traffic [CaltransAADT] times K (0.09) times the directional split (inbound 0.45, outbound 0.55 in the PM peak). Both factors are ASSUMPTIONs: [FHWA-TMG2022] defines K and gives design-hour volume as AADT x K x D, and the 0.09 value is not in any source opened (see `docs/references.md`). The target is an hourly equivalent of a daily total, not a count of the hour.
- Each station is the only count on its gate. Holding it out removes the gate's record from the cross-validation demand, so the gate takes the class default (ASSUMPTION): the San Pablo gate offers 202 veh/h against 1,020. The held-out miss measures that default and says little about the simulator (calibration record, round 42, and the audit of 2026-11-18 and 2026-11-19).

With the six removed, PM recent held out is 14 of 18 (78%), still under the 85% rule. The change corrects what the rule counts; PM stays uncalibrated on the held-out rate.

## Decisions

### D0: The project lead's decision, 2026-11-21

Targets derived from daily totals are reported separately and not judged. They stay in the fit as inputs. The held-out check and the fitted check are judged on hourly counts only. The site says so plainly, in the Assumptions tab and in the calibration note. The published site does not change until the project lead has reviewed the numbers, so this change prepares code, runbook and candidate outputs only.

### D1: A derived target is found from the station's own provenance

A station is a derived target when its source kind is `caltrans-aadt` or `caltrans-ramp` (`tools/lib/derived-targets.ts`). The demand build already records the source kind on every station, in `demand-fit.ts` where it applies the factors, and the stations file carries it as `source`. No flag is added to the stations output and no street is named. A second area with Caltrans stations gets the same treatment from its data.

Which Rockridge stations qualify, from `data/demand/rockridge.stations.json` and the frozen split (`evidence/derived-stations.md` lists them all):

| Source and count year | Stations | Held by the draw | Fitted by the draw |
| --- | --- | --- | --- |
| `caltrans-aadt` 2024: 6 link stations (Ashby Ave, Tunnel Rd, San Pablo Ave, in and out) | 6 | 6 | 0 |
| `caltrans-aadt` 2024: gate 265 in and out (Ashby Ave edge gate, no link) | 2 | 2 | 0 |
| `caltrans-ramp` 2012: ramps with a published ADT row | 13 | 5 | 8 |
| `caltrans-ramp` 2024: Caldecott Lane ramps | 3 | 0 | 3 |
| Total | 24 | 13 | 11 |

By period:

- PM peak: all 24 have a PM target (22 on links, 2 gates). Until now they were judged as counts. Of the PM recent stations (count year within 5 years of 2026), the 6 AADT link stations are held out and the 3 Caldecott ramps are fitted; the 2012 ramps are older counts.
- AM peak and midday: the same 24 have targets, and each is the PM figure times a period factor. The stations file already marks them `derived` for those periods, so the rule already left them out. AM pass counts do not change, and no AM station is newly excluded.
- Ramps are built the same way as the AADT stations: a published ADT times an assumed peak-hour share (`ramps.kFactor` 0.09, ASSUMPTION), with no counted K (`countFit.rampK`, which would estimate K from counted peak hours, is off in the Rockridge config). A ramp whose peak hour is counted (a turning-movement leg of an intersection count, source `CHRCO-EIR2014` and others) replaces its ADT station in the build and is an hourly count, so it is judged. The general rule therefore takes ramps in. The project lead is asked to confirm this (see open questions in the report): excluding ramps would leave the 3 recent Caldecott ramps in the fitted count (81 of 92 instead of 79 of 89) and the 5 held 2012 ramps held out.

### D2: The draw is frozen; the rule is applied on top of it

The split is a hash-ordered draw per corridor that reads no count value. It stays as frozen, and `isHeldGroup` in `tools/lib/lineage.ts` treats a group whose source observations are daily totals (an `ov` Caltrans record or a `ramp-row`) as fitted. `heldStationIds`, `withheldObservations` and `withheldStationIds` apply it, so the build's training view, the membership loop and the assessment all get the effective held set. `calibrate` applies it to its withheld set (`is_derived_group`, with a unit test). The build stops if a split group and the source kinds of its stations disagree about being derived (`derivedGroupProblems`).

The direct way is to re-freeze the split with the derived groups forced to fitted, and the code rules it out. The shipped demand records the manifest's SHA-256 as `build.split`, and the run manifests and `assess` check that value against the split file on disk. A changed split file therefore changes the shipped demand, and the demand's hash `2d16d8f8eb0950ca` is what proposals, stored results, redistribution and the text pages are stamped with. Re-freezing would have cost the whole restamp of round 52 for a rule that does not change the shipped fit. It would also have changed the stations file (its `held` flags) and with it the stations hash in the membership evidence, so the published shipped membership file would stop matching too.

So the split file is byte-identical and the stations file keeps recording the draw. The effective change, from `tools/derived-targets-report.ts` on the committed files:

- 13 stations in 7 dependency groups are fitted that the draw held out: the 6 AADT link stations and the 2 AADT gate stations (4 groups) and 5 ramps (3 groups, rows `NB OFF TO BROADWAY TERR.`, `NB ON FR BROADWAY TERR.` and `EB ON FR TELEGRAPH`).
- Held out by the draw: 86 stations in 76 groups. Held out after the rule: 73 stations in 69 groups. Every one of the 13 is a derived target and no other station changes side.
- Hash order is untouched, so the draw of every other group is what it was. Re-freezing the split reproduces the committed groups and held flags exactly; only the sentence in `retained` differs, which is drift already on main and is not in any check.
- The split still reads no count value.

A corridor made only of derived groups (`ashby`, `tunnel`, `sanpablo`, `Ashby Avenue`) ends with no held group. That waives the "one held group per corridor" rule for those corridors, which is the intent.

Alternative kept open: re-freeze the split with the override (`SplitStation.derivedTarget`), accept the new hash, and restamp the shipped side. It gives a split file that says what is held. This change prefers an unchanged published side. If the project lead chooses the alternative, the code change is small, but the shipped demand, its membership file, the proposals, the results and the redistribution files all need the restamp procedure.

### D3: Scoring leaves derived targets out and lists them

`scoreStations` sets `held` to the side a station is scored on (never held for a derived target) and keeps `drawnHeld`. Its fitted, held, interior and other summaries leave derived targets out; `derivedTargets` summarizes them and `legacy` gives the fitted and held figures under the old scope. `ruleSplit` returns the three recent, older and all groups on the new scope, a `dailyTotal` tally, the existing `derived` tally for scaled copies (a station that is both counts as a derived target), and the old-scope groups. In AM and midday the derived targets were already out of the groups as scaled copies, so the old and new figures agree there and the stations move from the scaled-copy tally to the derived-target tally.

The assessment prints, per period, a derived-target table (station, source and count year, hourly-equivalent target, simulated mean and GEH on the shipped and on the cross-validation demand, the words "derived from a daily total, not judged"), a closing sentence that counts the gate stations without a link, and in the verdict a table of the new-scope and old-scope pass counts. The thresholds are unchanged: GEH below 5 at more than 85% of stations and at least 10 recent held-out stations ([WebTAG-M3.1] 3.3.10 to 3.3.12, [TfL-TMG4] appendix II). The failing held-out table and the dominant-source sentence exclude derived targets. `suggestStatus` reads the new-scope verdicts, so its reasons follow.

The old scope on a new cross-validation demand is a comparison and not a like-for-like out-of-sample figure: the demand now fits the derived targets, so their held-out column is in sample. The report says so. The like-for-like before figure is the published assessment's (PM held out 14 of 24, fitted 81 of 92).

`tools/cost-loop.ts` reads `scoreStations().fitted`, so its fitted GEH share now excludes derived targets as well. The loop is not part of the published chain.

### D4: What is hashed

- Shipped demand: unchanged. Its `build` object is unchanged, its content does not depend on the held flags (the shipped fit resets them) and it records the same split hash.
- Stations file, split file, groups file, config: unchanged, because the rule is applied by the readers.
- Shipped membership file: its evidence (view, network, split, config, count file, stations, targets, simulator, station count version) is unchanged, so the loop regenerates it byte for byte.
- Training demand and training membership: these change. The training view withholds 78 station ids instead of 91, and nothing in the old evidence tells the two apart: the split hash, the stations hash and the config hash are the same. The training demand's `build` therefore gains `withheld` (SHA-256 of the sorted withheld station ids, `withheldDigest`), the training membership evidence gains the same field, `membershipEvidenceMismatches` compares it, and `buildEvidence` makes the assessment refuse a cross-validation demand without the current digest. Without this, the old training membership file would pass the guard and be used silently on a demand it was not fitted for.

### D5: Status, site text and docs

The rule and the wording generator read the new scope through `ruleSplit` and `suggestStatus`; nothing in `data/areas/rockridge.json` changes in this change. The calibration note and caveat are updated by the documented procedure after the laptop assessment: the project lead reviews `summary.md`, and the note is written from the new assessment.

Draft text for that update, to be checked against the laptop figures before use: "Not calibrated: PM count locations held out of the fit pass N of M hourly counts (rule: over 85%), and PM fitted locations pass N of M. Targets derived from daily totals (state-route and freeway-ramp stations) are in the fit and are not judged." The caveat's sentence about the assessment of November 18 and the held-out count of 14 of 24 is rewritten with the new scope.

The Assumptions tab gets a section "Targets derived from daily totals" after the assumed movement flows. Its text is `DERIVED_TARGETS_INTRO` in `src/lib/copy.ts`, shared with the text page. It follows the repository's accessibility rules: the table has a caption, column headers and row headers; it sits in a scroll region with `tabIndex` 0, a role and a label so a keyboard can reach it on a phone; the status is words in a column, not color; the heading is an anchored sticky heading like the other two. The factors are taken from the data file (`derivedTargets.kFactor`, `rampKFactor`, `inboundShare`), which `tools/build-assumptions.ts` fills from the config and the stations file. The section is rendered only when the file has `derivedTargets`, so the app and the published data can be deployed in either order, and the site does not change until the data is regenerated and pushed. `docs/data-files.md` does not describe station scope, so it is unchanged; the scope is described in `data/demand/README.md` and `data/calibration/README.md`.

### D6: The laptop runbook

`runbook.md` and `laptop/*.zsh`. The scripts follow the round 52 restamp: verify the published hashes, build in a second worktree so that no published file is written, run the membership loop and both demand builds, check identity, run the validation suite and two assessments, and pack the candidate outputs on the development branch as parts of at most 190,000 bytes with SHA256SUMS. Seeds 1 to 10 and fresh seeds 11 to 20 are run so that the new held-out figures are not read from one seed set only. Nothing pushes data, uses the upload token or calls the site's API.

### D7: Container checks

Run in the cloud container on 2026-11-22, with the published ignored data copied in (hashes checked: network `53c823f20d9165ed`, demand `2d16d8f8eb0950ca`, membership `56e688e7e5749d23` and `cf32e3e0d9e6f23e`, fingerprint `6b886c8f52ee07397773ddd0ebbcb447`). Evidence is in `evidence/`.

- (a) The shipped demand built with this code, the published membership files and the committed stations, split and config files is `2d16d8f8eb0950ca`, byte-identical to the published file. The stations file and the groups file the build writes are byte-identical to the committed ones, and so is `rockridge.audit.md`. The fit reports differ only in the held-out notes (`rockridge.fit.md`, 3 lines) and in the station rule lines (`rockridge.fit.stations-*.md`, 4 lines each: the new scope, the derived-target tally and the old-scope line). The build took about 22 minutes here.
- (b) `data/demand/rockridge.split.json` is not changed. `evidence/held-set.diff` is the diff of the held-out station ids before and after the rule: 13 removed, none added, all derived targets (`evidence/derived-stations.md` lists them with their groups). Re-freezing with `npm run data:split` into a scratch folder reproduces the committed groups and held flags; only the `retained` sentence differs, as it already does on main.
- (c) Re-scoring: the per-station flows of the published ten-seed set are not on this machine (the committed seed reports keep summaries only, and the local seed folders are from rounds before 52), so the counts are arithmetic on the committed assessment (`evidence/pm-rescore.md`, from `tools/derived-rescore.ts --assessment`). PM recent held out: 14 of 24 becomes 14 of 18 (78%, not met): the six AADT link stations are in the table of held-out misses, so all six missed and none passed. PM recent fitted: 81 of 92 becomes 79 of 89 (89%, met): the three recent derived stations are the Caldecott ramps, two of which passed. AM: the published counts do not change under the new scope (72 of 77 fitted, 15 of 19 held out), because the AM targets of these stations were already left out as scaled copies of the PM figure. The new cross-validation demand will move the AM held-out figure itself, since the derived targets join its fit; only the laptop run shows by how much. The check holds: PM held out 14 of 18, AM counts unchanged.
- (d) Unit tests (`tools/derived-targets.test.ts` and additions to the lineage, assess-integrity, shard, through-targets, assumptions, llms and copy tests): classification from source kinds, the build's stations, split invariance on a fixture and on the committed Rockridge files, scoring exclusion, the old-scope line, the membership evidence field, the Assumptions data. `calibrate` has a Rust unit test of its group rule. `npx vitest run tools/ worker/ src/lib`: 108 files, 1,160 tests passed. `npx tsc --noEmit` is clean after `npm run wasm`. `cargo test --release -p traffic-sim --bin calibrate`: 15 passed.
- An interim training demand, built with this code on static route shares (the old training membership file moved aside, so it is not the candidate), completes: its `build` carries `withheld`, the withheld-observation guard passes, and the PM gate volumes of Ashby Ave (2,520), San Pablo Ave (3,690) and Tunnel Rd (2,430) equal the shipped demand's instead of the class defaults the held-out rule forced. The training view also keeps the ADT stations of four ramps whose counted legs it withholds (nodes 679, 683, 725 and 833); they are in no frozen group and were fitted in the old training view too.

## Citations

[FHWA-TMG2022] (K and design-hour volume = AADT x K x D; the 0.09 value is not in it), [CaltransAADT] (AADT is the annual total over 365), [WebTAG-M3.1] 3.3.10 to 3.3.12 (GEH below 5 at more than 85% of cases) and appendix C, [TfL-TMG4] appendix II (GEH), [FHWA-TAT3-2019] (one counting day does not establish performance on other days). All are in `docs/references.md`. K = 0.09, the directional split and the period factors remain ASSUMPTIONs and are labeled so in the code, the reports and the site text.

## Open points

- Ramps are classified as derived targets because they are built the same way as the AADT stations (D1). The project lead may prefer to keep them judged.
- The split file is unchanged and the rule sits on top of it (D2). The alternative is a re-frozen file and a restamp of the shipped side.
