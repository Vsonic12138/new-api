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
import { Outlet } from '@tanstack/react-router'

import { PublicLayout } from '@/components/layout'

import { DocsNav } from './docs-nav'

export function DocsLayout() {
  return (
    <PublicLayout>
      <div className='mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[220px_minmax(0,1fr)]'>
        <aside className='lg:sticky lg:top-20 lg:self-start'>
          <DocsNav />
        </aside>
        <article className='min-w-0 space-y-8 pb-16'>
          <Outlet />
        </article>
      </div>
    </PublicLayout>
  )
}
