#!/bin/zsh
# Round 51, lead decision of 2026-11-19 after the low-demand stop: screen, validation and ten seeds on the saved final candidate, without
# rerunning the loop. Restores the post-loop state (candidate config, saved demand files, final fit reports; membership files untouched),
# checks every hash, runs steps E and F (fg.zsh), then restores the baseline.
cd "$(git rev-parse --show-toplevel)" || exit 1
EV=openspec/changes/calibration-round-51/evidence; T=target/r51; R=openspec/changes/calibration-round-51
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
log() { echo "$(now) $*" | tee -a $T/chain.log; }
finish() {
  git checkout data/demand
  log "restore: npm run data on the clean config"
  npm run data > $T/data-restore2.log 2>&1
  log "restore: exit=$? hashes $(sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json | cut -c1-16 | tr '\n' ' ') status: $(git status --short | tr '\n' ';')"
  rm -rf target/batches/worktree.lock
  log "ALL DONE $1"
}
log "RESUME round 51 at E on the saved candidate (lead decision), $(git rev-parse --short HEAD)"
echo "lead decision: continue with E and F on the saved candidate after the low-demand stop" >> $T/decisions.txt
git checkout data/demand
python3 $R/apply-candidate.py shares-membership | tee -a $T/chain.log || { finish "(apply failed)"; exit 1; }
CH=$(shasum -a 256 data/demand/rockridge.config.json | cut -c1-16); log "E0: config sha256 $CH"
cp $T/fit-cand/rockridge.fit*.md data/demand/
cp $T/demand.cand.json public/data/rockridge.demand.json
cp $T/demand.cand.cv.json target/validation/rockridge.demand.json
H=$(sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json target/membership/rockridge.membership.json target/membership/rockridge.membership-training.json | cut -c1-16 | tr '\n' ' ')
log "E0: hashes $H"
cmp -s $T/stations.base.json data/demand/rockridge.stations.json && log "E0: stations file identical" || { log "E0: stations file differs, stop"; finish "(stations differ)"; exit 1; }
[ "$CH" = 1080597767aac58c ] || { log "E0: config hash differs, stop"; finish "(config differs)"; exit 1; }
[ "$H" = "53c823f20d9165ed 5d6be8a70618e905 7164fa2ab08f612a 74a88c864d406903 7d0fdb063236304d " ] || { log "E0: candidate hashes differ, stop"; finish "(hashes differ)"; exit 1; }
log "E0: post-loop state restored; status $(git status --short | tr '\n' ';')"
./target/r51/fg.zsh
finish ""
