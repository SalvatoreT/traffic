#!/bin/zsh
# Perimeter turn bans, laptop chain: a, b, d (partial), c (DEPTH=6), d, pack --no-push. Scripts are the branch's, unmodified.
set -u
MAIN=/Users/sal/Developer/traffic
BATCH=${MAIN}/.claude/worktrees/batch
W=${MAIN}/.claude/worktrees/traffic-tb
S=/private/tmp/claude-501/-Users-sal-Developer-traffic/14c5aa40-7f30-4ccb-abe4-bd568df679ed/scratchpad/tb
L=${W}/openspec/changes/perimeter-turn-bans/laptop
echo "chain start $(date)"
cd ${MAIN} || exit 1
MAIN=${MAIN} BATCH=${BATCH} W=${W} zsh ${S}/openspec/changes/perimeter-turn-bans/laptop/a.zsh; RC=$?; echo "a rc=${RC} $(date)"; [ ${RC} = 0 ] || { echo "CHAIN: a failed"; exit 1; }
W=${W} zsh ${L}/b.zsh; RC=$?; echo "b rc=${RC} $(date)"; [ ${RC} = 0 ] || { echo "CHAIN: b failed"; exit 1; }
W=${W} zsh ${L}/d.zsh; RC=$?; echo "d1 rc=${RC} $(date)"; cp ${W}/target/tb/summary.md ${S}/summary-after-b.md
W=${W} DEPTH=6 zsh ${L}/c.zsh; RC=$?; echo "c rc=${RC} $(date)"; [ ${RC} = 0 ] || { echo "CHAIN: c failed"; exit 1; }
W=${W} zsh ${L}/d.zsh; RC=$?; echo "d2 rc=${RC} $(date)"
W=${W} zsh ${L}/pack.zsh --no-push; RC=$?; echo "pack rc=${RC} $(date)"
echo "CHAIN DONE $(date)"
