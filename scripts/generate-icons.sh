#!/usr/bin/env bash
#
# Rasterize icons/loopy.svg into the Chrome extension PNG sizes.
#
# macOS-only: uses the built-in `qlmanage` Quick Look renderer so we don't
# have to pull in a heavy Node dep (sharp, resvg) just to regenerate four
# static assets. Everything CI needs is the pre-generated PNGs, which are
# committed to the repo — this script is only run locally when the source
# SVG changes.
#
# Usage:   npm run icons
#          scripts/generate-icons.sh            # same
set -euo pipefail

# Resolve repo root so the script works no matter where it's invoked from.
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/icons/loopy.svg"
OUT="$ROOT/icons"

if [ ! -f "$SRC" ]; then
  echo "Source SVG not found: $SRC" >&2
  exit 1
fi

if ! command -v qlmanage >/dev/null 2>&1; then
  echo "This script requires the macOS 'qlmanage' tool." >&2
  echo "On non-mac systems, rasterize $SRC to icon-{16,32,48,128}.png with your tool of choice." >&2
  exit 1
fi

for size in 16 32 48 128; do
  # qlmanage names its output "<source>.png" and writes to -o <dir>. We
  # regenerate at each size, then rename to a stable icon-<size>.png so
  # manifest.json can reference the file without any string interpolation.
  qlmanage -t -s "$size" -o "$OUT" "$SRC" >/dev/null 2>&1
  mv -f "$OUT/loopy.svg.png" "$OUT/icon-$size.png"
  echo "wrote icons/icon-$size.png"
done
