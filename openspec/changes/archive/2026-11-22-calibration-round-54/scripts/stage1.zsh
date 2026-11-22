#!/bin/zsh
# Round 54, stage 1: the router with the control delay charged twice (option off) against once (option on), PM and AM, seeds 1 to 10, on the published shipped demand and on the
# cross-validation demand of the derived-targets job. Scored under the judged scope of derived-targets-not-judged by tools/diag/control-charge-score.ts. Direction only: both demands
# were fitted with the router that charges twice. Writes nothing under public/data or data/; no data:push, no upload token, no request to /api/. Bar: design.md D2.
#   CV=/path/to/derived-targets-worktree/target/validation/rockridge.demand.json JOBS=12 zsh openspec/changes/calibration-round-54/scripts/stage1.zsh
# Run from a checkout of origin/calibration-round-54 that holds the git-ignored data (data/osm/*, public/data/rockridge.{network,demand}.json, target/membership/*).
cd "$(git rev-parse --show-toplevel)" || exit 1
R=target/r54-stage1; CH=openspec/changes/calibration-round-54
JOBS=${JOBS:-12}; SEEDS=1-10
SHIP=public/data/rockridge.demand.json
CV=${CV:-target/validation/rockridge.demand.json}
NET_HASH=53c823f20d9165ed; SHIP_HASH=2d16d8f8eb0950ca
CV_HASH=${CV_HASH:-PLACEHOLDER}   # hash prefix of the derived-targets job's cross-validation demand, filled in by the project lead (printed below either way)
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
log() { echo "$(now) $*" | tee -a $R/chain.log; }
h() { shasum -a 256 "$1" | cut -c1-16; }
mkdir -p $R $CH/evidence/stage1
log "START stage 1 at $(git rev-parse --short HEAD)"
[ "$(h public/data/rockridge.network.json)" = $NET_HASH ] || { log "network is not $NET_HASH, stop"; exit 1; }
[ "$(h $SHIP)" = $SHIP_HASH ] || { log "shipped demand is not $SHIP_HASH, stop"; exit 1; }
[ -f $CV ] || { log "no cross-validation demand at $CV (set CV to the derived-targets job's target/validation/rockridge.demand.json), stop"; exit 1; }
log "cross-validation demand $CV: $(h $CV) (expected $CV_HASH)"
[ "$CV_HASH" = PLACEHOLDER ] || [ "$(h $CV)" = "$CV_HASH" ] || { log "cross-validation demand hash differs, stop"; exit 1; }
cp $CV $R/cv.demand.json
log "git status before: $(git status --short | tr '\n' ';')"
cargo build --release -p traffic-sim --bin calibrate --bin fingerprint > $R/build.log 2>&1 || { log "build failed, stop"; exit 1; }
log "fingerprint $(./target/release/fingerprint)"
CAL=target/release/calibrate
for p in pm_peak am_peak; do
  for opt in off on; do
    flag=(); [ $opt = on ] && flag=(--single-control-charge) || flag=(--no-single-control-charge)
    for view in ship cv; do
      D=$R/$opt-$view; rm -rf $D; mkdir -p $D
      dem=(); [ $view = cv ] && dem=(--demand $R/cv.demand.json)
      S0=$(date +%s)
      $CAL --area rockridge --period $p --minutes 60 --scale 1 --seeds $SEEDS --jobs $JOBS --keep-seeds $D --out $D/summary $dem $flag > $D/calibrate.log 2>&1
      RC=$?
      log "$p $opt $view: exit=$RC wall_s=$(( $(date +%s) - S0 ))"
      [ $RC = 0 ] || { log "calibrate failed, stop"; exit 1; }
    done
  done
  node openspec/changes/calibration-round-54/scripts/check-option.cjs $R/off-ship $R/off-cv off $p || exit 1
  node openspec/changes/calibration-round-54/scripts/check-option.cjs $R/on-ship $R/on-cv on $p || exit 1
  npx tsx tools/diag/control-charge-score.ts --period $p --seeds $SEEDS --set off=$R/off-ship,$R/off-cv --set on=$R/on-ship,$R/on-cv | tee $CH/evidence/stage1/score-$p.md
done
log "git status after: $(git status --short | tr '\n' ';')"
log "Bar lines:"
grep -h -E '^- (Diagonal|No judged|Colby|Telegraph)' $CH/evidence/stage1/score-*.md | tee -a $R/chain.log
log "DONE stage 1. Per-seed reports are under $R (not committed); the scores are in $CH/evidence/stage1/."
