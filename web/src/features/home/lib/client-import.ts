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
export const CLIENT_IMPORT_PLACEHOLDER_KEY = 'sk-your-api-token'

/**
 * Apps CC Switch accepts for a `ccswitch://` provider import.
 *
 * Pi is deliberately excluded: CC Switch rejects `app=pi` for providers
 * ("Pi providers must be added from the Pi provider page"), so a Pi deep link
 * only ever surfaces an error in the client.
 */
export type CCSwitchApp = 'claude' | 'codex' | 'opencode'

function trimTrailingSlashes(value: string) {
  return value.replace(/\/+$/, '')
}

function isLocalAddress(value: string) {
  return /localhost|127\.0\.0\.1|\[::1\]/i.test(value)
}

export function preferPublicOrigin(
  browserOrigin: string,
  configuredAddress: string,
  fallback: string
) {
  const browser = trimTrailingSlashes(browserOrigin.trim())
  const configured = trimTrailingSlashes(configuredAddress.trim())
  if (browser && !isLocalAddress(browser)) return browser
  if (configured && !isLocalAddress(configured)) return configured
  return browser || fallback
}

function toStandardBase64(value: string): string {
  if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
    const bytes = new TextEncoder().encode(value)
    let binary = ''
    for (const byte of bytes) binary += String.fromCharCode(byte)
    return window.btoa(binary)
  }
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(value, 'utf-8').toString('base64')
  }
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

export function buildCherryStudioImportUrl(input: {
  name: string
  apiHost: string
  apiKey?: string
}) {
  // Cherry Studio's built-in new-api provider expects the root server address
  // (without /v1), as it automatically appends version paths.
  const cleanHost = trimTrailingSlashes(input.apiHost).replace(/\/v1$/, '')
  const data = {
    id: 'new-api',
    name: input.name,
    baseUrl: cleanHost,
    apiHost: cleanHost,
    apiKey: input.apiKey || CLIENT_IMPORT_PLACEHOLDER_KEY,
  }
  return `cherrystudio://providers/api-keys?v=1&data=${encodeURIComponent(toStandardBase64(JSON.stringify(data)))}`
}

export function buildCCSwitchImportUrl(input: {
  app: CCSwitchApp
  name: string
  origin: string
  model?: string
  models?: Record<string, string>
  apiKey?: string
}) {
  const origin = trimTrailingSlashes(input.origin)
  // Claude Code speaks the Anthropic protocol from the site root, while the
  // OpenAI-compatible clients need the /v1 path.
  const endpoint = input.app === 'claude' ? origin : `${origin}/v1`
  const params = new URLSearchParams()
  params.set('resource', 'provider')
  params.set('app', input.app)
  params.set('name', input.name)
  params.set('endpoint', endpoint)
  params.set('apiKey', input.apiKey || CLIENT_IMPORT_PLACEHOLDER_KEY)
  if (input.model) params.set('model', input.model)
  for (const [key, value] of Object.entries(input.models ?? {})) {
    if (value) params.set(key, value)
  }
  params.set('homepage', origin)
  params.set('enabled', 'true')
  return `ccswitch://v1/import?${params.toString()}`
}

export function buildMagpieImportUrl(input: {
  name: string
  origin: string
  models?: string[]
  apiKey?: string
  preferProtocol?: 'web' | 'app'
}) {
  const origin = trimTrailingSlashes(input.origin)
  const params = new URLSearchParams()
  params.set('name', input.name)
  params.set('chat', `${origin}/v1`)
  params.set('anthropic', origin)
  params.set('key', input.apiKey || CLIENT_IMPORT_PLACEHOLDER_KEY)
  const models =
    input.models && input.models.length > 0
      ? input.models.join(',')
      : 'claude-sonnet-5,gpt-6.1-sol,deepseek-flash,glm-5.3-flash'
  params.set('models', models)
  params.set('website', origin)
  params.set('keys', `${origin}/keys`)

  if (input.preferProtocol === 'app') {
    return `magpie://import?${params.toString()}`
  }
  return `https://usemagpie.ai/import#${params.toString()}`
}

