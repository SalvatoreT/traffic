#!/bin/zsh
# Derived targets, laptop run, step A: set up a candidate worktree, verify the published baseline, build, test, and check the split and the dry run.
# Nothing here touches the published local data: the candidate work happens in a second worktree with its own copies of the ignored data files.
# No data:push, no /api/ request, no upload token. Run from the checkout that holds the published local data (MAIN).
#   MAIN=/path/to/traffic W=/path/to/traffic-derived zsh openspec/changes/derived-targets-not-judged/laptop/a.zsh
set -u
MAIN=${MAIN:-$(git rev-parse --show-toplevel)}
W=${W:-$MAIN/../traffic-derived}
BR=derived-targets-not-judged
A=$W/target/derived
EXPECT_FP=6b886c8f52ee07397773ddd0ebbcb447
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
log() { echo "$(now) $*" | tee -a $A/chain.log; }
h() { shasum -a 256 "$1" | cut -c1-16; }
stop() { log "STOP: $*"; log "A DONE (stopped)"; exit 1; }
step() { local name=$1; shift; log "$name: start"; local S=$(date +%s); "$@" > $A/$name.log 2>&1; local RC=$?; log "$name: exit=$RC wall_s=$(( $(date +%s) - S ))"; return $RC; }
export PATH="$HOME/.cargo/bin:$PATH"

# 0. The published baseline, read from MAIN before anything is copied
cd $MAIN || exit 1
PUB="config $(h data/demand/rockridge.config.json) split $(h data/demand/rockridge.split.json) stations $(h data/demand/rockridge.stations.json) network $(h public/data/rockridge.network.json) demand $(h public/data/rockridge.demand.json) cv $(h target/validation/rockridge.demand.json) membership $(h target/membership/rockridge.membership.json) $(h target/membership/rockridge.membership-training.json) proposals $(h public/data/rockridge.proposals.json)"
echo "published inputs in MAIN: $PUB"
[ "$PUB" = "config 2405ff02c92b2837 split be72380b485ec5fc stations c9db41c930acf37d network 53c823f20d9165ed demand 2d16d8f8eb0950ca cv 1c3b1666f24156f1 membership 56e688e7e5749d23 cf32e3e0d9e6f23e proposals c5cbe25f39e61414" ] || {
  echo "The local data is not the round 52 published set: $PUB"; exit 1; }
git fetch origin $BR || exit 1

# 1. Candidate worktree with its own copies of the ignored data
[ -e $W ] && { echo "$W exists already; remove it (git worktree remove --force $W) or pick another W"; exit 1; }
git worktree add $W origin/$BR || exit 1
mkdir -p $A
ln -s $MAIN/node_modules $W/node_modules
cd $W || exit 1
mkdir -p public/data data/osm data/demand/raw target/membership target/validation target/published
cp $MAIN/public/data/*.json public/data/
cp -R $MAIN/data/osm/. data/osm/
cp -R $MAIN/data/demand/raw/. data/demand/raw/
cp $MAIN/target/validation/rockridge.demand.json target/published/cv-demand.json
cp $MAIN/target/membership/rockridge.membership.json $MAIN/target/membership/rockridge.membership-training.json target/published/
rm -rf $A/pd-before; cp -R public/data $A/pd-before
log "START derived targets, step A, worktree $W at $(git rev-parse --short HEAD); published local data copied; the published membership files are in target/published and not in target/membership (the loop needs them absent)"
log "published inputs in MAIN: $PUB"

# 2. Builds: the simulator must be the published one
step build cargo build --release -p traffic-sim --bins || stop "release build failed"
FP=$(./target/release/fingerprint); log "fingerprint $FP"
[ "$FP" = $EXPECT_FP ] || stop "fingerprint is $FP, expected $EXPECT_FP"
step wasm npm run wasm || stop "npm run wasm failed"

# 3. Tests
step vitest npx vitest run tools/ worker/ src/lib || stop "the TypeScript tests failed (see $A/vitest.log)"
log "vitest: $(grep -E 'Tests ' $A/vitest.log | tail -1)"
step typecheck npx tsc --noEmit || stop "typecheck failed"
step cargo-test cargo test --release -p traffic-sim --bin calibrate || stop "cargo test of calibrate failed"

# 4. The split: re-freezing reproduces the committed draw (groups and held flags); only the retained-note sentence may differ (drift already on main)
step freeze npx tsx tools/build-demand.ts --freeze-split --out-root $A/split || stop "the freeze failed"
node -e "
const a=JSON.parse(require('fs').readFileSync('$A/split/data/demand/rockridge.split.json')),b=JSON.parse(require('fs').readFileSync('data/demand/rockridge.split.json'));
delete a.retained; delete b.retained;
process.exit(JSON.stringify(a)===JSON.stringify(b)?0:1)" && log "re-frozen split: groups and held flags identical to the committed manifest (the retained note may differ)" || stop "the re-frozen split differs from the committed one in groups or held flags"
log "committed split hash $(h data/demand/rockridge.split.json) (the file is not replaced)"

# 5. Which stations are derived targets and what the rule does to them
npx tsx tools/derived-targets-report.ts --out $A/derived-stations.md
cmp -s $A/derived-stations.md openspec/changes/derived-targets-not-judged/evidence/derived-stations.md && log "derived-stations report identical to the committed one" || stop "derived-stations report differs from the committed one"

# 6. Dry run of the loop: the shipped counts are round 52's, the training counts move by the derived targets
npx tsx tools/membership-loop.ts --dry-run > $A/dry-run.txt 2>&1; RC=$?; log "dry run exit=$RC"
MISS=""
for want in 'the frozen split withholds 78 from the training view' 'shipped pm_peak: 337 selected (245 link, 92 movement or route), 6 stay static' 'shipped am_peak: 272 selected (200 link, 72 movement or route), 6 stay static' 'training pm_peak: 267 selected (198 link, 69 movement or route), 2 stay static, 74 withheld' 'training am_peak: 212 selected (159 link, 53 movement or route), 2 stay static, 64 withheld'; do
  grep -qF "$want" $A/dry-run.txt || MISS="$MISS [$want]"
done
[ $RC = 0 ] && [ -z "$MISS" ] || stop "dry run differs from the expected counts:$MISS"
log "dry run: shipped selection equals round 52's; training selects 11 more stations a period (the 6 AADT stations and 5 ramps that were held out) and 2 gates stay static"
log "A DONE"
