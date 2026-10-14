# 生产环境二进制热替换部署指南

本文档记录 `new-api` 在生产环境所采用的 **本地静态交叉编译 + 宿主机二进制替换 + 重启容器** 部署方案。

---

## 1. 方案架构

`new-api` 采用单二进制（Single-Binary）设计：
1. **静态嵌入**：前端（React 19 / TypeScript）经 `bun run build` 输出至 `web/dist/` 后，由 Go 后端通过 `//go:embed web/dist` 在编译期嵌入二进制文件。
2. **挂载覆盖**：服务器端运行官方 Docker 基础容器，但通过 `docker-compose.yml` 将宿主机的自定义二进制挂载至容器内部，覆盖原默认入口：
   ```yaml
   volumes:
     - ./data:/data
     - ./logs:/app/logs
     - ./bin/new-api-custom:/new-api:ro
   ```
3. **部署实质**：日常更新无需在服务器端拉取或构建 Docker 镜像，只需在本地编译出 Linux amd64 静态二进制文件，上传覆盖宿主机挂载文件后执行 `docker restart new-api`。

---

## 2. 基础信息与路径约定

| 项 | 说明 |
| :--- | :--- |
| **本地编译环境** | WSL2 (Ubuntu 22.04), Go 1.25+, Bun 1.4+ |
| **服务器地址** | `23.94.237.253`，SSH 端口 `8443` |
| **SSH 别名配置** | `~/.ssh/config` 中的 `Host dedirock`（免密密钥登录） |
| **服务器工作目录** | `/opt/new-api/` |
| **二进制存放路径** | `/opt/new-api/bin/new-api-custom` |
| **历史备份格式** | `/opt/new-api/bin/new-api-custom.bak-YYYYMMDD-HHMMSS` |
| **备份保留策略** | 每次部署自动裁剪，仅保留最近 `KEEP_BACKUPS`（默认 3）个 |
| **健康检查** | 部署后轮询本机 `http://127.0.0.1:3000/api/status`，最长 30 秒，失败自动回滚 |
| **公网接入入口** | Cloudflare Tunnel 映射本地 `3000` 端口 (`https://newapi.vsonic12138.shop`) |

---

## 3. 标准部署步骤

以下操作均在本地项目根目录（WSL 环境）下执行。

### 步骤 1：前端编译打包
生成最新的静态文件至 `web/dist`：
```bash
cd web
bun run build
cd ..
```

### 步骤 2：Go 二进制静态交叉编译
关闭 CGO，以静态链接方式编译为 Linux x86_64 可执行文件：
```bash
VERSION=$(./scripts/resolve-version.sh custom)
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 GOWORK=off go build \
  -ldflags "-s -w -X github.com/QuantumNous/new-api/common.Version=$VERSION" \
  -o new-api-custom .
```
> **注意**：必须显式指定 `CGO_ENABLED=0`，避免依赖宿主机动态 glibc 库，确保在各类 Linux 容器中均可稳定执行。

### 步骤 3：上传至服务器临时位置
每次部署使用独立的临时文件名（`STAMP` 为时间戳加进程号）。**不要复用固定文件名**：上传中断会在服务器上留下持有该文件写句柄的孤儿 `scp` 进程，若复用文件名，其 inode 会被后续 `mv` 提升为可执行文件，导致容器 `exec /new-api: text file busy`（ETXTBSY）且反复重启。
```bash
STAMP="$(date +%Y%m%d-%H%M%S)-$$"
gzip -6 -c new-api-custom > new-api-custom.gz
scp new-api-custom.gz "dedirock:/opt/new-api/bin/new-api-custom.new.${STAMP}.gz"
```

### 步骤 4：远端解压、校验、备份、原子替换并重启容器
远端先解压上传的压缩包并校验字节数，再用**重命名**（同分区 rename，零拷贝且原子）完成备份与替换，避免每次部署都复制完整的 138 MB 二进制：
```bash
STAMP="$(date +%Y%m%d-%H%M%S)-$$"      # 与步骤 3 同一取值
EXPECTED_SIZE=$(stat -c %s new-api-custom)

ssh dedirock "
  set -euo pipefail
  BIN=new-api-custom
  DIR=/opt/new-api/bin
  TMP=\"\$DIR/\$BIN.new.$STAMP\"
  gunzip -c \"\$TMP.gz\" > \"\$TMP\"
  rm -f \"\$TMP.gz\"
  [ \"\$(stat -c %s \"\$TMP\")\" = \"$EXPECTED_SIZE\" ] || { rm -f \"\$TMP\"; echo 大小校验失败; exit 1; }
  if [ -f \"\$DIR/\$BIN\" ]; then
    BAK=\"\$DIR/\$BIN.bak-\$(date +%Y%m%d-%H%M%S)\"
    mv \"\$DIR/\$BIN\" \"\$BAK\"
  fi
  mv \"\$TMP\" \"\$DIR/\$BIN\"
  chmod +x \"\$DIR/\$BIN\"
  docker restart new-api
"
```
> **替换前必须确认临时文件没有被其它进程以写方式打开。** 被写句柄污染的 inode 一旦成为 `/new-api` 的挂载源，容器每次启动都会 `ETXTBSY`；此时仅 `docker restart` / `docker start` 无法恢复，必须 `docker compose up -d --no-deps --force-recreate new-api` 重建容器才能解除旧挂载。

