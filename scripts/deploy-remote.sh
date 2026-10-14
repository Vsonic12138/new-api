#!/usr/bin/env bash
set -euo pipefail

TARGET_HOST="${TARGET_HOST:-dedirock}"
REMOTE_BIN_DIR="${REMOTE_BIN_DIR:-/opt/new-api/bin}"
REMOTE_APP_DIR="${REMOTE_APP_DIR:-/opt/new-api}"
KEEP_BACKUPS="${KEEP_BACKUPS:-3}"
# 该主机对短时间内的多次新建连接不可靠（握手阶段偶发被拒），统一复用一条长连接
SSH_CONTROL="${TMPDIR:-/tmp}/dsh-deploy-%r@%h-%p"
SSH_OPTS=(-o BatchMode=yes -o ConnectTimeout=15 -o ServerAliveInterval=15
          -o ControlMaster=auto -o ControlPath="$SSH_CONTROL" -o ControlPersist=300)

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

export PATH="/home/vsonic12138/.bun/bin:/usr/local/go/bin:$PATH"

cd "$PROJECT_ROOT"

cleanup() {
  ssh -O exit "${SSH_OPTS[@]}" "$TARGET_HOST" >/dev/null 2>&1 || true
  rm -f "$PROJECT_ROOT/new-api-custom" "$PROJECT_ROOT/new-api-custom.gz"
  rm -f "$SSH_CONTROL"
}
trap cleanup EXIT

echo "==> 0. 前置检查..."
if [[ -n "$(git status --porcelain)" ]]; then
  echo "错误：工作区存在未提交改动，更新日志不会包含这些变化，请先提交。" >&2
  exit 1
fi
connected=0
for attempt in 1 2 3 4 5; do
  if ssh "${SSH_OPTS[@]}" "$TARGET_HOST" \
    "mkdir -p '$REMOTE_BIN_DIR' && test -w '$REMOTE_BIN_DIR'"; then
    connected=1
    break
  fi
  echo "  连接失败，重试（$attempt/5）..." >&2
  sleep 3
done
if [[ "$connected" -ne 1 ]]; then
  echo "错误：无法连接 ${TARGET_HOST}，或 ${REMOTE_BIN_DIR} 不可写。" >&2
  exit 1
fi

echo "==> 1. 构建前端静态资源..."
(cd web && bun run build)

echo "==> 2. 静态交叉编译 Linux amd64 二进制..."
VERSION=$(./scripts/resolve-version.sh custom)
BIN=new-api-custom
STAMP="$(date +%Y%m%d-%H%M%S)-$$"
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 GOWORK=off go build \
  -trimpath \
  -ldflags "-s -w -X github.com/QuantumNous/new-api/common.Version=$VERSION" \
  -o "$BIN" .

# 每次使用独立的临时文件名：上传中断会在远端留下持有该文件写句柄的孤儿 scp 进程，
# 若复用固定文件名，其 inode 会被后续 mv 提升为可执行文件，导致 exec 永久返回 ETXTBSY。
echo "==> 3. 压缩并上传二进制文件至服务器..."
gzip -6 -c "$BIN" > "$BIN.gz"
uploaded=0
for attempt in 1 2 3; do
  if scp -q "${SSH_OPTS[@]}" "$BIN.gz" "${TARGET_HOST}:${REMOTE_BIN_DIR}/${BIN}.new.${STAMP}.gz"; then
    uploaded=1
    break
  fi
  echo "  上传中断，重试（$attempt/3）..." >&2
  sleep 5
done
rm -f "$BIN.gz"
if [[ "$uploaded" -ne 1 ]]; then
  echo "错误：上传失败（已重试 3 次）。" >&2
  exit 1
fi

