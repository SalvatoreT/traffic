# Round 45 runbook: Forest St green candidates on a laptop

Base: `origin/main` at the commit that holds this change (branch `calibration-round-45`). Commit your results on branch `salvatoret/peaceful-fermi-dlwt0u`, started from that commit. Run every command from the repository root. Reference times from round 44 on a 4-core container: a demand build is 10 to 13 minutes per view, a ten-seed set for one period and view about 5 minutes, a full assessment about 25 minutes. With 12 jobs expect roughly a third of that.

Status of each step in the container that wrote this file: **RAN** (run there), **UNTESTED** (written from reading the tools, never run).

Never: push to `main`, `npm run data:push`, `npm run data:split` (the split stays frozen), any request to `https://traffic.transit.directory/api/*`, a secret in a message or a file, an edit to the note or caveat in `data/areas/rockridge.json`, marking a validation deviation reviewed. The only config change is the candidate entry that `apply-candidate.py` inserts.

`calibrate` and `assess` read `public/data` and the network and demand files of the checkout they were built in. Build and run them from this checkout. Use `JOBS=12` (`JOBS=$(sysctl -n hw.ncpu)` on macOS gives the same on an M3 Pro with 12 cores); results do not depend on it.

## A. Setup

```
git fetch origin
git checkout -B salvatoret/peaceful-fermi-dlwt0u origin/calibration-round-45
npm install
JOBS=12
mkdir -p target/r45 openspec/changes/calibration-round-45/evidence
```

Git-ignored inputs (`data/osm/*.json`, `data/demand/raw/`) are needed. Get them as in round 44: `data:pull` with the R2 credentials already on the laptop, or copy `data/osm` and `data/demand/raw` from a checkout that has them. `npm run data:fetch` may give other bytes; do not use it. The OSM extract must be the 2026-11-11 one: the importer must give network 53c823f20d9165ed in step B.

```
cargo build --release -p traffic-sim --bin calibrate --bin validate --bin fingerprint   # RAN for fingerprint (40 s)
cargo run --quiet --release --bin fingerprint        # must print d45a275dd7be0713cec6a64394b7d8a9   RAN
```

## B. Gate: reproduce the baseline

```
npm run data
sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json | cut -c1-16 | tee openspec/changes/calibration-round-45/evidence/baseline-hashes.txt
git status --short
```

Expected hashes, in order: `53c823f20d9165ed`, `9cdebdabf05c4460`, `2f9ae152b9bbf78e`. `git status --short` must show nothing under `data/` (the network step alone was RAN in the container and gave 53c823f20d9165ed; the demand builds are UNTESTED here, RAN in round 44). If a hash differs, stop and report.

Save the baseline demands and the baseline network, and keep a clean config:

```
cp public/data/rockridge.network.json target/r45/network.base.json
cp public/data/rockridge.demand.json target/r45/demand.base.json
cp target/validation/rockridge.demand.json target/r45/demand.base.cv.json
```

## C. Baseline screen (three seeds, no verdict)

This is the reference the candidates' screens are compared with (design D5). It needs the baseline files from step B on disk.

```
npm run assess -- --seeds 1-3 --periods am_peak,pm_peak --suffix r45-base-screen --diagnostic --jobs $JOBS 2>&1 | tee target/r45/screen-base.log      # UNTESTED
```

The output is `data/calibration/rockridge.assessment-r45-base-screen.md` (check the exact name in the last lines of the log). Write down from its "Status rules, per period" section the four station counts (PM fitted, PM held out, AM fitted, AM held out) and whether any car was cleared from gridlock in the judged zone.

## D. Per candidate: build

Do the candidates one after another, `forest-25`, `forest-18`, `forest-12`. Starting each from a clean config:

```
git checkout data/areas/rockridge.json data/demand; git status --short
C=forest-25
python3 openspec/changes/calibration-round-45/apply-candidate.py $C                      # RAN
git diff --stat data/areas/rockridge.json                                                 # two entries added
npm run data 2>&1 | tee target/r45/data-$C.log
sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json | cut -c1-16 | tee openspec/changes/calibration-round-45/evidence/$C-hashes.txt
python3 - <<'E'
import json, subprocess
a = json.load(open('target/r45/network.base.json')); b = json.load(open('public/data/rockridge.network.json'))
print('links identical:', a['links'] == b['links'], '| nodes that differ:', [x['id'] for x, y in zip(a['nodes'], b['nodes']) if x != y])
E
node -e "
const f=(p)=>JSON.parse(require('fs').readFileSync(p));
for (const [x,y] of [['target/r45/demand.base.json','public/data/rockridge.demand.json'],['target/r45/demand.base.cv.json','target/validation/rockridge.demand.json']]) {
  const A=f(x),B=f(y); console.log(y,'periods identical:',JSON.stringify(A.periods)===JSON.stringify(B.periods));
}"
```

