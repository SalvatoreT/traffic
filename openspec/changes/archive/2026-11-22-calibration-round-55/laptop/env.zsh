# Sourced by the round 55 scripts. Every published hash can be overridden from the environment; the defaults are the published model under the derived-targets scope
# (demand 2d16d8f8eb0950ca, cross-validation demand e1a9d4bd50539355, membership files 56e688e7e5749d23 and 969794a26ac14f84, simulator 6b886c8f52ee07397773ddd0ebbcb447).
: ${EXP_FP:=6b886c8f52ee07397773ddd0ebbcb447}
: ${EXP_CONFIG:=2405ff02c92b2837}
: ${EXP_SPLIT:=be72380b485ec5fc}
: ${EXP_STATIONS:=c9db41c930acf37d}
: ${EXP_NETWORK:=53c823f20d9165ed}
: ${EXP_DEMAND:=2d16d8f8eb0950ca}
: ${EXP_CV:=e1a9d4bd50539355}
: ${EXP_MEMB:=56e688e7e5749d23}
: ${EXP_MEMBT:=969794a26ac14f84}
: ${EXP_PROPOSALS:=c5cbe25f39e61414}
# Baseline station counts of the derived-targets scope, from the project lead's brief of 2026-11-22 (pm_fitted, pm_held, am_fitted, am_held).
: ${EXP_COUNTS_1_10:=pm_fitted=79,pm_held=15,am_fitted=72,am_held=15}
: ${EXP_COUNTS_11_20:=pm_fitted=80,pm_held=15,am_fitted=74,am_held=15}
: ${CAP:=8}
: ${JOBS:=12}
CH=openspec/changes/calibration-round-55
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
log() { echo "$(now) $*" | tee -a $A/chain.log; }
h() { shasum -a 256 "$1" | cut -c1-16; }
step() { local name=$1; shift; log "$name: start"; local S0=$(date +%s); "$@" > $A/$name.log 2>&1; local RC=$?; log "$name: exit=$RC wall_s=$(( $(date +%s) - S0 ))"; return $RC; }
export PATH="$HOME/.cargo/bin:$PATH"
