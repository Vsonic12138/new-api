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

import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../../')
const targetFile = path.resolve(
  __dirname,
  '../src/features/system-update/custom-changelog.ts'
)

// 历史英文提交转为克制简明中文的平滑映射（新提交将直接编写规范中文）
const legacyEnToZh = {
  'update auto-generated custom changelog': '自动同步 Git 提交记录至更新日志',
  'automate changelog generation from git log and establish commit guidelines':
    '自动化提取 Git 提交记录生成更新日志并制定提交规范',
  'update custom changelog to v1.0.0-rc.41+custom with latest deliverables':
    '更新二开更新日志数据',
  'embed official ZCode & CherryStudio setup screenshots with mode switch and lightbox':
    '接入 ZCode 与 Cherry Studio 官方配置截图及全屏查看',
  'use official ZCode icon from z.ai and add to hero supported apps':
    '使用 ZCode 官方图标并添加到首页支持应用列表',
  'add visual mockup diagram with lightbox zoom for ZCode, CherryStudio, and DSH':
    '添加 ZCode、Cherry Studio 与 DSH 界面配置图解',
  'remove Gemini 3.7 Flash and GLM 5.3 Flash from featured models, optimize 6-card grid':
    '调整热门模型展示列表为 6 款主力模型及 3x2 网格',
  'fix tokens route to keys and perform extensive ablation of redundant sections':
    '修正令牌路由为 /keys 并精简首页冗余模块',
  'remove external docs, align homepage with relay service, and enhance ZCode guide with accurate origin':
    '移除外部文档跳转，聚焦中转服务，自适应端点地址',
  'fix Grok icon reference in featured models wall':
    '修复热门模型墙中 Grok 图标组件引用',
  'fix locale namespace structure and align featured models with platform offerings':
    '修复多语言字典命名空间层级并对齐平台可用模型',
  'customize branding, copy, and i18n for DaHuang API':
    '调整首页品牌文案与多语言配置',
  'eliminate scroll lag, add card shop quick link, client guide, and featured models wall':
    '优化首页滚动流畅度，添加发卡网链接与客户端配置指南',
}

function getLatestTag() {
  try {
    return execSync("git describe --tags --match 'v[0-9]*' --abbrev=0", {
      cwd: rootDir,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return 'v1.0.0-rc.41'
  }
}

function getRecentCommits() {
  try {
    const raw = execSync(
      "git log -n 100 --pretty=format:'%h|%an|%ad|%s' --date=short",
      {
        cwd: rootDir,
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }
    ).trim()

    if (!raw) return []

    return raw.split('\n').map((line) => {
      const [hash, author, date, subject] = line.split('|')
      return { hash, author, date, subject }
    })
  } catch {
    return []
  }
}

function parseCommitToItem(commit) {
  const match = commit.subject.match(
    /^(feat|fix|perf|chore|docs|refactor)(?:\(([^)]+)\))?:\s*(.+)$/i
  )
  let tag = 'chore'
  let scope = ''
  let rawSubject = commit.subject

  if (match) {
    const rawTag = match[1].toLowerCase()
    tag =
      rawTag === 'perf'
        ? 'perf'
        : rawTag === 'feat'
          ? 'feat'
          : rawTag === 'fix'
            ? 'fix'
            : 'chore'
    scope = match[2] ? match[2].trim() : ''
    rawSubject = match[3].trim()
  }

  // 优先匹配克制简明的中文映射，没有则直接使用提交原文本
  const localizedSubject = legacyEnToZh[rawSubject] || rawSubject
  const title = scope ? `[${scope}] ${localizedSubject}` : localizedSubject

  return {
    tag,
    titleEn: title,
    titleZh: title,
    descEn: `Commit: ${commit.hash} (${commit.date})`,
    descZh: `提交: ${commit.hash} · ${commit.date}`,
    commitHash: commit.hash,
  }
}

export function syncGitChangelog() {
  const latestTag = getLatestTag()
  const customVersion = `${latestTag}+custom`
  const commits = getRecentCommits()

  // 过滤排除自动化同步机器人的提交、官方合并提交以及更新日志自同步提交，保留所有对用户有价值的真实二开改动
  const customCommits = commits.filter(
    (c) =>
      c.author !== 'sync-bot' &&
      !c.subject.startsWith('Merge branch') &&
      !c.subject.includes('merge official-main into custom-main') &&
      !c.subject.startsWith('chore: merge') &&
      !c.subject.startsWith('chore(changelog)') &&
      !c.subject.includes('update auto-generated custom changelog')
  )

  const items = customCommits.slice(0, 30).map(parseCommitToItem)
  const today = new Date().toISOString().split('T')[0]

  const fileContent = `/*
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

// THIS FILE IS AUTOMATICALLY GENERATED FROM GIT LOG BEFORE EACH BUILD.
// DO NOT EDIT MANUALLY. CONVENTIONAL COMMITS ARE PARSED AUTOMATICALLY.

export interface CustomChangelogItem {
  tag: 'feat' | 'fix' | 'perf' | 'chore'
  titleEn: string
  titleZh: string
  descEn: string
  descZh: string
  commitHash?: string
}

export interface CustomReleaseGroup {
  version: string
  upstreamBase: string
  date: string
  items: CustomChangelogItem[]
}

export const CUSTOM_CHANGELOG_DATA: CustomReleaseGroup[] = [
  {
    version: '${customVersion}',
    upstreamBase: '${latestTag}',
    date: '${today}',
    items: ${JSON.stringify(items, null, 6).replace(/ {4}/g, '  ')},
  },
  {
    version: 'v1.0.0-rc.40+custom',
    upstreamBase: 'v1.0.0-rc.40',
    date: '2026-09-30',
    items: [
      {
        tag: 'feat',
        titleEn: 'Card shop recharge banner and redemption guide',
        titleZh: '钱包充值支持发卡网横幅与兑换引导',
        descEn: 'Added card shop recharge banner with direct access button and redemption guide.',
        descZh: '在钱包充值页增加发卡网自动充值横幅与直达购买按钮，增加卡密兑换引导胶囊。',
        commitHash: '75d4a0c',
      },
      {
        tag: 'feat',
        titleEn: 'Preset theme aligned to simple-large with 0.5 radius',
        titleZh: '系统出厂默认主题调整为简约大字体与 0.5 圆角',
        descEn: 'Set system default theme to simple-large, sans font, 0.5 radius (md), and auto dark mode.',
        descZh: '系统默认预设调整为超大字体简约、Sans 字体、0.5 圆角 (md) 及跟随系统深浅模式。',
        commitHash: '3fc6f2f',
      },
      {
        tag: 'feat',
        titleEn: 'Official tiered billing expressions and model pricing',
        titleZh: '模型官方阶梯计费与倍率对齐',
        descEn: 'Aligned model pricing expressions with official tiered rates for prompt caching reads and writes.',
        descZh: '对齐常用模型官方动态阶梯计费表达式，核算 Prompt Caching 读写差价与费率。',
        commitHash: '75d4a0c',
      },
    ],
  },
]
`

  fs.writeFileSync(targetFile, fileContent, 'utf-8')
  console.log(
    `[sync-git-changelog] Successfully synced ${items.length} custom commits into custom-changelog.ts`
  )
}

syncGitChangelog()
