#!/bin/zsh
# Rebuild the round 48 final demands from the saved membership files (the loop's final build was overwritten by the restore), keep copies, then restore the baseline files.
cd <worktree>
L=target/r48/rebuild.log
ts() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
log() { echo "$(ts) $*" >> $L; }
mkdir target/batches/worktree.lock 2>/dev/null || { log "lock held: $(cat target/batches/worktree.lock/owner 2>/dev/null)"; exit 1; }
echo "r48 rebuild (local session) $(ts)" > target/batches/worktree.lock/owner
finish() {
  git checkout data/demand
  cp target/r48/demand.base.json public/data/rockridge.demand.json
  cp target/r48/demand.base.cv.json target/validation/rockridge.demand.json
  log "restore: $(sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json | cut -c1-16 | tr '\n' ' ') status: $(git status --short | tr '\n' ';')"
  rm -rf target/batches/worktree.lock
  log "REBUILD DONE"
}
trap finish EXIT
log "start at $(git rev-parse --short HEAD); status: $(git status --short | tr '\n' ';')"
git checkout data/demand
python3 openspec/changes/calibration-round-48/apply-candidate.py simulated-membership >> $L 2>&1
h=$(sha256sum data/demand/rockridge.config.json | cut -c1-16); log "config $h (loop used $(cat target/r48/config-hash.txt))"
[ "$h" = "$(cat target/r48/config-hash.txt)" ] || { log "config hash differs: stop"; exit 1; }
log "membership $(sha256sum target/membership/*.json | cut -c1-16 | tr '\n' ' ')"
s=$(date +%s); npx tsx tools/build-demand.ts > target/r48/rebuild-shipped.log 2>&1; log "shipped build exit=$? wall_s=$(( $(date +%s)-s ))"
s=$(date +%s); npx tsx tools/build-demand.ts --view training > target/r48/rebuild-training.log 2>&1; log "training build exit=$? wall_s=$(( $(date +%s)-s ))"
log "hashes $(sha256sum public/data/rockridge.demand.json target/validation/rockridge.demand.json | cut -c1-16 | tr '\n' ' ') (expected 1771a9c4a51968c6 83396aeb2a4b1b63)"
grep -m2 'Simulated membership from' data/demand/rockridge.fit.md data/demand/rockridge.fit.cv.md >> $L 2>&1
cp public/data/rockridge.demand.json target/r48/demand.cand.json
cp target/validation/rockridge.demand.json target/r48/demand.cand.cv.json
