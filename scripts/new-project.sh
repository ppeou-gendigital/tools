#!/usr/bin/env bash
#
# new-project.sh — create a new project branch off `main`.
#
# Usage:
#   scripts/new-project.sh <category>/<name> [--worktree] [--push]
#
# Examples:
#   scripts/new-project.sh tool/xyz
#   scripts/new-project.sh poc/myReactApp1 --worktree
#   scripts/new-project.sh web/MyBio --worktree --push
#
# Behavior:
#   - Validates <category>/<name> matches ^[a-z]+/[A-Za-z0-9._-]+$
#   - Refuses if the branch already exists locally or on `origin`
#   - Fetches origin (if configured) so we branch from a fresh `main`
#   - Default: switches the current checkout to the new branch
#   - --worktree: creates the branch as a git worktree at ../<name>
#                 so `main` stays checked out in the current directory
#   - --push:     pushes the new branch to origin with -u

set -euo pipefail

BASE_BRANCH="main"
NAME_REGEX='^[a-z]+/[A-Za-z0-9._-]+$'

die() {
  printf 'error: %s\n' "$*" >&2
  exit 1
}

usage() {
  sed -n '2,20p' "$0" | sed 's/^# \{0,1\}//'
  exit "${1:-0}"
}

# --- parse args ---
BRANCH=""
USE_WORKTREE=0
DO_PUSH=0

while [ $# -gt 0 ]; do
  case "$1" in
    -h|--help)
      usage 0
      ;;
    --worktree)
      USE_WORKTREE=1
      shift
      ;;
    --push)
      DO_PUSH=1
      shift
      ;;
    --*)
      die "unknown option: $1"
      ;;
    *)
      if [ -n "$BRANCH" ]; then
        die "unexpected extra argument: $1"
      fi
      BRANCH="$1"
      shift
      ;;
  esac
done

[ -n "$BRANCH" ] || { usage 1; }

# --- validate branch name ---
if ! printf '%s' "$BRANCH" | grep -Eq "$NAME_REGEX"; then
  die "branch name '$BRANCH' does not match $NAME_REGEX
  examples: tool/xyz  poc/myReactApp1  web/MyBio"
fi

CATEGORY="${BRANCH%%/*}"
NAME="${BRANCH#*/}"

# --- must be inside a git repo ---
if ! git rev-parse --git-dir >/dev/null 2>&1; then
  die "not inside a git repository"
fi

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

# --- refuse if branch already exists locally ---
if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  die "local branch already exists: $BRANCH"
fi

# --- fetch origin if configured, and refuse if branch exists there ---
HAS_ORIGIN=0
if git remote get-url origin >/dev/null 2>&1; then
  HAS_ORIGIN=1
  echo "-> fetching origin..."
  git fetch --quiet origin
  if git show-ref --verify --quiet "refs/remotes/origin/$BRANCH"; then
    die "remote branch already exists: origin/$BRANCH
  fetch and check it out with:
    git fetch origin
    git checkout $BRANCH"
  fi
fi

# --- ensure base branch exists ---
if ! git show-ref --verify --quiet "refs/heads/$BASE_BRANCH"; then
  die "base branch '$BASE_BRANCH' does not exist locally.
  create it first (e.g. commit the initial scaffolding)."
fi

# --- create the branch ---
if [ "$USE_WORKTREE" -eq 1 ]; then
  WT_PATH="$REPO_ROOT/../$NAME"
  if [ -e "$WT_PATH" ]; then
    die "worktree path already exists: $WT_PATH"
  fi
  echo "-> creating worktree at $WT_PATH on branch $BRANCH (from $BASE_BRANCH)"
  git worktree add "$WT_PATH" -b "$BRANCH" "$BASE_BRANCH"
  WORKING_DIR="$WT_PATH"
else
  echo "-> creating branch $BRANCH (from $BASE_BRANCH) and switching to it"
  git switch -c "$BRANCH" "$BASE_BRANCH"
  WORKING_DIR="$REPO_ROOT"
fi

# --- optional push ---
if [ "$DO_PUSH" -eq 1 ]; then
  if [ "$HAS_ORIGIN" -ne 1 ]; then
    echo "warn: --push requested but no 'origin' remote is configured; skipping push" >&2
  else
    echo "-> pushing to origin"
    git -C "$WORKING_DIR" push -u origin "$BRANCH"
  fi
fi

# --- summary ---
cat <<EOF

Project branch '$BRANCH' is ready.
  category:      $CATEGORY
  name:          $NAME
  working dir:   $WORKING_DIR

Next steps:
  cd "$WORKING_DIR"
  # start hacking...
  git add -A && git commit -m "init: $BRANCH"
$([ "$DO_PUSH" -eq 1 ] || printf '%s\n' "  git push -u origin $BRANCH")
  # add a row for this project to README.md on 'main' when you like

Reminder:
  Do NOT merge this branch into 'main' or into any other project branch.
EOF
