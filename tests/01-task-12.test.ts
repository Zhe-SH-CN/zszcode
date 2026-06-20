import { test, expect, describe } from 'bun:test'
import { MACRO } from '../src/shims/bun-bundle'

describe('task-12: MACRO.ISSUES_EXPLAINER 返回正确的 issue URL', () => {
  test('test_macro_issues_exact — 精确匹配预期字符串', () => {
    expect(MACRO.ISSUES_EXPLAINER).toBe('Report issues at https://github.com/Zhe-SH-CN/zszcode/issues')
  })

  test('test_macro_issues_contains_url — 包含 /issues 路径', () => {
    expect(MACRO.ISSUES_EXPLAINER).toContain('/issues')
  })

  test('test_macro_issues_contains_github — 包含 github.com', () => {
    expect(MACRO.ISSUES_EXPLAINER).toContain('github.com')
  })

  test('test_macro_issues_human_readable — 以 Report issues at 开头', () => {
    expect(MACRO.ISSUES_EXPLAINER).toMatch(/^Report issues at /)
  })

  test('test_macro_issues_type — 类型为 string', () => {
    expect(typeof MACRO.ISSUES_EXPLAINER).toBe('string')
  })
})
