#!/bin/zsh
# Restamp of round 52, step 5 (after b.zsh passed): the searched proposals in place, then data:redistribution, data:results, data:assumptions,
# data:llms, data:previews; every public/data file compared with the published set; the changed files and the two membership files packed as
# gzip parts with SHA256SUMS under openspec/changes/restamp-round-52/evidence/. No data:push, no /api/, no upload token. Holds the worktree lock.
cd "$(git rev-parse --show-toplevel)" || exit 1
A=target/restamp52; S=$A/search; K=target/batches/worktree.lock; PB=$A/pd-before
P=openspec/changes/restamp-round-52/evidence
FP=6b886c8f52ee07397773ddd0ebbcb447
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
log() { echo "$(now) $*" | tee -a $A/chain.log; }
h() { shasum -a 256 "$1" | cut -c1-16; }
stop() { log "STOP: $*"; log "status: $(git status --short | tr '\n' ';')"; rm -rf $K; log "C DONE (stopped)"; exit 1; }
step() { local name=$1; shift; log "$name: start"; local S0=$(date +%s); "$@" > $A/$name.log 2>&1; local RC=$?; log "$name: exit=$RC wall_s=$(( $(date +%s) - S0 ))"; return $RC; }
mkdir $K 2>/dev/null || { echo "lock held: $(cat $K/owner 2>/dev/null)"; exit 1; }; echo "restamp52-C $$ $(date)" > $K/owner
log "START restamp of round 52, step 5, at $(git rev-parse --short HEAD)"
grep -q 'B DONE$' $A/chain.log || stop "steps 3-4 did not finish cleanly"
I="config $(h data/demand/rockridge.config.json) network $(h public/data/rockridge.network.json) demand $(h public/data/rockridge.demand.json) cv $(h target/validation/rockridge.demand.json) fingerprint $(./target/release/fingerprint)"
log "inputs: $I"
[ "$I" = "config 2405ff02c92b2837 network 53c823f20d9165ed demand 2d16d8f8eb0950ca cv 1c3b1666f24156f1 fingerprint $FP" ] || stop "inputs differ"

# The searched set in place (round 52 published the search output as public/data/rockridge.proposals.json and its report as data/proposals/rockridge.md)
cp $S/proposals.json public/data/rockridge.proposals.json
cp $S/report.md data/proposals/rockridge.md
log "placed proposals $(h public/data/rockridge.proposals.json) and data/proposals/rockridge.md $(h data/proposals/rockridge.md); seeds file $(h data/proposals/rockridge.seeds.json)"

step redistribution npm run data:redistribution -- --jobs 8 || stop "data:redistribution failed"
step results npm run data:results -- --jobs 6 || stop "data:results failed"
step assumptions npm run data:assumptions || stop "data:assumptions failed"
step llms npm run data:llms || stop "data:llms failed"
step previews npm run data:previews || stop "data:previews failed"
log "previews: $(grep -i 'skip' $A/previews.log | tr '\n' ' ' | cut -c1-300)"
log "llms: $(grep -i 'out of date' $A/llms.log | tr '\n' ' ' | cut -c1-300)"
log "files: results $(ls public/data/results/rockridge | wc -l | tr -d ' '), redistribution $(ls public/data/redistribution/rockridge | wc -l | tr -d ' '), llms $(ls public/data/llms | wc -l | tr -d ' '), og $(ls public/data/og | wc -l | tr -d ' ')"

