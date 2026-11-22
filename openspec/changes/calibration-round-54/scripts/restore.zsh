#!/bin/zsh
# Round 54: put the published local data back after a stage, whatever the verdict. The files are byte copies saved by loop.zsh under target/r54/saved/ (after the fingerprint changes
# `npm run data` stops on the published membership files, so a rebuild is not the way back). The candidate's files stay under target/r54/cand/. Checks every restored file against the
# hashes recorded when it was saved, plus the published values: network 53c823f20d9165ed, shipped demand 2d16d8f8eb0950ca, shipped membership 56e688e7e5749d23, config 2405ff02c92b2837.
#   zsh openspec/changes/calibration-round-54/scripts/restore.zsh
cd "$(git rev-parse --show-toplevel)" || exit 1
T=target/r54
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
log() { echo "$(now) $*" | tee -a $T/chain.log; }
h() { shasum -a 256 "$1" | cut -c1-16; }
[ -f $T/saved/SHA.txt ] || { log "no $T/saved/SHA.txt: nothing to restore from, stop"; exit 1; }
if [ ! -f $T/cand/demand.json ] && [ "$(h public/data/rockridge.demand.json)" != 2d16d8f8eb0950ca ]; then
  mkdir -p $T/cand/membership; cp public/data/rockridge.demand.json $T/cand/demand.json; [ -f target/validation/rockridge.demand.json ] && cp target/validation/rockridge.demand.json $T/cand/cv.demand.json
  [ -d target/membership ] && cp target/membership/*.json $T/cand/membership/ 2>/dev/null; log "saved the candidate's files under $T/cand"
fi
git checkout data/demand data/calibration 2>&1 | tail -1
cp $T/saved/rockridge.network.json $T/saved/rockridge.demand.json public/data/
[ -f $T/saved/cv.demand.json ] && cp $T/saved/cv.demand.json target/validation/rockridge.demand.json
rm -rf target/membership; mkdir -p target/membership; cp $T/saved/membership/*.json target/membership/
cp $T/saved/rockridge.fit*.md $T/saved/rockridge.stations.json data/demand/
BAD=0
while read -r sum file; do
  base=${file:t}; dest=public/data/$base
  case $file in
    */membership/*) dest=target/membership/$base ;;
    */cv.demand.json) dest=target/validation/rockridge.demand.json ;;
  esac
  [ "$(h $dest)" = "$sum" ] || { log "MISMATCH $dest (saved $sum, now $(h $dest))"; BAD=1; }
done < $T/saved/SHA.txt
V="network $(h public/data/rockridge.network.json) demand $(h public/data/rockridge.demand.json) shipped membership $(h target/membership/rockridge.membership.json) config $(h data/demand/rockridge.config.json)"
log "restored: $V"
[ "$V" = "network 53c823f20d9165ed demand 2d16d8f8eb0950ca shipped membership 56e688e7e5749d23 config 2405ff02c92b2837" ] || BAD=1
log "git status: $(git status --short | tr '\n' ';')"
[ $BAD = 0 ] && log "restore verified: the published local data is back" || { log "RESTORE DOES NOT MATCH THE PUBLISHED DATA: stop and report"; exit 1; }
