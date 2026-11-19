#!/bin/zsh
# Round 46, steps A (build, fingerprint, ramp-K tests), B (baseline gate) and C (baseline three-seed screen).
cd "$(git rev-parse --show-toplevel)" || exit 1
EV=openspec/changes/calibration-round-46/evidence; T=target/r46; JOBS=12
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
log() { echo "$(now) $*" | tee -a $T/chain.log; }
log "A: npm install"
npm install > $T/npm-install.log 2>&1 || { log "A: npm install FAILED"; exit 1; }
log "A: cargo build"
cargo build --release -p traffic-sim --bin calibrate --bin validate --bin fingerprint > $T/build.log 2>&1 || { log "A: build FAILED"; exit 1; }
FP=$(cargo run --quiet --release --bin fingerprint); log "A: fingerprint $FP"
[ "$FP" = d45a275dd7be0713cec6a64394b7d8a9 ] || { log "A: fingerprint mismatch, stop"; exit 1; }
npx vitest run tools/ramp-k.test.ts > $T/vitest.log 2>&1; log "A: vitest exit=$? $(grep -E 'Tests ' $T/vitest.log | tr -s ' ')"
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
log "C: baseline screen"
S=$(date +%s); npm run assess -- --seeds 1-3 --periods am_peak,pm_peak --suffix r46-base-screen --diagnostic --jobs $JOBS > $T/screen-base.log 2>&1; RC=$?
log "C: assess exit=$RC wall_s=$(( $(date +%s) - S ))"
MD=data/calibration/rockridge.assessment-r46-base-screen.md
node $T/screen.cjs $MD > $T/screen-base.json; log "C: $(cat $T/screen-base.json)"
mkdir -p $EV/baseline && cp $T/screen-base.log $EV/baseline/ && cp $T/screen-base.json $EV/baseline/ && cp $MD $EV/baseline/ && rm -f $MD
log "BC done"
