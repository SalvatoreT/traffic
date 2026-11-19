#!/bin/zsh
# Round 50, steps E (screen of the final demand, with the backlog rule) and F (validation and ten seeds, if the screen passes).
cd "$(git rev-parse --show-toplevel)" || exit 1
EV=openspec/changes/calibration-round-50/evidence; T=target/r50; JOBS=12
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
log() { echo "$(now) $*" | tee -a $T/chain.log; }
log "E: screen"
S=$(date +%s); npm run assess -- --seeds 1-3 --periods am_peak,pm_peak --suffix r50-screen --diagnostic --jobs $JOBS > $T/screen-r50.log 2>&1; RC=$?
log "E: screen exit=$RC wall_s=$(( $(date +%s) - S ))"
MD=data/calibration/rockridge.assessment-r50-screen.md
node $T/screen.cjs $MD > $T/screen-r50.json; log "E: $(cat $T/screen-r50.json)"
node -e "
const fs=require('fs'), b=JSON.parse(fs.readFileSync('$T/screen-base.json')), c=JSON.parse(fs.readFileSync('$T/screen-r50.json'));
const fails=[];
for (const p of ['pm_peak','am_peak']) for (const k of ['fitted','held']) { if (!c.counts[p]) { fails.push(p+' missing'); continue; } const d=c.counts[p][k]-b.counts[p][k]; if (d < -3) fails.push(p+' '+k+' '+c.counts[p][k]+' vs '+b.counts[p][k]); }
for (const p of ['pm_peak','am_peak']) { const g=c.gridlock[p]; if (!g || g.scope!=='judged zone' || g.max>0) fails.push(p+' gridlock '+JSON.stringify(g)); }
for (const p of ['pm_peak','am_peak']) {
  let bl=c.backlog[p];
  if (!bl) {
    const dir='target/assess-seeds/60r50-screen', v=[];
    for (const f of fs.existsSync(dir)?fs.readdirSync(dir):[]) if (f.startsWith('rockridge-'+p+'-') && f.endsWith('.json')) v.push(JSON.parse(fs.readFileSync(dir+'/'+f)).health.backlogPct);
    bl={k:v.filter(x=>x<2).length,n:v.length,mean:v.reduce((a,x)=>a+x,0)/(v.length||1),max:Math.max(...v),from:'seed files'};
    console.error(p+' backlog line missing, from seed files: '+JSON.stringify(bl));
  }
  if (!(bl.n===3 && bl.k===3)) fails.push(p+' backlog under 2% in '+bl.k+' of '+bl.n+' seeds (mean '+bl.mean+'%, max '+bl.max+'%)');
}
console.log(fails.length ? 'FAIL '+fails.join('; ') : 'PASS');
" > $T/decision-r50.txt 2>> $T/chain.log
DEC=$(cat $T/decision-r50.txt); log "E: screen decision: $DEC"; echo "screen $DEC" >> $T/decisions.txt
cp $MD $T/screen-r50.json $T/decision-r50.txt $EV/ && cp $T/screen-r50.log $EV/screen-r50.txt && rm -f $MD
if [[ $DEC == PASS ]]; then
  log "F: validate"
  ./target/release/validate > $T/validate-r50.log 2>&1; log "F: validate exit=$? $(tail -4 $T/validate-r50.log | tr '\n' ' ')"
  git status --short data/calibration > $T/status-val.txt; log "F: changed after validate: $(tr '\n' ';' < $T/status-val.txt)"
  git checkout data/calibration/validation.json data/calibration/validation.md
  S=$(date +%s); npm run assess -- --suffix r50 --noise --jobs $JOBS > $T/assess-r50.log 2>&1; RC=$?
  log "F: assess exit=$RC wall_s=$(( $(date +%s) - S ))"
  cp $T/assess-r50.log $EV/assess-r50.txt; cp $T/validate-r50.log $EV/validate-r50.txt
  for f in data/calibration/rockridge.assessment-r50.md; do [ -f $f ] && cp $f $EV/ && rm -f $f; done
fi
log "EF done"
