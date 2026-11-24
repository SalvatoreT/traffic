#!/bin/zsh
# Laptop wrapper: step A, unmodified script from the extracted branch, with MAIN = the checkout it runs from (batch) and W in the usual worktrees folder.
R=/Users/sal/Developer/traffic/.claude/worktrees
S=${0:A:h}
echo "chain A start $(date)"
MAIN=${R}/batch BATCH=${R}/batch W=${R}/traffic-cap zsh ${S}/openspec/changes/cap-turn-bans/laptop/a.zsh
echo "CHAIN: a rc=$? $(date)"

# ---- second attempt ----
#!/bin/zsh
# Laptop wrapper: step A again, the same unmodified script, in a fresh worktree traffic-cap2 (the first attempt in traffic-cap stopped on a vitest timeout under load).
R=/Users/sal/Developer/traffic/.claude/worktrees
S=${0:A:h}
echo "chain A (second attempt) start $(date); load $(sysctl -n vm.loadavg)"
MAIN=${R}/batch BATCH=${R}/batch W=${R}/traffic-cap2 zsh ${S}/openspec/changes/cap-turn-bans/laptop/a.zsh; RC=$?
echo "CHAIN: a rc=${RC} $(date); load $(sysctl -n vm.loadavg)"
exit ${RC}

# ---- steps B to E ----
#!/bin/zsh
# Laptop wrapper: steps B, C, D and E (pack --no-push), the worktree's own scripts unmodified, stopping at the first failure.
export W=/Users/sal/Developer/traffic/.claude/worktrees/traffic-cap2
L=${W}/openspec/changes/cap-turn-bans/laptop
cd ${W} || exit 1
echo "chain BCDE start $(date); load $(sysctl -n vm.loadavg)"
for s in b c verify; do
  zsh ${L}/${s}.zsh; RC=$?
  echo "CHAIN: ${s} rc=${RC} $(date); load $(sysctl -n vm.loadavg)"
  [ ${RC} = 0 ] || { echo "CHAIN: stopped"; exit ${RC}; }
done
zsh ${L}/pack.zsh --no-push; RC=$?
echo "CHAIN: pack rc=${RC} $(date)"
exit ${RC}
