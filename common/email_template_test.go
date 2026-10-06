package common

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestBuildEmailHTML_VerificationCode(t *testing.T) {
	SystemName = "大黄API"
	Logo = "https://bigyellow-welcome.pages.dev/logo.svg"
	SMTPFrom = "noreply@vsonic12138.shop"

	htmlContent := BuildEmailHTML(EmailCardOptions{
		Title:        "邮箱安全验证",
		Subtitle:     "您好！您正在进行 大黄API 的账号邮箱验证，请在验证窗口输入下方验证码：",
		Code:         "859203",
		ValidMinutes: 10,
	})

	require.NotEmpty(t, htmlContent)
	assert.Contains(t, htmlContent, "大黄API")
	assert.Contains(t, htmlContent, "859203")
	assert.Contains(t, htmlContent, "10 分钟")
	assert.Contains(t, htmlContent, "收信温馨提示")
	assert.Contains(t, htmlContent, "垃圾箱 / 垃圾邮件")
	assert.Contains(t, htmlContent, "noreply@vsonic12138.shop")
	assert.Contains(t, htmlContent, "logo-bigyellow.png") // SVG falls back to PNG for email clients
}

func TestBuildEmailHTML_PasswordResetButton(t *testing.T) {
	SystemName = "大黄API"

	htmlContent := BuildEmailHTML(EmailCardOptions{
		Title:          "密码重置申请",
		Subtitle:       "您好！您正在请求重置 大黄API 的账号登录密码：",
		ButtonText:     "立即重置密码",
		ButtonURL:      "https://newapi.vsonic12138.shop/user/reset?token=test123456",
		ValidMinutes:   15,
		SecurityNotice: "如果您没有发起请求，请忽略。",
	})

	require.NotEmpty(t, htmlContent)
	assert.Contains(t, htmlContent, "立即重置密码")
	assert.Contains(t, htmlContent, "https://newapi.vsonic12138.shop/user/reset?token=test123456")
	assert.Contains(t, htmlContent, "15 分钟")
	assert.Contains(t, htmlContent, "如果您没有发起请求，请忽略。")
}

func TestBuildEmailHTML_EscapingSecurity(t *testing.T) {
	htmlContent := BuildEmailHTML(EmailCardOptions{
		Title:    "<script>alert(1)</script>",
		Subtitle: "<img src=x onerror=alert(2)>",
		Code:     "123<456>",
	})

	assert.NotContains(t, htmlContent, "<script>")
	assert.Contains(t, htmlContent, "&lt;script&gt;alert(1)&lt;/script&gt;")
	assert.NotContains(t, htmlContent, "<img src=x")
	assert.Contains(t, htmlContent, "&lt;img src=x onerror=alert(2)&gt;")
	assert.Contains(t, htmlContent, "123&lt;456&gt;")
}
