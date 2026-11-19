#!/bin/zsh
# Round 45, steps B (baseline gate) and C (baseline three-seed screen). Batch worktree; the lock is held by the session.
cd "$(git rev-parse --show-toplevel)" || exit 1
EV=openspec/changes/calibration-round-45/evidence; T=target/r45; JOBS=12
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
log() { echo "$(now) $*" | tee -a $T/chain.log; }
log "B: cargo build"
cargo build --release -p traffic-sim --bin calibrate --bin validate --bin fingerprint > $T/build.log 2>&1 || { log "B: build FAILED"; exit 1; }
FP=$(cargo run --quiet --release --bin fingerprint); log "B: fingerprint $FP"
[ "$FP" = d45a275dd7be0713cec6a64394b7d8a9 ] || { log "B: fingerprint mismatch, stop"; exit 1; }
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
log "C: baseline screen"
S=$(date +%s); npm run assess -- --seeds 1-3 --periods am_peak,pm_peak --suffix r45-base-screen --diagnostic --jobs $JOBS > $T/screen-base.log 2>&1; RC=$?
log "C: assess exit=$RC wall_s=$(( $(date +%s) - S ))"
cp $T/screen-base.log $EV/screen-base.log
log "BC done"
