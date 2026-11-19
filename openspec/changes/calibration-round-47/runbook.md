# Round 47 runbook: Caldecott Lane pair-sum station on a laptop

Base: branch `calibration-round-47`, which builds on `calibration-round-46` (5c12490). Round 46 merges to main with its `rampK` rule off, so this runbook assumes that rule is absent from `data/demand/rockridge.config.json`. Commit your results on the laptop session's working branch by merging `origin/calibration-round-47` into it. Run every command from the repository root. Reference times from round 44 on a 4-core container: a demand build is 10 to 13 minutes per view, a ten-seed set for one period and view about 5 minutes, a full assessment about 25 minutes. With 12 jobs expect roughly a third of that.

Status of each step in the container that wrote this file: **RAN** (run there), **UNTESTED** (written from reading the tools, never run).

Never: push to `main`, `npm run data:push`, `npm run data:split` or any re-freeze of the split (it stays frozen, and `data/demand/rockridge.split.json` must not change), any request to `https://traffic.transit.directory/api/*`, a secret in a message or a file, an edit to the note or caveat in `data/areas/rockridge.json`, marking a validation deviation reviewed, loosening the keep rule after a result, `--publish` on an assessment. The only config change is the `countFit.linkGroups` entry that `apply-candidate.py` inserts into `data/demand/rockridge.config.json`.

`calibrate` and `assess` read `public/data` and the network and demand files of the checkout they were built in. Build and run them from this checkout. Use `JOBS=12` (results do not depend on it).

## A. Setup

```
git fetch origin
git checkout <the laptop session's working branch>
git merge --no-ff origin/calibration-round-47      # no reset, no force push
npm install
JOBS=12
mkdir -p target/r47 openspec/changes/calibration-round-47/evidence
```

Git-ignored inputs (`data/osm/*.json`, `data/demand/raw/`) are needed. Get them as in round 44: `data:pull` with the R2 credentials already on the laptop, or copy `data/osm` and `data/demand/raw` from a checkout that has them. `npm run data:fetch` may give other bytes; do not use it. The OSM extract must be the 2026-11-11 one: the importer must give network 53c823f20d9165ed in step B.

```
cargo build --release -p traffic-sim --bin calibrate --bin validate --bin fingerprint   # UNTESTED here
cargo run --quiet --release --bin fingerprint        # must print d45a275dd7be0713cec6a64394b7d8a9   UNTESTED here
npx vitest run tools/link-groups.test.ts             # RAN, 13 tests pass
```

## B. Gate: reproduce the baseline

With no `linkGroups` entry in the config the build must not change. This is the check that the code added for the candidate is inert.

```
npm run data
sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json | cut -c1-16 | tee openspec/changes/calibration-round-47/evidence/baseline-hashes.txt
git status --short
```

Expected hashes, in order: `53c823f20d9165ed`, `9cdebdabf05c4460`, `2f9ae152b9bbf78e`. `git status --short` must show nothing under `data/`. In the container, both demand builds with this code and no `linkGroups` entry (run with `--out-root`, so the files are outside `public/data`) gave 9cdebdabf05c4460 and 2f9ae152b9bbf78e (RAN; the shipped build was run twice with the same hash). The network hash was not rebuilt there; the committed network file hashes to 53c823f20d9165ed (RAN), and the `npm run data` importer step is UNTESTED here. If a hash differs, stop and report.

Save the baseline files and the baseline stations file, then check the denominators the assessment will use:

```
cp public/data/rockridge.network.json target/r47/network.base.json
cp public/data/rockridge.demand.json target/r47/demand.base.json
cp target/validation/rockridge.demand.json target/r47/demand.base.cv.json
cp data/demand/rockridge.stations.json target/r47/stations.base.json
node openspec/changes/calibration-round-47/denominators.mjs target/r47/stations.base.json      # RAN: PM 92 fitted, 24 held out; AM 77 fitted, 19 held out
```

## C. Baseline: three seeds, then ten seeds

The three-seed set is the screen's baseline (no verdict). The ten-seed set is needed because the published assessment lists only the 12 largest misses: the keep rule (design D4) needs to know whether each of the two merged stations passes in the baseline.

```
npm run assess -- --seeds 1-3 --periods am_peak,pm_peak --suffix r47-base-screen --diagnostic --jobs $JOBS 2>&1 | tee target/r47/screen-base.log      # UNTESTED
npm run assess -- --suffix r47-base --noise --jobs $JOBS 2>&1 | tee target/r47/assess-base.log      # UNTESTED with this suffix; the same call ran on the baseline before
```

