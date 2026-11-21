# Round 53 runbook: the count's cars that ended along the street as fit targets, on a laptop

Base: `origin/calibration-round-53` (branches from `origin/main` at 7413bd7). Commit your results on branch `salvatoret/peaceful-fermi-dlwt0u` by merging `origin/calibration-round-53` into it. Run every command from the repository root.

Status of each step in the container that wrote this file: **RAN** (run there), **UNTESTED** (written from reading the tools, never run). No simulation ran in that container. What ran there: the test files named in step A; the demand builds of design.md "Checked in the container" (switch absent with the published membership files; candidate entry with no membership file; candidate entry with the published files hand-stamped for the candidate's config hash, in a scratch copy); the three scripts `node-ends.cjs`, `end-along-sim.cjs` and `end-along-lines.cjs` on made-up input; `scripts/confirm.cjs` on the published assessment. The loop itself, the pooling of real `--select-od` files, `calibrate`, every assessment step and `scripts/confirm.zsh` and `scripts/restore.zsh` are UNTESTED here.

Never: push to `main`, `npm run data:push`, `npm run data:split` (the split stays frozen), any request to `https://traffic.transit.directory/api/*`, an upload token or any secret in a message or a file, an edit to the note or caveat in `data/areas/rockridge.json`, marking a validation deviation reviewed, loosening the keep rule, the screen or the improvement test after a result, `--publish` on an assessment, editing a membership file or the demand config after a loop has started. The only config change is what `apply-candidate.py` inserts into `data/demand/rockridge.config.json` (`countFit.endAlong` and `simulatedMembership.endAlong`). Do not edit `crates/sim/src/bin/calibrate.rs`. Reusing a run set of an earlier round is not allowed: the config hash differs.

`calibrate` and `assess` read `public/data` and the network and demand files of the checkout they were built in, and the loop reads `data/demand/rockridge.stations.json` and the config of the checkout. Build and run them from this checkout. Use `JOBS=12` (results do not depend on it).

## Time

Measured on the laptop on the faster simulator (record entry "Published set regenerated on the faster simulator"): the round 52 membership loop took 3,777 s (63 minutes), `npm run data` 1,017 s (17 minutes), `validate` 18 s, a ten-seed `assess --publish --noise` 70 s. This round adds one constraint to the fit, so expect the same. The required path: gate 17 minutes (one `npm run data`), baseline screen under 1 minute, the loop about 65 to 75 minutes, screen 1 minute, validation and ten seeds 2 minutes, the ten-seed select-link runs for the end-along figures about 5 minutes, and, only if the keep rule passes, the fresh-seed confirmation (two three-period sets on seeds 11 to 20, about 3 minutes) and the restore (17 minutes). About 2 hours 15 minutes in all. A stop after pass 1 saves about a quarter of the loop.

## A. Setup

```
git fetch origin
git checkout salvatoret/peaceful-fermi-dlwt0u
git merge --no-ff origin/calibration-round-53      # no reset, no force push
npm install
JOBS=12
mkdir -p target/r53 openspec/changes/calibration-round-53/evidence
```

Git-ignored inputs (`data/osm/*.json`, `data/demand/raw/`) are needed, and the OSM extract must be the 2026-11-11 one (the importer must give network 53c823f20d9165ed in step B). The published membership files are needed too: they are in `target/membership/` after the round 52 republish and in R2 under `demand/membership/` (`npm run data:pull` fetches them with the credentials already on the laptop). Check them and keep a copy:

```
sha256sum target/membership/*.json | cut -c1-16,65-       # 56e688e7e5749d23 (shipped), cf32e3e0d9e6f23e (training)
mkdir -p target/r53/published-membership && cp target/membership/*.json target/r53/published-membership/
```

If a hash differs, stop and report: the published model cannot be rebuilt from other files, and the demand build now stops on membership evidence that does not match its inputs.

```
cargo build --release -p traffic-sim --bin calibrate --bin validate --bin fingerprint
cargo run --quiet --release --bin fingerprint        # must print 6b886c8f52ee07397773ddd0ebbcb447
npx vitest run tools/end-along.test.ts tools/membership-loop.test.ts tools/block-membership.test.ts tools/route-weight.test.ts tools/outside-scope.test.ts      # RAN in the container, passes
```

## B. Gate: reproduce the published model

With the sub-switch absent the build must not change, with the published membership files in `target/membership/`. This is the check that the code added for this round is inert.

```
npm run data
sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json | cut -c1-16 | tee openspec/changes/calibration-round-53/evidence/baseline-hashes.txt
shasum -a 256 data/demand/rockridge.config.json | cut -c1-16        # 2405ff02c92b2837
git status --short
```

Expected hashes, in order: `53c823f20d9165ed`, `2d16d8f8eb0950ca`, `1c3b1666f24156f1`. `git status --short` must show nothing under `data/`. In the container both demand builds (switch absent, published membership files, run with `--out-root`) gave the same demand and cross-validation demand (RAN, design.md). The `npm run data` importer step is UNTESTED there. If a hash differs, stop and report.

Save the baseline files, then move the published membership files aside (the loop refuses to start while a configured membership file exists):

```
cp public/data/rockridge.network.json target/r53/network.base.json
cp public/data/rockridge.demand.json target/r53/demand.base.json
cp target/validation/rockridge.demand.json target/r53/demand.base.cv.json
cp data/demand/rockridge.stations.json target/r53/stations.base.json
cp data/demand/rockridge.fit.md target/r53/fit.base.md
mv target/membership target/r53/membership-aside
[ -d target/membership-loop ] && mv target/membership-loop target/r52-loop
```

From here to step I the published files are not in `target/membership/`. Step I (or `scripts/confirm.zsh`) puts them back and checks the rebuild. Do not run `npm run data` between D and I: it would stop on the candidate's evidence or rebuild on the wrong files.

## C. Baseline screen (three seeds, no verdict)

```
npm run assess -- --seeds 1-3 --periods am_peak,pm_peak --suffix r53-base-screen --diagnostic --jobs $JOBS 2>&1 | tee target/r53/screen-base.log
```

Write down from the "Status rules, per period" section the four station counts (PM fitted, PM held out, AM fitted, AM held out) and whether any car was cleared from gridlock in the judged zone. From the "Stability rule (D16)" line of each period write down "backlog under 2% in k of 3 seeds (mean, max)". The baseline should show 3 of 3 in both periods; if it does not, report that before going on.

## D. The loop with the end-along targets

```
git checkout data/demand; git status --short
python3 openspec/changes/calibration-round-53/apply-candidate.py end-along       # prints: applied end-along config hash 35ba56ab82aa7070
git diff --stat data/demand/rockridge.config.json                                  # one block of 4 lines, the switch line, and the changed _note line
npx tsx tools/membership-loop.ts --dry-run 2>&1 | tee openspec/changes/calibration-round-53/evidence/dry-run.txt
```

If the printed hash is not `35ba56ab82aa7070`, the committed config is not round 52's: stop and report.

Expected from the dry run (the station choice does not depend on the sub-switches): shipped PM 337 selected (245 link, 92 movement or route), AM 272 (200, 72), six gate stations static; training PM 256 (187, 69) with 87 withheld, AM 201 (148, 53) with 77 withheld, none static. The frozen split withholds 91 stations from the training view. If the numbers differ, the stations file or the split on the laptop is not the committed one: stop and report.

From here on the config is fixed. Its hash is in every membership evidence block.

```
GATE_PRIOR_DUMP=target/r53/node-prior.json npx tsx tools/membership-loop.ts --jobs $JOBS --report openspec/changes/calibration-round-53/evidence/membership-loop.md 2>&1 | tee target/r53/loop.log
```

It runs, in order, for passes 0, 1 and 2: both demand builds (shipped, then training), seeds 1 to 10 for PM and AM on each view (one `calibrate` process per seed, `--select-od` to its own file), then the pool. The last step builds both views from the final pool. Everything it writes is under `target/membership-loop/` and `target/membership/`.

What to expect in `target/r53/loop.log`. The lines of rounds 50 to 52 are as in `openspec/changes/archive/2026-11-20-calibration-round-52/runbook.md` step D and are not repeated here: pass 0 builds without a membership file and its periods must equal the baseline's (compare `JSON.stringify(periods)` of `target/membership-loop/iter0/shipped/demand.json` with `target/r53/demand.base.json`, and the training copy with `target/r53/demand.base.cv.json`; in the container the candidate entry with no file gave periods identical to a static build of the committed config, RAN); from pass 1 the ceiling lines, the offered-demand percentage (abort above +3% of the static fit, a report-only warning below -10%), the share and through lines, the route weight lines (Colby Street 7 or 8 blocks, Hillegass Avenue 4, as in round 52) and the pool lines. New in round 53:

- **End-along lines.** Every shipped build from pass 1 has, per period, one line per select-link run with a count: `pass K shipped <period>: end along <run> (simulated|static): target T veh/h, weight 2, fit F on the membership used (S on static routes), after the count-only fit A (B), offered O (P), N flows, M nodes`. Expect four lines per period (Hillegass Avenue NB and SB, Colby Street NB and SB; targets PM 15, 29, 40, 43 and AM 9, 14, 9, 15 for Hillegass NB, Colby NB, Hillegass SB, Colby SB) with `simulated` in both periods from pass 1 (the file has block pairs for all four runs in the published pool, so a `static` line or a `WARNING ... end-along target ... took static routes` means a run had no simulated trip: report it). Nodes counted: Colby Street 786 793 799 819 828 1070 1071, Hillegass Avenue 1085 1086 1090. The loop stops with `no "End along" line for <period>` if a shipped build from pass 1 has none (the build did not apply the sub-switch): do not continue by hand; send back the build log and the fit report. The training build has fewer lines or none, because a run with a held block on it is left out of that view: the fit report names each left-out run in the notes (`end-along target <run>: its street run holds a held-out block; left out of the training view`); copy those notes into the report.
- The fit report has a section "Trips that ended along the street (round 53, ASSUMPTION)" with the same figures. The loop's report lists them under "Share and through targets, by build". The loop keeps each build's fit reports under `target/membership-loop/fits/<step id>/`.
- **The two figures that decide the round.** For PM Colby Street SB: the end-along line (target 43) and the whole-street route station (target 39). Read them in the route-fit table below. If the end-along figure is far under its target after the fit (the fit can scale existing pairs by at most 10 for local flows and 3 for through flows), say how far and report the seed volumes at the interior nodes (`node-ends.cjs` below).
- If the offered car demand of a view and period goes more than 3% above the static fit's, the driver stops with a non-zero exit before that pass's seed runs. On an abort, stop and report: send back `target/r53/loop.log`, the build log of that pass (`target/membership-loop/logs/`) and the fit report `data/demand/rockridge.fit*.md`, and do nothing else: no `--resume`, no config change, no other run.
- `--resume` continues after an interruption. The loop stops if the config, the stations file or the split file changes while it runs.

When it ends, `public/data/rockridge.demand.json` and `target/validation/rockridge.demand.json` are the final demands and `data/demand/rockridge.fit*.md` the final reports. Record, and save everything the confirmation and the restore need:

```
sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json target/membership/*.json | cut -c1-16,65- | tee openspec/changes/calibration-round-53/evidence/candidate-hashes.txt
cmp target/r53/network.base.json public/data/rockridge.network.json && echo network identical
cmp target/r53/stations.base.json data/demand/rockridge.stations.json && echo stations file identical
mkdir -p openspec/changes/calibration-round-53/evidence/fit && cp data/demand/rockridge.fit*.md data/demand/rockridge.stations.json openspec/changes/calibration-round-53/evidence/fit/
cp target/membership-loop/state.json openspec/changes/calibration-round-53/evidence/
# copies the confirmation (step G) and the restore (step I) need
mkdir -p target/r53/fit-cand target/r53/cand-membership && cp data/demand/rockridge.fit*.md target/r53/fit-cand/
cp target/membership/*.json target/r53/cand-membership/
cp public/data/rockridge.demand.json target/r53/demand.cand.json
cp target/validation/rockridge.demand.json target/r53/demand.cand.cv.json
shasum -a 256 data/demand/rockridge.config.json | cut -c1-16 > target/r53/cand-config.sha
sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json target/membership/rockridge.membership.json target/membership/rockridge.membership-training.json | cut -c1-16 > target/r53/cand-hashes.txt
```

The fit's own values, per build, shipped view (the training view has no route stations and fewer end-along lines):

```
for q in pm_peak am_peak; do
  node openspec/changes/calibration-round-53/scripts/end-along-lines.cjs $q pass1=target/membership-loop/fits/i1-shipped-build/rockridge.fit.md pass2=target/membership-loop/fits/i2-shipped-build/rockridge.fit.md final=target/membership-loop/fits/final-shipped-build/rockridge.fit.md | tee openspec/changes/calibration-round-53/evidence/end-along-fit-$q.md
  node openspec/changes/calibration-round-53/scripts/route-lines.cjs $q fit=pass0=target/membership-loop/fits/i0-shipped-build/rockridge.fit.stations-$q.md fit=pass1=target/membership-loop/fits/i1-shipped-build/rockridge.fit.stations-$q.md fit=pass2=target/membership-loop/fits/i2-shipped-build/rockridge.fit.stations-$q.md fit=final=target/membership-loop/fits/final-shipped-build/rockridge.fit.stations-$q.md | tee openspec/changes/calibration-round-53/evidence/route-fit-$q.md
done
```

Drop a column whose step did not run (a stop after pass 1 has no `i2`). The second command lists, per station, `target / after the count-only fit / final` for pass 0 (the baseline), pass 1, pass 2 and the final build: the four whole-street route stations and the Colby Street and Hillegass Avenue block stations. Round 52's own figures for PM Colby Street SB whole street were target 39, and 75 on seeds 1 to 10 in the ten-seed simulation.

The trip ends at the interior nodes, static against final, and the offered demand (design D6):

```
for q in pm_peak am_peak; do node openspec/changes/calibration-round-53/scripts/node-ends.cjs $q base=target/r53/demand.base.json static=target/membership-loop/iter0/shipped/demand.json final=public/data/rockridge.demand.json | tee openspec/changes/calibration-round-53/evidence/node-ends-$q.md; done
```

`static` is the pass 0 demand, the fit with no membership, which is what the ceilings anchor on; `base` is the published model. Run it for the training views too (`target/r53/demand.base.cv.json`, `target/membership-loop/iter0/training/demand.json`, `target/validation/rockridge.demand.json`) with `--nodes` unchanged, into `node-ends-cv-<period>.md`.

## E. Screen the final demand

```
npm run assess -- --seeds 1-3 --periods am_peak,pm_peak --suffix r53-screen --diagnostic --jobs $JOBS 2>&1 | tee target/r53/screen-r53.log
```

Apply the screen rule (design D5): each of the four counts no more than 3 stations below the step C baseline, no car cleared from gridlock in the judged zone, and the backlog line "backlog under 2% in 3 of 3 seeds" in both AM and PM. The screen's assessment file, `data/calibration/rockridge.assessment-r53-screen.md`, carries it in the "Stability rule (D16)" line of each period as "backlog under 2% in k of 3 seeds (mean x%, max y%)". If the line is missing, compute it from the per-seed runs under `target/assess-variants/r53-screen/` (`health.backlogPct` of each seed; the screen fails if any value is 2 or more).

If it does not advance, the candidate stops here; the evidence is the result. Go to step I (restore). Advance to step F only if each of the four counts is no more than 3 stations lower than the baseline screen of step C, no car is cleared from gridlock in the judged zone, and the backlog line holds.

## F. Validation and ten seeds

```
./target/release/validate | tail -4                      # must stay 67 of 74 at 6b886c8f52ee07397773ddd0ebbcb447
git checkout data/calibration/validation.json            # only its revision field changes; do not commit it
npm run assess -- --suffix r53 --noise --jobs $JOBS 2>&1 | tee target/r53/assess-r53.log
```

Never add `--publish`. Outputs: `data/calibration/rockridge.assessment-r53.md`, summaries in `target/assess-variants/r53/`, per-seed reports in `target/assess-seeds/60r53` and `60r53-cv` (the directory names follow the suffix; if they differ on the laptop, change the `sim=` arguments below and say so).

### Keep rule (design D5), baseline values

| Criterion | Line to meet | Baseline (published round 52) | Candidate | Pass |
| --- | --- | --- | --- | --- |
| PM fitted recent stations, GEH < 5 | at least 81 of 92 | 81 | | |
| PM held out | at least 14 of 24 | 14 | | |
| AM fitted | at least 72 of 77 | 72 | | |
| AM held out | at least 15 of 19 | 15 | | |
| D5 headline shares within 10 points | 4 of 4 | 4 (mean error 3.8) | | |
| Whole-street traversals, GEH < 5 | 8 of 8 | 8 | | |
| D16 stability in every period | holds | holds | | |
| Validation suite | 67 of 74 | 67 | | |

One figure below its line fails the candidate. Read the held-out rows, the D5 row and the D16 rows first. Do not loosen the rule after seeing a result. Write into the verdict that the whole-street line and the end-along figures are fitted quantities in the shipped view (passing them shows the fit meets its own targets in the simulator) and that the training view never sees them where a held block lies on the run, so the held-out counts remain the independent check.

### The improvement test (design D5), written before any run

The round is worth adopting only if PM Colby Street SB whole-street traversals fall by at least 15 cars an hour against the baseline on BOTH seed sets: seeds 1 to 10 (baseline 75, counted 39) and seeds 11 to 20 (baseline 67). The threshold is an ASSUMPTION, about four standard errors of the ten-seed mean (se 3.4 to 4.4). `scripts/confirm.cjs` prints the test from the assessment tables (whole cars); read the exact ten-seed means from route-lines below if the fall is between 14.5 and 15.5.

### Reported, not conditions (design D6)

Write these into the report for the baseline and the candidate, in the shipped and the cross-validation view:

- the lists of round 52's runbook step F (the five diagonal stations, Colby St NB, gate totals and the SR-24 mainline gate flow and backlog, mean through cars, car veh/h offered by each pass, every SR-24 ramp, the 12 travel times, per-gate totals, the nodes breakdown, the southbound to-freeway numerators, trips waiting by gate), with the directories renamed (`60r47-base` is now the published set: use `60r52` or whatever the published assessment's per-seed directories are called on the laptop, and `60r53` for the candidate). The southbound shares:

