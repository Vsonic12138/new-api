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
  DocsNote,
  DocsCode,
  DocsFigure,
} from '../docs-blocks'

export function DocsImageEditPage() {
  const { t } = useTranslation()
  return (
    <>
      <DocsTitle
        title={t('Edit an existing image')}
        summary={t(
          'Give MCP a readable local file, describe one change, then open the new file it returns.'
        )}
      />
      <DocsSection title={t('1. Put the source image in a known folder')}>
        <p>
          {t(
            'Save the source as a local PNG or JPEG. Copy its full path, including the filename. A website URL or an attachment visible in chat is not automatically a local file readable by MCP.'
          )}
        </p>
        <DocsNote>
          {t(
            'Windows, WSL and remote servers have different filesystems. Use a path visible to the process running MCP. Test with one local image before trying a remote URL or shared folder.'
          )}
        </DocsNote>
      </DocsSection>
      <DocsSection title={t('2. State what to change and what to keep')}>
        <DocsCode
          prose
          label={t('Edit an existing image')}
          code={t(
            'Use imagegen to edit /ABSOLUTE/PATH/source.png. Change only the background to pale blue. Keep the mug shape, red color, camera angle and lighting. Save a new file without overwriting the original, and give me its full path.'
          )}
        />
      </DocsSection>
      <DocsSection title={t('3. Compare the result and continue editing')}>
        <p>
          {t(
            'Open the returned file beside the source. To refine that result, pass the new file path in images for the next request. Editing re-generates an image; preserving every pixel or every detail is not guaranteed. Keep your original file and change one thing at a time.'
          )}
        </p>
        <DocsFigure
          caption={t(
            'Editing flow example: source file → images[] + edit instruction → new file → next edit uses the new file.'
          )}
        >
          <div className='overflow-x-auto p-5 font-mono text-sm leading-7'>
            source.png → generate_image → result.png
            <br />
            result.png → generate_image → result-2.png
          </div>
        </DocsFigure>
      </DocsSection>
      <DocsActionLink href='/docs/agent'>{t('Agent reference')}</DocsActionLink>
    </>
  )
}
