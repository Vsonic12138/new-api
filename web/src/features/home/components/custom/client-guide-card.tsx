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
import { useStatus } from '@/hooks/use-status'
import { cn } from '@/lib/utils'

import {
  buildCCSwitchImportUrl,
  buildCherryStudioImportUrl,
  buildMagpieImportUrl,
  CLIENT_IMPORT_PLACEHOLDER_KEY,
  preferPublicOrigin,
  type CCSwitchApp,
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

type CCSwitchTab = CCSwitchApp

export function ClientGuideCard() {
  const { t } = useTranslation()
  const { status } = useStatus()
  const [currentOrigin, setCurrentOrigin] = useState('')
  const [activeTab, setActiveTab] = useState<
    'zcode' | 'cherry' | 'ccswitch' | 'magpie' | 'dsh' | 'code'
  >('zcode')
  const [ccSwitchApp, setCcSwitchApp] = useState<CCSwitchTab>('claude')
  const [ccSwitchImage, setCcSwitchImage] = useState<'add' | 'main'>('add')
  const [magpieImage, setMagpieImage] = useState<'import' | 'agents' | 'add'>(
    'import'
  )
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
          detail as
            | 'zcode'
            | 'cherry'
            | 'ccswitch'
            | 'magpie'
            | 'dsh'
            | 'code'
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
    'claude-sonnet-5',
    'gpt-6.1-sol',
    'deepseek-v4-flash',
  ]

  const providerName =
    (typeof status?.system_name === 'string' && status.system_name.trim()) ||
    'New API'
  const importModels = [
    'claude-sonnet-5',
    'claude-opus-5-5',
    'gpt-6.1-sol',
    'deepseek-v4-flash',
    'glm-5.3-flash',
  ]
  const ccSwitchModelMap: Record<CCSwitchTab, Record<string, string>> = {
    claude: {
      model: 'claude-sonnet-5',
      opusModel: 'claude-opus-5-5',
      opus_model: 'claude-opus-5-5',
      sonnetModel: 'claude-sonnet-5',
      sonnet_model: 'claude-sonnet-5',
    },
    codex: { model: 'gpt-6.1-sol' },
    gemini: { model: 'gemini-3.8-flash' },
    opencode: { model: 'gpt-6.1-sol' },
  }
  const ccSwitchAltModels: Record<CCSwitchTab, string[]> = {
    claude: ['claude-sonnet-5', 'claude-opus-5-5'],
    codex: ['gpt-6.1-sol', 'gpt-5.6-luna'],
    gemini: ['gemini-3.8-flash', 'deepseek-v4-flash'],
    opencode: ['gpt-6.1-sol', 'claude-sonnet-5', 'deepseek-v4-flash'],
  }
  const ccSwitchModel = ccSwitchModelMap[ccSwitchApp].model ?? ''

  const handleCherryImport = () => {
    setImportingClient('cherry')
    const link = buildCherryStudioImportUrl({
      name: providerName,
      apiHost: effectiveOrigin,
      apiKey: CLIENT_IMPORT_PLACEHOLDER_KEY,
    })

    try {
      window.location.href = link
    } catch {
      window.open(link, '_blank')
    }

    toast.info(
      t(
        'One-click import opens Cherry Studio. Replace the placeholder API key with a key from this site before use.'
      )
    )
    setImportingClient(null)
  }

  const handleCCSwitchImport = () => {
    setImportingClient('ccswitch')

    const link = buildCCSwitchImportUrl({
      app: ccSwitchApp,
      name: providerName,
      origin: effectiveOrigin,
      models: ccSwitchModelMap[ccSwitchApp],
      apiKey: CLIENT_IMPORT_PLACEHOLDER_KEY,
    })

    try {
      window.location.href = link
    } catch {
      window.open(link, '_blank')
    }

    toast.info(
      t(
        'One-click import opens CC Switch and shows a confirmation. Replace the placeholder API key with a key from this site before confirming.'
      )
    )
    setImportingClient(null)
  }

  const ccSwitchEndpoint =
    ccSwitchApp === 'claude' ? anthropicBaseUrl : openAiBaseUrl
  const ccSwitchSupportsImport = true
  const ccSwitchStepText = t(
    'One-click import opens CC Switch and shows a confirmation. Replace the placeholder API key with a key from this site before confirming.'
  )
  const ccSwitchShot =
    ccSwitchImage === 'add'
      ? {
          src: '/guides/ccswitch/add-provider.png',
          title: t('CC Switch add provider screenshot'),
        }
      : {
          src: '/guides/ccswitch/main-window.png',
          title: t('CC Switch main window screenshot'),
        }

  const handleMagpieImport = () => {
    setImportingClient('magpie')
    const link = buildMagpieImportUrl({
      name: providerName,
      origin: effectiveOrigin,
      models: zcodeRecommendedModels,
      apiKey: CLIENT_IMPORT_PLACEHOLDER_KEY,
    })
    try {
      window.open(link, '_blank')
    } catch {
      window.location.href = link
    }
    toast.info(
      t(
        'One-click import opens magpie. Confirm the provider parameters to add to your local gateway.'
      )
    )
    setImportingClient(null)
  }

  const magpieShot =
    magpieImage === 'import'
      ? {
          src: '/guides/magpie/import-provider.png',
          title: t('magpie import provider screenshot'),
        }
      : magpieImage === 'agents'
        ? {
            src: '/guides/magpie/agents-models.png',
            title: t('magpie agents model management screenshot'),
          }
        : {
            src: '/guides/magpie/add-provider.png',
            title: t('magpie add provider panel screenshot'),
          }


  const curlExample = `curl -X POST "${openAiBaseUrl}/chat/completions" \\
  -H "Authorization: Bearer sk-your-token" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "claude-sonnet-5", "messages": [{"role": "user", "content": "Hello!"}]}'`

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
                      {t('Official ZCode setup steps')}
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
              <div className='flex items-center justify-between pt-2 border-t border-border/40'>
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
                          ? t('ZCode official OpenAI setup screenshot')
                          : t('ZCode official custom provider screenshot'),
                    })
                  }
                >
                  <img
                    src={
                      zcodeImageMode === 'openai'
                        ? '/guides/zcode/zcode-openai.webp'
                        : '/guides/zcode/zcode-custom-provider.webp'
                    }
                    alt={t('ZCode official setup screenshot')}
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
                    'Source: Zhipu official docs. The screenshot marks where to enter the API address and API key.'
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Cherry Studio (官方原版截图 + 步骤图文看板) */}
        {activeTab === 'cherry' && (
          <div className='mt-5 grid gap-5 lg:grid-cols-12 lg:items-start'>
            {/* Left: 步骤指引 & 快捷导入 */}
            <div className='border-border/70 bg-card space-y-4 rounded-2xl border p-5 shadow-xs lg:col-span-6'>
              <div className='border-border/40 flex items-center justify-between border-b pb-3'>
                <div className='flex items-center gap-2'>
                  <div className='border-border/50 bg-muted/30 flex size-8 items-center justify-center rounded-lg border'>
                    <CherryStudio.Color size={20} />
                  </div>
                  <div>
                    <h3 className='text-foreground text-sm font-bold'>
                      {t('Cherry Studio desktop client')}
                    </h3>
                    <p className='text-muted-foreground text-[11px]'>
                      {t(
                        'Compare models side by side, with knowledge RAG and visible reasoning.'
                      )}
                    </p>
                  </div>
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={importingClient === 'cherry'}
                  className='h-7 gap-1 border-red-500/30 px-2.5 text-xs text-red-600 hover:bg-red-500/5'
                  onClick={handleCherryImport}
                >
                  {importingClient === 'cherry' ? (
                    <Loader2 className='size-3 animate-spin' />
                  ) : (
                    <CheckCircle2 className='size-3' />
                  )}
                  <span>{t('One-click import')}</span>
                </Button>
              </div>

              <div className='space-y-2.5 text-xs'>
                <div className='border-border/50 bg-muted/20 rounded-xl border p-3'>
                  <span className='text-muted-foreground text-[11px] font-semibold'>
                    {t('Manual setup reference')}
                  </span>
                  <div className='mt-2 space-y-1.5 font-mono text-[11px]'>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>
                        {t('Provider type')}:
                      </span>
                      <span className='font-semibold'>
                        {t('OpenAI compatible')}
                      </span>
                    </div>
                    <div className='flex items-center justify-between gap-2'>
                      <span className='text-muted-foreground shrink-0'>
                        API Base URL:
                      </span>
                      <span className='text-right font-semibold break-all select-all'>
                        {openAiBaseUrl}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>API Key:</span>
                      <span className='text-muted-foreground'>sk-xxxx</span>
                    </div>
                  </div>
                </div>

                <div className='border-border/50 bg-muted/20 flex flex-col justify-between rounded-xl border p-3'>
                  <span className='text-muted-foreground text-[11px] font-semibold'>
                    {t('Recommended models')}
                  </span>
                  <p className='text-muted-foreground mt-1 text-[11px]'>
                    {t('Add these models in model management: {{models}}.', {
                      models: importModels.join(', '),
                    })}
                  </p>
                  <div className='mt-3 flex items-center gap-2'>
                    <CopyButton
                      value={openAiBaseUrl}
                      variant='outline'
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
                      className='h-7 px-2 text-xs'
                      render={
                        <a
                          href='https://cherry-ai.com'
                          target='_blank'
                          rel='noopener noreferrer'
                        />
                      }
                    >
                      <span>{t('Download client')}</span>
                      <ExternalLink className='size-3' />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: 官方原版截图展示与灯箱放大 */}
            <div className='lg:col-span-6'>
              <div className='border-border/70 bg-card rounded-2xl border p-3 shadow-xs'>
                <div className='mb-2 flex items-center justify-between px-1'>
                  <span className='text-foreground text-xs font-semibold'>
                    {t('Cherry Studio model service screenshot')}
                  </span>
                  <span className='text-muted-foreground inline-flex items-center gap-1 text-[10px]'>
                    <Maximize2 className='size-2.5' /> {t('Click to enlarge')}
                  </span>
                </div>

                <div
                  className='group border-border/60 relative cursor-pointer overflow-hidden rounded-xl border bg-neutral-950/60'
                  onClick={() =>
                    setZoomImage({
                      src: '/guides/cherry/cherry-3.webp',
                      title: t('Cherry Studio model service screenshot'),
                    })
                  }
                >
                  <img
                    src='/guides/cherry/cherry-3.webp'
                    alt={t('Cherry Studio settings screenshot')}
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
                    'Source: Cherry Studio docs. The screenshot shows where to enter the API key and address.'
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ccswitch' && (
          <div className='mt-5 grid gap-5 lg:grid-cols-12 lg:items-start'>
            <div className='border-border/70 bg-card space-y-4 rounded-2xl border p-5 shadow-xs lg:col-span-6'>
              <div className='border-border/40 flex items-center justify-between border-b pb-3'>
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
                        'Switch Claude Code, Codex, OpenCode, and Pi providers from one desktop app.'
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
                      href='https://ccswitch.io/zh/docs?section=getting-started&item=quickstart'
                      target='_blank'
                      rel='noopener noreferrer'
                    />
                  }
                >
                  <span>{t('Official docs')}</span>
                  <ExternalLink className='size-3' />
                </Button>
              </div>

              <div className='flex flex-wrap items-center justify-between gap-2'>
                <div className='flex flex-wrap gap-1.5'>
                  {(
                    [
                      ['claude', 'Claude Code'],
                      ['codex', 'Codex'],
                      ['gemini', 'Gemini CLI'],
                      ['opencode', 'OpenCode'],
                    ] as const
                  ).map(([app, label]) => (
                    <button
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
                    </button>
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
                  <span>{t('One-click import')}</span>
                </Button>
              </div>

              <div className='space-y-2.5 text-xs'>
                <div className='border-border/40 bg-muted/20 flex items-start gap-2.5 rounded-xl border p-2.5'>
                  <span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-[11px] font-bold text-blue-600 dark:text-blue-400'>
                    1
                  </span>
                  <div className='min-w-0 flex-1'>
                    <span className='text-foreground font-semibold'>
                      {t('Add provider')}
                    </span>
                    <p className='text-muted-foreground mt-0.5 text-[11px]'>
                      {t(
                        'Click the plus button, choose Custom, then fill in the API key and endpoint. A preset only needs an API key.'
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
                    {ccSwitchApp === 'claude' ? (
                      <div className='mt-2 flex flex-wrap items-center gap-1.5 text-[11px]'>
                        <span className='text-muted-foreground text-[10px]'>
                          {t('Recommended models')}:
                        </span>
                        <CopyButton
                          value='claude-opus-5-5'
                          variant='outline'
                          size='sm'
                          className='h-5 rounded px-1.5 font-mono text-[10px]'
                          tooltip={t('Copy')}
                          successTooltip={t('Copied!')}
                        >
                          <span>opus: claude-opus-5-5</span>
                        </CopyButton>
                        <CopyButton
                          value='claude-sonnet-5'
                          variant='outline'
                          size='sm'
                          className='h-5 rounded px-1.5 font-mono text-[10px]'
                          tooltip={t('Copy')}
                          successTooltip={t('Copied!')}
                        >
                          <span>sonnet: claude-sonnet-5</span>
                        </CopyButton>
                      </div>
                    ) : (
                      <div className='mt-2 flex flex-wrap items-center gap-1.5 text-[11px]'>
                        <span className='text-muted-foreground text-[10px]'>
                          {t('Recommended models')}:
                        </span>
                        {ccSwitchAltModels[ccSwitchApp].map((model) => (
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
                    )}
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
                        'Click Enable on the provider card. Claude Code applies immediately. For Codex and OpenCode, restart the terminal or CLI.'
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
                    'Claude Code uses the site root with the Anthropic protocol. Codex and OpenCode use the OpenAI-compatible /v1 address.'
                  )}
                </span>
              </div>

              {/* Download link */}
              <div className='flex items-center justify-between pt-2 border-t border-border/40'>
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
                  <span>{t('Download CC Switch')}</span>
                  <ExternalLink className='size-3' />
                </Button>
              </div>
            </div>

            <div className='lg:col-span-6'>
              <div className='border-border/70 bg-card rounded-2xl border p-3 shadow-xs'>
                <div className='mb-2 flex items-center justify-between px-1'>
                  <div className='flex gap-1'>
                    <button
                      type='button'
                      onClick={() => setCcSwitchImage('add')}
                      className={cn(
                        'rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors',
                        ccSwitchImage === 'add'
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted'
                      )}
                    >
                      {t('Add provider')}
                    </button>
                    <button
                      type='button'
                      onClick={() => setCcSwitchImage('main')}
                      className={cn(
                        'rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors',
                        ccSwitchImage === 'main'
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted'
                      )}
                    >
                      {t('Main window')}
                    </button>
                  </div>
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
                    'Source: CC Switch official quick start. The screenshot shows where to add a provider and API key.'
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab: magpie (菜单栏统一 Agent 本地网关) */}
        {activeTab === 'magpie' && (
          <div className='mt-5 grid gap-5 lg:grid-cols-12 lg:items-start'>
            {/* Left: 步骤指引 & 参数 */}
            <div className='border-border/70 bg-card space-y-4 rounded-2xl border p-5 shadow-xs lg:col-span-6'>
              <div className='border-border/40 flex items-center justify-between border-b pb-3'>
                <div className='flex items-center gap-2'>
                  <div className='border-border/50 bg-muted/30 flex size-8 items-center justify-center rounded-lg border'>
                    <MagpieLogo size={20} />
                  </div>
                  <div>
                    <h3 className='text-foreground text-sm font-bold'>
                      magpie
                    </h3>
                    <p className='text-muted-foreground text-[11px]'>
                      {t(
                        'Manage models for all Agents in one place. One-click selection via local gateway.'
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
                      href='https://usemagpie.ai/docs/zh/start'
                      target='_blank'
                      rel='noopener noreferrer'
                    />
                  }
                >
                  <span>{t('Official docs')}</span>
                  <ExternalLink className='size-3' />
                </Button>
              </div>

              {/* Supported Agents Chips & One-Click Import */}
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <div className='flex flex-wrap gap-1.5'>
                  {['Claude Code', 'Codex', 'Gemini CLI', 'OpenCode', 'Pi'].map(
                    (app) => (
                      <span
                        key={app}
                        className='bg-muted/60 text-muted-foreground rounded-lg px-2.5 py-1 text-[11px] font-medium'
                      >
                        {app}
                      </span>
                    )
                  )}
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={importingClient === 'magpie'}
                  className='h-7 gap-1 border-blue-500/30 px-2.5 text-xs text-blue-600 hover:bg-blue-500/5 dark:text-blue-400'
                  onClick={handleMagpieImport}
                >
                  {importingClient === 'magpie' ? (
                    <Loader2 className='size-3 animate-spin' />
                  ) : (
                    <Sparkles className='size-3 text-amber-500' />
                  )}
                  <span>{t('One-click import')}</span>
                </Button>
              </div>

              {/* Steps */}
              <div className='space-y-2.5 text-xs'>
                {/* Step 1 */}
                <div className='border-border/40 bg-muted/20 flex items-start gap-2.5 rounded-xl border p-2.5'>
                  <span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-[11px] font-bold text-blue-600 dark:text-blue-400'>
                    1
                  </span>
                  <div className='min-w-0 flex-1'>
                    <span className='text-foreground font-semibold'>
                      {t('Add Provider (One-Click or Manual)')}
                    </span>
                    <p className='text-muted-foreground mt-0.5 text-[11px]'>
                      {t(
                        'Click One-Click Import to launch magpie, or add a Custom provider in the Providers tab.'
                      )}
                    </p>

                    <div className='mt-2 grid gap-1.5 sm:grid-cols-2'>
                      <div className='bg-background rounded-lg p-2'>
                        <div className='flex items-center justify-between'>
                          <span className='text-muted-foreground text-[10px] font-semibold'>
                            {t('OpenAI Base URL (/v1)')}
                          </span>
                          <CopyButton
                            value={openAiBaseUrl}
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
                          {openAiBaseUrl}
                        </p>
                      </div>

                      <div className='bg-background rounded-lg p-2'>
                        <div className='flex items-center justify-between'>
                          <span className='text-muted-foreground text-[10px] font-semibold'>
                            {t('Anthropic Base URL (Root)')}
                          </span>
                          <CopyButton
                            value={anthropicBaseUrl}
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
                          {anthropicBaseUrl}
                        </p>
                      </div>
                    </div>

                    <div className='mt-2 flex flex-wrap items-center gap-1.5 text-[11px]'>
                      <span className='text-muted-foreground text-[10px]'>
                        {t('Recommended models')}:
                      </span>
                      {zcodeRecommendedModels.map((model) => (
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

                {/* Step 2 */}
                <div className='border-border/40 bg-muted/20 flex items-start gap-2.5 rounded-xl border p-2.5'>
                  <span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-[11px] font-bold text-blue-600 dark:text-blue-400'>
                    2
                  </span>
                  <div>
                    <span className='text-foreground font-semibold'>
                      {t('Select Models for Each Agent')}
                    </span>
                    <p className='text-muted-foreground mt-0.5 text-[11px]'>
                      {t(
                        'In the Agents tab, choose your preferred model from DaHuang API for Claude Code, Codex, Gemini CLI, OpenCode, or Pi.'
                      )}
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className='border-border/40 bg-muted/20 flex items-start gap-2.5 rounded-xl border p-2.5'>
                  <span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-[11px] font-bold text-blue-600 dark:text-blue-400'>
                    3
                  </span>
                  <div className='min-w-0 flex-1'>
                    <span className='text-foreground font-semibold'>
                      {t('Enjoy Unified Local Gateway')}
                    </span>
                    <p className='text-muted-foreground mt-0.5 text-[11px]'>
                      {t(
                        'magpie runs locally at 127.0.0.1:3425, translating OpenAI, Anthropic, and Gemini protocols with streaming and tool calls.'
                      )}
                    </p>
                    <div className='mt-2 flex items-center gap-2'>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='h-7 px-2 text-xs'
                        render={
                          <a
                            href='https://usemagpie.ai/zh/#get'
                            target='_blank'
                            rel='noopener noreferrer'
                          />
                        }
                      >
                        <span>{t('Download magpie')}</span>
                        <ExternalLink className='size-3' />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: 官方截图展示与放大 */}
            <div className='lg:col-span-6'>
              <div className='border-border/70 bg-card rounded-2xl border p-3 shadow-xs'>
                <div className='mb-2 flex items-center justify-between px-1'>
                  <div className='flex gap-1'>
                    <button
                      type='button'
                      onClick={() => setMagpieImage('import')}
                      className={cn(
                        'rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors',
                        magpieImage === 'import'
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted'
                      )}
                    >
                      {t('Import confirmation')}
                    </button>
                    <button
                      type='button'
                      onClick={() => setMagpieImage('agents')}
                      className={cn(
                        'rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors',
                        magpieImage === 'agents'
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted'
                      )}
                    >
                      {t('Agent models')}
                    </button>
                    <button
                      type='button'
                      onClick={() => setMagpieImage('add')}
                      className={cn(
                        'rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors',
                        magpieImage === 'add'
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted'
                      )}
                    >
                      {t('Add provider')}
                    </button>
                  </div>
                  <span className='text-muted-foreground inline-flex items-center gap-1 text-[10px]'>
                    <Maximize2 className='size-2.5' /> {t('Click to enlarge')}
                  </span>
                </div>
                <div
                  className='group border-border/60 relative cursor-pointer overflow-hidden rounded-xl border bg-neutral-950/60'
                  onClick={() => setZoomImage(magpieShot)}
                >
                  <img
                    src={magpieShot.src}
                    alt={magpieShot.title}
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
                    'Source: magpie official docs. Screenshot shows one-click provider import and agent model selection.'
                  )}
                </p>
              </div>
            </div>
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
                      {t('DeepSeek official Agent Harness client')}
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
