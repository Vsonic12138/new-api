# Image Workspace 接入 custom-main（单二进制）

此文档适用于 `Vsonic12138/new-api` 的实际二开部署分支 `custom-main`，
不修改官方镜像 `official-main` 或自动同步用 `main`。

## 代码来源

- 业务工作台：`Vsonic12138/new-api-image-playground` 的 PR #1
- 宿主集成：本仓库 `feat/image-workspace-custom-main`，基于 `custom-main`
- 实现方式：NewAPI 宿主登录态 + 同源 iframe + 四条受认证的 `/pg/image-playground/*` 网关
- **不是** NewAPI Task Plugin 市场所支持的 UI 安装格式

## 构建流程

在本地并排检出两个仓库。确保独立工作台在
`feat/image-workspace-dual-host-architecture` 分支（或审查通过后的正式版本）。

```bash
cd /path/to/new-api
git checkout feat/image-workspace-custom-main
bash scripts/build-image-workspace.sh ../new-api-image-playground
cd web
bun install
bun run build
cd ..
# 沿用 my_docs/20261005-binary-deployment-guide.md 中既有 Go 静态编译和部署步骤
```

脚本把经过 `VITE_API_MODE=embedded` 构建的静态文件复制到
`web/public/pg-image-workspace/`。Rsbuild 会将这些文件复制到
`web/dist/pg-image-workspace/`，最后由已有的 `//go:embed web/dist`
打入 NewAPI 单二进制。无需 Nginx 增配，亦无需同时部署 Node BFF。

发布二进制之后，配置 `IMAGE_WORKSPACE_ENABLED=true` 并重启
NewAPI，才能在侧边栏看到 Image Workspace。此开关默认关闭。
静态资源虽然同源公开可读取，但所有模型 API 仍需要后端会话鉴权；
不要在资源包中写入密钥。

## Cloudflare Tunnel / Cookie / Origin

当前部署形态可能是 Cloudflare HTTPS -> 本地 NewAPI HTTP。
经审查 `common/session_cookie.go`，可信公开来源由下列环境变量配置：

```dotenv
SESSION_COOKIE_SECURE=true
SESSION_COOKIE_TRUSTED_URL=https://your-newapi-public-domain.example
```

部署时将地址改成你自己的实际 HTTPS 站点 Origin（不带路径）。
在 Cloudflare Tunnel 后面，Go 接收到的内部 HTTP 请求可能缺少 TLS，
因此 PlaygroundOriginGuard 会使用这一可信 HTTPS Origin 校验；
缺少配置时浏览器可能登录正常但无法生图。
`SESSION_COOKIE_TRUSTED_URL` 要求 `SESSION_COOKIE_SECURE=true`，
切勿为通过测试而关闭 Origin 校验或允许任意 Origin。
仍需实测合法来源允许、恶意跨域和无 Origin 请求拒绝。

## 验收顺序

1. 在专用分支完成 Go vet/build/test 和前端 TypeScript/测试。
2. 验证关掉开关时隐藏侧边栏入口、拒绝页面路由。
3. 在单二进制构建中确认 `/pg-image-workspace/index.html` 和静态 JS 正确返回。
4. 通过 NewAPI 浏览器登录态访问，不应要求再次粘贴 Key。
5. 用户 A 无法选择用户 B 的 Token ID；失效、额度、分组和图片模型限制必须拦截。
6. 图片生成、编辑、Responses 图片工具实际路由和计费须经过最小范围付费验收。

先在非生产环境验收，不要直接在已运行的生产版本覆盖部署。
