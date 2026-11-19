#!/bin/zsh
# Round 48, steps F (screen of the final demand) and G (validation and ten seeds, if the screen passes).
cd "$(git rev-parse --show-toplevel)" || exit 1
EV=openspec/changes/calibration-round-48/evidence; T=target/r48; JOBS=12
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
log() { echo "$(now) $*" | tee -a $T/chain.log; }
log "F: screen"
S=$(date +%s); npm run assess -- --seeds 1-3 --periods am_peak,pm_peak --suffix r48-screen --diagnostic --jobs $JOBS > $T/screen-r48.log 2>&1; RC=$?
log "F: screen exit=$RC wall_s=$(( $(date +%s) - S ))"
MD=data/calibration/rockridge.assessment-r48-screen.md
node $T/screen.cjs $MD > $T/screen-r48.json; log "F: $(cat $T/screen-r48.json)"
node -e "
const b=JSON.parse(require('fs').readFileSync('$T/screen-base.json')), c=JSON.parse(require('fs').readFileSync('$T/screen-r48.json'));
const fails=[];
for (const p of ['pm_peak','am_peak']) for (const k of ['fitted','held']) { if (!c.counts[p]) { fails.push(p+' missing'); continue; } const d=c.counts[p][k]-b.counts[p][k]; if (d < -3) fails.push(p+' '+k+' '+c.counts[p][k]+' vs '+b.counts[p][k]); }
for (const p of ['pm_peak','am_peak']) { const g=c.gridlock[p]; if (!g || g.scope!=='judged zone' || g.max>0) fails.push(p+' gridlock '+JSON.stringify(g)); }
console.log(fails.length ? 'FAIL '+fails.join('; ') : 'PASS');
" > $T/decision-r48.txt
DEC=$(cat $T/decision-r48.txt); log "F: screen decision: $DEC"; echo "screen $DEC" >> $T/decisions.txt
cp $MD $T/screen-r48.json $T/decision-r48.txt $EV/ && cp $T/screen-r48.log $EV/screen-r48.txt && rm -f $MD
if [[ $DEC == PASS ]]; then
  log "G: validate"
  ./target/release/validate > $T/validate-r48.log 2>&1; log "G: validate exit=$? $(tail -4 $T/validate-r48.log | tr '\n' ' ')"
  git status --short data/calibration > $T/status-val.txt; log "G: changed after validate: $(tr '\n' ';' < $T/status-val.txt)"
  git checkout data/calibration/validation.json data/calibration/validation.md
  S=$(date +%s); npm run assess -- --suffix r48 --noise --jobs $JOBS > $T/assess-r48.log 2>&1; RC=$?
  log "G: assess exit=$RC wall_s=$(( $(date +%s) - S ))"
  cp $T/assess-r48.log $EV/assess-r48.txt; cp $T/validate-r48.log $EV/validate-r48.txt
  for f in data/calibration/rockridge.assessment-r48.md; do [ -f $f ] && cp $f $EV/ && rm -f $f; done
fi
log "FG done"
