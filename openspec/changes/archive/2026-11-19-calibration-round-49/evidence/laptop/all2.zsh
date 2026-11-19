#!/bin/zsh
# Round 49 restart from step D after moving round 48's loop files aside (A to C passed at 11:50 AM and are not repeated).
cd "$(git rev-parse --show-toplevel)" || exit 1
T=target/r49
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
finish() {
  git checkout data/demand
  echo "$(now) restore: npm run data on the clean config" >> $T/chain.log
  npm run data > $T/data-restore.log 2>&1
  echo "$(now) restore: exit=$? hashes $(sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json | cut -c1-16 | tr '\n' ' ') status: $(git status --short | tr '\n' ';')" >> $T/chain.log
  rm -rf target/batches/worktree.lock
  echo "$(now) ALL DONE $1" >> $T/chain.log
}
echo "$(now) RESTART round 49 at D, $(git rev-parse --short HEAD)" >> $T/chain.log
./target/r49/loop.zsh || { finish "(stopped in D)"; exit 1; }
./target/r49/fg.zsh
finish ""
