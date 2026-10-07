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
  isUpstreamDocsLink,
  resolveDocsNavTarget,
  shouldShowDocsNav,
  UPSTREAM_DOCS_LINK,
} from '@/lib/docs-nav'

describe('docs navigation target', () => {
  it('opens the in-app guide when the stored link is empty or the upstream manual', () => {
    expect(resolveDocsNavTarget(undefined)).toEqual({
      href: '/docs',
      external: false,
    })
    expect(resolveDocsNavTarget('')).toEqual({
      href: '/docs',
      external: false,
    })
    expect(resolveDocsNavTarget(UPSTREAM_DOCS_LINK)).toEqual({
      href: '/docs',
      external: false,
    })
    expect(resolveDocsNavTarget(`${UPSTREAM_DOCS_LINK}/`)).toEqual({
      href: '/docs',
      external: false,
    })
  })

  it('keeps a custom external manual external', () => {
    expect(resolveDocsNavTarget('https://example.com/guide')).toEqual({
      href: 'https://example.com/guide',
      external: true,
    })
    expect(isUpstreamDocsLink('https://example.com/guide')).toBe(false)
  })

  it('shows the menu for the stock upstream link even when the module is off', () => {
    expect(shouldShowDocsNav(false, UPSTREAM_DOCS_LINK)).toBe(true)
    expect(shouldShowDocsNav(false, '')).toBe(false)
    expect(shouldShowDocsNav(false, 'https://example.com/guide')).toBe(false)
    expect(shouldShowDocsNav(true, 'https://example.com/guide')).toBe(true)
  })
})
