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
  DocsImage,
  DocsNote,
  DocsSection,
  DocsStep,
  DocsSteps,
  DocsTextLink,
  DocsTitle,
} from '../docs-blocks'
import {
  ApiKeyFormFigure,
  ModelGroupFigure,
  RedeemFormFigure,
} from '../docs-figures'
import { DOCS_CARD_SHOP_URL } from '../site'

export function DocsRegisterPage() {
  const { t } = useTranslation()

  return (
    <>
      <DocsTitle
        title={t('Create an account')}
        summary={t(
          'Use email or GitHub. This site does not offer Google sign-in. Finish this page before buying quota.'
        )}
      />

      <DocsSection title={t('Open the sign-up page')}>
        <DocsSteps>
          <DocsStep
            n={1}
            title={t(
              'Open Sign up in the browser, or use Get Started on the home page.'
            )}
          >
            <DocsTextLink href='/sign-up'>{t('Sign up')}</DocsTextLink>
          </DocsStep>
        </DocsSteps>
        <DocsImage
          src='/docs-images/sign-up.png'
          alt={t('Sign-up page screenshot')}
          caption={t(
            'The sign-up page. The form is email registration. GitHub is the button under the form.'
          )}
        />
      </DocsSection>

      <DocsSection title={t('Register with email')}>
        <DocsSteps>
          <DocsStep
            n={1}
            title={t(
              'Fill in Username. You can also use this name later to sign in.'
            )}
          />
          <DocsStep
            n={2}
            title={t(
              'Fill in Password and Confirm password. The password must be 8 to 128 characters.'
            )}
          />
          <DocsStep
            n={3}
            title={t(
              'Fill in an email address you can open. Send code stays disabled until the address is valid. Open the email, copy the code, and paste it into Verification code.'
            )}
          />
          <DocsStep
            n={4}
            title={t(
              'Complete the Cloudflare check on the page. Create account stays disabled until that check finishes.'
            )}
          />
          <DocsStep
            n={5}
            title={t(
              'Click Create account. When it succeeds, the page asks you to sign in.'
            )}
          />
        </DocsSteps>
        <DocsNote>
          {t(
            'If the verification email does not arrive, check the spam folder and wait a minute before sending the code again.'
          )}
        </DocsNote>
      </DocsSection>

      <DocsSection title={t('Register with GitHub')}>
        <DocsSteps>
          <DocsStep
            n={1}
            title={t('On the same sign-up page, click Continue with GitHub.')}
          />
          <DocsStep
            n={2}
            title={t(
              'Approve the request on GitHub. The site then creates the account and signs you in.'
            )}
          />
          <DocsStep
            n={3}
            title={t(
              'The next time, use that same GitHub account. You do not set a separate password for it.'
            )}
          />
        </DocsSteps>
      </DocsSection>

      <DocsSection title={t('Sign in')}>
        <DocsImage
          src='/docs-images/sign-in.png'
          alt={t('Sign-in page screenshot')}
          caption={t(
            'The sign-in page. Use the username or email with the password, or use GitHub again.'
          )}
        />
        <DocsSteps>
          <DocsStep n={1} title={t('Open Sign in.')}>
            <DocsTextLink href='/sign-in'>{t('Sign in')}</DocsTextLink>
          </DocsStep>
          <DocsStep
            n={2}
            title={t(
              'Type the username or email and the password, then continue. GitHub users click Continue with GitHub instead.'
            )}
          />
        </DocsSteps>
        <DocsNote>
          {t(
            'This browser keeps you signed in. A different computer, or a browser whose cookies were cleared, asks you to sign in again.'
          )}
        </DocsNote>
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
          'Buy a code at the card shop, then redeem it in Wallet. 1 yuan paid equals 1 USD of quota.'
        )}
      />

      <DocsSection title={t('Buy a code')}>
        <DocsSteps>
          <DocsStep n={1} title={t('Open the card shop.')}>
            <DocsTextLink href={DOCS_CARD_SHOP_URL} external>
              {DOCS_CARD_SHOP_URL}
            </DocsTextLink>
          </DocsStep>
          <DocsStep
            n={2}
            title={t(
              'Under 中转卡密, choose one product. The shop lists 10 yuan, 20 yuan, and 100 yuan codes.'
            )}
          />
          <DocsStep
            n={3}
            title={t(
              'In the order window, fill in a phone number or an email address. The page recommends a phone number. An email address also receives the code.'
            )}
          />
          <DocsStep
            n={4}
            title={t(
              'Choose Alipay or WeChat, then click 去支付 and finish the payment.'
            )}
          />
          <DocsStep
            n={5}
            title={t(
              'The shop delivers the code automatically. Copy it from the order result. If you closed the page, use 订单查询 on the shop with the same contact.'
            )}
          />
        </DocsSteps>
        <DocsImage
          src='/docs-images/card-shop.png'
          alt={t('Card shop screenshot')}
          caption={t('The card shop home. Choose a code under 中转卡密.')}
        />
        <DocsImage
          src='/docs-images/card-buy.png'
          alt={t('Card shop order screenshot')}
          caption={t(
            'The order window for the 10 yuan code. It states that 1 yuan equals 1 USD of quota. Pay with Alipay or WeChat.'
          )}
        />
        <DocsNote>
          {t(
            'A 10 yuan code adds 10 USD of quota. The price later shown in Model Square is this quota, not a second charge. If the shop page stays blank, turn off the system proxy and open it again.'
          )}
        </DocsNote>
      </DocsSection>

      <DocsSection title={t('Redeem the code')}>
        <DocsSteps>
          <DocsStep
            n={1}
            title={t('Sign in, then open Wallet from the console menu.')}
          >
            <DocsTextLink href='/wallet'>{t('Wallet')}</DocsTextLink>
          </DocsStep>
          <DocsStep n={2} title={t('Find the block titled Have a Code?')} />
          <DocsStep
            n={3}
            title={t(
              'Paste the code into Enter your redemption code, then click Redeem. The quota is added to this account immediately.'
            )}
          />
        </DocsSteps>
        <RedeemFormFigure />
        <p className='text-muted-foreground text-xs'>
          {t(
            'Field illustration only. Find the redemption-code input and Redeem button in your Wallet.'
          )}
        </p>
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
          'Claude Code, Codex, and CC Switch all use an API key from this site. The key group decides which models that key can call.'
        )}
      />

      <DocsSection title={t('Create the key')}>
        <DocsSteps>
          <DocsStep n={1} title={t('Sign in, then open API Keys.')}>
            <DocsTextLink href='/keys'>{t('API Keys')}</DocsTextLink>
          </DocsStep>
          <DocsStep
            n={2}
            title={t('Click Create API Key. A panel opens from the side.')}
          />
          <DocsStep
            n={3}
            title={t(
              'Name: use the client name, such as Claude Code or Codex, so you can tell keys apart later.'
            )}
          />
          <DocsStep
            n={4}
            title={t(
              'Group: select the group shown for your model in Model Square. Current names can change. For the image MCP, create a separate key in 生图 【标准】.'
            )}
          />
          <DocsStep
            n={5}
            title={t(
              'Expiration Time: leave Never expires unless you want the key to stop on a date.'
            )}
          />
          <DocsStep n={6} title={t('Quantity: leave 1.')} />
          <DocsStep
            n={7}
            title={t(
              'Unlimited Quota: you can turn this on. The key can still spend only the quota remaining on the account.'
            )}
          />
          <DocsStep
            n={8}
            title={t(
              'Leave Model Limits and the IP whitelist off until you already know you need them.'
            )}
          />
          <DocsStep
            n={9}
            title={t(
              'Click Save changes. Copy the key when it is shown. It starts with sk-. The row menu can copy it again later.'
            )}
          />
        </DocsSteps>
        <ApiKeyFormFigure />
        <p className='text-muted-foreground text-xs'>
          {t(
            'Field illustration only. Follow your current interface and select the group for your model.'
          )}
        </p>
        <DocsNote>
          {t(
            'A wrong group returns a model-not-found error even when the key and the address are correct.'
          )}
        </DocsNote>
      </DocsSection>

      <DocsSection title={t('Check the group in Model Square')}>
        <DocsSteps>
          <DocsStep
            n={1}
            title={t('Open Model Square from the top of the site.')}
          >
            <DocsTextLink href='/pricing'>{t('Model Square')}</DocsTextLink>
          </DocsStep>
          <DocsStep
            n={2}
            title={t(
              'Search for the model you want. Each card shows the price per 1M tokens and a Group line.'
            )}
          />
          <DocsStep
            n={3}
            title={t(
              'Use the name on that Group line when you create the key. For example, a card that says claude-kiro must be called with a key in the claude-kiro group. Another model can show a different group.'
            )}
          />
        </DocsSteps>
        <DocsImage
          src='/docs-images/model-square.png'
          alt={t('Model Square screenshot')}
          caption={t(
            'Model Square. Read the Group line on the card before you create the key. Prices here are the quota prices.'
          )}
        />
        <ModelGroupFigure />
      </DocsSection>
    </>
  )
}
