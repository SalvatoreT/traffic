#!/bin/zsh
# Staged proposal search on the round 52 candidate (lead request, 2026-11-20), in the shape of search-c5. Puts the saved candidate back
# (config, demand files, fit reports; membership files stay), checks hashes, seeds --out with the search-c5 output (the published set) and
# --known with a copy of data/proposals/rockridge.seeds.json (the file search-c5 wrote), runs explore, then restores the baseline.
# Writes nothing to public/data/rockridge.proposals.json or data/proposals. Holds target/batches/worktree.lock.
cd "$(git rev-parse --show-toplevel)" || exit 1
R=target/r52-search; T=target/r52; K=target/batches/worktree.lock
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
log() { echo "$(now) $*" | tee -a $R/chain.log; }
finish() {
  git checkout data/demand
  log "restore: npm run data on the clean config"
  npm run data > $R/data-restore.log 2>&1
  log "restore: exit=$? hashes $(sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json | cut -c1-16 | tr '\n' ' ') status: $(git status --short | tr '\n' ';')"
  log "published-file check: $(shasum -a 256 public/data/rockridge.proposals.json | cut -c1-16) (before $PUB)"
  rm -rf $K
  log "ALL DONE $1"
}
mkdir $K 2>/dev/null || { echo "lock held: $(cat $K/owner 2>/dev/null)"; exit 1; }; echo "r52-search $$ $(date)" > $K/owner
PUB=$(shasum -a 256 public/data/rockridge.proposals.json | cut -c1-16)
log "START staged search on the round 52 candidate at $(git rev-parse --short HEAD)"
git checkout data/demand
python3 openspec/changes/calibration-round-52/apply-candidate.py route-weight >> $R/chain.log || { finish "(apply failed)"; exit 1; }
cp $T/fit-cand/rockridge.fit*.md data/demand/
cp $T/demand.cand.json public/data/rockridge.demand.json
cp $T/demand.cand.cv.json target/validation/rockridge.demand.json
CH=$(shasum -a 256 data/demand/rockridge.config.json | cut -c1-16)
H=$(sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json target/membership/rockridge.membership.json target/membership/rockridge.membership-training.json | cut -c1-16 | tr '\n' ' ')
FP=$(./target/release/fingerprint)
log "inputs: config $CH; hashes $H; fingerprint $FP"
[ "$CH" = 2405ff02c92b2837 ] && [ "$H" = "53c823f20d9165ed 2d16d8f8eb0950ca 1c3b1666f24156f1 3d639670c1feb38f c1cd4ce96fb28791 " ] && [ "$FP" = d45a275dd7be0713cec6a64394b7d8a9 ] || { log "inputs differ, stop"; finish "(inputs differ)"; exit 1; }
cmp -s $T/stations.base.json data/demand/rockridge.stations.json || { log "stations file differs, stop"; finish "(stations differ)"; exit 1; }
cp target/batches/search-c5/proposals.json $R/proposals.json
cp target/batches/search-c5/report.md $R/report.md
cp data/proposals/rockridge.seeds.json $R/seeds.json
cp $R/proposals.json $R/proposals.seeded.json; cp $R/seeds.json $R/seeds.before.json
log "seeded proposals.json $(shasum -a 256 $R/proposals.json | cut -c1-16) (search-c5 output), report.md $(shasum -a 256 $R/report.md | cut -c1-16), seeds.json $(shasum -a 256 $R/seeds.json | cut -c1-16) (data/proposals/rockridge.seeds.json)"
ARGS=(--area rockridge --periods pm_peak,am_peak,midday --seeds 1-3 --confirm-seeds 101-110 --beam 5 --depth 6 --candidates 40 --expand 12 --finalists 12 --options 6 --screen-minutes 20 --minutes 60 --jobs 12 --out $R/proposals.json --report $R/report.md --known $R/seeds.json)
print -r -- "(cwd <worktree>) target/release/explore ${ARGS[*]}" > $R/command.txt
log "explore started"
S=$(date +%s)
./target/release/explore "${ARGS[@]}" > $R/search.log 2>&1
RC=$?
log "explore exit=$RC wall_s=$(( $(date +%s) - S ))"
log "status after explore: $(git status --short | tr '\n' ';')"
finish ""
