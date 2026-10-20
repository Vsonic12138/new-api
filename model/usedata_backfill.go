package model

import (
	"context"
	"fmt"
	"math"
	"strings"
	"time"

	"github.com/QuantumNous/new-api/common"
	"gorm.io/gorm"
)

type CacheBackfillOptions struct {
	// Only complete hours in [From, Before) are eligible. Before must precede
	// the cache dashboard rollout; never include the rollout's mixed hour.
	From   int64 `json:"from"`
	Before int64 `json:"before"`
	UserID int   `json:"user_id"`
	Apply  bool  `json:"apply"`
}

type CacheBackfillReport struct {
	RowsEligible     int             `json:"rows_eligible"`
	RowsUpdated      int64           `json:"rows_updated"`
	RowsAlreadyKnown int             `json:"rows_already_known"`
	RowsChanged      int             `json:"rows_changed"`
	LogsUnknown      int64           `json:"logs_unknown"`
	LogsUnmatched    int64           `json:"logs_unmatched"`
	RowsInconsistent int             `json:"rows_inconsistent"`
	Recovered        CacheUsageStats `json:"recovered"`
}

// HistoricalCacheUsage recovers only positive, bounded cache reports. Older
// logs always wrote cache_tokens=0, so their zero cannot prove a cache miss.
// It deliberately does not infer token quantities from prices or quotas.
func HistoricalCacheUsage(log Log) CacheUsageStats {
	var other struct {
		Read        int64  `json:"cache_tokens"`
		Write       *int64 `json:"cache_write_tokens"`
		Creation    int64  `json:"cache_creation_tokens"`
		Creation5m  int64  `json:"cache_creation_tokens_5m"`
		Creation1h  int64  `json:"cache_creation_tokens_1h"`
		InputTotal  *int64 `json:"input_tokens_total"`
		Semantic    string `json:"usage_semantic"`
		Claude      bool   `json:"claude"`
		LocalCount  bool   `json:"local_count_tokens"`
		BillingPath string `json:"usage_billing_path"`
		AdminInfo   struct {
			LocalCount  bool   `json:"local_count_tokens"`
			BillingPath string `json:"usage_billing_path"`
		} `json:"admin_info"`
	}
	unknown := CacheUsageStats{}
	if log.Type != LogTypeConsume || common.UnmarshalJsonStr(log.Other, &other) != nil || other.LocalCount || other.AdminInfo.LocalCount {
		return unknown
	}
	for _, path := range []string{other.BillingPath, other.AdminInfo.BillingPath} {
		if path == "local" || strings.Contains(path, "estimated") {
			return unknown
		}
	}
	for _, count := range []int64{int64(log.PromptTokens), other.Read, other.Creation, other.Creation5m, other.Creation1h} {
		if count < 0 || count > math.MaxInt32 {
			return unknown
		}
	}
	write := other.Creation
	if other.Creation5m+other.Creation1h > 0 {
		write = other.Creation5m + other.Creation1h
	}
	if other.Write != nil {
		write = *other.Write
	}
	if write < 0 || write > math.MaxInt32 || (other.Read == 0 && write == 0) {
		return unknown
	}
	input := int64(log.PromptTokens)
	if other.Semantic == "" && other.Claude {
		other.Semantic = "anthropic"
	}
	switch other.Semantic {
	case "anthropic":
		input += other.Read + write
	case "", "openai":
	default:
		return unknown
	}
	if other.InputTotal != nil {
		if *other.InputTotal < 0 || *other.InputTotal > math.MaxInt32 {
			return unknown
		}
		input = *other.InputTotal
	}
	if input <= 0 || input > 3*math.MaxInt32 || other.Read > input {
		return unknown
	}
	return CacheUsageStats{CacheStatsInputTokens: input, CacheStatsReadTokens: other.Read, CacheStatsWriteTokens: write, CacheStatsCount: 1}
}

