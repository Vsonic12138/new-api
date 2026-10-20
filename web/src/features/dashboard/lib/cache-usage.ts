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
import type { QuotaDataItem } from '../types'

export interface CacheUsageSummary {
  input: number
  read: number
  write: number
  reported: number
  requests: number
  rate: number | null
}

export interface ModelCacheUsage extends CacheUsageSummary {
  model: string
}

// Missing fields on historical hourly rows stay outside the rate denominator.
// Sum tokens first: averaging request/model percentages would bias small calls.
export function summarizeCacheUsage(data: QuotaDataItem[]): CacheUsageSummary {
  const totals = { input: 0, read: 0, write: 0, reported: 0, requests: 0 }
  for (const row of data) {
    const count = Number(row.count) || 0
    totals.requests += Math.max(0, count)
    const input = row.cache_stats_input_tokens ?? 0
    const read = row.cache_stats_read_tokens ?? 0
    const write = row.cache_stats_write_tokens ?? 0
    const reported = row.cache_stats_count ?? 0
    if (
      ![input, read, write, reported].every(Number.isFinite) ||
      input <= 0 ||
      read < 0 ||
      read > input ||
      write < 0 ||
      reported <= 0 ||
      reported > count
    ) {
      continue
    }
    totals.input += input
    totals.read += read
    totals.write += write
    totals.reported += reported
  }
  return {
    ...totals,
    rate: totals.input > 0 ? totals.read / totals.input : null,
  }
}

export function groupCacheUsageByModel(
  data: QuotaDataItem[]
): ModelCacheUsage[] {
  const groups = new Map<string, QuotaDataItem[]>()
  for (const row of data) {
    const model = row.model_name ?? ''
    const entries = groups.get(model) ?? []
    entries.push(row)
    groups.set(model, entries)
  }
  return [...groups]
    .map(([model, rows]) => ({ model, ...summarizeCacheUsage(rows) }))
    .sort((a, b) => b.input - a.input || a.model.localeCompare(b.model))
}

export function buildCacheUsageTrend(data: QuotaDataItem[], daily: boolean) {
  const groups = new Map<number, QuotaDataItem[]>()
  for (const row of data) {
    if (!Number.isFinite(row.created_at) || row.created_at <= 0) continue
    const date = new Date(row.created_at * 1000)
    if (daily) date.setHours(0, 0, 0, 0)
    else date.setMinutes(0, 0, 0)
    const timestamp = date.getTime()
    const entries = groups.get(timestamp) ?? []
    entries.push(row)
    groups.set(timestamp, entries)
  }
  const timestamps = [...groups.keys()].sort((a, b) => a - b)
  const first = timestamps.at(0)
  const last = timestamps.at(-1)
  if (first === undefined || last === undefined) return []
  const points: { timestamp: number; rate: number | null }[] = []
  const cursor = new Date(first)
  // Calendar increments preserve local midnight across daylight-saving changes.
  while (cursor.getTime() <= last) {
    const timestamp = cursor.getTime()
    points.push({
      timestamp,
      rate: summarizeCacheUsage(groups.get(timestamp) ?? []).rate,
    })
    if (daily) cursor.setDate(cursor.getDate() + 1)
    else cursor.setTime(timestamp + 3600000)
  }
  return points
}
