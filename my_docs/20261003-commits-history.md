# new-api 二开提交历史记录 (Commits History)

本文档归档并详细记录当前项目所有自定义二次开发（二开）的提交记录。每个提交条目均包含 Commit Hash、提交日期、作者、所属模块、修改文件及详细设计目的，便于溯源与后续维护。

---

## 一、 二开提交总览表

| 序号 | Commit SHA | 提交日期 | 类别 | 提交说明 (Subject) | 核心修改模块 |
|:---:|:---:|:---:|:---:|:---|:---|
| 01 | `0955736f8` / `d8a013a41` | 2026-08-05 | `ci` | ci: add rebase-based upstream sync workflow | 上游同步工作流初始化 |
| 02 | `abf0c673c` / `0351fb8eb` | 2026-08-05 | `ci` | ci: fix sync workflow detached HEAD and add push guard | 同步工作流 Head 游离与推送守卫 |
| 03 | `9bd6722fe` / `340a9d311` | 2026-08-05 | `ci` | ci: pin explicit lease SHA for upstream sync push | 同步工作流 SHA 锁机制 |
| 04 | `0201c6b45` / `916f1897d` | 2026-08-11 | `ci` | ci: switch to official-main mirror sync | 切换为 official-main 独立镜像架构 |
| 05 | `b667d6941` / `b3586ec3d` | 2026-08-11 | `ci` | ci: configure git identity for upstream merge step | 配置同步机器人 Git 身份信息 |
| 06 | `2e4f6979c` | 2026-08-19 | `fix(ci)` | fix(ci): use PAT token for upstream sync to allow workflow file updates | 引入 PAT 解决工作流推送权限问题 |
| 07 | `4e2969226` / `11f7f6e45` | 2026-08-19 | `ci` | chore(ci): temporary token diagnostics | 临时排查 Token 权限 |
| 08 | `5cc66af14` | 2026-08-19 | `ci` | chore(ci): remove temporary token diagnostics | 清理诊断代码 |
| 09 | `cb54b6190` | 2026-08-19 | `chore` | Merge branch 'main' into custom-main | 合并 main 至 custom-main |
| 10 | `dd4890714` | 2026-09-29 | `chore` | chore: merge official-main into custom-main | 合并 official-main 至 custom-main |
| 11 | `75d4a0c98` | 2026-09-30 | `feat` | feat(wallet): enhance card shop banner and redemption guide with theme and i18n support | 钱包充值发卡网横幅与兑换胶囊引导 |
| 12 | `ac1c9163e` | 2026-09-30 | `feat` | feat(theme): set default theme preset to ocean-breeze | 尝试切换默认主题预设为海风蓝 |
| 13 | `3fc6f2f64` | 2026-09-30 | `feat` | feat(theme): set default theme preset to simple-large with sans font and 0.5 radius | 最终确立默认预设为超大字体简约 |
| 14 | `25a12708b` | 2026-09-30 | `fix` | fix(theme): ensure data-theme-* attributes are applied when default customization differs from base preset | 修复系统默认主题属性映射层叠失效 |
| 15 | `d4315a1e8` | 2026-09-30 | `chore` | chore(release): record custom version metadata as v1.0.0-rc.40+custom | 静态记录定制版本标识 |
| 16 | `56719a753` | 2026-09-30 | `build` | build: derive custom versions from official tags | 建立根据官方 Tag 动态推导版本体系 |
| 17 | `08431501d` | 2026-09-30 | `feat` | feat(system-update): provide tabbed view for custom changelog and official upstream releases | 系统更新弹窗支持二开/官方双 Tab |
| 18 | `6384a7de2` | 2026-10-03 | `chore` | chore: merge official-main into custom-main | 合并官方主线最新 19 个提交（含 rc.41） |

---

## 二、 核心提交详细说明

### 阶段一：自动同步与 CI 架构基础设施

#### 1. 切换为镜像同步流水线
- **Commit**: `0201c6b45` / `916f1897d`
- **作者**: BigYellow12138
- **日期**: 2026-08-11
- **涉及文件**: `.github/workflows/sync-upstream.yml`
- **功能说明**: 
  - 将原先基于 rebase 的上游同步流程改造为独立的 `official-main` 镜像分支架构。
  - GitHub Actions 定时抓取 `QuantumNous/new-api:main`，无损 fast-forward 镜像到 `origin/official-main`，并同时 merge 到 `origin/main`。
  - 彻底将用户的二开开发分支（`custom-main`）从自动同步链路中解耦，防止自动化脚本意外覆盖或变基二开代码。

