#!/bin/zsh
# Round 55: put the published model back in the worktree W after the candidate runs, whatever the verdict, from the byte copies a.zsh saved (target/published and target/r55/pd-before).
# The main checkout is never touched by these scripts, so this only readies W for another run. The candidate's files stay under target/r55/cand/ and the loop folder moves to target/r55/loop-run.
# The published data are restored by copying: after a fingerprint or config change `npm run data` stops on membership evidence. REBUILD=1 also rebuilds both demands (about 17 minutes) and checks the hashes.
#   W=/path/to/traffic-r55 [REBUILD=1] zsh openspec/changes/calibration-round-55/laptop/restore.zsh
set -u
W=${W:?set W to the round 55 worktree}
cd $W || exit 1
A=$W/target/r55
source ${0:A:h}/env.zsh
stop() { log "STOP: $*"; exit 1; }
[ -d target/published ] && [ -d $A/pd-before ] || stop "target/published or $A/pd-before is missing: nothing to restore from"
if [ ! -f $A/cand/demand.json ] && [ "$(h public/data/rockridge.demand.json)" != $EXP_DEMAND ]; then
  mkdir -p $A/cand/membership; cp public/data/rockridge.demand.json $A/cand/demand.json; cp target/validation/rockridge.demand.json $A/cand/cv.demand.json
  cp target/membership/*.json $A/cand/membership/ 2>/dev/null; log "saved the candidate's files under $A/cand"
fi
git checkout data/demand data/calibration data/proposals 2>&1 | tail -1
rsync -a --delete $A/pd-before/ public/data/
cp target/published/cv-demand.json target/validation/rockridge.demand.json
rm -rf target/membership; mkdir -p target/membership
cp target/published/rockridge.membership.json target/published/rockridge.membership-training.json target/membership/
[ -d target/membership-loop ] && { rm -rf $A/loop-run; mv target/membership-loop $A/loop-run; log "the loop folder is now $A/loop-run"; }
if [ -n "${REBUILD:-}" ]; then
  step rebuild-shipped npx tsx tools/build-demand.ts || stop "shipped rebuild failed"
  step rebuild-training npx tsx tools/build-demand.ts --view training || stop "training rebuild failed"
fi
V="network $(h public/data/rockridge.network.json) demand $(h public/data/rockridge.demand.json) cv $(h target/validation/rockridge.demand.json) membership $(h target/membership/rockridge.membership.json) training $(h target/membership/rockridge.membership-training.json) config $(h data/demand/rockridge.config.json)"
log "restored: $V"
[ "$V" = "network $EXP_NETWORK demand $EXP_DEMAND cv $EXP_CV membership $EXP_MEMB training $EXP_MEMBT config $EXP_CONFIG" ] || stop "RESTORE DOES NOT MATCH THE PUBLISHED DATA: stop and report"
log "restore verified; status: $(git status --short --untracked-files=no | tr '\n' ';')"
