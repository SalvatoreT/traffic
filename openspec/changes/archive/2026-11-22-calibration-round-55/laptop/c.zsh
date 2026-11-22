#!/bin/zsh
# Round 55, step C (after b.zsh): validation suite, the candidate's ten-seed assessments (seeds 1 to 10 and fresh seeds 11 to 20) against the baseline assessments of a.zsh, the keep rule and the
# improvement test (scripts/keep-rule.cjs). Variant output sets only (--suffix), never --publish. No data:push, no /api/ request, no upload token.
#   W=/path/to/traffic-r55 zsh openspec/changes/calibration-round-55/laptop/c.zsh
# About 5 minutes.
set -u
W=${W:?set W to the round 55 worktree}
cd $W || exit 1
A=$W/target/r55
source ${0:A:h}/env.zsh
JD=openspec/changes/archive/2026-11-21-restamp-round-52/evidence/laptop/jdiff.cjs
B1=data/calibration/rockridge.assessment-r55-base.md; B2=data/calibration/rockridge.assessment-r55-base-fresh.md
C1=data/calibration/rockridge.assessment-r55.md; C2=data/calibration/rockridge.assessment-r55-fresh.md
stop() { log "STOP: $*"; log "C DONE (stopped)"; exit 1; }

[ "$(./target/release/fingerprint)" = $EXP_FP ] || stop "the simulator is not the published one"
[ -f $B1 ] && [ -f $B2 ] || stop "the baseline assessments of a.zsh are missing"
[ -f $A/cand/demand.json ] || stop "no candidate: run b.zsh first"
cmp -s $A/cand/demand.json public/data/rockridge.demand.json && cmp -s $A/cand/cv.demand.json target/validation/rockridge.demand.json || stop "the candidate demands are not in place (restore.zsh or another run replaced them)"
log "START round 55, step C: shipped demand $(h public/data/rockridge.demand.json), cross-validation demand $(h target/validation/rockridge.demand.json), training membership $(h target/membership/rockridge.membership-training.json)"
if [ "$(h public/data/rockridge.demand.json)" = $EXP_DEMAND ] && [ "$(h target/validation/rockridge.demand.json)" = $EXP_CV ]; then
  log "the candidate is the published model: nothing to assess. C DONE (no change)"; exit 0
fi

# 1. Validation suite (about 20 s): the simulator is unchanged, so the report must be the committed one apart from the revision stamp
step validate ./target/release/validate || stop "validate failed"
V=$(grep -E 'cases pass' $A/validate.log | head -1)
git show HEAD:data/calibration/validation.json > $A/validation.head.json
node $JD $A/validation.head.json data/calibration/validation.json --ignore manifest.simulator.revision > $A/validation-diff.txt 2>&1 && SAME="identical to the committed validation.json apart from the revision" || SAME="DIFFERS from the committed validation.json: $(head -3 $A/validation-diff.txt | tr '\n' ' ')"
print -r -- "$V; $SAME" > $A/validation.txt
log "validation: $(cat $A/validation.txt)"
git checkout data/calibration/validation.json data/calibration/validation.md

# 2. The candidate's assessments (about 70 s each at --jobs 12)
step assess-1-10 npm run assess -- --suffix r55 --seeds 1-10 --jobs $JOBS || stop "assessment seeds 1-10 failed (exit 3 lists the problems in $A/assess-1-10.log)"
step assess-11-20 npm run assess -- --suffix r55-fresh --seeds 11-20 --jobs $JOBS || stop "assessment seeds 11-20 failed (exit 3 lists the problems in $A/assess-11-20.log)"
for f in $C1 $C2; do grep -q 'Suggested status' $f || stop "$f has no verdict"; done

# 3. Keep rule and improvement test, then the side-by-side summary for the project lead
KEEP_OUT=$A/keep-rule.md node $CH/scripts/keep-rule.cjs $B1 $C1 $B2 $C2 $A/validation.txt; RC=$?
log "$(grep -m1 '^Keep rule:' $A/keep-rule.md)"
log "$(grep -m1 '^Improvement test:' $A/keep-rule.md)"
sed -n '/^| Line |/,/^Improvement test:/p' $A/keep-rule.md | tee -a $A/chain.log
npx tsx tools/derived-assessment-summary.ts base-1-10=$B1 cand-1-10=$C1 base-11-20=$B2 cand-11-20=$C2 > $A/summary.md
log "summary written to $A/summary.md ($(wc -l < $A/summary.md | tr -d ' ') lines)"
if [ $RC = 0 ]; then log "VERDICT: keep rule and improvement test pass on both seed sets; d.zsh may run"; else log "VERDICT: the candidate does not pass ($(grep -m1 '^Verdict:' $A/keep-rule.md)); d.zsh does not run"; fi
log "C DONE"
exit $RC
