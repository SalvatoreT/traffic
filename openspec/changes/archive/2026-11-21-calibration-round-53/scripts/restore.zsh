#!/bin/zsh
# Round 53: put the published round 52 model back after the candidate's loop, whatever the verdict. Restores the committed config, the published membership files (the demand build stops on
# membership evidence that does not match the config, and the published files are needed to rebuild the baseline), rebuilds both demand views with `npm run data` and checks
# demand 2d16d8f8eb0950ca and cross-validation demand 1c3b1666f24156f1 (network 53c823f20d9165ed). Needs target/r53/published-membership/ (saved by the runbook before the loop).
# The candidate's membership files stay in target/r53/cand-membership/ (the runbook copies them there after the loop); this script saves them again if that folder is missing.
# usage: zsh openspec/changes/calibration-round-53/scripts/restore.zsh [logfile]
cd "$(git rev-parse --show-toplevel)" || exit 1
T=target/r53; LOG=${1:-$T/restore.log}
BASE_HASHES="53c823f20d9165ed 2d16d8f8eb0950ca 1c3b1666f24156f1 "; PUB_MEMB="56e688e7e5749d23 cf32e3e0d9e6f23e "
[ -d $T/published-membership ] || { echo "no $T/published-membership: nothing to restore from, stop" | tee -a $LOG; exit 1; }
hashes3() { sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json | cut -c1-16 | tr '\n' ' '; }
memb2() { sha256sum target/membership/rockridge.membership.json target/membership/rockridge.membership-training.json | cut -c1-16 | tr '\n' ' '; }
say() { echo "$(date '+%Y-%m-%d %I:%M:%S %p %Z') $*" | tee -a $LOG; }
git checkout data/demand
if [ ! -d $T/cand-membership ] && [ -d target/membership ] && [ "$(memb2)" != "$PUB_MEMB" ]; then mkdir -p $T/cand-membership; cp target/membership/*.json $T/cand-membership/; say "saved the candidate's membership files in $T/cand-membership"; fi
mkdir -p target/membership; cp $T/published-membership/*.json target/membership/
say "published membership files back: $(memb2) (expected $PUB_MEMB)"
npm run data > $T/data-restore.log 2>&1; RC=$?
H=$(hashes3)
say "npm run data exit=$RC; hashes $H (expected $BASE_HASHES); config $(shasum -a 256 data/demand/rockridge.config.json | cut -c1-16) (expected 2405ff02c92b2837); status: $(git status --short | tr '\n' ';')"
if [ "$H" = "$BASE_HASHES" ] && [ "$(memb2)" = "$PUB_MEMB" ]; then say "restore verified: demand 2d16d8f8eb0950ca and cross-validation demand 1c3b1666f24156f1"; else say "RESTORE DOES NOT MATCH THE PUBLISHED MODEL: stop and report"; exit 1; fi
