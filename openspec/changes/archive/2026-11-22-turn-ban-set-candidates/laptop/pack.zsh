#!/bin/zsh
# Ban-set candidates, step E: packs the evidence of the run for transport as gzip -9 -n ustar archives split into 190000-byte parts (the repository hook stops files over 200 KB), with FILES.txt,
# SHA256SUMS and a round trip. --no-push stops after the round trip. Otherwise it copies the folder into DEV (the laptop's checkout of PUSH_BRANCH, default salvatoret/peaceful-fermi-dlwt0u),
# commits it there and pushes that branch only. Never main, never the data bucket, no upload token, no /api/. The commit carries no model name and no session link, and may be unsigned.
#   W=/path/to/traffic-bs DEV=/path/to/traffic zsh openspec/changes/turn-ban-set-candidates/laptop/pack.zsh [--no-push]
set -u
W=${W:?set W to the ban-set worktree}
cd ${W} || exit 1
CH=openspec/changes/turn-ban-set-candidates
P=${CH}/evidence/laptop-run
PUSH_BRANCH=${PUSH_BRANCH:-salvatoret/peaceful-fermi-dlwt0u}
TMP=${TMPDIR:-/tmp}
TAR() { COPYFILE_DISABLE=1 tar --format ustar --no-xattrs --no-mac-metadata --uid 0 --gid 0 --uname root --gname root "$@"; }
size() { stat -f %z $1 2>/dev/null || stat -c %s $1; }

rm -rf ${P}; mkdir -p ${P}
# Everything the run wrote under target/ban-sets (logs, the summary, the check logs, the search's proposals, report and scratch seeds, the ban-set list and the TypeScript packages).
FILES=(${(f)"$(find target/ban-sets -type f | LC_ALL=C sort)"})
for f in ${FILES}; do [ -f ${f} ] || { echo "missing ${f}"; exit 1; }; done
for f in ${FILES}; do printf '%s\t%s\t%s\n' "${f}" "$(size ${f})" "$(shasum -a 256 ${f} | cut -d' ' -f1)"; done > ${P}/FILES.txt

TAR -cf - ${=FILES} | gzip -9 -n > ${TMP}/bs-run.tar.gz
split -b 190000 ${TMP}/bs-run.tar.gz ${P}/bs-run.tar.gz.part-
{
  awk -F'\t' '{print $3"  "$1}' ${P}/FILES.txt
  echo "$(shasum -a 256 ${TMP}/bs-run.tar.gz | cut -d' ' -f1)  bs-run.tar.gz"
  for f in ${P}/*.part-*; do shasum -a 256 ${f}; done
} > ${P}/SHA256SUMS
{
  echo "# Ban-set candidates: evidence of the laptop run"
  echo
  echo "Made by \`${CH}/laptop\` on $(date '+%Y-%m-%d'), simulator $(./target/release/fingerprint), from \`$(git rev-parse --short HEAD)\`. Nothing here replaces a published file, and nothing was pushed to the data bucket."
  echo
  echo "- \`bs-run.tar.gz.part-*\`: one tar archive (ustar, paths relative to the repository root), compressed with \`gzip -9 -n\` and split with \`split -b 190000\`."
  echo "- \`FILES.txt\`: every file with its size and SHA-256. \`SHA256SUMS\`: every file, the reassembled archive and every part."
  echo "- Start with \`target/ban-sets/chain.log\` and \`target/ban-sets/summary.md\` in the archive."
  echo
  echo "Unpack into an empty folder, never over the published files, and check:"
  echo
  echo '```bash'
  echo "D=${P}"
  echo "mkdir -p /tmp/bs-run && cat \${D}/bs-run.tar.gz.part-* | tar -xzf - -C /tmp/bs-run"
  echo "awk -F'\\t' '{print \$3\"  /tmp/bs-run/\"\$1}' \${D}/FILES.txt | shasum -a 256 -c"
  echo '```'
} > ${P}/README.md
R=${TMP}/bs-roundtrip; rm -rf ${R}; mkdir -p ${R}
cat ${P}/bs-run.tar.gz.part-* | tar -xzf - -C ${R}
BAD=0; while IFS=$'\t' read -r fp sz sum; do s=$(shasum -a 256 ${R}/${fp} | cut -d' ' -f1); [ "${s}" = "${sum}" ] || { echo "MISMATCH ${fp}"; BAD=1; }; done < ${P}/FILES.txt
echo "files $(wc -l < ${P}/FILES.txt | tr -d ' '), raw bytes $(awk -F'\t' '{s+=$2} END {print s}' ${P}/FILES.txt); archive $(size ${TMP}/bs-run.tar.gz) bytes in $(ls ${P}/bs-run.tar.gz.part-* | wc -l | tr -d ' ') parts; round trip $([ ${BAD} = 0 ] && echo ok || echo FAILED)"
[ ${BAD} = 0 ] || exit 1
for f in ${P}/*; do [ $(size ${f}) -le 190000 ] || { echo "${f} is over 190000 bytes"; exit 1; }; done

[ "${1:-}" = "--no-push" ] && { echo "packed in ${W}/${P}; not copied or pushed (--no-push)"; exit 0; }
DEV=${DEV:?set DEV to the checkout of ${PUSH_BRANCH}}
cd ${DEV} || exit 1
[ "$(git branch --show-current)" = "${PUSH_BRANCH}" ] || { echo "${DEV} is not on ${PUSH_BRANCH}"; exit 1; }
mkdir -p ${P} && cp ${W}/${P}/* ${P}/
git add ${P}
git -c commit.gpgsign=false commit -m "chore(data): evidence of the ban-set run" -m "Packed as gzip parts under 190 KB with SHA256SUMS. Nothing published is replaced." || exit 1
if ! git push origin ${PUSH_BRANCH}; then
  echo "push over SSH failed; trying HTTPS with the gh login"
  REMOTE=$(git remote get-url origin | sed -E 's#^git@github.com:#https://github.com/#; s#^ssh://git@github.com/#https://github.com/#')
  git -c credential.helper='!gh auth git-credential' push "${REMOTE}" "${PUSH_BRANCH}:${PUSH_BRANCH}"
fi
