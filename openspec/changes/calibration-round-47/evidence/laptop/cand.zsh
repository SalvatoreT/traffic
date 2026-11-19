#!/bin/zsh
# Round 47, steps D, E and (if the screen passes) F for the candidate caldecott-pair-sum.
cd "$(git rev-parse --show-toplevel)" || exit 1
C=caldecott-pair-sum; EV=openspec/changes/calibration-round-47/evidence; T=target/r47; JOBS=12; R=openspec/changes/calibration-round-47
M="ramp on 1695 + ramp on 1711"
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
log() { echo "$(now) $C $*" | tee -a $T/chain.log; }
stop() { log "STOP: $*"; echo "$C stop: $*" >> $T/decisions.txt; git checkout data/demand; exit 0; }
log "D: start"
git checkout data/demand
git status --short > $T/status-$C-pre.txt; log "D: status before apply: $(tr '\n' ';' < $T/status-$C-pre.txt)"
python3 $R/apply-candidate.py $C | tee -a $T/chain.log || { log "D: apply FAILED"; exit 1; }
log "D: $(git diff --stat data/demand/rockridge.config.json | tail -1)"
S=$(date +%s); npm run data > $T/data-$C.log 2>&1; RC=$?; log "D: npm run data exit=$RC wall_s=$(( $(date +%s) - S ))"
[ $RC = 0 ] || { git checkout data/demand; exit 1; }
grep "link group" $T/data-$C.log > $T/link-group-$C.txt; log "D: link group lines: $(wc -l < $T/link-group-$C.txt | tr -d ' ')"
sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json | cut -c1-16 | tee $EV/$C-hashes.txt
H=$(tr '\n' ' ' < $EV/$C-hashes.txt); log "D: hashes $H"
node $R/targets-changed.mjs $T/stations.base.json data/demand/rockridge.stations.json > $EV/$C-targets-changed.txt
log "D: targets: $(head -1 $EV/$C-targets-changed.txt); $(tail -1 $EV/$C-targets-changed.txt)"
node $R/denominators.mjs data/demand/rockridge.stations.json > $EV/$C-denominators.txt; log "D: denominators $(tail -2 $EV/$C-denominators.txt | tr -s ' ' | tr '\n' ';')"
mkdir -p $EV/$C && cp data/demand/rockridge.fit*.md data/demand/rockridge.stations.json $T/link-group-$C.txt $EV/$C/
cp data/demand/rockridge.stations.json $T/stations.cand.json
cmp -s $T/network.base.json public/data/rockridge.network.json && log "D: network identical" || stop "network differs from the baseline"
git diff --quiet data/demand/rockridge.split.json && log "D: split unchanged" || stop "split file changed"
[ "$(grep -cF "link group $M" $T/link-group-$C.txt)" = 2 ] || stop "expected one link-group line per view"
grep -q 'pm_peak: recent fitted 91, recent held out 24' $EV/$C-denominators.txt && grep -q 'am_peak: recent fitted 77, recent held out 19' $EV/$C-denominators.txt || stop "denominators differ from the container's"
[ "$H" = "53c823f20d9165ed a97b0d3fdd118cc8 b9464e7b65bdd542 " ] || stop "hashes $H differ from the container's"
log "E: screen"
S=$(date +%s); npm run assess -- --seeds 1-3 --periods am_peak,pm_peak --suffix r47-$C-screen --diagnostic --jobs $JOBS > $T/screen-$C.log 2>&1; RC=$?
log "E: screen exit=$RC wall_s=$(( $(date +%s) - S ))"
MD=data/calibration/rockridge.assessment-r47-$C-screen.md
node $T/screen.cjs $MD > $T/screen-$C.json; log "E: $(cat $T/screen-$C.json)"
npx tsx $R/station-table.ts --suffix r47-$C-screen --seeds 1-3 --stations $T/stations.cand.json > $EV/stations-$C-screen.md 2> $T/st-$C-screen.err; log "E: station table exit=$?"
node $T/common.cjs $EV/stations-$C-screen.md "$M" "ramp off 1695" > $T/cand-screen-members.json; log "E: members $(cat $T/cand-screen-members.json)"
node -e "
const f=(p)=>JSON.parse(require('fs').readFileSync(p));
const b=f('$T/base-screen-members.json'), c=f('$T/cand-screen-members.json'), cg=f('$T/screen-$C.json');
const pass=(o,id)=>o.stations[id]&&o.stations[id].derived==='no'&&o.stations[id].ok?1:0;
const fails=[], rows=[];
for (const p of ['pm_peak','am_peak']) {
  const bf=b[p].fitted-pass(b[p],'ramp on 1695')-pass(b[p],'ramp on 1711'), cf=c[p].fitted-pass(c[p],'$M');
  rows.push(p+' fitted common '+cf+' vs '+bf, p+' held '+c[p].held+' vs '+b[p].held);
  if (cf-bf < -3) fails.push(p+' fitted common '+cf+' vs '+bf);
  if (c[p].held-b[p].held < -3) fails.push(p+' held '+c[p].held+' vs '+b[p].held);
  const g=cg.gridlock[p]; if (!g || g.scope!=='judged zone' || g.max>0) fails.push(p+' gridlock '+JSON.stringify(g));
}
console.log((fails.length ? 'FAIL '+fails.join('; ') : 'PASS')+' | '+rows.join('; '));
" > $T/decision-$C.txt
DEC=$(cat $T/decision-$C.txt); log "E: screen decision: $DEC"
cp $T/screen-$C.log $T/data-$C.log $T/screen-$C.json $T/decision-$C.txt $EV/$C/; cp $MD $EV/$C/ && rm -f $MD
if [[ $DEC == PASS* ]]; then
  echo "$C screen PASS" >> $T/decisions.txt
  log "F: validate"
  ./target/release/validate > $T/validate-$C.log 2>&1; log "F: validate exit=$? $(tail -4 $T/validate-$C.log | tr '\n' ' ')"
  git status --short data/calibration > $T/status-$C-val.txt; log "F: changed after validate: $(tr '\n' ';' < $T/status-$C-val.txt)"
  git checkout data/calibration/validation.json data/calibration/validation.md
  S=$(date +%s); npm run assess -- --suffix r47-$C --noise --jobs $JOBS > $T/assess-$C.log 2>&1; RC=$?
  log "F: assess exit=$RC wall_s=$(( $(date +%s) - S ))"
  npx tsx $R/station-table.ts --suffix r47-$C --stations $T/stations.cand.json > $EV/stations-$C-ten.md 2> $T/st-$C-ten.err; log "F: station table exit=$?"
  node $T/common.cjs $EV/stations-$C-ten.md "$M" "ramp off 1695" > $T/cand-ten-members.json; log "F: members $(cat $T/cand-ten-members.json)"
  cp $T/assess-$C.log $T/validate-$C.log $EV/$C/
  for f in data/calibration/rockridge.assessment-r47-$C.md; do [ -f $f ] && cp $f $EV/$C/ && rm -f $f; done
else
  echo "$C screen $DEC" >> $T/decisions.txt
fi
git checkout data/demand
log "done; status: $(git status --short | tr '\n' ';')"
