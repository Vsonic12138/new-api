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
  DocsCode,
  DocsFigure,
} from '../docs-blocks'

export function DocsImagesPage() {
  const { t } = useTranslation()
  return (
    <>
      <DocsTitle
        title={t('Generate your first image')}
        summary={t(
          'Start with one square image. Once the local file opens, try a different size or model.'
        )}
      />
      <DocsSection title={t('1. Open a project and send this request')}>
        <p>
          {t(
            'First finish the MCP setup. Open your project in the assistant, then copy and send the request below.'
          )}
        </p>
        <DocsTextLink href='/docs/image-mcp'>
          {t('Image MCP setup')}
        </DocsTextLink>
        <DocsCode
          prose
          label={t('Generate your first image')}
          code={t(
            'Use imagegen to create one square image: a red ceramic mug on a pale gray table, soft daylight, no text. Save it in this project and give me the full file path.'
          )}
        />
      </DocsSection>
      <DocsSection
        title={t('2. Approve the tool call and wait for the result')}
      >
        <p>
          {t(
            'If the client asks for permission, allow this image request. Wait for generate_image to finish; do not resend the same request while it is running. Large images can take longer than one minute.'
          )}
        </p>
      </DocsSection>
      <DocsSection title={t('3. Open the returned file')}>
        <p>
          {t(
            'Copy the full path from the tool result into your file manager. A readable image file means success. The assistant may return only a path instead of an inline preview; this is normal.'
          )}
        </p>
        <DocsFigure
          caption={t(
            'Example result layout, not a screenshot of a completed request. Your actual filename is returned by the tool.'
          )}
        >
          <pre className='overflow-x-auto p-4 text-xs leading-6'>
            {'generate_image\n→ /ABSOLUTE/PATH/ai-images/example-flare-1.png'}
          </pre>
        </DocsFigure>
      </DocsSection>

      <DocsActionLink href='/docs/agent'>{t('Agent reference')}</DocsActionLink>
    </>
  )
}
