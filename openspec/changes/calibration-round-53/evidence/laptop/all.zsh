#!/bin/zsh
# Round 53 chain (openspec/changes/calibration-round-53/runbook.md steps B to I; lead request of 2026-11-21): the gate, the baseline screen, the loop with the
# end-along targets and seeding, the screen, validation and ten seeds with the keep rule and the reported figures, then the fresh-seed confirmation
# (scripts/confirm.zsh, which restores) if the keep rule passes, else the restore (scripts/restore.zsh). On a loop abort or stop it stops without restoring
# (runbook D: report, do nothing else). No data:push, no /api/, no upload token, no --publish. Holds target/batches/worktree.lock (released for confirm.zsh).
# One change from the runbook text: this morning's restamp loop folder goes to target/restamp52-loop, since target/r52-loop already holds round 52's loop.
cd "$(git rev-parse --show-toplevel)" || exit 1
C=openspec/changes/calibration-round-53; EV=$C/evidence; T=target/r53; K=target/batches/worktree.lock; JOBS=12; FITS=target/membership-loop/fits
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
log() { echo "$(now) $*" | tee -a $T/chain.log; }
h() { shasum -a 256 "$1" | cut -c1-16; }
step() { local name=$1; shift; log "$name: start"; local S0=$(date +%s); "$@" > $T/$name.log 2>&1; local RC=$?; log "$name: exit=$RC wall_s=$(( $(date +%s) - S0 ))"; return $RC; }
restore() { log "I: restore (scripts/restore.zsh)"; zsh $C/scripts/restore.zsh $T/chain.log; log "I: restore exit=$?"; }
stopnr() { log "STOP: $*"; log "status: $(git status --short | tr '\n' ';')"; rm -rf $K; log "ALL DONE (stopped, not restored)"; exit 1; }
stopr() { log "STOP: $*"; restore; log "status: $(git status --short | tr '\n' ';')"; rm -rf $K; log "ALL DONE (stopped, restored)"; exit 1; }
mkdir $K 2>/dev/null || { echo "lock held: $(cat $K/owner 2>/dev/null)"; exit 1; }; echo "round 53 chain $$ $(date)" > $K/owner
log "START round 53 at $(git rev-parse --short HEAD) on $(git branch --show-current), fingerprint $(./target/release/fingerprint)"

# B. Gate
ST=$(git status --short | grep -v '^?? .agents/$' | grep -v "^?? $C/evidence/")
[ -z "$ST" ] || stopnr "tree not clean: $(echo $ST | tr '\n' ';')"
M="$(h target/membership/rockridge.membership.json) $(h target/membership/rockridge.membership-training.json)"; CH=$(h data/demand/rockridge.config.json)
log "B: config $CH; published membership $M"
[ "$CH" = 2405ff02c92b2837 ] && [ "$M" = "56e688e7e5749d23 cf32e3e0d9e6f23e" ] || stopnr "B: config or membership files are not the published ones"
step B-data npm run data || stopnr "B: npm run data failed"
sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json | cut -c1-16 > $EV/baseline-hashes.txt
H=$(tr '\n' ' ' < $EV/baseline-hashes.txt)
log "B: hashes $H; config $(h data/demand/rockridge.config.json); status under data/: $(git status --short data | tr '\n' ';')"
[ "$H" = "53c823f20d9165ed 2d16d8f8eb0950ca 1c3b1666f24156f1 " ] || stopnr "B: baseline hashes differ"
[ -z "$(git status --short data)" ] || stopnr "B: files under data/ changed"
cp public/data/rockridge.network.json $T/network.base.json
cp public/data/rockridge.demand.json $T/demand.base.json
cp target/validation/rockridge.demand.json $T/demand.base.cv.json
cp data/demand/rockridge.stations.json $T/stations.base.json
cp data/demand/rockridge.fit.md $T/fit.base.md
mv target/membership $T/membership-aside || stopnr "B: could not move target/membership aside"
if [ -d target/membership-loop ]; then
  [ -e target/restamp52-loop ] && stopr "B: target/restamp52-loop exists already"
  mv target/membership-loop target/restamp52-loop && log "B: moved the restamp's loop folder to target/restamp52-loop (target/r52-loop already holds round 52's)"
fi
log "B: published membership files moved to $T/membership-aside (copy in $T/published-membership)"

