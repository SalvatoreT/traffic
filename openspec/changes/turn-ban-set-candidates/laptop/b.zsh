#!/bin/zsh
# Ban-set candidates, step B (after a.zsh): the published search command plus --ban-sets, run against a SCRATCH copy of the seeds file that also holds the hand packages `left-turns` and
# `all-turns-access` (each one ban-set intervention, so they fit the depth), rechecked in full and growing beams of their own. Output goes to target/ban-sets (proposals.json, report.md,
# seeds.json), never to public/data/rockridge.proposals.json, data/proposals/rockridge.md or data/proposals/rockridge.seeds.json. No data:push, no /api/ request, no upload token.
#   W=/path/to/traffic-bs zsh openspec/changes/turn-ban-set-candidates/laptop/b.zsh
# About 65 minutes (range 55 to 90): the published search took 46 minutes (2,736 s); 30 more candidates (a 13% longer singles screen) and sets entering the beam's repair moves make the
# screening about 1.5 times longer (about 45 minutes instead of 30), the two hand seeds add about 3 minutes of rechecks, and the confirmation is as long as before.
set -u
W=${W:?set W to the ban-set worktree}
cd ${W} || exit 1
A=${W}/target/ban-sets
source ${0:A:h}/env.zsh
EV52=openspec/changes/archive/2026-11-20-calibration-round-52/evidence
OUT=${T}/proposals.json; REP=${T}/report.md; K=${T}/seeds.json
stop() { log "STOP: $*"; log "B DONE (stopped)"; exit 1; }

[ "$(./target/release/fingerprint)" = ${EXP_FP} ] || stop "the simulator is not the published one"
[ "$(h public/data/rockridge.network.json) $(h public/data/rockridge.demand.json) $(h public/data/rockridge.proposals.json)" = "${EXP_NETWORK} ${EXP_DEMAND} ${EXP_PROPOSALS}" ] || stop "public/data is not the published set"
[ "$(h data/proposals/rockridge.seeds.json)" = ${EXP_SEEDS} ] || stop "data/proposals/rockridge.seeds.json is not the published one"
[ -f ${T}/sets.json ] || stop "no ${T}/sets.json: run a.zsh first"
log "START step B at $(git rev-parse --short HEAD); fingerprint $(./target/release/fingerprint)"
step build-explore cargo build --release -p traffic-sim --bin explore || stop "build failed"

# 1. The scratch seeds file: a copy of the published one with a cap high enough that adding the hand seeds drops none of the published seeds
cp data/proposals/rockridge.seeds.json ${K}
node -e "const fs=require('fs');const f=JSON.parse(fs.readFileSync('${K}','utf8'));f.cap=Math.max(f.cap,f.seeds.length+10);fs.writeFileSync('${K}',JSON.stringify(f,null,2)+'\n')"
log "scratch seeds ${K}: $(node -e "const f=JSON.parse(require('fs').readFileSync('${K}','utf8'));process.stdout.write(f.seeds.length+' seeds, cap '+f.cap)")"
for id in left-turns all-turns-access; do
  LINK=$(node -e "const s=JSON.parse(require('fs').readFileSync('${T}/sets.json','utf8')).sets.find((x)=>x.id==='${id}');if(!s)process.exit(1);process.stdout.write(s.link.replace('#v1;a=rockridge;','#v1;a=rockridge;p=pm_peak;'))") || stop "no ban set ${id} in ${T}/sets.json"
  ./target/release/explore --area rockridge --known ${K} --add-seed "${LINK}" --note "turn-ban-set-candidates: ${id}" < /dev/null >> ${A}/add-seeds.log 2>&1 || stop "adding ${id} to the scratch seeds failed (see ${A}/add-seeds.log)"
done
log "scratch seeds after adding: $(node -e "const f=JSON.parse(require('fs').readFileSync('${K}','utf8'));process.stdout.write(f.seeds.length+' seeds, '+f.seeds.filter((s)=>s.note.startsWith('turn-ban-set-candidates')).length+' of them ban sets')")"

# 2. The published search command with --ban-sets and the scratch files
rm -f ${OUT} ${REP}
ARGS=(--area rockridge --periods ${PERIODS} --seeds 1-3 --confirm-seeds 101-110 --beam 5 --depth 6 --candidates 40 --expand 12 --finalists 12 --options 6 --screen-minutes 20 --minutes 60 --jobs ${JOBS} --ban-sets --out ${OUT} --report ${REP} --known ${K})
print -r -- "(cwd <worktree>) target/release/explore ${ARGS[*]}" > ${T}/command.txt
norm() { sed -e 's#target/[a-z0-9/-]*/##g' -e 's/--jobs [0-9]*//' -e 's/ --ban-sets//' "$1"; }
diff <(norm ${EV52}/search/command.txt) <(norm ${T}/command.txt) > ${A}/command.diff && log "explore flags identical to round 52's (apart from paths, --jobs and --ban-sets)" || stop "explore flags differ from round 52's (see ${A}/command.diff)"
S0=$(date +%s)
./target/release/explore "${ARGS[@]}" > ${A}/search.log 2>&1
RC=$?
log "explore exit=${RC} wall_s=$(( $(date +%s) - S0 )) (the last published search: 2736 s; estimate for this one: about 3900 s)"
log "candidates: $(grep -E '^[0-9]+ candidate interventions' ${A}/search.log); ban sets among them: $(grep -cE '^ +[0-9]+ \[ban_set\]' ${A}/search.log)"
log "known packages: $(grep -E '^known packages' ${A}/search.log | tr '\n' ';')"
log "dropped seeds: $(grep -E 'known package dropped' ${A}/search.log | cut -c1-200 | tr '\n' ';')"
log "screening runs: $(grep -oE '[0-9]+ screening runs simulated' ${REP} | head -1) (published search: 3207)"
guard || stop "a published file changed"
[ ${RC} = 0 ] && [ -f ${OUT} ] || stop "the search failed (see ${A}/search.log)"
log "B DONE: ${OUT} $(h ${OUT}), ${REP} $(h ${REP})"