### 步骤 5：裁剪历史备份
只保留最近 3 个备份，防止长期累积占满磁盘（路径来自通配符，不会误删其它文件）：
```bash
ssh dedirock 'ls -t /opt/new-api/bin/new-api-custom.bak-* | tail -n +4 | xargs -r rm -f --'
```

### 步骤 6：健康检查
轮询本机 `3000` 端口，最长等待 30 秒；未在时限内返回 `200` 即判定部署失败，应还原备份并重新执行步骤 4：
```bash
ssh dedirock "curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/api/status"
```

### 步骤 7：清理本地编译产物
```bash
rm -f new-api-custom new-api-custom.gz
```

---

## 4. 验证检查

`scripts/deploy-remote.sh` 已内置健康检查：部署后轮询本机 `http://127.0.0.1:3000/api/status`，最长 30 秒；若未返回 `200`，脚本会自动还原备份、重启容器并以非 0 退出码结束。

手动复核时，依次执行以下命令确认服务正常：

1. **容器运行状态与日志**：
   ```bash
   ssh dedirock "docker ps | grep new-api && docker logs --tail 20 new-api"
   ```
   输出包含 `ready in ... ms` 说明初始化完成。

2. **状态接口探测**：
   ```bash
   curl -s https://newapi.vsonic12138.shop/api/status | grep '"success":true'
   ```

3. **静态资源指纹匹配**：
   访问网站根路径，检查返回的 HTML 引入的 `index.<hash>.js` 是否与本地 `web/dist/static/js/` 的 Hash 一致。

---

## 5. 故障回滚操作

若新版本启动异常或存在严重缺陷，可通过保留的历史备份在数秒内完成回滚：

1. 查看可用历史备份：
   ```bash
   ssh dedirock "ls -lt /opt/new-api/bin/new-api-custom.bak-*"
   ```
2. 还原目标备份并重启：
   ```bash
   # 将 <BAK_FILE> 替换为目标备份文件名
   ssh dedirock '
     cp /opt/new-api/bin/<BAK_FILE> /opt/new-api/bin/new-api-custom
     chmod +x /opt/new-api/bin/new-api-custom
     docker restart new-api
   '
   ```

---

## 6. 一键部署自动化脚本

日常部署直接执行项目脚本，其步骤与第 3 节一致，并在此基础上提供十项保障：

1. **前置检查**：工作区存在未提交改动时直接中止（更新日志由 git log 生成，未提交的改动不会出现在“系统更新”里）；同时预检 SSH 连通性与远端目录可写性。
2. **长连接复用**：整个流程复用一条 SSH 主连接（该主机在短时间内多次新建连接时会偶发在握手阶段被拒），首次建连失败自动重试 5 次。
3. **压缩上传与重试**：二进制先 gzip 压缩（约 138 MB → 44 MB）再上传，链路中断自动重试 3 次。
4. **独立临时文件名**：每次部署使用带时间戳的临时名，避免中断上传遗留的孤儿 `scp` 进程污染将被提升的 inode。
5. **清理残留**：替换前回收历史遗留的上传接收进程与其它轮次遗留的临时文件。
6. **完整性校验**：替换前比对解压后的字节数，避免被截断的文件上线。
7. **写持有拦截**：替换前扫描临时文件 inode，只要有进程以写方式持有就放弃替换并保持线上原状——这正是 ETXTBSY 事故的防线。
8. **可重入替换**：替换步骤若因连接中断而重跑，脚本会识别临时文件已被消费且线上已是本次构建，直接判定成功，不会误报失败或重复替换。
9. **零拷贝备份与裁剪**：把当前二进制重命名为带时间戳的备份（不复制整份文件），并仅保留最近 `KEEP_BACKUPS` 个。
10. **健康检查与回滚**：轮询 `/api/status`，失败时先打印容器日志，再还原备份；若仅重启无效则强制重建容器。

脚本 `scripts/deploy-remote.sh` 是唯一事实来源，此处不再重复其内容。可通过环境变量覆盖默认行为：

| 变量 | 默认值 | 说明 |
| :--- | :--- | :--- |
| `TARGET_HOST` | `dedirock` | `~/.ssh/config` 中的主机别名 |
| `REMOTE_BIN_DIR` | `/opt/new-api/bin` | 服务器端二进制目录 |
| `REMOTE_APP_DIR` | `/opt/new-api` | 服务器端 compose 目录，回滚时用于强制重建容器 |
| `KEEP_BACKUPS` | `3` | 保留的历史备份数量，超出部分自动删除 |

例如临时保留 5 个备份：

```bash
KEEP_BACKUPS=5 ./scripts/deploy-remote.sh
```
