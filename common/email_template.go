package common

import (
	"fmt"
	"html"
	"strings"
)

// EmailCardOptions defines options for constructing responsive, branded HTML email cards.
type EmailCardOptions struct {
	Title          string // Card title, e.g. "邮箱安全验证"
	Subtitle       string // Subtitle description, e.g. "您好！您正在进行 大黄API 的账号邮箱验证..."
	Code           string // 6-digit verification code (optional)
	ButtonText     string // Primary action button text (optional)
	ButtonURL      string // Primary action button link (optional)
	ValidMinutes   int    // Valid duration in minutes (0 if not applicable)
	SecurityNotice string // Security notice (optional)
}

// GetServerAddress returns the normalized base server URL.
func GetServerAddress() string {
	OptionMapRWMutex.RLock()
	addr := OptionMap["ServerAddress"]
	OptionMapRWMutex.RUnlock()

	addr = strings.TrimSpace(addr)
	if addr != "" {
		return strings.TrimRight(addr, "/")
	}
	return "https://newapi.vsonic12138.shop"
}

// GetEmailLogoURL returns a compatible PNG logo URL for email clients.
func GetEmailLogoURL() string {
	serverAddr := GetServerAddress()
	OptionMapRWMutex.RLock()
	logo := strings.TrimSpace(Logo)
	OptionMapRWMutex.RUnlock()

	// Most major email clients (Gmail, Outlook) do not render SVG files in emails.
	// Fall back to the PNG version of the branded logo.
	if logo == "" || strings.HasSuffix(strings.ToLower(logo), ".svg") {
		return serverAddr + "/logo-bigyellow.png"
	}
	return logo
}

// GetSMTPFromAddress returns the current sender address.
func GetSMTPFromAddress() string {
	if SMTPFrom != "" {
		return SMTPFrom
	}
	if SMTPAccount != "" {
		return SMTPAccount
	}
	return "noreply@vsonic12138.shop"
}

