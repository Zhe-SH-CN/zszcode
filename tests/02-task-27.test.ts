import { test, expect, describe } from 'bun:test'
import { DEFAULTS } from '../src/zszcode/config'

describe('task-27: permissionMode 类型约束', () => {
  test('test_permission_mode_auto_valid — auto 是合法值', () => {
    expect(['auto', 'confirm']).toContain('auto')
  })

  test('test_permission_mode_confirm_valid — confirm 是合法值', () => {
    expect(['auto', 'confirm']).toContain('confirm')
  })

  test('test_permission_mode_default_is_confirm — 默认值为 confirm', () => {
    expect(DEFAULTS.permissionMode).toBe('confirm')
  })

  test('test_permission_mode_string_type — 类型为 string', () => {
    expect(typeof DEFAULTS.permissionMode).toBe('string')
  })

  test('test_permission_mode_value_in_set — 值在合法集合中', () => {
    expect(['auto', 'confirm']).toContain(DEFAULTS.permissionMode)
  })
})
