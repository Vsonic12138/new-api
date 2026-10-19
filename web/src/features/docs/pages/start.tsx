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

import { useTranslation } from 'react-i18next'

import { DocsTitle, DocsSection, DocsActionLink } from '../docs-blocks'

export function DocsStartPage() {
  const { t } = useTranslation()
  return (
    <>
      <DocsTitle
        title={t('User guide')}
        summary={t(
          'Choose a task below. Follow the steps on that page; you do not need to read the technical reference.'
        )}
      />
      <DocsSection title={t('First time here')}>
        <p>
          {t(
            'Complete these three steps once: register, add quota, then create an API key.'
          )}
        </p>
        <div className='flex flex-wrap gap-3'>
          <DocsActionLink href='/docs/register'>
            {t('Create an account')}
          </DocsActionLink>
          <DocsActionLink href='/docs/topup'>
            {t('Add quota with a redemption code')}
          </DocsActionLink>
          <DocsActionLink href='/docs/token'>
            {t('Create an API key')}
          </DocsActionLink>
        </div>
      </DocsSection>
      <DocsSection title={t('Choose a tool')}>
        <div className='space-y-6'>
          <p>
            {t(
              'For coding, use CC Switch to import your key into your assistant.'
            )}
          </p>
          <div className='flex flex-wrap gap-3'>
            <DocsActionLink href='/docs/cc-switch'>
              {t('Set up CC Switch')}
            </DocsActionLink>
          </div>
          <p>
            {t(
              'For images, connect MCP first. Then generate a picture or edit a local image.'
            )}
          </p>
          <div className='flex flex-wrap gap-3'>
            <DocsActionLink href='/docs/image-mcp'>
              {t('Image MCP setup')}
            </DocsActionLink>
            <DocsActionLink href='/docs/images'>
              {t('Generate your first image')}
            </DocsActionLink>
            <DocsActionLink href='/docs/image-edit'>
              {t('Edit an existing image')}
            </DocsActionLink>
          </div>
          <p>
            {t(
              'For everyday chat, add this site as a provider in your chat app.'
            )}
          </p>
          <div className='flex flex-wrap gap-3'>
            <DocsActionLink href='/docs/chat'>
              {t('Chat clients')}
            </DocsActionLink>
          </div>
        </div>
      </DocsSection>
      <DocsSection title={t('Need help?')}>
        <DocsActionLink href='/docs/troubleshooting'>
          {t('Troubleshooting')}
        </DocsActionLink>
      </DocsSection>
    </>
  )
}
