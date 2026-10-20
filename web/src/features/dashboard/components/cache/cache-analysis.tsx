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
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'

import { StaticDataTable } from '@/components/data-table'
import { ErrorState } from '@/components/error-state'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Progress } from '@/components/ui/progress'
import { toIntlLocale } from '@/i18n/languages'
import { formatCompactNumber, formatNumber } from '@/lib/format'
import { ROLE } from '@/lib/roles'
import { useAuthStore } from '@/stores/auth-store'

import { useCacheUsage } from '../../hooks/use-cache-usage'
import {
  buildCacheUsageTrend,
  groupCacheUsageByModel,
  summarizeCacheUsage,
} from '../../lib/cache-usage'
import type { QuotaDataItem } from '../../types'
import { PanelWrapper } from '../ui/panel-wrapper'

const EMPTY_DATA: QuotaDataItem[] = []

export function CacheAnalysis() {
  const { t, i18n } = useTranslation()
  const locale = toIntlLocale(i18n.resolvedLanguage || i18n.language)
  const isAdmin =
    (useAuthStore((state) => state.auth.user?.role) ?? 0) >= ROLE.ADMIN
  const [days, setDays] = useState(7)
  const [scope, setScope] = useState<'self' | 'all'>('all')
  const [model, setModel] = useState('')
  const query = useCacheUsage(days, scope)
  const data = query.data ?? EMPTY_DATA
  const models = useMemo(() => groupCacheUsageByModel(data), [data])
  const selectedModel = models.some((item) => item.model === model) ? model : ''
  const selected = useMemo(
    () =>
      selectedModel
        ? data.filter((item) => item.model_name === selectedModel)
        : data,
    [data, selectedModel]
  )
  const summary = useMemo(() => summarizeCacheUsage(selected), [selected])
  const trend = useMemo(
    () => buildCacheUsageTrend(selected, days > 1),
    [selected, days]
  )
  const tableRows = useMemo(
    () =>
      models
        .filter((item) => !selectedModel || item.model === selectedModel)
        .slice(0, 20),
    [models, selectedModel]
  )
  const percent = Intl.NumberFormat(locale, {
    style: 'percent',
    maximumFractionDigits: 1,
  })
  const date = Intl.DateTimeFormat(
    locale,
    days === 1
      ? { hour: '2-digit', minute: '2-digit' }
      : { month: 'short', day: 'numeric' }
  )
  const hasReports = summary.reported > 0
  const compact = (value: number) =>
    hasReports ? formatCompactNumber(value, locale) : '—'
  const metrics = [
    {
      label: t('Token cache hit rate'),
      value: summary.rate === null ? '—' : percent.format(summary.rate),
      description: t('Cache read tokens divided by total input tokens'),
    },
    {
      label: t('Total input tokens'),
      value: compact(summary.input),
      description: t('Includes cached input; excludes output tokens'),
    },
    {
      label: t('Cache Read'),
      value: compact(summary.read),
      description: t('Input tokens reused from cache'),
    },
    {
      label: t('Cache Write'),
      value: compact(summary.write),
      description: t('Input tokens written to cache'),
    },
  ]

  return (
    <div
      className='min-w-0 space-y-4'
      role='region'
      aria-label={t('Cache Analysis')}
      aria-busy={query.isLoading}
    >
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <p className='text-muted-foreground text-sm'>
          {t('Cache statistics use hourly dashboard data and may be delayed.')}
        </p>
        <div className='flex w-full flex-wrap gap-2 sm:w-auto'>
          <NativeSelect
            aria-label={t('Model filter')}
            value={selectedModel}
            onChange={(event) => setModel(event.target.value)}
            className='max-w-full min-w-0 flex-1 sm:max-w-64'
          >
            <NativeSelectOption value=''>{t('All models')}</NativeSelectOption>
            {models
              .filter((item) => item.model)
              .map((item) => (
                <NativeSelectOption key={item.model} value={item.model}>
                  {item.model}
                </NativeSelectOption>
              ))}
          </NativeSelect>
          {isAdmin && (
            <NativeSelect
              aria-label={t('Statistics scope')}
              className='w-full sm:w-auto'
              value={scope}
              onChange={(event) =>
                setScope(event.target.value === 'all' ? 'all' : 'self')
              }
            >
              <NativeSelectOption value='all'>
                {t('All users')}
              </NativeSelectOption>
              <NativeSelectOption value='self'>
                {t('Only me')}
              </NativeSelectOption>
            </NativeSelect>
          )}
          <NativeSelect
            aria-label={t('Time range')}
            className='w-full sm:w-auto'
            value={days}
            onChange={(event) => setDays(Number(event.target.value))}
          >
            <NativeSelectOption value={1}>
              {t('Last 24 hours')}
            </NativeSelectOption>
            <NativeSelectOption value={7}>
              {t('Last 7 days')}
            </NativeSelectOption>
            <NativeSelectOption value={30}>
              {t('Last 30 days')}
            </NativeSelectOption>
          </NativeSelect>
        </div>
      </div>
      {query.isError ? (
        <ErrorState
          title={t('Failed to load cache statistics')}
          onRetry={() => {
            void query.refetch()
          }}
        />
      ) : (
        <>
          <PanelWrapper
            title={t('Cache Analysis')}
            loading={query.isLoading}
            height='h-24'
          >
            <dl
              className='grid grid-cols-2 gap-5 lg:grid-cols-4'
              aria-live='polite'
            >
              {metrics.map((item) => (
                <div key={item.label} className='min-w-0'>
                  <dt className='text-muted-foreground text-xs'>
                    {item.label}
                  </dt>
                  <dd className='mt-2 text-2xl font-semibold break-all tabular-nums'>
                    {item.value}
                  </dd>
                  <p className='text-muted-foreground mt-1 text-xs'>
                    {item.description}
                  </p>
                </div>
              ))}
            </dl>
          </PanelWrapper>
          <div className='grid min-w-0 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]'>
            <PanelWrapper
              title={t('Cache hit rate trend')}
              loading={query.isLoading}
              empty={!hasReports}
              emptyMessage={t('No reliable cache reports in this time range')}
            >
              <ChartContainer
                className='aspect-auto h-64 w-full min-w-0'
                config={{
                  rate: {
                    label: t('Token cache hit rate'),
                    color: 'var(--foreground)',
                  },
                }}
              >
                <LineChart
                  data={trend}
                  margin={{ top: 12, right: 12, bottom: 8, left: 8 }}
                  accessibilityLayer
                >
                  <CartesianGrid vertical={false} stroke='var(--border)' />
                  <XAxis
                    dataKey='timestamp'
                    type='number'
                    domain={['dataMin', 'dataMax']}
                    tickFormatter={(value: number) => date.format(value)}
                    tick={{
                      fill: 'var(--muted-foreground)',
                      fontSize: 'var(--text-xs)',
                    }}
                    minTickGap={28}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[0, 1]}
                    tickFormatter={(value: number) => percent.format(value)}
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fill: 'var(--muted-foreground)',
                      fontSize: 'var(--text-xs)',
                    }}
                    width={72}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(_label, payload) => {
                          // The shared tooltip resolves its label to the series
                          // title; only the original point holds a timestamp.
                          const timestamp: unknown =
                            payload[0]?.payload?.timestamp
                          if (
                            typeof timestamp !== 'number' ||
                            !Number.isFinite(timestamp)
                          ) {
                            return null
                          }
                          const pointDate = new Date(timestamp)
                          return Number.isNaN(pointDate.getTime())
                            ? null
                            : date.format(pointDate)
                        }}
                        formatter={(value) =>
                          `${t('Token cache hit rate')}: ${percent.format(Number(value))}`
                        }
                      />
                    }
                  />
                  <Line
                    dataKey='rate'
                    type='linear'
                    stroke='var(--color-rate)'
                    strokeWidth={2}
                    dot={{
                      r: 3,
                      fill: 'var(--color-rate)',
                      stroke: 'var(--card)',
                      strokeWidth: 1.5,
                    }}
                    connectNulls={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ChartContainer>
            </PanelWrapper>
            <PanelWrapper
              title={t('Input token composition')}
              loading={query.isLoading}
              empty={!hasReports}
              emptyMessage={t('No reliable cache reports in this time range')}
            >
              <div className='space-y-5'>
                <div className='flex flex-wrap justify-between gap-2 text-sm'>
                  <span>{t('Total input tokens')}</span>
                  <strong className='tabular-nums'>
                    {formatCompactNumber(summary.input, locale)}
                  </strong>
                </div>
                <Progress
                  value={(summary.rate ?? 0) * 100}
                  aria-label={t('Cache read share')}
                />
                <dl className='space-y-4 text-sm'>
                  <div className='flex flex-wrap justify-between gap-2'>
                    <dt>{t('Cache Read')}</dt>
                    <dd className='tabular-nums'>
                      {percent.format(summary.rate ?? 0)}
                    </dd>
                  </div>
                  <div className='flex flex-wrap justify-between gap-2'>
                    <dt>{t('Other input (including cache writes)')}</dt>
                    <dd className='tabular-nums'>
                      {percent.format(1 - (summary.rate ?? 0))}
                    </dd>
                  </div>
                  <div className='flex flex-wrap justify-between gap-2'>
                    <dt>{t('Cache Write')}</dt>
                    <dd className='tabular-nums'>
                      {formatCompactNumber(summary.write, locale)}
                    </dd>
                  </div>
                </dl>
                <p className='text-muted-foreground text-xs'>
                  {t(
                    'Cache writes may overlap other input categories and are shown separately.'
                  )}
                </p>
              </div>
            </PanelWrapper>
          </div>
          <PanelWrapper
            title={t('Cache usage by model')}
            description={t('Top 20 models by reported input tokens')}
            loading={query.isLoading}
            empty={!data.length}
            contentClassName='p-0 sm:p-0'
          >
            <StaticDataTable
              className='rounded-none border-0'
              data={tableRows}
              getRowKey={(row) => row.model}
              columns={[
                {
                  id: 'model',
                  header: t('Model'),
                  cell: (row) => (
                    <span className='break-all'>
                      {row.model || t('Unknown')}
                    </span>
                  ),
                },
                {
                  id: 'input',
                  header: t('Total input tokens'),
                  cellClassName: 'text-right tabular-nums',
                  cell: (row) =>
                    row.reported ? formatNumber(row.input, locale) : '—',
                },
                {
                  id: 'read',
                  header: t('Cache Read'),
                  cellClassName: 'text-right tabular-nums',
                  cell: (row) =>
                    row.reported ? formatNumber(row.read, locale) : '—',
                },
                {
                  id: 'write',
                  header: t('Cache Write'),
                  cellClassName: 'text-right tabular-nums',
                  cell: (row) =>
                    row.reported ? formatNumber(row.write, locale) : '—',
                },
                {
                  id: 'rate',
                  header: t('Token cache hit rate'),
                  cellClassName: 'text-right tabular-nums',
                  cell: (row) =>
                    row.rate === null ? '—' : percent.format(row.rate),
                },
              ]}
            />
          </PanelWrapper>
          {!query.isLoading && (
            <div className='text-muted-foreground space-y-1 text-xs'>
              <p>
                {t('Cache reports: {{reported}} / {{total}} requests', {
                  reported: formatNumber(summary.reported, locale),
                  total: formatNumber(summary.requests, locale),
                })}
              </p>
              <p>
                {t(
                  'Missing cache reports are excluded, not counted as zero hits.'
                )}
              </p>
              <p>
                {t(
                  'Cache rates are collected after this upgrade. Historical totals are not backfilled.'
                )}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
