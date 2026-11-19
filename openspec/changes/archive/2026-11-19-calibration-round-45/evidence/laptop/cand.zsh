#!/bin/zsh
# Round 45, steps D, E and (if the screen passes) F for one candidate: ./target/r45/cand.zsh forest-25
cd "$(git rev-parse --show-toplevel)" || exit 1
C=$1; EV=openspec/changes/calibration-round-45/evidence; T=target/r45; JOBS=12
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
log() { echo "$(now) $C $*" | tee -a $T/chain.log; }
log "D: start"
git checkout data/areas/rockridge.json data/demand
git status --short > $T/status-$C-pre.txt; log "D: status before apply: $(tr '\n' ';' < $T/status-$C-pre.txt)"
python3 openspec/changes/calibration-round-45/apply-candidate.py $C | tee -a $T/chain.log || { log "D: apply FAILED"; exit 1; }
log "D: $(git diff --stat data/areas/rockridge.json | tail -1)"
S=$(date +%s); npm run data > $T/data-$C.log 2>&1; RC=$?; log "D: npm run data exit=$RC wall_s=$(( $(date +%s) - S ))"
[ $RC = 0 ] || exit 1
sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json | cut -c1-16 | tee $EV/$C-hashes.txt
log "D: hashes $(tr '\n' ' ' < $EV/$C-hashes.txt)"
python3 - > $T/net-$C.txt <<'E'
import json
a = json.load(open('target/r45/network.base.json')); b = json.load(open('public/data/rockridge.network.json'))
print('links identical:', a['links'] == b['links'], '| nodes that differ:', [x['id'] for x, y in zip(a['nodes'], b['nodes']) if x != y], '| node count', len(a['nodes']), len(b['nodes']))
E
log "D: $(cat $T/net-$C.txt)"
node -e "
const f=(p)=>JSON.parse(require('fs').readFileSync(p));
for (const [x,y] of [['target/r45/demand.base.json','public/data/rockridge.demand.json'],['target/r45/demand.base.cv.json','target/validation/rockridge.demand.json']]) {
  const A=f(x),B=f(y); console.log(y,'periods identical:',JSON.stringify(A.periods)===JSON.stringify(B.periods));
}" > $T/dem-$C.txt
log "D: $(tr '\n' ' ' < $T/dem-$C.txt)"
mkdir -p $EV/$C && cp data/demand/rockridge.fit*.md $EV/$C/
if grep -q 'periods identical: false' $T/dem-$C.txt; then log "D: demand flows differ from the baseline (D6), stop this candidate"; echo "$C stop D6" >> $T/decisions.txt; git checkout data/areas/rockridge.json data/demand; exit 0; fi
log "E: screen"
S=$(date +%s); npm run assess -- --seeds 1-3 --periods am_peak,pm_peak --suffix r45-$C-screen --diagnostic --jobs $JOBS > $T/screen-$C.log 2>&1; RC=$?
log "E: assess exit=$RC wall_s=$(( $(date +%s) - S ))"
MD=data/calibration/rockridge.assessment-r45-$C-screen.md
{ grep -rn -i 'cannot hold' $T/data-$C.log $T/screen-$C.log $MD target/assess-seeds/60r45-$C-screen target/assess-seeds/60r45-$C-screen-cv; grep -rn -i 'Forest Street' $T/data-$C.log $T/screen-$C.log $MD target/assess-seeds/60r45-$C-screen target/assess-seeds/60r45-$C-screen-cv | grep -i 'issue'; } 2>/dev/null | cut -c1-400 > $T/plan-$C.txt
log "E: plan-issue lines naming Forest Street: $(wc -l < $T/plan-$C.txt | tr -d ' ')"
node $T/screen.cjs $MD > $T/screen-$C.json; log "E: $(cat $T/screen-$C.json)"
node -e "
const b=JSON.parse(require('fs').readFileSync('$T/screen-base.json')), c=JSON.parse(require('fs').readFileSync('$T/screen-$C.json'));
const fails=[];
for (const p of ['pm_peak','am_peak']) for (const k of ['fitted','held']) { const d=c.counts[p][k]-b.counts[p][k]; if (d < -3) fails.push(p+' '+k+' '+c.counts[p][k]+' vs '+b.counts[p][k]); }
for (const p of ['pm_peak','am_peak']) { const g=c.gridlock[p]; if (!g || g.scope!=='judged zone' || g.max>0) fails.push(p+' gridlock '+JSON.stringify(g)); }
console.log(fails.length ? 'FAIL '+fails.join('; ') : 'PASS');
" > $T/decision-$C.txt
DEC=$(cat $T/decision-$C.txt); log "E: screen decision: $DEC"
if [ -s $T/plan-$C.txt ]; then log "E: plan issue at the junction, stop this candidate"; echo "$C stop plan-issue" >> $T/decisions.txt; DEC=STOP; fi
cp $T/screen-$C.log $T/data-$C.log $EV/$C/; cp $MD $EV/$C/ && rm -f $MD
if [[ $DEC == PASS ]]; then
  echo "$C screen PASS" >> $T/decisions.txt
  log "F: validate"
  ./target/release/validate > $T/validate-$C.log 2>&1; log "F: validate exit=$? $(tail -4 $T/validate-$C.log | tr '\n' ' ')"
  git status --short data/calibration > $T/status-$C-val.txt; log "F: changed after validate: $(tr '\n' ';' < $T/status-$C-val.txt)"
  git checkout data/calibration/validation.json data/calibration/validation.md
  S=$(date +%s); npm run assess -- --suffix r45-$C --noise --jobs $JOBS > $T/assess-$C.log 2>&1; RC=$?
  log "F: assess exit=$RC wall_s=$(( $(date +%s) - S ))"
  cp $T/assess-$C.log $T/validate-$C.log $EV/$C/
  for f in data/calibration/rockridge.assessment-r45-$C.md; do [ -f $f ] && cp $f $EV/$C/ && rm -f $f; done
else
  [[ $DEC == STOP ]] || echo "$C screen $DEC" >> $T/decisions.txt
fi
git checkout data/areas/rockridge.json data/demand
log "done; status: $(git status --short | tr '\n' ';')"
