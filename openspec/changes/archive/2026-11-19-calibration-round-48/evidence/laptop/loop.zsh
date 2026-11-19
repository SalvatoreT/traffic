#!/bin/zsh
# Round 48, steps D (apply the candidate, dry run, check its counts) and E (the loop, then the record of the final demand).
cd "$(git rev-parse --show-toplevel)" || exit 1
EV=openspec/changes/calibration-round-48/evidence; T=target/r48; JOBS=12; R=openspec/changes/calibration-round-48
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
log() { echo "$(now) $*" | tee -a $T/chain.log; }
log "D: start"
git checkout data/demand
git status --short > $T/status-D-pre.txt; log "D: status before apply: $(tr '\n' ';' < $T/status-D-pre.txt)"
python3 $R/apply-candidate.py simulated-membership | tee -a $T/chain.log || { log "D: apply FAILED"; exit 1; }
log "D: $(git diff --stat data/demand/rockridge.config.json | tail -1)"
shasum -a 256 data/demand/rockridge.config.json | cut -c1-16 > $T/config-hash.txt; log "D: config sha256 $(cat $T/config-hash.txt)"
npx tsx tools/membership-loop.ts --dry-run > $EV/dry-run.txt 2>&1; RC=$?; log "D: dry run exit=$RC"
grep -E 'withholds|selected' $EV/dry-run.txt | tee -a $T/chain.log
MISS=""
for want in 'the frozen split withholds 91 from the training view' 'shipped pm_peak: 337 selected (245 link, 92 movement or route), 6 stay static' 'shipped am_peak: 272 selected (200 link, 72 movement or route), 6 stay static' 'training pm_peak: 256 selected (187 link, 69 movement or route), 0 stay static, 87 withheld' 'training am_peak: 201 selected (148 link, 53 movement or route), 0 stay static, 77 withheld'; do
  grep -qF "$want" $EV/dry-run.txt || MISS="$MISS [$want]"
done
if [ $RC != 0 ] || [ -n "$MISS" ]; then log "D: dry run differs from the container's, stop:$MISS"; echo "stop at D:$MISS" >> $T/decisions.txt; git checkout data/demand; exit 1; fi
log "E: loop"
S=$(date +%s); npx tsx tools/membership-loop.ts --jobs $JOBS --report $EV/membership-loop.md > $T/loop.log 2>&1; RC=$?
log "E: loop exit=$RC wall_s=$(( $(date +%s) - S ))"
cp $T/loop.log $EV/loop.txt
if [ $RC != 0 ]; then log "E: loop failed, stop (see loop.log tail)"; tail -30 $T/loop.log | tee -a $T/chain.log; echo "stop at E: loop exit $RC" >> $T/decisions.txt; exit 1; fi
sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json target/membership/*.json | cut -c1-16,65- | tee $EV/candidate-hashes.txt
log "E: hashes $(tr '\n' ';' < $EV/candidate-hashes.txt)"
cmp -s $T/network.base.json public/data/rockridge.network.json && log "E: network identical" || { log "E: network differs, stop"; echo "stop at E: network" >> $T/decisions.txt; exit 1; }
mkdir -p $EV/fit && cp data/demand/rockridge.fit*.md data/demand/rockridge.stations.json $EV/fit/
cp target/membership-loop/state.json $EV/
node -e "
const fs=require('fs'), f=(p)=>JSON.parse(fs.readFileSync(p));
const pairs=[['target/membership-loop/iter0/shipped/demand.json','$T/demand.base.json'],['target/membership-loop/iter0/training/demand.json','$T/demand.base.cv.json']];
for (const [a,b] of pairs) console.log(a, fs.existsSync(a) ? 'periods equal to '+b+': '+(JSON.stringify(f(a).periods)===JSON.stringify(f(b).periods)) : 'missing');
" > $T/pass0-check.txt 2>&1; log "E: pass 0 check: $(tr '\n' ';' < $T/pass0-check.txt)"
ls -R target/membership-loop | head -40 > $T/loop-files.txt
log "DE done"
