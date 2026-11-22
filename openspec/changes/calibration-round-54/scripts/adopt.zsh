#!/bin/zsh
# Round 54, stage 2 step 1 (only after stage 1 met its bar and the project lead said to go on): flip params::SINGLE_CONTROL_CHARGE to true in the checkout, so that calibrate, assess,
# the membership loop, explore and the WASM build all route with the control delay charged once. Builds, runs the Rust tests, builds the WASM and records the new fingerprint.
# Commits on the checked-out branch only. No data:push, no /api/, no upload token.
#   zsh openspec/changes/calibration-round-54/scripts/adopt.zsh
cd "$(git rev-parse --show-toplevel)" || exit 1
R=target/r54; CH=openspec/changes/calibration-round-54
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
log() { echo "$(now) $*" | tee -a $R/chain.log; }
mkdir -p $R $CH/evidence
log "START adoption at $(git rev-parse --short HEAD); status: $(git status --short | tr '\n' ';')"
grep -q '^pub const SINGLE_CONTROL_CHARGE: bool = false;' crates/sim/src/params.rs || { log "SINGLE_CONTROL_CHARGE is not false in params.rs, stop"; exit 1; }
cargo build --release -p traffic-sim --bin fingerprint > $R/build0.log 2>&1 || { log "build failed, stop"; exit 1; }
FP0=$(./target/release/fingerprint); log "fingerprint with the option off: $FP0"
sed -i.bak 's/^pub const SINGLE_CONTROL_CHARGE: bool = false;/pub const SINGLE_CONTROL_CHARGE: bool = true;/' crates/sim/src/params.rs && rm -f crates/sim/src/params.rs.bak
git diff --stat crates/sim/src/params.rs | tee -a $R/chain.log
S0=$(date +%s); cargo build --release > $R/build1.log 2>&1 || { log "build failed, stop"; exit 1; }
log "build: wall_s=$(( $(date +%s) - S0 ))"
FP1=$(./target/release/fingerprint); log "fingerprint with the option on by default: $FP1"
S0=$(date +%s); cargo test -p traffic-sim --release > $R/cargo-test.log 2>&1; RC=$?
log "cargo test exit=$RC wall_s=$(( $(date +%s) - S0 )); $(grep -E '^test result' $R/cargo-test.log | awk '{p+=$4; f+=$6} END {print p " passed, " f " failed"}')"
grep -E 'FAILED|panicked' $R/cargo-test.log | head -20 | tee -a $R/chain.log
[ $RC = 0 ] || { log "tests fail with the option on by default: report the failing tests, do not edit them, stop"; exit 1; }
npm run wasm > $R/wasm.log 2>&1 || { log "npm run wasm failed, stop"; exit 1; }
npm run check:wasm > $R/check-wasm.log 2>&1; log "check:wasm exit=$? ($(tail -1 $R/check-wasm.log | cut -c1-200))"
echo "off $FP0
on $FP1" > $CH/evidence/fingerprints.txt
git add crates/sim/src/params.rs $CH/evidence/fingerprints.txt
git commit -m "feat(sim): adopt the single control charge in the router" -m "Flips params::SINGLE_CONTROL_CHARGE for calibration round 54 stage 2. Fingerprint $FP0 -> $FP1." -m "Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>" -m "Claude-Session: https://claude.ai/code/session_016YxHPPMRi1e3pLpC882CTB"
log "DONE adoption: committed on $(git branch --show-current) at $(git rev-parse --short HEAD); the published model needs the restamp of data/README.md if this round is adopted"
