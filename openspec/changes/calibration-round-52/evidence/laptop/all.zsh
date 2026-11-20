#!/bin/zsh
# Round 52 chain: move round 51's loop folders aside, B and C, the loop (D), the screen and ten seeds (E, F), the clean config and the baseline data again,
# then, only if the keep rule passed, the runbook's fresh-seed confirmation (G, scripts/confirm.zsh, which takes the lock and restores on its own).
cd "$(git rev-parse --show-toplevel)" || exit 1
T=target/r52; K=target/batches/worktree.lock; EV=openspec/changes/calibration-round-52/evidence
now() { date '+%Y-%m-%d %I:%M:%S %p %Z'; }
finish() {
  git checkout data/demand
  echo "$(now) restore: npm run data on the clean config" >> $T/chain.log
  npm run data > $T/data-restore.log 2>&1
  echo "$(now) restore: exit=$? hashes $(sha256sum public/data/rockridge.network.json public/data/rockridge.demand.json target/validation/rockridge.demand.json | cut -c1-16 | tr '\n' ' ') config $(shasum -a 256 data/demand/rockridge.config.json | cut -c1-16) status: $(git status --short | tr '\n' ';')" >> $T/chain.log
  rm -rf $K
  echo "$(now) chain done $1" >> $T/chain.log
}
mkdir $K 2>/dev/null || { echo "worktree lock held: $(cat $K/owner 2>/dev/null)"; exit 1; }
echo "round 52 chain" > $K/owner
echo "$(now) START round 52 at $(git rev-parse --short HEAD)" >> $T/chain.log
if [ -e target/membership-loop ] || [ -e target/membership ]; then
  { [ -e target/r51-loop ] || [ -e target/r51-membership ]; } && { echo "$(now) target/r51-loop or r51-membership exists already, stop" >> $T/chain.log; rm -rf $K; exit 1; }
  mv target/membership-loop target/r51-loop && mv target/membership target/r51-membership && echo "$(now) moved round 51 folders to target/r51-loop and target/r51-membership" >> $T/chain.log
fi
./target/r52/bc.zsh || { finish "(stopped in B or C)"; exit 1; }
./target/r52/loop.zsh; RC=$?
if [ $RC != 0 ]; then finish "(stopped in D, exit $RC)"; exit 1; fi
./target/r52/fg.zsh
finish ""
DEC=$(cat $T/keep-decision.txt 2>/dev/null)
echo "$(now) keep decision: $DEC" >> $T/chain.log
if [[ $DEC == "KEEP PASS" ]]; then
  echo "$(now) G: fresh-seed confirmation (scripts/confirm.zsh)" >> $T/chain.log
  zsh openspec/changes/calibration-round-52/scripts/confirm.zsh > $T/confirm.out 2>&1; echo "$(now) G: confirm.zsh exit=$?" >> $T/chain.log
  mkdir -p $EV/confirm && cp target/r52-confirm/* $EV/confirm/ 2>/dev/null
  tail -4 target/r52-confirm/chain.log >> $T/chain.log
else
  echo "$(now) G: skipped (keep rule not passed)" >> $T/chain.log
fi
echo "$(now) ALL DONE" >> $T/chain.log
