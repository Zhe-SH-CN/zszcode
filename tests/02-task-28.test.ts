import { test, expect, describe } from 'bun:test'
import { writeFileSync } from 'fs'
import { loadConfig, CONFIG_FILE, DEFAULTS } from '../src/zszcode/config'

describe('task-28: loadConfig() 返回值完整性', () => {
  test('test_load_config_has_model — model 不是 undefined', () => {
    writeFileSync(CONFIG_FILE, JSON.stringify({}), 'utf-8')
    expect(loadConfig().model).not.toBeUndefined()
  })

  test('test_load_config_has_base_url — baseUrl 不是 undefined', () => {
    writeFileSync(CONFIG_FILE, JSON.stringify({}), 'utf-8')
    expect(loadConfig().baseUrl).not.toBeUndefined()
  })

  test('test_load_config_has_api_key — apiKey 不是 undefined', () => {
    writeFileSync(CONFIG_FILE, JSON.stringify({}), 'utf-8')
    expect(loadConfig().apiKey).not.toBeUndefined()
  })

  test('test_load_config_has_web_port — webPort 不是 undefined', () => {
    writeFileSync(CONFIG_FILE, JSON.stringify({}), 'utf-8')
    expect(loadConfig().webPort).not.toBeUndefined()
  })

  test('test_load_config_key_count — 恰好 6 个键', () => {
    writeFileSync(CONFIG_FILE, JSON.stringify({}), 'utf-8')
    expect(Object.keys(loadConfig()).length).toBe(6)
  })
})
