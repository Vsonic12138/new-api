package dto

import kitutil "github.com/QuantumNous/new-api/relaykit/relayconvert/kitutil"

// UnmarshalJSON retains whether an upstream explicitly reported a zero cache
// count. Wire output and existing token counters keep their original types.
func (u *InputTokenDetails) UnmarshalJSON(data []byte) error {
	type plain InputTokenDetails
	decoded := struct {
		*plain
		CachedTokens *int `json:"cached_tokens"`
	}{plain: (*plain)(u)}
	if err := kitutil.Unmarshal(data, &decoded); err != nil {
		return err
	}
	u.CachedTokensReported = decoded.CachedTokens != nil
	if decoded.CachedTokens != nil {
		u.CachedTokens = *decoded.CachedTokens
	}
	return nil
}

func (u *ClaudeUsage) UnmarshalJSON(data []byte) error {
	type plain ClaudeUsage
	decoded := struct {
		*plain
		CacheReadInputTokens *int `json:"cache_read_input_tokens"`
	}{plain: (*plain)(u)}
	if err := kitutil.Unmarshal(data, &decoded); err != nil {
		return err
	}
	u.CacheReadReported = decoded.CacheReadInputTokens != nil
	if decoded.CacheReadInputTokens != nil {
		u.CacheReadInputTokens = *decoded.CacheReadInputTokens
	}
	return nil
}
