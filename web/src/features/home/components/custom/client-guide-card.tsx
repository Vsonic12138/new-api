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

// Stylized modern brand badge for ZCode (Z.ai Official Agentic ADE)
function ZCodeLogo({ className }: { className?: string }) {
  return (
    <div
      className={`relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 shadow-md shadow-blue-500/20 text-white ${className ?? ''}`}
    >
      <div className='absolute inset-[1px] rounded-[11px] bg-gradient-to-br from-white/20 to-transparent' />
      <span className='relative text-sm font-black tracking-wider'>Z</span>
      <span className='absolute bottom-1 right-1 size-1.5 rounded-full bg-cyan-300 ring-2 ring-blue-600' />
    </div>
  )
}

export function ClientGuideCard() {
  const { t } = useTranslation()
  const { status } = useStatus()
  const [currentOrigin, setCurrentOrigin] = useState('')

  // 始终以用户当前在浏览器中访问的完整 host/origin 为准，避免任何内置 localhost 干扰
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const activeOrigin = window.location.origin.replace(/\/+$/, '')
      setCurrentOrigin(activeOrigin)
    }
  }, [])

  const effectiveOrigin =
    currentOrigin ||
    (status?.server_address && !status.server_address.includes('localhost')
      ? (status.server_address as string).replace(/\/+$/, '')
      : 'https://newapi.vsonic12138.shop')

  const openAiBaseUrl = `${effectiveOrigin}/v1`
  const anthropicBaseUrl = effectiveOrigin

  // ZCode 快速配置模型列表
  const zcodeRecommendedModels = ['claude-sonnet-5', 'gpt-6.1-sol', 'deepseek-v4-flash']

  // Cherry Studio 一键配置数据
  const cherryConfigData = {
    name: status?.system_name || '大黄API · 大狗叫',
    apiHost: openAiBaseUrl,
    apiKey: 'sk-your-api-token',
    models: ['claude-sonnet-5', 'gpt-6.1-sol', 'deepseek-v4-flash', 'grok-4.7'],
  }
  const cherryDeepLink = `cherrystudio://providers/api-keys?v=1&data=${encodeURIComponent(JSON.stringify(cherryConfigData))}`

  const curlExample = `curl -X POST "${openAiBaseUrl}/chat/completions" \\
  -H "Authorization: Bearer sk-your-api-token" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "claude-sonnet-5",
    "messages": [{"role": "user", "content": "大狗叫一声！"}]
  }'`

  return (
    <section className='relative z-10 px-6 py-12 md:py-16'>
      <div className='mx-auto max-w-6xl'>
        {/* Section Header */}
        <div className='mb-8 flex flex-col items-center text-center'>
          <div className='mb-3 inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1 text-[11px] font-medium text-blue-600 dark:border-blue-400/20 dark:bg-blue-400/5 dark:text-blue-400'>
            <Sparkles className='size-3' />
            <span>{t('Instant Setup')}</span>
          </div>
          <h2 className='text-2xl font-bold tracking-tight md:text-3xl'>
            {t('Call Once, Ready to Code')}
          </h2>
          <p className='text-muted-foreground mt-2 max-w-xl text-sm leading-relaxed'>
            {t(
              'Supports standard OpenAI and Anthropic protocols. Seamlessly connect to ZCode, Cherry Studio, Cursor, and any development workflow.'
            )}
          </p>
        </div>

        {/* Global Endpoints Bar: 双协议地址 + 智能局域网/公网自适应 */}
        <div className='mb-8 overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-r from-muted/30 via-background to-muted/30 p-5 shadow-xs backdrop-blur-xs'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
            {/* Status & Origin Notice */}
            <div className='flex items-start gap-3.5'>
              <div className='flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary'>
                <Network className='size-5' />
              </div>
              <div>
                <div className='flex flex-wrap items-center gap-2'>
                  <span className='text-sm font-semibold text-foreground'>
                    {t('Gateway Cluster Endpoints')}
                  </span>
                  <span className='inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400'>
                    <span className='size-1.5 rounded-full bg-emerald-500 animate-pulse' />
                    {t('Current Network Online')}
                  </span>
                </div>
                <p className='text-muted-foreground/80 mt-1 text-xs'>
                  {t(
                    'Automatically synchronized with your current visiting host. Use in local networks or public domain without configuration mismatches.'
                  )}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className='flex shrink-0 items-center gap-2.5'>
              <Button
                variant='default'
                size='sm'
                className='h-9 gap-1.5 px-4 text-xs font-medium shadow-xs'
                render={<Link to='/tokens' />}
              >
                <KeyRound className='size-3.5' />
                <span>{t('Manage API Keys')}</span>
              </Button>
            </div>
          </div>

          {/* Two Endpoints Details */}
          <div className='mt-4 grid gap-3 sm:grid-cols-2'>
            {/* OpenAI Compatible Endpoint */}
            <div className='flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-background/80 p-3'>
              <div className='min-w-0'>
                <div className='flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground'>
                  <span>OpenAI API Base URL</span>
                  <span className='rounded bg-blue-500/10 px-1.5 py-0.2 text-[10px] text-blue-600 dark:text-blue-400 font-mono'>
                    /v1
                  </span>
                </div>
                <p className='truncate font-mono text-xs font-semibold text-foreground mt-0.5 select-all'>
                  {openAiBaseUrl}
                </p>
              </div>
              <CopyButton
                value={openAiBaseUrl}
                variant='ghost'
                size='sm'
                className='h-8 shrink-0 px-2.5 text-xs'
                tooltip={t('Copy OpenAI Base URL')}
                successTooltip={t('Copied!')}
              >
                <span>{t('Copy')}</span>
              </CopyButton>
            </div>

            {/* Anthropic Compatible Endpoint */}
            <div className='flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-background/80 p-3'>
              <div className='min-w-0'>
                <div className='flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground'>
                  <span>Anthropic API Base URL</span>
                  <span className='rounded bg-purple-500/10 px-1.5 py-0.2 text-[10px] text-purple-600 dark:text-purple-400 font-mono'>
                    Root
                  </span>
                </div>
                <p className='truncate font-mono text-xs font-semibold text-foreground mt-0.5 select-all'>
                  {anthropicBaseUrl}
                </p>
              </div>
              <CopyButton
                value={anthropicBaseUrl}
                variant='ghost'
                size='sm'
                className='h-8 shrink-0 px-2.5 text-xs'
                tooltip={t('Copy Anthropic Base URL')}
                successTooltip={t('Copied!')}
              >
                <span>{t('Copy')}</span>
              </CopyButton>
            </div>
          </div>
        </div>

        {/* Client Cards Bento Grid */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {/* Card 1: ZCode 官方接入指南 (重点深度化) */}
          <div className='group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-xs transition-all duration-300 hover:border-blue-500/40 hover:shadow-md lg:col-span-2'>
            <div className='absolute -right-12 -top-12 size-40 rounded-full bg-blue-500/5 blur-3xl transition-opacity group-hover:opacity-100' />
            <div>
              {/* Header */}
              <div className='mb-4 flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <ZCodeLogo />
                  <div>
                    <div className='flex items-center gap-2'>
                      <h3 className='text-base font-bold text-foreground'>ZCode</h3>
                      <span className='rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400'>
                        {t('Official ADE Guide')}
                      </span>
                    </div>
                    <p className='text-muted-foreground text-xs'>
                      {t('Z.ai Agentic Development Environment')}
                    </p>
                  </div>
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  className='h-7 gap-1 px-2.5 text-xs'
                  render={
                    <a
                      href='https://zcode.z.ai'
                      target='_blank'
                      rel='noopener noreferrer'
                    />
                  }
                >
                  <span>{t('Official Site')}</span>
                  <ExternalLink className='size-3 opacity-60' />
                </Button>
              </div>

              <p className='text-muted-foreground text-xs leading-relaxed'>
                {t(
                  'ZCode supports seamless third-party custom providers. Follow the official four-step configuration below to integrate with our multi-model cluster:'
                )}
              </p>

              {/* 4 Steps Guide */}
              <div className='mt-4 grid gap-3 sm:grid-cols-2'>
                {/* Step 1 */}
                <div className='rounded-xl border border-border/40 bg-muted/20 p-3'>
                  <div className='flex items-center gap-2 text-xs font-semibold text-foreground'>
                    <span className='flex size-5 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[11px] font-bold'>
                      1
                    </span>
                    <span>{t('Open Settings Menu')}</span>
                  </div>
                  <p className='text-muted-foreground mt-1.5 text-[11px] leading-relaxed'>
                    {t(
                      'Click Settings ⚙️ at bottom-left, select Model Settings (or click Manage Models at the bottom of the model dropdown).'
                    )}
                  </p>
                </div>

                {/* Step 2 */}
                <div className='rounded-xl border border-border/40 bg-muted/20 p-3'>
                  <div className='flex items-center gap-2 text-xs font-semibold text-foreground'>
                    <span className='flex size-5 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[11px] font-bold'>
                      2
                    </span>
                    <span>{t('Add Custom Provider')}</span>
                  </div>
                  <p className='text-muted-foreground mt-1.5 text-[11px] leading-relaxed'>
                    {t(
                      'Click Add Provider on the top-right, then choose Create custom provider.'
                    )}
                  </p>
                </div>

                {/* Step 3 */}
                <div className='rounded-xl border border-border/40 bg-muted/20 p-3 sm:col-span-2'>
                  <div className='flex items-center gap-2 text-xs font-semibold text-foreground'>
                    <span className='flex size-5 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[11px] font-bold'>
                      3
                    </span>
                    <span>{t('Fill Provider Parameters')}</span>
                  </div>

                  <div className='mt-2.5 grid gap-2 sm:grid-cols-3 text-xs'>
                    <div className='rounded-lg border border-border/50 bg-background/60 p-2'>
                      <span className='text-[10px] text-muted-foreground'>{t('Provider Name')}</span>
                      <p className='font-mono font-medium text-foreground mt-0.5'>大黄API</p>
                    </div>
                    <div className='rounded-lg border border-border/50 bg-background/60 p-2'>
                      <span className='text-[10px] text-muted-foreground'>{t('Protocol')}</span>
                      <p className='font-mono font-medium text-foreground mt-0.5'>OpenAI (ChatCompletions)</p>
                    </div>
                    <div className='rounded-lg border border-border/50 bg-background/60 p-2'>
                      <span className='text-[10px] text-muted-foreground'>{t('API Key')}</span>
                      <p className='font-mono font-medium text-muted-foreground mt-0.5'>sk-your-token</p>
                    </div>
                  </div>

                  {/* Warning / Caveat Banner */}
                  <div className='mt-2.5 flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-2 text-[11px] text-amber-700 dark:text-amber-300'>
                    <AlertCircle className='size-3.5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400' />
                    <span>
                      {t(
                        'ZCode Caveat: If choosing OpenAI protocol, Base URL MUST include /v1. If choosing Anthropic protocol, do NOT append /v1.'
                      )}
                    </span>
                  </div>
                </div>

                {/* Step 4 */}
                <div className='rounded-xl border border-border/40 bg-muted/20 p-3 sm:col-span-2'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2 text-xs font-semibold text-foreground'>
                      <span className='flex size-5 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[11px] font-bold'>
                        4
                      </span>
                      <span>{t('Register Model & Test Connection')}</span>
                    </div>
                  </div>
                  <p className='text-muted-foreground mt-1.5 text-[11px] leading-relaxed'>
                    {t(
                      'Click Add Model and input IDs below, then click Test Model to verify:'
                    )}
                  </p>
                  <div className='mt-2 flex flex-wrap gap-1.5'>
                    {zcodeRecommendedModels.map((m) => (
                      <CopyButton
                        key={m}
                        value={m}
                        variant='outline'
                        size='sm'
                        className='h-7 gap-1 rounded-md px-2 text-[11px] font-mono'
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

            {/* Quick Action Footer */}
            <div className='mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-border/40'>
              <CopyButton
                value={openAiBaseUrl}
                variant='default'
                size='sm'
                className='h-9 gap-1.5 px-4 text-xs font-medium'
                tooltip={t('Copy Base URL for ZCode')}
                successTooltip={t('Copied!')}
              >
                <Code2 className='size-3.5' />
                <span>{t('Copy ZCode Base URL')}</span>
              </CopyButton>

              <CopyButton
                value={anthropicBaseUrl}
                variant='outline'
                size='sm'
                className='h-9 gap-1.5 px-3.5 text-xs font-medium'
                tooltip={t('Copy Anthropic URL (without /v1)')}
                successTooltip={t('Copied!')}
              >
                <span>{t('Copy Anthropic Base URL')}</span>
              </CopyButton>
            </div>
          </div>

          {/* Card 2: Cherry Studio */}
          <div className='group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-xs transition-all duration-300 hover:border-red-500/40 hover:shadow-md'>
            <div className='absolute -right-8 -top-8 size-32 rounded-full bg-red-500/5 blur-2xl transition-opacity group-hover:opacity-100' />
            <div>
              <div className='mb-4 flex items-center justify-between'>
                <div className='flex size-10 items-center justify-center rounded-xl border border-border/60 bg-muted/30 shadow-xs'>
                  <CherryStudio.Color size={26} />
                </div>
                <span className='rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-red-600 dark:text-red-400'>
                  {t('Desktop All-in-One')}
                </span>
              </div>
              <h3 className='text-base font-bold text-foreground'>
                Cherry Studio
              </h3>
              <p className='text-muted-foreground mt-1.5 text-xs leading-relaxed'>
                {t(
                  'Multi-model side-by-side chats, knowledge base RAG, and deep thinking visual exploration.'
                )}
              </p>

              <div className='mt-5 space-y-2.5 rounded-xl border border-border/50 bg-muted/40 p-3'>
                <div className='flex items-center justify-between text-[11px] text-muted-foreground'>
                  <span>{t('Provider Type')}</span>
                  <span className='font-mono font-medium text-foreground'>
                    OpenAI Compatible
                  </span>
                </div>
                <div className='flex items-center justify-between text-[11px] text-muted-foreground'>
                  <span>{t('API Base URL')}</span>
                  <span className='truncate font-mono font-medium text-foreground max-w-[130px]'>
                    {openAiBaseUrl}
                  </span>
                </div>
                <div className='flex items-center justify-between text-[11px] text-muted-foreground'>
                  <span>{t('One-Click Import')}</span>
                  <span className='inline-flex items-center gap-1 font-mono font-medium text-emerald-600 dark:text-emerald-400'>
                    <CheckCircle2 className='size-3' />
                    {t('Deep Link Ready')}
                  </span>
                </div>
              </div>
            </div>

            <div className='mt-6 flex flex-col gap-2'>
              <Button
                variant='outline'
                size='sm'
                className='w-full justify-center gap-1.5 text-xs border-red-500/20 hover:border-red-500/40 hover:bg-red-500/5 text-red-600 dark:text-red-400'
                render={
                  <a
                    href={cherryDeepLink}
                    target='_blank'
                    rel='noopener noreferrer'
                  />
                }
              >
                <span>{t('One-Click Import to Cherry Studio')}</span>
                <ExternalLink className='size-3' />
              </Button>

              <div className='flex items-center gap-2'>
                <CopyButton
                  value={openAiBaseUrl}
                  variant='ghost'
                  size='sm'
                  className='flex-1 justify-center gap-1.5 text-xs'
                  tooltip={t('Copy OpenAI Base URL')}
                  successTooltip={t('Copied!')}
                >
                  <span>{t('Copy Base URL')}</span>
                </CopyButton>

                <Button
                  variant='ghost'
                  size='sm'
                  className='shrink-0 gap-1 px-3 text-xs'
                  render={
                    <a
                      href='https://cherry-ai.com'
                      target='_blank'
                      rel='noopener noreferrer'
                    />
                  }
                >
                  <span>{t('Download')}</span>
                  <ExternalLink className='size-3' />
                </Button>
              </div>
            </div>
          </div>

          {/* Card 3: Universal Clients & cURL */}
          <div className='group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-xs transition-all duration-300 hover:border-violet-500/40 hover:shadow-md md:col-span-2 lg:col-span-3'>
            <div className='absolute -right-8 -top-8 size-32 rounded-full bg-violet-500/5 blur-2xl transition-opacity group-hover:opacity-100' />
            <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
              <div>
                <div className='flex items-center gap-2.5'>
                  <div className='flex size-8 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400'>
                    <Layers className='size-4' />
                  </div>
                  <h3 className='text-sm font-bold text-foreground'>
                    {t('Universal Clients & Standard Code Calling')}
                  </h3>
                  <span className='rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold text-violet-600 dark:text-violet-400'>
                    {t('Cursor / Claude Code / Python / Node.js')}
                  </span>
                </div>
                <p className='text-muted-foreground mt-1.5 text-xs leading-relaxed max-w-2xl'>
                  {t(
                    'Compatible with any OpenAI/Anthropic SDK or CLI tool. Export OPENAI_BASE_URL and start coding immediately.'
                  )}
                </p>
              </div>

              <div className='flex shrink-0 items-center gap-2'>
                <CopyButton
                  value={curlExample}
                  variant='outline'
                  size='sm'
                  className='h-8 gap-1.5 text-xs font-medium'
                  tooltip={t('Copy cURL example')}
                  successTooltip={t('Copied!')}
                >
                  <Terminal className='size-3.5' />
                  <span>{t('Copy cURL Example')}</span>
                </CopyButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
