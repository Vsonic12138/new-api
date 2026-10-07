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
import { Claude, DeepSeek, OpenAI } from '@lobehub/icons'
import { Activity, CheckCircle2 } from 'lucide-react'
import { useState, useEffect, useRef, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { CopyButton } from '@/components/copy-button'
import { useStatus } from '@/hooks/use-status'
import { cn } from '@/lib/utils'

interface ModelWorkflowDemo {
  id: string
  name: string
  vendor: string
  context: string
  ratio: string
  protocol: 'OpenAI' | 'Claude'
  agentSource: string
  endpoint: string
  icon: (size?: number) => ReactNode
  tone: 'purple' | 'emerald' | 'cyan' | 'blue'
  prompt: string
  responseSummary: string
  codeSnippet: string
  codeLang: string
}

const CYCLE_INTERVAL = 9000
const TRANSITION_MS = 220

export function HeroTerminalDemo(props: { className?: string }) {
  const { t } = useTranslation()
  const { status } = useStatus()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const [viewMode, setViewMode] = useState<'preview' | 'endpoint'>('preview')
  const [transitioning, setTransitioning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const serverAddress =
    (typeof status?.server_address === 'string' &&
      status.server_address.replace(/\/+$/, '')) ||
    (typeof window !== 'undefined'
      ? window.location.origin
      : 'https://newapi.vsonic12138.shop')

  const demos: ModelWorkflowDemo[] = [
    {
      id: 'claude-sonnet-5',
      name: 'Claude Sonnet 5',
      vendor: 'Anthropic',
      context: '200K Context',
      ratio: '1.0x',
      protocol: 'Claude',
      agentSource: 'Claude Code',
      endpoint: '/v1/messages',
      icon: (s = 16) => <Claude.Color size={s} className='shrink-0' />,
      tone: 'purple',
      prompt: t('Refactor this high-concurrency worker pipeline with context timeout and graceful shutdown.'),
      responseSummary: t('Refactored for thread-safety using bounded task channels and context.WithTimeout:'),
      codeLang: 'go',
      codeSnippet: `func RunPipeline(ctx context.Context, workers int) error {
    ctx, cancel := context.WithTimeout(ctx, 30*time.Second)
    defer cancel()
    return workerpool.Serve(ctx, workers)
}`,
    },
    {
      id: 'gpt-6.1-sol',
      name: 'GPT-6.1 Sol',
      vendor: 'OpenAI',
      context: 'Sol High Compute',
      ratio: '1.0x',
      protocol: 'OpenAI',
      agentSource: 'Codex / Cherry',
      endpoint: '/v1/chat/completions',
      icon: (s = 16) => <OpenAI size={s} className='shrink-0' />,
      tone: 'emerald',
      prompt: t('Analyze multi-tenant cache invalidation strategies under sudden hotkey traffic spikes.'),
      responseSummary: t('Implemented two-tier defense with distributed mutex and stale-while-revalidate policy:'),
      codeLang: 'ts',
      codeSnippet: `interface CachePolicy<T> {
  staleTtlMs: number
  lockTimeoutMs: number
  revalidate: () => Promise<T>
}`,
    },
    {
      id: 'deepseek-flash',
      name: 'DeepSeek Flash',
      vendor: 'DeepSeek',
      context: 'V4.1 Flash',
      ratio: '1.27x',
      protocol: 'OpenAI',
      agentSource: 'DSH / ZCode',
      endpoint: '/v1/chat/completions',
      icon: (s = 16) => <DeepSeek.Color size={s} className='shrink-0' />,
      tone: 'cyan',
      prompt: t('Design a high-throughput JSON streaming parser pipeline with minimal GC overhead.'),
      responseSummary: t('Used pre-allocated ring buffer pool for zero-alloc chunk parsing:'),
      codeLang: 'go',
      codeSnippet: `var bufferPool = sync.Pool{
    New: func() any { return make([]byte, 64*1024) },
}`,
    },
    {
      id: 'claude-opus-5-5',
      name: 'Claude Opus 5.5',
      vendor: 'Anthropic',
      context: 'Extreme Reasoning',
      ratio: '2.0x',
      protocol: 'Claude',
      agentSource: 'Claude Code / Pi',
      endpoint: '/v1/messages',
      icon: (s = 16) => <Claude.Color size={s} className='shrink-0' />,
      tone: 'purple',
      prompt: t('Architect a cross-region consensus schedule targeting RPO=0 across three availability zones.'),
      responseSummary: t('Synchronous Raft barrier with lease-based cross-region election safety:'),
      codeLang: 'yaml',
      codeSnippet: `consensus:
  quorum: "2/3"
  cross_region_lease: enabled
  rpo_target: 0`,
    },
  ]

  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.05 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches || !isVisible) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      return
    }

    intervalRef.current = setInterval(() => {
      setTransitioning(true)
      timeoutRef.current = setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % demos.length)
        setTransitioning(false)
      }, TRANSITION_MS)
    }, CYCLE_INTERVAL)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [isVisible, demos.length])

  const handleSelect = (idx: number) => {
    if (idx === activeIndex) return
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setTransitioning(true)
    timeoutRef.current = setTimeout(() => {
      setActiveIndex(idx)
      setTransitioning(false)
    }, TRANSITION_MS)
  }

  const activeDemo = demos[activeIndex]
  const fullEndpointUrl =
    activeDemo.protocol === 'Claude'
      ? `${serverAddress}${activeDemo.endpoint}`
      : `${serverAddress}${activeDemo.endpoint}`

  const curlCurlCommand =
    activeDemo.protocol === 'Claude'
      ? `curl -X POST "${serverAddress}/v1/messages" \\
  -H "x-api-key: sk-••••" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "${activeDemo.id}", "max_tokens": 1024, "messages": [{"role": "user", "content": "Hello"}]}'`
      : `curl -X POST "${serverAddress}/v1/chat/completions" \\
  -H "Authorization: Bearer sk-••••" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "${activeDemo.id}", "messages": [{"role": "user", "content": "Hello"}]}'`

  return (
    <div
      ref={containerRef}
      className={cn(
        'border-border/70 bg-card/90 dark:bg-card/45 relative w-full max-w-xl overflow-hidden rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-300',
        props.className
      )}
    >
      {/* Window Header */}
      <div className='border-border/50 bg-muted/40 flex items-center justify-between border-b px-4 py-3'>
        <div className='flex items-center gap-2'>
          <div className='flex items-center gap-1.5'>
            <span className='size-2.5 rounded-full bg-rose-500/80 dark:bg-rose-500/70' />
            <span className='size-2.5 rounded-full bg-amber-500/80 dark:bg-amber-500/70' />
            <span className='size-2.5 rounded-full bg-emerald-500/80 dark:bg-emerald-500/70' />
          </div>
          <span className='text-muted-foreground ml-1.5 font-mono text-[11px] font-medium'>
            {t('Gateway Live Preview')}
          </span>
        </div>

        {/* Status Indicator */}
        <div className='flex items-center gap-2'>
          <div className='flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-400'>
            <span className='relative flex size-1.5'>
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75' />
              <span className='relative inline-flex size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400' />
            </span>
            <span>{t('200 OK · Ready')}</span>
          </div>

          {/* View Mode Toggle */}
          <div className='bg-muted/60 border-border/40 flex items-center rounded-lg border p-0.5 text-[10px]'>
            <button
              type='button'
              onClick={() => setViewMode('preview')}
              className={cn(
                'rounded px-1.5 py-0.5 font-medium transition-colors',
                viewMode === 'preview'
                  ? 'bg-background text-foreground shadow-2xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t('Preview')}
            </button>
            <button
              type='button'
              onClick={() => setViewMode('endpoint')}
              className={cn(
                'rounded px-1.5 py-0.5 font-medium transition-colors',
                viewMode === 'endpoint'
                  ? 'bg-background text-foreground shadow-2xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t('API Spec')}
            </button>
          </div>
        </div>
      </div>

      {/* Model Selection Tabs (Curated from 模型广场) */}
      <div className='border-border/40 bg-muted/20 flex flex-wrap items-center gap-1 border-b px-3 py-2'>
        {demos.map((d, idx) => {
          const isActive = idx === activeIndex
          return (
            <button
              key={d.id}
              type='button'
              onClick={() => handleSelect(idx)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-200',
                isActive
                  ? 'bg-background text-foreground border-border/60 border shadow-2xs'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent'
              )}
            >
              {d.icon(14)}
              <span>{d.name}</span>
            </button>
          )
        })}
      </div>

      {/* Card Content Area */}
      <div
        className={cn(
          'p-5 transition-opacity duration-200',
          transitioning ? 'opacity-30' : 'opacity-100'
        )}
      >
        {/* Model Meta Strip */}
        <div className='border-border/40 bg-muted/20 mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border p-2.5 text-xs'>
          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-1.5 rounded-lg border border-border/50 bg-background/80 px-2 py-0.5 text-[11px] font-mono'>
              <span className='text-muted-foreground/75'>{activeDemo.agentSource}</span>
              <span className='text-muted-foreground/40'>→</span>
              <span className='font-bold text-foreground select-all'>{activeDemo.id}</span>
            </div>
            <CopyButton
              value={activeDemo.id}
              variant='ghost'
              size='sm'
              className='size-6 p-0 text-muted-foreground hover:text-foreground'
              tooltip={t('Copy model ID')}
              successTooltip={t('Copied!')}
            />
          </div>

          <div className='flex items-center gap-2 text-[11px]'>
            <span className='border-border/50 bg-background/80 text-muted-foreground rounded border px-1.5 py-0.5 font-mono'>
              {activeDemo.context}
            </span>
            <span className='border-border/50 bg-background/80 text-muted-foreground rounded border px-1.5 py-0.5 font-mono'>
              {activeDemo.ratio}
            </span>
            <span className='rounded bg-primary/10 text-primary px-1.5 py-0.5 font-medium'>
              {activeDemo.protocol}
            </span>
          </div>
        </div>

        {/* View Mode: Interactive Preview */}
        {viewMode === 'preview' ? (
          <div className='space-y-3.5 text-xs'>
            {/* User Prompt */}
            <div className='rounded-xl border border-border/50 bg-muted/15 p-3'>
              <div className='text-muted-foreground/70 mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider'>
                <span className='size-1.5 rounded-full bg-primary/60' />
                <span>{t('Prompt')}</span>
              </div>
              <p className='text-foreground font-medium leading-relaxed'>
                {activeDemo.prompt}
              </p>
            </div>

            {/* AI Assistant Output */}
            <div className='rounded-xl border border-border/60 bg-background p-3.5 shadow-2xs'>
              <div className='mb-2 flex items-center justify-between text-[10px]'>
                <div className='flex items-center gap-1.5 font-semibold text-foreground'>
                  {activeDemo.icon(14)}
                  <span>{activeDemo.name}</span>
                </div>
                <span className='text-muted-foreground/60 font-mono'>
                  {activeDemo.codeLang.toUpperCase()}
                </span>
              </div>

              <p className='text-muted-foreground mb-2.5 text-xs leading-relaxed'>
                {activeDemo.responseSummary}
              </p>

              {/* Code Snippet */}
              <div className='relative rounded-lg border border-border/40 bg-muted/30 p-3 font-mono text-[11px] leading-relaxed text-foreground select-all'>
                <pre className='overflow-x-auto whitespace-pre'>
                  {activeDemo.codeSnippet}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          /* View Mode: API Spec */
          <div className='space-y-3 text-xs'>
            <div className='rounded-xl border border-border/50 bg-background p-3 space-y-2'>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground text-[11px] font-medium'>
                  {t('Endpoint URL')}
                </span>
                <CopyButton
                  value={fullEndpointUrl}
                  variant='ghost'
                  size='sm'
                  className='h-6 px-2 text-[11px]'
                  tooltip={t('Copy')}
                  successTooltip={t('Copied!')}
                >
                  <span>{t('Copy')}</span>
                </CopyButton>
              </div>
              <div className='bg-muted/40 rounded-lg p-2 font-mono text-[11px] text-foreground break-all select-all'>
                POST {fullEndpointUrl}
              </div>
            </div>

            <div className='rounded-xl border border-border/50 bg-background p-3 space-y-2'>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground text-[11px] font-medium'>
                  {t('cURL Sample')}
                </span>
                <CopyButton
                  value={curlCurlCommand}
                  variant='ghost'
                  size='sm'
                  className='h-6 px-2 text-[11px]'
                  tooltip={t('Copy')}
                  successTooltip={t('Copied!')}
                >
                  <span>{t('Copy')}</span>
                </CopyButton>
              </div>
              <div className='bg-muted/40 overflow-x-auto rounded-lg p-2.5 font-mono text-[11px] text-foreground select-all'>
                <pre className='whitespace-pre'>{curlCurlCommand}</pre>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Card Footer Technical Status Bar (Clean, Objective, Truthful) */}
      <div className='border-border/50 bg-muted/30 flex flex-wrap items-center justify-between gap-3 border-t px-4 py-2.5 text-[11px] text-muted-foreground'>
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-1.5'>
            <CheckCircle2 className='size-3 text-emerald-500' />
            <span>{t('Standard Dual Protocols')}</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <Activity className='size-3 text-blue-500' />
            <span>{t('SSE Streaming')}</span>
          </div>
        </div>

        <div className='flex items-center gap-1 font-mono text-[10px] text-muted-foreground/70'>
          <span>OpenAI & Anthropic Compatible</span>
        </div>
      </div>
    </div>
  )
}
