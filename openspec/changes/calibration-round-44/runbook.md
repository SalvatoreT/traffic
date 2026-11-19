# Round 44 runbook: heavy runs on a laptop

Branch `calibration-round-44`, base b1ff0ef plus ff5d667 (baseline assessment). Run every command from the repository root. Times are from a 4-core, 15 GB container: a demand build is 10 to 13 minutes per view, a ten-seed set for one period and view about 5 minutes, a full assessment about 25 minutes.

Status of each step in the container that wrote this file: **RAN** (run there, as written unless noted), **UNTESTED** (written from reading the tools, never run).

Never: push, `npm run data:push`, any request to `https://traffic.transit.directory/api/*`, `npm run data:split` (the split stays frozen), edit the note or caveat in `data/areas/rockridge.json`, mark a validation deviation reviewed, change anything else listed in design D4.

`calibrate` reads `public/data` and the network and demand files from the checkout it was compiled in. Build it in this checkout and run it from here. Keep `JOBS` at the core count (`JOBS=$(nproc)`; macOS: `JOBS=$(sysctl -n hw.ncpu)`); results do not depend on it.

## A. Setup

```
git fetch origin && git checkout calibration-round-44
npm install
JOBS=$(nproc)
```

Git-ignored inputs (`data/osm/*.json`, `data/demand/raw/`) are needed for `npm run data`. Get them with either `TRAFFIC_UPLOAD_URL=<site> TRAFFIC_UPLOAD_TOKEN=<secret> npm run data:pull` (R2 bucket, per `data/README.md`) or by copying `data/osm` and `data/demand/raw` from a checkout that has them. `npm run data:fetch` downloads from the origins and may give different bytes; do not use it for this round. [UNTESTED: `data:pull`; the container copied the directories from the main checkout]

```
cargo build --release -p traffic-sim --bin calibrate --bin validate --bin fingerprint   # RAN (1 min)
cargo run --quiet --release --bin fingerprint                                          # must print d45a275dd7be0713cec6a64394b7d8a9  RAN
npm run wasm                                                                           # not needed for any step below; UNTESTED, skip
```

## B. Sanity gate: reproduce the baseline (RAN)

```
npm run data                       # shipped, then training view
sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json | cut -c1-16
```

Expected, in order: `53c823f20d9165ed`, `9cdebdabf05c4460`, `2f9ae152b9bbf78e`. `git status --short` must show no change under `data/` (the fit reports and `rockridge.audit.md` reproduce byte for byte). If a hash differs, stop and report.

Save the baseline demands: `mkdir -p target/r44 && cp public/data/rockridge.demand.json target/r44/demand.base.json && cp target/validation/rockridge.demand.json target/r44/demand.base.cv.json`

## C. D2 pass 0: measure on the baseline demand, refit

Ten seeds, 60 minutes, scale 1, every period, both views. The shipped runs use the default demand (`public/data/rockridge.demand.json`); the training runs pass the training demand.

```
for P in am_peak midday pm_peak; do
  ./target/release/calibrate --area rockridge --period $P --minutes 60 --scale 1 --seeds 1-10 --jobs $JOBS --keep-seeds target/r44/p0 --out target/r44/p0/summary > /dev/null
  ./target/release/calibrate --area rockridge --period $P --minutes 60 --scale 1 --seeds 1-10 --jobs $JOBS --keep-seeds target/r44/p0cv --out target/r44/p0cv/summary --demand target/validation/rockridge.demand.json > /dev/null
done                                # RAN for midday on the training demand; the others are the same call
npx tsx tools/control-delays.ts --dir target/r44/p0   --demand public/data/rockridge.demand.json      --view shipped  --out data/demand/rockridge.control-delays.json          --pass 0   # RAN
npx tsx tools/control-delays.ts --dir target/r44/p0cv --demand target/validation/rockridge.demand.json --view training --out data/demand/rockridge.control-delays.training.json --pass 0   # RAN
```

