import { test, expect, describe } from 'bun:test'
import { CONFIG_DIR } from '../src/zszcode/config'
import { homedir } from 'os'

describe('task-25: CONFIG_DIR 常量', () => {
  test('test_config_dir_is_absolute — 绝对路径', () => {
    expect(CONFIG_DIR.startsWith('/')).toBe(true)
  })

  test('test_config_dir_ends_with_zszcode — 以 .zszcode 结尾', () => {
    expect(CONFIG_DIR).toMatch(/\.zszcode$/)
  })

  test('test_config_dir_contains_home — 包含 home 目录', () => {
    expect(CONFIG_DIR).toContain(homedir())
  })

  test('test_config_dir_no_tilde — 不包含 ~', () => {
    expect(CONFIG_DIR).not.toContain('~')
  })

  test('test_config_dir_type_string — 类型为 string', () => {
    expect(typeof CONFIG_DIR).toBe('string')
  })
})
