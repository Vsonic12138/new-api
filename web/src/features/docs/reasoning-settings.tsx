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
import { SITE_MODEL_PRESETS } from '@/features/home/lib/client-import'

import { DocsCode, DocsNote, DocsSection } from './docs-blocks'
import { DOCS_OPENAI_BASE_URL } from './site'

const GROK_OPENCODE_SETTINGS = JSON.stringify(
  {
    npm: '@ai-sdk/openai-compatible',
    options: { baseURL: DOCS_OPENAI_BASE_URL, apiKey: 'sk-your-api-token' },
    models: {
      'grok-4.7': {
        name: 'grok-4.7',
        reasoning: true,
        options: { reasoningEffort: 'high' },
        variants: Object.fromEntries(
          SITE_MODEL_PRESETS.grok.efforts.map((effort) => [
            effort,
            { reasoningEffort: effort },
          ])
        ),
      },
    },
  },
  null,
  2
)

export function DocsReasoningSettings() {
  const { t } = useTranslation()
  return (
    <DocsSection title={t('Set reasoning effort to high')}>
      <Tabs defaultValue='gpt'>
        <TabsList aria-label={t('Choose a model')}>
          <TabsTrigger value='gpt'>GPT</TabsTrigger>
          <TabsTrigger value='grok'>Grok</TabsTrigger>
        </TabsList>
        <TabsContent value='gpt' className='space-y-3 pt-3'>
          <p>
            {t(
              'In CC Switch → Codex, edit the imported provider. In config.toml, keep both reasoning settings below. Save, enable the provider, and restart Codex.'
            )}
          </p>
          <DocsCode
            label='config.toml · high'
            code={
              'model = "gpt-6.1-sol"\nmodel_reasoning_effort = "high"\nplan_mode_reasoning_effort = "high"'
            }
          />
          <p>
            {t(
              'Default reasoning effort: high. Supported levels: {{levels}}.',
              { levels: SITE_MODEL_PRESETS.gpt.efforts.join(' / ') }
            )}
          </p>
          <p>
            {t(
              'To use another level, change both high values to that level. Keep the provider address and key settings intact.'
            )}
          </p>
        </TabsContent>
        <TabsContent value='grok' className='space-y-3 pt-3'>
          <p>
            {t(
              'In CC Switch → OpenCode, edit the imported provider. Replace its provider JSON with the template below, fill in your key, and save. It sets high by default and adds every supported Grok 4.7 variant.'
            )}
          </p>
          <DocsCode label='OpenCode · grok-4.7' code={GROK_OPENCODE_SETTINGS} />
          <p>
            {t(
              'Restart OpenCode, run /models, and choose this provider’s grok-4.7. Use the model variant selector to switch low, medium, high or xhigh.'
            )}
          </p>
          <DocsNote>
            {t(
              'The CC Switch import link carries the connection and model. It does not carry OpenCode variants; complete this step after importing.'
            )}
          </DocsNote>
        </TabsContent>
      </Tabs>
    </DocsSection>
  )
}
