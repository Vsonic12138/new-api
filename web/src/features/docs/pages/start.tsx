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
  DocsSection,
  DocsStep,
  DocsSteps,
  DocsTextLink,
  DocsTitle,
} from '../docs-blocks'

export function DocsStartPage() {
  const { t } = useTranslation()

  return (
    <>
      <DocsTitle
        title={t('Start here')}
        summary={t(
          'Follow the six steps in order. When you finish, Claude Code or Codex can call this site with your own API key.'
        )}
      />
      <DocsSection title={t('Order of steps')}>
        <DocsSteps>
          <DocsStep n={1} title={t('Create an account')}>
            <p>
              {t('Email or GitHub. There is no Google sign-in.')}{' '}
              <DocsTextLink href='/docs/register'>
                {t('Open this step')}
              </DocsTextLink>
            </p>
          </DocsStep>
          <DocsStep n={2} title={t('Sign in')}>
            <p>{t('Use the same method you registered with.')}</p>
          </DocsStep>
          <DocsStep n={3} title={t('Add quota with a redemption code')}>
            <p>
              {t(
                'Buy a code, then redeem it in Wallet. 1 yuan equals 1 USD of quota.'
              )}{' '}
              <DocsTextLink href='/docs/topup'>
                {t('Open this step')}
              </DocsTextLink>
            </p>
          </DocsStep>
          <DocsStep n={4} title={t('Create an API key')}>
            <p>
              {t('Choose the group printed on the model card in Model Square.')}{' '}
              <DocsTextLink href='/docs/token'>
                {t('Open this step')}
              </DocsTextLink>
            </p>
          </DocsStep>
          <DocsStep n={5} title={t('Copy the API address')}>
            <p>
              {t(
                'Claude Code uses the site root. Codex and other OpenAI-compatible clients add /v1.'
              )}{' '}
              <DocsTextLink href='/docs/endpoint'>
                {t('Open this step')}
              </DocsTextLink>
            </p>
          </DocsStep>
          <DocsStep n={6} title={t('Connect a client')}>
            <p>
              {t(
                'CC Switch is the shorter path. The Claude Code and Codex pages show the manual files.'
              )}{' '}
              <DocsTextLink href='/docs/cc-switch'>
                {t('Set up CC Switch')}
              </DocsTextLink>
            </p>
          </DocsStep>
        </DocsSteps>
        <p>
          {t('Cherry Studio, DSH, and ZCode are documented on the')}{' '}
          <DocsTextLink href='/'>{t('Home')}</DocsTextLink>.
        </p>
      </DocsSection>
    </>
  )
}
