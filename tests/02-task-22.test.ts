import { test, expect, describe } from 'bun:test'
import { writeFileSync } from 'fs'
import { loadConfig, CONFIG_FILE, DEFAULTS } from '../src/zszcode/config'

describe('task-22: loadConfig() 自定义值覆盖', () => {
  test('test_load_config_override_model — 覆盖 model', () => {
    writeFileSync(CONFIG_FILE, JSON.stringify({ model: 'claude-opus' }), 'utf-8')
    expect(loadConfig().model).toBe('claude-opus')
  })

  test('test_load_config_override_base_url — 覆盖 baseUrl', () => {
    writeFileSync(CONFIG_FILE, JSON.stringify({ baseUrl: 'http://custom' }), 'utf-8')
    expect(loadConfig().baseUrl).toBe('http://custom')
  })

  test('test_load_config_override_api_key — 覆盖 apiKey', () => {
    writeFileSync(CONFIG_FILE, JSON.stringify({ apiKey: 'sk-custom' }), 'utf-8')
    expect(loadConfig().apiKey).toBe('sk-custom')
  })

  test('test_load_config_override_web_port — 覆盖 webPort', () => {
    writeFileSync(CONFIG_FILE, JSON.stringify({ webPort: 8080 }), 'utf-8')
    expect(loadConfig().webPort).toBe(8080)
  })

  test('test_load_config_override_permission_mode — 覆盖 permissionMode', () => {
    writeFileSync(CONFIG_FILE, JSON.stringify({ permissionMode: 'auto' }), 'utf-8')
    expect(loadConfig().permissionMode).toBe('auto')
  })
})
