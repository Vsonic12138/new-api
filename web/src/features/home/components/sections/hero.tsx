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
  ArrowRight,
  BookOpen,
  ExternalLink,
  ShoppingBag,
  Terminal,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { useStatus } from '@/hooks/use-status'

import { HeroTerminalDemo } from '../hero-terminal-demo'

interface HeroProps {
  className?: string
  isAuthenticated?: boolean
}

export function Hero(props: HeroProps) {
  const { t } = useTranslation()
  const { status } = useStatus()
  const topupLink = (status?.topup_link as string | undefined) || ''

  const scrollToClient = (clientKey: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('select-client-guide', { detail: clientKey })
      )
      const el = document.getElementById('client-guide')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  const renderCardShopButton = () => {
    if (!topupLink) return null
    return (
      <Button
        variant='outline'
        className='group relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-lg border-amber-500/50 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 px-4.5 text-sm font-semibold text-amber-700 shadow-xs transition-all duration-200 hover:border-amber-500/80 hover:bg-amber-500/25 hover:shadow-amber-500/20 hover:scale-[1.02] dark:border-amber-400/50 dark:bg-gradient-to-r dark:from-amber-400/15 dark:via-orange-400/10 dark:to-amber-400/15 dark:text-amber-300 dark:hover:border-amber-400/80'
        render={
          <a href={topupLink} target='_blank' rel='noopener noreferrer' />
        }
      >
        <ShoppingBag className='size-4 text-amber-600 transition-transform duration-200 group-hover:scale-110 dark:text-amber-400' />
        <span>{t('Buy Credits / Codes')}</span>
        <span className='rounded-full border border-amber-500/30 bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/20 dark:text-amber-300'>
          {t('24H Auto Delivery')}
        </span>
        <ExternalLink className='size-3.5 opacity-60 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
      </Button>
    )
  }

  const renderClientGuideButton = () => (
    <Button
      variant='outline'
      className='group border-border/50 hover:border-border hover:bg-muted/50 inline-flex h-11 items-center gap-1.5 rounded-lg px-5 text-sm font-medium'
      render={<a href='#client-guide' />}
    >
      <BookOpen className='text-muted-foreground/80 group-hover:text-foreground size-4 transition-colors duration-200' />
      <span>{t('Client Setup')}</span>
    </Button>
  )

  return (
    <section className='relative z-10 overflow-hidden px-6 pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-36 lg:pb-28'>
      {/* Radial gradient background */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 -z-10 opacity-25 dark:opacity-[0.12]'
        style={{
          background: [
            'radial-gradient(ellipse 60% 50% at 20% 20%, oklch(0.72 0.18 250 / 80%) 0%, transparent 70%)',
            'radial-gradient(ellipse 50% 40% at 80% 15%, oklch(0.65 0.15 200 / 60%) 0%, transparent 70%)',
            'radial-gradient(ellipse 40% 35% at 40% 80%, oklch(0.70 0.12 280 / 40%) 0%, transparent 70%)',
          ].join(', '),
        }}
      />
      {/* Grid pattern */}
      <div
        aria-hidden
        className='absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,black_20%,transparent_100%)] bg-[size:4rem_4rem] opacity-[0.08]'
      />

      <div className='mx-auto grid max-w-7xl grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-8 2xl:max-w-[1440px]'>
        {/* Left Column: Title, description, action buttons and application support */}
        <div className='flex flex-col items-start text-left lg:col-span-6'>
          {/* Top Pill Badge: Clean Technical Status */}
          <div
            className='landing-animate-fade-up mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-medium text-foreground/90 opacity-0 shadow-xs dark:border-primary/30 dark:bg-primary/10'
            style={{ animationDelay: '0ms' }}
          >
            <span className='relative flex size-2'>
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75' />
              <span className='relative inline-flex size-2 rounded-full bg-emerald-500' />
            </span>
            <span>{t('Gateway Service Online')}</span>
            <span className='text-muted-foreground/30'>|</span>
            <span className='text-muted-foreground text-[11px]'>
              {t('Standard Dual Protocol Access')}
            </span>
          </div>

          <h1
            className='landing-animate-fade-up text-[clamp(2.25rem,4.5vw,3.25rem)] leading-[1.15] font-bold tracking-tight'
            style={{ animationDelay: '60ms' }}
          >
            <span>
              {status?.system_name || t('DaHuang API · Big Dog Bark')}
            </span>
            <br />
            <span className='bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent dark:from-amber-400 dark:via-orange-400 dark:to-yellow-400'>
              {t('A Dependable & Friendly AI Gateway')}
            </span>
          </h1>
          <p
            className='landing-animate-fade-up text-muted-foreground/85 mt-5 max-w-xl text-base leading-relaxed opacity-0 md:text-[15px]'
            style={{ animationDelay: '120ms' }}
          >
            {t(
              'A friendly, dependable AI gateway. Access mainstream flagship models through unified OpenAI and Claude protocols—ready right out of the box.'
            )}
          </p>

          <div
            className='landing-animate-fade-up mt-8 flex flex-wrap items-center gap-3 opacity-0'
            style={{ animationDelay: '180ms' }}
          >
            {props.isAuthenticated ? (
              <>
                <Button
                  className='group h-11 rounded-lg px-5 text-sm font-medium shadow-xs'
                  render={<Link to='/dashboard' />}
                >
                  {t('Go to Dashboard')}
                  <ArrowRight className='ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
                </Button>
                {renderCardShopButton()}
                {renderClientGuideButton()}
              </>
            ) : (
              <>
                <Button
                  className='group h-11 rounded-lg px-5 text-sm font-medium shadow-xs'
                  render={<Link to='/sign-up' />}
                >
                  {t('Get Started')}
                  <ArrowRight className='ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
                </Button>
                {renderCardShopButton()}
                <Button
                  variant='outline'
                  className='border-border/50 hover:border-border hover:bg-muted/50 h-11 rounded-lg px-5 text-sm font-medium'
                  render={<Link to='/pricing' />}
                >
                  {t('View Pricing')}
                </Button>
                {renderClientGuideButton()}
              </>
            )}
          </div>

          {/* Supported Apps (Categorized) */}
          <div
            className='landing-animate-fade-up mt-10 w-full max-w-xl space-y-5 opacity-0'
            style={{ animationDelay: '240ms' }}
          >
            {/* Category 1: CLI Gateways & Switchers */}
            <div>
              <div className='mb-2.5 flex items-center justify-between'>
                <span className='text-muted-foreground/75 text-[11px] font-bold tracking-[0.1em] uppercase'>
                  {t('CLI Gateways & Switchers')}
                </span>
                <span className='text-muted-foreground/50 text-[10px] hidden sm:inline'>
                  {t('Local proxies for Claude Code, Codex, OpenCode')}
                </span>
              </div>
              <div className='flex flex-wrap items-center gap-2.5'>
                {/* CC Switch */}
                <button
                  type='button'
                  onClick={() => scrollToClient('ccswitch')}
                  className='group border-border/50 bg-muted/20 hover:border-border hover:bg-muted/40 text-foreground/85 hover:text-foreground flex items-center gap-2.5 rounded-xl border px-3.5 py-2 text-xs font-medium shadow-2xs backdrop-blur-xs transition-all duration-200 hover:scale-[1.02]'
                >
                  <img
                    src='/icons/ccswitch.png'
                    alt='CC Switch'
                    className='size-5 shrink-0 rounded-md object-contain'
                  />
                  <span>CC Switch</span>
                  <span className='text-muted-foreground/50 text-[10px] hidden sm:inline'>
                    {t('Multi-provider')}
                  </span>
                </button>

                {/* magpie */}
                <button
                  type='button'
                  onClick={() => scrollToClient('magpie')}
                  className='group border-border/50 bg-muted/20 hover:border-border hover:bg-muted/40 text-foreground/85 hover:text-foreground flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium shadow-2xs backdrop-blur-xs transition-all duration-200 hover:scale-[1.02]'
                >
                  <img
                    src='/icons/magpie.svg'
                    alt='magpie'
                    className='size-4.5 shrink-0 object-contain'
                  />
                  <span>magpie</span>
                  <span className='text-muted-foreground/50 text-[10px] hidden sm:inline'>
                    {t('Local Gateway')}
                  </span>
                </button>
              </div>
            </div>

            {/* Category 2: Desktop GUI & Harnesses */}
            <div>
              <div className='mb-2.5 flex items-center justify-between'>
                <span className='text-muted-foreground/75 text-[11px] font-bold tracking-[0.1em] uppercase'>
                  {t('Desktop Apps & Harnesses')}
                </span>
                <span className='text-muted-foreground/50 text-[10px] hidden sm:inline'>
                  {t('GUI clients, agent harness & IDE helpers')}
                </span>
              </div>
              <div className='flex flex-wrap items-center gap-2.5'>
                {/* Cherry Studio */}
                <button
                  type='button'
                  onClick={() => scrollToClient('cherry')}
                  className='group border-border/50 bg-muted/20 hover:border-border hover:bg-muted/40 text-foreground/85 hover:text-foreground flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium shadow-2xs backdrop-blur-xs transition-all duration-200 hover:scale-[1.02]'
                >
                  <CherryStudio.Color size={18} className='shrink-0' />
                  <span>Cherry Studio</span>
                </button>

                {/* DSH */}
                <button
                  type='button'
                  onClick={() => scrollToClient('dsh')}
                  className='group border-border/50 bg-muted/20 hover:border-border hover:bg-muted/40 text-foreground/85 hover:text-foreground flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium shadow-2xs backdrop-blur-xs transition-all duration-200 hover:scale-[1.02]'
                >
                  <DeepSeek.Color size={18} className='shrink-0' />
                  <span>DSH (DeepSeek Harness)</span>
                </button>

                {/* ZCode */}
                <button
                  type='button'
                  onClick={() => scrollToClient('zcode')}
                  className='group border-border/50 bg-muted/20 hover:border-border hover:bg-muted/40 text-foreground/85 hover:text-foreground flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium shadow-2xs backdrop-blur-xs transition-all duration-200 hover:scale-[1.02]'
                >
                  <img
                    src='/icons/zcode-192.png'
                    alt='ZCode'
                    className='size-4.5 shrink-0 rounded-md object-contain'
                  />
                  <span>ZCode</span>
                </button>

                {/* Cursor / Code */}
                <button
                  type='button'
                  onClick={() => scrollToClient('code')}
                  className='group border-border/50 bg-muted/15 hover:border-border hover:bg-muted/30 text-muted-foreground hover:text-foreground flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-all duration-200'
                >
                  <Terminal className='size-3.5' />
                  <span>{t('Cursor / Code / API')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Live Gateway Preview */}
        <div
          className='landing-animate-fade-up flex w-full justify-center opacity-0 lg:col-span-6'
          style={{ animationDelay: '320ms' }}
        >
          <HeroTerminalDemo className='mt-8 lg:mt-0' />
        </div>
      </div>
    </section>
  )
}
