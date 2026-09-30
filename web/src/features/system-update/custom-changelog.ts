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
