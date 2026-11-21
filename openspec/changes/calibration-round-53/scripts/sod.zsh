#!/bin/zsh
# Round 53 (design D6): `calibrate --select-od` on one shipped demand, seeds 1 to 10, PM and AM, one process per seed (the membership loop's own command), into target/r53/sod-<label>/.
# The files feed scripts/end-along-sim.cjs. Read-only for the model: nothing is written under data/ or public/data/ (--no-write).
# usage: JOBS=12 zsh openspec/changes/calibration-round-53/scripts/sod.zsh <label> <demand.json>
cd "$(git rev-parse --show-toplevel)" || exit 1
L=$1; D=$2; JOBS=${JOBS:-4}
[ -n "$L" ] && [ -f "$D" ] || { echo "usage: sod.zsh <label> <demand.json>"; exit 2; }
mkdir -p target/r53/sod-$L
for P in pm_peak am_peak; do for S in 1 2 3 4 5 6 7 8 9 10; do echo "$P $S $D $L"; done; done | xargs -P $JOBS -L 1 sh -c 'target/release/calibrate --area rockridge --period "$0" --minutes 60 --scale 1 --seed "$1" --demand "$2" --select-od "target/r53/sod-$3/sod-$0-$1.json" --no-write > /dev/null' || { echo "a calibrate run failed"; exit 1; }
ls target/r53/sod-$L | wc -l
