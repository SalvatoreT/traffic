#!/bin/zsh
# Ban-set candidates, step A: a separate worktree on the experiment branch with byte copies of the published local data, the gates, the build, the tests and the list of ban-set candidates.
# Nothing here touches the published local data: all work happens in the worktree W. No data:push, no /api/ request, no upload token, nothing written to main.
#   MAIN=/path/to/traffic [BATCH=/path/to/traffic/.claude/worktrees/batch] [W=...] [BR=turn-ban-sets-search] zsh openspec/changes/turn-ban-set-candidates/laptop/a.zsh
# BATCH is the worktree that holds the published public/data (and data/osm, and src/sim/pkg if it has been built). About 12 minutes: build 4, Rust tests 4, TypeScript tests 2, list and parity under 1.
# SINGLES=1 also scores every single candidate alone (about 8 minutes) and requires the published candidate list, which shows that the default candidates did not change.
set -u
MAIN=${MAIN:-$(git rev-parse --show-toplevel)}
BATCH=${BATCH:-${MAIN}/.claude/worktrees/batch}
W=${W:-${MAIN}/.claude/worktrees/traffic-bs}
BR=${BR:-turn-ban-sets-search}
A=${W}/target/ban-sets
source ${0:A:h}/env.zsh
stop() { log "STOP: $*"; log "A DONE (stopped)"; exit 1; }

# 0. The published inputs, read from BATCH before anything is copied
cd ${BATCH} || { echo "no BATCH worktree at ${BATCH}"; exit 1; }
got="network $(h public/data/rockridge.network.json) demand $(h public/data/rockridge.demand.json) proposals $(h public/data/rockridge.proposals.json)"
want="network ${EXP_NETWORK} demand ${EXP_DEMAND} proposals ${EXP_PROPOSALS}"
echo "published inputs: ${got}"
[ "${got}" = "${want}" ] || { echo "the local data is not the published set"; echo "expected: ${want}"; exit 1; }
cd ${MAIN} || exit 1
if ! git fetch origin ${BR}; then
  echo "fetch over SSH failed; trying HTTPS with the gh login"
  REMOTE=$(git remote get-url origin | sed -E 's#^git@github.com:#https://github.com/#; s#^ssh://git@github.com/#https://github.com/#')
  git -c credential.helper='!gh auth git-credential' fetch "${REMOTE}" "${BR}:refs/remotes/origin/${BR}" || { echo "fetch failed over SSH and HTTPS"; exit 1; }
fi
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
log "START ban-set candidates, step A, worktree ${W} at $(git rev-parse --short HEAD); published data copied: ${got}"
log "seeds file $(h data/proposals/rockridge.seeds.json) (expected ${EXP_SEEDS})"
[ "$(h data/proposals/rockridge.seeds.json)" = ${EXP_SEEDS} ] || stop "the seeds file on this branch is not the published one"

# 2. Builds: the simulator must be the published one, and it must be built here (the binary reads the data of the checkout it was built in)
step build cargo build --release -p traffic-sim --bins || stop "release build failed"
FP=$(./target/release/fingerprint); log "fingerprint ${FP}"
[ "${FP}" = ${EXP_FP} ] || stop "fingerprint is ${FP}, expected ${EXP_FP}: the change touched the simulator, stop"
[ -d src/sim/pkg ] || step wasm npm run wasm || stop "npm run wasm failed"

# 3. Tests
step cargo-test cargo test --release -p traffic-sim || stop "the Rust tests failed (see ${A}/cargo-test.log)"
log "cargo test: $(grep -E '^test result' ${A}/cargo-test.log | awk '{p+=$4; f+=$6} END {print p" passed, "f" failed"}')"
step vitest npx vitest run tools/ worker/ src || stop "the TypeScript tests failed (see ${A}/vitest.log)"
log "vitest: $(grep -E 'Tests ' ${A}/vitest.log | tail -1)"
step typecheck npm run -s typecheck || stop "typecheck failed"

# 4. The ban-set candidates (no simulation): the list, the access drops, the counts of the container run, and the movement-by-movement parity with the TypeScript packages
./target/release/explore --area rockridge --periods ${PERIODS} --list-ban-sets ${T}/sets.json > ${A}/list-ban-sets.log 2>&1 || stop "listing the ban sets failed (see ${A}/list-ban-sets.log)"
cat ${A}/list-ban-sets.log | cut -c1-300 | tee -a ${A}/chain.log
node -e "const s=JSON.parse(require('fs').readFileSync('${T}/sets.json','utf8'));process.stdout.write(s.sets.map((x)=>x.id+'\t'+x.bans).join('\n')+'\n')" > ${A}/sets.now
cut -f1,2 ${CH}/laptop/expected-sets.tsv | cmp -s - ${A}/sets.now && log "ban sets identical to the container run's (${CH}/laptop/expected-sets.tsv)" || stop "the ban sets differ from the container run's (diff ${CH}/laptop/expected-sets.tsv ${A}/sets.now): the network or the definition changed"
step ts-packages npx tsx tools/turn-ban-sets.ts --out ${T}/ts || stop "the TypeScript generator failed"
node ${CH}/scripts/parity.cjs --rust ${T}/sets.json --ts ${T}/ts/packages.json > ${A}/parity.log 2>&1 || { cat ${A}/parity.log; stop "the Rust ban sets and the TypeScript packages differ"; }
tail -n 1 ${A}/parity.log | tee -a ${A}/chain.log

# 5. Optional: the default candidate list is the published one
if [ -n "${SINGLES:-}" ]; then
  step singles ./target/release/explore --area rockridge --periods ${PERIODS} --seeds 1 --no-confirm --beam 5 --depth 6 --candidates 40 --expand 12 --finalists 12 --options 6 --screen-minutes 20 --minutes 60 --jobs ${JOBS} --no-known --check-singles || stop "the singles run failed"
  NC=$(grep -cE '^  candidate [0-9]+ \[' ${A}/singles.log)
  sed -n '/^### Candidates/,/^### Search/p' data/proposals/rockridge.md | grep -E '^[0-9]+\. ' | sed -E 's/^[0-9]+\. //' > ${A}/cands.published
  grep -E '^  candidate [0-9]+ \[' ${A}/singles.log | sed -E 's/^  candidate [0-9]+ \[[a-z_]+\] //' > ${A}/cands.now
  head -n ${NC} ${A}/cands.published | cmp -s - ${A}/cands.now && [ ${NC} -eq 223 ] && log "default candidate list identical to the first 223 of the published report's" || stop "the default candidate list differs from data/proposals/rockridge.md"
fi
guard || stop "a published file changed"
log "git status: $(git status --short | tr '\n' ';')"
log "A DONE"
