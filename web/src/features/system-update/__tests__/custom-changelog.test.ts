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
import { execFileSync } from 'node:child_process'
import { copyFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { expect, it } from 'vitest'

it('shows the custom upstream merge while excluding upstream and internal commits', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'custom-changelog-'))
  try {
    mkdirSync(path.join(root, 'web/scripts'), { recursive: true })
    mkdirSync(path.join(root, 'web/src/features/system-update'), {
      recursive: true,
    })
    copyFileSync(
      path.resolve('scripts/sync-git-changelog.mjs'),
      path.join(root, 'web/scripts/sync-git-changelog.mjs')
    )
    const gitOptions = {
      cwd: root,
      encoding: 'utf8' as const,
      stdio: 'pipe' as const,
      env: {
        ...process.env,
        GIT_AUTHOR_NAME: 'Custom Developer',
        GIT_AUTHOR_EMAIL: 'custom@example.invalid',
        GIT_COMMITTER_NAME: 'Custom Developer',
        GIT_COMMITTER_EMAIL: 'custom@example.invalid',
      },
    }
    execFileSync('git', ['init', '-b', 'main'], gitOptions)
    execFileSync(
      'git',
      ['commit', '--allow-empty', '-m', 'feat(home): 定制首页'],
      gitOptions
    )
    execFileSync('git', ['switch', '-c', 'official'], gitOptions)
    execFileSync(
      'git',
      ['commit', '--allow-empty', '-m', 'feat(relay): 官方新增功能'],
      gitOptions
    )
    execFileSync('git', ['tag', 'v1.0.0-rc.46'], gitOptions)
    execFileSync('git', ['switch', 'main'], gitOptions)
    const mergeSubject = 'chore(merge): 合并官方主线更新并保留二开缓存统计'
    execFileSync(
      'git',
      ['merge', '--no-ff', 'official', '-m', mergeSubject],
      gitOptions
    )
    const mergeHash = execFileSync(
      'git',
      ['rev-parse', '--short', 'HEAD'],
      gitOptions
    ).trim()
    execFileSync(
      'git',
      ['commit', '--allow-empty', '-m', 'chore(changelog): 同步更新日志'],
      gitOptions
    )
    execFileSync(
      process.execPath,
      ['web/scripts/sync-git-changelog.mjs'],
      gitOptions
    )
    const data = JSON.parse(
      execFileSync(
        'bun',
        [
          '-e',
          'import { CUSTOM_CHANGELOG_DATA } from "./web/src/features/system-update/custom-changelog.ts"; console.log(JSON.stringify(CUSTOM_CHANGELOG_DATA))',
        ],
        gitOptions
      )
    )

    expect(data[0].version).toBe('v1.0.0-rc.46+custom')
    expect(data[0].items[0]).toMatchObject({
      commitHash: mergeHash,
      titleZh: '[merge] 合并官方主线更新并保留二开缓存统计',
    })
    expect(data[0].items).toHaveLength(2)
    expect(data[0].items[1].titleZh).toBe('[home] 定制首页')
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
