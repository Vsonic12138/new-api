import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { act, cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import i18next from 'i18next'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { QuotaDataItem } from '@/features/dashboard/types'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth-store'
import { useCachePreferencesStore } from '@/stores/cache-preferences-store'

import { cacheSearchSchema } from '../../../lib/cache-search'
import { CacheUsageSummary } from '../../overview/cache-usage-summary'
import { CacheAnalysis } from '../cache-analysis'

let client: QueryClient
const rows: QuotaDataItem[] = [
  {
    created_at: 3600,
    count: 1,
    model_name: 'gpt-test',
    cache_stats_input_tokens: 8000,
    cache_stats_read_tokens: 1000,
    cache_stats_write_tokens: 0,
    cache_stats_count: 1,
  },
]

beforeEach(async () => {
  await i18next.changeLanguage('en')
  localStorage.clear()
  useCachePreferencesStore.setState({ scopeByUser: {} })
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  useAuthStore
    .getState()
    .auth.setUser({ id: 1, username: 'cache-user', role: 1 })
})
afterEach(async () => {
  cleanup()
  client.clear()
  vi.restoreAllMocks()
  useAuthStore.setState(useAuthStore.getInitialState(), true)
  useCachePreferencesStore.setState({ scopeByUser: {} })
  localStorage.clear()
  await i18next.changeLanguage('en')
})
function renderAnalysis(initialEntry = '/dashboard/cache') {
  const root = createRootRoute()
  const auth = createRoute({ getParentRoute: () => root, id: '_authenticated' })
  const dashboard = createRoute({
    getParentRoute: () => auth,
    path: '/dashboard/$section',
    validateSearch: cacheSearchSchema,
    component: function CacheFixture() {
      const { section } = dashboard.useParams()
      return section === 'overview' ? <CacheUsageSummary /> : <CacheAnalysis />
    },
  })
  const router = createRouter({
    routeTree: root.addChildren([auth.addChildren([dashboard])]),
    history: createMemoryHistory({ initialEntries: [initialEntry] }),
  })
  const view = render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
  return { ...view, router }
}

describe('cache analysis', () => {
  it('shows the point date without crashing when the trend tooltip is activated', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(
      new DOMRect(0, 0, 640, 256)
    )
    vi.spyOn(api, 'get').mockResolvedValue({
      data: { success: true, data: rows },
    })
    const user = userEvent.setup()
    renderAnalysis()
    await screen.findAllByText('12.5%')
    const chart = screen.getByRole('application')
    act(() => chart.focus())
    await user.keyboard('{ArrowRight}')
    expect(
      await screen.findByText(
        Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(
          rows[0].created_at * 1000
        ),
        { selector: '.font-medium' }
      )
    ).toBeVisible()
    expect(screen.getByRole('region', { name: 'Cache Analysis' })).toBeVisible()
  })
  it('uses only self data for a normal user and applies time and model filters', async () => {
    const request = vi
      .spyOn(api, 'get')
      .mockResolvedValue({ data: { success: true, data: rows } })
    const user = userEvent.setup()
    renderAnalysis()
    expect(await screen.findAllByText('12.5%')).not.toHaveLength(0)
    expect(
      screen.queryByRole('combobox', { name: 'Statistics scope' })
    ).not.toBeInTheDocument()
    expect(request).toHaveBeenCalledWith('/api/data/self', expect.anything())
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Time range' }),
      '30'
    )
    await waitFor(() => expect(request).toHaveBeenCalledTimes(2))
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Model filter' }),
      'gpt-test'
    )
    expect(screen.getAllByRole('row')).toHaveLength(2)
  })
  it('defaults an administrator to personal data and allows switching to all users', async () => {
    useAuthStore
      .getState()
      .auth.setUser({ id: 2, username: 'admin', role: 100 })
    const request = vi
      .spyOn(api, 'get')
      .mockResolvedValue({ data: { success: true, data: rows } })
    const user = userEvent.setup()
    renderAnalysis()
    await screen.findAllByText('12.5%')
    expect(request).toHaveBeenCalledWith('/api/data/self', expect.anything())
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Statistics scope' }),
      'all'
    )
    await waitFor(() =>
      expect(request).toHaveBeenCalledWith('/api/data', expect.anything())
    )
  })
  it('updates the rate, coverage and model totals together when switching to site-wide data', async () => {
    useAuthStore
      .getState()
      .auth.setUser({ id: 2, username: 'admin', role: 100 })
    vi.spyOn(api, 'get').mockImplementation(async (url) => ({
      data: {
        success: true,
        data:
          url === '/api/data'
            ? [{ ...rows[0], count: 2, cache_stats_read_tokens: 6000 }]
            : rows,
      },
    }))
    const user = userEvent.setup()
    renderAnalysis()
    await screen.findAllByText('12.5%')
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Statistics scope' }),
      'all'
    )
    await screen.findAllByText('75.0%')
    expect(screen.getAllByText('50.0%')).not.toHaveLength(0)
    expect(screen.getByRole('cell', { name: '6,000' })).toBeVisible()
    expect(screen.queryByText('12.5%')).not.toBeInTheDocument()
  })
  it('shows report coverage beside a rate that excludes unknown requests', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({
      data: { success: true, data: [{ ...rows[0], count: 2 }] },
    })
    renderAnalysis()
    await screen.findAllByText('12.5%')
    expect(screen.getAllByText('Report coverage')).not.toHaveLength(0)
    expect(screen.getAllByText('50.0%')).not.toHaveLength(0)
    expect(screen.getByText('Cache reports: 1 / 2 requests')).toBeVisible()
    expect(
      screen.queryByText(
        'Cache rates are collected after this upgrade. Historical totals are not backfilled.'
      )
    ).not.toBeInTheDocument()
  })
  it('aligns numeric headers with their values and gives the table consistent edge padding', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({
      data: { success: true, data: rows },
    })
    renderAnalysis()
    await screen.findAllByText('12.5%')
    const headers = screen.getAllByRole('columnheader')
    for (const header of headers.slice(1)) {
      expect(header).toHaveClass('text-right')
      expect(header).toHaveAttribute('scope', 'col')
    }
    expect(headers[0]).toHaveClass('pl-4')
    expect(headers.at(-1)).toHaveClass('pr-4')
  })
  it('retains the overview personal range even when the administrator last viewed site-wide data', async () => {
    useAuthStore
      .getState()
      .auth.setUser({ id: 2, username: 'admin', role: 100 })
    useCachePreferencesStore.getState().setScope(2, 'all')
    const request = vi
      .spyOn(api, 'get')
      .mockResolvedValue({ data: { success: true, data: rows } })
    const user = userEvent.setup()
    const { router } = renderAnalysis('/dashboard/overview')
    await user.click(
      await screen.findByRole('button', { name: 'View cache analysis' })
    )
    expect(
      await screen.findByRole('combobox', { name: 'Statistics scope' })
    ).toHaveValue('self')
    expect(screen.getByRole('combobox', { name: 'Time range' })).toHaveValue(
      '1'
    )
    expect(router.state.location.search).toMatchObject({
      cacheScope: 'self',
      cacheDays: 1,
    })
    expect(request.mock.calls.every(([url]) => url === '/api/data/self')).toBe(
      true
    )
  })
  it('remembers an administrator selection on direct entry without leaking it to another account', async () => {
    useAuthStore
      .getState()
      .auth.setUser({ id: 2, username: 'admin', role: 100 })
    const request = vi
      .spyOn(api, 'get')
      .mockResolvedValue({ data: { success: true, data: rows } })
    const user = userEvent.setup()
    const first = renderAnalysis()
    await user.selectOptions(
      await screen.findByRole('combobox', { name: 'Statistics scope' }),
      'all'
    )
    await waitFor(() =>
      expect(request).toHaveBeenCalledWith('/api/data', expect.anything())
    )
    first.unmount()
    renderAnalysis()
    expect(
      await screen.findByRole('combobox', { name: 'Statistics scope' })
    ).toHaveValue('all')
    act(() =>
      useAuthStore
        .getState()
        .auth.setUser({ id: 3, username: 'other-admin', role: 100 })
    )
    expect(
      screen.getByRole('combobox', { name: 'Statistics scope' })
    ).toHaveValue('self')
  })
  it('forces personal data for a normal user even with a site-wide URL', async () => {
    const request = vi
      .spyOn(api, 'get')
      .mockResolvedValue({ data: { success: true, data: rows } })
    renderAnalysis('/dashboard/cache?cacheScope=all&cacheDays=30')
    await screen.findAllByText('12.5%')
    expect(
      screen.queryByRole('combobox', { name: 'Statistics scope' })
    ).not.toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Time range' })).toHaveValue(
      '30'
    )
    expect(request.mock.calls.every(([url]) => url === '/api/data/self')).toBe(
      true
    )
  })
  it('restores filters through browser back and keeps a missing selected model instead of silently switching to all models', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({
      data: { success: true, data: rows },
    })
    const user = userEvent.setup()
    const { router } = renderAnalysis(
      '/dashboard/cache?cacheDays=7&cacheModel=missing-model'
    )
    expect(
      await screen.findByRole('combobox', { name: 'Model filter' })
    ).toHaveValue('missing-model')
    expect(
      await screen.findAllByText('No reliable cache reports in this time range')
    ).toHaveLength(2)
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Model filter' }),
      'gpt-test'
    )
    await screen.findAllByText('12.5%')
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Time range' }),
      '30'
    )
    await waitFor(() =>
      expect(router.state.location.search).toMatchObject({
        cacheDays: 30,
        cacheModel: 'gpt-test',
      })
    )
    await act(() => router.history.back())
    await waitFor(() =>
      expect(screen.getByRole('combobox', { name: 'Time range' })).toHaveValue(
        '7'
      )
    )
  })
  it('falls back to personal seven-day statistics for invalid URL filters', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({
      data: { success: true, data: rows },
    })
    renderAnalysis('/dashboard/cache?cacheScope=invalid&cacheDays=-1')
    await screen.findAllByText('12.5%')
    expect(screen.getByRole('combobox', { name: 'Time range' })).toHaveValue(
      '7'
    )
  })
  it('shows unknown rates for historical rows and no-data messages for an empty range', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({
      data: {
        success: true,
        data: [
          {
            created_at: 3600,
            count: 4,
            model_name: 'old-model',
            token_used: 9000,
          },
        ],
      },
    })
    renderAnalysis()
    expect(
      await screen.findAllByText('No reliable cache reports in this time range')
    ).toHaveLength(2)
    expect(screen.queryByText('0%')).not.toBeInTheDocument()
    expect(
      screen.getByText('old-model', { selector: 'span' })
    ).toBeInTheDocument()
  })
  it('keeps a failed request distinct from zero usage and supports retry', async () => {
    const request = vi
      .spyOn(api, 'get')
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValue({ data: { success: true, data: rows } })
    const user = userEvent.setup()
    renderAnalysis()
    expect(
      await screen.findByText('Failed to load cache statistics')
    ).toBeInTheDocument()
    expect(screen.queryByText('0%')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Retry' }))
    expect(await screen.findAllByText('12.5%')).not.toHaveLength(0)
    expect(request).toHaveBeenCalledTimes(2)
  })
  it('keeps loading distinct from zero usage until the response arrives', async () => {
    let deliver!: (value: {
      data: { success: boolean; data: QuotaDataItem[] }
    }) => void
    vi.spyOn(api, 'get').mockReturnValue(
      new Promise((resolve) => {
        deliver = resolve
      })
    )
    renderAnalysis()
    expect(
      await screen.findByRole('region', { name: 'Cache Analysis' })
    ).toHaveAttribute('aria-busy', 'true')
    expect(screen.queryByText('0%')).not.toBeInTheDocument()
    await act(async () => {
      deliver({ data: { success: true, data: rows } })
    })
    await screen.findAllByText('12.5%')
    expect(
      screen.getByRole('region', { name: 'Cache Analysis' })
    ).toHaveAttribute('aria-busy', 'false')
  })
  it('shows an empty state without a fabricated model table when no requests exist', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({
      data: { success: true, data: [] },
    })
    renderAnalysis()
    expect(await screen.findByText('No data available')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.queryByText('0%')).not.toBeInTheDocument()
  })
  it('updates percentage formatting when switching any supported interface language', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({
      data: { success: true, data: rows },
    })
    renderAnalysis()
    await screen.findAllByText('12.5%')
    for (const [language, expected] of [
      ['zhCN', '12.5%'],
      ['zhTW', '12.5%'],
      ['en', '12.5%'],
      ['fr', '12,5 %'],
      ['ru', '12,5 %'],
      ['ja', '12.5%'],
      ['vi', '12,5%'],
      ['invalid-language', '12.5%'],
    ] as const) {
      i18next.addResources(language, 'translation', {
        'Cache Analysis': 'Cache Analysis',
      })
      await act(() => i18next.changeLanguage(language))
      expect(screen.getAllByText(expected)).not.toHaveLength(0)
    }
  })
})
