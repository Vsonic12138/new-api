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
import { Link, Outlet, useRouterState } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { PublicLayout } from '@/components/layout'
import { Button } from '@/components/ui/button'

import { DocsNav } from './docs-nav'
import { getDocsAudience } from './site'

export function DocsLayout() {
  const { t } = useTranslation()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const audience = getDocsAudience(pathname)
  return (
    <PublicLayout>
      <div
        className='mx-auto mb-8 flex w-full max-w-6xl flex-wrap gap-3'
        aria-label={t('Documentation audience')}
      >
        <Button
          role='link'
          render={<Link to='/docs' />}
          variant={audience === 'user' ? 'default' : 'outline'}
          aria-current={audience === 'user' ? 'page' : undefined}
        >
          {t('User guide')}
        </Button>
        <Button
          role='link'
          render={<Link to='/docs/agent' />}
          variant={audience === 'agent' ? 'default' : 'outline'}
          aria-current={audience === 'agent' ? 'page' : undefined}
        >
          {t('Agent reference')}
        </Button>
      </div>
      <div className='mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[220px_minmax(0,1fr)]'>
        <aside className='min-w-0 lg:sticky lg:top-20 lg:self-start'>
          <DocsNav />
        </aside>
        <article className='min-w-0 space-y-8 pb-16'>
          <Outlet />
        </article>
      </div>
    </PublicLayout>
  )
}
