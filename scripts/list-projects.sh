#!/usr/bin/env bash
#
# list-projects.sh — list all project branches grouped by category.
#
# Usage:
#   scripts/list-projects.sh              # local + remote branches, grouped
#   scripts/list-projects.sh --local      # local branches only
#   scripts/list-projects.sh --remote     # remote (origin/*) branches only
#   scripts/list-projects.sh --markdown   # emit a markdown table (paste into README)
#
# A "project branch" is any branch whose name looks like <category>/<name>.
# `main` and any branch without a `/` in it are skipped.

set -euo pipefail

MODE="all"        # all | local | remote
OUTPUT="text"     # text | markdown

while [ $# -gt 0 ]; do
  case "$1" in
    -h|--help)
      sed -n '2,14p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    --local)   MODE="local";  shift ;;
    --remote)  MODE="remote"; shift ;;
    --markdown) OUTPUT="markdown"; shift ;;
    *) echo "error: unknown option: $1" >&2; exit 1 ;;
  esac
done

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "error: not inside a git repository" >&2
  exit 1
fi

# Fetch remote branches too (best-effort).
if [ "$MODE" != "local" ] && git remote get-url origin >/dev/null 2>&1; then
  git fetch --quiet origin || true
fi

collect() {
  local scope="$1"
  case "$scope" in
    local)
      git for-each-ref --format='%(refname:short)' refs/heads/
      ;;
    remote)
      git for-each-ref --format='%(refname:short)' refs/remotes/origin/ \
        | sed 's#^origin/##' \
        | grep -v '^HEAD$' || true
      ;;
  esac
}

case "$MODE" in
  local)  BRANCHES="$(collect local)" ;;
  remote) BRANCHES="$(collect remote)" ;;
  all)    BRANCHES="$(printf '%s\n%s\n' "$(collect local)" "$(collect remote)")" ;;
esac

PROJECTS="$(printf '%s\n' "$BRANCHES" \
  | awk 'NF' \
  | sort -u \
  | grep '/' || true)"

if [ -z "$PROJECTS" ]; then
  echo "No project branches found."
  echo "Create one with: scripts/new-project.sh <category>/<name>"
  exit 0
fi

if [ "$OUTPUT" = "markdown" ]; then
  CURRENT_CAT=""
  printf '%s\n' "$PROJECTS" | while IFS= read -r branch; do
    cat="${branch%%/*}"
    name="${branch#*/}"
    if [ "$cat" != "$CURRENT_CAT" ]; then
      [ -n "$CURRENT_CAT" ] && printf '\n'
      printf '### `%s/`\n\n' "$cat"
      printf '| Name | Description | Branch |\n'
      printf '| ---- | ----------- | ------ |\n'
      CURRENT_CAT="$cat"
    fi
    printf '| %s | _(TODO)_ | `%s` |\n' "$name" "$branch"
  done
else
  CURRENT_CAT=""
  printf '%s\n' "$PROJECTS" | while IFS= read -r branch; do
    cat="${branch%%/*}"
    name="${branch#*/}"
    if [ "$cat" != "$CURRENT_CAT" ]; then
      [ -n "$CURRENT_CAT" ] && printf '\n'
      printf '%s/\n' "$cat"
      CURRENT_CAT="$cat"
    fi
    printf '  %s\n' "$name"
  done
fi
