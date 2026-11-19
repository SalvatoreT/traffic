# Round 48 runbook: demand fitted on the simulator's own route choice, on a laptop

Base: `origin/main` at the commit that holds this change (branch `calibration-round-48`, which branches from `calibration-round-47`; rounds 46 and 47 merge with their knobs off). Commit your results on branch `salvatoret/peaceful-fermi-dlwt0u` by merging `origin/calibration-round-48` into it. Run every command from the repository root. Reference times from round 44 on a 4-core container: a demand build is 10 to 13 minutes per view, a ten-seed set for one period and view about 5 minutes, a full assessment about 25 minutes. With 12 jobs expect roughly a third of the run times; builds do not speed up.

Status of each step in the container that wrote this file: **RAN** (run there), **UNTESTED** (written from reading the tools, never run).

Never: push to `main`, `npm run data:push`, `npm run data:split` (the split stays frozen), any request to `https://traffic.transit.directory/api/*`, a secret in a message or a file, an edit to the note or caveat in `data/areas/rockridge.json`, marking a validation deviation reviewed, loosening the keep rule after a result, `--publish` on an assessment, editing a membership file or the demand config after the loop has started. The only config change is the `countFit.throughTargets.simulatedMembership` entry that `apply-candidate.py` inserts into `data/demand/rockridge.config.json`.

`calibrate` and `assess` read `public/data` and the network and demand files of the checkout they were built in, and the loop reads `data/demand/rockridge.stations.json` and the config of the checkout. Build and run them from this checkout. Use `JOBS=12` (results do not depend on it).

## Time

About 3 hours for the required path: gate 25 minutes (two builds), baseline screen 5, loop 115 (eight builds of 12 minutes and twelve ten-seed sets of 1.7), final screen 5, validation and ten-seed assessment 15. A stop after pass 1 saves about 15 minutes. The optional prior-20 loop adds about 2 hours. These are estimates from the reference times above; no part of the loop has run.

## A. Setup

```
git fetch origin
git checkout salvatoret/peaceful-fermi-dlwt0u
git merge --no-ff origin/calibration-round-48      # no reset, no force push
npm install
JOBS=12
mkdir -p target/r48 openspec/changes/calibration-round-48/evidence
```

Git-ignored inputs (`data/osm/*.json`, `data/demand/raw/`) are needed. Get them as in round 44: `data:pull` with the R2 credentials already on the laptop, or copy `data/osm` and `data/demand/raw` from a checkout that has them. `npm run data:fetch` may give other bytes; do not use it. The OSM extract must be the 2026-11-11 one: the importer must give network 53c823f20d9165ed in step B.

```
cargo build --release -p traffic-sim --bin calibrate --bin validate --bin fingerprint   # UNTESTED here
cargo run --quiet --release --bin fingerprint        # must print d45a275dd7be0713cec6a64394b7d8a9   RAN here as part of the demand builds
npx vitest run tools/membership-loop.test.ts         # RAN, passes
```

## B. Gate: reproduce the baseline

With no `simulatedMembership` entry in the config the build must not change. This is the check that the code added for the loop is inert.

```
npm run data
sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json | cut -c1-16 | tee openspec/changes/calibration-round-48/evidence/baseline-hashes.txt
git status --short
```

Expected hashes, in order: `53c823f20d9165ed`, `9cdebdabf05c4460`, `2f9ae152b9bbf78e`. `git status --short` must show nothing under `data/`. In the container, both demand builds with this code and no entry (run with `--out-root`, so the files are outside `public/data`) gave 9cdebdabf05c4460 and 2f9ae152b9bbf78e (RAN); the committed network file hashes to 53c823f20d9165ed (RAN), and the `npm run data` importer step is UNTESTED here. If a hash differs, stop and report.

Save the baseline files:

```
cp public/data/rockridge.network.json target/r48/network.base.json
cp public/data/rockridge.demand.json target/r48/demand.base.json
cp target/validation/rockridge.demand.json target/r48/demand.base.cv.json
cp data/demand/rockridge.stations.json target/r48/stations.base.json
```

## C. Baseline screen (three seeds, no verdict)

```
npm run assess -- --seeds 1-3 --periods am_peak,pm_peak --suffix r48-base-screen --diagnostic --jobs $JOBS 2>&1 | tee target/r48/screen-base.log      # UNTESTED
```

Write down from the "Status rules, per period" section the four station counts (PM fitted, PM held out, AM fitted, AM held out) and whether any car was cleared from gridlock in the judged zone.

## D. Apply the candidate and read the dry run

