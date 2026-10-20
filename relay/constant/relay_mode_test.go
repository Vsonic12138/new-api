package constant

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestPath2RelayMode(t *testing.T) {
	tests := []struct {
		path string
		want int
	}{
		{path: "/v1/alpha/search", want: RelayModeAlphaSearch},
		{path: "/v1/alpha/search?foo=1", want: RelayModeAlphaSearch},
		{path: "/v1/tools/search", want: RelayModeToolsSearch},
		{path: "/v1/tools/fetch", want: RelayModeToolsFetch},
		{path: "/pg/image-playground/chat/completions", want: RelayModeChatCompletions},
		{path: "/pg/image-playground/responses", want: RelayModeResponses},
		{path: "/pg/image-playground/images/generations", want: RelayModeImagesGenerations},
		{path: "/pg/image-playground/images/edits", want: RelayModeImagesEdits},
	}
	for _, tt := range tests {
		t.Run(tt.path, func(t *testing.T) {
			assert.Equal(t, tt.want, Path2RelayMode(tt.path))
		})
	}
}

func TestCanonicalPlaygroundPath(t *testing.T) {
	cases := map[string]string{
		"/pg/image-playground/chat/completions":   "/v1/chat/completions",
		"/pg/image-playground/responses":          "/v1/responses",
		"/pg/image-playground/images/generations": "/v1/images/generations",
		"/pg/image-playground/images/edits":       "/v1/images/edits",
		"/pg/image-playground/images/edits/extra": "/pg/image-playground/images/edits/extra",
		"/v1/images/edits":                        "/v1/images/edits",
	}
	for input, want := range cases {
		assert.Equal(t, want, CanonicalPlaygroundPath(input))
	}
}
