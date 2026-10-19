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

import { DocsTitle, DocsSection, DocsTextLink } from '../docs-blocks'

export function DocsStartPage() {
  const { t } = useTranslation()
  return (
    <>
      <DocsTitle
        title={t('Choose what you want to do')}
        summary={t(
          'Create an account, add quota, then follow the guide for your app. Image generation has its own key and MCP setup.'
        )}
      />
      <DocsSection title={t('Prepare your account')}>
        <p>
          {t(
            'Register and sign in. Buy a redemption code from the card shop, then redeem it in Wallet. The code adds quota; it is not an API key.'
          )}
        </p>
        <DocsTextLink href='/docs/register'>
          {t('Create an account')}
        </DocsTextLink>{' '}
        ·{' '}
        <DocsTextLink href='/docs/topup'>
          {t('Add quota with a redemption code')}
        </DocsTextLink>
      </DocsSection>
      <DocsSection title={t('Create a key for each purpose')}>
        <p>
          {t(
            'For chat or coding, find the model in Model Square and choose its group. For images, create another key in 生图 【标准】. Give the keys different names so you do not mix them up.'
          )}
        </p>
        <DocsTextLink href='/docs/token'>{t('Create an API key')}</DocsTextLink>
      </DocsSection>
      <DocsSection title={t('Use a coding assistant')}>
        <p>
          {t(
            'Use CC Switch to import your provider, or follow the manual setup for Codex CLI or Claude Code. Finish one route and send a short test message before adding MCP.'
          )}
        </p>
        <DocsTextLink href='/docs/cc-switch'>
          {t('Set up CC Switch')}
        </DocsTextLink>{' '}
        · <DocsTextLink href='/docs/codex'>{t('Set up Codex')}</DocsTextLink> ·{' '}
        <DocsTextLink href='/docs/claude-code'>
          {t('Set up Claude Code')}
        </DocsTextLink>
      </DocsSection>
      <DocsSection title={t('Use images in your assistant')}>
        <p>
          {t(
            'Follow these three guides in order: connect the image MCP, generate one image, then edit a local image. You do not need to write API code.'
          )}
        </p>
        <ol className='list-decimal space-y-2 pl-5'>
          <li>
            <DocsTextLink href='/docs/image-mcp'>
              {t('Image MCP setup')}
            </DocsTextLink>
          </li>
          <li>
            <DocsTextLink href='/docs/images'>
              {t('Generate your first image')}
            </DocsTextLink>
          </li>
          <li>
            <DocsTextLink href='/docs/image-edit'>
              {t('Edit an existing image')}
            </DocsTextLink>
          </li>
        </ol>
      </DocsSection>
      <DocsSection title={t('Use an ordinary chat app')}>
        <p>
          {t(
            'Cherry Studio and other clients need an OpenAI-compatible provider and a model available to your key. Chat setup and image-tool setup are separate.'
          )}
        </p>
        <DocsTextLink href='/docs/chat'>{t('Chat clients')}</DocsTextLink>
      </DocsSection>
      <DocsSection title={t('How to know it works')}>
        <p>
          {t(
            'A chat reply confirms chat access. An image-tool result with an existing local file confirms image access. Check Usage Logs if a request fails, then use the troubleshooting guide.'
          )}
        </p>
        <DocsTextLink href='/docs/troubleshooting'>
          {t('Troubleshooting')}
        </DocsTextLink>
      </DocsSection>
    </>
  )
}
