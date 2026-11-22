#!/bin/zsh
# Round 54, stage 2 step 2 (after adopt.zsh): the published local data is copied aside, the published membership files are moved out of the way (the loop refuses to start while a configured
# membership file exists), and the membership loop runs on the new router (three passes, PM and AM, both views). The candidate's demand, cross-validation demand, membership files and fit
# reports are saved under target/r54/cand/. Run restore.zsh afterwards, whatever happened. No data:push, no /api/, no upload token. Holds target/batches/worktree.lock.
#   JOBS=12 zsh openspec/changes/calibration-round-54/scripts/loop.zsh
cd "$(git rev-parse --show-toplevel)" || exit 1
T=target/r54; CH=openspec/changes/calibration-round-54; K=target/batches/worktree.lock; JOBS=${JOBS:-12}
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
log() { echo "$(now) $*" | tee -a $T/chain.log; }
h() { shasum -a 256 "$1" | cut -c1-16; }
mkdir -p $T/saved/membership $T/cand/membership $T/cand/fit $CH/evidence/fit target/batches
mkdir $K 2>/dev/null || { echo "worktree lock held: $(cat $K/owner 2>/dev/null)"; exit 1; }; echo "r54-loop $$ $(date)" > $K/owner
stop() { log "STOP: $*"; rm -rf $K; exit 1; }
log "START loop at $(git rev-parse --short HEAD); status: $(git status --short | tr '\n' ';')"
grep -q '^pub const SINGLE_CONTROL_CHARGE: bool = true;' crates/sim/src/params.rs || stop "run adopt.zsh first: SINGLE_CONTROL_CHARGE is not true"
FP=$(./target/release/fingerprint); [ "$FP" = "$(awk '$1=="on"{print $2}' $CH/evidence/fingerprints.txt)" ] || stop "the built fingerprint $FP is not the adopted one (rebuild: cargo build --release)"
cargo build --release -p traffic-sim --bin calibrate --bin validate --bin fingerprint > $T/build.log 2>&1 || stop "build failed"
I="config $(h data/demand/rockridge.config.json) network $(h public/data/rockridge.network.json) demand $(h public/data/rockridge.demand.json)"
log "inputs: $I; fingerprint $FP; membership $(h target/membership/rockridge.membership.json)"
[ "$I" = "config 2405ff02c92b2837 network 53c823f20d9165ed demand 2d16d8f8eb0950ca" ] || stop "inputs are not the published model's"
[ "$(h target/membership/rockridge.membership.json)" = 56e688e7e5749d23 ] || stop "the shipped membership file is not the published one (56e688e7e5749d23)"

# What restore.zsh puts back
cp public/data/rockridge.network.json public/data/rockridge.demand.json $T/saved/
[ -f target/validation/rockridge.demand.json ] && cp target/validation/rockridge.demand.json $T/saved/cv.demand.json
cp target/membership/*.json $T/saved/membership/
cp data/demand/rockridge.fit*.md data/demand/rockridge.stations.json $T/saved/
shasum -a 256 $T/saved/*.json $T/saved/membership/*.json | cut -c1-16,65- > $T/saved/SHA.txt
log "saved the published local data under $T/saved ($(wc -l < $T/saved/SHA.txt | tr -d ' ') json files)"
mv target/membership $T/membership-aside
[ -d target/membership-loop ] && mv target/membership-loop $T/old-loop

# Baseline pass 0 for the identity check of the loop's first pass
cp public/data/rockridge.demand.json $T/demand.base.json
[ -f $T/saved/cv.demand.json ] && cp $T/saved/cv.demand.json $T/demand.base.cv.json

log "dry run"
npx tsx tools/membership-loop.ts --dry-run 2>&1 | tee $CH/evidence/dry-run.txt | tee -a $T/chain.log
log "expected (round 53 runbook and derived-targets runbook): shipped PM 337 selected (245 link, 92 movement or route), AM 272 (200, 72), six gate stations static; training PM 267 (198, 69), 2 static, 74 withheld; AM 212 (159, 53), 2 static, 64 withheld. Compare by eye; the loop does not depend on this."

log "loop started"
S0=$(date +%s)
npx tsx tools/membership-loop.ts --jobs $JOBS --report $CH/evidence/membership-loop.md 2>&1 | tee $T/loop.log > /dev/null
RC=${pipestatus[1]}
log "loop exit=$RC wall_s=$(( $(date +%s) - S0 )) (round 52 restamp: 3777; round 53 estimate 65 to 75 minutes)"
[ $RC = 0 ] || { log "the loop stopped: send back $T/loop.log, target/membership-loop/logs/ and data/demand/rockridge.fit*.md; no --resume, no other run"; rm -rf $K; exit 1; }
cp data/demand/rockridge.fit*.md data/demand/rockridge.stations.json $CH/evidence/fit/
cp target/membership-loop/state.json $CH/evidence/
cp data/demand/rockridge.fit*.md $T/cand/fit/
cp target/membership/*.json $T/cand/membership/
cp public/data/rockridge.demand.json $T/cand/demand.json
cp target/validation/rockridge.demand.json $T/cand/cv.demand.json
sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json target/membership/*.json | cut -c1-16,65- | tee $CH/evidence/candidate-hashes.txt | tee -a $T/chain.log
same() { node -e "const f=require('fs');const a=JSON.parse(f.readFileSync(process.argv[1])).periods,b=JSON.parse(f.readFileSync(process.argv[2])).periods;console.log(JSON.stringify(a)===JSON.stringify(b)?'equal':'DIFFERENT')" $1 $2; }
log "pass 0 shipped periods against the published demand: $(same target/membership-loop/iter0/shipped/demand.json $T/demand.base.json) (expected equal)"
[ -f $T/demand.base.cv.json ] && log "pass 0 training periods against the derived-targets job's cross-validation demand: $(same target/membership-loop/iter0/training/demand.json $T/demand.base.cv.json) (expected equal if that demand is in target/validation)"
log "git status: $(git status --short | tr '\n' ';')"
rm -rf $K
log "DONE loop. The candidate stays in place for assess.zsh; run restore.zsh after it, or at once to stop here."
