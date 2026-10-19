package controller

import "testing"

func TestPlaygroundImageModelAllowlist(t *testing.T) {
  allowed := []string{"gpt-image-2.5-flare", "gpt-image-2.5-sunburst"}
  for _, modelName := range allowed {
    if !playgroundImageModelAllowed(modelName) {
      t.Errorf("model %q should be allowed", modelName)
    }
  }
  disallowed := []string{"", "gpt-image-1", "gpt-image-2", "gpt-image-2.5-flare-preview", "gpt-5", "dall-e-3"}
  for _, modelName := range disallowed {
    if playgroundImageModelAllowed(modelName) {
      t.Errorf("model %q should not be an image output model", modelName)
    }
  }
}
