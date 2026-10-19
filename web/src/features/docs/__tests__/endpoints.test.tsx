import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
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
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createInstance } from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { beforeEach, describe, expect, it } from 'vitest'

import en from '@/i18n/locales/en.json'
import zh from '@/i18n/locales/zh.json'

import { DocsImage } from '../docs-blocks'
import { DocsNav } from '../docs-nav'
import { DocsAgentPage } from '../pages/agent'
import {
  DocsCcSwitchPage,
  DocsClaudeCodePage,
  DocsCodexPage,
} from '../pages/clients'
import { DocsImageEditPage } from '../pages/image-edit'
import { DocsImageMcpPage } from '../pages/image-mcp'
import { DocsStartPage } from '../pages/start'
import {
  DOCS_NAV,
  DOCS_OPENAI_BASE_URL,
  DOCS_ORIGIN,
  isDocsNavActive,
} from '../site'

const i18n = createInstance()

beforeEach(async () => {
  await i18n.use(initReactI18next).init({
    lng: 'zh',
    fallbackLng: 'en',
    nsSeparator: false,
    resources: { en, zh },
    interpolation: { escapeValue: false },
  })
})

async function renderWithRouter(
  path: string,
  component: () => React.JSX.Element
) {
  const root = createRootRoute()
  const page = createRoute({
    getParentRoute: () => root,
    path,
    component,
  })
  const stubs = ['/', '/sign-up', '/sign-in', '/wallet', '/keys', '/pricing']
    .filter((stub) => stub !== path)
    .map((stub) =>
      createRoute({
        getParentRoute: () => root,
        path: stub,
        component: () => null,
      })
    )
  const router = createRouter({
    routeTree: root.addChildren([page, ...stubs]),
    history: createMemoryHistory({ initialEntries: [path] }),
  })
  await router.load()
  render(
    <I18nextProvider i18n={i18n}>
      <RouterProvider router={router} />
    </I18nextProvider>
  )
}

