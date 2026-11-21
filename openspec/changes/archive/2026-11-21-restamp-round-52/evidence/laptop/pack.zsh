#!/bin/zsh
# Packs the restamped round 52 set (lead decision of 2026-11-21, option A): the top-level public/data files that changed, every file of results,
# redistribution, llms and og, and the two membership files, as gzip -9 -n ustar archives split into 190000-byte parts under
# openspec/changes/restamp-round-52/evidence/publish/, with FILES.txt, SHA256SUMS, UNCHANGED.txt and a round trip. Holds the worktree lock.
cd "$(git rev-parse --show-toplevel)" || exit 1
A=target/restamp52; PB=$A/pd-before; K=target/batches/worktree.lock; P=openspec/changes/restamp-round-52/evidence/publish
mkdir $K 2>/dev/null || { echo "lock held: $(cat $K/owner 2>/dev/null)"; exit 1; }; echo "restamp52-pack $$ $(date)" > $K/owner
node $A/cmpdir.cjs $PB public/data > $A/pack-compare.txt 2>&1; head -1 $A/pack-compare.txt
rm -rf $P; mkdir -p $P
cd public/data
TOP=(); for f in *.json; do cmp -s $f ../../$PB/$f || TOP+=($f); done
FILES=($TOP ${(f)"$(find results redistribution llms og -type f | LC_ALL=C sort)"})
cd ../..
echo "top-level changed: ${TOP[*]}"
status() {
  case $1 in
    areas.json) echo "content: adds the noise pointer";;
    redistribution/rockridge/unconstrained.p1.json|redistribution/rockridge/unconstrained.p3.json) echo "content: route paths (links) only";;
    *) cmp -s public/data/$1 $PB/$1 && echo identical || { [ -e $PB/$1 ] && echo stamps || echo new; };;
  esac
}
for f in $FILES; do printf '%s\t%s\t%s\t%s\n' "public/data/$f" "$(stat -f %z public/data/$f)" "$(shasum -a 256 public/data/$f | cut -d' ' -f1)" "$(status $f)"; done > $P/FILES.txt
for f in target/membership/rockridge.membership.json target/membership/rockridge.membership-training.json; do printf '%s\t%s\t%s\t%s\n' "$f" "$(stat -f %z $f)" "$(shasum -a 256 $f | cut -d' ' -f1)" "stamps (evidence.simulator)"; done >> $P/FILES.txt
COPYFILE_DISABLE=1 tar --format ustar --no-xattrs --no-mac-metadata --uid 0 --gid 0 --uname root --gname root -cf - -C public/data $FILES | gzip -9 -n > $TMPDIR/public-data.tar.gz
COPYFILE_DISABLE=1 tar --format ustar --no-xattrs --no-mac-metadata --uid 0 --gid 0 --uname root --gname root -cf - -C target/membership rockridge.membership.json rockridge.membership-training.json | gzip -9 -n > $TMPDIR/membership.tar.gz
split -b 190000 $TMPDIR/public-data.tar.gz $P/public-data.tar.gz.part-
split -b 190000 $TMPDIR/membership.tar.gz $P/membership.tar.gz.part-
{
  awk -F'\t' '{print $3"  "$1}' $P/FILES.txt
  echo "$(shasum -a 256 $TMPDIR/public-data.tar.gz | cut -d' ' -f1)  public-data.tar.gz"
  echo "$(shasum -a 256 $TMPDIR/membership.tar.gz | cut -d' ' -f1)  membership.tar.gz"
  for f in $P/*.part-*; do shasum -a 256 $f; done
} > $P/SHA256SUMS
cd public/data; for f in *.json; do [[ " ${TOP[*]} " == *" $f "* ]] || printf '%s  %s\n' "$(shasum -a 256 $f | cut -d' ' -f1)" "public/data/$f"; done > ../../$P/UNCHANGED.txt; cd ../..
R=$TMPDIR/restamp-roundtrip; rm -rf $R; mkdir -p $R/pd $R/m
cat $P/public-data.tar.gz.part-* | tar -xzf - -C $R/pd
cat $P/membership.tar.gz.part-* | tar -xzf - -C $R/m
BAD=0; while IFS=$'\t' read -r fp size sum st; do case $fp in public/data/*) q=$R/pd/${fp#public/data/};; *) q=$R/m/${fp#target/membership/};; esac; s=$(shasum -a 256 $q | cut -d' ' -f1); [ "$s" = "$sum" ] || { echo "MISMATCH $fp"; BAD=1; }; done < $P/FILES.txt
NX=$(( $(find $R/pd -type f | wc -l) + $(find $R/m -type f | wc -l) ))
echo "files $(wc -l < $P/FILES.txt | tr -d ' ') (unpacked $NX), raw bytes $(awk -F'\t' '{s+=$2} END {print s}' $P/FILES.txt); public-data.tar.gz $(stat -f %z $TMPDIR/public-data.tar.gz) bytes in $(ls $P/public-data.tar.gz.part-* | wc -l | tr -d ' ') parts; membership.tar.gz $(stat -f %z $TMPDIR/membership.tar.gz) bytes in $(ls $P/membership.tar.gz.part-* | wc -l | tr -d ' ') parts; largest part $(ls -l $P/*.part-* | awk '{print $5}' | sort -n | tail -1); roundtrip $([ $BAD = 0 ] && echo ok || echo FAILED)"
echo "status counts: $(cut -f4 $P/FILES.txt | sort | uniq -c | tr -s ' ' | tr '\n' ';')"
cp $A/pack.zsh $P/../laptop/pack.zsh
rm -rf $K
