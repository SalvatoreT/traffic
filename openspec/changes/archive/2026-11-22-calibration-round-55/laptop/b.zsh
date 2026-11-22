#!/bin/zsh
# Round 55, step B (after a.zsh passed): the membership loop with a cap of CAP passes (default 8) and the report-only diagnostics, then the identity checks against the published loop.
# The stop rule is the loop's own (flow and membership change at or below 1 seed standard error in every view and period); it is not loosened. Resumable: RESUME=1 after an interruption.
# No data:push, no /api/ request, no upload token. The published local data in MAIN is not touched. If the loop aborts (offered demand more than 3% over the static fit, or a failed check),
# stop and send back $A/loop.log, target/membership-loop/logs/ and data/demand/rockridge.fit*.md: no --resume, no config change.
#   W=/path/to/traffic-r55 [DER=/path/to/traffic-derived] [CAP=8] [RESUME=1] zsh openspec/changes/calibration-round-55/laptop/b.zsh
# About 16 minutes a pass at --jobs 12 plus 14 for the final builds: 46 minutes for a stop after pass 1, 62 for the published three passes, 142 for all eight (design.md D2).
set -u
W=${W:?set W to the round 55 worktree}
cd $W || exit 1
A=$W/target/r55
DER=${DER:-$(cd $W/.. && pwd)/traffic-derived}
source ${0:A:h}/env.zsh
JD=openspec/changes/archive/2026-11-21-restamp-round-52/evidence/laptop/jdiff.cjs
stop() { log "STOP: $*"; log "status: $(git status --short | tr '\n' ';')"; log "B DONE (stopped)"; exit 1; }

