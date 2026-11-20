#!/bin/zsh
# Round 51 fresh-seed confirmation (lead request, 2026-11-19): seeds 11-20, all three periods, the baseline and then the round 51 candidate,
# each with its own --suffix in verdict mode (no --diagnostic, no --publish, no --noise). Candidate setup as in target/r51/resume-ef.zsh.
# Restores the baseline afterwards. Holds target/batches/worktree.lock.
cd "$(git rev-parse --show-toplevel)" || exit 1
R=target/r51-confirm; T=target/r51; K=target/batches/worktree.lock; JOBS=12; SEEDS=11-20
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
log() { echo "$(now) $*" | tee -a $R/chain.log; }
hashes3() { sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json | cut -c1-16 | tr '\n' ' '; }
finish() {
  git checkout data/demand
  log "restore: npm run data on the clean config"
  npm run data > $R/data-restore.log 2>&1
  log "restore: exit=$? hashes $(hashes3) config $(shasum -a 256 data/demand/rockridge.config.json | cut -c1-16) status: $(git status --short | tr '\n' ';')"
  rm -rf $K
  log "ALL DONE $1"
}
mkdir $K 2>/dev/null || { echo "worktree lock held: $(cat $K/owner 2>/dev/null)"; exit 1; }
echo "round 51 fresh-seed confirmation (seeds $SEEDS)" > $K/owner
log "START fresh-seed confirmation at $(git rev-parse --short HEAD), seeds $SEEDS"
FP=$(./target/release/fingerprint)
CH=$(shasum -a 256 data/demand/rockridge.config.json | cut -c1-16); H=$(hashes3)
log "baseline inputs: config $CH; hashes $H; fingerprint $FP; status $(git status --short | tr '\n' ';')"
[ "$CH" = 505dd0f032fc7ae8 ] && [ "$H" = "53c823f20d9165ed 9cdebdabf05c4460 2f9ae152b9bbf78e " ] && [ "$FP" = d45a275dd7be0713cec6a64394b7d8a9 ] || { log "baseline inputs differ, stop"; finish "(baseline inputs differ)"; exit 1; }
S=$(date +%s); npm run assess -- --seeds $SEEDS --suffix r51-confirm-base --jobs $JOBS > $R/assess-base.log 2>&1; RC=$?
log "baseline assess exit=$RC wall_s=$(( $(date +%s) - S ))"
mv data/calibration/rockridge.assessment-r51-confirm-base.md $R/ 2>/dev/null || log "baseline assessment file missing"
git checkout data/demand
python3 openspec/changes/calibration-round-51/apply-candidate.py shares-membership >> $R/chain.log || { finish "(apply failed)"; exit 1; }
cp $T/fit-cand/rockridge.fit*.md data/demand/
cp $T/demand.cand.json public/data/rockridge.demand.json
cp $T/demand.cand.cv.json target/validation/rockridge.demand.json
CH=$(shasum -a 256 data/demand/rockridge.config.json | cut -c1-16)
H=$(sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json target/membership/rockridge.membership.json target/membership/rockridge.membership-training.json | cut -c1-16 | tr '\n' ' ')
log "candidate inputs: config $CH; hashes $H"
[ "$CH" = 1080597767aac58c ] && [ "$H" = "53c823f20d9165ed 5d6be8a70618e905 7164fa2ab08f612a 74a88c864d406903 7d0fdb063236304d " ] || { log "candidate inputs differ, stop"; finish "(candidate inputs differ)"; exit 1; }
cmp -s $T/stations.base.json data/demand/rockridge.stations.json || { log "stations file differs, stop"; finish "(stations differ)"; exit 1; }
S=$(date +%s); npm run assess -- --seeds $SEEDS --suffix r51-confirm --jobs $JOBS > $R/assess-cand.log 2>&1; RC=$?
log "candidate assess exit=$RC wall_s=$(( $(date +%s) - S ))"
mv data/calibration/rockridge.assessment-r51-confirm.md $R/ 2>/dev/null || log "candidate assessment file missing"
log "status before restore: $(git status --short | tr '\n' ';')"
finish ""
