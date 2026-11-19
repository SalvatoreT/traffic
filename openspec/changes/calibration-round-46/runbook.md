# Round 46 runbook: count-derived ramp peak-hour factor on a laptop

Base: `origin/main` at the commit that holds this change (branch `calibration-round-46`). Commit your results on branch `salvatoret/peaceful-fermi-dlwt0u` by merging `origin/calibration-round-46` into it. Run every command from the repository root. Reference times from round 44 on a 4-core container: a demand build is 10 to 13 minutes per view, a ten-seed set for one period and view about 5 minutes, a full assessment about 25 minutes. With 12 jobs expect roughly a third of that.

Status of each step in the container that wrote this file: **RAN** (run there), **UNTESTED** (written from reading the tools, never run).

Never: push to `main`, `npm run data:push`, `npm run data:split` (the split stays frozen), any request to `https://traffic.transit.directory/api/*`, a secret in a message or a file, an edit to the note or caveat in `data/areas/rockridge.json`, marking a validation deviation reviewed, loosening the keep rule after a result, `--publish` on an assessment. The only config change is the `countFit.rampK` entry that `apply-candidate.py` inserts into `data/demand/rockridge.config.json`.

`calibrate` and `assess` read `public/data` and the network and demand files of the checkout they were built in. Build and run them from this checkout. Use `JOBS=12` (results do not depend on it).

## A. Setup

```
git fetch origin
git checkout salvatoret/peaceful-fermi-dlwt0u
git merge --no-ff origin/calibration-round-46      # no reset, no force push
npm install
JOBS=12
mkdir -p target/r46 openspec/changes/calibration-round-46/evidence
```

Git-ignored inputs (`data/osm/*.json`, `data/demand/raw/`) are needed. Get them as in round 44: `data:pull` with the R2 credentials already on the laptop, or copy `data/osm` and `data/demand/raw` from a checkout that has them. `npm run data:fetch` may give other bytes; do not use it. The OSM extract must be the 2026-11-11 one: the importer must give network 53c823f20d9165ed in step B.

```
cargo build --release -p traffic-sim --bin calibrate --bin validate --bin fingerprint   # UNTESTED here (round 45: RAN)
cargo run --quiet --release --bin fingerprint        # must print d45a275dd7be0713cec6a64394b7d8a9   UNTESTED here
npx vitest run tools/ramp-k.test.ts                  # RAN, 9 tests pass
```

## B. Gate: reproduce the baseline

With no `rampK` entry in the config the build must not change. This is the check that the code added for the candidates is inert.

```
npm run data
sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json | cut -c1-16 | tee openspec/changes/calibration-round-46/evidence/baseline-hashes.txt
git status --short
```

Expected hashes, in order: `53c823f20d9165ed`, `9cdebdabf05c4460`, `2f9ae152b9bbf78e`. `git status --short` must show nothing under `data/`. In the container, both demand builds with this code and no `rampK` entry (run with `--out-root`, so the files are outside `public/data`) gave 9cdebdabf05c4460 and 2f9ae152b9bbf78e (RAN). The network hash was not rebuilt there; the committed network file hashes to 53c823f20d9165ed (RAN), and the `npm run data` importer step is UNTESTED here. If a hash differs, stop and report.

Save the baseline files and the baseline stations file:

```
cp public/data/rockridge.network.json target/r46/network.base.json
cp public/data/rockridge.demand.json target/r46/demand.base.json
cp target/validation/rockridge.demand.json target/r46/demand.base.cv.json
cp data/demand/rockridge.stations.json target/r46/stations.base.json
```

## C. Baseline screen (three seeds, no verdict)

```
npm run assess -- --seeds 1-3 --periods am_peak,pm_peak --suffix r46-base-screen --diagnostic --jobs $JOBS 2>&1 | tee target/r46/screen-base.log      # UNTESTED
```

Write down from the "Status rules, per period" section the four station counts (PM fitted, PM held out, AM fitted, AM held out) and whether any car was cleared from gridlock in the judged zone.

## D. Per candidate: build

Candidates, one after another: `ramp-k-counted` (at least 3 counted ramps per view) and `ramp-k-counted-min2` (at least 2). They differ only in the training view, which sees two counted ramps. Start each from a clean config:

```
git checkout data/demand; git status --short
C=ramp-k-counted
python3 openspec/changes/calibration-round-46/apply-candidate.py $C                      # RAN on a copy of the config
git diff --stat data/demand/rockridge.config.json                                         # one block added
npm run data 2>&1 | tee target/r46/data-$C.log                                            # RAN in the container for both views, outputs redirected with --out-root
grep "ramp K" target/r46/data-$C.log
sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json | cut -c1-16 | tee openspec/changes/calibration-round-46/evidence/$C-hashes.txt
node openspec/changes/calibration-round-46/targets-changed.mjs target/r46/stations.base.json data/demand/rockridge.stations.json | tee openspec/changes/calibration-round-46/evidence/$C-targets-changed.txt
cmp target/r46/network.base.json public/data/rockridge.network.json && echo network identical
```

