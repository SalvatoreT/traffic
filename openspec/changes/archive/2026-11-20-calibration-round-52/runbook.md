# Round 52 runbook: whole-street route counts weighted by the blocks they span, ceilings outside the study area only, on a laptop

Base: `origin/calibration-round-52` (branches from `origin/main` at 253f532). Commit your results on branch `salvatoret/peaceful-fermi-dlwt0u` by merging `origin/calibration-round-52` into it. Run every command from the repository root. Reference times from round 44 on a 4-core container: a demand build is 10 to 13 minutes per view, a ten-seed set for one period and view about 5 minutes, a full assessment about 25 minutes. With 12 jobs expect roughly a third of the run times; builds do not speed up.

Status of each step in the container that wrote this file: **RAN** (run there), **UNTESTED** (written from reading the tools, never run). No simulation ran in that container. What ran there: the test files named in step A; both demand builds with the config as committed (baseline hashes); the shipped build with the candidate entry and no membership file (periods identical to the baseline's); and the shipped build with a made-up membership file that carries pairs for the fitted stations, with and without `routeWeightPerBlock` (see design, "Checked in the container"). The loop itself, the pooling of real `--select-od` files, `calibrate`, every assessment step, `scripts/route-lines.cjs` on real seed reports and `scripts/confirm.zsh` are UNTESTED here. `scripts/confirm.cjs` and the fit-report half of `route-lines.cjs` ran on round 51 files.

Never: push to `main`, `npm run data:push`, `npm run data:split` (the split stays frozen), any request to `https://traffic.transit.directory/api/*`, a secret in a message or a file, an edit to the note or caveat in `data/areas/rockridge.json`, marking a validation deviation reviewed, loosening the keep rule or the screen after a result, `--publish` on an assessment, editing a membership file or the demand config after a loop has started. Reusing a run set of rounds 48 to 51 is not allowed: the config hash differs. The only config changes are the entries `apply-candidate.py` inserts into `data/demand/rockridge.config.json` (`countFit.gatePriorTotals`, with `scope` `outsideStudyArea`, and `countFit.throughTargets.simulatedMembership`, with `throughTargets`, `shares` and `routeWeightPerBlock` true). The scripts `nodes.cjs` and `shares.cjs` are the archived round 50 ones (`openspec/changes/archive/2026-11-19-calibration-round-50/scripts/`); they are read-only, so run them as written and do not rewrite them. Do not edit `crates/sim/src/bin/calibrate.rs`.

`calibrate` and `assess` read `public/data` and the network and demand files of the checkout they were built in, and the loop reads `data/demand/rockridge.stations.json` and the config of the checkout. Build and run them from this checkout. Use `JOBS=12` (results do not depend on it).

## Time

Round 51's loop took 3,986 s (66 minutes) on the laptop. This round changes one scope and one weight, so expect the same, about 4 hours for the required path: gate 25 minutes (two builds), baseline screen 5, the loop about 70 to 100, screen 5, validation and ten-seed assessment 15, and, only if the keep rule passes, the fresh-seed confirmation about 15 (two three-period sets on seeds 11 to 20 and the restore). A stop after pass 1 saves about a quarter of the loop.

## A. Setup

```
git fetch origin
git checkout salvatoret/peaceful-fermi-dlwt0u
git merge --no-ff origin/calibration-round-52      # no reset, no force push
npm install
JOBS=12
mkdir -p target/r52 openspec/changes/calibration-round-52/evidence
```

Without `--resume` the loop driver refuses to start if `target/membership-loop/` is non-empty or a configured membership file already exists; move those away first. Round 51's folders are still on the laptop: move `target/membership-loop` to `target/r51-loop` and `target/membership` to `target/r51-membership` before the loop, and the round 51 evidence stays where it is. Round 51's `target/r51` and `target/r51-confirm` stay as they are.

Git-ignored inputs (`data/osm/*.json`, `data/demand/raw/`) are needed. Get them as in round 44: `data:pull` with the R2 credentials already on the laptop, or copy `data/osm` and `data/demand/raw` from a checkout that has them. `npm run data:fetch` may give other bytes; do not use it. The OSM extract must be the 2026-11-11 one: the importer must give network 53c823f20d9165ed in step B.

```
cargo build --release -p traffic-sim --bin calibrate --bin validate --bin fingerprint
cargo run --quiet --release --bin fingerprint        # must print d45a275dd7be0713cec6a64394b7d8a9
npx vitest run tools/gate-prior.test.ts tools/node-prior.test.ts tools/block-membership.test.ts tools/membership-loop.test.ts       # RAN in the container, passes
```

## B. Gate: reproduce the baseline

With no `gatePriorTotals` entry the build must not change. This is the check that the code added for the ceilings is inert.

```
npm run data
sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json | cut -c1-16 | tee openspec/changes/calibration-round-52/evidence/baseline-hashes.txt
git status --short
```

Expected hashes, in order: `53c823f20d9165ed`, `9cdebdabf05c4460`, `2f9ae152b9bbf78e`. `git status --short` must show nothing under `data/`. In the container, both demand builds with this code and no entry (run with `--out-root`, so the files are outside `public/data`) gave 9cdebdabf05c4460 and 2f9ae152b9bbf78e (RAN) and a stations file byte-identical to the committed one (RAN); the committed network file hashes to 53c823f20d9165ed (RAN). The `npm run data` importer step is UNTESTED there. If a hash differs, stop and report.

Save the baseline files:

```
cp public/data/rockridge.network.json target/r52/network.base.json
cp public/data/rockridge.demand.json target/r52/demand.base.json
cp target/validation/rockridge.demand.json target/r52/demand.base.cv.json
cp data/demand/rockridge.stations.json target/r52/stations.base.json
cp data/demand/rockridge.fit.md target/r52/fit.base.md
```

## C. Baseline screen (three seeds, no verdict)

```
npm run assess -- --seeds 1-3 --periods am_peak,pm_peak --suffix r52-base-screen --diagnostic --jobs $JOBS 2>&1 | tee target/r52/screen-base.log
```

Write down from the "Status rules, per period" section the four station counts (PM fitted, PM held out, AM fitted, AM held out) and whether any car was cleared from gridlock in the judged zone. From the "Stability rule (D16)" line of each period write down "backlog under 2% in k of 3 seeds (mean, max)". The baseline should show 3 of 3 in both periods; if it does not, report that before going on.

## D. The loop with ceilings outside the study area, simulated membership and route weights

```
git checkout data/demand; git status --short
python3 openspec/changes/calibration-round-52/apply-candidate.py route-weight
git diff --stat data/demand/rockridge.config.json                        # two blocks added, about 17 lines (round 51: 16, plus the routeWeightPerBlock line); gatePriorTotals.scope is outsideStudyArea, simulatedMembership has throughTargets, shares and routeWeightPerBlock true
npx tsx tools/membership-loop.ts --dry-run 2>&1 | tee openspec/changes/calibration-round-52/evidence/dry-run.txt
```

Expected from the dry run (the station choice does not depend on the ceilings or the sub-switches; the numbers are those of rounds 48 to 51): shipped PM 337 selected (245 link, 92 movement or route), AM 272 (200, 72), six gate stations static; training PM 256 (187, 69) with 87 withheld, AM 201 (148, 53) with 77 withheld, none static. The frozen split withholds 91 stations from the training view. If the numbers differ, the stations file or the split on the laptop is not the committed one: stop and report.

From here on the config is fixed. Its hash is in every membership evidence block.

```
GATE_PRIOR_DUMP=target/r52/node-prior.json npx tsx tools/membership-loop.ts --jobs $JOBS --report openspec/changes/calibration-round-52/evidence/membership-loop.md 2>&1 | tee target/r52/loop.log
```

It runs, in order, for passes 0, 1 and 2: both demand builds (shipped, then training), seeds 1 to 10 for PM and AM on each view (one `calibrate` process per seed, `--select-od` to its own file), then the pool. The last step builds both views from the final pool. Everything it writes is under `target/membership-loop/` and `target/membership/`.

`GATE_PRIOR_DUMP` makes each build write every ceiling station (node, direction, static-fit total, ceiling, final total) to `target/r52/node-prior.<view>.<period>.json`, overwritten by each build; copy the last ones after the loop for the per-gate table of the reported list (each row has a `gate` flag). Commit them as compact CSV, each file under 190 KB (the hook blocks files over 200 KB):

```
mkdir -p openspec/changes/calibration-round-52/evidence/node-prior-csv
for f in target/r52/node-prior.*.json; do node -e "const r=JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'));const f=x=>Math.round(x*100)/100;console.log('node,direction,gate,anchor,ceiling,beforeProjection,final,removed');for(const x of r)console.log([x.node,x.direction,x.gate?1:0,f(x.anchor),f(x.ceiling),f(x.beforeProjection),f(x.final),f(x.removed)].join(','))" "$f" > openspec/changes/calibration-round-52/evidence/node-prior-csv/$(basename "$f" .json).csv; done
find openspec/changes/calibration-round-52/evidence -size +190k      # must print nothing
```

What to expect in `target/r52/loop.log`:

- Pass 0 builds say "No simulated membership file for the ... view". Pass 0 has the entry but no membership file, so no second fit runs and no ceiling applies: its periods must equal the baseline's. Check with `node -e` comparing `JSON.stringify(periods)` of `target/membership-loop/iter0/shipped/demand.json` and `target/r52/demand.base.json`, and of the training copy and `target/r52/demand.base.cv.json`. If they differ, report both files' offered car totals and stop. In the container the shipped build with the entry and no file gave periods identical to the baseline's (RAN).
- Pass 0 builds print `gate prior ceilings ... none` (the log text keeps the round 49 name; the ceilings cover the gates and the non-gate nodes outside the study area, not the non-gate nodes inside it). From pass 1 every build prints, per period (midday has none: it has no membership runs), a line `pass K <view> build: gate prior ceilings ...` with the number of ceiling stations (fewer than round 51's about 2,000 per peak period, because the non-gate nodes inside the study area have none; 216 or 217 are gates; report the count), how many are above their ceiling and the excess in veh/h, and then four more lines: offered car demand as a percentage of the static fit's, the ceiling stations split into gate and non-gate (stations, above, excess, removed by the projection), the offered car demand by flow type (static then final), and the non-gate trip ends inside and outside the study area as origins and destinations (static then final). The fit report's section "Gate prior ceilings (ASSUMPTION)" has the same figures. The loop report table has the column "Offered / static fit". Copy all of them into the report. Non-gate trip ends outside the study area and at gates are capped and should not rise. Inside the study area they may now rise: that is the point of the scope. Report them static against final for every build, and the new line `Inside-study-area nodes that grew <period>: origins N of M, destinations N of M.` of the fit report (copy it into the report). If a group outside the study area rises, say so first.
- **Block pairs and the shares (new in round 52).** From pass 1 the membership file carries, per period, through hits at the top level and the share pool under `blocks`. After each pool the loop prints per view and period `share blocks without a simulated trip (static routes): ...` and `through blocks without a counted through trip (static routes): ...`. Expect the four select-link blocks (Hillegass Ave NB and SB, Colby St NB and SB) to have simulated trips in both periods and the through list to be the blocks whose trips all have an end in the study area, if any. A block named in the share list keeps static routes in the next build: report it. The shipped config has no through-car target (commit c503d84 removed `fitThrough` and the corridor through counts), so the through hits are written and not used; nothing in the log should name a through target.
- Every build from pass 1 prints, per share, a line `pass K <view> <period>: share <label> (simulated|static): target T%, fit F% on simulated membership, S% on static routes, offered O% (static routes P%), N flows`. There are eight shares per period (four select-link, four ramp via-street) in the shipped config; the ramp ones read `static` and stay at their static value. Copy all of them into the report. They are the check on the lead's hypothesis: if the fit's own share is at its target on the static routes but far from it on simulated membership in pass 1, the mismatch is real and the simulated membership should now close it. The fit report has the same lines (`Share <period> <label>: ...`) and a note per period `select-link shares take simulated membership (N runs; K of M share constraints; ...)`. Expect N = 10 x passes pooled and K = the number of select-link shares (four to eight per period).
- If the loop stops with `no "select-link shares take simulated membership" note`, the build fell back to static shares: do not continue by hand; send back the build log and the fit report.
- In the fit reports, the per-period note reads "N runs; K of M fitted stations". Expect N = 10 x passes pooled and K = 337 of 343 (shipped PM), 272 of 278 (shipped AM), 256 of 260 (training PM) and 201 of 205 (training AM), minus any zero-hit stations (round 48 saw the same).
- Every later build must print the `Simulated membership from ... (shipped view)` note. If the loop stops with "the fit report lacks the ... note: the build fell back to static membership", do not continue by hand. Send back the build log and the line of the fit report that names the evidence.
- After each pool it prints, per view and period, the car veh/h that pass's demand offers (round 48 saw the PM rise from 27,612 to 29,107 in the shipped view; with the inside nodes free a rise is possible, bounded by the 3% abort below; a large fall, or a large rise in the local flow type, is the first thing to report), the stations with pairs, the zero-hit and unexported stations, and the flow and membership change in units of the seed standard error. Copy these lines into the report.
- Abort rule (design D4, kept from round 49, ASSUMPTION): after each build from pass 1 on, if the offered car demand of any view and period is more than 3% above that view and period's static fit, the driver stops with a non-zero exit and a message naming the view, period and numbers, before it runs that pass's seeds. Round 48 failed at +4.4% to +9.0%. On an abort, stop and report: send back `target/r52/loop.log` (its per-pass lines), the build log of that pass (`target/membership-loop/logs/`) and the fit report `data/demand/rockridge.fit*.md`, and do nothing else: no `--resume`, no config change, no other run.
- The ceilings are hard on the final flows: a hard projection lowers any ceiling node direction still above its ceiling. The fit report says, per period, how much volume it removed (sum, split into gates and non-gate nodes, and the worst five nodes) and the fitted stations within their tolerance before and after. Copy these lines into the report; a large cut or a drop in stations within tolerance is the cost of the ceilings. Also copy the report's "Route shares" table and the `Share ...` lines of the last build of each view (the table's Final column is on the membership the fit used).
- Low-demand figure (round 51 lead decision of 2026-11-19; a reported figure in this round, not a stop): after each final build the driver prints `WARNING <view> view, <period>, final build: offered car demand is X% below the static fit's ...` if the total offered car demand of that view and period is more than 10% below its static fit. It does not stop the driver, and neither does it stop you: carry on to the screen and report the figure for every build with the result. The 3% abort above stays.
- **Route weights (new in round 52).** Every fit report from pass 1 has a section "Route weights (round 52, ASSUMPTION)" with one line per whole-street route station and period (`Route weight <period> count route 2606>2592: simulated; base 1; blocks 7; weight 7; ...`) and a note per period. The loop prints each as `pass K shipped <period>: route weight <id> (simulated|static): base B, N blocks, weight W` and writes them to its report. Expect, in the shipped view from pass 1, the four routes `simulated` in both peak periods with Colby Street 7 to 8 blocks (weight 7 to 8) and Hillegass Avenue 4 (weight 4); the training view has no route stations (the split withholds them). The loop stops with `no "Route weight" line` if a shipped report lacks them (the build did not apply the sub-switch): do not continue by hand. A `WARNING ... no whole-street route station took simulated membership` line means the pool had no simulated trip for the route; report it. Pass 0 and midday keep weight 1 (static membership). Every build's fit reports are kept under `target/membership-loop/fits/<step id>/` (new in round 52), so the fit's after-fit and final value of every route and block station can be read per pass.
- It stops early, after pass 1 or 2, only if both ratios are at most 1 in every view and period. Round 48 did not stop early (ratios 1.74 to 2.87 after pass 2).
- `--resume` continues after an interruption. The loop stops if the config, the stations file or the split file changes while it runs.

When it ends, `public/data/rockridge.demand.json` and `target/validation/rockridge.demand.json` are the final demands and `data/demand/rockridge.fit*.md` the final reports. Record:

```
sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json target/membership/*.json | cut -c1-16,65- | tee openspec/changes/calibration-round-52/evidence/candidate-hashes.txt
cmp target/r52/network.base.json public/data/rockridge.network.json && echo network identical
cmp target/r52/stations.base.json data/demand/rockridge.stations.json && echo stations file identical
mkdir -p openspec/changes/calibration-round-52/evidence/fit && cp data/demand/rockridge.fit*.md data/demand/rockridge.stations.json openspec/changes/calibration-round-52/evidence/fit/
cp target/membership-loop/state.json openspec/changes/calibration-round-52/evidence/
# copies the confirmation (step G) needs
mkdir -p target/r52/fit-cand && cp data/demand/rockridge.fit*.md target/r52/fit-cand/
cp public/data/rockridge.demand.json target/r52/demand.cand.json
cp target/validation/rockridge.demand.json target/r52/demand.cand.cv.json
shasum -a 256 data/demand/rockridge.config.json | cut -c1-16 > target/r52/cand-config.sha
sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json target/membership/rockridge.membership.json target/membership/rockridge.membership-training.json | cut -c1-16 > target/r52/cand-hashes.txt
# the fit's own value of every route and Colby Street / Hillegass Avenue block station, per build (shipped view; the training view has no route stations)
for q in pm_peak am_peak; do node openspec/changes/calibration-round-52/scripts/route-lines.cjs $q fit=pass0=target/membership-loop/fits/i0-shipped-build/rockridge.fit.stations-$q.md fit=pass1=target/membership-loop/fits/i1-shipped-build/rockridge.fit.stations-$q.md fit=pass2=target/membership-loop/fits/i2-shipped-build/rockridge.fit.stations-$q.md fit=final=target/membership-loop/fits/final-shipped-build/rockridge.fit.stations-$q.md | tee openspec/changes/calibration-round-52/evidence/route-fit-$q.md; done
```

The last command lists, per station, `target / after the count-only fit / final` for pass 0 (the baseline), pass 1, pass 2 and the final build (design D5). Drop a column whose step did not run (a stop after pass 1 has no `i2`). Round 51's own figures for PM Colby Street SB whole street were target 39, after fit 67, final 67.

## E. Screen the final demand

```
npm run assess -- --seeds 1-3 --periods am_peak,pm_peak --suffix r52-screen --diagnostic --jobs $JOBS 2>&1 | tee target/r52/screen-r52.log
```

Apply the screen rule (design D4): each of the four counts no more than 3 stations below the step C baseline, no car cleared from gridlock in the judged zone, and the backlog line "backlog under 2% in 3 of 3 seeds" in both AM and PM. The backlog figure is each seed's end-of-run entry backlog in percent of spawned trips (`health.backlogPct`). The screen's assessment file, `data/calibration/rockridge.assessment-r52-screen.md`, carries it in the "Stability rule (D16)" line of each period as "backlog under 2% in k of 3 seeds (mean x%, max y%)", and `assess --diagnostic` prints that line too (read from the code, UNTESTED). The three-seed output carries only k, the mean and the max, not each seed. If a seed is at 2% or more, k is below 3. If the line is missing from the file, compute it from the per-seed runs: the `health.backlogPct` of each seed's run file under `target/assess-variants/r52-screen/` (the calibrate JSON of each seed); the screen fails if any value is 2 or more.

If it does not advance, the candidate stops here; the evidence is the result. Advance to step F only if each of the four counts is no more than 3 stations lower than the baseline screen of step C, no car is cleared from gridlock in the judged zone, and the backlog line holds.

## F. Validation and ten seeds

```
./target/release/validate | tail -4                      # must stay 67 of 74 at d45a275dd7be0713cec6a64394b7d8a9
git checkout data/calibration/validation.json            # only its revision field changes; do not commit it
npm run assess -- --suffix r52 --noise --jobs $JOBS 2>&1 | tee target/r52/assess-r52.log
```

Never add `--publish`. Outputs: `data/calibration/rockridge.assessment-r52.md`, summaries in `target/assess-variants/r52/`.

### Keep rule (design D4), baseline values

| Criterion | Line to meet | Baseline | Round 48 candidate | Round 49 candidate | Round 50 candidate | Round 51 candidate | Candidate | Pass |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PM fitted recent stations, GEH < 5 | at least 74 of 92 | 74 | 78 | 81 | 80 | 82 | | |
| PM held out | at least 14 of 24 | 14 | 13 | 13 | 13 | 14 | | |
| AM fitted | at least 70 of 77 | 70 | 72 | 74 | 72 | 74 | | |
| AM held out | at least 14 of 19 | 14 | 15 | 14 | 15 | 15 | | |
| D5 headline shares within 10 points | 4 of 4 | 4 (mean error 4.6) | 2 (12.5) | 2 (10.6) | 2 (7.8) | 4 (4.1) | | |
| Whole-street traversals, GEH < 5 | 8 of 8 | 8 | 8 | 7 | 8 | 8 | | |
| D16 stability in every period | holds | holds | fails AM and PM | holds | holds | holds | | |
| Validation suite | 67 of 74 | 67 | 67 | 67 | 67 | 67 | | |

One figure below its line fails the candidate. Read the held-out rows, the D5 row and the D16 rows first. Do not loosen the rule after seeing a result.

D5 shares are both fit targets (weight 3, as in the baseline) and keep-rule criteria. Passing D5 would show that the fit can now reach its own share targets in the simulator; the held-out station counts remain the independent check. Write that into the verdict, whichever way D5 comes out.

The whole-street line is a fitted quantity: the four route counts are fit targets in the shipped view (weight `routeWeight`, 1.0) and always were, so passing it shows the fit meets its own targets in the simulator (design D6). The training view never sees the route stations, so the held-out counts are fitted without them. Say both in the verdict.

### Reported, not conditions (design D5)

Write these into the report for the baseline and each candidate, in the shipped and the cross-validation view:

- the five diagonal stations, PM: Forest St EB (counted 66), McAuley St EB Howell to Canning (12), 60th St EB Howell to Canning (23), Ayala Ave NB Martin to Howell (60), Howell St SB 59th to McAuley (17), and their sum (178)
- Colby St NB (sim over count of the seven block stations)
- gate totals, and the SR-24 mainline gate flow and backlog
- mean through cars per hour in the study area, PM and AM
- car veh/h offered by each pass's demand, PM and AM, shipped and training (the loop's report table), and the ceiling figures of each build
- per pass and build, for each of the select-link shares and ramp via-street shares, the fit's own share on simulated membership and on the static routes against the target, and for each through target (none in the shipped config) the fit's figure against its target: the loop prints them (`pass K <view> <period>: share ...`) and its report lists them under "Share and through targets, by build"; copy both
- every SR-24 ramp, simulated flow against its counted hour or its ADT x K target: Claremont on (598 counted), Clifton off (617), 52nd St on (996) and off (1,024), MLK on (1,547) and off (1,614), the MLK Grove St ramp (node 280), Telegraph on (657 target), Aileen off (621)
- Shattuck Ave, Telegraph Ave and College Ave travel times, NB and SB, against the observed ranges (the 12 travel times)
- per-gate origin and destination totals of the offered demand, baseline and candidate, for the 20 gates that grew most in round 48 (nodes 1398, 1756, 276, 577, 1719, 1219, 974, 952, 675, 602, 288, 8, 1726, 1674, 973, 1672, 183, 184, 943, 275); with the files of step B and the candidate's, per period:

