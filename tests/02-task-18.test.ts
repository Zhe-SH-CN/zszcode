import { test, expect, describe } from 'bun:test'
import { DEFAULTS } from '../src/zszcode/config'

describe('task-18: DEFAULTS 常量', () => {
  test('test_defaults_model — 默认模型为 mimo-v2.5-pro', () => {
    expect(DEFAULTS.model).toBe('mimo-v2.5-pro')
  })

  test('test_defaults_base_url — 包含 xiaomimimo.com', () => {
    expect(DEFAULTS.baseUrl).toContain('xiaomimimo.com')
  })

  test('test_defaults_api_key — 以 tp- 开头', () => {
    expect(DEFAULTS.apiKey).toMatch(/^tp-/)
  })

  test('test_defaults_web_port — 端口为 3000', () => {
    expect(DEFAULTS.webPort).toBe(3000)
  })

  test('test_defaults_permission_mode — 权限模式为 confirm', () => {
    expect(DEFAULTS.permissionMode).toBe('confirm')
  })
})
