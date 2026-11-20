#!/bin/zsh
# Round 52 adoption, laptop steps (lead plan of 2026-11-20). Run after origin/adopt-round-52 is merged into the dev branch and the tree is clean.
# Builds, regenerates data, validates, publishes the ten-seed assessment, then redistribution, results, assumptions, llms and previews.
# Stops (and says why) on any input mismatch, a validation change beyond the revision field, or a keep-rule line that differs from round 52.
# No data:push, no /api/, no upload token. Holds target/batches/worktree.lock.
cd "$(git rev-parse --show-toplevel)" || exit 1
A=target/adopt52; K=target/batches/worktree.lock; EV52=openspec/changes/calibration-round-52/evidence
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
log() { echo "$(now) $*" | tee -a $A/chain.log; }
h() { shasum -a 256 "$1" | cut -c1-16; }
stop() { log "STOP: $*"; log "status: $(git status --short | tr '\n' ';')"; rm -rf $K; log "ALL DONE (stopped)"; exit 1; }
step() { local name=$1; shift; log "$name: start"; local S=$(date +%s); "$@" > $A/$name.log 2>&1; local RC=$?; log "$name: exit=$RC wall_s=$(( $(date +%s) - S ))"; return $RC; }
mkdir $K 2>/dev/null || { echo "lock held: $(cat $K/owner 2>/dev/null)"; exit 1; }; echo "adopt52 $$ $(date)" > $K/owner
log "START round 52 adoption steps at $(git rev-parse --short HEAD) on $(git branch --show-current)"

# Inputs from the merged branch
ST=$(git status --short | grep -v '^?? .agents/$')
[ -z "$ST" ] || stop "tree not clean before start: $(echo $ST | tr '\n' ';')"
CH=$(h data/demand/rockridge.config.json); PP=$(h public/data/rockridge.proposals.json)
M="$(h target/membership/rockridge.membership.json) $(h target/membership/rockridge.membership-training.json)"
log "inputs: config $CH; proposals $PP; membership $M; seeds file $(h data/proposals/rockridge.seeds.json)"
[ "$CH" = 2405ff02c92b2837 ] || stop "config is $CH, expected 2405ff02c92b2837"
[ "$PP" = 197a99cdafc026f8 ] || stop "public/data/rockridge.proposals.json is $PP, expected 197a99cdafc026f8"
[ "$M" = "3d639670c1feb38f c1cd4ce96fb28791" ] || stop "membership files are $M"

# 1. Builds
export PATH="$HOME/.cargo/bin:$PATH"
step build cargo build --release -p traffic-sim --bin calibrate --bin validate --bin fingerprint || stop "release build failed"
FP=$(./target/release/fingerprint); log "fingerprint $FP"
[ "$FP" = d45a275dd7be0713cec6a64394b7d8a9 ] || stop "fingerprint is $FP"
step wasm npm run wasm || stop "npm run wasm failed"

# 2. Data
step data npm run data || stop "npm run data failed"
H="$(h public/data/rockridge.network.json) $(h public/data/rockridge.demand.json) $(h target/validation/rockridge.demand.json)"
log "hashes after data: $H; status: $(git status --short | tr '\n' ';')"
[ "$H" = "53c823f20d9165ed 2d16d8f8eb0950ca 1c3b1666f24156f1" ] || stop "hashes after npm run data are $H"
DD=$(git status --short data/demand data/areas | tr '\n' ';')
[ -z "$DD" ] && log "fit reports, audit and area config identical to the committed ones" || { log "NOTE: data/demand or data/areas differ from the committed files after npm run data: $DD"; git diff --stat data/demand data/areas > $A/data-diff.txt; }
step parity npm run check:wasm || stop "WASM parity check failed"
log "parity: $(tail -2 $A/parity.log | tr '\n' ' ')"

