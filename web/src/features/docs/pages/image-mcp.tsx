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
  DocsNote,
  DocsCode,
  DocsImage,
  DocsFigure,
} from '../docs-blocks'
import {
  CLAUDE_MCP_ADD,
  CODEX_MCP_CONFIG,
  DOCS_MCP_CONFIG,
  NODE_CHECK,
} from '../site'

export function DocsImageMcpPage() {
  const { t } = useTranslation()
  return (
    <>
      <DocsTitle
        title={t('Image MCP setup')}
        summary={t(
          'Connect your assistant to the image service. Keep your chat key in the assistant and put your image-group key in IMAGE_API_TOKEN.'
        )}
      />
      <DocsSection title={t('How the two keys work together')}>
        <p>
          {t(
            'The assistant uses your chat key. MCP reads IMAGE_API_TOKEN for image requests. Its default image model is gpt-image-2.5-flare. You do not replace the assistant model with an image model.'
          )}
        </p>
        <DocsFigure caption={t('How the two keys work together')}>
          <ol className='grid gap-5 p-5 sm:grid-cols-4'>
            {t('Chat model → generate_image → image API → local image file')
              .split(' → ')
              .map((label, index) => (
                <li
                  key={label}
                  className='flex gap-3 text-sm leading-6 sm:flex-col'
                >
                  <span className='bg-muted flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold'>
                    {index + 1}
                  </span>
                  <span>{label}</span>
                </li>
              ))}
          </ol>
        </DocsFigure>
      </DocsSection>
      <DocsSection title={t('1. Prepare the image key and Node.js')}>
        <p>
          {t(
            'Open API Keys, create a key named Image MCP, choose 生图 【标准】, save, and copy its sk- value. Your account needs available quota.'
          )}
        </p>
        <DocsImage
          src='/docs-images/token-create.png'
          alt={t('Create an API key')}
          caption={t(
            'Image key example: the selected group is 生图 【标准】. Use your own key; the name is only for identification.'
          )}
        />
        <p>
          {t(
            'Open Terminal (macOS/Linux) or PowerShell (Windows). Run both commands below. If either fails, install Node.js 18 or newer, then reopen your app so it can find npx.'
          )}
        </p>
        <DocsCode label='Terminal' code={NODE_CHECK} />
        <DocsTextLink href='https://nodejs.org/' external>
          Node.js
        </DocsTextLink>
      </DocsSection>
      <DocsSection title={t('2. Add MCP in your client')} id='clients'>
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
      <DocsSection title={t('3. Confirm the tool is available')}>
        <p>
          {t(
            'Find imagegen and its generate_image tool in the client tool list. Connected means the local program started; it does not prove the image key works. Generate one image next to verify the full path.'
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
      <p className='text-muted-foreground text-xs'>
        <DocsTextLink
          href='https://github.com/Vsonic12138/bigyellow12138-imagegen-mcp'
          external
        >
          imagegen-mcp
        </DocsTextLink>{' '}
        ·{' '}
        <DocsTextLink
          href='https://learn.chatgpt.com/docs/extend/mcp?surface=cli'
          external
        >
          Codex MCP
        </DocsTextLink>{' '}
        ·{' '}
        <DocsTextLink href='https://code.claude.com/docs/en/mcp' external>
          Claude Code MCP
        </DocsTextLink>
      </p>
    </>
  )
}
