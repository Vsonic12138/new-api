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
import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

import { CopyButton } from '@/components/copy-button'
import { cn } from '@/lib/utils'

export function DocsTitle(props: { title: string; summary: string }) {
  return (
    <header className='space-y-2'>
      <h1 className='text-2xl font-semibold tracking-tight'>{props.title}</h1>
      <p className='text-muted-foreground text-sm leading-6'>{props.summary}</p>
    </header>
  )
}

export function DocsSection(props: { title: string; children: ReactNode }) {
  return (
    <section className='space-y-3'>
      <h2 className='text-base font-semibold'>{props.title}</h2>
      <div className='text-foreground/90 space-y-3 text-sm leading-6'>
        {props.children}
      </div>
    </section>
  )
}

export function DocsList(props: { children: ReactNode }) {
  return <ol className='list-decimal space-y-2 pl-5'>{props.children}</ol>
}

export function DocsCode(props: { label: string; code: string }) {
  return (
    <div className='border-border bg-muted/40 overflow-hidden rounded-lg border'>
      <div className='flex items-center justify-between gap-3 px-3 py-1.5'>
        <span className='text-muted-foreground text-xs'>{props.label}</span>
        <CopyButton value={props.code} />
      </div>
      <pre
        aria-label={props.label}
        className='overflow-x-auto px-3 pb-3 font-mono text-xs leading-5'
      >
        <code>{props.code}</code>
      </pre>
    </div>
  )
}

export function DocsNote(props: { children: ReactNode }) {
  return (
    <p className='border-border bg-muted/30 text-muted-foreground rounded-lg border px-3 py-2 text-sm leading-6'>
      {props.children}
    </p>
  )
}

export function DocsTextLink(props: {
  href: string
  children: ReactNode
  external?: boolean
}) {
  const className =
    'text-primary font-medium underline-offset-4 hover:underline'
  if (props.external) {
    return (
      <a
        href={props.href}
        target='_blank'
        rel='noopener noreferrer'
        className={className}
      >
        {props.children}
      </a>
    )
  }
  return (
    <Link to={props.href} className={cn(className)}>
      {props.children}
    </Link>
  )
}
