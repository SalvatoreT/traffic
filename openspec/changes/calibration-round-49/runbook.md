# Round 49 runbook: simulated membership with ceilings on uncounted gate totals, on a laptop

Base: `origin/calibration-round-49` (branches from `origin/main` at 6726bae). Commit your results on branch `salvatoret/peaceful-fermi-dlwt0u` by merging `origin/calibration-round-49` into it. Run every command from the repository root. Reference times from round 44 on a 4-core container: a demand build is 10 to 13 minutes per view, a ten-seed set for one period and view about 5 minutes, a full assessment about 25 minutes. With 12 jobs expect roughly a third of the run times; builds do not speed up.

Status of each step in the container that wrote this file: **RAN** (run there), **UNTESTED** (written from reading the tools, never run). No simulation ran in that container.

Never: push to `main`, `npm run data:push`, `npm run data:split` (the split stays frozen), any request to `https://traffic.transit.directory/api/*`, a secret in a message or a file, an edit to the note or caveat in `data/areas/rockridge.json`, marking a validation deviation reviewed, loosening the keep rule or the screen after a result, `--publish` on an assessment, editing a membership file or the demand config after a loop has started. Reusing a run set of round 48 is not allowed: the config hash differs. The only config changes are the entries `apply-candidate.py` inserts into `data/demand/rockridge.config.json` (`countFit.gatePriorTotals` and `countFit.throughTargets.simulatedMembership`).

`calibrate` and `assess` read `public/data` and the network and demand files of the checkout they were built in, and the loop reads `data/demand/rockridge.stations.json` and the config of the checkout. Build and run them from this checkout. Use `JOBS=12` (results do not depend on it).

## Time

About 6 hours for the required path: gate 25 minutes (two builds), baseline screen 5, the loop about 170, screen 5, validation and ten-seed assessment 15. Pass 0 builds are as long as the baseline's (12 minutes per view). From pass 1 each build runs the fit twice per period that takes simulated membership (a static fit for the anchor, then the fit with membership and ceilings), so expect roughly 25 minutes per build instead of 12: six such builds plus the final two, about 200 minutes of builds in all, and twelve ten-seed sets of 1.7 minutes. A stop after pass 1 saves about 40 minutes. These are estimates from the reference times above and from the container's doubled fit; no part of the loop has run.

## A. Setup

```
git fetch origin
git checkout salvatoret/peaceful-fermi-dlwt0u
git merge --no-ff origin/calibration-round-49      # no reset, no force push
npm install
JOBS=12
mkdir -p target/r49 openspec/changes/calibration-round-49/evidence
```

Git-ignored inputs (`data/osm/*.json`, `data/demand/raw/`) are needed. Get them as in round 44: `data:pull` with the R2 credentials already on the laptop, or copy `data/osm` and `data/demand/raw` from a checkout that has them. `npm run data:fetch` may give other bytes; do not use it. The OSM extract must be the 2026-11-11 one: the importer must give network 53c823f20d9165ed in step B.

```
cargo build --release -p traffic-sim --bin calibrate --bin validate --bin fingerprint
cargo run --quiet --release --bin fingerprint        # must print d45a275dd7be0713cec6a64394b7d8a9
npx vitest run tools/gate-prior.test.ts tools/membership-loop.test.ts       # RAN in the container, passes
```

## B. Gate: reproduce the baseline

With no `gatePriorTotals` entry the build must not change. This is the check that the code added for the ceilings is inert.

```
npm run data
sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json | cut -c1-16 | tee openspec/changes/calibration-round-49/evidence/baseline-hashes.txt
git status --short
```

Expected hashes, in order: `53c823f20d9165ed`, `9cdebdabf05c4460`, `2f9ae152b9bbf78e`. `git status --short` must show nothing under `data/`. In the container, both demand builds with this code and no entry (run with `--out-root`, so the files are outside `public/data`) gave 9cdebdabf05c4460 and 2f9ae152b9bbf78e (RAN) and a stations file byte-identical to the committed one (RAN); the committed network file hashes to 53c823f20d9165ed (RAN). The `npm run data` importer step is UNTESTED there. If a hash differs, stop and report.

Save the baseline files:

```
cp public/data/rockridge.network.json target/r49/network.base.json
cp public/data/rockridge.demand.json target/r49/demand.base.json
cp target/validation/rockridge.demand.json target/r49/demand.base.cv.json
cp data/demand/rockridge.stations.json target/r49/stations.base.json
cp data/demand/rockridge.fit.md target/r49/fit.base.md
```

## C. Baseline screen (three seeds, no verdict)

