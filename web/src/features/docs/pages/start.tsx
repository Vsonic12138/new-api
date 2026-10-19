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
  DocsNote,
  DocsSection,
  DocsStep,
  DocsSteps,
  DocsTextLink,
  DocsTitle,
} from '../docs-blocks'
import {
  CC_SWITCH_RELEASES_URL,
  CODEX_CONFIG,
  CODEX_DOWNLOAD_URL,
  CODEX_ENV_UNIX,
  CODEX_ENV_WINDOWS,
  DOCS_CARD_SHOP_URL,
  DOCS_MCP_CONFIG,
  DOCS_OPENAI_BASE_URL,
} from '../site'

export function DocsStartPage() {
  return (
    <>
      <DocsTitle
        title='新手指南'
        summary='按顺序完成：注册 → 充值 → 创建 Key → 配置 Codex。配置完成后，Codex、Claude Code 和生图 MCP 都可以直接使用。'
      />

      <DocsSection title='1. 注册与登录'>
        <p>
          支持邮箱、GitHub 授权登录与注册。注册后请使用同一种方式登录。
        </p>
        <p>
          如果收不到验证码或重置邮件，先检查垃圾箱 / 拦截记录，并把发件人加入白名单。
        </p>
        <p>
          <DocsTextLink href='/docs/register'>查看注册与登录说明</DocsTextLink>
        </p>
      </DocsSection>

      <DocsSection title='2. 充值'>
        <p>
          在发卡网购买卡密，然后到【钱包】页面输入兑换码，额度会立即到账。
        </p>
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
          <DocsStep n={1} title='打开侧边栏「令牌」，点击新建'>
            <p>名称随意填，额度可以留空表示不单独限制。</p>
          </DocsStep>
          <DocsStep n={2} title='选择分组'>
            <p>
              文字模型按用途选择：Codex、Codex-Luna、DeepSeek、Grok、Claude-Kiro；
              生图选择「生图 【标准】」。
            </p>
          </DocsStep>
          <DocsStep n={3} title='创建并复制 Key'>
            <p>
              复制以 <code>sk-</code> 开头的完整 Key，下一步会用到。
            </p>
          </DocsStep>
        </DocsSteps>
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
          安装完成后先不要急着登录。先用下一步的 CC Switch 导入本站 Key，再启动 Codex，
          可以避免账号被切换到官方登录。
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
              回到本站【令牌】页面，找到刚才创建的 Key，点击「导入 CCSwitch」；
              弹窗确认后，Key 会自动写入 CC Switch。
            </p>
          </DocsStep>
          <DocsStep n={3} title='在 CC Switch 中启用'>
            <p>
              打开 CC Switch，在上方选择 OpenAI 图标，切换到本站的 Key 并点击启用。
            </p>
          </DocsStep>
          <DocsStep n={4} title='彻底退出并重启 Codex'>
            <p>
              从系统托盘右键 Codex 图标选择退出，确认进程结束后再重新打开。
            </p>
          </DocsStep>
          <DocsStep n={5} title='首次登录使用 API Key'>
            <p>
              第一次使用时，在 Codex 登录界面选择「Sign in another way」，
              粘贴本站 Key 即可；之后 CC Switch 会自动接管。
            </p>
          </DocsStep>
        </DocsSteps>
        <p>
          新建一个会话，能正常回复就说明配置成功。
          如果重启后没有生效，先确认 CC Switch 已经启动（可以设为开机自启）。
        </p>
      </DocsSection>

      <DocsSection title='6. 手动配置 Codex（进阶）'>
        <p>
          不想安装 CC Switch 时，可以直接修改 Codex 的本地配置。配置文件位于 <code>~/.codex/config.toml</code>（Windows 为
          <code>%USERPROFILE%\.codex\config.toml</code>）。
        </p>
        <DocsCode label='config.toml' code={CODEX_CONFIG} />
        <p>再把 Key 写入环境变量：</p>
        <DocsCode label='macOS / Linux' code={CODEX_ENV_UNIX} />
        <DocsCode label='Windows PowerShell' code={CODEX_ENV_WINDOWS} />
        <p>
          保存后完全退出并重启 Codex。接口地址为 <code>{DOCS_OPENAI_BASE_URL}</code>，兼容 OpenAI Responses 协议。
        </p>
        <p>
          <DocsTextLink href='/docs/codex'>查看 Codex 配置的完整说明</DocsTextLink>
        </p>
      </DocsSection>

      <DocsSection title='7. Claude Code（可选）'>
        <p>
          如果你使用 Claude Code，把接口地址指向本站根地址，再用令牌作为 <code>ANTHROPIC_AUTH_TOKEN</code> 即可。
        </p>
        <p>
          <DocsTextLink href='/docs/claude-code'>
            查看 Claude Code 配置说明
          </DocsTextLink>
        </p>
      </DocsSection>

      <DocsSection title='8. 生图 MCP（可选）'>
        <p>
          本站提供生图 MCP，支持
          <code>gpt-image-2.5-flare</code>（快）和
          <code>gpt-image-2.5-sunburst</code>（精度高），支持 1K / 2K / 4K
          与图生图。需要 Node.js 18+，并在令牌页创建「生图 【标准】」分组的 Key。
        </p>
        <DocsCode label='MCP 配置（Claude Code / Codex / Cursor / ZCode）' code={DOCS_MCP_CONFIG} />
        <p>
          配置好之后，直接对模型说「画一张……」「把这张图改成……」即可。
          图片默认保存到当前项目下的 <code>ai-images</code>，没有项目时保存到用户目录下的 <code>ai-images</code>。
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
        <p>
          实际费用 = 模型倍率 × 分组倍率 × 用量；以【定价】页面显示为准。
        </p>
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
            <strong>找不到生成的图片：</strong>
            看 MCP 返回的完整路径；默认在项目的
            <code>ai-images</code> 或用户目录的
            <code>ai-images</code>。
          </li>
        </ul>
      </DocsSection>
    </>
  )
}
