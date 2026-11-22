#!/bin/zsh
# Perimeter turn bans, step B (after a.zsh): `explore --check` of published p1 (the like-for-like reference) and of every package, each to its own log under target/tb/check, with the
# published search's settings (seeds 101-110, periods pm_peak,am_peak,midday, 60 minutes). --check prints and writes nothing: it does not read or write the seeds file (--no-known says so
# anyway), so no published file changes. No data:push, no /api/ request, no upload token.
#   W=/path/to/traffic-tb [FORCE=1] zsh openspec/changes/perimeter-turn-bans/laptop/b.zsh
# About 40 minutes: each invocation simulates the baseline again (30 hours of traffic) and the package (30 hours), about 2.5 minutes at 12 jobs; 11 to 15 invocations.
# An interrupted run resumes: a package whose log already holds its recheck is skipped unless FORCE=1.
set -u
W=${W:?set W to the perimeter-turn-bans worktree}
cd ${W} || exit 1
A=${W}/target/tb
source ${0:A:h}/env.zsh
stop() { log "STOP: $*"; log "B DONE (stopped)"; exit 1; }

[ "$(./target/release/fingerprint)" = ${EXP_FP} ] || stop "the simulator is not the published one"
[ "$(h public/data/rockridge.network.json) $(h public/data/rockridge.demand.json) $(h public/data/rockridge.proposals.json)" = "${EXP_NETWORK} ${EXP_DEMAND} ${EXP_PROPOSALS}" ] || stop "public/data is not the published set"
[ -f ${T}/packages.tsv ] || stop "no packages: run a.zsh first"
mkdir -p ${A}/check
log "START step B at $(git rev-parse --short HEAD); flags: ${CHECK_FLAGS[*]}"
print -r -- "(cwd <worktree>) target/release/explore ${CHECK_FLAGS[*]} --check <link>" > ${A}/check/command.txt

P1=$(node -e "const f=JSON.parse(require('fs').readFileSync('public/data/rockridge.proposals.json','utf8'));const p=f.groups[0].proposals.find((x)=>x.id==='p1');process.stdout.write(p.link)")
[ -n "${P1}" ] || stop "no p1 in the published proposals file"
log "published p1: ${P1}"

run_check() {
  local id=$1 link=$2
  if [ -z "${FORCE:-}" ] && grep -q '^recheck of' ${A}/check/${id}.log 2>/dev/null; then log "${id}: already checked, skipped"; return 0; fi
  local S0=$(date +%s)
  ./target/release/explore ${CHECK_FLAGS[@]} --check "${link}" < /dev/null > ${A}/check/${id}.log 2>&1
  local RC=$?
  log "${id}: exit=${RC} wall_s=$(( $(date +%s) - S0 )); $(grep -m1 'through cars an hour, mean of periods' ${A}/check/${id}.log | sed 's/;.*//'); $(grep -m1 'access check' ${A}/check/${id}.log | sed 's/^ *//'); $(grep -m1 '^recheck of' ${A}/check/${id}.log | sed 's/^.*: //')"
  return ${RC}
}

run_check p1 "${P1}" || stop "the check of p1 failed (see ${A}/check/p1.log)"
log "p1 as published: 522.5 -> 135.7 (-74.0%), interval -407.65 to -365.95 cars an hour; as re-checked: $(grep -m1 'through cars an hour, mean of periods' ${A}/check/p1.log | sed 's/;.*//'); $(grep -m1 'through-car change interval' ${A}/check/p1.log | sed 's/^ *//')"
while IFS=$'\t' read -r id bans link; do
  run_check ${id} "${link}" || log "WARNING: ${id} exited non-zero (see ${A}/check/${id}.log); carrying on"
done < ${T}/packages.tsv

node ${CH}/scripts/summary.cjs --packages ${T}/packages.json --checks ${A}/check --out ${A}/summary.md > /dev/null && log "summary written to ${A}/summary.md (c.zsh adds the search, d.zsh rewrites it)"
guard || stop "a published file changed"
log "B DONE"
