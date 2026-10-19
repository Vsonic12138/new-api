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
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { DOCS_OPENAI_BASE_URL, DOCS_ORIGIN } from './site'

function MockWindow(props: { title: string; children: ReactNode }) {
  return (
    <div>
      <div className='border-border bg-muted/40 flex items-center gap-2 border-b px-3 py-2'>
        <span className='bg-muted-foreground/30 size-2 rounded-full' />
        <span className='bg-muted-foreground/20 size-2 rounded-full' />
        <span className='bg-muted-foreground/15 size-2 rounded-full' />
        <span className='text-muted-foreground ml-1 text-[11px] font-medium'>
          {props.title}
        </span>
      </div>
      <div className='space-y-3 p-4'>{props.children}</div>
    </div>
  )
}

function MockField(props: { label: string; value: string; action?: string }) {
  return (
    <div className='space-y-1'>
      <div className='text-muted-foreground text-[11px] font-medium'>
        {props.label}
      </div>
      <div className='flex gap-2'>
        <div className='border-border bg-background text-foreground/80 min-w-0 flex-1 rounded-md border px-2.5 py-1.5 text-xs'>
          {props.value}
        </div>
        {props.action ? (
          <div className='border-border bg-muted text-foreground shrink-0 rounded-md border px-2.5 py-1.5 text-xs font-medium'>
            {props.action}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function RegisterFormFigure() {
  const { t } = useTranslation()
  return (
    <MockWindow title={t('Sign up')}>
      <MockField label={t('Username')} value={t('Enter your username')} />
      <MockField
        label={t('Password')}
        value={t('Enter password (8–128 characters)')}
      />
      <MockField label={t('Confirm password')} value={t('Confirm password')} />
      <MockField
        label={t('Email (required for verification)')}
        value='name@example.com'
        action={t('Send code')}
      />
      <MockField label={t('Verification code')} value='123456' />
      <div className='bg-foreground text-background w-fit rounded-md px-3 py-1.5 text-xs font-medium'>
        {t('Create account')}
      </div>
      <div className='border-border text-foreground w-fit rounded-md border px-3 py-1.5 text-xs font-medium'>
        {t('Continue with GitHub')}
      </div>
    </MockWindow>
  )
}

export function RedeemFormFigure() {
  const { t } = useTranslation()
  return (
    <MockWindow title={t('Wallet')}>
      <div className='text-muted-foreground text-[11px] font-medium tracking-wide uppercase'>
        {t('Have a Code?')}
      </div>
      <div className='flex gap-2'>
        <div className='border-border bg-background text-foreground/80 min-w-0 flex-1 rounded-md border px-2.5 py-1.5 text-xs'>
          {t('Enter your redemption code')}
        </div>
        <div className='border-border bg-background shrink-0 rounded-md border px-3 py-1.5 text-xs font-medium'>
          {t('Redeem')}
        </div>
      </div>
    </MockWindow>
  )
}

export function ApiKeyFormFigure() {
  const { t } = useTranslation()
  return (
    <MockWindow title={t('Create API Key')}>
      <MockField label={t('Name')} value='Claude Code' />
      <MockField label={t('Group')} value={t('Select a group')} />
      <MockField label={t('Expiration Time')} value={t('Never expires')} />
      <MockField label={t('Quantity')} value='1' />
      <div className='border-border bg-muted/40 flex items-center justify-between rounded-md border px-2.5 py-2'>
        <div>
          <div className='text-xs font-medium'>{t('Unlimited Quota')}</div>
          <div className='text-muted-foreground text-[11px]'>
            {t('Enable unlimited quota for this API key')}
          </div>
        </div>
        <div className='bg-primary h-4 w-7 rounded-full' />
      </div>
      <div className='bg-foreground text-background w-fit rounded-md px-3 py-1.5 text-xs font-medium'>
        {t('Save changes')}
      </div>
    </MockWindow>
  )
}

export function ModelGroupFigure() {
  const { t } = useTranslation()
  return (
    <MockWindow title={t('Model Square')}>
      <div className='grid gap-3 sm:grid-cols-[140px_minmax(0,1fr)]'>
        <div className='border-border space-y-1 rounded-md border p-2'>
          <div className='text-muted-foreground text-[11px] font-medium'>
            {t('Group')}
          </div>
          <div className='bg-muted rounded px-2 py-1 text-xs font-medium'>
            {t('The group selected on the key')}
          </div>
          <div className='text-muted-foreground px-2 py-1 text-xs'>
            {t('Another group')}
          </div>
        </div>
        <div className='border-border space-y-2 rounded-md border p-3'>
          <div className='text-sm font-medium'>claude-sonnet-5</div>
          <div className='text-muted-foreground text-[11px]'>
            {t('Context, price, and ratio are shown on the model card.')}
          </div>
        </div>
      </div>
    </MockWindow>
  )
}

export function CcSwitchFigure(props: { client?: 'codex' | 'claude' }) {
  const { t } = useTranslation()
  return (
    <MockWindow title={t('Configuration example')}>
      <p className='text-xs'>
        {props.client === 'codex' ? 'Codex' : 'Claude Code'}
      </p>
      <MockField label={t('Provider')} value='Dahua API' />
      <MockField
        label={t('Base URL')}
        value={props.client === 'codex' ? DOCS_OPENAI_BASE_URL : DOCS_ORIGIN}
      />
      <MockField
        label={t('Primary Model')}
        value={props.client === 'codex' ? 'gpt-6.1-sol' : 'claude-sonnet-5'}
      />
      <div className='bg-foreground text-background w-fit rounded-md px-3 py-1.5 text-xs font-medium'>
        {t('Open CC Switch')}
      </div>
    </MockWindow>
  )
}
