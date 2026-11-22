#!/bin/zsh
# Round 54: packs the evidence of a stage for transport as gzip -9 -n ustar archives split into 190000-byte parts (the repository hook stops files over 200 KB), with FILES.txt, SHA256SUMS
# and a round trip, then copies the folder into DEV (the laptop's checkout of the development branch salvatoret/peaceful-fermi-dlwt0u), commits it there and pushes that branch only.
# Never main, never the data bucket, no upload token, no /api/. STAGE is stage1 or stage2; --no-push stops after the round trip.
#   STAGE=stage1 W=/path/to/round-54-checkout DEV=/path/to/traffic zsh openspec/changes/calibration-round-54/scripts/pack.zsh [--no-push]
set -u
W=${W:?set W to the round 54 checkout}
DEV=${DEV:?set DEV to the checkout of the development branch}
STAGE=${STAGE:?set STAGE to stage1 or stage2}
cd $W || exit 1
CH=openspec/changes/calibration-round-54
P=$CH/evidence/laptop-$STAGE
TMP=${TMPDIR:-/tmp}
TAR() { COPYFILE_DISABLE=1 tar --format ustar --no-xattrs --no-mac-metadata --uid 0 --gid 0 --uname root --gname root "$@"; }
rm -rf $P; mkdir -p $P
FILES=()
case $STAGE in
  stage1)
    FILES+=(${(f)"$(find target/r54-stage1 -maxdepth 1 -type f \( -name '*.md' -o -name '*.log' \) | LC_ALL=C sort)"})
    FILES+=(${(f)"$(find $CH/evidence/stage1 -type f | LC_ALL=C sort)"})
    FILES+=(${(f)"$(ls target/r54-stage1/off-ship/calibrate.log target/r54-stage1/off-cv/calibrate.log target/r54-stage1/on-ship/calibrate.log target/r54-stage1/on-cv/calibrate.log 2>/dev/null)"})
    ;;
  stage2)
    FILES+=(${(f)"$(find target/r54 -maxdepth 1 -type f \( -name '*.log' -o -name '*.md' \) | LC_ALL=C sort)"})
    FILES+=(${(f)"$(find $CH/evidence -maxdepth 2 -type f ! -path '*/laptop-*' | LC_ALL=C sort)"})
    FILES+=(target/r54/cand/demand.json target/r54/cand/cv.demand.json ${(f)"$(ls target/r54/cand/membership/*.json)"})
    FILES+=(${(f)"$(find target/assess-variants/r54 target/assess-variants/r54-fresh -type f 2>/dev/null | LC_ALL=C sort)"})
    FILES+=(data/calibration/rockridge.assessment-r54.md data/calibration/rockridge.assessment-r54-fresh.md)
    [ -d target/r54/staged ] && FILES+=(target/r54/staged/proposals.json target/r54/staged/report.md target/r54/staged/seeds.json ${(f)"$(find target/r54/staged/public-data/results target/r54/staged/public-data/redistribution target/r54/staged/public-data/llms target/r54/staged/public-data/og -type f 2>/dev/null | LC_ALL=C sort)"})
    ;;
  *) echo "STAGE must be stage1 or stage2"; exit 1 ;;
esac
for f in $FILES; do [ -f $f ] || { echo "missing $f"; exit 1; }; done
for f in $FILES; do printf '%s\t%s\t%s\n' "$f" "$(stat -f %z $f 2>/dev/null || stat -c %s $f)" "$(shasum -a 256 $f | cut -d' ' -f1)"; done > $P/FILES.txt
TAR -cf - ${=FILES} | gzip -9 -n > $TMP/r54-$STAGE.tar.gz
split -b 190000 $TMP/r54-$STAGE.tar.gz $P/r54-$STAGE.tar.gz.part-
{
  awk -F'\t' '{print $3"  "$1}' $P/FILES.txt
  echo "$(shasum -a 256 $TMP/r54-$STAGE.tar.gz | cut -d' ' -f1)  r54-$STAGE.tar.gz"
  for f in $P/*.part-*; do shasum -a 256 $f; done
} > $P/SHA256SUMS
{
  echo "# Calibration round 54, $STAGE: evidence of the laptop run"
  echo
  echo "Made by \`$CH/scripts\` on $(date '+%Y-%m-%d'), simulator $(./target/release/fingerprint), from \`$(git rev-parse --short HEAD)\`. Candidate outputs: nothing here replaces a published file, and nothing was pushed to the data bucket."
  echo
  echo "- \`r54-$STAGE.tar.gz.part-*\`: one tar archive (ustar, paths relative to the repository root), compressed with \`gzip -9 -n\` and split with \`split -b 190000\`."
  echo "- \`FILES.txt\`: every file with its size and SHA-256. \`SHA256SUMS\`: every file, the reassembled archive and every part."
  echo
  echo "Unpack into an empty folder, never over the published files, and check:"
  echo
  echo '```bash'
  echo "D=$P"
  echo "mkdir -p /tmp/r54-$STAGE && cat \$D/r54-$STAGE.tar.gz.part-* | tar -xzf - -C /tmp/r54-$STAGE"
  echo "awk -F'\\t' '{print \$3\"  /tmp/r54-$STAGE/\"\$1}' \$D/FILES.txt | shasum -a 256 -c"
  echo '```'
} > $P/README.md
R=$TMP/r54-roundtrip-$STAGE; rm -rf $R; mkdir -p $R
cat $P/r54-$STAGE.tar.gz.part-* | tar -xzf - -C $R
BAD=0; while IFS=$'\t' read -r fp size sum; do s=$(shasum -a 256 $R/$fp | cut -d' ' -f1); [ "$s" = "$sum" ] || { echo "MISMATCH $fp"; BAD=1; }; done < $P/FILES.txt
echo "files $(wc -l < $P/FILES.txt | tr -d ' '), parts $(ls $P/r54-$STAGE.tar.gz.part-* | wc -l | tr -d ' '); round trip $([ $BAD = 0 ] && echo ok || echo FAILED)"
[ $BAD = 0 ] || exit 1
for f in $P/*; do sz=$(stat -f %z $f 2>/dev/null || stat -c %s $f); [ $sz -le 190000 ] || { echo "$f is over 190000 bytes"; exit 1; }; done
[ "${1:-}" = "--no-push" ] && { echo "packed in $W/$P; not copied or pushed (--no-push)"; exit 0; }
cd $DEV || exit 1
[ "$(git branch --show-current)" = "salvatoret/peaceful-fermi-dlwt0u" ] || { echo "$DEV is not on salvatoret/peaceful-fermi-dlwt0u"; exit 1; }
mkdir -p $P && cp $W/$P/* $P/
git add $P
git commit -m "chore(data): evidence of calibration round 54, $STAGE" -m "Packed as gzip parts under 190 KB with SHA256SUMS. Candidate outputs: nothing published is replaced." -m "Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>" -m "Claude-Session: https://claude.ai/code/session_016YxHPPMRi1e3pLpC882CTB"
git push origin salvatoret/peaceful-fermi-dlwt0u
