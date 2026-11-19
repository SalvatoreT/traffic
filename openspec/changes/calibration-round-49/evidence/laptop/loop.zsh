#!/bin/zsh
# Round 49, step D (apply gate-ceiling-membership, dry run, check its counts, run the loop) and the record of the final demand.
# A watcher copies the fit reports and the gate prior dumps after every build, since later builds overwrite them.
cd "$(git rev-parse --show-toplevel)" || exit 1
EV=openspec/changes/calibration-round-49/evidence; T=target/r49; JOBS=12; R=openspec/changes/calibration-round-49
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
log() { echo "$(now) $*" | tee -a $T/chain.log; }
snap() {
  local id=$1 d=$T/snap/$1
  mkdir -p $d && cp data/demand/rockridge.fit*.md $d/ 2>/dev/null; cp $T/gate-prior.*.json $d/ 2>/dev/null
  echo "$(now) snapshot $id" >> $T/snap.log
}
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
log "D: start"
git checkout data/demand
git status --short > $T/status-D-pre.txt; log "D: status before apply: $(tr '\n' ';' < $T/status-D-pre.txt)"
python3 $R/apply-candidate.py gate-ceiling-membership | tee -a $T/chain.log || { log "D: apply FAILED"; exit 1; }
log "D: $(git diff --stat data/demand/rockridge.config.json | tail -1)"
git diff data/demand/rockridge.config.json > $T/config.diff
log "D: blocks added: $(grep -cE '^\+ *"(gatePriorTotals|simulatedMembership)": \{' $T/config.diff)"
shasum -a 256 data/demand/rockridge.config.json | cut -c1-16 > $T/config-hash.txt; log "D: config sha256 $(cat $T/config-hash.txt)"
npx tsx tools/membership-loop.ts --dry-run > $EV/dry-run.txt 2>&1; RC=$?; log "D: dry run exit=$RC"
grep -E 'withholds|selected' $EV/dry-run.txt | tee -a $T/chain.log
MISS=""
for want in 'the frozen split withholds 91 from the training view' 'shipped pm_peak: 337 selected (245 link, 92 movement or route), 6 stay static' 'shipped am_peak: 272 selected (200 link, 72 movement or route), 6 stay static' 'training pm_peak: 256 selected (187 link, 69 movement or route), 0 stay static, 87 withheld' 'training am_peak: 201 selected (148 link, 53 movement or route), 0 stay static, 77 withheld'; do
  grep -qF "$want" $EV/dry-run.txt || MISS="$MISS [$want]"
done
if [ $RC != 0 ] || [ -n "$MISS" ]; then log "D: dry run differs from the expected counts, stop:$MISS"; echo "stop at D:$MISS" >> $T/decisions.txt; git checkout data/demand; exit 1; fi
if [ -e target/membership-loop ] || [ -e target/membership ]; then log "D: target/membership-loop or target/membership exists from an earlier loop, stop"; echo "stop at D: stale loop files" >> $T/decisions.txt; exit 1; fi
log "D: loop"
watch_builds & WPID=$!
S=$(date +%s); GATE_PRIOR_DUMP=$T/gate-prior.json npx tsx tools/membership-loop.ts --jobs $JOBS --report $EV/membership-loop.md > $T/loop.log 2>&1; RC=$?
sleep 25; kill $WPID 2>/dev/null
log "D: loop exit=$RC wall_s=$(( $(date +%s) - S ))"
cp $T/loop.log $EV/loop.txt
grep -E 'gate prior ceilings|offered|ratio|zero-hit|stop' $T/loop.log | tee -a $T/chain.log > /dev/null
if [ $RC != 0 ]; then
  log "D: loop stopped with exit $RC (abort or failure), stop and send the loop log, the build log and the fit report"
  tail -30 $T/loop.log | tee -a $T/chain.log
  mkdir -p $EV/abort && cp data/demand/rockridge.fit*.md $EV/abort/ 2>/dev/null
  for f in target/membership-loop/logs/*-build.log; do tail -n 60 "$f" > $EV/abort/$(basename "$f" .log).txt; done
  cp $T/gate-prior.*.json $EV/abort/ 2>/dev/null
  cp target/membership-loop/state.json $EV/abort/ 2>/dev/null
  echo "stop at D: loop exit $RC" >> $T/decisions.txt
  exit 2
fi
sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json target/membership/*.json | cut -c1-16,65- | tee $EV/candidate-hashes.txt
log "D: hashes $(tr '\n' ';' < $EV/candidate-hashes.txt)"
cmp -s $T/network.base.json public/data/rockridge.network.json && log "D: network identical" || { log "D: network differs, stop"; echo "stop at D: network" >> $T/decisions.txt; exit 1; }
cmp -s $T/stations.base.json data/demand/rockridge.stations.json && log "D: stations file identical" || log "D: stations file DIFFERS"
mkdir -p $EV/fit && cp data/demand/rockridge.fit*.md data/demand/rockridge.stations.json $EV/fit/
cp target/membership-loop/state.json $EV/
mkdir -p $EV/gate-prior && cp $T/gate-prior.*.json $EV/gate-prior/ 2>/dev/null
cp public/data/rockridge.demand.json $T/demand.cand.json
cp target/validation/rockridge.demand.json $T/demand.cand.cv.json
mkdir -p $T/fit-cand && cp data/demand/rockridge.fit*.md $T/fit-cand/
node -e "
const fs=require('fs'), f=(p)=>JSON.parse(fs.readFileSync(p));
const pairs=[['target/membership-loop/iter0/shipped/demand.json','$T/demand.base.json'],['target/membership-loop/iter0/training/demand.json','$T/demand.base.cv.json']];
for (const [a,b] of pairs) console.log(a, fs.existsSync(a) ? 'periods equal to '+b+': '+(JSON.stringify(f(a).periods)===JSON.stringify(f(b).periods)) : 'missing');
" > $T/pass0-check.txt 2>&1; log "D: pass 0 check: $(tr '\n' ';' < $T/pass0-check.txt)"
ls -R target/membership-loop | head -40 > $T/loop-files.txt
log "D done"
