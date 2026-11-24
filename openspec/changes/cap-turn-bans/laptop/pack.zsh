#!/bin/zsh
# Cap turn bans, step E: packs everything the chain generated for publication, as gzip -9 -n ustar archives split into 190000-byte parts (the repository hook stops files over 200 KB),
# with FILES.txt, SHA256SUMS and a round trip:
#   publish-data.tar.gz      the proposals file, the report, the seeds file, the whole redistribution folder and the whole results folder (paths relative to the repository root)
#   publish-evidence.tar.gz  the logs, headline table, search output and command of target/cap-bans, without the copy of the published files
# Refuses to pack when verify.zsh failed (FORCE=1 packs anyway and says so in the README). --no-push stops after the round trip. Otherwise it copies the folder into DEV, the laptop's checkout
# of the development branch, commits it on the branch DEV is on and pushes that branch only. Never main, never the data bucket, no upload token, no /api/.
#   W=/path/to/traffic-cap DEV=/path/to/dev-branch-checkout zsh openspec/changes/cap-turn-bans/laptop/pack.zsh [--no-push]
set -u
W=${W:?set W to the worktree}
cd ${W} || exit 1
CH=openspec/changes/cap-turn-bans
P=${CH}/evidence/laptop-publish
TMP=${TMPDIR:-/tmp}
TAR() { COPYFILE_DISABLE=1 tar --format ustar --no-xattrs --no-mac-metadata --uid 0 --gid 0 --uname root --gname root "$@"; }
tmo() { if command -v timeout > /dev/null; then timeout 60 "$@"; elif command -v gtimeout > /dev/null; then gtimeout 60 "$@"; else "$@"; fi }
size() { wc -c < $1 | tr -d " "; }

grep -q '^RESULT: every check passed' target/cap-bans/headline.md 2>/dev/null || { [ -n "${FORCE:-}" ] || { echo "verify.zsh has not passed (target/cap-bans/headline.md); fix it or set FORCE=1"; exit 1; }; FORCED=1; }
rm -rf ${P}; mkdir -p ${P}
DATA=(public/data/rockridge.proposals.json data/proposals/rockridge.md data/proposals/rockridge.seeds.json ${(f)"$(find public/data/redistribution public/data/results -type f | LC_ALL=C sort)"})
EVID=(${(f)"$(find target/cap-bans -type f -not -path 'target/cap-bans/published/*' | LC_ALL=C sort)"})
for f in ${DATA} ${EVID}; do [ -f ${f} ] || { echo "missing ${f}"; exit 1; }; done
for f in ${DATA} ${EVID}; do printf '%s\t%s\t%s\t%s\n' "${f}" "$(size ${f})" "$(shasum -a 256 ${f} | cut -d' ' -f1)" "$([[ " ${DATA[*]} " == *" ${f} "* ]] && echo data || echo evidence)"; done > ${P}/FILES.txt

