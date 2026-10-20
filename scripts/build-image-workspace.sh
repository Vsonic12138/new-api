#!/usr/bin/env bash
set -euo pipefail
# Build the companion UI from a checked-out local directory. No API credentials
# are needed; this only produces publicly servable HTML/JS/CSS static assets.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE="${1:-}"
if [[ -z "$SOURCE" ]]; then
  echo "Usage: bash scripts/build-image-workspace.sh /path/to/new-api-image-playground" >&2
  exit 2
fi
SOURCE="$(cd "$SOURCE" && pwd)"
if [[ ! -f "$SOURCE/package.json" ]]; then
  echo "Not an Image Workspace source directory: $SOURCE" >&2
  exit 2
fi
if [[ ! -d "$SOURCE/node_modules" ]]; then
  if [[ -f "$SOURCE/package-lock.json" ]]; then
    (cd "$SOURCE" && npm ci --no-audit --no-fund)
  else
    (cd "$SOURCE" && npm install --no-audit --no-fund)
  fi
fi
(cd "$SOURCE" && npm run build:embedded)
if [[ ! -s "$SOURCE/dist/index.html" ]]; then
  echo "Embedded UI build is missing index.html" >&2
  exit 1
fi
PARENT="$ROOT/web/public"
TARGET="$PARENT/pg-image-workspace"
STAGE="$(mktemp -d "$PARENT/.pg-image-workspace.XXXXXXXX")"
trap 'rm -rf -- "$STAGE"' EXIT
cp -R "$SOURCE/dist/." "$STAGE/"
if ! grep -q '/pg-image-workspace/' "$STAGE/index.html"; then
  echo "Embedded bundle has an unexpected public base path" >&2
  exit 1
fi
rm -rf -- "$TARGET"
mv "$STAGE" "$TARGET"
trap - EXIT
echo "Installed embedded UI at web/public/pg-image-workspace."
echo "Next: cd web && bun run build; then build your Go single-binary as usual."
echo "Enable IMAGE_WORKSPACE_ENABLED=true only after you deploy the resulting binary."
