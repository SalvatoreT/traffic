#!/bin/zsh
# Cap turn bans, step D (after c.zsh): the verification and the headline table for the project lead. Reads, never writes, the generated files; writes target/cap-bans/headline.md.
#   W=/path/to/traffic-cap zsh openspec/changes/cap-turn-bans/laptop/verify.zsh
# Seconds. Exit 1 if any check fails; the table is written either way and pack.zsh refuses to pack a failed check unless FORCE=1.
set -u
W=${W:?set W to the worktree}
cd ${W} || exit 1
A=${W}/target/cap-bans
source ${0:A:h}/env.zsh
stop() { log "STOP: $*"; log "D DONE (stopped)"; exit 1; }

log "START step D (verification)"
[ "$(./target/release/fingerprint)" = ${EXP_FP} ] || stop "the simulator is not the published one"
node ${CH}/scripts/verify.cjs --file public/data/rockridge.proposals.json --old-p1 ${CH}/laptop/old-p1.link --out ${A}/headline.md \
  --fingerprint ${EXP_FP} --network ${EXP_NETWORK} --demand ${EXP_DEMAND} --max-bans ${MAX_BANS} --results-dir public/data/results/rockridge --redistribution-dir public/data/redistribution/rockridge > ${A}/verify.out; RC=$?
cat ${A}/headline.md | cut -c1-600 | tee -a ${A}/chain.log
# Every option has stored results for every period and a redistribution file; the report matches the proposals file.
N=$(node -e "const d=JSON.parse(require('fs').readFileSync('public/data/rockridge.proposals.json','utf8'));process.stdout.write(String(d.groups.reduce((s,g)=>s+g.proposals.length,0)))")
NR=$(ls public/data/results/rockridge | grep -v -c -E '^(index|baseline-intents)\.json$'); NF=$(ls public/data/redistribution/rockridge | wc -l | tr -d ' ')
log "proposals ${N} (options and references); per-proposal-period result files ${NR}, index.json and baseline-intents.json not counted (expect ${N} x 3 periods = $(( N * 3 ))); redistribution files ${NF}"
[ ${NR} = $(( N * 3 )) ] || { log "FAIL: stored results do not cover every proposal and period"; RC=1; }
grep -q "no-turn-bans\|no turn restrictions" data/proposals/rockridge.md && log "report names the no-turn-bans objective" || { log "FAIL: the report does not name the no-turn-bans objective"; RC=1; }
grep -q "most-removed-no-turn-bans\|without turn restrictions" data/proposals/rockridge.md && log "report names the most-removed-no-turn-bans objective" || { log "FAIL: the report does not name the most-removed-no-turn-bans objective"; RC=1; }
grep -q "Turn-ban cap: a package holds at most ${MAX_BANS} individual turn bans" data/proposals/rockridge.md && log "report states the cap of ${MAX_BANS}" || { log "FAIL: the report does not state the cap of ${MAX_BANS}"; RC=1; }
log "tracked files changed: $(git status --short --untracked-files=no | tr '\n' ';')"
log "D DONE (exit ${RC})"
exit ${RC}
