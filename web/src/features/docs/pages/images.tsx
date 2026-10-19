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
  DocsSection,
  DocsTextLink,
  DocsCode,
  DocsFigure,
} from '../docs-blocks'
import { IMAGE_CURL, IMAGE_PYTHON } from '../site'

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
            'First finish the MCP setup. In the assistant chat, paste the prompt below. Replace the output folder with a real absolute path on the machine running MCP.'
          )}
        </p>
        <DocsTextLink href='/docs/image-mcp'>
          {t('Image MCP setup')}
        </DocsTextLink>
        <DocsCode
          label={t('Generate your first image')}
          code={t(
            'Use imagegen generate_image to create one image: a red ceramic mug on a pale gray table, soft daylight, no text. Use gpt-image-2.5-flare, size 1K, quality high. Save it in /ABSOLUTE/PATH/ai-images and return the full file path.'
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
      <DocsSection title={t('Choose size, model and save location')}>
        <p>
          {t(
            '1K, 2K and 4K are square presets. For a portrait, request 1536x2048; for landscape, 2048x1536. flare is the default; sunburst is an option for more detailed editing. Start with n=1.'
          )}
        </p>
        <p>
          {t(
            'An explicit outputPath sets the first file location. Otherwise outputDir overrides IMAGE_OUTPUT_DIR. Without either, MCP uses project/ai-images when started in a project, or home/ai-images. Always trust the returned absolute path.'
          )}
        </p>
        <DocsTextLink href='/docs/image-edit'>
          {t('Edit an existing image')}
        </DocsTextLink>
      </DocsSection>
      <DocsSection
        title={t('For developers: call the image API directly')}
        id='api'
      >
        <p>
          {t(
            'These commands are for macOS/Linux or a Bash terminal. Use the image-group key. The response contains data[].b64_json or data[].url; JSON itself is not the image file.'
          )}
        </p>
        <DocsCode
          label='Bash · POST /v1/images/generations'
          code={IMAGE_CURL}
        />
        <p>
          {t(
            'Install the Python SDK with python -m pip install openai. Run the example from a writable folder; it saves base64 output as out.png or prints the download URL.'
          )}
        </p>
        <DocsCode label='Python' code={IMAGE_PYTHON} />
      </DocsSection>
    </>
  )
}
