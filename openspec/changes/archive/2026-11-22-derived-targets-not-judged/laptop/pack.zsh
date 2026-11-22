#!/bin/zsh
# Derived targets, laptop run, step D (after c.zsh): packs the candidate outputs for transport as gzip -9 -n ustar archives split into 190000-byte parts (the repository hook stops files over
# 200 KB), with FILES.txt, SHA256SUMS and a round trip. The packed set is a candidate: it replaces nothing published. Then it copies the folder into DEV (the laptop's checkout of the
# development branch, salvatoret/peaceful-fermi-dlwt0u), commits it there and pushes that branch only. Never main, never the data bucket.
#   W=/path/to/traffic-derived DEV=/path/to/traffic zsh openspec/changes/derived-targets-not-judged/laptop/pack.zsh [--no-push]
set -u
W=${W:?set W to the candidate worktree}
DEV=${DEV:?set DEV to the checkout of the development branch}
cd $W || exit 1
A=$W/target/derived
P=openspec/changes/derived-targets-not-judged/evidence/laptop-run
TMP=${TMPDIR:-/tmp}
TAR() { COPYFILE_DISABLE=1 tar --format ustar --no-xattrs --no-mac-metadata --uid 0 --gid 0 --uname root --gname root "$@"; }

rm -rf $P; mkdir -p $P
# What goes in: the candidate demands and membership, the changed reports, both assessments with their report folders, the Assumptions data and the run's own logs and summaries.
FILES=(
  target/validation/rockridge.demand.json
  target/membership/rockridge.membership.json
  target/membership/rockridge.membership-training.json
  public/data/rockridge.assumptions.json
  data/calibration/rockridge.assessment-derived.md
  data/calibration/rockridge.assessment-derived-fresh.md
  data/calibration/validation.json
  data/calibration/validation.md
)
FILES+=(${(f)"$(git status --short data/demand | awk '{print $2}')"})
FILES+=(${(f)"$(find target/assess-variants/derived target/assess-variants/derived-fresh -type f 2>/dev/null | LC_ALL=C sort)"})
FILES+=(${(f)"$(ls $A/*.md $A/*.txt $A/*.diff $A/*.log 2>/dev/null | sed "s#^$W/##" | LC_ALL=C sort)"})
for f in $FILES; do [ -f $f ] || { echo "missing $f"; exit 1; }; done
for f in $FILES; do printf '%s\t%s\t%s\n' "$f" "$(stat -f %z $f)" "$(shasum -a 256 $f | cut -d' ' -f1)"; done > $P/FILES.txt

TAR -cf - ${=FILES} | gzip -9 -n > $TMP/derived-run.tar.gz
split -b 190000 $TMP/derived-run.tar.gz $P/derived-run.tar.gz.part-
{
  awk -F'\t' '{print $3"  "$1}' $P/FILES.txt
  echo "$(shasum -a 256 $TMP/derived-run.tar.gz | cut -d' ' -f1)  derived-run.tar.gz"
  for f in $P/*.part-*; do shasum -a 256 $f; done
} > $P/SHA256SUMS
{
  echo "# Derived targets: candidate outputs of the laptop run"
  echo
  echo "Made by \`openspec/changes/derived-targets-not-judged/laptop/{a,b,c}.zsh\` on $(date '+%Y-%m-%d'), simulator $(./target/release/fingerprint), from \`$(git rev-parse --short HEAD)\`. A candidate: nothing here replaces a published file, and nothing was pushed to the data bucket."
  echo
} > $P/README.md
cat >> $P/README.md <<'EOF'
- `derived-run.tar.gz.part-*`: one tar archive (ustar, paths relative to the repository root), compressed with `gzip -9 -n` and split with `split -b 190000`.
- `FILES.txt`: every file with its size and SHA-256. `SHA256SUMS`: every file, the reassembled archive and every part.
- Start with `target/derived/summary.md` and `target/derived/chain.log` in the archive.

Unpack into an empty folder, never over the published files, and check:

```bash
D=openspec/changes/derived-targets-not-judged/evidence/laptop-run
grep '  openspec/' $D/SHA256SUMS | shasum -a 256 -c
mkdir -p /tmp/derived-run && cat $D/derived-run.tar.gz.part-* | tar -xzf - -C /tmp/derived-run
awk -F'\t' '{print $3"  /tmp/derived-run/"$1}' $D/FILES.txt | shasum -a 256 -c
```
EOF
# Round trip
R=$TMP/derived-roundtrip; rm -rf $R; mkdir -p $R
cat $P/derived-run.tar.gz.part-* | tar -xzf - -C $R
BAD=0; while IFS=$'\t' read -r fp size sum; do s=$(shasum -a 256 $R/$fp | cut -d' ' -f1); [ "$s" = "$sum" ] || { echo "MISMATCH $fp"; BAD=1; }; done < $P/FILES.txt
echo "files $(wc -l < $P/FILES.txt | tr -d ' '), raw bytes $(awk -F'\t' '{s+=$2} END {print s}' $P/FILES.txt); archive $(stat -f %z $TMP/derived-run.tar.gz) bytes in $(ls $P/derived-run.tar.gz.part-* | wc -l | tr -d ' ') parts; round trip $([ $BAD = 0 ] && echo ok || echo FAILED)"
[ $BAD = 0 ] || exit 1
for f in $P/*; do [ $(stat -f %z $f) -le 190000 ] || { echo "$f is over 190000 bytes"; exit 1; }; done

# Transport: the development branch only
[ "${1:-}" = "--no-push" ] && { echo "packed in $W/$P; not copied or pushed (--no-push)"; exit 0; }
cd $DEV || exit 1
[ "$(git branch --show-current)" = "salvatoret/peaceful-fermi-dlwt0u" ] || { echo "$DEV is not on salvatoret/peaceful-fermi-dlwt0u"; exit 1; }
mkdir -p $P && cp $W/$P/* $P/
git add $P
git commit -m "chore(data): candidate outputs of the derived-targets laptop run" -m "Packed as gzip parts under 190 KB with SHA256SUMS. A candidate: nothing published is replaced." -m "Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>" -m "Claude-Session: https://claude.ai/code/session_016YxHPPMRi1e3pLpC882CTB" || exit 1
git push origin salvatoret/peaceful-fermi-dlwt0u
