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
import {
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
  CLAUDE_MCP_ADD,
  CODEX_CONFIG,
  CODEX_DOWNLOAD_URL,
  CODEX_ENV_UNIX,
  CODEX_ENV_WINDOWS,
  CODEX_MCP_CONFIG,
  DOCS_CARD_SHOP_URL,
  DOCS_MCP_CONFIG,
  DOCS_OPENAI_BASE_URL,
  IMAGE_CURL,
  IMAGE_PYTHON,
} from '../site'

export function DocsStartPage() {
  return (
    <>
      <DocsTitle
        title='新手指南'
        summary='按顺序完成：注册 → 充值 → 创建 Key → 配置 Codex。配置完成后，Codex、Claude Code、生图 API 和生图 MCP 都可以直接使用。'
      />

      <DocsSection title='1. 注册与登录'>
        <p>
          支持邮箱注册、GitHub 授权登录。注册后请固定使用同一种方式登录。
        </p>
        <DocsImage
          src='/docs-images/sign-up.png'
          alt='注册页面'
          caption='注册页：填写用户名、密码和邮箱，完成人机验证后创建账号。表单下方是 GitHub 登录入口。'
        />
        <p>
          如果收不到验证码或重置邮件，先检查垃圾箱 / 拦截记录，并把发件人加入白名单。
        </p>
        <p>
          <DocsTextLink href='/docs/register'>查看注册与登录说明</DocsTextLink>
        </p>
      </DocsSection>

      <DocsSection title='2. 充值'>
        <DocsSteps>
          <DocsStep n={1} title='在发卡网购买卡密'>
            <p>选择金额下单，支付成功后页面会显示一串卡密。</p>
          </DocsStep>
          <DocsStep n={2} title='回到本站【钱包】兑换'>
            <p>
              把卡密粘贴到「有兑换码吗？」输入框，点击「兑换额度」，
              额度会立即到账，可以在页面上方看到当前余额。
            </p>
          </DocsStep>
        </DocsSteps>
        <DocsImage
          src='/docs-images/card-shop.png'
          alt='发卡网商品页'
          caption='发卡网：选择需要的额度下单。'
        />
        <DocsImage
          src='/docs-images/wallet-redeem.png'
          alt='钱包页面兑换码入口'
          caption='本站钱包页：把卡密粘贴到兑换码输入框，点击「兑换额度」。'
        />
        <p>
          <DocsTextLink href={DOCS_CARD_SHOP_URL} external>
            打开发卡网
          </DocsTextLink>
          {' · '}
          <DocsTextLink href='/docs/topup'>充值说明</DocsTextLink>
        </p>
      </DocsSection>

      <DocsSection title='3. 创建 API Key'>
        <DocsSteps>
          <DocsStep n={1} title='打开侧边栏「API 密钥」，点击「创建 API 密钥」'>
            <p>名称随意填，方便自己区分用途即可。</p>
          </DocsStep>
          <DocsStep n={2} title='选择分组'>
            <p>
              文字模型按用途选择：Codex、Codex-Luna、DeepSeek、Grok、Claude-Kiro；
              生图请选择「生图 【标准】」。
            </p>
          </DocsStep>
          <DocsStep n={3} title='保存并复制 Key'>
            <p>
              保存后列表里会显示 Key，点击可以复制，也可以点后面的按钮查看完整
              Key。
            </p>
          </DocsStep>
        </DocsSteps>
        <DocsImage
          src='/docs-images/token-create.png'
          alt='创建 API 密钥弹窗'
          caption='创建令牌：填写名称，在「分组」里选择要使用的分组，保存即可。'
        />
        <DocsImage
          src='/docs-images/token-menu.png'
          alt='令牌列表与操作菜单'
          caption='令牌列表：Key 可以直接复制；右侧「打开菜单」里还有 CC Switch、复制连接信息等操作。'
        />
        <p>
          <DocsTextLink href='/docs/token'>查看创建令牌的详细说明</DocsTextLink>
        </p>
      </DocsSection>

      <DocsSection title='4. 安装 Codex'>
        <p>
          从 OpenAI 官方下载并安装 Codex（Windows / macOS 都可以）：
          <DocsTextLink href={CODEX_DOWNLOAD_URL} external>
            官方下载地址
          </DocsTextLink>
        </p>
        <DocsNote>
          安装完成后先不要急着登录。先用下一步的 CC Switch 导入本站 Key，再启动
          Codex，可以避免账号被切换到官方登录。
        </DocsNote>
      </DocsSection>

      <DocsSection title='5. 使用 CC Switch 配置 Key（推荐）'>
        <DocsSteps>
          <DocsStep n={1} title='下载并安装 CC Switch'>
            <p>
              从 GitHub Releases 下载对应系统的安装包：
              <DocsTextLink href={CC_SWITCH_RELEASES_URL} external>
                CC Switch Releases
              </DocsTextLink>
            </p>
          </DocsStep>
          <DocsStep n={2} title='从令牌页导入'>
            <p>
              回到本站【API 密钥】页面，找到刚才创建的 Key，点击行末的「打开菜单」，
              选择「CC Switch」；弹窗确认后 Key 会自动写入 CC Switch。
            </p>
          </DocsStep>
          <DocsStep n={3} title='在 CC Switch 中启用'>
            <p>
              打开 CC Switch，在上方选择 OpenAI 图标，切换到本站的 Key 并点击启用。
            </p>
          </DocsStep>
          <DocsStep n={4} title='彻底退出并重启 Codex'>
            <p>从系统托盘右键 Codex 图标选择退出，确认进程结束后再重新打开。</p>
          </DocsStep>
          <DocsStep n={5} title='首次登录使用 API Key'>
            <p>
              第一次使用时，在 Codex 登录界面选择「Sign in another way」，粘贴本站
              Key 即可；之后 CC Switch 会自动接管。
            </p>
          </DocsStep>
        </DocsSteps>
        <DocsImage
          src='/guides/ccswitch/main-window.png'
          alt='CC Switch 主界面'
          caption='CC Switch 主界面：选择应用后，切换到本站的配置并启用。'
        />
        <p>
          新建一个会话，能正常回复就说明配置成功。如果重启后没有生效，先确认 CC
          Switch 已经启动（可以设为开机自启）。
        </p>
      </DocsSection>

      <DocsSection title='6. 手动配置 Codex（进阶）'>
        <p>
          不想安装 CC Switch 时，可以直接修改 Codex 的本地配置。配置文件位于{' '}
          <code>~/.codex/config.toml</code>（Windows 为{' '}
          <code>%USERPROFILE%\.codex\config.toml</code>）。
        </p>
        <DocsCode label='config.toml' code={CODEX_CONFIG} />
        <p>再把 Key 写入环境变量：</p>
        <DocsCode label='macOS / Linux' code={CODEX_ENV_UNIX} />
        <DocsCode label='Windows PowerShell' code={CODEX_ENV_WINDOWS} />
        <p>
          保存后完全退出并重启 Codex。接口地址为{' '}
          <code>{DOCS_OPENAI_BASE_URL}</code>，兼容 OpenAI Responses 协议。
        </p>
        <p>
          <DocsTextLink href='/docs/codex'>查看 Codex 配置的完整说明</DocsTextLink>
        </p>
      </DocsSection>

      <DocsSection title='7. Claude Code（可选）'>
        <p>
          如果你使用 Claude Code，把接口地址指向本站根地址，再用令牌作为{' '}
          <code>ANTHROPIC_AUTH_TOKEN</code> 即可。
        </p>
        <p>
          <DocsTextLink href='/docs/claude-code'>
            查看 Claude Code 配置说明
          </DocsTextLink>
        </p>
      </DocsSection>

      <DocsSection title='8. 生图配置'>
        <p>
          生图走 OpenAI 兼容的图片接口，可以直接用 API、SDK，也可以给 Claude Code
          / Codex / Cursor 配一个生图 MCP。计费按返回的图片张数，0.06 元/张。
        </p>

        <p className='font-medium'>8.1 先创建「生图」分组的 Key</p>
        <p>
          在【API 密钥】里新建令牌，分组选择「生图 【标准】」，保存后复制 Key。
          生图必须使用这个分组的 Key，用文字模型的分组调用会提示模型不存在。
          创建界面见第 3 步的截图。
        </p>

        <p className='font-medium'>8.2 接口信息</p>
        <ul className='list-disc space-y-1 pl-5'>
          <li>
            接口地址：<code>{DOCS_OPENAI_BASE_URL}</code>
          </li>
          <li>
            生成图片：<code>POST /v1/images/generations</code>
          </li>
          <li>
            图生图 / 改图：<code>POST /v1/images/edits</code>（multipart 表单）
          </li>
          <li>
            模型：<code>gpt-image-2.5-flare</code>（快）、{' '}
            <code>gpt-image-2.5-sunburst</code>（细节更好）
          </li>
          <li>
            尺寸：<code>1024x1024</code>、<code>2048x2048</code>、
            <code>4096x4096</code>，也可以传任意 <code>宽x高</code>（16 的倍数，
            最长边 4096）
          </li>
          <li>
            质量：<code>low</code> / <code>medium</code> / <code>high</code> /{' '}
            <code>xhigh</code> / <code>max</code> / <code>auto</code>
          </li>
          <li>
            张数：<code>n</code> 取 1–4
          </li>
        </ul>

        <p className='font-medium'>8.3 用 curl 调用</p>
        <DocsCode label='curl' code={IMAGE_CURL} />
        <p>
          返回的 <code>data</code> 数组里是 <code>b64_json</code> 或{' '}
          <code>url</code>，按返回内容保存成图片文件即可。
        </p>

        <p className='font-medium'>8.4 用 OpenAI SDK 调用</p>
        <DocsCode label='Python' code={IMAGE_PYTHON} />

        <p className='font-medium'>8.5 在客户端里使用</p>
        <p>
          支持自定义 OpenAI 接口的客户端（Cherry Studio、ChatBox、ZCode 等），把
          Base URL 填成 <code>{DOCS_OPENAI_BASE_URL}</code>，API Key
          填生图分组的 Key，模型选 <code>gpt-image-2.5-flare</code> 或{' '}
          <code>gpt-image-2.5-sunburst</code>，直接发描述即可。客户端需要支持图片
          输出，否则只会看到接口返回的 JSON。
        </p>

        <p className='font-medium'>8.6 配置生图 MCP（推荐）</p>
        <p>
          需要 Node.js 18+。MCP 默认已经指向本站，只要填令牌就能用；也支持填其他
          OpenAI 兼容中转地址。
        </p>
        <DocsCode
          label='MCP 配置（Claude Code / Codex / Cursor / ZCode）'
          code={DOCS_MCP_CONFIG}
        />
        <p>Claude Code 可以直接用命令添加：</p>
        <DocsCode label='Claude Code' code={CLAUDE_MCP_ADD} />
        <p>
          Codex 用户把下面这段加到 <code>~/.codex/config.toml</code>：
        </p>
        <DocsCode label='config.toml' code={CODEX_MCP_CONFIG} />
        <p>
          Cursor 用户把 JSON 写进 <code>~/.cursor/mcp.json</code>（或项目里的{' '}
          <code>.cursor/mcp.json</code>），保存后重启客户端。
        </p>
        <DocsNote>
          生图一次可能需要 60 秒以上，客户端超时太短会报错。Claude Code / Cursor
          用配置里的 <code>timeoutMs</code>，Codex 用{' '}
          <code>tool_timeout_sec</code>。
        </DocsNote>

        <p className='font-medium'>8.7 使用方式与图片保存位置</p>
        <p>
          配置好之后，直接对模型说「画一张……」或「把这张图改成……」即可。MCP
          会把图片存到本地，并返回完整路径。保存位置按以下顺序决定：
        </p>
        <ul className='list-disc space-y-1 pl-5'>
          <li>
            调用时传了 <code>outputDir</code> / <code>outputPath</code>
            ：存到指定位置
          </li>
          <li>
            配了环境变量 <code>IMAGE_OUTPUT_DIR</code>：存到该目录
          </li>
          <li>
            客户端在项目目录里启动 MCP：存到 <code>&lt;项目&gt;/ai-images</code>
          </li>
          <li>
            以上都没有：存到用户目录下的 <code>ai-images</code>
          </li>
        </ul>
        <p>
          想让图片直接进当前项目，可以在提示词里说明「存到项目的 images 目录」，
          模型会把项目路径传给 <code>outputDir</code>。
        </p>

        <p className='font-medium'>8.8 生图常见问题</p>
        <ul className='list-disc space-y-1 pl-5'>
          <li>
            <strong>模型不存在：</strong>
            确认 Key 的分组是「生图 【标准】」，并检查模型名是否为{' '}
            <code>gpt-image-2.5-flare</code> / <code>gpt-image-2.5-sunburst</code>。
          </li>
          <li>
            <strong>请求超时：</strong>
            把客户端或 MCP 的超时调到 180 秒以上。
          </li>
          <li>
            <strong>429 / 服务繁忙：</strong>
            上游限流，稍等几秒重试。
          </li>
          <li>
            <strong>找不到图片：</strong>
            看 MCP 返回的完整路径，默认在项目的 <code>ai-images</code> 或用户目录的{' '}
            <code>ai-images</code>。
          </li>
        </ul>
        <p>
          <DocsTextLink
            href='https://github.com/Vsonic12138/bigyellow12138-imagegen-mcp'
            external
          >
            查看生图 MCP 的完整说明
          </DocsTextLink>
        </p>
      </DocsSection>

      <DocsSection title='9. 价格说明'>
        <p>按令牌所在分组计费，充值时 1 元 = 1 美元额度：</p>
        <ul className='list-disc space-y-1 pl-5'>
          <li>Codex 【标准】：倍率 0.25</li>
          <li>Codex-Luna 【标准】：倍率 0.9</li>
          <li>DeepSeek 【标准】：倍率 0.4</li>
          <li>Grok 【特惠】：倍率 0.15</li>
          <li>Claude-Kiro 【特惠】：倍率 0.15</li>
          <li>生图 【标准】：0.06 元/张，按返回图片张数计费</li>
          <li>开源模型 【免费】：倍率 0</li>
        </ul>
        <p>实际费用 = 模型倍率 × 分组倍率 × 用量；以【定价】页面显示为准。</p>
        <DocsImage
          src='/docs-images/model-square.png'
          alt='模型广场'
          caption='模型广场：可以按分组查看当前可用的模型和价格。'
        />
      </DocsSection>

      <DocsSection title='10. 常见问题'>
        <ul className='list-disc space-y-2 pl-5'>
          <li>
            <strong>429 / 服务繁忙：</strong>
            高峰期上游会限流，稍等几秒重试，或换到同分组的其他模型。
          </li>
          <li>
            <strong>模型不存在：</strong>
            模型会不定期调整，请以【定价】页和令牌页实际可选项为准。
          </li>
          <li>
            <strong>请求超时：</strong>
            生图或长上下文请求可能需要 60 秒以上，把客户端超时调大即可。
          </li>
          <li>
            <strong>Key 无效 / 401：</strong>
            确认复制的是完整 Key，且没有多复制空格；禁用状态的 Key 需要先启用。
          </li>
        </ul>
      </DocsSection>
    </>
  )
}