// BuildEmailHTML generates a modern, responsive card-style HTML email body.
func BuildEmailHTML(opts EmailCardOptions) string {
	serverAddr := GetServerAddress()
	logoURL := GetEmailLogoURL()
	fromEmail := GetSMTPFromAddress()
	sysName := SystemName
	if sysName == "" {
		sysName = "New API"
	}

	escapedSysName := html.EscapeString(sysName)
	escapedTitle := html.EscapeString(opts.Title)
	escapedSubtitle := html.EscapeString(opts.Subtitle)
	escapedCode := html.EscapeString(opts.Code)
	escapedButtonText := html.EscapeString(opts.ButtonText)
	escapedButtonURL := html.EscapeString(opts.ButtonURL)
	escapedSecurityNotice := html.EscapeString(opts.SecurityNotice)
	escapedFromEmail := html.EscapeString(fromEmail)

	var sb strings.Builder
	sb.WriteString(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>`)
	sb.WriteString(escapedTitle)
	sb.WriteString(`</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#1e293b;line-height:1.6;">
  <div style="padding:32px 16px;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px -5px rgba(0,0,0,0.05),0 8px 10px -6px rgba(0,0,0,0.04);border:1px solid #e2e8f0;">
      <!-- Top brand gradient bar -->
      <div style="height:5px;background:linear-gradient(90deg, #f59e0b 0%, #ef4444 50%, #3b82f6 100%);"></div>
      
      <!-- Content Area -->
      <div style="padding:32px 32px 24px 32px;">
        <!-- Header: Logo + System Name -->
        <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
          <tr>
            <td style="vertical-align:middle;">
              <img src="`)
	sb.WriteString(logoURL)
	sb.WriteString(`" width="44" height="44" style="display:block;border-radius:10px;border:1px solid #f1f5f9;" alt="`)
	sb.WriteString(escapedSysName)
	sb.WriteString(`">
            </td>
            <td style="vertical-align:middle;padding-left:12px;">
              <span style="font-size:20px;font-weight:700;color:#0f172a;letter-spacing:-0.3px;">`)
	sb.WriteString(escapedSysName)
	sb.WriteString(`</span>
            </td>
          </tr>
        </table>

        <!-- Main Heading -->
        <h2 style="margin:0 0 8px 0;font-size:18px;font-weight:700;color:#0f172a;">`)
	sb.WriteString(escapedTitle)
	sb.WriteString(`</h2>
        <p style="margin:0 0 20px 0;font-size:14px;color:#475569;">`)
	sb.WriteString(escapedSubtitle)
	sb.WriteString(`</p>`)

	if opts.Code != "" {
		sb.WriteString(`
        <!-- Verification Code Card -->
        <div style="margin:24px 0;padding:20px 16px;background-color:#f8fafc;border:2px dashed #cbd5e1;border-radius:12px;text-align:center;">
          <div style="font-size:13px;color:#64748b;margin-bottom:8px;font-weight:500;">您的 6 位数字验证码</div>
          <div style="font-family:'Courier New',Consolas,Monaco,monospace;font-size:36px;font-weight:800;letter-spacing:8px;color:#2563eb;user-select:all;">`)
		sb.WriteString(escapedCode)
		sb.WriteString(`</div>
        </div>`)
	}

	if opts.ButtonURL != "" {
		btnText := escapedButtonText
		if btnText == "" {
			btnText = "立即操作"
		}
		sb.WriteString(`
        <!-- Action Button -->
        <div style="margin:28px 0 20px 0;text-align:center;">
          <a href="`)
		sb.WriteString(escapedButtonURL)
		sb.WriteString(`" style="display:inline-block;padding:14px 36px;background-color:#2563eb;color:#ffffff;text-decoration:none;border-radius:10px;font-size:16px;font-weight:600;box-shadow:0 4px 12px rgba(37,99,235,0.3);">`)
		sb.WriteString(btnText)
		sb.WriteString(`</a>
        </div>
        <div style="margin:0 0 24px 0;padding:12px;background:#f8fafc;border-radius:8px;font-size:12px;color:#64748b;word-break:break-all;line-height:1.5;">
          如果上方按钮无法点击，请复制以下链接在浏览器地址栏打开：<br>
          <a href="`)
		sb.WriteString(escapedButtonURL)
		sb.WriteString(`" style="color:#2563eb;text-decoration:underline;">`)
		sb.WriteString(escapedButtonURL)
		sb.WriteString(`</a>
        </div>`)
	}

	sb.WriteString(`
        <!-- Expiration & Security -->
        <div style="font-size:13px;color:#64748b;line-height:1.6;margin-bottom:20px;">`)
	if opts.ValidMinutes > 0 {
		sb.WriteString(fmt.Sprintf(`
          ⏰ <strong>有效期限：</strong>此操作在 <strong>%d 分钟</strong>内有效，请尽快完成。<br>`, opts.ValidMinutes))
	}
	if opts.SecurityNotice != "" {
		sb.WriteString(`
          🛡️ <strong>安全提醒：</strong>`)
		sb.WriteString(escapedSecurityNotice)
	} else {
		sb.WriteString(`
          🛡️ <strong>安全提醒：</strong>如非您本人操作，请忽略此邮件，切勿将验证信息泄露给任何人。`)
	}
	sb.WriteString(`
        </div>

        <!-- Spam Reminder Box -->
        <div style="padding:14px 16px;background-color:#fffbeb;border:1px solid #fef3c7;border-left:4px solid #f59e0b;border-radius:8px;">
          <div style="font-size:13px;font-weight:700;color:#92400e;margin-bottom:4px;">📬 收信温馨提示</div>
          <div style="font-size:12px;color:#b45309;line-height:1.6;">
            若您未在收件箱中收到后续通知邮件，请检查邮箱的<strong>【垃圾箱 / 垃圾邮件】</strong>或拦截记录，并建议将发信地址 <code>`)
	sb.WriteString(escapedFromEmail)
	sb.WriteString(`</code> 添加为白名单联系人。
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="padding:20px 32px;background-color:#f8fafc;border-top:1px solid #f1f5f9;text-align:center;">
        <p style="margin:0 0 6px 0;font-size:12px;color:#94a3b8;">
          此邮件由系统自动发出，请勿直接回复。
        </p>
        <p style="margin:0;font-size:12px;color:#94a3b8;">
          <a href="`)
	sb.WriteString(html.EscapeString(serverAddr))
	sb.WriteString(`" style="color:#64748b;text-decoration:none;">`)
	sb.WriteString(html.EscapeString(serverAddr))
	sb.WriteString(`</a> · `)
	sb.WriteString(escapedSysName)
	sb.WriteString(` 保留所有权利
        </p>
      </div>
    </div>
  </div>
</body>
</html>`)

	return sb.String()
}
