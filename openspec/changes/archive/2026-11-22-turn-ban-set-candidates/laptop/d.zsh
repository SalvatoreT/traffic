#!/bin/zsh
# Ban-set candidates, step D (after c.zsh): the one table. Reads the check logs of c.zsh and the search output of b.zsh; reads, never writes, the published files.
#   W=/path/to/traffic-bs zsh openspec/changes/turn-ban-set-candidates/laptop/d.zsh
# Seconds.
set -u
W=${W:?set W to the ban-set worktree}
cd ${W} || exit 1
A=${W}/target/ban-sets
source ${0:A:h}/env.zsh
stop() { log "STOP: $*"; log "D DONE (stopped)"; exit 1; }

ls ${A}/check/*.log > /dev/null 2>&1 || stop "no check logs: run c.zsh first"
[ -f ${T}/checks.json ] || stop "no ${T}/checks.json: run c.zsh first"
log "START step D"
node ${CH}/scripts/summary.cjs --checks ${A}/check --list ${T}/checks.json --published public/data/rockridge.proposals.json --search ${T}/proposals.json --out ${A}/summary.md > ${A}/summary.stdout || stop "summary.cjs failed"
cp ${A}/summary.md ${T}/summary.md
log "summary: ${A}/summary.md (copy in ${T}/summary.md)"
sed -n '/^| Package |/,/^Headline over/p' ${A}/summary.md | cut -c1-400 | tee -a ${A}/chain.log
sed -n '/^Top proposal:/p' ${A}/summary.md | tee -a ${A}/chain.log
guard || stop "a published file changed"
log "D DONE: the decision rule is in design.md; report to the project lead, publish nothing"
