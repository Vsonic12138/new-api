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
import { createInstance } from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { beforeEach, describe, expect, it } from 'vitest'

import en from '@/i18n/locales/en.json'
import zh from '@/i18n/locales/zh.json'

import { DocsNav } from '../docs-nav'
import { DocsClaudeCodePage, DocsCodexPage } from '../pages/clients'
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
