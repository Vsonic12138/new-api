#!/usr/bin/env bash
set -euo pipefail

TARGET_HOST="${TARGET_HOST:-dedirock}"
REMOTE_BIN_DIR="${REMOTE_BIN_DIR:-/opt/new-api/bin}"
KEEP_BACKUPS="${KEEP_BACKUPS:-3}"
SSH_OPTS=(-o BatchMode=yes -o ConnectTimeout=15 -o ServerAliveInterval=15)

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

export PATH="/home/vsonic12138/.bun/bin:/usr/local/go/bin:$PATH"

cd "$PROJECT_ROOT"

echo "==> 0. 前置检查..."
if [[ -n "$(git status --porcelain)" ]]; then
  echo "错误：工作区存在未提交改动，更新日志不会包含这些变化，请先提交。" >&2
  exit 1
fi
ssh "${SSH_OPTS[@]}" "$TARGET_HOST" \
  "mkdir -p '$REMOTE_BIN_DIR' && test -w '$REMOTE_BIN_DIR'" \
  || { echo "错误：无法连接 ${TARGET_HOST}，或 ${REMOTE_BIN_DIR} 不可写。" >&2; exit 1; }

echo "==> 1. 构建前端静态资源..."
(cd web && bun run build)

echo "==> 2. 静态交叉编译 Linux amd64 二进制..."
VERSION=$(./scripts/resolve-version.sh custom)
BIN=new-api-custom
trap 'rm -f "$PROJECT_ROOT/$BIN"' EXIT
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 GOWORK=off go build \
  -trimpath \
  -ldflags "-s -w -X github.com/QuantumNous/new-api/common.Version=$VERSION" \
  -o "$BIN" .

echo "==> 3. 上传二进制文件至服务器..."
scp -q "${SSH_OPTS[@]}" "$BIN" "${TARGET_HOST}:${REMOTE_BIN_DIR}/${BIN}.new"

echo "==> 4. 远端备份（重命名零拷贝）、原子替换并重启容器..."
EXPECTED_SIZE=$(stat -c %s "$BIN")
BAK=$(ssh "${SSH_OPTS[@]}" "$TARGET_HOST" \
  "REMOTE_BIN_DIR='$REMOTE_BIN_DIR' KEEP_BACKUPS='$KEEP_BACKUPS' BIN='$BIN' EXPECTED_SIZE='$EXPECTED_SIZE' bash -s" <<'REMOTE'
set -euo pipefail

[ -s "$REMOTE_BIN_DIR/$BIN.new" ] || { echo "错误：上传的二进制为空。" >&2; exit 1; }
ACTUAL_SIZE=$(stat -c %s "$REMOTE_BIN_DIR/$BIN.new")
[ "$ACTUAL_SIZE" = "$EXPECTED_SIZE" ] \
  || { echo "错误：上传的二进制大小不符（远端 $ACTUAL_SIZE，本地 $EXPECTED_SIZE）。" >&2; exit 1; }

BAK=""
if [ -f "$REMOTE_BIN_DIR/$BIN" ]; then
  BAK="$REMOTE_BIN_DIR/$BIN.bak-$(date +%Y%m%d-%H%M%S)"
  mv "$REMOTE_BIN_DIR/$BIN" "$BAK"
fi

mv "$REMOTE_BIN_DIR/$BIN.new" "$REMOTE_BIN_DIR/$BIN"
chmod +x "$REMOTE_BIN_DIR/$BIN"
docker restart new-api >/dev/null

# 仅保留最近 KEEP_BACKUPS 个备份；路径由通配符给出，不会误删其它文件
OLD=$(ls -t "$REMOTE_BIN_DIR/$BIN".bak-* 2>/dev/null | tail -n +"$((KEEP_BACKUPS + 1))" || true)
if [ -n "$OLD" ]; then
  printf '%s\n' "$OLD" | xargs -r rm -f --
  echo "已清理旧备份 $(printf '%s\n' "$OLD" | wc -l) 个。" >&2
fi

echo "$BAK"
REMOTE
)

echo "==> 5. 健康检查（最多 30 秒）..."
healthy=0
for _ in $(seq 1 15); do
  code=$(ssh "${SSH_OPTS[@]}" "$TARGET_HOST" \
    "curl -s -o /dev/null -w '%{http_code}' --max-time 5 http://127.0.0.1:3000/api/status" 2>/dev/null || echo 000)
  if [[ "$code" == "200" ]]; then
    healthy=1
    break
  fi
  sleep 2
done

if [[ "$healthy" -ne 1 ]]; then
  echo "错误：健康检查失败，${VERSION} 未能正常启动。" >&2
  if [[ -n "$BAK" ]]; then
    echo "==> 回滚至 $(basename "$BAK")..."
    ssh "${SSH_OPTS[@]}" "$TARGET_HOST" \
      "cp '$BAK' '$REMOTE_BIN_DIR/$BIN' && chmod +x '$REMOTE_BIN_DIR/$BIN' && docker restart new-api >/dev/null"
    echo "已回滚，请检查容器日志。" >&2
  else
    echo "无可用备份，需人工介入。" >&2
  fi
  exit 1
fi

echo "==> 6. 确认容器日志..."
ssh "${SSH_OPTS[@]}" "$TARGET_HOST" "docker logs --tail 15 new-api"

echo "==> 部署完成：$VERSION"
