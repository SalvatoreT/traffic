#!/bin/zsh
# Round 53 fresh-seed confirmation (lead rule D5, 2026-11-21, before any run): seeds 11-20, all three periods, the baseline (the published round 52 model) and then the round 53 candidate,
# each with its own --suffix in verdict mode (no --diagnostic, no --publish, no --noise). Needs target/r53/{demand.cand.json,demand.cand.cv.json,fit-cand/,stations.base.json,cand-hashes.txt,cand-config.sha,
# demand.base.json, demand.base.cv.json, cand-membership/, published-membership/}, saved by the runbook (steps B and D). Afterwards it puts the published membership files back, rebuilds the baseline with `npm run data` and checks demand 2d16d8f8eb0950ca and cross-validation demand 1c3b1666f24156f1.
# Holds target/batches/worktree.lock.
cd "$(git rev-parse --show-toplevel)" || exit 1
R=target/r53-confirm; T=target/r53; K=target/batches/worktree.lock; JOBS=12; SEEDS=11-20
BASE_CONFIG=2405ff02c92b2837; BASE_HASHES="53c823f20d9165ed 2d16d8f8eb0950ca 1c3b1666f24156f1 "; BASE_FP=6b886c8f52ee07397773ddd0ebbcb447
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
log() { echo "$(now) $*" | tee -a $R/chain.log; }
hashes3() { sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json | cut -c1-16 | tr '\n' ' '; }
finish() {
  zsh openspec/changes/calibration-round-53/scripts/restore.zsh $R/chain.log
  rm -rf $K
  log "ALL DONE $1"
}
mkdir -p $R; cp data/calibration/rockridge.assessment-r53.md openspec/changes/calibration-round-53/evidence/ 2>/dev/null; mkdir $K 2>/dev/null || { echo "worktree lock held: $(cat $K/owner 2>/dev/null)"; exit 1; }
echo "round 53 fresh-seed confirmation (seeds $SEEDS)" > $K/owner
log "START fresh-seed confirmation at $(git rev-parse --short HEAD), seeds $SEEDS"
git checkout data/demand
cp $T/demand.base.json public/data/rockridge.demand.json; cp $T/demand.base.cv.json target/validation/rockridge.demand.json
FP=$(./target/release/fingerprint)
CH=$(shasum -a 256 data/demand/rockridge.config.json | cut -c1-16); H=$(hashes3)
log "baseline inputs: config $CH; hashes $H; fingerprint $FP; status $(git status --short | tr '\n' ';')"
[ "$CH" = "$BASE_CONFIG" ] && [ "$H" = "$BASE_HASHES" ] && [ "$FP" = "$BASE_FP" ] || { log "baseline inputs differ, stop"; finish "(baseline inputs differ)"; exit 1; }
S=$(date +%s); npm run assess -- --seeds $SEEDS --suffix r53-confirm-base --jobs $JOBS > $R/assess-base.log 2>&1; RC=$?
log "baseline assess exit=$RC wall_s=$(( $(date +%s) - S ))"
mv data/calibration/rockridge.assessment-r53-confirm-base.md $R/ 2>/dev/null || log "baseline assessment file missing"
git checkout data/demand
python3 openspec/changes/calibration-round-53/apply-candidate.py end-along >> $R/chain.log || { finish "(apply failed)"; exit 1; }
cp $T/fit-cand/rockridge.fit*.md data/demand/
cp $T/demand.cand.json public/data/rockridge.demand.json
cp $T/demand.cand.cv.json target/validation/rockridge.demand.json
cp $T/cand-membership/*.json target/membership/ 2>/dev/null
CH=$(shasum -a 256 data/demand/rockridge.config.json | cut -c1-16)
H=$(sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json target/membership/rockridge.membership.json target/membership/rockridge.membership-training.json | cut -c1-16 | tr '\n' ' ')
log "candidate inputs: config $CH; hashes $H"
[ "$CH" = "$(cat $T/cand-config.sha)" ] && [ "$H" = "$(tr '\n' ' ' < $T/cand-hashes.txt)" ] || { log "candidate inputs differ, stop"; finish "(candidate inputs differ)"; exit 1; }
cmp -s $T/stations.base.json data/demand/rockridge.stations.json || { log "stations file differs, stop"; finish "(stations differ)"; exit 1; }
S=$(date +%s); npm run assess -- --seeds $SEEDS --suffix r53-confirm --jobs $JOBS > $R/assess-cand.log 2>&1; RC=$?
log "candidate assess exit=$RC wall_s=$(( $(date +%s) - S ))"
mv data/calibration/rockridge.assessment-r53-confirm.md $R/ 2>/dev/null || log "candidate assessment file missing"
log "status before restore: $(git status --short | tr '\n' ';')"
finish ""
node openspec/changes/calibration-round-53/scripts/confirm.cjs | tail -40
