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

  it('fills Cherry Studio with root provider endpoint and standard base64 data', () => {
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
      apiHost: string
      apiKey: string
    }

    expect(url.startsWith('cherrystudio://providers/api-keys?v=1&data=')).toBe(
      true
    )
    expect(data.id).toBe('new-api')
    expect(data.name).toBe('大黄API · 大狗叫')
    expect(data.baseUrl).toBe(origin)
    expect(data.apiHost).toBe(origin)
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
    expect(claude.searchParams.get('enabled')).toBe('true')
    const gemini = new URL(
      buildCCSwitchImportUrl({
        app: 'gemini',
        name: '大黄API',
        origin,
        model: 'gpt-6.1-sol',
      })
    )
    for (const client of [codex, opencode, gemini]) {
      expect(client.searchParams.get('endpoint')).toBe(`${origin}/v1`)
      expect(client.searchParams.get('model')).toBe('gpt-6.1-sol')
    }
    expect(codex.searchParams.get('app')).toBe('codex')
    expect(gemini.searchParams.get('app')).toBe('gemini')
    expect(opencode.searchParams.get('app')).toBe('opencode')
    expect(claude.href).not.toContain('127.0.0.1')
  })

  it('builds magpie web import url with hash fragment and app protocol', () => {
    const webUrl = buildMagpieImportUrl({
      name: '大黄API',
      origin,
      models: ['claude-sonnet-5', 'deepseek-flash'],
      apiKey: 'sk-custom-test-key',
    })
    expect(webUrl.startsWith('https://usemagpie.ai/import#')).toBe(true)
    const hashParams = new URLSearchParams(webUrl.split('#')[1])
    expect(hashParams.get('name')).toBe('大黄API')
    expect(hashParams.get('chat')).toBe(`${origin}/v1`)
    expect(hashParams.get('anthropic')).toBe(origin)
    expect(hashParams.get('key')).toBe('sk-custom-test-key')
    expect(hashParams.get('models')).toBe('claude-sonnet-5,deepseek-flash')
    expect(hashParams.get('website')).toBe(origin)
    expect(hashParams.get('keys')).toBe(`${origin}/keys`)

    const appUrl = buildMagpieImportUrl({
      name: '大黄API',
      origin,
      preferProtocol: 'app',
    })
    expect(appUrl.startsWith('magpie://import?')).toBe(true)
  })
})

