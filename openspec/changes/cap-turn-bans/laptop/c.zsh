#!/bin/zsh
# Cap turn bans, step C (after b.zsh): the traced redistribution and the stored full-hour results of the new proposals file, IN THE WORKTREE ONLY.
# The two generated folders are emptied first, so the files left are exactly those of the new list (the old ones belong to proposals that are no longer published).
# Needs the WASM build (a.zsh). No data:push, no /api/ request, no upload token.
#   W=/path/to/traffic-cap zsh openspec/changes/cap-turn-bans/laptop/c.zsh
# About 20 minutes (range 10 to 45): redistribution 5 to 25 (round 52: 266 s for six packages at 12 jobs; a package now holds at most 5 individual bans, so tracing is the same size as for the filter packages),
# results about 2 (round 52: 66 s).
set -u
W=${W:?set W to the worktree}
cd ${W} || exit 1
A=${W}/target/cap-bans
source ${0:A:h}/env.zsh
stop() { log "STOP: $*"; log "C DONE (stopped)"; exit 1; }

[ -f ${T}/search/rockridge.proposals.json ] && cmp -s ${T}/search/rockridge.proposals.json public/data/rockridge.proposals.json || stop "public/data/rockridge.proposals.json is not the search's output (run b.zsh first)"
[ -d src/sim/pkg ] || stop "no src/sim/pkg: run npm run wasm"
log "START step C at $(git rev-parse --short HEAD)"
rm -rf public/data/results public/data/redistribution

step redistribution npm run data:redistribution -- --jobs ${JOBS} || stop "data:redistribution failed (see ${A}/redistribution.log)"
log "redistribution: $(ls public/data/redistribution/rockridge | wc -l | tr -d ' ') files; $(tail -3 ${A}/redistribution.log | tr '\n' ';' | cut -c1-300)"
step results npm run data:results -- --jobs 4 || stop "data:results failed (see ${A}/results.log)"
log "results: $(ls public/data/results/rockridge | wc -l | tr -d ' ') files (including index.json and baseline-intents.json)"
log "C DONE"
