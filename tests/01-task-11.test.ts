import { test, expect, describe } from 'bun:test'
import { MACRO } from '../src/shims/bun-bundle'

describe('task-11: MACRO.BUILD_TIME 返回 ISO 8601 格式', () => {
  test('test_macro_build_time_type — 类型为 string', () => {
    expect(typeof MACRO.BUILD_TIME).toBe('string')
  })

  test('test_macro_build_time_iso_format — 匹配 ISO 8601 正则', () => {
    expect(MACRO.BUILD_TIME).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)
  })

  test('test_macro_build_time_parseable — 可被 Date 解析', () => {
    const d = new Date(MACRO.BUILD_TIME)
    expect(d.toString()).not.toBe('Invalid Date')
  })

  test('test_macro_build_time_not_epoch — 不是 1970 年', () => {
    expect(MACRO.BUILD_TIME).not.toBe('1970-01-01T00:00:00.000Z')
  })

  test('test_macro_build_time_reasonable_range — 在 2024-2030 年之间', () => {
    const year = new Date(MACRO.BUILD_TIME).getFullYear()
    expect(year).toBeGreaterThanOrEqual(2024)
    expect(year).toBeLessThanOrEqual(2030)
  })
})
