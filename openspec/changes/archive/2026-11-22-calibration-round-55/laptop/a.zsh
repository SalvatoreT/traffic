#!/bin/zsh
# Round 55, step A: a separate worktree with byte copies of the published data, the gates, and the baseline assessments under the derived-targets scope.
# Nothing here touches the published local data: all work happens in the worktree W. No data:push, no /api/ request, no upload token, nothing written to main.
#   MAIN=/path/to/traffic [DER=/path/to/traffic/.claude/worktrees/traffic-derived] [W=...] zsh openspec/changes/calibration-round-55/laptop/a.zsh
# MAIN holds the published shipped data (public/data, target/membership/rockridge.membership.json). DER is the derived-targets worktree: its target/validation/rockridge.demand.json and
# target/membership/rockridge.membership-training.json are the published cross-validation demand and training membership (override CV, MS, MT to point at other copies).
# Every expected hash comes from env.zsh and can be overridden. About 15 minutes.
set -u
MAIN=${MAIN:-$(git rev-parse --show-toplevel)}
DER=${DER:-$MAIN/.claude/worktrees/traffic-derived}
W=${W:-$MAIN/.claude/worktrees/traffic-r55}
BR=calibration-round-55
A=$W/target/r55
CV=${CV:-$DER/target/validation/rockridge.demand.json}
MS=${MS:-$MAIN/target/membership/rockridge.membership.json}
MT=${MT:-$DER/target/membership/rockridge.membership-training.json}
source ${0:A:h}/env.zsh
stop() { log "STOP: $*"; log "A DONE (stopped)"; exit 1; }

# 0. The published baseline, read from MAIN, DER and the given copies before anything is copied
cd $MAIN || exit 1
got="config $(h data/demand/rockridge.config.json) split $(h data/demand/rockridge.split.json) stations $(h data/demand/rockridge.stations.json) network $(h public/data/rockridge.network.json) demand $(h public/data/rockridge.demand.json) cv $(h $CV) membership $(h $MS) training $(h $MT) proposals $(h public/data/rockridge.proposals.json)"
want="config $EXP_CONFIG split $EXP_SPLIT stations $EXP_STATIONS network $EXP_NETWORK demand $EXP_DEMAND cv $EXP_CV membership $EXP_MEMB training $EXP_MEMBT proposals $EXP_PROPOSALS"
echo "published inputs: $got"
[ "$got" = "$want" ] || { echo "the local data is not the published set"; echo "expected: $want"; exit 1; }
git fetch origin ${BR} || exit 1
[ -e $W ] && { echo "$W exists already; remove it (git worktree remove --force $W) or pick another W"; exit 1; }