```
git checkout data/demand; git status --short
python3 openspec/changes/calibration-round-48/apply-candidate.py simulated-membership      # RAN on a copy of the config
git diff --stat data/demand/rockridge.config.json                                          # one block added
npx tsx tools/membership-loop.ts --dry-run 2>&1 | tee openspec/changes/calibration-round-48/evidence/dry-run.txt      # RAN
```

Expected from the dry run (RAN in the container): shipped PM 337 selected (245 link, 92 movement or route), AM 272 (200, 72), six gate stations static; training PM 256 (187, 69) with 87 withheld, AM 201 (148, 53) with 77 withheld, none static. The frozen split withholds 91 stations from the training view. If the numbers differ, the stations file or the split on the laptop is not the committed one: stop and report.

From here on the config is fixed. Its hash is in every membership evidence block.

## E. The loop

```
npx tsx tools/membership-loop.ts --jobs $JOBS --report openspec/changes/calibration-round-48/evidence/membership-loop.md 2>&1 | tee target/r48/loop.log      # UNTESTED against the real binary
```

It runs, in order, for passes 0, 1 and 2: both demand builds (shipped, then training), seeds 1 to 10 for PM and AM on each view (one `calibrate` process per seed, `--select-od` to its own file), then the pool. The last step builds both views from the final pool. Everything it writes is under `target/membership-loop/` and `target/membership/`; the demand builds write `public/data/rockridge.demand.json`, `target/validation/rockridge.demand.json`, `data/demand/rockridge.fit*.md` and `rockridge.stations.json` as `npm run data` does.

What to expect in `target/r48/loop.log`:

- Pass 0 builds say "No simulated membership file for the ... view". Pass 0 periods should equal the baseline's (hashes differ because the config hash is in the provenance). Check with `node -e` comparing `JSON.stringify(periods)` of `target/membership-loop/iter0/shipped/demand.json` and `target/r48/demand.base.json`, and of the training copy and `target/r48/demand.base.cv.json`. This is the check that the loop starts from the baseline. UNTESTED here for the real files; in the container the shipped build with the entry and no file was compared with the baseline (see design).
- In the fit reports, the per-period note reads "N runs; K of M fitted stations". Expect N = 10 x passes pooled and K = 337 of 343 (shipped PM), 272 of 278 (shipped AM), 256 of 260 (training PM) and 201 of 205 (training AM), minus any zero-hit stations; the four static training stations are the ramp stand-ins at nodes 725, 833, 679 and 683. These counts were seen with made-up membership files (RAN).
- Every later build must print the `Simulated membership from ... (shipped view)` note. If the loop stops with "the fit report lacks the ... note: the build fell back to static membership", do not continue by hand. Send back the build log and the line of the fit report that names the evidence.
- After each pool it prints, per view and period, the car veh/h that pass's demand offers (the baseline shipped demand offers 27,612 in the PM, 23,204 in the AM and 16,221 at midday, from the container builds; a build with made-up membership doubled the PM figure, so a large move is the first thing to report; the loop does not stop on it), how many selected stations have pairs, the stations with zero simulated hits, the stations the binary did not export, and the flow and membership change in units of the seed standard error. Copy these lines into the report.
- It stops early, after pass 1 or 2, only if both ratios are at most 1 in every view and period (design D11).
- `--resume` continues after an interruption (it keeps `target/membership-loop/state.json`). The loop stops if the config, the stations file or the split file changes while it runs.

When it ends, `public/data/rockridge.demand.json` and `target/validation/rockridge.demand.json` are the final demands and `data/demand/rockridge.fit*.md` the final reports. Record:

```
sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json target/membership/*.json | cut -c1-16,65- | tee openspec/changes/calibration-round-48/evidence/candidate-hashes.txt
cmp target/r48/network.base.json public/data/rockridge.network.json && echo network identical
mkdir -p openspec/changes/calibration-round-48/evidence/fit && cp data/demand/rockridge.fit*.md data/demand/rockridge.stations.json openspec/changes/calibration-round-48/evidence/fit/
cp target/membership-loop/state.json openspec/changes/calibration-round-48/evidence/
```

The network must stay `53c823f20d9165ed`. The membership files are not committed (megabytes); their hashes are in the list above.

## F. Screen the final demand

```
npm run assess -- --seeds 1-3 --periods am_peak,pm_peak --suffix r48-screen --diagnostic --jobs $JOBS 2>&1 | tee target/r48/screen-r48.log      # UNTESTED with a candidate
```

Advance to step G only if, against the baseline screen of step C, each of PM fitted, PM held out, AM fitted and AM held out is no more than 3 stations lower, and no car is cleared from gridlock in the judged zone (design D7). If it does not advance, the candidate stops here; the evidence is the result.

## G. Validation and ten seeds

