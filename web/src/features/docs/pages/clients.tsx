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
  buildCCSwitchImportUrl,
  CC_SWITCH_SITE_PRESETS,
} from '@/features/home/lib/client-import'

import {
  DocsActionLink,
  DocsCode,
  DocsImage,
  DocsNote,
  DocsSection,
  DocsStep,
  DocsSteps,
  DocsTextLink,
  DocsTitle,
} from '../docs-blocks'
import {
  CC_SWITCH_RELEASES_URL,
  CC_SWITCH_SITE_URL,
  CC_SWITCH_TUTORIALS_URL,
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
        <DocsSteps>
          <DocsStep
            n={1}
            title={t('Copy the address below into ANTHROPIC_BASE_URL.')}
          />
          <DocsStep
            n={2}
            title={t(
              'Do not append /v1. Claude Code calls the Anthropic API from the site root.'
            )}
          />
        </DocsSteps>
        <DocsCode label={t('Anthropic base URL')} code={DOCS_ORIGIN} />
      </DocsSection>
      <DocsSection title={t('Codex and OpenAI-compatible clients')}>
        <DocsSteps>
          <DocsStep
            n={1}
            title={t(
              'Copy the address below into the client base URL or Codex base_url.'
            )}
          />
          <DocsStep
            n={2}
            title={t(
              'The /v1 suffix is required. Without it, Codex and OpenAI SDKs request the wrong path.'
            )}
          />
        </DocsSteps>
        <DocsCode label={t('OpenAI base URL')} code={DOCS_OPENAI_BASE_URL} />
        <DocsNote>
          {t(
            'Swapping the two addresses is the usual reason a key works in one client and fails in the other.'
          )}
        </DocsNote>
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
          'Configure GPT in Codex or Grok in OpenCode with this site.'
        )}
      />
      <DocsSection title={t('Install')}>
        <p>
          {t(
            'Download and install CC Switch. When the browser asks to open CC Switch, allow it.'
          )}
        </p>
        <div className='flex flex-wrap gap-3'>
          <DocsActionLink href={CC_SWITCH_SITE_URL} external>
            {t('CC Switch official website')}
          </DocsActionLink>
          <DocsActionLink href={CC_SWITCH_RELEASES_URL} external>
            {t('GitHub releases')}
          </DocsActionLink>
          <DocsActionLink href={CC_SWITCH_TUTORIALS_URL} external>
            {t('CC Switch official tutorials')}
          </DocsActionLink>
        </div>
      </DocsSection>
      <DocsSection title={t('Import from this site')}>
        <DocsSteps>
          <DocsStep
            n={1}
            title={t(
              'Open API Keys, open the menu on the key row, and choose CC Switch.'
            )}
          >
            <DocsActionLink href='/keys' primary>
              {t('API Keys')}
            </DocsActionLink>
          </DocsStep>
          <DocsStep
            n={2}
            title={t(
              'Choose Codex for GPT or OpenCode for Grok, then select a model available to your key.'
            )}
          />
          <DocsStep
            n={3}
            title={t(
              'Click Open CC Switch, check the address and model, and confirm the import.'
            )}
          />
          <DocsStep
            n={4}
            title={t('Enable the provider and restart Codex or OpenCode.')}
          />
        </DocsSteps>
        <DocsNote>
          {t(
            'Both use the /v1 address. Choose a key from Codex 【标准】 for GPT or Grok 【特惠】 for Grok.'
          )}
        </DocsNote>
      </DocsSection>
      <DocsSection title={t('Import configuration template')}>
        <p>
          {t(
            'Import the template, replace sk-your-api-token with your site key in CC Switch, then enable the provider.'
          )}
        </p>
        <div className='space-y-4'>
          {(['codex', 'opencode'] as const).map((app) => {
            const preset = CC_SWITCH_SITE_PRESETS[app]
            return (
              <div key={app} className='space-y-2'>
                <p className='text-sm font-medium'>
                  {preset.label} · {preset.group} · <code>{preset.model}</code>
                </p>
                <DocsActionLink
                  href={buildCCSwitchImportUrl({
                    app,
                    name: preset.name,
                    origin: DOCS_ORIGIN,
                    model: preset.model,
                  })}
                  external
                >
                  {t('Import {{client}} template', { client: preset.label })}
                </DocsActionLink>
              </div>
            )
          })}
        </div>
        <div className='max-w-lg'>
          <DocsImage
            src='/docs-images/ccswitch-import-gpt-8d3a3f9010.png'
            alt={t('CC Switch GPT import confirmation')}
            caption={t(
              'Captured in CC Switch 4.0.16 with this site address and an example key. Replace the example key before use.'
            )}
          />
        </div>
      </DocsSection>
      <DocsSection title={t('Add the provider yourself')}>
        <DocsSteps>
          <DocsStep
            n={1}
            title={t(
              'Select Codex for GPT or OpenCode for Grok, add a custom provider, and paste your API key.'
            )}
          />
          <DocsStep
            n={2}
            title={t(
              'Use the address below. For Codex select OpenAI Responses; for OpenCode select OpenAI Compatible (Chat Completions).'
            )}
          >
            <DocsCode
              label={t('OpenAI base URL')}
              code={DOCS_OPENAI_BASE_URL}
            />
          </DocsStep>
          <DocsStep n={3} title={t('Save the provider and enable it.')} />
        </DocsSteps>
        <DocsImage
          src='/docs-images/ccswitch-codex-gpt-1e460de954.png'
          alt={t('CC Switch Codex GPT configuration')}
          caption={t(
            'Captured in CC Switch 4.0.16 with this site address and an example key. Replace the example key before use.'
          )}
        />
        <DocsImage
          src='/docs-images/ccswitch-opencode-grok-21c7db8a73.png'
          alt={t('CC Switch OpenCode Grok configuration')}
          caption={t(
            'Captured in CC Switch 4.0.16 with this site address and an example key. Replace the example key before use.'
          )}
        />
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
        <DocsSteps>
          <DocsStep
            n={1}
            title={t('Open a terminal and run the two commands below.')}
          />
          <DocsStep
            n={2}
            title={t(
              'Each command should print a version number. If either command is not found, install Node.js 18 or newer from nodejs.org, close the terminal, and open a new one.'
            )}
          >
            <DocsTextLink href='https://nodejs.org/' external>
              nodejs.org
            </DocsTextLink>
          </DocsStep>
          <DocsStep
            n={3}
            title={t('Install Claude Code with the third command.')}
          />
        </DocsSteps>
        <DocsCode label='node -v' code='node -v' />
        <DocsCode label='npm -v' code='npm -v' />
        <DocsCode
          label={t('Install Claude Code')}
          code='npm install -g @anthropic-ai/claude-code'
        />
      </DocsSection>
      <DocsSection title={t('Write settings.json')}>
        <DocsSteps>
          <DocsStep
            n={1}
            title={t(
              'Create the file if it does not exist. This is your user settings file, not a file inside the project.'
            )}
          />
          <DocsStep
            n={2}
            title={t('Windows: %USERPROFILE%\\.claude\\settings.json')}
          />
          <DocsStep
            n={3}
            title={t('macOS and Linux: ~/.claude/settings.json')}
          />
          <DocsStep
            n={4}
            title={t(
              'Paste the JSON below. Replace sk-your-api-token with a key from API Keys. ANTHROPIC_BASE_URL must not end in /v1. ANTHROPIC_AUTH_TOKEN is sent as the Bearer token.'
            )}
          >
            <DocsTextLink href='/keys'>{t('API Keys')}</DocsTextLink>
          </DocsStep>
        </DocsSteps>
        <DocsCode label='settings.json' code={CLAUDE_CODE_SETTINGS} />
        <p>
          {t(
            'The model you select in Claude Code must be listed for that key group in Model Square.'
          )}{' '}
          <DocsTextLink
            href='https://code.claude.com/docs/en/env-vars'
            external
          >
            {t('Claude Code environment variable reference')}
          </DocsTextLink>
        </p>
      </DocsSection>
      <DocsSection title={t('Try it')}>
        <DocsSteps>
          <DocsStep n={1} title={t('In the project folder, run claude.')} />
          <DocsStep
            n={2}
            title={t(
              'Ask a short question. A reply means the address and key are accepted.'
            )}
          />
          <DocsStep
            n={3}
            title={t(
              'If Claude Code still asks you to sign in to Anthropic, check that ANTHROPIC_BASE_URL has no /v1 and that the key group includes the model.'
            )}
          />
        </DocsSteps>
        <DocsCode label='claude' code='claude' />
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
          'This page configures Codex CLI in a terminal. For the desktop app, follow the CC Switch guide. The CLI uses a base URL ending in /v1 and reads the key from the same terminal environment.'
        )}
      />
      <DocsSection title={t('Check Node.js')}>
        <DocsSteps>
          <DocsStep
            n={1}
            title={t(
              'Use the same Node.js check as Claude Code. node -v and npm -v must both print a version.'
            )}
          >
            <DocsTextLink href='https://nodejs.org/' external>
              nodejs.org
            </DocsTextLink>
          </DocsStep>
          <DocsStep n={2} title={t('Install Codex with the command below.')} />
        </DocsSteps>
        <DocsCode label='node -v' code='node -v' />
        <DocsCode label='npm -v' code='npm -v' />
        <DocsCode
          label={t('Install Codex')}
          code='npm install -g @openai/codex'
        />
      </DocsSection>
      <DocsSection title={t('Write config.toml')}>
        <DocsSteps>
          <DocsStep
            n={1}
            title={t('Windows: %USERPROFILE%\\.codex\\config.toml')}
          />
          <DocsStep n={2} title={t('macOS and Linux: ~/.codex/config.toml')} />
          <DocsStep
            n={3}
            title={t(
              'Paste the file below. model_provider points at the dahua table. base_url must end in /v1. wire_api stays responses, which is the API Codex uses. requires_openai_auth is false so Codex does not ask for an OpenAI login.'
            )}
          />
          <DocsStep
            n={4}
            title={t(
              'gpt-6.1-sol is only an example. Replace it with a model id from Model Square, and use a key whose group matches that card.'
            )}
          />
        </DocsSteps>
        <DocsCode label='config.toml' code={CODEX_CONFIG} />
        <p>
          <DocsTextLink
            href='https://learn.chatgpt.com/docs/config-file/config-sample'
            external
          >
            {t('Codex sample configuration')}
          </DocsTextLink>
        </p>
      </DocsSection>
      <DocsSection title={t('Set the API key')}>
        <DocsSteps>
          <DocsStep
            n={1}
            title={t(
              'Do not put the key in config.toml. Codex reads env_key, so the secret stays in DAHUA_API_KEY.'
            )}
          />
          <DocsStep
            n={2}
            title={t(
              'Set the variable below, then run codex in that same terminal. These variables last only for that terminal session; a desktop app launched elsewhere may not inherit them.'
            )}
          >
            <DocsTextLink href='/keys'>{t('API Keys')}</DocsTextLink>
          </DocsStep>
          <DocsStep
            n={3}
            title={t(
              'Run codex in the project folder and send a short prompt.'
            )}
          />
        </DocsSteps>
        <DocsCode label='macOS / Linux' code={CODEX_ENV_UNIX} />
        <DocsCode label='Windows PowerShell' code={CODEX_ENV_WINDOWS} />
        <DocsCode label='codex' code='codex' />
      </DocsSection>
    </>
  )
}
