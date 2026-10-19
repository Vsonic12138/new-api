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
import { describe, expect, it } from 'vitest'

import {
  buildCCSwitchImportUrl,
  buildCherryStudioImportUrl,
  buildMagpieImportUrl,
  CC_SWITCH_SITE_PRESETS,
  preferPublicOrigin,
} from '../client-import'

const origin = 'https://newapi.vsonic12138.shop'

describe('homepage client import links', () => {
  it('keeps the public site address when the saved server address is loopback', () => {
    expect(
      preferPublicOrigin(
        'https://newapi.vsonic12138.shop',
        'http://127.0.0.1:3000',
        'https://newapi.vsonic12138.shop'
      )
    ).toBe('https://newapi.vsonic12138.shop')
    expect(
      preferPublicOrigin(
        'http://127.0.0.1:3000',
        'https://newapi.vsonic12138.shop/',
        'https://example.com'
      )
    ).toBe('https://newapi.vsonic12138.shop')
  })

  it('imports a separate GPT Responses provider with UTF-8 base64 data', () => {
    const url = buildCherryStudioImportUrl({
      name: '大黄API · 大狗叫',
      apiHost: `${origin}/v1/`,
    })
    const encoded = decodeURIComponent(url.split('data=')[1] ?? '')
    const data = JSON.parse(
      Buffer.from(encoded, 'base64').toString('utf8')
    ) as {
      id: string
      name: string
      baseUrl: string
      type: string
      apiKey: string
    }

    expect(url.startsWith('cherrystudio://providers/api-keys?v=1&data=')).toBe(
      true
    )
    expect(data.id).toBe('new-api-gpt')
    expect(data.name).toBe('大黄API · 大狗叫')
    expect(data.baseUrl).toBe(`${origin}/v1`)
    expect(data.type).toBe('openai-response')
    expect(data.apiKey).toBe('sk-your-api-token')
    expect(url).not.toContain('127.0.0.1')
  })

  it('fills Claude Code with the site root and the OpenAI-compatible apps with /v1', () => {
    const claude = new URL(
      buildCCSwitchImportUrl({
        app: 'claude',
        name: '大黄API',
        origin: `${origin}/`,
        model: 'claude-opus-5-5',
        models: {
          sonnetModel: 'claude-sonnet-5',
          opusModel: 'claude-opus-5-5',
        },
      })
    )
    const codex = new URL(
      buildCCSwitchImportUrl({
        app: 'codex',
        name: '大黄API',
        origin,
        model: 'gpt-6.1-sol',
      })
    )
    const opencode = new URL(
      buildCCSwitchImportUrl({
        app: 'opencode',
        name: '大黄API',
        origin,
        model: 'gpt-6.1-sol',
      })
    )
    expect(claude.protocol).toBe('ccswitch:')
    expect(claude.searchParams.get('resource')).toBe('provider')
    expect(claude.searchParams.get('app')).toBe('claude')
    expect(claude.searchParams.get('endpoint')).toBe(origin)
    expect(claude.searchParams.get('homepage')).toBe(origin)
    expect(claude.searchParams.get('model')).toBe('claude-opus-5-5')
    expect(claude.searchParams.get('sonnetModel')).toBe('claude-sonnet-5')
    expect(claude.searchParams.get('opusModel')).toBe('claude-opus-5-5')
    expect(claude.searchParams.get('enabled')).toBe('false')
    const gemini = new URL(
      buildCCSwitchImportUrl({
        app: 'gemini',
        name: '大黄API',
        origin,
        model: 'gpt-6.1-sol',
      })
    )
    for (const client of [codex, opencode]) {
      expect(client.searchParams.get('endpoint')).toBe(`${origin}/v1`)
      expect(client.searchParams.get('model')).toBe('gpt-6.1-sol')
    }
    expect(gemini.searchParams.get('endpoint')).toBe(origin)
    expect(gemini.searchParams.get('apiFormat')).toBe('gemini_native')
    expect(codex.searchParams.get('app')).toBe('codex')
    expect(gemini.searchParams.get('app')).toBe('gemini')
    expect(opencode.searchParams.get('app')).toBe('opencode')
    expect(claude.href).not.toContain('127.0.0.1')
  })

  it.each(['codex', 'opencode'] as const)(
    'imports the public %s template without activating its placeholder key',
    (app) => {
      const preset = CC_SWITCH_SITE_PRESETS[app]
      const url = new URL(
        buildCCSwitchImportUrl({ app, origin: `${origin}/v1/`, ...preset })
      )
      expect(url.searchParams.get('endpoint')).toBe(`${origin}/v1`)
      expect(url.searchParams.get('apiKey')).toBe('sk-your-api-token')
      expect(url.searchParams.get('enabled')).toBe('false')
      expect(url.searchParams.get('model')).toBe(
        app === 'codex' ? 'gpt-6.1-sol' : 'grok-4.7'
      )
      expect(url.searchParams.get('apiFormat')).toBe(
        app === 'codex' ? 'openai_responses' : 'openai_chat'
      )
      expect(url.href).not.toContain('claude')
    }
  )

  it('builds magpie web import url with hash fragment and app protocol', () => {
    const webUrl = buildMagpieImportUrl({
      name: '大黄API',
      origin,
      models: ['gpt-6.1-sol'],
      apiKey: 'sk-custom-test-key',
    })
    expect(webUrl.startsWith('https://usemagpie.ai/import#')).toBe(true)
    const hashParams = new URLSearchParams(webUrl.split('#')[1])
    expect(hashParams.get('name')).toBe('大黄API')
    expect(hashParams.has('chat')).toBe(false)
    expect(hashParams.get('responses')).toBe(`${origin}/v1`)
    expect(hashParams.has('anthropic')).toBe(false)
    expect(hashParams.get('catalog')).toBe('openai')
    expect(hashParams.get('key')).toBe('sk-custom-test-key')
    expect(hashParams.get('models')).toBe('gpt-6.1-sol')
    expect(hashParams.get('website')).toBe(origin)
    expect(hashParams.get('keys')).toBe(`${origin}/keys`)

    const appUrl = buildMagpieImportUrl({
      name: '大黄API',
      origin,
      preferProtocol: 'app',
    })
    expect(appUrl.startsWith('magpie://import?')).toBe(true)
    const appParams = new URLSearchParams(appUrl.split('?')[1])
    expect(appParams.get('models')).toBe('gpt-6.1-sol')
  })
  it('keeps Grok chat imports separate from GPT Responses imports', () => {
    const cherry = new URL(
      buildCherryStudioImportUrl({
        name: 'Grok',
        apiHost: origin,
        family: 'grok',
      })
    )
    const data = JSON.parse(
      Buffer.from(cherry.searchParams.get('data') ?? '', 'base64').toString(
        'utf8'
      )
    )
    expect(data.id).toBe('new-api-grok')
    expect(data.type).toBe('openai')
    const magpie = new URL(
      buildMagpieImportUrl({
        name: 'Grok',
        origin: `${origin}/v1/`,
        family: 'grok',
      })
    )
    const params = new URLSearchParams(magpie.hash.slice(1))
    expect(params.get('chat')).toBe(`${origin}/v1`)
    expect(params.has('responses')).toBe(false)
    expect(params.get('catalog')).toBe('xai')
    expect(params.get('models')).toBe('grok-4.7')
    expect(magpie.search).toBe('')
  })

  it('includes explicit high reasoning in the Codex import config', () => {
    const url = new URL(
      buildCCSwitchImportUrl({
        app: 'codex',
        name: 'GPT',
        origin,
        model: 'gpt-6.1-sol',
      })
    )
    const config = Buffer.from(
      url.searchParams.get('config') ?? '',
      'base64'
    ).toString('utf8')
    expect(config).toContain('model_reasoning_effort = "high"')
    expect(config).toContain('plan_mode_reasoning_effort = "high"')
    expect(url.searchParams.get('configFormat')).toBe('toml')
  })
})