Expected, from the container builds: the shipped view prints `ramp K ... 0.0734 from 5 counted ramps`; the training view prints `0.09 (fallback): 2 usable counted ramps, fewer than the 3 required` for `ramp-k-counted` and `0.0809 from 2 counted ramps` for `ramp-k-counted-min2`. The network hash must stay `53c823f20d9165ed`. The demand hashes differ from the baseline; the container gave shipped 8a28540b43bc3a75 and training 650b9f0e12d6f563 for `ramp-k-counted`, shipped 583834696da85cfd and training 514c17c9f88af777 for `ramp-k-counted-min2`, and `targets-changed.mjs` reported 15 changed targets and no added, removed or re-held station. A different hash on the laptop with the same K lines is not a failure by itself; compare the periods. If the network differs or the K lines differ from these, stop and report. Save the fit reports: `mkdir -p openspec/changes/calibration-round-46/evidence/$C && cp data/demand/rockridge.fit*.md data/demand/rockridge.stations.json openspec/changes/calibration-round-46/evidence/$C/`.

`ramp-k-counted` leaves the training demand at the assumed K, so its cross-validation demand differs from the baseline's only if the other inputs changed; compare `target/validation/rockridge.demand.json` periods with `target/r46/demand.base.cv.json` and report whether they are equal. If they are equal, the held-out scores of that candidate repeat the baseline's and only the shipped view can move.

## E. Per candidate: screen

```
npm run assess -- --seeds 1-3 --periods am_peak,pm_peak --suffix r46-$C-screen --diagnostic --jobs $JOBS 2>&1 | tee target/r46/screen-$C.log      # UNTESTED
```

Advance the candidate to step F only if, against the baseline screen of step C, each of PM fitted, PM held out, AM fitted and AM held out is no more than 3 stations lower, and no car is cleared from gridlock in the judged zone (design D6).

## F. Per candidate that passed the screen: validation and ten seeds

```
./target/release/validate | tail -4                      # must stay 67 of 74 at d45a275dd7be0713cec6a64394b7d8a9
git checkout data/calibration/validation.json            # only its revision field changes; do not commit it
npm run assess -- --suffix r46-$C --noise --jobs $JOBS 2>&1 | tee target/r46/assess-$C.log      # UNTESTED with a candidate; the same call ran on the baseline
```

Never add `--publish`. Outputs: `data/calibration/rockridge.assessment-r46-<candidate>.md`, summaries in `target/assess-variants/r46-<candidate>/`.

### Keep rule (design D4), baseline values

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

Fill the first four rows twice: with every station, and without the stations whose target the candidate changed (the list in `evidence/$C-targets-changed.txt`; find them by label in the per-station tables of the assessment). A candidate passes only if both fills pass. One figure below its line fails the candidate. Do not loosen the rule after seeing a result.

### Reported, not conditions

Write these into the report for the baseline and the candidate, in the shipped and the cross-validation view:

- the five diagonal stations, PM: Forest St EB (counted 66), McAuley St EB Howell to Canning (12), 60th St EB Howell to Canning (23), Ayala Ave NB Martin to Howell (60), Howell St SB 59th to McAuley (17), and their sum (178)
- every SR-24 ramp, simulated flow against its counted hour or its ADT x K target (candidate target in `evidence/$C-targets-changed.txt`): Claremont on (598 counted), Clifton off (617), 52nd St on (996) and off (1,024), MLK on (1,547) and off (1,614), the MLK Grove St ramp (node 280), Telegraph on (657 baseline target), Aileen off (621)
- mean through cars per hour in the study area, PM and AM
- Shattuck Ave, Telegraph Ave and College Ave travel times, NB and SB, against the observed ranges
- the through-car share on the Telegraph, McAuley or 60th, Ayala or Howell, Forest, Claremont diagonal, if the report gives it

## G. Commit and send back

Per candidate, copy what the assessment wrote into the evidence folder and commit on branch `salvatoret/peaceful-fermi-dlwt0u`:

```
cp data/calibration/rockridge.assessment-r46-$C*.md openspec/changes/calibration-round-46/evidence/$C/
cp target/r46/screen-$C.log target/r46/data-$C.log openspec/changes/calibration-round-46/evidence/$C/
cp target/r46/assess-$C.log openspec/changes/calibration-round-46/evidence/$C/ 2>/dev/null
git checkout data/demand
git add openspec/changes/calibration-round-46/evidence
git commit -m "chore(data): round 46 evidence for $C"
```

`public/data` is generated and ignored. Check `git status --short` shows nothing but the evidence before each commit, and keep the assessment files only under `evidence/`. Push that branch only, never `main`. Keep the baseline screen log and `baseline-hashes.txt` in `evidence/` too.

Send back in the report, even if not committed: the baseline hashes, each candidate's three hashes, the baseline and candidate screen counts, the filled keep-rule table of each candidate that reached step F (both fills), the reported tables, and the log of any candidate that stopped early with the reason.

If every candidate fails, the config stays as committed (`apply-candidate.py` only changed the working tree) and the evidence is the result. If one passes, adopting it (the config entry, the rebuilt data, a new proposal search and results) is the lead's and the project lead's step and is not part of this runbook.