// BackfillDashboardCacheUsage fills existing, wholly unknown quota rows only.
// It does not create quota rows or change requests, tokens, quota, or logs.
// Each update is an atomic compare-and-set; reruns and concurrent invocations
// cannot add the same historical usage twice. Separate log DBs are supported.
func BackfillDashboardCacheUsage(ctx context.Context, db, logDB *gorm.DB, options CacheBackfillOptions) (CacheBackfillReport, error) {
	var report CacheBackfillReport
	if options.UserID < 0 || options.From < 0 || options.From%3600 != 0 || options.Before%3600 != 0 || options.Before <= options.From || options.Before > time.Now().Unix()/3600*3600 {
		return report, fmt.Errorf("backfill requires a nonnegative user ID and a closed, hour-aligned [from, before) range")
	}
	mainDB, logs := db.WithContext(ctx), logDB.WithContext(ctx)
	for hour := options.From; hour < options.Before; hour += 3600 {
		var rows []QuotaData
		query := mainDB.Where("created_at = ?", hour)
		if options.UserID > 0 {
			query = query.Where("user_id = ?", options.UserID)
		}
		if err := query.Order("id").Find(&rows).Error; err != nil {
			return report, err
		}
		if len(rows) == 0 {
			continue
		}
		type bucket struct {
			userID   int
			username string
			model    string
		}
		candidates := make(map[bucket][]int)
		for i, row := range rows {
			key := bucket{row.UserID, row.Username, row.ModelName}
			candidates[key] = append(candidates[key], i)
			if row.CacheUsageStats != (CacheUsageStats{}) {
				report.RowsAlreadyKnown++
			}
		}
		stats := make([]CacheUsageStats, len(rows))
		for offset := 0; ; offset += 500 {
			var batch []Log
			query := logs.Model(&Log{}).Select([]string{"id", "user_id", "username", "model_name", "created_at", "type", "prompt_tokens", "token_id", "channel_id", "group", "other"}).
				Where("created_at >= ? AND created_at < ? AND type = ?", hour, hour+3600, LogTypeConsume)
			if options.UserID > 0 {
				query = query.Where("user_id = ?", options.UserID)
			}
			if err := query.Order("id").Offset(offset).Limit(500).Find(&batch).Error; err != nil {
				return report, err
			}
			for _, log := range batch {
				usage := HistoricalCacheUsage(log)
				if usage.CacheStatsCount == 0 {
					report.LogsUnknown++
					continue
				}
				matched := -1
				for _, i := range candidates[bucket{log.UserId, log.Username, log.ModelName}] {
					row := rows[i]
					// Pre-flow quota rows have no routing dimensions. Otherwise
					// match all available dimensions. Logs lack node identity;
					// multiple matching nodes/duplicate rows must stay unknown.
					legacy := row.UseGroup == "" && row.TokenID == 0 && row.ChannelID == 0 && row.NodeName == ""
					if !legacy && (row.UseGroup != log.Group || row.TokenID != log.TokenId || row.ChannelID != log.ChannelId) {
						continue
					}
					if matched != -1 {
						matched = -2
						break
					}
					matched = i
				}
				if matched < 0 {
					report.LogsUnmatched++
					continue
				}
				if rows[matched].CacheUsageStats != (CacheUsageStats{}) {
					continue
				}
				stats[matched].CacheStatsInputTokens += usage.CacheStatsInputTokens
				stats[matched].CacheStatsReadTokens += usage.CacheStatsReadTokens
				stats[matched].CacheStatsWriteTokens += usage.CacheStatsWriteTokens
				stats[matched].CacheStatsCount++
			}
			if len(batch) < 500 {
				break
			}
		}
		for i, usage := range stats {
			if usage.CacheStatsCount == 0 {
				continue
			}
			row := rows[i]
			if usage.CacheStatsCount > int64(row.Count) {
				report.RowsInconsistent++
				continue
			}
			report.RowsEligible++
			if options.Apply {
				result := mainDB.Model(&QuotaData{}).
					Where("id = ? AND count = ? AND cache_stats_count = 0 AND cache_stats_input_tokens = 0 AND cache_stats_read_tokens = 0 AND cache_stats_write_tokens = 0", row.Id, row.Count).
					Updates(map[string]any{
						"cache_stats_input_tokens": usage.CacheStatsInputTokens,
						"cache_stats_read_tokens":  usage.CacheStatsReadTokens,
						"cache_stats_write_tokens": usage.CacheStatsWriteTokens,
						"cache_stats_count":        usage.CacheStatsCount,
					})
				if result.Error != nil {
					return report, result.Error
				}
				if result.RowsAffected == 0 {
					report.RowsChanged++
					continue
				}
				report.RowsUpdated += result.RowsAffected
			}
			report.Recovered.CacheStatsInputTokens += usage.CacheStatsInputTokens
			report.Recovered.CacheStatsReadTokens += usage.CacheStatsReadTokens
			report.Recovered.CacheStatsWriteTokens += usage.CacheStatsWriteTokens
			report.Recovered.CacheStatsCount += usage.CacheStatsCount
		}
	}
	return report, nil
}
