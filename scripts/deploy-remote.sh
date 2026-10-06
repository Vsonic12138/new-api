#!/usr/bin/env bash
set -euo pipefail

TARGET_HOST="dedirock"
REMOTE_BIN_DIR="/opt/new-api/bin"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

export PATH="/home/vsonic12138/.bun/bin:/usr/local/go/bin:$PATH"

cd "$PROJECT_ROOT"

echo "==> 1. 构建前端静态资源..."
cd web && bun run build && cd ..

echo "==> 2. 静态交叉编译 Linux amd64 二进制..."
VERSION=$(./scripts/resolve-version.sh custom)
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 GOWORK=off go build \
  -ldflags "-s -w -X github.com/QuantumNous/new-api/common.Version=$VERSION" \
  -o new-api-custom .

echo "==> 3. 上传二进制文件至服务器..."
scp new-api-custom "${TARGET_HOST}:${REMOTE_BIN_DIR}/new-api-custom.new"
rm -f new-api-custom

echo "==> 4. 远端带时间戳备份、原子替换并重启容器..."
ssh "$TARGET_HOST" '
  REMOTE_BIN="/opt/new-api/bin"
  BAK="${REMOTE_BIN}/new-api-custom.bak-$(date +%Y%m%d-%H%M%S)"
  [ -f "${REMOTE_BIN}/new-api-custom" ] && cp "${REMOTE_BIN}/new-api-custom" "$BAK"
  mv "${REMOTE_BIN}/new-api-custom.new" "${REMOTE_BIN}/new-api-custom"
  chmod +x "${REMOTE_BIN}/new-api-custom"
  docker restart new-api
'

echo "==> 5. 等待服务启动并拉取最新日志..."
sleep 4
ssh "$TARGET_HOST" "docker logs --tail 15 new-api"

echo "==> 部署已完成。"
