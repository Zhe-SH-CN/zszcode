import { test, expect, describe } from 'bun:test'
import { CONFIG_FILE, CONFIG_DIR } from '../src/zszcode/config'

describe('task-26: CONFIG_FILE 常量', () => {
  test('test_config_file_is_absolute — 绝对路径', () => {
    expect(CONFIG_FILE.startsWith('/')).toBe(true)
  })

  test('test_config_file_ends_with_filename — 以 settings.json 结尾', () => {
    expect(CONFIG_FILE).toMatch(/settings\.json$/)
  })

  test('test_config_file_contains_config_dir — 以 CONFIG_DIR 开头', () => {
    expect(CONFIG_FILE.startsWith(CONFIG_DIR)).toBe(true)
  })

  test('test_config_file_no_tilde — 不包含 ~', () => {
    expect(CONFIG_FILE).not.toContain('~')
  })

  test('test_config_file_type_string — 类型为 string', () => {
    expect(typeof CONFIG_FILE).toBe('string')
  })
})
