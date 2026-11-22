#!/bin/zsh
# Perimeter turn bans, step C (after b.zsh): the published search command, run against a SCRATCH copy of the seeds file that also holds the turn-ban packages that were not rejected
# (hand seeds, so they are rechecked in full and start beams of their own and can combine with filters). Output goes to target/turn-bans (proposals.json, report.md, seeds.json), never to
# public/data/rockridge.proposals.json, data/proposals/rockridge.md or data/proposals/rockridge.seeds.json. No data:push, no /api/ request, no upload token.
#   W=/path/to/traffic-tb [DEPTH=6] [ALLOW_EMPTY=1] zsh openspec/changes/perimeter-turn-bans/laptop/c.zsh
# DEPTH is the search depth. The published value is 6, and with 6 the command is the published one. A seed with more interventions than the depth is dropped by the search, so with 6 only
# packages of up to 6 bans are seeded (the large ones were measured alone in step B). A larger DEPTH seeds the larger packages too; it also changes the beam (more levels, and the harm
# weight ramps over more steps), so it is a second experiment with its own output files (proposals-depthN.json), never a replacement of the first.
# About 60 minutes at DEPTH 6: the published search took 46 minutes (2,736 s), each extra seed adds one full recheck (about 1 minute) and its sub-package screens. A deeper search is untimed;
# plan on two to three times that.
set -u
W=${W:?set W to the perimeter-turn-bans worktree}
cd ${W} || exit 1
A=${W}/target/tb
DEPTH=${DEPTH:-6}
source ${0:A:h}/env.zsh
EV52=openspec/changes/archive/2026-11-20-calibration-round-52/evidence
SUF=""; [ "${DEPTH}" != 6 ] && SUF="-depth${DEPTH}"
OUT=${T}/proposals${SUF}.json; REP=${T}/report${SUF}.md; K=${T}/seeds${SUF}.json
stop() { log "STOP: $*"; log "C DONE (stopped)"; exit 1; }

[ "$(./target/release/fingerprint)" = ${EXP_FP} ] || stop "the simulator is not the published one"
[ "$(h public/data/rockridge.network.json) $(h public/data/rockridge.demand.json) $(h public/data/rockridge.proposals.json)" = "${EXP_NETWORK} ${EXP_DEMAND} ${EXP_PROPOSALS}" ] || stop "public/data is not the published set"
[ "$(h data/proposals/rockridge.seeds.json)" = ${EXP_SEEDS} ] || stop "data/proposals/rockridge.seeds.json is not the published one"
ls ${A}/check/*.log > /dev/null 2>&1 || stop "no check logs: run b.zsh first"
log "START step C (depth ${DEPTH}) at $(git rev-parse --short HEAD); fingerprint $(./target/release/fingerprint)"
step build-explore cargo build --release -p traffic-sim --bin explore || stop "build failed"

# 1. The scratch seeds file: a copy of the published one with a cap high enough that adding hand seeds drops none of the published seeds
cp data/proposals/rockridge.seeds.json ${K}
node -e "const fs=require('fs');const f=JSON.parse(fs.readFileSync('${K}','utf8'));f.cap=Math.max(f.cap,f.seeds.length+30);fs.writeFileSync('${K}',JSON.stringify(f,null,2)+'\n')"
log "scratch seeds ${K}: $(node -e "const f=JSON.parse(require('fs').readFileSync('${K}','utf8'));process.stdout.write(f.seeds.length+' seeds, cap '+f.cap)")"

# 2. The packages to add: not rejected, access check passed, no more bans than the depth
node ${CH}/scripts/pick-seeds.cjs --packages ${T}/packages.json --checks ${A}/check --depth ${DEPTH} > ${A}/seeded.tsv 2> ${A}/not-seeded.txt
log "seeded: $(cut -f1 ${A}/seeded.tsv | tr '\n' ' ')"
log "not seeded: $(tr '\n' ';' < ${A}/not-seeded.txt)"
[ -s ${A}/seeded.tsv ] || [ -n "${ALLOW_EMPTY:-}" ] || stop "no package qualifies as a seed (every package was rejected, failed access or is larger than the depth); ALLOW_EMPTY=1 runs the search with the published seeds only as a control"
while IFS=$'\t' read -r id link; do
  ./target/release/explore --area rockridge --known ${K} --add-seed "${link}" --note "perimeter-turn-bans: ${id}" < /dev/null >> ${A}/add-seeds.log 2>&1 || stop "adding ${id} to the scratch seeds failed (see ${A}/add-seeds.log)"
done < ${A}/seeded.tsv
log "scratch seeds after adding: $(node -e "const f=JSON.parse(require('fs').readFileSync('${K}','utf8'));process.stdout.write(f.seeds.length+' seeds, '+f.seeds.filter((s)=>s.note.startsWith('perimeter-turn-bans')).length+' of them turn-ban packages')")"

# 3. The published search command, with the scratch files
rm -f ${OUT} ${REP}
ARGS=(--area rockridge --periods ${PERIODS} --seeds 1-3 --confirm-seeds 101-110 --beam 5 --depth ${DEPTH} --candidates 40 --expand 12 --finalists 12 --options 6 --screen-minutes 20 --minutes 60 --jobs ${JOBS} --out ${OUT} --report ${REP} --known ${K})
print -r -- "(cwd <worktree>) target/release/explore ${ARGS[*]}" > ${T}/command${SUF}.txt
norm() { sed -e 's#target/[a-z0-9/-]*/##g' -e 's/--jobs [0-9]*//' -e 's/-depth[0-9]*\./\./g' -e "s/--depth ${DEPTH} /--depth 6 /" "$1"; }
diff <(norm ${EV52}/search/command.txt) <(norm ${T}/command${SUF}.txt) > ${A}/command.diff && log "explore flags identical to round 52's (apart from paths, --jobs and --depth ${DEPTH})" || stop "explore flags differ from round 52's (see ${A}/command.diff)"
S0=$(date +%s)
./target/release/explore "${ARGS[@]}" > ${A}/search${SUF}.log 2>&1
RC=$?
log "explore exit=${RC} wall_s=$(( $(date +%s) - S0 )) (the last published search: 2736 s)"
log "known packages: $(grep -E '^known packages' ${A}/search${SUF}.log | tr '\n' ';')"
log "dropped seeds: $(grep -E 'known package dropped' ${A}/search${SUF}.log | cut -c1-200 | tr '\n' ';')"
guard || stop "a published file changed"
[ ${RC} = 0 ] && [ -f ${OUT} ] || stop "the search failed (see ${A}/search${SUF}.log)"
log "C DONE: ${OUT} $(h ${OUT}), ${REP} $(h ${REP})"
