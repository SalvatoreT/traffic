#!/bin/zsh
# Restamp of round 52 on simulator 6b886c8f (lead plan of 2026-11-21), steps 1 and 2: release build, WASM, parity, the membership loop as in
# round 52 on the committed config, npm run data, and the comparisons with the published membership, demand, fit reports and audit.
# Stops on any input mismatch or any difference beyond the stamped fingerprint. No data:push, no /api/, no upload token. Holds the worktree lock.
cd "$(git rev-parse --show-toplevel)" || exit 1
A=target/restamp52; K=target/batches/worktree.lock; OLD=target/r52-membership; OLDLOOP=target/r52-loop; R52=target/r52
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
log() { echo "$(now) $*" | tee -a $A/chain.log; }
h() { shasum -a 256 "$1" | cut -c1-16; }
stop() { kill $WPID 2>/dev/null; log "STOP: $*"; log "status: $(git status --short | tr '\n' ';')"; rm -rf $K; log "A DONE (stopped)"; exit 1; }
step() { local name=$1; shift; log "$name: start"; local S=$(date +%s); "$@" > $A/$name.log 2>&1; local RC=$?; log "$name: exit=$RC wall_s=$(( $(date +%s) - S ))"; return $RC; }
snap() { local d=$A/snap/$1; mkdir -p $d && cp data/demand/rockridge.fit*.md $d/ 2>/dev/null; cp $A/node-prior.*.json $d/ 2>/dev/null; echo "$(now) snapshot $1" >> $A/snap.log; }
watch_builds() {
  local seen=""
  while true; do
    if [ -f target/membership-loop/state.json ]; then
      for id in $(node -e "try{const s=JSON.parse(require('fs').readFileSync('target/membership-loop/state.json'));console.log(s.done.filter(x=>x.endsWith('-build')).join(' '))}catch(e){}"); do
        [[ " $seen " == *" $id "* ]] || { snap $id; seen="$seen $id"; }
      done
    fi
    sleep 20
  done
}
mkdir $K 2>/dev/null || { echo "lock held: $(cat $K/owner 2>/dev/null)"; exit 1; }; echo "restamp52-A $$ $(date)" > $K/owner
log "START restamp of round 52, steps 1-2, at $(git rev-parse --short HEAD) on $(git branch --show-current)"

ST=$(git status --short | grep -v '^?? .agents/$')
[ -z "$ST" ] || stop "tree not clean before start: $(echo $ST | tr '\n' ';')"
I="config $(h data/demand/rockridge.config.json) proposals $(h public/data/rockridge.proposals.json) network $(h public/data/rockridge.network.json) demand $(h public/data/rockridge.demand.json) cv $(h target/validation/rockridge.demand.json) membership $(h target/membership/rockridge.membership.json) $(h target/membership/rockridge.membership-training.json)"
log "inputs: $I"
[ "$I" = "config 2405ff02c92b2837 proposals 197a99cdafc026f8 network 53c823f20d9165ed demand 2d16d8f8eb0950ca cv 1c3b1666f24156f1 membership 3d639670c1feb38f c1cd4ce96fb28791" ] || stop "inputs are not the published round 52 inputs"
{ [ -e $OLD ] || [ -e $OLDLOOP ]; } && stop "$OLD or $OLDLOOP exists already"
rm -rf $A/pd-before; cp -R public/data $A/pd-before; log "copied the published public/data to $A/pd-before ($(du -sk $A/pd-before | cut -f1) KB)"

# 1. Builds
export PATH="$HOME/.cargo/bin:$PATH"
step build cargo build --release -p traffic-sim --bins || stop "release build failed"
FP=$(./target/release/fingerprint); log "fingerprint $FP"
[ "$FP" = 6b886c8f52ee07397773ddd0ebbcb447 ] || stop "fingerprint is $FP, expected 6b886c8f52ee07397773ddd0ebbcb447"
step wasm npm run wasm || stop "npm run wasm failed"
step parity npm run check:wasm || stop "WASM parity check failed"
log "parity: $(tail -2 $A/parity.log | tr '\n' ' ')"

# 2. Membership loop, as in round 52 (target/r52/loop.zsh), on the committed config
mv target/membership-loop $OLDLOOP && mv target/membership $OLD || stop "could not move the round 52 loop folders aside"
log "moved target/membership-loop to $OLDLOOP and target/membership (published files) to $OLD"
npx tsx tools/membership-loop.ts --dry-run > $A/dry-run.txt 2>&1; RC=$?; log "dry run exit=$RC"
grep -E 'withholds|selected' $A/dry-run.txt | tee -a $A/chain.log
MISS=""
for want in 'the frozen split withholds 91 from the training view' 'shipped pm_peak: 337 selected (245 link, 92 movement or route), 6 stay static' 'shipped am_peak: 272 selected (200 link, 72 movement or route), 6 stay static' 'training pm_peak: 256 selected (187 link, 69 movement or route), 0 stay static, 87 withheld' 'training am_peak: 201 selected (148 link, 53 movement or route), 0 stay static, 77 withheld'; do
  grep -qF "$want" $A/dry-run.txt || MISS="$MISS [$want]"
