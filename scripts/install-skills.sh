#!/bin/sh
# Fetches third-party agent skills that are not vendored into the repo. Never fails the install.
dir=.claude/skills/humanizer
if [ ! -f "$dir/SKILL.md" ]; then
  git clone -q --depth 1 https://github.com/blader/humanizer "$dir" 2>/dev/null && rm -rf "$dir/.git" \
    || echo "install-skills: could not fetch humanizer (offline?); skipping" >&2
fi
exit 0