# Compare with the published set
node $A/cmpdir.cjs $PB public/data > $A/public-data-compare.txt 2>&1; RC=$?
log "public/data vs published: $(head -1 $A/public-data-compare.txt)"
sed -n '/^Stamp fields/,/^Stamp-only files/p' $A/public-data-compare.txt | sed '$d' | tee -a $A/chain.log
sed -n '/^DIFFERENT files/,/^Identical files/p' $A/public-data-compare.txt | tee -a $A/chain.log
[ $RC = 0 ] || stop "public/data differs from the published set beyond the stamps"
STALE=$(node -e "
const fs=require('fs');const out=[];
const ix=JSON.parse(fs.readFileSync('public/data/results/rockridge/index.json'));const keep=new Set(ix.results.map(r=>r.key+'.json').concat(['index.json','baseline-intents.json']));
for(const f of fs.readdirSync('public/data/results/rockridge')) if(!keep.has(f)) out.push('results/rockridge/'+f);
const og=fs.readFileSync('public/data/og/index.json','utf8');for(const f of fs.readdirSync('public/data/og')) if(f!=='index.json'&&!og.includes(f)) out.push('og/'+f);
console.log(out.join(' '));")
[ -z "$STALE" ] && log "no stale files in results or og" || log "stale files left from the published set, not packed: $STALE"

# Pack
rm -rf $P; mkdir -p $P/checks $P/laptop
cd public/data
TOP=(); for f in *.json; do cmp -s $f ../../$PB/$f || TOP+=($f); done
FILES=($TOP ${(f)"$(find results redistribution llms og -type f | LC_ALL=C sort)"})
for s in ${=STALE}; do FILES=(${FILES:#$s}); done
cd ../..
log "top-level public/data files that changed: ${TOP[*]:-none}"
STAT=$(node -e "const t=require('fs').readFileSync('$A/public-data-compare.txt','utf8');const sec=(n)=>(t.split(n+':\n')[1]||'').split('\n\n')[0].split('\n').map(x=>x.trim().split(':')[0]).filter(Boolean);console.log(JSON.stringify({stamp:sec('Stamp-only files'),identical:sec('Identical files'),only:sec('Only in the new set')}))")
for f in $FILES; do
  st=$(node -e "const s=$STAT;const f=process.argv[1];console.log(s.stamp.includes(f)?'stamp-only':s.identical.includes(f)?'identical':s.only.includes(f)?'new':'?')" $f)
  printf '%s\t%s\t%s\t%s\n' "public/data/$f" "$(stat -f %z public/data/$f)" "$(shasum -a 256 public/data/$f | cut -d' ' -f1)" "$st"
done > $P/FILES.txt
for f in target/membership/rockridge.membership.json target/membership/rockridge.membership-training.json; do printf '%s\t%s\t%s\t%s\n' "$f" "$(stat -f %z $f)" "$(shasum -a 256 $f | cut -d' ' -f1)" "stamp-only"; done >> $P/FILES.txt
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
log "pack: files $(wc -l < $P/FILES.txt | tr -d ' ') ($(cut -f4 $P/FILES.txt | sort | uniq -c | tr -s ' ' | tr '\n' ',')), public-data.tar.gz $(stat -f %z $TMPDIR/public-data.tar.gz) bytes in $(ls $P/public-data.tar.gz.part-* | wc -l | tr -d ' ') parts, membership.tar.gz $(stat -f %z $TMPDIR/membership.tar.gz) bytes in $(ls $P/membership.tar.gz.part-* | wc -l | tr -d ' ') parts, largest part $(ls -l $P/*.part-* | awk '{print $5}' | sort -n | tail -1), roundtrip $([ $BAD = 0 ] && echo ok || echo FAILED)"
[ $BAD = 0 ] || stop "pack round trip failed"

# Checks and scripts beside the parts
cp $A/public-data-compare.txt $A/reports-check.txt $A/search-check.txt $A/seeds.after.json $A/membership-diff.txt $A/membership-training-diff.txt $A/validation-diff.txt $A/assessment.diff $A/proposals-diff.txt $A/report.diff $A/loop-lines.diff $A/loop-report.diff $A/dry-run.txt $P/checks/ 2>/dev/null
cp $A/membership-loop.md $P/checks/membership-loop.md
for f in a.zsh b.zsh c.zsh jdiff.cjs cmpdir.cjs; do cp $A/$f $P/laptop/; done
cp $S/command.txt $P/laptop/search-command.txt
log "status: $(git status --short | tr '\n' ';')"
rm -rf $K
log "C DONE"
