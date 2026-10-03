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
import { Claude, DeepSeek, Gemini, Grok, OpenAI, Qwen } from '@lobehub/icons'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight, Flame, Layers } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { CopyButton } from '@/components/copy-button'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ModelCategory = 'all' | 'claude' | 'gpt' | 'grok-gemini' | 'cn'

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
    { key: 'claude', label: t('Claude Series') },
    { key: 'gpt', label: t('GPT Series') },
    { key: 'grok-gemini', label: t('Grok & Gemini') },
    { key: 'cn', label: t('DeepSeek & CN') },
  ]

  const models: ModelItem[] = [
    {
      id: 'claude-sonnet-5',
      name: 'Claude Sonnet 5',
      vendor: 'Anthropic',
      context: '1.0x · 200K',
      tag: t('Coding & Deep Logic'),
      tagTone: 'purple',
      description: t(
        'Top-tier software engineering, long-context code refactoring, and dependable logic synthesis.'
      ),
      categories: ['claude'],
      icon: <Claude.Color size={22} className='shrink-0' />,
    },
    {
      id: 'gpt-6.1-sol',
      name: 'GPT-6.1 Sol',
      vendor: 'OpenAI',
      context: '1.0x · Sol High Compute',
      tag: t('Uncapped Intelligence Flagship'),
      tagTone: 'emerald',
      description: t(
        'Full-speed Sol flagship with unthrottled high intelligence, visual reasoning, and multi-turn stability.'
      ),
      categories: ['gpt'],
      icon: <OpenAI size={22} className='shrink-0' />,
    },
    {
      id: 'gpt-5.6-luna',
      name: 'GPT-5.6 Luna',
      vendor: 'OpenAI',
      context: '0.1x · Super Low Cost',
      tag: t('Ultra Cost-Effective Driver'),
      tagTone: 'amber',
      description: t(
        'High-speed cost-effective group for daily chats, text summarization, and high-frequency code completions.'
      ),
      categories: ['gpt'],
      icon: <OpenAI size={22} className='shrink-0' />,
    },
    {
      id: 'grok-4.7',
      name: 'Grok 4.7',
      vendor: 'xAI',
      context: '1.0x · Latest Gen',
      tag: t('Real-time Agile Reasoning'),
      tagTone: 'blue',
      description: t(
        'Quick-witted open thinking, real-time exploration, and complex mathematical logic breakdown.'
      ),
      categories: ['grok-gemini'],
      icon: <Grok size={22} className='shrink-0' />,
    },
    {
      id: 'deepseek-v4-flash',
      name: 'DeepSeek V4 Flash',
      vendor: 'DeepSeek',
      context: '1.27x · CoT Flash',
      tag: t('Open Weights Wonder'),
      tagTone: 'cyan',
      description: t(
        'Next-gen reasoning speed with transparent Chain-of-Thought, delivering deep thinking at great value.'
      ),
      categories: ['cn'],
      icon: <DeepSeek.Color size={22} className='shrink-0' />,
    },
    {
      id: 'claude-opus-5-5',
      name: 'Claude Opus 5.5',
      vendor: 'Anthropic',
      context: '2.0x · Extreme Reasoning',
      tag: t('Highest Complexity Benchmark'),
      tagTone: 'purple',
      description: t(
        'Deep architectural design, nuanced research analysis, and solving mission-critical edge cases.'
      ),
      categories: ['claude'],
      icon: <Claude.Color size={22} className='shrink-0' />,
    },
    {
      id: 'gemini-3.7-flash',
      name: 'Gemini 3.7 Flash',
      vendor: 'Google',
      context: 'Million Token · Sub-second',
      tag: t('Massive Multi-modal Context'),
      tagTone: 'cyan',
      description: t(
        'Sub-second responses across colossal 1,000,000+ token context windows for full-repo and document intake.'
      ),
      categories: ['grok-gemini'],
      icon: <Gemini.Color size={22} className='shrink-0' />,
    },
    {
      id: 'glm-5.3-flash',
      name: 'GLM 5.3 Flash',
      vendor: 'Zhipu AI',
      context: 'Lightning Fast · CN Eco',
      tag: t('Domestic Ecosystem Choice'),
      tagTone: 'blue',
      description: t(
        'Native Chinese cultural understanding, rapid tool invocation, and seamless local developer workflows.'
      ),
      categories: ['cn'],
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
