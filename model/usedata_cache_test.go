package model

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/QuantumNous/new-api/common"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
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
		})
	}
}