describe('docs client addresses', () => {
  it('links the official tutorials and offers GPT and Grok templates with inactive example keys', async () => {
    await i18n.changeLanguage('en')
    await renderWithRouter('/docs/cc-switch', DocsCcSwitchPage)
    expect(
      await screen.findByRole('link', { name: 'CC Switch official website' })
    ).toHaveAttribute('href', 'https://ccswitch.io')
    expect(
      screen.getByRole('link', { name: 'CC Switch official tutorials' })
    ).toHaveAttribute('href', 'https://ccswitch.io/zh/tutorials')
    for (const [client, app, model] of [
      ['Codex · GPT', 'codex', 'gpt-6.1-sol'],
      ['OpenCode · Grok', 'opencode', 'grok-4.7'],
    ]) {
      const link = screen.getByRole('link', {
        name: `Import ${client} template`,
      })
      const url = new URL(link.getAttribute('href') ?? '')
      expect(url.searchParams.get('app')).toBe(app)
      expect(url.searchParams.get('model')).toBe(model)
      expect(url.searchParams.get('endpoint')).toBe(DOCS_OPENAI_BASE_URL)
      expect(url.searchParams.get('apiKey')).toBe('sk-your-api-token')
      expect(url.searchParams.get('enabled')).toBe('false')
    }
    expect(document.querySelectorAll('a[href^="ccswitch:"]')).toHaveLength(2)
  })
  it('offers a copyable AI setup prompt with image credentials kept as a local placeholder', async () => {
    await i18n.changeLanguage('en')
    await renderWithRouter('/docs/image-mcp', DocsImageMcpPage)
    const prompt =
      (await screen.findByLabelText('AI setup prompt')).textContent ?? ''
    expect(prompt).toContain('/agent-guide.txt')
    expect(prompt).toContain(DOCS_ORIGIN)
    expect(prompt).toContain('IMAGE_API_TOKEN')
    expect(prompt).toContain('sk-your-image-key')
  })
  it('updates the guide overview when the reader changes language', async () => {
    await renderWithRouter('/docs', DocsStartPage)
    expect(
      await screen.findByRole('heading', {
        name: zh.translation['User guide'],
      })
    ).toBeVisible()
    await i18n.changeLanguage('en')
    expect(
      await screen.findByRole('heading', { name: 'User guide' })
    ).toBeVisible()
    expect(
      screen.queryByRole('heading', {
        name: zh.translation['User guide'],
      })
    ).not.toBeInTheDocument()
  })

  it('provides a local image path for editing and keeps source dimensions by omitting size', async () => {
    await renderWithRouter('/docs/agent', DocsAgentPage)
    const args = JSON.parse(
      (await screen.findByLabelText('generate_image · JSON')).textContent ??
        '{}'
    )
    expect(args.images).toEqual(['/ABSOLUTE/PATH/source.png'])
    expect(args.model).toBe('gpt-image-2.5-sunburst')
    expect(args).not.toHaveProperty('size')
    expect(
      (await screen.findByLabelText('Bash · POST /v1/images/edits')).textContent
    ).toContain('-F "image=@/ABSOLUTE/PATH/source.png"')
  })

  it('keeps image credentials in the MCP environment and uses the image API address', async () => {
    await renderWithRouter('/docs/agent', DocsAgentPage)
    const config = JSON.parse(
      (await screen.findByLabelText('Cursor · mcp.json')).textContent ?? '{}'
    )
    expect(config.mcpServers.imagegen.env.IMAGE_API_TOKEN).toBe(
      'sk-your-image-key'
    )
    expect(config.mcpServers.imagegen.env.IMAGE_API_BASE_URL).toBe(
      DOCS_OPENAI_BASE_URL
    )
    expect(config.mcpServers.imagegen).not.toHaveProperty('timeoutMs')
  })
  it('offers image generation, editing and MCP as direct navigation destinations', async () => {
    await renderWithRouter('/docs', DocsNav)
    for (const path of [
      '/docs/image-mcp',
      '/docs/images',
      '/docs/image-edit',
    ]) {
      expect(
        (await screen.findAllByRole('link')).some(
          (link) => link.getAttribute('href') === path
        )
      ).toBe(true)
    }
  })

  it('keeps technical reference out of the user navigation and exposes it in the agent navigation', async () => {
    await renderWithRouter('/docs', DocsNav)
    expect(
      screen.queryByRole('link', { name: '接口地址' })
    ).not.toBeInTheDocument()
    cleanup()
    await renderWithRouter('/docs/agent', DocsNav)
    expect(await screen.findByRole('link', { name: '接口地址' })).toBeVisible()
    expect(
      screen.queryByRole('link', { name: '创建一个账户' })
    ).not.toBeInTheDocument()
  })

  it('shows plain-language image editing steps without API payloads', async () => {
    await renderWithRouter('/docs/image-edit', DocsImageEditPage)
    expect(await screen.findByRole('heading', { level: 1 })).toBeVisible()
    expect(
      screen.queryByLabelText('generate_image · JSON')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByLabelText('Bash · POST /v1/images/edits')
    ).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Agent/ })).toHaveAttribute(
      'href',
      '/docs/agent'
    )
  })

  it('expands and collapses the compact docs menu from the keyboard', async () => {
    const user = userEvent.setup()
    await renderWithRouter('/docs', DocsNav)
    const toggle = await screen.findByRole('button', { expanded: false })
    toggle.focus()
    await user.keyboard('{Enter}')
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(await screen.findByRole('region')).toBeVisible()
    await user.keyboard('{Enter}')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  })

  it('opens a readable image preview with keyboard access and returns focus on close', async () => {
    const user = userEvent.setup()
    render(
      <I18nextProvider i18n={i18n}>
        <DocsImage
          src='/docs-images/token-create-e819b20ce1.png'
          alt='Image key example'
          caption='Image key example'
        />
      </I18nextProvider>
    )
    const trigger = screen.getByRole('button', { name: /Image key example/ })
    trigger.focus()
    await user.keyboard('{Enter}')
    expect(
      await screen.findByRole('dialog', { name: 'Image key example' })
    ).toBeVisible()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })
  it('keeps /v1 off the Claude Code address and on the Codex address', async () => {
    await renderWithRouter('/docs/claude-code', DocsClaudeCodePage)
    const claude =
      (await screen.findByLabelText('settings.json')).textContent ?? ''
    expect(claude).toContain(`"ANTHROPIC_BASE_URL": "${DOCS_ORIGIN}"`)
    expect(claude).not.toContain('/v1')

    cleanup()
    await renderWithRouter('/docs/codex', DocsCodexPage)
    const codex =
      (await screen.findByLabelText('config.toml')).textContent ?? ''
    expect(codex).toContain(`base_url = "${DOCS_OPENAI_BASE_URL}"`)
    expect(DOCS_OPENAI_BASE_URL.endsWith('/v1')).toBe(true)
  })

  it('marks the current docs page in the sidebar', async () => {
    const root = createRootRoute({ component: DocsNav })
    const pages = DOCS_NAV.map((item) =>
      createRoute({
        getParentRoute: () => root,
        path: item.to,
        component: () => null,
      })
    )
    const router = createRouter({
      routeTree: root.addChildren(pages),
      history: createMemoryHistory({ initialEntries: ['/docs/codex'] }),
    })
    render(
      <I18nextProvider i18n={i18n}>
        <RouterProvider router={router} />
      </I18nextProvider>
    )

    expect(
      await screen.findByRole('link', { name: '配置 Codex', current: 'page' })
    ).toBeVisible()
    expect(isDocsNavActive('/docs/', '/docs')).toBe(true)
    expect(isDocsNavActive('/docs/codex/', '/docs/codex')).toBe(true)
    expect(isDocsNavActive('/docs/codex', '/docs')).toBe(false)
  })
})
