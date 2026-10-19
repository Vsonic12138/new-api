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

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  buildCherryStudioImportUrl,
  buildMagpieImportUrl,
  SITE_MODEL_PRESETS,
} from '@/features/home/lib/client-import'

import {
  DocsActionLink,
  DocsCode,
  DocsImage,
  DocsNote,
  DocsSection,
  DocsStep,
  DocsSteps,
} from './docs-blocks'
import { DOCS_ORIGIN } from './site'

export function DocsClientSetup(props: {
  client: 'cherry' | 'magpie'
  origin?: string
}) {
  const { t } = useTranslation()
  const origin = props.origin ?? DOCS_ORIGIN
  const cherry = props.client === 'cherry'
  return (
    <div className='space-y-8'>
      <DocsSection title={t('Before you start')}>
        <p>
          {t(
            'Create a separate key for each model group. GPT uses Codex 【标准】; Grok uses Grok 【特惠】. Keep the image MCP key separate.'
          )}
        </p>
        <div className='flex flex-wrap gap-3'>
          <DocsActionLink href='/docs/token'>
            {t('Create an API key')}
          </DocsActionLink>
          <DocsActionLink
            external
            href={
              cherry ? 'https://www.cherry-ai.com/' : 'https://usemagpie.ai/zh/'
            }
          >
            {t('Official website')}
          </DocsActionLink>
          <DocsActionLink
            external
            href={
              cherry
                ? 'https://docs.cherry-ai.com/'
                : 'https://usemagpie.ai/docs/start'
            }
          >
            {t('Official docs')}
          </DocsActionLink>
        </div>
      </DocsSection>
      {!cherry && (
        <DocsNote>
          {t(
            'Install Codex or OpenCode first. If it is missing from Agent, use Install Other Agents. Enable its connection to magpie, then choose the imported model and reasoning effort.'
          )}
        </DocsNote>
      )}
      <Tabs defaultValue='gpt'>
        <TabsList aria-label={t('Choose a model')}>
          <TabsTrigger value='gpt'>GPT</TabsTrigger>
          <TabsTrigger value='grok'>Grok</TabsTrigger>
        </TabsList>
        {(['gpt', 'grok'] as const).map((family) => {
          const preset = SITE_MODEL_PRESETS[family]
          const url = cherry
            ? buildCherryStudioImportUrl({
                name: preset.name,
                apiHost: origin,
                family,
              })
            : buildMagpieImportUrl({
                name: preset.name,
                origin,
                family,
                preferProtocol: 'app',
              })
          let screenshot =
            family === 'gpt'
              ? '/docs-images/cherry-import-gpt-8fb651a95b.png'
              : '/docs-images/cherry-import-grok-d26958d380.png'
          if (!cherry) {
            screenshot =
              family === 'gpt'
                ? '/docs-images/magpie-provider-gpt-87ed10fa3d.png'
                : '/docs-images/magpie-provider-grok-d2723c6bd6.png'
          }
          return (
            <TabsContent key={family} value={family} className='space-y-8 pt-4'>
              <DocsSection title={t('1. Import the provider')}>
                <p>
                  <code>{preset.model}</code> · {preset.group} ·{' '}
                  {preset.protocol}
                </p>
                <DocsActionLink href={url} external primary>
                  {t('Import {{client}} template', {
                    client: `${cherry ? 'Cherry Studio' : 'magpie'} · ${family === 'gpt' ? 'GPT' : 'Grok'}`,
                  })}
                </DocsActionLink>
                <DocsNote>
                  {t(
                    'These buttons import an example key. Replace sk-your-api-token with your own key in the app before testing. Importing a provider does not set the model or reasoning effort.'
                  )}
                </DocsNote>
                <DocsSteps>
                  <DocsStep
                    n={1}
                    title={t(
                      'Allow the browser to open the app, then check the provider name and address.'
                    )}
                  />
                  <DocsStep
                    n={2}
                    title={t(
                      'Confirm the import, replace the example key, and save.'
                    )}
                  />
                </DocsSteps>
                <DocsCode label='Base URL' code={`${origin}/v1`} />
                <div className='mx-auto max-w-xl'>
                  <DocsImage
                    src={screenshot}
                    alt={t(
                      cherry
                        ? 'Cherry Studio Chinese import dialog'
                        : 'magpie Chinese provider settings'
                    )}
                    caption={t(
                      cherry
                        ? 'Chinese app screenshot: confirm this site address and replace the example key.'
                        : 'magpie 0.1.1267 local web interface: choose the protocol shown above and replace the example key.'
                    )}
                  />
                </div>
              </DocsSection>
              <DocsSection
                title={t('2. Select the model and reasoning effort')}
              >
                <DocsSteps>
                  <DocsStep
                    n={1}
                    title={t(
                      cherry
                        ? 'Open Settings → Model Services. Select the imported provider, then add a model manually using the model ID below.'
                        : 'In Agents, choose Codex for GPT or OpenCode for Grok. Select the imported provider and the model ID below.'
                    )}
                  >
                    <DocsCode label={t('Model ID')} code={preset.model} />
                    {cherry && family === 'gpt' && (
                      <div className='mx-auto max-w-xl'>
                        <DocsImage
                          src='/docs-images/cherry-add-model-gpt-eba1540538.png'
                          alt={t('Cherry Studio Chinese add model dialog')}
                          caption={t(
                            'Enter gpt-6.1-sol as the model ID. The display name is optional.'
                          )}
                        />
                      </div>
                    )}
                  </DocsStep>
                  <DocsStep
                    n={2}
                    title={t(
                      cherry
                        ? 'Select this model in a conversation. Beside the input box, open Response Settings, then move Effort to High. The setting saves automatically.'
                        : 'Open the agent model settings, set Reasoning Effort to high, and save. Restart the agent so it reads the new settings.'
                    )}
                  />
                </DocsSteps>
                {cherry && family === 'gpt' && (
                  <div className='mx-auto max-w-sm'>
                    <DocsImage
                      src='/docs-images/cherry-reasoning-high-41fa10a5a0.png'
                      alt={t('Set reasoning effort to high')}
                      caption={t(
                        'Cherry Studio 2.1.7: the input box response settings show High after moving the slider.'
                      )}
                    />
                  </div>
                )}
                <p>
                  {t(
                    'Default reasoning effort: high. Supported levels: {{levels}}.',
                    { levels: preset.efforts.join(' / ') }
                  )}
                </p>
                <p>
                  {t(
                    'Use high first. To change it later, select another supported level in the same setting. Higher effort can increase response time and token usage.'
                  )}
                </p>
              </DocsSection>
              <DocsSection title={t('3. Confirm it works')}>
                <p>
                  {t(
                    'Start a new conversation and send Hello. Check that the selected model and high are still displayed. A reply confirms the connection; importing alone does not.'
                  )}
                </p>
                <DocsNote>
                  {t(
                    'The image MCP guide below is for Codex or Cursor. Configure MCP in the assistant that runs it; importing a provider into Cherry Studio or magpie does not install MCP.'
                  )}
                </DocsNote>
                <div className='flex flex-wrap gap-3'>
                  <DocsActionLink href='/docs/image-mcp'>
                    {t('Image MCP setup')}
                  </DocsActionLink>
                  <DocsActionLink href='/docs/troubleshooting'>
                    {t('Troubleshooting')}
                  </DocsActionLink>
                </div>
              </DocsSection>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
