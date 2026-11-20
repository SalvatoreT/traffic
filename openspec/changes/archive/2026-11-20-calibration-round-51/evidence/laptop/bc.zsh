#!/bin/zsh
# Round 51, steps A (build, fingerprint, tests), B (baseline gate) and C (baseline three-seed screen with the D16 backlog line).
cd "$(git rev-parse --show-toplevel)" || exit 1
EV=openspec/changes/calibration-round-51/evidence; T=target/r51; JOBS=12
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
log() { echo "$(now) $*" | tee -a $T/chain.log; }
mkdir -p $EV
log "A: npm install"
npm install > $T/npm-install.log 2>&1 || { log "A: npm install FAILED"; exit 1; }
log "A: cargo build"
cargo build --release -p traffic-sim --bin calibrate --bin validate --bin fingerprint > $T/build.log 2>&1 || { log "A: build FAILED"; exit 1; }
FP=$(cargo run --quiet --release --bin fingerprint); log "A: fingerprint $FP"
[ "$FP" = d45a275dd7be0713cec6a64394b7d8a9 ] || { log "A: fingerprint mismatch, stop"; exit 1; }
npx vitest run tools/gate-prior.test.ts tools/node-prior.test.ts tools/block-membership.test.ts tools/membership-loop.test.ts > $T/vitest.log 2>&1; RC=$?; log "A: vitest exit=$RC $(grep -E 'Tests ' $T/vitest.log | tr -s ' ')"
[ $RC = 0 ] || { log "A: tests fail, stop"; exit 1; }
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
cp data/demand/rockridge.fit.md $T/fit.base.md
log "C: baseline screen"
S=$(date +%s); npm run assess -- --seeds 1-3 --periods am_peak,pm_peak --suffix r51-base-screen --diagnostic --jobs $JOBS > $T/screen-base.log 2>&1; RC=$?
log "C: screen exit=$RC wall_s=$(( $(date +%s) - S ))"
MD=data/calibration/rockridge.assessment-r51-base-screen.md
node $T/screen.cjs $MD > $T/screen-base.json; log "C: screen $(cat $T/screen-base.json)"
mkdir -p $EV/baseline && cp $MD $T/screen-base.json $EV/baseline/ && cp $T/screen-base.log $EV/baseline/screen-base.txt && rm -f $MD
OK=$(node -e "const b=JSON.parse(require('fs').readFileSync('$T/screen-base.json')).backlog; console.log(['am_peak','pm_peak'].every(p=>b[p]&&b[p].k===3&&b[p].n===3)?'yes':'no')")
log "C: baseline backlog under 2% in 3 of 3 seeds, both periods: $OK"
[ "$OK" = yes ] || { log "C: baseline backlog line is not 3 of 3, stop and report"; echo "stop at C: baseline backlog" >> $T/decisions.txt; exit 1; }
log "BC done"