[ "$(./target/release/fingerprint)" = $EXP_FP ] || stop "the simulator is not the published one"
if [ -z "${RESUME:-}" ]; then
  [ -z "$(git status --short --untracked-files=no)" ] || stop "tracked files changed before the start: $(git status --short --untracked-files=no | tr '\n' ';')"
  { [ -e target/membership-loop ] || ls target/membership/*.json > /dev/null 2>&1; } && stop "target/membership or target/membership-loop is not empty (the published copies are in target/published)"
  [ "$(h public/data/rockridge.demand.json)" = $EXP_DEMAND ] || stop "public/data/rockridge.demand.json is not the published shipped demand"
fi
log "START round 55, step B, at $(git rev-parse --short HEAD), cap $CAP passes, jobs $JOBS${RESUME:+, RESUME}"

# 1. The loop (diagnostics.md in target/membership-loop is rewritten after every pass: read it while the loop runs)
LOOPARGS=(--iterations $CAP --jobs $JOBS --watch $CH/watch.json --report $A/membership-loop.md)
[ -n "${RESUME:-}" ] && LOOPARGS+=(--resume)
step loop npx tsx tools/membership-loop.ts $LOOPARGS || { tail -30 $A/loop.log | tee -a $A/chain.log; stop "membership loop failed or aborted"; }
grep -E '^(pass [0-9]+: stop rule|stop rule|WARNING)' $A/loop.log | tee -a $A/chain.log
grep -E 'pass [0-9]+ (shipped|training) (pm|am)_peak: [0-9]+ car veh/h offered' $A/loop.log | sed -E 's/; [0-9]+ of [0-9]+ selected.*flow change/ ... flow change/' | tee -a $A/chain.log
log "loop wall time above; round 52 (three passes and the final builds): 3777 s"
cp target/membership-loop/state.json target/membership-loop/diagnostics.md $A/
mkdir -p $A/cand/membership $A/cand/fit
cp target/membership-loop/pools/*.json $A/cand/membership/ 2>/dev/null
node -e "const s=JSON.parse(require('fs').readFileSync('target/membership-loop/state.json'));const n=Math.max(...s.reports.map(r=>r.pass))+1;console.log('passes run '+n+'; stop rule '+(s.stoppedAfter===null?'NOT met by the cap':'met at pass '+s.stoppedAfter))" | tee -a $A/chain.log

# 2. Identity of the first passes with the published loop of the derived-targets job
if [ -d $DER/target/membership-loop ]; then
  node $CH/scripts/identity.cjs target/membership-loop $DER/target/membership-loop | tee $A/identity.txt | tee -a $A/chain.log
  [ ${pipestatus[1]} = 0 ] || stop "the first passes differ from the published loop's: the default-identity argument fails; do not assess"
else
  log "NOTE: no published loop folder at $DER/target/membership-loop; identity of passes 0 to 2 is read from the pool files and the final demand only"
fi
# The pool after pass 2 against the published membership files, ignoring the absolute run paths the files record in `source`
for pair in "shipped:rockridge.membership.json" "training:rockridge.membership-training.json"; do
  v=${pair%%:*}; f=${pair#*:}
  [ -f target/membership-loop/pools/i2-$v.json ] || { log "no pass 2 pool for the $v view (the loop stopped earlier)"; continue; }
  node $JD target/published/$f target/membership-loop/pools/i2-$v.json --ignore 'periods.*.source' --ignore 'periods.*.stations.source' --ignore 'periods.*.blocks.source' > $A/pool2-$v-diff.txt 2>&1 \
    && log "pool after pass 2, $v view: equal to the published membership file apart from the recorded run paths" \
    || stop "the pass 2 pool of the $v view differs from the published membership file: $(head -4 $A/pool2-$v-diff.txt | tr '\n' ' ')"
done

# 3. What the loop left in place
cp data/demand/rockridge.fit*.md $A/cand/fit/
cp public/data/rockridge.demand.json $A/cand/demand.json
cp target/validation/rockridge.demand.json $A/cand/cv.demand.json
cp target/membership/*.json $A/cand/membership/
H="network $(h public/data/rockridge.network.json) demand $(h $A/cand/demand.json) cv $(h $A/cand/cv.demand.json) membership $(h target/membership/rockridge.membership.json) training $(h target/membership/rockridge.membership-training.json)"
log "candidate: $H"
log "published: network $EXP_NETWORK demand $EXP_DEMAND cv $EXP_CV membership $EXP_MEMB training $EXP_MEMBT (the membership files record absolute run paths, so their hashes equal the published ones only when the loop ran at the same path)"
[ "$(h public/data/rockridge.network.json)" = $EXP_NETWORK ] || stop "the network changed"
for f in data/demand/rockridge.stations.json data/demand/rockridge.split.json data/demand/rockridge.groups.json data/demand/rockridge.config.json data/areas/rockridge.json; do
  git diff --quiet -- $f || stop "$f changed; this round changes only the membership files, the demands and the fit reports"
done
UNEXPECTED=$(git status --short --untracked-files=no | grep -v -E 'data/demand/rockridge\.(fit|audit)' || true)
[ -z "$UNEXPECTED" ] || stop "unexpected changed files: $UNEXPECTED"
log "stations, split, groups, config and area files unchanged; changed tracked files: $(git status --short --untracked-files=no | tr '\n' ';')"
if [ "$(h $A/cand/demand.json)" = $EXP_DEMAND ] && [ "$(h $A/cand/cv.demand.json)" = $EXP_CV ]; then
  log "IDENTICAL TO PUBLISHED: the final demands are the published ones (the stop rule fired at pass 2 or earlier with the same pool as the published three passes, or the loop reproduced it). There is nothing to assess; record the convergence figures from $A/diagnostics.md"
fi

# 4. The figures to read first
echo "== diagnostics (target/membership-loop/diagnostics.md): convergence and GEH tables" | tee -a $A/chain.log
sed -n '/^### Convergence and offered demand/,/^### Watched stations/p' $A/diagnostics.md | tee -a $A/chain.log
log "B DONE. The candidate is in place (public/data, target/validation, target/membership); c.zsh assesses it, then restore.zsh puts the published model back if you want it before the next run"
