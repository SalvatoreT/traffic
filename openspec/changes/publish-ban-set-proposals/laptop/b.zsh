#!/bin/zsh
# Publish ban-set proposals, step B (after a.zsh): the published search command plus --ban-sets, writing the real files IN THE WORKTREE ONLY:
# public/data/rockridge.proposals.json, data/proposals/rockridge.md and data/proposals/rockridge.seeds.json. The objectives are the default (all, which includes no-turn-bans and most-removed-no-turn-bans, the second adding no beam).
# The seeds file first gets a higher cap and the two hand packages `left-turns` and `all-turns-access` (each one ban-set intervention), as in the run of 2026-11-22.
# The pictures for the cards come with the search (the run of 2026-11-22 wrote them), so there is no separate annotate step; verify.zsh says if one is missing.
# No data:push, no /api/ request, no upload token.
#   W=/path/to/traffic-pub zsh openspec/changes/publish-ban-set-proposals/laptop/b.zsh
# About 45 minutes (range 35 to 65): the search of 2026-11-22 took 36 minutes (2,146 s); the extra beam for the no-turn-bans objective (the most-removed-no-turn-bans objective has none) shares the screening cache and adds a few minutes.
set -u
W=${W:?set W to the worktree}
cd ${W} || exit 1
A=${W}/target/publish-bs
source ${0:A:h}/env.zsh
EV=openspec/changes/archive/2026-11-21-restamp-round-52/evidence/laptop
stop() { log "STOP: $*"; log "B DONE (stopped)"; exit 1; }

[ "$(./target/release/fingerprint)" = ${EXP_FP} ] || stop "the simulator is not the published one"
[ "$(h public/data/rockridge.network.json) $(h public/data/rockridge.demand.json) $(h ${T}/published/rockridge.proposals.json)" = "${EXP_NETWORK} ${EXP_DEMAND} ${EXP_PROPOSALS}" ] || stop "the inputs are not the published set (run a.zsh first)"
[ "$(h data/proposals/rockridge.seeds.json)" = ${EXP_SEEDS} ] || stop "data/proposals/rockridge.seeds.json is not the published one"
[ -f ${T}/sets.json ] || stop "no ${T}/sets.json: run a.zsh first"
log "START step B at $(git rev-parse --short HEAD); fingerprint $(./target/release/fingerprint)${SMOKE:+; SMOKE=1, reduced search}"
step build-explore cargo build --release -p traffic-sim --bin explore || stop "build failed"

# 1. The seeds file: cap high enough that adding the hand seeds drops none of the published seeds, then the two ban-set packages
K=data/proposals/rockridge.seeds.json
node -e "const fs=require('fs');const f=JSON.parse(fs.readFileSync('${K}','utf8'));f.cap=Math.max(f.cap,f.seeds.length+10);fs.writeFileSync('${K}',JSON.stringify(f,null,2)+'\n')"
for id in left-turns all-turns-access; do
  LINK=$(node -e "const s=JSON.parse(require('fs').readFileSync('${T}/sets.json','utf8')).sets.find((x)=>x.id==='${id}');if(!s)process.exit(1);process.stdout.write(s.link.replace('#v1;a=rockridge;','#v1;a=rockridge;p=pm_peak;'))") || stop "no ban set ${id} in ${T}/sets.json"
  ./target/release/explore --area rockridge --add-seed "${LINK}" --note "turn-ban-set-candidates: ${id}" < /dev/null >> ${A}/add-seeds.log 2>&1 || stop "adding ${id} to the seeds failed (see ${A}/add-seeds.log)"
done
cp ${K} ${T}/seeds.before.json
log "seeds before the search: $(node -e "const f=JSON.parse(require('fs').readFileSync('${K}','utf8'));process.stdout.write(f.seeds.length+' seeds, cap '+f.cap+', '+f.seeds.filter((s)=>s.note.startsWith('turn-ban-set-candidates')).length+' ban sets')")"

# 2. The published search command with --ban-sets and the default files
ARGS=(--area rockridge ${SEARCH_FLAGS} --jobs ${JOBS} --ban-sets)
print -r -- "(cwd <worktree>) target/release/explore ${ARGS[*]}" > ${T}/command.txt
if [ -z "${SMOKE:-}" ]; then
  norm() { sed -e 's#--out [^ ]*##; s#--report [^ ]*##; s#--known [^ ]*##; s#--jobs [0-9]*##; s# --ban-sets##; s#  *# #g' "$1"; }
  diff <(norm ${EV}/search-command.txt) <(norm ${T}/command.txt) > ${A}/command.diff && log "explore flags identical to the restamped round 52's (apart from files, --jobs and --ban-sets)" || stop "explore flags differ from round 52's (see ${A}/command.diff)"
fi
S0=$(date +%s)
./target/release/explore "${ARGS[@]}" > ${A}/search.log 2>&1
RC=$?
log "explore exit=${RC} wall_s=$(( $(date +%s) - S0 )) (the search of 2026-11-22 took 2146 s; estimate for this one: 2700 s)"
log "known packages: $(grep -E '^known packages' ${A}/search.log | tr '\n' ';')"
log "beams: $(grep -E '^beam for' ${A}/search.log | tr '\n' ';')"
log "chose: $(grep -E '^chose' ${A}/search.log)"
[ ${RC} = 0 ] && [ -f public/data/rockridge.proposals.json ] || stop "the search failed (see ${A}/search.log)"
[ "$(h public/data/rockridge.proposals.json)" != ${EXP_PROPOSALS} ] || stop "the proposals file is unchanged: the search wrote nothing"
mkdir -p ${T}/search
cp public/data/rockridge.proposals.json data/proposals/rockridge.md data/proposals/rockridge.seeds.json ${T}/search/
log "B DONE: proposals $(h public/data/rockridge.proposals.json), report $(h data/proposals/rockridge.md), seeds $(h data/proposals/rockridge.seeds.json)"
