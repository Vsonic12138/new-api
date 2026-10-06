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
import { describe, expect, it } from 'vitest'

import { isPlainFooterCopyright } from '../footer-copyright'

describe('plain footer copyright', () => {
  it('treats a stored one-language copyright sentence as localizable', () => {
    expect(isPlainFooterCopyright('© 2026 大黄API保留所有权利。')).toBe(true)
    expect(isPlainFooterCopyright('<p>© 2026 大黄API保留所有权利。</p>')).toBe(
      true
    )
  })

  it('keeps footer HTML that contains links', () => {
    expect(
      isPlainFooterCopyright(
        '<a href="https://example.com">Docs</a> © 2026 Example'
      )
    ).toBe(false)
    expect(isPlainFooterCopyright('   ')).toBe(false)
  })
})
