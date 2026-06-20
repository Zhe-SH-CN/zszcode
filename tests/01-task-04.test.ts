import { test, expect } from 'bun:test'
import { MACRO } from '../src/shims/bun-bundle'

test('test_macro_version — MACRO.VERSION 为 "0.1.0"', () => {
  expect(MACRO.VERSION).toBe('0.1.0')
})

test('test_macro_package_url — MACRO.PACKAGE_URL 为正确 GitHub URL', () => {
  expect(MACRO.PACKAGE_URL).toBe('https://github.com/Zhe-SH-CN/zszcode')
})

test('test_macro_build_time_iso — MACRO.BUILD_TIME 匹配 ISO 8601', () => {
  expect(MACRO.BUILD_TIME).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
})

test('test_macro_issues_explainer — 包含 GitHub issues URL', () => {
  expect(MACRO.ISSUES_EXPLAINER).toContain('https://github.com/Zhe-SH-CN/zszcode/issues')
})

test('test_macro_all_fields_exist — MACRO 恰好有 7 个字段', () => {
  expect(Object.keys(MACRO)).toHaveLength(7)
})
