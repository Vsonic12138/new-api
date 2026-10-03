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
import { Claude, DeepSeek, Gemini, OpenAI, Qwen } from '@lobehub/icons'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight, Flame, Layers } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { CopyButton } from '@/components/copy-button'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ModelCategory = 'all' | 'reasoning' | 'coding' | 'multimodal' | 'efficient'

interface ModelItem {
  id: string
  name: string
  vendor: string
  context: string
  tag: string
  tagTone: 'blue' | 'purple' | 'emerald' | 'amber' | 'cyan'
  description: string
  categories: ModelCategory[]
  icon: ReactNode
}

export function FeaturedModelsWall() {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState<ModelCategory>('all')

  const categories: { key: ModelCategory; label: string }[] = [
    { key: 'all', label: t('All Models') },
    { key: 'reasoning', label: t('Reasoning') },
    { key: 'coding', label: t('Coding') },
    { key: 'multimodal', label: t('Multimodal') },
    { key: 'efficient', label: t('High Efficiency') },
  ]

  const models: ModelItem[] = [
    {
      id: 'deepseek-reasoner',
      name: 'DeepSeek-R1',
      vendor: 'DeepSeek',
      context: '128K',
      tag: t('Chain-of-Thought Reasoning'),
      tagTone: 'blue',
      description: t(
        'Top-tier open-weight reasoning model with transparent thinking process and exceptional math/code capability.'
      ),
      categories: ['reasoning', 'coding'],
      icon: <DeepSeek.Color size={22} className='shrink-0' />,
    },
    {
      id: 'claude-3-7-sonnet',
      name: 'Claude 3.7 Sonnet',
      vendor: 'Anthropic',
      context: '200K',
      tag: t('Hybrid Reasoning & Coding'),
      tagTone: 'purple',
      description: t(
        'Flagship model with adjustable thinking depth, leading industry benchmarks in software engineering.'
      ),
      categories: ['reasoning', 'coding'],
      icon: <Claude.Color size={22} className='shrink-0' />,
    },
    {
      id: 'gpt-4o',
      name: 'GPT-4o',
      vendor: 'OpenAI',
      context: '128K',
      tag: t('Omni Multimodal Flagship'),
      tagTone: 'emerald',
      description: t(
        'High-speed, highly reliable flagship model supporting text, visual reasoning, and diverse developer tasks.'
      ),
      categories: ['coding', 'multimodal'],
      icon: <OpenAI size={22} className='shrink-0' />,
    },
    {
      id: 'deepseek-chat',
      name: 'DeepSeek-V3',
      vendor: 'DeepSeek',
      context: '128K',
      tag: t('MoE Daily Driver'),
      tagTone: 'blue',
      description: t(
        'Ultra-fast MoE architecture designed for versatile conversation, text generation, and everyday productivity.'
      ),
      categories: ['efficient', 'coding'],
      icon: <DeepSeek.Color size={22} className='shrink-0' />,
    },
    {
      id: 'gemini-2.5-flash',
      name: 'Gemini 2.5 Flash',
      vendor: 'Google',
      context: '1M',
      tag: t('Million Token Context'),
      tagTone: 'cyan',
      description: t(
        'Sub-second latency with enormous 1,000,000 token context window for massive documents and video analysis.'
      ),
      categories: ['multimodal', 'efficient'],
      icon: <Gemini.Color size={22} className='shrink-0' />,
    },
    {
      id: 'claude-3-5-sonnet',
      name: 'Claude 3.5 Sonnet',
      vendor: 'Anthropic',
      context: '200K',
      tag: t('Proven Developer Favorite'),
      tagTone: 'purple',
      description: t(
        'Praised by engineers worldwide for precise instruction following, architecture design, and complex problem solving.'
      ),
      categories: ['coding'],
      icon: <Claude.Color size={22} className='shrink-0' />,
    },
    {
      id: 'o3-mini',
      name: 'o3-mini',
      vendor: 'OpenAI',
      context: '200K',
      tag: t('STEM & Math Specialist'),
      tagTone: 'amber',
      description: t(
        'Cost-effective reasoning powerhouse built for competitive coding, STEM inquiries, and structured generation.'
      ),
      categories: ['reasoning', 'coding'],
      icon: <OpenAI size={22} className='shrink-0' />,
    },
    {
      id: 'qwen-2.5-coder-32b',
      name: 'Qwen 2.5 Coder 32B',
      vendor: 'Qwen',
      context: '128K',
      tag: t('Open Source Coding Leader'),
      tagTone: 'cyan',
      description: t(
        'Fine-tuned for programming across 90+ languages, competitive with proprietary models at a fraction of the cost.'
      ),
      categories: ['coding', 'efficient'],
      icon: <Qwen.Color size={22} className='shrink-0' />,
    },
  ]

  const filteredModels =
    activeCategory === 'all'
      ? models
      : models.filter((m) => m.categories.includes(activeCategory))

  const toneBadgeClasses: Record<string, string> = {
    blue: 'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400',
    purple:
      'border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400',
    emerald:
      'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    amber:
      'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400',
    cyan: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
  }

  return (
    <section className='relative z-10 px-6 py-12 md:py-16'>
      <div className='mx-auto max-w-6xl'>
        {/* Section Header */}
        <div className='flex flex-col items-center justify-between gap-4 md:flex-row md:items-end'>
          <div>
            <div className='mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1 text-[11px] font-medium text-amber-600 dark:border-amber-400/20 dark:bg-amber-400/5 dark:text-amber-400'>
              <Flame className='size-3' />
              <span>{t('Curated AI Models')}</span>
            </div>
            <h2 className='text-2xl font-bold tracking-tight md:text-3xl'>
              {t('One Gateway for All Flagships')}
            </h2>
            <p className='text-muted-foreground mt-1.5 max-w-xl text-sm leading-relaxed'>
              {t(
                'Curated flagship, reasoning, and high-efficiency models ready for instant deployment.'
              )}
            </p>
          </div>

          <Button
            variant='outline'
            size='sm'
            className='h-9 gap-1.5 self-start text-xs font-medium md:self-auto'
            render={<Link to='/pricing' />}
          >
            <span>{t('View All Models & Rates')}</span>
            <ArrowUpRight className='size-3.5' />
          </Button>
        </div>

        {/* Categories Tab Filter */}
        <div className='mt-8 flex flex-wrap items-center gap-2 border-b border-border/50 pb-4'>
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key
            return (
              <button
                key={cat.key}
                type='button'
                onClick={() => setActiveCategory(cat.key)}
                className={cn(
                  'rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-200',
                  isActive
                    ? 'bg-foreground text-background shadow-xs'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                )}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Models Grid */}
        <div className='mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {filteredModels.map((model) => (
            <div
              key={model.id}
              className='group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-300 hover:border-foreground/20 hover:shadow-md'
            >
              <div>
                {/* Header with Icon and Context Window Badge */}
                <div className='flex items-center justify-between'>
                  <div className='flex size-9 items-center justify-center rounded-xl border border-border/60 bg-muted/20'>
                    {model.icon}
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <span className='rounded-md border border-border/50 bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground'>
                      {model.context}
                    </span>
                  </div>
                </div>

                {/* Model Title */}
                <div className='mt-3.5'>
                  <div className='flex items-baseline justify-between'>
                    <h3 className='text-sm font-bold tracking-tight text-foreground'>
                      {model.name}
                    </h3>
                    <span className='text-[10px] font-medium text-muted-foreground/70'>
                      {model.vendor}
                    </span>
                  </div>

                  <span
                    className={cn(
                      'mt-1.5 inline-block rounded-md border px-1.5 py-0.5 text-[10px] font-medium',
                      toneBadgeClasses[model.tagTone] || toneBadgeClasses.blue
                    )}
                  >
                    {model.tag}
                  </span>

                  <p className='text-muted-foreground mt-2 line-clamp-2 text-xs leading-relaxed'>
                    {model.description}
                  </p>
                </div>
              </div>

              {/* Model ID Snippet & Copy Action */}
              <div className='mt-4 flex items-center justify-between rounded-xl border border-border/50 bg-muted/30 px-2.5 py-1.5'>
                <div className='flex items-center gap-1.5 min-w-0'>
                  <Layers className='size-3 text-muted-foreground/70 shrink-0' />
                  <span className='truncate font-mono text-[11px] font-medium text-foreground select-all'>
                    {model.id}
                  </span>
                </div>

                <CopyButton
                  value={model.id}
                  variant='ghost'
                  size='icon'
                  className='size-7 text-muted-foreground hover:text-foreground'
                  tooltip={t('Copy model ID')}
                  successTooltip={t('Copied!')}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
