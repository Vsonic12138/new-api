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

import { DocsList, DocsSection, DocsTextLink, DocsTitle } from '../docs-blocks'

export function DocsStartPage() {
  const { t } = useTranslation()

  return (
    <>
      <DocsTitle
        title={t('Start here')}
        summary={t(
          'Create an account, add quota, create an API key, then connect Claude Code or Codex.'
        )}
      />
      <DocsSection title={t('Order of steps')}>
        <DocsList>
          <li>
            <DocsTextLink href='/docs/register'>
              {t('Create an account')}
            </DocsTextLink>
          </li>
          <li>
            <DocsTextLink href='/docs/topup'>
              {t('Add quota with a redemption code')}
            </DocsTextLink>
          </li>
          <li>
            <DocsTextLink href='/docs/token'>
              {t('Create an API key')}
            </DocsTextLink>
          </li>
          <li>
            <DocsTextLink href='/docs/endpoint'>
              {t('API addresses')}
            </DocsTextLink>
          </li>
          <li>
            <DocsTextLink href='/docs/cc-switch'>
              {t('Set up CC Switch')}
            </DocsTextLink>
          </li>
        </DocsList>
        <p>
          {t(
            'CC Switch is the shorter path for Claude Code and Codex. Manual configuration is on the Claude Code and Codex pages.'
          )}
        </p>
        <p>
          {t('Cherry Studio, DSH, and ZCode are documented on the')}{' '}
          <DocsTextLink href='/'>{t('Home')}</DocsTextLink>.
        </p>
      </DocsSection>
    </>
  )
}
