#!/bin/zsh
# Round 48: A to C, the loop, the screen and (if it passes) the ten seeds; then the clean config and the baseline data again.
cd "$(git rev-parse --show-toplevel)" || exit 1
T=target/r48
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
finish() {
  git checkout data/demand
  echo "$(now) restore: npm run data on the clean config" >> $T/chain.log
  npm run data > $T/data-restore.log 2>&1
  echo "$(now) restore: exit=$? hashes $(sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json | cut -c1-16 | tr '\n' ' ') status: $(git status --short | tr '\n' ';')" >> $T/chain.log
  rm -rf target/batches/worktree.lock
  echo "$(now) ALL DONE $1" >> $T/chain.log
}
./target/r48/bc.zsh || { finish "(stopped in A to C)"; exit 1; }
./target/r48/loop.zsh || { finish "(stopped in D or E)"; exit 1; }
./target/r48/fg.zsh
finish ""
