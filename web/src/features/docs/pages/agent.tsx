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

import { CopyButton } from '@/components/copy-button'

import { AGENT_GUIDE } from '../agent-guide'
import {
  DocsTitle,
  DocsSection,
  DocsCode,
  DocsNote,
  DocsActionLink,
} from '../docs-blocks'
import {
  CLAUDE_MCP_ADD,
  CODEX_MCP_CONFIG,
  DOCS_MCP_CONFIG,
  DOCS_AGENT_URL,
  IMAGE_CURL,
  IMAGE_PYTHON,
  IMAGE_EDIT_TOOL,
  IMAGE_EDIT_CURL,
} from '../site'

export function DocsAgentPage() {
  const { t } = useTranslation()
  return (
    <>
      <DocsTitle
        title={t('Agent reference')}
        summary={t(
          'Give this reference to an AI assistant. It contains the configuration, tool arguments and API examples needed to carry out the task.'
        )}
      />
      <DocsSection title={t('Give the agent a readable document')}>
        <p>
          {t(
            'Send the plain-text URL to your agent, or copy the complete instructions. The text can be fetched without running JavaScript.'
          )}
        </p>
        <div className='flex flex-wrap gap-3'>
          <CopyButton
            value={DOCS_AGENT_URL}
            size='default'
            variant='default'
            aria-label={t('Copy agent document URL')}
          >
            {t('Copy agent document URL')}
          </CopyButton>
          <CopyButton
            value={AGENT_GUIDE}
            size='default'
            variant='outline'
            aria-label={t('Copy agent instructions')}
          >
            {t('Copy agent instructions')}
          </CopyButton>
        </div>
        <DocsActionLink href='/agent-guide.txt' external>
          {t('Open plain-text reference')}
        </DocsActionLink>
      </DocsSection>
      <DocsSection title={t('MCP configuration')} id='clients'>
        <p>
          {t(
            'Choose only the instructions for your client. Replace sk-your-image-key with the image key. Merge the new entry into existing configuration; do not overwrite your other providers or MCP servers.'
          )}
        </p>
        <p className='flex flex-wrap gap-4'>
          <a
            className='text-primary underline underline-offset-4'
            href='#codex'
          >
            Codex
          </a>
          <a
            className='text-primary underline underline-offset-4'
            href='#claude-code'
          >
            Claude Code
          </a>
          <a
            className='text-primary underline underline-offset-4'
            href='#cursor'
          >
            Cursor
          </a>
        </p>
        <h3 id='codex' className='scroll-mt-24 font-semibold'>
          Codex
        </h3>
        <p>
          {t(
            'Codex: append this to ~/.codex/config.toml (Windows: %USERPROFILE%\\.codex\\config.toml). Save and restart Codex. Your existing model provider stays in the same file.'
          )}
        </p>
        <DocsCode label='Codex · config.toml' code={CODEX_MCP_CONFIG} />
        <h3 id='claude-code' className='scroll-mt-24 font-semibold'>
          Claude Code
        </h3>
        <p>
          {t(
            'Claude Code: run this single-line command in a terminal. It adds a user-level server available across projects. Restart Claude Code, run /mcp, and check that imagegen is connected.'
          )}
        </p>
        <DocsCode label='Claude Code' code={CLAUDE_MCP_ADD} />
        <h3 id='cursor' className='scroll-mt-24 font-semibold'>
          Cursor
        </h3>
        <p>
          {t(
            'Cursor: open Settings, find MCP, and add a local stdio server. Merge this JSON into ~/.cursor/mcp.json or your project .cursor/mcp.json, save, and enable imagegen. Never commit a file containing your key.'
          )}
        </p>
        <DocsCode label='Cursor · mcp.json' code={DOCS_MCP_CONFIG} />
        <DocsNote>
          {t(
            'Windows: if npx fails to start, use cmd as command and prepend /c, npx to args. Only use this variant if the normal configuration fails.'
          )}
        </DocsNote>
      </DocsSection>

      <DocsSection title={t('Image tool arguments')} id='image-tool'>
        <DocsCode label='generate_image · JSON' code={IMAGE_EDIT_TOOL} />
        <p>
          {t(
            'Use images[] for local source paths. Omit size when editing to reuse the source dimensions. Use the returned file path for the next edit.'
          )}
        </p>
      </DocsSection>
      <DocsSection title={t('Image API examples')} id='api'>
        <DocsCode
          label='Bash · POST /v1/images/generations'
          code={IMAGE_CURL}
        />
        <DocsCode label='Python' code={IMAGE_PYTHON} />
        <DocsCode label='Bash · POST /v1/images/edits' code={IMAGE_EDIT_CURL} />
      </DocsSection>
    </>
  )
}