Expected: the network step is RAN for forest-25 in the container (hash `176cc2f5263d5faf`, links identical, only node 1069 differs); the other two candidates differ in the same node only. The periods of both demands must be identical to the baseline's (design D6: the fit reads no signal timing). If a demand differs in its flows, stop and report that candidate. The hashes of the demand files differ from the baseline because their provenance records the network hash. Save the generated fit reports with the evidence: `mkdir -p openspec/changes/calibration-round-45/evidence/$C && cp data/demand/rockridge.fit*.md openspec/changes/calibration-round-45/evidence/$C/`.

## E. Per candidate: screen

With the candidate's files still on disk:

```
npm run assess -- --seeds 1-3 --periods am_peak,pm_peak --suffix r45-$C-screen --diagnostic --jobs $JOBS 2>&1 | tee target/r45/screen-$C.log      # UNTESTED
```

Advance the candidate to step F only if, against the baseline screen of step C, each of PM fitted, PM held out, AM fitted and AM held out is no more than 3 stations lower, and no car is cleared from gridlock in the judged zone (design D5). Otherwise stop this candidate, say which figure failed, and go to the next one.

Also look in the three-seed assessment for plan issues at the junction: a line naming Claremont Avenue / Colby Street / Forest Street in a signal-issue or "cannot hold" message means the plan did not build. Report it and stop that candidate.

## F. Per candidate that passed the screen: validation and ten seeds

```
./target/release/validate | tail -4                      # must stay 67 of 74 at d45a275dd7be0713cec6a64394b7d8a9
git checkout data/calibration/validation.json            # only its revision field changes; do not commit it
npm run assess -- --suffix r45-$C --noise --jobs $JOBS 2>&1 | tee target/r45/assess-$C.log      # UNTESTED with a candidate; the same call ran on the baseline
```

Never add `--publish`. Outputs: `data/calibration/rockridge.assessment-r45-<candidate>.md`, summaries in `target/assess-variants/r45-<candidate>/`. Judge by the keep rule below, one line at a time.

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

One figure below its line fails the candidate. Do not loosen the rule after seeing a result.

The tables go in the report as reports and not as conditions. Baseline values are in `data/calibration/rockridge.assessment.md` at ff5d667: the four D5 shares; the eight whole-street traversals; the held-out stations McAuley EB and WB, 60th EB and WB, Ayala NB and SB (Martin to Howell), 62nd Colby to Canning EB and WB; the fitted stations Forest St EB and WB, 60th EB at Telegraph, McAuley EB at Telegraph, Howell SB, Ayala SB (counted, the fit's static final from the fit report, simulated); the list of stations that flip pass or fail; the Forest St eastbound flow and the share of through cars on the Telegraph, McAuley or 60th, Ayala or Howell, Forest, Claremont diagonal if the report gives it.

## G. Commit and send back

Per candidate, copy what the assessment wrote into the evidence folder and commit:

```
cp data/calibration/rockridge.assessment-r45-$C*.md openspec/changes/calibration-round-45/evidence/$C/
cp target/r45/screen-$C.log target/r45/data-$C.log openspec/changes/calibration-round-45/evidence/$C/
cp target/r45/assess-$C.log openspec/changes/calibration-round-45/evidence/$C/ 2>/dev/null
git checkout data/areas/rockridge.json data/demand
git add openspec/changes/calibration-round-45/evidence
git commit -m "chore(data): round 45 evidence for $C"
```

(`public/data` is generated and ignored. Check `git status --short` shows nothing but the evidence before each commit; leave `data/calibration/rockridge.assessment-r45-*.md` out of `data/` and keep them only under `evidence/`.) Commit only on branch `salvatoret/peaceful-fermi-dlwt0u`. Keep the baseline screen log and `baseline-hashes.txt` in `evidence/` too.

Send back in the report, even if not committed: the baseline hashes, each candidate's three hashes, the baseline and candidate screen counts, the filled keep-rule table of each candidate that reached step F, the tables of step F, and the log of any candidate that stopped early with the reason.

If every candidate fails, the config stays as committed (it was never edited on the branch; `apply-candidate.py` only changed the working tree) and the evidence is the result. If one passes, adopting it (the config entry, the rebuilt data, a new proposal search, the area note and caveat) is the lead's and the project lead's step and is not part of this runbook.
