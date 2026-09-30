#!/bin/bash

set -e

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
VERSION=$(cd "$ROOT_DIR" && ./scripts/resolve-version.sh custom)

echo "Building New API Electron App ($VERSION)..."

echo "Step 1: Building frontend..."
cd "$ROOT_DIR/web"
bun install --frozen-lockfile
DISABLE_ESLINT_PLUGIN='true' VITE_REACT_APP_VERSION="$VERSION" bun run build

cd "$ROOT_DIR"
echo "Step 2: Building Go backend..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Building for macOS..."
    CGO_ENABLED=1 go build -ldflags="-s -w -X 'github.com/QuantumNous/new-api/common.Version=$VERSION'" -o new-api
    cd electron
    npm install
    npm run build:mac
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "Building for Linux..."
    CGO_ENABLED=1 go build -ldflags="-s -w -X 'github.com/QuantumNous/new-api/common.Version=$VERSION'" -o new-api
    cd electron
    npm install
    npm run build:linux
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
    echo "Building for Windows..."
    CGO_ENABLED=1 go build -ldflags="-s -w -X 'github.com/QuantumNous/new-api/common.Version=$VERSION'" -o new-api.exe
    cd electron
    npm install
    npm run build:win
else
    echo "Unknown OS, building for current platform..."
    CGO_ENABLED=1 go build -ldflags="-s -w -X 'github.com/QuantumNous/new-api/common.Version=$VERSION'" -o new-api
    cd electron
    npm install
    npm run build
fi

echo "Build complete! Check electron/dist/ for output."
