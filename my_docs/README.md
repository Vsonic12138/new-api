# new-api 二开项目文档库 (my_docs)

欢迎查阅当前项目的二次开发（二开）技术与协作文档库。为了降低跨周期维护与版本合并的认知成本，本目录对所有定制化内容进行了标准化归档。

---

## 目录索引

| 文档名称 | 主要内容 | 适用场景 |
|:---|:---|:---|
| 📑 [20261003-commits-history.md](./20261003-commits-history.md) | **二开提交历史归档**<br>包含所有定制提交的 Hash、修改范围、业务背景及分阶段设计说明。 | 追踪二开功能由来源由、排查历史变更、查看变更明细。 |
| 🌿 [20261003-branches-architecture.md](./20261003-branches-architecture.md) | **分支架构与协作规范**<br>定义 `custom-main`、`official-main` 等分支定位、自动化同步机制与合并 SOP。 | 日常跟进官方主线升级、创建新特性、防冲突开发指引。 |
| 🚀 [plan/20261003-home-page-enhancement-plan.md](./plan/20261003-home-page-enhancement-plan.md) | **首页现代化重构与体验优化规划**<br>涵盖滑动卡顿根治方案、发卡网直达联动、ZCode & Cherry Studio 快速配置卡片与热门模型展示墙架构设计。 | 指导首页二开落地实施与防合并冲突规范。 |
| 📝 [20261003-git-commit-guidelines.md](./20261003-git-commit-guidelines.md) | **Git Commit 规范与更新日志自动同步**<br>定义 Conventional Commits 提交格式、模块 Scope、以及自动提取 Git Log 生成二开日志的构建流水线。 | 规范日常 Git 提交、驱动系统更新弹窗自动生成二开日志。 |

---

## 二开快速原则与规范

1. **改动最小化原则**：核心业务与底层通信尽量复用上游官方逻辑；二次开发优先通过新增独立文件挂载，避免侵入官方高频改动的核心逻辑文件。
2. **动态版本推导**：版本号严禁在代码中写死，通过 `scripts/resolve-version.sh` 根据最新官方 Tag 自动派生 `+custom` 元数据。
3. **安全与多语言优先**：前台新增 UI 元素必须同步提供 7 种语言翻译并支持系统深浅模式；敏感操作严守系统的权限矩阵与二次验证规范。
