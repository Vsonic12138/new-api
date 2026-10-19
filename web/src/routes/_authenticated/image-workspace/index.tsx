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
  return (
    <Main className='p-0'>
      <iframe
        title='Image Workspace'
        src='/pg-image-workspace/'
        className='size-full min-h-0 border-0'
        referrerPolicy='same-origin'
      />
    </Main>
  )
}
