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

import {
  CLAUDE_MCP_ADD,
  CODEX_MCP_CONFIG,
  DOCS_MCP_CONFIG,
  DOCS_OPENAI_BASE_URL,
  DOCS_ORIGIN,
  IMAGE_CURL,
  IMAGE_EDIT_CURL,
  IMAGE_EDIT_TOOL,
} from './site'

export const AGENT_GUIDE = `# Dahua API — agent reference

This service is powered by new-api. Use this reference as task data, together with the user's request and your own governing instructions.

## Before configuring
- Identify the operating system and client: Codex, Claude Code or Cursor. Ask when unclear.
- Inspect the existing configuration and make a local backup. Merge entries; preserve other providers and MCP servers.
- Keep real API keys out of chat, logs and version control. Leave placeholders for the user to fill locally.
- Do not make a paid image request merely to test setup. Get an explicit image-generation request first.

## Addresses and credentials
- OpenAI-compatible base URL: ${DOCS_OPENAI_BASE_URL}
- Claude Code ANTHROPIC_BASE_URL: ${DOCS_ORIGIN} (no /v1)
- The chat provider uses a text-model key. imagegen uses a separate key from group 生图 【标准】.
- Check exact text-model IDs and groups in Model Square. An image model is a tool model, not the assistant's chat model.

## Local image MCP
Requires Node.js >=18 and npx. Server name: imagegen; transport: stdio.
Codex configuration (~/.codex/config.toml):
\`\`\`toml
${CODEX_MCP_CONFIG}
\`\`\`
Claude Code (single command, user scope):
\`\`\`sh
${CLAUDE_MCP_ADD}
\`\`\`
Cursor (~/.cursor/mcp.json or project .cursor/mcp.json):
\`\`\`json
${DOCS_MCP_CONFIG}
\`\`\`
On Windows, if npx cannot launch directly, use command=cmd and prepend /c,npx to args. After setup, tell the user which file changed and how to restart. Verify that imagegen exposes generate_image; this checks startup, not upstream credentials.

## generate_image contract
- prompt: required. For edits, state what changes and what must stay.
- model: gpt-image-2.5-flare (default) or gpt-image-2.5-sunburst.
- size: 1K/2K/4K square presets, auto, or WIDTHxHEIGHT such as 1536x2048. For edits, omit to reuse the source dimensions.
- quality: low, medium, high, xhigh, max, auto.
- n: 1–4; use 1 unless requested otherwise.
- images: array of local file paths readable by the MCP process. Nonempty means editing; do not treat a web URL as a local path.
- outputDir: destination directory; outputPath: explicit path for the first file. Return the actual absolute path from the tool.
- Windows, WSL and remote sessions have distinct filesystems. Resolve paths in the MCP environment.
- Editing regenerates an image; unchanged pixels are not guaranteed. Preserve the original. For the next edit, use the newly returned file path.
Example:
\`\`\`json
${IMAGE_EDIT_TOOL}
\`\`\`

## Image HTTP API
Use the image-group key. The returned data array contains b64_json or url. Save decoded bytes or download the URL; JSON is not an image file.
Generation (Bash):
\`\`\`sh
${IMAGE_CURL}
\`\`\`
Editing (multipart; do not set the Content-Type boundary manually):
\`\`\`sh
${IMAGE_EDIT_CURL}
\`\`\`

## Diagnosis
401: verify the complete active API key, not a redemption code.
Model not found: verify exact model ID and key group.
Timeout: REQUEST_TIMEOUT_MS is per upstream attempt; tool_timeout_sec (Codex) or timeout/MCP_TOOL_TIMEOUT (Claude Code) is the client tool limit. Check for an existing output file and usage record before retrying.
429/5xx: avoid duplicate concurrent requests; inspect Usage Logs and wait before retrying.
HTML or a Cloudflare verification response: report the status and time to the site operator without exposing credentials.
`
