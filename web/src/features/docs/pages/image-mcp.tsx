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

import {
  DocsTitle,
  DocsActionLink,
  DocsSection,
  DocsTextLink,
  DocsNote,
  DocsCode,
  DocsImage,
} from '../docs-blocks'
import { DOCS_AGENT_URL } from '../site'

export function DocsImageMcpPage() {
  const { t } = useTranslation()
  return (
    <>
      <DocsTitle
        title={t('Image MCP setup')}
        summary={t(
          'Create an image key, copy the setup request to your assistant, then restart and check the tool.'
        )}
      />
      <DocsSection title={t('1. Create an image key')}>
        <p>
          {t(
            'Open API Keys, create a key named Image MCP, choose 生图 【标准】, save, and copy its sk- value. Your account needs available quota.'
          )}
        </p>
        <DocsImage
          src='/docs-images/token-create-e819b20ce1.png'
          alt={t('Create an API key')}
          caption={t(
            'Image key example: the selected group is 生图 【标准】. Use your own key; the name is only for identification.'
          )}
        />
      </DocsSection>
      <DocsSection title={t('2. Let AI help configure MCP')} id='ai-setup'>
        <p>
          {t(
            'In Codex, Claude Code or Cursor, send the request below. The assistant needs permission to edit local files.'
          )}
        </p>
        <DocsCode
          label={t('AI setup prompt')}
          prose
          code={t(
            'Read {{agentUrl}} and help me configure the image MCP for my current client. Preserve my existing settings. Leave IMAGE_API_TOKEN=sk-your-image-key for me to fill locally. Tell me how to restart and check the tool.',
            { agentUrl: DOCS_AGENT_URL }
          )}
        />
        <DocsNote>
          {t(
            'Fill your image key in the local configuration when prompted, then restart the app. For manual setup, open Agent reference.'
          )}
        </DocsNote>
      </DocsSection>
      <DocsActionLink href='/docs/agent'>{t('Agent reference')}</DocsActionLink>
      <DocsSection title={t('3. Confirm the tool is available')}>
        <p>
          {t(
            'After restarting, check that imagegen is connected and generate_image appears in the tool list. Then try generating one image.'
          )}
        </p>
        <DocsTextLink href='/docs/images'>
          {t('Generate your first image')}
        </DocsTextLink>{' '}
        ·{' '}
        <DocsTextLink href='/docs/troubleshooting'>
          {t('Troubleshooting')}
        </DocsTextLink>
      </DocsSection>
    </>
  )
}