The ten-seed baseline set must reproduce the published figures: PM fitted 74 of 92, PM held out 14 of 24, AM fitted 70 of 77, AM held out 14 of 19. If it does not, stop and report. Then read the stations off the kept seeds (no simulation):

```
npx tsx openspec/changes/calibration-round-47/station-table.ts --suffix r47-base --stations target/r47/stations.base.json > openspec/changes/calibration-round-47/evidence/stations-base-ten.md      # UNTESTED
npx tsx openspec/changes/calibration-round-47/station-table.ts --suffix r47-base-screen --seeds 1-3 --stations target/r47/stations.base.json > openspec/changes/calibration-round-47/evidence/stations-base-screen.md      # UNTESTED
grep -n "Caldecott" openspec/changes/calibration-round-47/evidence/stations-base-ten.md
```

Write down, before any candidate result exists:

- `b`: how many of `ramp on 1695` and `ramp on 1711` have GEH below 5 in the PM ten-seed baseline (0, 1 or 2). In the AM both are derived and not judged.
- the four three-seed counts of the baseline set on the common stations: the "recent fitted" and "recent held out" figures of each period from the head line of `stations-base-screen.md`, minus the pass among the two merged stations (the third Caldecott station, `ramp off 1695`, stays in).
- whether any car was cleared from gridlock in the judged zone (the "Status rules, per period" section of the screen log).

## D. Candidate: build

Start from a clean config:

```
git checkout data/demand; git status --short
C=caldecott-pair-sum
python3 openspec/changes/calibration-round-47/apply-candidate.py $C                      # RAN on a copy of the config
git diff --stat data/demand/rockridge.config.json                                         # one block added
npm run data 2>&1 | tee target/r47/data-$C.log                                            # RAN in the container for both views, outputs redirected with --out-root
grep "link group" target/r47/data-$C.log
sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json | cut -c1-16 | tee openspec/changes/calibration-round-47/evidence/$C-hashes.txt
node openspec/changes/calibration-round-47/targets-changed.mjs target/r47/stations.base.json data/demand/rockridge.stations.json | tee openspec/changes/calibration-round-47/evidence/$C-targets-changed.txt
node openspec/changes/calibration-round-47/denominators.mjs data/demand/rockridge.stations.json | tee openspec/changes/calibration-round-47/evidence/$C-denominators.txt
cmp target/r47/network.base.json public/data/rockridge.network.json && echo network identical
git diff --quiet data/demand/rockridge.split.json && echo split unchanged
```

Expected, from the container builds: the build log prints one `link group ramp on 1695 + ramp on 1711` line in each view; the network hash stays `53c823f20d9165ed`; `targets-changed.mjs` reports two stations only in the baseline (`ramp on 1695`, `ramp on 1711`), one only in the candidate (`ramp on 1695 + ramp on 1711`, links 4080 and 4058, PM target 122) and no changed target; `denominators.mjs` gives PM 91 fitted and 24 held out, AM 77 fitted and 19 held out. The demand hashes differ from the baseline: the container gave a97b0d3fdd118cc8 for the shipped view and b9464e7b65bdd542 for the training view. A different demand hash on the laptop with the same log lines is not a failure by itself; compare the periods. If the network differs, the split file changed, or the denominators differ from these, stop and report. Save the fit reports: `mkdir -p openspec/changes/calibration-round-47/evidence/$C && cp data/demand/rockridge.fit*.md data/demand/rockridge.stations.json openspec/changes/calibration-round-47/evidence/$C/`. Keep a copy of the candidate stations file for the table script: `cp data/demand/rockridge.stations.json target/r47/stations.cand.json`.

## E. Candidate: screen

```
npm run assess -- --seeds 1-3 --periods am_peak,pm_peak --suffix r47-$C-screen --diagnostic --jobs $JOBS 2>&1 | tee target/r47/screen-$C.log      # UNTESTED
npx tsx openspec/changes/calibration-round-47/station-table.ts --suffix r47-$C-screen --seeds 1-3 --stations target/r47/stations.cand.json > openspec/changes/calibration-round-47/evidence/stations-$C-screen.md      # UNTESTED
```

Advance to step F only if, on the common stations (the candidate figures minus the merged station, against the baseline figures minus its two members, both written down in step C), each of PM fitted, PM held out, AM fitted and AM held out is no more than 3 stations lower, and no car is cleared from gridlock in the judged zone (design D6).

## F. Candidate that passed the screen: validation and ten seeds