# C. Baseline screen
step screen-base npm run assess -- --seeds 1-3 --periods am_peak,pm_peak --suffix r53-base-screen --diagnostic --jobs $JOBS
MD=data/calibration/rockridge.assessment-r53-base-screen.md
[ -f $MD ] || stopr "C: no baseline screen assessment"
node $T/screen.cjs $MD > $T/screen-base.json; log "C: baseline screen $(cat $T/screen-base.json)"
cp $MD $T/screen-base.json $EV/ && cp $T/screen-base.log $EV/screen-base.log && rm -f $MD
BL=$(node -e "const c=JSON.parse(require('fs').readFileSync('$T/screen-base.json'));console.log(['pm_peak','am_peak'].every(p=>c.backlog[p]&&c.backlog[p].k===3&&c.backlog[p].n===3)?'ok':'NOT 3 of 3')")
[ "$BL" = ok ] || stopr "C: the baseline screen's backlog is not 3 of 3 in both periods: $(cat $T/screen-base.json)"

# D. The loop with the end-along targets
git checkout data/demand; log "D: status before apply: $(git status --short | tr '\n' ';')"
AP=$(python3 $C/apply-candidate.py end-along 2>&1); log "D: $AP"
[[ "$AP" == *"config hash 19b6d2c3957f4f56"* ]] || stopr "D: apply-candidate did not give config hash 19b6d2c3957f4f56"
log "D: $(git diff --stat data/demand/rockridge.config.json | tail -1)"
git diff data/demand/rockridge.config.json > $T/config.diff
npx tsx tools/membership-loop.ts --dry-run > $EV/dry-run.txt 2>&1; RC=$?; log "D: dry run exit=$RC"
grep -E 'withholds|selected' $EV/dry-run.txt | tee -a $T/chain.log
MISS=""
for want in 'the frozen split withholds 91 from the training view' 'shipped pm_peak: 337 selected (245 link, 92 movement or route), 6 stay static' 'shipped am_peak: 272 selected (200 link, 72 movement or route), 6 stay static' 'training pm_peak: 256 selected (187 link, 69 movement or route), 0 stay static, 87 withheld' 'training am_peak: 201 selected (148 link, 53 movement or route), 0 stay static, 77 withheld'; do
  grep -qF "$want" $EV/dry-run.txt || MISS="$MISS [$want]"