echo "==> 4. 远端解压校验、备份、原子替换并重启容器..."
EXPECTED_SIZE=$(stat -c %s "$BIN")
BAK=$(ssh "${SSH_OPTS[@]}" "$TARGET_HOST" \
  "REMOTE_BIN_DIR='$REMOTE_BIN_DIR' KEEP_BACKUPS='$KEEP_BACKUPS' BIN='$BIN' STAMP='$STAMP' EXPECTED_SIZE='$EXPECTED_SIZE' bash -s" <<'REMOTE'
set -euo pipefail

TMP="$REMOTE_BIN_DIR/$BIN.new.$STAMP"
GZ="$TMP.gz"

# 清理历史中断上传残留的接收进程与其它轮次遗留的临时文件
if pkill -f "scp -t $REMOTE_BIN_DIR/" 2>/dev/null; then
  echo "已清理残留的上传接收进程。" >&2
fi
find "$REMOTE_BIN_DIR" -maxdepth 1 -name "$BIN.new.*" ! -name "$BIN.new.$STAMP*" -delete 2>/dev/null || true

if [ -s "$GZ" ]; then
  gunzip -c "$GZ" > "$TMP"
  rm -f "$GZ"
fi
if [ ! -s "$TMP" ]; then
  # 连接中断后重试至此：临时文件已被本轮替换消费，线上已是本次构建即视为成功
  if [ "$(stat -c %s "$REMOTE_BIN_DIR/$BIN" 2>/dev/null)" = "$EXPECTED_SIZE" ]; then
    echo "本次构建已在位，跳过替换。" >&2
    echo ""
    exit 0
  fi
  echo "错误：未找到上传的临时文件。" >&2
  exit 1
fi

ACTUAL_SIZE=$(stat -c %s "$TMP")
[ "$ACTUAL_SIZE" = "$EXPECTED_SIZE" ] \
  || { rm -f "$TMP"; echo "错误：上传的二进制大小不符（远端 $ACTUAL_SIZE，本地 $EXPECTED_SIZE）。" >&2; exit 1; }

# 只要仍有进程以写方式持有该 inode，替换后容器 exec 就会永久 ETXTBSY，必须在替换前拦截
TMP_INO=$(stat -c %i "$TMP")
WRITERS=""
for proc in /proc/[0-9]*; do
  for fdinfo in "$proc"/fdinfo/*; do
    [ -f "$fdinfo" ] || continue
    [ "$(awk '/^ino:/{print $2}' "$fdinfo" 2>/dev/null)" = "$TMP_INO" ] || continue
    [ $(( 0$(awk '/^flags:/{print $2}' "$fdinfo" 2>/dev/null) & 3 )) -ne 0 ] || continue
    WRITERS="$WRITERS $(basename "$proc")"
  done
done
if [ -n "$WRITERS" ]; then
  rm -f "$TMP"
  echo "错误：临时文件仍被进程以写方式持有（$WRITERS），已放弃替换，线上保持原状。" >&2
  exit 1
fi

BAK=""
if [ -f "$REMOTE_BIN_DIR/$BIN" ]; then
  BAK="$REMOTE_BIN_DIR/$BIN.bak-$(date +%Y%m%d-%H%M%S)"
  mv "$REMOTE_BIN_DIR/$BIN" "$BAK"
fi

mv "$TMP" "$REMOTE_BIN_DIR/$BIN"
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
  echo "错误：健康检查失败，${VERSION} 未能正常启动。容器最近日志：" >&2
  ssh "${SSH_OPTS[@]}" "$TARGET_HOST" "docker logs --tail 20 new-api" >&2 || true
  if [[ -n "$BAK" ]]; then
    echo "==> 回滚至 $(basename "$BAK")..." >&2
    ssh "${SSH_OPTS[@]}" "$TARGET_HOST" \
      "REMOTE_APP_DIR='$REMOTE_APP_DIR' REMOTE_BIN_DIR='$REMOTE_BIN_DIR' BAK='$BAK' BIN='$BIN' bash -s" <<'REMOTE'
set -euo pipefail
cp -f "$BAK" "$REMOTE_BIN_DIR/$BIN"
chmod +x "$REMOTE_BIN_DIR/$BIN"
docker restart new-api >/dev/null
for _ in $(seq 1 10); do
  sleep 2
  if [ "$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 http://127.0.0.1:3000/api/status)" = "200" ]; then
    echo "回滚已生效。"
    exit 0
  fi
done
# 被污染的 inode 可能已被旧容器的挂载点固定，仅重启无效，需强制重建容器
echo "重启未恢复，改为强制重建容器..." >&2
cd "$REMOTE_APP_DIR" && docker compose up -d --no-deps --force-recreate new-api >/dev/null 2>&1 || true
sleep 8
echo "回滚后健康检查：$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 http://127.0.0.1:3000/api/status)"
if [ "$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 http://127.0.0.1:3000/api/status)" != "200" ]; then
  echo "回滚失败，需人工介入。" >&2
  exit 1
fi
REMOTE
  else
    echo "无可用备份，需人工介入。" >&2
  fi
  exit 1
fi

echo "==> 6. 确认容器日志..."
ssh "${SSH_OPTS[@]}" "$TARGET_HOST" "docker logs --tail 15 new-api"

echo "==> 部署完成：$VERSION"
