#!/bin/zsh
# Packs every public/data file that the round 52 adoption changes into one ustar tar, gzip -9 -n, split into 190000-byte parts under
# openspec/changes/calibration-round-52/evidence/publish/, with FILES.txt (exact public/data paths, bytes, sha256), SHA256SUMS and
# UNCHANGED.txt (hashes of the public/data files that do not change, for a cross-check).
cd "$(git rev-parse --show-toplevel)" || exit 1
P=openspec/changes/calibration-round-52/evidence/publish
rm -rf $P; mkdir -p $P
cd public/data
FILES=(areas.json rockridge.demand.json rockridge.assumptions.json rockridge.noise.json rockridge.proposals.json ${(f)"$(find results redistribution llms og -type f | LC_ALL=C sort)"})
cd ../..
for f in $FILES; do printf '%s\t%s\t%s\n' "public/data/$f" "$(stat -f %z public/data/$f)" "$(shasum -a 256 public/data/$f | cut -d' ' -f1)"; done > $P/FILES.txt
COPYFILE_DISABLE=1 tar --format ustar --no-xattrs --no-mac-metadata --uid 0 --gid 0 --uname root --gname root -cf - -C public/data $FILES | gzip -9 -n > $TMPDIR/public-data.tar.gz
split -b 190000 $TMPDIR/public-data.tar.gz $P/public-data.tar.gz.part-
cp $TMPDIR/public-data.tar.gz $TMPDIR/pd-check.tar.gz
{
  awk -F'\t' '{print $3"  "$1}' $P/FILES.txt
  echo "$(shasum -a 256 $TMPDIR/public-data.tar.gz | cut -d' ' -f1)  public-data.tar.gz"
  for f in $P/public-data.tar.gz.part-*; do shasum -a 256 $f; done
} > $P/SHA256SUMS
for f in rockridge.network.json rockridge.basemap.json rockridge-compact.network.json rockridge-compact.basemap.json; do printf '%s  %s\n' "$(shasum -a 256 public/data/$f | cut -d' ' -f1)" "public/data/$f"; done > $P/UNCHANGED.txt
# Round trip: reassemble, unpack into a scratch dir, compare every file
R=$TMPDIR/pd-roundtrip; rm -rf $R; mkdir -p $R
cat $P/public-data.tar.gz.part-* | tar -xzf - -C $R
BAD=0; while IFS=$'\t' read -r fp size sum; do s=$(shasum -a 256 $R/${fp#public/data/} | cut -d' ' -f1); [ "$s" = "$sum" ] || { echo "MISMATCH $fp"; BAD=1; }; done < $P/FILES.txt
echo "files $(wc -l < $P/FILES.txt | tr -d ' '), raw bytes $(awk -F'\t' '{s+=$2} END {print s}' $P/FILES.txt), tar.gz bytes $(stat -f %z $TMPDIR/public-data.tar.gz), parts $(ls $P/public-data.tar.gz.part-* | wc -l | tr -d ' '), largest part $(ls -l $P/public-data.tar.gz.part-* | awk '{print $5}' | sort -n | tail -1), roundtrip $([ $BAD = 0 ] && echo ok || echo FAILED)"
