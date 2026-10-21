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
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { toIntlLocale } from '@/i18n/languages'
import { formatCompactNumber } from '@/lib/format'

import { useCacheUsage } from '../../hooks/use-cache-usage'
import { summarizeCacheUsage } from '../../lib/cache-usage'
import { PanelWrapper } from '../ui/panel-wrapper'

export function CacheUsageSummary() {
  const { t, i18n } = useTranslation()
  const locale = toIntlLocale(i18n.resolvedLanguage || i18n.language)
  const query = useCacheUsage(1, 'self')
  const summary = summarizeCacheUsage(query.data ?? [])
  let rate = '—'
  if (summary.rate !== null) {
    rate = Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(summary.rate)
  }

  return (
    <PanelWrapper
      title={t('Input cache')}
      description={t('Your cache usage in the last 24 hours')}
      loading={query.isLoading}
      height='h-20'
      headerActions={
        <Button
          variant='ghost'
          size='sm'
          render={
            <Link
              to='/dashboard/$section'
              params={{ section: 'cache' }}
              search={{ cacheScope: 'self', cacheDays: 1 }}
            />
          }
        >
          {t('View cache analysis')}
        </Button>
      }
    >
      {query.isError ? (
        <p role='alert' className='text-muted-foreground text-sm'>
          {t('Failed to load cache statistics')}
        </p>
      ) : (
        <dl className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
          {[
            { label: t('Valid sample cache hit rate'), value: rate },
            {
              label: t('Cache Read'),
              value: summary.reported
                ? formatCompactNumber(summary.read, locale)
                : '—',
            },
            {
              label: t('Reported input tokens'),
              value: summary.reported
                ? formatCompactNumber(summary.input, locale)
                : '—',
            },
          ].map((item) => (
            <div key={item.label}>
              <dt className='text-muted-foreground min-h-8 text-xs leading-4'>
                {item.label}
              </dt>
              <dd className='mt-1 text-xl font-semibold tabular-nums'>
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
      <p className='text-muted-foreground mt-3 text-xs'>
        {t('Missing cache reports are excluded, not counted as zero hits.')}
      </p>
    </PanelWrapper>
  )
}
