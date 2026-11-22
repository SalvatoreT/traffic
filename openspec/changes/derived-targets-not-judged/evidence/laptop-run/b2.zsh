#!/bin/zsh
# Derived targets, laptop run, step B resumed after the loop (b2.zsh, laptop fix): b.zsh steps 2 to 5 unchanged, except that the shipped membership check compares after replacing the worktree path (traffic-derived -> batch) in the source strings.
# Under the rule, the shipped side must come out exactly as published (demand 2d16d8f8eb0950ca, shipped membership 56e688e7e5749d23, stations file, split file, config);
# only the cross-validation demand, the training membership file and the fit reports of the training view may change. Stops on any other difference.
# No data:push, no /api/ request, no upload token. The published local data in MAIN is not touched.
#   W=/path/to/traffic-derived zsh openspec/changes/derived-targets-not-judged/laptop/b.zsh
set -u
W=${W:?set W to the candidate worktree}
cd $W || exit 1
A=$W/target/derived
JD=openspec/changes/archive/2026-11-21-restamp-round-52/evidence/laptop/jdiff.cjs
EXPECT_FP=6b886c8f52ee07397773ddd0ebbcb447
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
log() { echo "$(now) $*" | tee -a $A/chain.log; }
h() { shasum -a 256 "$1" | cut -c1-16; }
stop() { log "STOP: $*"; log "status: $(git status --short | tr '\n' ';')"; log "B DONE (stopped)"; exit 1; }
step() { local name=$1; shift; log "$name: start"; local S=$(date +%s); "$@" > $A/$name.log 2>&1; local RC=$?; log "$name: exit=$RC wall_s=$(( $(date +%s) - S ))"; return $RC; }
export PATH="$HOME/.cargo/bin:$PATH"
log "START derived targets, step B resumed at step 2 (b2.zsh): b.zsh stopped on the shipped membership byte check; the only differences were the six source strings that name the worktree path"

# 2. Membership files against the published ones
sed 's#/\.claude/worktrees/traffic-derived/#/.claude/worktrees/batch/#g' target/membership/rockridge.membership.json > $A/membership-shipped.path-normalized.json
cmp -s $A/membership-shipped.path-normalized.json target/published/rockridge.membership.json && log "shipped membership: byte-identical to the published file once the worktree path in its source strings is set back to batch ($(h $A/membership-shipped.path-normalized.json); as produced $(h target/membership/rockridge.membership.json))" || {
  node $JD target/published/rockridge.membership.json target/membership/rockridge.membership.json > $A/membership-diff.txt 2>&1; stop "the shipped membership differs from the published file: $(head -5 $A/membership-diff.txt | tr '\n' ' ')"; }
node $JD target/published/rockridge.membership-training.json target/membership/rockridge.membership-training.json > $A/membership-training-diff.txt 2>&1
log "training membership: new $(h target/membership/rockridge.membership-training.json), published $(h target/published/rockridge.membership-training.json); $(head -1 $A/membership-training-diff.txt | sed 's/.* vs [^:]*: //') (expected: evidence.withheld added, the pairs of the 11 stations that are now fitted added, the others close to the published ones)"
node -e "const j=JSON.parse(require('fs').readFileSync('target/membership/rockridge.membership-training.json'));process.exit(j.evidence&&j.evidence.withheld?0:1)" || stop "the training membership has no evidence.withheld"

# 3. Both demand builds on the new membership files (the loop's last builds are the same; these are the ones the identity rule is read from)
step build-shipped npx tsx tools/build-demand.ts || stop "the shipped demand build failed"
step build-training npx tsx tools/build-demand.ts --view training || stop "the training demand build failed"
H="$(h public/data/rockridge.network.json) $(h public/data/rockridge.demand.json)"
log "network and shipped demand: $H (published 53c823f20d9165ed 2d16d8f8eb0950ca)"
[ "$H" = "53c823f20d9165ed 2d16d8f8eb0950ca" ] || stop "the network or the shipped demand is not the published one"
log "cross-validation demand: new $(h target/validation/rockridge.demand.json), published $(h target/published/cv-demand.json) (1c3b1666f24156f1 expected); a change is expected"
cmp -s public/data/rockridge.demand.json $A/pd-before/rockridge.demand.json && log "shipped demand byte-identical to the published file" || stop "the shipped demand differs from the published file"

# 4. Tracked files that must not change, and the ones that may
for f in data/demand/rockridge.stations.json data/demand/rockridge.split.json data/demand/rockridge.groups.json data/demand/rockridge.config.json data/areas/rockridge.json; do
  git diff --quiet -- $f || stop "$f changed; under the rule it must stay as committed"
done
log "stations, split, groups, config and area files unchanged"
git diff --stat > $A/data-diff.txt; log "changed tracked files: $(git status --short | tr '\n' ';')"
UNEXPECTED=$(git status --short | grep -v -E 'data/demand/rockridge\.(fit|audit)' || true)
[ -z "$UNEXPECTED" ] || stop "unexpected changed files: $UNEXPECTED"
# The shipped fit report may differ only in the two note lines that describe the held-out rule
git diff -U0 -- data/demand/rockridge.fit.md | grep -E '^[+-]' | grep -vE '^(\+\+\+|---)' | grep -vE 'validation set \(frozen split|derived targets \(change derived-targets-not-judged\)' > $A/fit-diff-other.txt
[ ! -s $A/fit-diff-other.txt ] && log "shipped fit report differs only in the held-out rule notes" || { log "shipped fit report differs elsewhere: $(head -3 $A/fit-diff-other.txt | cut -c1-200 | tr '\n' ' ')"; stop "the shipped fit report changed beyond the notes (see $A/fit-diff-other.txt)"; }
for f in data/demand/rockridge.audit.md; do git diff --quiet -- $f || stop "$f changed"; done

# 5. The Assumptions data (a candidate: public/data in this worktree only)
step assumptions npx tsx tools/build-assumptions.ts || stop "build-assumptions failed"
node $JD $A/pd-before/rockridge.assumptions.json public/data/rockridge.assumptions.json --ignore generated --ignore derivedTargets > $A/assumptions-diff.txt 2>&1 && log "assumptions: differ from the published file only in generated and the new derivedTargets section ($(node -e "console.log(JSON.parse(require('fs').readFileSync('public/data/rockridge.assumptions.json')).derivedTargets.stations.length)") stations)" || stop "the assumptions data differ beyond derivedTargets: $(head -5 $A/assumptions-diff.txt | tr '\n' ' ')"
log "B DONE"
