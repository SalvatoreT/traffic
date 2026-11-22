#!/bin/zsh
# Round 55, step D, only if c.zsh says "VERDICT: keep rule and improvement test pass on both seed sets": the staged proposal search on the candidate with the flags and seeding inputs of
# round 52 (search-c5), then redistribution, results, assumptions, text pages and previews, all into a staging folder under target/r55/staged. public/data is copied aside first and put
# back at the end, so nothing published or left in place changes. Nothing is published from the laptop: no data:push, no /api/ request, no upload token.
# Ends with scripts/headline.cjs: through cars an hour at baseline by period, the change from the published set and the top proposal's options (the standing publish authorization needs at
# most 15% and the same top proposal).
#   W=/path/to/traffic-r55 zsh openspec/changes/calibration-round-55/laptop/d.zsh
# About 58 minutes: search 46 (2,736 s in the restamp of round 52), redistribution 5, results 1, assumptions, text pages and previews about 5.
set -u
W=${W:?set W to the round 55 worktree}
cd $W || exit 1
A=$W/target/r55
source ${0:A:h}/env.zsh
S=$A/search; ST=$A/staged; PB=$A/pd-cand
EV52=openspec/changes/archive/2026-11-20-calibration-round-52/evidence
stop() { log "STOP: $*"; log "D DONE (stopped)"; exit 1; }

grep -q '^Verdict: keep rule PASSES, improvement test PASSES' $A/keep-rule.md 2>/dev/null || stop "the keep rule and the improvement test did not both pass (or keep-rule.md is missing): the search does not run"
cmp -s $A/cand/demand.json public/data/rockridge.demand.json && cmp -s $A/cand/cv.demand.json target/validation/rockridge.demand.json || stop "the candidate is not in place"
[ -f target/batches/search-c5/proposals.json ] && [ -f target/batches/search-c5/report.md ] || stop "target/batches/search-c5/{proposals.json,report.md} are missing (a.zsh copies them from MAIN)"
log "START staged search on the round 55 candidate at $(git rev-parse --short HEAD); fingerprint $(./target/release/fingerprint); demand $(h public/data/rockridge.demand.json)"
rm -rf $PB $S $ST; mkdir -p $S $ST; cp -R public/data $PB
finish() { log "putting public/data and data/proposals back"; rsync -a --delete $PB/ public/data/; git checkout data/proposals 2>&1 | tail -1; log "status: $(git status --short --untracked-files=no | tr '\n' ';')"; log "D DONE $1"; }
step build-explore cargo build --release -p traffic-sim --bin explore || { finish "(build failed)"; exit 1; }
cp target/batches/search-c5/proposals.json $S/proposals.json
cp target/batches/search-c5/report.md $S/report.md
cp data/proposals/rockridge.seeds.json $S/seeds.json
log "seeded proposals.json $(h $S/proposals.json), report.md $(h $S/report.md), seeds.json $(h $S/seeds.json) (round 52: 3822705a26ca879d 8a443b947c606e50 e464cc90ca3e1472)"
ARGS=(--area rockridge --periods pm_peak,am_peak,midday --seeds 1-3 --confirm-seeds 101-110 --beam 5 --depth 6 --candidates 40 --expand 12 --finalists 12 --options 6 --screen-minutes 20 --minutes 60 --jobs $JOBS --out $S/proposals.json --report $S/report.md --known $S/seeds.json)
print -r -- "(cwd <worktree>) target/release/explore ${ARGS[*]}" > $S/command.txt
diff <(sed 's#target/[a-z0-9/-]*/##g' $EV52/search/command.txt) <(sed 's#target/[a-z0-9/-]*/##g' $S/command.txt) > /dev/null && log "explore flags identical to round 52's" || { finish "(explore flags differ from round 52's)"; exit 1; }
step search ./target/release/explore "${ARGS[@]}" || { finish "(explore failed)"; exit 1; }
log "search wall time above; restamp of round 52 on the faster simulator: 2736 s"
cp $S/proposals.json public/data/rockridge.proposals.json
cp $S/report.md data/proposals/rockridge.md
step redistribution npm run data:redistribution -- --jobs 8 || { finish "(redistribution failed)"; exit 1; }
step results npm run data:results -- --jobs 6 || { finish "(results failed)"; exit 1; }
step assumptions npm run data:assumptions || { finish "(assumptions failed)"; exit 1; }
step llms npm run data:llms || { finish "(llms failed)"; exit 1; }
step previews npm run data:previews || { finish "(previews failed)"; exit 1; }
mkdir -p $ST/public-data; cp -R public/data/. $ST/public-data/
cp $S/proposals.json $S/report.md $S/seeds.json $ST/
log "staged under $ST: proposals $(h $ST/proposals.json), results $(ls $ST/public-data/results/rockridge | wc -l | tr -d ' ') files, redistribution $(ls $ST/public-data/redistribution/rockridge | wc -l | tr -d ' '), og $(ls $ST/public-data/og | wc -l | tr -d ' '), llms $(ls $ST/public-data/llms | wc -l | tr -d ' ')"
HEADLINE_OUT=$A/headline.md node $CH/scripts/headline.cjs $A/pd-before/rockridge.proposals.json $ST/proposals.json; HRC=$?
log "headline check: $(tail -2 $A/headline.md | tr '\n' ' ')"
sed -n '/^| Period | Published/,/^$/p' $A/headline.md | tee -a $A/chain.log
log "through cars an hour by period are above; the top proposal's options are in $A/headline.md. Standing publish authorization needs the headline change at most 15% with the same top proposal, and the keep rule, the improvement test and these steps all passed: $([ $HRC = 0 ] && echo 'headline check passes' || echo 'headline check does NOT pass, the project lead decides')"
finish ""
