# Git Commit 规范与二开日志自动同步指南

> **文档版本**: 1.0  
> **制定日期**: 2026-10-03  
> **适用范围**: `new-api` 二开主干分支（`custom-main`）及日常研发协作

---

## 一、 为什么必须规范 Commit 信息？

在我们的二开架构中，**Git Commit 不仅是代码变更记录，也是【系统更新】二开日志的自动数据源**：

1. **自动发布日志驱动**：前端构建系统（`prebuild` 钩子）会自动运行 `scripts/sync-git-changelog.mjs`，从 Git 历史中自动解析 Commit 提交信息，并实时生成前端展示的【二开定制日志】。
2. **分类徽章自动推导**：自动化脚本会根据 Commit 的 `type` 前缀（`feat`、`fix`、`perf`、`chore`），在管理后台的“系统更新”弹窗中自动打上对应的状态颜色徽章。
3. **长期可维护性**：在持续拉取官方上游更新（Upstream Merge）时，规范的 Commit 记录能让合流冲突审查与功能回溯一目了然。

---

## 二、 Commit 格式标准

我们采用业界通用的 **Conventional Commits** 规范：

```text
<type>(<scope>): <subject>

[可选的详细正文描述 body]
[可选的关联 Issue / PR 编号]
```

### 示例速览
* `feat(home): 接入 ZCode 配置截图`
* `fix(i18n): 修复多语言字典命名空间`
* `perf(home): 优化首页滚动渲染`
* `chore(merge): 合并官方 v1.0.0-rc.41 到二开分支`

---

## 三、 Type（变更类型）规范

| Type | 中文含义 | 适用场景 | 系统更新展示徽章 |
|:---|:---|:---|:---:|
| **`feat`** | 新功能 / 新特性 | 新增组件、客户端适配、模型支持或业务功能 | `FEAT` |
| **`fix`** | 缺陷修复 | 修复界面、翻译、路由或业务逻辑问题 | `FIX` |
| **`perf`** | 性能优化 | 减少渲染开销、内存占用或加载时间 | `PERF` |
| **`chore`** | 日常维护 / 构建工具 | 依赖、构建脚本、配置或上游代码同步 | `CHORE` |
| **`refactor`** | 代码重构 | 调整内部结构，不改变外部行为 | `CHORE` |
| **`docs`** | 文档更新 | 更新 `my_docs/`、架构说明或研发规范 | `CHORE` |

---

## 四、 Scope（影响范围）规范

为了让团队和用户快速定位改动模块，括号中的 `scope` 建议严格统一为以下模块标识之一：

| Scope | 对应系统模块 / 路径 | 典型说明 |
|:---|:---|:---|
| **`home`** | `web/src/features/home/` | 首页落地页、客户端指引、模型展示墙等 |
| **`relay`** | `relay/`、`relaykit/` | 接口转发、协议转换、流式处理 |
| **`pricing`** | `web/src/features/pricing/`、`model/pricing*` | 模型定价、阶梯费率、倍率展示 |
| **`wallet`** | `web/src/features/wallet/` | 钱包充值、官方发卡网直达横幅、兑换码 |
| **`keys`** | `web/src/features/keys/` | 令牌生成、API Key 细粒度权限管理 |
| **`i18n`** | `web/src/i18n/` | 多语言字典翻译、命名空间同步 |
| **`system-update`** | `web/src/features/system-update/` | 系统更新弹窗、二开更新日志 |
| **`theme`** | `web/src/styles/` | 主题预设、圆角、深浅色模式 |
| **`merge`** | 根目录 Git 操作 | 合并官方主干代码与冲突解决 |
| **`ci`** | `.github/workflows/` | GitHub Actions 持续集成与镜像打包 |

---

## 五、 提交信息语言与文风规范（强制）

### 1. 统一使用中文
为了让中转站管理人员和团队成员最直观地理解变更内容，**Commit 的摘要（Subject）与正文统一使用简体中文编写**：
* ✅ `feat(home): 接入 ZCode 与 Cherry Studio 官方配置截图及全屏查看`
* ✅ `fix(i18n): 修复多语言字典命名空间层级`
* ✅ `perf(home): 移除静态 will-change 优化页面滚动流畅度`
* ❌ `feat(home): embed official ZCode setup screenshots`（不再使用纯英文）

### 2. 客观克制原则，严禁夸张修饰词
Commit 信息作为工程与版本历史的技术依据，**必须保持平静、严谨、事实导向**，严禁使用任何主观夸张或营销式的形容词：
* 🚫 **严禁词汇**：`顶尖`、`极致`、`超强`、`绝美`、`重磅`、`毫无水分`、`假大空`、`神器` 等。
* 📝 **正反对比示范**：
  * ❌ 浮夸写法：`feat(models): 引入 6 款绝美顶尖主力模型，毫无水分`
  * ✅ 客观写法：`feat(models): 调整热门模型展示列表为 6 款主力模型及 3x2 网格`
  * ❌ 浮夸写法：`perf(home): 彻底消除卡顿，带来极致丝滑体验`
  * ✅ 客观写法：`perf(home): 移除静态 will-change 样式，优化滚动渲染开销`
  * ❌ 浮夸写法：`feat(home): 大刀阔斧消融假大空营销模块，负荷骤降 70%`
  * ✅ 客观写法：`feat(home): 移除 Features 与 Stats 等宣传模块，精简首页结构`

### 3. 字数与格式控制
* 简短摘要建议控制在 **15 ~ 35 个汉字** 之间；
* 动词开头，直述改动的“操作 + 对象 + 目的”，不拖泥带水。

---

## 六、 自动化同步与工作流机制

在二开分支中，我们已经将自动化流水线完全挂载到了前端构建生命周期中：

```mermaid
graph LR
    A[执行 git commit] --> B[运行构建 / 部署脚本]
    B --> C[触发 prebuild 钩子]
    C --> D[运行 sync-git-changelog.mjs]
    D --> E[读取 git log 并解析 Conventional Commits]
    E --> F[自动生成 custom-changelog.ts]
    F --> G[编译打包进前端二进制]
    G --> H[系统更新弹窗自动呈现最新提交与 Hash]
```

每次你执行 `git commit` 后，在进行编译和部署时，**无需手动修改任何文件，系统会自动捕获本次提交内容并呈现给系统更新栏！**
