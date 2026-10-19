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
  CheckCircle2,
  Code2,
  ExternalLink,
  KeyRound,
  Loader2,
  Maximize2,
  Network,
  Sparkles,
  Terminal,
  X,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { CopyButton } from '@/components/copy-button'
import { Button } from '@/components/ui/button'
import { DocsClientSetup } from '@/features/docs/client-setup'
import { useStatus } from '@/hooks/use-status'
import { cn } from '@/lib/utils'

import {
  buildCCSwitchImportUrl,
  CLIENT_IMPORT_PLACEHOLDER_KEY,
  preferPublicOrigin,
  CC_SWITCH_SITE_PRESETS,
} from '../../lib/client-import'

// 智谱 ZCode 官方原版 Logo
function ZCodeLogo({
  className,
  size = 20,
}: {
  className?: string
  size?: number
}) {
  return (
    <img
      src='/icons/zcode-192.png'
      alt='ZCode'
      width={size}
      height={size}
      className={cn(
        'rounded-md object-contain shrink-0 shadow-2xs border border-border/40',
        className
      )}
    />
  )
}

// CC Switch 官方原版 Logo
function CCSwitchLogo({
  className,
  size = 20,
}: {
  className?: string
  size?: number
}) {
  return (
    <img
      src='/icons/ccswitch.png'
      alt='CC Switch'
      width={size}
      height={size}
      className={cn('rounded-md object-contain shrink-0', className)}
    />
  )
}

// magpie 官方 Logo
function MagpieLogo({
  className,
  size = 20,
}: {
  className?: string
  size?: number
}) {
  return (
    <img
      src='/icons/magpie.svg'
      alt='magpie'
      width={size}
      height={size}
      className={cn('rounded-md object-contain shrink-0', className)}
    />
  )
}

// 模拟窗口顶栏部件
function MockWindowHeader({ title, badge }: { title: string; badge?: string }) {
  return (
    <div className='border-border/50 bg-muted/40 flex items-center justify-between border-b px-3 py-2'>
      <div className='flex items-center gap-1.5'>
        <span className='size-2.5 rounded-full bg-rose-500/70' />
        <span className='size-2.5 rounded-full bg-amber-500/70' />
        <span className='size-2.5 rounded-full bg-emerald-500/70' />
        <span className='text-muted-foreground ml-2 font-mono text-[11px]'>
          {title}
        </span>
      </div>
      {badge && (
        <span className='bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[9px] font-medium'>
          {badge}
        </span>
      )}
    </div>
  )
}

