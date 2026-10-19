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

export function DocsTroubleshootingPage() {
  const { t } = useTranslation()
  return (
    <>
      <DocsTitle
        title={t('Troubleshooting')}
        summary={t(
          'Start from the symptom. Check the exact error in the client and Usage Logs before changing configuration.'
        )}
      />
      <DocsSection title={t('MCP does not appear or npx is not found')}>
        <p>
          {t(
            'Run node -v and npx --version. Check the configuration path and JSON/TOML syntax, save, then fully restart the client. The first npx launch downloads the package and needs network access. On Windows, try the cmd variant in the MCP guide.'
          )}
        </p>
      </DocsSection>
      <DocsSection title={t('Model not found, 401 or insufficient quota')}>
        <p>
          {t(
            'For model-not-found errors, compare the exact model id and key group. For 401, check that the API key is complete, active and not a redemption code. For insufficient quota, check both account balance and the key quota limit.'
          )}
        </p>
      </DocsSection>
      <DocsSection title={t('The image request times out')}>
        <p>
          {t(
            'MCP uses REQUEST_TIMEOUT_MS for each upstream attempt. Codex uses tool_timeout_sec for the whole tool call; Claude Code uses timeout or MCP_TOOL_TIMEOUT. These are separate limits. Check whether a file or usage record already exists before retrying.'
          )}
        </p>
      </DocsSection>
      <DocsSection
        title={t('Source image cannot be read or output cannot be found')}
      >
        <p>
          {t(
            'Use an absolute source path readable in the MCP environment. For results, use the full path returned by the tool and confirm the folder is writable. An inline preview is optional; a local file is the success check.'
          )}
        </p>
      </DocsSection>
      <DocsSection title={t('429, 5xx or a browser verification page')}>
        <p>
          {t(
            'Wait before retrying rate-limit or upstream errors; avoid repeated concurrent requests. If an API returns HTML or a Cloudflare verification page, keep the status code and request time and contact the site operator. Do not paste your key into a support message.'
          )}
        </p>
      </DocsSection>
      <DocsTextLink href='/docs/image-mcp'>{t('Image MCP setup')}</DocsTextLink>{' '}
      ·{' '}
      <DocsTextLink href='/docs/endpoint'>
        {t('API addresses')}
      </DocsTextLink>{' '}
    </>
  )
}
