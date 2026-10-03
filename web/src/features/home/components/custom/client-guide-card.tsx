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
import { CherryStudio } from '@lobehub/icons'
import { Link } from '@tanstack/react-router'
import {
  AlertCircle,
  CheckCircle2,
  Code2,
  ExternalLink,
  KeyRound,
  Layers,
  Network,
  Sparkles,
  Terminal,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { CopyButton } from '@/components/copy-button'
import { Button } from '@/components/ui/button'
import { useStatus } from '@/hooks/use-status'
import { cn } from '@/lib/utils'

// Stylized modern brand badge for ZCode (Z.ai ADE)
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

export function ClientGuideCard() {
  const { t } = useTranslation()
  const { status } = useStatus()
  const [currentOrigin, setCurrentOrigin] = useState('')
  const [activeTab, setActiveTab] = useState<'zcode' | 'cherry' | 'code'>('zcode')

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
            {t('One key, standard endpoints. Plug into ZCode, Cherry Studio, or code in seconds.')}
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

        {/* Tab Switcher */}
        <div className='flex items-center justify-center gap-1.5 border-b border-border/60 pb-3'>
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
            onClick={() => setActiveTab('code')}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all',
              activeTab === 'code'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            )}
          >
            <Terminal className='size-3.5' />
            <span>Cursor / Code / cURL</span>
          </button>
        </div>

        {/* Tab Content 1: ZCode (极简清晰四步指引) */}
        {activeTab === 'zcode' && (
          <div className='mt-4 rounded-2xl border border-border/70 bg-card p-5 shadow-xs'>
            <div className='flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3'>
              <div className='flex items-center gap-2'>
                <ZCodeLogo />
                <div>
                  <h3 className='text-sm font-bold text-foreground'>ZCode 官方接入步骤</h3>
                  <p className='text-[11px] text-muted-foreground'>Z.ai 智能体开发环境 ADE 自定义服务商配置</p>
                </div>
              </div>
              <Button
                variant='ghost'
                size='sm'
                className='h-7 gap-1 px-2 text-xs text-muted-foreground'
                render={<a href='https://zcode.z.ai' target='_blank' rel='noopener noreferrer' />}
              >
                <span>官网下载</span>
                <ExternalLink className='size-3' />
              </Button>
            </div>

            <div className='mt-4 grid gap-3 sm:grid-cols-3'>
              {/* Step 1 */}
              <div className='rounded-xl border border-border/50 bg-muted/20 p-3'>
                <span className='inline-flex size-5 items-center justify-center rounded-full bg-blue-500/10 text-[11px] font-bold text-blue-600 dark:text-blue-400'>
                  1
                </span>
                <h4 className='mt-1 text-xs font-semibold text-foreground'>{t('Open Settings Menu')}</h4>
                <p className='text-muted-foreground mt-1 text-[11px] leading-relaxed'>
                  左下角设置 ⚙️ ➔ <b>模型设置 (Model Settings)</b> ➔ 点击 <b>Add Provider</b> ➔ 选择 <b>Create custom provider</b>。
                </p>
              </div>

              {/* Step 2 */}
              <div className='rounded-xl border border-border/50 bg-muted/20 p-3'>
                <span className='inline-flex size-5 items-center justify-center rounded-full bg-blue-500/10 text-[11px] font-bold text-blue-600 dark:text-blue-400'>
                  2
                </span>
                <h4 className='mt-1 text-xs font-semibold text-foreground'>{t('Fill Provider Parameters')}</h4>
                <p className='text-muted-foreground mt-1 text-[11px] leading-relaxed'>
                  名称填 <b>大黄API</b>，协议选 <b>OpenAI</b>，地址填下方 Base URL，密钥填入你的 API Key。
                </p>
                <div className='mt-2 flex items-center justify-between rounded-lg bg-background p-1.5 text-[10px] font-mono'>
                  <span className='truncate text-muted-foreground max-w-[150px]'>{openAiBaseUrl}</span>
                  <CopyButton value={openAiBaseUrl} variant='ghost' size='sm' className='h-5 px-1.5 text-[10px]' tooltip={t('Copy')} successTooltip={t('Copied!')}>
                    <span>复制</span>
                  </CopyButton>
                </div>
              </div>

              {/* Step 3 */}
              <div className='rounded-xl border border-border/50 bg-muted/20 p-3'>
                <span className='inline-flex size-5 items-center justify-center rounded-full bg-blue-500/10 text-[11px] font-bold text-blue-600 dark:text-blue-400'>
                  3
                </span>
                <h4 className='mt-1 text-xs font-semibold text-foreground'>{t('Register Model & Test Connection')}</h4>
                <p className='text-muted-foreground mt-1 text-[11px] leading-relaxed'>
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

            {/* Caveat */}
            <div className='mt-3 flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-[11px] text-amber-700 dark:text-amber-300'>
              <AlertCircle className='size-3.5 shrink-0 text-amber-600 dark:text-amber-400' />
              <span>
                {t('ZCode Caveat: If choosing OpenAI protocol, Base URL MUST include /v1. If choosing Anthropic protocol, do NOT append /v1.')}
              </span>
            </div>
          </div>
        )}

        {/* Tab Content 2: Cherry Studio */}
        {activeTab === 'cherry' && (
          <div className='mt-4 rounded-2xl border border-border/70 bg-card p-5 shadow-xs'>
            <div className='flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3'>
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
                <span>{t('One-Click Import to Cherry Studio')}</span>
              </Button>
            </div>

            <div className='mt-4 grid gap-3 sm:grid-cols-2 text-xs'>
              <div className='rounded-xl border border-border/50 bg-muted/20 p-3'>
                <span className='text-muted-foreground text-[11px]'>手动配置参数</span>
                <div className='mt-2 space-y-1.5 font-mono text-[11px]'>
                  <div className='flex justify-between'><span className='text-muted-foreground'>服务商类型:</span><span className='font-semibold'>OpenAI 兼容</span></div>
                  <div className='flex justify-between items-center'><span className='text-muted-foreground'>API Base URL:</span><span className='font-semibold truncate max-w-[160px]'>{openAiBaseUrl}</span></div>
                  <div className='flex justify-between'><span className='text-muted-foreground'>API Key:</span><span className='text-muted-foreground'>sk-xxxx</span></div>
                </div>
              </div>

              <div className='flex flex-col justify-between rounded-xl border border-border/50 bg-muted/20 p-3'>
                <div>
                  <span className='text-muted-foreground text-[11px]'>快捷操作</span>
                  <p className='mt-1 text-[11px] text-muted-foreground'>点击右上角按钮可直接一键唤醒已安装的 Cherry Studio 客户端导入配置。</p>
                </div>
                <div className='flex items-center gap-2 mt-2'>
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
        )}

        {/* Tab Content 3: Universal Code & Cursor */}
        {activeTab === 'code' && (
          <div className='mt-4 rounded-2xl border border-border/70 bg-card p-5 shadow-xs'>
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
    </section>
  )
}