// DSH (DeepSeek Harness) 界面模拟图解
function DshMockupVisual(props: {
  openAiBaseUrl: string
  providerName: string
}) {
  const { t } = useTranslation()

  return (
    <div className='border-border/60 bg-background overflow-hidden rounded-xl border shadow-xs select-none'>
      <MockWindowHeader
        title={t('DeepSeek Harness (DSH) — Settings')}
        badge='@deepseek-ai/dsh'
      />
      <div className='flex'>
        {/* Mock Sidebar */}
        <div className='border-border/40 bg-muted/20 hidden w-24 space-y-1 border-r p-2 text-[10px] sm:block'>
          <div className='text-muted-foreground/60 px-1.5 py-1'>
            {t('Workspace')}
          </div>
          <div className='text-muted-foreground/60 px-1.5 py-1'>
            Cordis Kernel
          </div>
          <div className='rounded bg-cyan-500/10 px-1.5 py-1 font-semibold text-cyan-600 dark:text-cyan-400'>
            {t('Models')}
          </div>
        </div>

        {/* Mock Content */}
        <div className='flex-1 space-y-2 p-3.5 text-xs'>
          <div className='border-border/40 flex items-center justify-between border-b pb-2'>
            <div className='flex items-center gap-1.5'>
              <DeepSeek.Color size={16} />
              <span className='text-foreground text-[11px] font-semibold'>
                {t('Custom Agent Model Provider')}
              </span>
            </div>
            <span className='rounded-full bg-cyan-500/10 px-1.5 py-0.5 text-[9px] font-medium text-cyan-600 dark:text-cyan-400'>
              {t('Web / Desktop')}
            </span>
          </div>

          <div className='space-y-2 text-[11px]'>
            <div>
              <span className='text-muted-foreground text-[10px]'>
                {t('Provider Name')}
              </span>
              <div className='border-border/60 bg-muted/20 mt-0.5 rounded border px-2 py-1 font-mono text-[10px]'>
                {props.providerName}
              </div>
            </div>

            <div className='relative rounded-lg border-2 border-dashed border-cyan-500/60 bg-cyan-500/5 p-1.5'>
              <span className='text-[10px] font-semibold text-cyan-600 dark:text-cyan-400'>
                {t('Base URL (OpenAI-compatible endpoint)')}
              </span>
              <div className='text-foreground mt-0.5 font-mono text-[10px] break-all'>
                {props.openAiBaseUrl}
              </div>
            </div>

            <div className='relative rounded-lg border-2 border-dashed border-amber-500/60 bg-amber-500/5 p-1.5'>
              <span className='text-[10px] font-semibold text-amber-600 dark:text-amber-400'>
                {t('API Key (credential)')}
              </span>
              <div className='text-muted-foreground mt-0.5 font-mono text-[10px]'>
                sk-your-token••••••••
              </div>
            </div>

            <div>
              <span className='text-muted-foreground text-[10px]'>
                {t('Default Agent Model')}
              </span>
              <div className='mt-1 flex items-center gap-2'>
                <span className='bg-muted text-foreground rounded px-2 py-0.5 font-mono text-[10px] font-semibold'>
                  deepseek-flash
                </span>
                <span className='text-muted-foreground text-[10px]'>
                  {t('or {{model}}', { model: 'claude-sonnet-5' })}
                </span>
              </div>
            </div>
          </div>

          <div className='border-border/40 text-muted-foreground flex items-center justify-between border-t pt-1 font-mono text-[10px]'>
            <span>CLI: export DEEPSEEK_API_KEY="..."</span>
            <span className='flex items-center gap-1 font-medium text-emerald-600'>
              {t('Ready')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

type CCSwitchTab = keyof typeof CC_SWITCH_SITE_PRESETS

export function ClientGuideCard() {
  const { t } = useTranslation()
  const { status } = useStatus()
  const [currentOrigin, setCurrentOrigin] = useState('')
  const [activeTab, setActiveTab] = useState<
    'zcode' | 'cherry' | 'ccswitch' | 'magpie' | 'dsh' | 'code'
  >('zcode')
  const [ccSwitchApp, setCcSwitchApp] = useState<CCSwitchTab>('codex')
  const [zcodeImageMode, setZcodeImageMode] = useState<'openai' | 'custom'>(
    'openai'
  )
  const [zoomImage, setZoomImage] = useState<{
    src: string
    title: string
  } | null>(null)
  const [importingClient, setImportingClient] = useState<
    'cherry' | 'ccswitch' | 'magpie' | null
  >(null)

  // 监听来自 Hero 客户端徽标的点击跳转与 Tab 切换事件
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail
      if (
        detail &&
        ['zcode', 'cherry', 'ccswitch', 'magpie', 'dsh', 'code'].includes(
          detail
        )
      ) {
        setActiveTab(
          detail as 'zcode' | 'cherry' | 'ccswitch' | 'magpie' | 'dsh' | 'code'
        )
      }
    }
    window.addEventListener('select-client-guide', handler)
    return () => window.removeEventListener('select-client-guide', handler)
  }, [])

  // 严格优先采用浏览器当前的真实访问地址，杜绝 localhost 与内网/公网错配
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentOrigin(window.location.origin.replace(/\/+$/, ''))
    }
  }, [])

  const configuredAddress =
    typeof status?.server_address === 'string' ? status.server_address : ''
  const effectiveOrigin = preferPublicOrigin(
    currentOrigin,
    configuredAddress,
    'https://newapi.vsonic12138.shop'
  )

  const openAiBaseUrl = `${effectiveOrigin}/v1`
  const anthropicBaseUrl = effectiveOrigin

  const zcodeRecommendedModels = [
    'glm-5.3-flash',
    'grok-4.7',
    'gpt-6.1-sol',
    'deepseek-v4-flash',
  ]

  const providerName =
    (typeof status?.system_name === 'string' && status.system_name.trim()) ||
    'New API'
  const ccSwitchPreset = CC_SWITCH_SITE_PRESETS[ccSwitchApp]
  const ccSwitchModel = ccSwitchPreset.model

  const handleCCSwitchImport = () => {
    setImportingClient('ccswitch')

    const link = buildCCSwitchImportUrl({
      app: ccSwitchApp,
      name: ccSwitchPreset.name,
      origin: effectiveOrigin,
      model: ccSwitchPreset.model,
      apiKey: CLIENT_IMPORT_PLACEHOLDER_KEY,
    })

    try {
      window.location.href = link
    } catch {
      window.open(link, '_blank')
    }

    toast.info(
      t(
        'Import the template, replace sk-your-api-token with your site key in CC Switch, then enable the provider.'
      )
    )
    setImportingClient(null)
  }

  const ccSwitchEndpoint = openAiBaseUrl
  const ccSwitchSupportsImport = true
  const ccSwitchStepText = t(
    'Import the template, replace sk-your-api-token with your site key in CC Switch, then enable the provider.'
  )
  const ccSwitchShot =
    ccSwitchApp === 'codex'
      ? {
          src: '/docs-images/ccswitch-codex-gpt-1e460de954.png',
          title: t('CC Switch Codex GPT configuration'),
        }
      : {
          src: '/docs-images/ccswitch-opencode-grok-21c7db8a73.png',
          title: t('CC Switch OpenCode Grok configuration'),
        }

  const curlExample = `curl -X POST "${openAiBaseUrl}/chat/completions" \\
  -H "Authorization: Bearer sk-your-token" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "grok-4.7", "reasoning_effort": "high", "messages": [{"role": "user", "content": "Hello!"}]}'`

  return (
    <section className='relative z-10 px-4 py-10 sm:px-6 md:py-14'>
      <div className='mx-auto max-w-7xl 2xl:max-w-[1440px]'>
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
            {t(
              'One key, standard endpoints. Connect to CLI gateways and desktop clients in seconds.'
            )}
          </p>
        </div>

        {/* Global Endpoints Bar */}
        <div className='border-border/70 bg-muted/20 mb-6 rounded-2xl border p-4 backdrop-blur-xs'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-center gap-2.5'>
              <Network className='text-primary size-4 shrink-0' />
              <div className='flex flex-wrap items-center gap-2 text-xs'>
                <span className='text-foreground font-semibold'>
                  {t('Cluster Endpoints')}
                </span>
                <span className='inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400'>
                  <span className='size-1.5 animate-pulse rounded-full bg-emerald-500' />
                  {t('Auto Network Adapted')}
                </span>
              </div>
            </div>

            <Button
              variant='default'
              size='sm'
              className='h-8 gap-1.5 self-start px-3 text-xs font-medium sm:self-auto'
              render={<Link to='/keys' />}
            >
              <KeyRound className='size-3.5' />
              <span>{t('Manage API Keys')}</span>
            </Button>
          </div>

          {/* Endpoints Dual Row */}
          <div className='mt-3 grid gap-2.5 sm:grid-cols-2'>
            <div className='border-border/50 bg-background/80 flex items-center justify-between gap-2 rounded-xl border px-3 py-2'>
              <div className='min-w-0 flex-1'>
                <span className='text-muted-foreground text-[10px] font-medium'>
                  {t('OpenAI Base URL (/v1)')}
                </span>
                <p className='text-foreground font-mono text-xs font-semibold break-all select-all'>
                  {openAiBaseUrl}
                </p>
              </div>
              <CopyButton
                value={openAiBaseUrl}
                variant='ghost'
                size='sm'
                className='h-7 shrink-0 px-2 text-xs'
                tooltip={t('Copy')}
                successTooltip={t('Copied!')}
              >
                <span>{t('Copy')}</span>
              </CopyButton>
            </div>

            <div className='border-border/50 bg-background/80 flex items-center justify-between gap-2 rounded-xl border px-3 py-2'>
              <div className='min-w-0 flex-1'>
                <span className='text-muted-foreground text-[10px] font-medium'>
                  {t('Anthropic Base URL (Root)')}
                </span>
                <p className='text-foreground font-mono text-xs font-semibold break-all select-all'>
                  {anthropicBaseUrl}
                </p>
              </div>
              <CopyButton
                value={anthropicBaseUrl}
                variant='ghost'
                size='sm'
                className='h-7 shrink-0 px-2 text-xs'
                tooltip={t('Copy')}
                successTooltip={t('Copied!')}
              >
                <span>{t('Copy')}</span>
              </CopyButton>
            </div>
          </div>
        </div>

        {/* Categorized Client Navigation */}
        <div className='border-border/60 flex flex-wrap items-center justify-center gap-3 border-b pb-4'>
          {/* Group 1: 终端网关 / CLI 路由 */}
          <div className='border-border/60 bg-muted/30 flex items-center gap-1 rounded-xl border p-1 shadow-2xs'>
            <div className='border-border/40 text-muted-foreground/80 mr-0.5 flex items-center gap-1.5 border-r px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase'>
              <Network className='size-3.5 text-blue-500' />
              <span>{t('CLI Gateways')}</span>
            </div>
            <button
              type='button'
              onClick={() => setActiveTab('ccswitch')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                activeTab === 'ccswitch'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              )}
            >
              <CCSwitchLogo size={16} />
              <span>CC Switch</span>
            </button>
            <button
              type='button'
              onClick={() => setActiveTab('magpie')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                activeTab === 'magpie'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              )}
            >
              <MagpieLogo size={16} />
              <span>magpie</span>
            </button>
          </div>

          {/* Group 2: 桌面端 / 研发 Harness */}
          <div className='border-border/60 bg-muted/30 flex items-center gap-1 rounded-xl border p-1 shadow-2xs'>
            <div className='border-border/40 text-muted-foreground/80 mr-0.5 flex items-center gap-1.5 border-r px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase'>
              <Code2 className='size-3.5 text-emerald-500' />
              <span>{t('Desktop & Harness')}</span>
            </div>
            <button
              type='button'
              onClick={() => setActiveTab('cherry')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
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
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                activeTab === 'dsh'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              )}
            >
              <DeepSeek.Color size={16} />
              <span>DSH</span>
            </button>
            <button
              type='button'
              onClick={() => setActiveTab('zcode')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                activeTab === 'zcode'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              )}
            >
              <ZCodeLogo size={16} />
              <span>{t('ZCode (Zhipu)')}</span>
            </button>
          </div>

          {/* Group 3: 终端代码 */}
          <div className='border-border/60 bg-muted/30 flex items-center gap-1 rounded-xl border p-1 shadow-2xs'>
            <button
              type='button'
              onClick={() => setActiveTab('code')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                activeTab === 'code'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              )}
            >
              <Terminal className='size-3.5' />
              <span>{t('Cursor / Code')}</span>
            </button>
          </div>
        </div>

        {/* Tab 1: ZCode (官方原版截图 + 步骤图文看板) */}
        {activeTab === 'zcode' && (
          <div className='mt-5 grid gap-5 lg:grid-cols-12 lg:items-start'>
            {/* Left: 步骤指引 & 参数 */}
            <div className='border-border/70 bg-card space-y-4 rounded-2xl border p-5 shadow-xs lg:col-span-6'>
              <div className='border-border/40 flex items-center justify-between border-b pb-3'>
                <div className='flex items-center gap-2'>
                  <ZCodeLogo size={24} />
                  <div>
                    <h3 className='text-foreground text-sm font-bold'>
                      {t('ZCode setup steps')}
                    </h3>
                    <p className='text-muted-foreground text-[11px]'>
                      {t('Zhipu ADE developer settings')}
                    </p>
                  </div>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-muted-foreground h-7 gap-1 px-2 text-xs'
                  render={
                    <a
                      href='https://zcode.z.ai/cn/docs/configuration'
                      target='_blank'
                      rel='noopener noreferrer'
                    />
                  }
                >
                  <span>{t('Official docs')}</span>
                  <ExternalLink className='size-3' />
                </Button>
              </div>

              {/* 3 Steps */}
              <div className='space-y-2.5 text-xs'>
                <div className='border-border/40 bg-muted/20 flex items-start gap-2.5 rounded-xl border p-2.5'>
                  <span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-[11px] font-bold text-blue-600 dark:text-blue-400'>
                    1
                  </span>
                  <div>
                    <span className='text-foreground font-semibold'>
                      {t('Open Settings Menu')}
                    </span>
                    <p className='text-muted-foreground mt-0.5 text-[11px]'>
                      {t(
                        'Open the settings gear, then Model Settings, then OpenAI or add a provider.'
                      )}
                    </p>
                  </div>
                </div>

                <div className='border-border/40 bg-muted/20 flex items-start gap-2.5 rounded-xl border p-2.5'>
                  <span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-[11px] font-bold text-blue-600 dark:text-blue-400'>
                    2
                  </span>
                  <div className='min-w-0 flex-1'>
                    <span className='text-foreground font-semibold'>
                      {t('Fill Provider Parameters')}
                    </span>
                    <p className='text-muted-foreground mt-0.5 text-[11px]'>
                      {t(
                        'Enter the API address and API key in the highlighted fields.'
                      )}
                    </p>
                    <div className='bg-background mt-2 flex items-center justify-between gap-2 rounded-lg p-2 font-mono text-xs'>
                      <span className='text-foreground font-semibold break-all select-all'>
                        {openAiBaseUrl}
                      </span>
                      <CopyButton
                        value={openAiBaseUrl}
                        variant='ghost'
                        size='sm'
                        className='h-6 shrink-0 px-2 text-xs'
                        tooltip={t('Copy')}
                        successTooltip={t('Copied!')}
                      >
                        <span>{t('Copy')}</span>
                      </CopyButton>
                    </div>
                  </div>
                </div>

                <div className='border-border/40 bg-muted/20 flex items-start gap-2.5 rounded-xl border p-2.5'>
                  <span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-[11px] font-bold text-blue-600 dark:text-blue-400'>
                    3
                  </span>
                  <div className='min-w-0 flex-1'>
                    <span className='text-foreground font-semibold'>
                      {t('Register Model & Test Connection')}
                    </span>
                    <p className='text-muted-foreground mt-0.5 text-[11px]'>
                      {t(
                        'In the model list, click add model and enter a recommended ID.'
                      )}
                    </p>
                    <div className='mt-2 flex flex-wrap gap-1'>
                      {zcodeRecommendedModels.map((m) => (
                        <CopyButton
                          key={m}
                          value={m}
                          variant='outline'
                          size='sm'
                          className='h-6 rounded px-1.5 font-mono text-[10px]'
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
                <span>
                  {t(
                    'OpenAI Base URL must include /v1. Anthropic Base URL must not end with /v1.'
                  )}
                </span>
              </div>

              {/* Download */}
              <div className='border-border/40 flex items-center justify-between border-t pt-2'>
                <span className='text-muted-foreground text-[11px]'>
                  {t('Need the ZCode IDE developer client?')}
                </span>
                <Button
                  variant='outline'
                  size='sm'
                  className='h-7 gap-1 text-xs'
                  render={
                    <a
                      href='https://zcode.z.ai'
                      target='_blank'
                      rel='noopener noreferrer'
                    />
                  }
                >
                  <span>{t('Download ZCode')}</span>
                  <ExternalLink className='size-3' />
                </Button>
              </div>
            </div>

            {/* Right: 官方原版截图展示与灯箱放大 */}
            <div className='lg:col-span-6'>
              <div className='border-border/70 bg-card rounded-2xl border p-3 shadow-xs'>
                <div className='mb-2 flex items-center justify-between px-1'>
                  <div className='flex items-center gap-1.5'>
                    <button
                      type='button'
                      onClick={() => setZcodeImageMode('openai')}
                      className={cn(
                        'rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors',
                        zcodeImageMode === 'openai'
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted'
                      )}
                    >
                      {t('OpenAI protocol diagram')}
                    </button>
                    <button
                      type='button'
                      onClick={() => setZcodeImageMode('custom')}
                      className={cn(
                        'rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors',
                        zcodeImageMode === 'custom'
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted'
                      )}
                    >
                      {t('DeepSeek / custom provider diagram')}
                    </button>
                  </div>
                  <span className='text-muted-foreground inline-flex items-center gap-1 text-[10px]'>
                    <Maximize2 className='size-2.5' /> {t('Click to enlarge')}
                  </span>
                </div>

                <div
                  className='group border-border/60 relative cursor-pointer overflow-hidden rounded-xl border bg-neutral-950/60'
                  onClick={() =>
                    setZoomImage({
                      src:
                        zcodeImageMode === 'openai'
                          ? '/guides/zcode/zcode-openai.webp'
                          : '/guides/zcode/zcode-custom-provider.webp',
                      title:
                        zcodeImageMode === 'openai'
                          ? t('ZCode OpenAI setup screenshot')
                          : t('ZCode custom provider screenshot'),
                    })
                  }
                >
                  <img
                    src={
                      zcodeImageMode === 'openai'
                        ? '/guides/zcode/zcode-openai.webp'
                        : '/guides/zcode/zcode-custom-provider.webp'
                    }
                    alt={t('ZCode setup screenshot')}
                    className='h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.01]'
                  />
                  <div className='absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100'>
                    <span className='bg-background/90 text-foreground flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium shadow-md backdrop-blur-xs'>
                      <Maximize2 className='size-3' />{' '}
                      {t('Click to view the full image')}
                    </span>
                  </div>
                </div>
                <p className='text-muted-foreground mt-2 text-center text-[10px]'>
                  {t(
                    'Source: Zhipu docs. The screenshot marks where to enter the API address and API key.'
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cherry' && (
          <div className='mt-5'>
            <DocsClientSetup client='cherry' origin={effectiveOrigin} />
          </div>
        )}

        {activeTab === 'ccswitch' && (
          <div className='mt-5 grid gap-5 lg:grid-cols-12 lg:items-start'>
            <div className='border-border/70 bg-card space-y-4 rounded-2xl border p-5 shadow-xs lg:col-span-6'>
              <div className='border-border/40 flex flex-wrap items-center justify-between gap-3 border-b pb-3'>
                <div className='flex items-center gap-2'>
                  <div className='border-border/50 bg-muted/30 flex size-8 items-center justify-center rounded-lg border'>
                    <CCSwitchLogo size={20} />
                  </div>
                  <div>
                    <h3 className='text-foreground text-sm font-bold'>
                      {t('CC Switch provider manager')}
                    </h3>
                    <p className='text-muted-foreground text-[11px]'>
                      {t(
                        'Configure GPT in Codex or Grok in OpenCode with this site.'
                      )}
                    </p>
                  </div>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-muted-foreground h-7 gap-1 px-2 text-xs'
                  render={
                    <a
                      href='https://ccswitch.io/zh/tutorials'
                      target='_blank'
                      rel='noopener noreferrer'
                    />
                  }
                >
                  <span>{t('CC Switch official tutorials')}</span>
                  <ExternalLink className='size-3' />
                </Button>
              </div>

              <div className='flex flex-wrap items-center justify-between gap-2'>
                <div className='flex flex-wrap gap-1.5'>
                  {(
                    [
                      ['codex', 'Codex · GPT'],
                      ['opencode', 'OpenCode · Grok'],
                    ] as const
                  ).map(([app, label]) => (
                    <Button
                      variant='ghost'
                      size='sm'
                      aria-pressed={ccSwitchApp === app}
                      key={app}
                      type='button'
                      onClick={() => setCcSwitchApp(app)}
                      className={cn(
                        'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                        ccSwitchApp === app
                          ? 'bg-primary text-primary-foreground shadow-xs'
                          : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={importingClient === 'ccswitch'}
                  className='h-7 gap-1 border-blue-500/30 px-2.5 text-xs text-blue-600 hover:bg-blue-500/5 dark:text-blue-400'
                  onClick={handleCCSwitchImport}
                >
                  {importingClient === 'ccswitch' ? (
                    <Loader2 className='size-3 animate-spin' />
                  ) : (
                    <CheckCircle2 className='size-3' />
                  )}
                  <span>{t('Import configuration template')}</span>
                </Button>
              </div>

              <div className='space-y-2.5 text-xs'>
                <p className='text-sm'>
                  {t(
                    'Default reasoning effort: high. Supported levels: {{levels}}.',
                    {
                      levels:
                        ccSwitchApp === 'codex'
                          ? 'low / medium / high / xhigh / max'
                          : 'low / medium / high / xhigh',
                    }
                  )}{' '}
                  <Link
                    to='/docs/cc-switch'
                    className='font-semibold underline underline-offset-4'
                  >
                    {t('Set reasoning effort to high')}
                  </Link>
                </p>
                <div className='border-border/40 bg-muted/20 flex items-start gap-2.5 rounded-xl border p-2.5'>
                  <span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-[11px] font-bold text-blue-600 dark:text-blue-400'>
                    1
                  </span>
                  <div className='min-w-0 flex-1'>
                    <span className='text-foreground font-semibold'>
                      {t('Choose a configuration')}
                    </span>
                    <p className='text-muted-foreground mt-0.5 text-[11px]'>
                      {t(
                        'Choose GPT or Grok above. The template fills in the site address and model for you.'
                      )}
                    </p>
                    <div className='mt-2 grid gap-2 sm:grid-cols-2'>
                      <div className='bg-background rounded-lg p-2'>
                        <div className='flex items-center justify-between'>
                          <span className='text-muted-foreground text-[10px] font-semibold'>
                            {t('Imported address')}
                          </span>
                          <CopyButton
                            value={ccSwitchEndpoint}
                            variant='ghost'
                            size='sm'
                            className='h-4 px-1 text-[10px]'
                            tooltip={t('Copy')}
                            successTooltip={t('Copied!')}
                          >
                            <span>{t('Copy')}</span>
                          </CopyButton>
                        </div>
                        <p className='text-foreground mt-1 font-mono text-[11px] font-semibold break-all select-all'>
                          {ccSwitchEndpoint}
                        </p>
                      </div>
                      <div className='bg-background rounded-lg p-2'>
                        <div className='flex items-center justify-between'>
                          <span className='text-muted-foreground text-[10px] font-semibold'>
                            {t('Primary Model')}
                          </span>
                          {ccSwitchModel && (
                            <CopyButton
                              value={ccSwitchModel}
                              variant='ghost'
                              size='sm'
                              className='h-4 px-1 text-[10px]'
                              tooltip={t('Copy')}
                              successTooltip={t('Copied!')}
                            >
                              <span>{t('Copy')}</span>
                            </CopyButton>
                          )}
                        </div>
                        <p className='text-foreground mt-1 font-mono text-[11px] font-semibold break-all select-all'>
                          {ccSwitchModel || t('Choose a model from this site')}
                        </p>
                      </div>
                    </div>
                    <p className='text-muted-foreground mt-2 text-[11px]'>
                      {t('Group')}: {ccSwitchPreset.group}
                    </p>
                    <div className='mt-2 flex flex-wrap items-center gap-1.5 text-[11px]'>
                      <span className='text-muted-foreground text-[10px]'>
                        {t('Recommended models')}:
                      </span>
                      {ccSwitchPreset.alternatives.map((model) => (
                        <CopyButton
                          key={model}
                          value={model}
                          variant='outline'
                          size='sm'
                          className='h-5 rounded px-1.5 font-mono text-[10px]'
                          tooltip={t('Copy')}
                          successTooltip={t('Copied!')}
                        >
                          <span>{model}</span>
                        </CopyButton>
                      ))}
                    </div>
                  </div>
                </div>

                <div className='border-border/40 bg-muted/20 flex items-start gap-2.5 rounded-xl border p-2.5'>
                  <span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-[11px] font-bold text-blue-600 dark:text-blue-400'>
                    2
                  </span>
                  <div>
                    <span className='text-foreground font-semibold'>
                      {ccSwitchSupportsImport
                        ? t('Confirm the import')
                        : t('Add the provider in CC Switch')}
                    </span>
                    <p className='text-muted-foreground mt-0.5 text-[11px]'>
                      {ccSwitchStepText}
                    </p>
                  </div>
                </div>

                <div className='border-border/40 bg-muted/20 flex items-start gap-2.5 rounded-xl border p-2.5'>
                  <span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-[11px] font-bold text-blue-600 dark:text-blue-400'>
                    3
                  </span>
                  <div>
                    <span className='text-foreground font-semibold'>
                      {t('Enable the provider')}
                    </span>
                    <p className='text-muted-foreground mt-0.5 text-[11px]'>
                      {t(
                        'After replacing the example key, enable the provider and restart Codex or OpenCode.'
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Caveat */}
              <div className='flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/5 px-2.5 py-1.5 text-[11px] text-blue-700 dark:text-blue-300'>
                <AlertCircle className='size-3.5 shrink-0 text-blue-600 dark:text-blue-400' />
                <span>
                  {t(
                    'Both use the /v1 address. Choose a key from Codex 【标准】 for GPT or Grok 【特惠】 for Grok.'
                  )}
                </span>
              </div>

              {/* Download link */}
              <div className='border-border/40 flex items-center justify-between border-t pt-2'>
                <span className='text-muted-foreground text-[11px]'>
                  {t('Need the CC Switch desktop client?')}
                </span>
                <Button
                  variant='outline'
                  size='sm'
                  className='h-7 gap-1 text-xs'
                  render={
                    <a
                      href='https://ccswitch.io'
                      target='_blank'
                      rel='noopener noreferrer'
                    />
                  }
                >
                  <span>{t('CC Switch official website')}</span>
                  <ExternalLink className='size-3' />
                </Button>
              </div>
            </div>

            <div className='lg:col-span-6'>
              <div className='border-border/70 bg-card rounded-2xl border p-3 shadow-xs'>
                <div className='mb-2 flex items-center justify-between px-1'>
                  <span className='text-sm font-medium'>
                    {ccSwitchPreset.label}
                  </span>
                  <span className='text-muted-foreground inline-flex items-center gap-1 text-[10px]'>
                    <Maximize2 className='size-2.5' /> {t('Click to enlarge')}
                  </span>
                </div>
                <div
                  className='group border-border/60 relative cursor-pointer overflow-hidden rounded-xl border bg-neutral-950/60'
                  onClick={() => setZoomImage(ccSwitchShot)}
                >
                  <img
                    src={ccSwitchShot.src}
                    alt={ccSwitchShot.title}
                    className='h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.01]'
                  />
                  <div className='absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100'>
                    <span className='bg-background/90 text-foreground flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium shadow-md backdrop-blur-xs'>
                      <Maximize2 className='size-3' />{' '}
                      {t('Click to view the full image')}
                    </span>
                  </div>
                </div>
                <p className='text-muted-foreground mt-2 text-center text-[10px]'>
                  {t(
                    'Captured in CC Switch 4.0.16 with this site address and an example key. Replace the example key before use.'
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab: magpie (菜单栏统一 Agent 本地网关) */}
        {activeTab === 'magpie' && (
          <div className='mt-5'>
            <DocsClientSetup client='magpie' origin={effectiveOrigin} />
          </div>
        )}

        {/* Tab: DSH (DeepSeek Harness) (左右双栏图文看板) */}
        {activeTab === 'dsh' && (
          <div className='mt-5 grid gap-5 lg:grid-cols-12 lg:items-start'>
            {/* Left: 步骤指引 & 参数 */}
            <div className='border-border/70 bg-card space-y-4 rounded-2xl border p-5 shadow-xs lg:col-span-6'>
              <div className='border-border/40 flex items-center justify-between border-b pb-3'>
                <div className='flex items-center gap-2'>
                  <div className='border-border/50 bg-muted/30 flex size-8 items-center justify-center rounded-lg border'>
                    <DeepSeek.Color size={20} />
                  </div>
                  <div>
                    <h3 className='text-foreground text-sm font-bold'>
                      DeepSeek Harness (DSH)
                    </h3>
                    <p className='text-muted-foreground text-[11px]'>
                      {t('DeepSeek open-source Agent Harness client')}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-600 dark:text-cyan-400'>
                    {t('Web / Desktop')}
                  </span>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-muted-foreground h-7 gap-1 px-2 text-xs'
                    render={
                      <a
                        href='https://github.com/deepseek-ai/deepseek-harness'
                        target='_blank'
                        rel='noopener noreferrer'
                      />
                    }
                  >
                    <span>{t('Official docs')}</span>
                    <ExternalLink className='size-3' />
                  </Button>
                </div>
              </div>

              <div className='space-y-2.5 text-xs'>
                <div className='border-border/40 bg-muted/20 flex items-start gap-2.5 rounded-xl border p-2.5'>
                  <span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-[11px] font-bold text-cyan-600 dark:text-cyan-400'>
                    1
                  </span>
                  <div>
                    <span className='text-foreground font-semibold'>
                      {t('Start on the web or open the desktop app')}
                    </span>
                    <p className='text-muted-foreground mt-0.5 font-mono text-[11px]'>
                      npx @deepseek-ai/dsh web (
                      {t('or open the installed DSH client')})
                    </p>
                  </div>
                </div>

                <div className='border-border/40 bg-muted/20 flex items-start gap-2.5 rounded-xl border p-2.5'>
                  <span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-[11px] font-bold text-cyan-600 dark:text-cyan-400'>
                    2
                  </span>
                  <div className='min-w-0 flex-1'>
                    <span className='text-foreground font-semibold'>
                      {t('In Settings, open Models and add a custom provider')}
                    </span>
                    <p className='text-muted-foreground mt-0.5 text-[11px]'>
                      {t(
                        "Set Base URL to this site's OpenAI-compatible address and API Key to a token from this site."
                      )}
                    </p>
                    <div className='bg-background mt-2 flex items-center justify-between gap-2 rounded-lg p-2 font-mono text-xs'>
                      <span className='text-foreground font-semibold break-all select-all'>
                        {openAiBaseUrl}
                      </span>
                      <CopyButton
                        value={openAiBaseUrl}
                        variant='ghost'
                        size='sm'
                        className='h-6 shrink-0 px-2 text-xs'
                        tooltip={t('Copy')}
                        successTooltip={t('Copied!')}
                      >
                        <span>{t('Copy')}</span>
                      </CopyButton>
                    </div>
                  </div>
                </div>

                <div className='border-border/40 bg-muted/20 flex items-start gap-2.5 rounded-xl border p-2.5'>
                  <span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-[11px] font-bold text-cyan-600 dark:text-cyan-400'>
                    3
                  </span>
                  <div className='min-w-0 flex-1'>
                    <span className='text-foreground font-semibold'>
                      {t('Set the model ID')}
                    </span>
                    <p className='text-muted-foreground mt-0.5 text-[11px]'>
                      {t('The recommended default is {{model}}.', {
                        model: 'deepseek-flash',
                      })}
                    </p>
                    <div className='mt-1.5'>
                      <CopyButton
                        value='deepseek-flash'
                        variant='outline'
                        size='sm'
                        className='h-6 rounded px-1.5 font-mono text-[10px]'
                        tooltip={t('Click to copy model ID')}
                        successTooltip={t('Copied!')}
                      >
                        <span>deepseek-flash</span>
                      </CopyButton>
                    </div>
                  </div>
                </div>
              </div>

              {/* CLI tip */}
              <div className='border-border/50 bg-muted/40 text-muted-foreground rounded-lg border p-2 font-mono text-[10px]'>
                # {t('You can also start with these environment variables:')}
                <br />
                <span className='text-foreground'>
                  export DEEPSEEK_API_KEY="sk-your-token"
                </span>
                <br />
                <span className='text-foreground'>
                  export OPENAI_BASE_URL="{openAiBaseUrl}"
                </span>
              </div>

              {/* Bottom links */}
              <div className='border-border/40 flex items-center justify-between border-t pt-3'>
                <CopyButton
                  value={openAiBaseUrl}
                  variant='ghost'
                  size='sm'
                  className='h-7 flex-1 text-xs'
                  tooltip={t('Copy')}
                  successTooltip={t('Copied!')}
                >
                  <span>{t('Copy Base URL')}</span>
                </CopyButton>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-muted-foreground h-7 px-2 text-xs'
                  render={
                    <a
                      href='https://github.com/deepseek-ai/deepseek-harness'
                      target='_blank'
                      rel='noopener noreferrer'
                    />
                  }
                >
                  <span>{t('Official Site')}</span>
                  <ExternalLink className='size-3' />
                </Button>
              </div>
            </div>

            {/* Right: DSH 图解 */}
            <div className='lg:col-span-6'>
              <div className='border-border/70 bg-card rounded-2xl border p-3 shadow-xs'>
                <div className='mb-2 flex items-center justify-between px-1'>
                  <span className='text-foreground text-xs font-semibold'>
                    {t('DSH interface diagram')}
                  </span>
                  <span className='text-muted-foreground inline-flex items-center gap-1 text-[10px]'>
                    <Maximize2 className='size-2.5' /> {t('Click to enlarge')}
                  </span>
                </div>
                <div
                  className='group border-border/60 relative cursor-pointer overflow-hidden rounded-xl border'
                  onClick={() =>
                    setZoomImage({
                      src: 'mockup-dsh',
                      title: t('DeepSeek Harness interface diagram'),
                    })
                  }
                >
                  <DshMockupVisual
                    openAiBaseUrl={openAiBaseUrl}
                    providerName={providerName}
                  />
                </div>
                <p className='text-muted-foreground mt-2 text-center text-[10px]'>
                  {t(
                    'DeepSeek open-source agent framework supports web, desktop, and CLI.'
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Universal Code / cURL */}
        {activeTab === 'code' && (
          <div className='border-border/70 bg-card mt-5 rounded-2xl border p-5 shadow-xs'>
            <div className='border-border/40 flex items-center justify-between border-b pb-3'>
              <div className='flex items-center gap-2'>
                <Terminal className='size-4 text-violet-500' />
                <h3 className='text-foreground text-sm font-bold'>
                  {t('Cursor / Claude Code / SDK calls')}
                </h3>
              </div>
              <CopyButton
                value={curlExample}
                variant='outline'
                size='sm'
                className='h-7 gap-1 text-xs'
                tooltip={t('Copy')}
                successTooltip={t('Copied!')}
              >
                <Code2 className='size-3' />
                <span>{t('Copy cURL command')}</span>
              </CopyButton>
            </div>

            <div className='mt-3 space-y-2'>
              <div className='border-border/50 bg-muted/40 text-foreground overflow-x-auto rounded-xl border p-3 font-mono text-[11px]'>
                <p className='text-muted-foreground'>
                  #{' '}
                  {t(
                    'Environment variables for Cursor, LangChain, and LiteLLM'
                  )}
                </p>
                <p className='mt-1 text-emerald-600 dark:text-emerald-400'>
                  export OPENAI_BASE_URL="{openAiBaseUrl}"
                </p>
                <p className='text-emerald-600 dark:text-emerald-400'>
                  export OPENAI_API_KEY="sk-your-token"
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 灯箱高清大图弹窗 (Lightbox Modal) */}
      {zoomImage && (
        <div
          role='dialog'
          aria-modal='true'
          className='animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md duration-200'
          onClick={() => setZoomImage(null)}
        >
          <div
            className='border-border/50 bg-card animate-in zoom-in-95 relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border p-4 shadow-2xl duration-200 sm:p-6'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='border-border/40 mb-3 flex items-center justify-between border-b pb-2.5'>
              <div className='flex items-center gap-2'>
                <Sparkles className='text-primary size-4' />
                <span className='text-foreground text-sm font-bold'>
                  {zoomImage.title}
                </span>
              </div>
              <button
                type='button'
                onClick={() => setZoomImage(null)}
                className='text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg p-1 transition-colors'
              >
                <X className='size-5' />
              </button>
            </div>

            {/* 大图容器 */}
            <div className='flex items-center justify-center py-2'>
              {zoomImage.src === 'mockup-dsh' ? (
                <div className='w-full'>
                  <DshMockupVisual
                    openAiBaseUrl={openAiBaseUrl}
                    providerName={providerName}
                  />
                </div>
              ) : (
                <img
                  src={zoomImage.src}
                  alt={zoomImage.title}
                  className='h-auto max-h-[75vh] w-full rounded-xl object-contain shadow-md'
                />
              )}
            </div>

            <div className='text-muted-foreground border-border/40 mt-3 flex items-center justify-between border-t pt-2.5 text-xs'>
              <span>{t('Click the backdrop or the close button')}</span>
              <Button
                variant='outline'
                size='sm'
                className='h-7 text-xs'
                onClick={() => setZoomImage(null)}
              >
                {t('Done')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