```
node -e "const G=[1398,1756,276,577,1719,1219,974,952,675,602,288,8,1726,1674,973,1672,183,184,943,275];for(const f of process.argv.slice(1)){const d=JSON.parse(require('fs').readFileSync(f,'utf8'));for(const p of d.periods.filter(x=>['pm_peak','am_peak'].includes(x.id))){const o={},t={};for(const q of p.flows.filter(q=>!q.mode)){o[q.origin]=(o[q.origin]||0)+q.vehPerHour;t[q.destination]=(t[q.destination]||0)+q.vehPerHour}console.log(f,p.id,G.map(g=>g+' '+Math.round(o[g]||0)+'/'+Math.round(t[g]||0)).join(', '))}}" target/r52/demand.base.json public/data/rockridge.demand.json
```

Each entry reads node, origin total / destination total in veh/h. Run it for the shipped and the cross-validation files.
- the breakdown of where offered demand changed, baseline against candidate, shipped and training view (read-only, from `target/r52/network.base.json`, the baseline demand files of step B and the candidate's):

```
node openspec/changes/archive/2026-11-19-calibration-round-50/scripts/nodes.cjs target/r52/network.base.json target/r52/demand.base.json public/data/rockridge.demand.json shipped | tee openspec/changes/calibration-round-52/evidence/nodes-shipped.md
node openspec/changes/archive/2026-11-19-calibration-round-50/scripts/nodes.cjs target/r52/network.base.json target/r52/demand.base.cv.json target/validation/rockridge.demand.json training | tee openspec/changes/calibration-round-52/evidence/nodes-training.md
```

- the southbound to-freeway numerators and denominators and the whole-street figures, PM: Hillegass Ave SB and Colby St SB, cars per hour to the freeway and not to it, and the Colby St SB whole-street figure (observed 39; baseline 56.5, round 49 candidate 81.5, round 50 candidate 70), ten-seed means from the per-seed reports of the baseline set (`60r47-base`, `60r47-base-cv`) and the candidate's (`60r52`, `60r52-cv`):

```
node openspec/changes/archive/2026-11-19-calibration-round-50/scripts/shares.cjs pm_peak baseline=target/assess-seeds/60r47-base candidate=target/assess-seeds/60r52 'baseline cv=target/assess-seeds/60r47-base-cv' 'candidate cv=target/assess-seeds/60r52-cv' | tee openspec/changes/calibration-round-52/evidence/shares-pm.md
```

  The round 49 values for the same figures are in the archived round 49 `evidence/laptop/shares50-pm.md` (Colby St SB to the freeway 106.1 to 83.1, not to it 151.5 to 187.2), and round 50's ten-seed shares were Hillegass Ave SB 68 observed against 51.3 and Colby St SB 45 against 34.7 (archived round 50 `evidence/shares-pm.md`). The numbers to look at first are these two southbound to-freeway shares and the Claremont Ave on-ramp (598 counted; 693 in round 50 against 773 in the baseline): shares fitted on simulated membership may pull to-freeway traffic up and the on-ramp away from its count. If the assessment directories are named differently on the laptop, change the four `label=dir` arguments and say so.
- trips waiting at the end of the run, by gate, seed mean, baseline against candidate (round 48: PM all 78 to 830, node 602 46 to 270, node 183 14 to 229, node 1756 about 0 to 142, node 1398 about 0 to 55; AM all 27 to 464). Each per-seed calibrate report has a table "Entry backlog by origin node at end of run (top 10)". If one of the gates above is not in a seed's top 10, rerun that seed with `target/release/calibrate --area rockridge --period pm_peak --minutes 60 --scale 1 --seed N` and read the table, and say which gates were read that way.

## G. Fresh-seed confirmation (automatic after a pass)

Design D4, written by the lead before any run: a candidate that passes the keep rule on seeds 1 to 10 is then run on seeds 11 to 20 together with the baseline, and must be no worse than the baseline on every keep-rule line computed on those seeds. If step F passed every line, run it now without waiting for the lead. If step F failed a line, skip this step.

```
zsh openspec/changes/calibration-round-52/scripts/confirm.zsh
```

The script (UNTESTED here, modeled on round 51's `run.zsh`) copies the ten-seed assessment into the evidence folder, checks the baseline inputs (config 505dd0f032fc7ae8, the three baseline hashes, the fingerprint) and the candidate inputs against the files step D saved (`target/r52/cand-config.sha`, `cand-hashes.txt`), runs `npm run assess -- --seeds 11-20 --suffix r52-confirm-base` and then `--suffix r52-confirm` (verdict mode, no `--diagnostic`, `--publish` or `--noise`), restores the baseline with `npm run data` and writes `target/r52-confirm/confirm.md` with `scripts/confirm.cjs`: the keep-rule lines for the baseline and the candidate on seeds 1 to 10 and 11 to 20, the watched lines (PM Colby Street SB whole street, Hillegass Avenue SB to the freeway, backlog and gridlock clearances) and the eight whole-street traversals. The baseline of seeds 1 to 10 is round 47's assessment (`archive/2026-11-19-calibration-round-47/evidence/rockridge.assessment-r47-base.md`). If a hash check stops it, send back `target/r52-confirm/chain.log` and do nothing else. Copy `target/r52-confirm/` (`chain.log`, `confirm.md`, `assess-*.log`, the two assessment files) into `evidence/confirm/`. For comparison, round 51's confirmation numbers are in `archive/2026-11-20-calibration-round-51/evidence/confirm/confirm.md` (baseline on seeds 11 to 20: 75, 13, 71, 13, whole-street 8 of 8, Colby Street SB 58; candidate 82, 14, 74, 16, 7 of 8, 78).

Report both results, the ten-seed table and the confirmation table. Adoption stays the project lead's decision.

### The ten-seed simulated values of the route and block stations (design D5)

After the ten-seed assessment of step F (its per-seed reports are in `target/assess-seeds/60r52` and `60r52-cv`; change the `sim=` arguments if the directories are named differently on the laptop):

```
for q in pm_peak am_peak; do node openspec/changes/calibration-round-52/scripts/route-lines.cjs $q sim=baseline=target/assess-seeds/60r47-base sim=candidate=target/assess-seeds/60r52 | tee openspec/changes/calibration-round-52/evidence/route-sim-$q.md; done
```

It prints the four route stations' target and ten-seed whole-street value with standard error and GEH, each Colby Street and Hillegass Avenue block station against its target, and the count of Colby Street SB and Hillegass Avenue SB block stations within GEH 5, for the baseline and the candidate (UNTESTED on real reports). Report with them the non-gate trip ends inside the study area, origins and destinations, static against final, and the count of inside nodes that grew, from the loop's lines.

## H. Commit and send back

Copy what the assessments and screens wrote into the evidence folder and commit on branch `salvatoret/peaceful-fermi-dlwt0u`:

```
cp data/calibration/rockridge.assessment-r52*.md openspec/changes/calibration-round-52/evidence/ 2>/dev/null
cp target/r52/screen-*.log target/r52/loop.log openspec/changes/calibration-round-52/evidence/
mkdir -p openspec/changes/calibration-round-52/evidence/confirm && cp target/r52-confirm/* openspec/changes/calibration-round-52/evidence/confirm/ 2>/dev/null
cp target/r52/assess-r52*.log openspec/changes/calibration-round-52/evidence/ 2>/dev/null
for f in target/membership-loop/logs/*-build.log; do tail -n 40 "$f" > openspec/changes/calibration-round-52/evidence/$(basename "$f"); done
find openspec/changes/calibration-round-52/evidence -size +190k      # must print nothing
git checkout data/demand
git add openspec/changes/calibration-round-52/evidence
git commit -m "chore(data): round 52 evidence"
```

`public/data` is generated and ignored, and `target/` is ignored. Check `git status --short` shows nothing but the evidence before the commit. Push that branch only, never `main`. Keep the baseline screen log and `baseline-hashes.txt` in `evidence/` too.

Send back in the report, even if not committed: the baseline hashes; the candidate's three hashes and the two membership file hashes, and each build's ceiling lines (stations, above, excess, offered car demand static fit against final and as a share of it, by flow type, the gate and non-gate split, the non-gate trip ends inside and outside the study area, worst five nodes); the dry-run counts; the loop's per-pass lines (stations with pairs, zero-hit and unexported stations, the two ratios, the ceiling figures); how many passes ran and whether the stop rule fired; the baseline and candidate screen counts and backlog lines; the filled keep-rule table if it reached step F; the reported lists; and the log of anything that stopped early with the reason.

If the candidate fails, the config stays as committed (`apply-candidate.py` only changed the working tree; `git checkout data/demand` restores it) and the evidence is the result. If it passes, adopting it (the config entries, the membership files to R2, the rebuilt data, a new proposal search and results) is the lead's and the project lead's step and is not part of this runbook.
