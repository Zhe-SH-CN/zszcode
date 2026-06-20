import { test, expect, describe } from 'bun:test'
import { existsSync, writeFileSync } from 'fs'
import { loadConfig, CONFIG_DIR, CONFIG_FILE, DEFAULTS } from '../src/zszcode/config'

describe('task-21: loadConfig() 缺失字段填充', () => {
  test('test_load_config_fills_missing_model — 缺失 model 用默认值', () => {
    writeFileSync(CONFIG_FILE, JSON.stringify({ baseUrl: 'http://custom' }), 'utf-8')
    const config = loadConfig()
    expect(config.model).toBe(DEFAULTS.model)
  })

  test('test_load_config_fills_missing_web_port — 缺失 webPort 用默认值', () => {
    writeFileSync(CONFIG_FILE, JSON.stringify({ model: 'x' }), 'utf-8')
    const config = loadConfig()
    expect(config.webPort).toBe(3000)
  })

  test('test_load_config_fills_missing_permission_mode — 缺失 permissionMode 用默认值', () => {
    writeFileSync(CONFIG_FILE, JSON.stringify({ model: 'x' }), 'utf-8')
    const config = loadConfig()
    expect(config.permissionMode).toBe('confirm')
  })

  test('test_load_config_no_undefined_fields — 无 undefined 字段', () => {
    writeFileSync(CONFIG_FILE, JSON.stringify({ model: 'x' }), 'utf-8')
    const config = loadConfig()
    for (const key of Object.keys(config)) {
      expect((config as any)[key]).not.toBeUndefined()
    }
  })

  test('test_load_config_single_field_file — 单字段文件其余为默认值', () => {
    writeFileSync(CONFIG_FILE, JSON.stringify({ webPort: 8080 }), 'utf-8')
    const config = loadConfig()
    expect(config.webPort).toBe(8080)
    expect(config.model).toBe(DEFAULTS.model)
    expect(config.baseUrl).toBe(DEFAULTS.baseUrl)
    expect(config.apiKey).toBe(DEFAULTS.apiKey)
    expect(config.autoOpenBrowser).toBe(DEFAULTS.autoOpenBrowser)
    expect(config.permissionMode).toBe(DEFAULTS.permissionMode)
  })
})
