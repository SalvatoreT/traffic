# Usage: python3 openspec/changes/calibration-round-51/apply-candidate.py [shares-membership] [config-path]
# Reads candidates/<name>.json and inserts its gatePriorTotals as countFit.gatePriorTotals and, if present, its simulatedMembership as
# countFit.throughTargets.simulatedMembership (with the round 51 sub-switches throughTargets and shares) in data/demand/rockridge.config.json (or the path given).
# Absent, the build is byte-identical to the baseline. The config file's hash is part of the membership evidence, so apply it once, before the loop, and do not edit the config afterwards.
import json
import pathlib
import sys

here = pathlib.Path(__file__).parent
name = sys.argv[1] if len(sys.argv) > 1 else 'shares-membership'
cand = json.loads((here / 'candidates' / f'{name}.json').read_text())
p = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else 'data/demand/rockridge.config.json')
s = p.read_text()
assert '"gatePriorTotals"' not in s and '"simulatedMembership"' not in s, 'config already has a gatePriorTotals or simulatedMembership entry'


def block(key, entry, pad):
    return pad + f'"{key}": ' + json.dumps(entry, ensure_ascii=False, indent=2).replace('\n', '\n' + pad) + ',\n'


gate = '    "throughTargets": {\n'
assert s.count(gate) == 1, 'config has no throughTargets block'
out = s.replace(gate, block('gatePriorTotals', cand['gatePriorTotals'], '    ') + gate)
if 'simulatedMembership' in cand:
    head = '    "throughTargets": {\n      "enabled": true,\n'
    assert out.count(head) == 1
    out = out.replace(head, head + block('simulatedMembership', cand['simulatedMembership'], '      '))
json.loads(out)
p.write_text(out)
print('applied', name)
