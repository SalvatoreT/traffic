export W=/Users/sal/Developer/traffic/.claude/worktrees/traffic-r55
export DER=/Users/sal/Developer/traffic/.claude/worktrees/traffic-derived
L=$W/openspec/changes/calibration-round-55/laptop
echo "chain2 start $(date)"
cd $W && zsh $W/target/r55/b2.zsh || { echo "CHAIN: b2.zsh failed rc=$?"; exit 2; }
cd $W && zsh $L/c.zsh; RC=$?; [ $RC = 0 ] || { echo "CHAIN: c.zsh rc=$RC (keep rule or a stop)"; exit 3; }
grep -q '^Verdict: keep rule PASSES, improvement test PASSES' $W/target/r55/keep-rule.md || { echo "CHAIN: keep rule verdict line not found; d.zsh not run"; exit 0; }
cd $W && zsh $L/d.zsh || { echo "CHAIN: d.zsh failed rc=$?"; exit 4; }
echo "CHAIN ALL DONE $(date)"
