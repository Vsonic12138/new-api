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
  Code2,
  ExternalLink,
  KeyRound,
  Layers,
  Sparkles,
  Terminal,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { CopyButton } from '@/components/copy-button'
import { Button } from '@/components/ui/button'
import { useStatus } from '@/hooks/use-status'

// Stylized modern brand badge for ZCode
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
  const [baseUrl, setBaseUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const configuredAddress = status?.server_address as string | undefined
      if (configuredAddress && configuredAddress.startsWith('http')) {
        const clean = configuredAddress.replace(/\/+$/, '')
        setBaseUrl(clean.endsWith('/v1') ? clean : `${clean}/v1`)
      } else {
        const origin = window.location.origin.replace(/\/+$/, '')
        setBaseUrl(`${origin}/v1`)
      }
    }
  }, [status?.server_address])

  const zcodeSnippet = JSON.stringify(
    {
      provider: 'NewAPI',
      baseUrl: baseUrl || 'https://your-api-domain.com/v1',
      apiKey: 'sk-your-api-token',
    },
    null,
    2
  )

  const cherrySnippet = JSON.stringify(
    {
      name: status?.system_name || 'NewAPI Gateway',
      apiHost: baseUrl || 'https://your-api-domain.com/v1',
      apiKey: 'sk-your-api-token',
      models: ['deepseek-reasoner', 'deepseek-chat', 'claude-3-7-sonnet', 'gpt-4o'],
    },
    null,
    2
  )

  return (
    <section className='relative z-10 px-6 py-12 md:py-16'>
      <div className='mx-auto max-w-6xl'>
        {/* Section Header */}
        <div className='mb-8 flex flex-col items-center text-center'>
          <div className='mb-3 inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1 text-[11px] font-medium text-blue-600 dark:border-blue-400/20 dark:bg-blue-400/5 dark:text-blue-400'>
            <Sparkles className='size-3' />
            <span>{t('Instant Integration')}</span>
          </div>
          <h2 className='text-2xl font-bold tracking-tight md:text-3xl'>
            {t('Connect with Your Favorite AI Apps')}
          </h2>
          <p className='text-muted-foreground mt-2 max-w-xl text-sm leading-relaxed'>
            {t(
              'Fully compatible with OpenAI and Claude protocols. One click to configure into popular developer and desktop tools.'
            )}
          </p>
        </div>

        {/* Global Base URL Bar */}
        <div className='mb-8 overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-r from-muted/30 via-background to-muted/30 p-4 shadow-xs backdrop-blur-xs sm:p-5'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-center gap-3'>
              <div className='flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary'>
                <Terminal className='size-5' />
              </div>
              <div className='min-w-0'>
                <div className='flex items-center gap-2'>
                  <span className='text-xs font-semibold text-foreground'>
                    {t('API Base Endpoint')}
                  </span>
                  <span className='inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400'>
                    <span className='size-1.5 rounded-full bg-emerald-500 animate-pulse' />
                    {t('Ready')}
                  </span>
                </div>
                <p className='mt-0.5 truncate font-mono text-xs text-muted-foreground select-all sm:text-sm'>
                  {baseUrl || 'https://.../v1'}
                </p>
              </div>
            </div>

            <div className='flex shrink-0 items-center gap-2'>
              <CopyButton
                value={baseUrl}
                variant='outline'
                size='sm'
                className='h-9 gap-1.5 px-3.5 text-xs font-medium'
                tooltip={t('Copy Base URL')}
                successTooltip={t('Copied Base URL')}
              >
                <span>{t('Copy URL')}</span>
              </CopyButton>

              <Button
                variant='secondary'
                size='sm'
                className='h-9 gap-1.5 px-3.5 text-xs font-medium'
                render={<Link to='/tokens' />}
              >
                <KeyRound className='size-3.5' />
                <span>{t('Get API Key')}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Client Cards Bento Grid */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {/* Card 1: ZCode */}
          <div className='group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-xs transition-all duration-300 hover:border-blue-500/40 hover:shadow-md'>
            <div className='absolute -right-8 -top-8 size-32 rounded-full bg-blue-500/5 blur-2xl transition-opacity group-hover:opacity-100' />
            <div>
              <div className='mb-4 flex items-center justify-between'>
                <ZCodeLogo />
                <span className='rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400'>
                  {t('Coding & Agent')}
                </span>
              </div>
              <h3 className='text-base font-bold text-foreground'>ZCode</h3>
              <p className='text-muted-foreground mt-1.5 text-xs leading-relaxed'>
                {t(
                  'Immersive AI-driven coding assistant. Built for fast completion, deep refactoring, and agentic development workflows.'
                )}
              </p>

              <div className='mt-5 space-y-2 rounded-xl border border-border/50 bg-muted/40 p-3'>
                <div className='flex items-center justify-between text-[11px] text-muted-foreground'>
                  <span>{t('Protocol')}</span>
                  <span className='font-mono font-medium text-foreground'>
                    OpenAI / Claude
                  </span>
                </div>
                <div className='flex items-center justify-between text-[11px] text-muted-foreground'>
                  <span>{t('Base URL')}</span>
                  <span className='truncate font-mono font-medium text-foreground max-w-[150px]'>
                    {baseUrl || '/v1'}
                  </span>
                </div>
              </div>
            </div>

            <div className='mt-6 flex items-center gap-2'>
              <CopyButton
                value={zcodeSnippet}
                variant='outline'
                size='sm'
                className='w-full justify-center gap-1.5 text-xs'
                tooltip={t('Copy JSON configuration')}
                successTooltip={t('Copied!')}
              >
                <Code2 className='size-3.5' />
                <span>{t('Copy Config')}</span>
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
                  'Powerful desktop client with multi-model side-by-side chats, knowledge bases, and multi-protocol flexibility.'
                )}
              </p>

              <div className='mt-5 space-y-2 rounded-xl border border-border/50 bg-muted/40 p-3'>
                <div className='flex items-center justify-between text-[11px] text-muted-foreground'>
                  <span>{t('Provider Type')}</span>
                  <span className='font-mono font-medium text-foreground'>
                    OpenAI Compatible
                  </span>
                </div>
                <div className='flex items-center justify-between text-[11px] text-muted-foreground'>
                  <span>{t('Multi-Model')}</span>
                  <span className='font-mono font-medium text-emerald-600 dark:text-emerald-400'>
                    {t('Supported')}
                  </span>
                </div>
              </div>
            </div>

            <div className='mt-6 flex items-center gap-2'>
              <CopyButton
                value={cherrySnippet}
                variant='outline'
                size='sm'
                className='flex-1 justify-center gap-1.5 text-xs'
                tooltip={t('Copy Cherry Studio Provider Info')}
                successTooltip={t('Copied!')}
              >
                <span>{t('Copy Config')}</span>
              </CopyButton>

              <Button
                variant='outline'
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

          {/* Card 3: Any OpenAI Compatible Client */}
          <div className='group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-xs transition-all duration-300 hover:border-violet-500/40 hover:shadow-md md:col-span-2 lg:col-span-1'>
            <div className='absolute -right-8 -top-8 size-32 rounded-full bg-violet-500/5 blur-2xl transition-opacity group-hover:opacity-100' />
            <div>
              <div className='mb-4 flex items-center justify-between'>
                <div className='flex size-10 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400'>
                  <Layers className='size-5' />
                </div>
                <span className='rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-violet-600 dark:text-violet-400'>
                  {t('Universal')}
                </span>
              </div>
              <h3 className='text-base font-bold text-foreground'>
                {t('Universal Clients')}
              </h3>
              <p className='text-muted-foreground mt-1.5 text-xs leading-relaxed'>
                {t(
                  'Fully adapted to Chatbox, NextChat, Claude Code, Cursor, and any tool supporting standard API endpoints.'
                )}
              </p>

              <div className='mt-5 flex flex-wrap gap-1.5'>
                {['Cursor', 'Chatbox', 'NextChat', 'Claude Code', 'LobeChat'].map(
                  (tool) => (
                    <span
                      key={tool}
                      className='rounded-md border border-border/60 bg-muted/30 px-2 py-1 font-mono text-[10px] text-muted-foreground'
                    >
                      {tool}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className='mt-6 flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                className='w-full justify-center gap-1.5 text-xs'
                render={<Link to='/tokens' />}
              >
                <KeyRound className='size-3.5' />
                <span>{t('Manage API Keys')}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