```
npm run assess -- --seeds 1-3 --periods am_peak,pm_peak --suffix r49-base-screen --diagnostic --jobs $JOBS 2>&1 | tee target/r49/screen-base.log
```

Write down from the "Status rules, per period" section the four station counts (PM fitted, PM held out, AM fitted, AM held out) and whether any car was cleared from gridlock in the judged zone. From the "Stability rule (D16)" line of each period write down "backlog under 2% in k of 3 seeds (mean, max)". The baseline should show 3 of 3 in both periods; if it does not, report that before going on.

## D. The loop with ceilings

```
git checkout data/demand; git status --short
python3 openspec/changes/calibration-round-49/apply-candidate.py gate-ceiling-membership
git diff --stat data/demand/rockridge.config.json                        # two blocks added
npx tsx tools/membership-loop.ts --dry-run 2>&1 | tee openspec/changes/calibration-round-49/evidence/dry-run.txt
```

Expected from the dry run (the station choice does not depend on the ceilings; the numbers are round 48's): shipped PM 337 selected (245 link, 92 movement or route), AM 272 (200, 72), six gate stations static; training PM 256 (187, 69) with 87 withheld, AM 201 (148, 53) with 77 withheld, none static. The frozen split withholds 91 stations from the training view. If the numbers differ, the stations file or the split on the laptop is not the committed one: stop and report.

From here on the config is fixed. Its hash is in every membership evidence block.

```
GATE_PRIOR_DUMP=target/r49/gate-prior.json npx tsx tools/membership-loop.ts --jobs $JOBS --report openspec/changes/calibration-round-49/evidence/membership-loop.md 2>&1 | tee target/r49/loop.log
```

It runs, in order, for passes 0, 1 and 2: both demand builds (shipped, then training), seeds 1 to 10 for PM and AM on each view (one `calibrate` process per seed, `--select-od` to its own file), then the pool. The last step builds both views from the final pool. Everything it writes is under `target/membership-loop/` and `target/membership/`.

`GATE_PRIOR_DUMP` makes each build write every ceiling station (node, direction, static-fit total, ceiling, final total) to `target/r49/gate-prior.<view>.<period>.json`, overwritten by each build; copy the last ones after the loop for the per-gate table of the reported list.

What to expect in `target/r49/loop.log`:

- Pass 0 builds say "No simulated membership file for the ... view". Pass 0 has the entry but no membership file, so no second fit runs and no ceiling applies: its periods must equal the baseline's. Check with `node -e` comparing `JSON.stringify(periods)` of `target/membership-loop/iter0/shipped/demand.json` and `target/r49/demand.base.json`, and of the training copy and `target/r49/demand.base.cv.json`. If they differ, report both files' offered car totals and stop. In the container the shipped build with the entry and no file gave periods identical to the baseline's (RAN).
- Pass 0 builds print `gate prior ceilings ... none`. From pass 1 every build prints a line `pass K <view> build: gate prior ceilings ...` with the number of ceiling stations, how many are above their ceiling and the excess in veh/h, per period (midday has none: it has no membership runs). The fit report's section "Gate prior ceilings (ASSUMPTION)" also gives the offered car demand of the static fit and of the final fit, in all and by flow type (through, local, ramp), so growth that moves to local origins shows. The per-pass lines and the loop report table carry the same figures. Copy them into the report.
- In the fit reports, the per-period note reads "N runs; K of M fitted stations". Expect N = 10 x passes pooled and K = 337 of 343 (shipped PM), 272 of 278 (shipped AM), 256 of 260 (training PM) and 201 of 205 (training AM), minus any zero-hit stations (round 48 saw the same).
- Every later build must print the `Simulated membership from ... (shipped view)` note. If the loop stops with "the fit report lacks the ... note: the build fell back to static membership", do not continue by hand. Send back the build log and the line of the fit report that names the evidence.
- After each pool it prints, per view and period, the car veh/h that pass's demand offers (round 48 saw the PM rise from 27,612 to 29,107 in the shipped view; with the ceilings the rise at uncounted gates is bounded by the static fit's totals, so a large rise, or one in the local flow type, is the first thing to report), the stations with pairs, the zero-hit and unexported stations, and the flow and membership change in units of the seed standard error. Copy these lines into the report.
- Abort rule (design D11', ASSUMPTION): after each build from pass 1 on, if the offered car demand of any view and period is more than 3% above that view and period's static fit, the driver stops with a non-zero exit and a message naming the view, period and numbers, before it runs that pass's seeds. Round 48 failed at +4.4% to +9.0%. On an abort, stop and report: send back `target/r49/loop.log` (its per-pass lines), the build log of that pass (`target/membership-loop/logs/`) and the fit report `data/demand/rockridge.fit*.md`, and do nothing else: no `--resume`, no config change, no other run.
- The ceilings are hard on the final flows: a hard projection lowers any ceiling gate direction still above its ceiling. The fit report says, per period, how much volume it removed (sum and worst five gates) and the fitted stations within their tolerance before and after. Copy these lines into the report; a large removal or a drop in stations within tolerance is the cost of the ceilings.
- It stops early, after pass 1 or 2, only if both ratios are at most 1 in every view and period. Round 48 did not stop early (ratios 1.74 to 2.87 after pass 2).
- `--resume` continues after an interruption. The loop stops if the config, the stations file or the split file changes while it runs.

When it ends, `public/data/rockridge.demand.json` and `target/validation/rockridge.demand.json` are the final demands and `data/demand/rockridge.fit*.md` the final reports. Record:

```
sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json target/membership/*.json | cut -c1-16,65- | tee openspec/changes/calibration-round-49/evidence/candidate-hashes.txt
cmp target/r49/network.base.json public/data/rockridge.network.json && echo network identical
cmp target/r49/stations.base.json data/demand/rockridge.stations.json && echo stations file identical
mkdir -p openspec/changes/calibration-round-49/evidence/fit && cp data/demand/rockridge.fit*.md data/demand/rockridge.stations.json openspec/changes/calibration-round-49/evidence/fit/
cp target/membership-loop/state.json openspec/changes/calibration-round-49/evidence/
```

## E. Screen the final demand

```
npm run assess -- --seeds 1-3 --periods am_peak,pm_peak --suffix r49-screen --diagnostic --jobs $JOBS 2>&1 | tee target/r49/screen-r49.log
```

Apply the screen rule (design D6): each of the four counts no more than 3 stations below the step C baseline, no car cleared from gridlock in the judged zone, and the backlog line "backlog under 2% in 3 of 3 seeds" in both AM and PM. The backlog figure is each seed's end-of-run entry backlog in percent of spawned trips (`health.backlogPct`). The screen's assessment file, `data/calibration/rockridge.assessment-r49-screen.md`, carries it in the "Stability rule (D16)" line of each period as "backlog under 2% in k of 3 seeds (mean x%, max y%)", and `assess --diagnostic` prints that line too (read from the code, UNTESTED). The three-seed output carries only k, the mean and the max, not each seed. If a seed is at 2% or more, k is below 3. If the line is missing from the file, compute it from the per-seed runs: the `health.backlogPct` of each seed's run file under `target/assess-variants/r49-screen/` (the calibrate JSON of each seed); the screen fails if any value is 2 or more.

If it does not advance, the candidate stops here; the evidence is the result. Advance to step F only if each of the four counts is no more than 3 stations lower than the baseline screen of step C, no car is cleared from gridlock in the judged zone, and the backlog line holds.

## F. Validation and ten seeds

```
./target/release/validate | tail -4                      # must stay 67 of 74 at d45a275dd7be0713cec6a64394b7d8a9
git checkout data/calibration/validation.json            # only its revision field changes; do not commit it
npm run assess -- --suffix r49 --noise --jobs $JOBS 2>&1 | tee target/r49/assess-r49.log
```

Never add `--publish`. Outputs: `data/calibration/rockridge.assessment-r49.md`, summaries in `target/assess-variants/r49/`.

### Keep rule (design D6), baseline values

| Criterion | Line to meet | Baseline | Round 48 candidate | Candidate | Pass |
| --- | --- | --- | --- | --- | --- |
| PM fitted recent stations, GEH < 5 | at least 74 of 92 | 74 | 78 | | |
| PM held out | at least 14 of 24 | 14 | 13 | | |
| AM fitted | at least 70 of 77 | 70 | 72 | | |
| AM held out | at least 14 of 19 | 14 | 15 | | |
| D5 headline shares within 10 points | 4 of 4 | 4 (mean error 4.6) | 2 (12.5) | | |
| Whole-street traversals, GEH < 5 | 8 of 8 | 8 | 8 | | |
| D16 stability in every period | holds | holds | fails AM and PM | | |
| Validation suite | 67 of 74 | 67 | 67 | | |

One figure below its line fails the candidate. Read the held-out rows and the D16 rows first. Do not loosen the rule after seeing a result.

### Reported, not conditions (design D7)

Write these into the report for the baseline and each candidate, in the shipped and the cross-validation view:

- the five diagonal stations, PM: Forest St EB (counted 66), McAuley St EB Howell to Canning (12), 60th St EB Howell to Canning (23), Ayala Ave NB Martin to Howell (60), Howell St SB 59th to McAuley (17), and their sum (178)
- Colby St NB (sim over count of the seven block stations)
- gate totals, and the SR-24 mainline gate flow and backlog
- mean through cars per hour in the study area, PM and AM
- car veh/h offered by each pass's demand, PM and AM, shipped and training (the loop's report table), and the ceiling figures of each build
- every SR-24 ramp, simulated flow against its counted hour or its ADT x K target: Claremont on (598 counted), Clifton off (617), 52nd St on (996) and off (1,024), MLK on (1,547) and off (1,614), the MLK Grove St ramp (node 280), Telegraph on (657 target), Aileen off (621)
- Shattuck Ave, Telegraph Ave and College Ave travel times, NB and SB, against the observed ranges (the 12 travel times)
- per-gate origin and destination totals of the offered demand, baseline and candidate, for the 20 gates that grew most in round 48 (nodes 1398, 1756, 276, 577, 1719, 1219, 974, 952, 675, 602, 288, 8, 1726, 1674, 973, 1672, 183, 184, 943, 275); with the files of step B and the candidate's, per period:

