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
  DocsCode,
  DocsList,
  DocsNote,
  DocsSection,
  DocsTextLink,
  DocsTitle,
} from '../docs-blocks'
import {
  CC_SWITCH_RELEASES_URL,
  CC_SWITCH_SITE_URL,
  CLAUDE_CODE_SETTINGS,
  CODEX_CONFIG,
  CODEX_ENV_UNIX,
  CODEX_ENV_WINDOWS,
  DOCS_OPENAI_BASE_URL,
  DOCS_ORIGIN,
} from '../site'

export function DocsEndpointPage() {
  const { t } = useTranslation()

  return (
    <>
      <DocsTitle
        title={t('API addresses')}
        summary={t(
          'Claude Code uses the site root. Codex and other OpenAI-compatible clients use the same host with /v1.'
        )}
      />
      <DocsSection title={t('Claude Code')}>
        <DocsCode label={t('Anthropic base URL')} code={DOCS_ORIGIN} />
        <p>{t('Do not append /v1 to this address.')}</p>
      </DocsSection>
      <DocsSection title={t('Codex and OpenAI-compatible clients')}>
        <DocsCode label={t('OpenAI base URL')} code={DOCS_OPENAI_BASE_URL} />
        <p>
          {t(
            'Use this address for Codex, OpenAI SDKs, and other clients that expect an OpenAI-compatible API.'
          )}
        </p>
      </DocsSection>
    </>
  )
}

export function DocsCcSwitchPage() {
  const { t } = useTranslation()

  return (
    <>
      <DocsTitle
        title={t('Set up CC Switch')}
        summary={t(
          'CC Switch writes the Claude Code or Codex provider for you. Create an API key first.'
        )}
      />
      <DocsSection title={t('Install')}>
        <p>
          {t('Download CC Switch from')}{' '}
          <DocsTextLink href={CC_SWITCH_RELEASES_URL} external>
            {t('GitHub releases')}
          </DocsTextLink>{' '}
          {t('or from the project site')}{' '}
          <DocsTextLink href={CC_SWITCH_SITE_URL} external>
            ccswitch.io
          </DocsTextLink>
          .{' '}
          {t(
            'Install the package for your system, then open the app once so it can receive an import link.'
          )}
        </p>
      </DocsSection>
      <DocsSection title={t('Import from this site')}>
        <DocsList>
          <li>
            {t('Open')}{' '}
            <DocsTextLink href='/keys'>{t('API Keys')}</DocsTextLink>
            {t(', open the menu on the key row, and choose CC Switch.')}
          </li>
          <li>
            {t(
              'Choose Claude Code or Codex, select a primary model that belongs to this key group, then click Open CC Switch.'
            )}
          </li>
          <li>
            {t(
              'Confirm the provider in CC Switch and enable it. Claude Code can be used immediately. Quit and reopen the terminal before starting Codex.'
            )}
          </li>
        </DocsList>
        <DocsNote>
          {t('The import fills the address for you:')} {DOCS_ORIGIN}{' '}
          {t('for Claude Code, and')} {DOCS_OPENAI_BASE_URL} {t('for Codex.')}
        </DocsNote>
      </DocsSection>
      <DocsSection title={t('Add the provider yourself')}>
        <p>
          {t(
            'In CC Switch, add a custom provider. Paste the API key, and use the address from the API addresses page. Do not swap the two addresses.'
          )}{' '}
          <DocsTextLink href='/docs/endpoint'>
            {t('API addresses')}
          </DocsTextLink>
        </p>
      </DocsSection>
    </>
  )
}

export function DocsClaudeCodePage() {
  const { t } = useTranslation()

  return (
    <>
      <DocsTitle
        title={t('Set up Claude Code')}
        summary={t(
          'Claude Code reads the site root and the API key from settings.json. CC Switch can write this file for you.'
        )}
      />
      <DocsSection title={t('Check Node.js')}>
        <DocsCode label='npm -v' code='npm -v' />
        <p>
          {t(
            'The command should print a version. If it is not found, install Node.js 18 or newer and open a new terminal.'
          )}
        </p>
        <DocsCode
          label={t('Install Claude Code')}
          code='npm install -g @anthropic-ai/claude-code'
        />
      </DocsSection>
      <DocsSection title={t('Write settings.json')}>
        <p>{t('Create the file if it does not exist.')}</p>
        <DocsList>
          <li>{t('Windows: %USERPROFILE%\\.claude\\settings.json')}</li>
          <li>{t('macOS and Linux: ~/.claude/settings.json')}</li>
        </DocsList>
        <DocsCode label='settings.json' code={CLAUDE_CODE_SETTINGS} />
        <p>
          {t('Replace sk-your-api-token with a key from')}{' '}
          <DocsTextLink href='/keys'>{t('API Keys')}</DocsTextLink>.{' '}
          {t(
            'The model you select in Claude Code must be listed for that key group in Model Square.'
          )}
        </p>
      </DocsSection>
      <DocsSection title={t('Try it')}>
        <DocsCode label='claude' code='claude' />
        <p>
          {t(
            'A reply means the address and key are accepted. If Claude Code still asks you to sign in to Anthropic, check that ANTHROPIC_BASE_URL has no /v1 and that the key belongs to a group that includes the model.'
          )}
        </p>
      </DocsSection>
    </>
  )
}

export function DocsCodexPage() {
  const { t } = useTranslation()

  return (
    <>
      <DocsTitle
        title={t('Set up Codex')}
        summary={t(
          'Codex uses the OpenAI-compatible address ending in /v1. The API key stays in an environment variable, not in the config file.'
        )}
      />
      <DocsSection title={t('Check Node.js')}>
        <DocsCode label='npm -v' code='npm -v' />
        <DocsCode
          label={t('Install Codex')}
          code='npm install -g @openai/codex'
        />
      </DocsSection>
      <DocsSection title={t('Write config.toml')}>
        <DocsList>
          <li>{t('Windows: %USERPROFILE%\\.codex\\config.toml')}</li>
          <li>{t('macOS and Linux: ~/.codex/config.toml')}</li>
        </DocsList>
        <DocsCode label='config.toml' code={CODEX_CONFIG} />
        <p>
          {t(
            'gpt-6.1-sol is an example. Replace it with a model id from Model Square that belongs to this key group. The group does not have to be named Codex.'
          )}
        </p>
      </DocsSection>
      <DocsSection title={t('Set the API key')}>
        <DocsCode label='macOS / Linux' code={CODEX_ENV_UNIX} />
        <DocsCode label='Windows PowerShell' code={CODEX_ENV_WINDOWS} />
        <p>
          {t('Replace sk-your-api-token with a key from')}{' '}
          <DocsTextLink href='/keys'>{t('API Keys')}</DocsTextLink>.{' '}
          {t(
            'Open a new terminal after setting the variable, then run codex. requires_openai_auth = false keeps Codex from asking for an OpenAI login.'
          )}
        </p>
        <DocsCode label='codex' code='codex' />
      </DocsSection>
    </>
  )
}
