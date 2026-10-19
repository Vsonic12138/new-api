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

func TestPlaygroundImageToolChecksSelectedTokenModelLimits(t *testing.T) {
  imageModel := "gpt-image-2.5-flare"
  if !playgroundImageToolAllowed(imageModel, false, nil) {
    t.Fatal("account mode should accept whitelisted image model")
  }
  if playgroundImageToolAllowed(imageModel, true, map[string]bool{"gpt-5": true}) {
    t.Fatal("text-only token must not bypass image model restriction via Responses tool")
  }
  if !playgroundImageToolAllowed(imageModel, true, map[string]bool{imageModel: true}) {
    t.Fatal("selected token permitting the image model must be accepted")
  }
  if playgroundImageToolAllowed("gpt-image-2", false, nil) {
    t.Fatal("unsupported image model must always be rejected")
  }
}
