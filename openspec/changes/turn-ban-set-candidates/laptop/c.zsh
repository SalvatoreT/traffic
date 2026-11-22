#!/bin/zsh
# Ban-set candidates, step C (after b.zsh): `explore --check` on the published settings (seeds 101-110, three periods, 60 minutes) of
#   - published p1, the like-for-like reference;
#   - the search's first three options that hold a ban set (search-set-1 to search-set-3), if it has that many;
#   - the hand combinations: left-turns alone, left-turns + the Forest Street filter of p1, left-turns + p1's two 63rd Street filters, all-turns-access + the Forest Street filter.
# A hand combination is checked even when the search also published it, so every figure comes from the same method. --check prints and writes nothing and does not read the seeds file
# (--no-known). No data:push, no /api/ request, no upload token.
#   W=/path/to/traffic-bs [FORCE=1] zsh openspec/changes/turn-ban-set-candidates/laptop/c.zsh
# About 2.5 minutes per check at 12 jobs (the baseline is simulated again each time): 8 checks, about 20 minutes. An interrupted run resumes: a log that already holds its recheck is skipped unless FORCE=1.
set -u
W=${W:?set W to the ban-set worktree}
cd ${W} || exit 1
A=${W}/target/ban-sets
source ${0:A:h}/env.zsh
stop() { log "STOP: $*"; log "C DONE (stopped)"; exit 1; }

[ "$(./target/release/fingerprint)" = ${EXP_FP} ] || stop "the simulator is not the published one"
[ "$(h public/data/rockridge.network.json) $(h public/data/rockridge.demand.json) $(h public/data/rockridge.proposals.json)" = "${EXP_NETWORK} ${EXP_DEMAND} ${EXP_PROPOSALS}" ] || stop "public/data is not the published set"
[ -f ${T}/sets.json ] || stop "no ${T}/sets.json: run a.zsh first"
[ -f ${T}/proposals.json ] || stop "no ${T}/proposals.json: run b.zsh first"
mkdir -p ${A}/check
log "START step C at $(git rev-parse --short HEAD); flags: ${CHECK_FLAGS[*]}"
print -r -- "(cwd <worktree>) target/release/explore ${CHECK_FLAGS[*]} --check <link>" > ${A}/check/command.txt
node ${CH}/scripts/pick-checks.cjs --search ${T}/proposals.json --sets ${T}/sets.json --published public/data/rockridge.proposals.json --out ${T}/checks.json > ${A}/checks.tsv 2> ${A}/pick-checks.err || stop "choosing the checks failed (see ${A}/pick-checks.err)"
[ -s ${A}/pick-checks.err ] && log "pick-checks: $(tr '\n' ';' < ${A}/pick-checks.err)"
log "checks: $(cut -f1 ${A}/checks.tsv | tr '\n' ' ')"

run_check() {
  local id=$1 link=$2
  if [ -z "${FORCE:-}" ] && grep -q '^recheck of' ${A}/check/${id}.log 2>/dev/null; then log "${id}: already checked, skipped"; return 0; fi
  local S0=$(date +%s)
  ./target/release/explore ${CHECK_FLAGS[@]} --check "${link}" < /dev/null > ${A}/check/${id}.log 2>&1
  local RC=$?
  log "${id}: exit=${RC} wall_s=$(( $(date +%s) - S0 )); $(grep -m1 'through cars an hour, mean of periods' ${A}/check/${id}.log | sed 's/;.*//'); $(grep -m1 'access check' ${A}/check/${id}.log | sed 's/^ *//'); $(grep -m1 '^recheck of' ${A}/check/${id}.log | sed 's/^.*: //')"
  return ${RC}
}

while IFS=$'\t' read -r id link; do
  if [ "${id}" = p1 ]; then
    run_check p1 "${link}" || stop "the check of p1 failed (see ${A}/check/p1.log)"
    log "p1 as published: 522.5 -> 135.7 (-74.0%), interval -407.65 to -365.95 cars an hour; as re-checked: $(grep -m1 'through cars an hour, mean of periods' ${A}/check/p1.log | sed 's/;.*//'); $(grep -m1 'through-car change interval' ${A}/check/p1.log | sed 's/^ *//')"
  else
    run_check ${id} "${link}" || log "WARNING: ${id} exited non-zero (see ${A}/check/${id}.log); carrying on"
  fi
done < ${A}/checks.tsv

node ${CH}/scripts/summary.cjs --checks ${A}/check --list ${T}/checks.json --out ${A}/summary.md > /dev/null && log "summary written to ${A}/summary.md (d.zsh adds the search and rewrites it)"
guard || stop "a published file changed"
log "C DONE"
