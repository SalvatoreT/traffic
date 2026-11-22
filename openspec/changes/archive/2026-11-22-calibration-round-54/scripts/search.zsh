#!/bin/zsh
# Round 54, stage 2 step 5, only if the keep rule passed on both seed sets (evidence/keep-rule.md says "Keep rule: PASSES"): the staged proposal search on the candidate, in the shape of
# search-c5 with round 52's flags and seeding inputs (round 52's run.zsh and the restamp's b.zsh), then data:redistribution, data:results, data:assumptions, data:llms and data:previews.
# Everything is written into a staging copy under target/r54/staged/; public/data is copied aside first and put back at the end, so nothing published or left in place changes.
# Needs the candidate in place (loop.zsh), target/batches/search-c5/{proposals.json,report.md} and the committed data/proposals/rockridge.seeds.json. No data:push, no /api/, no upload token.
#   JOBS=12 zsh openspec/changes/calibration-round-54/scripts/search.zsh
cd "$(git rev-parse --show-toplevel)" || exit 1
T=target/r54; CH=openspec/changes/calibration-round-54; K=target/batches/worktree.lock; JOBS=${JOBS:-12}
S=$T/search; ST=$T/staged; PB=$T/pd-before
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
log() { echo "$(now) $*" | tee -a $T/chain.log; }
h() { shasum -a 256 "$1" | cut -c1-16; }
step() { local name=$1; shift; log "$name: start"; local S0=$(date +%s); "$@" > $T/$name.log 2>&1; local RC=$?; log "$name: exit=$RC wall_s=$(( $(date +%s) - S0 ))"; return $RC; }
mkdir $K 2>/dev/null || { echo "worktree lock held: $(cat $K/owner 2>/dev/null)"; exit 1; }; echo "r54-search $$ $(date)" > $K/owner
finish() { log "putting public/data and data/proposals back"; rsync -a --delete $PB/ public/data/; git checkout data/proposals 2>&1 | tail -1; log "status: $(git status --short | tr '\n' ';')"; rm -rf $K; log "SEARCH DONE $1"; }
grep -q '^Keep rule: PASSES' $CH/evidence/keep-rule.md 2>/dev/null || { log "the keep rule did not pass (or keep-rule.md is missing): the search does not run"; rm -rf $K; exit 1; }
cmp -s $T/cand/demand.json public/data/rockridge.demand.json && cmp -s $T/cand/cv.demand.json target/validation/rockridge.demand.json || { log "the candidate is not in place, stop"; rm -rf $K; exit 1; }
log "START staged search on the round 54 candidate at $(git rev-parse --short HEAD); fingerprint $(./target/release/fingerprint); demand $(h public/data/rockridge.demand.json)"
rm -rf $PB $S $ST; mkdir -p $S $ST; cp -R public/data $PB
cargo build --release -p traffic-sim --bin explore > $T/build-explore.log 2>&1 || { log "build failed"; finish "(build failed)"; exit 1; }
cp target/batches/search-c5/proposals.json $S/proposals.json
cp target/batches/search-c5/report.md $S/report.md
cp data/proposals/rockridge.seeds.json $S/seeds.json
log "seeded proposals.json $(h $S/proposals.json), report.md $(h $S/report.md), seeds.json $(h $S/seeds.json) (round 52: 3822705a26ca879d 8a443b947c606e50 e464cc90ca3e1472 for the committed seeds file)"
ARGS=(--area rockridge --periods pm_peak,am_peak,midday --seeds 1-3 --confirm-seeds 101-110 --beam 5 --depth 6 --candidates 40 --expand 12 --finalists 12 --options 6 --screen-minutes 20 --minutes 60 --jobs $JOBS --out $S/proposals.json --report $S/report.md --known $S/seeds.json)
print -r -- "(cwd <worktree>) target/release/explore ${ARGS[*]}" > $CH/evidence/search-command.txt
step search ./target/release/explore "${ARGS[@]}" || { finish "(explore failed)"; exit 1; }
log "search wall time above; restamp of round 52 on the faster simulator: 2736 s"
cp $S/proposals.json public/data/rockridge.proposals.json
cp $S/report.md data/proposals/rockridge.md
step redistribution npm run data:redistribution -- --jobs 8 || { finish "(redistribution failed)"; exit 1; }
step results npm run data:results -- --jobs 6 || { finish "(results failed)"; exit 1; }
step assumptions npm run data:assumptions || { finish "(assumptions failed)"; exit 1; }
step llms npm run data:llms || { finish "(llms failed)"; exit 1; }
step previews npm run data:previews || { finish "(previews failed)"; exit 1; }
cp -R public/data/. $ST/public-data/ 2>/dev/null || { mkdir -p $ST/public-data; cp -R public/data/. $ST/public-data/; }
cp $S/proposals.json $S/report.md $S/seeds.json $ST/
log "staged under $ST: proposals $(h $ST/proposals.json), results $(ls $ST/public-data/results/rockridge | wc -l | tr -d ' ') files, redistribution $(ls $ST/public-data/redistribution/rockridge | wc -l | tr -d ' ') files, og $(ls $ST/public-data/og | wc -l | tr -d ' '), llms $(ls $ST/public-data/llms | wc -l | tr -d ' ')"
log "proposals file against the published one: $(h public/data/rockridge.proposals.json) vs $(h $PB/rockridge.proposals.json); compare by eye in the report ($ST/report.md); a changed set is the project lead's to review"
finish ""