```
node -e "const G=[1398,1756,276,577,1719,1219,974,952,675,602,288,8,1726,1674,973,1672,183,184,943,275];for(const f of process.argv.slice(1)){const d=JSON.parse(require('fs').readFileSync(f,'utf8'));for(const p of d.periods.filter(x=>['pm_peak','am_peak'].includes(x.id))){const o={},t={};for(const q of p.flows.filter(q=>!q.mode)){o[q.origin]=(o[q.origin]||0)+q.vehPerHour;t[q.destination]=(t[q.destination]||0)+q.vehPerHour}console.log(f,p.id,G.map(g=>g+' '+Math.round(o[g]||0)+'/'+Math.round(t[g]||0)).join(', '))}}" target/r49/demand.base.json public/data/rockridge.demand.json
```

Each entry reads node, origin total / destination total in veh/h. Run it for the shipped and the cross-validation files.
- trips waiting at the end of the run, by gate, seed mean, baseline against candidate (round 48: PM all 78 to 830, node 602 46 to 270, node 183 14 to 229, node 1756 about 0 to 142, node 1398 about 0 to 55; AM all 27 to 464). Each per-seed calibrate report has a table "Entry backlog by origin node at end of run (top 10)". If one of the gates above is not in a seed's top 10, rerun that seed with `target/release/calibrate --area rockridge --period pm_peak --minutes 60 --scale 1 --seed N` and read the table, and say which gates were read that way.

