#!/usr/bin/env bash
# Installs the jira-capacity CLI for the current user.
#
# Works from a checkout (release/jira-capacity.mjs) or from the distribution
# folder on the Confluence page (jira-capacity.mjs next to this script).
#
#   ./install.sh              install into ~/.local/bin
#   ./install.sh --uninstall  remove the launcher
#
# Override the destination with JIRA_CAPACITY_BIN.

set -euo pipefail

NAME="jira-capacity"
BIN_DIR="${JIRA_CAPACITY_BIN:-$HOME/.local/bin}"
TARGET="$BIN_DIR/$NAME"

say() { printf '%s\n' "$*"; }
fail() { printf 'install: %s\n' "$*" >&2; exit 1; }

find_source() {
  local here
  here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

  for candidate in \
    "${JIRA_CAPACITY_SRC:-}" \
    "$here/release/jira-capacity.mjs" \
    "$here/jira-capacity.mjs" \
    "$here/../release/jira-capacity.mjs"
  do
    if [ -n "$candidate" ] && [ -f "$candidate" ]; then
      printf '%s\n' "$candidate"
      return 0
    fi
  done

  return 1
}

usage() {
  cat <<'EOF'
Usage: ./install.sh [--uninstall]

Installs the jira-capacity CLI for the current user.
  --uninstall   remove the launcher (profiles and tokens are kept)

Set JIRA_CAPACITY_BIN to install somewhere other than ~/.local/bin.
EOF
}

case "${1:-}" in
  -h | --help)
    usage
    exit 0
    ;;
esac

if [ "${1:-}" = "--uninstall" ]; then
  if [ -f "$TARGET" ]; then
    rm -f "$TARGET"
    say "Removed $TARGET"
  else
    say "$TARGET is not installed."
  fi
  say "Profiles and tokens were left in ${XDG_CONFIG_HOME:-$HOME/.config}/jira-capacity."
  exit 0
fi

command -v node >/dev/null 2>&1 || fail "Node.js is required. Install Node 20 or newer, then re-run."

NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$NODE_MAJOR" -lt 20 ]; then
  fail "Node 20 or newer is required (found $(node -v))."
fi

SOURCE="$(find_source)" || fail "Could not find jira-capacity.mjs. Run this from the unzipped artefacts folder, or run 'npm run cli:build' in the repo first."

mkdir -p "$BIN_DIR"
install -m 0755 "$SOURCE" "$TARGET"
say "Installed $TARGET"

CONFIG_HOME="${XDG_CONFIG_HOME:-$HOME/.config}/jira-capacity"
mkdir -p "$CONFIG_HOME/profiles"
chmod 700 "$CONFIG_HOME" 2>/dev/null || true
say "Profiles: $CONFIG_HOME/profiles"

case ":$PATH:" in
  *":$BIN_DIR:"*) ;;
  *)
    say ""
    say "$BIN_DIR is not on your PATH. Add this to your shell profile:"
    say "  export PATH=\"$BIN_DIR:\$PATH\""
    ;;
esac

say ""
say "Next:"
say "  1. jira-capacity auth set --jira -        # paste the Jira PAT"
say "  2. jira-capacity auth status              # confirms the user"
say "  3. jira-capacity profiles pull --from confluence:<pageId>"
say ""
say "Clipboard notes: macOS and Windows work out of the box. Linux needs"
say "wl-clipboard (Wayland) or xclip (X11); otherwise use --out report.xls."
