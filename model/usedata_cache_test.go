package model

import (
	"context"
	"os"
	"path/filepath"
	"testing"

	"github.com/QuantumNous/new-api/common"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

// The published v1.0.0-rc.45 schema, retained to exercise real upgrades.
type quotaDataBeforeCache struct {
	Id        int    `json:"id"`
	UserID    int    `json:"user_id" gorm:"index"`
	Username  string `json:"username" gorm:"index:idx_qdt_model_user_name,priority:2;size:64;default:''"`
	ModelName string `json:"model_name" gorm:"index:idx_qdt_model_user_name,priority:1;size:64;default:''"`
	CreatedAt int64  `json:"created_at" gorm:"bigint;index:idx_qdt_created_at,priority:2"`
	UseGroup  string `json:"use_group" gorm:"index;size:64;default:''"`
	TokenID   int    `json:"token_id" gorm:"index;default:0"`
	ChannelID int    `json:"channel_id" gorm:"index;default:0"`
	NodeName  string `json:"node_name" gorm:"index;size:64;default:''"`
	TokenUsed int    `json:"token_used" gorm:"default:0"`
	Count     int    `json:"count" gorm:"default:0"`
	Quota     int    `json:"quota" gorm:"default:0"`
}

func TestHistoricalCacheUsage(t *testing.T) {
	for _, tc := range []struct {
		name   string
		prompt int
		other  string
		want   CacheUsageStats
	}{
		{name: "OpenAI", prompt: 100, other: `{"cache_tokens":60}`, want: CacheUsageStats{CacheStatsInputTokens: 100, CacheStatsReadTokens: 60, CacheStatsCount: 1}},
		{name: "zero is unknown", prompt: 100, other: `{"cache_tokens":0}`},
		{name: "missing is unknown", prompt: 100, other: `{}`},
		{name: "bad JSON", prompt: 100, other: `{`},
		{name: "negative", prompt: 100, other: `{"cache_tokens":-1}`},
		{name: "fractional", prompt: 100, other: `{"cache_tokens":1.5}`},
		{name: "oversized", prompt: 100, other: `{"cache_tokens":2147483648}`},
		{name: "read exceeds input", prompt: 10, other: `{"cache_tokens":20}`},
		{name: "local", prompt: 100, other: `{"cache_tokens":60,"admin_info":{"local_count_tokens":true}}`},
		{name: "legacy local", prompt: 100, other: `{"cache_tokens":60,"usage_billing_path":"local"}`},
		{name: "estimated", prompt: 100, other: `{"cache_tokens":60,"admin_info":{"usage_billing_path":"billing-usage-openai-estimated"}}`},
		{name: "unknown semantic", prompt: 100, other: `{"cache_tokens":60,"usage_semantic":"unknown"}`},
		{name: "Anthropic TTL split", prompt: 100, other: `{"usage_semantic":"anthropic","cache_tokens":800,"cache_creation_tokens":70,"cache_creation_tokens_5m":50,"cache_creation_tokens_1h":20}`, want: CacheUsageStats{CacheStatsInputTokens: 970, CacheStatsReadTokens: 800, CacheStatsWriteTokens: 70, CacheStatsCount: 1}},
		{name: "legacy Claude", prompt: 100, other: `{"claude":true,"cache_tokens":800,"cache_creation_tokens":70}`, want: CacheUsageStats{CacheStatsInputTokens: 970, CacheStatsReadTokens: 800, CacheStatsWriteTokens: 70, CacheStatsCount: 1}},
		{name: "OpenAI write overlap", prompt: 1000, other: `{"cache_tokens":900,"cache_write_tokens":200,"cache_creation_tokens":200}`, want: CacheUsageStats{CacheStatsInputTokens: 1000, CacheStatsReadTokens: 900, CacheStatsWriteTokens: 200, CacheStatsCount: 1}},
		{name: "explicit input total", prompt: 100, other: `{"cache_tokens":800,"input_tokens_total":1000}`, want: CacheUsageStats{CacheStatsInputTokens: 1000, CacheStatsReadTokens: 800, CacheStatsCount: 1}},
		{name: "invalid input total", prompt: 100, other: `{"cache_tokens":60,"input_tokens_total":2147483648}`},
		{name: "write only", prompt: 100, other: `{"cache_tokens":0,"cache_write_tokens":20}`, want: CacheUsageStats{CacheStatsInputTokens: 100, CacheStatsWriteTokens: 20, CacheStatsCount: 1}},
	} {
		t.Run(tc.name, func(t *testing.T) {
			assert.Equal(t, tc.want, HistoricalCacheUsage(Log{Type: LogTypeConsume, PromptTokens: tc.prompt, Other: tc.other}))
		})
	}
	assert.Empty(t, HistoricalCacheUsage(Log{Type: LogTypeRefund, PromptTokens: 100, Other: `{"cache_tokens":60}`}))
}

func testQuotaCacheHistoryBackfill(t *testing.T, db *gorm.DB, dialect string) {
	t.Helper()
	// A genuinely separate log database also checks that reserved-column
	// quoting follows the log connection rather than the primary DB's globals.
	logDSN := os.Getenv("TEST_CACHE_LOG_" + map[string]string{"mysql": "MYSQL", "postgres": "POSTGRES"}[dialect] + "_DSN")
	savedPath := common.SQLitePath
	common.SQLitePath = filepath.Join(t.TempDir(), "historical-logs.db")
	t.Cleanup(func() { common.SQLitePath = savedPath })
	t.Setenv("CACHE_HISTORY_LOG_TEST_DSN", logDSN)
	logDB, _, err := chooseDB("CACHE_HISTORY_LOG_TEST_DSN", true)
	require.NoError(t, err)
	logSQL, err := logDB.DB()
	require.NoError(t, err)
	t.Cleanup(func() { require.NoError(t, logSQL.Close()) })
	require.NoError(t, logDB.Migrator().DropTable(&Log{}))
	require.NoError(t, logDB.AutoMigrate(&Log{}))
	require.NoError(t, db.Where("id > 0").Delete(&QuotaData{}).Error)
	rows := []QuotaData{
		{UserID: 1, Username: "alice", ModelName: "legacy", CreatedAt: 3600, Count: 503, Quota: 17, TokenUsed: 999},
		{UserID: 1, Username: "alice", ModelName: "claude", CreatedAt: 3600, Count: 1, UseGroup: "g", TokenID: 7, ChannelID: 2, NodeName: "a"},
		{UserID: 1, Username: "alice", ModelName: "claude", CreatedAt: 3600, Count: 1, UseGroup: "other", TokenID: 8, ChannelID: 3, NodeName: "a"},
		{UserID: 1, Username: "alice", ModelName: "ambiguous", CreatedAt: 3600, Count: 1, NodeName: "a"},
		{UserID: 1, Username: "alice", ModelName: "ambiguous", CreatedAt: 3600, Count: 1, NodeName: "b"},
		{UserID: 1, Username: "alice", ModelName: "inconsistent", CreatedAt: 3600, Count: 1},
		{UserID: 1, Username: "alice", ModelName: "known", CreatedAt: 3600, Count: 1, CacheUsageStats: CacheUsageStats{CacheStatsInputTokens: 100, CacheStatsReadTokens: 20, CacheStatsCount: 1}},
		{UserID: 2, Username: "bob", ModelName: "legacy", CreatedAt: 3600, Count: 1},
		{UserID: 1, Username: "alice", ModelName: "legacy", CreatedAt: 7200, Count: 1},
	}
	require.NoError(t, db.Create(&rows).Error)
	logs := []Log{
		{UserId: 1, Username: "alice", ModelName: "legacy", Type: LogTypeConsume, CreatedAt: 3601, PromptTokens: 100, Other: `{"cache_tokens":0}`},
		{UserId: 1, Username: "alice", ModelName: "legacy", Type: LogTypeConsume, CreatedAt: 3602, PromptTokens: 100, Other: `{"cache_tokens":60,"admin_info":{"usage_billing_path":"local"}}`},
		{UserId: 1, Username: "alice", ModelName: "claude", Type: LogTypeConsume, CreatedAt: 3603, PromptTokens: 100, Group: "g", TokenId: 7, ChannelId: 2, Other: `{"usage_semantic":"anthropic","cache_tokens":800,"cache_creation_tokens":70,"cache_creation_tokens_5m":50,"cache_creation_tokens_1h":20}`},
		{UserId: 1, Username: "alice", ModelName: "claude", Type: LogTypeConsume, CreatedAt: 3604, PromptTokens: 200, Group: "other", TokenId: 8, ChannelId: 3, Other: `{"cache_tokens":100}`},
		{UserId: 1, Username: "alice", ModelName: "ambiguous", Type: LogTypeConsume, CreatedAt: 3605, PromptTokens: 100, Other: `{"cache_tokens":60}`},
		{UserId: 1, Username: "alice", ModelName: "inconsistent", Type: LogTypeConsume, CreatedAt: 3606, PromptTokens: 100, Other: `{"cache_tokens":60}`},
		{UserId: 1, Username: "alice", ModelName: "inconsistent", Type: LogTypeConsume, CreatedAt: 3607, PromptTokens: 100, Other: `{"cache_tokens":60}`},
		{UserId: 1, Username: "alice", ModelName: "known", Type: LogTypeConsume, CreatedAt: 3608, PromptTokens: 100, Other: `{"cache_tokens":60}`},
		{UserId: 2, Username: "bob", ModelName: "legacy", Type: LogTypeConsume, CreatedAt: 3609, PromptTokens: 100, Other: `{"cache_tokens":60}`},
		{UserId: 1, Username: "alice", ModelName: "legacy", Type: LogTypeConsume, CreatedAt: 7200, PromptTokens: 100, Other: `{"cache_tokens":60}`},
	}
	// Cross the tool's 500-log page boundary to catch loss/double counting at
	// that specific boundary, rather than relying on a small single-page fixture.
	for range 501 {
		logs = append(logs, Log{UserId: 1, Username: "alice", ModelName: "legacy", Type: LogTypeConsume, CreatedAt: 3610, PromptTokens: 100, Other: `{"cache_tokens":60}`})
	}
	require.NoError(t, logDB.CreateInBatches(&logs, 50).Error)
	options := CacheBackfillOptions{From: 3600, Before: 7200, UserID: 1}
	preview, err := BackfillDashboardCacheUsage(context.Background(), db, logDB, options)
	require.NoError(t, err)
	assert.Equal(t, 3, preview.RowsEligible)
	assert.Zero(t, preview.RowsUpdated)
	assert.Equal(t, int64(2), preview.LogsUnknown)
	assert.Equal(t, int64(1), preview.LogsUnmatched)
	assert.Equal(t, 1, preview.RowsInconsistent)
	assert.Equal(t, CacheUsageStats{CacheStatsInputTokens: 51270, CacheStatsReadTokens: 30960, CacheStatsWriteTokens: 70, CacheStatsCount: 503}, preview.Recovered)
	var afterPreview []QuotaData
	require.NoError(t, db.Order("id").Find(&afterPreview).Error)
	assert.Equal(t, rows, afterPreview)
	options.Apply = true
	applied, err := BackfillDashboardCacheUsage(context.Background(), db, logDB, options)
	require.NoError(t, err)
	assert.Equal(t, int64(3), applied.RowsUpdated)
	assert.Equal(t, preview.Recovered, applied.Recovered)
	var afterApply []QuotaData
	require.NoError(t, db.Order("id").Find(&afterApply).Error)
	expected := append([]QuotaData(nil), rows...)
	expected[0].CacheUsageStats = CacheUsageStats{CacheStatsInputTokens: 50100, CacheStatsReadTokens: 30060, CacheStatsCount: 501}
	expected[1].CacheUsageStats = CacheUsageStats{CacheStatsInputTokens: 970, CacheStatsReadTokens: 800, CacheStatsWriteTokens: 70, CacheStatsCount: 1}
	expected[2].CacheUsageStats = CacheUsageStats{CacheStatsInputTokens: 200, CacheStatsReadTokens: 100, CacheStatsCount: 1}
	assert.Equal(t, expected, afterApply)
	repeated, err := BackfillDashboardCacheUsage(context.Background(), db, logDB, options)
	require.NoError(t, err)
	assert.Zero(t, repeated.RowsUpdated)
	assert.Empty(t, repeated.Recovered)
	var afterRepeat []QuotaData
	require.NoError(t, db.Order("id").Find(&afterRepeat).Error)
	assert.Equal(t, afterApply, afterRepeat)
	var storedLogs []Log
	require.NoError(t, logDB.Order("id").Find(&storedLogs).Error)
	assert.Equal(t, logs, storedLogs)
	options.UserID = 0
	allUsers, err := BackfillDashboardCacheUsage(context.Background(), db, logDB, options)
	require.NoError(t, err)
	assert.Equal(t, int64(1), allUsers.RowsUpdated)
	assert.Equal(t, CacheUsageStats{CacheStatsInputTokens: 100, CacheStatsReadTokens: 60, CacheStatsCount: 1}, allUsers.Recovered)
	for _, invalid := range []CacheBackfillOptions{
		{From: 3601, Before: 7200, Apply: true},
		{From: 3600, Before: 7201, Apply: true},
		{From: 7200, Before: 3600, Apply: true},
		{From: 3600, Before: 7200, UserID: -1, Apply: true},
	} {
		_, err := BackfillDashboardCacheUsage(context.Background(), db, logDB, invalid)
		require.Error(t, err)
	}
}

func (quotaDataBeforeCache) TableName() string { return "quota_data" }

func TestQuotaDataCacheDatabaseCompatibility(t *testing.T) {
	for _, dialect := range []string{"sqlite", "mysql", "postgres"} {
		t.Run(dialect, func(t *testing.T) {
			var dsn string
			savedSQLite := common.SQLitePath
			t.Cleanup(func() { common.SQLitePath = savedSQLite })
			switch dialect {
			case "sqlite":
				common.SQLitePath = filepath.Join(t.TempDir(), "quota.db")
			case "mysql":
				dsn = os.Getenv("TEST_MYSQL_DSN")
			case "postgres":
				dsn = os.Getenv("TEST_POSTGRES_DSN")
			}
			if dialect != "sqlite" && dsn == "" {
				t.Skip("database DSN not configured")
			}
			t.Setenv("CACHE_STATS_TEST_DSN", dsn)
			// Exercise the actual application's dialect wrappers and protocol settings.
			db, dbType, err := chooseDB("CACHE_STATS_TEST_DSN", false)
			previousType := common.MainDatabaseType()
			common.SetMainDatabaseType(dbType)
			initCol()
			t.Cleanup(func() { common.SetMainDatabaseType(previousType); initCol() })
			require.NoError(t, err)
			sqlDB, err := db.DB()
			require.NoError(t, err)
			t.Cleanup(func() { require.NoError(t, sqlDB.Close()) })
			versionQuery := "SELECT version()"
			if dialect == "sqlite" {
				versionQuery = "SELECT sqlite_version()"
			}
			var version string
			require.NoError(t, db.Raw(versionQuery).Scan(&version).Error)
			t.Logf("database=%s version=%s", dialect, version)
			savedDB, savedCache := DB, CacheQuotaData
			DB = db
			CacheQuotaData = make(map[string]*QuotaData)
			t.Cleanup(func() { DB = savedDB; CacheQuotaData = savedCache })
			for _, upgrade := range []bool{false, true} {
				require.NoError(t, db.Migrator().DropTable(&QuotaData{}))
				if upgrade {
					require.NoError(t, db.AutoMigrate(&quotaDataBeforeCache{}))
					require.NoError(t, db.Create(&quotaDataBeforeCache{UserID: 1, Username: "alice", ModelName: "model-a", CreatedAt: 3600, Count: 1, Quota: 17, TokenUsed: 30}).Error)
				}
				for range 2 {
					require.NoError(t, db.AutoMigrate(&QuotaData{}))
				}
				assert.True(t, db.Migrator().HasIndex(&QuotaData{}, "idx_qdt_created_at"))
				assert.True(t, db.Migrator().HasIndex(&QuotaData{}, "idx_qdt_model_user_name"))
				if upgrade {
					var old QuotaData
					require.NoError(t, db.First(&old).Error)
					assert.Equal(t, CacheUsageStats{}, old.CacheUsageStats)
					assert.Equal(t, 17, old.Quota)
					assert.Equal(t, int64(0), old.CacheReadTokens)
					assert.Equal(t, int64(0), old.CacheCreationTokens)
				}
				for range 2 {
					LogQuotaData(QuotaDataLogParams{UserID: 1, Username: "alice", ModelName: "model-a", CreatedAt: 3605, Quota: 20, TokenUsed: 300, CacheReadTokens: 80, CacheCreationTokens: 10, CacheUsageStats: CacheUsageStats{CacheStatsInputTokens: 200, CacheStatsReadTokens: 80, CacheStatsWriteTokens: 10, CacheStatsCount: 1}})
				}
				SaveQuotaDataCache()
				// A later flush must add to the same hour, not replace its counters.
				LogQuotaData(QuotaDataLogParams{UserID: 1, Username: "alice", ModelName: "model-a", CreatedAt: 3610, Quota: 10, TokenUsed: 100, CacheReadTokens: 40, CacheCreationTokens: 5, CacheUsageStats: CacheUsageStats{CacheStatsInputTokens: 100, CacheStatsReadTokens: 40, CacheStatsWriteTokens: 5, CacheStatsCount: 1}})
				LogQuotaData(QuotaDataLogParams{UserID: 2, Username: "bob", ModelName: "model-a", CreatedAt: 3610, Quota: 99, TokenUsed: 900, CacheReadTokens: 700, CacheUsageStats: CacheUsageStats{CacheStatsInputTokens: 800, CacheStatsReadTokens: 700, CacheStatsCount: 1}})
				SaveQuotaDataCache()
				own, err := GetQuotaDataByUserId(1, 3600, 7199)
				require.NoError(t, err)
				require.Len(t, own, 1)
				wantCount, wantQuota, wantTokens := 3, 50, 700
				if upgrade {
					wantCount++
					wantQuota += 17
					wantTokens += 30
				}
				assert.Equal(t, wantCount, own[0].Count)
				assert.Equal(t, wantQuota, own[0].Quota)
				assert.Equal(t, wantTokens, own[0].TokenUsed)
				assert.Equal(t, int64(200), own[0].CacheReadTokens)
				assert.Equal(t, int64(25), own[0].CacheCreationTokens)
				assert.Equal(t, CacheUsageStats{CacheStatsInputTokens: 500, CacheStatsReadTokens: 200, CacheStatsWriteTokens: 25, CacheStatsCount: 3}, own[0].CacheUsageStats)
				byName, err := GetQuotaDataByUsername("alice", 3600, 7199)
				require.NoError(t, err)
				require.Len(t, byName, 1)
				assert.Equal(t, int64(200), byName[0].CacheReadTokens)
				all, err := GetAllQuotaDates(3600, 7199, "")
				require.NoError(t, err)
				require.Len(t, all, 1)
				assert.Equal(t, int64(900), all[0].CacheReadTokens)
				assert.Equal(t, CacheUsageStats{CacheStatsInputTokens: 1300, CacheStatsReadTokens: 900, CacheStatsWriteTokens: 25, CacheStatsCount: 4}, all[0].CacheUsageStats)
				excluded, err := GetQuotaDataByUserId(1, 7200, 8000)
				require.NoError(t, err)
				assert.Empty(t, excluded)
			}
			testQuotaCacheHistoryBackfill(t, db, dialect)
		})
	}
}