## G. Commit and send back

Copy what the assessments and screens wrote into the evidence folder and commit on branch `salvatoret/peaceful-fermi-dlwt0u`:

```
cp data/calibration/rockridge.assessment-r49*.md openspec/changes/calibration-round-49/evidence/ 2>/dev/null
cp target/r49/screen-*.log target/r49/loop.log openspec/changes/calibration-round-49/evidence/
cp target/r49/assess-r49*.log openspec/changes/calibration-round-49/evidence/ 2>/dev/null
for f in target/membership-loop/logs/*-build.log; do tail -n 40 "$f" > openspec/changes/calibration-round-49/evidence/$(basename "$f"); done
find openspec/changes/calibration-round-49/evidence -size +190k      # must print nothing
git checkout data/demand
git add openspec/changes/calibration-round-49/evidence
git commit -m "chore(data): round 49 evidence"
```

`public/data` is generated and ignored, and `target/` is ignored. Check `git status --short` shows nothing but the evidence before the commit. Push that branch only, never `main`. Keep the baseline screen log and `baseline-hashes.txt` in `evidence/` too.

Send back in the report, even if not committed: the baseline hashes; the candidate's three hashes and the two membership file hashes, and each build's ceiling lines (stations, above, excess, offered car demand static fit against final, by flow type, worst five gates); the dry-run counts; the loop's per-pass lines (stations with pairs, zero-hit and unexported stations, the two ratios, the ceiling figures); how many passes ran and whether the stop rule fired; the baseline and candidate screen counts and backlog lines; the filled keep-rule table if it reached step F; the reported lists; and the log of anything that stopped early with the reason.

If the candidate fails, the config stays as committed (`apply-candidate.py` only changed the working tree; `git checkout data/demand` restores it) and the evidence is the result. If it passes, adopting it (the config entries, the membership files to R2, the rebuilt data, a new proposal search and results) is the lead's and the project lead's step and is not part of this runbook.
