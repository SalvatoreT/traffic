#!/bin/zsh
# Round 45: the three candidates in order, then rebuild the baseline data so the worktree is left on the published model.
cd "$(git rev-parse --show-toplevel)" || exit 1
T=target/r45
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
for C in forest-25 forest-18 forest-12; do ./target/r45/cand.zsh $C; done
git checkout data/areas/rockridge.json data/demand
echo "$(now) restore: npm run data on the clean config" >> $T/chain.log
npm run data > $T/data-restore.log 2>&1
echo "$(now) restore: exit=$? hashes $(sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json | cut -c1-16 | tr '\n' ' ') status: $(git status --short | tr '\n' ';')" >> $T/chain.log
rm -rf target/batches/worktree.lock
echo "$(now) ALL DONE" >> $T/chain.log
