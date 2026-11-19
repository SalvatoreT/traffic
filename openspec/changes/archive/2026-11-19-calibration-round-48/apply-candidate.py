# Usage: python3 openspec/changes/archive/2026-11-19-calibration-round-48/apply-candidate.py [simulated-membership | simulated-membership-prior20] [config-path]
# Reads candidates/<name>.json and inserts it as countFit.throughTargets.simulatedMembership in data/demand/rockridge.config.json (or the path given).
# Absent, the build is byte-identical to the baseline. The config file's hash is part of the membership evidence, so apply it once, before the loop, and do not edit the config afterwards.
import json
import pathlib
import sys

here = pathlib.Path(__file__).parent
name = sys.argv[1] if len(sys.argv) > 1 else 'simulated-membership'
entry = json.loads((here / 'candidates' / f'{name}.json').read_text())
p = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else 'data/demand/rockridge.config.json')
s = p.read_text()
head = '    "throughTargets": {\n      "enabled": true,\n'
assert s.count(head) == 1 and '"simulatedMembership"' not in s, 'config already has a simulatedMembership entry, or has no throughTargets block'
block = '      "simulatedMembership": ' + json.dumps(entry, ensure_ascii=False, indent=2).replace('\n', '\n      ') + ',\n'
out = s.replace(head, head + block)
json.loads(out)
p.write_text(out)
print('applied', name)