```
node openspec/changes/archive/2026-11-19-calibration-round-50/scripts/shares.cjs pm_peak baseline=<published per-seed dir> candidate=target/assess-seeds/60r53 'baseline cv=<published cv dir>' 'candidate cv=target/assess-seeds/60r53-cv' | tee openspec/changes/calibration-round-53/evidence/shares-pm.md
```

  (Show "to Forest St" and "from Alcatraz" for Colby St SB.)
- the shares of Colby St SB including "to Forest Street" and "from Alcatraz Avenue EB / WB" and "from Telegraph Avenue", PM, baseline and candidate, from the assessments: `grep "Colby Street SB" data/calibration/rockridge.assessment.md | head -8` and the same on `data/calibration/rockridge.assessment-r53.md`
- the four whole-street values and the Colby Street SB blocks, ten-seed simulated, baseline against candidate:

```
for q in pm_peak am_peak; do node openspec/changes/calibration-round-53/scripts/route-lines.cjs $q sim=baseline=<published per-seed dir> sim=candidate=target/assess-seeds/60r53 | tee openspec/changes/calibration-round-53/evidence/route-sim-$q.md; done
```

- the simulated end-along figures: trips that used a link of the run and ended at the run's interior nodes, ten-seed mean, for each run with a count, baseline demand against candidate demand. The assessment does not write select-link trips, so run `calibrate --select-od` on both shipped demands, seeds 1 to 10, PM and AM (the loop's own command):

