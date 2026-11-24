#!/bin/zsh
# Cap turn bans, step A: a separate worktree on the change's branch with byte copies of the published local data, the gates, the build and the tests.
# All work happens in the worktree W; the published local data in BATCH is only read. No data:push, no /api/ request, no upload token, nothing written to main.
#   MAIN=/path/to/traffic [BATCH=/path/to/traffic/.claude/worktrees/batch] [W=...] [BR=cap-turn-bans] zsh openspec/changes/cap-turn-bans/laptop/a.zsh
# BATCH is the worktree that holds the published public/data (and data/osm, and src/sim/pkg if built). About 12 minutes: build 4, Rust tests 4, TypeScript tests 2, the rest under 2.
set -u
MAIN=${MAIN:-$(git rev-parse --show-toplevel)}
BATCH=${BATCH:-${MAIN}/.claude/worktrees/batch}
W=${W:-${MAIN}/.claude/worktrees/traffic-cap}
BR=${BR:-cap-turn-bans}
A=${W}/target/cap-bans
source ${0:A:h}/env.zsh
stop() { log "STOP: $*"; log "A DONE (stopped)"; exit 1; }

# 0. The published inputs, read from BATCH before anything is copied. The proposals file is recorded, not gated: the lead republishes a trimmed one before the run.
cd ${BATCH} || { echo "no BATCH worktree at ${BATCH}"; exit 1; }
got="network $(h public/data/rockridge.network.json) demand $(h public/data/rockridge.demand.json)"
want="network ${EXP_NETWORK} demand ${EXP_DEMAND}"
echo "published inputs: ${got}; proposals file $(h public/data/rockridge.proposals.json) (recorded, not a gate)"
[ "${got}" = "${want}" ] || { echo "the local data is not the published set"; echo "expected: ${want}"; exit 1; }
cd ${MAIN} || exit 1
if ! tmo git fetch origin ${BR}; then
  echo "fetch over SSH failed or timed out; trying HTTPS with the gh login"
  REMOTE=$(git remote get-url origin | sed -E 's#^git@github.com:#https://github.com/#; s#^ssh://git@github.com/#https://github.com/#')
  git -c credential.helper= -c credential.helper='!gh auth git-credential' fetch "${REMOTE}" "${BR}:refs/remotes/origin/${BR}" || { echo "fetch failed over SSH and HTTPS"; exit 1; }
fi
[ -e ${W} ] && { echo "${W} exists already; remove it (git worktree remove --force ${W}) or pick another W"; exit 1; }

# 1. The worktree with its own copies of the git-ignored data. The humanizer skill is copied from MAIN (or BATCH), never installed: no npm install here.
git worktree add ${W} origin/${BR} || exit 1
mkdir -p ${A}
ln -s ${MAIN}/node_modules ${W}/node_modules
cd ${W} || exit 1
mkdir -p public/data data/osm ${T}
cp -R ${BATCH}/public/data/. public/data/
cp -R ${BATCH}/data/osm/. data/osm/
[ -d ${BATCH}/src/sim/pkg ] && cp -R ${BATCH}/src/sim/pkg src/sim/pkg
if [ ! -d .claude/skills/humanizer ]; then
  mkdir -p .claude/skills
  for src in ${MAIN} ${BATCH}; do [ -d ${src}/.claude/skills/humanizer ] && { cp -R ${src}/.claude/skills/humanizer .claude/skills/humanizer; break; }; done
fi
mkdir -p ${T}/published
cp public/data/rockridge.proposals.json data/proposals/rockridge.md data/proposals/rockridge.seeds.json ${T}/published/
cp -R public/data/results public/data/redistribution ${T}/published/
log "START cap-turn-bans, step A, worktree ${W} at $(git rev-parse --short HEAD); published data copied: ${got}; proposals file $(h public/data/rockridge.proposals.json)"
log "seeds file $(h data/proposals/rockridge.seeds.json) (expected ${EXP_SEEDS})"
[ "$(h data/proposals/rockridge.seeds.json)" = ${EXP_SEEDS} ] || stop "the seeds file on this branch is not the expected one (the lead confirms EXP_SEEDS in env.zsh)"

# 2. Builds: the simulator must be the published one (the change touches only explore/ and bin/, outside the fingerprint) and must be built here
step build cargo build --release -p traffic-sim --bins || stop "release build failed"
FP=$(./target/release/fingerprint); log "fingerprint ${FP}"
[ "${FP}" = ${EXP_FP} ] || stop "fingerprint is ${FP}, expected ${EXP_FP}: the change touched the simulator, stop"
[ -d src/sim/pkg ] || step wasm npm run wasm || stop "npm run wasm failed"
step check-wasm npm run -s check:wasm || stop "native and WASM runs differ (see ${A}/check-wasm.log)"

# 3. Tests
step cargo-test cargo test --release -p traffic-sim || stop "the Rust tests failed (see ${A}/cargo-test.log)"
log "cargo test: $(grep -E '^test result' ${A}/cargo-test.log | awk '{p+=$4; f+=$6} END {print p" passed, "f" failed"}')"
step vitest npx vitest run tools/ worker/ src || stop "the TypeScript tests failed (see ${A}/vitest.log)"
log "vitest: $(grep -E 'Tests ' ${A}/vitest.log | tail -1)"
step typecheck npm run -s typecheck || stop "typecheck failed"

# 4. The ban-set candidates under the cap are the ones of the verified run that hold at most MAX_BANS bans (the top-k sets come from the search's own ranking and are not in this list)
./target/release/explore --area rockridge --periods ${PERIODS} --ban-sets --max-turn-bans ${MAX_BANS} --list-ban-sets ${T}/sets.json > ${A}/list-ban-sets.log 2>&1 || stop "listing the ban sets failed (see ${A}/list-ban-sets.log)"
node -e "const s=JSON.parse(require('fs').readFileSync('${T}/sets.json','utf8'));process.stdout.write(s.sets.map((x)=>x.id+'\t'+x.bans+'\t'+x.label).join('\n')+'\n')" > ${A}/sets.now
awk -F'\t' -v m=${MAX_BANS} '$2 > m {bad=1} END {exit bad}' ${A}/sets.now || stop "a ban set over the cap of ${MAX_BANS} is still listed (see ${A}/sets.now)"
cmp -s ${CH}/laptop/expected-sets.tsv ${A}/sets.now && log "ban sets under the cap and their labels identical to expected-sets.tsv" || stop "the ban sets differ from ${CH}/laptop/expected-sets.tsv (diff ${CH}/laptop/expected-sets.tsv ${A}/sets.now)"
log "git status: $(git status --short | tr '\n' ';')"
log "A DONE"
