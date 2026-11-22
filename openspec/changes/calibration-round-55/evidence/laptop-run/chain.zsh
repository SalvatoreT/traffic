#!/bin/zsh
set -u
export MAIN=/Users/sal/Developer/traffic/.claude/worktrees/batch
export DER=/Users/sal/Developer/traffic/.claude/worktrees/traffic-derived
export W=/Users/sal/Developer/traffic/.claude/worktrees/traffic-r55
S=/private/tmp/claude-501/-Users-sal-Developer-traffic/14c5aa40-7f30-4ccb-abe4-bd568df679ed/scratchpad/r55
L=$W/openspec/changes/calibration-round-55/laptop
echo "chain start $(date)"
cd $MAIN && zsh $S/a.zsh || { echo "CHAIN: a.zsh failed rc=$?"; exit 1; }
cd $W && zsh $L/b.zsh || { echo "CHAIN: b.zsh failed rc=$?"; exit 2; }
cd $W && zsh $L/c.zsh; RC=$?
[ $RC = 0 ] || { echo "CHAIN: c.zsh exit $RC (keep rule or improvement test not passed, or a stop); d.zsh not run"; exit 3; }
grep -q '^Verdict: keep rule PASSES, improvement test PASSES' $W/target/r55/keep-rule.md 2>/dev/null || { echo "CHAIN: c.zsh exit 0 without a passing keep-rule.md (no change?); d.zsh not run"; exit 0; }
cd $W && zsh $L/d.zsh || { echo "CHAIN: d.zsh failed rc=$?"; exit 4; }
echo "CHAIN ALL DONE $(date)"
