#!/bin/zsh
# Derived targets, laptop run, step C (after b.zsh passed): the validation suite and the ten-seed assessments, seeds 1 to 10 and fresh seeds 11 to 20, on the candidate demands.
# Both are variant output sets (--suffix), so nothing published is replaced and nothing is written with --publish. Each assessment prints the pass counts under the new scope (hourly
# counts only) and the old one (derived targets counted), the derived-target tables, D16, D5 and the whole-street traversals. The shipped-demand sections that do not depend on the
# held-out rule (stability, route shares, whole-street traversals) must equal the published assessment's; the summary names every difference.
# No data:push, no /api/ request, no upload token.
#   W=/path/to/traffic-derived zsh openspec/changes/derived-targets-not-judged/laptop/c.zsh
set -u
W=${W:?set W to the candidate worktree}
cd $W || exit 1
A=$W/target/derived
JD=openspec/changes/archive/2026-11-21-restamp-round-52/evidence/laptop/jdiff.cjs
PUBA=data/calibration/rockridge.assessment.md
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
log() { echo "$(now) $*" | tee -a $A/chain.log; }
h() { shasum -a 256 "$1" | cut -c1-16; }
stop() { log "STOP: $*"; log "C DONE (stopped)"; exit 1; }
step() { local name=$1; shift; log "$name: start"; local S=$(date +%s); "$@" > $A/$name.log 2>&1; local RC=$?; log "$name: exit=$RC wall_s=$(( $(date +%s) - S ))"; return $RC; }
export PATH="$HOME/.cargo/bin:$PATH"

[ "$(h public/data/rockridge.demand.json)" = 2d16d8f8eb0950ca ] || stop "the shipped demand is not the published one"
log "START derived targets, step C, shipped demand $(h public/data/rockridge.demand.json), cross-validation demand $(h target/validation/rockridge.demand.json), training membership $(h target/membership/rockridge.membership-training.json)"

# 1. Validation suite (about 20 s). Same simulator: the report must be what is committed, apart from the revision stamp.
step validate ./target/release/validate || stop "validate failed"
log "validate: $(grep -E 'cases pass' $A/validate.log)"
grep -q '67 of 74 cases pass' $A/validate.log || stop "validation is not 67 of 74"
git show HEAD:data/calibration/validation.json > $A/validation.head.json
node $JD $A/validation.head.json data/calibration/validation.json --ignore manifest.simulator.revision > $A/validation-diff.txt 2>&1 && log "validation.json: identical to the committed one apart from the revision" || stop "validation.json changed: $(head -5 $A/validation-diff.txt | tr '\n' ' ')"
git diff --quiet data/calibration/validation.md && log "validation.md unchanged" || stop "validation.md changed"

# 2. Assessments (about 70 s each at --jobs 12)
step assess-1-10 npm run assess -- --suffix derived --seeds 1-10 --jobs 12 || stop "assess seeds 1-10 failed (exit 3 lists the problems in $A/assess-1-10.log)"
step assess-11-20 npm run assess -- --suffix derived-fresh --seeds 11-20 --jobs 12 || stop "assess seeds 11-20 failed (exit 3 lists the problems in $A/assess-11-20.log)"
S1=data/calibration/rockridge.assessment-derived.md; S2=data/calibration/rockridge.assessment-derived-fresh.md
for f in $S1 $S2; do grep -q 'Suggested status' $f || stop "$f has no verdict"; log "$f: $(grep -m1 'Suggested status' $f | cut -c1-260)"; done

# 3. Summary for the project lead
npx tsx tools/derived-assessment-summary.ts published=$PUBA seeds-1-10=$S1 seeds-11-20=$S2 > $A/summary.md
log "summary written to $A/summary.md ($(wc -l < $A/summary.md | tr -d ' ') lines)"

# 4. What must not move: the shipped-demand sections that do not depend on the held-out rule
pick() { grep -E '^\*\*Stability rule \(D16\)|^\| (am_peak|pm_peak) \| (Hillegass|Colby) |^Headline shares:' $1 | sed -E 's/ on 2026-[0-9]{2}-[0-9]{2}//'; }
diff <(pick $PUBA) <(pick $S1) > $A/shipped-sections.diff; N=$(wc -l < $A/shipped-sections.diff | tr -d ' ')
log "D16, headline shares and whole-street rows, published vs seeds 1-10: $N diff lines (0 expected: the shipped demand and simulator are the published ones)"
[ $N = 0 ] || log "NOTE: $A/shipped-sections.diff is not empty; the lead decides (the shipped demand is byte-identical, so a difference means a different run setup)"

# 5. The figures the project lead asked for, side by side
for f in $S1 $S2; do
  echo "== $f" | tee -a $A/chain.log
  grep -E '^\| (am_peak|midday|pm_peak) \| (pass|FAIL)' $f | tee -a $A/chain.log
  sed -n '/^| Period | New scope/,/^$/p' $f | tee -a $A/chain.log
done
log "C DONE"
