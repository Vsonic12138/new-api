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
import { Link, useRouterState } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

import { DOCS_NAV, isDocsNavActive } from './site'

function DocsNavLinks(props: { pathname: string; onNavigate?: () => void }) {
  const { t } = useTranslation()
  return (
    <ul className='space-y-1'>
      {DOCS_NAV.map((item) => {
        const active = isDocsNavActive(props.pathname, item.to)
        return (
          <li key={item.to}>
            <Link
              to={item.to}
              onClick={props.onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'block rounded-md px-3 py-2 text-sm',
                active
                  ? 'bg-muted text-foreground font-medium'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
              )}
            >
              {t(item.titleKey)}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export function DocsNav() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const current = DOCS_NAV.find((item) => isDocsNavActive(pathname, item.to))
  return (
    <nav aria-label={t('Docs')}>
      <div className='hidden lg:block'>
        <DocsNavLinks pathname={pathname} />
      </div>
      <Collapsible open={open} onOpenChange={setOpen} className='lg:hidden'>
        <CollapsibleTrigger
          render={
            <Button
              variant='outline'
              className='h-auto min-h-10 w-full justify-start text-start whitespace-normal'
            />
          }
        >
          {t('Docs')} · {current ? t(current.titleKey) : t('Start here')}
        </CollapsibleTrigger>
        <CollapsibleContent
          role='region'
          aria-label={t('Docs')}
          className='pt-3'
        >
          <DocsNavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
        </CollapsibleContent>
      </Collapsible>
    </nav>
  )
}
