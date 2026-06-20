import { test, expect, describe } from 'bun:test'
import { existsSync, rmSync } from 'fs'
import { loadConfig, CONFIG_DIR } from '../src/zszcode/config'
import { isAbsolute } from 'path'
import { homedir } from 'os'

describe('task-23: loadConfig() 自动创建目录', () => {
  test('test_load_config_creates_dir_recursive — 删除后重建', () => {
    if (existsSync(CONFIG_DIR)) rmSync(CONFIG_DIR, { recursive: true })
    loadConfig()
    expect(existsSync(CONFIG_DIR)).toBe(true)
  })

  test('test_load_config_dir_exists_no_error — 目录已存在不报错', () => {
    expect(() => loadConfig()).not.toThrow()
  })

  test('test_load_config_dir_is_absolute — 绝对路径', () => {
    expect(isAbsolute(CONFIG_DIR)).toBe(true)
  })

  test('test_load_config_dir_under_home — 在 home 目录下', () => {
    expect(CONFIG_DIR.startsWith(homedir())).toBe(true)
  })

  test('test_load_config_dir_name_zszcode — 目录名为 .zszcode', () => {
    expect(CONFIG_DIR.endsWith('.zszcode')).toBe(true)
  })
})
