#!/bin/zsh
# Round 46, steps D, E and (if the screen passes) F for one candidate: ./target/r46/cand.zsh ramp-k-counted
cd "$(git rev-parse --show-toplevel)" || exit 1
C=$1; EV=openspec/changes/calibration-round-46/evidence; T=target/r46; JOBS=12
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
log() { echo "$(now) $C $*" | tee -a $T/chain.log; }
stop() { log "D: STOP: $*"; echo "$C stop: $*" >> $T/decisions.txt; git checkout data/demand; exit 0; }
case $C in
  ramp-k-counted) EXP="53c823f20d9165ed 8a28540b43bc3a75 650b9f0e12d6f563 "; KT='ramp K (round 46, training view): 0.09 (fallback): 2 usable counted ramps, fewer than the 3 required';;
  ramp-k-counted-min2) EXP="53c823f20d9165ed 583834696da85cfd 514c17c9f88af777 "; KT='ramp K (round 46, training view): 0.0809 from 2 counted ramps';;
  *) log "unknown candidate"; exit 1;;
esac
KS='ramp K (round 46, shipped view): 0.0734 from 5 counted ramps'
log "D: start"
git checkout data/demand
git status --short > $T/status-$C-pre.txt; log "D: status before apply: $(tr '\n' ';' < $T/status-$C-pre.txt)"
python3 openspec/changes/calibration-round-46/apply-candidate.py $C | tee -a $T/chain.log || { log "D: apply FAILED"; exit 1; }
log "D: $(git diff --stat data/demand/rockridge.config.json | tail -1)"
S=$(date +%s); npm run data > $T/data-$C.log 2>&1; RC=$?; log "D: npm run data exit=$RC wall_s=$(( $(date +%s) - S ))"
[ $RC = 0 ] || { git checkout data/demand; exit 1; }
grep "ramp K" $T/data-$C.log > $T/ramp-k-$C.txt; log "D: K lines: $(grep 'ramp K (' $T/ramp-k-$C.txt | tr '\n' ';')"
sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json | cut -c1-16 | tee $EV/$C-hashes.txt
H=$(tr '\n' ' ' < $EV/$C-hashes.txt); log "D: hashes $H"
node openspec/changes/calibration-round-46/targets-changed.mjs $T/stations.base.json data/demand/rockridge.stations.json > $EV/$C-targets-changed.txt
log "D: targets: $(head -1 $EV/$C-targets-changed.txt); $(tail -1 $EV/$C-targets-changed.txt)"
cmp -s $T/network.base.json public/data/rockridge.network.json && log "D: network identical" || stop "network differs from the baseline"
grep -qF "$KS" $T/ramp-k-$C.txt || stop "shipped K line differs from the container's"
grep -qF "$KT" $T/ramp-k-$C.txt || stop "training K line differs from the container's"
node -e "
const f=(p)=>JSON.parse(require('fs').readFileSync(p));
const A=f('$T/demand.base.cv.json'),B=f('target/validation/rockridge.demand.json'); console.log('cross-validation demand periods identical to the baseline:',JSON.stringify(A.periods)===JSON.stringify(B.periods));
" > $T/dem-$C.txt; log "D: $(cat $T/dem-$C.txt)"
mkdir -p $EV/$C && cp data/demand/rockridge.fit*.md data/demand/rockridge.stations.json $EV/$C/ && cp $T/ramp-k-$C.txt $T/dem-$C.txt $EV/$C/
cp data/demand/rockridge.stations.json $T/stations-$C.json
[ "$H" = "$EXP" ] || stop "hashes $H differ from the container's $EXP"
log "E: screen"
S=$(date +%s); npm run assess -- --seeds 1-3 --periods am_peak,pm_peak --suffix r46-$C-screen --diagnostic --jobs $JOBS > $T/screen-$C.log 2>&1; RC=$?
log "E: assess exit=$RC wall_s=$(( $(date +%s) - S ))"
MD=data/calibration/rockridge.assessment-r46-$C-screen.md
node $T/screen.cjs $MD > $T/screen-$C.json; log "E: $(cat $T/screen-$C.json)"
node -e "
const b=JSON.parse(require('fs').readFileSync('$T/screen-base.json')), c=JSON.parse(require('fs').readFileSync('$T/screen-$C.json'));
const fails=[];
for (const p of ['pm_peak','am_peak']) for (const k of ['fitted','held']) { if (!c.counts[p]) { fails.push(p+' missing'); continue; } const d=c.counts[p][k]-b.counts[p][k]; if (d < -3) fails.push(p+' '+k+' '+c.counts[p][k]+' vs '+b.counts[p][k]); }
for (const p of ['pm_peak','am_peak']) { const g=c.gridlock[p]; if (!g || g.scope!=='judged zone' || g.max>0) fails.push(p+' gridlock '+JSON.stringify(g)); }
console.log(fails.length ? 'FAIL '+fails.join('; ') : 'PASS');
" > $T/decision-$C.txt
DEC=$(cat $T/decision-$C.txt); log "E: screen decision: $DEC"
cp $T/screen-$C.log $T/data-$C.log $T/screen-$C.json $T/decision-$C.txt $EV/$C/; cp $MD $EV/$C/ && rm -f $MD
if [[ $DEC == PASS ]]; then
  echo "$C screen PASS" >> $T/decisions.txt
  log "F: validate"
  ./target/release/validate > $T/validate-$C.log 2>&1; log "F: validate exit=$? $(tail -4 $T/validate-$C.log | tr '\n' ' ')"
  git status --short data/calibration > $T/status-$C-val.txt; log "F: changed after validate: $(tr '\n' ';' < $T/status-$C-val.txt)"
  git checkout data/calibration/validation.json data/calibration/validation.md
  S=$(date +%s); npm run assess -- --suffix r46-$C --noise --jobs $JOBS > $T/assess-$C.log 2>&1; RC=$?
  log "F: assess exit=$RC wall_s=$(( $(date +%s) - S ))"
  cp $T/assess-$C.log $T/validate-$C.log $EV/$C/
  for f in data/calibration/rockridge.assessment-r46-$C.md; do [ -f $f ] && cp $f $EV/$C/ && rm -f $f; done
else
  echo "$C screen $DEC" >> $T/decisions.txt
fi
git checkout data/demand
log "done; status: $(git status --short | tr '\n' ';')"
