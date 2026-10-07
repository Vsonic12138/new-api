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
  DocsList,
  DocsNote,
  DocsSection,
  DocsTextLink,
  DocsTitle,
} from '../docs-blocks'
import { DOCS_CARD_SHOP_URL } from '../site'

export function DocsRegisterPage() {
  const { t } = useTranslation()

  return (
    <>
      <DocsTitle
        title={t('Create an account')}
        summary={t(
          'Registration uses an email and password, or GitHub. This site does not use Google sign-in.'
        )}
      />
      <DocsSection title={t('Email registration')}>
        <DocsList>
          <li>
            {t('Open')}{' '}
            <DocsTextLink href='/sign-up'>{t('Sign up')}</DocsTextLink>.
          </li>
          <li>
            {t(
              'Enter an email address, a username, and a password. If the page asks for an email code, use the code from that message before submitting.'
            )}
          </li>
          <li>
            {t(
              'Complete the human check when it is shown, then submit the form.'
            )}
          </li>
        </DocsList>
      </DocsSection>
      <DocsSection title={t('GitHub')}>
        <p>
          {t('On the same page, choose')}{' '}
          <DocsTextLink href='/sign-up'>
            {t('Continue with GitHub')}
          </DocsTextLink>
          . {t('Use the same GitHub account the next time you sign in.')}
        </p>
      </DocsSection>
      <DocsSection title={t('Sign in')}>
        <p>
          {t('After the account exists, open')}{' '}
          <DocsTextLink href='/sign-in'>{t('Sign in')}</DocsTextLink>.{' '}
          {t(
            'Use the email or username with the password, or choose GitHub again.'
          )}
        </p>
      </DocsSection>
    </>
  )
}

export function DocsTopupPage() {
  const { t } = useTranslation()

  return (
    <>
      <DocsTitle
        title={t('Add quota with a redemption code')}
        summary={t(
          'Quota is added by buying a redemption code, then redeeming it in Wallet. 1 yuan paid equals 1 USD of quota.'
        )}
      />
      <DocsSection title={t('Buy a code')}>
        <p>
          {t('Open the card shop')}{' '}
          <DocsTextLink href={DOCS_CARD_SHOP_URL} external>
            {DOCS_CARD_SHOP_URL}
          </DocsTextLink>
          .{' '}
          {t(
            'Pay there and copy the redemption code from the order. If the shop page does not load, turn off the system proxy and try again.'
          )}
        </p>
      </DocsSection>
      <DocsSection title={t('Redeem')}>
        <DocsList>
          <li>
            {t('Sign in, then open')}{' '}
            <DocsTextLink href='/wallet'>{t('Wallet')}</DocsTextLink>.
          </li>
          <li>{t('Paste the code into the redemption field.')}</li>
          <li>{t('Click Redeem. The quota is added to this account.')}</li>
        </DocsList>
        <DocsNote>
          {t(
            'The price shown on this site is quota, not a second charge. A 10 yuan code adds 10 USD of quota.'
          )}
        </DocsNote>
      </DocsSection>
    </>
  )
}

export function DocsTokenPage() {
  const { t } = useTranslation()

  return (
    <>
      <DocsTitle
        title={t('Create an API key')}
        summary={t(
          'Clients call this site with an API key. The key group decides which models that key can use.'
        )}
      />
      <DocsSection title={t('Create the key')}>
        <DocsList>
          <li>
            {t('Open')}{' '}
            <DocsTextLink href='/keys'>{t('API Keys')}</DocsTextLink>{' '}
            {t('and choose Create API Key.')}
          </li>
          <li>
            {t(
              'Name the key after the client, for example Claude Code or Codex.'
            )}
          </li>
          <li>
            {t(
              'Choose a token group. Open Model Square, select that group, and confirm the model you will call is listed there. There is no separate group name required for Claude Code or Codex.'
            )}
          </li>
          <li>
            {t(
              'Leave expiry, model restrictions, and IP allowlists at their defaults unless you already know you need them.'
            )}
          </li>
          <li>
            {t(
              'Submit, then copy the key. It looks like sk- followed by a long string. The key row can copy it again later.'
            )}
          </li>
        </DocsList>
        <DocsNote>
          {t(
            'An unlimited key is still limited by the quota on the account. A model missing from the selected group returns a model-not-found error.'
          )}
        </DocsNote>
        <p>
          <DocsTextLink href='/pricing'>{t('Model Square')}</DocsTextLink>
        </p>
      </DocsSection>
    </>
  )
}
