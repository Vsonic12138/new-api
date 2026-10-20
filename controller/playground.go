package controller

import (
	"errors"
	"fmt"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/constant"
	"github.com/QuantumNous/new-api/i18n"
	"github.com/QuantumNous/new-api/middleware"
	"github.com/QuantumNous/new-api/model"
	relaycommon "github.com/QuantumNous/new-api/relay/common"
	"github.com/QuantumNous/new-api/relaykit/types"

	"github.com/gin-gonic/gin"
)

func Playground(c *gin.Context) {
	playgroundRelay(c, types.RelayFormatOpenAI)
}

func playgroundImageModelAllowed(modelName string) bool {
	return modelName == "gpt-image-2.5-flare" || modelName == "gpt-image-2.5-sunburst"
}

func PlaygroundImage(c *gin.Context) {
	// Even account mode cannot use this product endpoint for other image models.
	if !playgroundImageModelAllowed(c.GetString("original_model")) {
		c.JSON(400, gin.H{"error": gin.H{"message": "Only GPT Image 2.5 Flare and Sunburst are available in this Playground"}})
		return
	}
	playgroundRelay(c, types.RelayFormatOpenAIImage)
}

// A token limited to text models must not bypass those limits by embedding an
// image_generation tool inside an otherwise authorized Responses request.
func playgroundImageToolAllowed(modelName string, limited bool, limits map[string]bool) bool {
	if !playgroundImageModelAllowed(modelName) {
		return false
	}
	return !limited || middleware.TokenModelLimitAllows(limits, modelName)
}

func PlaygroundResponses(c *gin.Context) {
	// Preserve general LLM/VLM Responses requests; restrict only image tool
	// models. The top-level mainline model is selected from the user's normal
	// authorized model catalogue and is NOT limited to the two image models.
	var request struct {
		Tools []struct {
			Type  string `json:"type"`
			Model string `json:"model"`
		} `json:"tools"`
	}
	if err := common.UnmarshalBodyReusable(c, &request); err != nil {
		c.JSON(400, gin.H{"error": gin.H{"message": "Invalid Responses request"}})
		return
	}
	limited := common.GetContextKeyBool(c, constant.ContextKeyTokenModelLimitEnabled)
	rawLimits, _ := common.GetContextKey(c, constant.ContextKeyTokenModelLimit)
	limits, _ := rawLimits.(map[string]bool)
	for _, tool := range request.Tools {
		if tool.Type != "image_generation" {
			continue
		}
		if !playgroundImageModelAllowed(tool.Model) {
			c.JSON(400, gin.H{"error": gin.H{"message": "Image tool must use GPT Image 2.5 Flare or Sunburst"}})
			return
		}
		if !playgroundImageToolAllowed(tool.Model, limited, limits) {
			c.JSON(403, gin.H{"error": gin.H{"message": "Selected token does not allow this image tool model"}})
			return
		}
	}
	playgroundRelay(c, types.RelayFormatOpenAIResponses)
}

func playgroundRelay(c *gin.Context, format types.RelayFormat) {
	// Token-ID mode was fully verified in PlaygroundCredentialSelector using
	// ordinary TokenAuth and already carries the user's actual token context.
	// Never replace it with a synthetic unlimited Playground token.
	if c.GetBool("image_playground_selected_token") {
		Relay(c, format)
		return
	}

	var newAPIError *types.NewAPIError

	defer func() {
		if newAPIError != nil {
			c.JSON(newAPIError.StatusCode, gin.H{
				"error": newAPIError.ToOpenAIError(common.UpstreamAddresses(c)...),
			})
		}
	}()

	useAccessToken := c.GetBool("use_access_token")
	if useAccessToken {
		newAPIError = types.NewError(errors.New(i18n.T(c, i18n.MsgRelayAccessTokenUnsupported)), types.ErrorCodeAccessDenied, types.ErrOptionWithSkipRetry())
		return
	}

	relayInfo, err := relaycommon.GenRelayInfo(c, format, nil, nil)
	if err != nil {
		newAPIError = types.NewError(err, types.ErrorCodeInvalidRequest, types.ErrOptionWithSkipRetry())
		return
	}

	userId := c.GetInt("id")

	// Write user context to ensure acceptUnsetRatio is available
	userCache, err := model.GetUserCache(userId)
	if err != nil {
		newAPIError = types.NewError(err, types.ErrorCodeQueryDataError, types.ErrOptionWithSkipRetry())
		return
	}
	userCache.WriteContext(c)

	tempToken := &model.Token{
		UserId: userId,
		Name:   fmt.Sprintf("playground-%s", relayInfo.UsingGroup),
		Group:  relayInfo.UsingGroup,
	}
	_ = middleware.SetupContextForToken(c, tempToken)

	Relay(c, format)
}
