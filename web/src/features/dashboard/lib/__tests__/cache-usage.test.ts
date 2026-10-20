import { describe, expect, it } from 'vitest'

import type { QuotaDataItem } from '../../types'
import {
  buildCacheUsageTrend,
  groupCacheUsageByModel,
  summarizeCacheUsage,
} from '../cache-usage'

const rows: QuotaDataItem[] = [
  {
    model_name: 'small',
    created_at: 3600,
    count: 1,
    token_used: 500,
    cache_stats_input_tokens: 10,
    cache_stats_read_tokens: 9,
    cache_stats_write_tokens: 3,
    cache_stats_count: 1,
  },
  {
    model_name: 'large',
    created_at: 10800,
    count: 1,
    token_used: 900,
    cache_stats_input_tokens: 90,
    cache_stats_read_tokens: 9,
    cache_stats_count: 1,
  },
  {
    model_name: 'historical',
    created_at: 7200,
    count: 3,
    token_used: 10000,
    cache_read_tokens: 5000,
  },
]

describe('cache usage statistics', () => {
  it('weights the rate by input tokens and excludes historical totals and output tokens', () => {
    expect(summarizeCacheUsage(rows)).toEqual({
      input: 100,
      read: 18,
      write: 3,
      reported: 2,
      requests: 5,
      rate: 0.18,
    })
  })
  it('distinguishes an explicitly reported zero from missing cache data', () => {
    expect(summarizeCacheUsage(rows.slice(2)).rate).toBeNull()
    expect(
      summarizeCacheUsage([
        {
          created_at: 3600,
          count: 1,
          cache_stats_input_tokens: 100,
          cache_stats_read_tokens: 0,
          cache_stats_count: 1,
        },
      ]).rate
    ).toBe(0)
    expect(summarizeCacheUsage([]).rate).toBeNull()
  })
  it('excludes invalid or inconsistent reports from the rate', () => {
    const invalid = [
      { cache_stats_input_tokens: -1 },
      { cache_stats_read_tokens: 101 },
      { cache_stats_read_tokens: -1 },
      { cache_stats_write_tokens: Number.NaN },
      { cache_stats_count: 2 },
    ].map((patch) => ({
      created_at: 3600,
      count: 1,
      cache_stats_input_tokens: 100,
      cache_stats_read_tokens: 10,
      cache_stats_count: 1,
      ...patch,
    }))
    expect(summarizeCacheUsage(invalid)).toEqual({
      input: 0,
      read: 0,
      write: 0,
      reported: 0,
      requests: 5,
      rate: null,
    })
  })
  it('keeps overlapping writes separate without inflating the denominator', () => {
    expect(
      summarizeCacheUsage([
        {
          created_at: 3600,
          count: 1,
          cache_stats_input_tokens: 100,
          cache_stats_read_tokens: 90,
          cache_stats_write_tokens: 20,
          cache_stats_count: 1,
        },
      ]).rate
    ).toBe(0.9)
  })
  it('ranks models by reported input while retaining unknown models', () => {
    expect(
      groupCacheUsageByModel(rows).map((row) => [row.model, row.rate])
    ).toEqual([
      ['large', 0.1],
      ['small', 0.9],
      ['historical', null],
    ])
  })
  it('leaves unreported hours as gaps rather than zero hits', () => {
    expect(buildCacheUsageTrend(rows, false)).toEqual([
      { timestamp: 3600000, rate: 0.9 },
      { timestamp: 7200000, rate: null },
      { timestamp: 10800000, rate: 0.1 },
    ])
  })
})
