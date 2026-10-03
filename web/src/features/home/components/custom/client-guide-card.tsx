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
import { CherryStudio, DeepSeek } from '@lobehub/icons'
import { Link } from '@tanstack/react-router'
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Code2,
  ExternalLink,
  KeyRound,
  Maximize2,
  Network,
  Sparkles,
  Terminal,
  X,
  Sliders,
  CheckCheck,
} from 'lucide-react'
import { useState, useEffect, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { CopyButton } from '@/components/copy-button'
import { Button } from '@/components/ui/button'
import { useStatus } from '@/hooks/use-status'
import { cn } from '@/lib/utils'

// Stylized modern brand badge for ZCode
function ZCodeLogo({ className }: { className?: string }) {
  return (
    <div
      className={`relative flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 shadow-xs text-white ${className ?? ''}`}
    >
      <span className='relative text-xs font-black tracking-wider'>Z</span>
      <span className='absolute bottom-0.5 right-0.5 size-1 rounded-full bg-cyan-300 ring-1 ring-blue-600' />
    </div>
  )
}

// 模拟窗口顶栏部件
function MockWindowHeader({ title, badge }: { title: string; badge?: string }) {
  return (
    <div className='flex items-center justify-between border-b border-border/50 bg-muted/40 px-3 py-2'>
      <div className='flex items-center gap-1.5'>
        <span className='size-2.5 rounded-full bg-rose-500/70' />
        <span className='size-2.5 rounded-full bg-amber-500/70' />
        <span className='size-2.5 rounded-full bg-emerald-500/70' />
        <span className='ml-2 text-[11px] font-mono text-muted-foreground'>{title}</span>
      </div>
      {badge && (
        <span className='rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium text-primary'>
          {badge}
        </span>
      )}
    </div>
  )
}

// 高保真图解 1: ZCode 界面模拟图解
function ZCodeMockupVisual({ openAiBaseUrl }: { openAiBaseUrl: string }) {
  const { t } = useTranslation()
  return (
    <div className='overflow-hidden rounded-xl border border-border/60 bg-background shadow-xs select-none'>
      <MockWindowHeader title='ZCode ADE — Model Settings' badge='Agent Harness' />
      <div className='flex'>
        {/* Mock Sidebar */}
        <div className='w-24 border-r border-border/40 bg-muted/20 p-2 space-y-1 text-[10px] hidden sm:block'>
          <div className='px-1.5 py-1 text-muted-foreground/60'>General</div>
          <div className='rounded bg-blue-500/10 px-1.5 py-1 font-semibold text-blue-600 dark:text-blue-400'>
            Models ⚙️
          </div>
          <div className='px-1.5 py-1 text-muted-foreground/60'>Agents</div>
          <div className='px-1.5 py-1 text-muted-foreground/60'>MCP Tools</div>
        </div>

        {/* Mock Content */}
        <div className='flex-1 p-3.5 space-y-2.5 text-xs'>
          <div className='flex items-center justify-between border-b border-border/40 pb-2'>
            <span className='font-semibold text-foreground text-[11px]'>Custom Provider (自定义服务商)</span>
            <span className='rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-medium text-emerald-600'>Active</span>
          </div>

          <div className='space-y-1.5 text-[11px]'>
            <div>
              <span className='text-[10px] text-muted-foreground'>Provider Name (服务商名称)</span>
              <div className='mt-0.5 rounded border border-border/60 bg-muted/20 px-2 py-1 font-mono text-[11px]'>大黄API</div>
            </div>

            <div>
              <span className='text-[10px] text-muted-foreground'>API Protocol (协议格式)</span>
              <div className='mt-0.5 rounded border border-border/60 bg-muted/20 px-2 py-1 font-mono text-[11px]'>
                ChatCompletions (OpenAI)
              </div>
            </div>

            <div className='relative rounded-lg border-2 border-dashed border-blue-500/60 bg-blue-500/5 p-1.5'>
              <span className='text-[10px] font-semibold text-blue-600 dark:text-blue-400 flex items-center justify-between'>
                <span>Base URL (① 必须包含 /v1)</span>
                <span className='text-[9px] bg-blue-500 text-white rounded px-1'>重点注意</span>
              </span>
              <div className='mt-0.5 truncate font-mono text-[10px] text-foreground'>{openAiBaseUrl}</div>
            </div>

            <div className='relative rounded-lg border-2 border-dashed border-amber-500/60 bg-amber-500/5 p-1.5'>
              <span className='text-[10px] font-semibold text-amber-600 dark:text-amber-400'>API Key (② 填入令牌)</span>
              <div className='mt-0.5 font-mono text-[10px] text-muted-foreground'>sk-your-token••••••••</div>
            </div>

            <div>
              <span className='text-[10px] text-muted-foreground'>Models (③ 注册模型 ID)</span>
              <div className='mt-1 flex flex-wrap gap-1'>
                <span className='rounded bg-muted px-1.5 py-0.5 font-mono text-[9px] text-foreground'>claude-sonnet-5</span>
                <span className='rounded bg-muted px-1.5 py-0.5 font-mono text-[9px] text-foreground'>gpt-6.1-sol</span>
                <span className='rounded bg-muted px-1.5 py-0.5 font-mono text-[9px] text-foreground'>deepseek-v4-flash</span>
              </div>
            </div>
          </div>

          <div className='flex items-center justify-end gap-2 pt-1 border-t border-border/40'>
            <span className='text-[9px] text-emerald-600 flex items-center gap-1 font-medium'>
              <Check className='size-2.5' /> 连接测试通过
            </span>
            <span className='rounded bg-primary px-2 py-0.5 text-[10px] text-primary-foreground font-medium'>保存</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// 高保真图解 2: Cherry Studio 界面模拟图解
function CherryStudioMockupVisual({ openAiBaseUrl }: { openAiBaseUrl: string }) {
  return (
    <div className='overflow-hidden rounded-xl border border-border/60 bg-background shadow-xs select-none'>
      <MockWindowHeader title='Cherry Studio — 模型服务管理' badge='Desktop All-in-One' />
      <div className='flex'>
        {/* Mock Sidebar */}
        <div className='w-20 border-r border-border/40 bg-muted/20 p-2 space-y-1 text-[10px] hidden sm:block'>
          <div className='px-1.5 py-1 text-muted-foreground/60'>对话</div>
          <div className='px-1.5 py-1 text-muted-foreground/60'>知识库</div>
          <div className='rounded bg-red-500/10 px-1.5 py-1 font-semibold text-red-600 dark:text-red-400'>
            设置 ⚙️
          </div>
        </div>

        {/* Mock Content */}
        <div className='flex-1 p-3.5 space-y-2 text-xs'>
          <div className='flex items-center justify-between border-b border-border/40 pb-2'>
            <div className='flex items-center gap-1.5'>
              <CherryStudio.Color size={16} />
              <span className='font-semibold text-foreground text-[11px]'>服务商: 大黄API · 大狗叫</span>
            </div>
            <span className='rounded bg-red-500/10 px-1.5 py-0.5 text-[9px] font-medium text-red-600 dark:text-red-400'>OpenAI 兼容</span>
          </div>

          <div className='space-y-2 text-[11px]'>
            <div>
              <span className='text-[10px] text-muted-foreground'>服务商类型</span>
              <div className='mt-0.5 rounded border border-border/60 bg-muted/20 px-2 py-1 font-mono text-[10px]'>OpenAI</div>
            </div>

            <div className='relative rounded-lg border-2 border-dashed border-red-500/60 bg-red-500/5 p-1.5'>
              <span className='text-[10px] font-semibold text-red-600 dark:text-red-400'>API 域名 (Base URL)</span>
              <div className='mt-0.5 truncate font-mono text-[10px] text-foreground'>{openAiBaseUrl}</div>
            </div>

            <div className='relative rounded-lg border-2 border-dashed border-amber-500/60 bg-amber-500/5 p-1.5'>
              <span className='text-[10px] font-semibold text-amber-600 dark:text-amber-400'>API 密钥 (API Key)</span>
              <div className='mt-0.5 font-mono text-[10px] text-muted-foreground'>sk-your-token••••••••</div>
            </div>

            <div>
              <span className='text-[10px] text-muted-foreground'>已载入模型</span>
              <div className='mt-1 flex flex-wrap gap-1'>
                <span className='rounded border border-border/60 bg-background px-1.5 py-0.5 font-mono text-[9px]'>claude-sonnet-5</span>
                <span className='rounded border border-border/60 bg-background px-1.5 py-0.5 font-mono text-[9px]'>gpt-6.1-sol</span>
                <span className='rounded border border-border/60 bg-background px-1.5 py-0.5 font-mono text-[9px]'>deepseek-v4-flash</span>
              </div>
            </div>
          </div>

          <div className='pt-1 text-[10px] text-emerald-600 flex items-center justify-end gap-1'>
            <CheckCheck className='size-3' /> 支持一键唤醒协议导入
          </div>
        </div>
      </div>
    </div>
  )
}

// 高保真图解 3: DSH (DeepSeek Harness) 界面模拟图解
function DshMockupVisual({ openAiBaseUrl }: { openAiBaseUrl: string }) {
  return (
    <div className='overflow-hidden rounded-xl border border-border/60 bg-background shadow-xs select-none'>
      <MockWindowHeader title='DeepSeek Harness (DSH) — Settings' badge='@deepseek-ai/dsh' />
      <div className='flex'>
        {/* Mock Sidebar */}
        <div className='w-24 border-r border-border/40 bg-muted/20 p-2 space-y-1 text-[10px] hidden sm:block'>
          <div className='px-1.5 py-1 text-muted-foreground/60'>Workspace</div>
          <div className='px-1.5 py-1 text-muted-foreground/60'>Cordis Kernel</div>
          <div className='rounded bg-cyan-500/10 px-1.5 py-1 font-semibold text-cyan-600 dark:text-cyan-400'>
            Models ⚙️
          </div>
        </div>

        {/* Mock Content */}
        <div className='flex-1 p-3.5 space-y-2 text-xs'>
          <div className='flex items-center justify-between border-b border-border/40 pb-2'>
            <div className='flex items-center gap-1.5'>
              <DeepSeek.Color size={16} />
              <span className='font-semibold text-foreground text-[11px]'>Custom Agent Model Provider</span>
            </div>
            <span className='rounded-full bg-cyan-500/10 px-1.5 py-0.5 text-[9px] font-medium text-cyan-600 dark:text-cyan-400'>Web / Desktop</span>
          </div>

          <div className='space-y-2 text-[11px]'>
            <div>
              <span className='text-[10px] text-muted-foreground'>Provider Name</span>
              <div className='mt-0.5 rounded border border-border/60 bg-muted/20 px-2 py-1 font-mono text-[10px]'>大黄API</div>
            </div>

            <div className='relative rounded-lg border-2 border-dashed border-cyan-500/60 bg-cyan-500/5 p-1.5'>
              <span className='text-[10px] font-semibold text-cyan-600 dark:text-cyan-400'>Base URL (① 兼容 OpenAI 端点)</span>
              <div className='mt-0.5 truncate font-mono text-[10px] text-foreground'>{openAiBaseUrl}</div>
            </div>

            <div className='relative rounded-lg border-2 border-dashed border-amber-500/60 bg-amber-500/5 p-1.5'>
              <span className='text-[10px] font-semibold text-amber-600 dark:text-amber-400'>API Key (② 凭据验证)</span>
              <div className='mt-0.5 font-mono text-[10px] text-muted-foreground'>sk-your-token••••••••</div>
            </div>

            <div>
              <span className='text-[10px] text-muted-foreground'>Default Agent Model</span>
              <div className='mt-1 flex items-center gap-2'>
                <span className='rounded bg-muted px-2 py-0.5 font-mono text-[10px] text-foreground font-semibold'>deepseek-v4-flash</span>
                <span className='text-[10px] text-muted-foreground'>或 claude-sonnet-5</span>
              </div>
            </div>
          </div>

          <div className='pt-1 border-t border-border/40 flex items-center justify-between text-[10px] font-mono text-muted-foreground'>
            <span>CLI: export DEEPSEEK_API_KEY="..."</span>
            <span className='text-emerald-600 flex items-center gap-1 font-medium'>Ready</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// 统一包装带放大灯箱的卡片
function MockupCardWithZoom({
  title,
  subtitle,
  children,
  onZoom,
}: {
  title: string
  subtitle: string
  children: ReactNode
  onZoom: () => void
}) {
  return (
    <div
      onClick={onZoom}
      className='group relative cursor-pointer overflow-hidden rounded-2xl border border-border/70 bg-card p-2.5 transition-all duration-300 hover:border-primary/40 hover:shadow-md'
      title='点击放大查看高清图解'
    >
      <div className='mb-2 flex items-center justify-between px-1.5 pt-1'>
        <span className='text-xs font-semibold text-foreground'>{title}</span>
        <span className='inline-flex items-center gap-1 rounded bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors'>
          <Maximize2 className='size-2.5' />
          <span>点击放大图解</span>
        </span>
      </div>
      {children}
      <p className='mt-2 px-1 text-[10px] text-muted-foreground text-center'>{subtitle}</p>
    </div>
  )
}

export function ClientGuideCard() {
  const { t } = useTranslation()
  const { status } = useStatus()
  const [currentOrigin, setCurrentOrigin] = useState('')
  const [activeTab, setActiveTab] = useState<'zcode' | 'cherry' | 'dsh' | 'code'>('zcode')
  const [zoomModal, setZoomModal] = useState<'zcode' | 'cherry' | 'dsh' | null>(null)

  // 严格优先采用浏览器当前的真实访问地址，杜绝 localhost 与内网/公网错配
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentOrigin(window.location.origin.replace(/\/+$/, ''))
    }
  }, [])

  const effectiveOrigin =
    currentOrigin ||
    (status?.server_address && !status.server_address.includes('localhost')
      ? (status.server_address as string).replace(/\/+$/, '')
      : 'https://newapi.vsonic12138.shop')

  const openAiBaseUrl = `${effectiveOrigin}/v1`
  const anthropicBaseUrl = effectiveOrigin

  const zcodeRecommendedModels = ['claude-sonnet-5', 'gpt-6.1-sol', 'deepseek-v4-flash']

  const cherryConfigData = {
    name: status?.system_name || '大黄API · 大狗叫',
    apiHost: openAiBaseUrl,
    apiKey: 'sk-your-api-token',
    models: ['claude-sonnet-5', 'gpt-6.1-sol', 'deepseek-v4-flash'],
  }
  const cherryDeepLink = `cherrystudio://providers/api-keys?v=1&data=${encodeURIComponent(JSON.stringify(cherryConfigData))}`

  const curlExample = `curl -X POST "${openAiBaseUrl}/chat/completions" \\
  -H "Authorization: Bearer sk-your-token" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "claude-sonnet-5", "messages": [{"role": "user", "content": "Hello!"}]}'`

  return (
    <section className='relative z-10 px-6 py-10 md:py-14'>
      <div className='mx-auto max-w-5xl'>
        {/* Section Header */}
        <div className='mb-6 flex flex-col items-center text-center'>
          <div className='mb-2 inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 px-2.5 py-0.5 text-[11px] font-medium text-blue-600 dark:border-blue-400/20 dark:bg-blue-400/5 dark:text-blue-400'>
            <Sparkles className='size-3' />
            <span>{t('Instant Setup')}</span>
          </div>
          <h2 className='text-2xl font-bold tracking-tight md:text-3xl'>
            {t('Call Once, Ready to Code')}
          </h2>
          <p className='text-muted-foreground mt-1 text-xs sm:text-sm'>
            {t('One key, standard endpoints. Plug into ZCode, Cherry Studio, DSH, or code in seconds.')}
          </p>
        </div>

        {/* Global Endpoints Bar */}
        <div className='mb-6 rounded-2xl border border-border/70 bg-muted/20 p-4 backdrop-blur-xs'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-center gap-2.5'>
              <Network className='size-4 text-primary shrink-0' />
              <div className='flex flex-wrap items-center gap-2 text-xs'>
                <span className='font-semibold text-foreground'>{t('Cluster Endpoints')}</span>
                <span className='inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400'>
                  <span className='size-1.5 rounded-full bg-emerald-500 animate-pulse' />
                  {t('Auto Network Adapted')}
                </span>
              </div>
            </div>

            <Button
              variant='default'
              size='sm'
              className='h-8 gap-1.5 px-3 text-xs font-medium self-start sm:self-auto'
              render={<Link to='/keys' />}
            >
              <KeyRound className='size-3.5' />
              <span>{t('Manage API Keys')}</span>
            </Button>
          </div>

          {/* Endpoints Dual Row */}
          <div className='mt-3 grid gap-2.5 sm:grid-cols-2'>
            <div className='flex items-center justify-between gap-2 rounded-xl border border-border/50 bg-background/80 px-3 py-2'>
              <div className='min-w-0'>
                <span className='text-[10px] font-medium text-muted-foreground'>OpenAI Base URL (/v1)</span>
                <p className='truncate font-mono text-xs font-semibold text-foreground select-all'>{openAiBaseUrl}</p>
              </div>
              <CopyButton value={openAiBaseUrl} variant='ghost' size='sm' className='h-7 shrink-0 px-2 text-xs' tooltip={t('Copy')} successTooltip={t('Copied!')}>
                <span>{t('Copy')}</span>
              </CopyButton>
            </div>

            <div className='flex items-center justify-between gap-2 rounded-xl border border-border/50 bg-background/80 px-3 py-2'>
              <div className='min-w-0'>
                <span className='text-[10px] font-medium text-muted-foreground'>Anthropic Base URL (Root)</span>
                <p className='truncate font-mono text-xs font-semibold text-foreground select-all'>{anthropicBaseUrl}</p>
              </div>
              <CopyButton value={anthropicBaseUrl} variant='ghost' size='sm' className='h-7 shrink-0 px-2 text-xs' tooltip={t('Copy')} successTooltip={t('Copied!')}>
                <span>{t('Copy')}</span>
              </CopyButton>
            </div>
          </div>
        </div>

        {/* Tab Switcher: ZCode, Cherry Studio, DSH, Cursor/Code */}
        <div className='flex flex-wrap items-center justify-center gap-1.5 border-b border-border/60 pb-3'>
          <button
            type='button'
            onClick={() => setActiveTab('zcode')}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all',
              activeTab === 'zcode'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            )}
          >
            <ZCodeLogo className='size-4 text-[9px]' />
            <span>ZCode (智谱)</span>
          </button>

          <button
            type='button'
            onClick={() => setActiveTab('cherry')}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all',
              activeTab === 'cherry'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            )}
          >
            <CherryStudio.Color size={16} />
            <span>Cherry Studio</span>
          </button>

          <button
            type='button'
            onClick={() => setActiveTab('dsh')}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all',
              activeTab === 'dsh'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            )}
          >
            <DeepSeek.Color size={16} />
            <span>DSH (DeepSeek Harness)</span>
          </button>

          <button
            type='button'
            onClick={() => setActiveTab('code')}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all',
              activeTab === 'code'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            )}
          >
            <Terminal className='size-3.5' />
            <span>Cursor / cURL / 代码</span>
          </button>
        </div>

        {/* Tab 1: ZCode (左右双栏图文看板) */}
        {activeTab === 'zcode' && (
          <div className='mt-5 grid gap-5 lg:grid-cols-12 lg:items-start'>
            {/* Left: 步骤指引 & 参数 */}
            <div className='rounded-2xl border border-border/70 bg-card p-5 shadow-xs lg:col-span-7 space-y-4'>
              <div className='flex items-center justify-between border-b border-border/40 pb-3'>
                <div className='flex items-center gap-2'>
                  <ZCodeLogo />
                  <div>
                    <h3 className='text-sm font-bold text-foreground'>ZCode 官方接入步骤</h3>
                    <p className='text-[11px] text-muted-foreground'>智谱 ADE 自定义服务商配置</p>
                  </div>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-7 gap-1 px-2 text-xs text-muted-foreground'
                  render={<a href='https://zcode.z.ai' target='_blank' rel='noopener noreferrer' />}
                >
                  <span>官方主页</span>
                  <ExternalLink className='size-3' />
                </Button>
              </div>

              {/* 3 Steps */}
              <div className='space-y-2.5 text-xs'>
                <div className='flex items-start gap-2.5 rounded-xl border border-border/40 bg-muted/20 p-2.5'>
                  <span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-[11px] font-bold text-blue-600 dark:text-blue-400'>
                    1
                  </span>
                  <div>
                    <span className='font-semibold text-foreground'>{t('Open Settings Menu')}</span>
                    <p className='text-muted-foreground text-[11px] mt-0.5'>
                      左下角设置 ⚙️ ➔ <b>Model Settings (模型设置)</b> ➔ 点击 <b>Add Provider</b> ➔ 选择 <b>Create custom provider</b>。
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-2.5 rounded-xl border border-border/40 bg-muted/20 p-2.5'>
                  <span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-[11px] font-bold text-blue-600 dark:text-blue-400'>
                    2
                  </span>
                  <div className='min-w-0 flex-1'>
                    <span className='font-semibold text-foreground'>{t('Fill Provider Parameters')}</span>
                    <p className='text-muted-foreground text-[11px] mt-0.5'>
                      名称填 <b>大黄API</b>，协议选 <b>OpenAI</b>，地址填 Base URL，密钥填你的 API Key。
                    </p>
                    <div className='mt-2 flex items-center justify-between rounded-lg bg-background p-1.5 text-[10px] font-mono'>
                      <span className='truncate text-muted-foreground max-w-[160px]'>{openAiBaseUrl}</span>
                      <CopyButton value={openAiBaseUrl} variant='ghost' size='sm' className='h-5 px-1.5 text-[10px]' tooltip={t('Copy')} successTooltip={t('Copied!')}>
                        <span>复制</span>
                      </CopyButton>
                    </div>
                  </div>
                </div>

                <div className='flex items-start gap-2.5 rounded-xl border border-border/40 bg-muted/20 p-2.5'>
                  <span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-[11px] font-bold text-blue-600 dark:text-blue-400'>
                    3
                  </span>
                  <div className='min-w-0 flex-1'>
                    <span className='font-semibold text-foreground'>{t('Register Model & Test Connection')}</span>
                    <p className='text-muted-foreground text-[11px] mt-0.5'>
                      点击 <b>Add Model</b> 填入推荐模型 ID，点击 <b>Test Model</b> 测试连通通过后保存：
                    </p>
                    <div className='mt-2 flex flex-wrap gap-1'>
                      {zcodeRecommendedModels.map((m) => (
                        <CopyButton
                          key={m}
                          value={m}
                          variant='outline'
                          size='sm'
                          className='h-6 rounded px-1.5 text-[10px] font-mono'
                          tooltip={t('Click to copy model ID')}
                          successTooltip={t('Copied!')}
                        >
                          <span>{m}</span>
                        </CopyButton>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Caveat */}
              <div className='flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-2.5 py-1.5 text-[11px] text-amber-700 dark:text-amber-300'>
                <AlertCircle className='size-3.5 shrink-0 text-amber-600 dark:text-amber-400' />
                <span>ZCode 避坑要点：OpenAI 协议 Base URL 必须带 /v1；若选 Anthropic 协议末尾不要带 /v1。</span>
              </div>
            </div>

            {/* Right: 高保真图解 (点击放大灯箱) */}
            <div className='lg:col-span-5'>
              <MockupCardWithZoom
                title='ZCode 设置界面图解'
                subtitle='示意图 · 点击任意位置可灯箱全屏放大查看'
                onZoom={() => setZoomModal('zcode')}
              >
                <ZCodeMockupVisual openAiBaseUrl={openAiBaseUrl} />
              </MockupCardWithZoom>
            </div>
          </div>
        )}

        {/* Tab 2: Cherry Studio (左右双栏图文看板) */}
        {activeTab === 'cherry' && (
          <div className='mt-5 grid gap-5 lg:grid-cols-12 lg:items-start'>
            {/* Left: 步骤指引 & 快捷导入 */}
            <div className='rounded-2xl border border-border/70 bg-card p-5 shadow-xs lg:col-span-7 space-y-4'>
              <div className='flex items-center justify-between border-b border-border/40 pb-3'>
                <div className='flex items-center gap-2'>
                  <div className='flex size-8 items-center justify-center rounded-lg border border-border/50 bg-muted/30'>
                    <CherryStudio.Color size={20} />
                  </div>
                  <div>
                    <h3 className='text-sm font-bold text-foreground'>Cherry Studio 全能桌面客户端</h3>
                    <p className='text-[11px] text-muted-foreground'>多模型并排对比、知识库 RAG 与思考可视化</p>
                  </div>
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  className='h-7 gap-1 px-2.5 text-xs text-red-600 border-red-500/30 hover:bg-red-500/5'
                  render={<a href={cherryDeepLink} target='_blank' rel='noopener noreferrer' />}
                >
                  <CheckCircle2 className='size-3' />
                  <span>一键导入</span>
                </Button>
              </div>

              <div className='space-y-2.5 text-xs'>
                <div className='rounded-xl border border-border/50 bg-muted/20 p-3'>
                  <span className='text-muted-foreground text-[11px] font-semibold'>手动配置参数表</span>
                  <div className='mt-2 space-y-1.5 font-mono text-[11px]'>
                    <div className='flex justify-between'><span className='text-muted-foreground'>服务商类型:</span><span className='font-semibold'>OpenAI 兼容</span></div>
                    <div className='flex justify-between items-center'><span className='text-muted-foreground'>API Base URL:</span><span className='font-semibold truncate max-w-[160px]'>{openAiBaseUrl}</span></div>
                    <div className='flex justify-between'><span className='text-muted-foreground'>API Key:</span><span className='text-muted-foreground'>sk-xxxx</span></div>
                  </div>
                </div>

                <div className='rounded-xl border border-border/50 bg-muted/20 p-3 flex flex-col justify-between'>
                  <span className='text-muted-foreground text-[11px] font-semibold'>推荐模型</span>
                  <p className='mt-1 text-[11px] text-muted-foreground'>在【管理模型】中添加：`claude-sonnet-5`, `gpt-6.1-sol`, `deepseek-v4-flash`。</p>
                  <div className='flex items-center gap-2 mt-3'>
                    <CopyButton value={openAiBaseUrl} variant='outline' size='sm' className='h-7 text-xs flex-1' tooltip={t('Copy')} successTooltip={t('Copied!')}>
                      <span>复制 Base URL</span>
                    </CopyButton>
                    <Button variant='ghost' size='sm' className='h-7 px-2 text-xs' render={<a href='https://cherry-ai.com' target='_blank' rel='noopener noreferrer' />}>
                      <span>下载客户端</span>
                      <ExternalLink className='size-3' />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: 高保真图解 (点击放大灯箱) */}
            <div className='lg:col-span-5'>
              <MockupCardWithZoom
                title='Cherry Studio 设置界面图解'
                subtitle='示意图 · 点击任意位置可灯箱全屏放大查看'
                onZoom={() => setZoomModal('cherry')}
              >
                <CherryStudioMockupVisual openAiBaseUrl={openAiBaseUrl} />
              </MockupCardWithZoom>
            </div>
          </div>
        )}

        {/* Tab 3: DSH (DeepSeek Harness) (左右双栏图文看板) */}
        {activeTab === 'dsh' && (
          <div className='mt-5 grid gap-5 lg:grid-cols-12 lg:items-start'>
            {/* Left: 步骤指引 & 参数 */}
            <div className='rounded-2xl border border-border/70 bg-card p-5 shadow-xs lg:col-span-7 space-y-4'>
              <div className='flex items-center justify-between border-b border-border/40 pb-3'>
                <div className='flex items-center gap-2'>
                  <div className='flex size-8 items-center justify-center rounded-lg border border-border/50 bg-muted/30'>
                    <DeepSeek.Color size={20} />
                  </div>
                  <div>
                    <h3 className='text-sm font-bold text-foreground'>DeepSeek Harness (DSH)</h3>
                    <p className='text-[11px] text-muted-foreground'>DeepSeek 官方 Agent Harness 开发者客户端</p>
                  </div>
                </div>
                <span className='rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-600 dark:text-cyan-400'>
                  Web / Desktop
                </span>
              </div>

              <div className='space-y-2.5 text-xs'>
                <div className='flex items-start gap-2.5 rounded-xl border border-border/40 bg-muted/20 p-2.5'>
                  <span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-[11px] font-bold text-cyan-600 dark:text-cyan-400'>
                    1
                  </span>
                  <div>
                    <span className='font-semibold text-foreground'>Web 启动或打开桌面端</span>
                    <p className='text-muted-foreground text-[11px] mt-0.5 font-mono'>
                      npx @deepseek-ai/dsh web （或打开已安装的 DSH 客户端）
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-2.5 rounded-xl border border-border/40 bg-muted/20 p-2.5'>
                  <span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-[11px] font-bold text-cyan-600 dark:text-cyan-400'>
                    2
                  </span>
                  <div className='min-w-0 flex-1'>
                    <span className='font-semibold text-foreground'>Settings ⚙️ ➔ Models 添加自定义服务商</span>
                    <p className='text-muted-foreground text-[11px] mt-0.5'>
                      Base URL 填入本站 OpenAI 兼容地址，API Key 填入大黄API生成的令牌。
                    </p>
                    <div className='mt-2 flex items-center justify-between rounded-lg bg-background p-1.5 text-[10px] font-mono'>
                      <span className='truncate text-muted-foreground max-w-[160px]'>{openAiBaseUrl}</span>
                      <CopyButton value={openAiBaseUrl} variant='ghost' size='sm' className='h-5 px-1.5 text-[10px]' tooltip={t('Copy')} successTooltip={t('Copied!')}>
                        <span>复制</span>
                      </CopyButton>
                    </div>
                  </div>
                </div>

                <div className='flex items-start gap-2.5 rounded-xl border border-border/40 bg-muted/20 p-2.5'>
                  <span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-[11px] font-bold text-cyan-600 dark:text-cyan-400'>
                    3
                  </span>
                  <div className='min-w-0 flex-1'>
                    <span className='font-semibold text-foreground'>指定模型 ID</span>
                    <p className='text-muted-foreground text-[11px] mt-0.5'>
                      默认推荐填入 <b>deepseek-v4-flash</b>，体验秒级思维链与透明推理。
                    </p>
                    <div className='mt-1.5'>
                      <CopyButton value='deepseek-v4-flash' variant='outline' size='sm' className='h-6 rounded px-1.5 text-[10px] font-mono' tooltip={t('Click to copy model ID')} successTooltip={t('Copied!')}>
                        <span>deepseek-v4-flash</span>
                      </CopyButton>
                    </div>
                  </div>
                </div>
              </div>

              {/* CLI tip */}
              <div className='rounded-lg border border-border/50 bg-muted/40 p-2 text-[10px] font-mono text-muted-foreground'>
                # 也可直接注入环境变量启动：<br />
                <span className='text-foreground'>export DEEPSEEK_API_KEY="sk-your-token"</span><br />
                <span className='text-foreground'>export OPENAI_BASE_URL="{openAiBaseUrl}"</span>
              </div>
            </div>

            {/* Right: 高保真图解 (点击放大灯箱) */}
            <div className='lg:col-span-5'>
              <MockupCardWithZoom
                title='DSH (DeepSeek Harness) 设置界面图解'
                subtitle='示意图 · 点击任意位置可灯箱全屏放大查看'
                onZoom={() => setZoomModal('dsh')}
              >
                <DshMockupVisual openAiBaseUrl={openAiBaseUrl} />
              </MockupCardWithZoom>
            </div>
          </div>
        )}

        {/* Tab 4: Universal Code / cURL */}
        {activeTab === 'code' && (
          <div className='mt-5 rounded-2xl border border-border/70 bg-card p-5 shadow-xs'>
            <div className='flex items-center justify-between border-b border-border/40 pb-3'>
              <div className='flex items-center gap-2'>
                <Terminal className='size-4 text-violet-500' />
                <h3 className='text-sm font-bold text-foreground'>Cursor / Claude Code / SDK 代码调用</h3>
              </div>
              <CopyButton value={curlExample} variant='outline' size='sm' className='h-7 gap-1 text-xs' tooltip={t('Copy')} successTooltip={t('Copied!')}>
                <Code2 className='size-3' />
                <span>复制 cURL 命令</span>
              </CopyButton>
            </div>

            <div className='mt-3 space-y-2'>
              <div className='rounded-xl border border-border/50 bg-muted/40 p-3 font-mono text-[11px] text-foreground overflow-x-auto'>
                <p className='text-muted-foreground'># 环境变量配置 (兼容 Cursor / LangChain / LiteLLM)</p>
                <p className='mt-1 text-emerald-600 dark:text-emerald-400'>export OPENAI_BASE_URL="{openAiBaseUrl}"</p>
                <p className='text-emerald-600 dark:text-emerald-400'>export OPENAI_API_KEY="sk-your-token"</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 灯箱弹窗 (Lightbox Modal) */}
      {zoomModal && (
        <div
          role='dialog'
          aria-modal='true'
          className='fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-in fade-in duration-200'
          onClick={() => setZoomModal(null)}
        >
          <div
            className='relative w-full max-w-2xl rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='mb-3 flex items-center justify-between border-b border-border/40 pb-2.5'>
              <div className='flex items-center gap-2'>
                <Sparkles className='size-4 text-primary' />
                <span className='font-bold text-sm text-foreground'>
                  {zoomModal === 'zcode' && 'ZCode (智谱 ADE) 界面配置图解'}
                  {zoomModal === 'cherry' && 'Cherry Studio 界面配置图解'}
                  {zoomModal === 'dsh' && 'DeepSeek Harness (DSH) 界面配置图解'}
                </span>
              </div>
              <button
                type='button'
                onClick={() => setZoomModal(null)}
                className='rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors'
              >
                <X className='size-5' />
              </button>
            </div>

            {/* 大图展示区域 */}
            <div className='py-2'>
              {zoomModal === 'zcode' && <ZCodeMockupVisual openAiBaseUrl={openAiBaseUrl} />}
              {zoomModal === 'cherry' && <CherryStudioMockupVisual openAiBaseUrl={openAiBaseUrl} />}
              {zoomModal === 'dsh' && <DshMockupVisual openAiBaseUrl={openAiBaseUrl} />}
            </div>

            <div className='mt-3 flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-2.5'>
              <span>点击空白处或右上角可关闭图解</span>
              <Button variant='outline' size='sm' className='h-7 text-xs' onClick={() => setZoomModal(null)}>
                完成查看
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
