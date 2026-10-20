// cache-backfill repairs historical dashboard cache counters without starting
// the gateway, migrating schemas, or accessing provider APIs. Build with:
// go build -o cache-backfill ./cmd/cache-backfill
//
// Reuse SQL_DSN, LOG_SQL_DSN and SQLITE_PATH from the gateway environment.
// --before is exclusive, RFC3339 and hour-aligned. Set it to the hour containing
// the original cache-dashboard rollout (that mixed hour is excluded).
// The default is a read-only preview. --apply enables compare-and-set updates.
package main

import (
	"context"
	"flag"
	"fmt"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"
	"github.com/glebarez/sqlite"
	"gorm.io/driver/mysql"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func main() {
	if err := run(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func run() error {
	flags := flag.NewFlagSet("cache-backfill", flag.ContinueOnError)
	before := flags.String("before", "", "exclusive RFC3339 hour at or before the original cache-dashboard rollout")
	from := flags.String("from", "", "inclusive RFC3339 hour (default: earliest quota row)")
	userID := flags.Int("user-id", 0, "limit to this user ID (0 means all users)")
	apply := flags.Bool("apply", false, "write eligible historical cache counters (default: preview only)")
	if err := flags.Parse(os.Args[1:]); err != nil {
		return err
	}
	if flags.NArg() != 0 {
		return fmt.Errorf("unexpected positional arguments")
	}
	end, err := time.Parse(time.RFC3339, *before)
	if err != nil {
		return fmt.Errorf("--before must be an explicit RFC3339 timestamp")
	}
	if end.Nanosecond() != 0 {
		return fmt.Errorf("--before must be hour-aligned")
	}
	options := model.CacheBackfillOptions{Before: end.Unix(), UserID: *userID, Apply: *apply}
	if *from != "" {
		start, err := time.Parse(time.RFC3339, *from)
		if err != nil {
			return fmt.Errorf("--from must be an RFC3339 timestamp")
		}
		if start.Nanosecond() != 0 {
			return fmt.Errorf("--from must be hour-aligned")
		}
		options.From = start.Unix()
	}
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	db, err := openDatabase("SQL_DSN")
	if err != nil {
		return err
	}
	sqlDB, err := db.DB()
	if err != nil {
		return err
	}
	defer sqlDB.Close()
	logDB := db
	if os.Getenv("LOG_SQL_DSN") != "" {
		logDB, err = openDatabase("LOG_SQL_DSN")
		if err != nil {
			return err
		}
		logSQL, err := logDB.DB()
		if err != nil {
			return err
		}
		defer logSQL.Close()
	}
	if *from == "" {
		var first struct{ CreatedAt int64 }
		query := db.WithContext(ctx).Model(&model.QuotaData{}).Select("created_at").Order("created_at").Limit(1)
		if options.UserID > 0 {
			query = query.Where("user_id = ?", options.UserID)
		}
		if err := query.Scan(&first).Error; err != nil {
			return err
		}
		if first.CreatedAt == 0 {
			return fmt.Errorf("no quota history found; no counters were changed")
		}
		options.From = first.CreatedAt / 3600 * 3600
	}
	report, err := model.BackfillDashboardCacheUsage(ctx, db, logDB, options)
	// Always emit partial progress, including after cancellation/failure. Applied
	// rows are individually atomic and a later run can safely resume.
	output, marshalErr := common.Marshal(struct {
		Options model.CacheBackfillOptions `json:"options"`
		Report  model.CacheBackfillReport  `json:"report"`
	}{options, report})
	if marshalErr != nil {
		return marshalErr
	}
	fmt.Println(string(output))
	return err
}

func openDatabase(envKey string) (*gorm.DB, error) {
	dsn := os.Getenv(envKey)
	var driver gorm.Dialector
	switch {
	case dsn == "" || strings.HasPrefix(dsn, "local"):
		path := os.Getenv("SQLITE_PATH")
		if path == "" {
			path = common.SQLitePath
		}
		filePath, _, _ := strings.Cut(path, "?")
		if _, err := os.Stat(strings.TrimPrefix(filePath, "file:")); err != nil {
			return nil, fmt.Errorf("SQLITE_PATH must refer to an existing gateway database")
		}
		driver = sqlite.Open(path)
	case strings.HasPrefix(dsn, "postgres://"), strings.HasPrefix(dsn, "postgresql://"):
		driver = postgres.New(postgres.Config{DSN: dsn, PreferSimpleProtocol: true})
	case strings.Contains(dsn, "://"):
		return nil, fmt.Errorf("%s: this maintenance tool supports SQLite, MySQL and PostgreSQL only", envKey)
	default:
		driver = mysql.Open(dsn)
	}
	db, err := gorm.Open(driver, &gorm.Config{Logger: logger.Default.LogMode(logger.Silent), DisableAutomaticPing: false})
	if err != nil {
		// Connection errors may contain DSN credentials; never echo them.
		return nil, fmt.Errorf("could not connect using %s; check the gateway database configuration", envKey)
	}
	return db, nil
}
