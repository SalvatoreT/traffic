#!/bin/zsh
# Perimeter turn bans, step A: a separate worktree on the experiment branch with byte copies of the published local data, the gates, the single-candidate ranking and the packages.
# Nothing here touches the published local data: all work happens in the worktree W. No data:push, no /api/ request, no upload token, nothing written to main.
#   MAIN=/path/to/traffic [BATCH=/path/to/traffic/.claude/worktrees/batch] [W=...] zsh openspec/changes/perimeter-turn-bans/laptop/a.zsh
# BATCH is the worktree that holds the published public/data (and data/osm, and src/sim/pkg if it has been built). About 15 minutes: build 4, singles ranking 8, tests 2.
set -u
MAIN=${MAIN:-$(git rev-parse --show-toplevel)}
BATCH=${BATCH:-${MAIN}/.claude/worktrees/batch}
W=${W:-${MAIN}/.claude/worktrees/traffic-tb}
BR=${BR:-perimeter-turn-bans}
A=${W}/target/tb
source ${0:A:h}/env.zsh
stop() { log "STOP: $*"; log "A DONE (stopped)"; exit 1; }

# 0. The published inputs, read from BATCH before anything is copied
cd ${BATCH} || { echo "no BATCH worktree at ${BATCH}"; exit 1; }
got="network $(h public/data/rockridge.network.json) demand $(h public/data/rockridge.demand.json) proposals $(h public/data/rockridge.proposals.json)"
want="network ${EXP_NETWORK} demand ${EXP_DEMAND} proposals ${EXP_PROPOSALS}"
echo "published inputs: ${got}"
[ "${got}" = "${want}" ] || { echo "the local data is not the published set"; echo "expected: ${want}"; exit 1; }
cd ${MAIN} || exit 1
git fetch origin ${BR} || { echo "fetch failed: with a locked SSH agent use  git -c credential.helper='!gh auth git-credential' fetch https://github.com/<account>/traffic.git ${BR}:refs/remotes/origin/${BR}"; exit 1; }
[ -e ${W} ] && { echo "${W} exists already; remove it (git worktree remove --force ${W}) or pick another W"; exit 1; }

# 1. The worktree with its own copies of the git-ignored data
git worktree add ${W} origin/${BR} || exit 1
mkdir -p ${A}
ln -s ${MAIN}/node_modules ${W}/node_modules
cd ${W} || exit 1
mkdir -p public/data data/osm ${T}
cp ${BATCH}/public/data/*.json public/data/
cp -R ${BATCH}/data/osm/. data/osm/
[ -d ${BATCH}/src/sim/pkg ] && cp -R ${BATCH}/src/sim/pkg src/sim/pkg
log "START perimeter turn bans, step A, worktree ${W} at $(git rev-parse --short HEAD); published data copied: ${got}"
log "seeds file $(h data/proposals/rockridge.seeds.json) (expected ${EXP_SEEDS})"
[ "$(h data/proposals/rockridge.seeds.json)" = ${EXP_SEEDS} ] || stop "the seeds file on this branch is not the published one"

# 2. Builds: the simulator must be the published one, and it must be built here (the binary reads the data of the checkout it was built in)
step build cargo build --release -p traffic-sim --bins || stop "release build failed"
FP=$(./target/release/fingerprint); log "fingerprint ${FP}"
[ "${FP}" = ${EXP_FP} ] || stop "fingerprint is ${FP}, expected ${EXP_FP}"
[ -d src/sim/pkg ] || step wasm npm run wasm || stop "npm run wasm failed"

# 3. Tests
step vitest npx vitest run tools/ worker/ src/lib || stop "the TypeScript tests failed (see ${A}/vitest.log)"
log "vitest: $(grep -E 'Tests ' ${A}/vitest.log | tail -1)"
step typecheck npm run -s typecheck || stop "typecheck failed"

# 4. The single candidates, scored alone, on the settings that make the search's candidate list (periods, seed 1 for the select-link counts, 60 minutes). Gives the ranking of the turn-ban
#    candidates for the top-k packages. The candidate list must be the published one: 231 candidates and the same turn-ban lines as data/proposals/rockridge.md.
step singles ./target/release/explore --area rockridge --periods ${PERIODS} --seeds 1 --no-confirm --beam 5 --depth 6 --candidates 40 --expand 12 --finalists 12 --options 6 --screen-minutes 20 --minutes 60 --jobs ${JOBS} --no-known --check-singles || stop "the singles run failed"
cp ${A}/singles.log ${T}/singles.log
NC=$(grep -cE '^  candidate [0-9]+ \[' ${A}/singles.log)
log "candidate list: ${NC} candidates (published report: 231, of which the last 8 are adopted from known packages)"
sed -n '/^### Candidates/,/^### Search/p' data/proposals/rockridge.md | grep -E '^[0-9]+\. ' | sed -E 's/^[0-9]+\. //' > ${A}/cands.published
grep -E '^  candidate [0-9]+ \[' ${A}/singles.log | sed -E 's/^  candidate [0-9]+ \[[a-z_]+\] //' > ${A}/cands.now
head -n ${NC} ${A}/cands.published | cmp -s - ${A}/cands.now && [ ${NC} -eq 223 ] && log "candidate list identical to the first 223 of the published report's" || stop "the candidate list differs from data/proposals/rockridge.md (diff ${A}/cands.published ${A}/cands.now)"

# 5. The packages
step packages npx tsx tools/turn-ban-sets.ts --ranked ${T}/singles.log || stop "the generator failed (see ${A}/packages.log)"
cat ${A}/packages.log | cut -c1-400 | tee -a ${A}/chain.log
GOT=$(awk -F'\t' '$1 !~ /^top-/ {printf "%s=%s,", $1, $2}' ${T}/packages.tsv | sed 's/,$//')
log "packages without top-k: ${GOT}"
[ "${GOT}" = "${EXP_PACKAGES}" ] || stop "the packages differ from the container run (expected ${EXP_PACKAGES}): the network or the definition changed"
log "top-k packages: $(awk -F'\t' '$1 ~ /^top-/ {printf "%s=%s ", $1, $2}' ${T}/packages.tsv)"
log "git status: $(git status --short | tr '\n' ';')"
log "A DONE"
