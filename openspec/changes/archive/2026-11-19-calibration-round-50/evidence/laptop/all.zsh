#!/bin/zsh
# Round 50: A to C, the loop, the screen and (if it passes) the ten seeds; then the clean config and the baseline data again.
# The loop script copies the candidate demand and fit reports to target/r50 before this restore overwrites them.
cd "$(git rev-parse --show-toplevel)" || exit 1
T=target/r50
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
finish() {
  git checkout data/demand
  echo "$(now) restore: npm run data on the clean config" >> $T/chain.log
  npm run data > $T/data-restore.log 2>&1
  echo "$(now) restore: exit=$? hashes $(sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json | cut -c1-16 | tr '\n' ' ') status: $(git status --short | tr '\n' ';')" >> $T/chain.log
  rm -rf target/batches/worktree.lock
  echo "$(now) ALL DONE $1" >> $T/chain.log
}
echo "$(now) START round 50 at $(git rev-parse --short HEAD)" >> $T/chain.log
./target/r50/bc.zsh || { finish "(stopped in A to C)"; exit 1; }
./target/r50/loop.zsh || { finish "(stopped in D)"; exit 1; }
./target/r50/fg.zsh
finish ""