```
./target/release/validate | tail -4                      # must stay 67 of 74 at d45a275dd7be0713cec6a64394b7d8a9
git checkout data/calibration/validation.json            # only its revision field changes; do not commit it
npm run assess -- --suffix r48 --noise --jobs $JOBS 2>&1 | tee target/r48/assess-r48.log      # UNTESTED with a candidate; the same call ran on the baseline
```

Never add `--publish`. Outputs: `data/calibration/rockridge.assessment-r48.md`, summaries in `target/assess-variants/r48/`.

### Keep rule (design D7), baseline values

| Criterion | Line to meet | Baseline | Candidate | Pass |
| --- | --- | --- | --- | --- |
| PM fitted recent stations, GEH < 5 | at least 74 of 92 | 74 | | |
| PM held out | at least 14 of 24 | 14 | | |
| AM fitted | at least 70 of 77 | 70 | | |
| AM held out | at least 14 of 19 | 14 | | |
| D5 headline shares within 10 points | 4 of 4 | 4 (mean error 4.6) | | |
| Whole-street traversals, GEH < 5 | 8 of 8 | 8 | | |
| D16 stability in every period | holds | holds | | |
| Validation suite | 67 of 74 | 67 | | |

One figure below its line fails the candidate. Round 42 raised fitted stations and lowered held-out stations, so read the held-out rows first. Do not loosen the rule after seeing a result.

### Reported, not conditions

Write these into the report for the baseline and the candidate, in the shipped and the cross-validation view:

- the five diagonal stations, PM: Forest St EB (counted 66), McAuley St EB Howell to Canning (12), 60th St EB Howell to Canning (23), Ayala Ave NB Martin to Howell (60), Howell St SB 59th to McAuley (17), and their sum (178)
- Colby St NB (sim over count of the six block stations; baseline about 0.71 in the router diagnosis, one seed)
- gate totals, and the SR-24 mainline gate flow and backlog
- mean through cars per hour in the study area, PM and AM
- car veh/h offered by each pass's demand, PM and AM, shipped and training (the loop's report table)
- every SR-24 ramp, simulated flow against its counted hour or its ADT x K target: Claremont on (598 counted), Clifton off (617), 52nd St on (996) and off (1,024), MLK on (1,547) and off (1,614), the MLK Grove St ramp (node 280), Telegraph on (657 target), Aileen off (621)
- Shattuck Ave, Telegraph Ave and College Ave travel times, NB and SB, against the observed ranges

## H. Optional: the prior worth 20 trips

Only after step G, and only if time allows. Start from a clean config and a separate loop directory, since the config hash is in the evidence:

```
git checkout data/demand
python3 openspec/changes/calibration-round-48/apply-candidate.py simulated-membership-prior20
npx tsx tools/membership-loop.ts --jobs $JOBS --dir target/membership-loop-p20 --report openspec/changes/calibration-round-48/evidence/membership-loop-p20.md 2>&1 | tee target/r48/loop-p20.log
```

Then the screen of step F with `--suffix r48-p20-screen`, and step G only if it passes the screen. Its files are `target/membership-p20/`.

## I. Commit and send back

Copy what the assessment wrote into the evidence folder and commit on branch `salvatoret/peaceful-fermi-dlwt0u`:

```
cp data/calibration/rockridge.assessment-r48*.md openspec/changes/calibration-round-48/evidence/ 2>/dev/null
cp target/r48/screen-*.log target/r48/loop.log openspec/changes/calibration-round-48/evidence/
cp target/r48/assess-r48.log openspec/changes/calibration-round-48/evidence/ 2>/dev/null
for f in target/membership-loop/logs/*-build.log; do tail -n 40 "$f" > openspec/changes/calibration-round-48/evidence/$(basename "$f"); done
find openspec/changes/calibration-round-48/evidence -size +190k      # must print nothing
git checkout data/demand
git add openspec/changes/calibration-round-48/evidence
git commit -m "chore(data): round 48 evidence"
```

`public/data` is generated and ignored, and `target/` is ignored. Check `git status --short` shows nothing but the evidence before the commit. Push that branch only, never `main`. Keep the baseline screen log and `baseline-hashes.txt` in `evidence/` too.

Send back in the report, even if not committed: the baseline hashes, the candidate's three hashes and the two membership file hashes, the dry-run counts, the loop's per-pass lines (stations with pairs, zero-hit and unexported stations, the two ratios), how many passes ran and whether the stop rule fired, the baseline and candidate screen counts, the filled keep-rule table (if it reached step G), the reported lists, and the log of anything that stopped early with the reason.

If the candidate fails, the config stays as committed (`apply-candidate.py` only changed the working tree; `git checkout data/demand` restores it) and the evidence is the result. If it passes, adopting it (the config entry, the membership files to R2, the rebuilt data, a new proposal search and results) is the lead's and the project lead's step and is not part of this runbook.