(The container measured pass 0 from the baseline assessment's kept runs, `target/assess-seeds/60` and `60-cv`, plus the midday training runs; those are the same runs as the loop above. Its pass-0 files are not committed: the laptop produces its own. Its summary: PM 961 approaches measured, mean control delay 17.1 s; training PM 886, 16.9 s.) The tool stops if a report names another demand or network or more than one simulator fingerprint.

Switch the build on (the only config change of the round) and refit:

```
python3 - <<'E'
p='data/demand/rockridge.config.json'
s=open(p).read()
a='      "rounds": 2,\n      "measured": {'
assert s.count(a)==1
b='''      "rounds": 2,
      "controlDelays": {
        "file": "data/demand/rockridge.control-delays.json",
        "trainingFile": "data/demand/rockridge.control-delays.training.json",
        "_note": "Round 44 (tools/control-delays.ts): measured control delay per approach link from ten-seed baseline runs replaces the control-type constants of crates/sim/data/node-delays.json where the approach carried at least 20 veh/h (ASSUMPTION). The training view reads its own file, measured on training-view demand. A file for another network, view or simulator is not used."
      },
      "measured": {'''
open(p,'w').write(s.replace(a,b))
E                                   # RAN (applied and reverted in the container)
npm run data                        # UNTESTED with the files present: look in the fit reports for "control delay per approach measured on" and no "does not match this build"
cp public/data/rockridge.demand.json target/r44/demand.p0.json; cp target/validation/rockridge.demand.json target/r44/demand.p0.cv.json
cp data/demand/rockridge.control-delays.json target/r44/delays.p0.json; cp data/demand/rockridge.control-delays.training.json target/r44/delays.p0.training.json
```

The build runs `cargo run --release --bin fingerprint` when a delay file exists; a mismatch of area, view, network or simulator prints `control delays: ... fall back to the constants`. Treat that line as a failure.

## D. D2 pass 1: measure on the pass-0 demand, refit, stop

The default demand is now the pass-0 demand.

```
for P in am_peak midday pm_peak; do
  ./target/release/calibrate --area rockridge --period $P --minutes 60 --scale 1 --seeds 1-10 --jobs $JOBS --keep-seeds target/r44/p1 --out target/r44/p1/summary > /dev/null
  ./target/release/calibrate --area rockridge --period $P --minutes 60 --scale 1 --seeds 1-10 --jobs $JOBS --keep-seeds target/r44/p1cv --out target/r44/p1cv/summary --demand target/validation/rockridge.demand.json > /dev/null
done
npx tsx tools/control-delays.ts --dir target/r44/p1   --demand public/data/rockridge.demand.json      --view shipped  --out data/demand/rockridge.control-delays.json          --pass 1
npx tsx tools/control-delays.ts --dir target/r44/p1cv --demand target/validation/rockridge.demand.json --view training --out data/demand/rockridge.control-delays.training.json --pass 1
npm run data                        # the candidate; no third pass
```

How far things moved between passes (put the figures in design.md and the record):

```
node -e "
const f=(p)=>JSON.parse(require('fs').readFileSync(p));
for (const [a,b,l] of [['target/r44/delays.p0.json','data/demand/rockridge.control-delays.json','shipped'],['target/r44/delays.p0.training.json','data/demand/rockridge.control-delays.training.json','training']]) {
  const A=f(a),B=f(b);
  for (const p of Object.keys(A.delayS)) { let n=0,s=0; for (const k of Object.keys(A.delayS[p])) if (k in B.delayS[p]) { n++; s+=(A.delayS[p][k]-B.delayS[p][k])**2; }
    console.log(l,p,'common approaches',n,'of',Object.keys(A.delayS[p]).length,Object.keys(B.delayS[p]).length,'RMS change s',Math.sqrt(s/n).toFixed(2)); } }
const tot=(p)=>Object.fromEntries(f(p).periods.map(q=>[q.id,q.flows.filter(x=>!x.mode).reduce((a,x)=>a+x.vehPerHour,0).toFixed(0)]));
for (const [n,p] of [['base','target/r44/demand.base.json'],['p0','target/r44/demand.p0.json'],['p1','public/data/rockridge.demand.json']]) console.log(n,'car veh/h offered',JSON.stringify(tot(p)));
"                                   # UNTESTED
```

Through trips per period are also in the fit reports (`data/demand/rockridge.fit.md`, table row `through`).

Record the SHA-256 of: `public/data/rockridge.network.json` (must stay 53c823f20d9165ed), `public/data/rockridge.demand.json`, `target/validation/rockridge.demand.json`, both delay files of each pass, `data/demand/rockridge.config.json`.

## E. Validation (must be 67 of 74, fingerprint unchanged)

```
./target/release/validate | tail -4        # RAN on the baseline: 67 of 74
```

It rewrites `data/calibration/validation.json` (only the `revision` field changes); do not commit that file again.

## F. Candidate assessment

Use a suffix so the committed baseline assessment is not overwritten. The calibrate binary and the files on disk must be the candidate's (steps C and D done, `npm run data` just run, config unchanged since).

```
npm run assess -- --suffix r44 --noise --jobs $JOBS 2>&1 | tee target/r44/assess.log      # UNTESTED with --suffix; the same command with --publish ran on the baseline (25 minutes)
```

Outputs: `data/calibration/rockridge.assessment-r44.md`, summaries in `target/assess-variants/r44/reports/`, kept seeds in `target/assess-seeds/60r44` and `60r44-cv`, noise file in `target/assess-variants/r44/rockridge.noise.json`. The status table is the section "Status rules, per period" (about line 1020 of the baseline file). Judge by the keep rule D3 in design.md against these figures: PM fitted 74/92, PM held out 14/24, AM fitted 70/77, AM held out 14/19, D5 4 of 4, whole-street 8 of 8 within GEH 5, D16 holds in every period; one figure below its line fails.

Also extract for the table (baseline values are in `data/calibration/rockridge.assessment.md` at ff5d667): the four D5 shares, the eight whole-street traversals, the Howell-area held-out stations (McAuley EB/WB, 60th EB/WB, Ayala NB/SB Martin to Howell, 62nd Colby to Canning EB/WB), the fitted stations Forest EB/WB, 60th EB at Telegraph, McAuley EB at Telegraph, Howell SB, Ayala SB (counted, fit's static final from the fit report station table, simulated), and the list of stations that flip pass/fail.

## G. Send back / commit on the branch

Commit (never push, never to main): `data/demand/rockridge.control-delays.json` and `.training.json` (pass 1) plus the pass-0 copies renamed `rockridge.control-delays.pass0*.json`; `data/demand/rockridge.config.json`; the regenerated `data/demand/*.fit*.md` and `rockridge.audit.md`; `data/calibration/rockridge.assessment-r44.md`; the tool output of step D; the three hashes and the keep-rule verdict in design.md and the record.

Send back in the report even if not committed: all SHA-256 values of step D, `target/r44/assess.log`, the extracted tables of step F, the gate output of step B.

If the rule fails: revert `data/demand/rockridge.config.json` to the committed content, restore `data/demand/*.md` with `git checkout`, keep the delay files only as evidence, and do not touch `data/areas/rockridge.json`, `public/data/areas.json` or the published assessment. If it passes: the note, caveat, `areas.json`, the record entry and archiving are the lead's step, not part of this runbook.
