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
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme-provider'

import { Main } from '@/components/layout'
import { isSidebarModuleEnabled } from '@/lib/nav-modules'
import { statusQueryOptions } from '@/lib/status-query'

// The actual Image Workspace is a separately buildable, same-origin UI bundle.
// Deploy its VITE_API_MODE=embedded build at /pg-image-workspace/; it calls
// authenticated /pg/image-playground/* endpoints using this site's cookies.
// Keeping the iframe same-origin avoids placing API keys into frontend config.
export const Route = createFileRoute('/_authenticated/image-workspace/')({
  beforeLoad: async ({ context }) => {
    const status = await context.queryClient.fetchQuery(statusQueryOptions).catch(() => null)
    if (status?.image_workspace_enabled !== true ||
        !isSidebarModuleEnabled('chat', 'image-workspace')) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: ImageWorkspacePage,
})

function ImageWorkspacePage() {
  const frame = useRef<HTMLIFrameElement>(null)
  const { i18n } = useTranslation()
  const { resolvedTheme } = useTheme()
  const syncHostPreferences = useCallback(() => {
    frame.current?.contentWindow?.postMessage({
      source: 'newapi-image-workspace-host',
      themeMode: resolvedTheme,
      lang: i18n.language,
    }, window.location.origin)
  }, [resolvedTheme, i18n.language])

  useEffect(() => { syncHostPreferences() }, [syncHostPreferences])

  return (
    <Main className='p-0'>
      <iframe
        ref={frame}
        title='Image Workspace'
        src='/pg-image-workspace/index.html'
        className='size-full min-h-0 border-0'
        referrerPolicy='same-origin'
        onLoad={syncHostPreferences}
      />
    </Main>
  )
}