# 3. Validate, before assess
step validate ./target/release/validate || stop "validate failed"
log "validate: $(grep -E 'cases pass' $A/validate.log)"
grep -q '67 of 74 cases pass' $A/validate.log || stop "validation is not 67 of 74"
node $A/valdiff.cjs > $A/valdiff.txt 2>&1; RC=$?; log "validation diff: $(tr '\n' ' ' < $A/valdiff.txt | cut -c1-600)"
[ $RC = 0 ] || { git checkout data/calibration/validation.json data/calibration/validation.md; stop "validation changed beyond the revision field (files checked out)"; }

# 4. Published ten-seed assessment
step assess npm run assess -- --publish --noise --jobs 12 || stop "assess failed"
AM=data/calibration/rockridge.assessment.md
grep -q 'Suggested status' $AM || stop "the assessment has no verdict (calibrate missing or skipped?): $(tail -3 $A/assess.log | tr '\n' ' ')"
log "assessment inputs: $(grep -m1 'Inputs (SHA-256' $AM | cut -c1-300)"
log "assessment verdict: $(grep -m1 'Suggested status' $AM | cut -c1-300)"
log "round 52 verdict:   $(grep -m1 'Suggested status' $EV52/rockridge.assessment-r52.md | cut -c1-300)"
grep -m1 'Inputs (SHA-256' $AM | grep -q 'network 53c823f20d91, shipped demand 2d16d8f8eb09 (built as shipped), cross-validation demand 1c3b1666f241' || stop "assessment inputs are not the round 52 inputs"
node target/r52/keep.cjs $AM $A/validate.log > $A/keep-rule.md 2>&1
log "keep rule: $(tail -1 $A/keep-rule.md)"
diff <(grep '^| ' $A/keep-rule.md) <(grep '^| ' $EV52/keep-rule.md) > $A/keep-diff.txt && log "keep-rule table identical to round 52" || stop "keep-rule table differs from round 52: $(tr '\n' ' ' < $A/keep-diff.txt | cut -c1-600)"
diff -q <(grep '^Whole-street rows' $A/keep-rule.md) <(grep '^Whole-street rows' $EV52/keep-rule.md) >/dev/null && log "whole-street rows identical to round 52" || log "whole-street rows differ in detail from round 52 (table lines identical)"
diff <(sed -n '/^## Verdict/,$p' $AM) <(sed -n '/^## Verdict/,$p' $EV52/rockridge.assessment-r52.md) > $A/verdict-diff.txt; log "verdict section vs round 52: $(wc -l < $A/verdict-diff.txt | tr -d ' ') diff lines"
cmp -s public/data/rockridge.noise.json target/assess-variants/r52/rockridge.noise.json && log "noise file identical to round 52's ($(h public/data/rockridge.noise.json))" || log "noise file differs from round 52's: $(h public/data/rockridge.noise.json) vs $(h target/assess-variants/r52/rockridge.noise.json)"

# 5. Redistribution, results, assumptions, text pages, previews
step redistribution npm run data:redistribution -- --jobs 8 || stop "data:redistribution failed"
step results npm run data:results -- --jobs 6 || stop "data:results failed"
step assumptions npm run data:assumptions || stop "data:assumptions failed"
step llms npm run data:llms || stop "data:llms failed"
step previews npm run data:previews || stop "data:previews failed"
log "previews: $(grep -i 'skip' $A/previews.log | tr '\n' ' ' | cut -c1-400)"
log "llms: $(grep -i 'out of date' $A/llms.log | tr '\n' ' ' | cut -c1-300)"

log "final hashes: network $(h public/data/rockridge.network.json) demand $(h public/data/rockridge.demand.json) cv $(h target/validation/rockridge.demand.json) proposals $(h public/data/rockridge.proposals.json) config $(h data/demand/rockridge.config.json)"
log "files: results $(ls public/data/results/rockridge | wc -l | tr -d ' '), redistribution $(ls public/data/redistribution/rockridge 2>/dev/null | wc -l | tr -d ' '), llms $(ls public/data/llms | wc -l | tr -d ' '), og $(ls public/data/og | wc -l | tr -d ' '); public/data $(du -sk public/data | cut -f1) KB"
log "status: $(git status --short | tr '\n' ';')"
rm -rf $K
log "ALL DONE"
