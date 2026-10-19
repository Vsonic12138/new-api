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

import { DocsTitle, DocsSection, DocsTextLink, DocsCode } from '../docs-blocks'
import { DOCS_OPENAI_BASE_URL } from '../site'

export function DocsChatPage() {
  const { t } = useTranslation()
  return (
    <>
      <DocsTitle
        title={t('Chat clients')}
        summary={t(
          'Connect a chat app with a text-model key. Add image tools separately when you need them.'
        )}
      />
      <DocsSection title={t('1. Add an OpenAI-compatible provider')}>
        <p>
          {t(
            'In Cherry Studio or your chat app, open Settings → Providers and add an OpenAI-compatible provider. Name it Dahua API. Enter the base URL below and your text-model key. Menu names vary by client version.'
          )}
        </p>
        <DocsCode label='Base URL' code={DOCS_OPENAI_BASE_URL} />
      </DocsSection>
      <DocsSection title={t('2. Select a model and test a conversation')}>
        <p>
          {t(
            'Open Model Square, choose a text model available in your key group, and copy its exact model id into the client. Enable the provider, start a new conversation, and send Hello. If it fails, check the group and base URL first.'
          )}
        </p>
        <DocsTextLink href='/pricing'>{t('Model Square')}</DocsTextLink>
      </DocsSection>
      <DocsSection title={t('3. Add image capability when needed')}>
        <p>
          {t(
            'A working chat provider does not guarantee support for /images/generations or /images/edits. Use a client with local stdio MCP support and follow our MCP guide. For built-in image modes, confirm the client version actually supports these endpoints before using an image-model key.'
          )}
        </p>
        <DocsTextLink href='/docs/image-mcp'>
          {t('Image MCP setup')}
        </DocsTextLink>
      </DocsSection>
    </>
  )
}
