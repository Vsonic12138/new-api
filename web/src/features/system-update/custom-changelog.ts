/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

export interface CustomChangelogItem {
  tag: 'feat' | 'fix' | 'perf' | 'chore'
  titleEn: string
  titleZh: string
  descEn: string
  descZh: string
}

export interface CustomReleaseGroup {
  version: string
  upstreamBase: string
  date: string
  items: CustomChangelogItem[]
}

export const CUSTOM_CHANGELOG_DATA: CustomReleaseGroup[] = [
  {
    version: 'v1.0.0-rc.41+custom',
    upstreamBase: 'v1.0.0-rc.41',
    date: '2026-10-03',
    items: [
      {
        tag: 'feat',
        titleEn: 'Upstream baseline v1.0.0-rc.41 sync & merge',
        titleZh: '同步合并官方 v1.0.0-rc.41 最新基线',
        descEn:
          'Merged 19 upstream commits including fine-grained access tokens, step-up authentication, MoeJS task plugin runtime upgrade, and Responses protocol Claude/Gemini tool calling fixes.',
        descZh:
          '合并官方 19 个最新提交，包含访问令牌细粒度权限作用域、二次身份核验、MoeJS 任务插件引擎升级，以及 Responses 协议 Claude 与 Gemini 复杂工具调用修复。',
      },
      {
        tag: 'feat',
        titleEn: 'Homepage relay service overhaul and extensive section ablation',
        titleZh: '首页中转服务全面重构与冗余模块消融',
        descEn:
          'Refocused entire landing page on DaHuang API relay service. Extensively ablated 4 redundant promotional blocks (Features, Stats, HowItWorks, CTA), reducing cognitive load by 70% while improving scroll smoothness.',
        descZh:
          '全站全面聚焦“大黄API · 大狗叫”中转服务。深度消融砍掉 Features、Stats、HowItWorks、CTA 等 4 大假大空营销模块，阅读负荷骤降 70%，消除页面滚动掉帧。',
      },
      {
        tag: 'feat',
        titleEn: 'Curated 6-flagship models matrix with transparent pricing',
        titleZh: '精选 6 大核心旗舰模型矩阵与真实费率展示',
        descEn:
          'Refined featured models to 6 top-tier drivers (claude-sonnet-5, gpt-6.1-sol, claude-opus-5-5, gpt-5.6-luna, grok-4.7, deepseek-v4-flash) with 3x2 grid layout and one-click real model ID copy.',
        descZh:
          '移除低质模型，锁定 6 款顶级主力模型（Sonnet 5、Sol、Opus 5.5、Luna、Grok 4.7、DeepSeek V4），优化 3×2 规整布局，真实倍率一目了然，支持一键复制真实 Model ID。',
      },
      {
        tag: 'feat',
        titleEn: 'Official visual setup guides for ZCode, Cherry Studio, and DSH',
        titleZh: 'ZCode、Cherry Studio 与 DSH 官方原版图文指引与灯箱放大',
        descEn:
          'Embedded official setup screenshots with parameter highlights from ZCode and Cherry Studio documentation, integrated official ZCode logo from z.ai, and added interactive full-screen lightbox zoom.',
        descZh:
          '引入智谱官方文档配置原图（带接口地址与 Key 填入指引）及 Cherry Studio 官方截图，接入官方原版 Logo，增加全屏灯箱沉浸式放大；DSH 支持环境变量一行代码免配置启动。',
      },
      {
        tag: 'fix',
        titleEn: 'Adaptive network origin detection & i18n namespace fix',
        titleZh: '自适应网络端点智能感知与国际化命名空间修复',
        descEn:
          'Fixed incorrect localhost base URL fallback by binding strictly to window.location.origin across public and local LAN environments; standardized all 7 locale files under the translation namespace.',
        descZh:
          '彻底修复复制端点回退至 localhost 的问题，优先绑定浏览器真实访问地址，内网 IP 与公网域名 100% 自动对齐；将 7 种语言字典严格归位至 translation 命名空间并修复 /keys 路由。',
      },
    ],
  },
  {
    version: 'v1.0.0-rc.40+custom',
    upstreamBase: 'v1.0.0-rc.40',
    date: '2026-09-30',
    items: [
      {
        tag: 'feat',
        titleEn: 'Card shop recharge banner and redemption guide',
        titleZh: '钱包充值支持官方发卡网直达横幅与兑换引导',
        descEn:
          'Added a responsive, theme-adaptive official card shop recharge banner with direct access button, plus redemption capsules and full 7-locale i18n support.',
        descZh:
          '在钱包充值页引入主题自适应的发卡网自动充值大横幅与直达购买按钮，增加卡密兑换引导胶囊，适配 7 种语言完整国际化。',
      },
      {
        tag: 'feat',
        titleEn: 'Preset theme aligned to simple-large with 0.5 radius',
        titleZh: '系统出厂默认主题对齐超大字体简约 (simple-large) 与 0.5 圆角',
        descEn:
          'Set system default customization to simple-large, sans font, 0.5 radius (md), and system dark/light adaptation; fixed underlying data-theme attribute cascade.',
        descZh:
          '统一系统默认预设为超大字体简约、Sans 字体、0.5 圆角 (md) 及跟随系统深浅自适应，修复底层主题属性映射，新访客与无痕窗口开箱即用。',
      },
      {
        tag: 'feat',
        titleEn: 'Official tiered billing expressions and model pricing',
        titleZh: '模型官方阶梯计费 (tiered_expr) 与倍率对齐',
        descEn:
          'Aligned gpt-6.1-sol, claude-opus-5-5, claude-opus-5, and claude-sonnet-5 with official tiered billing expressions to accurately calculate cache read/write differentials.',
        descZh:
          '对齐 gpt-6.1-sol、claude-opus-5-5、claude-opus-5、claude-sonnet-5 官方动态阶梯计费表达式，精准核算 Prompt Caching 读写差价与官方费率。',
      },
      {
        tag: 'chore',
        titleEn: 'Dynamic custom version derivation from upstream tags',
        titleZh: '动态二开版本标识与自动更新推导',
        descEn:
          'Dynamically derives custom build version from the latest reachable official tag with +custom build metadata, eliminating unknown version alerts and ensuring clean upstream merges.',
        descZh:
          '构建流程自动基于最近可达的官方 Tag 动态推导并生成 +custom 构建元数据，彻底解决未知版本误报，无缝兼容后续官方主干升级。',
      },
    ],
  },
]