done
[ $RC = 0 ] && [ -z "$MISS" ] || stopr "D: dry run differs from the expected counts:$MISS"
{ [ -e target/membership-loop ] || [ -e target/membership ]; } && stopr "D: target/membership-loop or target/membership exists"
log "D: loop"
S=$(date +%s); GATE_PRIOR_DUMP=$T/node-prior.json npx tsx tools/membership-loop.ts --jobs $JOBS --report $EV/membership-loop.md > $T/loop.log 2>&1; RC=$?
log "D: loop exit=$RC wall_s=$(( $(date +%s) - S ))"
grep -E 'offered|abort|stop|WARNING|[Ee]nd along|ratio|zero-hit|ceiling' $T/loop.log | cut -c1-400 >> $T/chain.log
if [ $RC != 0 ]; then
  tail -40 $T/loop.log | tee -a $T/chain.log > /dev/null
  mkdir -p $EV/abort && cp data/demand/rockridge.fit*.md $EV/abort/ 2>/dev/null; cp target/membership-loop/state.json $EV/abort/ 2>/dev/null
  for f in target/membership-loop/logs/*-build.log; do tail -n 60 "$f" > $EV/abort/$(basename "$f" .log).txt; done
  cp $T/loop.log $EV/abort/loop.log
  stopnr "D: the loop stopped with exit $RC; runbook D: report and do nothing else (no restore, no --resume)"
fi
sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json target/membership/*.json | cut -c1-16,65- | tee $EV/candidate-hashes.txt >> $T/chain.log
cmp -s $T/network.base.json public/data/rockridge.network.json && log "D: network identical" || stopr "D: network differs"
cmp -s $T/stations.base.json data/demand/rockridge.stations.json && log "D: stations file identical" || log "D: stations file DIFFERS"
mkdir -p $EV/fit && cp data/demand/rockridge.fit*.md data/demand/rockridge.stations.json $EV/fit/
cp target/membership-loop/state.json $EV/
mkdir -p $T/fit-cand $T/cand-membership && cp data/demand/rockridge.fit*.md $T/fit-cand/
cp target/membership/*.json $T/cand-membership/
cp public/data/rockridge.demand.json $T/demand.cand.json
cp target/validation/rockridge.demand.json $T/demand.cand.cv.json
h data/demand/rockridge.config.json > $T/cand-config.sha
sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json target/membership/rockridge.membership.json target/membership/rockridge.membership-training.json | cut -c1-16 > $T/cand-hashes.txt
log "D: cand-config $(cat $T/cand-config.sha); cand-hashes $(tr '\n' ' ' < $T/cand-hashes.txt)"
node -e "
const fs=require('fs'), f=(p)=>JSON.parse(fs.readFileSync(p));
for (const [a,b] of [['target/membership-loop/iter0/shipped/demand.json','$T/demand.base.json'],['target/membership-loop/iter0/training/demand.json','$T/demand.base.cv.json'],['target/validation/rockridge.demand.json','$T/demand.base.cv.json']])
  console.log(a, fs.existsSync(a) ? 'periods equal to '+b+': '+(JSON.stringify(f(a).periods)===JSON.stringify(f(b).periods)) : 'missing');
" > $T/pass0-check.txt 2>&1; log "D: periods checks: $(tr '\n' ';' < $T/pass0-check.txt)"
cp $T/pass0-check.txt $EV/
for q in pm_peak am_peak; do
  EA=(); RF=()
  for st in i0 i1 i2 final; do lab=$([ $st = final ] && echo final || echo pass${st#i}); d=$FITS/$st-shipped-build
    [ -f $d/rockridge.fit.md ] && [ $st != i0 ] && EA+=($lab=$d/rockridge.fit.md)
    [ -f $d/rockridge.fit.stations-$q.md ] && RF+=(fit=$lab=$d/rockridge.fit.stations-$q.md); done
  node $C/scripts/end-along-lines.cjs $q "${EA[@]}" > $EV/end-along-fit-$q.md 2> $T/end-along-fit-$q.err; log "D: end-along-fit $q exit=$? (${#EA[@]} builds)"
  node $C/scripts/route-lines.cjs $q "${RF[@]}" > $EV/route-fit-$q.md 2> $T/route-fit-$q.err; log "D: route-fit $q exit=$? (${#RF[@]} builds)"
  node $C/scripts/node-ends.cjs $q base=$T/demand.base.json static=target/membership-loop/iter0/shipped/demand.json final=public/data/rockridge.demand.json > $EV/node-ends-$q.md 2> $T/node-ends-$q.err; log "D: node-ends $q exit=$?"
  node $C/scripts/node-ends.cjs $q base=$T/demand.base.cv.json static=target/membership-loop/iter0/training/demand.json final=target/validation/rockridge.demand.json > $EV/node-ends-cv-$q.md 2> $T/node-ends-cv-$q.err; log "D: node-ends-cv $q exit=$?"
done
{ for st in i1 i2 final; do f=$FITS/$st-shipped-build/rockridge.fit.md; [ -f $f ] || continue; echo "### $st-shipped-build"; echo; sed -n '/^## End-along seeding/,/^$/p;/^End along seed/p' $f; echo; done; } > $EV/seeding.md
log "D: seeding table lines: $(grep -c '^End along seed' $EV/seeding.md); node-total lines: $(grep -c '^End along seed nodes' $EV/seeding.md)"
log "D done"

# E. Screen of the final demand
step screen-r53 npm run assess -- --seeds 1-3 --periods am_peak,pm_peak --suffix r53-screen --diagnostic --jobs $JOBS
MD=data/calibration/rockridge.assessment-r53-screen.md
[ -f $MD ] || stopr "E: no screen assessment"
node $T/screen.cjs $MD > $T/screen-r53.json; log "E: candidate screen $(cat $T/screen-r53.json)"
node $T/screen-decide.cjs $T/screen-base.json $T/screen-r53.json target/assess-seeds/60r53-screen > $T/decision-r53.txt 2>> $T/chain.log
DEC=$(cat $T/decision-r53.txt); log "E: screen decision: $DEC"
cp $MD $T/screen-r53.json $T/decision-r53.txt $EV/ && cp $T/screen-r53.log $EV/screen-r53.log && rm -f $MD
if [[ $DEC != PASS ]]; then
  echo "KEEP NOT RUN (screen failed)" > $T/keep-decision.txt
  restore; log "status: $(git status --short | tr '\n' ';')"; rm -rf $K; log "ALL DONE (screen failed, restored)"; exit 0
fi

# F. Validation and ten seeds
step validate-r53 ./target/release/validate; log "F: $(grep -E 'cases pass' $T/validate-r53.log)"
log "F: changed after validate: $(git status --short data/calibration | tr '\n' ';')"
git checkout data/calibration/validation.json data/calibration/validation.md 2>/dev/null
step assess-r53 npm run assess -- --suffix r53 --noise --jobs $JOBS
[ -f data/calibration/rockridge.assessment-r53.md ] || stopr "F: no ten-seed assessment"
cp data/calibration/rockridge.assessment-r53.md $EV/; cp $T/assess-r53.log $EV/assess-r53.log; cp $T/validate-r53.log $EV/validate-r53.log
log "F: per-seed dirs: $(ls -d target/assess-seeds/60r53* | tr '\n' ' ')"
node $T/keep.cjs $EV/rockridge.assessment-r53.md $T/validate-r53.log > $EV/keep-rule.md 2>&1; tail -1 $EV/keep-rule.md > $T/keep-decision.txt
log "F: keep rule: $(cat $T/keep-decision.txt)"; grep '^|' $EV/keep-rule.md >> $T/chain.log
for q in pm_peak am_peak; do node $C/scripts/route-lines.cjs $q sim=baseline=target/assess-seeds/60 sim=candidate=target/assess-seeds/60r53 > $EV/route-sim-$q.md 2> $T/route-sim-$q.err; log "F: route-sim $q exit=$?"; done
node openspec/changes/archive/2026-11-19-calibration-round-50/scripts/shares.cjs pm_peak baseline=target/assess-seeds/60 candidate=target/assess-seeds/60r53 'baseline cv=target/assess-seeds/60-cv' 'candidate cv=target/assess-seeds/60r53-cv' > $EV/shares-pm.md 2> $T/shares.err; log "F: shares exit=$?"
{ echo "## Colby Street SB in the published assessment"; grep "Colby Street SB" data/calibration/rockridge.assessment.md | head -8; echo; echo "## Colby Street SB in the round 53 assessment"; grep "Colby Street SB" data/calibration/rockridge.assessment-r53.md | head -8; } > $EV/colby-sb-shares.md
S=$(date +%s); JOBS=$JOBS zsh $C/scripts/sod.zsh base $T/demand.base.json > $T/sod-base.log 2>&1; log "F: sod base exit=$? files $(tail -1 $T/sod-base.log) wall_s=$(( $(date +%s) - S ))"
S=$(date +%s); JOBS=$JOBS zsh $C/scripts/sod.zsh cand $T/demand.cand.json > $T/sod-cand.log 2>&1; log "F: sod cand exit=$? files $(tail -1 $T/sod-cand.log) wall_s=$(( $(date +%s) - S ))"
for q in pm_peak am_peak; do node $C/scripts/end-along-sim.cjs $q baseline=$T/sod-base candidate=$T/sod-cand > $EV/end-along-sim-$q.md 2> $T/end-along-sim-$q.err; log "F: end-along-sim $q exit=$?"; done
log "F done"

# G. Fresh-seed confirmation (restores), or I. restore
if [[ $(cat $T/keep-decision.txt) == "KEEP PASS" ]]; then
  rm -rf $K
  log "G: fresh-seed confirmation (scripts/confirm.zsh)"
  S=$(date +%s); zsh $C/scripts/confirm.zsh > $T/confirm.out 2>&1; log "G: confirm.zsh exit=$? wall_s=$(( $(date +%s) - S ))"
  mkdir -p $EV/confirm && cp target/r53-confirm/* $EV/confirm/ 2>/dev/null
  tail -5 target/r53-confirm/chain.log >> $T/chain.log
  log "G: $(grep -E '^Confirmation:' target/r53-confirm/confirm.md 2>/dev/null)"
  log "G: $(grep -E '^Improvement test:' target/r53-confirm/confirm.md 2>/dev/null)"
else
  log "G: skipped (keep rule not passed)"
  restore; rm -rf $K
fi
log "status: $(git status --short | tr '\n' ';')"
log "ALL DONE"
