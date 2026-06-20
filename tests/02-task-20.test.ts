import { test, expect, describe, beforeEach } from 'bun:test'
import { existsSync, rmSync, writeFileSync } from 'fs'
import { loadConfig, CONFIG_DIR, CONFIG_FILE, DEFAULTS } from '../src/zszcode/config'

describe('task-20: loadConfig() 读取并合并', () => {
  beforeEach(() => {
    if (!existsSync(CONFIG_DIR)) rmSync(CONFIG_DIR, { recursive: true })
  })

  test('test_load_config_reads_existing — 读取自定义配置', () => {
    writeFileSync(CONFIG_FILE, JSON.stringify({ model: 'custom-model' }), 'utf-8')
    const config = loadConfig()
    expect(config.model).toBe('custom-model')
  })

  test('test_load_config_merges_with_defaults — 合并默认值', () => {
    writeFileSync(CONFIG_FILE, JSON.stringify({ model: 'custom' }), 'utf-8')
    const config = loadConfig()
    expect(config.baseUrl).toBe(DEFAULTS.baseUrl)
  })

  test('test_load_config_user_overrides_default — 用户值覆盖默认值', () => {
    writeFileSync(CONFIG_FILE, JSON.stringify({ model: 'override' }), 'utf-8')
    const config = loadConfig()
    expect(config.model).toBe('override')
    expect(config.model).not.toBe(DEFAULTS.model)
  })

  test('test_load_config_returns_object — 返回对象', () => {
    writeFileSync(CONFIG_FILE, JSON.stringify({}), 'utf-8')
    const config = loadConfig()
    expect(typeof config).toBe('object')
    expect(config).not.toBeNull()
  })

  test('test_load_config_no_file_modification — 不修改已有文件', () => {
    const content = JSON.stringify({ model: 'test' })
    writeFileSync(CONFIG_FILE, content, 'utf-8')
    loadConfig()
    const after = require('fs').readFileSync(CONFIG_FILE, 'utf-8')
    expect(after).toBe(content)
  })
})