```
JOBS=$JOBS zsh openspec/changes/calibration-round-53/scripts/sod.zsh base target/r53/demand.base.json      # prints 20
JOBS=$JOBS zsh openspec/changes/calibration-round-53/scripts/sod.zsh cand target/r53/demand.cand.json      # prints 20
for q in pm_peak am_peak; do node openspec/changes/calibration-round-53/scripts/end-along-sim.cjs $q baseline=target/r53/sod-base candidate=target/r53/sod-cand | tee openspec/changes/calibration-round-53/evidence/end-along-sim-$q.md; done
```

  `demand.base.json` is the published demand saved in step B and `demand.cand.json` the candidate's, saved after step D. Report the PM Colby Street SB row first: target 43, the whole-street route target 39.

## G. Fresh-seed confirmation (automatic after a pass)

Design D5, written by the lead before any run: a candidate that passes the keep rule on seeds 1 to 10 is then run on seeds 11 to 20 together with the baseline, and must be no worse than the baseline on every keep-rule line computed on those seeds. If step F passed every line, run it now without waiting for the lead. If step F failed a line, skip this step and go to step I.

```
zsh openspec/changes/calibration-round-53/scripts/confirm.zsh
```

The script (UNTESTED here, modeled on round 52's) copies the ten-seed assessment into the evidence folder, puts the baseline demand back and checks the baseline inputs (config 2405ff02c92b2837, the three baseline hashes, the fingerprint) and the candidate inputs against the files step D saved, runs `npm run assess -- --seeds 11-20 --suffix r53-confirm-base` and then `--suffix r53-confirm` (verdict mode, no `--diagnostic`, `--publish` or `--noise`), restores the published model with `scripts/restore.zsh` (published membership files, `npm run data`, demand `2d16d8f8eb0950ca` and cross-validation demand `1c3b1666f24156f1` verified) and writes `target/r53-confirm/confirm.md` with `scripts/confirm.cjs`: the keep-rule lines for the baseline and the candidate on seeds 1 to 10 and 11 to 20, the watched lines (PM Colby Street SB whole street, Hillegass Avenue SB to the freeway, backlog and gridlock clearances), the eight whole-street traversals and the improvement test. The baseline of seeds 1 to 10 is the published assessment `data/calibration/rockridge.assessment.md`. If a hash check stops it, send back `target/r53-confirm/chain.log` and do nothing else. Copy `target/r53-confirm/` into `evidence/confirm/`. For comparison, round 52's confirmation numbers are in `archive/2026-11-20-calibration-round-52/evidence/confirm/confirm.md`.

Report both results, the ten-seed table, the confirmation table and the improvement test. Adoption stays the project lead's decision.

## H. Commit and send back

```
cp data/calibration/rockridge.assessment-r53*.md openspec/changes/calibration-round-53/evidence/ 2>/dev/null
cp target/r53/screen-*.log target/r53/loop.log target/r53/assess-r53*.log openspec/changes/calibration-round-53/evidence/ 2>/dev/null
mkdir -p openspec/changes/calibration-round-53/evidence/confirm && cp target/r53-confirm/* openspec/changes/calibration-round-53/evidence/confirm/ 2>/dev/null
for f in target/membership-loop/logs/*-build.log; do tail -n 40 "$f" > openspec/changes/calibration-round-53/evidence/$(basename "$f"); done
mkdir -p openspec/changes/calibration-round-53/evidence/node-prior-csv
for f in target/r53/node-prior.*.json; do node -e "const r=JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'));const f=x=>Math.round(x*100)/100;console.log('node,direction,gate,anchor,ceiling,beforeProjection,final,removed');for(const x of r)console.log([x.node,x.direction,x.gate?1:0,f(x.anchor),f(x.ceiling),f(x.beforeProjection),f(x.final),f(x.removed)].join(','))" "$f" > openspec/changes/calibration-round-53/evidence/node-prior-csv/$(basename "$f" .json).csv; done
find openspec/changes/calibration-round-53/evidence -size +190k      # must print nothing (the hook blocks files over 200 KB)
git checkout data/demand
git status --short                                                 # nothing but the evidence
git add openspec/changes/calibration-round-53/evidence
git commit -m "chore(data): round 53 evidence"
```

Push that branch only, never `main`. Keep the baseline screen log and `baseline-hashes.txt` in `evidence/` too. `public/data` is generated and ignored, and `target/` is ignored.

Send back in the report, even if not committed: the baseline hashes; the candidate's three hashes and the two membership file hashes; each build's ceiling lines; the dry-run counts; the loop's per-pass lines (stations with pairs, zero-hit and unexported stations, the two ratios, the ceiling figures, the end-along lines); how many passes ran and whether the stop rule fired; the baseline and candidate screen counts and backlog lines; the filled keep-rule table if it reached step F; the improvement test; the reported lists; and the log of anything that stopped early with the reason.

## I. Restore the published model (always)

The confirmation does this itself. Run it by hand when the candidate stopped at the screen or the keep rule, or when the confirmation stopped early:

```
zsh openspec/changes/calibration-round-53/scripts/restore.zsh
```

It restores the committed config, puts the published membership files back, rebuilds with `npm run data` and checks demand 2d16d8f8eb0950ca and cross-validation demand 1c3b1666f24156f1 (it says `restore verified` or stops). If the candidate fails, the evidence is the result and nothing published changes. If it passes, adopting it (the config entries, the membership files to R2, the rebuilt data, a new proposal search and results) is the lead's and the project lead's step and is not part of this runbook.
