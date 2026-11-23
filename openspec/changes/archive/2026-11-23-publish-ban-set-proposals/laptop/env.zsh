# Sourced by the publish-ban-set-proposals scripts, after A is set to the folder for logs (${W}/target/publish-bs). Every published hash can be overridden from the environment.
# The published model: network 53c823f20d9165ed, shipped demand 2d16d8f8eb0950ca, simulator 6b886c8f52ee07397773ddd0ebbcb447 (round 52 demand, baseline 522.5 through cars an hour).
# BEFORE is the proposals file published on 2026-11-20 and restamped on 2026-11-21 (c5cbe25f39e61414) and its seeds file (e464cc90ca3e1472).
: ${EXP_FP:=6b886c8f52ee07397773ddd0ebbcb447}
: ${EXP_NETWORK:=53c823f20d9165ed}
: ${EXP_DEMAND:=2d16d8f8eb0950ca}
: ${EXP_PROPOSALS:=c5cbe25f39e61414}
: ${EXP_SEEDS:=e464cc90ca3e1472}
: ${JOBS:=12}
: ${PERIODS:=pm_peak,am_peak,midday}
# The published search's flags (restamp-round-52 evidence/laptop/search-command.txt) plus --ban-sets. SMOKE=1 shrinks the search to a few minutes to test these scripts; leave it unset for the run.
if [ -n "${SMOKE:-}" ]; then
  SEARCH_FLAGS=(--periods pm_peak --seeds 1 --no-confirm --beam 2 --depth 4 --candidates 10 --expand 4 --finalists 4 --options 6 --screen-minutes 5 --minutes 10)
else
  SEARCH_FLAGS=(--periods ${PERIODS} --seeds 1-3 --confirm-seeds 101-110 --beam 5 --depth 6 --candidates 40 --expand 12 --finalists 12 --options 6 --screen-minutes 20 --minutes 60)
fi
CH=openspec/changes/publish-ban-set-proposals
T=target/publish-bs
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
log() { echo "$(now) $*" | tee -a ${A}/chain.log; }
h() { shasum -a 256 "$1" | cut -c1-16; }
step() { local name=$1; shift; log "${name}: start"; local S0=$(date +%s); "$@" > ${A}/${name}.log 2>&1; local RC=$?; log "${name}: exit=${RC} wall_s=$(( $(date +%s) - S0 ))"; return ${RC}; }
# A 60-second limit for anything that talks to GitHub over SSH (it hangs while the SSH agent is locked); runs without a limit where neither timeout nor gtimeout exists.
tmo() { if command -v timeout > /dev/null; then timeout 60 "$@"; elif command -v gtimeout > /dev/null; then gtimeout 60 "$@"; else "$@"; fi }
export PATH="${HOME}/.cargo/bin:${PATH}"
