#!/bin/zsh
# Round 47: steps A to C, the candidate, then rebuild the baseline data so the worktree is left on the published model.
cd "$(git rev-parse --show-toplevel)" || exit 1
T=target/r47
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
./target/r47/bc.zsh || { echo "$(now) BC stopped; see chain.log" >> $T/chain.log; git checkout data/demand; rm -rf target/batches/worktree.lock; exit 1; }
./target/r47/cand.zsh
git checkout data/demand
echo "$(now) restore: npm run data on the clean config" >> $T/chain.log
npm run data > $T/data-restore.log 2>&1
echo "$(now) restore: exit=$? hashes $(sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json | cut -c1-16 | tr '\n' ' ') status: $(git status --short | tr '\n' ';')" >> $T/chain.log
rm -rf target/batches/worktree.lock
echo "$(now) ALL DONE" >> $T/chain.log
