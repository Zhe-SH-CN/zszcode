import { test, expect, describe } from 'bun:test'
import { MACRO } from '../src/shims/bun-bundle'

describe('task-10: MACRO.PACKAGE_URL 返回正确的 GitHub URL', () => {
  test('test_macro_package_url_exact — 精确匹配预期 URL', () => {
    expect(MACRO.PACKAGE_URL).toBe('https://github.com/Zhe-SH-CN/zszcode')
  })

  test('test_macro_package_url_https — 以 https:// 开头', () => {
    expect(MACRO.PACKAGE_URL).toMatch(/^https:\/\//)
  })

  test('test_macro_package_url_github — 包含 github.com', () => {
    expect(MACRO.PACKAGE_URL).toContain('github.com')
  })

  test('test_macro_package_url_repo — 包含仓库路径', () => {
    expect(MACRO.PACKAGE_URL).toContain('Zhe-SH-CN/zszcode')
  })

  test('test_macro_package_url_no_trailing_slash — 不以 / 结尾', () => {
    expect(MACRO.PACKAGE_URL).not.toMatch(/\/$/)
  })
})
