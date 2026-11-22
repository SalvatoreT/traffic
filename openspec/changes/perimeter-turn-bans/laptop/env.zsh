# Sourced by the perimeter-turn-bans scripts, after A is set to the folder for logs. Every published hash can be overridden from the environment.
# The published model: network 53c823f20d9165ed, shipped demand 2d16d8f8eb0950ca, proposals file c5cbe25f39e61414, seeds file e464cc90ca3e1472,
# simulator 6b886c8f52ee07397773ddd0ebbcb447 (round 52 demand, baseline 522.5 through cars an hour).
: ${EXP_FP:=6b886c8f52ee07397773ddd0ebbcb447}
: ${EXP_NETWORK:=53c823f20d9165ed}
: ${EXP_DEMAND:=2d16d8f8eb0950ca}
: ${EXP_PROPOSALS:=c5cbe25f39e61414}
: ${EXP_SEEDS:=e464cc90ca3e1472}
# The packages the generator writes on this network without a ranking: id and bans, in file order (container run of 2026-11-22).
: ${EXP_PACKAGES:=all-entries=53,all-turns=43,all-turns-access=41,left-turns=21,right-turns=22,street-alcatraz-avenue=6,street-claremont-avenue=12,street-college-avenue=4,street-telegraph-avenue=20,through-streets=19,through-streets-all=23}
: ${JOBS:=12}
: ${PERIODS:=pm_peak,am_peak,midday}
# The published search's flags (calibration-round-52 evidence/search/command.txt), for a check: the seeds are the confirmation seeds, passed as --seeds because --check
# rechecks on --seeds (not --confirm-seeds), and --no-confirm because the two lists may not overlap.
# CHECK_SEEDS and CHECK_MINUTES exist only to smoke-test these scripts at a reduced size; leave them alone for the run.
: ${CHECK_SEEDS:=101-110}
: ${CHECK_MINUTES:=60}
CHECK_FLAGS=(--area rockridge --periods ${PERIODS} --seeds ${CHECK_SEEDS} --no-confirm --beam 5 --depth 6 --candidates 40 --expand 12 --finalists 12 --options 6 --screen-minutes 20 --minutes ${CHECK_MINUTES} --jobs ${JOBS} --no-known)
CH=openspec/changes/perimeter-turn-bans
T=target/turn-bans
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
log() { echo "$(now) $*" | tee -a ${A}/chain.log; }
h() { shasum -a 256 "$1" | cut -c1-16; }
step() { local name=$1; shift; log "${name}: start"; local S0=$(date +%s); "$@" > ${A}/${name}.log 2>&1; local RC=$?; log "${name}: exit=${RC} wall_s=$(( $(date +%s) - S0 ))"; return ${RC}; }
# At the end of every step: the published proposals file, the seeds file and the tracked data must be as they were.
guard() {
  local bad=""
  [ "$(h public/data/rockridge.proposals.json)" = ${EXP_PROPOSALS} ] || bad="${bad} public/data/rockridge.proposals.json"
  [ "$(h data/proposals/rockridge.seeds.json)" = ${EXP_SEEDS} ] || bad="${bad} data/proposals/rockridge.seeds.json"
  local dirty="$(git status --short --untracked-files=no -- data public | tr '\n' ';')"
  [ -z "${dirty}" ] || bad="${bad} tracked files under data/ (${dirty})"
  if [ -n "${bad}" ]; then log "PUBLISHED FILES CHANGED:${bad}; do not use this run"; return 1; fi
  log "published files unchanged (proposals ${EXP_PROPOSALS}, seeds ${EXP_SEEDS}, no tracked change under data/)"
}
export PATH="${HOME}/.cargo/bin:${PATH}"