```
./target/release/validate | tail -4                      # must stay 67 of 74 at d45a275dd7be0713cec6a64394b7d8a9
git checkout data/calibration/validation.json            # only its revision field changes; do not commit it
npm run assess -- --suffix r47-$C --noise --jobs $JOBS 2>&1 | tee target/r47/assess-$C.log      # UNTESTED with a candidate; the same call ran on the baseline
npx tsx openspec/changes/calibration-round-47/station-table.ts --suffix r47-$C --stations target/r47/stations.cand.json > openspec/changes/calibration-round-47/evidence/stations-$C-ten.md      # UNTESTED
```

Never add `--publish`. Outputs: `data/calibration/rockridge.assessment-r47-<candidate>.md`, summaries in `target/assess-variants/r47-<candidate>/`.

### Keep rule (design D4), baseline values

`b` is the number from step C. The merged station replaces two stations in the PM fitted count and none in the other three counts (design D4).

| Criterion | Line to meet | Baseline | Candidate | Pass |
| --- | --- | --- | --- | --- |
| PM fitted, common stations, GEH < 5 | at least 74 - b of 90 | 74 - b | | |
| PM fitted, every station, GEH < 5 | at least 74 - max(0, b - 1) of 91 | | | |
| PM held out | at least 14 of 24 | 14 | | |
| AM fitted | at least 70 of 77 | 70 | | |
| AM held out | at least 14 of 19 | 14 | | |
| D5 headline shares within 10 points | 4 of 4 | 4 (mean error 4.6) | | |
| Whole-street traversals, GEH < 5 | 8 of 8 | 8 | | |
| D16 stability in every period | holds | holds | | |
| Validation suite | 67 of 74 | 67 | | |

The candidate passes only if every row passes. One figure below its line fails the candidate. Do not loosen the rule after seeing a result. The merged station's own result is reported, not a condition: its GEH and its modeled flow against 122 veh/h.

### Reported, not conditions

Write these into the report for the baseline and the candidate, in the shipped and the cross-validation view:

- the Caldecott Lane stations: `ramp off 1695` (113 target) and the merged on-ramp station (122; baseline halves 61 and 61), simulated flow, and the simulated flow on links 4080 and 4058 apart (from the seed reports; the merged station scores their sum)
- the five diagonal stations, PM: Forest St EB (counted 66), McAuley St EB Howell to Canning (12), 60th St EB Howell to Canning (23), Ayala Ave NB Martin to Howell (60), Howell St SB 59th to McAuley (17), and their sum (178)
- every SR-24 ramp, simulated flow against its counted hour or its ADT x K target: Claremont on (598 counted), Clifton off (617), 52nd St on (996) and off (1,024), MLK on (1,547) and off (1,614), the MLK Grove St ramp (node 280), Telegraph on (657), Aileen off (621)
- mean through cars per hour in the study area, PM and AM
- Shattuck Ave, Telegraph Ave and College Ave travel times, NB and SB, against the observed ranges
- the through-car share on the Telegraph, McAuley or 60th, Ayala or Howell, Forest, Claremont diagonal, if the report gives it

## G. Commit and send back

Copy what the assessment wrote into the evidence folder and commit on the laptop session's working branch:

```
cp data/calibration/rockridge.assessment-r47-$C*.md openspec/changes/calibration-round-47/evidence/$C/
cp target/r47/screen-$C.log target/r47/data-$C.log openspec/changes/calibration-round-47/evidence/$C/
cp target/r47/assess-$C.log openspec/changes/calibration-round-47/evidence/$C/ 2>/dev/null
cp target/r47/screen-base.log target/r47/assess-base.log openspec/changes/calibration-round-47/evidence/
cp data/calibration/rockridge.assessment-r47-base.md openspec/changes/calibration-round-47/evidence/
git checkout data/demand
git add openspec/changes/calibration-round-47/evidence
git commit -m "chore(data): round 47 evidence for $C"
```

`public/data` is generated and ignored. Check `git status --short` shows nothing but the evidence before each commit, and keep the assessment files only under `evidence/`. Push that branch only, never `main`. Every file in the evidence folder stays under 200 KB; the per-station tables are well under it.

Send back in the report, even if not committed: the baseline hashes, the candidate's three hashes, `b`, the baseline and candidate three-seed counts (common stations), the filled keep-rule table, the reported tables, and the log if the candidate stopped early, with the reason.

If the candidate fails, the config stays as committed (`apply-candidate.py` only changed the working tree) and the evidence is the result. If it passes, adopting it (the config entry, the rebuilt data, a new proposal search and results) is the lead's and the project lead's step and is not part of this runbook.
