# chain-a.zsh (step A, run from the fixed copy a.laptop.zsh)
#!/bin/zsh
S=/private/tmp/claude-501/-Users-sal-Developer-traffic/14c5aa40-7f30-4ccb-abe4-bd568df679ed/scratchpad/pub
L=$S/openspec/changes/publish-ban-set-proposals/laptop
echo "chain A start $(date)"
cd /Users/sal/Developer/traffic
MAIN=/Users/sal/Developer/traffic BATCH=/Users/sal/Developer/traffic/.claude/worktrees/batch W=/Users/sal/Developer/traffic/.claude/worktrees/traffic-pub zsh $L/a.laptop.zsh
RC=$?
echo "CHAIN: a rc=$RC $(date)"

# chain-bcde.zsh (steps B, C, D, E from the worktree, unmodified; run twice: c068ed3, then 739517b)
#!/bin/zsh
# Runs the branch's own b, c, verify and pack scripts from the worktree, unmodified, in order; stops at the first failure.
W=/Users/sal/Developer/traffic/.claude/worktrees/traffic-pub
L=${W}/openspec/changes/publish-ban-set-proposals/laptop
cd ${W} || exit 1
echo "chain BCDE start $(date)"
W=${W} zsh ${L}/b.zsh; RC=$?; echo "CHAIN: b rc=${RC} $(date)"; [ ${RC} = 0 ] || exit 1
W=${W} zsh ${L}/c.zsh; RC=$?; echo "CHAIN: c rc=${RC} $(date)"; [ ${RC} = 0 ] || exit 1
W=${W} zsh ${L}/verify.zsh; RC=$?; echo "CHAIN: verify rc=${RC} $(date)"; [ ${RC} = 0 ] || exit 1
W=${W} zsh ${L}/pack.zsh --no-push; RC=$?; echo "CHAIN: pack rc=${RC} $(date)"
