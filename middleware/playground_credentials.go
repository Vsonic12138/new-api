package middleware

import (
  "net/http"
  "strconv"
  "strings"

  "github.com/QuantumNous/new-api/common"
  "github.com/QuantumNous/new-api/constant"
  "github.com/QuantumNous/new-api/model"
  "github.com/QuantumNous/new-api/service"
  "github.com/gin-gonic/gin"
)

// PlaygroundCredentialSelector allows a logged-in user to choose one of their
// own existing API tokens by ID without ever sending the plaintext token to
// the browser. The selected token is validated through ordinary TokenAuth:
// expiry, quota, IP, status, model limits and group semantics stay intact.
//
// Must be registered AFTER UserAuth and BEFORE Distribute on the /pg routes.
func PlaygroundCredentialSelector() gin.HandlerFunc {
  return func(c *gin.Context) {
    tokenIDText := strings.TrimSpace(c.GetHeader("X-Playground-Token-ID"))
    requestedGroup := strings.TrimSpace(c.GetHeader("X-Playground-Group"))

    if tokenIDText == "" {
      // Account mode uses the logged-in user's group permissions, never a
      // client-provided arbitrary group or upstream channel.
      if requestedGroup != "" {
        userGroup := c.GetString("user_group")
        if userGroup == "" {
          userGroup = c.GetString("group")
        }
        if requestedGroup != userGroup && !service.GroupInUserUsableGroups(userGroup, requestedGroup) {
          c.JSON(http.StatusForbidden, gin.H{"error": gin.H{"message":"Requested group is not permitted"}})
          c.Abort()
          return
        }
        common.SetContextKey(c, constant.ContextKeyUsingGroup, requestedGroup)
      }
      c.Next()
      return
    }

    // A selected token has its own immutable/auto group. Do not permit
    // overwriting it using the separate account-group selection header.
    if requestedGroup != "" {
      c.JSON(http.StatusBadRequest, gin.H{"error":gin.H{"message":"Group is fixed by the selected token"}})
      c.Abort()
      return
    }
    tokenID, err := strconv.Atoi(tokenIDText)
    if err != nil || tokenID <= 0 {
      c.JSON(http.StatusBadRequest, gin.H{"error":gin.H{"message":"Invalid token selection"}})
      c.Abort()
      return
    }
    token, err := model.GetTokenByIds(tokenID, c.GetInt("id"))
    if err != nil || token == nil {
      c.JSON(http.StatusForbidden, gin.H{"error":gin.H{"message":"Selected token does not belong to this user"}})
      c.Abort()
      return
    }
    c.Set("image_playground_selected_token", true)

    // Reuse ordinary TokenAuth rather than duplicating security checks.
    // Authorization is only present within this server request pipeline,
    // never in a JSON response. The next middleware scrubs the header before
    // Distribute or Relay sees it.
    original := c.GetHeader("Authorization")
    c.Request.Header.Set("Authorization", "Bearer sk-"+token.Key)
    TokenAuth()(c) // TokenAuth calls c.Next() and executes downstream handlers.
    if original == "" {
      c.Request.Header.Del("Authorization")
    } else {
      c.Request.Header.Set("Authorization", original)
    }
  }
}

// StripPlaygroundAuthorization runs after TokenAuth has validated the chosen
// token and populated the Gin context, but before any channel relay/handler.
func StripPlaygroundAuthorization() gin.HandlerFunc {
  return func(c *gin.Context) {
    c.Request.Header.Del("Authorization")
    c.Next()
  }
}
