/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

export const DOCS_ORIGIN = 'https://newapi.vsonic12138.shop'
export const DOCS_OPENAI_BASE_URL = `${DOCS_ORIGIN}/v1`
export const DOCS_CARD_SHOP_URL = 'https://wzyp.cn/shop/XE6S10RT'
export const CC_SWITCH_RELEASES_URL =
  'https://github.com/farion1231/cc-switch/releases/latest'
export const CODEX_DOWNLOAD_URL = 'https://openai.com/zh-Hans-CN/codex/'
export const DOCS_MCP_CONFIG = `{
  "mcpServers": {
    "imagegen": {
      "command": "npx",
      "args": ["-y", "@bigyellow12138/imagegen-mcp"],
      "env": { "IMAGE_API_TOKEN": "sk-your-api-token" },
      "timeoutMs": 180000
    }
  }
}`
export const CLAUDE_MCP_ADD = `claude mcp add imagegen \\
  -e IMAGE_API_TOKEN=sk-your-api-token \\
  -- npx -y @bigyellow12138/imagegen-mcp`

export const CODEX_MCP_CONFIG = `[mcp_servers.imagegen]
command = "npx"
args = ["-y", "@bigyellow12138/imagegen-mcp"]
env = { IMAGE_API_TOKEN = "sk-your-api-token" }
startup_timeout_sec = 20
tool_timeout_sec = 300`

export const IMAGE_CURL = `curl ${DOCS_ORIGIN}/v1/images/generations \\
  -H "Authorization: Bearer sk-your-api-token" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-image-2.5-flare",
    "prompt": "雨夜的东京小巷，霓虹灯倒映在积水里",
    "size": "1024x1024",
    "n": 1
  }'`

export const IMAGE_PYTHON = `from openai import OpenAI
import base64

client = OpenAI(
    base_url="${DOCS_OPENAI_BASE_URL}",
    api_key="sk-your-api-token",
)

result = client.images.generate(
    model="gpt-image-2.5-flare",
    prompt="雨夜的东京小巷，霓虹灯倒映在积水里",
    size="1024x1024",
    n=1,
)

image = result.data[0]
if getattr(image, "b64_json", None):
    open("out.png", "wb").write(base64.b64decode(image.b64_json))
else:
    print(image.url)`

export const CC_SWITCH_SITE_URL = 'https://ccswitch.io'

export const CLAUDE_CODE_SETTINGS = `{
  "env": {
    "ANTHROPIC_BASE_URL": "${DOCS_ORIGIN}",
    "ANTHROPIC_AUTH_TOKEN": "sk-your-api-token"
  }
}`

export const CODEX_CONFIG = `model_provider = "dahua"
model = "gpt-6.1-sol"

[model_providers.dahua]
name = "Dahua API"
base_url = "${DOCS_OPENAI_BASE_URL}"
wire_api = "responses"
env_key = "DAHUA_API_KEY"
requires_openai_auth = false`

export const CODEX_ENV_UNIX = 'export DAHUA_API_KEY="sk-your-api-token"'
export const CODEX_ENV_WINDOWS = '$env:DAHUA_API_KEY="sk-your-api-token"'

export const DOCS_NAV = [
  { to: '/docs', titleKey: 'Start here' },
  { to: '/docs/register', titleKey: 'Create an account' },
  { to: '/docs/topup', titleKey: 'Add quota with a redemption code' },
  { to: '/docs/token', titleKey: 'Create an API key' },
  { to: '/docs/endpoint', titleKey: 'API addresses' },
  { to: '/docs/cc-switch', titleKey: 'Set up CC Switch' },
  { to: '/docs/claude-code', titleKey: 'Set up Claude Code' },
  { to: '/docs/codex', titleKey: 'Set up Codex' },
] as const

export type DocsPath = (typeof DOCS_NAV)[number]['to']

export function isDocsNavActive(pathname: string, to: DocsPath) {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  if (to === '/docs') return path === '/docs'
  return path === to
}
