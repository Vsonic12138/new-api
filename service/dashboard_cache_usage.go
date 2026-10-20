package service

import (
	"github.com/QuantumNous/new-api/model"
	"github.com/QuantumNous/new-api/relaykit/dto"
	"math"
)

// BuildDashboardCacheUsage normalizes actual input counts for statistics only;
// it never changes the billing usage, price, reservation, or settled quota.
func BuildDashboardCacheUsage(usage *dto.Usage, anthropic, localCount bool) model.CacheUsageStats {
	var stats model.CacheUsageStats
	if usage == nil || localCount || (usage.BillingUsage != nil && usage.BillingUsage.Estimated) {
		return stats
	}
	effective := effectiveBillingUsage(usage)
	for _, count := range []int{effective.PromptTokens, effective.InputTokens, effective.PromptTokensDetails.CachedTokens, effective.PromptTokensDetails.CachedCreationTokens, effective.PromptTokensDetails.CacheWriteTokens, effective.ClaudeCacheCreation5mTokens, effective.ClaudeCacheCreation1hTokens} {
		if count < 0 || int64(count) > math.MaxInt32 {
			return stats
		}
	}
	read, write := int64(effective.PromptTokensDetails.CachedTokens), int64(effective.PromptTokensDetails.CacheCreationTokensTotal())
	if split := int64(effective.ClaudeCacheCreation5mTokens) + int64(effective.ClaudeCacheCreation1hTokens); split > 0 {
		write = split
	}
	input := int64(effective.PromptTokens)
	reported := effective.PromptTokensDetails.CachedTokensReported
	if effective.InputTokensDetails != nil {
		reported = reported || effective.InputTokensDetails.CachedTokensReported
	}
	if raw := usage.BillingUsage; raw != nil {
		if raw.OpenAIUsage != nil {
			reported = reported || raw.OpenAIUsage.PromptTokensDetails.CachedTokensReported
			if raw.OpenAIUsage.InputTokensDetails != nil {
				reported = reported || raw.OpenAIUsage.InputTokensDetails.CachedTokensReported
			}
		}
		if raw.ClaudeUsage != nil {
			reported = reported || raw.ClaudeUsage.CacheReadReported
		}
	}
	// Presence may be lost by older adapters that construct DTOs manually. A
	// positive count still proves a cache report; an unmarked zero stays unknown.
	reported = reported || read > 0 || write > 0
	if !reported || input < 0 || read < 0 || write < 0 || input > math.MaxInt32 || read > math.MaxInt32 || write > math.MaxInt32 {
		return stats
	}
	if anthropic {
		input += read + write
	} else if effective.InputTokens > 0 {
		input = int64(effective.InputTokens)
	}
	if input <= 0 || read > input {
		return stats
	}
	return model.CacheUsageStats{CacheStatsInputTokens: input, CacheStatsReadTokens: read, CacheStatsWriteTokens: write, CacheStatsCount: 1}
}
