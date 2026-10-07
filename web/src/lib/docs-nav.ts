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

/** Stock upstream manual. This site serves its own guide at /docs. */
export const UPSTREAM_DOCS_LINK = 'https://docs.newapi.pro'

export type DocsNavTarget = {
  href: string
  external: boolean
}

function trimLink(docsLink: string | undefined) {
  return docsLink?.trim() ?? ''
}

export function isUpstreamDocsLink(docsLink: string | undefined) {
  const trimmed = trimLink(docsLink).replace(/\/+$/, '')
  return trimmed === UPSTREAM_DOCS_LINK
}

export function resolveDocsNavTarget(
  docsLink: string | undefined
): DocsNavTarget {
  const trimmed = trimLink(docsLink)
  if (trimmed === '' || isUpstreamDocsLink(trimmed)) {
    return { href: '/docs', external: false }
  }
  if (trimmed.startsWith('/')) {
    return { href: trimmed, external: false }
  }
  return { href: trimmed, external: true }
}

/**
 * The live site stored the upstream manual and turned the menu off.
 * Treat that pair as "open the in-app guide" until an admin saves another URL.
 */
export function shouldShowDocsNav(
  enabled: boolean,
  docsLink: string | undefined
) {
  if (enabled) return true
  return isUpstreamDocsLink(docsLink)
}