done
[ $RC = 0 ] && [ -z "$MISS" ] || stop "dry run differs from round 52's counts:$MISS"
log "loop: start"
watch_builds & WPID=$!
S=$(date +%s); GATE_PRIOR_DUMP=$A/node-prior.json npx tsx tools/membership-loop.ts --jobs 12 --report $A/membership-loop.md > $A/loop.log 2>&1; RC=$?
sleep 25; kill $WPID 2>/dev/null; WPID=""
log "loop: exit=$RC wall_s=$(( $(date +%s) - S )) (round 52: 3992)"
[ $RC = 0 ] || { tail -30 $A/loop.log | tee -a $A/chain.log; stop "membership loop exit $RC"; }

# Where the loop stands against round 52's, build by build
for it in iter0 iter1 iter2; do for v in shipped training; do
  cmp -s target/membership-loop/$it/$v/demand.json $OLDLOOP/$it/$v/demand.json && log "loop $it/$v demand.json identical to round 52's" || log "loop $it/$v demand.json DIFFERS from round 52's"
done; done
for id in i0-shipped-build i0-training-build i1-shipped-build i1-training-build i2-shipped-build i2-training-build final-shipped-build final-training-build; do
  N=0; for f in $R52/snap/$id/rockridge.fit*.md; do [ -f $A/snap/$id/$(basename $f) ] || { N=$((N+1)); continue; }; cmp -s $f $A/snap/$id/$(basename $f) || N=$((N+1)); done
  [ $N = 0 ] && log "fit reports after $id: identical to round 52's" || log "fit reports after $id: $N files differ from round 52's"
done
for f in $R52/node-prior.*.json; do cmp -s $f $A/$(basename $f) && log "gate prior dump $(basename $f) identical" || log "gate prior dump $(basename $f) DIFFERS"; done
P='gate prior ceilings|offered|ratio|zero-hit|stop|WARNING|ceiling stations|non-gate|flow type|share|through blocks|route weight|Inside-study-area'
diff <(grep -E "$P" $R52/loop.log) <(grep -E "$P" $A/loop.log) > $A/loop-lines.diff; log "loop summary lines vs round 52: $(wc -l < $A/loop-lines.diff | tr -d ' ') diff lines"
diff openspec/changes/archive/2026-11-20-calibration-round-52/evidence/membership-loop.md $A/membership-loop.md > $A/loop-report.diff; log "loop report vs round 52's: $(wc -l < $A/loop-report.diff | tr -d ' ') diff lines"

# 2a. Membership files against the published ones
BAD=0
for v in membership membership-training; do
  node $A/jdiff.cjs $OLD/rockridge.$v.json target/membership/rockridge.$v.json --ignore evidence.simulator > $A/$v-diff.txt 2>&1 || BAD=1
  log "$v: new $(h target/membership/rockridge.$v.json), published $(h $OLD/rockridge.$v.json); $(head -1 $A/$v-diff.txt | sed 's/.* vs [^:]*: //'); $(grep -m3 'ignored\|DIFF' $A/$v-diff.txt | tr '\n' ' ' | cut -c1-400)"
done
[ $BAD = 0 ] || stop "membership differs from the published files beyond evidence.simulator (see $A/membership*-diff.txt)"

# 2b. npm run data on the new membership files
step data npm run data || stop "npm run data failed"
grep -i 'static membership\|membership.*refus\|fall' $A/data.log | head -5 | tee -a $A/chain.log
H="$(h public/data/rockridge.network.json) $(h public/data/rockridge.demand.json) $(h target/validation/rockridge.demand.json)"
log "hashes after npm run data: $H"
DD=$(git status --short data/demand data/areas | tr '\n' ';')
[ -z "$DD" ] && log "fit reports, audit and area config identical to the committed ones" || { git diff --stat data/demand data/areas > $A/data-diff.txt; log "data/demand or data/areas differ: $DD"; }
[ "$H" = "53c823f20d9165ed 2d16d8f8eb0950ca 1c3b1666f24156f1" ] || stop "hashes after npm run data are $H"
[ -z "$DD" ] || stop "data/demand or data/areas differ from the committed files"
log "status: $(git status --short | tr '\n' ';')"
rm -rf $K
log "A DONE"
