#!/bin/zsh
# Round 47, steps A (build, fingerprint, link-group tests), B (baseline gate, denominators) and C (baseline three-seed screen, ten-seed set, station tables).
cd "$(git rev-parse --show-toplevel)" || exit 1
EV=openspec/changes/calibration-round-47/evidence; T=target/r47; JOBS=12; R=openspec/changes/calibration-round-47
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
log() { echo "$(now) $*" | tee -a $T/chain.log; }
mkdir -p $EV
log "A: npm install"
npm install > $T/npm-install.log 2>&1 || { log "A: npm install FAILED"; exit 1; }
log "A: cargo build"
cargo build --release -p traffic-sim --bin calibrate --bin validate --bin fingerprint > $T/build.log 2>&1 || { log "A: build FAILED"; exit 1; }
FP=$(cargo run --quiet --release --bin fingerprint); log "A: fingerprint $FP"
[ "$FP" = d45a275dd7be0713cec6a64394b7d8a9 ] || { log "A: fingerprint mismatch, stop"; exit 1; }
npx vitest run tools/link-groups.test.ts > $T/vitest.log 2>&1; log "A: vitest exit=$? $(grep -E 'Tests ' $T/vitest.log | tr -s ' ')"
log "B: npm run data"
S=$(date +%s); npm run data > $T/data-base.log 2>&1; RC=$?; log "B: npm run data exit=$RC wall_s=$(( $(date +%s) - S ))"
[ $RC = 0 ] || exit 1
sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json | cut -c1-16 | tee $EV/baseline-hashes.txt
H=$(tr '\n' ' ' < $EV/baseline-hashes.txt); log "B: hashes $H"
git status --short > $T/status-B.txt; log "B: git status under data/: $(grep -c ' data/' $T/status-B.txt) line(s)"
[ "$H" = "53c823f20d9165ed 9cdebdabf05c4460 2f9ae152b9bbf78e " ] || { log "B: hash mismatch, stop"; exit 1; }
grep -q ' data/' $T/status-B.txt && { log "B: data/ changed, stop"; exit 1; }
cp public/data/rockridge.network.json $T/network.base.json
cp public/data/rockridge.demand.json $T/demand.base.json
cp target/validation/rockridge.demand.json $T/demand.base.cv.json
cp data/demand/rockridge.stations.json $T/stations.base.json
node $R/denominators.mjs $T/stations.base.json | sed 's#^target/r47/#(baseline) target/r47/#' > $EV/baseline-denominators.txt; log "B: denominators $(tail -2 $EV/baseline-denominators.txt | tr -s ' ' | tr '\n' ';')"
log "C: baseline screen"
S=$(date +%s); npm run assess -- --seeds 1-3 --periods am_peak,pm_peak --suffix r47-base-screen --diagnostic --jobs $JOBS > $T/screen-base.log 2>&1; RC=$?
log "C: screen exit=$RC wall_s=$(( $(date +%s) - S ))"
MD=data/calibration/rockridge.assessment-r47-base-screen.md
node $T/screen.cjs $MD > $T/screen-base.json; log "C: screen $(cat $T/screen-base.json)"
mkdir -p $EV/baseline && cp $MD $EV/baseline/ && rm -f $MD
log "C: baseline ten seeds"
S=$(date +%s); npm run assess -- --suffix r47-base --noise --jobs $JOBS > $T/assess-base.log 2>&1; RC=$?
log "C: assess exit=$RC wall_s=$(( $(date +%s) - S ))"
MD=data/calibration/rockridge.assessment-r47-base.md
node $T/screen.cjs $MD > $T/assess-base.json; log "C: ten-seed $(cat $T/assess-base.json)"
cp $MD $EV/ && rm -f $MD
npx tsx $R/station-table.ts --suffix r47-base --stations $T/stations.base.json > $EV/stations-base-ten.md 2> $T/st-base-ten.err; log "C: station table ten exit=$?"
npx tsx $R/station-table.ts --suffix r47-base-screen --seeds 1-3 --stations $T/stations.base.json > $EV/stations-base-screen.md 2> $T/st-base-screen.err; log "C: station table screen exit=$?"
node $T/common.cjs $EV/stations-base-ten.md "ramp on 1695" "ramp on 1711" "ramp off 1695" > $T/base-ten-members.json; log "C: ten members $(cat $T/base-ten-members.json)"
node $T/common.cjs $EV/stations-base-screen.md "ramp on 1695" "ramp on 1711" "ramp off 1695" > $T/base-screen-members.json; log "C: screen members $(cat $T/base-screen-members.json)"
node -e "
const j=JSON.parse(require('fs').readFileSync('$T/assess-base.json')).counts;
const ok = j.pm_peak && j.am_peak && j.pm_peak.fitted===74 && j.pm_peak.fittedOf===92 && j.pm_peak.held===14 && j.pm_peak.heldOf===24 && j.am_peak.fitted===70 && j.am_peak.fittedOf===77 && j.am_peak.held===14 && j.am_peak.heldOf===19;
console.log(ok ? 'REPRODUCED' : 'DIFFERS '+JSON.stringify(j));
" > $T/base-repro.txt; log "C: ten-seed baseline $(cat $T/base-repro.txt)"
cp $T/screen-base.log $T/assess-base.log $EV/
grep -q REPRODUCED $T/base-repro.txt || { log "C: ten-seed baseline does not reproduce the published figures, stop"; exit 1; }
log "BC done"