TAR -cf - ${=DATA} | gzip -9 -n > ${TMP}/publish-data.tar.gz
TAR -cf - ${=EVID} | gzip -9 -n > ${TMP}/publish-evidence.tar.gz
split -b 190000 ${TMP}/publish-data.tar.gz ${P}/publish-data.tar.gz.part-
split -b 190000 ${TMP}/publish-evidence.tar.gz ${P}/publish-evidence.tar.gz.part-
{
  awk -F'\t' '{print $3"  "$1}' ${P}/FILES.txt
  echo "$(shasum -a 256 ${TMP}/publish-data.tar.gz | cut -d' ' -f1)  publish-data.tar.gz"
  echo "$(shasum -a 256 ${TMP}/publish-evidence.tar.gz | cut -d' ' -f1)  publish-evidence.tar.gz"
  for f in ${P}/*.part-*; do shasum -a 256 ${f}; done
} > ${P}/SHA256SUMS
{
  echo "# Laptop run of the publish chain for the capped turn-ban proposals (at most 5 individual turn bans a package)"
  echo
  echo "Made by \`${CH}/laptop\` on $(date '+%Y-%m-%d'), simulator $(./target/release/fingerprint), from \`$(git rev-parse --short HEAD)\`.${FORCED:+ **Packed with FORCE=1: verify.zsh did not pass; read headline.md first.**} Nothing here was pushed to the data bucket, and no upload token or /api/ request was used."
  echo
  echo "- \`publish-data.tar.gz.part-*\`: the files to publish (paths relative to the repository root). \`publish-evidence.tar.gz.part-*\`: logs, \`headline.md\`, the search output and command."
  echo "- Both are ustar archives compressed with \`gzip -9 -n\` and split with \`split -b 190000\`. \`FILES.txt\`: path, size, SHA-256 and which archive. \`SHA256SUMS\`: every file, both reassembled archives and every part."
  echo "- Install with \`${CH}/install.md\`. Start with \`target/cap-bans/headline.md\` in the evidence archive."
} > ${P}/README.md
R=${TMP}/publish-roundtrip; rm -rf ${R}; mkdir -p ${R}
cat ${P}/publish-data.tar.gz.part-* | tar -xzf - -C ${R}
cat ${P}/publish-evidence.tar.gz.part-* | tar -xzf - -C ${R}
BAD=0; while IFS=$'\t' read -r fp sz sum kind; do s=$(shasum -a 256 ${R}/${fp} | cut -d' ' -f1); [ "${s}" = "${sum}" ] || { echo "MISMATCH ${fp}"; BAD=1; }; done < ${P}/FILES.txt
echo "files $(wc -l < ${P}/FILES.txt | tr -d ' ') ($(grep -c 'data$' ${P}/FILES.txt) data), raw bytes $(awk -F'\t' '{s+=$2} END {print s}' ${P}/FILES.txt); data archive $(size ${TMP}/publish-data.tar.gz) bytes in $(ls ${P}/publish-data.tar.gz.part-* | wc -l | tr -d ' ') parts, evidence $(size ${TMP}/publish-evidence.tar.gz) bytes in $(ls ${P}/publish-evidence.tar.gz.part-* | wc -l | tr -d ' ') parts; round trip $([ ${BAD} = 0 ] && echo OK || echo FAILED)"
[ ${BAD} = 0 ] || exit 1
for f in ${P}/*; do [ $(size ${f}) -le 190000 ] || { echo "${f} is over 190000 bytes"; exit 1; }; done

[ "${1:-}" = "--no-push" ] && { echo "packed in ${W}/${P}; not copied or pushed (--no-push)"; exit 0; }
DEV=${DEV:?set DEV to the checkout of the development branch}
cd ${DEV} || exit 1
BRANCH=$(git branch --show-current)
case ${BRANCH} in main|master|"") echo "${DEV} is on '${BRANCH}'; refusing to commit there"; exit 1;; esac
[ "${BRANCH}" = "${DEV_BRANCH:-salvatoret/peaceful-fermi-dlwt0u}" ] || { echo "${DEV} is on ${BRANCH}, not the dev branch ${DEV_BRANCH:-salvatoret/peaceful-fermi-dlwt0u}; refusing to commit there (set DEV_BRANCH to override)"; exit 1; }
mkdir -p ${P} && cp ${W}/${P}/* ${P}/
git add ${P}
git -c commit.gpgsign=false commit -m "chore(data): laptop run of the capped turn-ban publish chain" -m "Packed as gzip parts under 190 KB with SHA256SUMS. Nothing is published by this commit." || exit 1
if ! tmo git push origin ${BRANCH}; then
  echo "push over SSH failed or timed out; trying HTTPS with the gh login"
  REMOTE=$(git remote get-url origin | sed -E 's#^git@github.com:#https://github.com/#; s#^ssh://git@github.com/#https://github.com/#')
  git -c credential.helper= -c credential.helper='!gh auth git-credential' push "${REMOTE}" "${BRANCH}:${BRANCH}"
fi
