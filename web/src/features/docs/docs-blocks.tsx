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
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { CopyButton } from '@/components/copy-button'
import { Dialog } from '@/components/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function DocsTitle(props: { title: string; summary: string }) {
  return (
    <header className='space-y-2'>
      <h1 className='text-2xl font-semibold tracking-tight'>{props.title}</h1>
      <p className='text-muted-foreground text-sm leading-6'>{props.summary}</p>
    </header>
  )
}

export function DocsSection(props: {
  title: string
  id?: string
  children: ReactNode
}) {
  return (
    <section id={props.id} className='scroll-mt-24 space-y-3'>
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

export function DocsStep(props: {
  n: number
  title: string
  children?: ReactNode
}) {
  return (
    <li className='flex gap-3'>
      <span className='bg-muted text-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold'>
        {props.n}
      </span>
      <div className='min-w-0 space-y-2 pt-0.5'>
        <p className='text-foreground font-medium'>{props.title}</p>
        {props.children ? (
          <div className='text-muted-foreground space-y-2'>
            {props.children}
          </div>
        ) : null}
      </div>
    </li>
  )
}

export function DocsSteps(props: { children: ReactNode }) {
  return <ol className='space-y-4'>{props.children}</ol>
}

export function DocsImage(props: {
  src: string
  alt: string
  caption: string
}) {
  const { t } = useTranslation()
  return (
    <figure className='space-y-2'>
      <Dialog
        title={props.alt}
        description={props.caption}
        contentClassName='sm:max-w-6xl'
        bodyClassName='overflow-x-auto'
        trigger={
          <Button
            variant='ghost'
            className='h-auto w-full cursor-zoom-in p-0 whitespace-normal'
            aria-label={t('Enlarge image: {{title}}', { title: props.alt })}
          >
            <img
              src={props.src}
              alt={props.alt}
              loading='lazy'
              decoding='async'
              className='border-border bg-muted/20 h-auto max-w-full rounded-xl border'
            />
          </Button>
        }
      >
        <img src={props.src} alt={props.alt} className='h-auto w-full' />
        <a
          href={props.src}
          target='_blank'
          rel='noopener noreferrer'
          className='text-primary mt-3 inline-block underline underline-offset-4'
        >
          {t('Open original image')}
        </a>
      </Dialog>
      <figcaption className='text-muted-foreground mx-auto max-w-prose text-center text-[12px] leading-[18px]'>
        {props.caption}
      </figcaption>
    </figure>
  )
}

export function DocsFigure(props: { caption: string; children: ReactNode }) {
  return (
    <figure className='space-y-2'>
      <div className='border-border bg-card overflow-hidden rounded-xl border shadow-xs'>
        {props.children}
      </div>
      <figcaption className='text-muted-foreground mx-auto max-w-prose text-center text-[12px] leading-[18px]'>
        {props.caption}
      </figcaption>
    </figure>
  )
}

export function DocsCode(props: {
  label: string
  code: string
  prose?: boolean
}) {
  const { t } = useTranslation()
  return (
    <div className='border-border bg-muted/40 overflow-hidden rounded-lg border'>
      <div className='flex items-center justify-between gap-3 px-3 py-1.5'>
        <span className='text-muted-foreground text-xs'>{props.label}</span>
        <CopyButton value={props.code} size='sm' variant='outline'>
          {t('Copy')}
        </CopyButton>
      </div>
      <pre
        aria-label={props.label}
        className={cn(
          'overflow-x-auto px-3 pb-3',
          props.prose
            ? 'font-sans text-sm leading-7 whitespace-pre-wrap break-words'
            : 'font-mono text-xs leading-5'
        )}
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
    'text-primary rounded-sm font-semibold underline decoration-2 underline-offset-4 hover:decoration-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring'
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

export function DocsActionLink(props: {
  href: string
  children: ReactNode
  external?: boolean
  primary?: boolean
}) {
  return (
    <Button
      role='link'
      variant={props.primary ? 'default' : 'outline'}
      className='h-auto min-h-10 max-w-full justify-between gap-3 px-4 py-2 text-start whitespace-normal'
      render={
        props.external ? (
          <a href={props.href} target='_blank' rel='noopener noreferrer' />
        ) : (
          <Link to={props.href} />
        )
      }
    >
      {props.children}
      <ArrowRight aria-hidden='true' className='size-4 shrink-0' />
    </Button>
  )
}
