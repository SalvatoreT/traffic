#!/bin/zsh
# Cap turn bans, step B (after a.zsh): the published search command plus --ban-sets --max-turn-bans 5, writing the real files IN THE WORKTREE ONLY:
# public/data/rockridge.proposals.json, data/proposals/rockridge.md and data/proposals/rockridge.seeds.json. The objectives are the default (all, which includes no-turn-bans and most-removed-no-turn-bans).
# The seeds file already holds the two 41-ban and 21-ban hand packages of the run of 2026-11-22 and the 41-ban options the earlier search published; with the cap the search skips every known package over 5 turn bans and says so (the report and computed.turnBanCap count them).
# The pictures for the cards come with the search, so there is no separate annotate step; verify.zsh says if one is missing.
# No data:push, no /api/ request, no upload token.
#   W=/path/to/traffic-cap zsh openspec/changes/cap-turn-bans/laptop/b.zsh
# About 40 minutes (range 30 to 60): the search of 2026-11-22 took 36 minutes (2,146 s) with 41-ban sets; packages over the cap are rejected before any simulation, so this one should not be slower.
set -u
W=${W:?set W to the worktree}
cd ${W} || exit 1
A=${W}/target/cap-bans
source ${0:A:h}/env.zsh
EV=openspec/changes/archive/2026-11-21-restamp-round-52/evidence/laptop
stop() { log "STOP: $*"; log "B DONE (stopped)"; exit 1; }

[ "$(./target/release/fingerprint)" = ${EXP_FP} ] || stop "the simulator is not the published one"
[ "$(h public/data/rockridge.network.json) $(h public/data/rockridge.demand.json)" = "${EXP_NETWORK} ${EXP_DEMAND}" ] || stop "the inputs are not the published set (run a.zsh first)"
[ "$(h data/proposals/rockridge.seeds.json)" = ${EXP_SEEDS} ] || stop "data/proposals/rockridge.seeds.json is not the expected one"
[ -f ${T}/sets.json ] || stop "no ${T}/sets.json: run a.zsh first"
BEFORE=$(h public/data/rockridge.proposals.json)
log "START step B at $(git rev-parse --short HEAD); fingerprint $(./target/release/fingerprint); proposals file before the search ${BEFORE}${SMOKE:+; SMOKE=1, reduced search}"
step build-explore cargo build --release -p traffic-sim --bin explore || stop "build failed"

# 1. The seeds file: cap high enough that the options this search publishes drop none of the older seeds
K=data/proposals/rockridge.seeds.json
node -e "const fs=require('fs');const f=JSON.parse(fs.readFileSync('${K}','utf8'));f.cap=Math.max(f.cap,f.seeds.length+10);fs.writeFileSync('${K}',JSON.stringify(f,null,2)+'\n')"
cp ${K} ${T}/seeds.before.json
log "seeds before the search: $(node -e "const f=JSON.parse(require('fs').readFileSync('${K}','utf8'));const n=(s)=>s.link.split(';s=')[1].split('~').filter((x)=>x.startsWith('tb,')).length;process.stdout.write(f.seeds.length+' seeds, cap '+f.cap+', '+f.seeds.filter((s)=>n(s)>${MAX_BANS}).length+' over '+${MAX_BANS}+' turn bans (expected to be skipped)')")"

# 2. The published search command with --ban-sets --max-turn-bans and the default files
ARGS=(--area rockridge ${SEARCH_FLAGS} --jobs ${JOBS} --ban-sets --max-turn-bans ${MAX_BANS})
print -r -- "(cwd <worktree>) target/release/explore ${ARGS[*]}" > ${T}/command.txt
if [ -z "${SMOKE:-}" ]; then
  norm() { sed -e 's#--out [^ ]*##; s#--report [^ ]*##; s#--known [^ ]*##; s#--jobs [0-9]*##; s# --ban-sets##; s# --max-turn-bans [0-9]*##; s#  *# #g' "$1"; }
  diff <(norm ${EV}/search-command.txt) <(norm ${T}/command.txt) > ${A}/command.diff && log "explore flags identical to the restamped round 52's (apart from files, --jobs, --ban-sets and --max-turn-bans)" || stop "explore flags differ from round 52's (see ${A}/command.diff)"
fi
S0=$(date +%s)
./target/release/explore "${ARGS[@]}" > ${A}/search.log 2>&1
RC=$?
log "explore exit=${RC} wall_s=$(( $(date +%s) - S0 )) (the search of 2026-11-22 took 2146 s)"
log "known packages: $(grep -E '^known packages' ${A}/search.log | tr '\n' ';')"
log "known packages skipped over the cap: $(grep -c 'over the turn-ban cap' ${A}/search.log) lines in the log"
log "beams: $(grep -E '^beam for' ${A}/search.log | tr '\n' ';')"
log "chose: $(grep -E '^chose' ${A}/search.log)"
[ ${RC} = 0 ] && [ -f public/data/rockridge.proposals.json ] || stop "the search failed (see ${A}/search.log)"
[ "$(h public/data/rockridge.proposals.json)" != ${BEFORE} ] || stop "the proposals file is unchanged: the search wrote nothing"
mkdir -p ${T}/search
cp public/data/rockridge.proposals.json data/proposals/rockridge.md data/proposals/rockridge.seeds.json ${T}/search/
log "B DONE: proposals $(h public/data/rockridge.proposals.json), report $(h data/proposals/rockridge.md), seeds $(h data/proposals/rockridge.seeds.json)"
