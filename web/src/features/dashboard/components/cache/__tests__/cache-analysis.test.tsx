import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import i18next from 'i18next'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { QuotaDataItem } from '@/features/dashboard/types'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth-store'

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
  await i18next.changeLanguage('en')
})
function renderAnalysis() {
  return render(
    <QueryClientProvider client={client}>
      <CacheAnalysis />
    </QueryClientProvider>
  )
}

describe('cache analysis', () => {
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
  it('allows an administrator to switch from all users to their own data', async () => {
    useAuthStore
      .getState()
      .auth.setUser({ id: 2, username: 'admin', role: 100 })
    const request = vi
      .spyOn(api, 'get')
      .mockResolvedValue({ data: { success: true, data: rows } })
    const user = userEvent.setup()
    renderAnalysis()
    await screen.findAllByText('12.5%')
    expect(request).toHaveBeenCalledWith('/api/data', expect.anything())
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Statistics scope' }),
      'self'
    )
    await waitFor(() =>
      expect(request).toHaveBeenCalledWith('/api/data/self', expect.anything())
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
      screen.getByRole('region', { name: 'Cache Analysis' })
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
