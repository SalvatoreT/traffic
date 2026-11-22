#!/bin/zsh
# Ban-set candidates, laptop chain: a.laptop.zsh (SINGLES=1), b, c, d, pack --no-push. Only a.zsh is a copy (fetch timeout, see laptop-fixes.diff); b, c, d and pack are the branch's.
set -u
MAIN=/Users/sal/Developer/traffic
BATCH=${MAIN}/.claude/worktrees/batch
W=${MAIN}/.claude/worktrees/traffic-bs
S=/private/tmp/claude-501/-Users-sal-Developer-traffic/14c5aa40-7f30-4ccb-abe4-bd568df679ed/scratchpad/bs
L=${W}/openspec/changes/turn-ban-set-candidates/laptop
echo "chain start $(date)"
cd ${MAIN} || exit 1
SINGLES=1 MAIN=${MAIN} BATCH=${BATCH} W=${W} zsh ${S}/openspec/changes/turn-ban-set-candidates/laptop/a.laptop.zsh; RC=$?; echo "a rc=${RC} $(date)"; [ ${RC} = 0 ] || { echo "CHAIN: a failed"; exit 1; }
W=${W} zsh ${L}/b.zsh; RC=$?; echo "b rc=${RC} $(date)"; [ ${RC} = 0 ] || { echo "CHAIN: b failed"; exit 1; }
W=${W} zsh ${L}/c.zsh; RC=$?; echo "c rc=${RC} $(date)"; [ ${RC} = 0 ] || { echo "CHAIN: c failed"; exit 1; }
W=${W} zsh ${L}/d.zsh; RC=$?; echo "d rc=${RC} $(date)"
W=${W} zsh ${L}/pack.zsh --no-push; RC=$?; echo "pack rc=${RC} $(date)"
echo "CHAIN DONE $(date)"
