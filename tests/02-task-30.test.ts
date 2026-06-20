import { test, expect, describe } from 'bun:test'
import { writeFileSync } from 'fs'
import { loadConfig, CONFIG_FILE, DEFAULTS } from '../src/zszcode/config'

describe('task-30: loadConfig() 空对象返回默认值', () => {
  test('test_load_config_empty_json_model — model 为默认值', () => {
    writeFileSync(CONFIG_FILE, '{}', 'utf-8')
    expect(loadConfig().model).toBe(DEFAULTS.model)
  })

  test('test_load_config_empty_json_base_url — baseUrl 为默认值', () => {
    writeFileSync(CONFIG_FILE, '{}', 'utf-8')
    expect(loadConfig().baseUrl).toBe(DEFAULTS.baseUrl)
  })

  test('test_load_config_empty_json_api_key — apiKey 为默认值', () => {
    writeFileSync(CONFIG_FILE, '{}', 'utf-8')
    expect(loadConfig().apiKey).toBe(DEFAULTS.apiKey)
  })

  test('test_load_config_empty_json_web_port — webPort 为 3000', () => {
    writeFileSync(CONFIG_FILE, '{}', 'utf-8')
    expect(loadConfig().webPort).toBe(3000)
  })

  test('test_load_config_empty_json_equals_defaults — 与 DEFAULTS 相等', () => {
    writeFileSync(CONFIG_FILE, '{}', 'utf-8')
    expect(JSON.stringify(loadConfig())).toBe(JSON.stringify(DEFAULTS))
  })
})
