#!/bin/zsh
# Perimeter turn bans, step D (after b.zsh, and c.zsh if it ran): the one table. Reads the check logs of b.zsh and the search output of c.zsh; reads, never writes, the published files.
#   W=/path/to/traffic-tb zsh openspec/changes/perimeter-turn-bans/laptop/d.zsh
# Seconds.
set -u
W=${W:?set W to the perimeter-turn-bans worktree}
cd ${W} || exit 1
A=${W}/target/tb
source ${0:A:h}/env.zsh
stop() { log "STOP: $*"; log "D DONE (stopped)"; exit 1; }

ls ${A}/check/*.log > /dev/null 2>&1 || stop "no check logs: run b.zsh first"
log "START step D"
node ${CH}/scripts/summary.cjs --packages ${T}/packages.json --checks ${A}/check --published public/data/rockridge.proposals.json --search ${T}/proposals.json --out ${A}/summary.md > ${A}/summary.stdout || stop "summary.cjs failed"
for f in ${T}/proposals-depth*.json(N); do
  node ${CH}/scripts/summary.cjs --packages ${T}/packages.json --checks ${A}/check --published public/data/rockridge.proposals.json --search ${f} --out ${A}/summary-${f:t:r}.md > /dev/null && log "summary for ${f} in ${A}/summary-${f:t:r}.md"
done
cp ${A}/summary.md ${T}/summary.md
log "summary: ${A}/summary.md (copy in ${T}/summary.md)"
sed -n '/^| Package |/,/^Headline over/p' ${A}/summary.md | cut -c1-400 | tee -a ${A}/chain.log
sed -n '/^Top proposal:/p' ${A}/summary.md | tee -a ${A}/chain.log
guard || stop "a published file changed"
log "D DONE: the decision rule is in design.md; report to the project lead, publish nothing"
