#!/bin/zsh
# Round 52, steps E (screen of the final demand, with the backlog rule) and F (validation and ten seeds, if the screen passes).
cd "$(git rev-parse --show-toplevel)" || exit 1
EV=openspec/changes/calibration-round-52/evidence; T=target/r52; JOBS=12
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
log() { echo "$(now) $*" | tee -a $T/chain.log; }
log "E: screen"
S=$(date +%s); npm run assess -- --seeds 1-3 --periods am_peak,pm_peak --suffix r52-screen --diagnostic --jobs $JOBS > $T/screen-r52.log 2>&1; RC=$?
log "E: screen exit=$RC wall_s=$(( $(date +%s) - S ))"
MD=data/calibration/rockridge.assessment-r52-screen.md
node $T/screen.cjs $MD > $T/screen-r52.json; log "E: $(cat $T/screen-r52.json)"
node -e "
const fs=require('fs'), b=JSON.parse(fs.readFileSync('$T/screen-base.json')), c=JSON.parse(fs.readFileSync('$T/screen-r52.json'));
const fails=[];
for (const p of ['pm_peak','am_peak']) for (const k of ['fitted','held']) { if (!c.counts[p]) { fails.push(p+' missing'); continue; } const d=c.counts[p][k]-b.counts[p][k]; if (d < -3) fails.push(p+' '+k+' '+c.counts[p][k]+' vs '+b.counts[p][k]); }
for (const p of ['pm_peak','am_peak']) { const g=c.gridlock[p]; if (!g || g.scope!=='judged zone' || g.max>0) fails.push(p+' gridlock '+JSON.stringify(g)); }
for (const p of ['pm_peak','am_peak']) {
  let bl=c.backlog[p];
  if (!bl) {
    const dir='target/assess-seeds/60r52-screen', v=[];
    for (const f of fs.existsSync(dir)?fs.readdirSync(dir):[]) if (f.startsWith('rockridge-'+p+'-') && f.endsWith('.json')) v.push(JSON.parse(fs.readFileSync(dir+'/'+f)).health.backlogPct);
    bl={k:v.filter(x=>x<2).length,n:v.length,mean:v.reduce((a,x)=>a+x,0)/(v.length||1),max:Math.max(...v),from:'seed files'};
    console.error(p+' backlog line missing, from seed files: '+JSON.stringify(bl));
  }
  if (!(bl.n===3 && bl.k===3)) fails.push(p+' backlog under 2% in '+bl.k+' of '+bl.n+' seeds (mean '+bl.mean+'%, max '+bl.max+'%)');
}
console.log(fails.length ? 'FAIL '+fails.join('; ') : 'PASS');
" > $T/decision-r52.txt 2>> $T/chain.log
DEC=$(cat $T/decision-r52.txt); log "E: screen decision: $DEC"; echo "screen $DEC" >> $T/decisions.txt
cp $MD $T/screen-r52.json $T/decision-r52.txt $EV/ && cp $T/screen-r52.log $EV/screen-r52.txt && rm -f $MD
if [[ $DEC == PASS ]]; then
  log "F: validate"
  ./target/release/validate > $T/validate-r52.log 2>&1; log "F: validate exit=$? $(tail -4 $T/validate-r52.log | tr '\n' ' ')"
  git status --short data/calibration > $T/status-val.txt; log "F: changed after validate: $(tr '\n' ';' < $T/status-val.txt)"
  git checkout data/calibration/validation.json data/calibration/validation.md 2>/dev/null; log "F: validation $(grep -E 'cases pass' $T/validate-r52.log)"
  S=$(date +%s); npm run assess -- --suffix r52 --noise --jobs $JOBS > $T/assess-r52.log 2>&1; RC=$?
  log "F: assess exit=$RC wall_s=$(( $(date +%s) - S ))"
  cp $T/assess-r52.log $EV/assess-r52.txt; cp $T/validate-r52.log $EV/validate-r52.txt
  for f in data/calibration/rockridge.assessment-r52.md; do [ -f $f ] && cp $f $EV/ && rm -f $f; done
  node $T/keep.cjs $EV/rockridge.assessment-r52.md $T/validate-r52.log > $EV/keep-rule.md 2>&1; log "F: $(tail -1 $EV/keep-rule.md)"
  tail -1 $EV/keep-rule.md > $T/keep-decision.txt
  for q in pm_peak am_peak; do node openspec/changes/calibration-round-52/scripts/route-lines.cjs $q sim=baseline=target/assess-seeds/60r47-base sim=candidate=target/assess-seeds/60r52 > $EV/route-sim-$q.md 2> $T/route-sim-$q.err; log "F: route-sim $q exit=$?"; done
  node openspec/changes/archive/2026-11-19-calibration-round-50/scripts/shares.cjs pm_peak baseline=target/assess-seeds/60r47-base candidate=target/assess-seeds/60r52 'baseline cv=target/assess-seeds/60r47-base-cv' 'candidate cv=target/assess-seeds/60r52-cv' > $EV/shares-pm.md 2> $T/shares.err; log "F: shares exit=$?"
else
  echo "KEEP NOT RUN (screen failed)" > $T/keep-decision.txt
fi
log "EF done"
