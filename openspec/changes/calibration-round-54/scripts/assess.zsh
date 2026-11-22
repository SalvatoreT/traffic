#!/bin/zsh
# Round 54, stage 2 step 3 (after loop.zsh, candidate demand in place): three-seed screen (seeds 1-3, diagnostic), the validation suite, the ten-seed assessment (seeds 1-10, --noise) and the
# fresh-seed assessment (seeds 11-20), each its own --suffix, never --publish. Then the keep rule against the baseline assessments of the derived-targets job (keep-rule.cjs).
# The baseline files are given by BASE1 (seeds 1-10) and BASE2 (seeds 11-20): the derived-targets worktree's data/calibration/rockridge.assessment-derived.md and ...-derived-fresh.md.
#   BASE1=/path/rockridge.assessment-derived.md BASE2=/path/rockridge.assessment-derived-fresh.md JOBS=12 zsh openspec/changes/calibration-round-54/scripts/assess.zsh
# No data:push, no /api/, no upload token. Holds target/batches/worktree.lock.
cd "$(git rev-parse --show-toplevel)" || exit 1
T=target/r54; CH=openspec/changes/calibration-round-54; K=target/batches/worktree.lock; JOBS=${JOBS:-12}
BASE1=${BASE1:?set BASE1 to the derived job assessment on seeds 1-10}; BASE2=${BASE2:?set BASE2 to the derived job assessment on seeds 11-20}
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
log() { echo "$(now) $*" | tee -a $T/chain.log; }
step() { local name=$1; shift; log "$name: start"; local S0=$(date +%s); "$@" > $T/$name.log 2>&1; local RC=$?; log "$name: exit=$RC wall_s=$(( $(date +%s) - S0 ))"; return $RC; }
mkdir -p $T $CH/evidence
mkdir $K 2>/dev/null || { echo "worktree lock held: $(cat $K/owner 2>/dev/null)"; exit 1; }; echo "r54-assess $$ $(date)" > $K/owner
stop() { log "STOP: $*"; rm -rf $K; exit 1; }
[ -d $T/cand ] || stop "no $T/cand: run loop.zsh first"
cmp -s $T/cand/demand.json public/data/rockridge.demand.json || stop "public/data/rockridge.demand.json is not the candidate's"
cmp -s $T/cand/cv.demand.json target/validation/rockridge.demand.json || stop "target/validation/rockridge.demand.json is not the candidate's"
log "START assessment at $(git rev-parse --short HEAD), fingerprint $(./target/release/fingerprint)"
cargo build --release -p traffic-sim --bin calibrate --bin validate > $T/build2.log 2>&1 || stop "build failed"

step screen npm run assess -- --seeds 1-3 --periods am_peak,pm_peak --suffix r54-screen --diagnostic --jobs $JOBS || stop "screen failed to run"
cp data/calibration/rockridge.assessment-r54-screen.md $CH/evidence/ 2>/dev/null
log "screen written to data/calibration/rockridge.assessment-r54-screen.md; the four counts and the backlog line are in its Verdict and D16 sections. Compare with the derived job's three-seed figures by eye; a screen is not a verdict."

step validate ./target/release/validate
log "validate: $(grep -E 'cases pass' $T/validate.log)"
node $CH/scripts/validation-diff.cjs > $CH/evidence/validation-diff.txt 2>&1; log "validation against the published one: $(head -3 $CH/evidence/validation-diff.txt | tr '\n' ' ')"
cp data/calibration/validation.md $CH/evidence/validation.md
git checkout data/calibration/validation.json data/calibration/validation.md

step assess-1-10 npm run assess -- --suffix r54 --noise --jobs $JOBS || stop "ten-seed assessment failed"
cp data/calibration/rockridge.assessment-r54.md $CH/evidence/
step assess-11-20 npm run assess -- --seeds 11-20 --suffix r54-fresh --jobs $JOBS || stop "fresh-seed assessment failed"
cp data/calibration/rockridge.assessment-r54-fresh.md $CH/evidence/
git status --short data/calibration | tee -a $T/chain.log

CAND1=data/calibration/rockridge.assessment-r54.md; CAND2=data/calibration/rockridge.assessment-r54-fresh.md
node $CH/scripts/keep-rule.cjs $BASE1 $CAND1 $BASE2 $CAND2 $CH/evidence/validation-diff.txt | tee $CH/evidence/keep-rule.md
KEEP=$(grep -m1 '^Keep rule:' $CH/evidence/keep-rule.md)
log "$KEEP"
rm -rf $K
log "DONE assessment. Per-seed reports: target/assess-seeds/ (directory names follow the suffixes). Next: search.zsh only if the keep rule passes, then restore.zsh."