# 1. The worktree with its own copies of the git-ignored data
git worktree add $W origin/$BR || exit 1
mkdir -p $A
ln -s $MAIN/node_modules $W/node_modules
cd $W || exit 1
mkdir -p public/data data/osm data/demand/raw target/membership target/validation target/published
cp $MAIN/public/data/*.json public/data/
cp -R $MAIN/data/osm/. data/osm/
cp -R $MAIN/data/demand/raw/. data/demand/raw/
cp $CV target/validation/rockridge.demand.json
cp $CV target/published/cv-demand.json
cp $MS target/published/rockridge.membership.json
cp $MT target/published/rockridge.membership-training.json
mkdir -p target/batches
[ -d $MAIN/target/batches/search-c5 ] && cp -R $MAIN/target/batches/search-c5 target/batches/search-c5
rm -rf $A/pd-before; cp -R public/data $A/pd-before
log "START round 55, step A, worktree $W at $(git rev-parse --short HEAD); published data copied; the published membership files are in target/published and not in target/membership (the loop needs them absent)"
log "published inputs: $got"
[ -d target/batches/search-c5 ] && log "search-c5 seed inputs copied: $(ls target/batches/search-c5 | tr '\n' ' ')" || log "NOTE: $MAIN/target/batches/search-c5 is missing; d.zsh needs it (proposals.json, report.md) only if the keep rule passes"

# 2. Builds: the simulator must be the published one
step build cargo build --release -p traffic-sim --bins || stop "release build failed"
FP=$(./target/release/fingerprint); log "fingerprint $FP"
[ "$FP" = $EXP_FP ] || stop "fingerprint is $FP, expected $EXP_FP"
step wasm npm run wasm || stop "npm run wasm failed"

# 3. Tests
step vitest npx vitest run tools/ worker/ src/lib || stop "the TypeScript tests failed (see $A/vitest.log)"
log "vitest: $(grep -E 'Tests ' $A/vitest.log | tail -1)"
step typecheck npx tsc --noEmit || stop "typecheck failed"

# 4. Dry runs: the default plan is the three-pass plan, --iterations 3 spelled out is identical to it, and a cap of $CAP only adds passes
npx tsx tools/membership-loop.ts --dry-run > $A/dry-default.txt 2>&1; RC1=$?
npx tsx tools/membership-loop.ts --dry-run --iterations 3 > $A/dry-3.txt 2>&1; RC2=$?
npx tsx tools/membership-loop.ts --dry-run --iterations $CAP --watch $CH/watch.json > $A/dry-cap.txt 2>&1; RC3=$?
log "dry runs exit=$RC1 $RC2 $RC3"
[ $RC1 = 0 ] && [ $RC2 = 0 ] && [ $RC3 = 0 ] || stop "a dry run failed (see $A/dry-*.txt)"
cmp -s $A/dry-default.txt $A/dry-3.txt && log "default dry run identical to --iterations 3" || stop "the default dry run differs from --iterations 3"
MISS=""
for want in 'the frozen split withholds 78 from the training view' 'shipped pm_peak: 337 selected (245 link, 92 movement or route), 6 stay static' 'shipped am_peak: 272 selected (200 link, 72 movement or route), 6 stay static' 'training pm_peak: 267 selected (198 link, 69 movement or route), 2 stay static, 74 withheld' 'training am_peak: 212 selected (159 link, 53 movement or route), 2 stay static, 64 withheld'; do
  grep -qF "$want" $A/dry-default.txt || MISS="$MISS [$want]"
done
[ -z "$MISS" ] || stop "dry run differs from the expected counts:$MISS"
STEPS3=$(grep -c '^i[0-9]*-\|^final-' $A/dry-default.txt); STEPSC=$(grep -c '^i[0-9]*-\|^final-' $A/dry-cap.txt)
log "dry run: counts as in the derived-targets run; plan steps $STEPS3 with the default (3 passes), $STEPSC with a cap of $CAP"
diff <(grep '^i[0-2]-\|^final-' $A/dry-default.txt) <(grep '^i[0-2]-\|^final-' $A/dry-cap.txt) > $A/dry-plan.diff
log "plan steps of passes 0 to 2 and the final builds, default against cap $CAP: $(wc -l < $A/dry-plan.diff | tr -d ' ') diff lines (expected 0)"
[ ! -s $A/dry-plan.diff ] || stop "the first passes of the plan differ between the default and the cap"

# 5. Baseline assessments under the derived-targets scope, on the published demands, seeds 1 to 10 and fresh seeds 11 to 20 (about 70 s each at --jobs 12)
step base-assess-1-10 npm run assess -- --suffix r55-base --seeds 1-10 --jobs $JOBS || stop "baseline assessment seeds 1-10 failed"
step base-assess-11-20 npm run assess -- --suffix r55-base-fresh --seeds 11-20 --jobs $JOBS || stop "baseline assessment seeds 11-20 failed"
B1=data/calibration/rockridge.assessment-r55-base.md; B2=data/calibration/rockridge.assessment-r55-base-fresh.md
C1=$(node $CH/scripts/keep-rule.cjs --counts $B1 $EXP_COUNTS_1_10); R1=$?
C2=$(node $CH/scripts/keep-rule.cjs --counts $B2 $EXP_COUNTS_11_20); R2=$?
log "baseline counts, seeds 1-10: $C1 (expected $EXP_COUNTS_1_10)"
log "baseline counts, seeds 11-20: $C2 (expected $EXP_COUNTS_11_20)"
[ $R1 = 0 ] && [ $R2 = 0 ] || stop "the baseline does not reproduce the brief's counts: the keep rule was written against other numbers; report to the project lead before the loop"
log "git status: $(git status --short | tr '\n' ';')"
log "A DONE"