#### 2. PAT 权限修复与同步守护
- **Commit**: `2e4f6979c`
- **作者**: TangHL
- **日期**: 2026-08-19
- **涉及文件**: `.github/workflows/sync-upstream.yml`
- **功能说明**:
  - GitHub 默认的 `GITHUB_TOKEN` 具有安全保护机制，不允许通过普通 Action 推送包含 `.github/workflows/` 变更的提交，导致上游一旦更新工作流就会同步失败。
  - 引入 `UPSTREAM_SYNC_TOKEN`（个人访问令牌 PAT），赋予 `workflow` 作用域，解决了 GitHub 拒绝推送工作流的权限报错，使后续同步长期稳定运行。

---

### 阶段二：UI 界面与商业化功能增强

#### 3. 钱包发卡网横幅与兑换引导
- **Commit**: `75d4a0c98`
- **作者**: BigYellow12138
- **日期**: 2026-09-30
- **涉及文件**:
  - `web/src/features/wallet/components/recharge-form-card.tsx`
  - `web/src/i18n/locales/*.json` (7 种语言)
- **功能说明**:
  - 在用户前台钱包充值页面中，集成官方自动发卡网的直达横幅与直接购买按钮。
  - 增加卡密兑换胶囊引导，优化用户充值体验与视觉层次。
  - 支持随系统明暗主题自适应配色，并补充了完整 7 种语言的本地化词条。

#### 4. 出厂默认主题预设对齐 (Simple-Large)
- **Commit**: `3fc6f2f64` & `25a12708b`
- **作者**: BigYellow12138
- **日期**: 2026-09-30
- **涉及文件**:
  - `web/src/lib/theme-customization.ts`
  - `web/src/context/theme-customization-provider.tsx`
- **功能说明**:
  - 将系统全局出厂默认主题调整为：超大字体简约风格 (`simple-large`)、无衬线字体 (`sans`)、0.5 圆角 (`md`)，并支持跟随系统深浅模式自适应。
  - 修复底层 DOM `data-theme-*` 属性映射逻辑，确保新访客及无痕窗口访问时无需手动配置即可开箱即用应用预设样式。

---

### 阶段三：二开工程化与版本体系改造

#### 5. 动态构建版本推导体系
- **Commit**: `56719a753`
- **作者**: BigYellow12138
- **日期**: 2026-09-30
- **涉及文件**:
  - `scripts/resolve-version.sh` (新增)
  - `Dockerfile.dev`
  - `electron/build.sh`
  - `makefile`
  - `.github/workflows/docker-image-branch.yml`
  - `VERSION` (删除静态文件)
- **功能说明**:
  - 废弃原先写死且易引起合并冲突的静态 `VERSION` 纯文本文件。
  - 新增 `scripts/resolve-version.sh` 脚本，在构建时通过 `git describe` 自动抓取最近可达的官方版本 Tag，并派生追加 `+custom` 后缀（如 `v1.0.0-rc.41+custom`）。
  - 全面打通 Makefile、Docker 本地构建、Electron 客户端打包以及 GitHub Actions 多架构镜像打包流水线，从根本上解决版本号陈旧与合并冲突问题。

#### 6. 系统更新弹窗支持二开/官方双 Tab
- **Commit**: `08431501d`
- **作者**: BigYellow12138
- **日期**: 2026-09-30
- **涉及文件**:
  - `web/src/features/system-update/custom-changelog.ts` (新增)
  - `web/src/features/system-update/system-update-dialog.tsx`
  - `web/src/i18n/locales/*.json` (7 种语言)
- **功能说明**:
  - 将后台的“系统更新”提示弹窗改造为 Tabs 选项卡结构：
    1. **二开定制日志 (Custom Changelog)**：读取独立数据源 `custom-changelog.ts`，展示当前二开版本的专属功能演进、Tag 标签（FEAT / FIX / PERF / CHORE）及对应上游官方基线。
    2. **官方基线发布 (Upstream Release)**：渲染从 GitHub 官方仓库获取到的最新上游发布日志（附带前往 GitHub Releases 按钮）。

---

### 阶段四：主线版本跟进与平滑合并

#### 7. 升级合入官方主线最新提交（含 v1.0.0-rc.41）
- **Commit**: `6384a7de2`
- **作者**: BigYellow12138
- **日期**: 2026-10-03
- **涉及文件**: 191 个文件（Go 后端、moejs 引擎、RelayKit 协议转换、Access Token 体系、前端组件等）
- **功能说明**:
  - 将上游官方最新的 19 个提交无冲突合入二开分支 `custom-main`。
  - 同步获得官方重大安全特性：细粒度 Scoped Access Token、管理员高危操作提权二次验证（Step-up Verification）。
  - 同步获得核心架构优化：插件引擎全面升级为 `Calcium-Ion/moejs`、Responses 协议 Codex 自定义工具透传修复。
  - 二开版本号经动态脚本自动升阶至 **`v1.0.0-rc.41+custom`**。
